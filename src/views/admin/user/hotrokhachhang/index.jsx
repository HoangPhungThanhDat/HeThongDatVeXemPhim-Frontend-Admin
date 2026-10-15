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
import Loader from "layouts/Loader";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
};

const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fb923c";
const ORANGE_SHADOW = "rgba(234,88,12,0.25)";

export default function Hotrokhachhang() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = DARK[isDark ? "dark" : "light"];

  // Dark mode accent
  const accentColor = isDark ? DARK_THEME.accent : ORANGE;
  const accentShadow = isDark ? DARK_THEME.accentShadow : ORANGE_SHADOW;
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`;
  const borderColor = isDark ? DARK_THEME.border : "#e2e8f0";
  const inputBg = isDark ? DARK_THEME.inputBg : "#f8fafc";
  const inputBorder = isDark ? DARK_THEME.border : "#e8edf3";
  const btnBg = isDark ? DARK_THEME.inputBg : "#f8fafc";
  const btnColor = isDark ? DARK_THEME.textSecondary : "#64748b";
  const btnBorder = isDark ? DARK_THEME.border : "#e2e8f0";
  const btnHoverBg = isDark ? DARK_THEME.hoverBg : "#f1f5f9";
  const textPrimary = isDark ? DARK_THEME.text : "#0f172a";
  const textMuted = isDark ? DARK_THEME.textSecondary : "#64748b";
  const bgCard = isDark ? DARK_THEME.cardBg : "white";
  const bgPage = isDark ? DARK_THEME.bg : "#f8fafc";
  const borderCard = isDark ? DARK_THEME.border : "#f1f5f9";

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
      <Box pt={{ base: "120px", md: "80px" }} bg={bgPage} minH="100vh" px="6px">
        <ContactDetail
          contact={selectedContact}
          onBack={goBack}
          onUpdate={handleUpdate}
          onProcess={viewProcess}
          isProcessing={submitting}
          isDark={isDark}
        />
      </Box>
    );
  }

  // ── PROCESS VIEW ──
  if (view === "process" && selectedContact) {
    return (
      <Box pt={{ base: "120px", md: "80px" }} bg={bgPage} minH="100vh" px="6px">
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
          isDark={isDark}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "120px", md: "80px" }} bg={bgPage} minH="100vh" px="6px">
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
              bg={gradientBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={`0 4px 12px ${accentShadow}`}
            >
              <Icon as={FaHeadset} boxSize={{ base: "14px", md: "16px" }} color="white" />
            </Box>
            <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color={textPrimary} letterSpacing="-0.5px">
              Hỗ trợ khách hàng
            </Text>
            {stats.pending > 0 && (
              <Box px="8px" py="3px" borderRadius="7px" bg="#fef2f2" border="1px solid #fca5a5">
                <Text fontSize="11px" fontWeight="800" color="#dc2626">{stats.pending} chưa xử lý</Text>
              </Box>
            )}
          </Flex>
          <Text color={textMuted} fontSize="12px" pl={{ base: "44px", md: "48px" }}>
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
            bg={btnBg}
            color={btnColor}
            border={`1px solid ${btnBorder}`}
            _hover={{ bg: btnHoverBg }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdRefresh} />}
            onClick={loadContacts}
          >
            Làm mới
          </Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <StatsRow stats={stats} isDark={isDark} />

      {/* Filter bar */}
      <Box
        bg={bgCard}
        borderRadius="14px"
        border={`1px solid ${borderCard}`}
        boxShadow={isDark ? `0 1px 4px ${DARK_THEME.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)"}
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
              color={isDark ? DARK_THEME.labelColor : "#94a3b8"}
              zIndex="1"
            />
            <Input
              pl="30px"
              h="38px"
              fontSize="12.5px"
              fontWeight="500"
              placeholder="Tìm tên, email, chủ đề..."
              bg={inputBg}
              border={`1px solid ${inputBorder}`}
              borderRadius="9px"
              color={textPrimary}
              _placeholder={{ color: isDark ? DARK_THEME.labelColor : "#b0bac8" }}
              _focus={{ border: `1.5px solid ${accentColor}`, boxShadow: `0 0 0 3px ${isDark ? DARK_THEME.accentShadow : "rgba(234,88,12,0.08)"}` }}
              _hover={{ border: `1px solid ${accentColor}` }}
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
            color={textPrimary}
            bg={inputBg}
            border={`1px solid ${inputBorder}`}
            borderRadius="9px"
            w="160px"
            _focus={{ border: `1.5px solid ${accentColor}` }}
            _hover={{ border: `1px solid ${accentColor}` }}
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
            bg={hasActiveFilters ? (isDark ? DARK_THEME.inputBg : "#fef2f2") : (isDark ? DARK_THEME.inputBg : "#f8fafc")}
            color={hasActiveFilters ? accentColor : (isDark ? DARK_THEME.textSecondary : "#64748b")}
            border={hasActiveFilters ? `1px solid ${isDark ? DARK_THEME.border : "#fca5a5"}` : `1px solid ${btnBorder}`}
            fontWeight="600"
            fontSize="12px"
            leftIcon={<Icon as={MdFilterList} boxSize="14px" />}
            onClick={onFilterOpen}
            position="relative"
          >
            Lọc
            {hasActiveFilters && (
              <Box position="absolute" top="-4px" right="-4px" w="8px" h="8px" borderRadius="full" bg={accentColor} />
            )}
          </Button>
        </Flex>
      </Box>

      {/* Contact list */}
      <Box
        bg={bgCard}
        borderRadius="16px"
        border={`1px solid ${borderCard}`}
        boxShadow={isDark ? `0 1px 4px ${DARK_THEME.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)"}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Table header */}
        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          px="16px"
          py="10px"
          bg={isDark ? DARK_THEME.inputBg : "#fafbfc"}
          borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f1f5f9"}`}
        >
          <Text w="45px" flexShrink="0" fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">#</Text>
          <Text w="150px" flexShrink="0" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Khách hàng</Text>
          <Text w="120px" flexShrink="0" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">SĐT</Text>
          <Text flex="1" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Chủ đề</Text>
          <Text w="110px" flexShrink="0" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Ngày gửi</Text>
          <Text w="130px" flexShrink="0" pr="12px" fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Trạng thái</Text>
          <Text w="180px" flexShrink="0" textAlign="right" fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Hành động</Text>
        </Flex>

        <Box p={{ base: "10px", md: "10px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px" color={isDark ? DARK_THEME.border : "#cbd5e1"}>
              <Icon as={FaHeadset} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? DARK_THEME.textSecondary : "#94a3b8"}>
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
                    isDark={isDark}
                  />
                  <ContactCard
                    contact={contact}
                    index={i}
                    onView={viewDetail}
                    onReply={viewProcess}
                    onDelete={handleDelete}
                    isDark={isDark}
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
        isDark={isDark}
      />
    </Box>
  );
}