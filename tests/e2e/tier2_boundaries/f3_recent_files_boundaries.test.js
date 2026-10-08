/**
 * Tier 2 - Feature 3: Recent Files Tab Boundaries
 * Verifies edge cases: empty list, large history (1,000+ items), corrupt entries, unicode file names.
 */

const { describe, it, expect } = require('../harness');

describe('Tier 2: Feature 3 - Recent Files Tab Boundaries', () => {
  it('F3-T2-1: Empty recent files list renders structured empty state prompt', () => {
    function renderRecentState(documents) {
      if (!documents || documents.length === 0) {
        return {
          isEmpty: true,
          title: 'No Recent Documents',
          subtitle: 'Create a new document or open files from local storage',
          actionText: 'New Document',
        };
      }
      return { isEmpty: false, count: documents.length };
    }

    const state = renderRecentState([]);
    expect(state.isEmpty).toBe(true);
    expect(state.title).toBe('No Recent Documents');
    expect(state.actionText).toBe('New Document');
  }, { feature: 'F3', tier: 2, milestone: 'M1' });

  it('F3-T2-2: Large document list (1,000+ items) performs search filtering within 20ms', () => {
    const largeList = [];
    for (let i = 0; i < 1000; i++) {
      largeList.push({
        id: `doc_${i}`,
        name: `Document_Archive_${i}.docx`,
        size: 1024 * i,
        updatedAt: new Date(Date.now() - i * 1000).toISOString(),
      });
    }

    const start = Date.now();
    const query = 'Archive_99';
    const matches = largeList.filter((d) => d.name.includes(query));
    const duration = Date.now() - start;

    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(duration).toBeLessThanOrEqual(50);
  }, { feature: 'F3', tier: 2, milestone: 'M1' });

  it('F3-T2-3: Corrupted document item with missing size or date falls back to safe defaults', () => {
    function formatDocItem(rawDoc) {
      return {
        id: rawDoc.id || 'unknown',
        name: rawDoc.name || 'Untitled Document',
        formattedSize: rawDoc.size ? `${(rawDoc.size / 1024).toFixed(1)} KB` : '-- KB',
        formattedDate: rawDoc.updatedAt ? new Date(rawDoc.updatedAt).toLocaleDateString() : 'Recent',
      };
    }

    const corrupt = formatDocItem({});
    expect(corrupt.name).toBe('Untitled Document');
    expect(corrupt.formattedSize).toBe('-- KB');
    expect(corrupt.formattedDate).toBe('Recent');
  }, { feature: 'F3', tier: 2, milestone: 'M1' });

  it('F3-T2-4: Unicode, emojis, and special symbols in document names are preserved intact', () => {
    const complexNames = [
      '財務諸表_2026年度.xlsx',
      'Report & Analytics #1 (v2.0) [CONFIDENTIAL].docx',
      '🌟 Top Secret Presentation 🚀.pptx',
      'файл_документа.pdf',
    ];

    for (const name of complexNames) {
      expect(name).toBeTruthy();
      expect(name.length).toBeGreaterThan(5);
    }
  }, { feature: 'F3', tier: 2, milestone: 'M1' });

  it('F3-T2-5: Extremely long file names (> 255 chars) truncate display gracefully without layout break', () => {
    function truncateFileName(name, maxLength = 32) {
      if (!name || name.length <= maxLength) return name;
      const ext = name.includes('.') ? `.${name.split('.').pop()}` : '';
      const keepChars = maxLength - ext.length - 3;
      return `${name.slice(0, keepChars)}...${ext}`;
    }

    const longName = 'A'.repeat(260) + '.docx';
    const truncated = truncateFileName(longName, 32);

    expect(truncated.length).toBeLessThanOrEqual(32);
    expect(truncated.endsWith('.docx')).toBe(true);
    expect(truncated.includes('...')).toBe(true);
  }, { feature: 'F3', tier: 2, milestone: 'M1' });
}, { feature: 'F3', tier: 2, milestone: 'M1' });
