# Original User Request

## 2026-10-08T11:52:53Z

# Teamwork Project Prompt

Transform the application at `E:\tridentpdf-mobile` into a full-fledged, high-performance WPS Office alternative with a 100% authentic WPS interface, universal document format support (DOCX, XLSX, PPTX, PDF, TXT), smooth battery-safe animations, and a secure Personal Cloudinary Cloud Storage integration managed through Settings.

Working directory: E:\tridentpdf-mobile
Integrity mode: demo

## Requirements

### R1. Authentic WPS Office User Experience & Battery-Safe Motion
- Replace all legacy/unneeded TridentPDF UI with an authentic WPS Office interface:
  - **Recent Files Tab:** Categorized document history with distinctive WPS format icons (Word DOCX blue, Excel XLSX green, PowerPoint PPTX orange, PDF red), timestamp, and file size.
  - **Folders / Cloud Tab:** Unified local phone storage navigator and Cloudinary remote drive browser.
  - **WPS Tools Center:** Curated suite of office utilities (Office-to-PDF, Images-to-PDF, PDF Compress, PDF Split/Merge, Document Scanner).
  - **WPS Action (+):** Quick action menu for New Document, New Spreadsheet, New Presentation, Scan Document, and Cloudinary Upload.
  - **Motion & Performance:** Native-driven, 60fps micro-animations with zero background battery drain or UI thread stutter.

### R2. Universal Office Document Engine (View & Edit)
- Support opening, viewing, and editing all standard document formats without glitches or errors:
  - **Word (DOCX / DOC):** Formatted text rendering (headings, styling, tables, lists, text formatting) with full-screen reading and editing modes.
  - **Excel (XLSX / XLS / CSV):** Interactive multi-sheet spreadsheet grid with cell editing, row/column headers, formula bar, and calculation engine.
  - **PowerPoint (PPTX / PPT):** Slide-by-slide visual presentation viewer with touch carousel, thumbnail drawer, and presentation mode.
  - **PDF & Text:** High-definition PDF reader with zoom, search, annotations, and plain text/code reader.
  - **Camera Scanner:** Multi-page camera capture with edge framing and instant export to PDF/DOCX.

### R3. Personal Cloudinary Cloud Storage Integration & Settings
- Dedicated **Settings → Cloud Storage → Cloudinary** configuration screen matching the WPS design language.
- Configurable settings:
  - Cloud Name
  - API Key
  - API Secret (masked in UI, encrypted at rest via Android Keystore / encrypted storage, strictly excluded from Logcat and crash messages)
  - Root Storage Folder (e.g. `wps_office/documents`)
- **Test Connection** action that validates credentials against live Cloudinary endpoints and displays clear status indicators (`✓ Connected` / `✕ Connection Failed`).
- Seamless Cloudinary operations: Upload, Download, Delete, Rename, and List Files.

## Acceptance Criteria

### UI & Office Suite
- [ ] UI completely mirrors WPS Office layout and style, with no leftover unneeded tools or legacy branding.
- [ ] Opens and renders DOCX, XLSX, PPTX, PDF, and TXT files smoothly without crashing or UI freezing.
- [ ] Animations run at 60fps on native thread without background battery drain.

### Cloudinary Storage & Security
- [ ] Settings screen accepts and securely stores Cloud Name, API Key, API Secret, and Folder.
- [ ] API Secret is masked with bullet characters in the UI and encrypted via Android Keystore.
- [ ] "Test Connection" executes a live check against Cloudinary and shows real connection status.
- [ ] Documents can be uploaded to Cloudinary, listed in the cloud browser, and downloaded back to the phone preserving full file integrity.
- [ ] Logcat remains clean of any API secrets or tokens during all operations.

### Build & On-Device Verification
- [ ] Android project compiles successfully via Gradle into a release APK.
- [ ] APK installs via ADB to the connected Android device (`B6TGUWZDBYMR6HD6`).
- [ ] App launches smoothly, opens documents, and verifies the Cloudinary workflows end-to-end.
