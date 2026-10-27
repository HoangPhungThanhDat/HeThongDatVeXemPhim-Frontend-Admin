
import React from 'react';
import { Box, Flex, Text, Icon, Badge, CircularProgress, CircularProgressLabel, useColorMode } from '@chakra-ui/react';
import { getColors, DARK_THEME, DARK_ACCENT, DARK_ACCENT_LIGHT, DARK_ACCENT_SHADOW, CATEGORY_CONFIG, fadeUp } from '../../constants';

export default function CategoryCard({ category, data }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = getColors(isDark);
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Combo'];

  return (
    <Box p="18px" borderRadius="16px" bg={colors.bgCard} border={`1.5px solid ${colors.borderCard}`} sx={{ animation: `${fadeUp} .4s ease both` }} transition="all .3s ease" _hover={{ border: `1.5px solid ${isDark ? DARK_ACCENT : config.color}`, boxShadow: isDark ? `0 8px 24px ${DARK_ACCENT_SHADOW}` : `0 8px 24px ${config.color}20`, transform: 'translateX(4px)' }} position="relative" overflow="hidden">
      <Flex align="center" gap="14px" mb="12px">
        <Box w="44px" h="44px" borderRadius="12px" bg={isDark ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : config.color} display="flex" alignItems="center" justifyContent="center" boxShadow={isDark ? `0 4px 12px ${DARK_ACCENT_SHADOW}` : `0 4px 12px ${config.color}30`}>
          <Icon as={config.icon} boxSize="20px" color="white" />
        </Box>
        <Box flex="1">
          <Text fontSize="15px" fontWeight="700" color={colors.textPrimary}>{category}</Text>
          <Text fontSize="12px" color={colors.textMuted}>{data.count} sản phẩm · {data.totalItems} đã bán</Text>
        </Box>
        <Badge px="10px" py="4px" borderRadius="full" bg={isDark ? `${DARK_ACCENT}20` : `${config.color}15`} color={isDark ? DARK_ACCENT : config.color} fontSize="12px" fontWeight="700">{data.percentage}%</Badge>
      </Flex>
      <Flex gap="10px">
        <Box flex="1" p="10px" borderRadius="10px" bg={isDark ? DARK_THEME.inputBg : '#f8fafc'} textAlign="center">
          <Text fontSize="10px" fontWeight="700" color={colors.textMuted} letterSpacing="0.5px" textTransform="uppercase">Doanh thu</Text>
          <Text fontSize="16px" fontWeight="800" color={isDark ? DARK_ACCENT : config.color} mt="2px">{data.revenue.toLocaleString()}đ</Text>
        </Box>
        <Box flex="1" p="10px" borderRadius="10px" bg={isDark ? DARK_THEME.inputBg : '#f8fafc'} textAlign="center">
          <Text fontSize="10px" fontWeight="700" color={colors.textMuted} letterSpacing="0.5px" textTransform="uppercase">Tỉ lệ</Text>
          <Box display="flex" alignItems="center" justifyContent="center" gap="6px" mt="2px">
            <CircularProgress value={data.percentage || 0} size="32px" thickness="4px" color={isDark ? DARK_ACCENT : config.color}>
              <CircularProgressLabel fontSize="8px" fontWeight="700">{data.percentage || 0}%</CircularProgressLabel>
            </CircularProgress>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}