import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { Sun, Moon, ShieldCheck, Sparkles, Command } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { FontFamily } from '../theme/typography';

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenDpdp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenDpdp }) => {
  const { theme, isDark, toggleTheme } = useAppTheme();

  const handleToggleTheme = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    toggleTheme();
  };

  const handleOpenDpdp = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    if (onOpenDpdp) onOpenDpdp();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#09090E' : '#FFFFFF',
          borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* Brand & Badge */}
      <View style={styles.brandRow}>
        <View
          style={[
            styles.logoBadge,
            {
              backgroundColor: isDark ? '#12121A' : '#F0F4FF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 122, 255, 0.15)',
            },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2.5V21.5M12 2.5L9 6H15L12 2.5ZM5 7.5V12C5 15.866 8.134 19 12 19C15.866 19 19 15.866 19 12V7.5M5 7.5L3 10H7L5 7.5ZM19 7.5L17 10H21L19 7.5Z"
              stroke={isDark ? '#38BDF8' : '#007AFF'}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <View style={styles.titleColumn}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              TridentPDF
            </Text>
            <TouchableOpacity
              style={[
                styles.privateBadge,
                {
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.1)',
                  borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.25)',
                },
              ]}
              onPress={handleOpenDpdp}
              activeOpacity={0.7}
            >
              <ShieldCheck size={10} color="#10B981" />
              <Text style={styles.privateText}>100% PRIVATE</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Apple HIG • On-Device Volatile RAM
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRight}>
        {onOpenSearch && (
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: isDark ? '#14141E' : '#F1F3F5',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
            onPress={onOpenSearch}
            activeOpacity={0.7}
          >
            <Command size={15} color={isDark ? '#38BDF8' : '#007AFF'} />
          </TouchableOpacity>
        )}

        {/* Theme Toggle Button */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: isDark ? '#14141E' : '#F1F3F5',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            },
          ]}
          onPress={handleToggleTheme}
          activeOpacity={0.7}
        >
          {isDark ? <Sun size={15} color="#FBBF24" /> : <Moon size={15} color="#007AFF Freeman" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    gap: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: FontFamily.sans,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  privateText: {
    fontFamily: FontFamily.mono,
    fontSize: 8.5,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontFamily: FontFamily.sans,
    fontSize: 11,
    letterSpacing: -0.1,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
