
import React, { useState, useEffect } from "react";
import {
  Box, Grid, Text, SimpleGrid, Flex, Icon, useColorModeValue, Spinner, ButtonGroup, Button
} from "@chakra-ui/react";
import {
  MdAttachMoney, MdConfirmationNumber, MdAccessTime, MdEventSeat,
} from "react-icons/md";
import DashboardApi from "api/admin/DashboardApi";

// Import các thành phần đã tách
import KpiCard from "./components/shared/KpiCard";
import RevenueChart from "./components/RevenueChart";
import TicketStatusChart from "./components/TicketStatusChart";
import TopMoviesChart from "./components/TopMoviesChart";
import TicketSalesChart from "./components/TicketSalesChart";

export default function Thongke() {
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const pillBg = useColorModeValue("rgba(246,173,85,0.08)", "rgba(246,173,85,0.1)");
  const pillBorder = useColorModeValue("rgba(246,173,85,0.3)", "rgba(246,173,85,0.2)");
  const liveTextColor = useColorModeValue("gray.600", "whiteAlpha.700");

  const [period, setPeriod] = useState("week"); 
  const [data, setData] = useState({
    chartTitle: "Doanh thu 7 ngày qua",
    kpi: { revenue: "0", tickets: 0, newUsers: 0, fillRate: "0" },
    revenueChart: [],
    topMovies: [],
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
        <RevenueChart data={data.revenueChart} title={data.chartTitle} />
        <TicketStatusChart tickets={data.kpi.tickets} />
      </Grid>

      {/* ── ROW 3: BAR + AREA ── */}
      <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap="20px">
        <TopMoviesChart data={data.topMovies} />
        <TicketSalesChart data={data.revenueChart} period={period} />
      </Grid>
    </Box>
  );
}