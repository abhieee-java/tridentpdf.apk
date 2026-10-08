import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type DocumentType =
  | 'docx'
  | 'doc'
  | 'xlsx'
  | 'xls'
  | 'csv'
  | 'pptx'
  | 'ppt'
  | 'pdf'
  | 'txt';

export interface FormatBadgeProps {
  type: DocumentType | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface FormatMeta {
  letter: string;
  label: string;
  bgColor: string;
  secondaryBg: string;
}

export const getFormatMeta = (rawType: string): FormatMeta => {
  const t = rawType.toLowerCase().replace('.', '');
  switch (t) {
    case 'docx':
    case 'doc':
      return {
        letter: 'W',
        label: t.toUpperCase(),
        bgColor: '#2563EB',
        secondaryBg: '#1D4ED8',
      };
    case 'xlsx':
    case 'xls':
      return {
        letter: 'S',
        label: t.toUpperCase(),
        bgColor: '#16A34A',
        secondaryBg: '#15803D',
      };
    case 'csv':
      return {
        letter: 'X',
        label: 'CSV',
        bgColor: '#16A34A',
        secondaryBg: '#15803D',
      };
    case 'pptx':
    case 'ppt':
      return {
        letter: 'P',
        label: t.toUpperCase(),
        bgColor: '#EA580C',
        secondaryBg: '#C2410C',
      };
    case 'pdf':
      return {
        letter: 'PDF',
        label: 'PDF',
        bgColor: '#DC2626',
        secondaryBg: '#B91C1C',
      };
    case 'txt':
    default:
      return {
        letter: 'TXT',
        label: 'TXT',
        bgColor: '#64748B',
        secondaryBg: '#475569',
      };
  }
};

export const FormatBadge: React.FC<FormatBadgeProps> = ({
  type,
  size = 'md',
  showLabel = false,
}) => {
  const meta = getFormatMeta(type);

  const dimensions =
    size === 'sm'
      ? { width: 32, height: 32, radius: 8, fontSize: 13, labelSize: 7.5 }
      : size === 'lg'
      ? { width: 56, height: 56, radius: 14, fontSize: 22, labelSize: 10 }
      : { width: 44, height: 44, radius: 11, fontSize: 17, labelSize: 9 };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.badgeBox,
          {
            width: dimensions.width,
            height: dimensions.height,
            borderRadius: dimensions.radius,
            backgroundColor: meta.bgColor,
          },
        ]}
      >
        <View style={styles.glossHighlight} />
        <Text
          style={[
            styles.letter,
            {
              fontSize:
                meta.letter.length > 2
                  ? dimensions.fontSize * 0.62
                  : dimensions.fontSize,
            },
          ]}
        >
          {meta.letter}
        </Text>
      </View>
      {showLabel && (
        <Text
          style={[
            styles.badgeLabel,
            { fontSize: dimensions.labelSize, color: meta.bgColor },
          ]}
        >
          {meta.label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 3,
  },
  badgeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  glossHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  letter: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  badgeLabel: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
