# Phase 2: Product Requirements Document (PRD)

## 1. Product Vision & Persona
- **Product Vision:** The fastest, most secure, privacy-first mobile document suite. A WPS Office alternative with Apple-grade aesthetic discipline and zero server latency.
- **Target Personas:** Business executives, legal professionals, accountants, students, and engineers who manage PDF, Word, Excel, and Presentation documents locally.

## 2. Core Functional Requirements
1. **WPS Navigation Hub (`FR-NAV`):**
   - 4-tab bottom navigation: `Recent`, `Folders`, `25-Tool Studio`, `Settings`.
   - Kinetic spring floating action button (`+` FAB) with quick-action modal: New DOCX, New XLSX, New PPTX, New TXT, Camera Scan, Cloudinary Upload.
2. **Universal Local File Access (`FR-FILE`):**
   - Local device file explorer with multi-format badges (`DOCX`, `XLSX`, `PPTX`, `PDF`, `TXT`).
   - Relative timestamp grouping (`TODAY`, `YESTERDAY`, `EARLIER THIS WEEK`).
   - Format filter chips (`All`, `DOC`, `XLS`, `PPT`, `PDF`, `TXT`).
   - Sort by date, name, and size.
   - Favorite star toggle and swipe actions.
3. **Apple-Grade Physical Page Reader (`FR-VIEW`):**
   - Simulated A4 paper sheet with physical drop shadow, margin guides, and watermarks.
   - Real-time zoom scrubber (`70%–150%`) and pagination controls (`< Page X of Y >`).
   - Print dialog and share sheet.
   - Quick-action launcher directly invoking any of the 25 operations on the active document.
4. **25-Tool Studio Parity (`FR-TOOLS`):**
   - PDF Split, Merge, Compress, Rotate, Delete Pages, Reorder Pages, Extract Pages.
   - Watermark, Protect, Unlock, Flatten, Grayscale, Crop, Invert Colors, Metadata Editor.
   - OCR PDF, Extract Text, Extract Images, Sign & Fill, PDF to Images, Images to PDF.
   - AI Summarizer, AI Q&A, AI Translator, PII Redactor.
5. **Active Document Store (`FR-STORE`):**
   - Reactive in-memory state keeping loaded documents available across all screens without redundant re-uploading.
6. **Centralized Error Recovery (`FR-ERR`):**
   - Non-crashing glassmorphic top notification banner with clear and retry buttons.

## 3. Non-Functional Requirements
- **Performance:** App cold start `< 1.2s`, frame rate `60-120fps` GPU-composited, bundle size `< 105MB`.
- **Privacy:** DPDP Act 2023 compliance, zero network egress, volatile memory execution.
- **Platform Compatibility:** Android 8.0+ (API 26+) and iOS 14.0+.
