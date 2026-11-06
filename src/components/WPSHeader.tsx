import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';
import {
  Search,
  X,
  ListFilter,
  Check,
  Cloud,
  ArrowDownAZ,
  Calendar,
  HardDrive,
} from 'lucide-react-native';
import { FontFamily } from '../theme/typography';

export type DocumentFormatFilter = 'all' | 'doc' | 'xls' | 'ppt' | 'pdf' | 'txt';
export type SortField = 'date' | 'name' | 'size';
export type SortDirection = 'asc' | 'desc';

export interface WPSHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: DocumentFormatFilter;
  onSelectFilter: (filter: DocumentFormatFilter) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSortChange?: (field: SortField, direction: SortDirection) => void;
  cloudStatus?: 'connected' | 'disconnected' | 'testing' | 'none';
  onCloudPress?: () => void;
  showFilters?: boolean;
}

const FILTER_CHIPS: Array<{
  id: DocumentFormatFilter;
  label: string;
  color: string;
}> = [
  { id: 'all', label: 'All', color: '#007AFF' },
  { id: 'doc', label: 'DOC', color: '#007AFF' },
  { id: 'xls', label: 'XLS', color: '#34C759' },
  { id: 'ppt', label: 'PPT', color: '#FF9500' },
  { id: 'pdf', label: 'PDF', color: '#FF3B30' },
  { id: 'txt', label: 'TXT', color: '#64748B' },
];

export const WPSHeader: React.FC<WPSHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onSelectFilter,
  sortField = 'date',
  sortDirection = 'desc',
  onSortChange,
  cloudStatus = 'none',
  onCloudPress,
  showFilters = true,
}) => {
  const { theme, isDark } = useAppTheme();
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const handleSelectFilter = (filter: DocumentFormatFilter) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onSelectFilter(filter);
  };

  const handleApplySort = (field: SortField, direction: SortDirection) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    if (onSortChange) {
      onSortChange(field, direction);
    }
    setSortModalVisible(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#09090E' : '#FFFFFF',
          borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* Top Search & Actions Row */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? '#14141E' : '#F1F3F5',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            },
          ]}
        >
          <Search size={16} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
            placeholder="Search documents, sheets, slides..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
            returnKeyType="search"
            clearButtonMode="never"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchChange('')}
              style={styles.clearBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={15} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Action Button */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: isDark ? '#14141E' : '#F1F3F5',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            },
          ]}
          onPress={() => setSortModalVisible(true)}
          activeOpacity={0.7}
        >
          <ListFilter size={17} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>

        {/* Cloud Status Indicator (if enabled) */}
        {cloudStatus !== 'none' && (
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: isDark ? '#14141E' : '#F1F3F5',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
            onPress={onCloudPress}
            activeOpacity={0.7}
          >
            <Cloud
              size={17}
              color={
                cloudStatus === 'connected'
                  ? '#10B981'
                  : cloudStatus === 'testing'
                  ? '#F59E0B'
                  : theme.textMuted
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Format Filter Chips Row */}
      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_CHIPS.map(chip => {
            const isSelected = selectedFilter === chip.id;
            const chipColor = chip.color;

            return (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? `${chipColor}25`
                        : `${chipColor}15`
                      : isDark
                      ? '#14141E'
                      : '#F1F3F5',
                    borderColor: isSelected
                      ? chipColor
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
                onPress={() => handleSelectFilter(chip.id)}
                activeOpacity={0.75}
              >
                {chip.id !== 'all' && (
                  <View
                    style={[
                      styles.chipDot,
                      { backgroundColor: isSelected ? chipColor : theme.textMuted },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected ? chipColor : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Sort Options Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSortModalVisible(false)}
        >
          <View
            style={[
              styles.sortMenu,
              {
                backgroundColor: isDark ? '#14141E' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          >
            <Text style={[styles.sortMenuTitle, { color: theme.textSecondary }]}>
              SORT DOCUMENTS
            </Text>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleApplySort('date', 'desc')}
            >
              <View style={styles.sortOptionLeft}>
                <Calendar size={16} color={theme.textPrimary} />
                <Text style={[styles.sortOptionText, { color: theme.textPrimary }]}>
                  Recent (Newest first)
                </Text>
              </View>
              {sortField === 'date' && sortDirection === 'desc' && (
                <Check size={16} color="#007AFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleApplySort('date', 'asc')}
            >
              <View style={styles.sortOptionLeft}>
                <Calendar size={16} color={theme.textPrimary} />
                <Text style={[styles.sortOptionText, { color: theme.textPrimary }]}>
                  Oldest first
                </Text>
              </View>
              {sortField === 'date' && sortDirection === 'asc' && (
                <Check size={16} color="#007AFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleApplySort('name', 'asc')}
            >
              <View style={styles.sortOptionLeft}>
                <ArrowDownAZ size={16} color={theme.textPrimary} />
                <Text style={[styles.sortOptionText, { color: theme.textPrimary }]}>
                  Name (A → Z)
                </Text>
              </View>
              {sortField === 'name' && sortDirection === 'asc' && (
                <Check size={16} color="#007AFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleApplySort('size', 'desc')}
            >
              <View style={styles.sortOptionLeft}>
                <HardDrive size={16} color={theme.textPrimary} />
                <Text style={[styles.sortOptionText, { color: theme.textPrimary }]}>
                  File Size (Largest first)
                </Text>
              </View>
              {sortField === 'size' && sortDirection === 'desc' && (
                <Check size={16} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.sans,
    fontSize: 13.5,
    height: '100%',
    padding: 0,
    letterSpacing: -0.1,
  },
  clearBtn: {
    padding: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 5.5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  filterChipText: {
    fontFamily: FontFamily.sans,
    fontSize: 12,
    letterSpacing: -0.1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sortMenu: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  sortMenuTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sortOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortOptionText: {
    fontFamily: FontFamily.sans,
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
