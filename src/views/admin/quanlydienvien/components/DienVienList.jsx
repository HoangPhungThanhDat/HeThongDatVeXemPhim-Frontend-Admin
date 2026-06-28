

import { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, SimpleGrid,
  useColorModeValue, useDisclosure, Spinner, useBreakpointValue
} from "@chakra-ui/react";
import { 
  MdAdd, MdSearch, MdFilterList, MdPerson, 
  MdChevronLeft, MdChevronRight 
} from "react-icons/md";
import { FaUsers, FaMask, FaVideo, FaTheaterMasks } from "react-icons/fa";
import { StatCard } from "./shared/StatCard";
import { DienVienRow } from "./DienVienRow";
import { DienVienCard } from "./DienVienCard";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { FilterDrawer } from "./FilterDrawer";
import { fadeUp, fadeIn, shimmer } from "./shared/animations";
import { ROLE_OPTS, STATUS_OPTS } from "../constants";

// ✅ Component Pagination
function Pagination({ page, totalPages, total, onPageChange, label, pageSize = 10 }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
  const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
  const btnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
  const btnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
  const btnColor = useColorModeValue("#475569", "#cbd5e1");
  const activeBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.16)");
  const activeBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");

  const getPages = () => {
    const pages = [];
    const d = 2;
    const l = Math.max(1, page - d);
    const r = Math.min(totalPages, page + d);
    if (l > 1) {
      pages.push(1);
      if (l > 2) pages.push("...");
    }
    for (let i = l; i <= r; i++) pages.push(i);
    if (r < totalPages) {
      if (r < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Flex align="center" justify="space-between" 
      direction={{ base: "column", sm: "row" }} gap="12px"
      mt="16px" pt="16px" borderTop={`1px solid ${cardBorder}`}
    >
      <Text fontSize="12px" color={textMuted} fontWeight="500">
        Hiển thị <b>{start}–{end}</b> / {total} {label}
      </Text>
      
      <Flex align="center" gap="4px" flexWrap="wrap" justify="center">
        <Button size="sm" h="32px" w="32px" p="0" borderRadius="6px"
          bg={btnBg} color={btnColor} border={`1px solid ${btnBorder}`}
          _hover={{ bg: useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)") }}
          isDisabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon as={MdChevronLeft} boxSize="14px" />
        </Button>
        
        {getPages().map((p, i) => 
          p === "..." ? (
            <Text key={`e${i}`} fontSize="12px" color={textMuted} px="4px">···</Text>
          ) : (
            <Button key={p} size="sm" h="32px" w="32px" p="0" borderRadius="6px"
              bg={p === page ? activeBg : btnBg}
              color={p === page ? "#f97316" : btnColor}
              border={p === page ? `1px solid ${activeBorder}` : `1px solid ${btnBorder}`}
              fontWeight={p === page ? "700" : "500"}
              _hover={{ bg: p === page ? activeBg : useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)") }}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          )
        )}
        
        <Button size="sm" h="32px" w="32px" p="0" borderRadius="6px"
          bg={btnBg} color={btnColor} border={`1px solid ${btnBorder}`}
          _hover={{ bg: useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)") }}
          isDisabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <Icon as={MdChevronRight} boxSize="14px" />
        </Button>
      </Flex>
    </Flex>
  );
}

export function DienVienList({ 
  artists, loading, total, totalPages, page, goToPage,
  onAdd, onView, onEdit, onDelete, onToggle,
  filterRole, setFilterRole, filterStatus, setFilterStatus,
  search, setSearch, counts
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

  const handleDeleteRequest = (artist) => {
    setDeleteTarget(artist);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.CastId || deleteTarget.id);
    }
    onDeleteClose();
    setDeleteTarget(null);
  };

  const displayedArtists = artists;

  return (
    <>
      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        artist={deleteTarget}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        search={search}
        setSearch={setSearch}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="18px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            >
              <Icon as={FaUsers} boxSize="17px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={titleColor} letterSpacing="-0.5px">
              Diễn viên &amp; Đạo diễn
            </Text>
          </Flex>
          <Text color={subColor} fontSize="13px" pl="50px">
            Quản lý hồ sơ nghệ sĩ và liên kết với phim
          </Text>
        </Box>
        <Button 
          h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          boxShadow="0 4px 14px rgba(249,115,22,0.35)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdAdd} />}
          onClick={onAdd}
          w={{ base: "100%", md: "auto" }}
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
        >
          Thêm nghệ sĩ
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="18px">
        <StatCard label="Tổng nghệ sĩ" value={counts.total || total || 0} icon={FaUsers} accent="#f97316" delay={0} />
        <StatCard label="Diễn viên" value={counts.actors || 0} icon={FaMask} accent="#c2410c" delay={0.05} />
        <StatCard label="Đạo diễn" value={counts.directors || 0} icon={FaVideo} accent="#1d4ed8" delay={0.1} />
        <StatCard label="Đa năng" value={counts.both || 0} icon={FaTheaterMasks} accent="#7c3aed" delay={0.15} />
      </SimpleGrid>

      {/* Table */}
      <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
        boxShadow="0 2px 10px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Box h="3px" borderTopRadius="16px"
          bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 4s linear infinite` }}
        />

        <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} borderBottom={`1px solid ${sectionLine}`}>
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={titleColor}>
                Danh sách nghệ sĩ
              </Text>
              <Box px="8px" py="2px" borderRadius="6px"
                bg={isDark ? "rgba(249,115,22,0.12)" : "#fff7ed"}
                border={`1px solid ${isDark ? "rgba(249,115,22,0.3)" : "#fed7aa"}`}
              >
                <Text fontSize="11px" fontWeight="700" color="#f97316">{displayedArtists.length} người</Text>
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

          <Box>
            <Flex gap="10px" align="center" direction={{ base: "column", sm: "row" }}>
              <Box position="relative" flex="1" w={{ base: "100%", sm: "auto" }}>
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color={subColor} zIndex="1"
                />
                <Input
                  pl="30px" h={{ base: "40px", md: "34px" }} w="100%"
                  fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên, quốc tịch, vai trò..."
                  bg={filterBg} border={`1px solid ${filterBorder}`} borderRadius="9px" color={inputColor}
                  _placeholder={{ color: placeholderC }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: cardBg }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select
                h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color={inputColor}
                bg={filterBg} border={`1px solid ${filterBorder}`} borderRadius="9px"
                w={{ base: "100%", sm: "160px" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
                _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="Tất cả">Tất cả vai trò</option>
                {ROLE_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              <Select
                h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color={inputColor}
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
            </Flex>
          </Box>
        </Box>

        {/* Desktop table headers */}
        <Flex px="18px" py="10px" bg={filterBg} borderBottom={`1px solid ${cardBorder}`}
          display={{ base: "none", md: "flex" }}
        >
          <Box w="32px" flexShrink="0">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px">#</Text>
          </Box>
          <Box w="52px" mr="14px" flexShrink="0" />
          <Box flex="2">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Tên / Vai trò</Text>
          </Box>
          <Box flex="0.8">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Quốc tịch</Text>
          </Box>
          <Box flex="1">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Phim tham gia</Text>
          </Box>
          <Box flex="0.7">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Trạng thái</Text>
          </Box>
          <Box w="200px" flexShrink="0" textAlign="right">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">Hành động</Text>
          </Box>
        </Flex>

        {/* Rows */}
        <Box p={{ base: "10px", md: "12px" }}>
          {loading ? (
            <Flex direction="column" align="center" justify="center" py="48px">
              <Spinner size="lg" color="#f97316" thickness="3px" />
              <Text fontSize="13px" fontWeight="600" color={subColor} mt="12px">
                Đang tải danh sách nghệ sĩ...
              </Text>
            </Flex>
          ) : displayedArtists.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="48px">
              <Box w="60px" h="60px" borderRadius="18px"
                bg={isDark ? "rgba(249,115,22,0.1)" : "#fff7ed"}
                border={`1px solid ${isDark ? "rgba(249,115,22,0.25)" : "#fed7aa"}`}
                display="flex" alignItems="center" justifyContent="center" mb="12px"
              >
                <Icon as={FaUsers} boxSize="26px" color="#f97316" />
              </Box>
              <Text fontSize="13px" fontWeight="600" color={subColor}>Không tìm thấy nghệ sĩ nào</Text>
              <Text fontSize="12px" color={textMuted} mt="4px">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {displayedArtists.map((a, i) => {
                const globalIndex = (page - 1) * 10 + i;
                return isMobile ? (
                  <DienVienCard
                    key={a.CastId || a.id || i}
                    artist={a}
                    index={globalIndex}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={handleDeleteRequest}
                    onToggle={onToggle}
                  />
                ) : (
                  <DienVienRow
                    key={a.CastId || a.id || i}
                    artist={a}
                    index={globalIndex}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={handleDeleteRequest}
                    onToggle={onToggle}
                  />
                );
              })}
            </Flex>
          )}
        </Box>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={goToPage}
          label="nghệ sĩ"
          pageSize={10}
        />

        {/* Footer */}
        {displayedArtists.length > 0 && (
          <Box px={{ base: "16px", md: "20px" }} py="12px"
            borderTop={`1px solid ${sectionLine}`}
          >
            <Flex align="center" justify="space-between" flexWrap="wrap" gap="8px">
              <Text fontSize="11.5px" color={subColor} fontWeight="500">
                Hiển thị <strong style={{ color: titleColor }}>{displayedArtists.length}</strong> / {total || artists.length} nghệ sĩ
              </Text>
              <Flex gap="12px" flexWrap="wrap">
                {[
                  { color: "#f97316", label: `${counts.actors || 0} diễn viên` },
                  { color: "#3b82f6", label: `${counts.directors || 0} đạo diễn` },
                  { color: "#8b5cf6", label: `${counts.both || 0} đa năng` },
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