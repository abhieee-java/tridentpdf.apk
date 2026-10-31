import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { PDFEngine } from '../services/pdfEngine';
import { SystemErrorService } from '../services/systemErrorService';
import { ActiveDocumentStore } from '../services/activeDocumentStore';
import { DocumentStorageService } from '../services/documentStorage';
import { FormatBadge, DocumentType } from '../components/FormatBadge';
import { AppTool } from '../types';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Share2,
  Printer,
  Trash2,
  ShieldCheck,
  FileText,
  Clock,
  Layers,
  Sparkles,
  Scissors,
  Minimize2,
  Lock,
  Unlock,
  PenTool,
  RotateCw,
  Crop,
  EyeOff,
  ScanText,
  BrainCircuit,
  CheckCircle2,
} from 'lucide-react-native';

export interface DocumentViewerScreenProps {
  filePath: string;
  fileName: string;
  fileType: DocumentType;
  readOnly?: boolean;
  onBack: () => void;
  onLaunchTool: (toolId: AppTool, file: { name: string; uri: string; size?: number }) => void;
}

interface DocDetails {
  pageCount: number;
  fileSize: number;
  title: string;
  author: string;
  hasDsc: boolean;
}

export const DocumentViewerScreen: React.FC<DocumentViewerScreenProps> = ({
  filePath,
  fileName,
  fileType,
  readOnly,
  onBack,
  onLaunchTool,
}) => {
  const { theme, isDark } = useAppTheme();

  const [details, setDetails] = useState<DocDetails>({
    pageCount: 1,
    fileSize: 0,
    title: fileName,
    author: 'Local Device',
    hasDsc: false,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function inspect() {
      try {
        setLoading(true);
        const info = await FileSystem.getInfoAsync(filePath);
        const size = (info as any).size || 0;

        let pages = 1;
        let title = fileName;
        let author = 'Local Author';
        let hasDsc = false;

        if (fileType === 'pdf') {
          try {
            const inspected = await PDFEngine.inspectPDF(filePath);
            pages = inspected.pageCount || 1;
            title = inspected.title || fileName;
            author = inspected.author || 'Local Author';

            const bytes = await PDFEngine.loadBytesFromUri(filePath);
            const dscInfo = PDFEngine.detectDigitalSignature(bytes);
            hasDsc = dscInfo.isDigitallySigned;
          } catch {}
        }

        if (isMounted) {
          setDetails({
            pageCount: pages,
            fileSize: size,
            title,
            author,
            hasDsc,
          });

          // Sync into activeDocumentStore
          ActiveDocumentStore.setActiveDocument({
            name: fileName,
            uri: filePath,
            size,
            type: fileType,
            pageCount: pages,
          });
        }
      } catch (err) {
        SystemErrorService.reportError(err, 'Document Inspector');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    inspect();
    return () => {
      isMounted = false;
    };
  }, [filePath, fileName, fileType]);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(filePath);
      } else {
        await Share.share({ url: filePath, title: fileName });
      }
    } catch (err: any) {
      SystemErrorService.reportError(err, 'Share Document');
    }
  };

  const handlePrint = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      if (fileType === 'pdf') {
        await Print.printAsync({ uri: filePath });
      } else {
        const content = await FileSystem.readAsStringAsync(filePath);
        await Print.printAsync({
          html: `<html><body><pre>${content}</pre></body></html>`,
        });
      }
    } catch (err: any) {
      SystemErrorService.reportError(err, 'Print Document');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Document', `Are you sure you want to permanently delete "${fileName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
            await DocumentStorageService.removeDocument(`local_${fileName}`);
            ActiveDocumentStore.clearActiveDocument();
            SystemErrorService.showNotification({
              code: 'OPERATION_FAILED',
              title: 'Document Deleted',
              message: `"${fileName}" removed from local storage.`,
              severity: 'info',
            });
            onBack();
          } catch (err: any) {
            SystemErrorService.reportError(err, 'Delete Document');
          }
        },
      },
    ]);
  };

  const handleToolAction = (toolId: AppTool) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {}
    onLaunchTool(toolId, {
      name: fileName,
      uri: filePath,
      size: details.fileSize,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Top Navbar */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: isDark ? '#121217' : '#FFFFFF',
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.topBarTitleWrap}>
          <Text style={[styles.topBarTitle, { color: theme.textPrimary }]} numberOfLines={1}>
            {fileName}
          </Text>
          <Text style={[styles.topBarSubtitle, { color: theme.textMuted }]}>
            {fileType.toUpperCase()} • {details.pageCount} {details.pageCount === 1 ? 'Page' : 'Pages'} •{' '}
            {formatFileSize(details.fileSize)}
          </Text>
        </View>

        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Share2 size={20} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handlePrint}>
            <Printer size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Document Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.surfaceCard,
              borderColor: theme.border,
            },
          ]}
        >
          <FormatBadge type={fileType} size="lg" showLabel={true} />

          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>{fileName}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Layers size={13} color="#2563EB" />
              <Text style={styles.metaChipText}>{details.pageCount} Pages</Text>
            </View>

            <View style={styles.metaChip}>
              <FileText size={13} color="#10B981" />
              <Text style={styles.metaChipText}>{formatFileSize(details.fileSize)}</Text>
            </View>

            {details.hasDsc && (
              <View style={[styles.metaChip, { backgroundColor: '#FEE2E2' }]}>
                <ShieldCheck size={13} color="#EF4444" />
                <Text style={[styles.metaChipText, { color: '#EF4444' }]}>DSC Signed</Text>
              </View>
            )}
          </View>

          {/* Privacy Guarantee Badge */}
          <View
            style={[
              styles.privacyBadge,
              {
                backgroundColor: isDark ? '#13281E' : '#ECFDF5',
                borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
              },
            ]}
          >
            <CheckCircle2 size={14} color="#10B981" />
            <Text style={[styles.privacyBadgeText, { color: isDark ? '#34D399' : '#065F46' }]}>
              100% Local Device Isolation • 1-Hour Session TTL
            </Text>
          </View>
        </View>

        {/* Quick Tools Studio Section */}
        <View style={styles.toolsSection}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
            PDF Studio Quick Actions
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Execute any of the 25 TridentPDF offline operations directly on this document:
          </Text>

          <View style={styles.toolsGrid}>
            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('split')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#EFF6FF' }]}>
                <Scissors size={20} color="#2563EB" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Split Pages</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>Extract range</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('merge')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#F3E8FF' }]}>
                <Layers size={20} color="#9333EA" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Merge PDFs</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>Combine files</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('compress')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#FEF3C7' }]}>
                <Minimize2 size={20} color="#D97706" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Compress</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>Reduce size</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('watermark')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#ECFDF5' }]}>
                <Sparkles size={20} color="#059669" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Watermark</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>Protect brand</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('organize')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#EFF6FF' }]}>
                <RotateCw size={20} color="#2563EB" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Rotate Pages</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>90° / 180°</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('sign-fill')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#FDF2F8' }]}>
                <PenTool size={20} color="#DB2777" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Sign & Fill</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>Add signature</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('security')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#FEF2F2' }]}>
                <Lock size={20} color="#DC2626" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Security</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>AES-256 Lock</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('crop')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#F0FDF4' }]}>
                <Crop size={20} color="#16A34A" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Crop/Resize</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>A4, Letter, A3</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('ocr')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#F5F3FF' }]}>
                <ScanText size={20} color="#7C3AED" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>OCR Engine</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>Extract text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('ai-summarize')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#EFF6FF' }]}>
                <BrainCircuit size={20} color="#2563EB" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>AI Summary</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>Executive brief</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolActionTile, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              onPress={() => handleToolAction('redact')}
            >
              <View style={[styles.toolTileIcon, { backgroundColor: '#F1F5F9' }]}>
                <EyeOff size={20} color="#475569" />
              </View>
              <Text style={[styles.toolTileTitle, { color: theme.textPrimary }]}>Redact PII</Text>
              <Text style={[styles.toolTileSub, { color: theme.textMuted }]}>Blackout data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  topBarTitleWrap: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  topBarSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  heroCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 14,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  privacyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  toolsSection: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolActionTile: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  toolTileIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  toolTileTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  toolTileSub: {
    fontSize: 11,
  },
});
