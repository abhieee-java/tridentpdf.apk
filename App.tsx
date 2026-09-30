import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeContext';
import { Header } from './src/components/Header';
import { ToolsHomeScreen } from './src/screens/ToolsHomeScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { SignAndFillScreen } from './src/screens/SignAndFillScreen';
import { DocumentViewerScreen } from './src/screens/DocumentViewerScreen';
import { AIScreen } from './src/screens/AIScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import {
  Grid,
  Camera,
  PenTool,
  FolderArchive,
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react-native';

type Tab = 'tools' | 'scanner' | 'sign' | 'vault' | 'ai' | 'settings';

function MainApp() {
  const { theme, isDark } = useAppTheme();
  const [activeTab, setActiveTab] = useState<Tab>('tools');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'tools':
        return <ToolsHomeScreen />;
      case 'scanner':
        return <ScannerScreen />;
      case 'sign':
        return <SignAndFillScreen />;
      case 'vault':
        return <DocumentViewerScreen />;
      case 'ai':
        return <AIScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <ToolsHomeScreen />;
    }
  };

  const tabs: Array<{ id: Tab; label: string; icon: any }> = [
    { id: 'tools', label: 'Studio', icon: Grid },
    { id: 'scanner', label: 'Scanner', icon: Camera },
    { id: 'sign', label: 'Sign & Fill', icon: PenTool },
    { id: 'vault', label: 'Vault', icon: FolderArchive },
    { id: 'ai', label: 'AI Suite', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Header />

      {/* Screen Body */}
      <View style={[styles.screenContent, { backgroundColor: theme.bg }]}>{renderActiveScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
          },
        ]}
      >
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.tabIconWrap,
                  isActive && { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.18)' : '#EFF6FF' },
                ]}
              >
                <IconComponent
                  size={19}
                  color={isActive ? '#2563EB' : theme.textMuted}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? '#2563EB' : theme.textMuted,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingBottom: Platform.OS === 'ios' ? 14 : 8,
    borderTopWidth: 1,
  },
  tabBtn: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  tabIconWrap: {
    width: 38,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 9.5,
    letterSpacing: 0.1,
  },
});
