import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, Badge, SimpleGrid, Divider,
  FormControl, Input, Select, Textarea, Avatar, AvatarBadge,
  useColorModeValue, Icon, keyframes, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel, Tag,
} from "@chakra-ui/react";
import {
  MdAdd, MdEdit, MdArrowBack, MdSearch, MdFilterList,
  MdStar, MdClose, MdCheckCircle, MdPerson, MdEmail, MdPhone,
  MdLock, MdLockOpen, MdHistory, MdCardGiftcard, MdTrendingUp,
  MdTrendingDown, MdDiamond, MdNotifications, MdVisibility,
  MdBlock, MdUndo, MdNotes, MdCake, MdCalendarToday,
} from "react-icons/md";
import {
  FaUserCircle, FaUsers, FaCoins, FaCrown, FaMedal,
  FaUserCheck, FaUserTimes, FaGem, FaAward, FaTicketAlt,
} from "react-icons/fa";
import { GiDiamondRing, GiLaurelCrown, GiMedal } from "react-icons/gi";
import Card from "components/card/Card";

// ─── Keyframes ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
  50% { opacity: 0.85; box-shadow: 0 0 0 6px rgba(249,115,22,0); }
`;
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(249,115,22,0.3); }
  50% { box-shadow: 0 0 20px rgba(249,115,22,0.7); }
`;

// ─── Rank configs ─────────────────────────────────────────────────────────────
const RANK_CONFIG = {
  "Đồng": {
    color: "#92400e",
    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    border: "#f59e0b",
    dot: "#d97706",
    text: "#78350f",
    icon: GiMedal,
    badgeBg: "#fef3c7",
    badgeBorder: "#f59e0b",
    min: 0,
    max: 999,
    glow: "rgba(217,119,6,0.25)",
  },
  "Bạc": {
    color: "#374151",
    bg: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    border: "#94a3b8",
    dot: "#64748b",
    text: "#1e293b",
    icon: FaMedal,
    badgeBg: "#f1f5f9",
    badgeBorder: "#94a3b8",
    min: 1000,
    max: 4999,
    glow: "rgba(100,116,139,0.2)",
  },
  "Vàng": {
    color: "#92400e",
    bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    border: "#d97706",
    dot: "#f59e0b",
    text: "#78350f",
    icon: FaCrown,
    badgeBg: "#fffbeb",
    badgeBorder: "#d97706",
    min: 5000,
    max: 14999,
    glow: "rgba(245,158,11,0.3)",
  },
  "Kim cương": {
    color: "#1e40af",
    bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    border: "#3b82f6",
    dot: "#2563eb",
    text: "#1e3a8a",
    icon: GiDiamondRing,
    badgeBg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    badgeBorder: "#3b82f6",
    min: 15000,
    max: Infinity,
    glow: "rgba(59,130,246,0.3)",
  },
};

const STATUS_CONFIG = {
  "Hoạt động": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Bị khóa":   { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
};

