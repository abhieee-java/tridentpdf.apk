# ADR-002: Reactive Active Document Store Architecture

## Status
Approved

## Context
In standard PDF utility websites, users must re-select their file on every tool page. This leads to user fatigue and breaks fluid document editing.

## Decision
Implement a centralized reactive observer pattern (`ActiveDocumentStore`) holding the currently active document reference. When any tool outputs a modified file, it calls `registerToolOutput()`, automatically updating the active document across the viewer, recent list, and other tools.

## Consequences
- **Positive:** Friction-free tool chaining (e.g. Scan -> Compress -> Sign -> Save); immediate document persistence in Recent.
- **Negative:** Requires active subscriber cleanup in React components on unmount.
