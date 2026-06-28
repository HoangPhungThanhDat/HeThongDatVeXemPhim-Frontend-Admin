import React, { useState, useCallback } from "react";
import {
  Box, Grid, Text, Button, Flex, Badge, SimpleGrid, Divider,
  FormControl, Input, Select, Textarea, Switch,
  Icon, keyframes, Progress, Table, Thead, Tbody, Tr, Th, Td,
  Tag, TagLabel, Tooltip, useColorMode, useColorModeValue, IconButton,
} from "@chakra-ui/react";
import {
  MdAdd, MdVisibility, MdEdit, MdArrowBack, MdClose, MdCheckCircle,
  MdSearch, MdFilterList, MdContentCopy, MdRefresh, MdDownload,
  MdLocalOffer, MdPeople, MdBarChart, MdAccessTime, MdCalendarToday,
  MdBlock, MdCheck, MdAutorenew, MdStars, MdFlashOn, MdDeleteOutline,
  MdOutlinePercent, MdAttachMoney, MdCardGiftcard, MdMoreVert,
  MdTune, MdOutlineQrCode2, MdSendToMobile, MdLock, MdLockOpen,
  MdPlayCircle, MdPause, MdStop, MdShoppingCart, MdDelete,
  MdDarkMode, MdLightMode, MdWarning,
} from "react-icons/md";
import { FaTicketAlt, FaFire, FaGift, FaCoins, FaPercent } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.45}`;
const shimmer = keyframes`
  0%{background-position:-200% center}
  100%{background-position:200% center}
