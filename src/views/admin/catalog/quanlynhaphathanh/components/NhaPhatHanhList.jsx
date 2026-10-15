

import { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, SimpleGrid,
  useColorModeValue, useDisclosure, Spinner, useBreakpointValue
} from "@chakra-ui/react";
import { MdAdd, MdSearch, MdFilterList, MdCheckCircle, MdFlag } from "react-icons/md";
import { FaBuilding, FaGlobe } from "react-icons/fa";
import { StatCard } from "./shared/StatCard";
import { NhaPhatHanhRow } from "./NhaPhatHanhRow";
import { NhaPhatHanhCard } from "./NhaPhatHanhCard";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { FilterDrawer } from "./FilterDrawer";
import { fadeUp, fadeIn, shimmer } from "./shared/animations";
import { STATUS_OPTS, REGION_OPTS } from "../constants";

export function NhaPhatHanhList({ 
  distributors, loading, onAdd, onView, onEdit, onDelete,
  filterStatus, setFilterStatus, filterRegion, setFilterRegion,
  search, setSearch, counts, totalMovies
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDark = useColorModeValue(false, true);
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
  const titleColor = useColorModeValue("#0f172a", "#ffffff");
  const subColor = useColorModeValue("#94a3b8", "#8b9bc4");
  const textMuted = useColorModeValue("#c0c8d4", "#4a5568");
  const filterBg = useColorModeValue("#f8fafc", "#1b2559");
  const filterBorder = useColorModeValue("#e2e8f0", "#243170");
  const sectionLine = useColorModeValue("#f8fafc", "#1b2559");
  const inputBg = useColorModeValue("#fafafa", "#0B1437");
  const inputBorder = useColorModeValue("#e8edf3", "rgba(255,255,255,0.12)");
  const inputColor = useColorModeValue("#1a202c", "#ffffff");
  const placeholderC = useColorModeValue("#b0bac8", "#8b9bc4");
  const tagBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.12)");
  const tagBorder = useColorModeValue("#fed7aa", "rgba(249,115,22,0.3)");
  const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
  const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
  const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
  const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteRequest = (distributor) => {
    setDeleteTarget(distributor);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.DistributorId || deleteTarget.id);
    }
    onDeleteClose();
    setDeleteTarget(null);
  };

  const displayedDistributors = distributors;

  return (
    <>
      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        distributor={deleteTarget}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterRegion={filterRegion}
        setFilterRegion={setFilterRegion}
      />

      {/* Header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="12px" mb="4px">
            <Box w="42px" h="42px" borderRadius="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.4)"
            >
              <Icon as={FaBuilding} boxSize="17px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "27px" }} fontWeight="800" color={titleColor} letterSpacing="-0.6px">
              Nhà phát hành
            </Text>
          </Flex>
          <Text color={subColor} fontSize="13px" pl="54px">
            Quản lý danh sách nhà phát hành phim trong nước &amp; quốc tế
          </Text>
        </Box>
        <Button 
          h="42px" px="22px" borderRadius="11px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          boxShadow="0 4px 14px rgba(249,115,22,0.35)"
          _hover={{ boxShadow: "0 6px 22px rgba(249,115,22,0.48)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdAdd} />}
          onClick={onAdd}
          w={{ base: "100%", md: "auto" }}
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
        >
          Thêm nhà phát hành
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng đối tác" value={counts.total} icon={FaBuilding} accent="#f97316" sub={`${totalMovies} phim`} delay={0} />
        <StatCard label="Đang hoạt động" value={counts.active} icon={MdCheckCircle} accent="#059669" sub="Hợp tác tốt" delay={0.05} />
        <StatCard label="Quốc tế" value={counts.intl} icon={FaGlobe} accent="#2563eb" sub="Nhà phát hành ngoại" delay={0.1} />
        <StatCard label="Trong nước" value={counts.domestic} icon={MdFlag} accent="#7c3aed" sub="Đối tác nội địa" delay={0.15} />
      </SimpleGrid>

      {/* Table */}
      <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
        boxShadow="0 2px 10px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Box h="3px" borderTopRadius="18px"
          bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 4s linear infinite` }}
        />

        <Box p={{ base: "14px 16px", md: "18px 22px 14px" }} borderBottom={`1px solid ${sectionLine}`}>
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={titleColor}>
                Danh sách nhà phát hành
              </Text>
              <Box px="9px" py="3px" borderRadius="7px"
                bg={isDark ? "rgba(249,115,22,0.12)" : "#fff7ed"}
                border={`1px solid ${isDark ? "rgba(249,115,22,0.3)" : "#fed7aa"}`}
              >
                <Text fontSize="11px" fontWeight="700" color="#f97316">{displayedDistributors.length} đối tác</Text>
              </Box>
            </Flex>
            <Button display={{ base: "flex", md: "none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg={filterBg} color={subColor} border={`1px solid ${filterBorder}`}
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              _hover={{ bg: isDark ? "#243170" : "#f1f5f9" }}
              onClick={onFilterOpen}
            >
              Lọc
            </Button>
          </Flex>

          <Box>
            <Flex gap="10px" direction={{ base: "column", sm: "row" }}>
              <Box position="relative" flex="1">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color={subColor} zIndex="1" />
                <Input
                  pl="30px" h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên, quốc gia, liên hệ..."
                  bg={filterBg} border={`1px solid ${filterBorder}`} borderRadius="9px" color={inputColor}
                  _placeholder={{ color: placeholderC }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: cardBg }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="600" color={inputColor}
                bg={filterBg} border={`1px solid ${filterBorder}`} borderRadius="9px"
                w={{ base: "100%", sm: "160px" }}
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                {STATUS_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              <Select h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="600" color={inputColor}
                bg={filterBg} border={`1px solid ${filterBorder}`} borderRadius="9px"
                w={{ base: "100%", sm: "140px" }}
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="Tất cả">Tất cả loại</option>
                {REGION_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </Flex>
          </Box>
        </Box>

        {/* Desktop column headers */}
        <Flex px="18px" py="10px" bg={filterBg} borderBottom={`1px solid ${cardBorder}`}
          display={{ base: "none", md: "flex" }}
        >
          {[
            { w: "28px", label: "#" },
            { flex: "2.5", label: "Nhà phát hành" },
            { flex: "0.9", label: "Loại" },
            { flex: "1.1", label: "Trạng thái" },
            { flex: "1.2", label: "Liên hệ" },
            { flex: "0.8", label: "Phim / DT" },
          ].map(({ w, flex, label }) => (
            <Box key={label} w={w} flex={flex} flexShrink={w ? "0" : undefined}>
              <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
                {label}
              </Text>
            </Box>
          ))}
          <Box w="185px" flexShrink="0" textAlign="right">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
              Hành động
            </Text>
          </Box>
        </Flex>

        {/* Rows */}
        <Box p="10px">
          {loading ? (
            <Flex direction="column" align="center" justify="center" py="52px">
              <Spinner size="lg" color="#f97316" thickness="3px" />
              <Text fontSize="13px" fontWeight="600" color={subColor} mt="12px">
                Đang tải danh sách nhà phát hành...
              </Text>
            </Flex>
          ) : displayedDistributors.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="52px">
              <Box w="60px" h="60px" borderRadius="18px"
                bg={isDark ? "rgba(249,115,22,0.1)" : "#fff7ed"}
                border={`1px solid ${isDark ? "rgba(249,115,22,0.25)" : "#fed7aa"}`}
                display="flex" alignItems="center" justifyContent="center" mb="12px"
              >
                <Icon as={FaBuilding} boxSize="26px" color="#f97316" />
              </Box>
              <Text fontSize="13px" fontWeight="600" color={subColor}>Không tìm thấy nhà phát hành nào</Text>
              <Text fontSize="12px" color={textMuted} mt="4px">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {displayedDistributors.map((d, i) =>
                isMobile ? (
                  <NhaPhatHanhCard
                    key={d.DistributorId || d.id || i}
                    distributor={d}
                    index={i}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={handleDeleteRequest}
                  />
                ) : (
                  <NhaPhatHanhRow
                    key={d.DistributorId || d.id || i}
                    distributor={d}
                    index={i}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={handleDeleteRequest}
                  />
                )
              )}
            </Flex>
          )}
        </Box>

        {/* Footer */}
        {displayedDistributors.length > 0 && (
          <Box px={{ base: "16px", md: "22px" }} py="12px" borderTop={`1px solid ${sectionLine}`}>
            <Flex align="center" justify="space-between" flexWrap="wrap" gap="8px">
              <Text fontSize="11.5px" color={subColor} fontWeight="500">
                Hiển thị <strong style={{ color: titleColor }}>{displayedDistributors.length}</strong> / {distributors.length} nhà phát hành
              </Text>
              <Flex gap="12px" flexWrap="wrap">
                {[
                  { color: "#10b981", label: `${counts.active || 0} hoạt động` },
                  { color: "#2563eb", label: `${counts.intl || 0} quốc tế` },
                  { color: "#7c3aed", label: `${counts.domestic || 0} trong nước` },
                ].map(({ color, label }) => (
                  <Flex key={label} align="center" gap="5px">
                    <Box w="6px" h="6px" borderRadius="full" bg={color} />
                    <Text fontSize="10.5px" color={subColor} fontWeight="600">{label}</Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
}