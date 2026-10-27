import React, { useState, useEffect } from "react";
import {
  Box, Grid, Text, SimpleGrid, Flex, Icon, useColorModeValue, useColorMode,
  useBreakpointValue, Badge, Input, Select, Button, useToast, Spinner,
} from "@chakra-ui/react";
import {
  MdOutlineFactCheck, MdWarningAmber, MdPeopleAlt, MdWifiTethering,
  MdSearch, MdFileDownload, MdDarkMode, MdLightMode, MdHistory
} from "react-icons/md";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart, Cell,
} from "recharts";
import AuditLogApi from "api/admin/AuditLogApi";

// Import các thành phần đã tách
import { OR, ORL, ACTION_TYPES, fadeUp } from "./constants";
import KpiCard from "./components/shared/KpiCard";
import ChartCard from "./components/shared/ChartCard";
import LogDetailModal from "./components/LogDetailModal";
import MobileLogCard from "./components/MobileLogCard";
import AuditLogTable from "./components/AuditLogTable";

export default function NhatKyHeThong() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterRange, setFilterRange] = useState("7 days");

  const [logs, setLogs] = useState([]);
  const [kpi, setKpi] = useState({ totalToday: 0, abnormal: 0, activeUsers: 0, ipMonitoring: 0 });
  const [activityByHour, setActivityByHour] = useState([]);
  const [actionsByType, setActionsByType] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Hàm gọi API
  const fetchLogs = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const res = await AuditLogApi.getLogs({ search, action: filterAction, status: filterStatus, range: filterRange });
      const result = res.data?.data || res.data || res;
      setLogs(result.logs || []);
      setKpi(result.kpi || { totalToday: 0, abnormal: 0, activeUsers: 0, ipMonitoring: 0 });
      setActivityByHour(result.activityByHour || []);
      setActionsByType(result.actionsByType || []);
    } catch (error) {
      console.error("❌ Lỗi tải nhật ký:", error);
      if (!isBackground) {
        toast({ title: "Lỗi tải dữ liệu", description: "Không thể tải nhật ký hệ thống", status: "error", duration: 3000 });
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // Tải lần đầu & khi thay đổi bộ lọc (Debounce 500ms)
  useEffect(() => {
    const timer = setTimeout(() => { fetchLogs(false); }, 500);
    return () => clearTimeout(timer);
  }, [search, filterAction, filterStatus, filterRange]);

  // Tự động cập nhật mỗi 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!search) fetchLogs(true); // Chỉ auto update nếu không đang gõ tìm kiếm
    }, 30000);
    return () => clearInterval(interval);
  }, [search]);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      toast({ title: "Xuất file thành công", status: "success", duration: 2000 });
    }, 1400);
  };

  return (
    <Box pt={{ base: "120px", md: "80px" }} px={{ base: "16px", md: "0" }} minH="100vh">
      <LogDetailModal log={detailLog} onClose={() => setDetailLog(null)} isDark={isDark} />

      {/* Header */}
      <Flex align="flex-start" justify="space-between" mb="28px" flexWrap="wrap" gap="12px">
        <Box>
          <Flex align="center" gap="10px" mb="6px">
            <Box w="3px" h="28px" borderRadius="2px" bgGradient={`linear(to-b, ${OR}, ${ORL})`} />
            <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color={textColor} letterSpacing="-0.5px">Nhật ký hệ thống</Text>
          </Flex>
          <Text color={subTextColor} fontSize="sm" pl="13px">Theo dõi toàn bộ hoạt động & phát hiện thao tác bất thường • Chỉ Admin</Text>
        </Box>
        <Flex align="center" gap="10px" flexWrap="wrap">
          <Flex align="center" gap="8px" bg={pillBg} border="1px solid" borderColor={pillBorder} borderRadius="12px" px="14px" py="8px">
            <Box w="7px" h="7px" borderRadius="full" bg="#48BB78" boxShadow="0 0 8px #48BB78" />
            <Text fontSize="xs" color={liveTextColor} fontWeight="600">Ghi log thời gian thực</Text>
          </Flex>
          <Button h="38px" w="38px" minW="38px" p="0" borderRadius="10px" bg={isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"} color={isDark ? "#e2e8f0" : "#475569"} border={isDark ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e2e8f0"} onClick={toggleColorMode}>
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="16px" />
          </Button>
          <Button h="38px" px="16px" borderRadius="10px" fontWeight="700" fontSize="12px" color="white" bg={`linear-gradient(135deg,${OR},${ORL})`} boxShadow="0 3px 12px rgba(234,88,12,.28)" _hover={{ boxShadow: "0 6px 20px rgba(234,88,12,.4)", transform: "translateY(-1px)" }} _active={{ transform: "translateY(0)" }} transition="all .2s" isLoading={exporting} loadingText="Đang export..." leftIcon={<Icon as={MdFileDownload} boxSize="14px" />} onClick={handleExport}>Export log</Button>
        </Flex>
      </Flex>

      {/* KPI */}
      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="16px" mb="20px">
        <KpiCard icon={MdOutlineFactCheck} label="Tổng log hôm nay" value={kpi.totalToday} iconColor={OR} trend={14} trendLabel="so với hôm qua" />
        <KpiCard icon={MdWarningAmber} label="Thao tác bất thường" value={kpi.abnormal} iconColor="#dc2626" pulse trendLabel="cần kiểm tra ngay" />
        <KpiCard icon={MdPeopleAlt} label="Người dùng hoạt động" value={kpi.activeUsers} iconColor="#76E4F7" trend={6} trendLabel="trong 24 giờ qua" />
        <KpiCard icon={MdWifiTethering} label="IP giám sát" value={kpi.ipMonitoring} iconColor="#9F7AEA" trendLabel="phiên đang theo dõi" />
      </SimpleGrid>

      {/* Charts */}
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
                <defs><linearGradient id="gradOrangeLog" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={OR} stopOpacity={0.28} /><stop offset="95%" stopColor={OR} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <Box bg={tooltipBg} border={`1px solid ${tooltipBorder}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
                      <Text fontSize="xs" color={tooltipLabelColor} mb="4px" fontWeight="600">Lúc {label}</Text>
                      <Text fontSize="sm" fontWeight="700" color={OR}>{payload[0].value} thao tác</Text>
                    </Box>
                  );
                }} />
                <Area type="monotone" dataKey="actions" stroke={OR} strokeWidth={3} fill="url(#gradOrangeLog)" dot={{ r: 4, fill: OR, stroke: dotStrokeColor, strokeWidth: 2 }} activeDot={{ r: 6, fill: OR, stroke: dotStrokeColor, strokeWidth: 2 }} />
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
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={90} tick={{ fill: axisTickColor, fontSize: 11.5, fontWeight: 600 }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <Box bg={tooltipBg} border={`1px solid ${tooltipBorder}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
                      <Text fontSize="xs" color={tooltipLabelColor} mb="4px">{label}</Text>
                      <Text fontSize="sm" fontWeight="700" color={payload[0].payload.color}>{payload[0].value} log</Text>
                    </Box>
                  );
                }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {actionsByType.map((entry, i) => <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 2px 8px ${entry.color}50)` }} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </ChartCard>
      </Grid>

      {/* Table */}
      <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" overflow="hidden" boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")} sx={{ animation: `${fadeUp} .4s ease .1s both` }}>
        <Box p={{ base: "16px", md: "20px 22px" }} borderBottom="1px solid" borderColor={cardBorder}>
          <Flex align="center" justify="space-between" mb="14px" flexWrap="wrap" gap="10px">
            <Flex align="center" gap="8px">
              <Icon as={MdHistory} boxSize="16px" color={OR} />
              <Text fontWeight="800" fontSize="15px" color={textColor}>Nhật ký hoạt động</Text>
              <Badge bg={pillBg} color={OR} border={`1px solid ${pillBorder}`} borderRadius="6px" px="8px" py="1px" fontSize="11px" fontWeight="700">{logs.length} bản ghi</Badge>
            </Flex>
          </Flex>
          <Grid templateColumns={{ base: "1fr", md: "1fr 170px 160px 150px" }} gap="10px">
            <Box position="relative">
              <Icon as={MdSearch} position="absolute" left="12px" top="50%" transform="translateY(-50%)" boxSize="15px" color={mutedTextColor} zIndex="1" />
              <Input pl="34px" h="40px" fontSize="13px" fontWeight="500" placeholder="Tìm theo người dùng, IP, nội dung..." bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" color={textColor} _placeholder={{ color: mutedTextColor }} _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }} _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s" value={search} onChange={e => setSearch(e.target.value)} />
            </Box>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor} bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }} _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s" value={filterAction} onChange={e => setFilterAction(e.target.value)}>
              <option value="Tất cả">Tất cả thao tác</option>
              {ACTION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor} bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }} _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Bình thường">Bình thường</option>
              <option value="Bất thường">Bất thường</option>
            </Select>
            <Select h="40px" fontSize="12.5px" fontWeight="600" color={textColor} bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="10px" _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }} _hover={{ border: `1.5px solid ${OR}` }} transition="all .2s" value={filterRange} onChange={e => setFilterRange(e.target.value)}>
              <option value="today">Hôm nay</option>
              <option value="7 days">7 ngày qua</option>
              <option value="30 days">30 ngày qua</option>
            </Select>
          </Grid>
        </Box>

        <Box p={{ base: "12px", md: "10px" }}>
          {isMobile ? (
            <Flex direction="column" gap="8px">
              {loading ? (
                <Flex direction="column" align="center" justify="center" py="40px" color={mutedTextColor}>
                  <Spinner size="xl" color={OR} thickness="4px" mb="10px" />
                  <Text fontSize="13px" fontWeight="600">Đang tải nhật ký...</Text>
                </Flex>
              ) : logs.length === 0 ? (
                <Flex direction="column" align="center" justify="center" py="40px" color={mutedTextColor}>
                  <Icon as={MdHistory} boxSize="32px" mb="8px" />
                  <Text fontSize="13px" fontWeight="600">Không tìm thấy bản ghi nào</Text>
                </Flex>
              ) : (
                logs.map((l, i) => <MobileLogCard key={l.id} log={l} index={i} onView={setDetailLog} isDark={isDark} />)
              )}
            </Flex>
          ) : (
            <AuditLogTable logs={logs} loading={loading} onViewLog={setDetailLog} isMobile={isMobile} isDark={isDark} />
          )}
        </Box>
      </Box>
    </Box>
  );
}