import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Camera,
  CloudUpload,
  X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme/ThemeContext';

export type WPSActionType =
  | 'new_doc'
  | 'new_sheet'
  | 'new_slide'
  | 'scan'
  | 'cloudinary_upload';

export interface WPSActionMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectAction: (action: WPSActionType) => void;
}

interface ActionConfig {
  id: WPSActionType;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: any;
  iconColor: string;
  tintBg: string;
}

const ACTION_CONFIGS: ActionConfig[] = [
  {
    id: 'new_doc',
    title: 'New Document',
    subtitle: 'Blank Word document (.docx)',
    badge: 'DOCX',
    badgeColor: '#2563EB',
    icon: FileText,
    iconColor: '#2563EB',
    tintBg: 'rgba(37, 99, 235, 0.12)',
  },
  {
    id: 'new_sheet',
    title: 'New Spreadsheet',
    subtitle: 'Blank Excel sheet (.xlsx)',
    badge: 'XLSX',
    badgeColor: '#16A34A',
    icon: FileSpreadsheet,
    iconColor: '#16A34A',
    tintBg: 'rgba(22, 163, 74, 0.12)',
  },
  {
    id: 'new_slide',
    title: 'New Presentation',
    subtitle: 'Blank slide deck (.pptx)',
    badge: 'PPTX',
    badgeColor: '#EA580C',
    icon: Presentation,
    iconColor: '#EA580C',
    tintBg: 'rgba(234, 88, 12, 0.12)',
  },
  {
    id: 'scan',
    title: 'Scan Document',
    subtitle: 'Camera capture & edge framing',
    badge: 'SCAN',
    badgeColor: '#8B5CF6',
    icon: Camera,
    iconColor: '#8B5CF6',
    tintBg: 'rgba(139, 92, 246, 0.12)',
  },
  {
    id: 'cloudinary_upload',
    title: 'Cloudinary Upload',
    subtitle: 'Upload file to Cloud storage drive',
    badge: 'CLOUD',
    badgeColor: '#0284C7',
    icon: CloudUpload,
    iconColor: '#0284C7',
    tintBg: 'rgba(2, 132, 199, 0.12)',
  },
];

export const WPSActionMenu: React.FC<WPSActionMenuProps> = ({
  visible,
  onClose,
  onSelectAction,
}) => {
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [shouldRender, setShouldRender] = useState<boolean>(visible);

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const trayAnim = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(ACTION_CONFIGS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      backdropAnim.setValue(0);
      trayAnim.setValue(0);
      itemAnims.forEach(anim => anim.setValue(0));

      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(trayAnim, {
          toValue: 1,
          tension: 65,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.stagger(
          28,
          itemAnims.map(anim =>
            Animated.spring(anim, {
              toValue: 1,
              tension: 75,
              friction: 8,
              useNativeDriver: true,
            })
          )
        ),
      ]).start();
    } else if (shouldRender) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(trayAnim, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        ...itemAnims.map(anim =>
          Animated.timing(anim, {
            toValue: 0,
            duration: 140,
            useNativeDriver: true,
          })
        ),
      ]).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
        }
      });
    }
  }, [visible]);

  // Cleanup on unmount to prevent leaks
  useEffect(() => {
    return () => {
      backdropAnim.stopAnimation();
      trayAnim.stopAnimation();
      itemAnims.forEach(anim => anim.stopAnimation());
    };
  }, []);

  if (!visible && !shouldRender) {
    return null;
  }

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onClose();
  };

  const handleItemPress = (actionId: WPSActionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onClose();
    setTimeout(() => {
      onSelectAction(actionId);
    }, 150);
  };

  const trayTranslateY = trayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const trayScale = trayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.93, 1.0],
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Translucent Backdrop */}
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: '#000000',
              opacity: backdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.55],
              }),
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Floating Action Tray Card */}
      <View
        style={[styles.trayWrapper, { paddingBottom: Math.max(insets.bottom, 10) + 68 }]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.trayCard,
            {
              backgroundColor: isDark ? '#14141E' : '#FFFFFF',
              borderColor: isDark ? '#262636' : '#E5E7EB',
              transform: [{ translateY: trayTranslateY }, { scale: trayScale }],
            },
          ]}
        >
          {/* Card Header */}
          <View style={styles.trayHeader}>
            <View>
              <Text style={[styles.trayTitle, { color: theme.textPrimary }]}>Quick Actions</Text>
              <Text style={[styles.traySubtitle, { color: theme.textMuted }]}>
                Create document or launch tool
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss} activeOpacity={0.7}>
              <X size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Action List */}
          <View style={styles.actionList}>
            {ACTION_CONFIGS.map((item, index) => {
              const Icon = item.icon;
              const itemTranslateY = itemAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              });
              const itemOpacity = itemAnims[index];

              return (
                <Animated.View
                  key={item.id}
                  style={{
                    opacity: itemOpacity,
                    transform: [{ translateY: itemTranslateY }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.actionRow,
                      index > 0 && {
                        borderTopWidth: 1,
                        borderTopColor: isDark ? '#22222E' : '#F1F3F5',
                      },
                    ]}
                    onPress={() => handleItemPress(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.actionIconBox, { backgroundColor: item.tintBg }]}>
                      <Icon size={22} color={item.iconColor} />
                    </View>
                    <View style={styles.actionTextBox}>
                      <Text style={[styles.actionTitle, { color: theme.textPrimary }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.actionSubtitle, { color: theme.textMuted }]}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.formatBadge,
                        {
                          borderColor: `${item.badgeColor}40`,
                          backgroundColor: `${item.badgeColor}15`,
                        },
                      ]}
                    >
                      <Text style={[styles.formatBadgeText, { color: item.badgeColor }]}>
                        {item.badge}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trayWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  trayCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },
  trayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.12)',
  },
  trayTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  traySubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionList: {
    gap: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 11,
    marginTop: 1.5,
  },
  formatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 7,
    borderWidth: 1,
  },
  formatBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
