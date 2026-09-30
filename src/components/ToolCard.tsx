import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';
import { ArrowRight, Sparkles } from 'lucide-react-native';

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
  badgeColor = '#2563EB',
  iconBg = 'rgba(37, 99, 235, 0.1)',
  iconColor = '#2563EB',
  isNew,
  isAi,
  onPress,
}) => {
  const { theme, isDark } = useAppTheme();

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#11111B' : '#FFFFFF',
          borderColor: isDark ? '#27272A' : '#EBE7F7',
        },
      ]}
      activeOpacity={0.78}
      onPress={handlePress}
    >
      <View style={styles.contentWrap}>
        {/* Top Header: Icon & Badge */}
        <View style={styles.topRow}>
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            <Text style={styles.iconEmoji}>{icon}</Text>
          </View>

          {isNew ? (
            <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(6, 182, 212, 0.2)' : '#ECFEFF', borderColor: 'rgba(6, 182, 212, 0.35)' }]}>
              <Text style={[styles.badgeText, { color: '#06B6D4' }]}>NEW</Text>
            </View>
          ) : isAi ? (
            <View style={[styles.badge, styles.aiBadge, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#F5F3FF', borderColor: 'rgba(139, 92, 246, 0.35)' }]}>
              <Sparkles size={9} color="#8B5CF6" />
              <Text style={[styles.badgeText, { color: '#8B5CF6' }]}>AI</Text>
            </View>
          ) : badge ? (
            <View style={[styles.badge, { backgroundColor: `${badgeColor}15`, borderColor: `${badgeColor}30` }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
            </View>
          ) : null}
        </View>

        {/* Title & Description */}
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {description}
          </Text>
        </View>
      </View>

      {/* Bottom Action Footer */}
      <View style={[styles.footer, { borderTopColor: isDark ? '#1E1E28' : '#F1F3F5' }]}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>Open</Text>
        <ArrowRight size={13} color={theme.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    margin: '1.25%',
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 145,
  },
  contentWrap: {
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 19,
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
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  textWrap: {
    gap: 3,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
  },
  footer: {
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
