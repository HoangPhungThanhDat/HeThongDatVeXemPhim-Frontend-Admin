// views/admin/quanlykhuyenmai/components/KhuyenMaiList.jsx

import { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, SimpleGrid,
  useColorModeValue, useDisclosure, Spinner, useBreakpointValue
} from "@chakra-ui/react";
// Thay đổi import:
import { MdAdd, MdSearch, MdFilterList, MdLocalOffer, MdSchedule, MdBarChart } from "react-icons/md";
import { FaTag } from "react-icons/fa";  // <-- Thêm dòng này
import { StatCard } from "./shared/StatCard";
import { KhuyenMaiRow } from "./KhuyenMaiRow";
import { KhuyenMaiCard } from "./KhuyenMaiCard";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { FilterDrawer } from "./FilterDrawer";
import { fadeUp, fadeIn } from "./shared/animations";
import { DISCOUNT_TYPE_OPTS } from "../constants";

export function KhuyenMaiList({ 
  promos, loading, onAdd, onView, onEdit, onToggle, onDelete,
  filterStatus, setFilterStatus, filterType, setFilterType,
  search, setSearch, counts, filtered, total
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const titleColor = useColorModeValue("#0f172a", "#e2e8f0");
  const subColor = useColorModeValue("#94a3b8", "#6b7fa3");
  const toolbarBg = useColorModeValue("#fafbfc", "#111c44");
  const searchBg = useColorModeValue("#f8fafc", "#0f172a");
  const searchBorder = useColorModeValue("#e8edf3", "#2d3a6b");
  const searchColor = useColorModeValue("#374151", "#e2e8f0");
  const placeholderC = useColorModeValue("#b0bac8", "#4a5568");
  const countBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)");
  const countBorder = useColorModeValue("#fed7aa", "rgba(249,115,22,0.3)");

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeFilters = (filterStatus !== "Tất cả" ? 1 : 0) + (filterType !== "Tất cả" ? 1 : 0);

  const handleDeleteRequest = (promo) => {
    setDeleteTarget(promo);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.PromotionId || deleteTarget.id);
    }
    onDeleteClose();
    setDeleteTarget(null);
  };

  return (
    <>
      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        promo={deleteTarget}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* Header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="22px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="38px" h="38px" borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaTag} boxSize="16px" color="white" />
            </Box>
            <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color={titleColor} letterSpacing="-0.5px">
              Khuyến mãi & Sự kiện
            </Text>
          </Flex>
          <Text color={subColor} fontSize="13px" pl={{ base: "0", md: "48px" }}>
            Quản lý chương trình giảm giá, ưu đãi và sự kiện chiếu phim
          </Text>
        </Box>
        <Button 
          h="40px" 
          px="20px" 
          borderRadius="10px" 
          fontWeight="700" 
          fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)" 
          color="white"
          boxShadow="0 4px 14px rgba(249,115,22,0.35)"
          _hover={{ 
            boxShadow: "0 6px 20px rgba(249,115,22,0.45)", 
            transform: "translateY(-1px)" 
          }}
          _active={{ transform: "translateY(0)" }} 
          transition="all 0.2s"
          leftIcon={<Icon as={MdAdd} />}
          onClick={onAdd} 
          w={{ base: "100%", md: "auto" }}
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
        >
          Tạo khuyến mãi
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng KM" value={counts.total} icon={FaTag} accent="#f97316" delay={0} />
        <StatCard label="Đang diễn ra" value={counts.active} icon={MdLocalOffer} accent="#10b981" delay={0.05} />
        <StatCard label="Sắp diễn ra" value={counts.upcoming} icon={MdSchedule} accent="#f59e0b" delay={0.1} />
        <StatCard label="Lượt đã dùng" value={counts.totalUsage.toLocaleString()} icon={MdBarChart} accent="#7c3aed" delay={0.15} />
      </SimpleGrid>

      {/* Table */}
      <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
        boxShadow="0 1px 4px rgba(0,0,0,0.08)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Toolbar */}
        <Flex align="center" justify="space-between"
          p="16px 16px 12px"
          borderBottom={useColorModeValue("1px solid #f8fafc", "1px solid #2d3a6b")}
          gap="10px" flexWrap="wrap"
          bg={toolbarBg} borderTopRadius="16px"
        >
          <Flex align="center" gap="8px">
            <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={titleColor}>
              Danh sách khuyến mãi
            </Text>
            <Box px="8px" py="2px" borderRadius="6px"
              bg={countBg}
              border={`1px solid ${countBorder}`}
            >
              <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length}</Text>
            </Box>
          </Flex>

          {/* Desktop filters */}
          <Flex gap="8px" align="center" display={{ base: "none", md: "flex" }} flexWrap="wrap">
            <Box position="relative">
              <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
              <Input
                pl="30px" h="34px" w="200px" fontSize="12.5px" fontWeight="500"
                placeholder="Tìm tên chương trình..."
                bg={searchBg}
                border={`1px solid ${searchBorder}`}
                borderRadius="9px" color={searchColor}
                _placeholder={{ color: placeholderC }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: useColorModeValue("#fff", "#1b2559") }}
                _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </Box>
            <Select h="34px" fontSize="12.5px" fontWeight="600"
              color={searchColor}
              bg={searchBg}
              border={`1px solid ${searchBorder}`}
              borderRadius="9px" w="150px"
              _focus={{ border: "1.5px solid #f97316" }} 
              _hover={{ border: "1px solid #f97316" }}
              transition="all 0.2s"
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Active">Đang diễn ra</option>
              <option value="Scheduled">Sắp diễn ra</option>
              <option value="Paused">Tạm dừng</option>
              <option value="Inactive">Đã kết thúc</option>
            </Select>
            <Select h="34px" fontSize="12.5px" fontWeight="600"
              color={searchColor}
              bg={searchBg}
              border={`1px solid ${searchBorder}`}
              borderRadius="9px" w="170px"
              _focus={{ border: "1.5px solid #f97316" }} 
              _hover={{ border: "1px solid #f97316" }}
              transition="all 0.2s"
              value={filterType} onChange={e => setFilterType(e.target.value)}
            >
              <option value="Tất cả">Tất cả loại</option>
              {DISCOUNT_TYPE_OPTS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </Flex>

          {/* Mobile search + filter */}
          <Flex gap="8px" display={{ base: "flex", md: "none" }} flex="1" minW="0">
            <Box position="relative" flex="1">
              <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
              <Input
                pl="30px" h="36px" fontSize="13px" fontWeight="500"
                placeholder="Tìm kiếm..."
                bg={searchBg}
                border={`1px solid ${searchBorder}`}
                borderRadius="9px" color={searchColor}
                _placeholder={{ color: placeholderC }}
                _focus={{ border: "1.5px solid #f97316", bg: useColorModeValue("#fff", "#1b2559") }}
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </Box>
            <Button h="36px" px="12px" borderRadius="9px"
              bg={activeFilters > 0 ? useColorModeValue("#fff7ed", "#0f172a") : useColorModeValue("#f8fafc", "#0f172a")}
              border={activeFilters > 0 ? "1.5px solid #fed7aa" : `1px solid ${searchBorder}`}
              color={activeFilters > 0 ? "#f97316" : useColorModeValue("#64748b", "#94a3b8")}
              fontWeight="700" fontSize="12px"
              leftIcon={<Icon as={MdFilterList} boxSize="15px" />}
              onClick={onFilterOpen} position="relative" flexShrink="0"
            >
              Lọc
              {activeFilters > 0 && (
                <Box position="absolute" top="-5px" right="-5px"
                  w="16px" h="16px" borderRadius="full" bg="#f97316"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Text fontSize="9px" fontWeight="800" color="white">{activeFilters}</Text>
                </Box>
              )}
            </Button>
          </Flex>
        </Flex>

        {/* Desktop column headers */}
        <Box display={{ base: "none", md: "block" }}>
          <Flex px="18px" py="10px"
            bg={useColorModeValue("#fafbfc", "#111c44")}
            borderBottom={useColorModeValue("1px solid #f1f5f9", "1px solid #2d3a6b")}
            align="center"
          >
            <Box w="32px" flexShrink="0">
              <Text fontSize="10px" fontWeight="800" color={useColorModeValue("#cbd5e1", "#4a5568")} letterSpacing="1px">#</Text>
            </Box>
            <Box w="36px" mr="14px" flexShrink="0" />
            {["Tên KM / Loại", "Áp dụng", "Thời gian", "Sử dụng", "Trạng thái"].map((h, idx) => (
              <Box key={h} flex={[2.2, 1.2, 1.4, 1, 1][idx]}>
                <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
                  {h}
                </Text>
              </Box>
            ))}
            <Box w="220px" flexShrink="0" textAlign="right">
              <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
                Hành động
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box p="10px">
          {loading ? (
            <Flex direction="column" align="center" justify="center" py="40px">
              <Spinner size="lg" color="#f97316" thickness="3px" />
              <Text fontSize="13px" fontWeight="600" color={subColor} mt="12px">
                Đang tải danh sách khuyến mãi...
              </Text>
            </Flex>
          ) : filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px">
              <Icon as={FaTag} boxSize="32px" color={useColorModeValue("#e2e8f0", "#2d3a6b")} mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={subColor}>Không tìm thấy chương trình nào</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="6px">
              {filtered.map((p, i) =>
                isMobile ? (
                  <KhuyenMaiCard
                    key={p.PromotionId || p.id || i}
                    promo={p}
                    index={i}
                    onView={onView}
                    onEdit={onEdit}
                    onToggle={onToggle}
                    onDelete={handleDeleteRequest}
                  />
                ) : (
                  <KhuyenMaiRow
                    key={p.PromotionId || p.id || i}
                    promo={p}
                    index={i}
                    onView={onView}
                    onEdit={onEdit}
                    onToggle={onToggle}
                    onDelete={handleDeleteRequest}
                  />
                )
              )}
            </Flex>
          )}
        </Box>

        {/* Footer */}
        <Box px="16px" py="12px" borderTop={useColorModeValue("1px solid #f8fafc", "1px solid #2d3a6b")}>
          <Text fontSize="11px" color={subColor} fontWeight="500">
            Hiển thị {filtered.length} / {total || promos.length} chương trình
          </Text>
        </Box>
      </Box>
    </>
  );
}