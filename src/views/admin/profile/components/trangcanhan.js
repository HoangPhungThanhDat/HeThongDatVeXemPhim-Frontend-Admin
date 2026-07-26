// views/admin/profile/components/trangcanhan.js
import React, { useState, useEffect } from "react";
import {
  Box, Grid, Text, Flex, Avatar, Button, Badge, Divider,
  SimpleGrid, Icon, keyframes, Progress, useColorMode,
  useToast, Tabs, TabList, TabPanels, Tab, TabPanel,
  Input, FormControl, FormLabel, VStack, HStack, Spinner
} from "@chakra-ui/react";
import {
  MdAdminPanelSettings, MdConfirmationNumber, MdMovie, MdPeople,
  MdEmail, MdPhone, MdVerified, MdTrendingUp, MdCalendarToday,
  MdStar, MdCheckCircle, MdEdit, MdAccessTime, MdEventSeat,
  MdWorkspacePremium, MdBarChart, MdHistory, MdAssignment,
  MdSettings, MdSave, MdLock, MdShield, MdPerson, MdEmail as MdEmailIcon,
  MdPhone as MdPhoneIcon, MdCake, MdIdBadge, MdCalendarPlus,
  MdSyncAlt, MdFemale, MdMale, MdTransgender, MdWorkOutline
} from "react-icons/md";
import { FaTicketAlt, FaFire, FaShieldAlt, FaUserCircle, FaTasks } from "react-icons/fa";

import UserApi from "../../../../api/UserApi";
import RoleApi from "../../../../api/RoleApi";
import Loader from "../../../../layouts/Loader";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,158,255,0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(74,158,255,0); }
`;

// ─── Palette ─────────────────────────────────────────────────────────────────
const OR   = "#ea580c";
const ORL  = "#fb923c";
const ORXL = "#fed7aa";
const ORPL = "#fff7ed";
const ORSW = "rgba(234,88,12,0.2)";
const DARK = "#0c0f1a";

// ─── Dark Theme Colors ──────────────────────────────────────────────────────
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

// ─── Dark mode helpers ──────────────────────────────────────────────────────
const getColors = (isDark) => ({
  bgPage: isDark ? DARK_THEME.bg : "#f8fafc",
  bgCard: isDark ? DARK_THEME.cardBg : "white",
  bgCardHover: isDark ? DARK_THEME.hoverBg : "#f8fafc",
  bgInput: isDark ? DARK_THEME.inputBg : "#fafafa",
  bgSub: isDark ? DARK_THEME.inputBg : "#f8fafc",
  bgSub2: isDark ? DARK_THEME.cardBg : "#fafbfc",
  borderCard: isDark ? DARK_THEME.border : "#f1f5f9",
  borderInput: isDark ? DARK_THEME.border : "#e8edf3",
  borderLight: isDark ? DARK_THEME.border : "#f8fafc",
  textPrimary: isDark ? DARK_THEME.text : "#0f172a",
  textSecondary: isDark ? DARK_THEME.textSecondary : "#64748b",
  textMuted: isDark ? DARK_THEME.labelColor : "#94a3b8",
  textDark: isDark ? DARK_THEME.text : "#1a202c",
  textBody: isDark ? DARK_THEME.text : "#334155",
  textLight: isDark ? DARK_THEME.textSecondary : "#475569",
  shadow: isDark ? `0 1px 4px ${DARK_THEME.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)",
  shadowHover: isDark ? `0 8px 32px ${DARK_THEME.accentShadow}` : "0 8px 24px rgba(0,0,0,0.08)",
  avatarBorder: isDark ? DARK_THEME.border : "white",
  chipBg: isDark ? DARK_THEME.inputBg : "#f8fafc",
  chipBorder: isDark ? DARK_THEME.border : "#e8edf3",
});

// ─── Status Helpers ──────────────────────────────────────────────────────────
const getStatusLabel = (status) => {
  if (!status) return "Hoạt động";
  const s = status.toLowerCase();
  if (s === "active") return "Hoạt động";
  if (s === "inactive") return "Không hoạt động";
  if (s === "banned") return "Bị cấm";
  return status;
};

