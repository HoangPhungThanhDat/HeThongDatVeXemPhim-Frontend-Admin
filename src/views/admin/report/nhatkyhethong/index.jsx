import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Grid,
  Text,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  useColorMode,
  useBreakpointValue,
  Badge,
  Input,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  keyframes,
} from "@chakra-ui/react";
import {
  MdOutlineFactCheck,
  MdWarningAmber,
  MdPeopleAlt,
  MdWifiTethering,
  MdSearch,
  MdFileDownload,
  MdFilterAlt,
  MdClose,
  MdDarkMode,
  MdLightMode,
  MdVisibility,
  MdCheckCircle,
  MdLogin,
  MdLogout,
  MdEdit,
  MdDeleteForever,
  MdAddCircle,
  MdSettingsSuggest,
  MdAdminPanelSettings,
  MdOutlineReceiptLong,
  MdComputer,
  MdSmartphone,
  MdPublic,
  MdHistory,
  MdErrorOutline,
} from "react-icons/md";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  Cell,
} from "recharts";

/* ─────────────────── PALETTE (Orange primary) ─────────────────── */
const OR = "#ea580c";
const ORL = "#fb923c";
const ACCENTS = { orange: "#ea580c", red: "#FC8181", cyan: "#76E4F7", purple: "#9F7AEA", green: "#48BB78" };

/* ─────────────────── DATA ─────────────────── */

const ACTION_TYPES = [
  "Đăng nhập", "Đăng xuất", "Tạo dữ liệu", "Sửa dữ liệu",
  "Xóa dữ liệu", "Xuất báo cáo", "Phân quyền", "Cấu hình hệ thống", "Xử lý hoàn tiền",
];

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

const activityByHour = [
  { time: "0h", actions: 4 }, { time: "3h", actions: 2 }, { time: "6h", actions: 8 },
  { time: "9h", actions: 42 }, { time: "12h", actions: 58 }, { time: "15h", actions: 71 },
  { time: "18h", actions: 64 }, { time: "21h", actions: 33 },
];

const actionsByType = [
  { name: "Đăng nhập", count: 186, color: "#48BB78" },
  { name: "Sửa dữ liệu", count: 124, color: OR },
  { name: "Tạo dữ liệu", count: 96, color: "#0284c7" },
  { name: "Xóa dữ liệu", count: 21, color: "#dc2626" },
  { name: "Xuất báo cáo", count: 34, color: "#7c3aed" },
];

const INIT_LOGS = [
  {
    id: 1, time: "22/05/2026 09:14:32", user: "admin@gaufilm.vn", role: "Admin",
    action: "Xóa dữ liệu", target: "Xóa vé VE0231 (hoàn tiền khách hàng)",
    ip: "118.70.12.44", device: "Chrome · Windows", location: "TP. Hồ Chí Minh",
    status: "Bình thường",
  },
  {
    id: 2, time: "22/05/2026 08:57:10", user: "backoffice.linh@gaufilm.vn", role: "Back-office Staff",
    action: "Sửa dữ liệu", target: "Cập nhật suất chiếu Avengers: Endgame — 20:00",
    ip: "27.72.88.19", device: "Firefox · macOS", location: "Hà Nội",
    status: "Bình thường",
  },
  {
    id: 3, time: "22/05/2026 03:22:05", user: "unknown@mail.ru", role: "—",
    action: "Đăng nhập", target: "5 lần đăng nhập thất bại liên tiếp — tài khoản admin@gaufilm.vn",
    ip: "203.0.113.77", device: "Không xác định", location: "Nước ngoài (VPN nghi ngờ)",
    status: "Bất thường", reason: "Nhiều lần đăng nhập sai mật khẩu bất thường vào lúc nửa đêm.",
  },
  {
    id: 4, time: "21/05/2026 22:10:41", user: "admin@gaufilm.vn", role: "Admin",
    action: "Phân quyền", target: "Gán role Back-office Staff cho tài khoản hoang.mai@gaufilm.vn",
    ip: "118.70.12.44", device: "Chrome · Windows", location: "TP. Hồ Chí Minh",
    status: "Bình thường",
  },
  {
    id: 5, time: "21/05/2026 20:03:18", user: "backoffice.tuan@gaufilm.vn", role: "Back-office Staff",
    action: "Xử lý hoàn tiền", target: "Đề xuất hoàn tiền đơn HD1092 — chờ Admin duyệt",
    ip: "42.117.5.201", device: "Edge · Windows", location: "Đà Nẵng",
    status: "Bình thường",
  },
  {
    id: 6, time: "21/05/2026 19:41:57", user: "admin@gaufilm.vn", role: "Admin",
    action: "Cấu hình hệ thống", target: "Thay đổi tỷ lệ tích điểm hội viên 1.000đ → 1 điểm",
    ip: "118.70.12.44", device: "Chrome · Windows", location: "TP. Hồ Chí Minh",
    status: "Bình thường",
  },
  {
    id: 7, time: "21/05/2026 14:12:09", user: "staff.rap01@gaufilm.vn", role: "Staff tại rạp",
    action: "Xuất báo cáo", target: "Export danh sách vé đã bán rạp CGV Landmark",
    ip: "14.187.9.33", device: "Chrome · Android", location: "TP. Hồ Chí Minh",
    status: "Bình thường",
  },
  {
    id: 8, time: "21/05/2026 11:05:52", user: "admin@gaufilm.vn", role: "Admin",
    action: "Xóa dữ liệu", target: "Xóa tài khoản nhân viên vi phạm: le.van.c@gaufilm.vn",
    ip: "45.61.187.9", device: "Chrome · Windows", location: "IP lạ — chưa từng đăng nhập",
    status: "Bất thường", reason: "IP đăng nhập chưa từng ghi nhận trước đó cho tài khoản Admin.",
  },
  {
    id: 9, time: "20/05/2026 16:30:00", user: "backoffice.linh@gaufilm.vn", role: "Back-office Staff",
    action: "Tạo dữ liệu", target: "Thêm voucher mới SUMMER25 (giảm 25%)",
    ip: "27.72.88.19", device: "Firefox · macOS", location: "Hà Nội",
    status: "Bình thường",
  },
  {
    id: 10, time: "20/05/2026 09:00:00", user: "admin@gaufilm.vn", role: "Admin",
    action: "Đăng nhập", target: "Đăng nhập hệ thống thành công",
    ip: "118.70.12.44", device: "Chrome · Windows", location: "TP. Hồ Chí Minh",
    status: "Bình thường",
  },
];

