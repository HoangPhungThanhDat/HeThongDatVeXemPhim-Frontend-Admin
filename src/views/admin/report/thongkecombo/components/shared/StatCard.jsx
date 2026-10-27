
import React from 'react';
import { Box, Flex, Text, Icon, useColorMode } from '@chakra-ui/react';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { getColors, DARK_ACCENT, DARK_ACCENT_LIGHT, DARK_ACCENT_SHADOW, GREEN, fadeUp, float } from '../../constants';

export default function StatCard({ label, value, icon, accent, sub, trend, delay = 0, color }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = getColors(isDark);
  const iconBg = isDark ? DARK_ACCENT : color || accent;

  return (
    <Box p="24px" borderRadius="20px" bg={colors.bgCard} border={`1px solid ${colors.borderCard}`} boxShadow={colors.shadow} sx={{ animation: `${fadeUp} .5s ease ${delay}s both` }} transition="all .3s cubic-bezier(0.4, 0, 0.2, 1)" _hover={{ transform: 'translateY(-6px)', boxShadow: isDark ? `0 20px 40px ${DARK_ACCENT_SHADOW}` : `0 20px 40px ${iconBg}20`, border: `1px solid ${isDark ? DARK_ACCENT : iconBg}` }} position="relative" overflow="hidden">
      <Box position="absolute" top="-30px" right="-30px" w="100px" h="100px" borderRadius="full" bg={`${isDark ? DARK_ACCENT : iconBg}10`} />
      <Flex align="flex-start" justify="space-between" mb="12px">
        <Box>
          <Text fontSize="11px" fontWeight="700" color={colors.textMuted} letterSpacing="1px" textTransform="uppercase" mb="2px">{label}</Text>
          <Text fontSize="28px" fontWeight="800" color={colors.textPrimary} lineHeight="1.2">{value}</Text>
          {sub && <Text fontSize="12px" color={colors.textMuted} mt="1px">{sub}</Text>}
        </Box>
        <Box w="48px" h="48px" borderRadius="14px" bg={isDark ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : iconBg} display="flex" alignItems="center" justifyContent="center" boxShadow={isDark ? `0 8px 20px ${DARK_ACCENT_SHADOW}` : `0 8px 20px ${iconBg}40`} sx={{ animation: `${float} 3s ease-in-out infinite` }}>
          <Icon as={icon} boxSize="20px" color="white" />
        </Box>
      </Flex>
      {trend && (
        <Flex align="center" gap="6px" mt="2px">
          <Flex align="center" gap="4px" px="10px" py="4px" borderRadius="full" bg={trend > 0 ? `${GREEN}15` : '#fef2f2'} border={trend > 0 ? `1px solid ${GREEN}30` : '1px solid #fca5a5'}>
            <Icon as={trend > 0 ? MdTrendingUp : MdTrendingDown} boxSize="14px" color={trend > 0 ? GREEN : '#dc2626'} />
            <Text fontSize="12px" fontWeight="700" color={trend > 0 ? GREEN : '#dc2626'}>{trend > 0 ? '+' : ''}{trend}%</Text>
          </Flex>
          <Text fontSize="11px" color={colors.textMuted}>so với kỳ trước</Text>
        </Flex>
      )}
    </Box>
  );
}