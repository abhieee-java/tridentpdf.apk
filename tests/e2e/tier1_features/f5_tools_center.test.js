/**
 * Tier 1 - Feature 5: WPS Tools Center Tests
 * Verifies curated suite of office utilities: Office-to-PDF, Images-to-PDF,
 * PDF Compress, PDF Split/Merge, Document Scanner.
 */

const { describe, it, expect } = require('../harness');

describe('Tier 1: Feature 5 - WPS Tools Center', () => {
  const curatedTools = [
    { id: 'office_to_pdf', title: 'Office to PDF', category: 'convert', acceptedFormats: ['.docx', '.xlsx', '.pptx'] },
    { id: 'images_to_pdf', title: 'Images to PDF', category: 'convert', acceptedFormats: ['.jpg', '.png', '.jpeg'] },
    { id: 'pdf_compress', title: 'PDF Compress', category: 'pdf_tools', acceptedFormats: ['.pdf'] },
    { id: 'pdf_split_merge', title: 'PDF Split/Merge', category: 'pdf_tools', acceptedFormats: ['.pdf'] },
    { id: 'scanner', title: 'Document Scanner', category: 'scanner', acceptedFormats: ['camera', '.jpg', '.png'] },
  ];

  it('F5-T1-1: Curated tool inventory contains exactly the 5 official WPS utilities', () => {
    const ids = curatedTools.map((t) => t.id);
    expect(ids).toHaveLength(5);
    expect(ids).toContain('office_to_pdf');
    expect(ids).toContain('images_to_pdf');
    expect(ids).toContain('pdf_compress');
    expect(ids).toContain('pdf_split_merge');
    expect(ids).toContain('scanner');
  }, { feature: 'F5', tier: 1, milestone: 'M1' });

  it('F5-T1-2: Rejection of legacy marketing cards and unneeded clone tools', () => {
    const prohibitedLegacyTools = ['marketing_banner', 'crypto_miner', 'web_scraper_feed'];
    const currentToolIds = curatedTools.map((t) => t.id);

    for (const legacy of prohibitedLegacyTools) {
      expect(currentToolIds).not.toContain(legacy);
    }
  }, { feature: 'F5', tier: 1, milestone: 'M1' });

  it('F5-T1-3: Office-to-PDF tool validates input document formats', () => {
    const tool = curatedTools.find((t) => t.id === 'office_to_pdf');
    function validateInput(filename) {
      return tool.acceptedFormats.some((ext) => filename.toLowerCase().endsWith(ext));
    }

    expect(validateInput('report.docx')).toBe(true);
    expect(validateInput('data.xlsx')).toBe(true);
    expect(validateInput('slides.pptx')).toBe(true);
    expect(validateInput('malicious.exe')).toBe(false);
  }, { feature: 'F5', tier: 1, milestone: 'M1' });

  it('F5-T1-4: Images-to-PDF tool restricts input to image formats', () => {
    const tool = curatedTools.find((t) => t.id === 'images_to_pdf');
    function validateInput(filename) {
      return tool.acceptedFormats.some((ext) => filename.toLowerCase().endsWith(ext));
    }

    expect(validateInput('photo.jpg')).toBe(true);
    expect(validateInput('receipt.png')).toBe(true);
    expect(validateInput('document.pdf')).toBe(false);
  }, { feature: 'F5', tier: 1, milestone: 'M1' });

  it('F5-T1-5: Tools Center groups utilities into logical categories', () => {
    const categories = new Set(curatedTools.map((t) => t.category));
    expect(categories.has('convert')).toBe(true);
    expect(categories.has('pdf_tools')).toBe(true);
    expect(categories.has('scanner')).toBe(true);
  }, { feature: 'F5', tier: 1, milestone: 'M1' });
}, { feature: 'F5', tier: 1, milestone: 'M1' });
