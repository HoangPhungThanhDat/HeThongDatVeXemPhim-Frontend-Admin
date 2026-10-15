import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Text,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import {
  MdAttachMoney,
  MdConfirmationNumber,
  MdAccessTime,
  MdEventSeat,
  MdTrendingUp,
  MdLocalMovies,
} from "react-icons/md";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

/* ─────────────────── DATA ─────────────────── */

const revenueData = [
  { day: "T2", revenue: 1200000, prev: 900000 },
  { day: "T3", revenue: 1800000, prev: 1400000 },
  { day: "T4", revenue: 1500000, prev: 1600000 },
  { day: "T5", revenue: 2200000, prev: 1800000 },
  { day: "T6", revenue: 3000000, prev: 2400000 },
  { day: "T7", revenue: 4200000, prev: 3500000 },
  { day: "CN", revenue: 3800000, prev: 3200000 },
];

const ticketByMovie = [
  { name: "Avengers", tickets: 320, color: "#F6AD55" },
  { name: "Spider-Man", tickets: 260, color: "#FC8181" },
  { name: "Batman", tickets: 180, color: "#76E4F7" },
  { name: "Thor", tickets: 140, color: "#9F7AEA" },
];

const ticketStatus = [
  { name: "Đã bán", value: 720 },
  { name: "Đã hủy", value: 80 },
];

const hourlyData = [
  { time: "9h", seats: 12 },
  { time: "11h", seats: 28 },
  { time: "13h", seats: 45 },
  { time: "15h", seats: 38 },
  { time: "17h", seats: 52 },
  { time: "19h", seats: 76 },
  { time: "21h", seats: 65 },
];

const COLORS = ["#F6AD55", "#FC8181"];
const totalTickets = ticketStatus.reduce((s, i) => s + i.value, 0);

/* ─────────────────── CUSTOM TOOLTIP ─────────────────── */

const CustomLineTooltip = ({ active, payload, label }) => {
  const bg = useColorModeValue("white", "rgba(15,15,25,0.96)");
  const borderColor = useColorModeValue("rgba(246,173,85,0.4)", "rgba(246,173,85,0.3)");
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.600");

  if (!active || !payload?.length) return null;
  return (
    <Box
      bg={bg}
      border={`1px solid ${borderColor}`}
      borderRadius="12px"
      px="14px"
      py="10px"
      boxShadow="0 8px 32px rgba(0,0,0,0.15)"
    >
      <Text fontSize="xs" color={labelColor} mb="4px" fontWeight="600" letterSpacing="0.08em">
        {label}
      </Text>
      {payload.map((p, i) => (
        <Text key={i} fontSize="sm" fontWeight="700" color={p.color}>
          {Number(p.value).toLocaleString("vi-VN")} ₫
        </Text>
      ))}
    </Box>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  const bg = useColorModeValue("white", "rgba(15,15,25,0.96)");
  const borderColor = useColorModeValue("rgba(246,173,85,0.4)", "rgba(246,173,85,0.3)");
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.600");

  if (!active || !payload?.length) return null;
  return (
    <Box
      bg={bg}
      border={`1px solid ${borderColor}`}
      borderRadius="12px"
      px="14px"
      py="10px"
      boxShadow="0 8px 32px rgba(0,0,0,0.15)"
    >
      <Text fontSize="xs" color={labelColor} mb="4px">{label}</Text>
      <Text fontSize="sm" fontWeight="700" color="#F6AD55">{payload[0].value} vé</Text>
    </Box>
  );
};

/* ─────────────────── ANIMATED COUNTER ─────────────────── */

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1200 }) {
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

  const formatted =
    typeof value === "string" && value.includes(".")
      ? display.toLocaleString("vi-VN") + "." + value.split(".")[1]
      : display.toLocaleString("vi-VN");

  return <>{prefix}{formatted}{suffix}</>;
}

/* ─────────────────── KPI CARD ─────────────────── */

