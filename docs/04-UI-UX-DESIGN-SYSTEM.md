# Phase 4: UI/UX Design System Specification ("Apple HIG, Elevated")

## 1. Aesthetic Philosophy: "Apple HIG, Elevated"
- **Visual Rhythm:** 4px / 8px mathematical grid, generous negative space (`16px–24px` internal padding, `32px–48px` section padding).
- **Surface Depth:**
  - Obsidian Dark Canvas: `#000000`
  - Elevated Navigation & Sheets: `#09090E` with 0.5px hairline specular borders (`rgba(255, 255, 255, 0.08)`)
  - Document Cards & Modals: `#111118` with top inner specular highlight (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]`)
  - Light Mode Canvas: `#F7F7F8` alabaster with `#FFFFFF` pure white cards and whisper hairline dividers (`rgba(0, 0, 0, 0.06)`).
- **Bundled Font Typography Engine (Zero Vendor Serif Fallbacks):**
  - Standalone bundled static TrueType assets in `android/app/src/main/assets/fonts/`:
    - `Inter-Regular.ttf` (Body, Footnote)
    - `Inter-Medium.ttf` (Callout, Subhead)
    - `Inter-SemiBold.ttf` (Headline, Title3, Caption)
    - `Inter-Bold.ttf` (LargeTitle, Title1, Title2, BadgeText)
  - Monospaced numerals & byte telemetry: `monospace` / `Menlo` for tabular alignment.

## 2. Color Palette & Action Tokens
| Token | Dark Mode Hex | Light Mode Hex | Purpose |
| :--- | :--- | :--- | :--- |
| `background` | `#000000` | `#F7F7F8` | True obsidian canvas |
| `surfaceElevated` | `#09090E` | `#FFFFFF` | Nav bars, header, sheets |
| `surfaceCard` | `#111118` | `#FFFFFF` | Document cards, modals |
| `border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.06)` | 0.5px specular hairline |
| `primary` | `#007AFF` | `#007AFF` | Apple System Blue |
| `accentFAB` | `#007AFF` | `#007AFF` | Frosted specular central action button |
| `badgeDOCX` | `#007AFF` | `#007AFF` | Word document badge |
| `badgeXLSX` | `#34C759` | `#34C759` | Excel sheet badge |
| `badgePPTX` | `#FF9500` | `#FF9500` | Presentation slide badge |
| `badgePDF` | `#FF3B30` | `#FF3B30` | Portable document badge |
| `badgeTXT` | `#64748B` | `#475569` | Plain text badge |
| `badgePRIVATE`| `#10B981` | `#059669` | 100% On-Device DPDP badge |

## 3. Kinetic Physics & Micro-Interactions (Emil Kowalski Physics)
- **Spring Tokens:**
  - Snappy Micro-taps / Buttons: `{ stiffness: 450, damping: 28, mass: 0.6 }` with `whileTap={{ scale: 0.965 }}`.
  - Modals / Drawers: `{ stiffness: 280, damping: 26, mass: 0.9 }`.
  - Sheet Reveals: Native interruptible velocity hand-off.
- **Haptic Feedback:**
  - `Haptics.impactAsync(Light)` on navigation, document selection, and format pill selection.
  - `Haptics.notificationAsync(Success)` on document export and conversion.
- **Tactile Paper Canvas:** Crisp white A4 paper canvas with `#00000030` shadow radius `18px`, margin guidelines, and Trident watermark.
