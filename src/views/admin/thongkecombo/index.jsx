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
  MdReceipt, MdMonetizationOn, MdDateRange, MdShowChart
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
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,158,255,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(74,158,255,0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ─── Dark Theme Colors ─────────────────────────────────────────────────────────
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  inputBorder: "#1a3a5c",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
  gradientFrom: "#4a9eff",
  gradientTo: "#6ab0ff",
};

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

// Dark mode accent
const DARK_ACCENT = DARK_THEME.accent;
const DARK_ACCENT_SHADOW = DARK_THEME.accentShadow;
const DARK_ACCENT_LIGHT = DARK_THEME.accentLight;

// ─── Dark mode helpers ──────────────────────────────────────────────────────
const getColors = (isDark) => ({
  bgPage: isDark ? DARK_THEME.bg : "#f8fafc",
  bgCard: isDark ? DARK_THEME.cardBg : "white",
  bgCardHover: isDark ? DARK_THEME.hoverBg : "#f8fafc",
  bgInput: isDark ? DARK_THEME.inputBg : "#fafafa",
  bgSub: isDark ? DARK_THEME.inputBg : "#f8fafc",
  bgSub2: isDark ? DARK_THEME.cardBg : "#fafbfc",
  borderCard: isDark ? DARK_THEME.border : "#f1f5f9",
  borderInput: isDark ? DARK_THEME.inputBorder : "#e8edf3",
  borderLight: isDark ? DARK_THEME.border : "#f8fafc",
  textPrimary: isDark ? DARK_THEME.text : "#0f172a",
  textSecondary: isDark ? DARK_THEME.textSecondary : "#64748b",
  textMuted: isDark ? DARK_THEME.labelColor : "#94a3b8",
  textDark: isDark ? DARK_THEME.text : "#1a202c",
  textBody: isDark ? DARK_THEME.text : "#334155",
  textLight: isDark ? DARK_THEME.textSecondary : "#475569",
  shadow: isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
  shadowHover: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
  glassBg: isDark ? "rgba(15, 33, 58, 0.6)" : "rgba(255, 255, 255, 0.6)",
  glassBorder: isDark ? "rgba(26, 58, 92, 0.5)" : "rgba(255, 255, 255, 0.8)",
});

// ─── Category Config ─────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  "Bắp": { icon: MdFastfood, color: DARK_ACCENT, bg: DARK_THEME.inputBg, gradient: `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` },
  "Nước ngọt": { icon: MdLocalDrink, color: BLUE, bg: "#eff6ff", gradient: `linear-gradient(135deg, ${BLUE}, #60a5fa)` },
  "Combo": { icon: FaUtensils, color: PURPLE, bg: "#f5f3ff", gradient: `linear-gradient(135deg, ${PURPLE}, #a78bfa)` },
  "Snack": { icon: MdLunchDining, color: PINK, bg: "#fdf2f8", gradient: `linear-gradient(135deg, ${PINK}, #f472b6)` },
};

