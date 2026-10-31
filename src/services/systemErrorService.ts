import * as Haptics from 'expo-haptics';

export type ErrorSeverity = 'error' | 'warning' | 'info' | 'success';

export type SystemErrorCode =
  | 'FILE_NOT_FOUND'
  | 'FILE_ACCESS_DENIED'
  | 'INVALID_FORMAT'
  | 'ENCRYPTED_PASSWORD_REQUIRED'
  | 'INVALID_PASSWORD'
  | 'CORRUPTED_PDF'
  | 'PAGE_RANGE_OUT_OF_BOUNDS'
  | 'INSUFFICIENT_FILES'
  | 'CONVERSION_FAILED'
  | 'OPERATION_FAILED'
  | 'STORAGE_QUOTA'
  | 'UNKNOWN_ERROR';

export interface AppNotification {
  id: string;
  code: SystemErrorCode;
  title: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: number;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  autoHideMs?: number;
}

type NotificationListener = (notification: AppNotification | null) => void;

class SystemErrorManager {
  private currentNotification: AppNotification | null = null;
  private listeners: Set<NotificationListener> = new Set();
  private timer: NodeJS.Timeout | null = null;

  /**
   * Subscribe to global system notifications/errors
   */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.currentNotification);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getCurrentNotification(): AppNotification | null {
    return this.currentNotification;
  }

  /**
   * Unifies and standardizes any raw error or exception across the entire app
   */
  reportError(
    err: unknown,
    context?: string,
    recovery?: { label: string; action: () => void }
  ): AppNotification {
    const rawMessage =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : err && typeof (err as any).message === 'string'
        ? (err as any).message
        : 'An unexpected error occurred';

    let code: SystemErrorCode = 'UNKNOWN_ERROR';
    let title = context ? `${context} Notice` : 'System Error';
    let userMessage = rawMessage;

    // Pattern matching to classify into standardized taxonomy
    const lower = rawMessage.toLowerCase();
    if (lower.includes('password') || lower.includes('encrypt') || lower.includes('security handler')) {
      code = 'ENCRYPTED_PASSWORD_REQUIRED';
      title = 'Encrypted Document';
      userMessage = 'This document is protected with a password. Please enter the correct password to unlock.';
    } else if (lower.includes('page range') || lower.includes('invalid page') || lower.includes('out of range')) {
      code = 'PAGE_RANGE_OUT_OF_BOUNDS';
      title = 'Invalid Page Range';
      userMessage = 'Selected page numbers are outside document bounds. Defaulting to valid available pages.';
    } else if (lower.includes('no file') || lower.includes('empty') || lower.includes('at least 2')) {
      code = 'INSUFFICIENT_FILES';
      title = 'Document Selection Required';
      userMessage = 'Please select the required input documents to proceed with this operation.';
    } else if (lower.includes('corrupt') || lower.includes('parse') || lower.includes('header') || lower.includes('xref')) {
      code = 'CORRUPTED_PDF';
      title = 'Corrupted File Structure';
      userMessage = 'The file could not be parsed as a standard PDF. It might be truncated or damaged.';
    } else if (lower.includes('permission') || lower.includes('denied') || lower.includes('access')) {
      code = 'FILE_ACCESS_DENIED';
      title = 'File Access Denied';
      userMessage = 'Local file storage permission was not granted by the system.';
    } else if (lower.includes('convert') || lower.includes('print')) {
      code = 'CONVERSION_FAILED';
      title = 'Conversion Error';
      userMessage = 'Unable to convert source document to PDF on device.';
    } else if (lower.includes('format') || lower.includes('unsupported')) {
      code = 'INVALID_FORMAT';
      title = 'Unsupported Format';
      userMessage = 'The selected file format is not supported for this specific operation.';
    } else {
      code = 'OPERATION_FAILED';
      title = context || 'Operation Failed';
      userMessage = rawMessage.length > 120 ? `${rawMessage.substring(0, 117)}...` : rawMessage;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } catch {}

    return this.showNotification({
      code,
      title,
      message: userMessage,
      severity: 'error',
      actionLabel: recovery?.label,
      onAction: recovery?.action,
      autoHideMs: 6500,
      dismissible: true,
    });
  }

  /**
   * Dispatch a notification (success, warning, info, or custom error)
   */
  showNotification(
    options: Omit<AppNotification, 'id' | 'timestamp'>
  ): AppNotification {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const notification: AppNotification = {
      ...options,
      id: `notify_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      dismissible: options.dismissible !== false,
      autoHideMs: options.autoHideMs ?? (options.severity === 'success' ? 3500 : 5500),
    };

    this.currentNotification = notification;
    this.notifyListeners();

    if (options.severity === 'success') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {}
    } else if (options.severity === 'warning') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      } catch {}
    }

    if (notification.autoHideMs && notification.autoHideMs > 0) {
      this.timer = setTimeout(() => {
        this.clear(notification.id);
      }, notification.autoHideMs);
    }

    return notification;
  }

  /**
   * Clear current notification
   */
  clear(id?: string): void {
    if (id && this.currentNotification?.id !== id) {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.currentNotification = null;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.currentNotification);
      } catch (e) {
        console.warn('Notification listener error:', e);
      }
    }
  }
}

export const SystemErrorService = new SystemErrorManager();