`;
const float = keyframes`
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-4px)}
`;
const spin = keyframes`from{transform:rotate(0)}to{transform:rotate(360deg)}`;

// ─── Status config ────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Đang hoạt động": { color:"#059669", bg:"#ecfdf5", border:"#6ee7b7", dot:"#10b981", icon:MdPlayCircle },
  "Tạm dừng":       { color:"#b45309", bg:"#fffbeb", border:"#fcd34d", dot:"#f59e0b", icon:MdPause },
  "Hết hạn":        { color:"#6b7280", bg:"#f9fafb", border:"#e5e7eb", dot:"#9ca3af", icon:MdStop },
  "Đã dùng hết":    { color:"#dc2626", bg:"#fef2f2", border:"#fca5a5", dot:"#ef4444", icon:MdBlock },
};

const TYPE_CFG = {
  "Giảm %":       { color:"#7c3aed", bg:"#f5f3ff", border:"#c4b5fd", icon:FaPercent },
  "Giảm tiền":    { color:"#0369a1", bg:"#eff6ff", border:"#93c5fd", icon:MdAttachMoney },
  "Quà tặng":     { color:"#be185d", bg:"#fdf2f8", border:"#f9a8d4", icon:FaGift },
};

const APPLY_CFG = {
  "Tất cả":        { color:"#374151", bg:"#f9fafb" },
  "Phim cụ thể":   { color:"#b45309", bg:"#fffbeb" },
  "Combo bắp nước":{ color:"#065f46", bg:"#ecfdf5" },
  "Rạp cụ thể":    { color:"#1e40af", bg:"#eff6ff" },
};

// ─── Sample data ──────────────────────────────────────────────────────────
const VOUCHERS_DATA = [
  {
    id: "V001", code: "GAUPHIM50",
    name: "Ưu đãi 50% mừng sinh nhật",
    type: "Giảm %",
    value: 50, minOrder: 100000,
    startDate: "01/05/2026", endDate: "31/05/2026",
    maxUses: 500, usedCount: 347,
    status: "Đang hoạt động",
    applyFor: "Tất cả",
    description: "Giảm 50% tổng hóa đơn khi đặt vé qua app nhân kỷ niệm 3 năm thành lập Gấu Phim.",
    isBatch: false, createdAt: "28/04/2026",
  },
  {
    id: "V002", code: "SUMMER2026",
    name: "Voucher hè rực rỡ",
    type: "Giảm tiền",
    value: 30000, minOrder: 120000,
    startDate: "15/05/2026", endDate: "15/08/2026",
    maxUses: 1000, usedCount: 89,
    status: "Đang hoạt động",
    applyFor: "Tất cả",
    description: "Giảm 30.000đ cho mỗi đơn hàng trong suốt mùa hè 2026.",
    isBatch: false, createdAt: "10/05/2026",
  },
  {
    id: "V003", code: "AVENGERS20",
    name: "Avengers Secret Wars – Ra mắt",
    type: "Giảm %",
    value: 20, minOrder: 80000,
    startDate: "05/05/2026", endDate: "05/06/2026",
    maxUses: 2000, usedCount: 2000,
    status: "Đã dùng hết",
    applyFor: "Phim cụ thể",
    description: "Giảm 20% dành riêng cho suất chiếu phim Avengers: Secret Wars.",
    isBatch: true, batchCount: 2000, createdAt: "01/05/2026",
  },
  {
    id: "V004", code: "COMBO2026",
    name: "Bắp & Nước – Giảm mạnh",
    type: "Giảm tiền",
    value: 20000, minOrder: 60000,
    startDate: "01/04/2026", endDate: "30/04/2026",
    maxUses: 300, usedCount: 248,
    status: "Hết hạn",
    applyFor: "Combo bắp nước",
    description: "Giảm 20.000đ khi thêm combo bắp nước vào đơn hàng.",
    isBatch: false, createdAt: "28/03/2026",
  },
  {
    id: "V005", code: "VIP2026MAY",
    name: "VIP Tháng 5 – Khách hàng thân thiết",
    type: "Quà tặng",
    value: 0, minOrder: 200000,
    startDate: "01/05/2026", endDate: "31/05/2026",
    maxUses: 50, usedCount: 12,
    status: "Tạm dừng",
    applyFor: "Tất cả",
    description: "Tặng 1 combo bắp nước cho khách hàng hạng Vàng và Kim Cương.",
    isBatch: true, batchCount: 50, createdAt: "25/04/2026",
  },
  {
    id: "V006", code: "RAPHANOI10",
    name: "Ưu đãi rạp Hà Nội",
    type: "Giảm %",
    value: 10, minOrder: 100000,
    startDate: "10/05/2026", endDate: "10/07/2026",
    maxUses: 800, usedCount: 143,
    status: "Đang hoạt động",
    applyFor: "Rạp cụ thể",
    description: "Giảm 10% cho khách hàng đặt vé tại các rạp Gấu Phim khu vực Hà Nội.",
    isBatch: false, createdAt: "07/05/2026",
  },
];

const USE_HISTORY = [
  { id: 1, code: "GAUPHIM50", user: "Nguyễn Minh Anh", orderId: "#ORD-8821", amount: 85000, date: "25/05/2026 14:32" },
  { id: 2, code: "SUMMER2026", user: "Trần Thị Hoa", orderId: "#ORD-8820", amount: 30000, date: "25/05/2026 13:15" },
  { id: 3, code: "GAUPHIM50", user: "Lê Văn Bình", orderId: "#ORD-8819", amount: 75000, date: "25/05/2026 11:40" },
  { id: 4, code: "RAPHANOI10", user: "Phạm Thị Lan", orderId: "#ORD-8817", amount: 15000, date: "25/05/2026 10:05" },
  { id: 5, code: "SUMMER2026", user: "Hoàng Văn Nam", orderId: "#ORD-8815", amount: 30000, date: "24/05/2026 21:48" },
];

// ─── CSV Export helper ────────────────────────────────────────────────────
function exportVouchersToCSV(vouchers, filename = "vouchers.csv") {
  const headers = ["ID","Tên voucher","Mã code","Loại","Giá trị","Đơn tối thiểu","Ngày bắt đầu","Ngày kết thúc","Đã dùng","Tối đa","Trạng thái","Áp dụng cho","Ngày tạo"];
  const rows = vouchers.map(v => [
    v.id, `"${v.name}"`, v.code, v.type,
    v.type === "Giảm %" ? `${v.value}%` : v.type === "Giảm tiền" ? `${v.value}đ` : "Quà tặng",
    `${v.minOrder}đ`, v.startDate, v.endDate,
    v.usedCount, v.maxUses, v.status, v.applyFor, v.createdAt,
  ]);
  const csvContent = "\uFEFF" + [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportHistoryToCSV(history) {
  const headers = ["Mã voucher","Khách hàng","Mã đơn hàng","Tiết kiệm (đ)","Thời gian"];
  const rows = history.map(r => [r.code, `"${r.user}"`, r.orderId, r.amount, `"${r.date}"`]);
  const csvContent = "\uFEFF" + [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "lich-su-su-dung-voucher.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ─── Shared styles ────────────────────────────────────────────────────────
const inputStyle = {
  bg: "#fafafa", border: "1.5px solid #e8edf3", borderRadius: "10px",
  color: "#1a202c", fontSize: "14px", fontWeight: "500", px: "14px",
  h: { base: "48px", md: "44px" },
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" },
  _hover: { border: "1.5px solid #f97316", bg: "#fff" },
  transition: "all 0.2s ease",
};
const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px",
};

// ─── Sub-components ───────────────────────────────────────────────────────
function SectionTitle({ label, isDark }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
        <Text fontSize="10.5px" fontWeight="800" color={isDark ? "#cbd5e1" : "#374151"} letterSpacing="1.2px" textTransform="uppercase">{label}</Text>
      </Flex>
      <Box mt="7px" h="1px" bg={isDark ? "rgba(255,255,255,0.06)" : "linear-gradient(90deg,#f1f5f9,transparent)"} />
    </Box>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG["Hết hạn"];
  return (
    <Flex align="center" gap="5px" px="10px" py="4px" borderRadius="8px"
      bg={c.bg} border={`1px solid ${c.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={c.dot}
        sx={status === "Đang hoạt động" ? { animation:`${pulse} 1.8s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="700" color={c.color}>{status}</Text>
    </Flex>
  );
}

function TypeBadge({ type }) {
  const c = TYPE_CFG[type] || TYPE_CFG["Giảm %"];
  const Ic = c.icon;
  return (
    <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px"
      bg={c.bg} border={`1px solid ${c.border}`} display="inline-flex"
    >
      <Icon as={Ic} boxSize="9px" color={c.color} />
      <Text fontSize="11px" fontWeight="700" color={c.color}>{type}</Text>
    </Flex>
  );
}

function StatCard({ label, value, sub, icon, accent, delay = 0, isDark }) {
  return (
    <Box p={{ base:"14px 16px", md:"18px 20px" }} borderRadius="14px"
      bg={isDark ? "rgba(255,255,255,0.05)" : "white"}
      border={`1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"}`}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.05)"}
      sx={{ animation:`${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{ boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.09)", transform:"translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="10.5px" fontWeight="700" color={isDark ? "#94a3b8" : "#94a3b8"} letterSpacing="0.8px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base:"24px", md:"28px" }} fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"} lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w={{ base:"36px", md:"42px" }} h={{ base:"36px", md:"42px" }} borderRadius="12px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center"
          sx={{ animation:`${float} 3s ease infinite` }}
        >
          <Icon as={icon} boxSize={{ base:"15px", md:"18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

function UsageBar({ used, max }) {
  const pct = max === 0 ? 0 : Math.round((used / max) * 100);
  const color = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981";
  return (
    <Box>
      <Flex justify="space-between" mb="4px">
        <Text fontSize="11px" fontWeight="700" color="#374151">{used.toLocaleString()} / {max.toLocaleString()}</Text>
        <Text fontSize="11px" fontWeight="700" color={color}>{pct}%</Text>
      </Flex>
      <Box h="5px" bg="#f1f5f9" borderRadius="full" overflow="hidden">
        <Box h="100%" w={`${pct}%`} borderRadius="full"
          bg={pct >= 90 ? "linear-gradient(90deg,#f97316,#ef4444)" : pct >= 70 ? "linear-gradient(90deg,#f97316,#fbbf24)" : "linear-gradient(90deg,#10b981,#34d399)"}
          transition="width 0.6s ease"
        />
      </Box>
    </Box>
  );
}

function CopyCodeBtn({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <Flex align="center" gap="6px" px="10px" py="5px" borderRadius="8px"
      bg={copied ? "#ecfdf5" : "#fff7ed"} border={`1px solid ${copied ? "#6ee7b7" : "#fed7aa"}`}
      cursor="pointer" onClick={copy} transition="all 0.2s" _hover={{ transform:"scale(1.03)" }}
      display="inline-flex" w="fit-content"
    >
      <Text fontSize="12.5px" fontWeight="800" color={copied ? "#059669" : "#c2410c"} letterSpacing="1px" fontFamily="monospace">
        {code}
      </Text>
      <Icon as={copied ? MdCheck : MdContentCopy} boxSize="12px" color={copied ? "#059669" : "#f97316"} />
    </Flex>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────
function DeleteModal({ voucher, onConfirm, onCancel, isDark }) {
  return (
    <Box position="fixed" inset="0" zIndex="1000" display="flex" alignItems="center" justifyContent="center"
      sx={{ animation:`${fadeIn} 0.2s ease both` }}
    >
      {/* Backdrop */}
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.55)" backdropFilter="blur(4px)" onClick={onCancel} />

      {/* Modal */}
      <Box position="relative" w={{ base:"90%", md:"440px" }} borderRadius="20px"
        bg={isDark ? "#1e293b" : "white"}
        border={`1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#f1f5f9"}`}
        boxShadow="0 24px 64px rgba(0,0,0,0.25)"
        p={{ base:"24px", md:"28px" }}
        sx={{ animation:`${scaleIn} 0.25s ease both` }}
      >
        {/* Icon */}
        <Flex justify="center" mb="16px">
          <Box w="56px" h="56px" borderRadius="18px" bg="#fef2f2"
            border="2px solid #fca5a5"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={MdDeleteOutline} boxSize="26px" color="#dc2626" />
          </Box>
        </Flex>

        <Text fontSize="18px" fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"} textAlign="center" mb="8px">
          Xóa vĩnh viễn voucher?
        </Text>
        <Text fontSize="13px" color="#64748b" textAlign="center" lineHeight="1.7" mb="6px">
          Bạn sắp xóa voucher
        </Text>
        <Box mx="auto" mb="16px" px="14px" py="8px" borderRadius="10px"
          bg={isDark ? "rgba(249,115,22,0.12)" : "#fff7ed"}
          border="1px solid #fed7aa" w="fit-content"
        >
          <Text fontSize="14px" fontWeight="800" color="#c2410c" fontFamily="monospace" letterSpacing="1px">
            {voucher.code}
          </Text>
          <Text fontSize="12px" color="#b45309" textAlign="center" mt="2px">{voucher.name}</Text>
        </Box>

        <Box p="12px 14px" borderRadius="10px" bg="#fef2f2" border="1px solid #fca5a5" mb="20px">
          <Flex align="center" gap="6px">
            <Icon as={MdWarning} boxSize="14px" color="#dc2626" flexShrink="0" />
            <Text fontSize="12px" color="#dc2626" fontWeight="600">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </Text>
          </Flex>
        </Box>

        <Flex gap="10px">
          <Button flex="1" h="44px" borderRadius="11px" variant="ghost"
            color={isDark ? "#94a3b8" : "#64748b"} fontWeight="600" fontSize="14px"
            border={`1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "rgba(255,255,255,0.06)" : "#f8fafc" }}
            onClick={onCancel}
          >Hủy bỏ</Button>
          <Button flex="1" h="44px" borderRadius="11px"
            bg="linear-gradient(135deg,#dc2626,#ef4444)"
            color="white" fontWeight="700" fontSize="14px"
            boxShadow="0 4px 14px rgba(220,38,38,0.35)"
            _hover={{ boxShadow:"0 6px 20px rgba(220,38,38,0.45)", transform:"translateY(-1px)" }}
            _active={{ transform:"translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdDelete} />}
            onClick={onConfirm}
          >Xóa vĩnh viễn</Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Dark Mode Toggle ─────────────────────────────────────────────────────
function DarkModeToggle({ isDark, onToggle }) {
  return (
    <Tooltip label={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"} placement="bottom">
      <Box
        as="button"
        onClick={onToggle}
        w="44px" h="24px" borderRadius="full" position="relative" cursor="pointer"
        bg={isDark ? "linear-gradient(135deg,#1e3a5f,#2563eb)" : "linear-gradient(135deg,#f97316,#fbbf24)"}
        border={`1.5px solid ${isDark ? "#3b82f6" : "#fb923c"}`}
        transition="all 0.3s ease"
        boxShadow={isDark ? "0 0 10px rgba(59,130,246,0.4)" : "0 0 10px rgba(249,115,22,0.3)"}
        flexShrink="0"
      >
        <Box
          position="absolute" top="2px"
          left={isDark ? "22px" : "2px"}
          w="16px" h="16px" borderRadius="full"
          bg="white"
          transition="all 0.3s ease"
          boxShadow="0 1px 4px rgba(0,0,0,0.3)"
          display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={isDark ? MdDarkMode : MdLightMode} boxSize="9px" color={isDark ? "#1e3a5f" : "#f97316"} />
        </Box>
      </Box>
    </Tooltip>
  );
}

// ─── Voucher Card (Grid View) ─────────────────────────────────────────────
function VoucherCard({ v, index, onView, onEdit, onToggle, onDelete, isDark }) {
  const typeCfg = TYPE_CFG[v.type] || TYPE_CFG["Giảm %"];

  return (
    <Box borderRadius="16px"
      bg={isDark ? "rgba(255,255,255,0.05)" : "white"}
      border={`1.5px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"}`}
      overflow="hidden"
      transition="all 0.22s"
      _hover={{
        border:`1.5px solid #f97316`,
        boxShadow: isDark ? "0 4px 20px rgba(249,115,22,0.2)" : "0 4px 20px rgba(249,115,22,0.12)",
        transform:"translateY(-2px)"
      }}
      sx={{ animation:`${fadeUp} 0.4s ease ${index * 0.06}s both` }}
    >
      <Box h="3px" bg={`linear-gradient(90deg, ${typeCfg.color}, #f97316)`} />

      <Box p="16px">
        <Flex justify="space-between" align="flex-start" mb="10px">
          <Box flex="1" minW="0" pr="8px">
            <Text fontSize="13.5px" fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"} noOfLines={2} lineHeight="1.35" mb="6px">
              {v.name}
            </Text>
            <Flex gap="5px" flexWrap="wrap">
              <TypeBadge type={v.type} />
              <StatusBadge status={v.status} />
            </Flex>
          </Box>
          <Box flexShrink="0" textAlign="center" px="10px" py="6px" borderRadius="10px"
            bg={`${typeCfg.bg}`} border={`1.5px solid ${typeCfg.border}`}
          >
            <Text fontSize="16px" fontWeight="900" color={typeCfg.color} lineHeight="1">
              {v.type === "Giảm %" ? `${v.value}%` : v.type === "Giảm tiền" ? `${(v.value/1000).toFixed(0)}K` : "Gift"}
            </Text>
            <Text fontSize="9px" fontWeight="600" color="#94a3b8" mt="1px">giảm giá</Text>
          </Box>
        </Flex>

        <Box mb="10px"><CopyCodeBtn code={v.code} /></Box>
        <Box mb="10px"><UsageBar used={v.usedCount} max={v.maxUses} /></Box>

        <Flex gap="10px" flexWrap="wrap" mb="12px">
          <Flex align="center" gap="4px">
            <Icon as={MdCalendarToday} boxSize="10px" color="#94a3b8" />
            <Text fontSize="10.5px" color={isDark ? "#94a3b8" : "#64748b"} fontWeight="500">{v.startDate} → {v.endDate}</Text>
          </Flex>
          {v.minOrder > 0 && (
            <Flex align="center" gap="4px">
              <Icon as={MdShoppingCart} boxSize="10px" color="#94a3b8" />
              <Text fontSize="10.5px" color={isDark ? "#94a3b8" : "#64748b"} fontWeight="500">Tối thiểu {(v.minOrder/1000).toFixed(0)}K</Text>
            </Flex>
          )}
        </Flex>

        <Box mb="12px">
          <Box px="7px" py="3px" borderRadius="6px" display="inline-block"
            bg={APPLY_CFG[v.applyFor]?.bg || "#f9fafb"}
          >
            <Text fontSize="10.5px" fontWeight="700" color={APPLY_CFG[v.applyFor]?.color || "#374151"}>
              Áp dụng: {v.applyFor}
            </Text>
          </Box>
        </Box>

        <Flex gap="6px">
          <Button flex="1" size="xs" h="32px" borderRadius="8px"
            bg={isDark ? "rgba(255,255,255,0.08)" : "#f8fafc"}
            color={isDark ? "#94a3b8" : "#475569"}
            border={`1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
            fontSize="11px" fontWeight="600" leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: isDark ? "rgba(255,255,255,0.12)" : "#f1f5f9" }} transition="all 0.15s" onClick={() => onView(v)}
          >Xem</Button>
          <Button flex="1" size="xs" h="32px" borderRadius="8px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            fontSize="11px" fontWeight="600" leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity:0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            transition="all 0.15s" onClick={() => onEdit(v)}
          >Sửa</Button>
          <Button size="xs" h="32px" px="8px" borderRadius="8px"
            bg={v.status === "Tạm dừng" ? "#ecfdf5" : "#fffbeb"}
            color={v.status === "Tạm dừng" ? "#059669" : "#b45309"}
            border={`1px solid ${v.status === "Tạm dừng" ? "#6ee7b7" : "#fcd34d"}`}
            fontSize="11px" fontWeight="600"
            _hover={{ opacity:0.85 }} transition="all 0.15s"
            onClick={() => onToggle(v)}
          >
            <Icon as={v.status === "Tạm dừng" ? MdPlayCircle : MdPause} boxSize="13px" />
          </Button>
          {/* Nút Xóa vĩnh viễn */}
          <Tooltip label="Xóa vĩnh viễn" placement="top">
            <Button size="xs" h="32px" px="8px" borderRadius="8px"
              bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
              fontSize="11px" _hover={{ bg:"#fee2e2", transform:"scale(1.05)" }} transition="all 0.15s"
              onClick={() => onDelete(v)}
            >
              <Icon as={MdDeleteOutline} boxSize="13px" />
            </Button>
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Voucher Row (List View) ──────────────────────────────────────────────
function VoucherRow({ v, index, onView, onEdit, onToggle, onDelete, isDark }) {
  return (
    <Box p="12px 16px" borderRadius="10px"
      bg={isDark ? "rgba(255,255,255,0.04)" : "white"}
      border={`1.5px solid ${isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9"}`}
      transition="all 0.2s"
      _hover={{
        border:"1.5px solid #f97316",
        boxShadow: isDark ? "0 2px 10px rgba(249,115,22,0.2)" : "0 2px 10px rgba(249,115,22,0.1)",
        bg: isDark ? "rgba(249,115,22,0.05)" : "#fffbf7"
      }}
      sx={{ animation:`${fadeUp} 0.35s ease ${index * 0.04}s both` }}
    >
      <Flex align="center" gap="0">
        <Box w="32px" flexShrink="0">
          <Text fontSize="11px" fontWeight="700" color="#cbd5e1">{String(index+1).padStart(2,"0")}</Text>
        </Box>
        <Box flex="2" minW="0" pr="12px">
          <Text fontSize="13px" fontWeight="700" color={isDark ? "#f1f5f9" : "#0f172a"} noOfLines={1} mb="3px">{v.name}</Text>
          <CopyCodeBtn code={v.code} />
        </Box>
        <Box flex="0.7" minW="0" pr="10px">
          <TypeBadge type={v.type} />
          <Text fontSize="12px" fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"} mt="4px">
            {v.type === "Giảm %" ? `${v.value}%` : v.type === "Giảm tiền" ? `${(v.value/1000).toFixed(0)}.000đ` : "Quà tặng"}
          </Text>
        </Box>
        <Box flex="1" minW="0" pr="10px">
          <UsageBar used={v.usedCount} max={v.maxUses} />
        </Box>
        <Box flex="0.8" minW="0" pr="10px">
          <StatusBadge status={v.status} />
        </Box>
        <Box flex="0.7" minW="0" pr="10px">
          <Text fontSize="11px" color={isDark ? "#94a3b8" : "#64748b"}>{v.endDate}</Text>
        </Box>
        <Flex gap="5px" flexShrink="0">
          <Button size="xs" h="28px" px="9px" borderRadius="7px"
            bg={isDark ? "rgba(255,255,255,0.08)" : "#f8fafc"}
            color={isDark ? "#94a3b8" : "#475569"}
            border={`1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
            fontSize="11px" fontWeight="600" leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
            _hover={{ bg: isDark ? "rgba(255,255,255,0.12)" : "#f1f5f9" }} transition="all 0.15s" onClick={() => onView(v)}
          >Xem</Button>
          <Button size="xs" h="28px" px="9px" borderRadius="7px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            fontSize="11px" fontWeight="600" leftIcon={<Icon as={MdEdit} boxSize="11px" />}
            _hover={{ opacity:0.88 }} boxShadow="0 2px 6px rgba(249,115,22,0.3)"
            transition="all 0.15s" onClick={() => onEdit(v)}
          >Sửa</Button>
          <Button size="xs" h="28px" px="8px" borderRadius="7px"
            bg={v.status === "Tạm dừng" ? "#ecfdf5" : "#fffbeb"}
            color={v.status === "Tạm dừng" ? "#059669" : "#b45309"}
            border={`1px solid ${v.status === "Tạm dừng" ? "#6ee7b7" : "#fcd34d"}`}
            fontSize="11px" _hover={{ opacity:0.85 }} transition="all 0.15s"
            onClick={() => onToggle(v)}
          >
            <Icon as={v.status === "Tạm dừng" ? MdPlayCircle : MdPause} boxSize="13px" />
          </Button>
          <Tooltip label="Xóa vĩnh viễn" placement="top">
            <Button size="xs" h="28px" px="8px" borderRadius="7px"
              bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
              fontSize="11px" _hover={{ bg:"#fee2e2" }} transition="all 0.15s"
              onClick={() => onDelete(v)}
            >
              <Icon as={MdDeleteOutline} boxSize="13px" />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── Add/Edit Form ────────────────────────────────────────────────────────
function VoucherForm({ voucher, onCancel, onSave, isAdd = false, isDark }) {
  const [form, setForm] = useState(voucher || {
    code: "", name: "", type: "Giảm %", value: "", minOrder: "",
    startDate: "", endDate: "", maxUses: "", status: "Đang hoạt động",
    applyFor: "Tất cả", description: "", isBatch: false, batchCount: "",
  });
  const [autoCode, setAutoCode] = useState(isAdd);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = "GP" + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    set("code", code);
  };

  const cardBg = isDark ? "rgba(255,255,255,0.05)" : "white";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9";
  const darkInputStyle = isDark ? {
    bg: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: "10px",
    color: "#f1f5f9", fontSize: "14px", fontWeight: "500", px: "14px",
    h: { base: "48px", md: "44px" },
    _placeholder: { color: "rgba(255,255,255,0.3)" },
    _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.15)", bg: "rgba(255,255,255,0.1)" },
    _hover: { border: "1.5px solid #f97316" },
    transition: "all 0.2s ease",
  } : inputStyle;
  const darkLabelStyle = { ...labelStyle, color: isDark ? "#94a3b8" : "#64748b" };

  return (
    <Box sx={{ animation:`${scaleIn} 0.3s ease both` }}>
      <Flex align={{ base:"flex-start", md:"center" }} gap="12px" mb="20px" direction={{ base:"column", sm:"row" }}>
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={isDark ? "#94a3b8" : "#64748b"} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
          _hover={{ bg: isDark ? "rgba(255,255,255,0.06)" : "#f8fafc" }} flexShrink="0" onClick={onCancel}
        >Quay lại</Button>
        <Box>
          <Text fontSize={{ base:"17px", md:"20px" }} fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"} letterSpacing="-0.4px">
            {isAdd ? "✦ Tạo voucher mới" : `Chỉnh sửa: ${voucher?.name}`}
          </Text>
          <Text fontSize="12px" color="#94a3b8" mt="2px">
            {isAdd ? "Thiết lập mã ưu đãi và điều kiện áp dụng" : "Cập nhật thông tin voucher"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base:"1fr", lg:"1fr 320px" }} gap="16px">
        <Flex direction="column" gap="14px">
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base:"16px", md:"20px" }}
          >
            <SectionTitle label="Thông tin cơ bản" isDark={isDark} />
            <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={darkLabelStyle}>Tên chương trình *</Text>
                <Input {...darkInputStyle} placeholder="VD: Voucher hè 2026" value={form.name} onChange={e=>set("name",e.target.value)} />
              </Box>
              <Box>
                <Text sx={darkLabelStyle}>Loại voucher *</Text>
                <Select {...darkInputStyle} value={form.type} onChange={e=>set("type",e.target.value)}>
                  <option>Giảm %</option>
                  <option>Giảm tiền</option>
                  <option>Quà tặng</option>
                </Select>
              </Box>
            </Grid>

            <Box mb="14px">
              <Flex justify="space-between" align="center" mb="7px">
                <Text sx={{ ...darkLabelStyle, mb:"0" }}>Mã voucher *</Text>
                <Flex align="center" gap="6px">
                  <Text fontSize="10.5px" color="#94a3b8">Tự động</Text>
                  <Switch size="sm" colorScheme="orange" isChecked={autoCode}
                    onChange={e => { setAutoCode(e.target.checked); if(e.target.checked) generateCode(); }}
                  />
                </Flex>
              </Flex>
              <Flex gap="8px">
                <Input {...darkInputStyle} flex="1" fontFamily="monospace" letterSpacing="1px"
                  placeholder="VD: SUMMER2026" value={form.code}
                  onChange={e=>set("code",e.target.value.toUpperCase())}
                  isReadOnly={autoCode}
                />
                {autoCode && (
                  <Button h="44px" px="14px" borderRadius="10px"
                    bg={isDark ? "rgba(255,255,255,0.08)" : "#f8fafc"}
                    border={`1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
                    color={isDark ? "#94a3b8" : "#64748b"} fontSize="12px"
                    leftIcon={<Icon as={MdAutorenew} boxSize="13px" />}
                    _hover={{ bg: isDark ? "rgba(255,255,255,0.12)" : "#f1f5f9" }} onClick={generateCode}
                  >Tạo mới</Button>
                )}
              </Flex>
            </Box>

            <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={darkLabelStyle}>{form.type === "Giảm %" ? "Mức giảm (%) *" : form.type === "Giảm tiền" ? "Số tiền giảm (đ) *" : "Giá trị quà"}</Text>
                <Input {...darkInputStyle} type="number" value={form.value} onChange={e=>set("value",e.target.value)} />
              </Box>
              <Box>
                <Text sx={darkLabelStyle}>Đơn tối thiểu (đ)</Text>
                <Input {...darkInputStyle} type="number" value={form.minOrder} onChange={e=>set("minOrder",e.target.value)} />
              </Box>
              <Box>
                <Text sx={darkLabelStyle}>Số lượt dùng tối đa *</Text>
                <Input {...darkInputStyle} type="number" value={form.maxUses} onChange={e=>set("maxUses",e.target.value)} />
              </Box>
            </Grid>
          </Box>

          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base:"16px", md:"20px" }}
          >
            <SectionTitle label="Thời gian & Phạm vi áp dụng" isDark={isDark} />
            <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={darkLabelStyle}>Ngày bắt đầu *</Text>
                <Input {...darkInputStyle} type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)} />
              </Box>
              <Box>
                <Text sx={darkLabelStyle}>Ngày kết thúc *</Text>
                <Input {...darkInputStyle} type="date" value={form.endDate} onChange={e=>set("endDate",e.target.value)} />
              </Box>
            </Grid>
            <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={darkLabelStyle}>Áp dụng cho *</Text>
                <Select {...darkInputStyle} value={form.applyFor} onChange={e=>set("applyFor",e.target.value)}>
                  <option>Tất cả</option>
                  <option>Phim cụ thể</option>
                  <option>Combo bắp nước</option>
                  <option>Rạp cụ thể</option>
                </Select>
              </Box>
              <Box>
                <Text sx={darkLabelStyle}>Trạng thái *</Text>
                <Select {...darkInputStyle} value={form.status} onChange={e=>set("status",e.target.value)}>
                  <option>Đang hoạt động</option>
                  <option>Tạm dừng</option>
                </Select>
              </Box>
            </Grid>
          </Box>

          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base:"16px", md:"20px" }}
          >
            <SectionTitle label="Phát hành & Mô tả" isDark={isDark} />
            <Flex align="center" gap="10px" p="12px 14px" borderRadius="10px"
              bg={isDark ? "rgba(249,115,22,0.1)" : "#fffbeb"}
              border={`1px solid ${isDark ? "rgba(249,115,22,0.3)" : "#fcd34d"}`} mb="14px"
            >
              <Switch size="md" colorScheme="orange" isChecked={form.isBatch}
                onChange={e=>set("isBatch",e.target.checked)}
              />
              <Box>
                <Text fontSize="13px" fontWeight="700" color={isDark ? "#fbbf24" : "#b45309"}>Phát hành hàng loạt</Text>
                <Text fontSize="11px" color={isDark ? "#f59e0b" : "#92400e"}>Tạo nhiều mã voucher duy nhất cùng lúc</Text>
              </Box>
            </Flex>
            {form.isBatch && (
              <Box mb="14px">
                <Text sx={darkLabelStyle}>Số lượng mã cần tạo *</Text>
                <Input {...darkInputStyle} type="number" placeholder="VD: 1000"
                  value={form.batchCount} onChange={e=>set("batchCount",e.target.value)} />
              </Box>
            )}
            <Box>
              <Text sx={darkLabelStyle}>Mô tả / Điều kiện áp dụng</Text>
              <Textarea
                bg={isDark ? "rgba(255,255,255,0.07)" : "#fafafa"}
                border={`1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e8edf3"}`}
                borderRadius="10px"
                color={isDark ? "#f1f5f9" : "#1a202c"} fontSize="14px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: isDark ? "rgba(255,255,255,0.3)" : "#b0bac8" }}
                _focus={{ border:"1.5px solid #f97316", boxShadow:"0 0 0 3px rgba(249,115,22,0.10)" }}
                _hover={{ border:"1.5px solid #f97316" }} transition="all 0.2s"
                rows={3} placeholder="Nhập mô tả điều kiện sử dụng voucher..."
                value={form.description} onChange={e=>set("description",e.target.value)}
              />
            </Box>
          </Box>
        </Flex>

        {/* Preview */}
        <Flex direction="column" gap="14px">
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px"
          >
            <SectionTitle label="Xem trước voucher" isDark={isDark} />
            <Box position="relative" borderRadius="14px" overflow="hidden"
              bg="linear-gradient(135deg, #fff7ed 0%, #fffbeb 60%, #fef3c7 100%)"
              border="2px solid #fed7aa" p="0"
              sx={{ animation:`${fadeIn} 0.4s ease both` }}
            >
              <Box h="3px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
                bgSize="200% 100%" sx={{ animation:`${shimmer} 3s linear infinite` }}
              />
              <Box p="16px 18px">
                <Flex justify="space-between" align="center" mb="12px">
                  <Flex align="center" gap="6px">
                    <Box w="24px" h="24px" borderRadius="full" bg="#f97316"
                      display="flex" alignItems="center" justifyContent="center"
                      sx={{ animation:`${float} 3s ease infinite` }}
                    >
                      <Icon as={FaTicketAlt} boxSize="12px" color="white" />
                    </Box>
                    <Text fontSize="10px" fontWeight="800" color="#b45309" letterSpacing="1.5px" textTransform="uppercase">
                      Gấu Phim
                    </Text>
                  </Flex>
                  <Text fontSize="10px" color="#f97316" fontWeight="700" letterSpacing="0.5px">VOUCHER</Text>
                </Flex>
                {form.name && (
                  <Text fontSize="14px" fontWeight="800" color="#92400e" mb="8px" lineHeight="1.3">{form.name}</Text>
                )}
                <Box textAlign="center" py="12px">
                  <Text fontSize="42px" fontWeight="900" color="#f97316" lineHeight="1"
                    sx={{ textShadow:"0 2px 10px rgba(249,115,22,0.3)" }}
                  >
                    {form.type === "Giảm %" && form.value ? `${form.value}%` :
                     form.type === "Giảm tiền" && form.value ? `-${(Number(form.value)/1000).toFixed(0)}K` : "🎁"}
                  </Text>
                  <Text fontSize="11px" color="#b45309" fontWeight="600" mt="2px">
                    {form.type === "Giảm %" ? "giảm giá" : form.type === "Giảm tiền" ? "giảm thẳng" : "quà tặng"}
                  </Text>
                </Box>
                <Box borderTop="2px dashed #fed7aa" my="12px" mx="-18px" />
                <Flex direction="column" gap="6px">
                  {form.code && (
                    <Flex justify="center">
                      <Box px="14px" py="6px" borderRadius="8px" bg="white"
                        border="1.5px solid #f97316" boxShadow="0 2px 8px rgba(249,115,22,0.15)"
                      >
                        <Text fontSize="15px" fontWeight="900" color="#c2410c" letterSpacing="3px" fontFamily="monospace">{form.code}</Text>
                      </Box>
                    </Flex>
                  )}
                  {(form.startDate || form.endDate) && (
                    <Text fontSize="10px" textAlign="center" color="#b45309" fontWeight="500">
                      {form.startDate && `Từ ${form.startDate}`}{form.endDate && ` → ${form.endDate}`}
                    </Text>
                  )}
                </Flex>
              </Box>
            </Box>
          </Box>

          {(form.maxUses || form.applyFor) && (
            <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="16px"
              sx={{ animation:`${fadeIn} 0.3s ease both` }}
            >
              <SectionTitle label="Tóm tắt" isDark={isDark} />
              <Flex direction="column" gap="8px">
                {form.maxUses && (
                  <Flex justify="space-between">
                    <Text fontSize="12px" color="#64748b">Số lượt tối đa</Text>
                    <Text fontSize="12px" fontWeight="700" color={isDark ? "#f1f5f9" : "#0f172a"}>{Number(form.maxUses).toLocaleString()} lượt</Text>
                  </Flex>
                )}
                {form.applyFor && (
                  <Flex justify="space-between">
                    <Text fontSize="12px" color="#64748b">Áp dụng cho</Text>
                    <Text fontSize="12px" fontWeight="700" color={isDark ? "#f1f5f9" : "#0f172a"}>{form.applyFor}</Text>
                  </Flex>
                )}
                {form.isBatch && form.batchCount && (
                  <Flex justify="space-between">
                    <Text fontSize="12px" color="#64748b">Số mã hàng loạt</Text>
                    <Text fontSize="12px" fontWeight="700" color="#f97316">{Number(form.batchCount).toLocaleString()} mã</Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          )}
        </Flex>
      </Grid>

      <Box bg={isDark ? "rgba(255,255,255,0.05)" : "white"}
        borderRadius="14px" border={`1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"}`}
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base:"14px 16px", md:"16px 20px" }} mt="16px"
        position={{ base:"sticky", md:"static" }} bottom="0" zIndex="10"
      >
        <Flex justify={{ base:"stretch", md:"flex-end" }} gap="10px">
          <Button flex={{ base:"1", md:"none" }} h={{ base:"46px", md:"42px" }} px="22px"
            variant="ghost" color={isDark ? "#94a3b8" : "#64748b"} borderRadius="10px" fontWeight="600" fontSize="13px"
            border={`1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "rgba(255,255,255,0.06)" : "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}
          >Hủy bỏ</Button>
          <Button flex={{ base:"2", md:"none" }} h={{ base:"46px", md:"42px" }} px="28px"
            borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)"
            color="#fff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow:"0 8px 24px rgba(249,115,22,0.45)", transform:"translateY(-1px)" }}
            _active={{ transform:"translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={isAdd ? MdAdd : MdCheckCircle} />}
            onClick={() => onSave(form)}
          >
            {isAdd ? (form.isBatch ? "Tạo hàng loạt" : "Tạo voucher") : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────
function VoucherDetail({ v, onBack, onEdit, onDelete, isDark }) {
  const pct = v.maxUses === 0 ? 0 : Math.round((v.usedCount / v.maxUses) * 100);
  const remaining = v.maxUses - v.usedCount;
  const relatedHistory = USE_HISTORY.filter(h => h.code === v.code);
  const totalSaved = relatedHistory.reduce((s, h) => s + h.amount, 0);
  const cardBg = isDark ? "rgba(255,255,255,0.05)" : "white";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9";

  return (
    <Box sx={{ animation:`${fadeIn} 0.3s ease both` }}>
      <Flex align="center" justify="space-between" mb="16px" gap="10px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={isDark ? "#94a3b8" : "#64748b"} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
          _hover={{ bg: isDark ? "rgba(255,255,255,0.06)" : "#f8fafc" }} onClick={onBack}
        >
          <Box as="span" display={{ base:"none", sm:"inline" }}>Quay lại danh sách</Box>
          <Box as="span" display={{ base:"inline", sm:"none" }}>Quay lại</Box>
        </Button>
        <Flex gap="8px">
          {/* Nút xóa ở detail */}
          <Button h="38px" px={{ base:"12px", md:"16px" }} borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
            _hover={{ bg:"#fee2e2", transform:"translateY(-1px)" }}
            _active={{ transform:"translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdDeleteOutline} />} onClick={onDelete}
          >
            <Box as="span" display={{ base:"none", sm:"inline" }}>Xóa vĩnh viễn</Box>
          </Button>
          <Button h="38px" px={{ base:"14px", md:"20px" }} borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.3)"
            _hover={{ boxShadow:"0 6px 20px rgba(249,115,22,0.4)", transform:"translateY(-1px)" }}
            _active={{ transform:"translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdEdit} />} onClick={onEdit}
          >Chỉnh sửa</Button>
        </Flex>
      </Flex>

      <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
        boxShadow={isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)"}
        overflow="hidden" mb="16px"
      >
        <Box h="4px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation:`${shimmer} 3s linear infinite` }}
        />
        <Flex direction={{ base:"column", md:"row" }}>
          <Box w={{ base:"100%", md:"240px" }} flexShrink="0"
            bg={isDark ? "rgba(249,115,22,0.08)" : "linear-gradient(145deg, #fff7ed, #fffbeb)"}
            display="flex" alignItems="center" justifyContent="center"
            p="28px 20px" borderRight={{ md:`1px solid ${cardBorder}` }}
          >
            <Flex direction="column" align="center" gap="8px">
              <Box w="64px" h="64px" borderRadius="20px"
                bg="linear-gradient(135deg,#f97316,#fbbf24)"
                display="flex" alignItems="center" justifyContent="center"
                boxShadow="0 8px 24px rgba(249,115,22,0.4)"
                sx={{ animation:`${float} 3s ease infinite` }}
              >
                <Icon as={v.type === "Quà tặng" ? FaGift : v.type === "Giảm %" ? FaPercent : MdAttachMoney}
                  boxSize="28px" color="white" />
              </Box>
              <Text fontSize="34px" fontWeight="900" color="#f97316" lineHeight="1">
                {v.type === "Giảm %" ? `${v.value}%` : v.type === "Giảm tiền" ? `-${(v.value/1000).toFixed(0)}K` : "🎁"}
              </Text>
              <Text fontSize="11px" color="#b45309" fontWeight="600">{v.type}</Text>
              <CopyCodeBtn code={v.code} />
            </Flex>
          </Box>

          <Box p={{ base:"18px", md:"24px" }} flex="1">
            <Flex justify="space-between" align="flex-start" mb="10px">
              <Box flex="1" minW="0" pr="8px">
                <Text fontSize={{ base:"18px", md:"22px" }} fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"}
                  letterSpacing="-0.4px" mb="8px" lineHeight="1.2">{v.name}
                </Text>
                <Flex gap="8px" flexWrap="wrap">
                  <StatusBadge status={v.status} />
                  <TypeBadge type={v.type} />
                </Flex>
              </Box>
            </Flex>

            <Box h="1px" bg={isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"} mb="14px" />

            <SimpleGrid columns={{ base:2, md:4 }} spacing="10px" mb="14px">
              {[
                { label:"Đã sử dụng", val:`${v.usedCount.toLocaleString()} lượt`, color:"#f97316" },
                { label:"Còn lại",    val:`${remaining.toLocaleString()} lượt`,    color:"#059669" },
                { label:"Tổng giới hạn",val:`${v.maxUses.toLocaleString()} lượt`, color: isDark ? "#f1f5f9" : "#0f172a" },
                { label:"Đơn tối thiểu",val:`${v.minOrder.toLocaleString()}đ`,     color:"#7c3aed" },
              ].map(({ label, val, color }) => (
                <Box key={label} p="10px 12px" borderRadius="10px"
                  bg={isDark ? "rgba(255,255,255,0.06)" : "#f8fafc"}
                  border={`1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"}`}
                >
                  <Text fontSize="9px" fontWeight="700" color="#94a3b8" letterSpacing="0.7px" textTransform="uppercase" mb="3px">{label}</Text>
                  <Text fontSize="14px" fontWeight="800" color={color}>{val}</Text>
                </Box>
              ))}
            </SimpleGrid>

            <Box mb="14px">
              <Flex justify="space-between" mb="6px">
                <Text fontSize="11.5px" fontWeight="700" color={isDark ? "#cbd5e1" : "#374151"}>Tỷ lệ sử dụng</Text>
                <Text fontSize="11.5px" fontWeight="800" color={pct >= 90 ? "#ef4444" : "#f97316"}>{pct}%</Text>
              </Flex>
              <Box h="8px" bg={isDark ? "rgba(255,255,255,0.1)" : "#f1f5f9"} borderRadius="full" overflow="hidden">
                <Box h="100%" w={`${pct}%`} borderRadius="full"
                  bg={pct >= 90 ? "linear-gradient(90deg,#f97316,#ef4444)" : "linear-gradient(90deg,#f97316,#fbbf24)"}
                  transition="width 0.8s ease" />
              </Box>
            </Box>

            <Box p="12px 14px" borderRadius="12px"
              bg={isDark ? "rgba(249,115,22,0.08)" : "#fffbf7"}
              border={`1px solid ${isDark ? "rgba(249,115,22,0.25)" : "#fed7aa"}`}
            >
              <Text fontSize="10px" fontWeight="800" color="#92400e" letterSpacing="1px" textTransform="uppercase" mb="6px">Mô tả & Điều kiện</Text>
              <Text fontSize="13px" color={isDark ? "#cbd5e1" : "#475569"} lineHeight="1.7">{v.description}</Text>
            </Box>
          </Box>
        </Flex>
      </Box>

      <Grid templateColumns={{ base:"1fr", md:"repeat(3,1fr)" }} gap="12px" mb="16px">
        {[
          { label:"Ngày bắt đầu",  val:v.startDate,    icon:MdCalendarToday, color:"#059669" },
          { label:"Ngày kết thúc", val:v.endDate,       icon:MdAccessTime,   color:"#dc2626" },
          { label:"Tiết kiệm tổng",val:`${totalSaved.toLocaleString()}đ`, icon:FaCoins, color:"#f97316" },
        ].map(({ label, val, icon:Ic, color }) => (
          <Box key={label} bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="14px"
          >
            <Flex align="center" gap="8px" mb="8px">
              <Box w="28px" h="28px" borderRadius="8px" bg="#fff7ed"
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={Ic} boxSize="13px" color={color} />
              </Box>
              <Text fontSize="10px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px" textTransform="uppercase">{label}</Text>
            </Flex>
            <Text fontSize="15px" fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"}>{val}</Text>
          </Box>
        ))}
      </Grid>

      <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base:"16px", md:"20px" }}
      >
        <Flex align="center" justify="space-between" mb="14px">
          <Flex align="center" gap="8px">
            <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
            <Text fontSize="13px" fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"}>Lịch sử sử dụng gần nhất</Text>
          </Flex>
          {relatedHistory.length > 0 && (
            <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
              <Text fontSize="11px" fontWeight="700" color="#f97316">{relatedHistory.length} giao dịch</Text>
            </Box>
          )}
        </Flex>

        {relatedHistory.length === 0 ? (
          <Flex direction="column" align="center" py="24px" color="#cbd5e1">
            <Icon as={FaTicketAlt} boxSize="22px" mb="6px" />
            <Text fontSize="12px" color="#94a3b8">Chưa có lượt sử dụng nào</Text>
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table size="sm" variant="unstyled">
              <Thead>
                <Tr>
                  {["Khách hàng","Mã đơn","Tiết kiệm","Thời gian"].map(h => (
                    <Th key={h} fontSize="10px" fontWeight="800" color="#94a3b8"
                      letterSpacing="1px" textTransform="uppercase" pb="10px">{h}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {relatedHistory.map(row => (
                  <Tr key={row.id}
                    _hover={{ bg: isDark ? "rgba(255,255,255,0.04)" : "#fafafa" }}
                    transition="all 0.15s"
                  >
                    <Td py="10px"><Text fontSize="13px" fontWeight="600" color={isDark ? "#f1f5f9" : "#0f172a"}>{row.user}</Text></Td>
                    <Td><Text fontSize="12px" fontWeight="700" color="#f97316">{row.orderId}</Text></Td>
                    <Td><Text fontSize="13px" fontWeight="700" color="#059669">-{row.amount.toLocaleString()}đ</Text></Td>
                    <Td><Text fontSize="11px" color="#94a3b8">{row.date}</Text></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
export default function QuanlyVoucher() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [vouchers, setVouchers] = useState(VOUCHERS_DATA);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterType, setFilterType] = useState("Tất cả");
  const [displayMode, setDisplayMode] = useState("grid");
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("vouchers");
  const [deleteTarget, setDeleteTarget] = useState(null);   // voucher cần xóa
  const [isDark, setIsDark] = useState(true);               // dark mode state

  const toggleDark = useCallback(() => setIsDark(d => !d), []);

  const filtered = vouchers.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        v.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" || v.status === filterStatus;
    const matchType   = filterType   === "Tất cả" || v.type   === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    total:    vouchers.length,
    active:   vouchers.filter(v => v.status === "Đang hoạt động").length,
    paused:   vouchers.filter(v => v.status === "Tạm dừng").length,
    expired:  vouchers.filter(v => v.status === "Hết hạn" || v.status === "Đã dùng hết").length,
    totalUsed: vouchers.reduce((s,v) => s + v.usedCount, 0),
  };

  const handleToggle = (v) => {
    setVouchers(prev => prev.map(vv =>
      vv.id === v.id
        ? { ...vv, status: vv.status === "Tạm dừng" ? "Đang hoạt động" : "Tạm dừng" }
        : vv
    ));
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setVouchers(prev => prev.filter(v => v.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (view === "detail" && selected?.id === deleteTarget.id) {
      setView("list");
      setSelected(null);
    }
  };

  const handleSave = (form) => {
    if (view === "add") {
      setVouchers(prev => [...prev, {
        ...form, id: `V${String(prev.length+1).padStart(3,"0")}`,
        usedCount: 0, createdAt: new Date().toLocaleDateString("vi-VN"),
      }]);
    } else {
      setVouchers(prev => prev.map(v => v.id === selected.id ? { ...v, ...form } : v));
      setSelected(s => ({ ...s, ...form }));
    }
    setView("list");
  };

  // ── Theme variables ──
  const pageBg = isDark ? "transparent" : "transparent";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "white";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#94a3b8";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "#f8fafc";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "#e8edf3";

  // ── LIST VIEW ──
  if (view === "list") {
    return (
      <Box pt={{ base:"100px", md:"80px" }} px="0" position="relative">
        {/* Delete confirm modal */}
        {deleteTarget && (
          <DeleteModal
            voucher={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
            isDark={isDark}
          />
        )}

        {/* Page header */}
        <Flex justify="space-between" align={{ base:"start", md:"center" }}
          direction={{ base:"column", md:"row" }} mb="18px" gap="12px"
        >
          <Box sx={{ animation:`${fadeUp} 0.4s ease both` }}>
            <Flex align="center" gap="10px" mb="4px">
              <Box w="42px" h="42px" borderRadius="13px"
                bg="linear-gradient(135deg,#f97316,#fbbf24)"
                display="flex" alignItems="center" justifyContent="center"
                boxShadow="0 6px 16px rgba(249,115,22,0.4)"
                sx={{ animation:`${float} 3s ease infinite` }}
              >
                <Icon as={MdLocalOffer} boxSize="20px" color="white" />
              </Box>
              <Box>
                <Text fontSize={{ base:"22px", md:"26px" }} fontWeight="800" color={textPrimary} letterSpacing="-0.5px">
                  Quản lý Voucher
                </Text>
                <Text color={textMuted} fontSize="12px">Tạo & quản lý mã ưu đãi cho khách hàng</Text>
              </Box>
            </Flex>
          </Box>

          <Flex gap="8px" w={{ base:"100%", md:"auto" }} align="center" sx={{ animation:`${fadeIn} 0.4s ease 0.1s both` }}>
            {/* Dark mode toggle */}
            <DarkModeToggle isDark={isDark} onToggle={toggleDark} />

            {/* Grid/List toggle */}
            <Flex borderRadius="10px"
              border={`1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
              overflow="hidden" flexShrink="0"
            >
              {["grid","list"].map(mode => (
                <Box key={mode} px="12px" py="8px" cursor="pointer"
                  bg={displayMode === mode ? "linear-gradient(135deg,#f97316,#fb923c)" : (isDark ? "rgba(255,255,255,0.04)" : "#f8fafc")}
                  transition="all 0.2s"
                  onClick={() => setDisplayMode(mode)}
                >
                  <Text fontSize="11px" fontWeight="700" color={displayMode === mode ? "white" : textMuted}>
                    {mode === "grid" ? "⊞ Lưới" : "☰ Bảng"}
                  </Text>
                </Box>
              ))}
            </Flex>
            <Button flex={{ base:"1", md:"none" }}
              h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
              bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
              boxShadow="0 4px 14px rgba(249,115,22,0.35)"
              _hover={{ boxShadow:"0 6px 20px rgba(249,115,22,0.45)", transform:"translateY(-1px)" }}
              _active={{ transform:"translateY(0)" }} transition="all 0.2s"
              leftIcon={<Icon as={MdAdd} />}
              onClick={() => setView("add")}
            >Tạo voucher</Button>
          </Flex>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base:2, md:5 }} spacing="10px" mb="18px">
          <StatCard label="Tổng voucher"  value={counts.total}    icon={MdLocalOffer}   accent="#f97316" delay={0}    isDark={isDark} />
          <StatCard label="Đang chạy"     value={counts.active}   icon={MdPlayCircle}   accent="#10b981" delay={0.05} isDark={isDark} />
          <StatCard label="Tạm dừng"      value={counts.paused}   icon={MdPause}        accent="#f59e0b" delay={0.1}  isDark={isDark} />
          <StatCard label="Hết hạn/Dùng hết" value={counts.expired} icon={MdStop}       accent="#94a3b8" delay={0.15} isDark={isDark} />
          <StatCard label="Tổng lượt dùng" value={counts.totalUsed.toLocaleString()} icon={FaFire} accent="#ef4444" delay={0.2} isDark={isDark} />
        </SimpleGrid>

        {/* Tabs */}
        <Flex gap="0" mb="16px" borderRadius="12px"
          border={`1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
          bg={isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"}
          p="4px" w="fit-content"
        >
          {[
            { key:"vouchers", label:"Danh sách Voucher", icon:MdLocalOffer },
            { key:"history",  label:"Lịch sử sử dụng",  icon:MdBarChart },
          ].map(({ key, label, icon:Ic }) => (
            <Box key={key} px="16px" py="7px" borderRadius="9px" cursor="pointer"
              bg={activeTab === key ? (isDark ? "rgba(255,255,255,0.1)" : "white") : "transparent"}
              boxShadow={activeTab === key ? (isDark ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.08)") : "none"}
              transition="all 0.2s" onClick={() => setActiveTab(key)}
            >
              <Flex align="center" gap="6px">
                <Icon as={Ic} boxSize="13px" color={activeTab === key ? "#f97316" : "#94a3b8"} />
                <Text fontSize="12.5px" fontWeight="700" color={activeTab === key ? textPrimary : "#94a3b8"}>
                  {label}
                </Text>
              </Flex>
            </Box>
          ))}
        </Flex>

        {activeTab === "vouchers" ? (
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            sx={{ animation:`${fadeUp} 0.4s ease 0.1s both` }}
          >
            <Box p={{ base:"14px 16px", md:"18px 20px 14px" }}
              borderBottom={`1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f8fafc"}`}
            >
              <Flex align="center" justify="space-between" mb="12px">
                <Flex align="center" gap="8px">
                  <Text fontWeight="800" fontSize={{ base:"14px", md:"15px" }} color={textPrimary}>Danh sách voucher</Text>
                  <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                    <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} mã</Text>
                  </Box>
                </Flex>
                <Flex gap="8px" align="center">
                  {/* Export button */}
                  <Tooltip label="Export danh sách voucher ra CSV" placement="bottom">
                    <Button size="sm" h="34px" px="12px" borderRadius="9px"
                      bg={isDark ? "rgba(16,185,129,0.15)" : "#ecfdf5"}
                      color="#059669" border="1px solid #6ee7b7"
                      fontSize="12px" fontWeight="600"
                      leftIcon={<Icon as={MdDownload} boxSize="13px" />}
                      _hover={{ bg: isDark ? "rgba(16,185,129,0.25)" : "#d1fae5" }} transition="all 0.15s"
                      onClick={() => exportVouchersToCSV(filtered, "danh-sach-voucher.csv")}
                      display={{ base:"none", md:"flex" }}
                    >Export CSV</Button>
                  </Tooltip>
                  <Button display={{ base:"flex", md:"none" }} size="sm" h="34px" px="12px"
                    borderRadius="9px"
                    bg={isDark ? "rgba(255,255,255,0.07)" : "#f8fafc"}
                    color={textMuted}
                    border={`1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`}
                    fontSize="12px" fontWeight="600" leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
                    _hover={{ bg: isDark ? "rgba(255,255,255,0.1)" : "#f1f5f9" }}
                    onClick={() => setShowFilter(v => !v)}
                  >Lọc</Button>
                </Flex>
              </Flex>

              <Box display={{ base: showFilter ? "block" : "none", md:"block" }}>
                <Flex gap="10px" direction={{ base:"column", sm:"row" }}>
                  <Box position="relative" flex="1">
                    <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                      transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1"
                    />
                    <Input pl="30px" h={{ base:"40px", md:"34px" }} w="100%" fontSize="12.5px"
                      placeholder="Tìm tên voucher, mã code..."
                      bg={inputBg}
                      border={`1px solid ${inputBorder}`}
                      borderRadius="9px" color={textPrimary}
                      _placeholder={{ color:"#b0bac8" }}
                      _focus={{ border:"1.5px solid #f97316", boxShadow:"0 0 0 3px rgba(249,115,22,0.08)" }}
                      _hover={{ border:"1px solid #f97316" }} transition="all 0.2s"
                      value={search} onChange={e => setSearch(e.target.value)}
                    />
                  </Box>
                  <Select h={{ base:"40px", md:"34px" }} fontSize="12.5px" fontWeight="600"
                    color={textPrimary} bg={inputBg} border={`1px solid ${inputBorder}`}
                    borderRadius="9px" w={{ base:"100%", sm:"150px" }}
                    _focus={{ border:"1.5px solid #f97316" }} _hover={{ border:"1px solid #f97316" }}
                    transition="all 0.2s" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value="Tất cả">Tất cả trạng thái</option>
                    <option>Đang hoạt động</option>
                    <option>Tạm dừng</option>
                    <option>Hết hạn</option>
                    <option>Đã dùng hết</option>
                  </Select>
                  <Select h={{ base:"40px", md:"34px" }} fontSize="12.5px" fontWeight="600"
                    color={textPrimary} bg={inputBg} border={`1px solid ${inputBorder}`}
                    borderRadius="9px" w={{ base:"100%", sm:"140px" }}
                    _focus={{ border:"1.5px solid #f97316" }} _hover={{ border:"1px solid #f97316" }}
                    transition="all 0.2s" value={filterType} onChange={e => setFilterType(e.target.value)}
                  >
                    <option value="Tất cả">Tất cả loại</option>
                    <option>Giảm %</option>
                    <option>Giảm tiền</option>
                    <option>Quà tặng</option>
                  </Select>
                </Flex>
              </Box>
            </Box>

            <Box p={{ base:"10px", md:"14px" }}>
              {filtered.length === 0 ? (
                <Flex direction="column" align="center" py="48px" color="#cbd5e1">
                  <Icon as={MdLocalOffer} boxSize="32px" mb="8px" />
                  <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy voucher nào</Text>
                </Flex>
              ) : displayMode === "grid" ? (
                <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr", xl:"repeat(3,1fr)" }} gap="10px">
                  {filtered.map((v, i) => (
                    <VoucherCard key={v.id} v={v} index={i} isDark={isDark}
                      onView={vv => { setSelected(vv); setView("detail"); }}
                      onEdit={vv => { setSelected(vv); setView("edit"); }}
                      onToggle={handleToggle}
                      onDelete={vv => setDeleteTarget(vv)}
                    />
                  ))}
                </Grid>
              ) : (
                <>
                  <Flex px="16px" py="10px"
                    bg={isDark ? "rgba(255,255,255,0.04)" : "#fafbfc"}
                    borderBottom={`1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}`}
                    borderRadius="8px" mb="6px" display={{ base:"none", md:"flex" }}
                  >
                    <Box w="32px" flexShrink="0"><Text fontSize="10px" fontWeight="800" color="#cbd5e1" letterSpacing="1px">#</Text></Box>
                    <Box flex="2"><Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Tên / Mã</Text></Box>
                    <Box flex="0.7"><Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Loại / Giá trị</Text></Box>
                    <Box flex="1"><Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Sử dụng</Text></Box>
                    <Box flex="0.8"><Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Trạng thái</Text></Box>
                    <Box flex="0.7"><Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Hết hạn</Text></Box>
                    <Box w="200px" flexShrink="0" textAlign="right"><Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Hành động</Text></Box>
                  </Flex>
                  <Flex direction="column" gap="6px">
                    {filtered.map((v, i) => (
                      <VoucherRow key={v.id} v={v} index={i} isDark={isDark}
                        onView={vv => { setSelected(vv); setView("detail"); }}
                        onEdit={vv => { setSelected(vv); setView("edit"); }}
                        onToggle={handleToggle}
                        onDelete={vv => setDeleteTarget(vv)}
                      />
                    ))}
                  </Flex>
                </>
              )}
            </Box>
          </Box>
        ) : (
          /* ── History tab ── */
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base:"16px", md:"20px" }}
            sx={{ animation:`${fadeUp} 0.4s ease 0.1s both` }}
          >
            <Flex align="center" justify="space-between" mb="16px">
              <Flex align="center" gap="8px">
                <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
                <Text fontSize="14px" fontWeight="800" color={textPrimary}>Lịch sử sử dụng voucher</Text>
              </Flex>
              <Flex gap="8px">
                <Button size="sm" h="32px" px="12px" borderRadius="8px"
                  bg={isDark ? "rgba(16,185,129,0.15)" : "#ecfdf5"}
                  color="#059669" border="1px solid #6ee7b7"
                  fontSize="12px" fontWeight="600" leftIcon={<Icon as={MdDownload} boxSize="12px" />}
                  _hover={{ bg: isDark ? "rgba(16,185,129,0.25)" : "#d1fae5" }}
                  onClick={() => exportHistoryToCSV(USE_HISTORY)}
                >Export CSV</Button>
              </Flex>
            </Flex>
            <Box overflowX="auto">
              <Table size="sm" variant="unstyled">
                <Thead>
                  <Tr bg={isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"}>
                    {["Mã voucher","Khách hàng","Mã đơn hàng","Tiết kiệm","Thời gian"].map(h => (
                      <Th key={h} fontSize="10px" fontWeight="800" color="#94a3b8"
                        letterSpacing="1px" textTransform="uppercase" py="10px" px="12px">{h}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {USE_HISTORY.map((row, i) => (
                    <Tr key={row.id}
                      _hover={{ bg: isDark ? "rgba(249,115,22,0.06)" : "#fffbf7" }}
                      transition="all 0.15s"
                      sx={{ animation:`${fadeUp} 0.3s ease ${i*0.04}s both` }}
                    >
                      <Td py="12px" px="12px">
                        <Box px="8px" py="4px" borderRadius="7px" bg="#fff7ed" border="1px solid #fed7aa" display="inline-block">
                          <Text fontSize="12px" fontWeight="800" color="#c2410c" fontFamily="monospace">{row.code}</Text>
                        </Box>
                      </Td>
                      <Td px="12px"><Text fontSize="13px" fontWeight="600" color={textPrimary}>{row.user}</Text></Td>
                      <Td px="12px"><Text fontSize="12px" fontWeight="700" color="#f97316">{row.orderId}</Text></Td>
                      <Td px="12px"><Text fontSize="13px" fontWeight="700" color="#059669">-{row.amount.toLocaleString()}đ</Text></Td>
                      <Td px="12px"><Text fontSize="11px" color="#94a3b8">{row.date}</Text></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  if (view === "detail" && selected) {
    return (
      <Box pt={{ base:"100px", md:"80px" }} position="relative">
        {deleteTarget && (
          <DeleteModal
            voucher={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
            isDark={isDark}
          />
        )}
        <VoucherDetail
          v={vouchers.find(v => v.id === selected.id) || selected}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          onDelete={() => setDeleteTarget(vouchers.find(v => v.id === selected.id) || selected)}
          isDark={isDark}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base:"100px", md:"80px" }}>
        <VoucherForm isAdd onCancel={() => setView("list")} onSave={handleSave} isDark={isDark} />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    return (
      <Box pt={{ base:"100px", md:"80px" }}>
        <VoucherForm
          voucher={vouchers.find(v => v.id === selected.id) || selected}
          onCancel={() => setView("detail")}
          onSave={handleSave}
          isDark={isDark}
        />
      </Box>
    );
  }

  return null;
}