export type AppTool =
  | 'home'
  | 'split'
  | 'sign'
  | 'sign-fill'
  | 'scanner'
  | 'webpage-pdf'
  | 'compress-jpg'
  | 'merge'
  | 'organize'
  | 'compress'
  | 'convert'
  | 'edit'
  | 'ocr'
  | 'security'
  | 'watermark'
  | 'crop'
  | 'compare'
  | 'forms'
  | 'redact'
  | 'metadata'
  | 'extract'
  | 'ai-summarize'
  | 'ai-chat'
  | 'ai-translate'
  | 'ai-redact'
  | 'ai-extract';

export type ToolCategory =
  | 'all'
  | 'core'
  | 'organize'
  | 'convert'
  | 'sign_forms'
  | 'security'
  | 'extract_ocr'
  | 'ai_smart';

export interface ToolItem {
  id: AppTool;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  categoryName: string;
  badge?: string | null;
  badgeType?: 'cyan' | 'blue' | 'purple' | 'amber' | 'emerald' | 'rose' | 'ai';
  isNew?: boolean;
  isAi?: boolean;
  accentColor?: string;
  icon: string;
  iconBg: string;
  badgeColor: string;
  tags?: string[];
}

export interface ActiveDocument {
  name: string;
  uri: string;
  size?: number;
  pageCount?: number;
}
