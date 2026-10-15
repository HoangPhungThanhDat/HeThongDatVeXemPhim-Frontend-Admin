

import { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, SimpleGrid,
  useColorModeValue, useDisclosure, Spinner, useBreakpointValue
} from "@chakra-ui/react";
import { MdAdd, MdSearch, MdFilterList, MdPlayCircle, MdStar, MdLocalMovies } from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa";
import { StatCard } from "./shared/StatCard";
import { TheLoaiCard } from "./TheLoaiCard";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { FilterDrawer } from "./FilterDrawer";
import { fadeUp, fadeIn, slideDown, shimmer } from "./shared/animations";
import { STATUS_OPTS } from "../constants";

export function TheLoaiList({ 
  genres, loading, onAdd, onView, onEdit, onDelete, onToggle,  // ✅ Thêm onView
  filterStatus, setFilterStatus, search, setSearch, counts
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

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteRequest = (id) => {
    const genre = genres.find(g => (g.GenreId || g.id) === id);
    if (genre) setDeleteTarget(genre);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.GenreId || deleteTarget.id);
    }
    onDeleteClose();
    setDeleteTarget(null);
  };

  const filtered = genres.filter((g) => {
    const q = search.toLowerCase();
    const matchSearch = (g.Name || g.name || "").toLowerCase().includes(q) ||
      (g.Slug || g.slug || "").toLowerCase().includes(q) ||
      (g.Description || g.description || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || (g.Status || g.status) === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        genre={deleteTarget}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="14px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="12px" mb="5px">
            <Box w="42px" h="42px" borderRadius="13px"
              bg="linear-gradient(135deg, #f97316, #fbbf24)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 6px 16px rgba(249,115,22,0.4)"
            >
              <Icon as={FaLayerGroup} boxSize="17px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "22px", md: "27px" }} fontWeight="900" color={titleColor} letterSpacing="-0.6px">
                Quản lý thể loại
              </Text>
              <Text color={subColor} fontSize="12.5px">
                Phân loại và tổ chức danh mục phim trong hệ thống
              </Text>
            </Box>
          </Flex>
        </Box>
        <Button
          h="42px" px="22px" borderRadius="11px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
          color="white" boxShadow="0 4px 16px rgba(249,115,22,0.38)"
          _hover={{ boxShadow: "0 8px 26px rgba(249,115,22,0.48)", transform: "translateY(-2px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdAdd} boxSize="16px" />}
          onClick={onAdd}
          w={{ base: "100%", md: "auto" }}
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
        >
          Thêm thể loại
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="22px">
        <StatCard label="Tổng thể loại" value={counts.total} icon={FaLayerGroup} accent="#f97316" delay={0} sub="thể loại phim" />
        <StatCard label="Đang hiện" value={counts.active} icon={MdPlayCircle} accent="#10b981" delay={0.06} sub="đang hoạt động" />
        <StatCard label="Nổi bật" value={counts.featured} icon={MdStar} accent="#f59e0b" delay={0.12} sub="có badge HOT" />
        <StatCard label="Tổng số phim" value={counts.movies} icon={MdLocalMovies} accent="#8b5cf6" delay={0.18} sub="phim đã phân loại" />
      </SimpleGrid>

      {/* Main card */}
      <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
        boxShadow="0 2px 10px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
      >
        {/* Accent top bar */}
        <Box h="3px" borderTopRadius="18px"
          bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 4s linear infinite` }}
        />

        {/* Card header */}
        <Box p={{ base: "14px 16px 12px", md: "20px 22px 14px" }}
          borderBottom={`1px solid ${sectionLine}`}
        >
          <Flex align="center" justify="space-between" mb="14px">
            <Flex align="center" gap="10px">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={titleColor}>
                Danh sách thể loại
              </Text>
              <Box px="8px" py="2px" borderRadius="7px"
                bg={isDark ? "rgba(249,115,22,0.12)" : "#fff7ed"}
                border={`1px solid ${isDark ? "rgba(249,115,22,0.3)" : "#fed7aa"}`}
              >
                <Text fontSize="11px" fontWeight="800" color="#f97316">{filtered.length} thể loại</Text>
              </Box>
            </Flex>
            <Button
              display={{ base: "flex", md: "none" }}
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

          {/* Search + filter */}
          <Box>
            <Flex gap="10px" direction={{ base: "column", sm: "row" }}>
              <Box position="relative" flex="1">
                <Icon as={MdSearch} position="absolute" left="11px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color={subColor} zIndex="1"
                />
                <Input
                  pl="32px" h={{ base: "42px", md: "36px" }} fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên thể loại, slug, mô tả..."
                  bg={filterBg} border={`1px solid ${filterBorder}`} borderRadius="9px" color={inputColor}
                  _placeholder={{ color: placeholderC }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: cardBg }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Flex gap="6px" flexShrink="0" flexWrap="wrap">
                {[
                  { key: "all", label: "Tất cả", color: "#f97316" },
                  { key: "Active", label: "Đang hiện", color: "#10b981" },
                  { key: "Inactive", label: "Đang ẩn", color: "#94a3b8" },
                  { key: "Banned", label: "Cấm", color: "#ef4444" },
                ].map(({ key, label, color }) => (
                  <Button key={key}
                    h={{ base: "42px", md: "36px" }} px="14px" borderRadius="9px"
                    fontSize="12px" fontWeight="700"
                    bg={filterStatus === key ? `${color}18` : filterBg}
                    color={filterStatus === key ? color : subColor}
                    border={filterStatus === key ? `1.5px solid ${color}55` : `1px solid ${filterBorder}`}
                    _hover={{ bg: `${color}15`, color }}
                    transition="all 0.15s"
                    onClick={() => setFilterStatus(key)}
                  >
                    {label}
                  </Button>
                ))}
              </Flex>
            </Flex>
          </Box>
        </Box>

        {/* Grid */}
        <Box p={{ base: "12px", md: "16px" }}>
          {loading ? (
            <Flex direction="column" align="center" justify="center" py="52px">
              <Spinner size="lg" color="#f97316" thickness="3px" />
              <Text fontSize="13px" fontWeight="600" color={subColor} mt="12px">
                Đang tải danh sách thể loại...
              </Text>
            </Flex>
          ) : filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="52px">
              <Box w="60px" h="60px" borderRadius="18px"
                bg={isDark ? "rgba(249,115,22,0.1)" : "#fff7ed"}
                border={`1px solid ${isDark ? "rgba(249,115,22,0.25)" : "#fed7aa"}`}
                display="flex" alignItems="center" justifyContent="center" mb="12px"
              >
                <Icon as={FaLayerGroup} boxSize="26px" color="#f97316" />
              </Box>
              <Text fontSize="14px" fontWeight="700" color={subColor}>Không tìm thấy thể loại nào</Text>
              <Text fontSize="12px" color={textMuted} mt="4px">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="12px">
              {filtered.map((genre, i) => (
                <TheLoaiCard
                  key={genre.GenreId || genre.id || i}
                  genre={genre}
                  index={i}
                  onView={(g) => onView(g)}  // ✅ Thêm onView
                  onEdit={(g) => onEdit(g)}
                  onDelete={(id) => handleDeleteRequest(id)}
                  onToggle={onToggle}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Footer summary */}
        {filtered.length > 0 && (
          <Box px={{ base: "16px", md: "22px" }} py="14px"
            borderTop={`1px solid ${sectionLine}`}
          >
            <Flex align="center" justify="space-between" flexWrap="wrap" gap="8px">
              <Text fontSize="11.5px" color={subColor} fontWeight="500">
                Hiển thị <strong style={{ color: titleColor }}>{filtered.length}</strong> / {genres.length} thể loại
              </Text>
              <Flex gap="12px">
                <Flex align="center" gap="5px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#10b981" />
                  <Text fontSize="10.5px" color={subColor} fontWeight="600">{counts.active} hiện</Text>
                </Flex>
                <Flex align="center" gap="5px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#9ca3af" />
                  <Text fontSize="10.5px" color={subColor} fontWeight="600">{genres.length - counts.active} ẩn</Text>
                </Flex>
                <Flex align="center" gap="5px">
                  <Icon as={MdStar} boxSize="10px" color="#f59e0b" />
                  <Text fontSize="10.5px" color={subColor} fontWeight="600">{counts.featured} nổi bật</Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
}