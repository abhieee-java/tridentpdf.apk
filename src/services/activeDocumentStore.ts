import { DocumentItem } from '../components/DocumentCard';
import { DocumentType } from '../components/FormatBadge';
import { DocumentStorageService } from './documentStorage';
import { PDFEngine } from './pdfEngine';
import { SystemErrorService } from './systemErrorService';
import * as Sharing from 'expo-sharing';

export const ACTIVE_DOCUMENT_TTL_MS = 60 * 60 * 1000; // 1-hour privacy TTL

export interface ActiveDocumentState {
  id: string;
  name: string;
  uri: string;
  size: number;
  type: DocumentType;
  pageCount?: number;
  modifiedAt: number;
  loadedAt: number;
  expiresAt: number;
  tags?: string[];
  isStarred?: boolean;
  isDigitallySigned?: boolean;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
}

type ActiveDocumentListener = (doc: ActiveDocumentState | null) => void;

class ActiveDocumentManager {
  private activeDoc: ActiveDocumentState | null = null;
  private listeners: Set<ActiveDocumentListener> = new Set();
  private ttlTimer: NodeJS.Timeout | null = null;

  subscribe(listener: ActiveDocumentListener): () => void {
    this.listeners.add(listener);
    listener(this.activeDoc);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getActiveDocument(): ActiveDocumentState | null {
    return this.activeDoc;
  }

  /**
   * Sets the active document and automatically computes metadata & sets 1-hour TTL
   */
  async setActiveDocument(
    doc: {
      name: string;
      uri: string;
      size?: number;
      type?: DocumentType;
      pageCount?: number;
    } | null
  ): Promise<ActiveDocumentState | null> {
    if (!doc) {
      this.clearActiveDocument();
      return null;
    }

    const now = Date.now();
    const ext = doc.name.split('.').pop()?.toLowerCase() || 'pdf';
    const docType: DocumentType =
      doc.type ||
      (['docx', 'doc', 'xlsx', 'xls', 'csv', 'pptx', 'ppt', 'pdf', 'txt'].includes(ext)
        ? (ext as DocumentType)
        : 'pdf');

    let pageCount = doc.pageCount;
    let meta: ActiveDocumentState['metadata'] = undefined;
    let fileSize = doc.size || 0;
    let isDigitallySigned = false;

    // If PDF and missing pageCount/fileSize, inspect locally
    if (docType === 'pdf') {
      try {
        const inspected = await PDFEngine.inspectPDF(doc.uri);
        pageCount = inspected.pageCount;
        fileSize = inspected.fileSize || fileSize;
        meta = {
          title: inspected.title,
          author: inspected.author,
          subject: inspected.subject,
          creator: inspected.creator,
        };
        const bytes = await PDFEngine.loadBytesFromUri(doc.uri);
        isDigitallySigned = PDFEngine.detectDigitalSignature(bytes).isDigitallySigned;
      } catch (err) {
        // PDF could be protected or plain template
      }
    }

    const newState: ActiveDocumentState = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: doc.name,
      uri: doc.uri,
      size: fileSize,
      type: docType,
      pageCount,
      modifiedAt: now,
      loadedAt: now,
      expiresAt: now + ACTIVE_DOCUMENT_TTL_MS,
      isDigitallySigned,
      metadata: meta,
    };

    this.activeDoc = newState;
    this.scheduleTtlTimer(newState.expiresAt);
    this.notifyListeners();

    // Ensure document is recorded in DocumentStorageService index
    try {
      await DocumentStorageService.addDocument({
        id: newState.id,
        name: newState.name,
        uri: newState.uri,
        type: newState.type,
        size: newState.size,
        modifiedAt: newState.modifiedAt,
      });
    } catch {}

    return newState;
  }

  /**
   * Clears active document from volatile RAM
   */
  clearActiveDocument(): void {
    if (this.ttlTimer) {
      clearTimeout(this.ttlTimer);
      this.ttlTimer = null;
    }
    this.activeDoc = null;
    this.notifyListeners();
  }

  /**
   * Registers a newly generated output document from any tool
   */
  async registerToolOutput(params: {
    uri: string;
    suggestedName: string;
    toolTag: string;
    successMessage: string;
    onView?: (doc: ActiveDocumentState) => void;
  }): Promise<ActiveDocumentState> {
    const ext = params.suggestedName.split('.').pop()?.toLowerCase() || 'pdf';
    const docType: DocumentType = ['docx', 'doc', 'xlsx', 'xls', 'csv', 'pptx', 'ppt', 'pdf', 'txt'].includes(ext)
      ? (ext as DocumentType)
      : 'pdf';

    let pageCount: number | undefined;
    let fileSize = 0;
    let meta: ActiveDocumentState['metadata'] = undefined;
    let isDigitallySigned = false;

    if (docType === 'pdf') {
      try {
        const inspected = await PDFEngine.inspectPDF(params.uri);
        pageCount = inspected.pageCount;
        fileSize = inspected.fileSize;
        meta = {
          title: inspected.title,
          author: inspected.author,
          subject: inspected.subject,
        };
        const bytes = await PDFEngine.loadBytesFromUri(params.uri);
        isDigitallySigned = PDFEngine.detectDigitalSignature(bytes).isDigitallySigned;
      } catch {}
    }

    const now = Date.now();
    const docState: ActiveDocumentState = {
      id: `out_${now}_${Math.random().toString(36).substring(2, 6)}`,
      name: params.suggestedName,
      uri: params.uri,
      size: fileSize,
      type: docType,
      pageCount,
      modifiedAt: now,
      loadedAt: now,
      expiresAt: now + ACTIVE_DOCUMENT_TTL_MS,
      tags: [params.toolTag],
      isDigitallySigned,
      metadata: meta,
    };

    // Save into persistent local DocumentStorageService index
    await DocumentStorageService.addDocument({
      id: docState.id,
      name: docState.name,
      uri: docState.uri,
      type: docState.type,
      size: docState.size,
      modifiedAt: docState.modifiedAt,
    });

    this.activeDoc = docState;
    this.scheduleTtlTimer(docState.expiresAt);
    this.notifyListeners();

    // Trigger centralized unified system notification
    SystemErrorService.showNotification({
      code: 'OPERATION_SUCCESS',
      title: 'Document Saved',
      message: params.successMessage,
      severity: 'success',
      actionLabel: 'Share',
      onAction: async () => {
        try {
          await Sharing.shareAsync(params.uri);
        } catch {}
      },
    });

    return docState;
  }

  private scheduleTtlTimer(expiresAt: number): void {
    if (this.ttlTimer) {
      clearTimeout(this.ttlTimer);
      this.ttlTimer = null;
    }
    const delay = Math.max(0, expiresAt - Date.now());
    this.ttlTimer = setTimeout(() => {
      if (this.activeDoc) {
        SystemErrorService.showNotification({
          code: 'OPERATION_FAILED',
          title: 'Session Expired (1-Hour Privacy TTL)',
          message: `Active document cache for "${this.activeDoc.name}" cleared from volatile memory in accordance with privacy compliance.`,
          severity: 'info',
        });
        this.clearActiveDocument();
      }
    }, delay);
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.activeDoc);
      } catch (e) {
        console.warn('ActiveDocument listener error:', e);
      }
    }
  }
}

export const ActiveDocumentStore = new ActiveDocumentManager();
