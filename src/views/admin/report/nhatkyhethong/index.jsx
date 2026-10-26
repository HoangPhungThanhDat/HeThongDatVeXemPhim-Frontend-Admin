import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box, Grid, Text, SimpleGrid, Flex, Icon, useColorModeValue, useColorMode,
  useBreakpointValue, Badge, Input, Select, Button, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  keyframes, Spinner, useToast, Avatar, AvatarBadge, Tooltip as ChakraTooltip, VStack
} from "@chakra-ui/react";
import {
  MdOutlineFactCheck, MdWarningAmber, MdPeopleAlt, MdWifiTethering,
  MdSearch, MdFileDownload, MdDarkMode, MdLightMode, MdVisibility,
  MdLogin, MdLogout, MdEdit, MdDeleteForever, MdAddCircle,
  MdSettingsSuggest, MdAdminPanelSettings, MdOutlineReceiptLong,
  MdComputer, MdSmartphone, MdPublic, MdHistory, MdErrorOutline,
} from "react-icons/md";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart, Cell,
} from "recharts";
import AuditLogApi from "api/admin/AuditLogApi";

/* ─────────────────── PALETTE ─────────────────── */
const OR = "#ea580c";
const ORL = "#fb923c";

/* ─────────────────── ACTION CFG ─────────────────── */
const ACTION_CFG = {
  "Đăng nhập":          { icon: MdLogin,               color: "#48BB78" },
  "Đăng xuất":          { icon: MdLogout,              color: "#94a3b8" },
  "Tạo dữ liệu":        { icon: MdAddCircle,           color: "#0284c7" },
  "Sửa dữ liệu":        { icon: MdEdit,                color: OR },
  "Xóa dữ liệu":        { icon: MdDeleteForever,       color: "#dc2626" },
  "Xuất báo cáo":       { icon: MdOutlineReceiptLong,  color: "#7c3aed" },
  "Phân quyền":         { icon: MdAdminPanelSettings,  color: "#9F7AEA" },
  "Cấu hình hệ thống":  { icon: MdSettingsSuggest,     color: "#0f172a" },
  "Xử lý hoàn tiền":    { icon: MdOutlineFactCheck,    color: "#FC8181" },
};
const ACTION_TYPES = Object.keys(ACTION_CFG);

