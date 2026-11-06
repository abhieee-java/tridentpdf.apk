export const Palette = {
  blue600: '#2563EB',
  blue500: '#007AFF',
  cyan500: '#06B6D4',
  cyan400: '#22D3EE',
  emerald500: '#10B981',
  amber500: '#F59E0B',
  rose500: '#EF4444',
  purple500: '#8B5CF6',
  indigo500: '#6366F1',
};

export const darkTheme = {
  isDark: true,
  bg: '#000000',
  surface: '#09090E',
  surfaceElevated: '#121217',
  surfaceCard: '#121218',
  cardGlow: 'rgba(0, 122, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  borderHighlight: 'rgba(0, 122, 255, 0.4)',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryGradient: ['#007AFF', '#06B6D4'] as [string, string],
  accent: '#06B6D4',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

export const lightTheme = {
  isDark: false,
  bg: '#F7F7F8',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F3F5',
  surfaceCard: '#FFFFFF',
  cardGlow: 'rgba(0, 0, 0, 0.03)',
  border: 'rgba(0, 0, 0, 0.06)',
  borderStrong: 'rgba(0, 0, 0, 0.12)',
  borderHighlight: 'rgba(0, 122, 255, 0.3)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryGradient: ['#007AFF', '#06B6D4'] as [string, string],
  accent: '#06B6D4',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

export type Theme = typeof darkTheme;

export const MOTION_TOKENS = {
  springSnappy: { tension: 120, friction: 8 },
  springFluid: { tension: 90, friction: 8 },
  springGentle: { tension: 70, friction: 7 },
};
