import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as FileSystem from 'expo-file-system';
import { SystemErrorService } from '../services/systemErrorService';
import * as Haptics from 'expo-haptics';
import {
  Moon,
  Sun,
  Monitor,
  Trash2,
  Info,
  Scale,
  Cloud,
  ChevronRight,
} from 'lucide-react-native';

interface SettingsScreenProps {
  onOpenDpdp?: () => void;
  onNavigateCloudSettings?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onOpenDpdp,
  onNavigateCloudSettings,
}) => {
  const { theme, setMode, currentMode } = useAppTheme();

  const handleClearCache = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      if (FileSystem.cacheDirectory) {
        const files = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
        for (const file of files) {
          await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${file}`, { idempotent: true });
        }
      }
      SystemErrorService.showNotification({
        code: 'OPERATION_SUCCESS',
        title: 'Cache Sanitized',
        message: 'Temporary document and image caches have been cleared from device memory.',
        severity: 'success',
      });
    } catch (e: any) {
      SystemErrorService.reportError(e, 'Cache Cleaner');
    }
  };

  const handleCloudPress = () => {
    if (onNavigateCloudSettings) {
      onNavigateCloudSettings();
    } else {
      SystemErrorService.showNotification({
        code: 'OPERATION_SUCCESS',
        title: 'Local Privacy Mode Active',
        message: 'TridentPDF is currently operating in 100% local device mode with zero cloud uploads.',
        severity: 'info',
      });
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      {/* Cloud Storage Configuration */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>CLOUD STORAGE</Text>
      <View style={[styles.settingsGroup, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleCloudPress}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <Cloud size={18} color="#2563EB" />
            <View>
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Cloudinary Storage</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>
                Configure Cloud Name, API Key, masked API Secret & root folder
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Theme Preference */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPEARANCE</Text>
      <View style={[styles.settingsGroup, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.settingRow, currentMode === 'dark' && { backgroundColor: `${theme.primary}15` }]}
          onPress={() => setMode('dark')}
        >
          <View style={styles.rowLeft}>
            <Moon size={18} color="#3B82F6" />
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Dark Mode (Default)</Text>
          </View>
          {currentMode === 'dark' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={[styles.settingRow, currentMode === 'light' && { backgroundColor: `${theme.primary}15` }]}
          onPress={() => setMode('light')}
        >
          <View style={styles.rowLeft}>
            <Sun size={18} color="#F59E0B" />
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Light Mode</Text>
          </View>
          {currentMode === 'light' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={[styles.settingRow, currentMode === 'system' && { backgroundColor: `${theme.primary}15` }]}
          onPress={() => setMode('system')}
        >
          <View style={styles.rowLeft}>
            <Monitor size={18} color="#10B981" />
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Follow System</Text>
          </View>
          {currentMode === 'system' && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {/* DPDP Legal & Compliance */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>STATUTORY COMPLIANCE</Text>
      <View style={[styles.settingsGroup, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.settingRow} onPress={onOpenDpdp} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <Scale size={18} color="#10B981" />
            <View>
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
                DPDP Act 2023 Compliance Center
              </Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>
                Section 5 Notice, User Rights & Privacy Controls
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Storage & Cache */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>STORAGE & MEMORY</Text>
      <View style={[styles.settingsGroup, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.settingRow} onPress={handleClearCache} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <Trash2 size={18} color="#EF4444" />
            <View>
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Sanitize Temporary Cache</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>
                Purge all temporary buffer files
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* About TridentPDF */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT TRIDENTPDF</Text>
      <View style={[styles.settingsGroup, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <View style={styles.settingRow}>
          <View style={styles.rowLeft}>
            <Info size={18} color="#2563EB" />
            <View>
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>TridentPDF Studio</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Version 1.0.0 (WPS Office Suite Edition)</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={[styles.footerText, { color: theme.textMuted }]}>
        TridentPDF Mobile Suite v1.0.0{'\n'}
        100% On-Device DPDP-Compliant PDF & Office Studio
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 8,
    marginLeft: 4,
  },
  settingsGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  rowSub: {
    fontSize: 10.5,
    marginTop: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  divider: {
    height: 1,
  },
  footerText: {
    fontSize: 10.5,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 15,
  },
});
