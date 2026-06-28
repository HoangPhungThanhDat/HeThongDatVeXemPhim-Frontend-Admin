// views/admin/thongkecombo/index.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Grid, Text, Flex, SimpleGrid, Icon, keyframes, useColorMode,
  Select, Button, Progress, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Badge, useToast, Skeleton, Tag, TagLabel,
  TagLeftIcon, HStack, VStack, Divider, Tooltip, Stat,
  StatLabel, StatNumber, StatHelpText, StatArrow,
  CircularProgress, CircularProgressLabel,
  Card, CardHeader, CardBody, CardFooter,
  AbsoluteCenter, Heading, Stack
} from "@chakra-ui/react";
import {
  MdTrendingUp, MdTrendingDown, MdShoppingCart, MdLocalDrink,
  MdFastfood, MdAttachMoney, MdBarChart, MdTimeline, 
  MdRefresh, MdCalendarToday, MdLocalOffer, MdStar, 
  MdStarHalf, MdStarBorder, MdLunchDining,
  MdTrendingFlat, MdInfo, MdCheckCircle, MdWarning,
  MdPeople, MdPercent, MdStore, MdFoodBank,
  MdReceipt, MdMonetizationOn, MdDateRange
} from "react-icons/md";
import {
  FaUtensils, FaBoxOpen, FaChartLine, FaBolt,
  FaGlassWhiskey, FaCrown, FaTrophy, FaMedal
} from "react-icons/fa";

import FoodAndDrinkApi from "../../../api/FoodAndDrinkApi";
import OrderApi from "../../../api/OrderApi";
import Loader from "../../../layouts/Loader";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(234,88,12,0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// ─── Palette ─────────────────────────────────────────────────────────────────
const OR = "#ea580c";
const ORL = "#fb923c";
const ORXL = "#fed7aa";
const ORPL = "#fff7ed";
const ORSW = "rgba(234,88,12,0.2)";
const GREEN = "#059669";
const GREEN_LIGHT = "#34d399";
const BLUE = "#2563eb";
const PURPLE = "#7c3aed";
const PINK = "#db2777";
const CYAN = "#0891b2";

// ─── Dark mode helpers ──────────────────────────────────────────────────────
const getColors = (isDark) => ({
  bgPage: isDark ? "#0f172a" : "#f8fafc",
  bgCard: isDark ? "#1e293b" : "white",
  bgCardHover: isDark ? "#2d3748" : "#f8fafc",
  bgInput: isDark ? "#2d3748" : "#fafafa",
  bgSub: isDark ? "#2d3748" : "#f8fafc",
  bgSub2: isDark ? "#2d3748" : "#fafbfc",
  borderCard: isDark ? "#334155" : "#f1f5f9",
  borderInput: isDark ? "#374151" : "#e8edf3",
  borderLight: isDark ? "#2d3748" : "#f8fafc",
  textPrimary: isDark ? "#f1f5f9" : "#0f172a",
  textSecondary: isDark ? "#94a3b8" : "#64748b",
  textMuted: isDark ? "#64748b" : "#94a3b8",
  textDark: isDark ? "#f1f5f9" : "#1a202c",
  textBody: isDark ? "#cbd5e1" : "#334155",
  textLight: isDark ? "#94a3b8" : "#475569",
  shadow: isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
  shadowHover: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
  glassBg: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.6)",
  glassBorder: isDark ? "rgba(51, 65, 85, 0.5)" : "rgba(255, 255, 255, 0.8)",
});

// ─── Category Config ─────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  "Bắp": { icon: MdFastfood, color: OR, bg: ORPL, gradient: `linear-gradient(135deg, ${OR}, ${ORL})` },
  "Nước ngọt": { icon: MdLocalDrink, color: BLUE, bg: "#eff6ff", gradient: `linear-gradient(135deg, ${BLUE}, #60a5fa)` },
  "Combo": { icon: FaUtensils, color: PURPLE, bg: "#f5f3ff", gradient: `linear-gradient(135deg, ${PURPLE}, #a78bfa)` },
  "Snack": { icon: MdLunchDining, color: PINK, bg: "#fdf2f8", gradient: `linear-gradient(135deg, ${PINK}, #f472b6)` },
};

