import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, Folder, Grid, Settings, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme/ThemeContext';

export type WPSTab = 'recent' | 'folders' | 'tools' | 'settings';

export interface WPSBottomNavProps {
  activeTab: WPSTab;
  onSelectTab: (tab: WPSTab) => void;
  onPressAction: () => void;
  isActionMenuOpen: boolean;
}

export const WPSBottomNav: React.FC<WPSBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onPressAction,
  isActionMenuOpen,
}) => {
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: isActionMenuOpen ? 1 : 0,
      tension: 90,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isActionMenuOpen]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleTabPress = (tab: WPSTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onSelectTab(tab);
  };

  const handleFABPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
    onPressAction();
  };

  const tabs: Array<{ id: WPSTab; label: string; icon: any }> = [
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'folders', label: 'Folders', icon: Folder },
    { id: 'tools', label: 'Tools', icon: Grid },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <View
      style={[
        styles.barContainer,
        {
          backgroundColor: isDark ? '#0C0C12' : '#FFFFFF',
          borderTopColor: isDark ? '#22222A' : '#E5E7EB',
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      {/* Tab 1: Recent Files */}
      {(() => {
        const tab = tabs[0];
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Icon size={21} color={isActive ? '#2563EB' : theme.textMuted} />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? '#2563EB' : theme.textMuted, fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })()}

      {/* Tab 2: Folders / Cloud */}
      {(() => {
        const tab = tabs[1];
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Icon size={21} color={isActive ? '#2563EB' : theme.textMuted} />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? '#2563EB' : theme.textMuted, fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })()}

      {/* Center Action (+) FAB */}
      <View style={styles.fabSlot}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={handleFABPress}
            activeOpacity={0.85}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Plus size={26} color="#FFFFFF" strokeWidth={2.6} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Tab 3: Tools Center */}
      {(() => {
        const tab = tabs[2];
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Icon size={21} color={isActive ? '#2563EB' : theme.textMuted} />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? '#2563EB' : theme.textMuted, fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })()}

      {/* Tab 4: Settings */}
      {(() => {
        const tab = tabs[3];
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Icon size={21} color={isActive ? '#2563EB' : theme.textMuted} />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? '#2563EB' : theme.textMuted, fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })()}
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.1,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
    marginTop: 1,
  },
  fabSlot: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF5733',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    elevation: 7,
    shadowColor: '#FF5733',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