/* ─────────────────── KEYFRAMES ─────────────────── */
const fadeUp = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`;
const scaleIn = keyframes`from { opacity: 0; transform: scale(0.97) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); }`;
const pulseRing = keyframes`0% { box-shadow: 0 0 0 0 rgba(220,38,38,.35); } 100% { box-shadow: 0 0 0 9px rgba(220,38,38,0); }`;

/* ─────────────────── ANIMATED COUNTER ─────────────────── */
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const numericVal = parseFloat(String(value).replace(/[^\d.]/g, ""));
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(numericVal * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <>{prefix}{display.toLocaleString("vi-VN")}{suffix}</>;
}

/* ─────────────────── KPI CARD ─────────────────── */
function KpiCard({ icon, label, value, prefix, suffix, iconColor, trend, trendLabel, pulse }) {
  const cardBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");
  const cardHoverBg = useColorModeValue("gray.50", "rgba(255,255,255,0.06)");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const trendLabelColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const shadowColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(0,0,0,0.4)");

  return (
    <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" p="20px" position="relative" overflow="hidden" transition="all 0.3s ease" boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
      _hover={{ bg: cardHoverBg, borderColor: `${iconColor}59`, transform: "translateY(-3px)", boxShadow: `0 16px 40px ${shadowColor}, 0 0 0 1px ${iconColor}1a` }}
      _before={{ content: '""', position: "absolute", top: 0, left: 0, right: 0, h: "2px", bgGradient: `linear(to-r, transparent, ${iconColor}, transparent)` }}>
      <Box position="absolute" top="-20px" right="-20px" w="80px" h="80px" borderRadius="full" bg={iconColor} opacity={0.07} filter="blur(20px)" pointerEvents="none" />
      <Flex align="center" justify="space-between" mb="16px">
        <Flex w="42px" h="42px" borderRadius="12px" bg={`${iconColor}18`} border={`1px solid ${iconColor}30`} align="center" justify="center" position="relative">
          <Icon as={icon} boxSize="20px" color={iconColor} />
          {pulse && <Box position="absolute" inset="0" borderRadius="12px" sx={{ animation: `${pulseRing} 1.6s ease-out infinite` }} />}
        </Flex>
        {trend !== undefined && (
          <Badge bg={trend > 0 ? "rgba(72,187,120,0.15)" : "rgba(252,129,129,0.15)"} color={trend > 0 ? "#38A169" : "#E53E3E"} border={`1px solid ${trend > 0 ? "rgba(72,187,120,0.3)" : "rgba(252,129,129,0.3)"}`} borderRadius="8px" px="8px" py="3px" fontSize="xs" fontWeight="700">
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </Badge>
        )}
      </Flex>
      <Text fontSize="xs" color={labelColor} fontWeight="600" letterSpacing="0.1em" textTransform="uppercase" mb="6px">{label}</Text>
      <Text fontSize="2xl" fontWeight="800" color={textColor} letterSpacing="-0.5px"><AnimatedNumber value={value} prefix={prefix} suffix={suffix} /></Text>
      {trendLabel && <Text fontSize="xs" color={trendLabelColor} mt="6px">{trendLabel}</Text>}
    </Box>
  );
}

/* ─────────────────── CHART CARD ─────────────────── */
function ChartCard({ accentColor, children }) {
  const cardBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");
  return (
    <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" p="24px" position="relative" overflow="hidden" boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
      _before={{ content: '""', position: "absolute", top: 0, left: 0, right: 0, h: "2px", bgGradient: `linear(to-r, transparent, ${accentColor}, transparent)` }}>
      {children}
    </Box>
  );
}

/* ─────────────────── BADGES ─────────────────── */
function StatusBadge({ status }) {
  const isAbnormal = status === "Bất thường";
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px" display="inline-flex" w="fit-content" bg={isAbnormal ? "rgba(220,38,38,0.1)" : "rgba(72,187,120,0.12)"} border={`1px solid ${isAbnormal ? "rgba(220,38,38,0.35)" : "rgba(72,187,120,0.3)"}`}>
      <Box w="6px" h="6px" borderRadius="full" bg={isAbnormal ? "#dc2626" : "#48BB78"} sx={isAbnormal ? { animation: `${pulseRing} 1.6s ease-out infinite` } : {}} />
      <Text fontSize="11.5px" fontWeight="700" color={isAbnormal ? "#dc2626" : "#38A169"} whiteSpace="nowrap">{status}</Text>
    </Flex>
  );
}

function ActionBadge({ action }) {
  const cfg = ACTION_CFG[action] || { icon: MdHistory, color: "#94a3b8" };
  return (
    <Flex align="center" gap="5px" px="9px" py="5px" borderRadius="8px" display="inline-flex" w="fit-content" bg={`${cfg.color}14`} border={`1px solid ${cfg.color}35`}>
      <Icon as={cfg.icon} boxSize="11px" color={cfg.color} />
      <Text fontSize="11px" fontWeight="700" color={cfg.color} whiteSpace="nowrap">{action}</Text>
    </Flex>
  );
}

/* ─────────────────── LOG DETAIL MODAL ─────────────────── */
function LogDetailModal({ log, onClose, isDark }) {
  const cardBg = useColorModeValue("#f8fafc", "#2d3748");
  const cardBorder = useColorModeValue("#f1f5f9", "#4a5568");
  const textColor = useColorModeValue("#0f172a", "#f7fafc");
  const subText = useColorModeValue("#94a3b8", "#718096");

  if (!log) return null;
  const isAbnormal = log.status === "Bất thường";
  const displayIp = log.ip === '::1' ? '127.0.0.1' : log.ip;

  return (
    <Modal isOpen={!!log} onClose={onClose} isCentered size="4xl">
      <ModalOverlay backdropFilter="blur(12px)" bg="rgba(15,23,42,.75)" />
      <ModalContent borderRadius="28px" overflow="hidden" border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"} bg={isDark ? "#1a202c" : "#ffffff"} boxShadow="0 40px 100px rgba(0,0,0,.4)" sx={{ animation: `${scaleIn} .3s cubic-bezier(.22,1,.36,1) both` }}>
        
        <Box bg={isAbnormal ? "linear-gradient(135deg,#dc2626,#f87171)" : `linear-gradient(135deg, ${OR}, ${ORL})`} pt="24px" pb="20px" px="28px" position="relative">
          <Flex align="center" justify="space-between">
             <Flex align="center" gap="16px">
               <Box w="52px" h="52px" borderRadius="16px" bg="rgba(255,255,255,0.2)" backdropFilter="blur(10px)" display="flex" alignItems="center" justifyContent="center" border="1px solid rgba(255,255,255,0.3)">
                 <Icon as={isAbnormal ? MdWarningAmber : MdOutlineFactCheck} boxSize="26px" color="white" />
               </Box>
               <Box>
                 <Text fontSize="20px" fontWeight="800" color="white" letterSpacing="-0.5px">Chi tiết nhật ký</Text>
                 <Flex align="center" gap="8px" mt="4px">
                   <Badge bg="rgba(255,255,255,0.2)" color="white" borderRadius="md" px="8px" py="2px" fontSize="11px" fontWeight="700">Mã log: #{log.id}</Badge>
                   <Text fontSize="13px" color="rgba(255,255,255,0.9)" fontWeight="500">{log.time}</Text>
                 </Flex>
               </Box>
             </Flex>
             <ModalCloseButton color="white" position="static" borderRadius="full" bg="rgba(255,255,255,0.2)" _hover={{ bg: "rgba(255,255,255,0.3)" }} />
          </Flex>
        </Box>

        <ModalBody p="0">
          <Grid templateColumns={{ base: "1fr", md: "1.2fr 1fr" }} minH="380px">
            
            <Box p="28px" borderRight={{ md: isDark ? "1px solid #2d3748" : "1px solid #f1f5f9" }}>
              <Flex gap="10px" mb="24px" flexWrap="wrap">
                <ActionBadge action={log.action} />
                <StatusBadge status={log.status} />
              </Flex>

              {isAbnormal && log.reason && (
                <Flex align="flex-start" gap="10px" p="16px" borderRadius="14px" mb="24px" bg="rgba(220,38,38,0.08)" border="1px solid rgba(220,38,38,0.25)">
                  <Icon as={MdErrorOutline} boxSize="20px" color="#dc2626" mt="1px" flexShrink="0" />
                  <Box>
                    <Text fontSize="14px" fontWeight="700" color="#dc2626" mb="4px">Cảnh báo bảo mật</Text>
                    <Text fontSize="13px" fontWeight="500" color="#dc2626" lineHeight="1.5">{log.reason}</Text>
                  </Box>
                </Flex>
              )}

              <Box mb="28px">
                <Text fontSize="11px" fontWeight="800" color={subText} letterSpacing="1.2px" textTransform="uppercase" mb="8px">Nội dung thao tác</Text>
                <Box p="18px" borderRadius="16px" bg={cardBg} border={`1px solid ${cardBorder}`}>
                  <Text fontSize="16px" fontWeight="600" color={textColor} lineHeight="1.6">{log.target}</Text>
                </Box>
              </Box>

              <Box>
                <Text fontSize="11px" fontWeight="800" color={subText} letterSpacing="1.2px" textTransform="uppercase" mb="12px">Người thực hiện</Text>
                <Flex align="center" gap="16px" p="16px" borderRadius="16px" bg={cardBg} border={`1px solid ${cardBorder}`}>
                  <Avatar size="xl" name={log.user} bg={isAbnormal ? "#dc2626" : OR} color="white" fontWeight="bold" boxShadow="0 8px 20px rgba(0,0,0,0.1)">
                    <AvatarBadge boxSize="1.2em" bg={log.user === 'Khách vãng lai' ? "gray.500" : "green.500"} />
                  </Avatar>
                  <Box flex="1" minW="0">
                    <Text fontSize="16px" fontWeight="800" color={textColor} noOfLines={1}>{log.user}</Text>
                    <Badge mt="6px" bg={isDark ? "whiteAlpha.200" : "gray.100"} color={isDark ? "white" : "gray.700"} borderRadius="md" px="8px" py="2px" fontSize="11px" fontWeight="700">
                      {log.role}
                    </Badge>
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Box p="28px" bg={isDark ? "rgba(0,0,0,0.1)" : "#fafbfc"}>
              <Text fontSize="11px" fontWeight="800" color={subText} letterSpacing="1.2px" textTransform="uppercase" mb="16px">Thông tin kỹ thuật</Text>
              
              <VStack spacing="16px" align="stretch">
                <Flex align="center" gap="14px" p="16px" borderRadius="16px" bg={isDark ? "whiteAlpha.50" : "white"} border={`1px solid ${cardBorder}`} boxShadow="0 2px 8px rgba(0,0,0,0.02)">
                  <Box w="42px" h="42px" borderRadius="12px" bg={`${OR}15`} display="flex" alignItems="center" justifyContent="center" flexShrink="0">
                    <Icon as={log.device.includes("Android") || log.device.includes("iOS") ? MdSmartphone : MdComputer} boxSize="22px" color={OR} />
                  </Box>
                  <Box flex="1" minW="0">
                    <Text fontSize="10px" fontWeight="800" color={subText} letterSpacing="1px" textTransform="uppercase" mb="2px">Thiết bị / Trình duyệt</Text>
                    <ChakraTooltip label={log.device} placement="top" hasArrow>
                      <Text fontSize="13px" fontWeight="600" color={textColor} noOfLines={2}>{log.device}</Text>
                    </ChakraTooltip>
                  </Box>
                </Flex>

                <Flex align="center" gap="14px" p="16px" borderRadius="16px" bg={isDark ? "whiteAlpha.50" : "white"} border={`1px solid ${cardBorder}`} boxShadow="0 2px 8px rgba(0,0,0,0.02)">
                  <Box w="42px" h="42px" borderRadius="12px" bg={`${OR}15`} display="flex" alignItems="center" justifyContent="center" flexShrink="0">
                    <Icon as={MdWifiTethering} boxSize="22px" color={OR} />
                  </Box>
                  <Box>
                    <Text fontSize="10px" fontWeight="800" color={subText} letterSpacing="1px" textTransform="uppercase" mb="2px">Địa chỉ IP</Text>
                    <Text fontSize="14px" fontWeight="700" color={textColor}>{displayIp}</Text>
                  </Box>
                </Flex>

                <Flex align="center" gap="14px" p="16px" borderRadius="16px" bg={isDark ? "whiteAlpha.50" : "white"} border={`1px solid ${cardBorder}`} boxShadow="0 2px 8px rgba(0,0,0,0.02)">
                  <Box w="42px" h="42px" borderRadius="12px" bg={`${OR}15`} display="flex" alignItems="center" justifyContent="center" flexShrink="0">
                    <Icon as={MdPublic} boxSize="22px" color={OR} />
                  </Box>
                  <Box>
                    <Text fontSize="10px" fontWeight="800" color={subText} letterSpacing="1px" textTransform="uppercase" mb="2px">Vị trí</Text>
                    <Text fontSize="14px" fontWeight="700" color={textColor}>{log.location}</Text>
                  </Box>
                </Flex>

                <Flex align="center" gap="14px" p="16px" borderRadius="16px" bg={isDark ? "whiteAlpha.50" : "white"} border={`1px solid ${cardBorder}`} boxShadow="0 2px 8px rgba(0,0,0,0.02)">
                  <Box w="42px" h="42px" borderRadius="12px" bg={`${OR}15`} display="flex" alignItems="center" justifyContent="center" flexShrink="0">
                    <Icon as={MdHistory} boxSize="22px" color={OR} />
                  </Box>
                  <Box>
                    <Text fontSize="10px" fontWeight="800" color={subText} letterSpacing="1px" textTransform="uppercase" mb="2px">Thời gian ghi nhận</Text>
                    <Text fontSize="14px" fontWeight="700" color={textColor}>{log.time}</Text>
                  </Box>
                </Flex>
              </VStack>
            </Box>
          </Grid>
        </ModalBody>
        
        <ModalFooter borderTop={isDark ? "1px solid #2d3748" : "1px solid #f1f5f9"} gap="12px" p="20px 28px" bg={isDark ? "#1a202c" : "white"}>
          <Button variant="ghost" mr={3} onClick={onClose} borderRadius="12px" h="44px" px="20px" fontWeight="600" color={subText} _hover={{ bg: isDark ? "whiteAlpha.100" : "gray.100" }}>
            Đóng
          </Button>
          <Button h="44px" px="24px" borderRadius="12px" fontWeight="700" fontSize="14px" color="white" bg={`linear-gradient(135deg, ${OR}, ${ORL})`} boxShadow={`0 4px 14px rgba(234,88,12,0.3)`} _hover={{ boxShadow: `0 8px 24px rgba(234,88,12,0.4)`, transform: "translateY(-1px)" }} onClick={onClose}>
            Xác nhận đã xem
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* ─────────────────── MOBILE CARD ─────────────────── */
function MobileLogCard({ log, index, onView, isDark }) {
  const isAbnormal = log.status === "Bất thường";
  return (
    <Box p="14px" borderRadius="12px" bg={isDark ? "rgba(255,255,255,0.03)" : "white"} border={`1.5px solid ${isAbnormal ? "rgba(220,38,38,0.35)" : (isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9")}`} boxShadow="0 1px 4px rgba(0,0,0,.04)" sx={{ animation:`${fadeUp} .35s ease ${index*.03}s both` }} onClick={() => onView(log)}>
      <Flex justify="space-between" align="flex-start" mb="8px"><ActionBadge action={log.action} /><StatusBadge status={log.status} /></Flex>
      <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} mb="4px" noOfLines={2}>{log.target}</Text>
      <Flex align="center" gap="6px" mb="4px"><Icon as={MdPeopleAlt} boxSize="11px" color={isDark ? "#718096" : "#94a3b8"} /><Text fontSize="11.5px" color={isDark ? "#a0aec0" : "#64748b"} noOfLines={1}>{log.user}</Text></Flex>
      <Flex align="center" justify="space-between"><Flex align="center" gap="5px"><Icon as={MdHistory} boxSize="11px" color={isDark ? "#718096" : "#94a3b8"} /><Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>{log.time}</Text></Flex><Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>{log.ip === '::1' ? '127.0.0.1' : log.ip}</Text></Flex>
    </Box>
  );
}