// ─── Static member data ───────────────────────────────────────────────────────
const MEMBERS = [
  {
    id: 1,
    name: "Nguyễn Minh Khoa",
    email: "minhkhoa@gmail.com",
    phone: "0912 345 678",
    avatar: "NK",
    rank: "Kim cương",
    points: 18450,
    totalSpend: 4200000,
    ticketCount: 84,
    joinDate: "15/03/2023",
    lastActivity: "2026-05-22",
    status: "Hoạt động",
    birthday: "14/07/1998",
    gender: "Nam",
    address: "12 Lê Lợi, Q.1, TP.HCM",
    pointHistory: [
      { date: "22/05/2026", action: "Mua vé Avengers", type: "earn", points: 150, note: "" },
      { date: "18/05/2026", action: "Đổi điểm lấy voucher 50K", type: "spend", points: -500, note: "" },
      { date: "10/05/2026", action: "Mua vé Spider-Man", type: "earn", points: 120, note: "" },
      { date: "03/05/2026", action: "Cộng điểm thủ công – lỗi hệ thống", type: "manual", points: 200, note: "Hệ thống cộng thiếu điểm ngày 01/05" },
      { date: "28/04/2026", action: "Mua combo bắp nước", type: "earn", points: 50, note: "" },
    ],
    ticketHistory: [
      { date: "22/05/2026", movie: "Avengers: Infinity War", cinema: "CGV Vincom", seats: "E5, E6", total: 300000 },
      { date: "10/05/2026", movie: "Spider-Man: No Way Home", cinema: "Lotte Q7", seats: "G8", total: 120000 },
      { date: "28/04/2026", movie: "Thor: Love and Thunder", cinema: "CGV Vincom", seats: "D4, D5, D6", total: 360000 },
    ],
  },
  {
    id: 2,
    name: "Trần Thị Lan Anh",
    email: "lananh.tran@outlook.com",
    phone: "0987 654 321",
    avatar: "LA",
    rank: "Vàng",
    points: 7230,
    totalSpend: 1850000,
    ticketCount: 37,
    joinDate: "08/11/2023",
    lastActivity: "2026-05-20",
    status: "Hoạt động",
    birthday: "22/12/2001",
    gender: "Nữ",
    address: "45 Hoàng Diệu, Q. Hải Châu, Đà Nẵng",
    pointHistory: [
      { date: "20/05/2026", action: "Mua vé Doctor Strange", type: "earn", points: 100, note: "" },
      { date: "15/05/2026", action: "Tặng điểm sinh nhật", type: "manual", points: 500, note: "Chương trình sinh nhật tháng 5" },
    ],
    ticketHistory: [
      { date: "20/05/2026", movie: "Doctor Strange 2", cinema: "BHD Star Bitexco", seats: "H10", total: 100000 },
    ],
  },
  {
    id: 3,
    name: "Phạm Đức Hùng",
    email: "duchung99@gmail.com",
    phone: "0356 789 012",
    avatar: "DH",
    rank: "Bạc",
    points: 2180,
    totalSpend: 620000,
    ticketCount: 12,
    joinDate: "20/01/2025",
    lastActivity: "2026-04-30",
    status: "Bị khóa",
    birthday: "05/03/1999",
    gender: "Nam",
    address: "88 Trần Hưng Đạo, TP. Huế",
    pointHistory: [
      { date: "30/04/2026", action: "Mua vé Thor", type: "earn", points: 90, note: "" },
    ],
    ticketHistory: [
      { date: "30/04/2026", movie: "Thor: Love and Thunder", cinema: "Lotte Đà Nẵng", seats: "C3", total: 90000 },
    ],
  },
  {
    id: 4,
    name: "Lê Hoàng Vy",
    email: "hoangvy.le@gmail.com",
    phone: "0777 234 567",
    avatar: "HV",
    rank: "Đồng",
    points: 320,
    totalSpend: 180000,
    ticketCount: 3,
    joinDate: "10/04/2026",
    lastActivity: "2026-05-01",
    status: "Hoạt động",
    birthday: "19/09/2003",
    gender: "Nữ",
    address: "15 Nguyễn Văn Linh, Buôn Ma Thuột, Đắk Lắk",
    pointHistory: [
      { date: "01/05/2026", action: "Mua vé Thor", type: "earn", points: 90, note: "" },
      { date: "15/04/2026", action: "Đăng ký tài khoản mới", type: "earn", points: 100, note: "" },
    ],
    ticketHistory: [
      { date: "01/05/2026", movie: "Thor: Love and Thunder", cinema: "CGV BMT", seats: "F7", total: 90000 },
    ],
  },
  {
    id: 5,
    name: "Bùi Thanh Tùng",
    email: "tungthanh.bui@yahoo.com",
    phone: "0909 876 543",
    avatar: "TT",
    rank: "Vàng",
    points: 6850,
    totalSpend: 1700000,
    ticketCount: 34,
    joinDate: "03/07/2024",
    lastActivity: "2026-05-23",
    status: "Hoạt động",
    birthday: "30/01/1995",
    gender: "Nam",
    address: "77 Đinh Tiên Hoàng, Q. Bình Thạnh, TP.HCM",
    pointHistory: [
      { date: "23/05/2026", action: "Mua vé Spider-Man", type: "earn", points: 140, note: "" },
      { date: "12/05/2026", action: "Đổi điểm popcorn combo", type: "spend", points: -300, note: "" },
    ],
    ticketHistory: [
      { date: "23/05/2026", movie: "Spider-Man: No Way Home", cinema: "CGV SC VivoCity", seats: "J12, J13", total: 280000 },
    ],
  },
];

