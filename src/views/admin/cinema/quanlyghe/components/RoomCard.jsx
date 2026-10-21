

import React from 'react';
import {
  Box,
  Flex,
  Text,
  Grid,
  Button,
  Icon,
  useColorMode,
} from '@chakra-ui/react';
import { MdLayers, MdEdit } from 'react-icons/md';
import { getSeatColors } from './shared/StatCard';
import { fadeUp, shimmer } from './shared/animations';
import RoomTypeBadge from './RoomTypeBadge';
import StatusDot from './StatusDot';
import { ROW_LABELS } from '../constants';

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: '#0a1628',
  cardBg: '#0f1f3a',
  border: '#1a3a5c',
  text: '#e8f4f8',
  textSecondary: '#88b4d8',
  labelColor: '#5a8ab5',
  inputBg: '#0a1f35',
  hoverBg: '#142d4f',
  accent: '#4a9eff',
  accentLight: '#6ab0ff',
  accentShadow: 'rgba(74, 158, 255, 0.25)',
};

// ✅ Tạo preview seats (không cần import từ hook)
const generatePreviewSeats = (room) => {
  if (!room) return [];

  const rows = room.rows || 8;
  const cols = room.cols || 12;
  const previewRows = [];

  for (let r = 0; r < Math.min(rows, 6); r++) {
    const row = [];
    const rowLabel = ROW_LABELS[r] || 'A';
    for (let c = 0; c < Math.min(cols, 10); c++) {
      // Random trạng thái cho preview
      const isBooked = (r * 7 + c * 13) % 7 === 0;
      const type =
        (r + c) % 3 === 0 ? 'vip' : (r + c) % 5 === 0 ? 'sweetbox' : 'regular';
      row.push({
        id: `${rowLabel}${c + 1}`,
        booked: isBooked,
        type: type,
      });
    }
    previewRows.push(row);
  }
  return previewRows;
};

