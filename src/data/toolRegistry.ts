
import { AppTool } from '../types';

export type ToolCategory =
  | 'all'
  | 'core'
  | 'organize'
  | 'convert'
  | 'sign_forms'
  | 'security'
  | 'extract_ocr'
  | 'ai_smart';

export interface ToolCategoryInfo {
  id: ToolCategory;
  label: string;
  iconName: string;
}

export const TOOL_CATEGORIES: ToolCategoryInfo[] = [
  { id: 'all', label: 'All Tools', iconName: 'Grid' },
  { id: 'core', label: 'Core & Split', iconName: 'Scissors' },
  { id: 'organize', label: 'Organize & Edit', iconName: 'RotateCw' },
  { id: 'convert', label: 'Convert & Scan', iconName: 'ArrowLeftRight' },
  { id: 'sign_forms', label: 'Sign & Forms', iconName: 'PenTool' },
  { id: 'security', label: 'Security & Redact', iconName: 'Lock' },
  { id: 'extract_ocr', label: 'Extract & OCR', iconName: 'ScanText' },
  { id: 'ai_smart', label: 'AI & Smart Tools', iconName: 'Sparkles' },
];

export interface ToolDefinition {
  id: AppTool;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  categoryName: string;
  iconName: string;
  accentColor: string;
  badge?: string;
  badgeType?: 'cyan' | 'blue' | 'purple' | 'amber' | 'emerald' | 'rose' | 'ai';
  tags: string[];
  isAvailable: boolean;
  isAiTool?: boolean;
  isNew?: boolean;
  featuredTag?: 'New' | 'AI-Powered';
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  // 1. PDF Splitter
  {
    id: 'split',
    name: 'PDF Splitter',
    shortName: 'Split',
    description: 'Split PDF into 2, 3, or N equal parts, custom page ranges, or single-page files with live visual previews.',
    category: 'core',
    categoryName: 'Core & Split',
    iconName: 'Scissors',
    accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60',
    badge: 'Popular',
    badgeType: 'cyan',
    tags: ['split', 'cut', 'divide', 'separate', 'pages', 'parts', 'ranges', 'break', 'extract pages', 'n parts'],
    isAvailable: true,
  },
  // 2. Batch Signer
  {
    id: 'sign',
    name: 'Batch Document Signer',
    shortName: 'Batch Sign',
    description: '1-Tap stamp signatures across all pages or custom page sets in exact coordinates with date and stamp options.',
    category: 'sign_forms',
    categoryName: 'Sign & Forms',
    iconName: 'Stamp',
    accentColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800/60',
    badge: '1-Tap Sync',
    badgeType: 'blue',
    tags: ['sign', 'signature', 'batch sign', 'stamp', 'sign all pages', 'e-sign', 'contract', 'agreement', 'initials'],
    isAvailable: true,
  },
  // 3. Interactive Sign & Fill
  {
    id: 'sign-fill',
    name: 'Sign & Fill Studio',
    shortName: 'Sign & Fill',
    description: 'Interactive canvas to place freeform signatures, custom text fields, date stamps, checkboxes, and initials.',
    category: 'sign_forms',
    categoryName: 'Sign & Forms',
    iconName: 'PenTool',
    accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60',
    badge: 'Interactive',
    badgeType: 'cyan',
    tags: ['sign and fill', 'fill and sign', 'draw signature', 'type text', 'checkbox', 'date stamp', 'fill out', 'freeform'],
    isAvailable: true,
  },
  // 4. PDF Scanner
  {
    id: 'scanner',
    name: 'PDF Camera Scanner',
    shortName: 'Scanner',
    description: 'Scan physical papers using camera or photos with auto-corner detection, perspective correction & enhancement.',
    category: 'convert',
    categoryName: 'Convert & Scan',
    iconName: 'Scan',
    accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800/60',
    badge: 'Hardware Camera',
    badgeType: 'emerald',
    tags: ['scan', 'scanner', 'camera', 'photo to pdf', 'camscanner', 'perspective', 'auto crop', 'document scan', 'receipt scan'],
    isAvailable: true,
  },
  // 5. Webpage to PDF
  {
    id: 'webpage-pdf',
    name: 'Webpage → PDF & Screenshot',
    shortName: 'Web to PDF',
    description: 'Convert any public website URL into a formatted PDF or capture a full-page browser visual screenshot.',
    category: 'convert',
    categoryName: 'Convert & Scan',
    iconName: 'Globe',
    accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60',
    badge: 'URL & Screenshot',
    badgeType: 'cyan',
    isNew: true,
    featuredTag: 'New',
    tags: ['webpage to pdf', 'url to pdf', 'html to pdf', 'website to pdf', 'convert url', 'save page as pdf', 'article to pdf', 'full-page screenshot', 'webpage screenshot', 'browser screenshot', 'screen capture'],
    isAvailable: true,
  },
  // 5B. Compress JPG
  {
    id: 'compress-jpg',
    name: 'Compress JPG',
    shortName: 'Compress JPG',
    description: 'Reduce JPG and JPEG image file sizes with real client-side JPEG compression & live side-by-side comparison.',
    category: 'convert',
    categoryName: 'Convert & Scan',
    iconName: 'Minimize2',
    accentColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800/60',
    badge: 'JPG Quality Engine',
    badgeType: 'amber',
    isNew: true,
    featuredTag: 'New',
    tags: ['compress jpg', 'compress jpeg', 'image compressor', 'reduce jpg size', 'shrink jpeg', 'optimize jpg', 'image size reducer', 'jpg quality', 'photo compressor', 'jpeg optimizer'],
    isAvailable: true,
  },
  // 6. PDF Merger
  {
    id: 'merge',
    name: 'PDF Merger',
    shortName: 'Merge',
    description: 'Combine multiple PDF files into one seamless document with custom ordering and instant drag-and-drop.',
    category: 'core',
    categoryName: 'Core & Split',
    iconName: 'Layers',
    accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800/60',
    badge: 'Multi-File',
    badgeType: 'emerald',
    tags: ['merge', 'combine', 'join', 'append', 'stitch', 'concatenate', 'group files', 'bundle'],
    isAvailable: true,
  },
  // 7. Page Organizer
  {
    id: 'organize',
    name: 'Page Organizer',
    shortName: 'Organize',
    description: 'Reorder, rotate (90°/180°/270°), duplicate, delete, and manage page order with visual thumbnail grid.',
    category: 'organize',
    categoryName: 'Organize & Edit',
    iconName: 'RotateCw',
    accentColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800/60',
    badge: 'Visual Grid',
    badgeType: 'purple',
    tags: ['organize', 'reorder', 'rotate', 'delete page', 'rearrange', 'duplicate page', 'sort pages', 'orient'],
    isAvailable: true,
  },
  // 8. PDF Compressor
  {
    id: 'compress',
    name: 'Compress PDF',
    shortName: 'Compress',
    description: 'Reduce PDF file size with extreme, recommended, or high-quality presets while preserving readability.',
    category: 'core',
    categoryName: 'Core & Split',
    iconName: 'Minimize2',
    accentColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800/60',
    badge: 'Size Reducer',
    badgeType: 'amber',
    tags: ['compress', 'reduce size', 'shrink', 'optimize', 'file size', 'small pdf', 'compressor', 'downscale'],
    isAvailable: true,
  },
  // 9. PDF Converter
  {
    id: 'convert',
    name: 'PDF Converter',
    shortName: 'Convert',
    description: 'Convert PDFs to Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, and convert other files to PDF.',
    category: 'convert',
    categoryName: 'Convert & Scan',
    iconName: 'ArrowLeftRight',
    accentColor: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/70 border-violet-200 dark:border-violet-800/60',
    badge: 'Multi-Format',
    badgeType: 'purple',
    tags: ['convert', 'pdf to word', 'pdf to docx', 'pdf to excel', 'pdf to image', 'jpg to pdf', 'png to pdf', 'export'],
    isAvailable: true,
  },
  // 10. PDF Editor
  {
    id: 'edit',
    name: 'PDF Editor',
    shortName: 'Editor',
    description: 'Add text notes, draw annotations, insert geometric shapes, callouts, arrows, and highlight key sections.',
    category: 'organize',
    categoryName: 'Organize & Edit',
    iconName: 'Edit3',
    accentColor: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/70 border-pink-200 dark:border-pink-800/60',
    badge: 'Markup & Draw',
    badgeType: 'rose',
    tags: ['edit', 'editor', 'annotate', 'markup', 'draw', 'pencil', 'highlighter', 'shapes', 'add text', 'notes'],
    isAvailable: true,
  },
  // 11. OCR PDF
  {
    id: 'ocr',
    name: 'OCR PDF (Text Recognition)',
    shortName: 'OCR',
    description: 'Extract text from scanned documents and images to make pages searchable, selectable, and copyable.',
    category: 'extract_ocr',
    categoryName: 'Extract & OCR',
    iconName: 'ScanText',
    accentColor: 'text-purple-600 dark:text-cyan-400 bg-purple-50 dark:bg-cyan-950/70 border-purple-200 dark:border-cyan-800/60',
    badge: 'Tesseract OCR',
    badgeType: 'cyan',
    isAiTool: true,
    featuredTag: 'AI-Powered',
    tags: ['ocr', 'optical character recognition', 'text recognition', 'scanned pdf', 'searchable pdf', 'extract text from image', 'tesseract'],
    isAvailable: true,
  },
  // 12. PDF Security
  {
    id: 'security',
    name: 'PDF Security & Password',
    shortName: 'Security',
    description: 'Encrypt PDFs with strong password protection, manage permissions, or decrypt and remove known passwords.',
    category: 'security',
    categoryName: 'Security & Redact',
    iconName: 'Lock',
    accentColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800/60',
    badge: 'Encryption',
    badgeType: 'blue',
    tags: ['security', 'password', 'encrypt', 'protect', 'lock', 'unlock', 'decrypt', 'permissions', 'aes'],
    isAvailable: true,
  },
  // 13. PDF Watermark
  {
    id: 'watermark',
    name: 'PDF Watermark & Stamp',
    shortName: 'Watermark',
    description: 'Apply custom text watermarks (Confidential, Draft), company logos, or remove existing overlays.',
    category: 'security',
    categoryName: 'Security & Redact',
    iconName: 'Stamp',
    accentColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800/60',
    badge: 'Text & Image',
    badgeType: 'rose',
    tags: ['watermark', 'stamp', 'logo overlay', 'confidential', 'draft', 'remove watermark', 'branding', 'transparency'],
    isAvailable: true,
  },
  // 14. PDF Crop & Resize
  {
    id: 'crop',
    name: 'PDF Crop & Resize',
    shortName: 'Crop & Resize',
    description: 'Trim page margins, crop custom bounding boxes, and resize pages to standard sizes (A4, A3, Letter, Legal).',
    category: 'organize',
    categoryName: 'Organize & Edit',
    iconName: 'Crop',
    accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60',
    badge: 'Dimension Presets',
    badgeType: 'cyan',
    tags: ['crop', 'resize', 'page size', 'trim margins', 'a4', 'letter', 'bounding box', 'aspect ratio', 'dimensions'],
    isAvailable: true,
  },
  // 15. PDF Compare
  {
    id: 'compare',
    name: 'PDF Compare & Diff',
    shortName: 'Compare',
    description: 'Compare two PDF documents side-by-side or overlay differences to detect visual and textual changes.',
    category: 'organize',
    categoryName: 'Organize & Edit',
    iconName: 'GitCompare',
    accentColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800/60',
    badge: 'Diff Viewer',
    badgeType: 'blue',
    tags: ['compare', 'diff', 'compare versions', 'side by side', 'changes', 'revisions', 'document diff', 'text changes'],
    isAvailable: true,
  },
  // 16. PDF Forms
  {
    id: 'forms',
    name: 'PDF Form Builder & Filler',
    shortName: 'Forms',
    description: 'Fill interactive AcroForm fields (text, checkboxes, radio buttons, dropdowns) or design new fillable forms.',
    category: 'sign_forms',
    categoryName: 'Sign & Forms',
    iconName: 'CheckSquare',
    accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60',
    badge: 'AcroForms',
    badgeType: 'cyan',
    tags: ['forms', 'form builder', 'fill form', 'interactive form', 'acroforms', 'input fields', 'checkboxes', 'dropdown'],
    isAvailable: true,
  },
  // 17. PDF Redact
  {
    id: 'redact',
    name: 'PDF Redaction (Privacy)',
    shortName: 'Redact',
    description: 'Permanently blackout and erase sensitive data, PII, SSNs, credit card numbers, and confidential text.',
    category: 'security',
    categoryName: 'Security & Redact',
    iconName: 'EyeOff',
    accentColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800/60',
    badge: 'Permanent Erase',
    badgeType: 'rose',
    tags: ['redact', 'redaction', 'blackout', 'hide text', 'privacy', 'pii', 'sensitive data', 'sanitize', 'erase text'],
    isAvailable: true,
  },
  // 18. PDF Metadata
  {
    id: 'metadata',
    name: 'PDF Metadata Inspector',
    shortName: 'Metadata',
    description: 'View, edit, or wipe document metadata properties like Author, Title, Subject, Producer, and Creation Date.',
    category: 'security',
    categoryName: 'Security & Redact',
    iconName: 'Info',
    accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60',
    badge: 'EXIF & Info',
    badgeType: 'cyan',
    tags: ['metadata', 'author', 'title', 'properties', 'info', 'clean metadata', 'exif', 'producer', 'creation date'],
    isAvailable: true,
  },
  // 19. PDF Extractor
  {
    id: 'extract',
    name: 'PDF Extractor (Text, Images, Tables)',
    shortName: 'Extract',
    description: 'Extract raw text, embedded images, tables, and structured data from your PDF document in high resolution.',
    category: 'extract_ocr',
    categoryName: 'Extract & OCR',
    iconName: 'Archive',
    accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60',
    badge: 'Asset Exporter',
    badgeType: 'cyan',
    tags: ['extract', 'extract images', 'extract text', 'extract tables', 'rip images', 'export assets', 'export images'],
    isAvailable: true,
  },
  // 20. AI Summarizer
  {
    id: 'ai-summarize',
    name: 'AI PDF Summarizer',
    shortName: 'AI Summary',
    description: 'Generate instant executive summaries, key bullet points, and critical takeaways from contracts and reports.',
    category: 'ai_smart',
    categoryName: 'AI & Smart Tools',
    iconName: 'Sparkles',
    accentColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800/60',
    badge: 'AI Powered',
    badgeType: 'ai',
    tags: ['ai', 'summarize', 'summary', 'tldr', 'executive summary', 'brief', 'key points', 'contract review', 'trident ai', 'tridentpdf'],
    isAvailable: true,
    isAiTool: true,
  },
  // 21. AI Document Chat
  {
    id: 'ai-chat',
    name: 'Ask AI (PDF Document Chat)',
    shortName: 'Ask PDF',
    description: 'Chat interactively with your document: ask questions, cross-examine clauses, and find exact page citations.',
    category: 'ai_smart',
    categoryName: 'AI & Smart Tools',
    iconName: 'MessageSquare',
    accentColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60',
    badge: 'AI Chatbot',
    badgeType: 'ai',
    tags: ['ai', 'chat', 'ask pdf', 'q&a', 'questions', 'citations', 'search pdf', 'explain', 'copilot'],
    isAvailable: true,
    isAiTool: true,
  },
  // 22. AI Smart PII Redactor
  {
    id: 'ai-redact',
    name: 'AI Smart PII Redaction',
    shortName: 'AI Redact',
    description: 'Auto-detect SSNs, credit cards, emails, phone numbers, and sensitive entities for 1-click batch redaction.',
    category: 'ai_smart',
    categoryName: 'AI & Smart Tools',
    iconName: 'BrainCircuit',
    accentColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800/60',
    badge: 'Auto-PII',
    badgeType: 'ai',
    tags: ['ai', 'pii', 'smart redact', 'auto redact', 'privacy', 'ssn detector', 'anonymize', 'gdpr', 'compliance'],
    isAvailable: true,
    isAiTool: true,
  },
  // 23. AI PDF Translator
  {
    id: 'ai-translate',
    name: 'AI Document Translator',
    shortName: 'AI Translate',
    description: 'Translate documents across 50+ languages while preserving original page typography and formatting.',
    category: 'ai_smart',
    categoryName: 'AI & Smart Tools',
    iconName: 'Languages',
    accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800/60',
    badge: '50+ Languages',
    badgeType: 'ai',
    tags: ['ai', 'translate', 'translator', 'multilingual', 'spanish', 'french', 'german', 'hindi', 'languages'],
    isAvailable: true,
    isAiTool: true,
  },
  // 24. AI Table & Invoice Extractor
  {
    id: 'ai-extract',
    name: 'AI Table & Invoice Extractor',
    shortName: 'AI Extractor',
    description: 'Extract structured financial data, invoices, line items, and nested tables directly into CSV and JSON.',
    category: 'ai_smart',
    categoryName: 'AI & Smart Tools',
    iconName: 'FileSpreadsheet',
    accentColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800/60',
    badge: 'Structured Data',
    badgeType: 'ai',
    tags: ['ai', 'invoice', 'receipt', 'financial data', 'table to csv', 'line items', 'expense', 'accounting'],
    isAvailable: true,
    isAiTool: true,
  },
];

