
import React from 'react';
import { Box, Flex, Text, Icon, Badge, Progress, Tooltip, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, TagLabel, TagLeftIcon, useColorMode } from '@chakra-ui/react';
import { MdInfo, MdFastfood } from 'react-icons/md';
import { FaCrown, FaTrophy, FaMedal } from 'react-icons/fa';
import { getColors, DARK_THEME, DARK_ACCENT, DARK_ACCENT_LIGHT, DARK_ACCENT_SHADOW, OR, ORL, ORPL, GREEN, CATEGORY_CONFIG, fadeUp } from '../constants';

function TopProductRow({ product, index }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = getColors(isDark);
  const rankColors = isDark ? [DARK_ACCENT, DARK_ACCENT_LIGHT, DARK_THEME.labelColor] : ['#f97316', '#fbbf24', '#94a3b8'];
  const rankIcons = [FaCrown, FaMedal, FaTrophy];

  return (
    <Tr sx={{ animation: `${fadeUp} .3s ease ${index * 0.05}s both` }} _hover={{ bg: isDark ? DARK_THEME.hoverBg : '#f8fafc' }} transition="all .2s">
      <Td>
        <Flex align="center" gap="8px">
          {index < 3 ? (
            <Box w="28px" h="28px" borderRadius="full" bg={`${rankColors[index]}20`} display="flex" alignItems="center" justifyContent="center" border={`2px solid ${rankColors[index]}`}>
              <Icon as={rankIcons[index]} boxSize="14px" color={rankColors[index]} />
            </Box>
          ) : (
            <Text fontWeight="700" color={colors.textMuted} fontSize="14px">#{index + 1}</Text>
          )}
        </Flex>
      </Td>
      <Td><Text fontWeight="600" color={colors.textPrimary}>{product.name}</Text></Td>
      <Td>
        <Tag size="sm" variant="subtle" colorScheme={product.category === 'Bắp' ? 'orange' : product.category === 'Nước ngọt' ? 'blue' : product.category === 'Combo' ? 'purple' : 'pink'}>
          <TagLeftIcon as={CATEGORY_CONFIG[product.category]?.icon || MdFastfood} />
          <TagLabel>{product.category}</TagLabel>
        </Tag>
      </Td>
      <Td isNumeric><Text fontWeight="700" color={colors.textPrimary}>{product.sold}</Text></Td>
      <Td isNumeric><Text fontWeight="700" color={isDark ? DARK_ACCENT : GREEN}>{product.revenue.toLocaleString()}đ</Text></Td>
      <Td isNumeric>
        <Box w="100px" display="inline-block">
          <Flex align="center" gap="8px">
            <Progress value={product.percentage || 0} size="sm" colorScheme={isDark ? 'blue' : 'orange'} borderRadius="full" bg={isDark ? DARK_THEME.inputBg : '#f1f5f9'} flex="1" />
            <Text fontSize="11px" fontWeight="700" color={colors.textMuted} minW="40px">{product.percentage || 0}%</Text>
          </Flex>
        </Box>
      </Td>
    </Tr>
  );
}

export default function TopProductsTable({ products }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = getColors(isDark);

  return (
    <Box bg={colors.bgCard} borderRadius="20px" border={`1px solid ${colors.borderCard}`} boxShadow={colors.shadow} overflow="hidden" sx={{ animation: `${fadeUp} .5s ease .2s both` }}>
      <Box p="20px 24px" borderBottom={`1px solid ${isDark ? DARK_THEME.border : '#f8fafc'}`} bg={isDark ? DARK_THEME.inputBg : '#fafafa'}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="10px">
            <Box w="4px" h="20px" borderRadius="full" bg={isDark ? `linear-gradient(180deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})` : `linear-gradient(180deg, ${OR}, ${ORL})`} />
            <Text fontSize="15px" fontWeight="800" color={colors.textPrimary}>Top sản phẩm bán chạy</Text>
            <Badge px="8px" py="3px" borderRadius="full" bg={isDark ? `${DARK_ACCENT}20` : ORPL} color={isDark ? DARK_ACCENT : OR} fontSize="11px" fontWeight="700">🏆 {products.length} sản phẩm</Badge>
          </Flex>
          <Tooltip label="Xếp hạng theo doanh thu" placement="top" hasArrow>
            <Box><Icon as={MdInfo} boxSize="16px" color={colors.textMuted} /></Box>
          </Tooltip>
        </Flex>
      </Box>
      <Box overflowX="auto" p="4px">
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead>
              <Tr bg={isDark ? DARK_THEME.inputBg : '#f8fafc'}>
                <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" w="60px">#</Th>
                <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px">Sản phẩm</Th>
                <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px">Danh mục</Th>
                <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" isNumeric>Đã bán</Th>
                <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" isNumeric>Doanh thu</Th>
                <Th fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" isNumeric w="140px">Tỉ lệ</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product, i) => <TopProductRow key={i} product={product} index={i} />)}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}