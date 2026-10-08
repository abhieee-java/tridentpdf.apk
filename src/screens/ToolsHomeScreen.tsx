import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { ToolCard } from '../components/ToolCard';
import { ToolDetailModal } from '../components/ToolDetailModal';
import { CommandPaletteModal } from '../components/CommandPaletteModal';
import { DpdpComplianceModal } from '../components/DpdpComplianceModal';
import { PDFEngine } from '../services/pdfEngine';
import {
  TOOL_CATEGORIES,
  TOOL_REGISTRY,
  searchTools,
  ToolDefinition,
} from '../data/toolRegistry';
import { AppTool, ToolCategory } from '../types';
import * as DocumentPicker from 'expo-document-picker';
import {
  Search,
  X,
  ShieldCheck,
  FolderOpen,
  FileText,
  CircleCheck,
  RefreshCw,
  Trash2,
  SlidersHorizontal,
  FilePlus,
  Command,
} from 'lucide-react-native';

const ICON_EMOJI_MAP: Record<string, string> = {
  Scissors: '✂️',
  Stamp: '🔏',
  PenTool: '✍️',
  Scan: '📸',
  Globe: '🌐',
  Minimize2: '🗜️',
  Layers: '📑',
  RotateCw: '🔄',
  ArrowLeftRight: '🔄',
  Edit3: '✏️',
  ScanText: '🔍',
  Lock: '🔒',
  Crop: '📐',
  GitCompare: '⚖️',
  CheckSquare: '📝',
  EyeOff: '⬛',
  Info: '🏷️',
  Archive: '📦',
  BrainCircuit: '🧠',
  MessageSquare: '💬',
  Bot: '🤖',
  Languages: '🌐',
  FileSpreadsheet: '📊',
  Sparkles: '✨',
  Search: '🔍',
  FileQuestion: '❓',
};

const BADGE_COLOR_MAP: Record<string, string> = {
  cyan: '#06B6D4',
  blue: '#2563EB',
  purple: '#A855F7',
  amber: '#F59E0B',
  emerald: '#10B981',
  rose: '#EF4444',
  ai: '#8B5CF6',
};

