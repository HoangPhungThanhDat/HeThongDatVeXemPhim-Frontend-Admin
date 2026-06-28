// src/views/admin/quanlycombo/index.jsx

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, SimpleGrid, Grid,
  Input, Select, useColorMode, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdAdd, MdSearch, MdFilterList, MdDarkMode, MdLightMode,
  MdClose, MdEdit,
} from "react-icons/md";
import { FaCoffee, FaBoxOpen } from "react-icons/fa";

import { useCombo } from "./hooks/useFoodDrink";
import { CATEGORIES, DARK } from "./constants";
import { fadeUp, fadeIn } from "./components/shared/animations";
import { StatCard } from "./components/shared/StatCard";
import { DeleteModal } from "./components/DeleteModal";
import { ComboCard } from "./components/FoodItemCard";
import { ComboRow } from "./components/FoodItemRow";
import { ComboForm } from "./components/FoodItemForm";
import Loader from "../../../layouts/Loader"; // ✅ Import Loader từ layouts

export default function QuanLyCombo() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const {
    combos,
    loading,
    search,
    setSearch,
    filterCat,
    setFilterCat,
    filterStatus,
    setFilterStatus,
    filtered,
    stats,
    handleToggle,
    handleDelete,
    handleSave,
  } = useCombo();

  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [displayMode, setDisplayMode] = useState("grid");
  const [showFilter, setShowFilter] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [detailCombo, setDetailCombo] = useState(null);

  const bg = useColorModeValue("#f5f5f2", DARK.bg);
  const ink = useColorModeValue("#0f172a", DARK.ink);
  const ink3 = useColorModeValue("#64748b", DARK.ink3);
  const ink4 = useColorModeValue("#94a3b8", DARK.ink4);
  const ink5 = useColorModeValue("#e2e8f0", DARK.ink5);
  const ink6 = useColorModeValue("#f1f5f9", DARK.ink6);

  const handleView = (combo) => {
    setDetailCombo(combo);
    onDetailOpen();
  };

  // ✅ Hiển thị Loader từ layouts/Loader khi đang loading
  if (loading) {
    return <Loader />;
  }

  // ── FORM VIEW ──
  if (view === "add" || view === "edit") {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px={{ base: "12px", md: "0" }}>
        <ComboForm
          combo={view === "edit" ? combos.find((c) => c.id === selected?.id) : null}
          isAdd={view === "add"}
          onCancel={() => setView("list")}
          onSave={(form) => {
            handleSave(form, view, selected);
            setView("list");
            setSelected(null);
          }}
          isDark={isDark}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px={{ base: "12px", md: "0" }}>
      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          handleDelete(deleteTarget?.id);
          setIsDeleteOpen(false);
          setDeleteTarget(null);
        }}
        comboName={deleteTarget?.name || ""}
        isDark={isDark}
      />

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
        <ModalContent
          borderRadius="20px"
          border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
          bg={isDark ? DARK.bgCard : "#ffffff"}
          boxShadow="0 32px 80px rgba(0,0,0,.25)"
          sx={{ animation: `${fadeIn} 0.3s ease both` }}
          maxW="550px"
        >
          <ModalHeader>
            <Flex align="center" gap="10px">
              <Box
                w="40px"
                h="40px"
                borderRadius="12px"
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaCoffee} boxSize="18px" color="white" />
              </Box>
              <Box>
                <Text fontSize="18px" fontWeight="800" color={isDark ? DARK.ink : "#0f172a"}>
                  Chi tiết combo
                </Text>
                <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"}>
                  {detailCombo?.name}
                </Text>
              </Box>
            </Flex>
            <ModalCloseButton color={isDark ? DARK.ink4 : "#94a3b8"} />
          </ModalHeader>

          <ModalBody pb="6">
            {detailCombo && (
              <Box>
                <Box
                  borderRadius="12px"
                  overflow="hidden"
                  mb="16px"
                  bg="linear-gradient(135deg, #fff7ed, #ffedd5)"
                  h="160px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {detailCombo.image ? (
                    <img
                      src={detailCombo.image}
                      alt={detailCombo.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Icon as={FaBoxOpen} boxSize="48px" color="#fed7aa" />
                  )}
                </Box>

                <Grid templateColumns="1fr 1fr" gap="12px" mb="12px">
                  <Box>
                    <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">
                      Tên combo
                    </Text>
                    <Text fontSize="14px" fontWeight="700" color={isDark ? DARK.ink : "#0f172a"}>
                      {detailCombo.name}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">
                      Danh mục
                    </Text>
                    <Text fontSize="14px" fontWeight="700" color={isDark ? DARK.ink : "#0f172a"}>
                      {detailCombo.category}
                    </Text>
                  </Box>
                </Grid>

                <Box mb="12px">
                  <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">
                    Mô tả
                  </Text>
                  <Text fontSize="13px" color={isDark ? DARK.ink3 : "#64748b"} lineHeight="1.6">
                    {detailCombo.description || "Không có mô tả"}
                  </Text>
                </Box>

                <Box mb="12px">
                  <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">
                    Thành phần
                  </Text>
                  <Flex gap="6px" flexWrap="wrap" mt="4px">
                    {detailCombo.items?.map((item) => (
                      <Box key={item} px="10px" py="4px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                        <Text fontSize="12px" fontWeight="600" color="#c2410c">{item}</Text>
                      </Box>
                    ))}
                  </Flex>
                </Box>

                <Grid templateColumns="1fr 1fr 1fr" gap="12px">
                  <Box p="10px" borderRadius="8px" bg={isDark ? DARK.ink6 : "#f9fafb"}>
                    <Text fontSize="9px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} textTransform="uppercase">
                      Giá bán
                    </Text>
                    <Text fontSize="16px" fontWeight="800" color="#f97316">
                      {detailCombo.price?.toLocaleString("vi-VN")}đ
                    </Text>
                    {detailCombo.originalPrice > detailCombo.price && (
                      <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} textDecoration="line-through">
                        {detailCombo.originalPrice.toLocaleString("vi-VN")}đ
                      </Text>
                    )}
                  </Box>
                  <Box p="10px" borderRadius="8px" bg={isDark ? DARK.ink6 : "#f9fafb"}>
                    <Text fontSize="9px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} textTransform="uppercase">
                      Đã bán
                    </Text>
                    <Text fontSize="16px" fontWeight="800" color={isDark ? DARK.ink : "#0f172a"}>
                      {detailCombo.soldCount?.toLocaleString() || 0}
                    </Text>
                  </Box>
                  <Box p="10px" borderRadius="8px" bg={isDark ? DARK.ink6 : "#f9fafb"}>
                    <Text fontSize="9px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} textTransform="uppercase">
                      Trạng thái
                    </Text>
                    <Text fontSize="14px" fontWeight="700" color={detailCombo.isActive ? "#10b981" : "#6b7280"}>
                      {detailCombo.isActive ? "✅ Đang bán" : "⛔ Đã tắt"}
                    </Text>
                  </Box>
                </Grid>

                {detailCombo.tag && (
                  <Box mt="12px">
                    <Text fontSize="10px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">
                      Nhãn
                    </Text>
                    <Box px="10px" py="4px" borderRadius="6px" bg="#f5f3ff" border="1px solid #c4b5fd" display="inline-block">
                      <Text fontSize="12px" fontWeight="600" color="#7c3aed">{detailCombo.tag}</Text>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </ModalBody>

          <ModalFooter gap="10px" borderTop={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}>
            <Button
              flex="1"
              h="42px"
              borderRadius="10px"
              fontWeight="600"
              fontSize="13px"
              variant="ghost"
              color={isDark ? DARK.ink3 : "#64748b"}
              border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
              _hover={{ bg: isDark ? DARK.ink6 : "#f8fafc" }}
              onClick={onDetailClose}
            >
              Đóng
            </Button>
            <Button
              flex="1"
              h="42px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white"
              boxShadow="0 4px 16px rgba(249,115,22,0.35)"
              _hover={{
                boxShadow: "0 8px 24px rgba(249,115,22,0.45)",
                transform: "translateY(-1px)"
              }}
              leftIcon={<Icon as={MdEdit} />}
              onClick={() => {
                onDetailClose();
                setSelected(detailCombo);
                setView("edit");
              }}
            >
              Chỉnh sửa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        mb="18px"
        gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box
              w="38px"
              h="38px"
              borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaCoffee} boxSize="16px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={ink} letterSpacing="-0.5px">
              Combo Bắp Nước
            </Text>
          </Flex>
          <Text color={isDark ? DARK.ink4 : "#94a3b8"} fontSize="13px" pl="48px">
            Tạo và quản lý các gói combo bắp nước cho hệ thống đặt vé
          </Text>
        </Box>

        <Flex gap="10px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
          w={{ base: "100%", md: "auto" }} flexWrap="wrap"
        >
          <Button
            h="40px"
            w="40px"
            p="0"
            borderRadius="10px"
            bg={isDark ? DARK.ink6 : "#f8fafc"}
            color={isDark ? DARK.ink2 : "#475569"}
            border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
            onClick={toggleColorMode}
            flexShrink="0"
          >
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="18px" />
          </Button>

          <Flex
            borderRadius="10px"
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
            overflow="hidden"
            flexShrink="0"
          >
            {["grid", "table"].map((mode) => (
              <Button
                key={mode}
                h="40px"
                px="14px"
                borderRadius="0"
                bg={displayMode === mode ? "linear-gradient(135deg,#f97316,#fb923c)" : (isDark ? DARK.ink6 : "#f8fafc")}
                color={displayMode === mode ? "white" : (isDark ? DARK.ink3 : "#64748b")}
                fontSize="12px"
                fontWeight="700"
                _hover={{ opacity: 0.9 }}
                transition="all 0.15s"
                onClick={() => setDisplayMode(mode)}
              >
                {mode === "grid" ? "Lưới" : "Bảng"}
              </Button>
            ))}
          </Flex>

          <Button
            flex={{ base: "1", md: "none" }}
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
            onClick={() => setView("add")}
          >
            Thêm Combo
          </Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing="12px" mb="18px">
        <StatCard label="Tổng combo" value={stats.total} icon={FaBoxOpen} accent="#f97316" delay={0} isDark={isDark} />
        <StatCard label="Đang bán" value={stats.active} icon={MdAdd} accent="#10b981" delay={0.04} isDark={isDark} />
        <StatCard label="Đã tắt" value={stats.hidden} icon={MdFilterList} accent="#6b7280" delay={0.08} isDark={isDark} />
        <StatCard label="Theo mùa" value={stats.seasonal} icon={MdAdd} accent="#0284c7" delay={0.12} isDark={isDark} />
        <StatCard
          label="Tổng lượt bán"
          value={stats.totalSold.toLocaleString()}
          icon={MdAdd}
          accent="#f97316"
          delay={0.16}
          isDark={isDark}
        />
      </SimpleGrid>

      {/* Table / Grid card */}
      <Box
        bg={isDark ? DARK.bgCard : "white"}
        borderRadius="16px"
        border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Card header */}
        <Box
          p={{ base: "14px 16px", md: "16px 20px 14px" }}
          borderBottom={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f8fafc"}
        >
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "13px", md: "14.5px" }} color={ink}>
                Danh sách combo
              </Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} combo</Text>
              </Box>
            </Flex>
            <Button
              display={{ base: "flex", md: "none" }}
              size="sm"
              h="34px"
              px="12px"
              borderRadius="9px"
              bg={isDark ? DARK.ink6 : "#f8fafc"}
              color={isDark ? DARK.ink3 : "#64748b"}
              border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
              fontSize="12px"
              fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              _hover={{ bg: isDark ? DARK.ink6 : "#f1f5f9" }}
              onClick={() => setShowFilter((v) => !v)}
            >
              Lọc
            </Button>
          </Flex>

          {/* Filters */}
          <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr" }} gap="8px">
              <Box position="relative">
                <Icon
                  as={MdSearch}
                  position="absolute"
                  left="10px"
                  top="50%"
                  transform="translateY(-50%)"
                  boxSize="13px"
                  color={isDark ? DARK.ink4 : "#94a3b8"}
                  zIndex="1"
                />
                <Input
                  pl="30px"
                  h={{ base: "40px", md: "34px" }}
                  w="100%"
                  fontSize="12.5px"
                  fontWeight="500"
                  placeholder="Tìm tên combo, mô tả, thành phần..."
                  bg={isDark ? DARK.ink6 : "#f8fafc"}
                  border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e8edf3"}
                  borderRadius="9px"
                  color={isDark ? DARK.ink : "#374151"}
                  _placeholder={{ color: isDark ? DARK.ink4 : "#b0bac8" }}
                  _focus={{
                    border: "1.5px solid #f97316",
                    boxShadow: "0 0 0 3px rgba(249,115,22,0.08)",
                    bg: isDark ? DARK.bgCard : "#fff"
                  }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select
                h={{ base: "40px", md: "34px" }}
                fontSize="12.5px"
                fontWeight="600"
                color={isDark ? DARK.ink : "#374151"}
                bg={isDark ? DARK.ink6 : "#f8fafc"}
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e8edf3"}
                borderRadius="9px"
                _focus={{ border: "1.5px solid #f97316" }}
                _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
              <Select
                h={{ base: "40px", md: "34px" }}
                fontSize="12.5px"
                fontWeight="600"
                color={isDark ? DARK.ink : "#374151"}
                bg={isDark ? DARK.ink6 : "#f8fafc"}
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e8edf3"}
                borderRadius="9px"
                _focus={{ border: "1.5px solid #f97316" }}
                _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>Tất cả</option>
                <option>Đang bán</option>
                <option>Đã tắt</option>
              </Select>
            </Grid>
          </Box>
        </Box>

        {/* Content */}
        <Box p="14px">
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="52px" color={isDark ? DARK.ink4 : "#cbd5e1"}>
              <Icon as={FaBoxOpen} boxSize="32px" mb="10px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? DARK.ink3 : "#94a3b8"}>
                Không tìm thấy combo nào
              </Text>
              <Text fontSize="11.5px" color={isDark ? DARK.ink4 : "#cbd5e1"} mt="4px">
                Thử thay đổi bộ lọc hoặc thêm combo mới
              </Text>
            </Flex>
          ) : displayMode === "grid" ? (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="14px">
              {filtered.map((c, i) => (
                <ComboCard
                  key={c.id}
                  combo={c}
                  index={i}
                  onView={handleView}
                  onEdit={(cb) => { setSelected(cb); setView("edit"); }}
                  onToggle={handleToggle}
                  onDelete={(cb) => { setDeleteTarget(cb); setIsDeleteOpen(true); }}
                  isDark={isDark}
                />
              ))}
            </SimpleGrid>
          ) : (
            <>
              <Flex
                px="16px"
                py="9px"
                bg={isDark ? DARK.ink6 : "#fafbfc"}
                borderRadius="10px"
                mb="8px"
                display={{ base: "none", md: "flex" }}
              >
                <Box w="28px" flexShrink="0" />
                <Box w="44px" mr="14px" flexShrink="0" />
                {[
                  { label: "Tên combo / Thành phần", flex: "2" },
                  { label: "Danh mục", flex: "0.8" },
                  { label: "Giá bán", flex: "0.8" },
                  { label: "Đã bán", flex: "0.6" },
                  { label: "Trạng thái", flex: "0.5" },
                ].map(({ label, flex }) => (
                  <Box key={label} flex={flex} minW="0" pr="12px">
                    <Text
                      fontSize="10px"
                      fontWeight="800"
                      color={isDark ? DARK.ink4 : "#94a3b8"}
                      letterSpacing="1px"
                      textTransform="uppercase"
                    >
                      {label}
                    </Text>
                  </Box>
                ))}
                <Box w="160px" flexShrink="0" textAlign="right">
                  <Text
                    fontSize="10px"
                    fontWeight="800"
                    color={isDark ? DARK.ink4 : "#94a3b8"}
                    letterSpacing="1px"
                    textTransform="uppercase"
                  >
                    Thao tác
                  </Text>
                </Box>
              </Flex>
              <Flex direction="column" gap="8px">
                {filtered.map((c, i) => (
                  <ComboRow
                    key={c.id}
                    combo={c}
                    index={i}
                    onView={handleView}
                    onEdit={(cb) => { setSelected(cb); setView("edit"); }}
                    onToggle={handleToggle}
                    onDelete={(cb) => { setDeleteTarget(cb); setIsDeleteOpen(true); }}
                    isDark={isDark}
                  />
                ))}
              </Flex>
            </>
          )}
        </Box>

        {/* Footer */}
        {filtered.length > 0 && (
          <Box
            px={{ base: "14px", md: "20px" }}
            py="12px"
            borderTop={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f8fafc"}
          >
            <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"}>
              Hiển thị <strong color={ink}>{filtered.length}</strong> / {combos.length} combo ·{" "}
              <Text as="span" color="#10b981" fontWeight="700">{stats.active} đang bán</Text>,{" "}
              <Text as="span" color="#6b7280" fontWeight="700">{stats.hidden} đã tắt</Text>
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}