// ─── Rank Badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank, size = "sm" }) {
  const cfg = RANK_CONFIG[rank];
  const IconComp = cfg.icon;
  const isLg = size === "lg";
  return (
    <Flex
      align="center" gap={isLg ? "7px" : "5px"}
      px={isLg ? "12px" : "9px"} py={isLg ? "6px" : "4px"}
      borderRadius={isLg ? "10px" : "7px"}
      bg={cfg.badgeBg} border={`1.5px solid ${cfg.badgeBorder}`}
      display="inline-flex" w="fit-content"
      boxShadow={`0 2px 8px ${cfg.glow}`}
    >
      <Icon as={IconComp} boxSize={isLg ? "14px" : "11px"} color={cfg.dot} />
      <Text fontSize={isLg ? "13px" : "11px"} fontWeight="800" color={cfg.text}>
        {rank}
      </Text>
    </Flex>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Hoạt động"];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="7px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Hoạt động" ? { animation: `${pulse} 2s ease infinite` } : {}} />
      <Text fontSize="11px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function PointTypeBadge({ type }) {
  const cfg = {
    earn:   { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", label: "Tích điểm" },
    spend:  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", label: "Đổi điểm" },
    manual: { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", label: "Thủ công" },
  }[type] || { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0", label: "Khác" };
  return (
    <Box px="7px" py="2px" borderRadius="5px" bg={cfg.bg}
      border={`1px solid ${cfg.border}`} display="inline-block"
    >
      <Text fontSize="10px" fontWeight="700" color={cfg.color}>{cfg.label}</Text>
    </Box>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle = {
  bg: "#fafafa", border: "1.5px solid #e8edf3", borderRadius: "10px",
  color: "#1a202c", fontSize: "14px", fontWeight: "500", px: "14px",
  h: "44px",
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#ffffff" },
  _hover: { border: "1.5px solid #f97316", bg: "#ffffff" },
  transition: "all 0.2s ease",
};
const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "6px",
};

function SectionTitle({ label }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
        <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg="linear-gradient(90deg, #f1f5f9, transparent)" />
    </Box>
  );
}

function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  return (
    <Box p="18px 20px" borderRadius="14px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.25s"
      _hover={{ boxShadow: "0 6px 20px rgba(0,0,0,0.08)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="11px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px"
            textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize="28px" fontWeight="900" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w="44px" h="44px" borderRadius="13px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow={`0 4px 12px ${accent}25`}
        >
          <Icon as={icon} boxSize="20px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Avatar component ─────────────────────────────────────────────────────────
function MemberAvatar({ member, size = "md" }) {
  const cfg = RANK_CONFIG[member.rank];
  const sizes = { sm: "32px", md: "40px", lg: "56px" };
  const fonts = { sm: "11px", md: "13px", lg: "18px" };
  return (
    <Box
      w={sizes[size]} h={sizes[size]} borderRadius="50%"
      bg={cfg.bg} border={`2px solid ${cfg.border}`}
      display="flex" alignItems="center" justifyContent="center"
      boxShadow={`0 0 0 3px ${cfg.glow}`}
      flexShrink="0"
    >
      <Text fontSize={fonts[size]} fontWeight="800" color={cfg.text}>{member.avatar}</Text>
    </Box>
  );
}

// ─── Add Points Modal ─────────────────────────────────────────────────────────
function AddPointsModal({ member, onClose, onSave }) {
  const [pts, setPts] = useState("");
  const [type, setType] = useState("earn");
  const [note, setNote] = useState("");

  const isNeg = type === "spend";
  const delta = parseInt(pts || "0");
  const newTotal = (member.points + (isNeg ? -delta : delta));

  return (
    <Box sx={{ animation: `${scaleIn} 0.25s ease both` }}>
      <Box h="3px" bg="linear-gradient(90deg, #f97316, #fbbf24)"
        bgSize="200%" sx={{ animation: `${shimmer} 2.5s linear infinite` }}
        borderTopRadius="16px" mx="-1px" mt="-1px"
      />
      <Box p="24px">
        <Flex align="center" gap="12px" mb="20px">
          <MemberAvatar member={member} size="lg" />
          <Box>
            <Text fontSize="17px" fontWeight="800" color="#0f172a">{member.name}</Text>
            <Flex gap="6px" mt="4px">
              <RankBadge rank={member.rank} />
              <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px" bg="#fff7ed">
                <Icon as={FaCoins} boxSize="11px" color="#f97316" />
                <Text fontSize="12px" fontWeight="700" color="#f97316">
                  {member.points.toLocaleString()} điểm
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        <Grid templateColumns="1fr 1fr" gap="14px" mb="14px">
          <Box>
            <Text sx={labelStyle}>Loại thao tác</Text>
            <Select {...inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="earn">Cộng điểm (+)</option>
              <option value="spend">Trừ điểm (−)</option>
            </Select>
          </Box>
          <Box>
            <Text sx={labelStyle}>Số điểm *</Text>
            <Input {...inputStyle} type="number" placeholder="VD: 200" min="1"
              value={pts} onChange={(e) => setPts(e.target.value)} />
          </Box>
        </Grid>

        <Box mb="14px">
          <Text sx={labelStyle}>Ghi chú lý do *</Text>
          <Textarea
            bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
            color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
            _placeholder={{ color: "#b0bac8" }}
            _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
            _hover={{ border: "1.5px solid #f97316" }}
            transition="all 0.2s" rows={3}
            placeholder="Nhập lý do thao tác điểm thủ công..."
            value={note} onChange={(e) => setNote(e.target.value)}
          />
        </Box>

        {pts && delta > 0 && (
          <Box p="12px 14px" borderRadius="10px" bg="#fff7ed" border="1px solid #fed7aa" mb="14px"
            sx={{ animation: `${fadeIn} 0.2s ease both` }}
          >
            <Text fontSize="12px" fontWeight="700" color="#92400e">Xem trước thay đổi:</Text>
            <Flex align="center" gap="8px" mt="6px">
              <Text fontSize="13px" fontWeight="600" color="#475569">
                {member.points.toLocaleString()}
              </Text>
              <Icon as={isNeg ? MdTrendingDown : MdTrendingUp}
                color={isNeg ? "#dc2626" : "#059669"} boxSize="16px" />
              <Text fontSize="14px" fontWeight="800" color={isNeg ? "#dc2626" : "#059669"}>
                {isNeg ? `−${delta.toLocaleString()}` : `+${delta.toLocaleString()}`}
              </Text>
              <Text fontSize="12px" color="#94a3b8">=</Text>
              <Text fontSize="15px" fontWeight="900"
                color={newTotal < 0 ? "#dc2626" : "#f97316"}>
                {Math.max(0, newTotal).toLocaleString()} điểm
              </Text>
            </Flex>
          </Box>
        )}

        <Flex gap="10px" justify="flex-end">
          <Button h="42px" px="20px" variant="ghost" borderRadius="10px"
            color="#64748b" border="1.5px solid #e2e8f0" fontWeight="600" fontSize="13px"
            _hover={{ bg: "#f8fafc" }} leftIcon={<Icon as={MdClose} />}
            onClick={onClose}
          >Hủy</Button>
          <Button h="42px" px="24px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            isDisabled={!pts || delta <= 0 || !note.trim()}
            onClick={() => onSave({ pts: delta, type, note })}
          >Xác nhận</Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Member Detail ─────────────────────────────────────────────────────────────
function MemberDetail({ member: initialMember, onBack, members, setMembers }) {
  const member = members.find((m) => m.id === initialMember.id) || initialMember;
  const [showPointModal, setShowPointModal] = useState(false);
  const cfg = RANK_CONFIG[member.rank];
  const stCfg = STATUS_CONFIG[member.status] || STATUS_CONFIG["Hoạt động"];
  const isLocked = member.status === "Bị khóa";
  const pct = Math.min(100, ((member.points - (cfg.min || 0)) / ((cfg.max === Infinity ? 20000 : cfg.max) - (cfg.min || 0))) * 100);

  const nextRankKey = Object.keys(RANK_CONFIG).find(
    (k) => RANK_CONFIG[k].min > cfg.min
  );

  const handleLockToggle = () => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? { ...m, status: isLocked ? "Hoạt động" : "Bị khóa" }
          : m
      )
    );
  };

  const handleSavePoints = ({ pts, type, note }) => {
    const delta = type === "spend" ? -pts : pts;
    const newPoints = Math.max(0, member.points + delta);
    const newHistory = [
      {
        date: new Date().toLocaleDateString("vi-VN"),
        action: note,
        type: "manual",
        points: delta,
        note,
      },
      ...member.pointHistory,
    ];

    let newRank = member.rank;
    for (const [rank, rcfg] of Object.entries(RANK_CONFIG)) {
      if (newPoints >= rcfg.min && (rcfg.max === Infinity || newPoints <= rcfg.max)) {
        newRank = rank;
      }
    }

    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? { ...m, points: newPoints, rank: newRank, pointHistory: newHistory }
          : m
      )
    );
    setShowPointModal(false);
  };

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Back + actions */}
      <Flex align="center" justify="space-between" mb="18px" gap="10px" flexWrap="wrap">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} onClick={onBack}
        >Quay lại</Button>
        <Flex gap="8px">
          <Button h="38px" px="16px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={isLocked ? "#ecfdf5" : "#fef2f2"}
            color={isLocked ? "#059669" : "#dc2626"}
            border={`1.5px solid ${isLocked ? "#6ee7b7" : "#fca5a5"}`}
            _hover={{ opacity: 0.85 }} transition="all 0.2s"
            leftIcon={<Icon as={isLocked ? MdLockOpen : MdLock} />}
            onClick={handleLockToggle}
          >{isLocked ? "Mở khóa" : "Khóa tài khoản"}</Button>
          <Button h="38px" px="16px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" boxShadow="0 4px 14px rgba(249,115,22,0.3)"
            _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={FaCoins} />}
            onClick={() => setShowPointModal(true)}
          >Cộng/Trừ điểm</Button>
        </Flex>
      </Flex>

      {/* Hero card */}
      <Box bg="white" borderRadius="20px" border="1px solid #f1f5f9"
        boxShadow="0 4px 24px rgba(0,0,0,0.07)" overflow="hidden" mb="16px"
      >
        <Box h="5px" bg={cfg.bg} bgSize="200%" />
        <Box p={{ base: "20px", md: "28px" }}>
          <Flex gap="20px" align={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", sm: "row" }}
          >
            {/* Big avatar */}
            <Box position="relative" flexShrink="0">
              <Box
                w="72px" h="72px" borderRadius="50%"
                bg={cfg.bg} border={`3px solid ${cfg.border}`}
                display="flex" alignItems="center" justifyContent="center"
                boxShadow={`0 0 0 6px ${cfg.glow}, 0 8px 24px ${cfg.glow}`}
                sx={{ animation: `${glow} 3s ease infinite` }}
              >
                <Text fontSize="22px" fontWeight="900" color={cfg.text}>{member.avatar}</Text>
              </Box>
              <Box position="absolute" bottom="-2px" right="-2px"
                w="22px" h="22px" borderRadius="50%"
                bg={stCfg.bg} border={`2px solid ${stCfg.border}`}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Box w="8px" h="8px" borderRadius="full" bg={stCfg.dot} />
              </Box>
            </Box>

            <Box flex="1" minW="0">
              <Flex align="center" gap="10px" mb="6px" flexWrap="wrap">
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="900" color="#0f172a"
                  letterSpacing="-0.5px">
                  {member.name}
                </Text>
                <RankBadge rank={member.rank} size="lg" />
                <StatusBadge status={member.status} />
              </Flex>
              <Flex gap="16px" flexWrap="wrap">
                <Flex align="center" gap="5px">
                  <Icon as={MdEmail} boxSize="12px" color="#94a3b8" />
                  <Text fontSize="13px" color="#64748b">{member.email}</Text>
                </Flex>
                <Flex align="center" gap="5px">
                  <Icon as={MdPhone} boxSize="12px" color="#94a3b8" />
                  <Text fontSize="13px" color="#64748b">{member.phone}</Text>
                </Flex>
                <Flex align="center" gap="5px">
                  <Icon as={MdCalendarToday} boxSize="12px" color="#94a3b8" />
                  <Text fontSize="13px" color="#64748b">Tham gia: {member.joinDate}</Text>
                </Flex>
              </Flex>
            </Box>

            {/* Points box */}
            <Box p="16px 20px" borderRadius="14px"
              bg="linear-gradient(135deg, #fff7ed, #fffbf7)"
              border="1.5px solid #fed7aa" flexShrink="0"
              textAlign="center" minW="140px"
              boxShadow="0 4px 16px rgba(249,115,22,0.12)"
            >
              <Icon as={FaCoins} boxSize="20px" color="#f97316" mb="4px" />
              <Text fontSize="28px" fontWeight="900" color="#f97316" lineHeight="1">
                {member.points.toLocaleString()}
              </Text>
              <Text fontSize="11px" fontWeight="700" color="#92400e"
                letterSpacing="0.8px" textTransform="uppercase" mt="2px">
                Điểm tích lũy
              </Text>
            </Box>
          </Flex>

          {/* Progress to next rank */}
          {nextRankKey && (
            <Box mt="20px" p="14px 16px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
              <Flex justify="space-between" align="center" mb="8px">
                <Text fontSize="11px" fontWeight="700" color="#64748b">
                  Tiến trình lên hạng <Text as="span" color={RANK_CONFIG[nextRankKey].text} fontWeight="800">{nextRankKey}</Text>
                </Text>
                <Text fontSize="11px" fontWeight="700" color="#94a3b8">
                  {member.points.toLocaleString()} / {RANK_CONFIG[nextRankKey].min.toLocaleString()} điểm
                </Text>
              </Flex>
              <Box h="8px" borderRadius="full" bg="#e2e8f0" overflow="hidden">
                <Box
                  h="100%" borderRadius="full"
                  w={`${Math.min(100, (member.points / RANK_CONFIG[nextRankKey].min) * 100)}%`}
                  bg="linear-gradient(90deg, #f97316, #fbbf24)"
                  transition="width 1s ease"
                  boxShadow="0 2px 6px rgba(249,115,22,0.4)"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Stats row */}
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing="12px" mb="16px">
        <StatCard label="Tổng chi tiêu" value={`${(member.totalSpend / 1000000).toFixed(2)}M`}
          icon={MdTrendingUp} accent="#10b981" delay={0} sub="VND" />
        <StatCard label="Vé đã mua" value={member.ticketCount}
          icon={FaTicketAlt} accent="#f97316" delay={0.05} sub="vé" />
        <StatCard label="Hoạt động gần nhất"
          value={new Date(member.lastActivity).toLocaleDateString("vi-VN")}
          icon={MdCalendarToday} accent="#6366f1" delay={0.1} />
      </SimpleGrid>

      {/* Tabs: Info / Points / Tickets */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" overflow="hidden"
        sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
      >
        <Tabs colorScheme="orange" variant="line">
          <TabList px="20px" pt="4px" borderBottomColor="#f1f5f9">
            {[
              { label: "Thông tin cá nhân", icon: MdPerson },
              { label: "Lịch sử điểm", icon: FaCoins },
              { label: "Lịch sử đặt vé", icon: FaTicketAlt },
            ].map(({ label, icon: Ic }) => (
              <Tab key={label} fontSize="12.5px" fontWeight="700" color="#94a3b8" pb="12px" px="14px"
                _selected={{ color: "#f97316", borderBottomColor: "#f97316", borderBottomWidth: "2px" }}
              >
                <Icon as={Ic} boxSize="13px" mr="5px" />
                {label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {/* Personal Info */}
            <TabPanel p="20px">
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px">
                {[
                  { label: "Họ và tên", val: member.name, icon: MdPerson },
                  { label: "Email", val: member.email, icon: MdEmail },
                  { label: "Số điện thoại", val: member.phone, icon: MdPhone },
                  { label: "Ngày sinh", val: member.birthday, icon: MdCake },
                  { label: "Giới tính", val: member.gender, icon: FaUserCircle },
                  { label: "Địa chỉ", val: member.address, icon: MdNotes },
                ].map(({ label, val, icon: Ic }) => (
                  <Flex key={label} gap="12px" p="12px 14px" borderRadius="10px"
                    bg="#f8fafc" border="1px solid #f1f5f9" align="flex-start"
                  >
                    <Box w="32px" h="32px" borderRadius="8px" bg="#fff7ed"
                      display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                    >
                      <Icon as={Ic} boxSize="13px" color="#f97316" />
                    </Box>
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color="#94a3b8"
                        letterSpacing="0.7px" textTransform="uppercase" mb="2px">{label}</Text>
                      <Text fontSize="13.5px" fontWeight="600" color="#0f172a">{val}</Text>
                    </Box>
                  </Flex>
                ))}
              </Grid>
            </TabPanel>

            {/* Point History */}
            <TabPanel p="20px">
              <Flex direction="column" gap="8px">
                {member.pointHistory.length === 0 ? (
                  <Flex direction="column" align="center" py="32px" color="#cbd5e1">
                    <Icon as={FaCoins} boxSize="28px" mb="8px" />
                    <Text fontSize="13px" color="#94a3b8">Chưa có lịch sử điểm</Text>
                  </Flex>
                ) : (
                  member.pointHistory.map((h, i) => (
                    <Flex key={i} gap="12px" p="12px 14px" borderRadius="10px"
                      bg="#f8fafc" border="1px solid #f1f5f9"
                      align="center" justify="space-between"
                    >
                      <Flex gap="10px" align="center" flex="1" minW="0">
                        <Box w="34px" h="34px" borderRadius="9px" flexShrink="0"
                          bg={h.points > 0 ? "#ecfdf5" : "#fef2f2"}
                          display="flex" alignItems="center" justifyContent="center"
                        >
                          <Icon
                            as={h.type === "manual" ? MdNotes : h.points > 0 ? MdTrendingUp : MdTrendingDown}
                            boxSize="14px"
                            color={h.type === "manual" ? "#f97316" : h.points > 0 ? "#059669" : "#dc2626"}
                          />
                        </Box>
                        <Box minW="0">
                          <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={1}>
                            {h.action}
                          </Text>
                          <Flex gap="6px" align="center" mt="2px">
                            <Text fontSize="11px" color="#94a3b8">{h.date}</Text>
                            <PointTypeBadge type={h.type} />
                          </Flex>
                          {h.note && (
                            <Text fontSize="11px" color="#64748b" mt="2px" noOfLines={1}
                              fontStyle="italic">Ghi chú: {h.note}</Text>
                          )}
                        </Box>
                      </Flex>
                      <Text fontSize="15px" fontWeight="900"
                        color={h.points > 0 ? "#059669" : "#dc2626"}
                        flexShrink="0"
                      >
                        {h.points > 0 ? `+${h.points.toLocaleString()}` : h.points.toLocaleString()}
                      </Text>
                    </Flex>
                  ))
                )}
              </Flex>
            </TabPanel>

            {/* Ticket History */}
            <TabPanel p="20px">
              <Flex direction="column" gap="8px">
                {member.ticketHistory.length === 0 ? (
                  <Flex direction="column" align="center" py="32px" color="#cbd5e1">
                    <Icon as={FaTicketAlt} boxSize="28px" mb="8px" />
                    <Text fontSize="13px" color="#94a3b8">Chưa có lịch sử đặt vé</Text>
                  </Flex>
                ) : (
                  member.ticketHistory.map((t, i) => (
                    <Flex key={i} gap="12px" p="14px 16px" borderRadius="10px"
                      bg="#f8fafc" border="1px solid #f1f5f9" align="center"
                      justify="space-between" flexWrap="wrap"
                    >
                      <Flex gap="10px" align="center">
                        <Box w="36px" h="36px" borderRadius="9px" bg="#fff7ed"
                          display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                        >
                          <Icon as={FaTicketAlt} boxSize="14px" color="#f97316" />
                        </Box>
                        <Box>
                          <Text fontSize="13.5px" fontWeight="700" color="#0f172a">{t.movie}</Text>
                          <Text fontSize="11.5px" color="#64748b">{t.cinema}</Text>
                          <Text fontSize="11px" color="#94a3b8">{t.date} · Ghế: {t.seats}</Text>
                        </Box>
                      </Flex>
                      <Text fontSize="14px" fontWeight="800" color="#f97316">
                        {t.total.toLocaleString()}đ
                      </Text>
                    </Flex>
                  ))
                )}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Add Points Modal overlay */}
      {showPointModal && (
        <Box
          position="fixed" inset="0" bg="rgba(15,23,42,0.5)" zIndex="100"
          display="flex" alignItems="center" justifyContent="center" px="16px"
          sx={{ animation: `${fadeIn} 0.2s ease both` }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPointModal(false); }}
        >
          <Box bg="white" borderRadius="16px" w="100%" maxW="460px"
            border="1px solid #f1f5f9" boxShadow="0 24px 64px rgba(0,0,0,0.15)"
            overflow="hidden"
          >
            <AddPointsModal member={members.find(m => m.id === member.id) || member}
              onClose={() => setShowPointModal(false)} onSave={handleSavePoints} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── Member Row ───────────────────────────────────────────────────────────────
function MemberRow({ member, index, onView, onLockToggle }) {
  const isLocked = member.status === "Bị khóa";
  return (
    <>
      {/* Mobile card */}
      <Box display={{ base: "block", md: "none" }}
        p="14px" borderRadius="14px" bg="white" border="1.5px solid #f1f5f9"
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex gap="12px" mb="10px">
          <MemberAvatar member={member} size="md" />
          <Box flex="1" minW="0">
            <Text fontSize="14px" fontWeight="800" color="#0f172a" noOfLines={1} mb="4px">
              {member.name}
            </Text>
            <Flex gap="5px" flexWrap="wrap" mb="4px">
              <RankBadge rank={member.rank} />
              <StatusBadge status={member.status} />
            </Flex>
            <Flex gap="10px">
              <Flex align="center" gap="4px">
                <Icon as={FaCoins} boxSize="10px" color="#f97316" />
                <Text fontSize="11.5px" fontWeight="700" color="#f97316">
                  {member.points.toLocaleString()}
                </Text>
              </Flex>
              <Flex align="center" gap="4px">
                <Icon as={FaTicketAlt} boxSize="10px" color="#94a3b8" />
                <Text fontSize="11px" color="#64748b">{member.ticketCount} vé</Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        <Flex gap="8px">
          <Button flex="2" size="sm" h="36px" borderRadius="9px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="12px" fontWeight="700"
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.25)"
            onClick={() => onView(member)}
          >Xem chi tiết</Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg={isLocked ? "#ecfdf5" : "#fef2f2"}
            color={isLocked ? "#059669" : "#dc2626"}
            border={`1px solid ${isLocked ? "#6ee7b7" : "#fca5a5"}`}
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={isLocked ? MdLockOpen : MdLock} boxSize="13px" />}
            _hover={{ opacity: 0.85 }} onClick={() => onLockToggle(member)}
          >{isLocked ? "Mở" : "Khóa"}</Button>
        </Flex>
      </Box>

      {/* Desktop row */}
      <Box display={{ base: "none", md: "block" }}
        p="14px 18px" borderRadius="12px" bg="white" border="1.5px solid #f1f5f9"
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.08)", bg: "#fffbf7" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex align="center" gap="0">
          <Box w="32px" flexShrink="0">
            <Text fontSize="12px" fontWeight="700" color="#cbd5e1">{String(index + 1).padStart(2, "0")}</Text>
          </Box>
          <Box mr="14px" flexShrink="0">
            <MemberAvatar member={member} size="md" />
          </Box>
          <Box flex="2.2" minW="0" pr="12px">
            <Text fontSize="13.5px" fontWeight="800" color="#0f172a" noOfLines={1}>{member.name}</Text>
            <Text fontSize="11px" color="#94a3b8" noOfLines={1}>{member.email}</Text>
          </Box>
          <Box flex="0.9" minW="0" pr="12px">
            <RankBadge rank={member.rank} />
          </Box>
          <Box flex="0.9" minW="0" pr="12px">
            <StatusBadge status={member.status} />
          </Box>
          <Box flex="0.8" minW="0" pr="12px">
            <Flex align="center" gap="5px">
              <Icon as={FaCoins} boxSize="11px" color="#f97316" />
              <Text fontSize="13px" fontWeight="800" color="#f97316">
                {member.points.toLocaleString()}
              </Text>
            </Flex>
            <Text fontSize="10px" color="#94a3b8">điểm</Text>
          </Box>
          <Box flex="0.6" minW="0" pr="12px">
            <Text fontSize="13px" fontWeight="700" color="#0f172a">{member.ticketCount}</Text>
            <Text fontSize="10px" color="#94a3b8">vé</Text>
          </Box>
          <Flex gap="6px" flexShrink="0">
            <Button size="xs" h="30px" px="12px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.25)" transition="all 0.15s"
              onClick={() => onView(member)}
            >Xem</Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={isLocked ? "#ecfdf5" : "#fef2f2"}
              color={isLocked ? "#059669" : "#dc2626"}
              border={`1px solid ${isLocked ? "#6ee7b7" : "#fca5a5"}`}
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={isLocked ? MdLockOpen : MdLock} boxSize="11px" />}
              _hover={{ opacity: 0.85 }} transition="all 0.15s"
              onClick={() => onLockToggle(member)}
            >{isLocked ? "Mở khóa" : "Khóa"}</Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuanlyHoiVien() {
  const [view, setView]               = useState("list");
  const [selectedMember, setSelected] = useState(null);
  const [members, setMembers]         = useState(MEMBERS);
  const [search, setSearch]           = useState("");
  const [filterRank, setFilterRank]   = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [showFilter, setShowFilter]   = useState(false);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q)
      || m.email.toLowerCase().includes(q)
      || m.phone.includes(q);
    const matchRank = filterRank === "Tất cả" || m.rank === filterRank;
    const matchStatus = filterStatus === "Tất cả" || m.status === filterStatus;
    return matchSearch && matchRank && matchStatus;
  });

  const counts = {
    total:    members.length,
    diamond:  members.filter((m) => m.rank === "Kim cương").length,
    gold:     members.filter((m) => m.rank === "Vàng").length,
    locked:   members.filter((m) => m.status === "Bị khóa").length,
    totalPts: members.reduce((s, m) => s + m.points, 0),
  };

  const handleLockToggle = (member) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? { ...m, status: m.status === "Bị khóa" ? "Hoạt động" : "Bị khóa" }
          : m
      )
    );
  };

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedMember) {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <MemberDetail
          member={selectedMember}
          onBack={() => setView("list")}
          members={members}
          setMembers={setMembers}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "100px", md: "80px" }}>
      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="18px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 6px 16px rgba(249,115,22,0.4)"
            >
              <Icon as={GiLaurelCrown} boxSize="19px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color="#0f172a"
              letterSpacing="-0.5px">
              Quản lý Hội viên
            </Text>
          </Flex>
          <Text color="#94a3b8" fontSize="13px" pl="50px">
            Xem hạng thành viên, lịch sử tích điểm và đổi điểm
          </Text>
        </Box>

        {/* Rank legend */}
        <Flex gap="6px" flexWrap="wrap" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}>
          {Object.entries(RANK_CONFIG).map(([rank, cfg]) => (
            <Flex key={rank} align="center" gap="5px" px="10px" py="5px"
              borderRadius="8px" bg={cfg.badgeBg} border={`1px solid ${cfg.border}`}
              cursor="pointer"
              opacity={filterRank === rank ? 1 : 0.6}
              transition="all 0.15s"
              _hover={{ opacity: 1 }}
              onClick={() => setFilterRank(filterRank === rank ? "Tất cả" : rank)}
            >
              <Icon as={cfg.icon} boxSize="11px" color={cfg.dot} />
              <Text fontSize="10.5px" fontWeight="800" color={cfg.text}>{rank}</Text>
              <Text fontSize="10px" fontWeight="600" color={cfg.dot}>
                ({members.filter(m => m.rank === rank).length})
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="18px">
        <StatCard label="Tổng hội viên" value={counts.total}
          icon={FaUsers} accent="#f97316" delay={0} />
        <StatCard label="Kim cương" value={counts.diamond}
          icon={GiDiamondRing} accent="#3b82f6" delay={0.05} />
        <StatCard label="Hạng vàng" value={counts.gold}
          icon={FaCrown} accent="#f59e0b" delay={0.1} />
        <StatCard label="Tổng điểm HT" value={`${(counts.totalPts / 1000).toFixed(1)}K`}
          icon={FaCoins} accent="#10b981" delay={0.15} sub="điểm tích lũy" />
      </SimpleGrid>

      {/* Table card */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Card header */}
        <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} borderBottom="1px solid #f8fafc">
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="15px" color="#0f172a">Danh sách hội viên</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} thành viên</Text>
              </Box>
              {counts.locked > 0 && (
                <Box px="8px" py="2px" borderRadius="6px" bg="#fef2f2" border="1px solid #fca5a5">
                  <Text fontSize="11px" fontWeight="700" color="#dc2626">{counts.locked} bị khóa</Text>
                </Box>
              )}
            </Flex>
            <Button display={{ base: "flex", md: "none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              _hover={{ bg: "#f1f5f9" }}
              onClick={() => setShowFilter(v => !v)}
            >Lọc</Button>
          </Flex>

          <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
            <Flex gap="10px" align="center" direction={{ base: "column", sm: "row" }}>
              <Box position="relative" flex="1" w={{ base: "100%", sm: "auto" }}>
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
                <Input pl="30px" h="36px" w="100%" fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên, email, số điện thoại..."
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select h="36px" fontSize="12.5px" fontWeight="600" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                w={{ base: "100%", sm: "150px" }}
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                value={filterRank} onChange={(e) => setFilterRank(e.target.value)}
              >
                <option value="Tất cả">Tất cả hạng</option>
                {Object.keys(RANK_CONFIG).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
              <Select h="36px" fontSize="12.5px" fontWeight="600" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                w={{ base: "100%", sm: "150px" }}
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Bị khóa">Bị khóa</option>
              </Select>
            </Flex>
          </Box>
        </Box>

        {/* Desktop column headers */}
        <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
          display={{ base: "none", md: "flex" }}
        >
          <Box w="32px" flexShrink="0" />
          <Box w="54px" mr="14px" flexShrink="0" />
          <Box flex="2.2">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
              Họ tên / Email
            </Text>
          </Box>
          <Box flex="0.9">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Hạng</Text>
          </Box>
          <Box flex="0.9">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Trạng thái</Text>
          </Box>
          <Box flex="0.8">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Điểm</Text>
          </Box>
          <Box flex="0.6">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Vé</Text>
          </Box>
          <Box w="150px" flexShrink="0" textAlign="right">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Hành động</Text>
          </Box>
        </Flex>

        {/* Rows */}
        <Box p={{ base: "10px", md: "10px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="48px" color="#cbd5e1">
              <Icon as={FaUserCircle} boxSize="36px" mb="10px" />
              <Text fontSize="14px" fontWeight="600" color="#94a3b8">Không tìm thấy hội viên nào</Text>
              <Text fontSize="12px" color="#cbd5e1" mt="4px">Thử điều chỉnh bộ lọc tìm kiếm</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {filtered.map((m, i) => (
                <MemberRow key={m.id} member={m} index={i}
                  onView={(mv) => { setSelected(mv); setView("detail"); }}
                  onLockToggle={handleLockToggle}
                />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}