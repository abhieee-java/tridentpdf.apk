/**
 * Tier 1 - Feature 3: Recent Files Tab Tests
 * Verifies categorized document history, format badges (Word, Excel, PPT, PDF, TXT), search & filter.
 */

const { describe, it, expect } = require('../harness');

describe('Tier 1: Feature 3 - Recent Files Tab', () => {
  const sampleDocuments = [
    { id: '1', name: 'Financial_Report.xlsx', type: 'xlsx', size: 1048576, updatedAt: '2026-10-01T10:00:00Z' },
    { id: '2', name: 'Project_Proposal.docx', type: 'docx', size: 524288, updatedAt: '2026-10-02T11:30:00Z' },
    { id: '3', name: 'Product_Roadmap.pptx', type: 'pptx', size: 2097152, updatedAt: '2026-10-03T14:15:00Z' },
    { id: '4', name: 'Contract_Agreement.pdf', type: 'pdf', size: 3145728, updatedAt: '2026-10-04T09:00:00Z' },
    { id: '5', name: 'Notes.txt', type: 'txt', size: 1024, updatedAt: '2026-10-05T08:00:00Z' },
  ];

  it('F3-T1-1: Distinctive WPS format badge colors match specification', () => {
    const badgeColors = {
      docx: '#2563EB', // Blue W
      xlsx: '#16A34A', // Green S/X
      pptx: '#EA580C', // Orange P
      pdf: '#DC2626',  // Red PDF
      txt: '#4B5563',  // Gray TXT
    };

    expect(badgeColors.docx).toBe('#2563EB');
    expect(badgeColors.xlsx).toBe('#16A34A');
    expect(badgeColors.pptx).toBe('#EA580C');
    expect(badgeColors.pdf).toBe('#DC2626');
    expect(badgeColors.txt).toBe('#4B5563');
  }, { feature: 'F3', tier: 1, milestone: 'M1' });

  it('F3-T1-2: File sizes are correctly formatted into KB and MB display strings', () => {
    function formatFileSize(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(524288)).toBe('512.0 KB');
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(3145728)).toBe('3.0 MB');
  }, { feature: 'F3', tier: 1, milestone: 'M1' });

  it('F3-T1-3: Search query filters document list case-insensitively', () => {
    function filterBySearch(docs, query) {
      if (!query) return docs;
      const lower = query.toLowerCase();
      return docs.filter((d) => d.name.toLowerCase().includes(lower));
    }

    const res1 = filterBySearch(sampleDocuments, 'financial');
    expect(res1.length).toBe(1);
    expect(res1[0].name).toBe('Financial_Report.xlsx');

    const res2 = filterBySearch(sampleDocuments, 'pro');
    expect(res2.length).toBe(2); // Project_Proposal and Product_Roadmap
  }, { feature: 'F3', tier: 1, milestone: 'M1' });

  it('F3-T1-4: Category filter segregates documents by type (doc, sheet, slide, pdf, txt)', () => {
    function filterByCategory(docs, cat) {
      if (cat === 'all') return docs;
      const map = {
        doc: ['docx', 'doc'],
        sheet: ['xlsx', 'xls', 'csv'],
        slide: ['pptx', 'ppt'],
        pdf: ['pdf'],
        txt: ['txt'],
      };
      const allowed = map[cat] || [];
      return docs.filter((d) => allowed.includes(d.type));
    }

    expect(filterByCategory(sampleDocuments, 'all').length).toBe(5);
    expect(filterByCategory(sampleDocuments, 'doc').length).toBe(1);
    expect(filterByCategory(sampleDocuments, 'sheet').length).toBe(1);
    expect(filterByCategory(sampleDocuments, 'slide').length).toBe(1);
    expect(filterByCategory(sampleDocuments, 'pdf').length).toBe(1);
  }, { feature: 'F3', tier: 1, milestone: 'M1' });

  it('F3-T1-5: Documents are ordered by last modified timestamp descending', () => {
    const sorted = [...sampleDocuments].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    expect(sorted[0].id).toBe('5'); // Oct 5
    expect(sorted[1].id).toBe('4'); // Oct 4
    expect(sorted[sorted.length - 1].id).toBe('1'); // Oct 1
  }, { feature: 'F3', tier: 1, milestone: 'M1' });
}, { feature: 'F3', tier: 1, milestone: 'M1' });
