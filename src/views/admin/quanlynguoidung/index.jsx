// src/views/admin/quanlynguoidung/index.jsx

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, SimpleGrid,
  Input, Select, useColorMode, useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdAdd, MdSearch, MdFilterList, MdDarkMode, MdLightMode,
  MdClose, MdNotifications, MdDownload, MdPersonOff,
  MdKeyboardArrowLeft, MdChevronRight,
} from "react-icons/md";
import { FaUsers, FaUserCheck, FaUserSlash, FaCrown, FaUserPlus } from "react-icons/fa";

import { useUser } from "./hooks/useUser";
import { DARK, PAGE_SIZE } from "./constants";
import { fadeUp, fadeIn } from "./components/shared/animations";
import StatCard from "./components/shared/StatCard";
import UserRow from "./components/UserRow";
import UserDetail from "./components/UserDetail";
import UserForm from "./components/UserForm";
import DeleteModal from "./components/DeleteModal";
import NotificationModal from "./components/NotificationModal";
import AddUserModal from "./components/AddUserModal";
import Loader from "../../../layouts/Loader";

// Helper export CSV
const exportCSV = (users) => {
  const headers = ["ID", "Họ tên", "Email", "SĐT", "Giới tính", "Vai trò", "Trạng thái"];
  const rows = users.map((u) => [
    u.UserId, u.FullName, u.Email, u.PhoneNumber || "", 
    u.Gender || "", u.role?.RoleName || "User", u.Status
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g,'""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `danh-sach-nguoi-dung-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
};

export default function QuanLyNguoiDung() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const {
    users,
    roles,
    loading,
    total,
    totalPages,
    page,
    goToPage,
    search,
    setSearch,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    selectedUser,
    setSelectedUser,
    view,
    setView,
    stats,
    isSubmitting,
    setIsSubmitting,
    handleToggleLock,
    handleDeleteUser,
    handleAddUser,
    handleUpdateUser,
  } = useUser();

  const [showFilter, setShowFilter] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notifyTarget, setNotifyTarget] = useState(null);

  const deleteDisc = useDisclosure();
  const notifyDisc = useDisclosure();
  const addDisc = useDisclosure();

  const bg = useColorModeValue("#f5f5f2", DARK.bg);
  const bgCard = useColorModeValue("white", DARK.bgCard);
  const ink = useColorModeValue("#0f172a", DARK.ink);
  const ink3 = useColorModeValue("#64748b", DARK.ink3);
  const ink4 = useColorModeValue("#94a3b8", DARK.ink4);
  const ink5 = useColorModeValue("#e2e8f0", DARK.ink5);
  const ink6 = useColorModeValue("#f1f5f9", DARK.ink6);

  const handleView = (user) => {
    setSelectedUser(user);
    setView("detail");
  };

  const openDelete = (user) => {
    setDeleteTarget(user);
    deleteDisc.onOpen();
  };

  const openNotify = (user) => {
    setNotifyTarget(user);
    notifyDisc.onOpen();
  };

  const onAddUser = async (formData) => {
    const success = await handleAddUser(formData);
    if (success) addDisc.onClose();
  };

  const onUpdateUser = async (formData) => {
    const success = await handleUpdateUser(selectedUser?.UserId, formData);
    if (success) {
      setView("list");
      setSelectedUser(null);
    }
  };

  const onDeleteUser = async (userId) => {
    const success = await handleDeleteUser(userId);
    if (success) {
      deleteDisc.onClose();
      setDeleteTarget(null);
      if (view === "detail" && selectedUser?.UserId === userId) {
        setView("list");
        setSelectedUser(null);
      }
    }
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
  };

  const hasFilter = search || statusFilter;

  // ── LOADING ──
  if (loading && users.length === 0) {
    return <Loader />;
  }

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedUser) {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px={{ base: "12px", md: "0" }}>
        <UserDetail
          user={selectedUser}
          roles={roles}
          onBack={() => { setView("list"); setSelectedUser(null); }}
          onToggleLock={handleToggleLock}
          onDelete={openDelete}
          onNotify={openNotify}
          onEdit={() => setView("edit")}
          isDark={isDark}
        />
        <DeleteModal
          isOpen={deleteDisc.isOpen} onClose={deleteDisc.onClose}
          user={deleteTarget} onConfirm={onDeleteUser} isDark={isDark}
        />
        <NotificationModal
          isOpen={notifyDisc.isOpen} onClose={notifyDisc.onClose}
          user={notifyTarget} isDark={isDark}
        />
      </Box>
    );
  }

  // ── FORM VIEW ──
  if (view === "add" || view === "edit") {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px={{ base: "12px", md: "0" }}>
        <UserForm
          user={view === "edit" ? selectedUser : null}
          isAdd={view === "add"}
          isSubmitting={isSubmitting}
          roles={roles}
          onCancel={() => {
            setView("list");
            setSelectedUser(null);
          }}
          onSave={view === "add" ? onAddUser : onUpdateUser}
          isDark={isDark}
        />
        <DeleteModal
          isOpen={deleteDisc.isOpen} onClose={deleteDisc.onClose}
          user={deleteTarget} onConfirm={onDeleteUser} isDark={isDark}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  const paged = users;
  const active = users.filter(u => u.Status === "Active").length;
  const locked = users.filter(u => u.Status === "Inactive" || u.Status === "Banned").length;

  // Hàm tạo số trang hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);
    
    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("...");
    }
    
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }
    
    if (right < totalPages) {
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px={{ base: "12px", md: "0" }}>
      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteDisc.isOpen} onClose={deleteDisc.onClose}
        user={deleteTarget} onConfirm={onDeleteUser} isDark={isDark}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notifyDisc.isOpen} onClose={notifyDisc.onClose}
        user={notifyTarget} isDark={isDark}
      />

      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="14px"
        sx={{ animation: `${fadeUp} 0.4s ease both` }}
      >
        <Box>
          <Flex align="center" gap="12px" mb="4px">
            <Box w="42px" h="42px" borderRadius="13px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.38)"
            ><Icon as={FaUsers} boxSize="19px" color="white" /></Box>
            <Box>
              <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800"
                color={ink} letterSpacing="-0.5px">Quản lý người dùng</Text>
              <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Xem, tìm kiếm và quản lý tài khoản khách hàng
              </Text>
            </Box>
          </Flex>
        </Box>
        <Flex gap="8px" w={{ base: "100%", md: "auto" }} flexWrap="wrap"
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
        >
          <Button h="40px" w="40px" p="0" borderRadius="10px"
            bg={isDark ? DARK.ink6 : "#f8fafc"}
            color={isDark ? DARK.ink2 : "#475569"}
            border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
            onClick={toggleColorMode}
            flexShrink="0"
          >
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="18px" />
          </Button>

          {locked > 0 && (
            <Button h="40px" px="14px" borderRadius="10px" fontWeight="600" fontSize="13px"
              bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
              leftIcon={<Icon as={MdPersonOff} />}
              _hover={{ bg: "#fee2e2" }} transition="all 0.2s"
              onClick={() => { setStatusFilter("Inactive"); }}
            >{locked} bị khóa</Button>
          )}
          <Button h="40px" px="14px" borderRadius="10px" fontWeight="600" fontSize="13px"
            bg="linear-gradient(135deg,#ecfdf5,#d1fae5)" color="#059669"
            border="1px solid #6ee7b7"
            leftIcon={<Icon as={MdDownload} />}
            _hover={{ opacity: 0.88 }} transition="all 0.2s"
            onClick={() => exportCSV(users)}
          >Export CSV ({users.length})</Button>
          <Button h="40px" px="14px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            leftIcon={<Icon as={FaUserPlus} />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} transition="all 0.2s"
            onClick={addDisc.onOpen}
          >Thêm người dùng</Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng người dùng" value={total || 0}
          icon={FaUsers} accent="#f97316" delay={0} isDark={isDark} />
        <StatCard label="Đang hoạt động" value={active}
          sub={`${total ? ((active/total)*100).toFixed(0) : 0}% tổng số`}
          icon={FaUserCheck} accent="#10b981" delay={0.05} isDark={isDark} />
        <StatCard label="Bị khóa" value={locked}
          sub="Tài khoản vi phạm" icon={FaUserSlash} accent="#dc2626" delay={0.1} isDark={isDark} />
        <StatCard label="VIP (Vàng + Kim cương)" value="0"
          sub="0% tổng số" icon={FaCrown} accent="#f59e0b" delay={0.15} isDark={isDark} />
      </SimpleGrid>

      {/* Table */}
      <Box bg={isDark ? DARK.bgCard : "white"} borderRadius="16px"
        border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
        sx={{ animation: `${fadeUp} 0.4s ease 0.12s both` }}
      >
        {/* Card header */}
        <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} 
          borderBottom={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f8fafc"}
        >
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="10px" flexWrap="wrap">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={ink}>
                Danh sách người dùng
              </Text>
              <Box px="9px" py="3px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{users.length} người</Text>
              </Box>
              {hasFilter && (
                <Button size="xs" h="24px" px="8px" borderRadius="6px"
                  bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                  fontSize="10px" fontWeight="700"
                  leftIcon={<Icon as={MdClose} boxSize="10px" />}
                  onClick={resetFilters}
                >Xóa lọc</Button>
              )}
            </Flex>
            <Button display={{ base: "flex", md: "none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg={isDark ? DARK.ink6 : "#f8fafc"} color={isDark ? DARK.ink3 : "#64748b"}
              border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              onClick={() => setShowFilter((v) => !v)}
            >Lọc</Button>
          </Flex>

          <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
            <Flex gap="10px" wrap="wrap" align="center">
              <Box position="relative" flex={{ base: "1 1 100%", md: "1 1 220px" }} minW="180px">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color={isDark ? DARK.ink4 : "#94a3b8"} zIndex="1" />
                <Input
                  pl="30px"
                  h={{ base: "40px", md: "34px" }}
                  w="100%"
                  fontSize="12.5px"
                  fontWeight="500"
                  placeholder="Tên, email, SĐT..."
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
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); }}
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Khóa</option>
                <option value="Banned">Cấm</option>
              </Select>
            </Flex>
          </Box>
        </Box>

        {/* Desktop column headers */}
        <Flex px="18px" py="10px" bg={isDark ? DARK.ink6 : "#fafbfc"} 
          borderBottom={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
          display={{ base: "none", md: "flex" }} align="center"
        >
          {[
            { label: "#", w: "28px" },
            { label: "Người dùng", flex: "2" },
            { label: "SĐT", flex: "0.9" },
            { label: "Vai trò", flex: "0.6" },
            { label: "Trạng thái", flex: "0.8" },
            { label: "", w: "168px" },
          ].map(({ label, w, flex }) => (
            <Box key={label} w={w} flex={flex} pr={flex ? "12px" : "0"} flexShrink={w ? "0" : undefined}>
              <Text fontSize="10px" fontWeight="800" color={isDark ? DARK.ink4 : "#94a3b8"}
                letterSpacing="1px" textTransform="uppercase">{label}</Text>
            </Box>
          ))}
        </Flex>

        {/* Rows */}
        <Box p={{ base: "10px", md: "10px" }}>
          {paged.length === 0 ? (
            <Flex direction="column" align="center" py="48px" color={isDark ? DARK.ink4 : "#cbd5e1"}>
              <Icon as={FaUsers} boxSize="36px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? DARK.ink3 : "#94a3b8"}>Không tìm thấy người dùng nào</Text>
              <Button mt="12px" size="sm" variant="ghost" color="#f97316" fontWeight="700"
                onClick={resetFilters}>Xóa bộ lọc</Button>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {paged.map((u, i) => (
                <UserRow key={u.UserId} user={u} index={(page-1)*PAGE_SIZE + i}
                  onView={handleView}
                  onToggleLock={handleToggleLock}
                  onDelete={openDelete}
                  onNotify={openNotify}
                  isDark={isDark}
                />
              ))}
            </Flex>
          )}
        </Box>

        {/* ✅ PAGINATION - Giống như trong ảnh của bạn */}
        {totalPages > 1 && (
          <Flex 
            p="12px 20px" 
            borderTop={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
            align="center" 
            justify="space-between" 
            gap="12px" 
            flexWrap="wrap"
            bg={isDark ? DARK.bgCard : "white"}
            borderRadius="0 0 16px 16px"
          >
            {/* Thông tin số lượng */}
            <Text fontSize="13px" color={isDark ? DARK.ink4 : "#6b7280"} fontWeight="500">
              Hiển thị <Text as="span" fontWeight="700" color={ink}>
                {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, total)}
              </Text> / {total} người dùng
            </Text>

            {/* Các nút phân trang */}
            <Flex gap="4px" align="center" flexWrap="wrap">
              {/* Nút Trước */}
              <Button 
                size="xs" 
                h="30px" 
                px="10px" 
                borderRadius="6px"
                isDisabled={page === 1}
                bg={isDark ? DARK.ink6 : "#f3f4f6"} 
                color={isDark ? DARK.ink3 : "#6b7280"}
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e5e7eb"}
                fontSize="12px" 
                fontWeight="600"
                _hover={{ bg: isDark ? DARK.ink6 : "#e5e7eb" }} 
                _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                onClick={() => goToPage(Math.max(1, page-1))}
              >
                Trước
              </Button>

              {/* Các số trang */}
              {getPageNumbers().map((p, idx) => (
                p === "..." ? (
                  <Text key={`ellipsis-${idx}`} fontSize="13px" color={isDark ? DARK.ink4 : "#9ca3af"} px="4px" fontWeight="600">
                    …
                  </Text>
                ) : (
                  <Button
                    key={p}
                    size="xs"
                    h="30px"
                    minW="30px"
                    px="8px"
                    borderRadius="6px"
                    bg={page === p ? "#f97316" : (isDark ? "transparent" : "transparent")}
                    color={page === p ? "white" : (isDark ? DARK.ink3 : "#6b7280")}
                    border={page === p ? "none" : (isDark ? `1px solid ${DARK.ink5}` : "1px solid #e5e7eb")}
                    fontSize="13px"
                    fontWeight={page === p ? "700" : "500"}
                    boxShadow={page === p ? "0 2px 8px rgba(249,115,22,0.3)" : "none"}
                    _hover={{ 
                      bg: page === p ? "#f97316" : (isDark ? DARK.ink6 : "#f3f4f6"),
                      transform: page === p ? "none" : "translateY(-1px)" 
                    }}
                    transition="all 0.2s"
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </Button>
                )
              ))}

              {/* Nút Sau */}
              <Button 
                size="xs" 
                h="30px" 
                px="10px" 
                borderRadius="6px"
                isDisabled={page === totalPages}
                bg={isDark ? DARK.ink6 : "#f3f4f6"} 
                color={isDark ? DARK.ink3 : "#6b7280"}
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e5e7eb"}
                fontSize="12px" 
                fontWeight="600"
                _hover={{ bg: isDark ? DARK.ink6 : "#e5e7eb" }} 
                _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                onClick={() => goToPage(Math.min(totalPages, page+1))}
              >
                Sau
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={addDisc.isOpen}
        onClose={addDisc.onClose}
        onAdd={onAddUser}
        roles={roles}
        isDark={isDark}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}