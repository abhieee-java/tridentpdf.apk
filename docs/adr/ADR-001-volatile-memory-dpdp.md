# ADR-001: Volatile Memory Execution for DPDP Act 2023 Compliance

## Status
Approved

## Context
Indian DPDP Act 2023 mandates strict data minimization, purpose limitation, and explicit consent for personal data handling. Standard web tools send files to cloud servers where data might be cached or logged.

## Decision
Execute all document processing, rendering, and conversion locally in volatile device RAM (via Expo FileSystem cache with session purge). Zero file bytes are transmitted off-device.

## Consequences
- **Positive:** Complete regulatory compliance; zero server bandwidth cost; zero breach liability; instantaneous offline functionality.
- **Negative:** Limited by local device RAM for exceptionally large documents (>500MB).