/* ─────────────────── KEYFRAMES ─────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
`;
const pulseRing = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(220,38,38,.35); }
  100% { box-shadow: 0 0 0 9px rgba(220,38,38,0); }
`;

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
    <Box
      bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" p="20px"
      position="relative" overflow="hidden" transition="all 0.3s ease"
      boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
      _hover={{
        bg: cardHoverBg, borderColor: `${iconColor}59`, transform: "translateY(-3px)",
        boxShadow: `0 16px 40px ${shadowColor}, 0 0 0 1px ${iconColor}1a`,
      }}
      _before={{
        content: '""', position: "absolute", top: 0, left: 0, right: 0, h: "2px",
        bgGradient: `linear(to-r, transparent, ${iconColor}, transparent)`,
      }}
    >
      <Box position="absolute" top="-20px" right="-20px" w="80px" h="80px" borderRadius="full"
        bg={iconColor} opacity={0.07} filter="blur(20px)" pointerEvents="none" />

      <Flex align="center" justify="space-between" mb="16px">
        <Flex w="42px" h="42px" borderRadius="12px" bg={`${iconColor}18`} border={`1px solid ${iconColor}30`}
          align="center" justify="center" position="relative">
          <Icon as={icon} boxSize="20px" color={iconColor} />
          {pulse && (
            <Box position="absolute" inset="0" borderRadius="12px" sx={{ animation: `${pulseRing} 1.6s ease-out infinite` }} />
          )}
        </Flex>
        {trend !== undefined && (
          <Badge
            bg={trend > 0 ? "rgba(72,187,120,0.15)" : "rgba(252,129,129,0.15)"}
            color={trend > 0 ? "#38A169" : "#E53E3E"}
            border={`1px solid ${trend > 0 ? "rgba(72,187,120,0.3)" : "rgba(252,129,129,0.3)"}`}
            borderRadius="8px" px="8px" py="3px" fontSize="xs" fontWeight="700"
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </Badge>
        )}
      </Flex>

      <Text fontSize="xs" color={labelColor} fontWeight="600" letterSpacing="0.1em" textTransform="uppercase" mb="6px">
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="800" color={textColor} letterSpacing="-0.5px">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </Text>
      {trendLabel && <Text fontSize="xs" color={trendLabelColor} mt="6px">{trendLabel}</Text>}
    </Box>
  );
}

/* ─────────────────── CHART CARD WRAPPER ─────────────────── */
function ChartCard({ accentColor, children }) {
  const cardBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");
  return (
    <Box
      bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" p="24px"
      position="relative" overflow="hidden"
      boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
      _before={{
        content: '""', position: "absolute", top: 0, left: 0, right: 0, h: "2px",
        bgGradient: `linear(to-r, transparent, ${accentColor}, transparent)`,
      }}
    >
      {children}
    </Box>
  );
}

