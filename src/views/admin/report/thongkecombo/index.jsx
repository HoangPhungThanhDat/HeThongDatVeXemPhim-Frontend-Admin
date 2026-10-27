
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Text, Flex, SimpleGrid, Icon, useColorMode,
  Select, Button, Badge, useToast, Skeleton
} from '@chakra-ui/react';
import {
  MdFastfood, MdRefresh, MdCalendarToday, MdLocalOffer,
  MdReceipt, MdMonetizationOn, MdFoodBank
} from 'react-icons/md';
import ComboStatisticApi from 'api/admin/ComboStatisticApi';

// Import các thành phần đã tách
import { 
  fadeUp, pulse, DARK_THEME, DARK_ACCENT, DARK_ACCENT_LIGHT, DARK_ACCENT_SHADOW, 
  OR, ORL, ORPL, ORSW, BLUE, PURPLE, GREEN, getColors 
} from './constants';
import StatCard from './components/shared/StatCard';
import CategoryCard from './components/shared/CategoryCard';
import CategoryPieChart from './components/CategoryPieChart';
import RevenueChart from './components/RevenueChart';
import TopProductsTable from './components/TopProductsTable';

export default function Thongkecombo() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = getColors(isDark);
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7days');
  const [comboStats, setComboStats] = useState({ totalRevenue: 0, totalOrders: 0, totalItems: 0, avgOrderValue: 0, growth: 0 });
  const [categories, setCategories] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await ComboStatisticApi.getStatistics(period);
      const data = res.data?.data || res.data || res;
      
      setComboStats(data.stats);
      setCategories(data.categories);
      setTopProducts(data.topProducts);
      setDailyRevenue(data.dailyRevenue);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
      toast({ title: 'Lỗi tải dữ liệu', description: err.response?.data?.message || 'Vui lòng thử lại', status: 'error', duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box pt={{ base: '120px', md: '80px' }} bg={colors.bgPage} minH="100vh" px="20px">
        <Skeleton height="40px" mb="20px" />
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing="16px" mb="20px">{[1, 2, 3, 4].map((i) => <Skeleton key={i} height="140px" borderRadius="20px" />)}</SimpleGrid>
        <Skeleton height="350px" borderRadius="20px" />
      </Box>
    );
  }

  return (
    <Box pt={{ base: '120px', md: '80px' }} bg={colors.bgPage} minH="100vh" px="6px" pb="40px">
      {/* ── Header ── */}
      <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} mb="24px" gap="16px" sx={{ animation: `${fadeUp} .5s ease both` }}>
        <Box>
          <Flex align="center" gap="14px" mb="4px">
            <Box w="52px" h="52px" borderRadius="14px" bg={isDark ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : `linear-gradient(135deg, ${OR}, ${ORL})`} display="flex" alignItems="center" justifyContent="center" boxShadow={isDark ? `0 8px 24px ${DARK_ACCENT_SHADOW}` : `0 8px 24px ${ORSW}`} sx={{ animation: `${pulse} 3s ease infinite` }}>
              <Icon as={MdFastfood} boxSize="24px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: '22px', md: '28px' }} fontWeight="800" color={colors.textPrimary} letterSpacing="-0.5px">Thống kê Combo Bắp Nước</Text>
              <Text color={colors.textMuted} fontSize="13px" fontWeight="500"><Icon as={MdCalendarToday} boxSize="14px" mr="6px" />Phân tích doanh thu và hiệu quả bán hàng</Text>
            </Box>
          </Flex>
        </Box>

        <Flex gap="10px" align="center" flexWrap="wrap">
          <Select w="170px" h="42px" fontSize="13px" fontWeight="600" bg={isDark ? DARK_THEME.inputBg : '#f8fafc'} border={`1px solid ${isDark ? DARK_THEME.inputBorder : '#e8edf3'}`} borderRadius="12px" color={colors.textPrimary} value={period} onChange={(e) => setPeriod(e.target.value)} _focus={{ border: `1.5px solid ${isDark ? DARK_ACCENT : OR}`, boxShadow: isDark ? `0 0 0 3px ${DARK_ACCENT_SHADOW}` : `0 0 0 3px ${ORSW}` }} _hover={{ border: `1px solid ${isDark ? DARK_ACCENT : OR}` }}>
            <option value="7days">📅 7 ngày qua</option>
            <option value="30days">📅 30 ngày qua</option>
            <option value="90days">📅 90 ngày qua</option>
            <option value="thisMonth">📅 Tháng này</option>
            <option value="lastMonth">📅 Tháng trước</option>
          </Select>
          <Button h="42px" px="20px" borderRadius="12px" fontWeight="600" fontSize="13px" bg={isDark ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : `linear-gradient(135deg, ${OR}, ${ORL})`} color="white" boxShadow={isDark ? `0 4px 14px ${DARK_ACCENT_SHADOW}` : `0 4px 14px ${ORSW}`} _hover={{ boxShadow: isDark ? `0 8px 24px ${DARK_ACCENT_SHADOW}` : `0 8px 24px ${ORSW}`, transform: 'translateY(-2px)' }} _active={{ transform: 'translateY(0)' }} transition="all .2s" leftIcon={<Icon as={MdRefresh} />} onClick={loadData}>Làm mới</Button>
        </Flex>
      </Flex>

      {/* ── Stats ── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="16px" mb="24px">
        <StatCard label="Tổng doanh thu" value={comboStats.totalRevenue.toLocaleString() + 'đ'} icon={MdMonetizationOn} color={isDark ? DARK_ACCENT : OR} trend={comboStats.growth} delay={0} sub={`+${comboStats.growth}% so với kỳ trước`} />
        <StatCard label="Đơn hàng" value={comboStats.totalOrders} icon={MdReceipt} color={isDark ? DARK_ACCENT_LIGHT : BLUE} delay={0.05} sub={`${comboStats.totalItems} sản phẩm đã bán`} />
        <StatCard label="Sản phẩm đã bán" value={comboStats.totalItems} icon={MdFoodBank} color={isDark ? '#6ab0ff' : PURPLE} delay={0.1} />
        <StatCard label="Giá trị đơn hàng TB" value={comboStats.avgOrderValue.toLocaleString() + 'đ'} icon={MdLocalOffer} color={isDark ? '#4ade80' : GREEN} delay={0.15} />
      </SimpleGrid>

      {/* ── Charts Grid ── */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="20px" mb="24px">
        <CategoryPieChart categories={categories} />
        <RevenueChart data={dailyRevenue} />
      </Grid>

      {/* ── Main Content ── */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1.4fr' }} gap="20px" mb="24px">
        {/* Category Breakdown */}
        <Box bg={colors.bgCard} borderRadius="20px" border={`1px solid ${colors.borderCard}`} boxShadow={colors.shadow} p="24px" sx={{ animation: `${fadeUp} .5s ease .1s both` }}>
          <Flex align="center" gap="10px" mb="20px">
            <Box w="4px" h="20px" borderRadius="full" bg={isDark ? `linear-gradient(180deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : `linear-gradient(180deg, ${OR}, ${ORL})`} />
            <Text fontSize="15px" fontWeight="800" color={colors.textPrimary}>Phân loại sản phẩm</Text>
            <Badge px="8px" py="3px" borderRadius="full" bg={isDark ? `${DARK_ACCENT}20` : ORPL} color={isDark ? DARK_ACCENT : OR} fontSize="11px" fontWeight="700">{Object.keys(categories).length} danh mục</Badge>
          </Flex>
          <Flex direction="column" gap="12px">
            {Object.entries(categories).map(([name, data]) => <CategoryCard key={name} category={name} data={data} />)}
          </Flex>
        </Box>

        {/* Revenue Chart & Satisfaction */}
        <Flex direction="column" gap="20px">
          <RevenueChart data={dailyRevenue} />
        </Flex>
      </Grid>

      {/* ── Top Products Table ── */}
      <TopProductsTable products={topProducts} />
    </Box>
  );
}