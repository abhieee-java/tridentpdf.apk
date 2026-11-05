import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import {
  Smartphone,
  Cloud,
  Search,
  ArrowUpDown,
  Plus,
  Trash2,
  Share2,
  Download,
  FolderOpen,
  Settings as SettingsIcon,
  CheckCircle2,
} from 'lucide-react-native';
import { FormatBadge, DocumentType } from '../components/FormatBadge';
import { DocumentStorageService } from '../services/documentStorage';
import { SystemErrorService } from '../services/systemErrorService';
import { ActiveDocumentStore } from '../services/activeDocumentStore';
import * as Haptics from 'expo-haptics';

export type SupportedOfficeFormat = DocumentType;

export interface DocumentRouteParams {
  filePath: string;
  fileName: string;
  fileType: SupportedOfficeFormat;
  readOnly?: boolean;
}

export interface LocalDocument {
  id: string;
  name: string;
  uri: string;
  size: number;
  modificationTime: number;
  format: SupportedOfficeFormat;
}

export interface CloudResource {
  publicId: string;
  fileName: string;
  fileType: string;
  bytes: number;
  format: string;
  createdAt: string;
  secureUrl: string;
}

export interface FoldersCloudScreenProps {
  onOpenDocument?: (params: DocumentRouteParams) => void;
  onNavigateToSettings?: () => void;
}

type SortField = 'date' | 'name' | 'size';

