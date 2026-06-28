import React, { useState, useMemo } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, Badge,
  SimpleGrid, Divider, useColorMode, useColorModeValue,
  keyframes, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, Tag,
} from "@chakra-ui/react";
import {
  MdReceipt, MdSearch, MdFilterList, MdVisibility,
  MdDownload, MdRefresh, MdTrendingUp, MdAccountBalanceWallet,
  MdCreditCard, MdPhoneAndroid, MdLocalAtm, MdStore,
  MdCalendarToday, MdClose, MdCheckCircle, MdCancel,
  MdPending, MdArrowBack, MdQrCode, MdPerson,
  MdConfirmationNumber, MdMovieFilter, MdAccessTime,
  MdDarkMode, MdLightMode,
} from "react-icons/md";
import {
  FaMoneyBillWave, FaUniversity, FaWallet, FaTicketAlt,
  FaChartLine, FaExchangeAlt,
} from "react-icons/fa";
import Card from "components/card/Card";

// ─── Dark Mode Colors ──────────────────────────────────────────────────────
const DARK = {
  bg: "#0a0a18",
  bgCard: "#16213e",
  bgDark: "#0f0f1a",
  bgDeep: "#05050a",
  ink: "#f7fafc",
  ink2: "#e2e8f0",
  ink3: "#a0aec0",
  ink4: "#718096",
  ink5: "#4a5568",
  ink6: "#2d3748",
};

