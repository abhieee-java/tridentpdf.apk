import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import {
  SystemErrorService,
  AppNotification,
  ErrorSeverity,
} from '../services/systemErrorService';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  ArrowRight,
} from 'lucide-react-native';

const SEVERITY_THEME: Record<
  ErrorSeverity,
  {
    bgDark: string;
    bgLight: string;
    borderDark: string;
    borderLight: string;
    iconColor: string;
  }
> = {
  error: {
    bgDark: '#2D1517',
    bgLight: '#FEF2F2',
    borderDark: 'rgba(239, 68, 68, 0.35)',
    borderLight: '#FCA5A5',
    iconColor: '#EF4444',
  },
  warning: {
    bgDark: '#2C2013',
    bgLight: '#FFFBEB',
    borderDark: 'rgba(245, 158, 11, 0.35)',
    borderLight: '#FCD34D',
    iconColor: '#F59E0B',
  },
  info: {
    bgDark: '#122038',
    bgLight: '#EFF6FF',
    borderDark: 'rgba(59, 130, 246, 0.35)',
    borderLight: '#BFDBFE',
    iconColor: '#3B82F6',
  },
  success: {
    bgDark: '#13281E',
    bgLight: '#ECFDF5',
    borderDark: 'rgba(16, 185, 129, 0.35)',
    borderLight: '#A7F3D0',
    iconColor: '#10B981',
  },
};

export const SystemNotificationBanner: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const [notification, setNotification] = useState<AppNotification | null>(null);

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = SystemErrorService.subscribe(curr => {
      if (curr) {
        setNotification(curr);
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            stiffness: 350,
            damping: 28,
            mass: 0.8,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -120,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setNotification(null);
        });
      }
    });

    return () => unsubscribe();
  }, [translateY, opacity]);

  if (!notification) return null;

  const severityConf = SEVERITY_THEME[notification.severity] || SEVERITY_THEME.info;
  const bgColor = isDark ? severityConf.bgDark : severityConf.bgLight;
  const borderColor = isDark ? severityConf.borderDark : severityConf.borderLight;

  const renderIcon = () => {
    switch (notification.severity) {
      case 'error':
        return <AlertCircle size={20} color={severityConf.iconColor} />;
      case 'warning':
        return <AlertTriangle size={20} color={severityConf.iconColor} />;
      case 'success':
        return <CheckCircle2 size={20} color={severityConf.iconColor} />;
      case 'info':
      default:
        return <Info size={20} color={severityConf.iconColor} />;
    }
  };

  const handleAction = () => {
    if (notification.onAction) {
      notification.onAction();
    }
    SystemErrorService.clear(notification.id);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.pill,
          {
            backgroundColor: bgColor,
            borderColor,
            shadowColor: severityConf.iconColor,
          },
        ]}
      >
        <View style={styles.iconContainer}>{renderIcon()}</View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]} numberOfLines={2}>
            {notification.message}
          </Text>

          {notification.actionLabel && (
            <TouchableOpacity style={styles.actionBtn} onPress={handleAction}>
              <Text style={[styles.actionBtnText, { color: severityConf.iconColor }]}>
                {notification.actionLabel}
              </Text>
              <ArrowRight size={13} color={severityConf.iconColor} />
            </TouchableOpacity>
          )}
        </View>

        {notification.dismissible && (
          <TouchableOpacity
            style={styles.dismissBtn}
            onPress={() => SystemErrorService.clear(notification.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={16} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 12,
    left: 16,
    right: 16,
    zIndex: 99999,
    alignItems: 'center',
  },
  pill: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 18,
    borderWidth: 1.2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    paddingTop: 2,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dismissBtn: {
    padding: 4,
    borderRadius: 8,
  },
});
