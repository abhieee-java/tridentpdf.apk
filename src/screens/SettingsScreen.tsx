import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as FileSystem from 'expo-file-system';
import { ShieldCheck, Moon, Sun, Monitor, Trash2, Globe, Info } from 'lucide-react-native';

export const SettingsScreen: React.FC = () => {
  const { theme, setMode, currentMode } = useAppTheme();

  const handleClearCache = async () => {
    try {
      if (FileSystem.cacheDirectory) {
        const files = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
        for (const file of files) {
          await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${file}`, { idempotent: true });
        }
      }
      Alert.alert('Cache Cleared', 'Temporary image and PDF caches have been sanitized.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      {/* Privacy Guarantee Banner */}
      <View style={[styles.privacyCard, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
        <View style={styles.privacyHeader}>
          <ShieldCheck size={24} color="#10B981" />
          <Text style={styles.privacyTitle}>Zero-Server Privacy Guarantee</Text>
        </View>
        <Text style={styles.privacyDesc}>
          TridentPDF operates 100% in client-side device memory. All merges, splits, watermarks, scans, and signatures occur on-device. Your documents are never uploaded to remote servers.
        </Text>
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

      {/* Storage & Cache */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>STORAGE & SECURITY</Text>
      <View style={[styles.settingsGroup, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.settingRow} onPress={handleClearCache}>
          <View style={styles.rowLeft}>
            <Trash2 size={18} color="#EF4444" />
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Sanitize Temporary Cache</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* About */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT TRIDENTPDF</Text>
      <View style={[styles.settingsGroup, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => Linking.openURL('https://tridentpdf.com')}
        >
          <View style={styles.rowLeft}>
            <Globe size={18} color="#06B6D4" />
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Official Web Studio</Text>
          </View>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>tridentpdf.com</Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.settingRow}>
          <View style={styles.rowLeft}>
            <Info size={18} color="#8B5CF6" />
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Application Version</Text>
          </View>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>1.0.0 (Release)</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  privacyCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  privacyTitle: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 15,
  },
  privacyDesc: {
    color: '#D1FAE5',
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
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
});
