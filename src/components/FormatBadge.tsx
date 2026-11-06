import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily } from '../theme/typography';

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
        bgColor: '#007AFF',
        secondaryBg: '#0051D5',
      };
    case 'xlsx':
    case 'xls':
      return {
        letter: 'S',
        label: t.toUpperCase(),
        bgColor: '#34C759',
        secondaryBg: '#28A745',
      };
    case 'csv':
      return {
        letter: 'X',
        label: 'CSV',
        bgColor: '#30D158',
        secondaryBg: '#28A745',
      };
    case 'pptx':
    case 'ppt':
      return {
        letter: 'P',
        label: t.toUpperCase(),
        bgColor: '#FF9500',
        secondaryBg: '#D97706',
      };
    case 'pdf':
      return {
        letter: 'PDF',
        label: 'PDF',
        bgColor: '#FF3B30',
        secondaryBg: '#DC2626',
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
      ? { width: 34, height: 34, radius: 9, fontSize: 13, labelSize: 8 }
      : size === 'lg'
      ? { width: 56, height: 56, radius: 15, fontSize: 22, labelSize: 10 }
      : { width: 44, height: 44, radius: 12, fontSize: 16, labelSize: 9 };

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
        {/* Specular top highlight */}
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
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glossHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  letter: {
    fontFamily: FontFamily.sans,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  badgeLabel: {
    fontFamily: FontFamily.mono,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