const SEARCH_SYNONYMS: Record<string, string[]> = {
  compress: ['shrink', 'reduce', 'small', 'downsize', 'optimize', 'size', 'kb', 'mb', 'compres', 'downscale', 'compact'],
  shrink: ['compress', 'reduce', 'small', 'optimize'],
  reduce: ['compress', 'shrink', 'optimize', 'downsize'],
  jpg: ['jpeg', 'image', 'photo', 'picture', 'pic'],
  jpeg: ['jpg', 'image', 'photo', 'picture'],
  merge: ['combine', 'join', 'append', 'stitch', 'concatenate', 'group', 'bundle', 'unite'],
  combine: ['merge', 'join', 'append', 'stitch'],
  split: ['cut', 'separate', 'divide', 'break', 'slice', 'extract pages', 'parts', 'ranges'],
  cut: ['split', 'separate', 'divide'],
  sign: ['signature', 'stamp', 'e-sign', 'contract', 'agreement', 'initials', 'autograph'],
  edit: ['annotate', 'markup', 'draw', 'pencil', 'highlighter', 'notes', 'text', 'comment'],
  scan: ['scanner', 'camera', 'photo to pdf', 'camscanner'],
  ocr: ['text recognition', 'scanned', 'read text', 'searchable', 'extract text', 'tesseract'],
  password: ['protect', 'lock', 'encrypt', 'decrypt', 'security', 'unlock', 'aes'],
  protect: ['password', 'lock', 'encrypt', 'decrypt', 'security'],
  lock: ['password', 'protect', 'encrypt', 'security'],
  unlock: ['decrypt', 'remove password', 'security'],
  redact: ['blackout', 'privacy', 'pii', 'hide', 'sanitize', 'erase', 'censor'],
  privacy: ['redact', 'pii', 'blackout', 'security', 'sanitize'],
  convert: ['word', 'docx', 'excel', 'xlsx', 'powerpoint', 'pptx', 'image', 'pdf to', 'export'],
  watermark: ['stamp', 'logo', 'confidential', 'draft', 'brand'],
  organize: ['reorder', 'rotate', 'delete page', 'rearrange', 'sort'],
  rotate: ['turn', 'flip', 'orient', 'organize', 'degree'],
  crop: ['resize', 'dimensions', 'trim', 'margins', 'a4', 'letter', 'bounding box'],
  resize: ['crop', 'dimensions', 'page size', 'a4', 'letter'],
  compare: ['diff', 'difference', 'revisions', 'changes', 'side by side'],
  forms: ['form', 'fill', 'acroforms', 'checkbox', 'fields', 'interactive'],
  ai: ['summarize', 'summary', 'chat', 'ask', 'translate', 'extract', 'invoice', 'smart', 'copilot'],
  summary: ['summarize', 'ai', 'tldr', 'executive summary', 'brief'],
  translate: ['multilingual', 'languages', 'spanish', 'french', 'german', 'hindi'],
};

