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
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  Avatar,
  AvatarGroup,
  Progress,
} from "@chakra-ui/react";
import React from "react";
import {
  MdLocalActivity,
  MdAttachMoney,
  MdPeople,
  MdMovie,
  MdTrendingUp,
  MdEventSeat,
  MdStar,
  MdCalendarToday,
} from "react-icons/md";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Dữ liệu mẫu ────────────────────────────────────────────────────────────
const revenueData = [
  { day: "T2", revenue: 42, tickets: 185 },
  { day: "T3", revenue: 38, tickets: 162 },
  { day: "T4", revenue: 55, tickets: 241 },
  { day: "T5", revenue: 47, tickets: 203 },
  { day: "T6", revenue: 78, tickets: 342 },
  { day: "T7", revenue: 96, tickets: 418 },
  { day: "CN", revenue: 88, tickets: 381 },
];

const genreData = [
  { name: "Hành động", value: 35, color: "#E53E3E" },
  { name: "Tình cảm", value: 25, color: "#ED8936" },
  { name: "Hoạt hình", value: 20, color: "#ECC94B" },
  { name: "Kinh dị", value: 12, color: "#9F7AEA" },
  { name: "Khác", value: 8, color: "#4A5568" },
];

const topMovies = [
  { title: "Avengers: Doomsday", tickets: 1842, rating: 9.2, fill: 92 },
  { title: "Lật Mặt 8", tickets: 1423, rating: 8.7, fill: 78 },
  { title: "Doraemon 2026", tickets: 1205, rating: 8.9, fill: 65 },
  { title: "Ma Da", tickets: 987, rating: 7.8, fill: 54 },
];

