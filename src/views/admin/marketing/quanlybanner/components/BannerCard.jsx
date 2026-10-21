// views/admin/quanlybanner/components/BannerCard.jsx

import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  Switch,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  MdVisibility,
  MdEdit,
  MdVisibilityOff,
  MdDeleteForever,
  MdArrowUpward,
  MdArrowDownward,
} from 'react-icons/md';
import { FaRegClock } from 'react-icons/fa';
import { StatusBadge } from './shared/StatusBadge';
import { LinkBadge } from './shared/LinkBadge';
import { fadeUp } from './shared/animations';

export function BannerCard({
  banner,
  index,
  onView,
  onEdit,
  onHide,
  onDelete,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  isFirst,
  isLast,
  isUpdating = false,
}) {
  const cardBg = useColorModeValue('white', '#0b1437');
  const cardBorder = useColorModeValue('#f1f5f9', '#1a2744');
  const linkColor = useColorModeValue('#64748b', '#8899b4');
  const subColor = useColorModeValue('#94a3b8', '#4a6080');
  const divider = useColorModeValue('#f8fafc', '#132040');
  const btnBg = useColorModeValue('#f8fafc', '#132040');
  const btnBorder = useColorModeValue('#e2e8f0', '#1e3a5f');
  const btnColor = useColorModeValue('#94a3b8', '#4a6080');
  const viewBtnColor = useColorModeValue('#475569', '#8899b4');
  const viewHoverBg = useColorModeValue('#f1f5f9', '#1a2744');

  const status = banner.status || banner.Status || 'Inactive';
  const isActive = status === 'Active';

  return (
    <Box
      borderRadius="14px"
      bg={cardBg}
      border={`1.5px solid ${cardBorder}`}
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        border: '1.5px solid #f97316',
        boxShadow: '0 2px 12px rgba(249,115,22,0.12)',
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      opacity={isUpdating ? 0.9 : 1}
    >
      <Box position="relative" h="130px" overflow="hidden">
        <img
          src={banner.image}
          alt={banner.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <Box
          position="absolute"
          inset="0"
          bg="linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)"
        />
        <Box
          position="absolute"
          top="8px"
          left="10px"
          w="24px"
          h="24px"
          borderRadius="7px"
          bg="rgba(249,115,22,0.9)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 2px 6px rgba(0,0,0,0.25)"
        >
          <Text fontSize="11px" fontWeight="800" color="white">
            {banner.order}
          </Text>
        </Box>
        <Box position="absolute" top="8px" right="10px">
          <StatusBadge status={status} />
        </Box>
        <Box position="absolute" bottom="0" left="0" right="0" px="12px" pb="10px">
          <Text fontSize="13.5px" fontWeight="700" color="white" noOfLines={1}>
            {banner.title}
          </Text>
        </Box>
      </Box>

      <Box px="12px" pt="10px" pb="4px">
        <Flex align="center" gap="6px" flexWrap="wrap">
          <LinkBadge type={banner.linkType} />
          {banner.linkTarget && (
            <Text
              fontSize="11px"
              color={linkColor}
              fontWeight="500"
              noOfLines={1}
              flex="1"
              minW="0"
            >
              {banner.linkTarget}
            </Text>
          )}
        </Flex>
        {banner.scheduleStart && (
          <Flex align="center" gap="5px" mt="7px">
            <Icon as={FaRegClock} boxSize="10px" color="#f97316" />
            <Text fontSize="10.5px" color={linkColor} fontWeight="500">
              {banner.scheduleStart.replace('T', ' ').slice(0, 16)}
              <Text as="span" color={subColor}>
                {' '}
                →{' '}
              </Text>
              {banner.scheduleEnd.replace('T', ' ').slice(0, 16)}
            </Text>
          </Flex>
        )}
        <Flex align="center" gap="6px" mt="7px">
          <Text fontSize="10.5px" color={subColor} fontWeight="500">
            Hẹn giờ:
          </Text>
          <Switch
            isChecked={banner.scheduledOn}
            size="sm"
            colorScheme="orange"
            isReadOnly
          />
          <Text
            fontSize="10.5px"
            color={banner.scheduledOn ? '#f97316' : subColor}
            fontWeight="600"
          >
            {banner.scheduledOn ? 'Bật' : 'Tắt'}
          </Text>
        </Flex>
      </Box>

      <Flex
        px="10px"
        py="10px"
        gap="6px"
        borderTop={`1px solid ${divider}`}
        mt="6px"
        flexWrap="wrap"
      >
        {/* Nút move up/down */}
        {[MdArrowUpward, MdArrowDownward].map((Ic, i) => (
          <Button
            key={i}
            size="xs"
            h="32px"
            w="32px"
            p="0"
            borderRadius="8px"
            bg={btnBg}
            border={`1px solid ${btnBorder}`}
            color={btnColor}
            _hover={{
              bg: '#fff7ed',
              color: '#f97316',
              border: '1px solid #fed7aa',
            }}
            isDisabled={(i === 0 ? isFirst : isLast) || isUpdating}
            transition="all 0.15s"
            onClick={() =>
              i === 0
                ? onMoveUp(banner.id || banner.BannerId)
                : onMoveDown(banner.id || banner.BannerId)
            }
          >
            <Icon as={Ic} boxSize="13px" />
          </Button>
        ))}

        <Box flex="1" />

        {/* Nút Xem */}
        <Button
          size="xs"
          h="32px"
          px="10px"
          borderRadius="8px"
          bg={btnBg}
          color={viewBtnColor}
          border={`1px solid ${btnBorder}`}
          fontSize="12px"
          fontWeight="600"
          leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
          _hover={{ bg: viewHoverBg }}
          transition="all 0.15s"
          onClick={() => onView(banner)}
          isDisabled={isUpdating}
        >
          Xem
        </Button>

        {/* Nút Sửa */}
        <Button
          size="xs"
          h="32px"
          px="10px"
          borderRadius="8px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white"
          fontSize="12px"
          fontWeight="600"
          leftIcon={<Icon as={MdEdit} boxSize="12px" />}
          _hover={{ opacity: 0.88 }}
          boxShadow="0 2px 8px rgba(249,115,22,0.3)"
          transition="all 0.15s"
          onClick={() => onEdit(banner)}
          isDisabled={isUpdating}
        >
          Sửa
        </Button>

        {/* Nút Ẩn / Hiện — có Spinner khi đang cập nhật */}
        <Button
          size="xs"
          h="32px"
          px="10px"
          borderRadius="8px"
          bg={btnBg}
          color={isActive ? '#dc2626' : '#059669'}
          border={`1px solid ${btnBorder}`}
          fontSize="12px"
          fontWeight="600"
          leftIcon={
            isUpdating ? (
              <Spinner size="xs" color="#f97316" thickness="2px" />
            ) : (
              <Icon as={MdVisibilityOff} boxSize="12px" />
            )
          }
          _hover={{
            bg: isActive ? '#fef2f2' : '#ecfdf5',
            border: `1px solid ${isActive ? '#fca5a5' : '#a7f3d0'}`,
          }}
          transition="all 0.15s"
          onClick={() => onHide(banner.id || banner.BannerId)}
          isDisabled={isUpdating}
          opacity={isUpdating ? 0.75 : 1}
          cursor={isUpdating ? 'wait' : 'pointer'}
        >
          {isUpdating ? 'Đang lưu...' : isActive ? 'Ẩn' : 'Hiện'}
        </Button>

        {/* Nút Xóa */}
        <Button
          size="xs"
          h="32px"
          px="10px"
          borderRadius="8px"
          bg={btnBg}
          color="#dc2626"
          border={`1px solid ${btnBorder}`}
          fontSize="12px"
          fontWeight="600"
          leftIcon={<Icon as={MdDeleteForever} boxSize="12px" />}
          _hover={{ bg: '#fef2f2' }}
          transition="all 0.15s"
          onClick={() => onDelete(banner)}
          isDisabled={isUpdating}
        >
          Xóa
        </Button>
      </Flex>
    </Box>
  );
}