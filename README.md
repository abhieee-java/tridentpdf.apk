# 🔱 TridentPDF Mobile — Complete Private PDF Studio

<p align="center">
  <b>Fast, secure, 100% client-side PDF utility suite running on iOS & Android with zero server uploads.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-blue?style=for-the-badge&logo=android" alt="Platforms" />
  <img src="https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=for-the-badge&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo%20SDK-52-black?style=for-the-badge&logo=expo" alt="Expo" />
  <img src="https://img.shields.io/badge/Privacy-100%25%20On--Device-10B981?style=for-the-badge&logo=shield" alt="Privacy" />
  <img src="https://img.shields.io/badge/Compliance-DPDP%20Act%202023-purple?style=for-the-badge" alt="DPDP Act" />
</p>

---

## 📖 Overview

**TridentPDF Mobile** is the cross-platform mobile counterpart to [tridentpdf.vercel.app](https://tridentpdf.vercel.app) / [tridentpdf.com](https://tridentpdf.com). Built with React Native, TypeScript, and native Android/iOS tooling, it brings a full 25+ tool PDF studio directly to mobile phones and tablets.

All PDF rendering, page manipulation, encryption, and signature stamping execute strictly **inside volatile device RAM**. Zero files, telemetry, or documents are ever uploaded to remote servers.

---

## ⚡ Core Features

### 📑 1. Core & Split Studio
- **Merge PDF:** Combine multiple PDF documents with custom ordering and instant concatenation.
- **Split PDF:** Extract custom page ranges or break multi-page documents into single-page files.
- **Compress PDF:** On-device document optimization preserving text clarity.
- **Organize & Rotate:** Reorder pages, duplicate, delete, and rotate (90°, 180°, 270°) with visual previews.

### ✍️ 2. Sign & Forms Studio
- **1-Tap Batch Sign:** Stamp touch-drawn signatures or seals synchronously across all pages or custom page sets.
- **Interactive Canvas:** Smooth finger/stylus drawing with customizable ink palettes (Obsidian, Royal Blue, Emerald, Crimson).
- **Form Filler:** Fill interactive AcroForm fields, text boxes, and date stamps.

### 📸 3. Camera Scanner & Media
- **Native Document Scanner:** Scan physical documents, receipts, and IDs with camera framing guidelines and perspective correction.
- **Batch Scanning:** Multi-page camera capture compiled directly into high-definition PDFs.
- **Images to PDF:** Convert gallery photos (JPG, PNG) into a unified multi-page PDF.
- **Compress JPG:** High-speed client-side image compression.

### 🔒 4. Security & Privacy
- **AES Password Protection:** Encrypt PDFs with strong 128-bit / 256-bit AES encryption.
- **Watermark Engine:** Inject diagonal semi-transparent security stamps (e.g. `CONFIDENTIAL`) across all pages.
- **Permanent Redaction:** Sanitize and blackout sensitive PII, SSNs, and credit cards before sharing.
- **Metadata Editor:** Inspect and sanitize document Author, Title, Creator, and Subject tags.

### 🧠 5. AI & Smart Tools
- **Ask AI (Chat PDF):** Interactive contextual Q&A with your documents.
- **AI Document Summarizer:** Instant executive briefs and key takeaways.
- **AI PII Detector:** Automated pattern identification for sensitive personal identifiers.

---

## 📁 Project Structure

```
tridentpdf-mobile/
├── android/                   # Native Android project (Gradle, NDK, C++ Hermes engine)
├── assets/                    # App icons, splash screens, and adaptive icons
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx         # Website-matched branding navbar & theme toggle
│   │   └── ToolCard.tsx       # Interactive MobileToolCard with accent badges
│   ├── data/
│   │   └── toolsRegistry.json # Complete 25+ tools taxonomy from tridentpdf.vercel.app
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
│   └── theme/
│       ├── colors.ts          # Exact website color tokens (Dark: #000000, Light: #F7F7F8)
│       └── ThemeContext.tsx   # Dynamic Theme Provider (Light / Dark / Auto)
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

### 2. Run in Development (Expo)
```bash
npx expo start
```
- **Android:** Scan the terminal QR code with **Expo Go** or run on an emulator (`a`).
- **iOS:** Scan the terminal QR code with the **Camera app** to launch in **Expo Go** on iPhone/iPad.

---

## 🛠️ Building Native Android Releases (APK & AAB)

The project includes pre-configured automation for building standalone production packages:

### Automated Script (Windows)
```cmd
build_android.bat
```

### Or using Gradle directly:
```cmd
cd android
gradlew.bat assembleRelease   # Compiles release APK (.apk)
gradlew.bat bundleRelease     # Compiles release App Bundle (.aab)
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
- **DPDP Act 2023 Compliant:** Full privacy-by-design architecture.

---

## 📄 License

MIT License. Built with ❤️ for private, accessible document workflows.
