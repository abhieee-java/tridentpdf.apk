import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { FontFamily } from '../theme/typography';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string | null;
  badgeColor?: string;
  iconBg?: string;
  iconColor?: string;
  isNew?: boolean;
  isAi?: boolean;
  onPress: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  badge,
  badgeColor = '#007AFF',
  iconBg = 'rgba(0, 122, 255, 0.1)',
  iconColor = '#007AFF',
  isNew,
  isAi,
  onPress,
}) => {
  const { theme, isDark } = useAppTheme();

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#111118' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
      activeOpacity={0.72}
      onPress={handlePress}
    >
      <View style={styles.contentWrap}>
        {/* Top Header: Icon & Badge */}
        <View style={styles.topRow}>
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            <Text style={styles.iconEmoji}>{icon}</Text>
          </View>

          {isNew ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isDark ? 'rgba(6, 182, 212, 0.15)' : '#ECFEFF',
                  borderColor: 'rgba(6, 182, 212, 0.35)',
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: '#06B6D4' }]}>NEW</Text>
            </View>
          ) : isAi ? (
            <View
              style={[
                styles.badge,
                styles.aiBadge,
                {
                  backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF',
                  borderColor: 'rgba(139, 92, 246, 0.35)',
                },
              ]}
            >
              <Sparkles size={9} color="#8B5CF6" />
              <Text style={[styles.badgeText, { color: '#8B5CF6' }]}>AI</Text>
            </View>
          ) : badge ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: `${badgeColor}15`,
                  borderColor: `${badgeColor}35`,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
            </View>
          ) : null}
        </View>

        {/* Title & Description */}
        <View style={styles.textWrap}>
          <Text
            style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        </View>
      </View>

      {/* Bottom Action Footer */}
      <View
        style={[
          styles.footer,
          {
            borderTopColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
          },
        ]}
      >
        <Text style={[styles.footerText, { color: isDark ? '#38BDF8' : '#007AFF' }]}>
          OPEN
        </Text>
        <ArrowRight size={12} color={isDark ? '#38BDF8' : '#007AFF'} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    margin: '1.25%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 148,
  },
  contentWrap: {
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  badgeText: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textWrap: {
    gap: 2,
  },
  title: {
    fontFamily: FontFamily.sans,
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  description: {
    fontFamily: FontFamily.sans,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: -0.1,
  },
  footer: {
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontFamily: FontFamily.mono,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
