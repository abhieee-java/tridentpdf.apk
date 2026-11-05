# 🔱 TridentPDF Mobile — Complete Private PDF Studio

<p align="center">
  <b>Fast, secure, 100% client-side PDF utility suite running on iOS & Android with zero server uploads.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-blue?style=for-the-badge&logo=android" alt="Platforms" />
  <a href="https://github.com/abhieee-java/tridentpdf.apk/releases/tag/v1.0.0"><img src="https://img.shields.io/badge/Release-v1.0.0-orange?style=for-the-badge&logo=github" alt="Release v1.0.0" /></a>
  <a href="https://github.com/abhieee-java/tridentpdf.apk/actions"><img src="https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions" alt="CI/CD" /></a>
  <img src="https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=for-the-badge&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Privacy-100%25%20On--Device-10B981?style=for-the-badge&logo=shield" alt="Privacy" />
  <img src="https://img.shields.io/badge/Compliance-DPDP%20Act%202023-purple?style=for-the-badge" alt="DPDP Act" />
</p>

---

## ⚡ WPS Office Suite Architecture & Apple-Grade Page Reader

TridentPDF Mobile operates as an on-device document suite inspired by WPS Office:

1. **WPS 4-Tab Navigation & Spring Action Menu:**
   - **Recent Documents:** Chronological timeline grouped by `TODAY`, `YESTERDAY`, and `EARLIER THIS WEEK` with reactive format filter chips (`DOC`, `XLS`, `PPT`, `PDF`).
   - **Folders & Storage Hub:** Direct local device filesystem browser with format badges, live search, multi-axis sort, share, and delete.
   - **Central Kinetic FAB (`+`):** 1-tap quick action sheet for creating blank Word (`.docx`), Excel (`.xlsx`), PowerPoint (`.pptx`), Text (`.txt`), and camera scanning.
   - **25-Tool Studio Matrix:** Instant toggle between 🔱 TridentPDF Studio (25 tools) and ⚡ Office Utilities.
2. **Apple-Grade Physical Page Reader Canvas:**
   - Simulated physical A4 sheet with realistic paper drop shadows, margin guidelines, and Trident watermark.
   - Live interactive controls: zoom scrubber (`70%–150%`), page navigation scrubber (`< Page X of Y >`), print dialog, and a quick-action launcher directly invoking any of the 25 operations on the active document.
3. **Active Document Store & Unified Error Engine:**
   - In-memory reactive document state keeps files accessible across all tools without redundant re-uploads.
   - Centralized non-crashing glassmorphic error recovery banner with retry and clear actions.

---

## 📖 Overview

