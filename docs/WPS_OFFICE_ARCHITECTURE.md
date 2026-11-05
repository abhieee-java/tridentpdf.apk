# TridentPDF Mobile - WPS Office Architecture Specification

## 1. Overview
TridentPDF Mobile transforms the web-based utility `tridentpdf.vercel.app` into an Apple-grade, persistent on-device document management suite inspired by WPS Office.

## 2. Core Modules
- **WPS Bottom Navigation (`src/components/navigation/WPSBottomNav.tsx`):**
  - Tab 1: **Recent** - Chronological list of accessed documents with format badges, timestamps, and quick actions.
  - Tab 2: **Folders & Storage** - Native file directory explorer with multi-format badges, search, sort, and import picker.
  - Tab 3: **25 Tools** - Complete parity with TridentPDF web tools grouped across PDF, Conversion, Security, and Optimization.
  - Tab 4: **Settings** - Vault status, storage management, offline security assurance.
- **WPS Action Menu FAB (`src/components/navigation/WPSActionMenu.tsx`):**
  - Central spring-physics floating button.
  - 1-tap quick action sheet: Create Blank DOCX, XLSX, PPTX, TXT, or scan from camera.
- **Physical Page Sheet Viewer (`src/screens/DocumentViewerScreen.tsx`):**
  - Authentic A4 page simulation with paper drop shadow and edge margin guidelines.
  - Header branding: `🔱 TridentPDF 100% Client-Side Studio`.
  - Zoom range: 70% to 150% with real-time scaling.
  - Page navigation scrubber (`Page X of Y`).
- **Active Document Store (`src/services/activeDocumentStore.ts`):**
  - Keeps loaded documents active in volatile RAM across tools and viewer.
- **Centralized System Error Engine (`src/services/systemErrorService.ts`):**
  - Intercepts all processing errors into an Apple-style top banner with recovery actions.
