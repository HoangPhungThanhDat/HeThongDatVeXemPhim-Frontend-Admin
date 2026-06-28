// views/admin/quanlybanner/components/BannerList.jsx

import { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, SimpleGrid,
  useColorModeValue, useDisclosure, Spinner
} from "@chakra-ui/react";
import { MdAdd, MdSearch, MdImage, MdToggleOn, MdVisibilityOff, MdSchedule } from "react-icons/md";
import { StatCard } from "./shared/StatCard";
import { BannerRow } from "./BannerRow";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { fadeUp, fadeIn } from "./shared/animations";
import { useDragSort } from "../hooks/useDragSort";

export function BannerList({ 
  banners, setBanners, onAdd, onView, onEdit, 
  onHide, onDelete, filterStatus, setFilterStatus, search, setSearch,
  counts, filtered, loading = false
}) {
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const titleColor = useColorModeValue("#0f172a", "#e2e8f0");
  const subColor = useColorModeValue("#94a3b8", "#4a6080");
  const headerBg = useColorModeValue("#fafbfc", "#091530");
  const headerBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const toolbarBorder = useColorModeValue("#f8fafc", "#132040");
  const hintColor = useColorModeValue("#cbd5e1", "#2a3a5c");
  const countBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)");
  const countBorder = useColorModeValue("#fed7aa", "rgba(249,115,22,0.3)");
  const searchBg = useColorModeValue("#f8fafc", "#0d1a30");
  const searchBorder = useColorModeValue("#e8edf3", "#1e3a5f");
  const searchColor = useColorModeValue("#374151", "#c8d8ea");
  const placeholderC = useColorModeValue("#b0bac8", "#3d5a80");
  const colHeadColor = useColorModeValue("#94a3b8", "#4a6080");

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragSort(banners, setBanners);

  const handleDeleteRequest = (banner) => { 
    setBannerToDelete(banner); 
    onDeleteOpen(); 
  };
  
  const handleDeleteConfirm = () => {
    if (!bannerToDelete) return;
    onDelete(bannerToDelete.BannerId || bannerToDelete.id);
    onDeleteClose(); 
    setBannerToDelete(null);
  };

  const handleMoveUp = (id) => {
    setBanners((prev) => {
      const sorted = [...prev].sort((a, b) => (a.order || a.Order || 0) - (b.order || b.Order || 0));
      const idx = sorted.findIndex((b) => (b.BannerId || b.id) === id);
      if (idx <= 0) return prev;
      const nb = [...sorted];
      // Swap order an toàn
      const tempOrder = nb[idx - 1].order || nb[idx - 1].Order || 0;
      const currentOrder = nb[idx].order || nb[idx].Order || 0;
      nb[idx - 1].order = currentOrder;
      nb[idx].order = tempOrder;
      return nb;
    });
  };

  const handleMoveDown = (id) => {
    setBanners((prev) => {
      const sorted = [...prev].sort((a, b) => (a.order || a.Order || 0) - (b.order || b.Order || 0));
      const idx = sorted.findIndex((b) => (b.BannerId || b.id) === id);
      if (idx >= sorted.length - 1) return prev;
      const nb = [...sorted];
      // Swap order an toàn
      const tempOrder = nb[idx + 1].order || nb[idx + 1].Order || 0;
      const currentOrder = nb[idx].order || nb[idx].Order || 0;
      nb[idx + 1].order = currentOrder;
      nb[idx].order = tempOrder;
      return nb;
    });
  };

  // Lấy id từ banner (hỗ trợ cả BannerId và id)
  const getBannerId = (banner) => banner.BannerId || banner.id;

  return (
    <>
      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm} 
        banner={bannerToDelete} 
      />

      {/* Header với nút Thêm banner */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w={{ base: "34px", md: "38px" }} h={{ base: "34px", md: "38px" }} borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={MdImage} boxSize={{ base: "14px", md: "16px" }} color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={titleColor} letterSpacing="-0.5px">
              Quản lý Banner
            </Text>
          </Flex>
          <Text color={subColor} fontSize="13px" pl="44px">
            Quản lý banner trang chủ – thứ tự, hẹn giờ, liên kết
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
          Thêm banner
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: "10px", md: "14px" }} mb="18px">
        <StatCard label="Tổng banner" value={counts.total} icon={MdImage} accent="#f97316" delay={0} />
        <StatCard label="Đang hiện" value={counts.showing} icon={MdToggleOn} accent="#10b981" delay={0.05} />
        <StatCard label="Đã ẩn" value={counts.hidden} icon={MdVisibilityOff} accent="#94a3b8" delay={0.1} />
        <StatCard label="Có hẹn giờ" value={counts.scheduled} icon={MdSchedule} accent="#f59e0b" delay={0.15} />
      </SimpleGrid>

      {/* Table card */}
      <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
        boxShadow="0 1px 4px rgba(0,0,0,0.08)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Toolbar */}
        <Box p={{ base: "14px 14px 12px", md: "18px 20px 14px" }} borderBottom={`1px solid ${toolbarBorder}`}>
          <Flex align="center" gap="8px" mb={{ base: "10px", md: "0" }} justify="space-between">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={titleColor}>
                Danh sách banner
              </Text>
              <Box px="8px" py="2px" borderRadius="6px" bg={countBg} border={`1px solid ${countBorder}`}>
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length}</Text>
              </Box>
            </Flex>
            <Box display={{ base: "none", md: "block" }}>
              <Select h="34px" fontSize="12.5px" fontWeight="600" color={searchColor}
                bg={searchBg} border={`1px solid ${searchBorder}`} borderRadius="9px" w="150px"
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
                _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Active">Đang hiện</option>
                <option value="Inactive">Đã ẩn</option>
                <option value="Scheduled">Hẹn giờ</option>
              </Select>
            </Box>
          </Flex>

          <Flex gap="8px" direction={{ base: "column", sm: "row" }} mt={{ base: "0", md: "10px" }}>
            <Box position="relative" flex="1">
              <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                transform="translateY(-50%)" boxSize="14px" color={placeholderC} zIndex="1" 
              />
              <Input
                pl="30px" h="36px" w="100%" fontSize="12.5px" fontWeight="500"
                placeholder="Tìm tiêu đề, liên kết..."
                bg={searchBg} border={`1px solid ${searchBorder}`} borderRadius="9px" 
                color={searchColor}
                _placeholder={{ color: placeholderC }}
                _focus={{ 
                  border: "1.5px solid #f97316", 
                  boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", 
                  bg: useColorModeValue("#fff", "#0d1a30") 
                }}
                _hover={{ border: "1px solid #f97316" }} 
                transition="all 0.2s"
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
            <Box display={{ base: "block", md: "none" }}>
              <Select h="36px" fontSize="12.5px" fontWeight="600" color={searchColor}
                bg={searchBg} border={`1px solid ${searchBorder}`} borderRadius="9px" w="100%"
                _focus={{ border: "1.5px solid #f97316" }} 
                _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Active">Đang hiện</option>
                <option value="Inactive">Đã ẩn</option>
                <option value="Scheduled">Hẹn giờ</option>
              </Select>
            </Box>
          </Flex>
        </Box>

        {/* Column headers – desktop */}
        <Box display={{ base: "none", lg: "block" }}>
          <Flex px="16px" py="10px" bg={headerBg} borderBottom={`1px solid ${headerBorder}`} align="center">
            <Box w="24px" flexShrink="0" />
            <Box w="36px" flexShrink="0" mr="4px">
              <Text fontSize="10px" fontWeight="800" color={hintColor} letterSpacing="1px">STT</Text>
            </Box>
            <Box w="80px" mr="14px" flexShrink="0" />
            {[
              { label: "Tiêu đề / Liên kết", flex: "2.5" },
              { label: "Hẹn giờ", flex: "1.5" },
              { label: "Lịch", flex: "0.7" },
              { label: "Trạng thái", flex: "0.9" },
            ].map(({ label, flex }) => (
              <Box key={label} flex={flex}>
                <Text fontSize="10px" fontWeight="800" color={colHeadColor} letterSpacing="1px" textTransform="uppercase">
                  {label}
                </Text>
              </Box>
            ))}
            <Box w="58px" mr="8px" flexShrink="0">
              <Text fontSize="10px" fontWeight="800" color={colHeadColor} letterSpacing="1px" textTransform="uppercase">
                Thứ tự
              </Text>
            </Box>
            <Box w="240px" flexShrink="0" textAlign="right">
              <Text fontSize="10px" fontWeight="800" color={colHeadColor} letterSpacing="1px" textTransform="uppercase">
                Hành động
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Rows */}
        <Box p={{ base: "10px", md: "10px" }}>
          {loading ? (
            <Flex direction="column" align="center" justify="center" py="40px">
              <Spinner size="lg" color="#f97316" thickness="3px" />
              <Text fontSize="13px" fontWeight="600" color={subColor} mt="12px">
                Đang tải danh sách banner...
              </Text>
            </Flex>
          ) : filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px" color={hintColor}>
              <Icon as={MdImage} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={subColor}>Không tìm thấy banner nào</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap={{ base: "10px", md: "6px" }}>
              {filtered.map((b, i) => {
                const bannerId = b.BannerId || b.id;
                return (
                  <BannerRow 
                    key={bannerId} 
                    banner={b} 
                    index={i}
                    isFirst={i === 0} 
                    isLast={i === filtered.length - 1}
                    onView={() => onView(b)}
                    onEdit={() => onEdit(b)}
                    onHide={() => onHide(bannerId)}
                    onDelete={() => handleDeleteRequest(b)}
                    onMoveUp={() => handleMoveUp(bannerId)} 
                    onMoveDown={() => handleMoveDown(bannerId)}
                    onDragStart={onDragStart} 
                    onDragOver={onDragOver}
                    onDrop={onDrop} 
                    onDragEnd={onDragEnd}
                  />
                );
              })}
            </Flex>
          )}
        </Box>

        {/* Hint */}
        <Box px="16px" py="12px" borderTop={`1px solid ${toolbarBorder}`}>
          <Flex align="center" gap="6px">
            <Icon as={MdImage} boxSize="13px" color={hintColor} />
            <Text fontSize="11px" color={hintColor} fontWeight="500">
              Kéo thả hoặc dùng nút ▲ ▼ để thay đổi thứ tự hiển thị banner trên trang chủ
            </Text>
          </Flex>
        </Box>
      </Box>
    </>
  );
}