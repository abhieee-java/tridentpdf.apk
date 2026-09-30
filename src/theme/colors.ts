export const Palette = {
  blue600: '#2563EB',
  blue500: '#3B82F6',
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
  bg: '#000000', // Pure black like tridentpdf.vercel.app dark:bg-black
  surface: '#0A0A0E',
  surfaceElevated: '#121217',
  surfaceCard: '#13131A',
  cardGlow: 'rgba(37, 99, 235, 0.08)',
  border: '#27272A',
  borderHighlight: 'rgba(37, 99, 235, 0.4)',
  textPrimary: '#F8FAFC',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  primary: '#2563EB',
  primaryGradient: ['#2563EB', '#06B6D4'],
  accent: '#06B6D4',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

export const lightTheme = {
  isDark: false,
  bg: '#F7F7F8', // Exactly like tridentpdf.vercel.app bg-[#F7F7F8]
  surface: '#FFFFFF',
  surfaceElevated: '#F1F3F5',
  surfaceCard: '#FFFFFF',
  cardGlow: 'rgba(0, 0, 0, 0.03)',
  border: '#EBE7F7',
  borderHighlight: 'rgba(37, 99, 235, 0.3)',
  textPrimary: '#1F1F24', // Exactly like tridentpdf.vercel.app text-[#1F1F24]
  textSecondary: '#52525B',
  textMuted: '#A1A1AA',
  primary: '#2563EB',
  primaryGradient: ['#2563EB', '#06B6D4'],
  accent: '#06B6D4',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

export type Theme = typeof darkTheme;