// ─── Keyframes ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
`;

// ─── Payment method config ──────────────────────────────────────────────────
const METHOD_CONFIG = {
  "Tiền mặt":         { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", icon: FaMoneyBillWave },
  "Chuyển khoản":     { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", icon: FaUniversity   },
  "Ví điện tử":       { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", icon: FaWallet        },
  "Thẻ tín dụng":     { color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4", icon: MdCreditCard    },
};

const STATUS_CONFIG = {
  "Thành công": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đang xử lý": { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Thất bại":   { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Đã hoàn":    { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

// ─── Sample data ────────────────────────────────────────────────────────────
const CINEMAS = ["Tất cả", "Gấu Phim BMT", "Gấu Phim HCM", "Gấu Phim HN", "Gấu Phim ĐN"];

const generateTx = () => {
  const movies    = ["Avengers: Endgame", "Spider-Man: No Way Home", "Doctor Strange 2", "Thor: Love & Thunder", "Black Panther 2", "Ant-Man 3"];
  const customers = ["Nguyễn Văn An", "Trần Thị Bình", "Lê Minh Châu", "Phạm Thu Dung", "Hoàng Văn Em", "Đỗ Thị Phương", "Vũ Ngọc Giang", "Bùi Anh Hùng"];
  const cinemas   = ["Gấu Phim BMT", "Gấu Phim HCM", "Gấu Phim HN", "Gấu Phim ĐN"];
  const methods   = ["Tiền mặt", "Chuyển khoản", "Ví điện tử", "Thẻ tín dụng"];
  const statuses  = ["Thành công", "Thành công", "Thành công", "Đang xử lý", "Thất bại", "Đã hoàn"];

  const hours   = ["08:30", "09:15", "10:00", "11:45", "14:20", "15:30", "17:00", "19:45", "20:10", "21:30"];
  const amounts = [85000, 120000, 150000, 180000, 210000, 240000, 300000, 350000, 420000, 480000];

  return Array.from({ length: 68 }, (_, i) => {
    const d    = new Date(2026, 4, Math.ceil(Math.random() * 24) + 1);
    const date = `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
    const base = amounts[Math.floor(Math.random() * amounts.length)];
    const seats = Math.ceil(Math.random() * 4);
    const combo = Math.random() > 0.5 ? Math.ceil(Math.random() * 2) * 45000 : 0;
    return {
      id:       `GF${String(i + 1001).padStart(6, "0")}`,
      orderId:  `ORD${String(i + 5001).padStart(6, "0")}`,
      date,
      time:     hours[Math.floor(Math.random() * hours.length)],
      customer: customers[Math.floor(Math.random() * customers.length)],
      phone:    `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      movie:    movies[Math.floor(Math.random() * movies.length)],
      cinema:   cinemas[Math.floor(Math.random() * cinemas.length)],
      seats,
      combo,
      ticketAmt: base * seats,
      totalAmt:  base * seats + combo,
      method:   methods[Math.floor(Math.random() * methods.length)],
      status:   statuses[Math.floor(Math.random() * statuses.length)],
    };
  }).sort((a, b) => b.id.localeCompare(a.id));
};

const ALL_TX = generateTx();

// ─── Helper ─────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("vi-VN") + "₫";

// ─── Sub-components ─────────────────────────────────────────────────────────
function MethodBadge({ method, isDark }) {
  const cfg = METHOD_CONFIG[method] || METHOD_CONFIG["Tiền mặt"];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Icon as={cfg.icon} boxSize="11px" color={cfg.color} />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{method}</Text>
    </Flex>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Thành công"];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Đang xử lý" ? { animation: `${pulse} 1.8s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function StatCard({ label, value, sub, icon, accent, delay = 0, isDark }) {
  const bg = isDark ? DARK.bgCard : "white";
  const border = isDark ? DARK.ink5 : "#f1f5f9";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink2 = isDark ? DARK.ink2 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  
  return (
    <Box p={{ base: "14px 16px", md: "18px 20px" }} borderRadius="14px" bg={bg}
      border={`1px solid ${border}`} boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.05)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow: isDark ? "0 6px 20px rgba(0,0,0,.4)" : "0 6px 20px rgba(0,0,0,0.09)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}
            letterSpacing="0.8px" textTransform="uppercase" mb="4px">{label}
          </Text>
          <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={ink} lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color={isDark ? DARK.ink3 : "#64748b"} mt="3px" fontWeight="500">{sub}</Text>}
        </Box>
        <Box w={{ base: "38px", md: "44px" }} h={{ base: "38px", md: "44px" }} borderRadius="12px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center" flexShrink="0"
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "19px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Transaction Detail Modal ────────────────────────────────────────────────
function TxDetail({ tx, onClose, isDark }) {
  if (!tx) return null;
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";
  
  const rows = [
    { label: "Mã giao dịch",    val: tx.id,                    mono: true },
    { label: "Mã đơn hàng",     val: tx.orderId,               mono: true },
    { label: "Thời gian",       val: `${tx.time} • ${tx.date}` },
    { label: "Khách hàng",      val: tx.customer               },
    { label: "Số điện thoại",   val: tx.phone                  },
    { label: "Phim",            val: tx.movie                  },
    { label: "Rạp",             val: tx.cinema                 },
    { label: "Số ghế",          val: `${tx.seats} ghế`         },
    { label: "Tiền vé",         val: fmt(tx.ticketAmt)         },
    { label: "Combo bắp nước",  val: tx.combo ? fmt(tx.combo) : "—" },
    { label: "Phương thức",     val: null, component: <MethodBadge method={tx.method} isDark={isDark} /> },
    { label: "Trạng thái",      val: null, component: <StatusBadge status={tx.status} /> },
  ];
  return (
    <Box sx={{ animation: `${fadeIn} 0.25s ease both` }}>
      {/* Gradient top bar */}
      <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
        bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        borderTopRadius="12px" mx="-6px" mt="-6px" mb="18px"
      />

      {/* Total */}
      <Box p="18px 20px" borderRadius="14px" mb="18px"
        bg={isDark ? DARK.ink6 : "linear-gradient(135deg, #fff7ed 0%, #fffbf7 100%)"}
        border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #fed7aa"}
      >
        <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink3 : "#92400e"} letterSpacing="1px"
          textTransform="uppercase" mb="6px">Tổng thanh toán</Text>
        <Text fontSize="32px" fontWeight="900" color="#f97316" letterSpacing="-1px">
          {fmt(tx.totalAmt)}
        </Text>
      </Box>

      {/* Detail rows */}
      <Flex direction="column" gap="0">
        {rows.map(({ label, val, component, mono }, i) => (
          <Flex key={label} py="10px" align="center" justify="space-between"
            borderBottom={i < rows.length - 1 ? `1px solid ${isDark ? DARK.ink5 : "#f8fafc"}` : "none"}
          >
            <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"} fontWeight="600" flex="1">{label}</Text>
            {component || (
              <Text fontSize="12.5px" color={ink} fontWeight="700" textAlign="right"
                flex="1.5" fontFamily={mono ? "mono" : "inherit"}>
                {val}
              </Text>
            )}
          </Flex>
        ))}
      </Flex>

      {/* QR placeholder */}
      <Box mt="18px" p="14px" borderRadius="12px" bg={isDark ? DARK.ink6 : "#f8fafc"} 
        border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"} textAlign="center"
      >
        <Icon as={MdQrCode} boxSize="40px" color={isDark ? DARK.ink4 : "#cbd5e1"} mb="6px" display="block" mx="auto" />
        <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} fontWeight="600">Mã QR giao dịch #{tx.id}</Text>
      </Box>
    </Box>
  );
}