function KpiCard({ icon, label, value, prefix, suffix, iconColor, trend, trendLabel }) {
  const cardBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");
  const cardHoverBg = useColorModeValue("gray.50", "rgba(255,255,255,0.06)");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const trendLabelColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const shadowColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(0,0,0,0.4)");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="20px"
      p="20px"
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
      _hover={{
        bg: cardHoverBg,
        borderColor: "rgba(246,173,85,0.35)",
        transform: "translateY(-3px)",
        boxShadow: `0 16px 40px ${shadowColor}, 0 0 0 1px rgba(246,173,85,0.1)`,
      }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0, left: 0, right: 0,
        h: "2px",
        bgGradient: `linear(to-r, transparent, ${iconColor}, transparent)`,
      }}
    >
      {/* Glow orb */}
      <Box
        position="absolute"
        top="-20px" right="-20px"
        w="80px" h="80px"
        borderRadius="full"
        bg={iconColor}
        opacity={0.07}
        filter="blur(20px)"
        pointerEvents="none"
      />

      <Flex align="center" justify="space-between" mb="16px">
        <Flex
          w="42px" h="42px"
          borderRadius="12px"
          bg={`${iconColor}18`}
          border={`1px solid ${iconColor}30`}
          align="center" justify="center"
        >
          <Icon as={icon} boxSize="20px" color={iconColor} />
        </Flex>
        {trend && (
          <Badge
            bg={trend > 0 ? "rgba(72,187,120,0.15)" : "rgba(252,129,129,0.15)"}
            color={trend > 0 ? "#38A169" : "#E53E3E"}
            border={`1px solid ${trend > 0 ? "rgba(72,187,120,0.3)" : "rgba(252,129,129,0.3)"}`}
            borderRadius="8px"
            px="8px" py="3px"
            fontSize="xs" fontWeight="700"
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </Badge>
        )}
      </Flex>

      <Text
        fontSize="xs"
        color={labelColor}
        fontWeight="600"
        letterSpacing="0.1em"
        textTransform="uppercase"
        mb="6px"
      >
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="800" color={textColor} letterSpacing="-0.5px">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </Text>
      {trendLabel && (
        <Text fontSize="xs" color={trendLabelColor} mt="6px">{trendLabel}</Text>
      )}
    </Box>
  );
}

/* ─────────────────── CHART CARD WRAPPER ─────────────────── */

