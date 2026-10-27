
import React from 'react';
import { Box, Flex, Text, Icon, useColorMode } from '@chakra-ui/react';
import { MdBarChart } from 'react-icons/md';
import { getColors, DARK_THEME, DARK_ACCENT, DARK_ACCENT_LIGHT, DARK_ACCENT_SHADOW, OR, ORL, ORSW } from '../constants';

export default function RevenueChart({ data }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = getColors(isDark);
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const accentColor = isDark ? DARK_ACCENT : OR;

  return (
    <Box p="24px" borderRadius="20px" bg={colors.bgCard} border={`1px solid ${colors.borderCard}`}>
      <Flex justify="space-between" align="center" mb="20px">
        <Flex align="center" gap="10px">
          <Box w="36px" h="36px" borderRadius="10px" bg={isDark ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : `linear-gradient(135deg, ${OR}, ${ORL})`} display="flex" alignItems="center" justifyContent="center" boxShadow={isDark ? `0 4px 12px ${DARK_ACCENT_SHADOW}` : `0 4px 12px ${ORSW}`}>
            <Icon as={MdBarChart} boxSize="18px" color="white" />
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="700" color={colors.textPrimary}>Biểu đồ doanh thu</Text>
            <Text fontSize="11px" color={colors.textMuted}>Theo từng ngày</Text>
          </Box>
        </Flex>
      </Flex>
      <Flex h="180px" align="flex-end" gap="8px" pt="10px">
        {data.map((item, i) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 150 : 0;
          const isPeak = item.value === maxValue;
          return (
            <Box key={i} flex="1" display="flex" flexDirection="column" align="center" gap="6px">
              <Text fontSize="10px" fontWeight="700" color={isPeak ? accentColor : colors.textMuted}>{Math.round(item.value / 1000)}k</Text>
              <Box w="100%" h={`${Math.max(height, 4)}px`} borderRadius="8px 8px 0 0" bg={isPeak ? isDark ? `linear-gradient(180deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : `linear-gradient(180deg, ${OR}, ${ORL})` : `linear-gradient(180deg, ${isDark ? DARK_THEME.border : '#cbd5e1'}, ${isDark ? DARK_THEME.inputBg : '#e2e8f0'}`} opacity={isPeak ? 1 : 0.6} transition="all 0.6s" position="relative" minH="4px" _hover={{ opacity: 1, transform: 'scaleY(1.02)' }} />
              <Text fontSize="10px" fontWeight="600" color={isPeak ? accentColor : colors.textMuted}>{item.label}</Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}