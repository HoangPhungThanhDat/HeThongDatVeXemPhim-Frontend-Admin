
import React from 'react';
import { Box, Flex, Text, Icon, useColorMode } from '@chakra-ui/react';
import { MdPercent } from 'react-icons/md';
import { getColors, DARK_THEME, DARK_ACCENT, DARK_ACCENT_LIGHT, DARK_ACCENT_SHADOW, PURPLE, scaleIn } from '../constants';

export default function CategoryPieChart({ categories }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = getColors(isDark);
  const total = Object.values(categories).reduce((sum, cat) => sum + cat.percentage, 0) || 1;
  const colors_pie = isDark ? [DARK_ACCENT, DARK_ACCENT_LIGHT, '#6ab0ff', '#4ade80'] : ['#f97316', '#fb923c', '#a78bfa', '#f472b6'];

  return (
    <Box p="24px" borderRadius="20px" bg={colors.bgCard} border={`1px solid ${colors.borderCard}`}>
      <Flex align="center" gap="10px" mb="20px">
        <Box w="36px" h="36px" borderRadius="10px" bg={isDark ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : `linear-gradient(135deg, ${PURPLE}, #a78bfa)`} display="flex" alignItems="center" justifyContent="center" boxShadow={isDark ? `0 4px 12px ${DARK_ACCENT_SHADOW}` : '0 4px 12px rgba(124,58,237,0.2)'}>
          <Icon as={MdPercent} boxSize="18px" color="white" />
        </Box>
        <Box>
          <Text fontSize="14px" fontWeight="700" color={colors.textPrimary}>Phân bổ danh mục</Text>
          <Text fontSize="11px" color={colors.textMuted}>Tỉ lệ đóng góp doanh thu</Text>
        </Box>
      </Flex>
      <Flex direction="column" gap="12px">
        {Object.entries(categories).map(([name, data], index) => {
          const percentage = (data.percentage / total) * 100;
          const color = colors_pie[index % colors_pie.length];
          return (
            <Box key={name}>
              <Flex justify="space-between" mb="4px">
                <Text fontSize="12px" fontWeight="600" color={colors.textPrimary}>{name}</Text>
                <Text fontSize="12px" fontWeight="700" color={color}>{Math.round(percentage)}%</Text>
              </Flex>
              <Box w="100%" h="6px" borderRadius="full" bg={isDark ? DARK_THEME.inputBg : '#f1f5f9'}>
                <Box w={`${percentage}%`} h="100%" borderRadius="full" bg={color} transition="width 1s ease" sx={{ animation: `${scaleIn} .6s ease ${index * 0.1}s both` }} />
              </Box>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}