/**
 * Normalizes and stems simple English query words (e.g., "compressing" -> "compress")
 */
function stemWord(word: string): string {
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
  if (word.endsWith('ed') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('es') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 3 && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

/**
 * Filter & search tools matching a query string across titles, descriptions, categories, and tags.
 * Includes stem-matching, synonym expansion, multi-word tokenization, and high-accuracy relevance scoring.
 */
export function searchTools(
  query: string,
  category: ToolCategory = 'all'
): ToolDefinition[] {
  const cleanQuery = query.trim().toLowerCase().replace(/['".,]/g, '');

  const filtered = TOOL_REGISTRY.filter((tool) => {
    // Category filter
    if (category !== 'all' && tool.category !== category) {
      return false;
    }

    if (!cleanQuery) return true;

    const rawWords = cleanQuery.split(/\s+/).filter(Boolean);
    const toolName = tool.name.toLowerCase();
    const shortName = tool.shortName.toLowerCase();
    const desc = tool.description.toLowerCase();
    const catName = tool.categoryName.toLowerCase();
    const tags = tool.tags.map((t) => t.toLowerCase());

    // Check if every word or its stem/synonyms match the tool
    const allWordsMatch = rawWords.every((word) => {
      const stem = stemWord(word);
      const synonyms = SEARCH_SYNONYMS[word] || SEARCH_SYNONYMS[stem] || [];
      const matchCandidates = [word, stem, ...synonyms];

      return matchCandidates.some(
        (term) =>
          toolName.includes(term) ||
          shortName.includes(term) ||
          desc.includes(term) ||
          catName.includes(term) ||
          tags.some((t) => t.includes(term))
      );
    });

    return allWordsMatch;
  });

  if (!cleanQuery) return filtered;

  // Compute relevance scores
  const rawWords = cleanQuery.split(/\s+/).filter(Boolean);

  const scored = filtered.map((tool) => {
    let score = 0;
    const toolName = tool.name.toLowerCase();
    const shortName = tool.shortName.toLowerCase();
    const desc = tool.description.toLowerCase();
    const catName = tool.categoryName.toLowerCase();
    const tags = tool.tags.map((t) => t.toLowerCase());

    // 1. Exact full query matches
    if (toolName === cleanQuery || shortName === cleanQuery) score += 500;
    else if (toolName.startsWith(cleanQuery) || shortName.startsWith(cleanQuery)) score += 250;
    else if (toolName.includes(cleanQuery)) score += 180;
    else if (shortName.includes(cleanQuery)) score += 150;

    // 2. Tokenized word matches
    for (const word of rawWords) {
      const stem = stemWord(word);
      const synonyms = SEARCH_SYNONYMS[word] || SEARCH_SYNONYMS[stem] || [];

      // Name matches
      if (toolName === word || toolName.split(/\s+/).includes(word)) score += 90;
      else if (toolName.includes(word) || toolName.includes(stem)) score += 50;

      // Short name matches
      if (shortName === word || shortName.split(/\s+/).includes(word)) score += 70;
      else if (shortName.includes(word) || shortName.includes(stem)) score += 35;

      // Tag exact matches
      if (tags.includes(word) || tags.includes(stem)) score += 60;
      else if (tags.some((t) => t.includes(word) || t.includes(stem))) score += 40;

      // Synonym matches
      for (const syn of synonyms) {
        if (toolName.includes(syn) || shortName.includes(syn)) score += 45;
        else if (tags.some((t) => t.includes(syn))) score += 35;
      }

      // Category and description matches
      if (catName.includes(word)) score += 20;
      if (desc.includes(word) || desc.includes(stem)) score += 15;
    }

    // Boost featured and popular items slightly as tie-breaker
    if (tool.badge === 'Popular') score += 5;
    if (tool.isNew) score += 4;
    if (tool.isAiTool) score += 2;

    return { tool, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.tool);
}

/**
 * Returns the count of matching tools for every category given a search query.
 */
export function getCategoryMatchCounts(query: string): Record<ToolCategory, number> {
  const counts: Record<ToolCategory, number> = {
    all: 0,
    core: 0,
    organize: 0,
    convert: 0,
    sign_forms: 0,
    security: 0,
    extract_ocr: 0,
    ai_smart: 0,
  };

  const allMatches = searchTools(query, 'all');
  counts.all = allMatches.length;

  for (const tool of allMatches) {
    if (counts[tool.category] !== undefined) {
      counts[tool.category]++;
    }
  }

  return counts;
}

export function getToolById(toolId: AppTool): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((t) => t.id === toolId);
}