function ChartCard({ accentColor, children }) {
  const cardBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="20px"
      p="24px"
      position="relative"
      overflow="hidden"
      boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
      _before={{
        content: '""',
        position: "absolute",
        top: 0, left: 0, right: 0,
        h: "2px",
        bgGradient: `linear(to-r, transparent, ${accentColor}, transparent)`,
      }}
    >
      {children}
    </Box>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function Thongke() {
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const mutedTextColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const axisTickColor = useColorModeValue("rgba(0,0,0,0.45)", "rgba(255,255,255,0.4)");
  const gridStroke = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.05)");
  const dotStrokeColor = useColorModeValue("#ffffff", "#1a1a2e");
  const legendTextColor = useColorModeValue("gray.600", "whiteAlpha.500");
  const pillBg = useColorModeValue("rgba(246,173,85,0.08)", "rgba(246,173,85,0.1)");
  const pillBorder = useColorModeValue("rgba(246,173,85,0.3)", "rgba(246,173,85,0.2)");
  const liveTextColor = useColorModeValue("gray.600", "whiteAlpha.700");
  const pieTextColor = useColorModeValue("#2D3748", "white");
  const pieSubTextColor = useColorModeValue("rgba(0,0,0,0.4)", "rgba(255,255,255,0.4)");

  /* Tooltip backgrounds */
  const tooltipBg = useColorModeValue("white", "rgba(15,15,25,0.96)");
  const tooltipBorder = useColorModeValue("rgba(246,173,85,0.4)", "rgba(246,173,85,0.3)");
  const tooltipLabelColor = useColorModeValue("gray.500", "whiteAlpha.600");
  const tooltipCyanBorder = useColorModeValue("rgba(118,228,247,0.5)", "rgba(118,228,247,0.3)");

  return (
    <Box
      pt={{ base: "120px", md: "80px" }}
      px={{ base: "16px", md: "0" }}
      minH="100vh"
    >
      {/* ── HEADER ── */}
      <Flex align="flex-start" justify="space-between" mb="36px" flexWrap="wrap" gap="12px">
        <Box>
          <Flex align="center" gap="10px" mb="6px">
            <Box w="3px" h="28px" borderRadius="2px" bgGradient="linear(to-b, #F6AD55, #FC8181)" />
            <Text
              fontSize={{ base: "22px", md: "28px" }}
              fontWeight="800"
              color={textColor}
              letterSpacing="-0.5px"
            >
              Thống kê hệ thống
            </Text>
          </Flex>
          <Text color={subTextColor} fontSize="sm" pl="13px">
            Tổng quan doanh thu, vé bán & suất chiếu • Tuần này
          </Text>
        </Box>

        <Flex
          align="center" gap="8px"
          bg={pillBg}
          border="1px solid"
          borderColor={pillBorder}
          borderRadius="12px"
          px="14px" py="8px"
        >
          <Box w="7px" h="7px" borderRadius="full" bg="#48BB78" boxShadow="0 0 8px #48BB78" />
          <Text fontSize="xs" color={liveTextColor} fontWeight="600">Dữ liệu thực theo giờ</Text>
        </Flex>
      </Flex>

      {/* ── KPI GRID ── */}
      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="16px" mb="28px">
        <KpiCard
          icon={MdAttachMoney}
          label="Doanh thu tuần"
          value="17700000"
          suffix=" ₫"
          iconColor="#F6AD55"
          trend={12}
          trendLabel="so với tuần trước"
        />
        <KpiCard
          icon={MdConfirmationNumber}
          label="Vé đã bán"
          value={800}
          iconColor="#76E4F7"
          trend={8}
          trendLabel="so với tuần trước"
        />
        <KpiCard
          icon={MdAccessTime}
          label="Suất chiếu hôm nay"
          value={18}
          iconColor="#FC8181"
          trend={-2}
          trendLabel="so với hôm qua"
        />
        <KpiCard
          icon={MdEventSeat}
          label="Tỉ lệ lấp ghế"
          value={76}
          suffix="%"
          iconColor="#9F7AEA"
          trend={5}
          trendLabel="mục tiêu: 85%"
        />
      </SimpleGrid>

      {/* ── ROW 2: AREA CHART + PIE ── */}
      <Grid templateColumns={{ base: "1fr", xl: "3fr 2fr" }} gap="20px" mb="20px">

        {/* AREA CHART */}
        <ChartCard accentColor="#F6AD55">
          <Flex justify="space-between" align="center" mb="20px" flexWrap="wrap" gap="10px">
            <Box>
              <Text fontSize="lg" fontWeight="700" color={textColor}>Doanh thu theo ngày</Text>
              <Text fontSize="xs" color={mutedTextColor} mt="2px">So sánh tuần này & tuần trước</Text>
            </Box>
            <Flex gap="16px">
              {[["#F6AD55", "Tuần này"], ["rgba(246,173,85,0.4)", "Tuần trước"]].map(([c, l]) => (
                <Flex key={l} align="center" gap="6px">
                  <Box w="20px" h="3px" borderRadius="2px" bg={c} />
                  <Text fontSize="xs" color={legendTextColor}>{l}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
          <Box h="280px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F6AD55" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F6AD55" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F6AD55" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#F6AD55" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false} tickLine={false}
                  tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <Box
                        bg={tooltipBg}
                        border={`1px solid ${tooltipBorder}`}
                        borderRadius="12px"
                        px="14px" py="10px"
                        boxShadow="0 8px 32px rgba(0,0,0,0.15)"
                      >
                        <Text fontSize="xs" color={tooltipLabelColor} mb="4px" fontWeight="600" letterSpacing="0.08em">
                          {label}
                        </Text>
                        {payload.map((p, i) => (
                          <Text key={i} fontSize="sm" fontWeight="700" color={p.color}>
                            {Number(p.value).toLocaleString("vi-VN")} ₫
                          </Text>
                        ))}
                      </Box>
                    );
                  }}
                />
                <Area type="monotone" dataKey="prev" stroke="rgba(246,173,85,0.35)"
                  strokeWidth={2} fill="url(#grad2)" strokeDasharray="4 4" dot={false} />
                <Area type="monotone" dataKey="revenue" stroke="#F6AD55"
                  strokeWidth={3} fill="url(#grad1)"
                  dot={{ r: 5, fill: "#F6AD55", strokeWidth: 2, stroke: dotStrokeColor }}
                  activeDot={{ r: 7, fill: "#F6AD55", stroke: dotStrokeColor, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>

        {/* PIE CHART */}
        <ChartCard accentColor="#FC8181">
          <Text fontSize="lg" fontWeight="700" color={textColor} mb="4px">Trạng thái vé</Text>
          <Text fontSize="xs" color={mutedTextColor} mb="20px">Tổng vé trong tuần</Text>

          <Flex direction="column" align="center">
            <Box h="220px" w="100%">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <Pie
                    data={ticketStatus}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {ticketStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} stroke="transparent" filter="url(#glow)" />
                    ))}
                  </Pie>
                  <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
                    fontSize="26" fontWeight="800" fill={pieTextColor}>{totalTickets}</text>
                  <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle"
                    fontSize="11" fontWeight="600" fill={pieSubTextColor}
                    letterSpacing="2">TỔNG VÉ</text>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0];
                      return (
                        <Box
                          bg={tooltipBg}
                          border={`1px solid ${tooltipBorder}`}
                          borderRadius="12px" px="14px" py="10px"
                          boxShadow="0 8px 32px rgba(0,0,0,0.15)"
                        >
                          <Text fontSize="xs" color={tooltipLabelColor} mb="2px">{d.name}</Text>
                          <Text fontSize="sm" fontWeight="700" color={d.payload.fill}>
                            {d.value} vé · {((d.value / totalTickets) * 100).toFixed(1)}%
                          </Text>
                        </Box>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend pills */}
            <Flex gap="12px" mt="4px">
              {ticketStatus.map((item, i) => (
                <Flex key={i}
                  align="center" gap="8px"
                  bg={`${COLORS[i]}12`}
                  border={`1px solid ${COLORS[i]}30`}
                  borderRadius="10px" px="14px" py="8px"
                >
                  <Box w="8px" h="8px" borderRadius="full" bg={COLORS[i]} boxShadow={`0 0 6px ${COLORS[i]}`} />
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color={textColor}>{item.name}</Text>
                    <Text fontSize="10px" color={mutedTextColor}>{item.value} vé</Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </ChartCard>
      </Grid>

      {/* ── ROW 3: BAR + HOURLY ── */}
      <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap="20px">

        {/* BAR CHART */}
        <ChartCard accentColor="#9F7AEA">
          <Flex align="center" gap="10px" mb="4px">
            <Icon as={MdLocalMovies} color="#9F7AEA" boxSize="18px" />
            <Text fontSize="lg" fontWeight="700" color={textColor}>Vé bán theo phim</Text>
          </Flex>
          <Text fontSize="xs" color={mutedTextColor} mb="20px">Top phim đang chiếu trong tuần</Text>
          <Box h="260px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketByMovie} barSize={36} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: axisTickColor, fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <Box
                        bg={tooltipBg}
                        border={`1px solid ${tooltipBorder}`}
                        borderRadius="12px" px="14px" py="10px"
                        boxShadow="0 8px 32px rgba(0,0,0,0.15)"
                      >
                        <Text fontSize="xs" color={tooltipLabelColor} mb="4px">{label}</Text>
                        <Text fontSize="sm" fontWeight="700" color="#F6AD55">{payload[0].value} vé</Text>
                      </Box>
                    );
                  }}
                />
                <Bar dataKey="tickets" radius={[10, 10, 0, 0]}>
                  {ticketByMovie.map((entry, i) => (
                    <Cell key={i} fill={entry.color}
                      style={{ filter: `drop-shadow(0 4px 12px ${entry.color}60)` }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>

        {/* HOURLY SPARKLINE */}
        <ChartCard accentColor="#76E4F7">
          <Flex align="center" gap="10px" mb="4px">
            <Icon as={MdTrendingUp} color="#76E4F7" boxSize="18px" />
            <Text fontSize="lg" fontWeight="700" color={textColor}>Lượt đặt theo giờ</Text>
          </Flex>
          <Text fontSize="xs" color={mutedTextColor} mb="20px">Hôm nay · đơn vị: lượt đặt vé</Text>
          <Box h="260px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#76E4F7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#76E4F7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false}
                  tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: axisTickColor, fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <Box
                        bg={tooltipBg}
                        border={`1px solid ${tooltipCyanBorder}`}
                        borderRadius="12px" px="14px" py="10px"
                        boxShadow="0 8px 32px rgba(0,0,0,0.15)"
                      >
                        <Text fontSize="xs" color={tooltipLabelColor} mb="2px">Lúc {label}</Text>
                        <Text fontSize="sm" fontWeight="700" color="#76E4F7">
                          {payload[0].value} lượt đặt
                        </Text>
                      </Box>
                    );
                  }}
                />
                <Area type="monotone" dataKey="seats" stroke="#76E4F7" strokeWidth={3}
                  fill="url(#gradCyan)"
                  dot={{ r: 4, fill: "#76E4F7", stroke: dotStrokeColor, strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#76E4F7", stroke: dotStrokeColor, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>
      </Grid>
    </Box>
  );
}