/* ─────────────────── COLUMN WIDTHS ─────────────────── */
const COL = { time: "142px", user: "190px", action: "140px", target: "1", ip: "116px", status: "118px", actions: "70px" };

function CH({ children, w, flex, pr, isDark }) {
  const c = useColorModeValue("gray.400", "whiteAlpha.400");
  return (
    <Box w={w} flex={flex} flexShrink={w ? "0" : undefined} pr={pr || "0"}>
      <Text fontSize="10px" fontWeight="800" color={c} letterSpacing="1px" textTransform="uppercase">{children}</Text>
    </Box>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function NhatKyHeThong() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterRange, setFilterRange] = useState("7 days");

  const [logs, setLogs] = useState([]);
  const [kpi, setKpi] = useState({ totalToday: 0, abnormal: 0, activeUsers: 0, ipMonitoring: 0 });
  const [activityByHour, setActivityByHour] = useState([]);
  const [actionsByType, setActionsByType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLog, setDetailLog] = useState(null);
  const [exporting, setExporting] = useState(false);

  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const mutedTextColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const axisTickColor = useColorModeValue("rgba(0,0,0,0.45)", "rgba(255,255,255,0.4)");
  const gridStroke = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.05)");
  const dotStrokeColor = useColorModeValue("#ffffff", "#1a1a2e");
  const pillBg = useColorModeValue("rgba(234,88,12,0.08)", "rgba(234,88,12,0.1)");
  const pillBorder = useColorModeValue("rgba(234,88,12,0.3)", "rgba(234,88,12,0.2)");
  const liveTextColor = useColorModeValue("gray.600", "whiteAlpha.700");
  const tooltipBg = useColorModeValue("white", "rgba(15,15,25,0.96)");
  const tooltipBorder = useColorModeValue("rgba(234,88,12,0.4)", "rgba(234,88,12,0.3)");
  const tooltipLabelColor = useColorModeValue("gray.500", "whiteAlpha.600");
  const cardBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");
  const inputBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.04)");
  const inputBorder = useColorModeValue("#e8edf3", "rgba(255,255,255,0.1)");

  // ⭐ HÀM GỌI API (Tách ra để tái sử dụng cho cả lần đầu và auto-refresh)
  const fetchLogs = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      const res = await AuditLogApi.getLogs({ search: search, action: filterAction, status: filterStatus, range: filterRange });
      const result = res.data?.data || res.data || res;
      
      setLogs(result.logs || []);
      setKpi(result.kpi || { totalToday: 0, abnormal: 0, activeUsers: 0, ipMonitoring: 0 });
      setActivityByHour(result.activityByHour || []);
      setActionsByType(result.actionsByType || []);
    } catch (error) {
      console.error("❌ Lỗi tải nhật ký:", error);
      if (!isBackground) {
        toast({ title: "Lỗi tải dữ liệu", description: "Không thể tải nhật ký hệ thống", status: "error", duration: 3000 });
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // ⭐ EFFECT 1: Lắng nghe bộ lọc và tải lần đầu
  useEffect(() => {
    const timer = setTimeout(() => { fetchLogs(false); }, 500); // Debounce 500ms
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterAction, filterStatus, filterRange]);

  // ⭐ EFFECT 2: Tự động cập nhật mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      // Chỉ tự động cập nhật nếu ô tìm kiếm đang trống
      if (!search) {
        fetchLogs(true); // Truyền true để chạy ngầm (không hiện loading)
      }
    }, 30000); // 30 giây

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]); // Chỉ reset interval khi search thay đổi

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      toast({ title: "Xuất file thành công", status: "success", duration: 2000 });
    }, 1400);
  };

  return (
    <Box pt={{ base: "120px", md: "80px" }} px={{ base: "16px", md: "0" }} minH="100vh">
      <LogDetailModal log={detailLog} onClose={() => setDetailLog(null)} isDark={isDark} />

      <Flex align="flex-start" justify="space-between" mb="28px" flexWrap="wrap" gap="12px">
        <Box>
          <Flex align="center" gap="10px" mb="6px">
            <Box w="3px" h="28px" borderRadius="2px" bgGradient={`linear(to-b, ${OR}, ${ORL})`} />
            <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color={textColor} letterSpacing="-0.5px">Nhật ký hệ thống</Text>
          </Flex>
          <Text color={subTextColor} fontSize="sm" pl="13px">Theo dõi toàn bộ hoạt động & phát hiện thao tác bất thường • Chỉ Admin</Text>
        </Box>
        <Flex align="center" gap="10px" flexWrap="wrap">
          <Flex align="center" gap="8px" bg={pillBg} border="1px solid" borderColor={pillBorder} borderRadius="12px" px="14px" py="8px">
            <Box w="7px" h="7px" borderRadius="full" bg="#48BB78" boxShadow="0 0 8px #48BB78" />
            <Text fontSize="xs" color={liveTextColor} fontWeight="600">Ghi log thời gian thực</Text>
          </Flex>
          <Button h="38px" w="38px" minW="38px" p="0" borderRadius="10px" bg={isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"} color={isDark ? "#e2e8f0" : "#475569"} border={isDark ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e2e8f0"} onClick={toggleColorMode}>
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="16px" />
          </Button>
          <Button h="38px" px="16px" borderRadius="10px" fontWeight="700" fontSize="12px" color="white" bg={`linear-gradient(135deg,${OR},${ORL})`} boxShadow="0 3px 12px rgba(234,88,12,.28)" _hover={{ boxShadow: "0 6px 20px rgba(234,88,12,.4)", transform: "translateY(-1px)" }} _active={{ transform: "translateY(0)" }} transition="all .2s" isLoading={exporting} loadingText="Đang export..." leftIcon={<Icon as={MdFileDownload} boxSize="14px" />} onClick={handleExport}>Export log</Button>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="16px" mb="20px">
        <KpiCard icon={MdOutlineFactCheck} label="Tổng log hôm nay" value={kpi.totalToday} iconColor={OR} trend={14} trendLabel="so với hôm qua" />
        <KpiCard icon={MdWarningAmber} label="Thao tác bất thường" value={kpi.abnormal} iconColor="#dc2626" pulse trendLabel="cần kiểm tra ngay" />
        <KpiCard icon={MdPeopleAlt} label="Người dùng hoạt động" value={kpi.activeUsers} iconColor="#76E4F7" trend={6} trendLabel="trong 24 giờ qua" />
        <KpiCard icon={MdWifiTethering} label="IP giám sát" value={kpi.ipMonitoring} iconColor="#9F7AEA" trendLabel="phiên đang theo dõi" />
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", xl: "3fr 2fr" }} gap="20px" mb="20px">
        <ChartCard accentColor={OR}>
          <Flex justify="space-between" align="center" mb="20px" flexWrap="wrap" gap="10px">
            <Box>
              <Text fontSize="lg" fontWeight="700" color={textColor}>Hoạt động theo giờ</Text>
              <Text fontSize="xs" color={mutedTextColor} mt="2px">Số lượt thao tác ghi nhận hôm nay</Text>
            </Box>
          </Flex>
          <Box h="260px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityByHour}>
                <defs><linearGradient id="gradOrangeLog" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={OR} stopOpacity={0.28} /><stop offset="95%" stopColor={OR} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <Box bg={tooltipBg} border={`1px solid ${tooltipBorder}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
                      <Text fontSize="xs" color={tooltipLabelColor} mb="4px" fontWeight="600">Lúc {label}</Text>
                      <Text fontSize="sm" fontWeight="700" color={OR}>{payload[0].value} thao tác</Text>
                    </Box>
                  );
                }} />
                <Area type="monotone" dataKey="actions" stroke={OR} strokeWidth={3} fill="url(#gradOrangeLog)" dot={{ r: 4, fill: OR, stroke: dotStrokeColor, strokeWidth: 2 }} activeDot={{ r: 6, fill: OR, stroke: dotStrokeColor, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>

        <ChartCard accentColor="#9F7AEA">
          <Text fontSize="lg" fontWeight="700" color={textColor} mb="4px">Phân loại thao tác</Text>
          <Text fontSize="xs" color={mutedTextColor} mb="20px">Tổng theo loại trong 7 ngày qua</Text>
          <Box h="220px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionsByType} layout="vertical" barSize={16} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={90} tick={{ fill: axisTickColor, fontSize: 11.5, fontWeight: 600 }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <Box bg={tooltipBg} border={`1px solid ${tooltipBorder}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
                      <Text fontSize="xs" color={tooltipLabelColor} mb="4px">{label}</Text>
                      <Text fontSize="sm" fontWeight="700" color={payload[0].payload.color}>{payload[0].value} log</Text>
                    </Box>
                  );
                }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {actionsByType.map((entry, i) => <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 2px 8px ${entry.color}50)` }} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>
      </Grid>

      <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" overflow="hidden" boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")} sx={{ animation: `${fadeUp} .4s ease .1s both` }}>
        <Box p={{ base: "16px", md: "20px 22px" }} borderBottom="1px solid" borderColor={cardBorder}>
          <Flex align="center" justify="space-between" mb="14px" flexWrap="wrap" gap="10px">
            <Flex align="center" gap="8px">
              <Icon as={MdHistory} boxSize="16px" color={OR} />
              <Text fontWeight="800" fontSize="15px" color={textColor}>Nhật ký hoạt động</Text>
              <Badge bg={pillBg} color={OR} border={`1px solid ${pillBorder}`} borderRadius="6px" px="8px" py="1px" fontSize="11px" fontWeight="700">{logs.length} bản ghi</Badge>
            </Flex>
          </Flex>
          <Grid templateColumns={{ base: "1fr", md: "1fr 170px 160px 150px" }} gap="10px">
            <Box position="relative">
              <Icon as={MdSearch} position="absolute" left="12px" top="50%" transform="translateY(-50%)" boxSize="15px" color={mutedTextColor} zIndex="1" />
              <Input pl="34px" h="40px" fontSize="13px" fontWeight="500" placeholder="Tìm theo người dùng, IP, nội dung..." bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" color={textColor} _placeholder={{ color: mutedTextColor }} _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }} _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s" value={search} onChange={e => setSearch(e.target.value)} />
            </Box>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor} bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }} _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s" value={filterAction} onChange={e => setFilterAction(e.target.value)}>
              <option value="Tất cả">Tất cả thao tác</option>
              {ACTION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor} bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }} _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Bình thường">Bình thường</option>
              <option value="Bất thường">Bất thường</option>
            </Select>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor} bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }} _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s" value={filterRange} onChange={e => setFilterRange(e.target.value)}>
              <option value="today">Hôm nay</option>
              <option value="7 days">7 ngày qua</option>
              <option value="30 days">30 ngày qua</option>
            </Select>
          </Grid>
        </Box>

        {!isMobile && (
          <Flex align="center" px="20px" py="10px" bg={useColorModeValue("#fafbfc", "rgba(255,255,255,0.02)")} borderBottom="1px solid" borderColor={cardBorder}>
            <CH w={COL.time}>Thời gian</CH>
            <CH w={COL.user} pr="10px">Người dùng</CH>
            <CH w={COL.action} pr="10px">Thao tác</CH>
            <CH flex="1" pr="10px">Mô tả</CH>
            <CH w={COL.ip} pr="10px">IP</CH>
            <CH w={COL.status} pr="10px">Trạng thái</CH>
            <CH w={COL.actions}>Xem</CH>
          </Flex>
        )}

        <Box p={{ base: "12px", md: "10px" }}>
          {loading ? (
            <Flex direction="column" align="center" justify="center" py="40px" color={mutedTextColor}>
              <Spinner size="xl" color={OR} thickness="4px" mb="10px" />
              <Text fontSize="13px" fontWeight="600">Đang tải nhật ký...</Text>
            </Flex>
          ) : logs.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px" color={mutedTextColor}>
              <Icon as={MdHistory} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600">Không tìm thấy bản ghi nào</Text>
            </Flex>
          ) : isMobile ? (
            <Flex direction="column" gap="8px">
              {logs.map((l, i) => <MobileLogCard key={l.id} log={l} index={i} onView={setDetailLog} isDark={isDark} />)}
            </Flex>
          ) : (
            <Flex direction="column" gap="6px">
              {logs.map((l, i) => {
                const isAbnormal = l.status === "Bất thường";
                return (
                  <Flex key={l.id} align="center" px="16px" py="12px" borderRadius="10px" bg={isAbnormal ? "rgba(220,38,38,0.04)" : (isDark ? "rgba(255,255,255,0.015)" : "white")} border={`1.5px solid ${isAbnormal ? "rgba(220,38,38,0.25)" : (isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9")}`} transition="all .2s" cursor="pointer" _hover={{ border: `1.5px solid ${isAbnormal ? "rgba(220,38,38,0.45)" : "rgba(234,88,12,0.35)"}`, transform: "translateY(-1px)" }} sx={{ animation: `${fadeUp} .3s ease ${i*.03}s both` }} onClick={() => setDetailLog(l)}>
                    <Box w={COL.time} flexShrink="0"><Text fontSize="11.5px" fontWeight="700" color={textColor}>{l.time}</Text></Box>
                    <Box w={COL.user} flexShrink="0" pr="10px"><Text fontSize="12px" fontWeight="700" color={textColor} noOfLines={1}>{l.user}</Text><Text fontSize="10.5px" color={mutedTextColor} noOfLines={1}>{l.role}</Text></Box>
                    <Box w={COL.action} flexShrink="0" pr="10px"><ActionBadge action={l.action} /></Box>
                    <Box flex="1" minW="0" pr="10px"><Text fontSize="12px" fontWeight="500" color={useColorModeValue("#334155", "#e2e8f0")} noOfLines={1}>{l.target}</Text></Box>
                    <Box w={COL.ip} flexShrink="0" pr="10px"><Text fontSize="11.5px" fontWeight="600" color={mutedTextColor}>{l.ip === '::1' ? '127.0.0.1' : l.ip}</Text></Box>
                    <Box w={COL.status} flexShrink="0" pr="10px"><StatusBadge status={l.status} /></Box>
                    <Box w={COL.actions} flexShrink="0"><Button size="xs" h="28px" w="28px" minW="28px" px="0" borderRadius="7px" bg={isDark ? "rgba(255,255,255,0.05)" : "#f8fafc"} color={isDark ? "#e2e8f0" : "#475569"} border={isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0"} _hover={{ bg: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9" }} onClick={(e) => { e.stopPropagation(); setDetailLog(l); }}><Icon as={MdVisibility} boxSize="13px" /></Button></Box>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}