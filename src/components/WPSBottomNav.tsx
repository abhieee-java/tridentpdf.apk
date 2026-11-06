import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, Folder, Grid, Settings, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme/ThemeContext';
import { FontFamily } from '../theme/typography';

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
      tension: 110,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isActionMenuOpen]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleTabPress = (tab: WPSTab) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onSelectTab(tab);
  };

  const handleFABPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 140,
        friction: 7,
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

  const activeColor = isDark ? '#38BDF8' : '#007AFF';
  const inactiveColor = theme.textMuted;

  return (
    <View
      style={[
        styles.barContainer,
        {
          backgroundColor: isDark ? '#09090E' : '#FFFFFF',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          paddingBottom: Math.max(insets.bottom, 8),
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
            <Icon size={20} color={isActive ? activeColor : inactiveColor} strokeWidth={isActive ? 2.3 : 1.8} />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? activeColor : inactiveColor,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
          </TouchableOpacity>
        );
      })()}

      {/* Tab 2: Folders */}
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
            <Icon size={20} color={isActive ? activeColor : inactiveColor} strokeWidth={isActive ? 2.3 : 1.8} />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? activeColor : inactiveColor,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
          </TouchableOpacity>
        );
      })()}

      {/* Center Action (+) Apple-Grade Specular Action Button */}
      <View style={styles.fabSlot}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.fabButton,
              {
                backgroundColor: isDark ? '#007AFF' : '#007AFF',
                shadowColor: '#007AFF',
              },
            ]}
            onPress={handleFABPress}
            activeOpacity={0.88}
          >
            {/* Top specular highlight ring */}
            <View style={styles.fabSpecularHighlight} />
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Plus size={24} color="#FFFFFF" strokeWidth={2.6} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Tab 3: Tools */}
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
            <Icon size={20} color={isActive ? activeColor : inactiveColor} strokeWidth={isActive ? 2.3 : 1.8} />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? activeColor : inactiveColor,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
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
            <Icon size={20} color={isActive ? activeColor : inactiveColor} strokeWidth={isActive ? 2.3 : 1.8} />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? activeColor : inactiveColor,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
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
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  tabLabel: {
    fontFamily: FontFamily.sans,
    fontSize: 10.5,
    letterSpacing: -0.1,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },
  fabSlot: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  fabSpecularHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});
