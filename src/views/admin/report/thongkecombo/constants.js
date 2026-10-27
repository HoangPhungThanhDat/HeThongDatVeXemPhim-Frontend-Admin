
import { keyframes } from '@chakra-ui/react';
import { MdFastfood, MdLocalDrink, MdLunchDining } from 'react-icons/md';
import { FaUtensils } from 'react-icons/fa';

export const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
export const scaleIn = keyframes`from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); }`;
export const pulse = keyframes`0%, 100% { box-shadow: 0 0 0 0 rgba(74,158,255,0.4); } 50% { box-shadow: 0 0 0 8px rgba(74,158,255,0); }`;
export const float = keyframes`0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); }`;

export const DARK_THEME = {
  bg: '#0a1628', cardBg: '#0f1f3a', border: '#1a3a5c', text: '#e8f4f8',
  textSecondary: '#88b4d8', labelColor: '#5a8ab5', inputBg: '#0a1f35',
  inputBorder: '#1a3a5c', hoverBg: '#142d4f', accent: '#4a9eff',
  accentLight: '#6ab0ff', accentShadow: 'rgba(74, 158, 255, 0.25)',
};

export const OR = '#ea580c'; 
export const ORL = '#fb923c'; 
export const ORPL = '#fff7ed'; 
export const ORSW = 'rgba(234,88,12,0.2)';
export const GREEN = '#059669'; 
export const BLUE = '#2563eb'; 
export const PURPLE = '#7c3aed'; 
export const PINK = '#db2777';
export const DARK_ACCENT = DARK_THEME.accent; 
export const DARK_ACCENT_SHADOW = DARK_THEME.accentShadow; 
export const DARK_ACCENT_LIGHT = DARK_THEME.accentLight;

export const getColors = (isDark) => ({
  bgPage: isDark ? DARK_THEME.bg : '#f8fafc',
  bgCard: isDark ? DARK_THEME.cardBg : 'white',
  bgCardHover: isDark ? DARK_THEME.hoverBg : '#f8fafc',
  bgInput: isDark ? DARK_THEME.inputBg : '#fafafa',
  borderCard: isDark ? DARK_THEME.border : '#f1f5f9',
  textPrimary: isDark ? DARK_THEME.text : '#0f172a',
  textSecondary: isDark ? DARK_THEME.textSecondary : '#64748b',
  textMuted: isDark ? DARK_THEME.labelColor : '#94a3b8',
  shadow: isDark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
});

export const CATEGORY_CONFIG = {
  Bắp: { icon: MdFastfood, color: DARK_ACCENT },
  'Nước ngọt': { icon: MdLocalDrink, color: BLUE },
  Combo: { icon: FaUtensils, color: PURPLE },
  Snack: { icon: MdLunchDining, color: PINK },
};