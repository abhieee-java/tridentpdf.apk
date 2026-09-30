import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { FileText, Share2, Trash2, Plus, HardDrive } from 'lucide-react-native';

interface LocalFile {
  name: string;
  uri: string;
  size: number;
  modificationTime: number;
}

export const DocumentViewerScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadLocalFiles = async () => {
    try {
      if (!FileSystem.documentDirectory) return;
      const fileNames = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const pdfFiles: LocalFile[] = [];

      for (const name of fileNames) {
        if (name.toLowerCase().endsWith('.pdf')) {
          const fileUri = `${FileSystem.documentDirectory}${name}`;
          const info = await FileSystem.getInfoAsync(fileUri);
          if (info.exists) {
            pdfFiles.push({
              name,
              uri: fileUri,
              size: (info as any).size || 0,
              modificationTime: (info as any).modificationTime || Date.now(),
            });
          }
        }
      }

      pdfFiles.sort((a, b) => b.modificationTime - a.modificationTime);
      setFiles(pdfFiles);
    } catch (e) {
      console.log('Error reading documents:', e);
    }
  };

  useEffect(() => {
    loadLocalFiles();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLocalFiles();
    setRefreshing(false);
  };

  const handleShare = async (uri: string) => {
    try {
      await Sharing.shareAsync(uri);
    } catch (err: any) {
      Alert.alert('Share Error', err.message);
    }
  };

  const handleDelete = (file: LocalFile) => {
    Alert.alert('Delete Document', `Are you sure you want to delete ${file.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await FileSystem.deleteAsync(file.uri);
          loadLocalFiles();
        },
      },
    ]);
  };

  const handleImport = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const dest = `${FileSystem.documentDirectory}${asset.name}`;
        await FileSystem.copyAsync({ from: asset.uri, to: dest });
        loadLocalFiles();
        Alert.alert('Imported!', `${asset.name} saved to local documents.`);
      }
    } catch (err: any) {
      Alert.alert('Import Error', err.message);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Top Storage Bar */}
      <View style={[styles.storageCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <HardDrive size={20} color="#3B82F6" />
          <View>
            <Text style={[styles.storageTitle, { color: theme.textPrimary }]}>Device Local Vault</Text>
            <Text style={[styles.storageSub, { color: theme.textSecondary }]}>
              {files.length} document{files.length !== 1 ? 's' : ''} stored safely on device
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.importBtn} onPress={handleImport}>
          <Plus size={16} color="#FFF" />
          <Text style={styles.importBtnText}>Import</Text>
        </TouchableOpacity>
      </View>

      {/* Files List */}
      <FlatList
        data={files}
        keyExtractor={item => item.uri}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={48} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No local documents yet</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Processed files from Merging, Scanning, and Signing will appear here automatically.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.fileCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <View style={styles.fileLeft}>
              <View style={styles.pdfIconBadge}>
                <Text style={styles.pdfIconText}>PDF</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fileName, { color: theme.textPrimary }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.fileMeta, { color: theme.textSecondary }]}>
                  {formatBytes(item.size)} • {new Date(item.modificationTime).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.fileActions}>
              <TouchableOpacity style={styles.actionIconBtn} onPress={() => handleShare(item.uri)}>
                <Share2 size={18} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIconBtn} onPress={() => handleDelete(item)}>
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  storageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  storageTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  storageSub: {
    fontSize: 12,
    marginTop: 2,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  importBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pdfIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfIconText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
  },
  fileMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconBtn: {
    padding: 8,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
