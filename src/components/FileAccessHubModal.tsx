import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { DocumentStorageService, getFileFormat } from '../services/documentStorage';
import { DocumentItem } from './DocumentCard';
import { FormatBadge } from './FormatBadge';
import { SystemErrorService } from '../services/systemErrorService';
import { ActiveDocumentStore } from '../services/activeDocumentStore';
import { PDFEngine } from '../services/pdfEngine';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { FontFamily } from '../theme/typography';
import {
  X,
  Search,
  HardDrive,
  Clock,
  Star,
  Plus,
  FolderOpen,
  FileText,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react-native';

export interface FileAccessHubModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFile: (file: { name: string; uri: string; size?: number; pageCount?: number }) => void;
  title?: string;
  subtitle?: string;
  allowedExtensions?: string[]; // e.g. ['pdf']
}

type TabType = 'recent' | 'vault' | 'starred';

export const FileAccessHubModal: React.FC<FileAccessHubModalProps> = ({
  visible,
  onClose,
  onSelectFile,
  title = 'File Access Hub',
  subtitle = 'Browse local device vault & recent documents',
  allowedExtensions,
}) => {
  const { theme, isDark } = useAppTheme();

  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'recent') {
        const items = await DocumentStorageService.getRecentDocuments();
        setDocuments(items);
      } else if (activeTab === 'vault') {
        const localItems = await DocumentStorageService.listAllLocalFiles();
        setDocuments(localItems);
      } else if (activeTab === 'starred') {
        const allItems = await DocumentStorageService.getRecentDocuments();
        setDocuments(allItems.filter(d => d.isStarred));
      }
    } catch (err: any) {
      SystemErrorService.reportError(err, 'File Access Hub');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible, loadData]);

  // Tab switch with haptic feedback
  const handleTabChange = (tab: TabType) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    setActiveTab(tab);
  };

  // Toggle favorite
  const handleToggleStar = async (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      await DocumentStorageService.toggleStarDocument(id);
      loadData();
    } catch (err) {
      SystemErrorService.reportError(err, 'Favorite Toggle');
    }
  };

  // Import file directly from native file picker
  const handleImportSystemFile = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      let mimeTypes: string[] = ['*/*'];
      if (allowedExtensions && allowedExtensions.length > 0) {
        if (allowedExtensions.every(ext => ['pdf'].includes(ext))) {
          mimeTypes = ['application/pdf'];
        } else if (allowedExtensions.every(ext => ['jpg', 'jpeg', 'png', 'webp'].includes(ext))) {
          mimeTypes = ['image/*'];
        }
      }

      const res = await DocumentPicker.getDocumentAsync({
        type: mimeTypes,
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) return;

      const asset = res.assets[0];
      const docType = getFileFormat(asset.name);

      const newDoc: DocumentItem = {
        id: `local_pick_${Date.now()}`,
        name: asset.name,
        uri: asset.uri,
        type: docType,
        size: asset.size || 0,
        modifiedAt: Date.now(),
      };

      await DocumentStorageService.addDocument(newDoc);
      await ActiveDocumentStore.setActiveDocument({
        name: newDoc.name,
        uri: newDoc.uri,
        size: newDoc.size,
        type: newDoc.type,
      });

      SystemErrorService.showNotification({
        code: 'DOCUMENT_READY',
        title: 'Document Ready',
        message: `Imported "${asset.name}" into local workspace.`,
        severity: 'success',
      });

      onSelectFile({
        name: newDoc.name,
        uri: newDoc.uri,
        size: newDoc.size,
      });
      onClose();
    } catch (err: any) {
      SystemErrorService.reportError(err, 'Document Import');
    }
  };

  // Create demo sample PDF
  const handleCreateSampleDoc = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      const uri = await PDFEngine.createSampleDocument('TridentPDF WPS Sample Document');
      const docName = 'TridentPDF_Sample.pdf';

      const newDoc: DocumentItem = {
        id: `sample_${Date.now()}`,
        name: docName,
        uri,
        type: 'pdf',
        size: 24500,
        modifiedAt: Date.now(),
      };

      await DocumentStorageService.addDocument(newDoc);
      await ActiveDocumentStore.setActiveDocument({
        name: newDoc.name,
        uri: newDoc.uri,
        size: newDoc.size,
        type: 'pdf',
      });

      SystemErrorService.showNotification({
        code: 'DOCUMENT_READY',
        title: 'Sample PDF Ready',
        message: 'Loaded verified sample PDF with standard ISO 32000-1 structure.',
        severity: 'success',
      });

      onSelectFile({
        name: newDoc.name,
        uri,
        size: 24500,
      });
      onClose();
    } catch (err) {
      SystemErrorService.reportError(err, 'Sample Generator');
    }
  };

  // Filter pipeline
  const filteredDocuments = useMemo(() => {
    let list = [...documents];

    if (allowedExtensions && allowedExtensions.length > 0) {
      list = list.filter(item => {
        const ext = item.name.split('.').pop()?.toLowerCase();
        return ext && allowedExtensions.includes(ext);
      });
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => item.name.toLowerCase().includes(q));
    }

    return list;
  }, [documents, searchQuery, allowedExtensions]);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleSelect = (item: DocumentItem) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    ActiveDocumentStore.setActiveDocument({
      name: item.name,
      uri: item.uri,
      size: item.size,
      type: item.type,
    });
    onSelectFile({
      name: item.name,
      uri: item.uri,
      size: item.size,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          {/* Header Bar */}
          <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.titleRow}>
                <HardDrive size={20} color="#2563EB" />
                <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>{title}</Text>
              </View>
              <Text style={[styles.sheetSub, { color: theme.textSecondary }]}>{subtitle}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: '#2563EB' }]}
              onPress={handleImportSystemFile}
            >
              <FolderOpen size={16} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Browse Device Storage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryActionBtn,
                { backgroundColor: isDark ? '#1E1E2C' : '#F1F5F9', borderColor: theme.border },
              ]}
              onPress={handleCreateSampleDoc}
            >
              <Sparkles size={15} color="#2563EB" />
              <Text style={[styles.secondaryActionText, { color: theme.textPrimary }]}>
                Sample PDF
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? '#161622' : '#F8FAFC',
                borderColor: theme.border,
              },
            ]}
          >
            <Search size={16} color={theme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search local documents..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={15} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Segmented Tabs */}
          <View style={[styles.tabsRow, { borderBottomColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'recent' && styles.tabBtnActive]}
              onPress={() => handleTabChange('recent')}
            >
              <Clock size={15} color={activeTab === 'recent' ? '#2563EB' : theme.textMuted} />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'recent' ? '#2563EB' : theme.textSecondary },
                ]}
              >
                Recent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'vault' && styles.tabBtnActive]}
              onPress={() => handleTabChange('vault')}
            >
              <HardDrive size={15} color={activeTab === 'vault' ? '#2563EB' : theme.textMuted} />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'vault' ? '#2563EB' : theme.textSecondary },
                ]}
              >
                Local Vault
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'starred' && styles.tabBtnActive]}
              onPress={() => handleTabChange('starred')}
            >
              <Star
                size={15}
                color={activeTab === 'starred' ? '#F59E0B' : theme.textMuted}
                fill={activeTab === 'starred' ? '#F59E0B' : 'transparent'}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'starred' ? '#F59E0B' : theme.textSecondary },
                ]}
              >
                Starred
              </Text>
            </TouchableOpacity>
          </View>

          {/* Document List */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                Scanning local storage...
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredDocuments}
              keyExtractor={item => item.id || item.uri}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <FileText size={40} color={theme.textMuted} />
                  <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                    No Documents Found
                  </Text>
                  <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                    {searchQuery.length > 0
                      ? 'No files matched your search keyword.'
                      : 'Tap "Browse Device Storage" or "Sample PDF" above to load documents.'}
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.documentItemCard,
                    {
                      backgroundColor: theme.surfaceCard,
                      borderColor: theme.border,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(item)}
                >
                  <FormatBadge type={item.type} size="md" />

                  <View style={styles.docInfo}>
                    <Text style={[styles.docName, { color: theme.textPrimary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.docMeta, { color: theme.textMuted }]}>
                      {formatFileSize(item.size)} •{' '}
                      {new Date(item.modifiedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.starBtn}
                    onPress={() => handleToggleStar(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Star
                      size={18}
                      color={item.isStarred ? '#F59E0B' : theme.textMuted}
                      fill={item.isStarred ? '#F59E0B' : 'transparent'}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    width: '100%',
    height: '84%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitleWrap: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sheetSub: {
    fontSize: 12,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  primaryActionBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
  },
  primaryActionText: {
    fontFamily: FontFamily.sans,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryActionText: {
    fontFamily: FontFamily.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.sans,
    fontSize: 13,
    padding: 0,
    letterSpacing: -0.1,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontFamily: FontFamily.sans,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 32,
    gap: 10,
  },
  documentItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontFamily: FontFamily.sans,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  docMeta: {
    fontFamily: FontFamily.mono,
    fontSize: 11.5,
  },
  starBtn: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontFamily: FontFamily.sans,
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: FontFamily.sans,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptySub: {
    fontFamily: FontFamily.sans,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
});
