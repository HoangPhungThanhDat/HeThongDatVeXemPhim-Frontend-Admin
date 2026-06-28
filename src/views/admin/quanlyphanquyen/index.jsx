

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, SimpleGrid,
  Input, Select, useColorMode, useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdAdd, MdSearch, MdFilterList, MdDarkMode, MdLightMode,
  MdClose, MdVisibility, MdEdit, MdDelete,
} from "react-icons/md";
import { FaShieldAlt, FaUsers, FaUserShield, FaUserTie, FaUserCog } from "react-icons/fa";

import { useRole } from "./hooks/useRole";
import { DARK } from "./constants";
import { fadeUp, fadeIn } from "./components/shared/animations";
import StatCard from "./components/shared/StatCard";
import RoleCard from "./components/RoleCard";
import RoleRow from "./components/RoleRow";
import RoleForm from "./components/RoleForm";
import DeleteModal from "./components/DeleteModal";
import Loader from "../../../layouts/Loader";

export default function QuanLyPhanQuyen() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const {
    roles,
    loading,
    isSubmitting,
    setIsSubmitting,
    handleAddRole,
    handleUpdateRole,
    handleDeleteRole,
    handleToggleStatus,
  } = useRole();

  const [view, setView] = useState("list");
  const [selectedRole, setSelectedRole] = useState(null);
  const [displayMode, setDisplayMode] = useState("grid");
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const deleteDisc = useDisclosure();
  const formDisc = useDisclosure();

  const bg = useColorModeValue("#f5f5f2", DARK.bg);
  const bgCard = useColorModeValue("white", DARK.bgCard);
  const ink = useColorModeValue("#0f172a", DARK.ink);
  const ink3 = useColorModeValue("#64748b", DARK.ink3);
  const ink4 = useColorModeValue("#94a3b8", DARK.ink4);
  const ink5 = useColorModeValue("#e2e8f0", DARK.ink5);
  const ink6 = useColorModeValue("#f1f5f9", DARK.ink6);

  // Filter
  const filtered = roles.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.RoleName?.toLowerCase().includes(q) ||
      r.Description?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Tất cả" || r.Status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: roles.length,
    active: roles.filter(r => r.Status === "Active").length,
    inactive: roles.filter(r => r.Status === "Inactive").length,
  };

  const handleView = (role) => {
    setSelectedRole(role);
    setView("detail");
  };

  const openDelete = (role) => {
    setDeleteTarget(role);
    deleteDisc.onOpen();
  };

  const openForm = (role = null) => {
    setSelectedRole(role);
    formDisc.onOpen();
  };

  const onSaveRole = async (formData) => {
    setIsSubmitting(true);
    let success;
    if (selectedRole) {
      success = await handleUpdateRole(selectedRole.RoleId, formData);
    } else {
      success = await handleAddRole(formData);
    }
    setIsSubmitting(false);
    if (success) {
      formDisc.onClose();
      setSelectedRole(null);
    }
  };

  const onDeleteRole = async (roleId) => {
    const success = await handleDeleteRole(roleId);
    if (success) {
      deleteDisc.onClose();
      setDeleteTarget(null);
      if (view === "detail" && selectedRole?.RoleId === roleId) {
        setView("list");
        setSelectedRole(null);
      }
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("Tất cả");
  };

  const hasFilter = search || filterStatus !== "Tất cả";

  // ── LOADING ──
  if (loading && roles.length === 0) {
    return <Loader />;
  }

  // ── FORM VIEW ──
  if (formDisc.isOpen) {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px={{ base: "12px", md: "0" }}>
        <RoleForm
          role={selectedRole}
          isAdd={!selectedRole}
          isSubmitting={isSubmitting}
          onCancel={() => { formDisc.onClose(); setSelectedRole(null); }}
          onSave={onSaveRole}
          isDark={isDark}
        />
        <DeleteModal
          isOpen={deleteDisc.isOpen} onClose={deleteDisc.onClose}
          role={deleteTarget} onConfirm={onDeleteRole} isDark={isDark}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px={{ base: "12px", md: "0" }}>
      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteDisc.isOpen} onClose={deleteDisc.onClose}
        role={deleteTarget} onConfirm={onDeleteRole} isDark={isDark}
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
            ><Icon as={FaShieldAlt} boxSize="19px" color="white" /></Box>
            <Box>
              <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800"
                color={ink} letterSpacing="-0.5px">Quản lý phân quyền</Text>
              <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Quản lý vai trò và phân quyền hệ thống
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

          <Button h="40px" px="14px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            leftIcon={<Icon as={MdAdd} />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} transition="all 0.2s"
            onClick={() => openForm(null)}
          >Thêm vai trò</Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing="12px" mb="20px">
        <StatCard label="Tổng vai trò" value={stats.total}
          icon={FaUsers} accent="#f97316" delay={0} isDark={isDark} />
        <StatCard label="Đang hoạt động" value={stats.active}
          sub={`${stats.total ? ((stats.active/stats.total)*100).toFixed(0) : 0}% tổng số`}
          icon={FaUserShield} accent="#10b981" delay={0.05} isDark={isDark} />
        <StatCard label="Đã khóa" value={stats.inactive}
          sub="Vai trò bị khóa" icon={FaUserTie} accent="#dc2626" delay={0.1} isDark={isDark} />
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
                Danh sách vai trò
              </Text>
              <Box px="9px" py="3px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} vai trò</Text>
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
            <Flex gap="8px" align="center">
              <Button display={{ base: "flex", md: "none" }}
                size="sm" h="34px" px="12px" borderRadius="9px"
                bg={isDark ? DARK.ink6 : "#f8fafc"} color={isDark ? DARK.ink3 : "#64748b"}
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
                fontSize="12px" fontWeight="600"
                leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
                onClick={() => setShowFilter((v) => !v)}
              >Lọc</Button>
              <Flex
                borderRadius="10px"
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
                overflow="hidden"
                flexShrink="0"
              >
                {["grid", "table"].map((mode) => (
                  <Button
                    key={mode}
                    h="36px"
                    px="10px"
                    borderRadius="0"
                    bg={displayMode === mode ? "linear-gradient(135deg,#f97316,#fb923c)" : (isDark ? DARK.ink6 : "#f8fafc")}
                    color={displayMode === mode ? "white" : (isDark ? DARK.ink3 : "#64748b")}
                    fontSize="11px"
                    fontWeight="700"
                    _hover={{ opacity: 0.9 }}
                    transition="all 0.15s"
                    onClick={() => setDisplayMode(mode)}
                  >
                    {mode === "grid" ? "Lưới" : "Bảng"}
                  </Button>
                ))}
              </Flex>
            </Flex>
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
                  placeholder="Tìm tên vai trò, mô tả..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Khóa</option>
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
            { label: "#", w: "32px" },
            { label: "Tên / Mô tả", flex: "2" },
            { label: "Trạng thái", flex: "0.8" },
            { label: "", w: "200px" },
          ].map(({ label, w, flex }) => (
            <Box key={label} w={w} flex={flex} pr={flex ? "12px" : "0"} flexShrink={w ? "0" : undefined}>
              <Text fontSize="10px" fontWeight="800" color={isDark ? DARK.ink4 : "#94a3b8"}
                letterSpacing="1px" textTransform="uppercase">{label}</Text>
            </Box>
          ))}
        </Flex>

        {/* Content */}
        <Box p={{ base: "10px", md: "12px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" py="48px" color={isDark ? DARK.ink4 : "#cbd5e1"}>
              <Icon as={FaShieldAlt} boxSize="36px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? DARK.ink3 : "#94a3b8"}>Không tìm thấy vai trò nào</Text>
              <Button mt="12px" size="sm" variant="ghost" color="#f97316" fontWeight="700"
                onClick={resetFilters}>Xóa bộ lọc</Button>
            </Flex>
          ) : displayMode === "grid" ? (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="14px">
              {filtered.map((r, i) => (
                <RoleCard
                  key={r.RoleId}
                  role={r}
                  index={i}
                  onView={handleView}
                  onEdit={openForm}
                  onDelete={openDelete}
                  onToggle={handleToggleStatus}
                  isDark={isDark}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Flex direction="column" gap="8px">
              {filtered.map((r, i) => (
                <RoleRow
                  key={r.RoleId}
                  role={r}
                  index={i}
                  onView={handleView}
                  onEdit={openForm}
                  onDelete={openDelete}
                  onToggle={handleToggleStatus}
                  isDark={isDark}
                />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}