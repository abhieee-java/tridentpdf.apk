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
  { id: 'all', label: 'All', color: '#3B82F6' },
  { id: 'doc', label: 'DOC', color: '#2563EB' },
  { id: 'xls', label: 'XLS', color: '#16A34A' },
  { id: 'ppt', label: 'PPT', color: '#EA580C' },
  { id: 'pdf', label: 'PDF', color: '#DC2626' },
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
          backgroundColor: isDark ? '#121217' : '#FFFFFF',
          borderBottomColor: isDark ? '#27272A' : '#EBE7F7',
        },
      ]}
    >
      {/* Top Search & Actions Row */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? '#1E1E26' : '#F3F4F6',
              borderColor: isDark ? '#2E2E3C' : '#E5E7EB',
            },
          ]}
        >
          <Search size={18} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
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
              backgroundColor: isDark ? '#1E1E26' : '#F3F4F6',
              borderColor: isDark ? '#2E2E3C' : '#E5E7EB',
            },
          ]}
          onPress={() => setSortModalVisible(true)}
          activeOpacity={0.7}
        >
          <ListFilter size={18} color={theme.textPrimary} />
        </TouchableOpacity>

        {/* Cloud Status Indicator (if enabled) */}
        {cloudStatus !== 'none' && (
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: isDark ? '#1E1E26' : '#F3F4F6',
                borderColor: isDark ? '#2E2E3C' : '#E5E7EB',
              },
            ]}
            onPress={onCloudPress}
            activeOpacity={0.7}
          >
            <Cloud
              size={18}
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
                      ? '#1A1A22'
                      : '#F3F4F6',
                    borderColor: isSelected
                      ? chipColor
                      : isDark
                      ? '#272732'
                      : '#E5E7EB',
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
                backgroundColor: isDark ? '#1C1C24' : '#FFFFFF',
                borderColor: isDark ? '#2E2E3C' : '#E5E7EB',
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
                <Check size={16} color="#2563EB" />
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
                <Check size={16} color="#2563EB" />
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
                <Check size={16} color="#2563EB" />
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
                <Check size={16} color="#2563EB" />
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
    borderBottomWidth: 1,
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
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterChipText: {
    fontSize: 12.5,
    letterSpacing: 0.2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  sortMenuTitle: {
    fontSize: 11,
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
    fontSize: 14,
    fontWeight: '500',
  },
});
