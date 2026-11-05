# ADR-003: Centralized Glassmorphic System Error Recovery Engine

## Status
Approved

## Context
Raw JavaScript error alerts or system crash dialogs degrade user confidence and give the impression that the app is unstable.

## Decision
Route all try-catch blocks and error states through `SystemErrorService.showNotification()`. This renders a top glassmorphic banner (`SystemNotificationBanner.tsx`) displaying user-friendly guidance, severity coloring, and contextual recovery actions (e.g. Retry, Select File).

## Consequences
- **Positive:** Non-blocking, non-crashing UX; clear user guidance for recovery; zero disruptive alert modals.
- **Negative:** Errors must be mapped to friendly domain codes and messages.