const recentBookings = [
  { name: "Nguyễn Văn A", movie: "Avengers: Doomsday", seats: "F5, F6", time: "19:30", amount: "180.000đ", status: "confirmed" },
  { name: "Trần Thị B", movie: "Lật Mặt 8", seats: "C3", time: "15:00", amount: "90.000đ", status: "confirmed" },
  { name: "Lê Hoàng C", movie: "Doraemon 2026", seats: "D7, D8, D9", time: "10:00", amount: "270.000đ", status: "pending" },
  { name: "Phạm Thu D", movie: "Ma Da", seats: "G2", time: "21:00", amount: "90.000đ", status: "confirmed" },
  { name: "Hoàng Minh E", movie: "Avengers: Doomsday", seats: "A1, A2", time: "22:00", amount: "180.000đ", status: "cancelled" },
];

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
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.100", "gray.700");
  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="20px"
      p={5}
      position="relative"
      overflow="hidden"
      _hover={{ transform: "translateY(-3px)", boxShadow: `0 12px 40px rgba(0,0,0,0.12)` }}
      transition="all 0.25s ease"
      boxShadow="0 2px 12px rgba(0,0,0,0.06)"
    >
      {/* Accent glow góc trên phải */}
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
          bg={`${color}18`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} w={5} h={5} color={color} />
        </Box>
        <Badge
          colorScheme={growth >= 0 ? "green" : "red"}
          borderRadius="full"
          px={2}
          fontSize="xs"
          fontWeight="bold"
        >
          {growth >= 0 ? "▲" : "▼"} {Math.abs(growth)}%
        </Badge>
      </HStack>
      <Text fontSize="2xl" fontWeight="800" color={useColorModeValue("gray.800", "white")} lineHeight={1}>
        {value}
      </Text>
      <Text fontSize="sm" color="gray.500" mt={1}>{label}</Text>
      <Text fontSize="xs" color="gray.400" mt={1}>{sub}</Text>
    </Box>
  );
};

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function CinemaDashboard() {
  const bg = useColorModeValue("#F4F7FE", "#0B1437");
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.100", "gray.700");
  const textMain = useColorModeValue("gray.800", "white");
  const textSub = useColorModeValue("gray.500", "gray.400");

  const statusColor = {
    confirmed: { bg: "green.50", color: "green.600", label: "Đã xác nhận" },
    pending:   { bg: "orange.50", color: "orange.500", label: "Chờ xử lý" },
    cancelled: { bg: "red.50",   color: "red.500",    label: "Đã huỷ" },
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: 4, md: 6 }} bg={bg} minH="100vh">

      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color={textMain}>
            Tổng quan hệ thống 🎬
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
        <KpiCard icon={MdAttachMoney}  label="Doanh thu hôm nay" value="88tr đ"  sub="So với hôm qua"    growth={12.4} color="#E53E3E" />
        <KpiCard icon={MdLocalActivity} label="Vé đã bán"         value="381"    sub="Hôm nay"           growth={8.1}  color="#ED8936" />
        <KpiCard icon={MdPeople}        label="Khách hàng mới"    value="47"     sub="7 ngày qua"        growth={-3.2} color="#9F7AEA" />
        <KpiCard icon={MdEventSeat}     label="Tỷ lệ lấp đầy"    value="76%"    sub="Trung bình rạp"    growth={5.6}  color="#38B2AC" />
      </SimpleGrid>

      {/* Charts Row 1 */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={5} mb={5}>

        {/* Biểu đồ doanh thu – chiếm 2/3 */}
        <Box
          gridColumn={{ lg: "span 2" }}
          bg={cardBg}
          border="1px solid"
          borderColor={border}
          borderRadius="20px"
          p={5}
          boxShadow="0 2px 12px rgba(0,0,0,0.06)"
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
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#A0AEC0" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#A0AEC0" }} axisLine={false} tickLine={false} />
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
          boxShadow="0 2px 12px rgba(0,0,0,0.06)"
        >
          <Text fontWeight="700" fontSize="md" color={textMain} mb={1}>Thể loại phim</Text>
          <Text fontSize="xs" color={textSub} mb={4}>Tỷ lệ vé theo thể loại</Text>
          <Flex justify="center" mb={4}>
            <PieChart width={150} height={150}>
              <Pie
                data={genreData}
                cx={70} cy={70}
                innerRadius={42}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {genreData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </Flex>
          <VStack spacing={2} align="stretch">
            {genreData.map((g, i) => (
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
          boxShadow="0 2px 12px rgba(0,0,0,0.06)"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="700" fontSize="md" color={textMain}>Top phim đang chiếu</Text>
            <Icon as={MdMovie} color="red.400" w={5} h={5} />
          </Flex>
          <VStack spacing={4} align="stretch">
            {topMovies.map((m, i) => (
              <Box key={i}>
                <Flex justify="space-between" mb={1}>
                  <HStack spacing={2}>
                    <Text
                      fontSize="xs"
                      fontWeight="800"
                      color={i === 0 ? "red.500" : "gray.400"}
                      w="16px"
                    >
                      #{i + 1}
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color={textMain} noOfLines={1}>
                      {m.title}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={MdStar} w={3} h={3} color="yellow.400" />
                    <Text fontSize="xs" fontWeight="700" color="yellow.500">{m.rating}</Text>
                  </HStack>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Progress
                    value={m.fill}
                    size="xs"
                    colorScheme={i === 0 ? "red" : "orange"}
                    borderRadius="full"
                    flex={1}
                    mr={3}
                    bg={useColorModeValue("gray.100", "gray.700")}
                  />
                  <Text fontSize="xs" color={textSub} flexShrink={0}>
                    {m.tickets.toLocaleString()} vé
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Lịch đặt vé gần đây — chiếm 2/3 */}
        <Box
          gridColumn={{ lg: "span 2" }}
          bg={cardBg}
          border="1px solid"
          borderColor={border}
          borderRadius="20px"
          p={5}
          boxShadow="0 2px 12px rgba(0,0,0,0.06)"
          overflowX="auto"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="700" fontSize="md" color={textMain}>Đặt vé gần đây</Text>
            <Text fontSize="xs" color="red.500" fontWeight="600" cursor="pointer" _hover={{ textDecor: "underline" }}>
              Xem tất cả →
            </Text>
          </Flex>

          {/* Header */}
          <SimpleGrid columns={5} gap={2} mb={2} px={2}>
            {["Khách hàng", "Phim", "Ghế", "Giờ chiếu", "Trạng thái"].map((h) => (
              <Text key={h} fontSize="10px" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.5px">
                {h}
              </Text>
            ))}
          </SimpleGrid>
          <Divider mb={2} borderColor={border} />

          <VStack spacing={0} align="stretch">
            {recentBookings.map((b, i) => (
              <Box
                key={i}
                px={2}
                py={3}
                borderRadius="10px"
                _hover={{ bg: useColorModeValue("gray.50", "whiteAlpha.50") }}
                transition="background 0.15s"
              >
                <SimpleGrid columns={5} gap={2} alignItems="center">
                  <Text fontSize="sm" fontWeight="600" color={textMain} noOfLines={1}>{b.name}</Text>
                  <Text fontSize="xs" color={textSub} noOfLines={1}>{b.movie}</Text>
                  <Text fontSize="xs" color={textSub}>{b.seats}</Text>
                  <Text fontSize="xs" color={textSub}>{b.time}</Text>
                  <Badge
                    bg={statusColor[b.status].bg}
                    color={statusColor[b.status].color}
                    fontSize="10px"
                    fontWeight="700"
                    px={2}
                    py="2px"
                    borderRadius="full"
                    w="fit-content"
                  >
                    {statusColor[b.status].label}
                  </Badge>
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        </Box>
      </SimpleGrid>

    </Box>
  );
}