const getStatusColor = (status, isDark) => {
  if (!status) return isDark ? "#4ade80" : "#059669";
  const s = status.toLowerCase();
  if (s === "active") return isDark ? "#4ade80" : "#059669";
  if (s === "inactive") return isDark ? "#fbbf24" : "#b45309";
  if (s === "banned") return isDark ? "#f87171" : "#dc2626";
  return isDark ? DARK_THEME.textSecondary : "#6b7280";
};

const getStatusBg = (status, isDark) => {
  if (!status) return isDark ? "#064e3b" : "#ecfdf5";
  const s = status.toLowerCase();
  if (s === "active") return isDark ? "#064e3b" : "#ecfdf5";
  if (s === "inactive") return isDark ? "#451a03" : "#fffbeb";
  if (s === "banned") return isDark ? "#7f1d1d" : "#fef2f2";
  return isDark ? DARK_THEME.inputBg : "#f9fafb";
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TrangCaNhan() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);
  const toast = useToast();

  // Dark mode accent
  const accentColor = isDark ? DARK_THEME.accent : OR;
  const accentShadow = isDark ? DARK_THEME.accentShadow : ORSW;
  const accentLight = isDark ? DARK_THEME.accentLight : ORL;
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : `linear-gradient(135deg, ${OR}, ${ORL})`;
  const gradientHero = isDark
    ? `linear-gradient(135deg, ${DARK} 0%, ${DARK_THEME.cardBg} 50%, ${DARK_THEME.bg} 100%)`
    : `linear-gradient(135deg, ${DARK} 0%, #1e293b 50%, #0c1a2e 100%)`;

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // ── Load user data ──
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("UserId");
        if (!userId) {
          setError("Không tìm thấy thông tin đăng nhập");
          setLoading(false);
          return;
        }
        const response = await UserApi.getById(userId);
        let userData = response.data?.data || response.data || response;
        if (!userData) {
          setError("Không thể tải thông tin tài khoản");
          setLoading(false);
          return;
        }
        setUser(userData);
        if (userData.RoleId) {
          try {
            const roleResponse = await RoleApi.getById(userData.RoleId);
            setRole(roleResponse.data?.data || roleResponse.data || roleResponse);
          } catch (e) {
            console.error("Lỗi load role:", e);
          }
        }
        setError(null);
      } catch (err) {
        setError(`Không thể tải thông tin tài khoản: ${err.message}`);
        toast({
          title: "Lỗi tải thông tin",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [toast]);

  // ── Format date ──
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  // ── Handle save profile ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        FullName: formData.get("fullName"),
        PhoneNumber: formData.get("phone"),
        DateOfBirth: formData.get("dateOfBirth"),
        Gender: formData.get("gender"),
      };
      await UserApi.update(user.UserId, payload);
      setUser({ ...user, ...payload });
      toast({
        title: "✅ Cập nhật thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      toast({
        title: "❌ Cập nhật thất bại!",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading ──
  if (loading) return <Loader />;

  // ── Error ──
  if (error) {
    return (
      <Box pt="100px" px="20px" minH="100vh" bg={colors.bgPage}>
        <Box p="30px" borderRadius="16px" bg={colors.bgCard} border="1px solid #fca5a5">
          <Text fontSize="20px" fontWeight="700" color="#dc2626">Lỗi!</Text>
          <Text color={colors.textBody}>{error}</Text>
        </Box>
      </Box>
    );
  }

  if (!user) return null;

  const statusColor = getStatusColor(user.Status, isDark);
  const statusBg = getStatusBg(user.Status, isDark);
  const statusLabel = getStatusLabel(user.Status);

  return (
    <Box pt={{ base: "120px", md: "80px" }} px={{ base: "14px", md: "20px" }}
      pb="40px" bg={colors.bgPage} minH="100vh">

      {/* ── HERO BANNER ── */}
      <Box mb="24px" borderRadius="22px" overflow="hidden" position="relative"
        sx={{ animation: `${fadeIn} .5s ease both` }}
        boxShadow={`0 16px 48px ${accentShadow}`}>
        <Box h={{ base: "160px", md: "190px" }}
          bg={gradientHero}
          position="relative">

          <Flex position="absolute" top="14px" left="20px" gap="6px" opacity=".25">
            {[...Array(6)].map((_, i) => (
              <Box key={i} w="8px" h="8px" borderRadius="2px" bg="white" />
            ))}
          </Flex>
          <Flex position="absolute" bottom="14px" right="20px" gap="6px" opacity=".15">
            {[...Array(8)].map((_, i) => (
              <Box key={i} w="8px" h="8px" borderRadius="2px" bg="white" />
            ))}
          </Flex>

          <Box position="absolute" bottom="0" left="0" right="0" h="2px"
            bg={`linear-gradient(90deg, transparent, ${isDark ? DARK_THEME.accent : OR}, ${isDark ? DARK_THEME.accentLight : ORL}, ${isDark ? DARK_THEME.accent : "#fbbf24"}, ${isDark ? DARK_THEME.accentLight : ORL}, ${isDark ? DARK_THEME.accent : OR}, transparent)`}
            bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />

          <Box position="absolute" top="-40px" right={{ base: "-40px", md: "60px" }}
            w="220px" h="220px" borderRadius="full"
            bg={`radial-gradient(circle, ${accentShadow} 0%, transparent 70%)`} />

          <Flex position="absolute" top="16px" right="20px" align="center" gap="6px"
            px="12px" py="6px" borderRadius="10px"
            bg="rgba(255,255,255,.08)" border="1px solid rgba(255,255,255,.15)"
            backdropFilter="blur(8px)">
            <Icon as={FaShieldAlt} boxSize="12px" color={isDark ? DARK_THEME.accentLight : ORL} />
            <Text fontSize="11px" fontWeight="800" color="white" letterSpacing="1.5px">
              {role?.RoleName || "Staff"}
            </Text>
          </Flex>
        </Box>

        <Box bg={colors.bgCard} px={{ base: "20px", md: "32px" }} pt="0" pb="22px">
          <Flex align="flex-end" gap={{ base: "14px", md: "20px" }} mt="-44px" mb="16px"
            direction={{ base: "column", sm: "row" }} alignItems={{ base: "center", sm: "flex-end" }}>
            <Box position="relative" flexShrink="0">
              <Avatar
                size={{ base: "xl", md: "2xl" }}
                name={user.FullName || "User"}
                src={user.Avatar}
                border={`4px solid ${colors.avatarBorder}`}
                boxShadow={`0 0 0 3px ${isDark ? DARK_THEME.accent : OR}, 0 8px 24px rgba(0,0,0,.2)`}
                sx={{ animation: `${pulse} 3s ease infinite` }}
              />
              <Box position="absolute" bottom="6px" right="6px" w="14px" h="14px"
                borderRadius="full" bg={user.Status === "Active" ? "#10b981" : "#f59e0b"}
                border="2.5px solid" borderColor={colors.avatarBorder} />
            </Box>

            <Flex flex="1" justify="space-between" align="flex-end" w="100%"
              direction={{ base: "column", sm: "row" }} gap="10px">
              <Box textAlign={{ base: "center", sm: "left" }}>
                <Flex align="center" gap="8px" mb="3px" justify={{ base: "center", sm: "flex-start" }}>
                  <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800" color={colors.textPrimary}>
                    {user.FullName || "Chưa cập nhật"}
                  </Text>
                  {user.IsVerified && <Icon as={MdVerified} boxSize="20px" color={isDark ? DARK_THEME.accent : OR} />}
                </Flex>
                <Flex align="center" gap="6px" justify={{ base: "center", sm: "flex-start" }}>
                  <Icon as={MdAdminPanelSettings} boxSize="14px" color={colors.textMuted} />
                  <Text fontSize="13px" color={colors.textSecondary} fontWeight="500">
                    {role?.RoleName || "Người dùng"} · {user.Email || "Chưa có email"}
                  </Text>
                </Flex>
              </Box>

              <Button h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
                bg={gradientBg} color="white"
                leftIcon={<Icon as={MdEdit} boxSize="14px" />}
                boxShadow={`0 4px 14px ${accentShadow}`}
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 8px 24px ${accentShadow}` }}
                _active={{ transform: "translateY(0)" }} transition="all .2s"
                onClick={() => setActiveTab(2)}>
                Chỉnh sửa hồ sơ
              </Button>
            </Flex>
          </Flex>

          <Flex gap="10px" flexWrap="wrap" justify={{ base: "center", sm: "flex-start" }}>
            <Flex align="center" gap="6px" px="12px" py="7px"
              borderRadius="10px" bg={colors.chipBg} border={`1px solid ${colors.chipBorder}`}>
              <Icon as={MdEmailIcon} boxSize="13px" color={isDark ? DARK_THEME.accent : OR} />
              <Text fontSize="12px" fontWeight="600" color={isDark ? DARK_THEME.text : "#374151"}>
                {user.Email || "Chưa cập nhật"}
              </Text>
            </Flex>
            <Flex align="center" gap="6px" px="12px" py="7px"
              borderRadius="10px" bg={colors.chipBg} border={`1px solid ${colors.chipBorder}`}>
              <Icon as={MdPhoneIcon} boxSize="13px" color={isDark ? DARK_THEME.accent : OR} />
              <Text fontSize="12px" fontWeight="600" color={isDark ? DARK_THEME.text : "#374151"}>
                {user.PhoneNumber || "Chưa cập nhật"}
              </Text>
            </Flex>
            <Flex align="center" gap="6px" px="12px" py="7px"
              borderRadius="10px" bg={colors.chipBg} border={`1px solid ${colors.chipBorder}`}>
              <Icon as={MdWorkspacePremium} boxSize="13px" color={isDark ? DARK_THEME.accent : OR} />
              <Text fontSize="12px" fontWeight="600" color={isDark ? DARK_THEME.text : "#374151"}>
                {role?.RoleName || "Người dùng"}
              </Text>
            </Flex>
            <Flex align="center" gap="6px" px="12px" py="7px"
              borderRadius="10px" bg={statusBg} border={`1px solid ${statusBg}`}>
              <Box w="6px" h="6px" borderRadius="full" bg={statusColor} />
              <Text fontSize="12px" fontWeight="700" color={statusColor}>
                {statusLabel}
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* ── MAIN CONTENT ── */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap="18px">

        {/* ── LEFT: Info Card ── */}
        <Box bg={colors.bgCard} borderRadius="18px" border={`1px solid ${colors.borderCard}`}
          boxShadow={colors.shadow} overflow="hidden"
          sx={{ animation: `${fadeUp} .45s ease .2s both` }}>
          <Box h="3px" bg={gradientBg} />
          <Box p="22px">
            <Flex align="center" gap="8px" mb="18px">
              <Box w="3px" h="16px" borderRadius="full" bg={gradientBg} />
              <Text fontSize="13px" fontWeight="800" color={colors.textPrimary} letterSpacing=".5px"
                textTransform="uppercase">Thông tin tài khoản</Text>
            </Flex>

            <VStack spacing={3} align="stretch">
              <Flex justify="space-between" align="center" py="10px" borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f8fafc"}`}>
                <Text fontSize="12px" fontWeight="600" color={colors.textMuted}>Mã người dùng</Text>
                <Text fontSize="12px" fontWeight="700" color={colors.textPrimary} fontFamily="monospace">
                  {user.UserId || "—"}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center" py="10px" borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f8fafc"}`}>
                <Text fontSize="12px" fontWeight="600" color={colors.textMuted}>Vai trò</Text>
                <Text fontSize="12px" fontWeight="700" color={colors.textPrimary}>
                  {role?.RoleName || "Người dùng"}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center" py="10px" borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f8fafc"}`}>
                <Text fontSize="12px" fontWeight="600" color={colors.textMuted}>Giới tính</Text>
                <Text fontSize="12px" fontWeight="700" color={colors.textPrimary}>
                  {user.Gender === "Male" ? "Nam" : user.Gender === "Female" ? "Nữ" : "Chưa cập nhật"}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center" py="10px" borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f8fafc"}`}>
                <Text fontSize="12px" fontWeight="600" color={colors.textMuted}>Ngày sinh</Text>
                <Text fontSize="12px" fontWeight="700" color={colors.textPrimary}>
                  {formatDate(user.DateOfBirth)}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center" py="10px" borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f8fafc"}`}>
                <Text fontSize="12px" fontWeight="600" color={colors.textMuted}>Ngày tạo</Text>
                <Text fontSize="12px" fontWeight="700" color={colors.textPrimary}>
                  {formatDate(user.CreatedAt)}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center" py="10px">
                <Text fontSize="12px" fontWeight="600" color={colors.textMuted}>Cập nhật</Text>
                <Text fontSize="12px" fontWeight="700" color={colors.textPrimary}>
                  {formatDate(user.UpdatedAt)}
                </Text>
              </Flex>
            </VStack>
          </Box>
        </Box>

        {/* ── RIGHT: Tabs ── */}
        <Box bg={colors.bgCard} borderRadius="18px" border={`1px solid ${colors.borderCard}`}
          boxShadow={colors.shadow} overflow="hidden"
          sx={{ animation: `${fadeUp} .45s ease .24s both` }}>
          <Box h="3px" bg={`linear-gradient(90deg,${isDark ? DARK_THEME.accent : OR},${isDark ? DARK_THEME.accentLight : ORL},${isDark ? DARK_THEME.accent : "#fbbf24"},${isDark ? DARK_THEME.accentLight : ORL},${isDark ? DARK_THEME.accent : OR})`}
            bgSize="200% 100%" sx={{ animation: `${shimmer} 4s linear infinite` }} />

          <Tabs index={activeTab} onChange={setActiveTab} variant="unstyled">
            <TabList px="22px" pt="16px" gap="4px" borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f1f5f9"}`}>
              <Tab
                px="16px" py="10px"
                fontSize="13px" fontWeight="600"
                color={isDark ? DARK_THEME.labelColor : "#64748b"}
                borderBottom="2px solid transparent"
                _selected={{ color: isDark ? DARK_THEME.accent : OR, borderBottom: `2px solid ${isDark ? DARK_THEME.accent : OR}` }}
                _hover={{ color: isDark ? DARK_THEME.text : "#0f172a" }}
                transition="all 0.2s"
              >
                <Icon as={MdHistory} mr="6px" /> Lịch sử
              </Tab>
              <Tab
                px="16px" py="10px"
                fontSize="13px" fontWeight="600"
                color={isDark ? DARK_THEME.labelColor : "#64748b"}
                borderBottom="2px solid transparent"
                _selected={{ color: isDark ? DARK_THEME.accent : OR, borderBottom: `2px solid ${isDark ? DARK_THEME.accent : OR}` }}
                _hover={{ color: isDark ? DARK_THEME.text : "#0f172a" }}
                transition="all 0.2s"
              >
                <Icon as={FaTasks} mr="6px" /> Công việc
              </Tab>
              <Tab
                px="16px" py="10px"
                fontSize="13px" fontWeight="600"
                color={isDark ? DARK_THEME.labelColor : "#64748b"}
                borderBottom="2px solid transparent"
                _selected={{ color: isDark ? DARK_THEME.accent : OR, borderBottom: `2px solid ${isDark ? DARK_THEME.accent : OR}` }}
                _hover={{ color: isDark ? DARK_THEME.text : "#0f172a" }}
                transition="all 0.2s"
              >
                <Icon as={MdSettings} mr="6px" /> Cài đặt
              </Tab>
            </TabList>

            <TabPanels p="22px">
              {/* ── Timeline Tab ── */}
              <TabPanel>
                <Text fontSize="16px" fontWeight="700" color={colors.textPrimary} mb="4px">
                  Lịch sử tài khoản
                </Text>
                <Text fontSize="13px" color={colors.textMuted} mb="20px">
                  Các hoạt động gần đây của tài khoản
                </Text>

                <VStack spacing={4} align="stretch">
                  <Flex gap="14px">
                    <Box position="relative">
                      <Box w="12px" h="12px" borderRadius="full" bg={isDark ? DARK_THEME.accent : OR} boxShadow={`0 0 0 3px ${isDark ? DARK_THEME.accentShadow : ORSW}`} />
                      <Box position="absolute" top="20px" left="5px" w="2px" h="40px" bg={isDark ? DARK_THEME.border : "#e2e8f0"} />
                    </Box>
                    <Box flex="1">
                      <Text fontSize="12px" color={colors.textMuted} fontWeight="500">
                        <Icon as={MdCalendarToday} mr="4px" /> {formatDate(user.CreatedAt)}
                      </Text>
                      <Text fontSize="14px" fontWeight="700" color={colors.textPrimary}>🎉 Tạo tài khoản</Text>
                      <Text fontSize="13px" color={colors.textBody}>
                        Tài khoản của bạn đã được tạo thành công trên hệ thống Gấu Phim.
                      </Text>
                    </Box>
                  </Flex>

                  {user.UpdatedAt && user.UpdatedAt !== user.CreatedAt && (
                    <Flex gap="14px">
                      <Box position="relative">
                        <Box w="12px" h="12px" borderRadius="full" bg="#f59e0b" boxShadow="0 0 0 3px rgba(245,158,11,0.3)" />
                      </Box>
                      <Box flex="1">
                        <Text fontSize="12px" color={colors.textMuted} fontWeight="500">
                          <Icon as={MdCalendarToday} mr="4px" /> {formatDate(user.UpdatedAt)}
                        </Text>
                        <Text fontSize="14px" fontWeight="700" color={colors.textPrimary}>✏️ Cập nhật hồ sơ</Text>
                        <Text fontSize="13px" color={colors.textBody}>
                          Thông tin hồ sơ của bạn đã được cập nhật.
                        </Text>
                      </Box>
                    </Flex>
                  )}
                </VStack>
              </TabPanel>

              {/* ── Tasks Tab ── */}
              <TabPanel>
                <Flex direction="column" align="center" justify="center" py="40px" color={isDark ? DARK_THEME.border : "#cbd5e1"}>
                  <Icon as={FaTasks} boxSize="48px" mb="12px" />
                  <Text fontSize="16px" fontWeight="600" color={isDark ? DARK_THEME.textSecondary : "#94a3b8"}>
                    Chưa có công việc nào được giao
                  </Text>
                </Flex>
              </TabPanel>

              {/* ── Settings Tab ── */}
              <TabPanel>
                <form onSubmit={handleSaveProfile}>
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="16px">
                    <Box>
                      <FormControl mb="12px">
                        <FormLabel fontSize="12px" fontWeight="700" color={colors.textMuted}>
                          <Icon as={MdPerson} mr="4px" /> Họ và tên
                        </FormLabel>
                        <Input
                          name="fullName"
                          defaultValue={user.FullName || ""}
                          bg={colors.bgInput}
                          border={`1px solid ${colors.borderInput}`}
                          borderRadius="10px"
                          color={colors.textPrimary}
                          _focus={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                          _hover={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                          transition="all 0.2s"
                        />
                      </FormControl>
                      <FormControl mb="12px">
                        <FormLabel fontSize="12px" fontWeight="700" color={colors.textMuted}>
                          <Icon as={MdEmailIcon} mr="4px" /> Email
                        </FormLabel>
                        <Input
                          value={user.Email || ""}
                          disabled
                          bg={isDark ? DARK_THEME.inputBg : "#f8fafc"}
                          border={`1px solid ${colors.borderInput}`}
                          borderRadius="10px"
                          color={isDark ? DARK_THEME.labelColor : "#6b7280"}
                          cursor="not-allowed"
                        />
                        <Text fontSize="11px" color={colors.textMuted} mt="4px">
                          <Icon as={MdLock} boxSize="12px" mr="4px" />
                          Email không thể thay đổi
                        </Text>
                      </FormControl>
                      <FormControl mb="12px">
                        <FormLabel fontSize="12px" fontWeight="700" color={colors.textMuted}>
                          <Icon as={MdPhoneIcon} mr="4px" /> Số điện thoại
                        </FormLabel>
                        <Input
                          name="phone"
                          defaultValue={user.PhoneNumber || ""}
                          bg={colors.bgInput}
                          border={`1px solid ${colors.borderInput}`}
                          borderRadius="10px"
                          color={colors.textPrimary}
                          _focus={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                          _hover={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                          transition="all 0.2s"
                        />
                      </FormControl>
                    </Box>

                    <Box>
                      <FormControl mb="12px">
                        <FormLabel fontSize="12px" fontWeight="700" color={colors.textMuted}>
                          <Icon as={MdCake} mr="4px" /> Ngày sinh
                        </FormLabel>
                        <Input
                          name="dateOfBirth"
                          type="date"
                          defaultValue={user.DateOfBirth || ""}
                          bg={colors.bgInput}
                          border={`1px solid ${colors.borderInput}`}
                          borderRadius="10px"
                          color={colors.textPrimary}
                          _focus={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                          _hover={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                          transition="all 0.2s"
                        />
                      </FormControl>
                      <FormControl mb="12px">
                        <FormLabel fontSize="12px" fontWeight="700" color={colors.textMuted}>
                          <Icon as={MdTransgender} mr="4px" /> Giới tính
                        </FormLabel>
                        <Input
                          as="select"
                          name="gender"
                          defaultValue={user.Gender || ""}
                          bg={colors.bgInput}
                          border={`1px solid ${colors.borderInput}`}
                          borderRadius="10px"
                          color={colors.textPrimary}
                          _focus={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                          _hover={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                          transition="all 0.2s"
                          h="44px"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Male">Nam</option>
                          <option value="Female">Nữ</option>
                          <option value="Other">Khác</option>
                        </Input>
                      </FormControl>
                      <FormControl mb="12px">
                        <FormLabel fontSize="12px" fontWeight="700" color={colors.textMuted}>
                          <Icon as={MdShield} mr="4px" /> Vai trò
                        </FormLabel>
                        <Input
                          value={role?.RoleName || "Người dùng"}
                          disabled
                          bg={isDark ? DARK_THEME.inputBg : "#f8fafc"}
                          border={`1px solid ${colors.borderInput}`}
                          borderRadius="10px"
                          color={isDark ? DARK_THEME.labelColor : "#6b7280"}
                          cursor="not-allowed"
                        />
                      </FormControl>
                    </Box>
                  </Grid>

                  <Flex gap="10px" mt="16px">
                    <Button
                      type="submit"
                      h="44px"
                      px="24px"
                      borderRadius="10px"
                      fontWeight="700"
                      fontSize="13px"
                      bg={gradientBg}
                      color="white"
                      boxShadow={`0 4px 14px ${accentShadow}`}
                      _hover={{ boxShadow: `0 8px 24px ${accentShadow}`, transform: "translateY(-2px)" }}
                      _active={{ transform: "translateY(0)" }}
                      transition="all .2s"
                      leftIcon={<Icon as={MdSave} />}
                      isLoading={isSaving}
                      loadingText="Đang lưu..."
                    >
                      Lưu thay đổi
                    </Button>
                  </Flex>
                </form>

                <Divider my="24px" borderColor={isDark ? DARK_THEME.border : "#f1f5f9"} />

                {/* ── Change Password ── */}
                <Box>
                  <Text fontSize="14px" fontWeight="700" color={colors.textPrimary} mb="16px">
                    <Icon as={MdLock} mr="8px" /> Đổi mật khẩu
                  </Text>
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="12px">
                    <FormControl>
                      <FormLabel fontSize="12px" fontWeight="700" color={colors.textMuted}>
                        Mật khẩu mới
                      </FormLabel>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        bg={colors.bgInput}
                        border={`1px solid ${colors.borderInput}`}
                        borderRadius="10px"
                        color={colors.textPrimary}
                        _focus={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                        _hover={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                        transition="all 0.2s"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="12px" fontWeight="700" color={colors.textMuted}>
                        Xác nhận mật khẩu
                      </FormLabel>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        bg={colors.bgInput}
                        border={`1px solid ${colors.borderInput}`}
                        borderRadius="10px"
                        color={colors.textPrimary}
                        _focus={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                        _hover={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : OR}` }}
                        transition="all 0.2s"
                      />
                    </FormControl>
                  </Grid>
                  <Button
                    mt="12px"
                    h="44px"
                    px="24px"
                    borderRadius="10px"
                    fontWeight="700"
                    fontSize="13px"
                    bg={isDark ? DARK_THEME.inputBg : "#f8fafc"}
                    color={isDark ? DARK_THEME.textSecondary : "#64748b"}
                    border={`1px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`}
                    _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f1f5f9" }}
                    leftIcon={<Icon as={MdLock} />}
                  >
                    Đổi mật khẩu
                  </Button>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Grid>
    </Box>
  );
}