/* ─────────────────── STATUS / ACTION BADGES ─────────────────── */
function StatusBadge({ status }) {
  const isAbnormal = status === "Bất thường";
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px" display="inline-flex" w="fit-content"
      bg={isAbnormal ? "rgba(220,38,38,0.1)" : "rgba(72,187,120,0.12)"}
      border={`1px solid ${isAbnormal ? "rgba(220,38,38,0.35)" : "rgba(72,187,120,0.3)"}`}>
      <Box w="6px" h="6px" borderRadius="full" bg={isAbnormal ? "#dc2626" : "#48BB78"}
        sx={isAbnormal ? { animation: `${pulseRing} 1.6s ease-out infinite` } : {}} />
      <Text fontSize="11.5px" fontWeight="700" color={isAbnormal ? "#dc2626" : "#38A169"} whiteSpace="nowrap">{status}</Text>
    </Flex>
  );
}

function ActionBadge({ action }) {
  const cfg = ACTION_CFG[action] || { icon: MdHistory, color: "#94a3b8" };
  return (
    <Flex align="center" gap="5px" px="9px" py="5px" borderRadius="8px" display="inline-flex" w="fit-content"
      bg={`${cfg.color}14`} border={`1px solid ${cfg.color}35`}>
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

  return (
    <Modal isOpen={!!log} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
      <ModalContent borderRadius="20px"
        border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
        bg={isDark ? "#1a202c" : "#ffffff"}
        boxShadow="0 32px 80px rgba(0,0,0,.25)"
        sx={{ animation: `${scaleIn} .3s cubic-bezier(.22,1,.36,1) both` }}>
        <Box h="4px" bg={`linear-gradient(90deg,${isAbnormal ? "#dc2626" : OR},${isAbnormal ? "#f87171" : ORL})`}
          borderRadius="20px 20px 0 0" />
        <ModalHeader>
          <Flex align="center" gap="10px">
            <Box w="36px" h="36px" borderRadius="10px"
              bg={isAbnormal ? "linear-gradient(135deg,#dc2626,#f87171)" : `linear-gradient(135deg,${OR},${ORL})`}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={isAbnormal ? "0 4px 12px rgba(220,38,38,.3)" : `0 4px 12px rgba(234,88,12,.25)`}>
              <Icon as={isAbnormal ? MdWarningAmber : MdOutlineFactCheck} boxSize="16px" color="white" />
            </Box>
            <Box>
              <Text fontSize="16px" fontWeight="800" color={textColor}>Chi tiết nhật ký</Text>
              <Text fontSize="12px" color={subText}>{log.time}</Text>
            </Box>
          </Flex>
          <ModalCloseButton color={subText} />
        </ModalHeader>
        <ModalBody pb="20px">
          <Flex gap="8px" mb="14px" flexWrap="wrap">
            <ActionBadge action={log.action} />
            <StatusBadge status={log.status} />
          </Flex>

          {isAbnormal && log.reason && (
            <Flex align="flex-start" gap="8px" p="12px 14px" borderRadius="10px" mb="14px"
              bg="rgba(220,38,38,0.08)" border="1px solid rgba(220,38,38,0.25)">
              <Icon as={MdErrorOutline} boxSize="15px" color="#dc2626" mt="1px" flexShrink="0" />
              <Text fontSize="12.5px" fontWeight="600" color="#dc2626">{log.reason}</Text>
            </Flex>
          )}

          <Box p="14px 16px" borderRadius="12px" bg={cardBg} border={`1px solid ${cardBorder}`} mb="14px">
            <Text fontSize="9.5px" fontWeight="700" color={subText} letterSpacing=".8px" textTransform="uppercase" mb="4px">
              Mô tả thao tác
            </Text>
            <Text fontSize="13.5px" fontWeight="500" color={textColor} lineHeight="1.6">{log.target}</Text>
          </Box>

          <SimpleGrid columns={2} spacing="10px">
            {[
              { icon: MdPeopleAlt, label: "Người dùng", val: log.user },
              { icon: MdAdminPanelSettings, label: "Vai trò", val: log.role },
              { icon: MdWifiTethering, label: "Địa chỉ IP", val: log.ip },
              { icon: log.device.includes("Android") || log.device.includes("iOS") ? MdSmartphone : MdComputer, label: "Thiết bị", val: log.device },
              { icon: MdPublic, label: "Vị trí", val: log.location },
              { icon: MdHistory, label: "Thời gian", val: log.time },
            ].map(({ icon: Ic, label, val }) => (
              <Box key={label} p="10px 12px" borderRadius="10px" bg={cardBg} border={`1px solid ${cardBorder}`}>
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={Ic} boxSize="11px" color={OR} />
                  <Text fontSize="9.5px" fontWeight="700" color={subText} letterSpacing=".8px" textTransform="uppercase">{label}</Text>
                </Flex>
                <Text fontSize="12.5px" fontWeight="700" color={textColor} noOfLines={2}>{val}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter borderTop={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"} gap="10px">
          <Button h="40px" px="18px" variant="ghost" color={subText} borderRadius="10px" fontWeight="600" fontSize="13px"
            border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }} onClick={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* ─────────────────── MOBILE LOG CARD ─────────────────── */
function MobileLogCard({ log, index, onView, isDark }) {
  const isAbnormal = log.status === "Bất thường";
  return (
    <Box p="14px" borderRadius="12px"
      bg={isDark ? "rgba(255,255,255,0.03)" : "white"}
      border={`1.5px solid ${isAbnormal ? "rgba(220,38,38,0.35)" : (isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9")}`}
      boxShadow="0 1px 4px rgba(0,0,0,.04)"
      sx={{ animation:`${fadeUp} .35s ease ${index*.03}s both` }}
      onClick={() => onView(log)}>
      <Flex justify="space-between" align="flex-start" mb="8px">
        <ActionBadge action={log.action} />
        <StatusBadge status={log.status} />
      </Flex>
      <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} mb="4px" noOfLines={2}>{log.target}</Text>
      <Flex align="center" gap="6px" mb="4px">
        <Icon as={MdPeopleAlt} boxSize="11px" color={isDark ? "#718096" : "#94a3b8"} />
        <Text fontSize="11.5px" color={isDark ? "#a0aec0" : "#64748b"} noOfLines={1}>{log.user}</Text>
      </Flex>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap="5px">
          <Icon as={MdHistory} boxSize="11px" color={isDark ? "#718096" : "#94a3b8"} />
          <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>{log.time}</Text>
        </Flex>
        <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>{log.ip}</Text>
      </Flex>
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

  const [logs] = useState(INIT_LOGS);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterRange, setFilterRange] = useState("7 ngày qua");
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

  const filtered = useMemo(() => logs.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = l.user.toLowerCase().includes(q) || l.target.toLowerCase().includes(q) || l.ip.includes(q);
    const matchAction = filterAction === "Tất cả" || l.action === filterAction;
    const matchStatus = filterStatus === "Tất cả" || l.status === filterStatus;
    return matchSearch && matchAction && matchStatus;
  }), [logs, search, filterAction, filterStatus]);

  const abnormalCount = logs.filter(l => l.status === "Bất thường").length;
  const activeUsers = new Set(logs.map(l => l.user)).size;

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1400);
  };

  return (
    <Box pt={{ base: "120px", md: "80px" }} px={{ base: "16px", md: "0" }} minH="100vh">
      <LogDetailModal log={detailLog} onClose={() => setDetailLog(null)} isDark={isDark} />

      {/* ── HEADER ── */}
      <Flex align="flex-start" justify="space-between" mb="28px" flexWrap="wrap" gap="12px">
        <Box>
          <Flex align="center" gap="10px" mb="6px">
            <Box w="3px" h="28px" borderRadius="2px" bgGradient={`linear(to-b, ${OR}, ${ORL})`} />
            <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color={textColor} letterSpacing="-0.5px">
              Nhật ký hệ thống
            </Text>
          </Flex>
          <Text color={subTextColor} fontSize="sm" pl="13px">
            Theo dõi toàn bộ hoạt động & phát hiện thao tác bất thường • Chỉ Admin
          </Text>
        </Box>

        <Flex align="center" gap="10px" flexWrap="wrap">
          <Flex align="center" gap="8px" bg={pillBg} border="1px solid" borderColor={pillBorder} borderRadius="12px" px="14px" py="8px">
            <Box w="7px" h="7px" borderRadius="full" bg="#48BB78" boxShadow="0 0 8px #48BB78" />
            <Text fontSize="xs" color={liveTextColor} fontWeight="600">Ghi log thời gian thực</Text>
          </Flex>

          <Button h="38px" w="38px" minW="38px" p="0" borderRadius="10px"
            bg={isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"} color={isDark ? "#e2e8f0" : "#475569"}
            border={isDark ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e2e8f0"}
            onClick={toggleColorMode}>
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="16px" />
          </Button>

          <Button h="38px" px="16px" borderRadius="10px" fontWeight="700" fontSize="12px" color="white"
            bg={`linear-gradient(135deg,${OR},${ORL})`} boxShadow="0 3px 12px rgba(234,88,12,.28)"
            _hover={{ boxShadow: "0 6px 20px rgba(234,88,12,.4)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all .2s"
            isLoading={exporting} loadingText="Đang export..."
            leftIcon={<Icon as={MdFileDownload} boxSize="14px" />} onClick={handleExport}>
            Export log
          </Button>
        </Flex>
      </Flex>

      {/* ── KPI GRID ── */}
      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="16px" mb="20px">
        <KpiCard icon={MdOutlineFactCheck} label="Tổng log hôm nay" value={186} iconColor={OR} trend={14} trendLabel="so với hôm qua" />
        <KpiCard icon={MdWarningAmber} label="Thao tác bất thường" value={abnormalCount} iconColor="#dc2626" pulse trendLabel="cần kiểm tra ngay" />
        <KpiCard icon={MdPeopleAlt} label="Người dùng hoạt động" value={activeUsers} iconColor="#76E4F7" trend={6} trendLabel="trong 24 giờ qua" />
        <KpiCard icon={MdWifiTethering} label="IP giám sát" value={logs.length} iconColor="#9F7AEA" trendLabel="phiên đang theo dõi" />
      </SimpleGrid>

      {/* ── CHARTS ── */}
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
                <defs>
                  <linearGradient id="gradOrangeLog" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={OR} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={OR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <Box bg={tooltipBg} border={`1px solid ${tooltipBorder}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
                        <Text fontSize="xs" color={tooltipLabelColor} mb="4px" fontWeight="600">Lúc {label}</Text>
                        <Text fontSize="sm" fontWeight="700" color={OR}>{payload[0].value} thao tác</Text>
                      </Box>
                    );
                  }}
                />
                <Area type="monotone" dataKey="actions" stroke={OR} strokeWidth={3} fill="url(#gradOrangeLog)"
                  dot={{ r: 4, fill: OR, stroke: dotStrokeColor, strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: OR, stroke: dotStrokeColor, strokeWidth: 2 }} />
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
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={90}
                  tick={{ fill: axisTickColor, fontSize: 11.5, fontWeight: 600 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <Box bg={tooltipBg} border={`1px solid ${tooltipBorder}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
                        <Text fontSize="xs" color={tooltipLabelColor} mb="4px">{label}</Text>
                        <Text fontSize="sm" fontWeight="700" color={payload[0].payload.color}>{payload[0].value} log</Text>
                      </Box>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {actionsByType.map((entry, i) => (
                    <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 2px 8px ${entry.color}50)` }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>
      </Grid>

      {/* ── LOG TABLE ── */}
      <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" overflow="hidden"
        boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
        sx={{ animation: `${fadeUp} .4s ease .1s both` }}>

        {/* Toolbar */}
        <Box p={{ base: "16px", md: "20px 22px" }} borderBottom="1px solid" borderColor={cardBorder}>
          <Flex align="center" justify="space-between" mb="14px" flexWrap="wrap" gap="10px">
            <Flex align="center" gap="8px">
              <Icon as={MdHistory} boxSize="16px" color={OR} />
              <Text fontWeight="800" fontSize="15px" color={textColor}>Nhật ký hoạt động</Text>
              <Badge bg={pillBg} color={OR} border={`1px solid ${pillBorder}`} borderRadius="6px" px="8px" py="1px" fontSize="11px" fontWeight="700">
                {filtered.length} bản ghi
              </Badge>
            </Flex>
          </Flex>

          <Grid templateColumns={{ base: "1fr", md: "1fr 170px 160px 150px" }} gap="10px">
            <Box position="relative">
              <Icon as={MdSearch} position="absolute" left="12px" top="50%" transform="translateY(-50%)" boxSize="15px" color={mutedTextColor} zIndex="1" />
              <Input
                pl="34px" h="40px" fontSize="13px" fontWeight="500"
                placeholder="Tìm theo người dùng, IP, nội dung..."
                bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" color={textColor}
                _placeholder={{ color: mutedTextColor }}
                _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }}
                _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </Box>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor}
              bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px"
              _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }}
              _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s"
              value={filterAction} onChange={e => setFilterAction(e.target.value)}>
              <option value="Tất cả">Tất cả thao tác</option>
              {ACTION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor}
              bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px"
              _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }}
              _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s"
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Bình thường">Bình thường</option>
              <option value="Bất thường">Bất thường</option>
            </Select>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor}
              bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px"
              _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }}
              _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s"
              value={filterRange} onChange={e => setFilterRange(e.target.value)}>
              <option>Hôm nay</option>
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </Select>
          </Grid>
        </Box>

        {/* Desktop header row */}
        {!isMobile && (
          <Flex align="center" px="20px" py="10px" bg={useColorModeValue("#fafbfc", "rgba(255,255,255,0.02)")}
            borderBottom="1px solid" borderColor={cardBorder}>
            <CH w={COL.time}>Thời gian</CH>
            <CH w={COL.user} pr="10px">Người dùng</CH>
            <CH w={COL.action} pr="10px">Thao tác</CH>
            <CH flex="1" pr="10px">Mô tả</CH>
            <CH w={COL.ip} pr="10px">IP</CH>
            <CH w={COL.status} pr="10px">Trạng thái</CH>
            <CH w={COL.actions}>Xem</CH>
          </Flex>
        )}

        {/* Rows */}
        <Box p={{ base: "12px", md: "10px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px" color={mutedTextColor}>
              <Icon as={MdHistory} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600">Không tìm thấy bản ghi nào</Text>
            </Flex>
          ) : isMobile ? (
            <Flex direction="column" gap="8px">
              {filtered.map((l, i) => (
                <MobileLogCard key={l.id} log={l} index={i} onView={setDetailLog} isDark={isDark} />
              ))}
            </Flex>
          ) : (
            <Flex direction="column" gap="6px">
              {filtered.map((l, i) => {
                const isAbnormal = l.status === "Bất thường";
                return (
                  <Flex key={l.id} align="center" px="16px" py="12px" borderRadius="10px"
                    bg={isAbnormal ? "rgba(220,38,38,0.04)" : (isDark ? "rgba(255,255,255,0.015)" : "white")}
                    border={`1.5px solid ${isAbnormal ? "rgba(220,38,38,0.25)" : (isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9")}`}
                    transition="all .2s" cursor="pointer"
                    _hover={{ border: `1.5px solid ${isAbnormal ? "rgba(220,38,38,0.45)" : "rgba(234,88,12,0.35)"}`, transform: "translateY(-1px)" }}
                    sx={{ animation: `${fadeUp} .3s ease ${i*.03}s both` }}
                    onClick={() => setDetailLog(l)}>
                    <Box w={COL.time} flexShrink="0">
                      <Text fontSize="11.5px" fontWeight="700" color={textColor}>{l.time}</Text>
                    </Box>
                    <Box w={COL.user} flexShrink="0" pr="10px">
                      <Text fontSize="12px" fontWeight="700" color={textColor} noOfLines={1}>{l.user}</Text>
                      <Text fontSize="10.5px" color={mutedTextColor} noOfLines={1}>{l.role}</Text>
                    </Box>
                    <Box w={COL.action} flexShrink="0" pr="10px">
                      <ActionBadge action={l.action} />
                    </Box>
                    <Box flex="1" minW="0" pr="10px">
                      <Text fontSize="12px" fontWeight="500" color={useColorModeValue("#334155", "#e2e8f0")} noOfLines={1}>{l.target}</Text>
                    </Box>
                    <Box w={COL.ip} flexShrink="0" pr="10px">
                      <Text fontSize="11.5px" fontWeight="600" color={mutedTextColor}>{l.ip}</Text>
                    </Box>
                    <Box w={COL.status} flexShrink="0" pr="10px">
                      <StatusBadge status={l.status} />
                    </Box>
                    <Box w={COL.actions} flexShrink="0">
                      <Button size="xs" h="28px" w="28px" minW="28px" px="0" borderRadius="7px"
                        bg={isDark ? "rgba(255,255,255,0.05)" : "#f8fafc"} color={isDark ? "#e2e8f0" : "#475569"}
                        border={isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0"}
                        _hover={{ bg: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9" }}
                        onClick={(e) => { e.stopPropagation(); setDetailLog(l); }}>
                        <Icon as={MdVisibility} boxSize="13px" />
                      </Button>
                    </Box>
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