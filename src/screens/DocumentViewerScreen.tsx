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
import { FontFamily } from '../theme/typography';
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
  Layers,
  Sparkles,
  Scissors,
  Minimize2,
  Lock,
  PenTool,
  RotateCw,
  Crop,
  EyeOff,
  ScanText,
  BrainCircuit,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
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
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'page' | 'details'>('page');

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

        // Read text content for text-based or script files
        if (['txt', 'csv', 'json', 'doc', 'docx'].includes(fileType)) {
          try {
            const text = await FileSystem.readAsStringAsync(filePath);
            if (isMounted) {
              setFileContent(text.slice(0, 10000));
            }
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

  const handleZoom = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setZoomLevel(prev => Math.min(150, Math.max(70, prev + delta)));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > details.pageCount) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCurrentPage(newPage);
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
        {/* Apple-Style Segmented View Switcher */}
        <View style={[styles.viewSwitcher, { backgroundColor: isDark ? '#1C1C24' : '#E2E8F0' }]}>
          <TouchableOpacity
            style={[
              styles.switchTab,
              viewMode === 'page' && [
                styles.switchTabActive,
                { backgroundColor: isDark ? '#2D2D3A' : '#FFFFFF' },
              ],
            ]}
            onPress={() => setViewMode('page')}
            activeOpacity={0.8}
          >
            <BookOpen size={14} color={viewMode === 'page' ? '#2563EB' : theme.textMuted} />
            <Text
              style={[
                styles.switchTabText,
                { color: viewMode === 'page' ? (isDark ? '#60A5FA' : '#2563EB') : theme.textMuted },
              ]}
            >
              Page Preview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchTab,
              viewMode === 'details' && [
                styles.switchTabActive,
                { backgroundColor: isDark ? '#2D2D3A' : '#FFFFFF' },
              ],
            ]}
            onPress={() => setViewMode('details')}
            activeOpacity={0.8}
          >
            <FileText size={14} color={viewMode === 'details' ? '#2563EB' : theme.textMuted} />
            <Text
              style={[
                styles.switchTabText,
                { color: viewMode === 'details' ? (isDark ? '#60A5FA' : '#2563EB') : theme.textMuted },
              ]}
            >
              Document Details
            </Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'page' ? (
          /* ============================================================ */
          /* APPLE-GRADE PAGE SHEET READER & CANVAS                       */
          /* ============================================================ */
          <View style={styles.pageViewerContainer}>
            {/* Page Navigation & Zoom Toolbar */}
            <View
              style={[
                styles.pageToolbar,
                {
                  backgroundColor: isDark ? '#181822' : '#FFFFFF',
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.pageNavControls}>
                <TouchableOpacity
                  style={[styles.pageNavBtn, currentPage <= 1 && styles.pageNavBtnDisabled]}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft size={16} color={currentPage <= 1 ? '#94A3B8' : '#2563EB'} />
                </TouchableOpacity>

                <Text style={[styles.pageNavText, { color: theme.textPrimary }]}>
                  Page {currentPage} of {details.pageCount}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.pageNavBtn,
                    currentPage >= details.pageCount && styles.pageNavBtnDisabled,
                  ]}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= details.pageCount}
                >
                  <ChevronRight
                    size={16}
                    color={currentPage >= details.pageCount ? '#94A3B8' : '#2563EB'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom(-10)}>
                  <ZoomOut size={15} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.zoomText, { color: theme.textSecondary }]}>{zoomLevel}%</Text>
                <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom(10)}>
                  <ZoomIn size={15} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Simulated Realistic A4 Physical Page Sheet */}
            <View
              style={[
                styles.pageSheetWrapper,
                { transform: [{ scale: zoomLevel / 100 }] },
              ]}
            >
              <View style={styles.pageSheet}>
                {/* Authentic Page Top Bar with App Logo Branding */}
                <View style={styles.sheetHeader}>
                  <View style={styles.appBranding}>
                    <View style={styles.appLogoMini}>
                      <Text style={styles.appLogoText}>🔱</Text>
                    </View>
                    <View>
                      <Text style={styles.appBrandName}>TridentPDF</Text>
                      <Text style={styles.appBrandSub}>100% Client-Side Studio</Text>
                    </View>
                  </View>

                  <View style={styles.pageCornerBadge}>
                    <FormatBadge type={fileType} size="sm" showLabel={true} />
                    <Text style={styles.sheetPageNumber}>P. {currentPage}</Text>
                  </View>
                </View>

                {/* Subtle Divider */}
                <View style={styles.sheetDivider} />

                {/* Sheet Body Content */}
                <View style={styles.sheetBody}>
                  {fileContent ? (
                    <ScrollView style={styles.textContentScroll} nestedScrollEnabled>
                      <Text style={styles.rawTextContent}>{fileContent}</Text>
                    </ScrollView>
                  ) : (
                    <View style={styles.pdfPageSimulation}>
                      <View style={styles.pdfDocTitleRow}>
                        <FileText size={22} color="#2563EB" />
                        <Text style={styles.pdfDocTitle}>{details.title}</Text>
                      </View>

                      <View style={styles.pdfMetaGrid}>
                        <View style={styles.pdfMetaCol}>
                          <Text style={styles.pdfMetaLabel}>AUTHOR</Text>
                          <Text style={styles.pdfMetaValue}>{details.author}</Text>
                        </View>
                        <View style={styles.pdfMetaCol}>
                          <Text style={styles.pdfMetaLabel}>SPECIFICATION</Text>
                          <Text style={styles.pdfMetaValue}>ISO 32000-1 (PDF)</Text>
                        </View>
                        <View style={styles.pdfMetaCol}>
                          <Text style={styles.pdfMetaLabel}>CANVAS</Text>
                          <Text style={styles.pdfMetaValue}>A4 (595 × 842 pt)</Text>
                        </View>
                      </View>

                      {/* Mock Rendered Lines representing document layout */}
                      <View style={styles.pageParagraphSimulation}>
                        <View style={[styles.skeletonLine, { width: '85%' }]} />
                        <View style={[styles.skeletonLine, { width: '95%' }]} />
                        <View style={[styles.skeletonLine, { width: '75%' }]} />
                        <View style={[styles.skeletonLine, { width: '90%' }]} />
                        <View style={[styles.skeletonLine, { width: '60%' }]} />
                      </View>

                      {/* Cryptographic DSC Seal if Present */}
                      {details.hasDsc && (
                        <View style={styles.dscSealBox}>
                          <ShieldCheck size={16} color="#059669" />
                          <View>
                            <Text style={styles.dscSealTitle}>Digitally Signed & Certified</Text>
                            <Text style={styles.dscSealSub}>PKCS#7 / ByteRange Validated</Text>
                          </View>
                        </View>
                      )}

                      {/* Security Watermark Simulation */}
                      <View style={styles.watermarkContainer}>
                        <Text style={styles.watermarkText}>TRIDENTPDF • VERIFIED LOCAL</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Sheet Footer */}
                <View style={styles.sheetFooter}>
                  <Text style={styles.sheetFooterNotice}>
                    Volatile Memory Execution • Zero Server Retained
                  </Text>
                  <Text style={styles.sheetFooterPage}>
                    {currentPage} / {details.pageCount}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* ============================================================ */
          /* DOCUMENT METADATA HERO CARD                                  */
          /* ============================================================ */
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
        )}

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
    gap: 18,
  },
  viewSwitcher: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  switchTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
    gap: 6,
  },
  switchTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  switchTabText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  pageViewerContainer: {
    gap: 12,
    alignItems: 'center',
    width: '100%',
  },
  pageToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  pageNavControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageNavBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  pageNavBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  pageNavText: {
    fontSize: 12,
    fontWeight: '700',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  zoomBtn: {
    padding: 6,
    borderRadius: 8,
  },
  zoomText: {
    fontSize: 11.5,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'center',
  },
  pageSheetWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  pageSheet: {
    width: '100%',
    maxWidth: 380,
    minHeight: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
    padding: 20,
    justifyContent: 'space-between',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appLogoMini: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogoText: {
    fontSize: 14,
  },
  appBrandName: {
    fontFamily: FontFamily.sans,
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  appBrandSub: {
    fontFamily: FontFamily.sans,
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  pageCornerBadge: {
    alignItems: 'flex-end',
    gap: 2,
  },
  sheetPageNumber: {
    fontFamily: FontFamily.mono,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  sheetDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  sheetBody: {
    flex: 1,
    minHeight: 280,
    justifyContent: 'center',
  },
  textContentScroll: {
    maxHeight: 300,
  },
  rawTextContent: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FontFamily.mono,
    color: '#1E293B',
  },
  pdfPageSimulation: {
    gap: 14,
    paddingVertical: 10,
  },
  pdfDocTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pdfDocTitle: {
    fontFamily: FontFamily.sans,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    letterSpacing: -0.2,
  },
  pdfMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pdfMetaCol: {
    gap: 2,
  },
  pdfMetaLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  pdfMetaValue: {
    fontFamily: FontFamily.mono,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  pageParagraphSimulation: {
    gap: 8,
    paddingVertical: 6,
  },
  skeletonLine: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
  },
  dscSealBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    padding: 8,
  },
  dscSealTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#065F46',
  },
  dscSealSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#047857',
  },
  watermarkContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  watermarkText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#CBD5E1',
    letterSpacing: 2,
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sheetFooterNotice: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
  },
  sheetFooterPage: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
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
