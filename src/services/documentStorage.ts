import * as FileSystem from 'expo-file-system';
import { DocumentItem } from '../components/DocumentCard';
import { DocumentType } from '../components/FormatBadge';

const INDEX_FILE = `${FileSystem.documentDirectory}wps_documents_index.json`;

export const SUPPORTED_OFFICE_FORMATS: DocumentType[] = [
  'docx',
  'doc',
  'xlsx',
  'xls',
  'csv',
  'pptx',
  'ppt',
  'pdf',
  'txt',
];

export function getFileFormat(fileName: string): DocumentType {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext && (SUPPORTED_OFFICE_FORMATS as string[]).includes(ext)) {
    return ext as DocumentType;
  }
  return 'txt';
}

const DEMO_SEEDS: Array<Omit<DocumentItem, 'uri'>> = [
  {
    id: 'demo_1',
    name: 'Q3_Financial_Analysis_2026.xlsx',
    type: 'xlsx',
    size: 248 * 1024,
    modifiedAt: Date.now() - 2 * 60 * 60 * 1000, // Today
    isStarred: true,
  },
  {
    id: 'demo_2',
    name: 'Product_Roadmap_WPS_Alternative.docx',
    type: 'docx',
    size: 115 * 1024,
    modifiedAt: Date.now() - 4 * 60 * 60 * 1000, // Today
  },
  {
    id: 'demo_3',
    name: 'Executive_Pitch_Deck_Mobile.pptx',
    type: 'pptx',
    size: 4200 * 1024,
    modifiedAt: Date.now() - 26 * 60 * 60 * 1000, // Yesterday
    isStarred: true,
  },
  {
    id: 'demo_4',
    name: 'Cloudinary_Security_Architecture.pdf',
    type: 'pdf',
    size: 1850 * 1024,
    modifiedAt: Date.now() - 32 * 60 * 60 * 1000, // Yesterday
    isCloud: true,
  },
  {
    id: 'demo_5',
    name: 'Release_Notes_v1.0.txt',
    type: 'txt',
    size: 12 * 1024,
    modifiedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // Earlier this Week
  },
  {
    id: 'demo_6',
    name: 'Marketing_Budget_Q4.xlsx',
    type: 'xlsx',
    size: 530 * 1024,
    modifiedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // Earlier this Week
  },
  {
    id: 'demo_7',
    name: 'Contract_Agreement_Confidential.docx',
    type: 'docx',
    size: 88 * 1024,
    modifiedAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // Earlier this Month
  },
  {
    id: 'demo_8',
    name: 'Corporate_Profile_Deck.pptx',
    type: 'pptx',
    size: 6700 * 1024,
    modifiedAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // Older
  },
];

export class DocumentStorageService {
  /**
   * Retrieves all recent documents from index or seeds demo documents on first run
   */
  static async getRecentDocuments(): Promise<DocumentItem[]> {
    try {
      if (FileSystem.documentDirectory) {
        const info = await FileSystem.getInfoAsync(INDEX_FILE);
        if (info.exists) {
          const content = await FileSystem.readAsStringAsync(INDEX_FILE);
          const parsed: DocumentItem[] = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read document index, seeding initial demo files...', e);
    }

    // First run or missing index: seed demo files
    return await this.seedInitialDocuments();
  }

  /**
   * Seeds demo documents into local storage and index
   */
  static async seedInitialDocuments(): Promise<DocumentItem[]> {
    const seeded: DocumentItem[] = [];

    for (const item of DEMO_SEEDS) {
      const fileUri = `${FileSystem.documentDirectory || ''}${item.name}`;
      try {
        if (FileSystem.documentDirectory) {
          const check = await FileSystem.getInfoAsync(fileUri);
          if (!check.exists) {
            await FileSystem.writeAsStringAsync(fileUri, `WPS Office Document: ${item.name}`, {
              encoding: FileSystem.EncodingType.UTF8,
            });
          }
        }
      } catch (err) {
        console.warn('Failed to seed file to disk:', item.name, err);
      }

      seeded.push({
        ...item,
        uri: fileUri,
      });
    }

    await this.saveIndex(seeded);
    return seeded;
  }

  /**
   * Adds or updates a document in index
   */
  static async addDocument(doc: DocumentItem): Promise<void> {
    const existing = await this.getRecentDocuments();
    const filtered = existing.filter(d => d.id !== doc.id && d.name !== doc.name);
    const updated = [doc, ...filtered];
    await this.saveIndex(updated);
  }

  /**
   * Deletes a document from index and disk
   */
  static async removeDocument(id: string): Promise<boolean> {
    const existing = await this.getRecentDocuments();
    const target = existing.find(d => d.id === id);
    if (target && target.uri) {
      try {
        await FileSystem.deleteAsync(target.uri, { idempotent: true });
      } catch {}
    }
    const updated = existing.filter(d => d.id !== id);
    await this.saveIndex(updated);
    return true;
  }

  /**
   * Toggles favorite status for a document
   */
  static async toggleStarDocument(id: string): Promise<boolean> {
    const existing = await this.getRecentDocuments();
    const updated = existing.map(d => (d.id === id ? { ...d, isStarred: !d.isStarred } : d));
    await this.saveIndex(updated);
    return true;
  }

  /**
   * Scans local document directory for all supported office files
   */
  static async listAllLocalFiles(): Promise<DocumentItem[]> {
    if (!FileSystem.documentDirectory) return [];
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const docs: DocumentItem[] = [];
      const recentDocs = await this.getRecentDocuments();
      const starredMap = new Map<string, boolean>();
      recentDocs.forEach(d => {
        if (d.isStarred) starredMap.set(d.name, true);
      });

      for (const name of files) {
        if (name === 'wps_documents_index.json') continue;
        const fmt = getFileFormat(name);
        const uri = `${FileSystem.documentDirectory}${name}`;
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
          const modTime = (info as any).modificationTime
            ? (info as any).modificationTime * 1000
            : Date.now();
          docs.push({
            id: `local_${name}`,
            name,
            uri,
            type: fmt,
            size: (info as any).size || 0,
            modifiedAt: modTime,
            isStarred: starredMap.has(name),
          });
        }
      }
      return docs;
    } catch (e) {
      console.warn('Failed to list local files:', e);
      return [];
    }
  }

  static async saveIndex(docs: DocumentItem[]): Promise<void> {
    try {
      if (FileSystem.documentDirectory) {
        await FileSystem.writeAsStringAsync(INDEX_FILE, JSON.stringify(docs, null, 2), {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }
    } catch (e) {
      console.error('Failed to save document index:', e);
    }
  }
}
