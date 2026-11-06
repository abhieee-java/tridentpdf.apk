import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { MoreVertical, Star, Cloud, HardDrive } from 'lucide-react-native';
import { FormatBadge, DocumentType } from './FormatBadge';
import { FontFamily } from '../theme/typography';

export interface DocumentItem {
  id: string;
  name: string;
  uri: string;
  type: DocumentType;
  size: number;
  modifiedAt: number; // Unix timestamp in ms
  isStarred?: boolean;
  isCloud?: boolean;
}

export interface DocumentCardProps {
  document: DocumentItem;
  onPress: (document: DocumentItem) => void;
  onStarToggle?: (document: DocumentItem) => void;
  onDelete?: (document: DocumentItem) => void;
}

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatTimeAgo = (timestampMs: number): string => {
  const now = Date.now();
  const diff = now - timestampMs;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'Just now';
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) {
    const date = new Date(timestampMs);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 2 * day) return 'Yesterday';
  const date = new Date(timestampMs);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onStarToggle,
  onDelete,
}) => {
  const { theme, isDark } = useAppTheme();

  const handleCardPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onPress(document);
  };

  const handleActionMenu = () => {
    try {
      Haptics.selectionAsync();
    } catch {}

    Alert.alert(
      document.name,
      `Format: ${document.type.toUpperCase()} • Size: ${formatFileSize(document.size)}`,
      [
        {
          text: 'Open Document',
          onPress: () => onPress(document),
        },
        {
          text: document.isStarred ? 'Unfavorite' : 'Mark Favorite',
          onPress: () => onStarToggle && onStarToggle(document),
        },
        {
          text: 'Share / Export',
          onPress: async () => {
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(document.uri);
            }
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete && onDelete(document),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#111118' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
      onPress={handleCardPress}
      activeOpacity={0.72}
    >
      {/* Format Badge */}
      <FormatBadge type={document.type} size="md" />

      {/* Title & Metadata */}
      <View style={styles.body}>
        <Text
          style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {document.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.metaTime, { color: theme.textMuted }]}>
            {formatTimeAgo(document.modifiedAt)}
          </Text>
          <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
          <Text style={[styles.metaSize, { color: isDark ? '#38BDF8' : '#007AFF' }]}>
            {formatFileSize(document.size)}
          </Text>

          {document.isCloud ? (
            <View style={styles.cloudBadge}>
              <Cloud size={10} color="#007AFF" />
              <Text style={styles.cloudText}>Cloud</Text>
            </View>
          ) : (
            <View style={styles.localBadge}>
              <HardDrive size={10} color={theme.textMuted} />
            </View>
          )}

          {document.isStarred && (
            <Star size={11} color="#F59E0B" fill="#F59E0B" style={styles.starIcon} />
          )}
        </View>
      </View>

      {/* Overflow Action Button */}
      <TouchableOpacity
        style={styles.moreBtn}
        onPress={handleActionMenu}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <MoreVertical size={16} color={theme.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 4,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontFamily: FontFamily.sans,
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaTime: {
    fontFamily: FontFamily.sans,
    fontSize: 11.5,
    letterSpacing: -0.1,
  },
  metaDot: {
    fontSize: 9,
  },
  metaSize: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '600',
  },
  cloudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 3,
  },
  cloudText: {
    fontFamily: FontFamily.mono,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#007AFF',
  },
  localBadge: {
    marginLeft: 2,
  },
  starIcon: {
    marginLeft: 4,
  },
  moreBtn: {
    padding: 6,
  },
});
