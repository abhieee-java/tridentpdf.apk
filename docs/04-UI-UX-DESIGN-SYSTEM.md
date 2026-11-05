# Phase 4: UI/UX Design System Specification ("Apple, Elevated")

## 1. Aesthetic Philosophy: "Apple, Elevated"
- **Visual Rhythm:** 4px / 8px mathematical grid, generous negative space (`16px–24px` internal padding, `32px–48px` section padding).
- **Surface Depth:** Glassmorphic backdrops (`rgba(18, 18, 23, 0.85)` with `backdrop-filter: blur(24px)`), specular borders (`1px solid rgba(255, 255, 255, 0.08)`), top inner specular highlight (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]`).
- **Typography:** Display headlines (`clamp(1.75rem, 4vw, 2.5rem)`), body copy (`15px–17px`), line-height `1.55`.

## 2. Color Palette & Format Tokens
| Token | Dark Mode Hex | Light Mode Hex | Purpose |
| :--- | :--- | :--- | :--- |
| `background` | `#09090D` | `#F8F9FA` | Canvas surface |
| `surfaceElevated` | `#121217` | `#FFFFFF` | Nav bars, header, sheets |
| `surfaceCard` | `#181822` | `#FFFFFF` | Document cards, modals |
| `border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.06)` | Specular dividers |
| `primary` | `#2563EB` | `#2563EB` | Revenue and primary action |
| `accentFAB` | `#EA580C` | `#EA580C` | WPS central action button |
| `badgeDOCX` | `#2563EB` | `#1D4ED8` | Word document badge |
| `badgeXLSX` | `#16A34A` | `#15803D` | Excel sheet badge |
| `badgePPTX` | `#EA580C` | `#C2410C` | Presentation slide badge |
| `badgePDF` | `#DC2626` | `#B91C1C` | Portable document badge |
| `badgeTXT` | `#64748B` | `#475569` | Plain text badge |

## 3. Kinetic Physics & Micro-Interactions
- **Spring Tokens:** Physically modeled spring physics (`stiffness: 400`, `damping: 25`, `mass: 0.5`).
- **Haptic Feedback:** `Haptics.impactAsync(Light)` on navigation and format pill selection; `Haptics.notificationAsync(Success)` on document generation.
- **Physical Sheet Simulation:** White A4 paper canvas with `#00000030` shadow radius `18px`, margin guidelines, and Trident watermark.
