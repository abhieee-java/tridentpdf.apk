import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as DocumentPicker from 'expo-document-picker';
import { WPSHeader, DocumentFormatFilter, SortField, SortDirection } from '../components/WPSHeader';
import { DocumentCard, DocumentItem } from '../components/DocumentCard';
import { DocumentStorageService } from '../services/documentStorage';
import { Search, FilePlus, FolderOpen } from 'lucide-react-native';

export interface DocumentRouteParams {
  filePath: string;
  fileName: string;
  fileType: 'docx' | 'doc' | 'xlsx' | 'xls' | 'csv' | 'pptx' | 'ppt' | 'pdf' | 'txt';
  readOnly?: boolean;
}

interface SectionData {
  title: string;
  data: DocumentItem[];
}

export interface RecentFilesScreenProps {
  onOpenDocument?: (params: DocumentRouteParams) => void;
}

export const RecentFilesScreen: React.FC<RecentFilesScreenProps> = ({ onOpenDocument }) => {
  const { theme, isDark } = useAppTheme();

  // State
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<DocumentFormatFilter>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Load documents
  const loadDocuments = useCallback(async () => {
    try {
      const items = await DocumentStorageService.getRecentDocuments();
      setDocuments(items);
    } catch (e) {
      console.error('Failed to load recent documents:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDocuments();
  }, [loadDocuments]);

  // Document Handlers
  const handleOpenDoc = (doc: DocumentItem) => {
    if (onOpenDocument) {
      onOpenDocument({
        filePath: doc.uri,
        fileName: doc.name,
        fileType: doc.type,
      });
    }
  };

  const handleStarToggle = async (doc: DocumentItem) => {
    await DocumentStorageService.toggleStarDocument(doc.id);
    loadDocuments();
  };

  const handleDelete = async (doc: DocumentItem) => {
    await DocumentStorageService.removeDocument(doc.id);
    loadDocuments();
  };

  const handleImportFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets || res.assets.length === 0) return;

      const file = res.assets[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      const docType = (['docx', 'doc', 'xlsx', 'xls', 'csv', 'pptx', 'ppt', 'pdf', 'txt'].includes(ext)
        ? ext
        : 'txt') as DocumentItem['type'];

      const newDoc: DocumentItem = {
        id: `doc_${Date.now()}`,
        name: file.name,
        uri: file.uri,
        type: docType,
        size: file.size || 0,
        modifiedAt: Date.now(),
      };

      await DocumentStorageService.addDocument(newDoc);
      loadDocuments();
    } catch (e) {
      console.error('Failed to pick document:', e);
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSortedDocs = useMemo(() => {
    let list = [...documents];

    // 1. Format Filter
    if (selectedFilter !== 'all') {
      list = list.filter(item => {
        if (selectedFilter === 'doc') return item.type === 'docx' || item.type === 'doc';
        if (selectedFilter === 'xls')
          return item.type === 'xlsx' || item.type === 'xls' || item.type === 'csv';
        if (selectedFilter === 'ppt') return item.type === 'pptx' || item.type === 'ppt';
        if (selectedFilter === 'pdf') return item.type === 'pdf';
        if (selectedFilter === 'txt') return item.type === 'txt';
        return true;
      });
    }

    // 2. Search Query Filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        item => item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'desc'
          ? b.modifiedAt - a.modifiedAt
          : a.modifiedAt - b.modifiedAt;
      }
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortField === 'size') {
        return sortDirection === 'desc' ? b.size - a.size : a.size - b.size;
      }
      return 0;
    });

    return list;
  }, [documents, selectedFilter, searchQuery, sortField, sortDirection]);

  // Section Categorization
  const sections: SectionData[] = useMemo(() => {
    const dayMs = 24 * 60 * 60 * 1000;

    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const startOfYesterday = startOfToday - dayMs;
    const startOfWeek = startOfToday - 7 * dayMs;
    const startOfMonth = startOfToday - 30 * dayMs;

    const groups: { [key: string]: DocumentItem[] } = {
      Today: [],
      Yesterday: [],
      'Earlier this Week': [],
      'Earlier this Month': [],
      Older: [],
    };

    filteredAndSortedDocs.forEach(doc => {
      const t = doc.modifiedAt;
      if (t >= startOfToday) {
        groups.Today.push(doc);
      } else if (t >= startOfYesterday) {
        groups.Yesterday.push(doc);
      } else if (t >= startOfWeek) {
        groups['Earlier this Week'].push(doc);
      } else if (t >= startOfMonth) {
        groups['Earlier this Month'].push(doc);
      } else {
        groups.Older.push(doc);
      }
    });

    const result: SectionData[] = [];
    Object.keys(groups).forEach(key => {
      if (groups[key].length > 0) {
        result.push({
          title: key,
          data: groups[key],
        });
      }
    });

    return result;
  }, [filteredAndSortedDocs]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Authentic WPS Header */}
      <WPSHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={(field, dir) => {
          setSortField(field);
          setSortDirection(dir);
        }}
        showFilters={true}
      />

      {/* Document Sections List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          {searchQuery.trim().length > 0 || selectedFilter !== 'all' ? (
            <View style={styles.emptyContent}>
              <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1F1F2A' : '#F1F3F5' }]}>
                <Search size={32} color={theme.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No matching documents
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                No results found for &ldquo;{searchQuery || selectedFilter.toUpperCase()}&rdquo;
              </Text>
              <TouchableOpacity
                style={styles.clearFilterBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
              >
                <Text style={styles.clearFilterBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContent}>
              <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1F1F2A' : '#F1F3F5' }]}>
                <FolderOpen size={36} color={theme.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No Recent Documents
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Create a new document with (+) or import from device storage.
              </Text>
              <TouchableOpacity style={styles.importBtn} onPress={handleImportFile}>
                <FilePlus size={16} color="#FFFFFF" />
                <Text style={styles.importBtnText}>Import Document</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DocumentCard
              document={item}
              onPress={handleOpenDoc}
              onStarToggle={handleStarToggle}
              onDelete={handleDelete}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={[styles.sectionHeader, { backgroundColor: theme.bg }]}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                {title.toUpperCase()}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2563EB"
              colors={['#2563EB']}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 280,
    gap: 12,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  clearFilterBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 20,
  },
  clearFilterBtnText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 13,
  },
  importBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#2563EB',
    borderRadius: 20,
  },
  importBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
});
