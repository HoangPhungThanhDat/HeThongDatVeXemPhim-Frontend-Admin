// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  useColorModeValue,
  keyframes,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { useLocation } from 'react-router-dom';

// Keyframe animations
const shimmer = keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
`;

const fadeSlideDown = keyframes`
    0% { opacity: 0; transform: translateY(-8px); }
    100% { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
    0%, 100% { box-shadow: 0 0 0px rgba(99, 179, 237, 0); }
    50% { box-shadow: 0 0 18px rgba(99, 179, 237, 0.18); }
`;

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const prevScrollY = useRef(0);
  const location = useLocation();

  // Màu sắc
  const mainText = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'whiteAlpha.600');
  const accentColor = useColorModeValue('blue.500', 'cyan.300');
  const brandGradient = useColorModeValue(
    'linear(to-r, navy.700, blue.500, cyan.400)',
    'linear(to-r, white, cyan.300, blue.300)'
  );
  const navbarBg = useColorModeValue(
    scrolled ? 'rgba(255, 255, 255, 0.82)' : 'rgba(244, 247, 254, 0.55)',
    scrolled ? 'rgba(11, 20, 55, 0.82)' : 'rgba(11, 20, 55, 0.45)'
  );
  const navbarBorder = useColorModeValue(
    scrolled ? 'rgba(200, 215, 240, 0.9)' : 'rgba(200, 215, 240, 0.4)',
    scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'
  );
  const navbarShadow = scrolled
    ? useColorModeValue(
        '0 8px 32px rgba(112, 144, 176, 0.18), 0 1.5px 4px rgba(112,144,176,0.10)',
        '0 8px 32px rgba(0,0,0,0.35), 0 1.5px 4px rgba(0,0,0,0.18)'
      )
    : 'none';
  const hoverBorderColor = useColorModeValue(
    'rgba(99,179,237,0.45)',
    'rgba(99,179,237,0.3)'
  );
  const hoverBoxShadow = scrolled
    ? useColorModeValue(
        '0 12px 40px rgba(99,179,237,0.18), 0 2px 8px rgba(112,144,176,0.14)',
        '0 12px 40px rgba(0,0,0,0.42), 0 2px 8px rgba(99,179,237,0.15)'
      )
    : '0 0 0 2px rgba(99,179,237,0.12)';
  const beforeBg = useColorModeValue(
    'linear-gradient(90deg, transparent, rgba(99,179,237,0.6), transparent)',
    'linear-gradient(90deg, transparent, rgba(99,179,237,0.45), transparent)'
  );

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    const changeNavbar = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 1);
      prevScrollY.current = currentY;
    };
    window.addEventListener('scroll', changeNavbar);
    return () => {
      window.removeEventListener('scroll', changeNavbar);
      clearTimeout(timer);
    };
  }, []);

  // ✅ TỐI ƯU HÓA TÍNH TOÁN BẰNG USEMEMO (Chỉ chạy khi URL đổi)
  const { currentTitle, breadcrumbItems } = useMemo(() => {
    if (props.brandText) {
      return {
        currentTitle: props.brandText,
        breadcrumbItems: [{ label: 'Dashboard', path: '/admin/dashboard' }],
      };
    }

    const path = location.pathname;
    const titleMap = {
      '/admin/dashboard': 'Dashboard',
      '/admin/quan-ly-phim': 'Quản lý Phim',
      '/admin/phim': 'Quản lý Phim',
      '/admin/rap-chieu': 'Quản lý Rạp',
      '/admin/rap': 'Quản lý Rạp',
      '/admin/khach-hang': 'Quản lý Khách hàng',
      '/admin/hoa-don': 'Quản lý Hóa đơn',
      '/admin/thong-ke': 'Thống kê',
      '/admin/nghe-si': 'Diễn viên & Đạo diễn',
      '/admin/dien-vien': 'Quản lý Diễn viên',
      '/admin/dao-dien': 'Quản lý Đạo diễn',
      '/admin/noi-dung/khuyen-mai': 'Khuyến mãi & Sự kiện',
      '/admin/noi-dung/khuyen-mai/create': 'Tạo khuyến mãi',
      '/admin/noi-dung/khuyen-mai/edit': 'Sửa khuyến mãi',
      '/admin/noi-dung/khuyen-mai/detail': 'Chi tiết khuyến mãi',
      '/admin/noi-dung/banner': 'Quản lý Banner',
      '/admin/noi-dung/banner/create': 'Tạo banner',
      '/admin/noi-dung/banner/edit': 'Sửa banner',
      '/admin/noi-dung/tin-tuc': 'Quản lý Tin tức',
      '/admin/noi-dung/tin-tuc/create': 'Tạo tin tức',
      '/admin/noi-dung/tin-tuc/edit': 'Sửa tin tức',
      '/admin/the-loai': 'Thể loại phim',
      '/admin/quoc-gia': 'Quốc gia',
      '/admin/suat-chieu': 'Suất chiếu',
      '/admin/he-thong/profile': 'Trang cá nhân',
      '/admin/he-thong/doi-mat-khau': 'Đổi mật khẩu',
    };

    let matchedTitle = null;
    let matchedLength = 0;

    for (const [route, title] of Object.entries(titleMap)) {
      if (path.includes(route) && route.length > matchedLength) {
        matchedTitle = title;
        matchedLength = route.length;
      }
    }

    const segments = path.split('/').filter(Boolean);
    const cleanSegments = segments.filter((seg) => seg !== 'admin');

    const labelMap = {
      'dashboard': 'Dashboard',
      'quan-ly-phim': 'Phim',
      'phim': 'Phim',
      'rap-chieu': 'Rạp',
      'rap': 'Rạp',
      'khach-hang': 'Khách hàng',
      'hoa-don': 'Hóa đơn',
      'thong-ke': 'Thống kê',
      'nghe-si': 'Nghệ sĩ',
      'dien-vien': 'Diễn viên',
      'dao-dien': 'Đạo diễn',
      'the-loai': 'Thể loại',
      'quoc-gia': 'Quốc gia',
      'suat-chieu': 'Suất chiếu',
      'noi-dung': 'Nội dung',
      'khuyen-mai': 'Khuyến mãi',
      'banner': 'Banner',
      'tin-tuc': 'Tin tức',
      'create': 'Tạo mới',
      'edit': 'Sửa',
      'detail': 'Chi tiết',
      'he-thong': 'Hệ thống',
      'profile': 'Trang cá nhân',
      'doi-mat-khau': 'Đổi mật khẩu',
    };

    const items = cleanSegments.length === 0
      ? [{ label: 'Dashboard', path: '/admin/dashboard' }]
      : cleanSegments.map((seg, index) => {
          const label = labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
          return { label, path: '/admin/' + cleanSegments.slice(0, index + 1).join('/') };
        });

    let finalTitle = matchedTitle;
    if (!finalTitle) {
      const lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment !== 'admin') {
        finalTitle = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
      } else {
        finalTitle = 'Gấu Phim Admin';
      }
    }

    return { currentTitle: finalTitle, breadcrumbItems: items };
  }, [location.pathname, props.brandText]);

  const { secondary, message } = props;

  return (
    <Box
      position="fixed"
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      backdropFilter="blur(24px) saturate(1.8)"
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="20px"
      borderWidth="1.5px"
      borderStyle="solid"
      transition="box-shadow 0.35s ease, background 0.35s ease, border-color 0.35s ease, transform 0.4s cubic-bezier(.22,1,.36,1), opacity 0.4s ease"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="72px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt="0px"
      pb="8px"
      right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
      px={{ sm: '15px', md: '10px' }}
      ps={{ xl: '12px' }}
      pt="8px"
      top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
      w={{
        base: 'calc(100vw - 6%)',
        md: 'calc(100vw - 8%)',
        lg: 'calc(100vw - 6%)',
        xl: 'calc(100vw - 350px)',
        '2xl': 'calc(100vw - 365px)',
      }}
      opacity={visible ? 1 : 0}
      transform={visible ? 'translateY(0)' : 'translateY(-12px)'}
      _hover={{
        borderColor: hoverBorderColor,
        boxShadow: hoverBoxShadow,
      }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        borderRadius: '0 0 8px 8px',
        background: beforeBg,
        opacity: scrolled ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
    >
      <Flex
        w="100%"
        flexDirection={{ sm: 'column', md: 'row' }}
        alignItems={{ xl: 'center' }}
        mb="0px"
      >
        <Box mb={{ sm: '8px', md: '0px' }}>
          <Breadcrumb
            separator={
              <Text as="span" color={secondaryText} fontSize="10px" mx="1px">
                ›
              </Text>
            }
          >
            <BreadcrumbItem color={secondaryText} fontSize="xs" mb="3px">
              <BreadcrumbLink
                href="#"
                color={secondaryText}
                letterSpacing="0.04em"
                textTransform="uppercase"
                fontSize="10px"
                fontWeight="600"
                transition="color 0.2s"
                _hover={{ color: accentColor, textDecoration: 'none' }}
                onClick={(e) => e.preventDefault()}
              >
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <BreadcrumbItem
                  key={index}
                  color={isLast ? accentColor : secondaryText}
                  fontSize="xs"
                  mb="3px"
                >
                  <BreadcrumbLink
                    href="#"
                    color={isLast ? accentColor : secondaryText}
                    letterSpacing="0.04em"
                    textTransform="uppercase"
                    fontSize="10px"
                    fontWeight={isLast ? '700' : '600'}
                    transition="color 0.2s"
                    _hover={{ color: accentColor, textDecoration: 'none' }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        </Box>

        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>

      {secondary ? (
        <Text
          color="white"
          fontSize="sm"
          fontWeight="500"
          mt="4px"
          opacity={0.9}
        >
          {message}
        </Text>
      ) : null}
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
  message: PropTypes.string,
  logoText: PropTypes.string,
};