# ADR-005: Apple-Grade Physical Page Sheet Canvas

## Status
Approved

## Context
Rendering documents as flat list items or abstract cards disconnects the user from the physical document metaphor.

## Decision
Render document previews as authentic physical A4 sheets:
1. White paper background with soft ambient drop shadow (`#00000030`, blur `18px`).
2. Header with Trident branding (`🔱 TridentPDF 100% Client-Side Studio`) and page number.
3. GPU-composited CSS / React Native transform `scale` for butter-smooth zoom (`70%–150%`) without triggering layout thrashing.
4. Real-time page scrubber (`Page X of Y`).

## Consequences
- **Positive:** Premium "Apple, Elevated" tactile aesthetic; intuitive zooming; clear page boundary representation.
- **Negative:** Requires scaling calculations for nested elements.