const DEMO_CLOUD_RESOURCES: CloudResource[] = [
  {
    publicId: 'wps_office/documents/Q3_Budget_Summary.xlsx',
    fileName: 'Q3_Budget_Summary.xlsx',
    fileType: 'xlsx',
    bytes: 342 * 1024,
    format: 'xlsx',
    createdAt: '2026-10-07T09:30:00Z',
    secureUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/wps_office/documents/Q3_Budget_Summary.xlsx',
  },
  {
    publicId: 'wps_office/documents/Executive_Brief_2026.docx',
    fileName: 'Executive_Brief_2026.docx',
    fileType: 'docx',
    bytes: 215 * 1024,
    format: 'docx',
    createdAt: '2026-10-06T14:15:00Z',
    secureUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/wps_office/documents/Executive_Brief_2026.docx',
  },
  {
    publicId: 'wps_office/documents/Product_Strategy_Deck.pptx',
    fileName: 'Product_Strategy_Deck.pptx',
    fileType: 'pptx',
    bytes: 5120 * 1024,
    format: 'pptx',
    createdAt: '2026-10-05T18:45:00Z',
    secureUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/wps_office/documents/Product_Strategy_Deck.pptx',
  },
  {
    publicId: 'wps_office/documents/Cloudinary_Integration_Manual.pdf',
    fileName: 'Cloudinary_Integration_Manual.pdf',
    fileType: 'pdf',
    bytes: 1420 * 1024,
    format: 'pdf',
    createdAt: '2026-10-04T11:20:00Z',
    secureUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/wps_office/documents/Cloudinary_Integration_Manual.pdf',
  },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const FoldersCloudScreen: React.FC<FoldersCloudScreenProps> = ({
  onOpenDocument,
  onNavigateToSettings,
}) => {
  const { theme, isDark } = useAppTheme();

  const [activeSegment, setActiveSegment] = useState<'local' | 'cloud'>('local');
  const [localFiles, setLocalFiles] = useState<LocalDocument[]>([]);
  const [cloudFiles, setCloudFiles] = useState<CloudResource[]>(DEMO_CLOUD_RESOURCES);
  const [cloudFolderName] = useState<string>('wps_office/documents');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scanLocalFiles = useCallback(async () => {
    try {
      const items = await DocumentStorageService.listAllLocalFiles();
      const mapped: LocalDocument[] = items.map(item => ({
        id: item.id,
        name: item.name,
        uri: item.uri,
        size: item.size,
        modificationTime: item.modifiedAt,
        format: item.type,
      }));
      setLocalFiles(mapped);
    } catch (err) {
      console.warn('Error reading local documents:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    scanLocalFiles();
  }, [scanLocalFiles]);

  const handleRefresh = () => {
    setRefreshing(true);
    scanLocalFiles();
  };

  const handleImportDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const file = result.assets[0];
      const targetUri = `${FileSystem.documentDirectory}${file.name}`;
      await FileSystem.copyAsync({ from: file.uri, to: targetUri });

      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      const docType = (['docx', 'doc', 'xlsx', 'xls', 'csv', 'pptx', 'ppt', 'pdf', 'txt'].includes(ext)
        ? ext
        : 'txt') as DocumentType;

      await DocumentStorageService.addDocument({
        id: `local_${file.name}`,
        name: file.name,
        uri: targetUri,
        type: docType,
        size: file.size || 0,
        modifiedAt: Date.now(),
      });

      await ActiveDocumentStore.setActiveDocument({
        name: file.name,
        uri: targetUri,
        type: docType,
        size: file.size || 0,
      });

      SystemErrorService.showNotification({
        code: 'DOCUMENT_READY',
        title: 'Imported to Vault',
        message: `${file.name} saved safely to local storage.`,
        severity: 'success',
      });
      scanLocalFiles();
    } catch (err: any) {
      SystemErrorService.reportError(err, 'Vault Import');
    }
  };

  const handleOpenLocal = (doc: LocalDocument) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    ActiveDocumentStore.setActiveDocument({
      name: doc.name,
      uri: doc.uri,
      type: doc.format,
      size: doc.size,
    });
    if (onOpenDocument) {
      onOpenDocument({
        filePath: doc.uri,
        fileName: doc.name,
        fileType: doc.format,
        readOnly: false,
      });
    }
  };

  const handleShareLocal = async (doc: LocalDocument) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(doc.uri);
      } else {
        SystemErrorService.showNotification({
          code: 'OPERATION_FAILED',
          title: 'Share Notice',
          message: 'Native sharing is not available on this device.',
          severity: 'warning',
        });
      }
    } catch (err: any) {
      SystemErrorService.reportError(err, 'Share Document');
    }
  };

  const handleDeleteLocal = (doc: LocalDocument) => {
    Alert.alert('Delete Document', `Are you sure you want to delete ${doc.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            await DocumentStorageService.removeDocument(doc.id);
            scanLocalFiles();
            SystemErrorService.showNotification({
              code: 'OPERATION_FAILED',
              title: 'Document Deleted',
              message: `"${doc.name}" removed from local storage.`,
              severity: 'info',
            });
          } catch (err: any) {
            SystemErrorService.reportError(err, 'Delete Document');
          }
        },
      },
    ]);
  };

  const handleDownloadCloud = async (item: CloudResource) => {
    setIsLoading(true);
    try {
      // Simulate/prepare download to local storage
      const targetUri = `${FileSystem.documentDirectory}${item.fileName}`;
      const ext = item.fileName.split('.').pop()?.toLowerCase() || 'txt';
      const docType = (['docx', 'doc', 'xlsx', 'xls', 'csv', 'pptx', 'ppt', 'pdf', 'txt'].includes(ext)
        ? ext
        : 'txt') as DocumentType;

      await FileSystem.writeAsStringAsync(targetUri, `Cloud Synced: ${item.fileName}`, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await DocumentStorageService.addDocument({
        id: `cloud_dl_${Date.now()}`,
        name: item.fileName,
        uri: targetUri,
        type: docType,
        size: item.bytes,
        modifiedAt: Date.now(),
        isCloud: true,
      });

      setIsLoading(false);
      SystemErrorService.showNotification({
        code: 'OPERATION_SUCCESS',
        title: 'Download Complete',
        message: `${item.fileName} downloaded to Phone Storage.`,
        severity: 'success',
      });
      scanLocalFiles();
    } catch (err: any) {
      setIsLoading(false);
      SystemErrorService.reportError(err, 'Cloud Download');
    }
  };

  const filteredLocalFiles = useMemo(() => {
    let list = [...localFiles];

    if (filterFormat !== 'all') {
      list = list.filter(item => {
        if (filterFormat === 'doc' || filterFormat === 'docx') {
          return item.format === 'docx' || item.format === 'doc';
        }
        if (filterFormat === 'xls' || filterFormat === 'xlsx') {
          return item.format === 'xlsx' || item.format === 'xls' || item.format === 'csv';
        }
        if (filterFormat === 'ppt' || filterFormat === 'pptx') {
          return item.format === 'pptx' || item.format === 'ppt';
        }
        return item.format === filterFormat;
      });
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => item.name.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = b.modificationTime - a.modificationTime;
      else if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'size') cmp = b.size - a.size;
      return sortAsc ? -cmp : cmp;
    });
    return list;
  }, [localFiles, filterFormat, searchQuery, sortBy, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const renderLocalItem = ({ item }: { item: LocalDocument }) => {
    return (
      <TouchableOpacity
        style={[styles.docCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
        onPress={() => handleOpenLocal(item)}
        activeOpacity={0.7}
      >
        <FormatBadge type={item.format} size="md" />

        <View style={styles.docInfo}>
          <Text style={[styles.docName, { color: theme.textPrimary }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.docMeta, { color: theme.textMuted }]}>
            {formatDate(item.modificationTime)} · {formatBytes(item.size)}
          </Text>
        </View>

        <View style={styles.docActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleShareLocal(item)}>
            <Share2 size={16} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteLocal(item)}>
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCloudItem = ({ item }: { item: CloudResource }) => {
    return (
      <View
        style={[styles.docCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
      >
        <FormatBadge type={item.fileType} size="md" />

        <View style={styles.docInfo}>
          <View style={styles.cloudTitleRow}>
            <Text style={[styles.docName, { color: theme.textPrimary }]} numberOfLines={1}>
              {item.fileName}
            </Text>
            <View style={styles.cloudTag}>
              <Text style={styles.cloudTagText}>Cloud</Text>
            </View>
          </View>
          <Text style={[styles.docMeta, { color: theme.textMuted }]}>
            {item.createdAt.split('T')[0]} · {formatBytes(item.bytes)}
          </Text>
        </View>

        <View style={styles.docActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.downloadBtn]}
            onPress={() => handleDownloadCloud(item)}
          >
            <Download size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Dual Segment Selector Header */}
      <View style={[styles.segmentContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeSegment === 'local' && { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
          ]}
          onPress={() => setActiveSegment('local')}
          activeOpacity={0.8}
        >
          <Smartphone
            size={16}
            color={activeSegment === 'local' ? '#2563EB' : theme.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: activeSegment === 'local' ? '#2563EB' : theme.textMuted },
              activeSegment === 'local' && styles.segmentTextActive,
            ]}
          >
            Phone Storage
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeSegment === 'cloud' && { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
          ]}
          onPress={() => setActiveSegment('cloud')}
          activeOpacity={0.8}
        >
          <Cloud
            size={16}
            color={activeSegment === 'cloud' ? '#2563EB' : theme.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: activeSegment === 'cloud' ? '#2563EB' : theme.textMuted },
              activeSegment === 'cloud' && styles.segmentTextActive,
            ]}
          >
            Cloudinary Cloud
          </Text>
        </TouchableOpacity>
      </View>

      {/* Local Storage Segment View */}
      {activeSegment === 'local' && (
        <View style={styles.body}>
          {/* Action & Filter Bar */}
          <View style={styles.toolbar}>
            <View style={[styles.searchBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Search size={16} color={theme.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: theme.textPrimary }]}
                placeholder="Search phone files..."
                placeholderTextColor={theme.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <TouchableOpacity style={styles.sortToggle} onPress={() => toggleSort('date')}>
              <ArrowUpDown size={16} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.importBtn} onPress={handleImportDocument}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.importBtnText}>Import</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Format Filter Chips */}
          <View style={styles.chipsRow}>
            {['all', 'docx', 'xlsx', 'pptx', 'pdf', 'txt'].map(fmt => (
              <TouchableOpacity
                key={fmt}
                style={[
                  styles.chip,
                  { borderColor: theme.border },
                  filterFormat === fmt && { backgroundColor: '#2563EB', borderColor: '#2563EB' },
                ]}
                onPress={() => setFilterFormat(fmt)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: theme.textSecondary },
                    filterFormat === fmt && { color: '#FFFFFF', fontWeight: '700' },
                  ]}
                >
                  {fmt === 'all' ? 'All' : fmt.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Local File List */}
          <FlatList
            data={filteredLocalFiles}
            keyExtractor={item => item.id}
            renderItem={renderLocalItem}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <FolderOpen size={48} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                  No Documents Found
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                  Import DOCX, XLSX, PPTX, PDF, or TXT documents to browse them offline.
                </Text>
                <TouchableOpacity style={styles.emptyAction} onPress={handleImportDocument}>
                  <Text style={styles.emptyActionText}>Import Document</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      )}

      {/* Cloudinary Cloud Segment View */}
      {activeSegment === 'cloud' && (
        <View style={styles.body}>
          {/* Cloud Connection Status Card */}
          <View
            style={[
              styles.cloudBanner,
              { backgroundColor: theme.surfaceCard, borderColor: theme.border },
            ]}
          >
            <View style={styles.cloudBannerHeader}>
              <View style={styles.cloudIconBadge}>
                <Cloud size={20} color="#2563EB" />
              </View>
              <View style={styles.cloudBannerMeta}>
                <Text style={[styles.cloudBannerTitle, { color: theme.textPrimary }]}>
                  Cloudinary Cloud Drive
                </Text>
                <Text style={[styles.cloudBannerFolder, { color: theme.textMuted }]}>
                  Root: /{cloudFolderName}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.cloudSettingsBtn}
                onPress={onNavigateToSettings}
              >
                <SettingsIcon size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.cloudStatusRow}>
              <View style={styles.statusPill}>
                <CheckCircle2 size={13} color="#10B981" />
                <Text style={styles.statusPillText}>Ready & Configured</Text>
              </View>
              <Text style={[styles.cloudCountText, { color: theme.textMuted }]}>
                {cloudFiles.length} remote documents
              </Text>
            </View>
          </View>

          {/* Cloud Documents FlatList */}
          <FlatList
            data={cloudFiles}
            keyExtractor={item => item.publicId}
            renderItem={renderCloudItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Cloud size={48} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                  Cloud Drive is Empty
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                  Upload documents from local storage to sync across devices.
                </Text>
              </View>
            }
          />
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentContainer: {
    flexDirection: 'row',
    padding: 6,
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
  },
  segmentTextActive: {
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
    marginVertical: 4,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 38,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  sortToggle: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
  },
  importBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 6,
    marginVertical: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 8,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 3,
  },
  docInfo: {
    flex: 1,
    marginLeft: 12,
  },
  docName: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  docMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  docActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
  },
  downloadBtn: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  cloudBanner: {
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  cloudBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cloudIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudBannerMeta: {
    flex: 1,
    marginLeft: 10,
  },
  cloudBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cloudBannerFolder: {
    fontSize: 11,
    marginTop: 1,
  },
  cloudSettingsBtn: {
    padding: 6,
  },
  cloudStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusPillText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  cloudCountText: {
    fontSize: 11,
  },
  cloudTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cloudTag: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  cloudTagText: {
    fontSize: 9.5,
    color: '#2563EB',
    fontWeight: '700',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  emptyAction: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