export default function RoomCard({ room, index, onView, onEditMode, isDark }) {
  const { colorMode } = useColorMode();
  const darkMode = isDark !== undefined ? isDark : colorMode === 'dark';
  const colors = getSeatColors(darkMode);

  // ✅ Lấy dữ liệu trực tiếp từ room.stats (Không gọi API)
  const total = room.stats?.total || room.SeatCount || room.seat_count || 0;
  const booked = room.stats?.booked || 0;
  const empty = total - booked;
  const pct = total > 0 ? Math.round((booked / total) * 100) : 0;

  // Dark mode colors
  const accentColor = darkMode ? DARK_THEME.accent : '#f97316';
  const accentShadow = darkMode
    ? DARK_THEME.accentShadow
    : 'rgba(249,115,22,0.3)';
  const gradientBg = darkMode
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : 'linear-gradient(135deg, #f97316, #fb923c)';
  const borderCard = darkMode ? DARK_THEME.border : '#f1f5f9';
  const statBg = darkMode ? DARK_THEME.inputBg : '#f8fafc';
  const statBorder = darkMode ? DARK_THEME.border : '#f1f5f9';
  const btnBg = darkMode ? DARK_THEME.inputBg : '#f8fafc';
  const btnBorder = darkMode ? DARK_THEME.border : '#e2e8f0';
  const btnColor = darkMode ? DARK_THEME.textSecondary : '#475569';
  const btnHoverBg = darkMode ? DARK_THEME.hoverBg : '#f1f5f9';
  const previewBg = darkMode ? DARK_THEME.inputBg : '#fafbfc';
  const textColor = darkMode ? DARK_THEME.text : '#0f172a';
  const subColor = darkMode ? DARK_THEME.textSecondary : '#94a3b8';

  const previewSeats = generatePreviewSeats(room);

  return (
    <Box
      bg={colors.bgCard}
      borderRadius="16px"
      border={`1.5px solid ${borderCard}`}
      boxShadow={
        darkMode
          ? `0 1px 4px ${DARK_THEME.accentShadow}`
          : '0 1px 4px rgba(0,0,0,0.04)'
      }
      sx={{ animation: `${fadeUp} 0.4s ease ${index * 0.07}s both` }}
      overflow="hidden"
      _hover={{
        border: `1.5px solid ${darkMode ? DARK_THEME.accent : '#f97316'}`,
        boxShadow: darkMode
          ? `0 4px 20px ${DARK_THEME.accentShadow}`
          : '0 4px 20px rgba(249,115,22,0.12)',
      }}
      transition="all 0.2s"
    >
      <Box
        h="3px"
        bg={
          room.status === 'maintenance'
            ? `linear-gradient(90deg, ${darkMode ? '#fbbf24' : '#f59e0b'}, ${darkMode ? '#fde68a' : '#fbbf24'})`
            : `linear-gradient(90deg, ${darkMode ? DARK_THEME.accent : '#f97316'}, ${darkMode ? DARK_THEME.accentLight : '#fbbf24'}, ${darkMode ? DARK_THEME.accent : '#f97316'})`
        }
        bgSize="200% 100%"
        sx={
          room.status === 'active'
            ? { animation: `${shimmer} 3s linear infinite` }
            : {}
        }
      />

      <Box p="16px 18px">
        <Flex justify="space-between" align="flex-start" mb="12px">
          <Box flex="1" minW="0">
            <Flex align="center" gap="8px" mb="5px" flexWrap="wrap">
              <Text
                fontSize="14px"
                fontWeight="800"
                color={textColor}
                noOfLines={1}
              >
                {room.name}
              </Text>
              <RoomTypeBadge type={room.type} isDark={darkMode} />
            </Flex>
            <StatusDot status={room.status} isDark={darkMode} />
          </Box>
          <Box textAlign="right" flexShrink="0" ml="8px">
            <Text fontSize="20px" fontWeight="900" color={textColor}>
              {total}
            </Text>
            <Text fontSize="10px" color={subColor} fontWeight="600">
              ghế
            </Text>
          </Box>
        </Flex>

        {/* Preview seats */}
        {previewSeats.length > 0 && (
          <Box
            bg={previewBg}
            borderRadius="10px"
            p="10px"
            mb="12px"
            overflow="hidden"
          >
            <Flex direction="column" gap="4px" align="center">
              <Box
                w="80%"
                h="4px"
                borderRadius="2px"
                bg={
                  darkMode
                    ? `linear-gradient(90deg, transparent, ${DARK_THEME.accent}, transparent)`
                    : 'linear-gradient(90deg, transparent, #f97316, transparent)'
                }
                mb="4px"
              />
              {previewSeats.slice(0, 5).map((row, ri) => (
                <Flex key={ri} gap="3px" justify="center">
                  {row.slice(0, 10).map((seat) => (
                    <Box
                      key={seat.id}
                      w="9px"
                      h="7px"
                      borderRadius="2px"
                      bg={
                        seat.booked
                          ? '#dc2626'
                          : darkMode
                            ? DARK_THEME.accent
                            : '#fb923c'
                      }
                      opacity={seat.booked ? 1 : 0.7}
                    />
                  ))}
                  {row.length > 10 && (
                    <Text fontSize="7px" color={subColor}>
                      ...
                    </Text>
                  )}
                </Flex>
              ))}
              {previewSeats.length > 5 && (
                <Text fontSize="9px" color={subColor} mt="2px">
                  +{previewSeats.length - 5} hàng nữa
                </Text>
              )}
            </Flex>
          </Box>
        )}

        <Grid templateColumns="1fr 1fr 1fr" gap="8px" mb="12px">
          {[
            {
              label: 'Đã đặt',
              value: booked,
              color: '#dc2626',
            },
            {
              label: 'Còn trống',
              value: empty,
              color: '#059669',
            },
            {
              label: 'Lấp đầy',
              value: `${pct}%`,
              color: darkMode ? DARK_THEME.accent : '#f97316',
            },
          ].map(({ label, value, color }) => (
            <Box
              key={label}
              p="8px"
              borderRadius="8px"
              bg={statBg}
              border={`1px solid ${statBorder}`}
              textAlign="center"
            >
              <Text fontSize="14px" fontWeight="800" color={color}>
                {value}
              </Text>
              <Text
                fontSize="9px"
                fontWeight="700"
                color={subColor}
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                {label}
              </Text>
            </Box>
          ))}
        </Grid>

        <Box mb="14px">
          <Box
            h="5px"
            borderRadius="full"
            bg={darkMode ? DARK_THEME.inputBg : '#f1f5f9'}
            overflow="hidden"
          >
            <Box
              h="100%"
              borderRadius="full"
              w={`${pct}%`}
              bg={pct > 80 ? '#dc2626' : pct > 50 ? accentColor : '#10b981'}
              transition="width 0.6s ease"
            />
          </Box>
        </Box>

        <Flex gap="8px">
          <Button
            flex="1"
            h="36px"
            borderRadius="9px"
            fontSize="12.5px"
            fontWeight="700"
            bg={gradientBg}
            color="white"
            boxShadow={`0 3px 10px ${accentShadow}`}
            _hover={{
              boxShadow: `0 5px 18px ${accentShadow}`,
              transform: 'translateY(-1px)',
            }}
            _active={{ transform: 'translateY(0)' }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdLayers} boxSize="13px" />}
            onClick={() => onView(room)}
          >
            Xem sơ đồ ghế
          </Button>
          <Button
            h="36px"
            w="36px"
            borderRadius="9px"
            bg={btnBg}
            color={btnColor}
            border={`1px solid ${btnBorder}`}
            _hover={{ bg: btnHoverBg }}
            transition="all 0.15s"
            onClick={() => onEditMode(room)}
          >
            <Icon as={MdEdit} boxSize="14px" />
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}