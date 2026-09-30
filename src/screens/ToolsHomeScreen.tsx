import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { ToolCard } from '../components/ToolCard';
import { PDFEngine } from '../services/pdfEngine';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import {
  Search,
  X,
  ShieldCheck,
  FolderOpen,
  FileText,
  CircleCheck,
  RefreshCw,
  Trash2,
  Grid,
  Scissors,
  RotateCw,
  ArrowLeftRight,
  PenTool,
  Lock,
  ScanText,
  Sparkles,
} from 'lucide-react-native';

interface ToolItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  categoryName: string;
  badge?: string | null;
  isNew?: boolean;
  isAi?: boolean;
  accentColor?: string;
  icon: string;
  iconBg: string;
  badgeColor: string;
}

export const ToolsHomeScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [activeFile, setActiveFile] = useState<{ name: string; uri: string; size?: number } | null>(null);

  // Exact categories from tridentpdf.vercel.app
  const categories = [
    { id: 'all', label: 'All Tools', icon: Grid },
    { id: 'core', label: 'Core & Split', icon: Scissors },
    { id: 'organize', label: 'Organize & Edit', icon: RotateCw },
    { id: 'convert', label: 'Convert & Scan', icon: ArrowLeftRight },
    { id: 'sign_forms', label: 'Sign & Forms', icon: PenTool },
    { id: 'security', label: 'Security & Redact', icon: Lock },
    { id: 'extract_ocr', label: 'Extract & OCR', icon: ScanText },
    { id: 'ai_smart', label: 'AI & Smart Tools', icon: Sparkles },
  ];

  // Pick PDF File Handler for Hero Dropzone
  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) return;

      const file = res.assets[0];
      setActiveFile({
        name: file.name,
        uri: file.uri,
        size: file.size,
      });
    } catch (err: any) {
      Alert.alert('File Picker', err.message || 'Failed to select PDF file');
    }
  };

  // Tool Handlers
  const handleMerge = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length < 2) {
        Alert.alert('Merge PDF', 'Please select at least 2 PDF documents to merge.');
        return;
      }

      setIsProcessing(true);
      setProcessingStatus(`Merging ${res.assets.length} documents in memory...`);

      const uris = res.assets.map(a => a.uri);
      const outputUri = await PDFEngine.mergePDFs(uris);

      setIsProcessing(false);
      Alert.alert(
        'Success! 🎉',
        'PDFs merged successfully on your device.',
        [
          { text: 'Done', style: 'cancel' },
          { text: 'Share / Save', onPress: () => Sharing.shareAsync(outputUri) },
        ]
      );
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert('Error', err.message || 'Failed to merge documents');
    }
  };

  const handleSplit = async () => {
    try {
      let targetUri = activeFile?.uri;
      if (!targetUri) {
        const res = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
          copyToCacheDirectory: true,
        });
        if (res.canceled || !res.assets || res.assets.length === 0) return;
        targetUri = res.assets[0].uri;
      }

      setIsProcessing(true);
      setProcessingStatus('Extracting page 1 into a separate file...');

      const outputUri = await PDFEngine.splitPDF(targetUri, [1]);

      setIsProcessing(false);
      Alert.alert('Page Extracted! ✂️', 'Page 1 extracted into a new PDF.', [
        { text: 'Done', style: 'cancel' },
        { text: 'Share / Save', onPress: () => Sharing.shareAsync(outputUri) },
      ]);
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert('Error', err.message || 'Failed to split document');
    }
  };

  const handleRotate = async () => {
    try {
      let targetUri = activeFile?.uri;
      if (!targetUri) {
        const res = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
          copyToCacheDirectory: true,
        });
        if (res.canceled || !res.assets || res.assets.length === 0) return;
        targetUri = res.assets[0].uri;
      }

      setIsProcessing(true);
      setProcessingStatus('Rotating pages 90° clockwise...');

      const outputUri = await PDFEngine.rotatePages(targetUri, 90);

      setIsProcessing(false);
      Alert.alert('Rotated! 🔄', 'All pages rotated 90 degrees.', [
        { text: 'Done', style: 'cancel' },
        { text: 'Share / Save', onPress: () => Sharing.shareAsync(outputUri) },
      ]);
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert('Error', err.message || 'Failed to rotate PDF');
    }
  };

  const handleWatermark = async () => {
    try {
      let targetUri = activeFile?.uri;
      if (!targetUri) {
        const res = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
          copyToCacheDirectory: true,
        });
        if (res.canceled || !res.assets || res.assets.length === 0) return;
        targetUri = res.assets[0].uri;
      }

      setIsProcessing(true);
      setProcessingStatus('Injecting CONFIDENTIAL watermark across pages...');

      const outputUri = await PDFEngine.addWatermark(targetUri, 'CONFIDENTIAL', 0.35);

      setIsProcessing(false);
      Alert.alert('Watermark Applied! 🛡️', 'Watermark injected across all pages.', [
        { text: 'Done', style: 'cancel' },
        { text: 'Share / Save', onPress: () => Sharing.shareAsync(outputUri) },
      ]);
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert('Error', err.message || 'Failed to watermark PDF');
    }
  };

  const handleImagesToPDF = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) return;

      setIsProcessing(true);
      setProcessingStatus(`Converting ${res.assets.length} images to PDF...`);

      const uris = res.assets.map(a => a.uri);
      const outputUri = await PDFEngine.imagesToPDF(uris);

      setIsProcessing(false);
      Alert.alert('PDF Created! 📸', 'High-res PDF generated from your images.', [
        { text: 'Done', style: 'cancel' },
        { text: 'Share / Save', onPress: () => Sharing.shareAsync(outputUri) },
      ]);
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert('Error', err.message || 'Failed to convert images');
    }
  };

  // Full 25 Tools Registry
  const tools: ToolItem[] = [
    {
      id: 'split',
      name: 'PDF Splitter',
      shortName: 'Split',
      description: 'Split PDF into 2, 3, or N equal parts, custom page ranges, or single-page files with live visual previews.',
      category: 'core',
      categoryName: 'Core & Split',
      badge: 'Popular',
      isNew: false,
      isAi: false,
      icon: '✂️',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#06B6D4',
    },
    {
      id: 'sign',
      name: 'Batch Document Signer',
      shortName: 'Batch Sign',
      description: '1-Tap stamp signatures across all pages or custom page sets in exact coordinates with date and stamp options.',
      category: 'sign_forms',
      categoryName: 'Sign & Forms',
      badge: '1-Tap Sync',
      isNew: false,
      isAi: false,
      icon: '✍️',
      iconBg: 'rgba(37, 99, 235, 0.12)',
      badgeColor: '#2563EB',
    },
    {
      id: 'sign-fill',
      name: 'Sign & Fill Studio',
      shortName: 'Sign & Fill',
      description: 'Interactive canvas to place freeform signatures, custom text fields, date stamps, checkboxes, and initials.',
      category: 'sign_forms',
      categoryName: 'Sign & Forms',
      badge: 'Interactive',
      isNew: false,
      isAi: false,
      icon: '🖋️',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#06B6D4',
    },
    {
      id: 'scanner',
      name: 'PDF Camera Scanner',
      shortName: 'Scanner',
      description: 'Scan physical papers using camera or photos with auto-corner detection, perspective correction & enhancement.',
      category: 'convert',
      categoryName: 'Convert & Scan',
      badge: 'Hardware Camera',
      isNew: false,
      isAi: false,
      icon: '📸',
      iconBg: 'rgba(16, 185, 129, 0.12)',
      badgeColor: '#10B981',
    },
    {
      id: 'webpage-pdf',
      name: 'Webpage → PDF & Screenshot',
      shortName: 'Web to PDF',
      description: 'Convert any public website URL into a formatted PDF or capture a full-page browser visual screenshot.',
      category: 'convert',
      categoryName: 'Convert & Scan',
      badge: 'URL & Screenshot',
      isNew: true,
      isAi: false,
      icon: '🌐',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#06B6D4',
    },
    {
      id: 'compress-jpg',
      name: 'Compress JPG',
      shortName: 'Compress JPG',
      description: 'Reduce JPG and JPEG image file sizes with real client-side JPEG compression & live side-by-side comparison.',
      category: 'convert',
      categoryName: 'Convert & Scan',
      badge: 'JPG Quality Engine',
      isNew: true,
      isAi: false,
      icon: '🗜️',
      iconBg: 'rgba(245, 158, 11, 0.12)',
      badgeColor: '#F59E0B',
    },
    {
      id: 'merge',
      name: 'PDF Merger',
      shortName: 'Merge',
      description: 'Combine multiple PDF files into one seamless document with custom ordering and instant drag-and-drop.',
      category: 'core',
      categoryName: 'Core & Split',
      badge: 'Multi-File',
      isNew: false,
      isAi: false,
      icon: '📑',
      iconBg: 'rgba(16, 185, 129, 0.12)',
      badgeColor: '#10B981',
    },
    {
      id: 'organize',
      name: 'Page Organizer',
      shortName: 'Organize',
      description: 'Reorder, rotate (90°/180°/270°), duplicate, delete, and manage page order with visual thumbnail grid.',
      category: 'organize',
      categoryName: 'Organize & Edit',
      badge: 'Visual Grid',
      isNew: false,
      isAi: false,
      icon: '🗂️',
      iconBg: 'rgba(139, 92, 246, 0.12)',
      badgeColor: '#8B5CF6',
    },
    {
      id: 'compress',
      name: 'Compress PDF',
      shortName: 'Compress',
      description: 'Reduce PDF file size with extreme, recommended, or high-quality presets while preserving readability.',
      category: 'core',
      categoryName: 'Core & Split',
      badge: 'Size Reducer',
      isNew: false,
      isAi: false,
      icon: '📉',
      iconBg: 'rgba(245, 158, 11, 0.12)',
      badgeColor: '#F59E0B',
    },
    {
      id: 'convert',
      name: 'PDF Converter',
      shortName: 'Convert',
      description: 'Convert PDFs to Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, and convert other files to PDF.',
      category: 'convert',
      categoryName: 'Convert & Scan',
      badge: 'Multi-Format',
      isNew: false,
      isAi: false,
      icon: '🔄',
      iconBg: 'rgba(139, 92, 246, 0.12)',
      badgeColor: '#8B5CF6',
    },
    {
      id: 'edit',
      name: 'PDF Editor',
      shortName: 'Editor',
      description: 'Add text notes, draw annotations, insert geometric shapes, callouts, arrows, and highlight key sections.',
      category: 'organize',
      categoryName: 'Organize & Edit',
      badge: 'Markup & Draw',
      isNew: false,
      isAi: false,
      icon: '✏️',
      iconBg: 'rgba(236, 72, 153, 0.12)',
      badgeColor: '#EC4899',
    },
    {
      id: 'ocr',
      name: 'OCR PDF (Text Recognition)',
      shortName: 'OCR',
      description: 'Extract text from scanned documents and images to make pages searchable, selectable, and copyable.',
      category: 'extract_ocr',
      categoryName: 'Extract & OCR',
      badge: 'Tesseract OCR',
      isNew: false,
      isAi: true,
      icon: '🔍',
      iconBg: 'rgba(139, 92, 246, 0.12)',
      badgeColor: '#8B5CF6',
    },
    {
      id: 'security',
      name: 'PDF Security & Password',
      shortName: 'Security',
      description: 'Encrypt PDFs with strong password protection, manage permissions, or decrypt and remove known passwords.',
      category: 'security',
      categoryName: 'Security & Redact',
      badge: 'Encryption',
      isNew: false,
      isAi: false,
      icon: '🔒',
      iconBg: 'rgba(37, 99, 235, 0.12)',
      badgeColor: '#2563EB',
    },
    {
      id: 'watermark',
      name: 'PDF Watermark & Stamp',
      shortName: 'Watermark',
      description: 'Apply custom text watermarks (Confidential, Draft), company logos, or remove existing overlays.',
      category: 'security',
      categoryName: 'Security & Redact',
      badge: 'Text & Image',
      isNew: false,
      isAi: false,
      icon: '🛡️',
      iconBg: 'rgba(239, 68, 68, 0.12)',
      badgeColor: '#EF4444',
    },
    {
      id: 'crop',
      name: 'PDF Crop & Resize',
      shortName: 'Crop & Resize',
      description: 'Trim page margins, crop custom bounding boxes, and resize pages to standard sizes (A4, A3, Letter, Legal).',
      category: 'organize',
      categoryName: 'Organize & Edit',
      badge: 'Dimension Presets',
      isNew: false,
      isAi: false,
      icon: '📐',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#06B6D4',
    },
    {
      id: 'compare',
      name: 'PDF Compare & Diff',
      shortName: 'Compare',
      description: 'Compare two PDF documents side-by-side or overlay differences to detect visual and textual changes.',
      category: 'organize',
      categoryName: 'Organize & Edit',
      badge: 'Diff Viewer',
      isNew: false,
      isAi: false,
      icon: '⚖️',
      iconBg: 'rgba(99, 102, 241, 0.12)',
      badgeColor: '#6366F1',
    },
    {
      id: 'forms',
      name: 'PDF Form Builder & Filler',
      shortName: 'Forms',
      description: 'Fill interactive AcroForm fields (text, checkboxes, radio buttons, dropdowns) or design new fillable forms.',
      category: 'sign_forms',
      categoryName: 'Sign & Forms',
      badge: 'AcroForms',
      isNew: false,
      isAi: false,
      icon: '📝',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#06B6D4',
    },
    {
      id: 'redact',
      name: 'PDF Redaction (Privacy)',
      shortName: 'Redact',
      description: 'Permanently blackout and erase sensitive data, PII, SSNs, credit card numbers, and confidential text.',
      category: 'security',
      categoryName: 'Security & Redact',
      badge: 'Permanent Erase',
      isNew: false,
      isAi: false,
      icon: '⬛',
      iconBg: 'rgba(239, 68, 68, 0.12)',
      badgeColor: '#EF4444',
    },
    {
      id: 'metadata',
      name: 'PDF Metadata Inspector',
      shortName: 'Metadata',
      description: 'View, edit, or wipe document metadata properties like Author, Title, Subject, Producer, and Creation Date.',
      category: 'security',
      categoryName: 'Security & Redact',
      badge: 'EXIF & Info',
      isNew: false,
      isAi: false,
      icon: '🏷️',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#06B6D4',
    },
    {
      id: 'extract',
      name: 'PDF Extractor (Text & Images)',
      shortName: 'Extract',
      description: 'Extract raw text, embedded images, tables, and structured data from your PDF document in high resolution.',
      category: 'extract_ocr',
      categoryName: 'Extract & OCR',
      badge: 'Asset Exporter',
      isNew: false,
      isAi: false,
      icon: '📦',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#06B6D4',
    },
    {
      id: 'ai-summarize',
      name: 'AI PDF Summarizer',
      shortName: 'AI Summary',
      description: 'Generate instant executive summaries, key bullet points, and critical takeaways from contracts and reports.',
      category: 'ai_smart',
      categoryName: 'AI & Smart Tools',
      badge: 'Executive Brief',
      isNew: false,
      isAi: true,
      icon: '🧠',
      iconBg: 'rgba(168, 85, 247, 0.12)',
      badgeColor: '#A855F7',
    },
    {
      id: 'ai-chat',
      name: 'Ask AI (Chat with PDF)',
      shortName: 'Chat PDF',
      description: 'Chat interactively with your PDF documents. Ask questions, cross-examine clauses, and find citations.',
      category: 'ai_smart',
      categoryName: 'AI & Smart Tools',
      badge: 'Neural RAG',
      isNew: false,
      isAi: true,
      icon: '💬',
      iconBg: 'rgba(99, 102, 241, 0.12)',
      badgeColor: '#6366F1',
    },
    {
      id: 'ai-redact',
      name: 'AI Smart PII Redaction',
      shortName: 'Auto Redact',
      description: 'Auto-detect SSNs, credit card numbers, emails, phone numbers, and sensitive entities in PDFs for 1-click batch redaction.',
      category: 'ai_smart',
      categoryName: 'AI & Smart Tools',
      badge: 'PII Detector',
      isNew: false,
      isAi: true,
      icon: '🤖',
      iconBg: 'rgba(16, 185, 129, 0.12)',
      badgeColor: '#10B981',
    },
    {
      id: 'ai-translate',
      name: 'AI Document Translator',
      shortName: 'Translator',
      description: 'Translate entire PDF documents across 50+ languages while preserving page layout, typography, and formatting.',
      category: 'ai_smart',
      categoryName: 'AI & Smart Tools',
      badge: '50+ Languages',
      isNew: false,
      isAi: true,
      icon: '🌐',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#06B6D4',
    },
    {
      id: 'ai-extract',
      name: 'AI Table & Invoice Extractor',
      shortName: 'Table Extract',
      description: 'Extract structured financial data, invoices, line items, and nested tables directly into clean CSV spreadsheets.',
      category: 'ai_smart',
      categoryName: 'AI & Smart Tools',
      badge: 'CSV / JSON',
      isNew: false,
      isAi: true,
      icon: '📊',
      iconBg: 'rgba(16, 185, 129, 0.12)',
      badgeColor: '#10B981',
    },
  ];

  // Tool Click Handler
  const handleToolClick = (tool: ToolItem) => {
    switch (tool.id) {
      case 'merge':
        handleMerge();
        break;
      case 'split':
        handleSplit();
        break;
      case 'organize':
      case 'rotate':
        handleRotate();
        break;
      case 'watermark':
        handleWatermark();
        break;
      case 'scanner':
        Alert.alert('PDF Scanner', 'Switch to the "Scanner" tab on the bottom bar to scan papers with your hardware camera.');
        break;
      case 'sign':
      case 'sign-fill':
        Alert.alert('Sign & Fill', 'Switch to the "Sign & Fill" tab on the bottom bar to draw and stamp signatures.');
        break;
      case 'ai-chat':
      case 'ai-summarize':
      case 'ai-redact':
      case 'ai-translate':
      case 'ai-extract':
        Alert.alert('AI Suite', 'Switch to the "AI Suite" tab on the bottom bar to interact with our neural assistant.');
        break;
      case 'webpage-pdf':
      case 'compress-jpg':
      case 'compress':
      case 'convert':
      case 'edit':
      case 'ocr':
      case 'security':
      case 'crop':
      case 'compare':
      case 'forms':
      case 'redact':
      case 'metadata':
      case 'extract':
      default:
        handlePickDocument();
        break;
    }
  };

  // Search & Filter Memo
  const filteredTools = useMemo(() => {
    let list = tools;
    if (selectedCategory !== 'all') {
      list = list.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.shortName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F7F7F8' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* MOBILE HERO SECTION (EXACT REPLICA OF TRIDENTPDF.VERCEL.APP MOBILE) */}
        <View style={styles.heroSection}>
          {activeFile ? (
            /* ACTIVE PDF LOADED CARD */
            <View
              style={[
                styles.activeFileCard,
                {
                  backgroundColor: isDark ? '#10101C' : '#F4F1FF',
                  borderColor: isDark ? 'rgba(6, 182, 212, 0.7)' : 'rgba(37, 99, 235, 0.7)',
                },
              ]}
            >
              <View style={styles.activeFileTop}>
                <View
                  style={[
                    styles.fileIconBox,
                    {
                      backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                      borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                    },
                  ]}
                >
                  <FileText size={20} color={isDark ? '#22D3EE' : '#2563EB'} />
                </View>
                <View style={styles.fileInfo}>
                  <View style={styles.loadedBadgeRow}>
                    <CircleCheck size={11} color="#10B981" />
                    <Text style={styles.loadedBadgeText}>ACTIVE PDF LOADED</Text>
                  </View>
                  <Text style={[styles.fileName, { color: isDark ? '#FFFFFF' : '#0F0E1A' }]} numberOfLines={1}>
                    {activeFile.name}
                  </Text>
                  <Text style={[styles.fileMeta, { color: isDark ? '#22D3EE' : '#1D4ED8' }]}>
                    {activeFile.size ? `${(activeFile.size / 1024).toFixed(1)} KB` : 'Ready in memory'} • Local Buffer
                  </Text>
                </View>
              </View>

              <View style={[styles.activeActionsRow, { borderTopColor: isDark ? '#27272A' : '#E2E6EA' }]}>
                <TouchableOpacity
                  style={[styles.switchBtn, { backgroundColor: isDark ? '#06B6D4' : '#2563EB' }]}
                  onPress={handlePickDocument}
                  activeOpacity={0.8}
                >
                  <RefreshCw size={12} color="#FFFFFF" />
                  <Text style={styles.switchBtnText}>Switch File</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => setActiveFile(null)}
                  activeOpacity={0.8}
                >
                  <Trash2 size={12} color="#FFFFFF" />
                  <Text style={styles.clearBtnText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* DEFAULT WEBSITE HERO CALLOUT */
            <View style={styles.heroCallout}>
              <View
                style={[
                  styles.privacyPill,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(37, 99, 235, 0.08)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(37, 99, 235, 0.2)',
                  },
                ]}
              >
                <ShieldCheck size={13} color="#10B981" />
                <Text style={[styles.privacyPillText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
                  100% Private Client-Side PDF Tools
                </Text>
              </View>

              <Text style={[styles.heroTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                TridentPDF
              </Text>

              <Text style={[styles.heroSubtitle, { color: isDark ? '#9CA3AF' : '#4B5563' }]}>
                Every tool you need to work with PDFs in one place — all processing runs directly in your device memory.
              </Text>

              <View style={styles.heroBtnWrap}>
                <TouchableOpacity
                  style={styles.primaryHeroBtn}
                  onPress={handlePickDocument}
                  activeOpacity={0.85}
                >
                  <FolderOpen size={16} color="#FFFFFF" />
                  <Text style={styles.primaryHeroBtnText}>Select PDF File</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* SEARCH BAR (EXACT COPY OF WEBSITE INPUT) */}
        <View style={styles.searchWrapper}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? '#11111B' : '#FFFFFF',
                borderColor: isDark ? '#27272A' : '#E2E6EA',
              },
            ]}
          >
            <Search size={16} color={isDark ? '#06B6D4' : '#2563EB'} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#111827' }]}
              placeholder="Search tools (split, sign, ocr, edit...)"
              placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={15} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* CATEGORY TABS (HORIZONTAL PILLS AS ON WEBSITE) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isActive
                      ? '#2563EB'
                      : isDark
                      ? '#11111B'
                      : '#FFFFFF',
                    borderColor: isActive
                      ? '#2563EB'
                      : isDark
                      ? '#27272A'
                      : '#E2E6EA',
                  },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isActive
                        ? '#FFFFFF'
                        : isDark
                        ? '#A1A1AA'
                        : '#4B5563',
                      fontWeight: isActive ? '700' : '600',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {selectedCategory === 'all'
              ? 'All Document Tools'
              : categories.find(c => c.id === selectedCategory)?.label}
          </Text>
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: isDark ? '#1C1C28' : '#EFF6FF',
                borderColor: isDark ? '#27272A' : '#DBEAFE',
              },
            ]}
          >
            <Text style={[styles.countBadgeText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </Text>
          </View>
        </View>

        {/* TOOLS 2-COLUMN GRID (MOBILE TOOL CARDS) */}
        <View style={styles.grid}>
          {filteredTools.map(tool => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              title={tool.name}
              description={tool.description}
              icon={tool.icon}
              badge={tool.badge}
              badgeColor={tool.badgeColor}
              iconBg={tool.iconBg}
              isNew={tool.isNew}
              isAi={tool.isAi}
              onPress={() => handleToolClick(tool)}
            />
          ))}
        </View>

        {/* FOOTER DPDP TRUST BADGE */}
        <View style={styles.footerWrap}>
          <View style={styles.dpdpRow}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={[styles.dpdpText, { color: isDark ? '#71717A' : '#6B7280' }]}>
              DPDP Act 2023 Compliant & Verified
            </Text>
          </View>
          <Text style={[styles.dpdpSub, { color: isDark ? '#52525B' : '#9CA3AF' }]}>
            100% In-Device Processing • Zero Server Retention
          </Text>
        </View>
      </ScrollView>

      {/* PROCESSING OVERLAY */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingBox, { backgroundColor: isDark ? '#181824' : '#FFFFFF' }]}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {processingStatus}
            </Text>
            <Text style={[styles.loadingSub, { color: theme.textSecondary }]}>
              100% Local In-Device Execution • Zero Server Uploads
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heroCallout: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  privacyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  privacyPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    maxWidth: 320,
  },
  heroBtnWrap: {
    marginTop: 6,
    width: '100%',
    alignItems: 'center',
  },
  primaryHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 13,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 170,
  },
  primaryHeroBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  activeFileCard: {
    borderRadius: 18,
    borderWidth: 2,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  activeFileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
    gap: 2,
  },
  loadedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loadedBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.4,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '800',
  },
  fileMeta: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  activeActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  switchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8.5,
    borderRadius: 10,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 8.5,
    borderRadius: 10,
  },
  clearBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 9.5,
    borderRadius: 13,
    borderWidth: 1,
    gap: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    padding: 0,
    fontWeight: '600',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 13,
    paddingVertical: 6.5,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 11.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  footerWrap: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 4,
  },
  dpdpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dpdpText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dpdpSub: {
    fontSize: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingBox: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 10,
    maxWidth: 300,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  loadingText: {
    fontSize: 14.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  loadingSub: {
    fontSize: 11,
    textAlign: 'center',
  },
});