// ─── Row component ───────────────────────────────────────────────────────────
function TxRow({ tx, index, onView, isDark }) {
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";
  
  return (
    <>
      {/* Mobile card */}
      <Box display={{ base: "block", md: "none" }}
        p="14px" borderRadius="14px" bg={bg} border={`1.5px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(249,115,22,0.1)" }}
        sx={{ animation: `${fadeUp} 0.3s ease ${Math.min(index * 0.04, 0.4)}s both` }}
      >
        <Flex justify="space-between" align="flex-start" mb="10px">
          <Box>
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"} fontFamily="mono">{tx.id}</Text>
            <Text fontSize="13.5px" fontWeight="800" color={ink} mt="2px" noOfLines={1}>{tx.customer}</Text>
            <Text fontSize="11px" color={isDark ? DARK.ink3 : "#64748b"} mt="1px">{tx.movie}</Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="16px" fontWeight="800" color="#f97316">{fmt(tx.totalAmt)}</Text>
            <Text fontSize="10px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="1px">{tx.time} • {tx.date}</Text>
          </Box>
        </Flex>
        <Flex gap="7px" flexWrap="wrap" mb="10px">
          <MethodBadge method={tx.method} isDark={isDark} />
          <StatusBadge status={tx.status} />
        </Flex>
        <Flex justify="space-between" align="center">
          <Text fontSize="11px" color={isDark ? DARK.ink3 : "#64748b"}>{tx.cinema} • {tx.seats} ghế</Text>
          <Button size="xs" h="30px" px="12px" borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            onClick={() => onView(tx)}
          >Chi tiết</Button>
        </Flex>
      </Box>

      {/* Desktop row */}
      <Box display={{ base: "none", md: "block" }}
        px="18px" py="13px" borderRadius="12px" bg={bg} border={`1.5px solid ${isDark ? DARK.ink5 : "#f1f5f9"}`}
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(249,115,22,0.08)", bg: isDark ? DARK.ink6 : "#fffbf7" }}
        sx={{ animation: `${fadeUp} 0.3s ease ${Math.min(index * 0.04, 0.4)}s both` }}
      >
        <Flex align="center" gap="0">
          <Box w="28px" flexShrink="0">
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink4 : "#cbd5e1"}>{String(index + 1).padStart(2,"0")}</Text>
          </Box>
          <Box w="110px" flexShrink="0" pr="10px">
            <Text fontSize="11.5px" fontWeight="700" color="#f97316" fontFamily="mono">{tx.id}</Text>
            <Text fontSize="10px" color={isDark ? DARK.ink4 : "#94a3b8"} fontFamily="mono">{tx.orderId}</Text>
          </Box>
          <Box flex="1.4" minW="0" pr="12px">
            <Text fontSize="13px" fontWeight="700" color={ink} noOfLines={1}>{tx.customer}</Text>
            <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"}>{tx.phone}</Text>
          </Box>
          <Box flex="1.8" minW="0" pr="12px">
            <Text fontSize="12px" fontWeight="600" color={isDark ? DARK.ink2 : "#374151"} noOfLines={1}>{tx.movie}</Text>
            <Flex align="center" gap="4px" mt="2px">
              <Icon as={MdStore} boxSize="10px" color={isDark ? DARK.ink4 : "#94a3b8"} />
              <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"}>{tx.cinema}</Text>
            </Flex>
          </Box>
          <Box w="90px" flexShrink="0" pr="12px">
            <Text fontSize="11.5px" fontWeight="600" color={isDark ? DARK.ink2 : "#374151"}>{tx.time}</Text>
            <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"}>{tx.date}</Text>
          </Box>
          <Box w="130px" flexShrink="0" pr="12px">
            <MethodBadge method={tx.method} isDark={isDark} />
          </Box>
          <Box w="110px" flexShrink="0" pr="12px">
            <StatusBadge status={tx.status} />
          </Box>
          <Box w="100px" flexShrink="0" pr="12px" textAlign="right">
            <Text fontSize="14px" fontWeight="800" color={ink}>{fmt(tx.totalAmt)}</Text>
            <Text fontSize="10px" color={isDark ? DARK.ink4 : "#94a3b8"}>{tx.seats} ghế</Text>
          </Box>
          <Box flexShrink="0">
            <Button size="xs" h="30px" px="11px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onView(tx)}
            >Xem</Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

export default function LichSuThanhToan() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [search,       setSearch]       = useState("");
  const [filterMethod, setFilterMethod] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterCinema, setFilterCinema] = useState("Tất cả");
  const [filterDate,   setFilterDate]   = useState("");
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState(null);
  const [showFilter,   setShowFilter]   = useState(false);
  const { isOpen, onOpen, onClose }     = useDisclosure();

  // Chakra UI colors
  const bg = useColorModeValue("#f5f5f2", DARK.bg);
  const bgCard = useColorModeValue("white", DARK.bgCard);
  const ink = useColorModeValue("#0f172a", DARK.ink);
  const ink2 = useColorModeValue("#374151", DARK.ink2);
  const ink3 = useColorModeValue("#64748b", DARK.ink3);
  const ink4 = useColorModeValue("#94a3b8", DARK.ink4);
  const ink5 = useColorModeValue("#e2e8f0", DARK.ink5);
  const ink6 = useColorModeValue("#f1f5f9", DARK.ink6);

  // Filter
  const filtered = useMemo(() => {
    return ALL_TX.filter((tx) => {
      const q = search.toLowerCase();
      const matchQ = !q ||
        tx.id.toLowerCase().includes(q) ||
        tx.orderId.toLowerCase().includes(q) ||
        tx.customer.toLowerCase().includes(q) ||
        tx.phone.includes(q) ||
        tx.movie.toLowerCase().includes(q);
      const matchM = filterMethod === "Tất cả" || tx.method === filterMethod;
      const matchS = filterStatus === "Tất cả" || tx.status === filterStatus;
      const matchC = filterCinema === "Tất cả" || tx.cinema === filterCinema;
      const matchD = !filterDate  || tx.date === filterDate.split("-").reverse().join("/");
      return matchQ && matchM && matchS && matchC && matchD;
    });
  }, [search, filterMethod, filterStatus, filterCinema, filterDate]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats
  const success  = ALL_TX.filter((t) => t.status === "Thành công");
  const pending  = ALL_TX.filter((t) => t.status === "Đang xử lý");
  const refunded = ALL_TX.filter((t) => t.status === "Đã hoàn");
  const totalRev = success.reduce((s, t) => s + t.totalAmt, 0);

  const handleView = (tx) => { setSelected(tx); onOpen(); };
  const resetFilters = () => {
    setSearch(""); setFilterMethod("Tất cả"); setFilterStatus("Tất cả");
    setFilterCinema("Tất cả"); setFilterDate(""); setPage(1);
  };
  const hasFilter = search || filterMethod !== "Tất cả" || filterStatus !== "Tất cả"
    || filterCinema !== "Tất cả" || filterDate;

  const inputSx = {
    bg: isDark ? DARK.ink6 : "#fafafa",
    border: isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e8edf3",
    borderRadius: "10px",
    color: isDark ? DARK.ink : "#1a202c",
    fontSize: "13px",
    fontWeight: "500",
    h: { base: "42px", md: "36px" },
    _placeholder: { color: isDark ? DARK.ink4 : "#b0bac8" },
    _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: isDark ? DARK.bgCard : "#fff" },
    _hover: { border: "1.5px solid #f97316", bg: isDark ? DARK.bgCard : "#fff" },
    transition: "all 0.2s",
  };

  return (
    <Box pt={{ base: "100px", md: "80px" }} px={{ base: "0", md: "0" }} bg={bg} minH="100vh">

      {/* ── Page header ── */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="14px"
        sx={{ animation: `${fadeUp} 0.4s ease both` }}
      >
        <Box>
          <Flex align="center" gap="12px" mb="4px">
            <Box w="42px" h="42px" borderRadius="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.38)"
            >
              <Icon as={MdReceipt} boxSize="19px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800"
                color={ink} letterSpacing="-0.5px">
                Lịch sử thanh toán
              </Text>
              <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Tra cứu & quản lý giao dịch thanh toán
              </Text>
            </Box>
          </Flex>
        </Box>
        <Flex gap="10px" w={{ base: "100%", md: "auto" }}
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
        >
          {/* Dark Mode Toggle */}
          <Button h="40px" w="40px" p="0" borderRadius="10px"
            bg={isDark ? DARK.ink6 : "#f8fafc"}
            color={isDark ? DARK.ink2 : "#475569"}
            border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
            onClick={toggleColorMode}
            flexShrink="0"
          >
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="18px" />
          </Button>

          <Button flex={{ base: "1", md: "none" }}
            h="40px" px="16px" borderRadius="10px" fontWeight="600" fontSize="13px"
            bg={isDark ? DARK.ink6 : "#f8fafc"}
            color={isDark ? DARK.ink2 : "#64748b"}
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
            leftIcon={<Icon as={MdDownload} />}
            _hover={{ bg: isDark ? DARK.ink6 : "#f1f5f9" }} transition="all 0.2s"
          >
            Xuất Excel
          </Button>
          <Button flex={{ base: "1", md: "none" }}
            h="40px" px="16px" borderRadius="10px" fontWeight="600" fontSize="13px"
            bg="#fff7ed" color="#f97316" border="1px solid #fed7aa"
            leftIcon={<Icon as={MdRefresh} />}
            _hover={{ bg: "#ffedd5" }} transition="all 0.2s"
            onClick={resetFilters}
          >
            Làm mới
          </Button>
        </Flex>
      </Flex>

      {/* ── Stats ── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng giao dịch"   value={ALL_TX.length}
          sub={`${success.length} thành công`}
          icon={FaExchangeAlt} accent="#f97316" delay={0} isDark={isDark} />
        <StatCard label="Doanh thu"
          value={totalRev >= 1e6 ? (totalRev / 1e6).toFixed(1) + "M₫" : fmt(totalRev)}
          sub="Giao dịch thành công"
          icon={FaChartLine} accent="#10b981" delay={0.05} isDark={isDark} />
        <StatCard label="Đang xử lý"   value={pending.length}
          sub="Chờ xác nhận"
          icon={MdPending} accent="#f59e0b" delay={0.1} isDark={isDark} />
        <StatCard label="Đã hoàn tiền" value={refunded.length}
          sub={`${fmt(refunded.reduce((s,t)=>s+t.totalAmt,0))}`}
          icon={FaWallet} accent="#6b7280" delay={0.15} isDark={isDark} />
      </SimpleGrid>

      {/* ── Method breakdown ── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="20px">
        {Object.entries(METHOD_CONFIG).map(([method, cfg], i) => {
          const count = ALL_TX.filter((t) => t.method === method && t.status === "Thành công");
          const total = count.reduce((s, t) => s + t.totalAmt, 0);
          const bgCardLocal = isDark ? DARK.bgCard : "white";
          const border = isDark ? DARK.ink5 : "#f1f5f9";
          const inkLocal = isDark ? DARK.ink : "#0f172a";
          
          return (
            <Box key={method} p="12px 14px" borderRadius="12px" bg={bgCardLocal}
              border={`1px solid ${border}`} boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
              sx={{ animation: `${fadeUp} 0.4s ease ${0.05 * i}s both` }}
              cursor="pointer" transition="all 0.2s"
              _hover={{ border: `1px solid ${cfg.border}`, boxShadow: `0 4px 14px ${cfg.border}66` }}
              onClick={() => { setFilterMethod(method); setPage(1); }}
            >
              <Flex align="center" gap="9px" mb="6px">
                <Box w="30px" h="30px" borderRadius="9px" bg={cfg.bg}
                  display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                >
                  <Icon as={cfg.icon} boxSize="14px" color={cfg.color} />
                </Box>
                <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{method}</Text>
              </Flex>
              <Text fontSize="14px" fontWeight="800" color={inkLocal}>{count.length} GD</Text>
              <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="1px">{fmt(total)}</Text>
            </Box>
          );
        })}
      </SimpleGrid>

      {/* ── Table card ── */}
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
            <Flex align="center" gap="10px">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color={ink}>
                Danh sách giao dịch
              </Text>
              <Box px="9px" py="3px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} GD</Text>
              </Box>
              {hasFilter && (
                <Button size="xs" h="24px" px="8px" borderRadius="6px"
                  bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                  fontSize="10px" fontWeight="700"
                  leftIcon={<Icon as={MdClose} boxSize="10px" />}
                  onClick={resetFilters}
                >Xóa bộ lọc</Button>
              )}
            </Flex>
            {/* Mobile filter toggle */}
            <Button display={{ base: "flex", md: "none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg={isDark ? DARK.ink6 : "#f8fafc"}
              color={isDark ? DARK.ink3 : "#64748b"}
              border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              onClick={() => setShowFilter((v) => !v)}
            >Lọc</Button>
          </Flex>

          {/* Filters */}
          <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
            <Flex gap="10px" wrap="wrap" align="center">
              <Box position="relative" flex={{ base: "1 1 100%", md: "1 1 220px" }} minW="180px">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color={isDark ? DARK.ink4 : "#94a3b8"} zIndex="1" />
                <Input {...inputSx} pl="30px"
                  placeholder="Mã GD, đơn hàng, tên khách..."
                  value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </Box>
              <Select {...inputSx} w={{ base: "100%", md: "150px" }} flexShrink="0"
                value={filterMethod} onChange={(e) => { setFilterMethod(e.target.value); setPage(1); }}
              >
                <option value="Tất cả">Phương thức</option>
                {Object.keys(METHOD_CONFIG).map((m) => <option key={m}>{m}</option>)}
              </Select>
              <Select {...inputSx} w={{ base: "100%", md: "140px" }} flexShrink="0"
                value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="Tất cả">Trạng thái</option>
                {Object.keys(STATUS_CONFIG).map((s) => <option key={s}>{s}</option>)}
              </Select>
              <Select {...inputSx} w={{ base: "100%", md: "160px" }} flexShrink="0"
                value={filterCinema} onChange={(e) => { setFilterCinema(e.target.value); setPage(1); }}
              >
                {CINEMAS.map((c) => <option key={c}>{c}</option>)}
              </Select>
              <Input {...inputSx} type="date" w={{ base: "100%", md: "160px" }} flexShrink="0"
                value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
              />
            </Flex>
          </Box>
        </Box>

        {/* Desktop column headers */}
        <Flex px="18px" py="10px" bg={isDark ? DARK.ink6 : "#fafbfc"}
          borderBottom={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
          display={{ base: "none", md: "flex" }} align="center"
        >
          {[
            { label: "#",              w: "28px"  },
            { label: "Mã GD / Đơn",   w: "110px" },
            { label: "Khách hàng",    flex: "1.4" },
            { label: "Phim / Rạp",    flex: "1.8" },
            { label: "Thời gian",     w: "90px"  },
            { label: "Phương thức",   w: "130px" },
            { label: "Trạng thái",    w: "110px" },
            { label: "Số tiền",       w: "100px" },
            { label: "",              w: "58px"  },
          ].map(({ label, w, flex }) => (
            <Box key={label} w={w} flex={flex} pr={w ? "0" : "12px"} flexShrink={w ? "0" : undefined}>
              <Text fontSize="10px" fontWeight="800" color={isDark ? DARK.ink4 : "#94a3b8"}
                letterSpacing="1px" textTransform="uppercase" textAlign={label === "Số tiền" ? "right" : "left"}>
                {label}
              </Text>
            </Box>
          ))}
        </Flex>

        {/* Rows */}
        <Box p={{ base: "10px", md: "10px" }}>
          {paged.length === 0 ? (
            <Flex direction="column" align="center" py="48px" color={isDark ? DARK.ink4 : "#cbd5e1"}>
              <Icon as={MdReceipt} boxSize="36px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? DARK.ink3 : "#94a3b8"}>Không tìm thấy giao dịch nào</Text>
              <Button mt="12px" size="sm" variant="ghost" color="#f97316" fontWeight="700"
                onClick={resetFilters}>Xóa bộ lọc</Button>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {paged.map((tx, i) => (
                <TxRow key={tx.id} tx={tx} index={(page - 1) * PAGE_SIZE + i} onView={handleView} isDark={isDark} />
              ))}
            </Flex>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex p="14px 20px" borderTop={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f8fafc"}
            align="center" justify="space-between" gap="12px" flexWrap="wrap"
          >
            <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"} fontWeight="500">
              Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} giao dịch
            </Text>
            <Flex gap="6px" flexWrap="wrap">
              <Button size="xs" h="30px" px="10px" borderRadius="8px"
                isDisabled={page === 1}
                bg={isDark ? DARK.ink6 : "#f8fafc"} color={isDark ? DARK.ink2 : "#64748b"}
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
                fontSize="12px" fontWeight="600"
                _hover={{ bg: isDark ? DARK.ink6 : "#f1f5f9" }} _disabled={{ opacity: 0.4 }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >← Trước</Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pg;
                if (totalPages <= 5)   pg = i + 1;
                else if (page <= 3)    pg = i + 1;
                else if (page >= totalPages - 2) pg = totalPages - 4 + i;
                else                   pg = page - 2 + i;
                return (
                  <Button key={pg} size="xs" h="30px" w="30px" borderRadius="8px"
                    bg={page === pg ? "linear-gradient(135deg,#f97316,#fb923c)" : (isDark ? DARK.ink6 : "#f8fafc")}
                    color={page === pg ? "white" : (isDark ? DARK.ink2 : "#64748b")}
                    border={page === pg ? "none" : (isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0")}
                    fontSize="12px" fontWeight="700"
                    boxShadow={page === pg ? "0 2px 8px rgba(249,115,22,0.3)" : "none"}
                    _hover={{ opacity: 0.88 }}
                    onClick={() => setPage(pg)}
                  >{pg}</Button>
                );
              })}
              <Button size="xs" h="30px" px="10px" borderRadius="8px"
                isDisabled={page === totalPages}
                bg={isDark ? DARK.ink6 : "#f8fafc"} color={isDark ? DARK.ink2 : "#64748b"}
                border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
                fontSize="12px" fontWeight="600"
                _hover={{ bg: isDark ? DARK.ink6 : "#f1f5f9" }} _disabled={{ opacity: 0.4 }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >Sau →</Button>
            </Flex>
          </Flex>
        )}
      </Box>

      {/* ── Detail Modal ── */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px" mx="12px" overflow="hidden" p="6px"
          bg={isDark ? DARK.bgCard : "white"}
          border={isDark ? `1px solid ${DARK.ink5}` : "none"}
        >
          <ModalHeader pb="0" pt="4px">
            <Text fontSize="15px" fontWeight="800" color={isDark ? DARK.ink : "#0f172a"}>Chi tiết giao dịch</Text>
            <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} fontWeight="500" mt="2px">
              {selected?.id} • {selected?.orderId}
            </Text>
          </ModalHeader>
          <ModalCloseButton top="14px" right="14px" borderRadius="8px"
            _hover={{ bg: isDark ? DARK.ink6 : "#f1f5f9" }} 
            color={isDark ? DARK.ink3 : "#94a3b8"}
          />
          <ModalBody pb="20px">
            <TxDetail tx={selected} onClose={onClose} isDark={isDark} />
          </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
}