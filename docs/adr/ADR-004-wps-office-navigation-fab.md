# ADR-004: WPS Office Navigation Hierarchy and Kinetic Spring FAB

## Status
Approved

## Context
Mobile document suites need fast 1-thumb navigation and immediate document creation without burying tools in deeply nested menus.

## Decision
Adopt the WPS Office navigation paradigm:
1. Four primary bottom tabs: `Recent`, `Folders`, `25 Tools`, `Settings`.
2. Central kinetic spring Floating Action Button (`+` FAB) with a slide-up sheet offering 1-tap creation of `.docx`, `.xlsx`, `.pptx`, `.txt`, and camera scan.

## Consequences
- **Positive:** Mobile thumb-zone optimization; 1-tap document creation; familiar navigation pattern for enterprise users.
- **Negative:** Takes up bottom navigation vertical height (`60px`).
