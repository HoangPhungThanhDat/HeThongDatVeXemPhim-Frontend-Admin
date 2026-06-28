// index.jsx
import React from "react";
import {
  Box, 
  Flex, 
  Text, 
  Input, 
  Select, 
  Icon, 
  useColorMode,
  useDisclosure, 
  InputGroup, 
  InputLeftElement,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  MdSearch, MdFilterList, MdRefresh, MdHeadset, MdInbox
} from "react-icons/md";
import { FaHeadset } from "react-icons/fa";

import { useContact } from "./hooks/useContact";
import { DARK } from "./constants";
import { fadeUp, fadeIn } from "./components/shared/animations";
import StatsRow from "./components/StatsRow";
import ContactRow from "./components/ContactRow";
import ContactCard from "./components/ContactCard";
import ContactDetail from "./components/ContactDetail";
import ContactProcess from "./components/ContactProcess";
import FilterDrawer from "./components/FilterDrawer";
import Loader from "../../../layouts/Loader";

const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fb923c";
const ORANGE_SHADOW = "rgba(234,88,12,0.25)";

export default function Hotrokhachhang() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = DARK[isDark ? "dark" : "light"];

  const {
    contacts,
    loading,
    selectedContact,
    view,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    submitting,
    loadContacts,
    getStats,
    getFilteredContacts,
    viewDetail,
    viewProcess,
    handleUpdate,
    handleDelete,
    goBack,
    setView,
  } = useContact();

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();

  const stats = getStats();
  const filtered = getFilteredContacts();
  const hasActiveFilters = filterStatus !== "Tất cả";

  // ── LOADING ──
  if (loading && contacts.length === 0) {
    return <Loader />;
  }

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedContact) {
    return (
      <Box pt={{ base: "120px", md: "80px" }} bg={colors.bgPage} minH="100vh" px="6px">
        <ContactDetail
          contact={selectedContact}
          onBack={goBack}
          onUpdate={handleUpdate}
          onProcess={viewProcess}
          isProcessing={submitting}
        />
      </Box>
    );
  }

  // ── PROCESS VIEW ──
  if (view === "process" && selectedContact) {
    return (
      <Box pt={{ base: "120px", md: "80px" }} bg={colors.bgPage} minH="100vh" px="6px">
        <ContactProcess
          contact={selectedContact}
          onBack={() => setView("detail")}
          onUpdate={handleUpdate}
          onComplete={(id) => {
            handleUpdate(id, { Status: "Đã xử lý" });
            setView("list");
          }}
          onClose={(id) => {
            handleUpdate(id, { Status: "Đã xử lý" });
            setView("list");
          }}
          isProcessing={submitting}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "120px", md: "80px" }} bg={colors.bgPage} minH="100vh" px="6px">
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        mb="20px"
        gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box
              w={{ base: "34px", md: "38px" }}
              h={{ base: "34px", md: "38px" }}
              borderRadius="11px"
              bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={`0 4px 12px ${ORANGE_SHADOW}`}
            >
              <Icon as={FaHeadset} boxSize={{ base: "14px", md: "16px" }} color="white" />
            </Box>
            <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color={colors.textPrimary} letterSpacing="-0.5px">
              Hỗ trợ khách hàng
            </Text>
            {stats.pending > 0 && (
              <Box px="8px" py="3px" borderRadius="7px" bg="#fef2f2" border="1px solid #fca5a5">
                <Text fontSize="11px" fontWeight="800" color="#dc2626">{stats.pending} chưa xử lý</Text>
              </Box>
            )}
          </Flex>
          <Text color={colors.textMuted} fontSize="12px" pl={{ base: "44px", md: "48px" }}>
            Quản lý yêu cầu, phản hồi và khiếu nại của khách hàng
          </Text>
        </Box>

        <Flex gap="8px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }} w={{ base: "100%", md: "auto" }}>
          <Button
            flex={{ base: "1", md: "none" }}
            h={{ base: "40px", md: "40px" }}
            px="16px"
            borderRadius="10px"
            fontWeight="600"
            fontSize="13px"
            bg={isDark ? "#2d3748" : "#f8fafc"}
            color={isDark ? "#94a3b8" : "#64748b"}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdRefresh} />}
            onClick={loadContacts}
          >
            Làm mới
          </Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Filter bar */}
      <Box
        bg={colors.bgCard}
        borderRadius="14px"
        border={`1px solid ${colors.borderCard}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
        p="14px 18px"
        mb="14px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
      >
        <Flex gap="10px" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
          <Box position="relative" flex="1">
            <Icon
              as={MdSearch}
              position="absolute"
              left="10px"
              top="50%"
              transform="translateY(-50%)"
              boxSize="14px"
              color={isDark ? "#64748b" : "#94a3b8"}
              zIndex="1"
            />
            <Input
              pl="30px"
              h="38px"
              fontSize="12.5px"
              fontWeight="500"
              placeholder="Tìm tên, email, chủ đề..."
              bg={isDark ? "#2d3748" : "#f8fafc"}
              border={`1px solid ${isDark ? "#374151" : "#e8edf3"}`}
              borderRadius="9px"
              color={colors.textPrimary}
              _placeholder={{ color: isDark ? "#64748b" : "#b0bac8" }}
              _focus={{ border: `1.5px solid ${ORANGE}`, boxShadow: `0 0 0 3px rgba(234,88,12,0.08)` }}
              _hover={{ border: `1px solid ${ORANGE}` }}
              transition="all 0.2s"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          <Select
            display={{ base: "none", md: "block" }}
            h="38px"
            fontSize="12.5px"
            fontWeight="600"
            color={colors.textPrimary}
            bg={isDark ? "#2d3748" : "#f8fafc"}
            border={`1px solid ${isDark ? "#374151" : "#e8edf3"}`}
            borderRadius="9px"
            w="160px"
            _focus={{ border: `1.5px solid ${ORANGE}` }}
            _hover={{ border: `1px solid ${ORANGE}` }}
            transition="all 0.2s"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Chưa xử lý">Chưa xử lý</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã xử lý">Đã xử lý</option>
          </Select>

          <Button
            display={{ base: "flex", md: "none" }}
            h="38px"
            px="12px"
            borderRadius="9px"
            bg={hasActiveFilters ? (isDark ? "#2d3748" : "#fef2f2") : (isDark ? "#2d3748" : "#f8fafc")}
            color={hasActiveFilters ? ORANGE : (isDark ? "#94a3b8" : "#64748b")}
            border={hasActiveFilters ? `1px solid ${isDark ? "#374151" : "#fca5a5"}` : `1px solid ${isDark ? "#374151" : "#e8edf3"}`}
            fontWeight="600"
            fontSize="12px"
            leftIcon={<Icon as={MdFilterList} boxSize="14px" />}
            onClick={onFilterOpen}
            position="relative"
          >
            Lọc
            {hasActiveFilters && (
              <Box position="absolute" top="-4px" right="-4px" w="8px" h="8px" borderRadius="full" bg={ORANGE} />
            )}
          </Button>
        </Flex>
      </Box>

      {/* Contact list */}
      <Box
        bg={colors.bgCard}
        borderRadius="16px"
        border={`1px solid ${colors.borderCard}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Table header */}
        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          px="16px"
          py="10px"
          bg={isDark ? "#2d3748" : "#fafbfc"}
          borderBottom={`1px solid ${isDark ? "#2d3748" : "#f1f5f9"}`}
        >
          <Text w="45px" flexShrink="0" fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">#</Text>
          <Text w="150px" flexShrink="0" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Khách hàng</Text>
          <Text w="120px" flexShrink="0" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">SĐT</Text>
          <Text flex="1" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Chủ đề</Text>
          <Text w="110px" flexShrink="0" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Ngày gửi</Text>
          <Text w="130px" flexShrink="0" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Trạng thái</Text>
          <Text w="180px" flexShrink="0" textAlign="right" fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Hành động</Text>
        </Flex>

        <Box p={{ base: "10px", md: "10px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px" color={isDark ? "#475569" : "#cbd5e1"}>
              <Icon as={FaHeadset} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? "#64748b" : "#94a3b8"}>
                {search ? "Không tìm thấy liên hệ nào" : "Chưa có liên hệ nào"}
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="6px">
              {filtered.map((contact, i) => (
                <React.Fragment key={contact.ContactId ?? contact.id}>
                  <ContactRow
                    contact={contact}
                    index={i}
                    onView={viewDetail}
                    onReply={viewProcess}
                    onDelete={handleDelete}
                  />
                  <ContactCard
                    contact={contact}
                    index={i}
                    onView={viewDetail}
                    onReply={viewProcess}
                    onDelete={handleDelete}
                  />
                </React.Fragment>
              ))}
            </Flex>
          )}
        </Box>
      </Box>

      {/* Filter Drawer (Mobile) */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
    </Box>
  );
}