**TridentPDF Mobile** is the mobile counterpart to the web application at [tridentpdf.vercel.app](https://tridentpdf.vercel.app) (GitHub: [abhieee-java/tridentpdf.com](https://github.com/abhieee-java/tridentpdf.com)). Built with React Native, TypeScript, and native Android/iOS tooling, it brings a full 25+ tool PDF studio directly to mobile phones and tablets.

All PDF rendering, page manipulation, encryption, and signature stamping execute strictly **inside volatile device RAM**. Zero files, telemetry, or documents are ever uploaded to remote servers.

---

## 🏛️ The 10 Core Subroutines Architecture

1. **Subroutine 1: Data & Content Architecture (`seoRegistry.ts` & `toolRegistry.ts`)**
   - 94KB+ rich knowledge registry providing GeoAnswer data, technical specifications, and comprehensive Q&A/FAQs for all 25+ tools.
   - 25-tool taxonomy complete with category tags, badges, synonym expansion, and stem-based search scoring.

2. **Subroutine 2: Dedicated Interactive Tool Studio Engine (`ToolDetailModal.tsx`)**
   - Full interactive configuration modal launched on any tool selection.
   - In-depth educational guides, step-by-step how-to instructions, quick facts grid, and expandable FAQ accordion.

3. **Subroutine 3: Core & Split Engine (`PDFEngine.ts`)**
   - Split PDF (custom ranges, single-page extraction, N parts).
   - Merge PDF (multi-file reordering and concatenation).
   - Compress PDF (object stream optimization, metadata stripping).
   - Organize, rotate (90°, 180°, 270°), and crop/resize (A4, A3, Letter, Legal).

4. **Subroutine 4: Sign & Forms Studio (`SignAndFillScreen.tsx`)**
   - 1-Tap batch document signature stamping across pages.
   - Smooth multi-color vector signature canvas (Obsidian, Royal Blue, Emerald, Crimson).
   - AcroForm fillable field support and flattening.

5. **Subroutine 5: Camera Scanner & Media Engine (`ScannerScreen.tsx`)**
   - Hardware camera capture with perspective correction and high-contrast enhancement.
   - Gallery multi-photo to PDF compilation.
   - Client-side JPG compression and Webpage-to-PDF vector snapshot generation.

6. **Subroutine 6: Security & Privacy Suite**
   - AES-256 / AES-128 password encryption and permission controls.
   - Diagonal semi-transparent watermark engine with custom text, opacity, and rotation.
   - Irreversible permanent redaction of sensitive text blocks and PII.
   - Metadata inspector and complete metadata tag wiper.

7. **Subroutine 7: AI & Smart Utilities (`AIScreen.tsx` & `aiAssistantService.ts`)**
   - Ask AI (PDF Chat) with grounded contextual document answers.
   - AI Executive Summarizer, Action Item extractor, and Legal Risk reviewer.
   - Client-side PII detector & redactor for SSNs, Credit Cards, Emails, Phone numbers, Indian Aadhaar, and PAN cards.
   - AI Document Translator and structured table/invoice CSV extractor.

8. **Subroutine 8: Extract & OCR Utilities**
   - Optical Character Recognition (OCR) layer generation.
   - Raw text layer, table, and embedded image extraction.
   - Visual and textual PDF document comparison and difference analysis.

9. **Subroutine 9: Global Search, Command Palette & DPDP Compliance Center**
   - Quick search & Command Palette modal (`CommandPaletteModal.tsx`) for keyboard-driven tool launching.
   - Persistent active document hub with file metadata and one-tap switching.
   - Full DPDP Act 2023 Statutory Compliance Modal (`DpdpComplianceModal.tsx`) with Section 5 Notice, Sections 11–14 Data Principal rights, Section 9 Child Protection, and DPO redressal channels.

10. **Subroutine 10: Build Automation & Continuous Verification**
    - 100% strict TypeScript type checking (`tsc --noEmit`).
    - Comprehensive unit and E2E test suites (189 tests passing).
    - Standalone Android production builders for Release APK and AAB.

---

## 📁 Project Structure

```
tridentpdf-mobile/
├── android/                   # Native Android project (Gradle, NDK, C++ Hermes engine)
├── assets/                    # App icons, splash screens, and adaptive icons
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx         # Website-matched branding navbar & theme toggle
│   │   ├── ToolCard.tsx       # Interactive MobileToolCard with accent badges
│   │   ├── ToolDetailModal.tsx # Full interactive tool execution & SEO knowledge base
│   │   ├── CommandPaletteModal.tsx # Fast tool launcher & search palette
│   │   └── DpdpComplianceModal.tsx # Statutory DPDP Act 2023 compliance center
│   ├── data/
│   │   ├── seoRegistry.ts     # Complete 94KB GeoAnswer & FAQ registry from tridentpdf.com
│   │   ├── toolRegistry.ts    # 25 tools registry with synonyms & scoring engine
│   │   └── toolsRegistry.json # Standalone tool taxonomy
│   ├── screens/               # Feature screens
│   │   ├── ToolsHomeScreen.tsx    # Mobile Studio dashboard & active file hub
│   │   ├── ScannerScreen.tsx      # Native camera document scanner
│   │   ├── SignAndFillScreen.tsx  # Touch drawing canvas & signature stamper
│   │   ├── AIScreen.tsx           # AI Q&A and PII redactor
│   │   ├── DocumentViewerScreen.tsx # Local sandboxed vault & file viewer
│   │   └── SettingsScreen.tsx     # Security settings & cache manager
│   ├── services/
│   │   ├── pdfEngine.ts           # Pure client-side in-memory PDF manipulation
│   │   └── aiAssistantService.ts  # Neural assistant & PII sanitization regex
│   ├── theme/
│   │   ├── colors.ts          # Exact website color tokens (Dark: #000000, Light: #F7F7F8)
│   │   └── ThemeContext.tsx   # Dynamic Theme Provider (Light / Dark / Auto)
│   └── types.ts               # Shared TypeScript definitions
├── tests/                     # Test suites (189 tests passing)
│   ├── e2e/                   # E2E test runner and boundary suites
│   └── tridentpdf_studio.test.js # Core studio unit & integration suite
├── App.tsx                    # Root navigation & bottom tab layout
├── app.json                   # Expo application manifest & permissions
├── build_android.bat          # Automated production release builder (APK + AAB)
├── install_on_phone.bat       # 1-click ADB phone installation script
└── package.json               # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 22)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
node tests/tridentpdf_studio.test.js
npx tsc --noEmit
```

### 3. Run in Development (Expo)
```bash
npx expo start
```
- **Android:** Scan the terminal QR code with **Expo Go** or run on an emulator (`a`).
- **iOS:** Scan the terminal QR code with the **Camera app** to launch in **Expo Go** on iPhone/iPad.

---

## 🛠️ Building Native Android Releases (APK & AAB)

### Automated Script (Windows)
```cmd
build_android.bat
```

Generated outputs will be saved to:
- **APK (Direct Install):** `builds/TridentPDF-release.apk`
- **AAB (Play Store):** `builds/TridentPDF-release.aab`

---

## 📲 Installing on Connected Phone

With your Android phone connected via USB (USB Debugging enabled):
```cmd
install_on_phone.bat
```
Or via ADB:
```bash
adb install -r builds/TridentPDF-release.apk
```

---

## 🛡️ Privacy & Compliance

TridentPDF adheres strictly to zero-knowledge document privacy:
- **Zero Cloud Retention:** No remote databases, servers, or file upload endpoints.
- **Volatile Execution:** Documents are buffered exclusively in local device RAM and discarded when the session ends.
- **DPDP Act 2023 Compliant:** Full privacy-by-design architecture under Sections 5, 9, 11–14.

---

## 📄 License

MIT License. Built with ❤️ for private, accessible document workflows.