export const ToolsHomeScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFile, setActiveFile] = useState<{ name: string; uri: string; size?: number } | null>(null);

  // Modals state
  const [selectedToolId, setSelectedToolId] = useState<AppTool | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDpdpModalOpen, setIsDpdpModalOpen] = useState(false);

  // Pick PDF Handler
  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) return;

      const file = res.assets[0];
      setActiveFile({
        name: file.name,
        uri: file.uri,
        size: file.size,
      });
    } catch (err: any) {
      Alert.alert('File Picker', err.message || 'Failed to select PDF file');
    }
  };

  // Generate Sample PDF Handler
  const handleCreateSampleDoc = async () => {
    try {
      const uri = await PDFEngine.createSampleDocument('TridentPDF Demo Document');
      setActiveFile({
        name: 'TridentPDF_Sample.pdf',
        uri,
        size: 24500,
      });
      Alert.alert('Demo Ready! 📄', 'A verified sample PDF was loaded directly in local memory.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to generate sample document');
    }
  };

  // Search & Filter Memo
  const filteredTools = useMemo(() => {
    return searchTools(searchQuery, selectedCategory);
  }, [selectedCategory, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F7F7F8' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          {activeFile ? (
            /* ACTIVE PDF LOADED HUB */
            <View
              style={[
                styles.activeFileCard,
                {
                  backgroundColor: isDark ? '#10101C' : '#F4F1FF',
                  borderColor: isDark ? 'rgba(6, 182, 212, 0.7)' : 'rgba(37, 99, 235, 0.7)',
                },
              ]}
            >
              <View style={styles.activeFileTop}>
                <View
                  style={[
                    styles.fileIconBox,
                    {
                      backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                      borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                    },
                  ]}
                >
                  <FileText size={20} color={isDark ? '#22D3EE' : '#2563EB'} />
                </View>
                <View style={styles.fileInfo}>
                  <View style={styles.loadedBadgeRow}>
                    <CircleCheck size={11} color="#10B981" />
                    <Text style={styles.loadedBadgeText}>ACTIVE PDF LOADED IN RAM</Text>
                  </View>
                  <Text style={[styles.fileName, { color: isDark ? '#FFFFFF' : '#0F0E1A' }]} numberOfLines={1}>
                    {activeFile.name}
                  </Text>
                  <Text style={[styles.fileMeta, { color: isDark ? '#22D3EE' : '#1D4ED8' }]}>
                    {activeFile.size ? `${(activeFile.size / 1024).toFixed(1)} KB` : 'Ready in buffer'} • Zero Server
                    Uploads
                  </Text>
                </View>
              </View>

              <View style={[styles.activeActionsRow, { borderTopColor: isDark ? '#27272A' : '#E2E6EA' }]}>
                <TouchableOpacity
                  style={[styles.switchBtn, { backgroundColor: isDark ? '#06B6D4' : '#2563EB' }]}
                  onPress={handlePickDocument}
                  activeOpacity={0.8}
                >
                  <RefreshCw size={12} color="#FFFFFF" />
                  <Text style={styles.switchBtnText}>Switch File</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => setActiveFile(null)}
                  activeOpacity={0.8}
                >
                  <Trash2 size={12} color="#FFFFFF" />
                  <Text style={styles.clearBtnText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* DEFAULT WEBSITE HERO CALLOUT */
            <View style={styles.heroCallout}>
              <TouchableOpacity
                style={[
                  styles.privacyPill,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(37, 99, 235, 0.08)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(37, 99, 235, 0.2)',
                  },
                ]}
                onPress={() => setIsDpdpModalOpen(true)}
                activeOpacity={0.7}
              >
                <ShieldCheck size={13} color="#10B981" />
                <Text style={[styles.privacyPillText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
                  100% Private Client-Side PDF Tools • DPDP 2023
                </Text>
              </TouchableOpacity>

              <Text style={[styles.heroTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                TridentPDF Studio
              </Text>

              <Text style={[styles.heroSubtitle, { color: isDark ? '#9CA3AF' : '#4B5563' }]}>
                Every tool you need to work with PDFs in one place — all processing runs directly in volatile device RAM
                with zero server retention.
              </Text>

              <View style={styles.heroBtnRow}>
                <TouchableOpacity
                  style={styles.primaryHeroBtn}
                  onPress={handlePickDocument}
                  activeOpacity={0.85}
                >
                  <FolderOpen size={16} color="#FFFFFF" />
                  <Text style={styles.primaryHeroBtnText}>Select PDF File</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryHeroBtn, { borderColor: isDark ? '#3F3F46' : '#D1D5DB' }]}
                  onPress={handleCreateSampleDoc}
                  activeOpacity={0.85}
                >
                  <FilePlus size={15} color={isDark ? '#FFFFFF' : '#111827'} />
                  <Text style={[styles.secondaryHeroBtnText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                    Load Sample
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* SEARCH & COMMAND PALETTE LAUNCHER */}
        <View style={styles.searchWrapper}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? '#11111B' : '#FFFFFF',
                borderColor: isDark ? '#27272A' : '#E2E6EA',
              },
            ]}
          >
            <Search size={16} color={isDark ? '#06B6D4' : '#2563EB'} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#111827' }]}
              placeholder="Search 25+ tools (split, merge, compress, sign...)"
              placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={15} color={theme.textMuted} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.commandQuickBtn}
                onPress={() => setIsCommandPaletteOpen(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <SlidersHorizontal size={14} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* CATEGORY TABS (HORIZONTAL PILLS) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {TOOL_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isActive
                      ? '#2563EB'
                      : isDark
                      ? '#11111B'
                      : '#FFFFFF',
                    borderColor: isActive
                      ? '#2563EB'
                      : isDark
                      ? '#27272A'
                      : '#E2E6EA',
                  },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isActive
                        ? '#FFFFFF'
                        : isDark
                        ? '#A1A1AA'
                        : '#4B5563',
                      fontWeight: isActive ? '700' : '600',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {selectedCategory === 'all'
              ? 'All Document Tools'
              : TOOL_CATEGORIES.find(c => c.id === selectedCategory)?.label}
          </Text>
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: isDark ? '#1C1C28' : '#EFF6FF',
                borderColor: isDark ? '#27272A' : '#DBEAFE',
              },
            ]}
          >
            <Text style={[styles.countBadgeText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </Text>
          </View>
        </View>

        {/* 25 TOOLS 2-COLUMN GRID */}
        <View style={styles.grid}>
          {filteredTools.map(tool => {
            const emoji = ICON_EMOJI_MAP[tool.iconName] || '⚡';
            const badgeColor = BADGE_COLOR_MAP[tool.badgeType || 'blue'] || '#2563EB';

            return (
              <ToolCard
                key={tool.id}
                id={tool.id}
                title={tool.name}
                description={tool.description}
                icon={emoji}
                badge={tool.badge}
                badgeColor={badgeColor}
                iconBg={isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(37, 99, 235, 0.08)'}
                isNew={tool.isNew}
                isAi={tool.isAiTool}
                onPress={() => setSelectedToolId(tool.id)}
              />
            );
          })}
        </View>

        {/* FOOTER DPDP TRUST BADGE */}
        <TouchableOpacity
          style={styles.footerWrap}
          onPress={() => setIsDpdpModalOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.dpdpRow}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={[styles.dpdpText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
              DPDP Act 2023 Statutory Compliance Verified
            </Text>
          </View>
          <Text style={[styles.dpdpSub, { color: isDark ? '#71717A' : '#6B7280' }]}>
            100% In-Device Processing • Zero Cloud Retention • Tap for Notice & DPO
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* DEDICATED TOOL DETAIL MODAL (FULL WORK & KNOWLEDGE ENGINE) */}
      <ToolDetailModal
        visible={!!selectedToolId}
        toolId={selectedToolId}
        onClose={() => setSelectedToolId(null)}
        activeFile={activeFile}
        onSelectActiveFile={setActiveFile}
      />

      {/* COMMAND PALETTE MODAL */}
      <CommandPaletteModal
        visible={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={id => setSelectedToolId(id)}
      />

      {/* DPDP STATUTORY COMPLIANCE MODAL */}
      <DpdpComplianceModal
        visible={isDpdpModalOpen}
        onClose={() => setIsDpdpModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heroCallout: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  privacyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  privacyPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    maxWidth: 320,
  },
  heroBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  primaryHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 13,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryHeroBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  secondaryHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 13,
  },
  secondaryHeroBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  activeFileCard: {
    borderRadius: 18,
    borderWidth: 2,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  activeFileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
    gap: 2,
  },
  loadedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loadedBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.4,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '800',
  },
  fileMeta: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  activeActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  switchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8.5,
    borderRadius: 10,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 8.5,
    borderRadius: 10,
  },
  clearBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 9.5,
    borderRadius: 13,
    borderWidth: 1,
    gap: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    padding: 0,
    fontWeight: '600',
  },
  commandQuickBtn: {
    padding: 3,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 13,
    paddingVertical: 6.5,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 11.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  footerWrap: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 4,
  },
  dpdpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dpdpText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  dpdpSub: {
    fontSize: 10,
  },
});
