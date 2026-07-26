
import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  Hide,
  Show,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MdNotificationsNone, 
  MdInfoOutline, 
  MdSearch,
  MdNotificationsActive,
} from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';

// ─── SearchBar Component ──────────────────────────────────────────────────
export function SearchBar({ 
  placeholder = "Tìm kiếm...", 
  onSearch, 
  value, 
  ...rest 
}) {
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const navbarIcon = useColorModeValue('gray.400', 'white');
  const [searchValue, setSearchValue] = useState(value || '');

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  return (
    <InputGroup
      borderRadius="30px"
      bg={inputBg}
      border="none"
      w={{ base: '100%', md: '200px', lg: '250px' }}
      {...rest}
    >
      <InputLeftElement>
        <Icon as={MdSearch} color={navbarIcon} w="16px" h="16px" />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        borderRadius="30px"
        bg={inputBg}
        border="none"
        color={textColor}
        _placeholder={{ color: 'gray.400' }}
        _focus={{
          bg: useColorModeValue('white', 'navy.700'),
          boxShadow: '0 0 0 2px #f97316',
          border: 'none',
        }}
        _hover={{ bg: useColorModeValue('gray.100', 'navy.700') }}
        transition="all 0.2s"
        fontSize="sm"
        h="40px"
      />
    </InputGroup>
  );
}

