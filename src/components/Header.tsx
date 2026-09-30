import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { Sun, Moon, ShieldCheck } from 'lucide-react-native';

export const Header: React.FC = () => {
  const { theme, isDark, toggleTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#09090E' : '#FFFFFF',
          borderBottomColor: isDark ? '#27272A' : '#D4CFE8',
        },
      ]}
    >
      {/* Brand & Badge */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>🔱</Text>
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F0E1A' }]}>
              TridentPDF
            </Text>
            <View style={styles.privateBadge}>
              <ShieldCheck size={10} color="#10B981" />
              <Text style={styles.privateText}>100% PRIVATE</Text>
            </View>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            In-Browser & On-Device Studio
          </Text>
        </View>
      </View>

      {/* Theme Toggle Button */}
      <TouchableOpacity
        style={[
          styles.themeBtn,
          {
            backgroundColor: isDark ? '#13131F' : '#F0EDFA',
            borderColor: isDark ? '#27272A' : '#D4CFE8',
          },
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        {isDark ? <Sun size={17} color="#FBBF24" /> : <Moon size={17} color="#3B82F6" />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
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
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  logoIcon: {
    fontSize: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 5.5,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  privateText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    marginTop: 0.5,
  },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