// ─── Stat Card Component ─────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub, trend, delay = 0, color }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);
  const iconBg = isDark ? DARK_ACCENT : (color || accent);

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
        boxShadow: isDark 
          ? `0 20px 40px ${DARK_ACCENT_SHADOW}`
          : `0 20px 40px ${iconBg}20`,
        border: `1px solid ${isDark ? DARK_ACCENT : iconBg}`
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background */}
      <Box position="absolute" top="-30px" right="-30px" w="100px" h="100px"
        borderRadius="full" bg={`${isDark ? DARK_ACCENT : iconBg}10`} />
      <Box position="absolute" bottom="-50px" left="-50px" w="120px" h="120px"
        borderRadius="full" bg={`${isDark ? DARK_ACCENT : iconBg}08`} />

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
          bg={isDark ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : iconBg}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow={isDark 
            ? `0 8px 20px ${DARK_ACCENT_SHADOW}`
            : `0 8px 20px ${iconBg}40`
          }
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
        border: `1.5px solid ${isDark ? DARK_ACCENT : config.color}`, 
        boxShadow: isDark 
          ? `0 8px 24px ${DARK_ACCENT_SHADOW}`
          : `0 8px 24px ${config.color}20`,
        transform: "translateX(4px)"
      }}
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" top="0" right="0" w="120px" h="120px"
        borderRadius="full" bg={`${isDark ? DARK_ACCENT : config.color}05`} />
      
      <Flex align="center" gap="14px" mb="12px">
        <Box 
          w="44px" h="44px" borderRadius="12px" 
          bg={isDark ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : config.gradient}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow={isDark 
            ? `0 4px 12px ${DARK_ACCENT_SHADOW}`
            : `0 4px 12px ${config.color}30`
          }
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
          bg={isDark ? `${DARK_ACCENT}20` : `${config.color}15`}
          color={isDark ? DARK_ACCENT : config.color}
          fontSize="12px" fontWeight="700"
        >
          {data.percentage}%
        </Badge>
      </Flex>

      <Flex gap="10px">
        <Box flex="1" p="10px" borderRadius="10px" bg={isDark ? DARK_THEME.inputBg : "#f8fafc"} textAlign="center">
          <Text fontSize="10px" fontWeight="700" color={colors.textMuted} letterSpacing="0.5px" textTransform="uppercase">
            Doanh thu
          </Text>
          <Text fontSize="16px" fontWeight="800" color={isDark ? DARK_ACCENT : config.color} mt="2px">
            {data.revenue.toLocaleString()}đ
          </Text>
        </Box>
        <Box flex="1" p="10px" borderRadius="10px" bg={isDark ? DARK_THEME.inputBg : "#f8fafc"} textAlign="center">
          <Text fontSize="10px" fontWeight="700" color={colors.textMuted} letterSpacing="0.5px" textTransform="uppercase">
            Tỉ lệ
          </Text>
          <Box display="flex" alignItems="center" justifyContent="center" gap="6px" mt="2px">
            <CircularProgress value={data.percentage || 0} size="32px" thickness="4px" 
              color={isDark ? DARK_ACCENT : config.color}>
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

  const rankColors = isDark 
    ? [DARK_ACCENT, DARK_ACCENT_LIGHT, DARK_THEME.labelColor]
    : ["#f97316", "#fbbf24", "#94a3b8"];
  const rankIcons = [FaCrown, FaMedal, FaTrophy];

  return (
    <Tr 
      sx={{ animation: `${fadeUp} .3s ease ${index * 0.05}s both` }}
      _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f8fafc" }}
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
        <Text fontWeight="700" color={isDark ? DARK_ACCENT : GREEN}>
          {product.revenue.toLocaleString()}đ
        </Text>
      </Td>
      <Td isNumeric>
        <Box w="100px" display="inline-block">
          <Flex align="center" gap="8px">
            <Progress value={product.percentage || 0} size="sm"
              colorScheme={isDark ? "blue" : "orange"} 
              borderRadius="full"
              bg={isDark ? DARK_THEME.inputBg : "#f1f5f9"} 
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
  const accentColor = isDark ? DARK_ACCENT : OR;

  return (
    <Box p="24px" borderRadius="20px" bg={colors.bgCard} border={`1px solid ${colors.borderCard}`}>
      <Flex justify="space-between" align="center" mb="20px">
        <Flex align="center" gap="10px">
          <Box w="36px" h="36px" borderRadius="10px"
            bg={isDark 
              ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
              : `linear-gradient(135deg, ${OR}, ${ORL})`
            }
            display="flex" alignItems="center" justifyContent="center"
            boxShadow={isDark 
              ? `0 4px 12px ${DARK_ACCENT_SHADOW}`
              : `0 4px 12px ${ORSW}`
            }>
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
          bg={isDark ? DARK_THEME.inputBg : "#f1f5f9"}>
          <Box w="8px" h="8px" borderRadius="full" bg={accentColor} />
          <Text fontSize="11px" fontWeight="600" color={colors.textMuted}>Doanh thu</Text>
        </Flex>
      </Flex>

      <Flex h="180px" align="flex-end" gap="8px" pt="10px">
        {data.map((item, i) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 150 : 0;
          const isPeak = item.value === maxValue;
          return (
            <Box key={i} flex="1" display="flex" flexDirection="column" align="center" gap="6px">
              <Text fontSize="10px" fontWeight="700" color={isPeak ? accentColor : colors.textMuted}>
                {Math.round(item.value / 1000)}k
              </Text>
              <Box
                w="100%"
                h={`${Math.max(height, 4)}px`}
                borderRadius="8px 8px 0 0"
                bg={isPeak 
                  ? (isDark 
                      ? `linear-gradient(180deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
                      : `linear-gradient(180deg, ${OR}, ${ORL})`
                    )
                  : `linear-gradient(180deg, ${isDark ? DARK_THEME.border : '#cbd5e1'}, ${isDark ? DARK_THEME.inputBg : '#e2e8f0'}`}
                opacity={isPeak ? 1 : 0.6}
                transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                minH="4px"
                _hover={{ opacity: 1, transform: "scaleY(1.02)" }}
              >
                {isPeak && (
                  <Box position="absolute" top="-8px" left="50%" transform="translateX(-50%)"
                    w="8px" h="8px" borderRadius="full" bg={accentColor} 
                    boxShadow={isDark 
                      ? `0 0 20px ${DARK_ACCENT_SHADOW}`
                      : `0 0 20px ${ORSW}`
                    }
                    sx={{ animation: `${pulse} 2s ease infinite` }}
                  />
                )}
              </Box>
              <Text fontSize="10px" fontWeight="600" color={isPeak ? accentColor : colors.textMuted}>
                {item.label}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

// ─── New Chart: Pie Chart for Category Distribution ──────────────────────────
function CategoryPieChart({ categories }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);
  
  const total = Object.values(categories).reduce((sum, cat) => sum + cat.percentage, 0);
  const colors_pie = isDark 
    ? [DARK_ACCENT, DARK_ACCENT_LIGHT, '#6ab0ff', '#4ade80']
    : ['#f97316', '#fb923c', '#a78bfa', '#f472b6'];

  return (
    <Box p="24px" borderRadius="20px" bg={colors.bgCard} border={`1px solid ${colors.borderCard}`}>
      <Flex justify="space-between" align="center" mb="20px">
        <Flex align="center" gap="10px">
          <Box w="36px" h="36px" borderRadius="10px"
            bg={isDark 
              ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
              : `linear-gradient(135deg, ${PURPLE}, #a78bfa)`
            }
            display="flex" alignItems="center" justifyContent="center"
            boxShadow={isDark 
              ? `0 4px 12px ${DARK_ACCENT_SHADOW}`
              : "0 4px 12px rgba(124,58,237,0.2)"
            }>
            <Icon as={MdPercent} boxSize="18px" color="white" />
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="700" color={colors.textPrimary}>
              Phân bổ danh mục
            </Text>
            <Text fontSize="11px" color={colors.textMuted}>
              Tỉ lệ đóng góp theo danh mục
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Flex direction="column" gap="12px">
        {Object.entries(categories).map(([name, data], index) => {
          const percentage = (data.percentage / total) * 100;
          const color = colors_pie[index % colors_pie.length];
          
          return (
            <Box key={name}>
              <Flex justify="space-between" mb="4px">
                <Text fontSize="12px" fontWeight="600" color={colors.textPrimary}>
                  {name}
                </Text>
                <Text fontSize="12px" fontWeight="700" color={color}>
                  {Math.round(percentage)}%
                </Text>
              </Flex>
              <Box w="100%" h="6px" borderRadius="full" bg={isDark ? DARK_THEME.inputBg : "#f1f5f9"}>
                <Box 
                  w={`${percentage}%`} 
                  h="100%" 
                  borderRadius="full" 
                  bg={color}
                  transition="width 1s ease"
                  sx={{ animation: `${scaleIn} .6s ease ${index * 0.1}s both` }}
                />
              </Box>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

// ─── New Chart: Growth Trend ──────────────────────────────────────────────────
function GrowthTrend({ data }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);
  
  const months = ['Thg1', 'Thg2', 'Thg3', 'Thg4', 'Thg5', 'Thg6'];
  const values = [12, 19, 15, 22, 28, 35];
  
  return (
    <Box p="24px" borderRadius="20px" bg={colors.bgCard} border={`1px solid ${colors.borderCard}`}>
      <Flex justify="space-between" align="center" mb="20px">
        <Flex align="center" gap="10px">
          <Box w="36px" h="36px" borderRadius="10px"
            bg={isDark 
              ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
              : `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`
            }
            display="flex" alignItems="center" justifyContent="center"
            boxShadow={isDark 
              ? `0 4px 12px ${DARK_ACCENT_SHADOW}`
              : "0 4px 12px rgba(5,150,105,0.2)"
            }>
            <Icon as={MdShowChart} boxSize="18px" color="white" />
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="700" color={colors.textPrimary}>
              Xu hướng tăng trưởng
            </Text>
            <Text fontSize="11px" color={colors.textMuted}>
              Doanh thu theo tháng
            </Text>
          </Box>
        </Flex>
        <Badge px="10px" py="4px" borderRadius="full" bg={isDark ? `${DARK_ACCENT}20` : `${GREEN}15`} 
          color={isDark ? DARK_ACCENT : GREEN} fontSize="12px" fontWeight="700">
          ↑ +15.3%
        </Badge>
      </Flex>

      <Flex h="120px" align="flex-end" gap="12px" pt="10px">
        {values.map((val, i) => {
          const max = Math.max(...values);
          const height = (val / max) * 100;
          const isGrowing = i > 0 && val > values[i - 1];
          
          return (
            <Box key={i} flex="1" display="flex" flexDirection="column" align="center" gap="6px">
              <Text fontSize="9px" fontWeight="700" color={isDark ? DARK_ACCENT : GREEN}>
                {val}tr
              </Text>
              <Box
                w="100%"
                h={`${height}px`}
                borderRadius="6px 6px 0 0"
                bg={isGrowing 
                  ? (isDark 
                      ? `linear-gradient(180deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
                      : `linear-gradient(180deg, ${GREEN}, ${GREEN_LIGHT})`
                    )
                  : isDark 
                      ? DARK_THEME.border
                      : '#cbd5e1'
                }
                transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{ opacity: 0.8 }}
                position="relative"
              >
                {isGrowing && (
                  <Box position="absolute" top="-4px" left="50%" transform="translateX(-50%)"
                    w="6px" h="6px" borderRadius="full" 
                    bg={isDark ? DARK_ACCENT : GREEN}
                  />
                )}
              </Box>
              <Text fontSize="9px" fontWeight="600" color={isGrowing ? (isDark ? DARK_ACCENT : GREEN) : colors.textMuted}>
                {months[i]}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

// ─── New Chart: Customer Satisfaction ────────────────────────────────────────
function CustomerSatisfaction() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getColors(isDark);
  
  const satisfaction = {
    excellent: 45,
    good: 30,
    average: 15,
    poor: 10
  };
  
  const total = Object.values(satisfaction).reduce((a, b) => a + b, 0);
  const rating = ((satisfaction.excellent * 5 + satisfaction.good * 4 + satisfaction.average * 3 + satisfaction.poor * 2) / total).toFixed(1);

  return (
    <Box p="24px" borderRadius="20px" bg={colors.bgCard} border={`1px solid ${colors.borderCard}`}>
      <Flex justify="space-between" align="center" mb="20px">
        <Flex align="center" gap="10px">
          <Box w="36px" h="36px" borderRadius="10px"
            bg={isDark 
              ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
              : `linear-gradient(135deg, ${BLUE}, #60a5fa)`
            }
            display="flex" alignItems="center" justifyContent="center"
            boxShadow={isDark 
              ? `0 4px 12px ${DARK_ACCENT_SHADOW}`
              : "0 4px 12px rgba(37,99,235,0.2)"
            }>
            <Icon as={MdStar} boxSize="18px" color="white" />
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="700" color={colors.textPrimary}>
              Hài lòng khách hàng
            </Text>
            <Text fontSize="11px" color={colors.textMuted}>
              Đánh giá về sản phẩm combo
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="6px">
          <Text fontSize="24px" fontWeight="800" color={isDark ? DARK_ACCENT : BLUE}>
            {rating}
          </Text>
          <Flex>
            {[1,2,3,4,5].map(i => (
              <Icon key={i} as={i <= Math.round(rating) ? MdStar : MdStarBorder} 
                boxSize="14px" color={isDark ? DARK_ACCENT : "#f59e0b"} />
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gap="8px">
        {Object.entries(satisfaction).map(([level, value]) => {
          const percentage = (value / total) * 100;
          const labels = {
            excellent: 'Rất hài lòng',
            good: 'Hài lòng',
            average: 'Trung bình',
            poor: 'Chưa hài lòng'
          };
          const colors_level = isDark 
            ? [DARK_ACCENT, DARK_ACCENT_LIGHT, '#6ab0ff', DARK_THEME.border]
            : ['#059669', '#f59e0b', '#f97316', '#dc2626'];
          const colorMap = {
            excellent: colors_level[0],
            good: colors_level[1],
            average: colors_level[2],
            poor: colors_level[3]
          };
          
          return (
            <Box key={level}>
              <Flex justify="space-between" mb="2px">
                <Text fontSize="11px" color={colors.textSecondary}>{labels[level]}</Text>
                <Text fontSize="11px" fontWeight="600" color={colorMap[level]}>
                  {value} ({Math.round(percentage)}%)
                </Text>
              </Flex>
              <Box w="100%" h="4px" borderRadius="full" bg={isDark ? DARK_THEME.inputBg : "#f1f5f9"}>
                <Box 
                  w={`${percentage}%`} 
                  h="100%" 
                  borderRadius="full" 
                  bg={colorMap[level]}
                  transition="width 1s ease"
                />
              </Box>
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
              bg={isDark 
                ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
                : `linear-gradient(135deg, ${OR}, ${ORL})`
              }
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={isDark 
                ? `0 8px 24px ${DARK_ACCENT_SHADOW}`
                : `0 8px 24px ${ORSW}`
              }
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
            bg={isDark ? DARK_THEME.inputBg : "#f8fafc"}
            border={`1px solid ${isDark ? DARK_THEME.inputBorder : "#e8edf3"}`}
            borderRadius="12px"
            color={colors.textPrimary}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            _focus={{ 
              border: `1.5px solid ${isDark ? DARK_ACCENT : OR}`, 
              boxShadow: isDark 
                ? `0 0 0 3px ${DARK_ACCENT_SHADOW}`
                : `0 0 0 3px ${ORSW}`
            }}
            _hover={{ border: `1px solid ${isDark ? DARK_ACCENT : OR}` }}
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
            bg={isDark 
              ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
              : `linear-gradient(135deg, ${OR}, ${ORL})`
            }
            color="white"
            boxShadow={isDark 
              ? `0 4px 14px ${DARK_ACCENT_SHADOW}`
              : `0 4px 14px ${ORSW}`
            }
            _hover={{ 
              boxShadow: isDark 
                ? `0 8px 24px ${DARK_ACCENT_SHADOW}`
                : `0 8px 24px ${ORSW}`, 
              transform: "translateY(-2px)" 
            }}
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
          accent={isDark ? DARK_ACCENT : OR}
          color={isDark ? DARK_ACCENT : OR}
          trend={comboStats.growth}
          delay={0}
          sub={`+${comboStats.growth}% so với kỳ trước`}
        />
        <StatCard
          label="Đơn hàng"
          value={comboStats.totalOrders}
          icon={MdReceipt}
          accent={isDark ? DARK_ACCENT_LIGHT : BLUE}
          color={isDark ? DARK_ACCENT_LIGHT : BLUE}
          delay={0.05}
          sub={`${comboStats.totalItems} sản phẩm đã bán`}
        />
        <StatCard
          label="Sản phẩm đã bán"
          value={comboStats.totalItems}
          icon={MdFoodBank}
          accent={isDark ? "#6ab0ff" : PURPLE}
          color={isDark ? "#6ab0ff" : PURPLE}
          delay={0.1}
        />
        <StatCard
          label="Giá trị đơn hàng TB"
          value={comboStats.avgOrderValue.toLocaleString() + "đ"}
          icon={MdLocalOffer}
          accent={isDark ? "#4ade80" : GREEN}
          color={isDark ? "#4ade80" : GREEN}
          delay={0.15}
        />
      </SimpleGrid>

      {/* ── Charts Grid ── */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="20px" mb="24px">
        <CategoryPieChart categories={categories} />
        <GrowthTrend data={dailyRevenue} />
      </Grid>

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
            <Box w="4px" h="20px" borderRadius="full" bg={isDark 
              ? `linear-gradient(180deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
              : `linear-gradient(180deg, ${OR}, ${ORL})`
            } />
            <Text fontSize="15px" fontWeight="800" color={colors.textPrimary}>
              Phân loại sản phẩm
            </Text>
            <Badge px="8px" py="3px" borderRadius="full" bg={isDark ? `${DARK_ACCENT}20` : ORPL} 
              color={isDark ? DARK_ACCENT : OR} fontSize="11px" fontWeight="700">
              {Object.keys(categories).length} danh mục
            </Badge>
          </Flex>

          <Flex direction="column" gap="12px">
            {Object.entries(categories).map(([name, data]) => (
              <CategoryCard key={name} category={name} data={data} />
            ))}
          </Flex>
        </Box>

        {/* Revenue Chart & Satisfaction */}
        <Flex direction="column" gap="20px">
          <RevenueChart data={dailyRevenue} />
          <CustomerSatisfaction />
        </Flex>
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
          borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f8fafc"}`}
          bg={isDark ? DARK_THEME.inputBg : "#fafafa"}
        >
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="10px">
              <Box w="4px" h="20px" borderRadius="full" bg={isDark 
                ? `linear-gradient(180deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
                : `linear-gradient(180deg, ${OR}, ${ORL})`
              } />
              <Text fontSize="15px" fontWeight="800" color={colors.textPrimary}>
                Top sản phẩm bán chạy
              </Text>
              <Badge px="8px" py="3px" borderRadius="full" bg={isDark ? `${DARK_ACCENT}20` : ORPL} 
                color={isDark ? DARK_ACCENT : OR} fontSize="11px" fontWeight="700">
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
                <Tr bg={isDark ? DARK_THEME.inputBg : "#f8fafc"}>
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
        bg={isDark ? DARK_THEME.inputBg : ORPL}
        border={`1px solid ${isDark ? DARK_THEME.border : ORXL}`}
        sx={{ animation: `${fadeIn} .5s ease .25s both` }}
        backdropFilter="blur(8px)"
      >
        <Flex align="center" gap="12px" flexWrap="wrap">
          <Box w="32px" h="32px" borderRadius="8px"
            bg={isDark 
              ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
              : `linear-gradient(135deg, ${OR}, ${ORL})`
            }
            display="flex" alignItems="center" justifyContent="center">
            <Icon as={MdInfo} boxSize="16px" color="white" />
          </Box>
          <Text fontSize="13px" color={isDark ? DARK_THEME.text : "#92400e"} fontWeight="500" flex="1">
            💡 Dữ liệu được cập nhật tự động từ các đơn hàng thành công. 
            Thời gian thực tế có thể chậm 5-10 phút.
          </Text>
          <Badge px="8px" py="3px" borderRadius="full" 
            bg={isDark ? DARK_ACCENT : OR} 
            color="white" fontSize="10px" fontWeight="700">
            Live
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
}