# Phase 3: System Architecture Document

## 1. System Topology & Layering
TridentPDF Mobile follows a modular, reactive architecture decoupled into presentation, service, and storage layers:

```
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION LAYER                                 |
|  [ RecentFilesScreen ]   [ FoldersCloudScreen ]   [ WPSToolsScreen ]  [ SettingsScreen] |
|  [ DocumentViewerScreen] [ SignAndFillScreen ]    [ ScannerScreen ]   [ AIScreen ]     |
|                                                                                       |
|  COMPONENTS: [ WPSBottomNav ] [ WPSActionMenu ] [ WPSHeader ] [ FormatBadge ]         |
|              [ SystemNotificationBanner ] [ CommandPaletteModal ]                     |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                    REACTIVE SERVICES                                  |
|  [ ActiveDocumentStore ]      -> Volatile RAM active document & tool output pipeline   |
|  [ DocumentStorageService ]   -> Device file system persistence & recent index        |
|  [ SystemErrorService ]       -> Global non-blocking error recovery dispatcher        |
|  [ AIAssistantService ]       -> Local PII detection, heuristic summary, doc query    |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                     ENGINE CORE                                       |
|  [ PDFEngine ]                -> pdf-lib & ISO 32000-1 binary parsing and transforms   |
|  [ Expo Platform Native ]     -> FileSystem, Camera, Sharing, Print, Haptics          |
+---------------------------------------------------------------------------------------+
```

## 2. Architecture Decision Records (ADRs)

### ADR-001: Volatile Memory Execution for DPDP Compliance
- **Status:** Approved
- **Context:** Storing user files on remote servers violates Indian DPDP Act 2023 without explicit user consent flows.
- **Decision:** Execute all document transforms and parsing entirely in device RAM with `FileSystem.cacheDirectory` sanitization on session completion.

### ADR-002: Reactive Active Document Store
- **Status:** Approved
- **Context:** Web uploader required picking a file on every single tool page.
- **Decision:** Implement `ActiveDocumentStore` utilizing reactive observer subscriptions (`subscribe` / `setActiveDocument`) allowing any tool to process the currently loaded document with zero user friction.

### ADR-003: Centralized Error Recovery Banner
- **Status:** Approved
- **Context:** Standard unhandled alerts interrupt user workflow and cause perceived crashes.
- **Decision:** Standardize all errors through `SystemErrorService.showNotification()` rendering a glassmorphic top banner with clear and retry buttons.