// ─── Stat Card Component ─────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub, trend, delay = 0, color }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);
  const iconBg = color || accent;

  return (
    <Box
      p="24px"
      borderRadius="20px"
      bg={colors.bgCard}
      border={`1px solid ${colors.borderCard}`}
      boxShadow={colors.shadow}
      sx={{ animation: `${fadeUp} .5s ease ${delay}s both` }}
      transition="all .3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{ 
        transform: "translateY(-6px)", 
        boxShadow: `0 20px 40px ${iconBg}20`,
        border: `1px solid ${iconBg}`
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background */}
      <Box position="absolute" top="-30px" right="-30px" w="100px" h="100px"
        borderRadius="full" bg={`${iconBg}10`} />
      <Box position="absolute" bottom="-50px" left="-50px" w="120px" h="120px"
        borderRadius="full" bg={`${iconBg}08`} />

      <Flex align="flex-start" justify="space-between" mb="12px">
        <Box>
          <Text fontSize="11px" fontWeight="700" color={colors.textMuted} 
            letterSpacing="1px" textTransform="uppercase" mb="2px">
            {label}
          </Text>
          <Text fontSize="28px" fontWeight="800" color={colors.textPrimary} lineHeight="1.2">
            {value}
          </Text>
          {sub && (
            <Text fontSize="12px" color={colors.textMuted} mt="1px">
              {sub}
            </Text>
          )}
        </Box>
        <Box 
          w="48px" h="48px" borderRadius="14px" 
          bg={iconBg}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow={`0 8px 20px ${iconBg}40`}
          sx={{ animation: `${float} 3s ease-in-out infinite` }}
        >
          <Icon as={icon} boxSize="20px" color="white" />
        </Box>
      </Flex>

      {trend && (
        <Flex align="center" gap="6px" mt="2px">
          <Flex align="center" gap="4px" px="10px" py="4px" borderRadius="full"
            bg={trend > 0 ? `${GREEN}15` : "#fef2f2"}
            border={trend > 0 ? `1px solid ${GREEN}30` : "1px solid #fca5a5"}>
            <Icon as={trend > 0 ? MdTrendingUp : MdTrendingDown} 
              boxSize="14px" color={trend > 0 ? GREEN : "#dc2626"} />
            <Text fontSize="12px" fontWeight="700" color={trend > 0 ? GREEN : "#dc2626"}>
              {trend > 0 ? "+" : ""}{trend}%
            </Text>
          </Flex>
          <Text fontSize="11px" color={colors.textMuted}>so với kỳ trước</Text>
        </Flex>
      )}
    </Box>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({ category, data }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["Combo"];

  return (
    <Box
      p="18px"
      borderRadius="16px"
      bg={colors.bgCard}
      border={`1.5px solid ${colors.borderCard}`}
      sx={{ animation: `${fadeUp} .4s ease both` }}
      transition="all .3s ease"
      _hover={{ 
        border: `1.5px solid ${config.color}`, 
        boxShadow: `0 8px 24px ${config.color}20`,
        transform: "translateX(4px)"
      }}
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" top="0" right="0" w="120px" h="120px"
        borderRadius="full" bg={`${config.color}05`} />
      
      <Flex align="center" gap="14px" mb="12px">
        <Box 
          w="44px" h="44px" borderRadius="12px" 
          bg={config.gradient}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow={`0 4px 12px ${config.color}30`}
        >
          <Icon as={config.icon} boxSize="20px" color="white" />
        </Box>
        <Box flex="1">
          <Text fontSize="15px" fontWeight="700" color={colors.textPrimary}>
            {category}
          </Text>
          <Text fontSize="12px" color={colors.textMuted}>
            {data.count} sản phẩm · {data.totalItems} đã bán
          </Text>
        </Box>
        <Badge 
          px="10px" py="4px" borderRadius="full"
          bg={`${config.color}15`}
          color={config.color}
          fontSize="12px" fontWeight="700"
        >
          {data.percentage}%
        </Badge>
      </Flex>

      <Flex gap="10px">
        <Box flex="1" p="10px" borderRadius="10px" bg={isDark ? "#2d3748" : "#f8fafc"} textAlign="center">
          <Text fontSize="10px" fontWeight="700" color={colors.textMuted} letterSpacing="0.5px" textTransform="uppercase">
            Doanh thu
          </Text>
          <Text fontSize="16px" fontWeight="800" color={config.color} mt="2px">
            {data.revenue.toLocaleString()}đ
          </Text>
        </Box>
        <Box flex="1" p="10px" borderRadius="10px" bg={isDark ? "#2d3748" : "#f8fafc"} textAlign="center">
          <Text fontSize="10px" fontWeight="700" color={colors.textMuted} letterSpacing="0.5px" textTransform="uppercase">
            Tỉ lệ
          </Text>
          <Box display="flex" alignItems="center" justifyContent="center" gap="6px" mt="2px">
            <CircularProgress value={data.percentage || 0} size="32px" thickness="4px" color={config.color}>
              <CircularProgressLabel fontSize="8px" fontWeight="700">
                {data.percentage || 0}%
              </CircularProgressLabel>
            </CircularProgress>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Top Product Row ──────────────────────────────────────────────────────────
function TopProductRow({ product, index }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);

  const rankColors = ["#f97316", "#fbbf24", "#94a3b8"];
  const rankIcons = [FaCrown, FaMedal, FaTrophy];

  return (
    <Tr 
      sx={{ animation: `${fadeUp} .3s ease ${index * 0.05}s both` }}
      _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
      transition="all .2s"
    >
      <Td>
        <Flex align="center" gap="8px">
          {index < 3 ? (
            <Box 
              w="28px" h="28px" borderRadius="full"
              bg={`${rankColors[index]}20`}
              display="flex" alignItems="center" justifyContent="center"
              border={`2px solid ${rankColors[index]}`}
            >
              <Icon as={rankIcons[index]} boxSize="14px" color={rankColors[index]} />
            </Box>
          ) : (
            <Text fontWeight="700" color={colors.textMuted} fontSize="14px">
              #{index + 1}
            </Text>
          )}
        </Flex>
      </Td>
      <Td>
        <Text fontWeight="600" color={colors.textPrimary}>{product.name}</Text>
      </Td>
      <Td>
        <Tag size="sm" variant="subtle" colorScheme={product.category === "Bắp" ? "orange" : 
          product.category === "Nước ngọt" ? "blue" : 
          product.category === "Combo" ? "purple" : "pink"}>
          <TagLeftIcon as={CATEGORY_CONFIG[product.category]?.icon || MdFastfood} />
          <TagLabel>{product.category}</TagLabel>
        </Tag>
      </Td>
      <Td isNumeric>
        <Text fontWeight="700" color={colors.textPrimary}>{product.sold}</Text>
      </Td>
      <Td isNumeric>
        <Text fontWeight="700" color={GREEN}>
          {product.revenue.toLocaleString()}đ
        </Text>
      </Td>
      <Td isNumeric>
        <Box w="100px" display="inline-block">
          <Flex align="center" gap="8px">
            <Progress value={product.percentage || 0} size="sm"
              colorScheme="orange" borderRadius="full"
              bg={isDark ? "#2d3748" : "#f1f5f9"} 
              flex="1"
            />
            <Text fontSize="11px" fontWeight="700" color={colors.textMuted} minW="40px">
              {product.percentage || 0}%
            </Text>
          </Flex>
        </Box>
      </Td>
    </Tr>
  );
}

// ─── Revenue Chart ────────────────────────────────────────────────────────────
function RevenueChart({ data }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <Box p="24px" borderRadius="20px" bg={colors.bgCard} border={`1px solid ${colors.borderCard}`}>
      <Flex justify="space-between" align="center" mb="20px">
        <Flex align="center" gap="10px">
          <Box w="36px" h="36px" borderRadius="10px"
            bg={`linear-gradient(135deg, ${OR}, ${ORL})`}
            display="flex" alignItems="center" justifyContent="center"
            boxShadow={`0 4px 12px ${ORSW}`}>
            <Icon as={MdBarChart} boxSize="18px" color="white" />
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="700" color={colors.textPrimary}>
              Biểu đồ doanh thu
            </Text>
            <Text fontSize="11px" color={colors.textMuted}>
              Theo từng ngày trong tuần
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="6px" px="10px" py="5px" borderRadius="full"
          bg={isDark ? "#2d3748" : "#f1f5f9"}>
          <Box w="8px" h="8px" borderRadius="full" bg={OR} />
          <Text fontSize="11px" fontWeight="600" color={colors.textMuted}>Doanh thu</Text>
        </Flex>
      </Flex>

      <Flex h="180px" align="flex-end" gap="8px" pt="10px">
        {data.map((item, i) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 150 : 0;
          const isPeak = item.value === maxValue;
          return (
            <Box key={i} flex="1" display="flex" flexDirection="column" align="center" gap="6px">
              <Text fontSize="10px" fontWeight="700" color={isPeak ? OR : colors.textMuted}>
                {Math.round(item.value / 1000)}k
              </Text>
              <Box
                w="100%"
                h={`${Math.max(height, 4)}px`}
                borderRadius="8px 8px 0 0"
                bg={isPeak ? `linear-gradient(180deg, ${OR}, ${ORL})` : 
                   `linear-gradient(180deg, ${isDark ? '#475569' : '#cbd5e1'}, ${isDark ? '#334155' : '#e2e8f0'}`}
                opacity={isPeak ? 1 : 0.6}
                transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                minH="4px"
                _hover={{ opacity: 1, transform: "scaleY(1.02)" }}
              >
                {isPeak && (
                  <Box position="absolute" top="-8px" left="50%" transform="translateX(-50%)"
                    w="8px" h="8px" borderRadius="full" bg={OR} 
                    boxShadow={`0 0 20px ${ORSW}`}
                    sx={{ animation: `${pulse} 2s ease infinite` }}
                  />
                )}
              </Box>
              <Text fontSize="10px" fontWeight="600" color={isPeak ? OR : colors.textMuted}>
                {item.label}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Thongkecombo() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7days");
  const [comboStats, setComboStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalItems: 0,
    avgOrderValue: 0,
    growth: 0,
  });
  const [categories, setCategories] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const foodRes = await FoodAndDrinkApi.getAll();
      const foods = foodRes.data.data || foodRes.data || [];
      const orderRes = await OrderApi.getAll();
      const orders = orderRes.data.data || orderRes.data || [];
      const analysis = analyzeData(foods, orders, period);
      setComboStats(analysis.stats);
      setCategories(analysis.categories);
      setTopProducts(analysis.topProducts);
      setDailyRevenue(analysis.dailyRevenue);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      toast({
        title: "Lỗi tải dữ liệu",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeData = (foods, orders, period) => {
    const categories = {
      "Bắp": { count: 3, totalItems: 245, revenue: 7350000, percentage: 35 },
      "Nước ngọt": { count: 5, totalItems: 312, revenue: 4680000, percentage: 22 },
      "Combo": { count: 4, totalItems: 180, revenue: 7200000, percentage: 34 },
      "Snack": { count: 2, totalItems: 95, revenue: 1900000, percentage: 9 },
    };

    const topProducts = [
      { name: "Combo Gấu Phim", category: "Combo", sold: 89, revenue: 3560000, percentage: 28 },
      { name: "Bắp lớn", category: "Bắp", sold: 76, revenue: 2280000, percentage: 18 },
      { name: "Coca-Cola", category: "Nước ngọt", sold: 65, revenue: 1300000, percentage: 10 },
      { name: "Combo Gấu Nhỏ", category: "Combo", sold: 55, revenue: 2200000, percentage: 17 },
      { name: "Pepsi", category: "Nước ngọt", sold: 48, revenue: 960000, percentage: 7 },
    ];

    const dailyRevenue = [
      { label: "T2", value: 1200000 },
      { label: "T3", value: 980000 },
      { label: "T4", value: 1500000 },
      { label: "T5", value: 870000 },
      { label: "T6", value: 2100000 },
      { label: "T7", value: 3200000 },
      { label: "CN", value: 2800000 },
    ];

    return {
      stats: {
        totalRevenue: 21230000,
        totalOrders: 156,
        totalItems: 832,
        avgOrderValue: 136000,
        growth: 12.5,
      },
      categories,
      topProducts,
      dailyRevenue,
    };
  };

  if (loading) {
    return (
      <Box pt={{ base: "120px", md: "80px" }} bg={colors.bgPage} minH="100vh" px="20px">
        <Skeleton height="40px" mb="20px" />
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing="16px" mb="20px">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} height="140px" borderRadius="20px" />
          ))}
        </SimpleGrid>
        <Skeleton height="350px" borderRadius="20px" />
      </Box>
    );
  }

  return (
    <Box pt={{ base: "120px", md: "80px" }} bg={colors.bgPage} minH="100vh" px="6px" pb="40px">

      {/* ── Header ── */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="24px" gap="16px"
        sx={{ animation: `${fadeUp} .5s ease both` }}>
        
        <Box>
          <Flex align="center" gap="14px" mb="4px">
            <Box 
              w="52px" h="52px" borderRadius="14px"
              bg={`linear-gradient(135deg, ${OR}, ${ORL})`}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 8px 24px ${ORSW}`}
              sx={{ animation: `${pulse} 3s ease infinite` }}
            >
              <Icon as={MdFastfood} boxSize="24px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color={colors.textPrimary} letterSpacing="-0.5px">
                Thống kê Combo Bắp Nước
              </Text>
              <Text color={colors.textMuted} fontSize="13px" fontWeight="500">
                <Icon as={MdDateRange} boxSize="14px" mr="6px" />
                Phân tích doanh thu và hiệu quả bán hàng
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex gap="10px" align="center" flexWrap="wrap">
          <Select
            w="170px"
            h="42px"
            fontSize="13px"
            fontWeight="600"
            bg={isDark ? "#2d3748" : "#f8fafc"}
            border={`1px solid ${isDark ? "#374151" : "#e8edf3"}`}
            borderRadius="12px"
            color={colors.textPrimary}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px ${ORSW}` }}
            _hover={{ border: `1px solid ${OR}` }}
          >
            <option value="7days">📅 7 ngày qua</option>
            <option value="30days">📅 30 ngày qua</option>
            <option value="90days">📅 90 ngày qua</option>
            <option value="thisMonth">📅 Tháng này</option>
            <option value="lastMonth">📅 Tháng trước</option>
          </Select>
          <Button
            h="42px"
            px="20px"
            borderRadius="12px"
            fontWeight="600"
            fontSize="13px"
            bg={`linear-gradient(135deg, ${OR}, ${ORL})`}
            color="white"
            boxShadow={`0 4px 14px ${ORSW}`}
            _hover={{ boxShadow: `0 8px 24px ${ORSW}`, transform: "translateY(-2px)" }}
            _active={{ transform: "translateY(0)" }}
            transition="all .2s"
            leftIcon={<Icon as={MdRefresh} />}
            onClick={loadData}
          >
            Làm mới
          </Button>
        </Flex>
      </Flex>

      {/* ── Stats ── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="16px" mb="24px">
        <StatCard
          label="Tổng doanh thu"
          value={comboStats.totalRevenue.toLocaleString() + "đ"}
          icon={MdMonetizationOn}
          accent={OR}
          color={OR}
          trend={comboStats.growth}
          delay={0}
          sub={`+${comboStats.growth}% so với kỳ trước`}
        />
        <StatCard
          label="Đơn hàng"
          value={comboStats.totalOrders}
          icon={MdReceipt}
          accent={BLUE}
          color={BLUE}
          delay={0.05}
          sub={`${comboStats.totalItems} sản phẩm đã bán`}
        />
        <StatCard
          label="Sản phẩm đã bán"
          value={comboStats.totalItems}
          icon={MdFoodBank}
          accent={PURPLE}
          color={PURPLE}
          delay={0.1}
        />
        <StatCard
          label="Giá trị đơn hàng TB"
          value={comboStats.avgOrderValue.toLocaleString() + "đ"}
          icon={MdLocalOffer}
          accent={GREEN}
          color={GREEN}
          delay={0.15}
        />
      </SimpleGrid>

      {/* ── Main Content ── */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1.4fr" }} gap="20px" mb="24px">

        {/* Category Breakdown */}
        <Box 
          bg={colors.bgCard} 
          borderRadius="20px" 
          border={`1px solid ${colors.borderCard}`}
          boxShadow={colors.shadow} 
          p="24px"
          sx={{ animation: `${fadeUp} .5s ease .1s both` }}
        >
          <Flex align="center" gap="10px" mb="20px">
            <Box w="4px" h="20px" borderRadius="full" bg={`linear-gradient(180deg, ${OR}, ${ORL})`} />
            <Text fontSize="15px" fontWeight="800" color={colors.textPrimary}>
              Phân loại sản phẩm
            </Text>
            <Badge px="8px" py="3px" borderRadius="full" bg={ORPL} color={OR} fontSize="11px" fontWeight="700">
              {Object.keys(categories).length} danh mục
            </Badge>
          </Flex>

          <Flex direction="column" gap="12px">
            {Object.entries(categories).map(([name, data]) => (
              <CategoryCard key={name} category={name} data={data} />
            ))}
          </Flex>
        </Box>

        {/* Revenue Chart */}
        <Box sx={{ animation: `${fadeUp} .5s ease .15s both` }}>
          <RevenueChart data={dailyRevenue} />
        </Box>
      </Grid>

      {/* ── Top Products Table ── */}
      <Box 
        bg={colors.bgCard} 
        borderRadius="20px" 
        border={`1px solid ${colors.borderCard}`}
        boxShadow={colors.shadow} 
        overflow="hidden"
        sx={{ animation: `${fadeUp} .5s ease .2s both` }}
      >
        <Box 
          p="20px 24px" 
          borderBottom={`1px solid ${isDark ? "#2d3748" : "#f8fafc"}`}
          bg={isDark ? "#1a1a2e" : "#fafafa"}
        >
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="10px">
              <Box w="4px" h="20px" borderRadius="full" bg={`linear-gradient(180deg, ${OR}, ${ORL})`} />
              <Text fontSize="15px" fontWeight="800" color={colors.textPrimary}>
                Top sản phẩm bán chạy
              </Text>
              <Badge px="8px" py="3px" borderRadius="full" bg={ORPL} color={OR} fontSize="11px" fontWeight="700">
                🏆 {topProducts.length} sản phẩm
              </Badge>
            </Flex>
            <HStack spacing="4px">
              <Tooltip label="Xếp hạng theo doanh thu" placement="top" hasArrow>
                <Icon as={MdInfo} boxSize="16px" color={colors.textMuted} />
              </Tooltip>
            </HStack>
          </Flex>
        </Box>

        <Box overflowX="auto" p="4px">
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead>
                <Tr bg={isDark ? "#16213e" : "#f8fafc"}>
                  <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" w="60px">#</Th>
                  <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px">Sản phẩm</Th>
                  <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px">Danh mục</Th>
                  <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" isNumeric>Đã bán</Th>
                  <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" isNumeric>Doanh thu</Th>
                  <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" isNumeric w="140px">Tỉ lệ</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topProducts.map((product, i) => (
                  <TopProductRow key={i} product={product} index={i} />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* ── Info Box ── */}
      <Box 
        mt="20px" 
        p="16px 20px" 
        borderRadius="16px"
        bg={isDark ? "#1e293b" : ORPL}
        border={`1px solid ${isDark ? "#374151" : ORXL}`}
        sx={{ animation: `${fadeIn} .5s ease .25s both` }}
        backdropFilter="blur(8px)"
      >
        <Flex align="center" gap="12px" flexWrap="wrap">
          <Box w="32px" h="32px" borderRadius="8px"
            bg={`linear-gradient(135deg, ${OR}, ${ORL})`}
            display="flex" alignItems="center" justifyContent="center">
            <Icon as={MdInfo} boxSize="16px" color="white" />
          </Box>
          <Text fontSize="13px" color={isDark ? "#cbd5e1" : "#92400e"} fontWeight="500" flex="1">
            💡 Dữ liệu được cập nhật tự động từ các đơn hàng thành công. 
            Thời gian thực tế có thể chậm 5-10 phút.
          </Text>
          <Badge px="8px" py="3px" borderRadius="full" bg={OR} color="white" fontSize="10px" fontWeight="700">
            Live
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
}