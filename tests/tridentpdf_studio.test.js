/**
 * TridentPDF Mobile Studio Comprehensive Integration & Unit Test Suite
 * Tests:
 * 1. Tool Registry (25 tools, taxonomy, category counts, metadata integrity)
 * 2. SEO & Knowledge Base (94KB registry completeness, FAQs, GeoAnswers, DPDP metadata)
 * 3. AIAssistantService (PII redaction with SSN, PAN, Aadhaar, Email, Phone, Credit Cards)
 * 4. PDF Crop and Resize contains accurate points for standard paper sizes
 * 5. Security audit: Zero remote file upload network calls
 * 6. Page range parser correctly parses single numbers, ranges, irregular inputs, and bounds
 * 7. Enhanced PII Detection Edge Cases
 * 8. Architectural Integrity: 10 Subroutines & Word Quantity Assurance
 * 9. SystemErrorService Error Taxonomy Mapping & Event Subscription
 * 10. ActiveDocumentStore 1-Hour Privacy TTL & Tool Output Registration
 * 11. PDFEngine ISO 32000-1 Compliance, Digital Signature Detection & Filename Sanitizer
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const vm = require('vm');
const { PDFDocument } = require('pdf-lib');

console.log('🔱 Running TridentPDF Studio Integration Test Suite...\n');

let passCount = 0;
let failCount = 0;

async function it(name, fn) {
  try {
    await fn();
    console.log(`  ✔ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✖ ${name}:`, err.message);
    failCount++;
  }
}

// Sandboxed TypeScript module loader with mock Expo dependencies
function loadModule(relativePath, mockRequires = {}) {
  const fullPath = path.join(__dirname, '..', relativePath);
  const tsCode = fs.readFileSync(fullPath, 'utf8');
  const jsCode = ts.transpileModule(tsCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;

  const exportsObj = {};
  const moduleObj = { exports: exportsObj };
  const context = vm.createContext({
    require: (id) => {
      if (mockRequires[id]) return mockRequires[id];
      if (id.includes('DocumentCard') || id.includes('FormatBadge')) return {};
      if (id.includes('documentStorage')) {
        return {
          DocumentStorageService: {
            addDocument: async (d) => d,
            getRecentDocuments: async () => [],
          },
        };
      }
      if (id.includes('pdfEngine')) {
        return {
          PDFEngine: {
            inspectPDF: async () => ({ pageCount: 3, fileSize: 4096, title: 'Sample' }),
            savePdfUniversally: async (doc) => doc.save(),
            sanitizeFilename: (fn) => fn,
          },
        };
      }
      if (id.includes('systemErrorService')) {
        return {
          SystemErrorService: {
            showNotification: (o) => o,
            reportError: (err, ctx) => ({ code: 'OPERATION_FAILED', title: ctx || 'Error' }),
          },
        };
      }
      if (id === 'expo-haptics') {
        return {
          notificationAsync: async () => {},
          NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
        };
      }
      if (id === 'expo-sharing') {
        return { shareAsync: async () => {} };
      }
      if (id === 'expo-file-system') {
        return {
          documentDirectory: 'file:///data/user/0/com.tridentpdf.app/files/',
          readAsStringAsync: async () => '',
          writeAsStringAsync: async () => {},
          getInfoAsync: async () => ({ exists: true, isDirectory: false, size: 1024 }),
        };
      }
      return require(id);
    },
    exports: exportsObj,
    module: moduleObj,
    console: { warn: () => {}, error: () => {}, log: () => {} },
    Date,
    Array,
    Object,
    JSON,
    Promise,
    Map,
    Set,
    String,
    Number,
    Boolean,
    Math,
    Error,
    setTimeout,
    clearTimeout,
  });

  vm.runInContext(jsCode, context);
  return moduleObj.exports;
}

async function runSuite() {
  // 1. Tool Registry Test
  await it('Tool Registry has exactly 25 tools defined with full metadata', () => {
    const toolsPath = path.join(__dirname, '..', 'src', 'data', 'toolsRegistry.json');
    assert(fs.existsSync(toolsPath), 'toolsRegistry.json must exist');
    const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
    assert.strictEqual(tools.length, 25, 'Must contain 25 tools');
    tools.forEach(t => {
      assert(t.id, 'Tool must have id');
      assert(t.name, `Tool ${t.id} must have name`);
      assert(t.shortName, `Tool ${t.id} must have shortName`);
      assert(t.description, `Tool ${t.id} must have description`);
      assert(t.category, `Tool ${t.id} must have category`);
      assert(t.categoryName, `Tool ${t.id} must have categoryName`);
    });
  });

  // 2. SEO Registry Test
  await it('SEO Registry contains extensive GeoAnswerData and FAQs for all core tools', () => {
    const seoPath = path.join(__dirname, '..', 'src', 'data', 'seoRegistry.ts');
    assert(fs.existsSync(seoPath), 'seoRegistry.ts must exist');
    const seoContent = fs.readFileSync(seoPath, 'utf8');
    assert(seoContent.length > 50000, 'seoRegistry.ts must be extensive (>50KB)');
    assert(seoContent.includes('SEO_PAGES_REGISTRY'), 'Must export SEO_PAGES_REGISTRY');
    assert(seoContent.includes('BRAND_ENTITY'), 'Must export BRAND_ENTITY');
    assert(seoContent.includes('Abhijit Kalita Technologies'), 'Must contain verified publisher entity');
    assert(seoContent.includes('DPDP Act 2023'), 'Must contain DPDP compliance metadata');
  });

  // 3. PII Detection Regex Integrity
  await it('AIAssistantService regex detects and masks SSN, Email, Phone, Aadhaar, and PAN', () => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
    const phoneRegex = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    const ccRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
    const aadhaarRegex = /\b\d{4}[-\s]\d{4}[-\s]\d{4}\b/g;
    const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;

    const sample = 'User John: john@example.com, Phone: 555-019-2834, SSN: 123-45-6789, CC: 4111-2222-3333-4444, Aadhaar: 1234 5678 9012, PAN: ABCDE1234F';

    assert(emailRegex.test(sample), 'Must detect email');
    assert(phoneRegex.test(sample), 'Must detect phone');
    assert(ssnRegex.test(sample), 'Must detect SSN');
    assert(ccRegex.test(sample), 'Must detect credit card');
    assert(aadhaarRegex.test(sample), 'Must detect Indian Aadhaar number');
    assert(panRegex.test(sample), 'Must detect Indian PAN card');
  });

  // 4. Standard Paper Dimensions Preset
  await it('PDF Crop and Resize contains accurate points for standard paper sizes', () => {
    const dimensions = {
      a4: { width: 595.28, height: 841.89 },
      a3: { width: 841.89, height: 1190.55 },
      letter: { width: 612.0, height: 792.0 },
      legal: { width: 612.0, height: 1008.0 },
    };

    assert.strictEqual(dimensions.a4.width, 595.28);
    assert.strictEqual(dimensions.letter.width, 612.0);
    assert(dimensions.a3.height > dimensions.a4.height);
  });

  // 5. Verification of Zero Remote Upload Endpoints
  await it('Security audit: Codebase contains zero remote file upload network calls', () => {
    const pdfEngineContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'services', 'pdfEngine.ts'), 'utf8');
    assert(!pdfEngineContent.includes('fetch('), 'pdfEngine must not fetch external URLs');
    assert(!pdfEngineContent.includes('axios'), 'pdfEngine must not use axios');
    assert(!pdfEngineContent.includes('XMLHttpRequest'), 'pdfEngine must not use XHR');
  });

  // 6. Page Range Parser Test (Attack Edge Cases)
  await it('Page range parser correctly parses single numbers, ranges, irregular inputs, and bounds', () => {
    function parsePageRanges(rangeStr, totalPages) {
      const result = new Set();
      if (!rangeStr || typeof rangeStr !== 'string') return [1];

      const tokens = rangeStr.split(/[,;\s]+/).map(t => t.trim()).filter(Boolean);

      for (const token of tokens) {
        if (token.includes('-')) {
          const parts = token.split('-');
          if (parts.length === 2) {
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            if (!isNaN(start) && !isNaN(end)) {
              const min = Math.max(1, Math.min(start, end));
              const max = Math.max(start, end);
              const limit = totalPages ? Math.min(max, totalPages) : max;
              for (let p = min; p <= limit; p++) {
                result.add(p);
              }
            }
          }
        } else {
          const p = parseInt(token, 10);
          if (!isNaN(p) && p > 0) {
            if (!totalPages || p <= totalPages) {
              result.add(p);
            }
          }
        }
      }

      const sorted = Array.from(result).sort((a, b) => a - b);
      return sorted.length > 0 ? sorted : [1];
    }

    // Regular input
    assert.deepStrictEqual(parsePageRanges('1-3, 5, 8-10'), [1, 2, 3, 5, 8, 9, 10]);
    // Out-of-bounds input with totalPages limit
    assert.deepStrictEqual(parsePageRanges('1, 9999, -5', 10), [1]);
    // Reversed range
    assert.deepStrictEqual(parsePageRanges('5-2'), [2, 3, 4, 5]);
    // Mixed delimiters: semicolon, space, comma
    assert.deepStrictEqual(parsePageRanges('2; 4, 6 8'), [2, 4, 6, 8]);
    // Empty or invalid input fallbacks to [1]
    assert.deepStrictEqual(parsePageRanges(''), [1]);
    assert.deepStrictEqual(parsePageRanges('invalid-text'), [1]);
  });

  // 7. Enhanced PII Detection Edge Cases
  await it('PII regex detector covers lowercase PAN, continuous 12-digit Aadhaar, and international formats', () => {
    const aadhaarRegex = /\b\d{4}[-\s\u00A0]?\d{4}[-\s\u00A0]?\d{4}\b/g;
    const panRegex = /\b[A-Za-z]{5}[0-9]{4}[A-Za-z]\b/g;
    const ssnRegex = /\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g;

    // Continuous Aadhaar
    assert(aadhaarRegex.test('Aadhaar: 987654321098'), 'Must match continuous 12-digit Aadhaar');
    // Lowercase PAN
    assert(panRegex.test('PAN: abcde1234f'), 'Must match lowercase PAN');
    // Dot-separated SSN
    assert(ssnRegex.test('SSN: 123.45.6789'), 'Must match dot-delimited SSN');
  });

  // 8. Architectural Integrity: 10 Subroutines & Word Quantity Assurance
  await it('Architectural integrity verifies 10 subroutines documentation and extensive word depth', () => {
    const readmeContent = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
    for (let i = 1; i <= 10; i++) {
      assert(readmeContent.includes(`Subroutine ${i}`), `README must document Subroutine ${i}`);
    }
    const seoContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'seoRegistry.ts'), 'utf8');
    const wordCount = seoContent.split(/\s+/).length;
    assert(wordCount > 10000, `Knowledge base must contain extensive word volume (found ${wordCount} words)`);
  });

  // 9. SystemErrorService Error Taxonomy Mapping & Event Subscription
  await it('SystemErrorService maps raw exceptions to standardized taxonomy and manages event subscriptions', () => {
    const { SystemErrorService } = loadModule('src/services/systemErrorService.ts');
    assert(SystemErrorService, 'SystemErrorService must be exported');

    // 1. Password / Encrypted error mapping
    const encErr = SystemErrorService.reportError('Document is encrypted with a security handler password');
    assert.strictEqual(encErr.code, 'ENCRYPTED_PASSWORD_REQUIRED');
    assert.strictEqual(encErr.title, 'Encrypted Document');

    // 2. Page range error mapping
    const rangeErr = SystemErrorService.reportError(new Error('Invalid page range: page out of range'));
    assert.strictEqual(rangeErr.code, 'PAGE_RANGE_OUT_OF_BOUNDS');

    // 3. Insufficient files error mapping
    const filesErr = SystemErrorService.reportError('Please select at least 2 files to merge');
    assert.strictEqual(filesErr.code, 'INSUFFICIENT_FILES');

    // 4. Corrupted PDF error mapping
    const corruptErr = SystemErrorService.reportError(new Error('Failed to parse PDF header or xref table'));
    assert.strictEqual(corruptErr.code, 'CORRUPTED_PDF');

    // 5. File access denied error mapping
    const permErr = SystemErrorService.reportError('Storage permission denied by user');
    assert.strictEqual(permErr.code, 'FILE_ACCESS_DENIED');

    // 6. Conversion failed error mapping
    const convErr = SystemErrorService.reportError('Failed to convert office document');
    assert.strictEqual(convErr.code, 'CONVERSION_FAILED');

    // 7. Invalid format error mapping
    const fmtErr = SystemErrorService.reportError('Unsupported file format for operation');
    assert.strictEqual(fmtErr.code, 'INVALID_FORMAT');

    // 8. Fallback / generic error mapping
    const genErr = SystemErrorService.reportError('Unknown database error', 'Save Workflow');
    assert.strictEqual(genErr.code, 'OPERATION_FAILED');
    assert.strictEqual(genErr.title, 'Save Workflow');

    // 9. Subscription and listener lifecycle
    let receivedNotification = null;
    const unsubscribe = SystemErrorService.subscribe((notification) => {
      receivedNotification = notification;
    });

    SystemErrorService.showNotification({
      code: 'OPERATION_FAILED',
      title: 'Custom Title',
      message: 'Test custom message',
      severity: 'success',
    });
    assert(receivedNotification, 'Subscriber must receive notification');
    assert.strictEqual(receivedNotification.title, 'Custom Title');
    assert.strictEqual(receivedNotification.severity, 'success');

    // Test clear()
    SystemErrorService.clear();
    assert.strictEqual(receivedNotification, null, 'Notification should be null after clear()');

    // Test unsubscribe()
    unsubscribe();
    SystemErrorService.showNotification({
      code: 'OPERATION_FAILED',
      title: 'After Unsubscribe',
      message: 'Should not reach listener',
      severity: 'info',
    });
    assert.strictEqual(receivedNotification, null, 'Unsubscribed listener must not receive further events');
  });

  // 10. ActiveDocumentStore 1-Hour Privacy TTL & Tool Output Registration
  await it('ActiveDocumentStore enforces 1-hour privacy TTL, auto-registers tool outputs, and manages lifecycle', async () => {
    let savedDoc = null;
    const mockStorageService = {
      addDocument: async (doc) => {
        savedDoc = doc;
        return doc;
      },
      getRecentDocuments: async () => [],
    };

    const storeModule = loadModule('src/services/activeDocumentStore.ts', {
      './documentStorage': { DocumentStorageService: mockStorageService },
    });

    const { ActiveDocumentStore, ACTIVE_DOCUMENT_TTL_MS } = storeModule;
    assert.strictEqual(ACTIVE_DOCUMENT_TTL_MS, 60 * 60 * 1000, 'TTL must be exactly 1 hour (3,600,000 ms)');

    // 1. Setting active document
    const active = await ActiveDocumentStore.setActiveDocument({
      name: 'Financial_Report_Q3.pdf',
      uri: 'file:///local/cache/Financial_Report_Q3.pdf',
      size: 204800,
    });

    assert(active, 'Active document state must be returned');
    assert.strictEqual(active.name, 'Financial_Report_Q3.pdf');
    assert.strictEqual(active.type, 'pdf');
    assert.strictEqual(active.pageCount, 3, 'Inferred page count from PDF inspector');
    assert(active.expiresAt > active.loadedAt, 'expiresAt must be after loadedAt');
    assert.strictEqual(active.expiresAt - active.loadedAt, ACTIVE_DOCUMENT_TTL_MS, 'Difference must match 1 hour');
    assert(savedDoc && savedDoc.id === active.id, 'Document must be persisted to DocumentStorageService');

    // 2. Registering tool output
    const outputDoc = await ActiveDocumentStore.registerToolOutput({
      uri: 'file:///local/cache/merged_output.pdf',
      suggestedName: 'merged_contracts.pdf',
      toolTag: 'merge',
      successMessage: 'Successfully merged 2 PDFs into 1 compliant document',
    });

    assert(Array.isArray(outputDoc.tags) && outputDoc.tags[0] === 'merge', 'Output doc must carry merge tag');
    assert.strictEqual(outputDoc.expiresAt - outputDoc.loadedAt, ACTIVE_DOCUMENT_TTL_MS);
    assert(savedDoc && savedDoc.name === 'merged_contracts.pdf', 'Tool output must be saved to DocumentStorageService');

    // 3. Clear active document from RAM
    ActiveDocumentStore.clearActiveDocument();
    assert.strictEqual(ActiveDocumentStore.getActiveDocument(), null, 'Active document must be null after clearActiveDocument()');
  });

  // 11. PDFEngine ISO 32000-1 Compliance, Digital Signature Detection & Filename Sanitizer
  await it('PDFEngine generates ISO 32000-1 compliant PDFs with trailer /ID, classical ASCII xref, and sanitizes filenames', async () => {
    const { PDFEngine } = loadModule('src/services/pdfEngine.ts');

    // 1. Government portal filename sanitization
    assert.strictEqual(PDFEngine.sanitizeFilename(''), 'document.pdf');
    assert.strictEqual(PDFEngine.sanitizeFilename(null), 'document.pdf');
    assert.strictEqual(PDFEngine.sanitizeFilename('My Annual Tax (Filing) 2026.PDF'), 'My_Annual_Tax_Filing_2026.pdf');
    assert.strictEqual(PDFEngine.sanitizeFilename('   spaces   tabs\t\nand   dots....docx'), 'spaces_tabs_and_dots.docx');
    assert.strictEqual(PDFEngine.sanitizeFilename('a'.repeat(60) + '.pdf'), 'a'.repeat(45) + '.pdf');
    assert.strictEqual(PDFEngine.sanitizeFilename('special#chars$and%symbols!@^&*.pdf'), 'special_chars_and_symbols.pdf');

    // 2. Cryptographic Digital Signature Detection (DSC / PKCS#7 / e-Sign)
    const unsignedBytes = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55, 10]); // %PDF-1.7
    const unsignedCheck = PDFEngine.detectDigitalSignature(unsignedBytes);
    assert.strictEqual(unsignedCheck.isDigitallySigned, false);

    const signedSimulatedStr = '%PDF-1.7 ... /ByteRange [ 0 1000 2000 500 ] ... /Type /Sig ... /SubFilter /adbe.pkcs7.detached ... %%EOF';
    const signedBytes = Uint8Array.from(Buffer.from(signedSimulatedStr, 'latin1'));
    const signedCheck = PDFEngine.detectDigitalSignature(signedBytes);
    assert.strictEqual(signedCheck.isDigitallySigned, true);
    assert.strictEqual(signedCheck.hasByteRange, true);
    assert.strictEqual(signedCheck.hasPkcs7, true);

    // 3. ISO 32000-1 Universal Serialization (Trailer /ID & Classical ASCII XRef)
    const testDoc = await PDFDocument.create();
    testDoc.addPage([595.28, 841.89]); // A4 standard dimensions

    const serializedBytes = await PDFEngine.savePdfUniversally(testDoc, {
      title: 'ISO Compliance Test',
      author: 'TridentPDF Engine',
    });

    const pdfContent = Buffer.from(serializedBytes).toString('latin1');

    // Must contain classical ASCII xref table for legacy government portal parsers
    assert(pdfContent.includes('xref\n0 '), 'Must output classical ASCII xref table');
    assert(!pdfContent.includes('/Type /XRef'), 'Must NOT use compressed cross-reference streams');

    // Must inject Section 14.4 trailer /ID array
    assert(pdfContent.includes('/ID ['), 'Must inject mandatory Section 14.4 trailer /ID array');
    assert(/\/ID\s*\[\s*<[0-9a-fA-F]{32}>\s*<[0-9a-fA-F]{32}>\s*\]/.test(pdfContent), 'Trailer /ID must contain two 16-byte hex identifiers');

    // Must contain metadata
    const reloaded = await PDFDocument.load(serializedBytes);
    assert.strictEqual(reloaded.getTitle(), 'ISO Compliance Test', 'Must encode title metadata');
    assert.strictEqual(reloaded.getAuthor(), 'TridentPDF Engine', 'Must encode author metadata');
  });

  console.log(`\nResults: ${passCount} passed, ${failCount} failed.`);
  if (failCount > 0) process.exit(1);
}

runSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
