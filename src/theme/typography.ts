import { Platform, TextStyle } from 'react-native';

export const FontFamily = {
  sans: Platform.select({
    ios: 'System',
    android: 'Inter-Regular',
    default: 'sans-serif',
  }),
  sansMedium: Platform.select({
    ios: 'System',
    android: 'Inter-Medium',
    default: 'sans-serif',
  }),
  sansSemiBold: Platform.select({
    ios: 'System',
    android: 'Inter-SemiBold',
    default: 'sans-serif',
  }),
  sansBold: Platform.select({
    ios: 'System',
    android: 'Inter-Bold',
    default: 'sans-serif',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const Typography: Record<string, TextStyle> = {
  largeTitle: {
    fontFamily: FontFamily.sansBold,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  title1: {
    fontFamily: FontFamily.sansBold,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  title2: {
    fontFamily: FontFamily.sansBold,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  title3: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  headline: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: FontFamily.sans,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.1,
    lineHeight: 20,
  },
  callout: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  subhead: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },
  footnote: {
    fontFamily: FontFamily.sans,
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  monoMeta: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0,
  },
  badgeText: {
    fontFamily: FontFamily.sansBold,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
};
