import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { AppTool, ToolCategory } from '../types';
import { searchTools, TOOL_CATEGORIES, ToolDefinition } from '../data/toolRegistry';
import {
  Search,
  X,
  Sparkles,
  Command,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

interface CommandPaletteModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTool: (toolId: AppTool) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  visible,
  onClose,
  onSelectTool,
}) => {
  const { theme, isDark } = useAppTheme();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  const filteredTools = useMemo(() => {
    return searchTools(query, selectedCategory);
  }, [query, selectedCategory]);

  const handleChoose = (toolId: AppTool) => {
    onClose();
    onSelectTool(toolId);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: isDark ? '#111118' : '#FFFFFF',
              borderColor: isDark ? '#27272A' : '#E5E7EB',
            },
          ]}
        >
          {/* SEARCH INPUT BAR */}
          <View
            style={[
              styles.inputRow,
              { borderBottomColor: isDark ? '#27272A' : '#E5E7EB' },
            ]}
          >
            <Search size={18} color={isDark ? '#06B6D4' : '#2563EB'} />
            <TextInput
              style={[styles.input, { color: isDark ? '#FFFFFF' : '#111827' }]}
              placeholder="Search 25+ PDF tools, actions & guides..."
              placeholderTextColor="#71717A"
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 ? (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onClose}>
                <X size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* CATEGORY FILTER CHIPS */}
          <View style={styles.categoriesRow}>
            {TOOL_CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: active
                        ? '#2563EB'
                        : isDark
                        ? '#1C1C28'
                        : '#F3F4F6',
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      { color: active ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* RESULTS LIST */}
          <FlatList
            data={filteredTools}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.itemRow,
                  {
                    borderBottomColor: isDark ? '#1C1C28' : '#F3F4F6',
                  },
                ]}
                onPress={() => handleChoose(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.itemIconBox,
                      { backgroundColor: isDark ? '#1C1C28' : '#EFF6FF' },
                    ]}
                  >
                    <Sparkles size={14} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={styles.itemTitleRow}>
                      <Text style={[styles.itemTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                        {item.name}
                      </Text>
                      {item.badge && (
                        <View style={styles.badgeBox}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[styles.itemDesc, { color: theme.textSecondary }]}
                      numberOfLines={1}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={14} color={theme.textMuted} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No tools found matching "{query}"
                </Text>
              </View>
            }
          />

          {/* FOOTER */}
          <View
            style={[
              styles.footer,
              { borderTopColor: isDark ? '#27272A' : '#E5E7EB' },
            ]}
          >
            <View style={styles.footerRow}>
              <ShieldCheck size={12} color="#10B981" />
              <Text style={[styles.footerText, { color: theme.textMuted }]}>
                100% Client-Side In-Memory Execution • DPDP 2023 Compliant
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  dialog: {
    borderRadius: 18,
    borderWidth: 1,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    padding: 0,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  catChipText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  itemIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  badgeBox: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#2563EB',
    fontSize: 9.5,
    fontWeight: '700',
  },
  itemDesc: {
    fontSize: 11,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 10,
  },
});