// ─── AdminNavbarLinks Component ─────────────────────────────────────────
export default function AdminNavbarLinks(props) {
  const { secondary, onSearch, placeholder } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin user từ localStorage
  const fullname = localStorage.getItem('fullname') || 'Nhân viên';
  const role = localStorage.getItem('role') || '';

  // ── Chakra Color Mode ──
  const navbarIcon = useColorModeValue('gray.400', 'white');
  const menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');

  // ── Xác định placeholder theo route ──
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    const path = location.pathname;
    if (path.includes('/admin/voucher') || path.includes('/quan-ly-voucher')) {
      return 'Tìm voucher theo tên, mã...';
    }
    if (path.includes('/admin/phim')) {
      return 'Tìm phim...';
    }
    if (path.includes('/admin/rap')) {
      return 'Tìm rạp...';
    }
    if (path.includes('/admin/khach-hang')) {
      return 'Tìm khách hàng...';
    }
    if (path.includes('/admin/hoa-don')) {
      return 'Tìm hóa đơn...';
    }
    if (path.includes('/admin/thong-ke')) {
      return 'Tìm thống kê...';
    }
    return 'Tìm kiếm...';
  };

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      // Gọi API logout nếu có
      // await AuthApi.Logout();
    } catch (_) {
      // Bỏ qua lỗi
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('fullname');
      localStorage.removeItem('UserId');
      navigate('/auth/sign-in', { replace: true });
    }
  };

  // ── Mock notification count ──
  const notificationCount = 3;

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      {/* ── Search Bar ── */}
      <SearchBar
        me="10px"
        borderRadius="30px"
        onSearch={onSearch}
        placeholder={getPlaceholder()}
        display={{ base: secondary ? 'flex' : 'none', md: 'flex' }}
      />

      {/* ── ETH Balance ── */}
      <Flex
        bg={ethBg}
        display={secondary ? 'flex' : 'none'}
        borderRadius="30px"
        ms="auto"
        p="6px"
        align="center"
        me="6px"
      >
        <Flex
          align="center"
          justify="center"
          bg={ethBox}
          h="29px"
          w="29px"
          borderRadius="30px"
          me="7px"
        >
          <Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
        </Flex>
        <Text w="max-content" color={ethColor} fontSize="sm" fontWeight="700" me="6px">
          1,924
          <Text as="span" display={{ base: 'none', md: 'unset' }}>
            {' '}ETH
          </Text>
        </Text>
      </Flex>

      {/* ── Notifications ── */}
      <Menu>
        <MenuButton p="0px" position="relative">
          <Icon 
            mt="6px" 
            as={MdNotificationsNone} 
            color={navbarIcon} 
            w="18px" 
            h="18px" 
            me="10px" 
          />
          {notificationCount > 0 && (
            <Box
              position="absolute"
              top="0"
              right="8px"
              w="16px"
              h="16px"
              borderRadius="full"
              bg="red.500"
              color="white"
              fontSize="9px"
              fontWeight="700"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {notificationCount}
            </Box>
          )}
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: '30px', md: 'unset' }}
          minW={{ base: 'unset', md: '400px', xl: '450px' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          <Flex w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Thông báo
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={textColorBrand}
              ms="auto"
              cursor="pointer"
            >
              Đánh dấu đã đọc
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <MenuItem
              _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}
              _focus={{ bg: 'none' }}
              px="12px"
              py="10px"
              borderRadius="8px"
              mb="6px"
            >
              <Flex gap="10px" align="center">
                <Icon as={MdNotificationsActive} color="blue.400" />
                <Box>
                  <Text fontSize="sm" fontWeight="600">Có voucher mới</Text>
                  <Text fontSize="xs" color="gray.400">Voucher SUM2026 vừa được tạo</Text>
                </Box>
              </Flex>
            </MenuItem>
            <MenuItem
              _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}
              _focus={{ bg: 'none' }}
              px="12px"
              py="10px"
              borderRadius="8px"
            >
              <Flex gap="10px" align="center">
                <Icon as={MdNotificationsActive} color="green.400" />
                <Box>
                  <Text fontSize="sm" fontWeight="600">Đã có 50 lượt dùng voucher</Text>
                  <Text fontSize="xs" color="gray.400">Voucher GAUPHIM50 đạt 50%</Text>
                </Box>
              </Flex>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>

      {/* ── Info ── */}
      <Menu>
        <MenuButton p="0px">
          <Icon 
            mt="6px" 
            as={MdInfoOutline} 
            color={navbarIcon} 
            w="18px" 
            h="18px" 
            me="10px" 
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          me={{ base: '30px', md: 'unset' }}
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          minW={{ base: 'unset' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          <Flex flexDirection="column" gap="2">
            <Text fontSize="sm" fontWeight="600" color={textColor}>
              Thông tin hệ thống
            </Text>
            <Text fontSize="xs" color="gray.400">
              Version 2.0.1
            </Text>
            <Text fontSize="xs" color="gray.400">
              © 2024 Gấu Phim
            </Text>
          </Flex>
        </MenuList>
      </Menu>

      {/* ── Dark mode toggle ── */}
      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>

      {/* ── User menu ── */}
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name={fullname}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          {/* User info header */}
          <Flex w="100%" mb="0px">
            <Flex
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              flexDirection="column"
              gap="2px"
            >
              <Text fontSize="sm" fontWeight="700" color={textColor}>
                👋&nbsp; Xin chào, {fullname}
              </Text>
              {role && (
                <Text fontSize="xs" color="gray.400" fontWeight="500">
                  {role}
                </Text>
              )}
            </Flex>
          </Flex>

          <Flex flexDirection="column" p="10px">
            {/* Profile */}
            <MenuItem
              _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}
              _focus={{ bg: 'none' }}
              borderRadius="8px"
              px="14px"
              py="8px"
              onClick={() => navigate('/admin/he-thong/profile')}
            >
              <Flex align="center" gap="3">
                <Icon as={MdInfoOutline} />
                <Text fontSize="sm">Trang cá nhân</Text>
              </Flex>
            </MenuItem>

            {/* Change password */}
            <MenuItem
              _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}
              _focus={{ bg: 'none' }}
              borderRadius="8px"
              px="14px"
              py="8px"
              onClick={() => navigate('/admin/he-thong/doi-mat-khau')}
            >
              <Flex align="center" gap="3">
                <Icon as={MdInfoOutline} />
                <Text fontSize="sm">Đổi mật khẩu</Text>
              </Flex>
            </MenuItem>

            <Box borderBottom="1px solid" borderColor={borderColor} my="4px" />

            {/* Logout */}
            <MenuItem
              _hover={{ bg: 'red.50' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              py="8px"
              onClick={handleLogout}
            >
              <Flex align="center" gap="3">
                <Icon as={MdInfoOutline} />
                <Text fontSize="sm" fontWeight="600">Đăng xuất</Text>
              </Flex>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

// ─── PropTypes ────────────────────────────────────────────────────────────
AdminNavbarLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  value: PropTypes.string,
};