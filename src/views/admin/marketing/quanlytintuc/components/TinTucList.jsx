

import { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, SimpleGrid,
  useColorModeValue, useDisclosure, Spinner, useBreakpointValue
} from "@chakra-ui/react";
import { MdAdd, MdSearch, MdFilterList, MdArticle, MdPublish, MdDrafts, MdSchedule } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa";
import { StatCard } from "./shared/StatCard";
import { TinTucRow } from "./TinTucRow";
import { TinTucCard } from "./TinTucCard";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { FilterDrawer } from "./FilterDrawer";
import { fadeUp, fadeIn } from "./shared/animations";
import { CATEGORY_OPTS, STATUS_OPTS } from "../constants";

export function TinTucList({ 
  articles, loading, onAdd, onView, onEdit, onToggleStatus, onDelete,
  filterStatus, setFilterStatus, filterCategory, setFilterCategory,
  search, setSearch, counts, filtered, totalViews
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
  const titleColor = useColorModeValue("#0f172a", "#ffffff");
  const subColor = useColorModeValue("#94a3b8", "#8b9bc4");
  const headerRowBg = useColorModeValue("#fafbfc", "#0B1437");
  const dividerColor = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
  const inputBg = useColorModeValue("#fafafa", "#0B1437");
  const inputBorder = useColorModeValue("#e8edf3", "rgba(255,255,255,0.12)");
  const inputColor = useColorModeValue("#1a202c", "#ffffff");
  const placeholderC = useColorModeValue("#b0bac8", "#8b9bc4");
  const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
  const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
  const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
  const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
  const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
  const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeFilters = (filterStatus !== "Tất cả" ? 1 : 0) + (filterCategory !== "Tất cả" ? 1 : 0);

  const handleDeleteRequest = (article) => {
    setDeleteTarget(article);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.NewsId || deleteTarget.id);
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
        article={deleteTarget}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />

      {/* Header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="12px" mb="5px">
            <Box w="42px" h="42px" borderRadius="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            >
              <Icon as={FaNewspaper} boxSize="17px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800"
                color={titleColor} letterSpacing="-0.5px" lineHeight="1"
              >
                Tin tức điện ảnh
              </Text>
              <Text color={subColor} fontSize="13px" mt="2px">
                Quản lý bài viết, review phim & sự kiện
              </Text>
            </Box>
          </Flex>
        </Box>
        <Button
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
          h="42px" px="22px" borderRadius="11px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          boxShadow="0 4px 16px rgba(249,115,22,0.35)"
          _hover={{ boxShadow: "0 6px 22px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdAdd} boxSize="16px" />}
          onClick={onAdd}
          w={{ base: "100%", md: "auto" }}
        >
          Viết bài mới
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng bài viết" value={counts.total} icon={MdArticle} accent="#f97316" delay={0} />
        <StatCard label="Đã đăng" value={counts.published} icon={MdPublish} accent="#10b981" delay={0.05} 
          sub={`${totalViews.toLocaleString()} lượt xem`} />
        <StatCard label="Bản nháp" value={counts.draft} icon={MdDrafts} accent="#64748b" delay={0.1} />
        <StatCard label="Hẹn giờ đăng" value={counts.scheduled} icon={MdSchedule} accent="#8b5cf6" delay={0.15} />
      </SimpleGrid>

      {/* Table */}
      <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
        boxShadow="0 1px 6px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.12s both` }}
      >
        {/* Toolbar */}
        <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} borderBottom={`1px solid ${dividerColor}`}>
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={titleColor}>
                Danh sách bài viết
              </Text>
              <Box px="8px" py="2px" borderRadius="6px" bg={tagBg} border={`1px solid ${tagBorder}`}>
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} bài</Text>
              </Box>
            </Flex>
            <Button
              display={{ base: "flex", md: "none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg={secondaryBtnBg} color={secondaryBtnColor} border={`1px solid ${secondaryBtnBorder}`}
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              _hover={{ bg: secondaryBtnHoverBg }}
              onClick={onFilterOpen}
            >
              Lọc
            </Button>
          </Flex>

          {/* Filters */}
          <Box>
            <Flex gap="10px" align="center" direction={{ base: "column", sm: "row" }}>
              <Box position="relative" flex="1" w={{ base: "100%", sm: "auto" }}>
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color={subColor} zIndex="1" />
                <Input
                  pl="30px" h={{ base: "40px", md: "36px" }} w="100%" fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tiêu đề, tác giả, phim liên quan..."
                  bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="9px" color={inputColor}
                  _placeholder={{ color: placeholderC }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: useColorModeValue("#ffffff", "#111C44") }}
                  _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="600" color={inputColor}
                bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="9px"
                w={{ base: "100%", sm: "160px", md: "150px" }}
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
                bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="9px"
                w={{ base: "100%", sm: "160px", md: "150px" }}
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="Tất cả">Tất cả danh mục</option>
                {CATEGORY_OPTS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Select>
            </Flex>
          </Box>
        </Box>

        {/* Desktop column headers */}
        <Flex px="18px" py="10px" bg={headerRowBg} borderBottom={`1px solid ${dividerColor}`}
          display={{ base: "none", md: "flex" }} align="center"
        >
          <Box w="30px" flexShrink="0" />
          <Box w="80px" mr="14px" flexShrink="0" />
          <Box flex="2.5">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
              Tiêu đề / Mô tả
            </Text>
          </Box>
          <Box flex="0.9">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Danh mục</Text>
          </Box>
          <Box flex="0.9">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Trạng thái</Text>
          </Box>
          <Box flex="1">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Tác giả / Ngày</Text>
          </Box>
          <Box flex="0.7">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Thống kê</Text>
          </Box>
          <Box w="220px" flexShrink="0" textAlign="right">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Hành động</Text>
          </Box>
        </Flex>

        {/* Rows */}
        <Box p="10px">
          {loading ? (
            <Flex direction="column" align="center" justify="center" py="48px">
              <Spinner size="lg" color="#f97316" thickness="3px" />
              <Text fontSize="13px" fontWeight="600" color={subColor} mt="12px">
                Đang tải danh sách tin tức...
              </Text>
            </Flex>
          ) : filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="48px" color={subColor}>
              <Icon as={FaNewspaper} boxSize="36px" mb="10px" color={subColor} />
              <Text fontSize="13px" fontWeight="600" color={subColor}>Không tìm thấy bài viết nào</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {filtered.map((a, i) =>
                isMobile ? (
                  <TinTucCard
                    key={a.NewsId || a.id || i}
                    article={a}
                    index={i}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={handleDeleteRequest}
                  />
                ) : (
                  <TinTucRow
                    key={a.NewsId || a.id || i}
                    article={a}
                    index={i}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={handleDeleteRequest}
                  />
                )
              )}
            </Flex>
          )}
        </Box>
      </Box>
    </>
  );
}