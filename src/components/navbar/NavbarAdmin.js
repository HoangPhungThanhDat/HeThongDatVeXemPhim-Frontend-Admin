// Chakra Imports
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Flex,
	Link,
	Text,
	useColorModeValue,
	keyframes,
  } from '@chakra-ui/react';
  import PropTypes from 'prop-types';
  import React, { useState, useEffect, useRef } from 'react';
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
  
	// ── Xác định tiêu đề trang từ route ──
	const getPageTitle = () => {
	  // Nếu có brandText từ props thì ưu tiên dùng
	  if (props.brandText) return props.brandText;
  
	  const path = location.pathname;
  
	  // Mapping đường dẫn sang tiêu đề (cập nhật đầy đủ)
	  const titleMap = {
		// Dashboard
		'/admin/dashboard': 'Dashboard',
		
		// Voucher
		'/admin/voucher': 'Quản lý Voucher',
		'/admin/quan-ly-voucher': 'Quản lý Voucher',
		
		// Phim
		'/admin/phim': 'Quản lý Phim',
		
		// Rạp
		'/admin/rap': 'Quản lý Rạp',
		
		// Khách hàng
		'/admin/khach-hang': 'Quản lý Khách hàng',
		
		// Hóa đơn
		'/admin/hoa-don': 'Quản lý Hóa đơn',
		
		// Thống kê
		'/admin/thong-ke': 'Thống kê',
		
		// Nghệ sĩ
		'/admin/nghe-si': 'Diễn viên & Đạo diễn',
		'/admin/dien-vien': 'Quản lý Diễn viên',
		'/admin/dao-dien': 'Quản lý Đạo diễn',
		
		// Nội dung - Khuyến mãi
		'/admin/noi-dung/khuyen-mai': 'Khuyến mãi & Sự kiện',
		'/admin/noi-dung/khuyen-mai/create': 'Tạo khuyến mãi',
		'/admin/noi-dung/khuyen-mai/edit': 'Sửa khuyến mãi',
		'/admin/noi-dung/khuyen-mai/detail': 'Chi tiết khuyến mãi',
		
		// Nội dung - Banner
		'/admin/noi-dung/banner': 'Quản lý Banner',
		'/admin/noi-dung/banner/create': 'Tạo banner',
		'/admin/noi-dung/banner/edit': 'Sửa banner',
		
		// Nội dung - Tin tức
		'/admin/noi-dung/tin-tuc': 'Quản lý Tin tức',
		'/admin/noi-dung/tin-tuc/create': 'Tạo tin tức',
		'/admin/noi-dung/tin-tuc/edit': 'Sửa tin tức',
		
		// Nội dung - Thể loại
		'/admin/the-loai': 'Thể loại phim',
		'/admin/quoc-gia': 'Quốc gia',
		
		// Suất chiếu
		'/admin/suat-chieu': 'Suất chiếu',
		
		// Hệ thống
		'/admin/he-thong/profile': 'Trang cá nhân',
		'/admin/he-thong/doi-mat-khau': 'Đổi mật khẩu',
	  };
  
	  // Tìm title phù hợp - ưu tiên đường dẫn dài hơn
	  let matchedTitle = null;
	  let matchedLength = 0;
	  
	  for (const [route, title] of Object.entries(titleMap)) {
		if (path.includes(route) && route.length > matchedLength) {
		  matchedTitle = title;
		  matchedLength = route.length;
		}
	  }
	  
	  if (matchedTitle) return matchedTitle;
  
	  // Lấy tên từ path nếu không có mapping
	  const pathSegments = path.split('/').filter(Boolean);
	  const lastSegment = pathSegments[pathSegments.length - 1];
	  if (lastSegment && lastSegment !== 'admin') {
		return (
		  lastSegment.charAt(0).toUpperCase() +
		  lastSegment.slice(1).replace(/-/g, ' ')
		);
	  }
  
	  return 'Gấu Phim Admin';
	};
  
	// ── Lấy breadcrumb items ──
	const getBreadcrumbItems = () => {
	  const path = location.pathname;
	  const segments = path.split('/').filter(Boolean);
  
	  // Bỏ qua 'admin' nếu có
	  const cleanSegments = segments.filter((seg) => seg !== 'admin');
  
	  if (cleanSegments.length === 0) {
		return [{ label: 'Dashboard', path: '/admin/dashboard' }];
	  }
  
	  // Mapping cho breadcrumb
	  const labelMap = {
		'dashboard': 'Dashboard',
		'voucher': 'Voucher',
		'quan-ly-voucher': 'Voucher',
		'phim': 'Phim',
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
  
	  return cleanSegments.map((seg, index) => {
		const label = labelMap[seg] || 
		  seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
		const path = '/admin/' + cleanSegments.slice(0, index + 1).join('/');
		return { label, path };
	  });
	};
  
	useEffect(() => {
	  // Trigger entry animation
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
  
	const { secondary, message } = props;
  
	// Color tokens
	const mainText = useColorModeValue('navy.700', 'white');
	const secondaryText = useColorModeValue('gray.500', 'whiteAlpha.600');
	const accentColor = useColorModeValue('blue.500', 'cyan.300');
  
	// Scrolled vs resting states
	const navbarBg = useColorModeValue(
	  scrolled ? 'rgba(255, 255, 255, 0.82)' : 'rgba(244, 247, 254, 0.55)',
	  scrolled ? 'rgba(11, 20, 55, 0.82)' : 'rgba(11, 20, 55, 0.45)',
	);
	const navbarBorder = useColorModeValue(
	  scrolled ? 'rgba(200, 215, 240, 0.9)' : 'rgba(200, 215, 240, 0.4)',
	  scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
	);
	const navbarShadow = scrolled
	  ? useColorModeValue(
		  '0 8px 32px rgba(112, 144, 176, 0.18), 0 1.5px 4px rgba(112,144,176,0.10)',
		  '0 8px 32px rgba(0,0,0,0.35), 0 1.5px 4px rgba(0,0,0,0.18)',
		)
	  : 'none';
  
	// Brand text gradient
	const brandGradient = useColorModeValue(
	  'linear(to-r, navy.700, blue.500, cyan.400)',
	  'linear(to-r, white, cyan.300, blue.300)',
	);
  
	const currentTitle = getPageTitle();
	const breadcrumbItems = getBreadcrumbItems();
  
	// Debug: In ra đường dẫn và tiêu đề
	console.log('Current Path:', location.pathname);
	console.log('Current Title:', currentTitle);
	console.log('Breadcrumb Items:', breadcrumbItems);
  
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
		// Entry animation via CSS
		opacity={visible ? 1 : 0}
		transform={visible ? 'translateY(0)' : 'translateY(-12px)'}
		// Glow ring on hover
		_hover={{
		  borderColor: useColorModeValue(
			'rgba(99,179,237,0.45)',
			'rgba(99,179,237,0.3)',
		  ),
		  boxShadow: scrolled
			? useColorModeValue(
				'0 12px 40px rgba(99,179,237,0.18), 0 2px 8px rgba(112,144,176,0.14)',
				'0 12px 40px rgba(0,0,0,0.42), 0 2px 8px rgba(99,179,237,0.15)',
			  )
			: '0 0 0 2px rgba(99,179,237,0.12)',
		}}
		// Thin top accent line
		_before={{
		  content: '""',
		  position: 'absolute',
		  top: 0,
		  left: '10%',
		  right: '10%',
		  height: '2px',
		  borderRadius: '0 0 8px 8px',
		  background: useColorModeValue(
			'linear-gradient(90deg, transparent, rgba(99,179,237,0.6), transparent)',
			'linear-gradient(90deg, transparent, rgba(99,179,237,0.45), transparent)',
		  ),
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
		  {/* Left: Breadcrumb + Brand */}
		  <Box mb={{ sm: '8px', md: '0px' }}>
			{/* Breadcrumb */}
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
  
		  {/* Right: Navbar links */}
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