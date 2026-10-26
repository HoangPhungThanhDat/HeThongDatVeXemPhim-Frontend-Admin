import React, { useState, useEffect, useRef } from "react";
import {
  Box, Grid, Text, SimpleGrid, Flex, Icon, useColorModeValue, Badge, Spinner, ButtonGroup, Button
} from "@chakra-ui/react";
import {
  MdAttachMoney, MdConfirmationNumber, MdAccessTime, MdEventSeat, MdTrendingUp, MdLocalMovies,
} from "react-icons/md";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell, Area, AreaChart,
} from "recharts";
import DashboardApi from "api/admin/DashboardApi";

/* ─────────────────── CUSTOM TOOLTIP ─────────────────── */
const CustomLineTooltip = ({ active, payload, label }) => {
  const bg = useColorModeValue("white", "rgba(15,15,25,0.96)");
  const borderColor = useColorModeValue("rgba(246,173,85,0.4)", "rgba(246,173,85,0.3)");
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.600");

  if (!active || !payload?.length) return null;
  return (
    <Box bg={bg} border={`1px solid ${borderColor}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
      <Text fontSize="xs" color={labelColor} mb="4px" fontWeight="600" letterSpacing="0.08em">{label}</Text>
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
    <Box bg={bg} border={`1px solid ${borderColor}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
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
      bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" p="20px"
      position="relative" overflow="hidden" transition="all 0.3s ease"
      boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
      _hover={{ bg: cardHoverBg, borderColor: "rgba(246,173,85,0.35)", transform: "translateY(-3px)", boxShadow: `0 16px 40px ${shadowColor}, 0 0 0 1px rgba(246,173,85,0.1)` }}
      _before={{ content: '""', position: "absolute", top: 0, left: 0, right: 0, h: "2px", bgGradient: `linear(to-r, transparent, ${iconColor}, transparent)` }}
    >
      <Box position="absolute" top="-20px" right="-20px" w="80px" h="80px" borderRadius="full" bg={iconColor} opacity={0.07} filter="blur(20px)" pointerEvents="none" />
      <Flex align="center" justify="space-between" mb="16px">
        <Flex w="42px" h="42px" borderRadius="12px" bg={`${iconColor}18`} border={`1px solid ${iconColor}30`} align="center" justify="center">
          <Icon as={icon} boxSize="20px" color={iconColor} />
        </Flex>
        {trend !== undefined && (
          <Badge bg={trend > 0 ? "rgba(72,187,120,0.15)" : "rgba(252,129,129,0.15)"} color={trend > 0 ? "#38A169" : "#E53E3E"} border={`1px solid ${trend > 0 ? "rgba(72,187,120,0.3)" : "rgba(252,129,129,0.3)"}`} borderRadius="8px" px="8px" py="3px" fontSize="xs" fontWeight="700">
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </Badge>
        )}
      </Flex>
      <Text fontSize="xs" color={labelColor} fontWeight="600" letterSpacing="0.1em" textTransform="uppercase" mb="6px">{label}</Text>
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
    <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" p="24px" position="relative" overflow="hidden" boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")} _before={{ content: '""', position: "absolute", top: 0, left: 0, right: 0, h: "2px", bgGradient: `linear(to-r, transparent, ${accentColor}, transparent)` }}>
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
  const tooltipBg = useColorModeValue("white", "rgba(15,15,25,0.96)");
  const tooltipBorder = useColorModeValue("rgba(246,173,85,0.4)", "rgba(246,173,85,0.3)");
  const tooltipLabelColor = useColorModeValue("gray.500", "whiteAlpha.600");
  const tooltipCyanBorder = useColorModeValue("rgba(118,228,247,0.5)", "rgba(118,228,247,0.3)");

  const [period, setPeriod] = useState("week"); 
  const [data, setData] = useState({
    chartTitle: "Doanh thu 7 ngày qua",
    kpi: { revenue: "0", tickets: 0, newUsers: 0, fillRate: "0" },
    revenueChart: [],
    genreChart: [],
    topMovies: [],
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await DashboardApi.getStatistics(period);
        const result = res.data?.data || res.data || res;
        setData(result);
      } catch (error) {
        console.error("❌ Lỗi tải Thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh" flexDir="column" gap={4}>
        <Spinner size="xl" color="#F6AD55" thickness="4px" />
        <Text color={subTextColor} fontWeight="600">Đang tải dữ liệu thống kê...</Text>
      </Flex>
    );
  }

  const revenueChartData = data.revenueChart?.length > 0 ? data.revenueChart : [{ day: "Hôm nay", revenue: 0, tickets: 0 }];
  const ticketStatusData = [
    { name: "Đã bán", value: Number(data.kpi.tickets) || 0, color: "#F6AD55" },
    { name: "Đã hủy", value: 0, color: "#FC8181" },
  ];
  const totalTickets = ticketStatusData.reduce((s, i) => s + i.value, 0);
  const COLORS = ["#F6AD55", "#FC8181"];

  return (
    <Box pt={{ base: "120px", md: "80px" }} px={{ base: "16px", md: "0" }} minH="100vh">
      {/* ── HEADER ── */}
      <Flex align="flex-start" justify="space-between" mb="36px" flexWrap="wrap" gap="12px">
        <Box>
          <Flex align="center" gap="10px" mb="6px">
            <Box w="3px" h="28px" borderRadius="2px" bgGradient="linear(to-b, #F6AD55, #FC8181)" />
            <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color={textColor} letterSpacing="-0.5px">
              Thống kê hệ thống
            </Text>
          </Flex>
          <Text color={subTextColor} fontSize="sm" pl="13px">
            Tổng quan doanh thu, vé bán & suất chiếu • {period === 'week' ? 'Tuần này' : period === 'month' ? 'Tháng này' : 'Năm nay'}
          </Text>
        </Box>

        <Flex align="center" gap="12px" flexWrap="wrap">
          {/* ⭐ NÚT CHUYỂN ĐỔI THỜI GIAN */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button onClick={() => setPeriod("week")} bg={period === "week" ? "#F6AD55" : "transparent"} color={period === "week" ? "white" : textColor} _hover={{ bg: period === "week" ? "#F6AD55" : "gray.100" }}>Tuần</Button>
            <Button onClick={() => setPeriod("month")} bg={period === "month" ? "#F6AD55" : "transparent"} color={period === "month" ? "white" : textColor} _hover={{ bg: period === "month" ? "#F6AD55" : "gray.100" }}>Tháng</Button>
            <Button onClick={() => setPeriod("year")} bg={period === "year" ? "#F6AD55" : "transparent"} color={period === "year" ? "white" : textColor} _hover={{ bg: period === "year" ? "#F6AD55" : "gray.100" }}>Năm</Button>
          </ButtonGroup>

          <Flex align="center" gap="8px" bg={pillBg} border="1px solid" borderColor={pillBorder} borderRadius="12px" px="14px" py="8px">
            <Box w="7px" h="7px" borderRadius="full" bg="#48BB78" boxShadow="0 0 8px #48BB78" />
            <Text fontSize="xs" color={liveTextColor} fontWeight="600">Dữ liệu thực</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* ── KPI GRID ── */}
      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="16px" mb="28px">
        <KpiCard icon={MdAttachMoney} label="Doanh thu" value={data.kpi.revenue} suffix=" ₫" iconColor="#F6AD55" trend={12} trendLabel="so với kỳ trước" />
        <KpiCard icon={MdConfirmationNumber} label="Vé đã bán" value={data.kpi.tickets} iconColor="#76E4F7" trend={8} trendLabel="trong kỳ" />
        <KpiCard icon={MdAccessTime} label="Khách hàng mới" value={data.kpi.newUsers} iconColor="#FC8181" trend={-2} trendLabel="trong kỳ" />
        <KpiCard icon={MdEventSeat} label="Tỉ lệ lấp ghế" value={data.kpi.fillRate} suffix="%" iconColor="#9F7AEA" trend={5} trendLabel="Mục tiêu: 85%" />
      </SimpleGrid>

      {/* ── ROW 2: AREA CHART + PIE ── */}
      <Grid templateColumns={{ base: "1fr", xl: "3fr 2fr" }} gap="20px" mb="20px">
        <ChartCard accentColor="#F6AD55">
          <Flex justify="space-between" align="center" mb="20px" flexWrap="wrap" gap="10px">
            <Box>
              <Text fontSize="lg" fontWeight="700" color={textColor}>{data.chartTitle || "Doanh thu"}</Text>
              <Text fontSize="xs" color={mutedTextColor} mt="2px">Đơn vị: Triệu đồng</Text>
            </Box>
          </Flex>
          <Box h="280px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F6AD55" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F6AD55" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
                <Tooltip content={<CustomLineTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#F6AD55" strokeWidth={3} fill="url(#grad1)" dot={{ r: 5, fill: "#F6AD55", strokeWidth: 2, stroke: dotStrokeColor }} activeDot={{ r: 7, fill: "#F6AD55", stroke: dotStrokeColor, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>

        <ChartCard accentColor="#FC8181">
          <Text fontSize="lg" fontWeight="700" color={textColor} mb="4px">Trạng thái vé</Text>
          <Text fontSize="xs" color={mutedTextColor} mb="20px">Tổng vé trong kỳ</Text>
          <Flex direction="column" align="center">
            <Box h="220px" w="100%">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ticketStatusData} dataKey="value" innerRadius={65} outerRadius={90} paddingAngle={5} startAngle={90} endAngle={-270}>
                    {ticketStatusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} stroke="transparent" />
                    ))}
                  </Pie>
                  <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill={pieTextColor}>{totalTickets}</text>
                  <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill={pieSubTextColor} letterSpacing="2">TỔNG VÉ</text>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Flex>
        </ChartCard>
      </Grid>

      {/* ── ROW 3: BAR + AREA ── */}
      <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap="20px">
        <ChartCard accentColor="#9F7AEA">
          <Flex align="center" gap="10px" mb="4px">
            <Icon as={MdLocalMovies} color="#9F7AEA" boxSize="18px" />
            <Text fontSize="lg" fontWeight="700" color={textColor}>Vé bán theo phim</Text>
          </Flex>
          <Text fontSize="xs" color={mutedTextColor} mb="20px">Top phim đang chiếu</Text>
          <Box h="260px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topMovies || []} barSize={36} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="tickets" radius={[10, 10, 0, 0]} fill="#9F7AEA" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>

        <ChartCard accentColor="#76E4F7">
          <Flex align="center" gap="10px" mb="4px">
            <Icon as={MdTrendingUp} color="#76E4F7" boxSize="18px" />
            <Text fontSize="lg" fontWeight="700" color={textColor}>Lượt đặt vé</Text>
          </Flex>
          <Text fontSize="xs" color={mutedTextColor} mb="20px">Theo thời gian ({period === 'week' ? 'Ngày' : period === 'month' ? 'Ngày' : 'Tháng'})</Text>
          <Box h="260px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#76E4F7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#76E4F7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Area type="monotone" dataKey="tickets" stroke="#76E4F7" strokeWidth={3} fill="url(#gradCyan)" dot={{ r: 4, fill: "#76E4F7", stroke: dotStrokeColor, strokeWidth: 2 }} activeDot={{ r: 6, fill: "#76E4F7", stroke: dotStrokeColor, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>
      </Grid>
    </Box>
  );
}