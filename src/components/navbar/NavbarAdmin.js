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

	const { secondary, message, brandText } = props;

	// Color tokens
	const mainText = useColorModeValue('navy.700', 'white');
	const secondaryText = useColorModeValue('gray.500', 'whiteAlpha.600');
	const accentColor = useColorModeValue('blue.500', 'cyan.300');

	// Scrolled vs resting states
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

	// Brand text gradient
	const brandGradient = useColorModeValue(
		'linear(to-r, navy.700, blue.500, cyan.400)',
		'linear(to-r, white, cyan.300, blue.300)'
	);

	return (
		<Box
			position='fixed'
			boxShadow={navbarShadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			backdropFilter='blur(24px) saturate(1.8)'
			backgroundPosition='center'
			backgroundSize='cover'
			borderRadius='20px'
			borderWidth='1.5px'
			borderStyle='solid'
			transition='box-shadow 0.35s ease, background 0.35s ease, border-color 0.35s ease, transform 0.4s cubic-bezier(.22,1,.36,1), opacity 0.4s ease'
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH='72px'
			justifyContent={{ xl: 'center' }}
			lineHeight='25.6px'
			mx='auto'
			mt='0px'
			pb='8px'
			right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			px={{ sm: '15px', md: '10px' }}
			ps={{ xl: '12px' }}
			pt='8px'
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
				borderColor: useColorModeValue('rgba(99,179,237,0.45)', 'rgba(99,179,237,0.3)'),
				boxShadow: scrolled
					? useColorModeValue(
							'0 12px 40px rgba(99,179,237,0.18), 0 2px 8px rgba(112,144,176,0.14)',
							'0 12px 40px rgba(0,0,0,0.42), 0 2px 8px rgba(99,179,237,0.15)'
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
					'linear-gradient(90deg, transparent, rgba(99,179,237,0.45), transparent)'
				),
				opacity: scrolled ? 1 : 0,
				transition: 'opacity 0.35s ease',
			}}
		>
			<Flex
				w='100%'
				flexDirection={{ sm: 'column', md: 'row' }}
				alignItems={{ xl: 'center' }}
				mb='0px'
			>
				{/* Left: Breadcrumb + Brand */}
				<Box mb={{ sm: '8px', md: '0px' }}>
					{/* Breadcrumb */}
					<Breadcrumb
						separator={
							<Text as='span' color={secondaryText} fontSize='10px' mx='1px'>
								›
							</Text>
						}
					>
						<BreadcrumbItem color={secondaryText} fontSize='xs' mb='3px'>
							<BreadcrumbLink
								href='#'
								color={secondaryText}
								letterSpacing='0.04em'
								textTransform='uppercase'
								fontSize='10px'
								fontWeight='600'
								transition='color 0.2s'
								_hover={{ color: accentColor, textDecoration: 'none' }}
							>
								Pages
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem color={secondaryText} fontSize='xs' mb='3px'>
							<BreadcrumbLink
								href='#'
								color={secondaryText}
								letterSpacing='0.04em'
								textTransform='uppercase'
								fontSize='10px'
								fontWeight='600'
								transition='color 0.2s'
								_hover={{ color: accentColor, textDecoration: 'none' }}
							>
								{brandText}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>

					{/* Brand Title with shimmer effect */}
					<Link
						href='#'
						bg='inherit'
						borderRadius='inherit'
						fontSize='28px'
						fontWeight='800'
						letterSpacing='-0.5px'
						lineHeight='1.2'
						display='inline-block'
						bgGradient={brandGradient}
						bgClip='text'
						bgSize='200% auto'
						transition='all 0.3s ease'
						_hover={{
							animation: `${shimmer} 1.4s linear`,
							opacity: 0.85,
							textDecoration: 'none',
						}}
						_active={{ bg: 'inherit', transform: 'none', borderColor: 'transparent' }}
						_focus={{ boxShadow: 'none' }}
					>
						{brandText}
					</Link>
				</Box>

				{/* Right: Navbar links */}
				<Box ms='auto' w={{ sm: '100%', md: 'unset' }}>
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
					color='white'
					fontSize='sm'
					fontWeight='500'
					mt='4px'
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
};