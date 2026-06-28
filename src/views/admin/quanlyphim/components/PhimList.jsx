

import { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, SimpleGrid,
  useColorModeValue, useDisclosure, Spinner, useBreakpointValue
} from "@chakra-ui/react";
import { 
  MdAdd, MdSearch, MdFilterList, MdPlayCircle, MdTimer, MdDone,
  MdChevronLeft, MdChevronRight 
} from "react-icons/md";
import { FaFilm } from "react-icons/fa";
import { StatCard } from "./shared/StatCard";
import { PhimRow } from "./PhimRow";
import { PhimCard } from "./PhimCard";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { FilterDrawer } from "./FilterDrawer";
import { fadeUp, fadeIn } from "./shared/animations";
import { STATUS_OPTS, GENRE_OPTS } from "../constants";

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

export function PhimList({ 
  movies, loading, genres, total, totalPages, page, goToPage,
  onAdd, onView, onEdit, onHide, onDelete,
  filterStatus, setFilterStatus, filterGenre, setFilterGenre,
  search, setSearch, counts
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

  const activeFilters = (filterStatus !== "Tất cả" ? 1 : 0) + (filterGenre !== "Tất cả" ? 1 : 0);

  const handleDeleteRequest = (movie) => {
    setDeleteTarget(movie);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.MovieId || deleteTarget.id);
    }
    onDeleteClose();
    setDeleteTarget(null);
  };

  // ✅ Không cần filter client-side nữa vì server đã filter
  // Dữ liệu movies đã được server lọc và phân trang
  const displayedMovies = movies;

  return (
    <>
      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        movie={deleteTarget}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterGenre={filterGenre}
        setFilterGenre={setFilterGenre}
      />

      {/* Header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="18px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="38px" h="38px" borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaFilm} boxSize="16px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={titleColor} letterSpacing="-0.5px">
              Quản lý phim
            </Text>
          </Flex>
          <Text color={subColor} fontSize="13px" pl="48px">
            Quản lý danh sách phim và trạng thái chiếu
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
          Thêm phim
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="18px">
        <StatCard label="Tổng phim" value={counts.total || total || 0} icon={FaFilm} accent="#f97316" delay={0} />
        <StatCard label="Đang chiếu" value={counts.playing} icon={MdPlayCircle} accent="#10b981" delay={0.05} />
        <StatCard label="Sắp chiếu" value={counts.upcoming} icon={MdTimer} accent="#f59e0b" delay={0.1} />
        <StatCard label="Ngừng chiếu" value={counts.ended} icon={MdDone} accent="#94a3b8" delay={0.15} />
      </SimpleGrid>

      {/* Table */}
      <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} borderBottom={`1px solid ${dividerColor}`}>
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={titleColor}>
                Danh sách phim
              </Text>
              <Box px="8px" py="2px" borderRadius="6px" bg={tagBg} border={`1px solid ${tagBorder}`}>
                <Text fontSize="11px" fontWeight="700" color="#f97316">{displayedMovies.length} phim</Text>
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

          {/* Search & Filters */}
          <Box>
            <Flex gap="10px" align="center" direction={{ base: "column", sm: "row" }}>
              <Box position="relative" flex="1" w={{ base: "100%", sm: "auto" }}>
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color={subColor} zIndex="1" />
                <Input
                  pl="30px" h={{ base: "40px", md: "34px" }} w="100%" fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên phim, đạo diễn..."
                  bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="9px" color={inputColor}
                  _placeholder={{ color: placeholderC }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: useColorModeValue("#ffffff", "#111C44") }}
                  _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color={inputColor}
                bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="9px"
                w={{ base: "100%", sm: "160px", md: "140px" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
                _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                {STATUS_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              <Select h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color={inputColor}
                bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="9px"
                w={{ base: "100%", sm: "160px", md: "140px" }}
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}
              >
                <option value="Tất cả">Tất cả thể loại</option>
                {GENRE_OPTS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Select>
            </Flex>
          </Box>
        </Box>

        {/* Desktop column headers */}
        <Flex px="18px" py="10px" bg={headerRowBg} borderBottom={`1px solid ${dividerColor}`}
          display={{ base: "none", md: "flex" }}
        >
          <Box w="32px" flexShrink="0">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px">#</Text>
          </Box>
          <Box w="44px" mr="14px" flexShrink="0" />
          <Box flex="2.2">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
              Tên phim / Thể loại
            </Text>
          </Box>
          <Box flex="0.8">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
              Thời lượng
            </Text>
          </Box>
          <Box flex="0.5">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
              Tuổi
            </Text>
          </Box>
          <Box flex="1">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
              Trạng thái
            </Text>
          </Box>
          <Box flex="0.7">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
              Đánh giá
            </Text>
          </Box>
          <Box w="200px" flexShrink="0" textAlign="right">
            <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="1px" textTransform="uppercase">
              Hành động
            </Text>
          </Box>
        </Flex>

        {/* Rows */}
        <Box p={{ base: "10px", md: "10px" }}>
          {loading ? (
            <Flex direction="column" align="center" justify="center" py="40px">
              <Spinner size="lg" color="#f97316" thickness="3px" />
              <Text fontSize="13px" fontWeight="600" color={subColor} mt="12px">
                Đang tải danh sách phim...
              </Text>
            </Flex>
          ) : displayedMovies.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px" color={subColor}>
              <Icon as={FaFilm} boxSize="32px" mb="8px" color={subColor} />
              <Text fontSize="13px" fontWeight="600" color={subColor}>Không tìm thấy phim nào</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {displayedMovies.map((m, i) => {
                // Tính index dựa trên trang hiện tại
                const globalIndex = (page - 1) * 10 + i;
                return isMobile ? (
                  <PhimCard
                    key={m.MovieId || m.id || i}
                    movie={m}
                    index={globalIndex}
                    onView={onView}
                    onEdit={onEdit}
                    onHide={onHide}
                    onDelete={handleDeleteRequest}
                  />
                ) : (
                  <PhimRow
                    key={m.MovieId || m.id || i}
                    movie={m}
                    index={globalIndex}
                    onView={onView}
                    onEdit={onEdit}
                    onHide={onHide}
                    onDelete={handleDeleteRequest}
                  />
                );
              })}
            </Flex>
          )}
        </Box>

        {/* ✅ Phân trang */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={goToPage}
          label="phim"
          pageSize={10}
        />
      </Box>
    </>
  );
}