import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Icon,
  useColorModeValue,
  Badge,
  HStack,
  VStack,
  Progress,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  MdLocalActivity,
  MdAttachMoney,
  MdPeople,
  MdMovie,
  MdEventSeat,
  MdStar,
  MdCalendarToday,
} from "react-icons/md";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DashboardApi from "api/admin/DashboardApi";

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        bg="gray.900"
        border="1px solid"
        borderColor="red.500"
        borderRadius="10px"
        px={3}
        py={2}
        boxShadow="0 0 20px rgba(229,62,62,0.3)"
      >
        <Text color="gray.400" fontSize="xs" mb={1}>{label}</Text>
        {payload.map((p, i) => (
          <Text key={i} color="white" fontSize="sm" fontWeight="bold">
            {p.name === "revenue" ? `${p.value}tr đ` : `${p.value} vé`}
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

// ─── KPI Card ────────────────────────────────────────────────────────────────
const KpiCard = ({ icon, label, value, sub, growth, color }) => {
  const bg = useColorModeValue("#EBF4FF", "#1A365D");
  const border = useColorModeValue("#CBD5E0", "#2D3748");
  const textColor = useColorModeValue("gray.800", "white");
  const subColor = useColorModeValue("gray.600", "gray.400");
  const iconBg = useColorModeValue(`${color}18`, `${color}30`);
  
  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="20px"
      p={5}
      position="relative"
      overflow="hidden"
      _hover={{ 
        transform: "translateY(-3px)", 
        boxShadow: useColorModeValue(
          `0 12px 40px rgba(49,130,206,0.15)`,
          `0 12px 40px rgba(49,130,206,0.25)`
        )
      }}
      transition="all 0.25s ease"
      boxShadow={useColorModeValue(
        "0 2px 12px rgba(0,0,0,0.06)",
        "0 2px 12px rgba(0,0,0,0.3)"
      )}
    >
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        w="80px"
        h="80px"
        borderRadius="full"
        bg={`${color}22`}
        filter="blur(20px)"
      />
      <HStack justify="space-between" mb={3}>
        <Box
          w="44px"
          h="44px"
          borderRadius="12px"
          bg={iconBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} w={5} h={5} color={color} />
        </Box>
        {growth !== undefined && (
          <Badge
            colorScheme={growth >= 0 ? "green" : "red"}
            borderRadius="full"
            px={2}
            fontSize="xs"
            fontWeight="bold"
          >
            {growth >= 0 ? "▲" : "▼"} {Math.abs(growth)}%
          </Badge>
        )}
      </HStack>
      <Text fontSize="2xl" fontWeight="800" color={textColor} lineHeight={1}>
        {value}
      </Text>
      <Text fontSize="sm" color={subColor} mt={1}>{label}</Text>
      <Text fontSize="xs" color={subColor} mt={1}>{sub}</Text>
    </Box>
  );
};

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function CinemaDashboard() {
  // ⭐ 1. KHAI BÁO TẤT CẢ CÁC HOOK Ở TRÊN CÙNG
  const bg = useColorModeValue("#EBF4FF", "#0B1437");
  const cardBg = useColorModeValue("#EBF4FF", "#1A365D");
  const border = useColorModeValue("#CBD5E0", "#2D3748");
  const textMain = useColorModeValue("gray.800", "white");
  const textSub = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("whiteAlpha.300", "whiteAlpha.100");

  const [data, setData] = useState({
    kpi: { revenue: "0đ", tickets: 0, newUsers: 0, fillRate: "0%" },
    revenueChart: [],
    genreChart: [],
    topMovies: [],
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  // Khai báo màu cho status ở đây
  const greenBg = useColorModeValue("green.50", "green.900");
  const greenColor = useColorModeValue("green.600", "green.300");
  const orangeBg = useColorModeValue("orange.50", "orange.900");
  const orangeColor = useColorModeValue("orange.500", "orange.300");
  const redBg = useColorModeValue("red.50", "red.900");
  const redColor = useColorModeValue("red.500", "red.300");
  
  const progressBg = useColorModeValue("gray.200", "gray.700");
  const chartGridColor = useColorModeValue("rgba(0,0,0,0.04)", "rgba(255,255,255,0.04)");
  const chartTickColor = useColorModeValue("#A0AEC0", "#4A5568");

  // ⭐ 2. GỌI API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await DashboardApi.getStatistics();
        const result = response.data?.data || response.data || response;
        setData(result);
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ⭐ 3. KHAI BÁO BIẾN STATUS (Sau khi đã có màu ở trên)
  const statusColor = {
    confirmed: { bg: greenBg, color: greenColor, label: "Đã xác nhận" },
    pending: { bg: orangeBg, color: orangeColor, label: "Chờ xử lý" },
    cancelled: { bg: redBg, color: redColor, label: "Đã huỷ" },
  };

  // ⭐ 4. BÂY GIỜ MỚI ĐƯỢC PHÉP RETURN SỚM (if loading)
  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh" bg={bg} flexDir="column" gap={4}>
        <Spinner size="xl" color="red.500" thickness="4px" />
        <Text color={textSub} fontWeight="600">Đang tải dữ liệu tổng quan...</Text>
      </Flex>
    );
  }

  if (!data || !data.kpi) {
    return (
      <Flex justify="center" align="center" h="100vh" bg={bg}>
        <Text color="red.500" fontWeight="bold">Không thể tải dữ liệu. Vui lòng thử lại!</Text>
      </Flex>
    );
  }

  const maxTicketCount = data.topMovies.length > 0 ? data.topMovies[0].tickets : 1;

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: 4, md: 6 }} bg={bg} minH="100vh">

      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color={textMain}>
            Tổng quan hệ thống 
          </Text>
          <HStack mt={1} spacing={2}>
            <Icon as={MdCalendarToday} w={3} h={3} color="gray.400" />
            <Text fontSize="xs" color={textSub}>
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </Text>
          </HStack>
        </Box>
        <Badge
          bg="red.500"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          boxShadow="0 4px 12px rgba(229,62,62,0.4)"
        >
          🔴 LIVE
        </Badge>
      </Flex>

      {/* KPI Row */}
      <SimpleGrid columns={{ base: 2, md: 2, lg: 4 }} gap={4} mb={6}>
        <KpiCard icon={MdAttachMoney}  label="Doanh thu hôm nay" value={data.kpi.revenue}  sub="So với hôm qua"    growth={12.4} color="#E53E3E" />
        <KpiCard icon={MdLocalActivity} label="Vé đã bán"         value={data.kpi.tickets}  sub="Hôm nay"           growth={8.1}  color="#ED8936" />
        <KpiCard icon={MdPeople}        label="Khách hàng mới"    value={data.kpi.newUsers} sub="7 ngày qua"        growth={-3.2} color="#9F7AEA" />
        <KpiCard icon={MdEventSeat}     label="Tỷ lệ lấp đầy"     value={data.kpi.fillRate} sub="Trung bình rạp"    growth={5.6}  color="#38B2AC" />
      </SimpleGrid>

      {/* Charts Row 1 */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={5} mb={5}>

        {/* Biểu đồ doanh thu */}
        <Box
          gridColumn={{ lg: "span 2" }}
          bg={cardBg}
          border="1px solid"
          borderColor={border}
          borderRadius="20px"
          p={5}
          boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "0 2px 12px rgba(0,0,0,0.3)")}
        >
          <Flex justify="space-between" align="center" mb={5}>
            <Box>
              <Text fontWeight="700" fontSize="md" color={textMain}>Doanh thu & Vé bán — 7 ngày</Text>
              <Text fontSize="xs" color={textSub} mt="2px">Đơn vị doanh thu: triệu đồng</Text>
            </Box>
            <HStack spacing={4} fontSize="xs" color={textSub}>
              <HStack spacing={1}>
                <Box w={2} h={2} borderRadius="full" bg="red.400" />
                <Text>Doanh thu</Text>
              </HStack>
              <HStack spacing={1}>
                <Box w={2} h={2} borderRadius="full" bg="orange.300" />
                <Text>Vé bán</Text>
              </HStack>
            </HStack>
          </Flex>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.revenueChart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E53E3E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#E53E3E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTix" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ED8936" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ED8936" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: chartTickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: chartTickColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#E53E3E" strokeWidth={2.5} fill="url(#gradRev)" dot={false} activeDot={{ r: 5, fill: "#E53E3E" }} />
              <Area type="monotone" dataKey="tickets" name="tickets" stroke="#ED8936" strokeWidth={2} fill="url(#gradTix)" dot={false} activeDot={{ r: 4, fill: "#ED8936" }} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Pie — thể loại phim */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={border}
          borderRadius="20px"
          p={5}
          boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "0 2px 12px rgba(0,0,0,0.3)")}
        >
          <Text fontWeight="700" fontSize="md" color={textMain} mb={1}>Thể loại phim</Text>
          <Text fontSize="xs" color={textSub} mb={4}>Tỷ lệ vé theo thể loại</Text>
          <Flex justify="center" mb={4}>
            {data.genreChart.length > 0 ? (
              <PieChart width={150} height={150}>
                <Pie data={data.genreChart} cx={70} cy={70} innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {data.genreChart.map((entry, i) => (
                    <Cell key={i} fill={entry.color || "#CBD5E0"} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <Text fontSize="sm" color={textSub}>Chưa có dữ liệu</Text>
            )}
          </Flex>
          <VStack spacing={2} align="stretch">
            {data.genreChart.map((g, i) => (
              <HStack key={i} justify="space-between">
                <HStack spacing={2}>
                  <Box w="8px" h="8px" borderRadius="2px" bg={g.color} flexShrink={0} />
                  <Text fontSize="xs" color={textSub}>{g.name}</Text>
                </HStack>
                <Text fontSize="xs" fontWeight="700" color={textMain}>{g.value}%</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Charts Row 2 */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={5} mb={5}>

        {/* Top phim */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={border}
          borderRadius="20px"
          p={5}
          boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "0 2px 12px rgba(0,0,0,0.3)")}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="700" fontSize="md" color={textMain}>Top phim đang chiếu</Text>
            <Icon as={MdMovie} color="red.400" w={5} h={5} />
          </Flex>
          <VStack spacing={4} align="stretch">
            {data.topMovies.length > 0 ? data.topMovies.map((m, i) => (
              <Box key={i}>
                <Flex justify="space-between" mb={1}>
                  <HStack spacing={2}>
                    <Text fontSize="xs" fontWeight="800" color={i === 0 ? "red.500" : "gray.400"} w="16px">
                      #{i + 1}
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color={textMain} noOfLines={1}>
                      {m.title}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={MdStar} w={3} h={3} color="yellow.400" />
                    <Text fontSize="xs" fontWeight="700" color="yellow.500">9.0</Text>
                  </HStack>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Progress
                    value={(m.tickets / maxTicketCount) * 100}
                    size="xs"
                    colorScheme={i === 0 ? "red" : "orange"}
                    borderRadius="full"
                    flex={1}
                    mr={3}
                    bg={progressBg}
                  />
                  <Text fontSize="xs" color={textSub} flexShrink={0}>
                    {m.tickets.toLocaleString()} vé
                  </Text>
                </Flex>
              </Box>
            )) : (
              <Text fontSize="sm" color={textSub} textAlign="center">Chưa có dữ liệu</Text>
            )}
          </VStack>
        </Box>

        {/* Lịch đặt vé gần đây */}
        <Box
          gridColumn={{ lg: "span 2" }}
          bg={cardBg}
          border="1px solid"
          borderColor={border}
          borderRadius="20px"
          p={5}
          boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "0 2px 12px rgba(0,0,0,0.3)")}
          overflowX="auto"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="700" fontSize="md" color={textMain}>Đặt vé gần đây</Text>
            <Text fontSize="xs" color="red.500" fontWeight="600" cursor="pointer" _hover={{ textDecor: "underline" }}>
              Xem tất cả →
            </Text>
          </Flex>

          <SimpleGrid columns={5} gap={2} mb={2} px={2}>
            {["Khách hàng", "Phim", "Số tiền", "Trạng thái", "Ngày"].map((h) => (
              <Text key={h} fontSize="10px" fontWeight="700" color={textSub} textTransform="uppercase" letterSpacing="0.5px">
                {h}
              </Text>
            ))}
          </SimpleGrid>
          <Divider mb={2} borderColor={border} />

          <VStack spacing={0} align="stretch">
            {data.recentBookings.length > 0 ? data.recentBookings.map((b, i) => {
              const status = statusColor[b.status] || statusColor.pending;
              return (
                <Box
                  key={i}
                  px={2}
                  py={3}
                  borderRadius="10px"
                  _hover={{ bg: hoverBg }}
                  transition="background 0.15s"
                >
                  <SimpleGrid columns={5} gap={2} alignItems="center">
                    <Text fontSize="sm" fontWeight="600" color={textMain} noOfLines={1}>{b.name}</Text>
                    <Text fontSize="xs" color={textSub} noOfLines={1}>{b.movie}</Text>
                    <Text fontSize="sm" fontWeight="700" color="green.500">{b.amount}</Text>
                    <Badge bg={status.bg} color={status.color} fontSize="10px" fontWeight="700" px={2} py="2px" borderRadius="full" w="fit-content">
                      {status.label}
                    </Badge>
                    <Text fontSize="xs" color={textSub}>Hôm nay</Text>
                  </SimpleGrid>
                </Box>
              );
            }) : (
              <Text fontSize="sm" color={textSub} textAlign="center" py={4}>Chưa có đơn hàng nào</Text>
            )}
          </VStack>
        </Box>
      </SimpleGrid>

    </Box>
  );
}