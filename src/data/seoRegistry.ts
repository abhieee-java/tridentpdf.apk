import { AppTool } from '../types';

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface GeoAnswerData {
  whatIsIt: string;
  whatItDoes: string;
  howItWorks: string;
  supportedFormats: string;
  howToUseSteps: string[];
  isFreeAndPrivate: string;
  whatHappensToFiles: string;
  outputGenerated: string;
}

export interface SeoPageConfig {
  path: string;
  toolId: AppTool;
  title: string;
  metaDescription: string;
  h1Title: string;
  subtitle: string;
  categoryName: string;
  targetFormat?: string;
  geoAnswer: GeoAnswerData;
  faqs: SeoFaqItem[];
  relatedToolIds: AppTool[];
  keywords: string[];
}

export const BRAND_ENTITY = {
  name: 'TridentPDF',
  publisher: 'Abhijit Kalita Technologies',
  websiteUrl: 'https://tridentpdf.vercel.app',
  logoUrl: 'https://tridentpdf.vercel.app/assets/logo.png',
  contactEmail: 'ad4064773@gmail.com',
  description: 'Complete, private, browser-based PDF utility suite with zero server uploads and DPDP Act 2023 compliance.',
};

export const SEO_PAGES_REGISTRY: Record<string, SeoPageConfig> = {
  '/': {
    path: '/',
    toolId: 'home',
    title: 'TridentPDF - Complete Private PDF Toolkit in Your Browser',
    metaDescription: '100% free, private browser PDF tools. Split, merge, compress, convert PDF to Word, Excel, PPT, JPG, sign, OCR & edit with zero server uploads.',
    h1Title: 'Complete Private PDF Studio in Your Browser',
    subtitle: 'Fast, secure, 100% client-side PDF utility suite powered by WebAssembly & local PDF rendering.',
    categoryName: 'Core PDF Suite',
    geoAnswer: {
      whatIsIt: 'TridentPDF is a browser-based PDF processing platform providing 24+ document tools.',
      whatItDoes: 'It converts, splits, merges, compresses, signs, edits, redacts, and extracts content from PDF documents.',
      howItWorks: 'All PDF rendering and byte manipulation execute entirely inside your local browser using client-side JavaScript, WebAssembly, and PDF.js.',
      supportedFormats: 'PDF, DOCX, XLSX, PPTX, JPG, PNG, WEBP, TIFF, BMP, TXT, CSV, HTML, Markdown, JSON, XML, RTF, ODT.',
      howToUseSteps: [
        'Select any PDF tool from the studio dashboard.',
        'Upload or drag-and-drop your PDF document.',
        'Configure your desired settings, page ranges, or conversion options.',
        'Click execute and instantly download your processed output file.'
      ],
      isFreeAndPrivate: 'TridentPDF is 100% free with unlimited usage and zero registration required.',
      whatHappensToFiles: 'Your files never leave your device. All processing happens locally in your browser memory and memory is cleared when closed.',
      outputGenerated: 'High-definition PDF files, office documents, spreadsheets, images, text, and structured data archives.'
    },
    faqs: [
      {
        question: 'Are my PDF files uploaded to a remote server?',
        answer: 'No. Every PDF operation runs 100% locally inside your web browser. Your files are never uploaded to any external server or cloud storage.'
      },
      {
        question: 'Is TridentPDF free to use without limits?',
        answer: 'Yes. All 24 tools including PDF to Word, Merger, Splitter, Compressor, OCR, and Batch Signer are completely free with no daily limits.'
      },
      {
        question: 'Does it comply with the Indian DPDP Act 2023?',
        answer: 'Yes. Because zero personal data or document content is collected or transmitted, it strictly complies with the Digital Personal Data Protection Act, 2023.'
      }
    ],
    relatedToolIds: ['split', 'merge', 'compress', 'convert', 'sign-fill', 'ocr'],
    keywords: ['pdf studio', 'pdf tools', 'private pdf converter', 'pdf splitter', 'merge pdf', 'compress pdf', 'pdf to word']
  },

  '/pdf-to-word': {
    path: '/pdf-to-word',
    toolId: 'convert',
    targetFormat: 'word',
    title: 'Convert PDF to Word Online (DOCX) - 100% Free & Private',
    metaDescription: 'Convert PDF files to editable Microsoft Word documents (.docx) with preserved typography, formatting, tables, and images directly in your browser.',
    h1Title: 'Convert PDF to Editable Word Document (DOCX)',
    subtitle: 'Transform fixed PDF pages into fully editable Word documents without quality loss or server uploads.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to Word Converter is a browser-based utility that transforms PDF documents into editable Microsoft Word (.docx) files.',
      whatItDoes: 'Extracts formatted text, paragraph flows, tables, lists, and embedded images from PDF pages and reconstructs them into OpenXML Word format.',
      howItWorks: 'Parses the PDF vector page trees client-side and packages extracted layout nodes into standard DOCX binary structure.',
      supportedFormats: 'Input: PDF (.pdf) → Output: Microsoft Word (.docx).',
      howToUseSteps: [
        'Upload your PDF document to the converter.',
        'Select "Word Document (.docx)" as the target format.',
        'Click "Convert PDF Now" to begin instant processing.',
        'Download your editable Word document.'
      ],
      isFreeAndPrivate: 'Yes, 100% free, private, and unlimited.',
      whatHappensToFiles: 'Files are processed in local browser memory and never uploaded anywhere.',
      outputGenerated: 'Fully editable Microsoft Word document (.docx).'
    },
    faqs: [
      {
        question: 'Will my converted Word document keep its original formatting?',
        answer: 'Yes. The converter extracts paragraph styles, font hierarchies, tables, and image layouts to preserve the look of your original PDF.'
      },
      {
        question: 'Can I convert scanned PDFs to Word?',
        answer: 'Yes. If a PDF contains scanned images, the built-in OCR engine recognizes text characters before formatting the Word document.'
      }
    ],
    relatedToolIds: ['convert', 'ocr', 'extract', 'ai-extract', 'edit'],
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf converter word', 'editable word from pdf', 'pdf to docx online']
  },

  '/pdf-to-excel': {
    path: '/pdf-to-excel',
    toolId: 'convert',
    targetFormat: 'excel',
    title: 'Convert PDF to Excel Spreadsheet (XLSX) - Free & Private',
    metaDescription: 'Extract tables and grid data from PDF into editable Excel spreadsheets (.xlsx) with grid detection and automatic numeric column alignment.',
    h1Title: 'Convert PDF Tables to Editable Excel Spreadsheet (XLSX)',
    subtitle: 'Extract complex financial tables, statements, and grids from PDF to structured Excel workbooks.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to Excel Converter turns tabular PDF data into editable XLSX spreadsheet workbooks.',
      whatItDoes: 'Identifies table boundaries, row delimiters, and cell columns in PDF pages and formats them into Excel worksheets.',
      howItWorks: 'Scans vector text bounding boxes to reconstruct structured matrix rows and columns client-side.',
      supportedFormats: 'Input: PDF (.pdf) → Output: Microsoft Excel (.xlsx).',
      howToUseSteps: [
        'Select your PDF containing tabular data.',
        'Choose "Excel Spreadsheet (.xlsx)".',
        'Click "Convert PDF Now".',
        'Download the converted Excel workbook.'
      ],
      isFreeAndPrivate: '100% free and private with zero server uploads.',
      whatHappensToFiles: 'Processed entirely inside your web browser.',
      outputGenerated: 'Microsoft Excel XLSX spreadsheet file.'
    },
    faqs: [
      {
        question: 'Does this tool extract financial statements and invoices accurately?',
        answer: 'Yes. The engine uses coordinate alignment to detect columns and numerical cells cleanly.'
      }
    ],
    relatedToolIds: ['convert', 'ai-extract', 'extract', 'edit'],
    keywords: ['pdf to excel', 'pdf to xlsx', 'extract tables from pdf', 'pdf table to spreadsheet']
  },

  '/pdf-to-jpg': {
    path: '/pdf-to-jpg',
    toolId: 'convert',
    targetFormat: 'jpg',
    title: 'Convert PDF to JPG Images - High Resolution & Free',
    metaDescription: 'Convert PDF pages into high-resolution JPG image files (72, 150, 300 DPI) or single ZIP image archives directly in your browser.',
    h1Title: 'Convert PDF Pages to JPG Images',
    subtitle: 'Render PDF pages into crisp, high-resolution JPG images with adjustable DPI and instant ZIP download.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to JPG Converter renders vector PDF pages into high-definition JPEG images.',
      whatItDoes: 'Generates standalone image files for every page of a PDF document at custom DPI settings.',
      howItWorks: 'Uses HTML5 canvas rasterization powered by PDF.js to render page viewports directly to image data URLs.',
      supportedFormats: 'Input: PDF (.pdf) → Output: JPG / JPEG (.jpg).',
      howToUseSteps: [
        'Upload your PDF file.',
        'Select "JPG Image" and pick desired resolution (72, 150, or 300 DPI).',
        'Click "Convert PDF Now".',
        'Download individual JPGs or a single bundled ZIP archive.'
      ],
      isFreeAndPrivate: '100% free and client-side private.',
      whatHappensToFiles: 'Files stay strictly on your device.',
      outputGenerated: 'High-resolution JPG image files or ZIP archive.'
    },
    faqs: [
      {
        question: 'Can I choose the resolution (DPI) of the JPG images?',
        answer: 'Yes. You can select standard 72 DPI, crisp 150 DPI, or ultra high-resolution 300 DPI.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'crop', 'watermark'],
    keywords: ['pdf to jpg', 'pdf to jpeg', 'save pdf as jpg', 'convert pdf to image']
  },

  '/pdf-to-png': {
    path: '/pdf-to-png',
    toolId: 'convert',
    targetFormat: 'png',
    title: 'Convert PDF to PNG Images - Transparent Background & Free',
    metaDescription: 'Convert PDF pages to lossless PNG image files with crisp text, sharp graphics, and zero pixel distortion.',
    h1Title: 'Convert PDF Pages to Lossless PNG Images',
    subtitle: 'Export PDF documents to pixel-perfect PNG images for presentations, design, and documents.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to PNG Converter exports PDF document pages into lossless PNG graphics.',
      whatItDoes: 'Renders every page of a PDF with high clarity and lossless compression.',
      howItWorks: 'Rasterizes page viewports onto HTML5 canvases and encodes lossless PNG data.',
      supportedFormats: 'Input: PDF (.pdf) → Output: Portable Network Graphics (.png).',
      howToUseSteps: [
        'Upload your PDF file.',
        'Select "PNG Image".',
        'Click "Convert PDF Now".',
        'Download PNG image files or ZIP archive.'
      ],
      isFreeAndPrivate: 'Free and private in browser.',
      whatHappensToFiles: 'No file is uploaded to any server.',
      outputGenerated: 'Lossless PNG images or ZIP archive.'
    },
    faqs: [
      {
        question: 'Is PNG better than JPG for text-heavy documents?',
        answer: 'Yes. PNG uses lossless compression which keeps text and vector diagrams exceptionally sharp without JPG artifacts.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'crop'],
    keywords: ['pdf to png', 'convert pdf to png', 'export pdf as png']
  },

  '/pdf-to-text': {
    path: '/pdf-to-text',
    toolId: 'convert',
    targetFormat: 'txt',
    title: 'Convert PDF to Plain Text (.txt) - Free & Fast Text Extractor',
    metaDescription: 'Extract raw text content from PDF files into plain text files (.txt) cleanly formatted with preserved line breaks.',
    h1Title: 'Convert PDF to Plain Text File (.txt)',
    subtitle: 'Extract clean readable text content from any PDF document in seconds.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to Text Converter extracts unformatted text content from PDF documents into TXT files.',
      whatItDoes: 'Strips formatting and retains raw words, paragraphs, and reading order.',
      howItWorks: 'Extracts string item streams from PDF text object trees client-side.',
      supportedFormats: 'Input: PDF → Output: TXT (.txt).',
      howToUseSteps: ['Upload PDF', 'Select Plain Text (.txt)', 'Click Convert', 'Download TXT file'],
      isFreeAndPrivate: '100% free and local.',
      whatHappensToFiles: 'Kept completely in local memory.',
      outputGenerated: 'Plain Text (.txt) document.'
    },
    faqs: [
      {
        question: 'Does this work on scanned PDFs?',
        answer: 'For scanned PDFs, use our OCR PDF tool which detects characters from image pixels.'
      }
    ],
    relatedToolIds: ['ocr', 'convert', 'extract'],
    keywords: ['pdf to text', 'pdf to txt', 'extract text from pdf', 'convert pdf to txt']
  },

  '/split-pdf': {
    path: '/split-pdf',
    toolId: 'split',
    title: 'Split PDF Online - Cut & Separate Pages into Parts (Free)',
    metaDescription: 'Split PDF into N equal parts, custom page ranges, or single-page files with visual page thumbnails and live preview.',
    h1Title: 'Split PDF Pages & Separate Documents',
    subtitle: 'Divide large PDF files into equal parts, specific page ranges, or separate single pages effortlessly.',
    categoryName: 'Core & Split',
    geoAnswer: {
      whatIsIt: 'PDF Splitter divides a multi-page PDF document into smaller individual files or page ranges.',
      whatItDoes: 'Extracts selected page ranges or divides a document into 2, 3, or N equal parts.',
      howItWorks: 'Creates new PDF page trees in memory using PDF-Lib vector copying.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: [
        'Upload your PDF file.',
        'Choose split mode: N Equal Parts, Specific Ranges (e.g. 1-3, 5, 8-10), or All Single Pages.',
        'Click "Split PDF Now".',
        'Download your split PDF files or ZIP bundle.'
      ],
      isFreeAndPrivate: '100% free and browser-private.',
      whatHappensToFiles: 'Files remain strictly on your local computer.',
      outputGenerated: 'One or multiple split PDF files.'
    },
    faqs: [
      {
        question: 'Can I split a 100-page PDF into 10 equal 10-page parts?',
        answer: 'Yes. Select "N Equal Parts" mode and set N to 10. The splitter automatically calculates boundaries.'
      }
    ],
    relatedToolIds: ['merge', 'organize', 'compress', 'crop'],
    keywords: ['split pdf', 'separate pdf pages', 'cut pdf', 'divide pdf into parts']
  },

  '/merge-pdf': {
    path: '/merge-pdf',
    toolId: 'merge',
    title: 'Merge PDF Files Online - Combine PDFs into One Document',
    metaDescription: 'Combine multiple PDF files into one single PDF document with custom page reordering, drag-and-drop, and instant merging.',
    h1Title: 'Combine Multiple PDFs into One Document',
    subtitle: 'Stitch together separate PDF documents with visual reordering and fast client-side merging.',
    categoryName: 'Core & Split',
    geoAnswer: {
      whatIsIt: 'PDF Merger combines multiple separate PDF documents into a unified file.',
      whatItDoes: 'Appends page objects from multiple files into a single structured document.',
      howItWorks: 'Copies page catalogues client-side using WebAssembly PDF engines.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: [
        'Select two or more PDF files.',
        'Drag and drop files into your preferred order.',
        'Click "Merge PDFs".',
        'Download your combined PDF document.'
      ],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed locally in memory.',
      outputGenerated: 'Single merged PDF file.'
    },
    faqs: [
      {
        question: 'Is there a limit on how many PDFs I can merge?',
        answer: 'No artificial limit. You can merge as many files as your device memory allows.'
      }
    ],
    relatedToolIds: ['split', 'organize', 'compress'],
    keywords: ['merge pdf', 'combine pdfs', 'join pdf files', 'stitch pdfs']
  },

  '/compress-pdf': {
    path: '/compress-pdf',
    toolId: 'compress',
    title: 'Compress PDF Online - Reduce PDF File Size (Free)',
    metaDescription: 'Shrink PDF file size with extreme, recommended, or high-quality presets while preserving sharp text and clear visuals.',
    h1Title: 'Compress PDF & Reduce File Size',
    subtitle: 'Optimize PDF files for email attachments and web upload with fast browser compression.',
    categoryName: 'Core & Split',
    geoAnswer: {
      whatIsIt: 'PDF Compressor reduces the byte size of PDF documents.',
      whatItDoes: 'Optimizes embedded fonts, re-compresses images, and strips redundant stream objects.',
      howItWorks: 'Re-encodes image streams and cleans unreferenced PDF object blocks in browser memory.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: [
        'Upload your oversized PDF file.',
        'Select compression preset: Recommended, Extreme, or Less Compression.',
        'Click "Compress PDF".',
        'Download your compressed PDF.'
      ],
      isFreeAndPrivate: 'Free and private.',
      whatHappensToFiles: 'Files stay locally on your machine.',
      outputGenerated: 'Optimized PDF with smaller file size.'
    },
    faqs: [
      {
        question: 'Will compressing my PDF ruin the text quality?',
        answer: 'No. Vector text remains 100% crisp and readable at any zoom level.'
      }
    ],
    relatedToolIds: ['split', 'merge', 'organize'],
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf file', 'small pdf']
  },

  '/pdf-ocr': {
    path: '/pdf-ocr',
    toolId: 'ocr',
    title: 'OCR PDF Online - Extract & Recognize Text from Scanned PDFs',
    metaDescription: 'Make scanned PDF documents searchable and copyable using Tesseract OCR. Recognize text characters in 100+ languages.',
    h1Title: 'OCR PDF: Recognize Text in Scanned Documents',
    subtitle: 'Turn scanned paper PDFs and images into searchable, selectable text using AI optical character recognition.',
    categoryName: 'Extract & OCR',
    geoAnswer: {
      whatIsIt: 'PDF OCR Tool performs Optical Character Recognition on scanned PDF documents.',
      whatItDoes: 'Detects text characters inside images and embeds invisible vector text overlays.',
      howItWorks: 'Uses Tesseract.js WebAssembly OCR engine running inside your browser.',
      supportedFormats: 'PDF, JPG, PNG, WEBP, TIFF.',
      howToUseSteps: [
        'Upload your scanned PDF document.',
        'Select document language (English, Spanish, French, German, Hindi, etc.).',
        'Click "Run OCR Engine".',
        'Download your searchable PDF or copy extracted text.'
      ],
      isFreeAndPrivate: '100% free and client-side private.',
      whatHappensToFiles: 'Tesseract runs locally in browser memory without sending data to servers.',
      outputGenerated: 'Searchable PDF file or plain text extract.'
    },
    faqs: [
      {
        question: 'Does OCR require uploading files to cloud servers?',
        answer: 'No. Our Tesseract OCR engine runs entirely client-side inside your browser via WebAssembly.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'ai-summarize'],
    keywords: ['ocr pdf', 'optical character recognition', 'make pdf searchable', 'scanned pdf to text']
  },

  '/batch-sign-pdf': {
    path: '/batch-sign-pdf',
    toolId: 'sign',
    title: 'Batch Sign PDF Online - 1-Tap Stamp Signature All Pages',
    metaDescription: 'Stamp your digital signature, date, or seal across all pages of a PDF document at exact coordinates with 1-tap synchronization.',
    h1Title: 'Batch Stamp Signatures Across All PDF Pages',
    subtitle: 'Apply signatures, date stamps, and initials across multi-page contracts in seconds.',
    categoryName: 'Sign & Forms',
    geoAnswer: {
      whatIsIt: 'Batch Document Signer places signature stamps across all or selected pages of a PDF simultaneously.',
      whatItDoes: 'Synchronizes signature placement coordinates, opacity, rotation, and date stamps.',
      howItWorks: 'Embeds PNG vector signature drawings onto PDF page viewports in vector memory.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: [
        'Upload contract or document.',
        'Draw or type your signature.',
        'Position signature on Page 1 margin.',
        'Click "Stamp All Pages" to replicate instantly.'
      ],
      isFreeAndPrivate: '100% free and legal.',
      whatHappensToFiles: 'Signatures and documents remain private on your computer.',
      outputGenerated: 'Signed PDF document.'
    },
    faqs: [
      {
        question: 'Can I include a digital date stamp next to my signature?',
        answer: 'Yes. Toggle "Include Date Stamp" to automatically add today’s date alongside your signature.'
      }
    ],
    relatedToolIds: ['sign-fill', 'forms', 'edit'],
    keywords: ['batch sign pdf', 'sign all pages pdf', 'stamp signature pdf', 'digital contract signer']
  },

  '/sign-and-fill-pdf': {
    path: '/sign-and-fill-pdf',
    toolId: 'sign-fill',
    title: 'Sign & Fill PDF Studio - Free Online PDF Form Filler',
    metaDescription: 'Interactive canvas to add signatures, freeform text fields, date stamps, checkboxes, and initials onto any PDF document.',
    h1Title: 'Interactive Sign & Fill Studio for PDFs',
    subtitle: 'Fill out non-interactive PDFs, add text notes, draw signatures, and place checkboxes on any document.',
    categoryName: 'Sign & Forms',
    geoAnswer: {
      whatIsIt: 'Sign & Fill Studio is an interactive visual editor for adding annotations, signatures, and text to PDFs.',
      whatItDoes: 'Places drag-and-drop text labels, checkmarks, signatures, and date stamps.',
      howItWorks: 'Renders an interactive canvas overlay over PDF pages to burn annotations directly into the output bytes.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: [
        'Upload your form or PDF.',
        'Click anywhere on the document to add text, checkmarks, or signatures.',
        'Adjust size and position.',
        'Click "Download Filled PDF".'
      ],
      isFreeAndPrivate: '100% free and browser-private.',
      whatHappensToFiles: 'Processed 100% locally.',
      outputGenerated: 'Filled and signed PDF.'
    },
    faqs: [
      {
        question: 'Can I fill out forms that are not interactive AcroForms?',
        answer: 'Yes! Our visual canvas allows you to click and type anywhere on flat PDF pages.'
      }
    ],
    relatedToolIds: ['sign', 'forms', 'edit'],
    keywords: ['sign and fill pdf', 'fill out pdf', 'draw signature on pdf', 'free pdf form filler']
  },

  '/camera-pdf-scanner': {
    path: '/camera-pdf-scanner',
    toolId: 'scanner',
    title: 'Camera PDF Scanner - Scan Documents with Phone/Webcam',
    metaDescription: 'Scan physical paper documents, receipts, and IDs into high-quality PDFs using your phone or webcam with auto-crop and perspective enhancement.',
    h1Title: 'Camera PDF Scanner & Paper Digitizer',
    subtitle: 'Turn your camera into a professional document scanner with auto-edge detection and perspective correction.',
    categoryName: 'Convert & Scan',
    geoAnswer: {
      whatIsIt: 'Camera PDF Scanner is a hardware camera utility that captures paper documents and turns them into PDFs.',
      whatItDoes: 'Captures camera frames, detects paper boundaries, enhances contrast, and creates multi-page PDFs.',
      howItWorks: 'Uses HTML5 MediaDevices API and OpenCV image processing in browser.',
      supportedFormats: 'Camera input → PDF output.',
      howToUseSteps: [
        'Grant camera permission.',
        'Snap pictures of your paper pages.',
        'Apply enhancement filters (B&W, Grayscale, Color).',
        'Export as PDF.'
      ],
      isFreeAndPrivate: '100% free and hardware local.',
      whatHappensToFiles: 'Camera feeds are never streamed or saved on remote servers.',
      outputGenerated: 'Clean digitized PDF document.'
    },
    faqs: [
      {
        question: 'Does this require downloading a mobile app?',
        answer: 'No! It runs directly inside your web browser on any mobile phone, tablet, or desktop camera.'
      }
    ],
    relatedToolIds: ['ocr', 'convert', 'compress'],
    keywords: ['camera pdf scanner', 'camscanner online', 'scan paper to pdf', 'webcam document scanner']
  },

  '/webpage-to-pdf': {
    path: '/webpage-to-pdf',
    toolId: 'webpage-pdf',
    title: 'Webpage to PDF & Full Page Screenshot Converter',
    metaDescription: 'Convert any public web page URL into a formatted PDF document or full-page browser screenshot image.',
    h1Title: 'Convert Webpages & URLs to PDF or Screenshot',
    subtitle: 'Save online articles, documentation, and websites into clean PDF files or full-page PNG images.',
    categoryName: 'Convert & Scan',
    geoAnswer: {
      whatIsIt: 'Webpage to PDF Converter captures web page URLs and converts them into PDF documents.',
      whatItDoes: 'Fetches HTML layouts and renders formatted PDF documents or full-page screenshots.',
      howItWorks: 'Utilizes DOM rendering engines to output standard PDF pages.',
      supportedFormats: 'URL → PDF / PNG.',
      howToUseSteps: ['Paste website URL', 'Choose PDF or PNG Screenshot', 'Click Convert', 'Download output'],
      isFreeAndPrivate: '100% free.',
      whatHappensToFiles: 'Generates output directly for download.',
      outputGenerated: 'PDF document or full-length PNG image.'
    },
    faqs: [
      {
        question: 'Can I capture entire long articles in a single screenshot?',
        answer: 'Yes. Select "Full Page Screenshot" mode to capture the entire scrollable height.'
      }
    ],
    relatedToolIds: ['convert', 'extract'],
    keywords: ['webpage to pdf', 'url to pdf', 'convert website to pdf', 'full page screenshot']
  },

  '/password-protect-pdf': {
    path: '/password-protect-pdf',
    toolId: 'security',
    title: 'Password Protect & Encrypt PDF Online - 256-bit AES',
    metaDescription: 'Secure your PDF documents with strong 128-bit or 256-bit AES password encryption and custom permission controls.',
    h1Title: 'Password Protect & Encrypt PDF Documents',
    subtitle: 'Lock confidential PDFs with strong military-grade encryption and access permissions.',
    categoryName: 'Security & Redact',
    geoAnswer: {
      whatIsIt: 'PDF Security tool encrypts PDF files with password protection.',
      whatItDoes: 'Prevents unauthorized viewing, printing, editing, or copying of PDF content.',
      howItWorks: 'Applies standard PDF security handler encryption algorithms in browser memory.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Set secure password', 'Choose permissions', 'Download encrypted PDF'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Files stay locally on your machine.',
      outputGenerated: 'Encrypted password-protected PDF.'
    },
    faqs: [
      {
        question: 'What encryption standard is used?',
        answer: 'We support standard 128-bit AES and 256-bit AES encryption algorithms.'
      }
    ],
    relatedToolIds: ['redact', 'watermark', 'metadata'],
    keywords: ['password protect pdf', 'encrypt pdf', 'lock pdf', 'pdf security password']
  },

  '/redact-pdf': {
    path: '/redact-pdf',
    toolId: 'redact',
    title: 'Redact PDF Online - Permanently Blackout & Sanitize Sensitive Text',
    metaDescription: 'Permanently remove and blackout sensitive information, SSNs, credit cards, and confidential text from PDF documents.',
    h1Title: 'Permanently Redact & Blackout Sensitive PDF Data',
    subtitle: 'Erase confidential text and PII permanently from PDF vectors so it can never be recovered.',
    categoryName: 'Security & Redact',
    geoAnswer: {
      whatIsIt: 'PDF Redaction tool permanently deletes specified text and regions from PDF documents.',
      whatItDoes: 'Strips underlying vector text streams and draws opaque blackout boxes.',
      howItWorks: 'Removes text objects from PDF page trees rather than just placing a black box on top.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Select text or draw rectangles over sensitive areas', 'Apply Redaction', 'Download sanitized PDF'],
      isFreeAndPrivate: '100% free and secure.',
      whatHappensToFiles: 'Redacted data is permanently erased and unrecoverable.',
      outputGenerated: 'Sanitized PDF document.'
    },
    faqs: [
      {
        question: 'Is redacted text recoverable if someone copies and pastes it?',
        answer: 'No! Our true redaction engine removes the actual underlying text data from the PDF file.'
      }
    ],
    relatedToolIds: ['security', 'ai-redact', 'metadata'],
    keywords: ['redact pdf', 'blackout text pdf', 'remove sensitive data pdf', 'sanitize pdf']
  },

  '/ai-pdf-summarizer': {
    path: '/ai-pdf-summarizer',
    toolId: 'ai-summarize',
    title: 'AI PDF Summarizer - Instant Executive Summaries & Key Points',
    metaDescription: 'Generate instant executive summaries, key takeaways, and structured bullet points from long contracts, research papers, and reports using AI.',
    h1Title: 'AI PDF Summarizer & Key Insight Extractor',
    subtitle: 'Extract key points, action items, and executive summaries from lengthy documents in seconds.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'AI PDF Summarizer is a smart assistant that analyzes document content and generates concise summaries.',
      whatItDoes: 'Identifies primary topics, critical statistics, legal clauses, and key takeaways.',
      howItWorks: 'Extracts document text and processes it via TridentPDF AI document intelligence.',
      supportedFormats: 'PDF, DOCX, TXT.',
      howToUseSteps: ['Upload PDF', 'Click Generate AI Summary', 'Review key takeaways and bullet points'],
      isFreeAndPrivate: 'Free to use.',
      whatHappensToFiles: 'Document text is analyzed securely and never stored.',
      outputGenerated: 'Structured executive summary.'
    },
    faqs: [
      {
        question: 'How long can the PDF document be?',
        answer: 'Our AI summarizer supports documents ranging from single-page memos to multi-hundred page reports.'
      }
    ],
    relatedToolIds: ['ai-chat', 'ocr', 'ai-extract'],
    keywords: ['ai pdf summarizer', 'summarize pdf online', 'pdf summary tool', 'ai contract summary']
  },

  '/ask-ai-pdf': {
    path: '/ask-ai-pdf',
    toolId: 'ai-chat',
    title: 'Ask AI (Chat with PDF) - Interactive Document Q&A Assistant',
    metaDescription: 'Chat interactively with your PDF documents. Ask questions, cross-examine clauses, and find exact page citations instantly.',
    h1Title: 'Chat & Ask Questions to Your PDF Document',
    subtitle: 'Interactive AI copilot that answers questions, finds clauses, and cites page references from your PDF.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'Ask AI PDF is an interactive chat copilot for querying PDF documents in natural language.',
      whatItDoes: 'Answers specific questions, cross-checks information, and provides exact page citations.',
      howItWorks: 'Uses document vector indexing and natural language AI processing.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Type any question about the document', 'Receive instant AI answer with citations'],
      isFreeAndPrivate: 'Free and secure.',
      whatHappensToFiles: 'Files are processed securely for Q&A.',
      outputGenerated: 'Interactive answers with page citations.'
    },
    faqs: [
      {
        question: 'Does the AI provide exact page references?',
        answer: 'Yes. Every response includes page number citations so you can verify source text immediately.'
      }
    ],
    relatedToolIds: ['ai-summarize', 'ocr', 'ai-translate'],
    keywords: ['ask ai pdf', 'chat with pdf', 'pdf qna assistant', 'ai document chat']
  },

  '/compress-jpg': {
    path: '/compress-jpg',
    toolId: 'compress-jpg',
    title: 'Compress JPG Online - Reduce Image File Size (100% Private)',
    metaDescription: 'Reduce JPG and JPEG image file sizes with real client-side JPEG compression, adjustable quality controls, and live side-by-side visual comparison.',
    h1Title: 'Compress JPG & Reduce Image File Size',
    subtitle: 'Shrink JPEG photos and images instantly in your browser with true quality control and zero server uploads.',
    categoryName: 'Convert & Scan',
    geoAnswer: {
      whatIsIt: 'Compress JPG is a client-side image optimization utility.',
      whatItDoes: 'Reduces the file size of JPEG images while preserving visual detail.',
      howItWorks: 'Uses HTML5 Canvas quantization and JPEG encoding locally inside your web browser.',
      supportedFormats: 'JPG, JPEG.',
      howToUseSteps: ['Upload your JPG image', 'Select compression mode (Recommended, High, or Custom quality)', 'Click Download Compressed JPG'],
      isFreeAndPrivate: '100% free and client-side private.',
      whatHappensToFiles: 'Files are processed in browser memory and never uploaded anywhere.',
      outputGenerated: 'Optimized compressed JPG image file.'
    },
    faqs: [
      {
        question: 'Does this compress images without uploading them to a server?',
        answer: 'Yes! The entire JPEG compression engine runs 100% locally in your web browser.'
      }
    ],
    relatedToolIds: ['convert', 'crop', 'watermark'],
    keywords: ['compress jpg', 'compress jpeg', 'reduce image size', 'shrink jpg']
  },

  '/organize-pdf': {
    path: '/organize-pdf',
    toolId: 'organize',
    title: 'Organize PDF Pages Online - Reorder, Rotate & Delete Pages',
    metaDescription: 'Reorder, rotate (90°/180°/270°), duplicate, delete, and rearrange pages in any PDF document with an interactive visual thumbnail grid.',
    h1Title: 'Organize, Rotate & Rearrange PDF Pages',
    subtitle: 'Manage page sequence, rotate misoriented pages, and delete unwanted pages with live visual preview grid.',
    categoryName: 'Organize & Edit',
    geoAnswer: {
      whatIsIt: 'Page Organizer manages page order, rotation, and page removal in PDF documents.',
      whatItDoes: 'Allows drag-and-drop reordering, page deletion, page duplication, and rotation.',
      howItWorks: 'Reconstructs PDF page trees client-side using PDF-Lib vector operations.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Drag pages to reorder, click rotate or delete buttons', 'Click Save & Download'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed locally in browser memory.',
      outputGenerated: 'Organized PDF document.'
    },
    faqs: [
      {
        question: 'Can I rotate individual pages or all pages at once?',
        answer: 'Both! You can rotate individual page thumbnails or apply 90° rotation to every page simultaneously.'
      }
    ],
    relatedToolIds: ['split', 'merge', 'crop', 'edit'],
    keywords: ['organize pdf', 'reorder pdf pages', 'rotate pdf pages', 'delete pdf page']
  },

  '/rotate-pdf': {
    path: '/rotate-pdf',
    toolId: 'organize',
    title: 'Rotate PDF Pages Online - 90° / 180° / 270° Rotation',
    metaDescription: 'Rotate upside-down or landscape PDF pages easily. Apply 90°, 180°, or 270° rotation to individual or all pages.',
    h1Title: 'Rotate PDF Pages Online',
    subtitle: 'Fix orientation of scanned or upside-down PDF pages instantly in your browser.',
    categoryName: 'Organize & Edit',
    geoAnswer: {
      whatIsIt: 'Rotate PDF tool rotates document page orientations.',
      whatItDoes: 'Rotates selected or all pages in 90-degree increments.',
      howItWorks: 'Updates page orientation matrices in memory.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Click rotate on target pages', 'Download rotated PDF'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Kept in local memory.',
      outputGenerated: 'Rotated PDF document.'
    },
    faqs: [
      {
        question: 'Can I save the rotated orientation permanently?',
        answer: 'Yes! The output PDF applies permanent vector rotation.'
      }
    ],
    relatedToolIds: ['organize', 'split', 'crop'],
    keywords: ['rotate pdf', 'turn pdf pages', 'fix upside down pdf']
  },

  '/pdf-converter': {
    path: '/pdf-converter',
    toolId: 'convert',
    title: 'PDF Converter Online - Convert PDF to Word, Excel, Images & More',
    metaDescription: 'Convert PDFs to Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, Text, and convert office documents or images to PDF.',
    h1Title: 'Universal Multi-Format PDF Converter',
    subtitle: 'Convert PDF documents to editable Office formats, high-res images, and data files without server uploads.',
    categoryName: 'Convert & Scan',
    geoAnswer: {
      whatIsIt: 'PDF Converter is a multi-format file conversion engine.',
      whatItDoes: 'Converts PDFs to Word, Excel, PPT, JPG, PNG, TXT, CSV and vice versa.',
      howItWorks: 'Extracts vector trees, text streams, and images to generate native target format structures.',
      supportedFormats: 'PDF, DOCX, XLSX, PPTX, JPG, PNG, WEBP, TXT, CSV, HTML.',
      howToUseSteps: ['Upload file', 'Choose target format', 'Click Convert', 'Download converted output'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Runs locally in browser memory.',
      outputGenerated: 'Converted file in target format.'
    },
    faqs: [
      {
        question: 'Is conversion fast and private?',
        answer: 'Yes! Processing happens instantly inside your browser without uploading files.'
      }
    ],
    relatedToolIds: ['extract', 'ocr', 'edit'],
    keywords: ['pdf converter', 'convert pdf', 'pdf to office', 'convert file to pdf']
  },

  '/edit-pdf': {
    path: '/edit-pdf',
    toolId: 'edit',
    title: 'Edit PDF Online - Add Text, Draw Annotations & Shapes',
    metaDescription: 'Add text notes, draw pencil annotations, highlight key text, insert geometric shapes, callouts, and arrows on any PDF document.',
    h1Title: 'Online PDF Editor & Markup Studio',
    subtitle: 'Annotate, draw, insert text, and highlight PDF documents with intuitive editing controls.',
    categoryName: 'Organize & Edit',
    geoAnswer: {
      whatIsIt: 'PDF Editor is a markup and annotation tool for editing PDF pages.',
      whatItDoes: 'Inserts freeform drawings, highlights, text notes, arrows, and geometric shapes.',
      howItWorks: 'Renders drawing vector overlays onto PDF viewports and flattens them into output bytes.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Select editing tool (Text, Draw, Highlight, Shape)', 'Apply markups', 'Download edited PDF'],
      isFreeAndPrivate: '100% free and local.',
      whatHappensToFiles: 'Stays on your computer.',
      outputGenerated: 'Edited PDF document.'
    },
    faqs: [
      {
        question: 'Can I highlight text and draw callout arrows?',
        answer: 'Yes! The toolbar includes highlighters, arrows, shapes, and freehand drawing pencils.'
      }
    ],
    relatedToolIds: ['organize', 'sign-fill', 'watermark'],
    keywords: ['edit pdf', 'annotate pdf', 'draw on pdf', 'pdf editor online']
  },

  '/ocr-pdf': {
    path: '/ocr-pdf',
    toolId: 'ocr',
    title: 'Free Online OCR Scanner - Make Scanned PDFs Searchable',
    metaDescription: 'Run high-accuracy optical character recognition to detect text in scanned documents and images. 100% private in-browser OCR engine.',
    h1Title: 'Optical Character Recognition Scanner for Scanned PDFs',
    subtitle: 'Turn scanned paper PDFs and images into searchable, selectable text using AI optical character recognition.',
    categoryName: 'Extract & OCR',
    geoAnswer: {
      whatIsIt: 'PDF OCR Tool performs Optical Character Recognition on scanned PDF documents.',
      whatItDoes: 'Detects text characters inside images and embeds invisible vector text overlays.',
      howItWorks: 'Uses Tesseract.js WebAssembly OCR engine running inside your browser.',
      supportedFormats: 'PDF, JPG, PNG, WEBP, TIFF.',
      howToUseSteps: ['Upload scanned PDF', 'Select document language', 'Click Run OCR Engine', 'Download searchable PDF'],
      isFreeAndPrivate: '100% free and client-side private.',
      whatHappensToFiles: 'Runs locally in browser memory without sending data to servers.',
      outputGenerated: 'Searchable PDF file or plain text extract.'
    },
    faqs: [
      {
        question: 'Does OCR require uploading files to cloud servers?',
        answer: 'No. Our Tesseract OCR engine runs entirely client-side inside your browser via WebAssembly.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'ai-summarize'],
    keywords: ['ocr pdf', 'optical character recognition', 'make pdf searchable', 'scanned pdf to text']
  },

  '/pdf-security': {
    path: '/pdf-security',
    toolId: 'security',
    title: 'PDF Security & Password Protection - Encrypt & Unlock PDFs',
    metaDescription: 'Encrypt PDFs with strong password protection, manage permissions, or decrypt and remove known passwords securely.',
    h1Title: 'PDF Security, Encryption & Password Management',
    subtitle: 'Protect sensitive documents with AES encryption or unlock password-protected files.',
    categoryName: 'Security & Redact',
    geoAnswer: {
      whatIsIt: 'PDF Security tool manages PDF encryption and password controls.',
      whatItDoes: 'Encrypts files with passwords or unlocks protected PDFs.',
      howItWorks: 'Uses browser-based cryptographic PDF handlers.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Choose Protect or Unlock mode', 'Enter password', 'Download result'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed locally in browser.',
      outputGenerated: 'Protected or unlocked PDF file.'
    },
    faqs: [
      {
        question: 'Are passwords kept private?',
        answer: 'Yes! Passwords and files never leave your device.'
      }
    ],
    relatedToolIds: ['redact', 'watermark', 'metadata'],
    keywords: ['pdf security', 'password protect pdf', 'unlock pdf', 'encrypt pdf']
  },

  '/watermark-pdf': {
    path: '/watermark-pdf',
    toolId: 'watermark',
    title: 'Watermark PDF Online - Add Text & Image Stamp Watermarks',
    metaDescription: 'Apply custom text watermarks (Confidential, Draft, Sample) or image logos onto PDF pages with full control over opacity, rotation, and position.',
    h1Title: 'Add Text & Logo Watermarks to PDF Pages',
    subtitle: 'Protect document copyright and mark status with customizable text stamps and logo overlays.',
    categoryName: 'Security & Redact',
    geoAnswer: {
      whatIsIt: 'PDF Watermark tool adds text or graphic overlays to PDF pages.',
      whatItDoes: 'Places custom text stamps or image logos across document pages.',
      howItWorks: 'Embeds vector text and image overlays onto PDF page trees in memory.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Choose Text or Image watermark', 'Set text, opacity, rotation, and position', 'Download watermarked PDF'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Files remain on your local computer.',
      outputGenerated: 'Watermarked PDF file.'
    },
    faqs: [
      {
        question: 'Can I add image logos as watermarks?',
        answer: 'Yes! Upload any PNG or JPG logo and adjust its scale and opacity.'
      }
    ],
    relatedToolIds: ['security', 'redact', 'edit'],
    keywords: ['watermark pdf', 'add watermark to pdf', 'stamp pdf', 'confidential watermark']
  },

  '/crop-pdf': {
    path: '/crop-pdf',
    toolId: 'crop',
    title: 'Crop & Resize PDF Online - Trim Margins & Page Dimensions',
    metaDescription: 'Trim page margins, crop custom bounding boxes, and resize PDF pages to standard dimensions (A4, A3, Letter, Legal) effortlessly.',
    h1Title: 'Crop & Resize PDF Page Margins',
    subtitle: 'Trim excess whitespace margins and fit PDF pages to standard paper sizes.',
    categoryName: 'Organize & Edit',
    geoAnswer: {
      whatIsIt: 'PDF Crop & Resize tool modifies page bounding boxes and dimensions.',
      whatItDoes: 'Trims margins and resizes page viewports.',
      howItWorks: 'Adjusts PDF CropBox and MediaBox vectors client-side.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Set crop margins or select standard page size (A4, Letter)', 'Apply to all or selected pages', 'Download cropped PDF'],
      isFreeAndPrivate: '100% free and local.',
      whatHappensToFiles: 'Processed locally in memory.',
      outputGenerated: 'Cropped / resized PDF document.'
    },
    faqs: [
      {
        question: 'Can I crop all pages at once?',
        answer: 'Yes! You can apply custom crop margins to all pages simultaneously.'
      }
    ],
    relatedToolIds: ['organize', 'split', 'edit'],
    keywords: ['crop pdf', 'resize pdf', 'trim pdf margins', 'change pdf page size']
  },

  '/compare-pdf': {
    path: '/compare-pdf',
    toolId: 'compare',
    title: 'Compare PDF Online - Side-by-Side Visual & Text Difference Checker',
    metaDescription: 'Compare two PDF documents side-by-side or overlay differences to detect visual changes and textual revisions instantly.',
    h1Title: 'Compare Two PDF Documents & Detect Differences',
    subtitle: 'Identify visual changes, modified text, and page differences between two document revisions.',
    categoryName: 'Organize & Edit',
    geoAnswer: {
      whatIsIt: 'PDF Compare tool checks differences between two PDF files.',
      whatItDoes: 'Highlights visual pixel differences and text changes between Document A and Document B.',
      howItWorks: 'Renders page viewports and computes pixel diff masks and text diff algorithms.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload Document A and Document B', 'Select Visual or Text comparison mode', 'Inspect highlighted differences side-by-side'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Compared locally in browser memory.',
      outputGenerated: 'Visual comparison report.'
    },
    faqs: [
      {
        question: 'Does this detect subtle text changes in contracts?',
        answer: 'Yes! It extracts text streams and highlights additions, deletions, and modifications.'
      }
    ],
    relatedToolIds: ['organize', 'edit', 'ai-summarize'],
    keywords: ['compare pdf', 'pdf diff tool', 'compare two pdfs', 'pdf revision compare']
  },

  '/pdf-forms': {
    path: '/pdf-forms',
    toolId: 'forms',
    title: 'PDF Form Builder & Filler - Fill & Design Interactive AcroForms',
    metaDescription: 'Fill interactive AcroForm fields (text boxes, checkboxes, radio buttons, dropdowns) or design brand new fillable forms easily.',
    h1Title: 'Fill & Create Interactive PDF Forms',
    subtitle: 'Fill out official form fields or add new text inputs, checkboxes, and dropdowns to any PDF.',
    categoryName: 'Sign & Forms',
    geoAnswer: {
      whatIsIt: 'PDF Forms tool manages interactive AcroForm fields in PDF documents.',
      whatItDoes: 'Fills existing form inputs or inserts new interactive form elements.',
      howItWorks: 'Reads and writes PDF AcroForm fields in browser memory.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload form PDF', 'Fill in fields or add new form controls', 'Click Save & Download'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed locally in browser.',
      outputGenerated: 'Filled interactive PDF form.'
    },
    faqs: [
      {
        question: 'Can I flatten the form fields after filling?',
        answer: 'Yes! You can choose to keep fields interactive or flatten them into permanent text.'
      }
    ],
    relatedToolIds: ['sign-fill', 'sign', 'edit'],
    keywords: ['pdf forms', 'fill pdf form', 'create acroform', 'interactive pdf form']
  },

  '/pdf-metadata': {
    path: '/pdf-metadata',
    toolId: 'metadata',
    title: 'PDF Metadata Inspector & Editor - View, Edit & Wipe Document Properties',
    metaDescription: 'Inspect, edit, or wipe document metadata properties like Author, Title, Subject, Keywords, Creator, and Creation Date.',
    h1Title: 'Inspect, Edit & Clean PDF Document Metadata',
    subtitle: 'View embedded EXIF and document properties, update author details, or wipe metadata for privacy.',
    categoryName: 'Security & Redact',
    geoAnswer: {
      whatIsIt: 'PDF Metadata tool reads and updates document info dictionaries.',
      whatItDoes: 'Allows editing Author, Title, Subject, Producer, and Creation Date or wiping them completely.',
      howItWorks: 'Parses and modifies PDF info dictionary objects client-side.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Inspect current metadata fields', 'Edit values or click "Wipe All Metadata"', 'Download clean PDF'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed in browser memory.',
      outputGenerated: 'PDF document with updated or sanitized metadata.'
    },
    faqs: [
      {
        question: 'Why should I clean PDF metadata?',
        answer: 'Metadata can expose sensitive author names, company info, software versions, and file paths.'
      }
    ],
    relatedToolIds: ['redact', 'security', 'watermark'],
    keywords: ['pdf metadata', 'edit pdf author', 'clean pdf metadata', 'pdf info editor']
  },

  '/extract-pdf': {
    path: '/extract-pdf',
    toolId: 'extract',
    title: 'PDF Content Extractor - Rip Images, Text & Tables from PDF',
    metaDescription: 'Extract raw text, embedded high-res images, tables, and structured data from your PDF documents in seconds.',
    h1Title: 'Extract Images, Raw Text & Tables from PDF',
    subtitle: 'Rip embedded images in original resolution, export raw text, and extract structured tables into CSV.',
    categoryName: 'Extract & OCR',
    geoAnswer: {
      whatIsIt: 'PDF Extractor retrieves embedded assets and text content from PDF files.',
      whatItDoes: 'Extracts embedded JPEGs/PNGs, extracts raw text strings, and parses tables into CSV.',
      howItWorks: 'Parses PDF XObject image dictionary streams and text object streams.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Choose asset type to extract (Images, Text, or Tables)', 'Click Extract & Download'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Extracted locally on your computer.',
      outputGenerated: 'Image files, TXT files, or CSV table exports.'
    },
    faqs: [
      {
        question: 'Are extracted images saved in their original quality?',
        answer: 'Yes! Embedded images are extracted directly without re-compression or loss of quality.'
      }
    ],
    relatedToolIds: ['ocr', 'ai-extract', 'convert'],
    keywords: ['extract pdf', 'extract images from pdf', 'extract text from pdf', 'rip pdf images']
  },

  '/ai-summarize-pdf': {
    path: '/ai-summarize-pdf',
    toolId: 'ai-summarize',
    title: 'Summarize PDF with AI Online - Executive Briefs & Bullet Points',
    metaDescription: 'Summarize long PDF research papers, contracts, and business reports into concise bullet points, executive briefs, and structured takeaways.',
    h1Title: 'Summarize PDF Documents with Private AI',
    subtitle: 'Extract key points, action items, and executive summaries from lengthy documents in seconds.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'AI PDF Summarizer is a smart assistant that analyzes document content and generates concise summaries.',
      whatItDoes: 'Identifies primary topics, critical statistics, legal clauses, and key takeaways.',
      howItWorks: 'Extracts document text and processes it via TridentPDF AI document intelligence.',
      supportedFormats: 'PDF, DOCX, TXT.',
      howToUseSteps: ['Upload PDF', 'Click Generate AI Summary', 'Review key takeaways and bullet points'],
      isFreeAndPrivate: 'Free to use.',
      whatHappensToFiles: 'Document text is analyzed securely and never stored.',
      outputGenerated: 'Structured executive summary.'
    },
    faqs: [
      {
        question: 'How long can the PDF document be?',
        answer: 'Our AI summarizer supports documents ranging from single-page memos to multi-hundred page reports.'
      }
    ],
    relatedToolIds: ['ai-chat', 'ocr', 'ai-extract'],
    keywords: ['ai pdf summarizer', 'summarize pdf online', 'pdf summary tool', 'ai contract summary']
  },

  '/ai-chat-pdf': {
    path: '/ai-chat-pdf',
    toolId: 'ai-chat',
    title: 'Chat with PDF AI - Interactive Document Question & Answer',
    metaDescription: 'Ask questions and discuss any PDF document directly with intelligent AI. Get instant, sourced answers with page citations and zero data storage.',
    h1Title: 'Chat Directly with Any PDF Document via AI',
    subtitle: 'Interactive AI copilot that answers questions, finds clauses, and cites page references from your PDF.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'Ask AI PDF is an interactive chat copilot for querying PDF documents in natural language.',
      whatItDoes: 'Answers specific questions, cross-checks information, and provides exact page citations.',
      howItWorks: 'Uses document vector indexing and natural language AI processing.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Type any question about the document', 'Receive instant AI answer with citations'],
      isFreeAndPrivate: 'Free and secure.',
      whatHappensToFiles: 'Files are processed securely for Q&A.',
      outputGenerated: 'Interactive answers with page citations.'
    },
    faqs: [
      {
        question: 'Does the AI provide exact page references?',
        answer: 'Yes. Every response includes page number citations so you can verify source text immediately.'
      }
    ],
    relatedToolIds: ['ai-summarize', 'ocr', 'ai-translate'],
    keywords: ['ask ai pdf', 'chat with pdf', 'pdf qna assistant', 'ai document chat']
  },

  '/ai-redact-pdf': {
    path: '/ai-redact-pdf',
    toolId: 'ai-redact',
    title: 'AI Smart PII Redaction - Auto-Detect & Blackout Sensitive Data',
    metaDescription: 'Auto-detect SSNs, credit card numbers, emails, phone numbers, and sensitive entities in PDFs for 1-click batch redaction.',
    h1Title: 'AI Smart PII Detection & Batch Redaction',
    subtitle: 'Automatically locate sensitive personal information and redact it in a single click.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'AI Smart PII Redactor uses pattern recognition to identify sensitive personal data in PDFs.',
      whatItDoes: 'Scans text for SSNs, credit cards, emails, and phone numbers for instant redaction.',
      howItWorks: 'Combines regex patterns with AI entity detection.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Click Detect PII', 'Review detected terms and click Apply Redaction'],
      isFreeAndPrivate: 'Free and secure.',
      whatHappensToFiles: 'Data is redacted permanently.',
      outputGenerated: 'Sanitized PDF document.'
    },
    faqs: [
      {
        question: 'What types of sensitive data does it auto-detect?',
        answer: 'It detects Social Security Numbers (SSNs), credit cards, email addresses, phone numbers, and names.'
      }
    ],
    relatedToolIds: ['redact', 'security', 'ai-summarize'],
    keywords: ['ai redact pdf', 'auto redact pii', 'smart ssn detector pdf', 'pii redaction tool']
  },

  '/ai-translate-pdf': {
    path: '/ai-translate-pdf',
    toolId: 'ai-translate',
    title: 'AI Document Translator - Translate PDF into 50+ Languages',
    metaDescription: 'Translate entire PDF documents across 50+ languages while preserving page layout, typography, and original formatting.',
    h1Title: 'AI PDF Document Translator across 50+ Languages',
    subtitle: 'Translate contracts, reports, and books while keeping original page design intact.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'AI Document Translator translates PDF text into over 50 global languages.',
      whatItDoes: 'Translates text blocks while preserving typography, line breaks, and page layout.',
      howItWorks: 'Uses neural language models to translate extracted text items in context.',
      supportedFormats: 'PDF, DOCX, TXT.',
      howToUseSteps: ['Upload PDF', 'Select target language (Spanish, French, German, Hindi, etc.)', 'Click Translate Document'],
      isFreeAndPrivate: 'Free to use.',
      whatHappensToFiles: 'Processed securely.',
      outputGenerated: 'Translated PDF document.'
    },
    faqs: [
      {
        question: 'Does it preserve original document formatting?',
        answer: 'Yes! It maintains paragraph structures, font styling, and page layout.'
      }
    ],
    relatedToolIds: ['ai-summarize', 'ai-chat', 'ocr'],
    keywords: ['ai pdf translator', 'translate pdf', 'multilingual pdf converter', 'pdf translation online']
  },

  '/ai-extract-pdf': {
    path: '/ai-extract-pdf',
    toolId: 'ai-extract',
    title: 'AI Table & Invoice Extractor - Convert Invoices & Tables to CSV/JSON',
    metaDescription: 'Extract structured financial data, invoices, line items, and nested tables directly into clean CSV and JSON spreadsheets.',
    h1Title: 'AI Invoice & Table Data Extractor',
    subtitle: 'Turn unstructured PDF invoices, receipts, and financial tables into structured CSV and JSON data.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'AI Table & Invoice Extractor parses financial documents into structured data.',
      whatItDoes: 'Extracts vendor details, line items, totals, dates, and complex tables.',
      howItWorks: 'Uses AI document understanding models to format tabular data into CSV/JSON.',
      supportedFormats: 'PDF, JPG, PNG.',
      howToUseSteps: ['Upload invoice or financial PDF', 'Click Extract Data', 'Download CSV or JSON file'],
      isFreeAndPrivate: 'Free to use.',
      whatHappensToFiles: 'Data processed securely.',
      outputGenerated: 'Structured CSV spreadsheet or JSON data file.'
    },
    faqs: [
      {
        question: 'Can I export invoice line items directly to Excel CSV?',
        answer: 'Yes! Extracted line items and table grids download as clean CSV files ready for Excel.'
      }
    ],
    relatedToolIds: ['extract', 'convert', 'ai-summarize'],
    keywords: ['ai invoice extractor', 'pdf table to csv', 'extract financial data pdf', 'receipt parser']
  },

  '/pdf-to-ppt': {
    path: '/pdf-to-ppt',
    toolId: 'convert',
    targetFormat: 'ppt',
    title: 'Convert PDF to PowerPoint (PPTX) Online - 100% Free & Private',
    metaDescription: 'Convert PDF slides and pages into editable Microsoft PowerPoint presentations (.pptx) with preserved layouts, text, and vector graphics.',
    h1Title: 'Convert PDF to Editable PowerPoint Presentation (PPTX)',
    subtitle: 'Transform PDF pages into customizable PowerPoint slides without server uploads or software installation.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to PPTX Converter converts PDF slides and documents into editable Microsoft PowerPoint files.',
      whatItDoes: 'Extracts vector shapes, text elements, and embedded images from PDF pages and reconstructs OpenXML presentation slides.',
      howItWorks: 'Parses PDF page trees client-side and packages extracted layout objects into PPTX presentation structures.',
      supportedFormats: 'Input: PDF (.pdf) → Output: Microsoft PowerPoint (.pptx).',
      howToUseSteps: [
        'Upload your PDF document.',
        'Select "PowerPoint Presentation (.pptx)".',
        'Click "Convert PDF Now".',
        'Download your editable PPTX presentation file.'
      ],
      isFreeAndPrivate: '100% free and private with zero server uploads.',
      whatHappensToFiles: 'Files are processed inside local browser memory.',
      outputGenerated: 'Fully editable Microsoft PowerPoint presentation (.pptx).'
    },
    faqs: [
      {
        question: 'Will each PDF page become an individual PowerPoint slide?',
        answer: 'Yes. Every page in your PDF is converted into a dedicated slide in the output PPTX presentation.'
      },
      {
        question: 'Can I edit the text in the converted PowerPoint slides?',
        answer: 'Yes. All extracted text becomes native, editable text boxes inside PowerPoint.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'edit', 'organize'],
    keywords: ['pdf to ppt', 'pdf to pptx', 'convert pdf to powerpoint', 'pdf to slides online']
  },

  '/pdf-to-csv': {
    path: '/pdf-to-csv',
    toolId: 'convert',
    targetFormat: 'csv',
    title: 'Convert PDF to CSV Online - Extract Tables to Spreadsheet',
    metaDescription: 'Extract tabular data and grids from PDF files into comma-separated value (.csv) spreadsheets instantly in your browser.',
    h1Title: 'Convert PDF Tables to Comma-Separated CSV File',
    subtitle: 'Rip tabular data, financial matrices, and rows from PDF files into clean CSV spreadsheets.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to CSV Converter extracts tabular data from PDF documents into comma-separated values files.',
      whatItDoes: 'Identifies grid structures, cell boundaries, and table rows to format clean CSV spreadsheets.',
      howItWorks: 'Analyzes text bounding boxes to construct matrix rows and cell delimiters client-side.',
      supportedFormats: 'Input: PDF (.pdf) → Output: Comma-Separated Values (.csv).',
      howToUseSteps: [
        'Upload your PDF containing tables or invoices.',
        'Select "CSV Spreadsheet (.csv)".',
        'Click "Convert PDF Now".',
        'Download your CSV file ready for Excel, Google Sheets, or data pipelines.'
      ],
      isFreeAndPrivate: '100% free with zero cloud storage.',
      whatHappensToFiles: 'Processed entirely locally on your device.',
      outputGenerated: 'Comma-Separated Values (.csv) file.'
    },
    faqs: [
      {
        question: 'Can I open the generated CSV file directly in Microsoft Excel or Google Sheets?',
        answer: 'Yes. CSV files are universally supported by Excel, Google Sheets, Apple Numbers, and database importers.'
      }
    ],
    relatedToolIds: ['convert', 'ai-extract', 'extract'],
    keywords: ['pdf to csv', 'extract table from pdf to csv', 'convert pdf table to csv', 'pdf invoice to csv']
  },

  '/pdf-to-html': {
    path: '/pdf-to-html',
    toolId: 'convert',
    targetFormat: 'html',
    title: 'Convert PDF to HTML Online - Webpage & Code Converter',
    metaDescription: 'Convert PDF documents into clean HTML web pages with responsive CSS layouts, typography, and embedded image assets.',
    h1Title: 'Convert PDF to HTML Webpages & Code',
    subtitle: 'Publish PDF content to the web with clean HTML markup and CSS styling.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to HTML Converter renders PDF documents as structured web pages.',
      whatItDoes: 'Transforms PDF page structures into semantic HTML elements and CSS stylesheets.',
      howItWorks: 'Extracts string streams and images to output HTML5 document structures.',
      supportedFormats: 'Input: PDF (.pdf) → Output: HTML (.html).',
      howToUseSteps: ['Upload PDF file', 'Select "HTML Web Page (.html)"', 'Click "Convert PDF Now"', 'Download HTML code bundle'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Kept in local browser RAM.',
      outputGenerated: 'HTML document with CSS formatting.'
    },
    faqs: [
      {
        question: 'Does the converted HTML file render in all web browsers?',
        answer: 'Yes. The output is standard W3C-compliant HTML5 that opens in Chrome, Safari, Firefox, and Edge.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'webpage-pdf'],
    keywords: ['pdf to html', 'convert pdf to webpage', 'pdf to html5', 'publish pdf as html']
  },

  '/pdf-to-markdown': {
    path: '/pdf-to-markdown',
    toolId: 'convert',
    targetFormat: 'markdown',
    title: 'Convert PDF to Markdown (.md) Online - Free Text Extractor',
    metaDescription: 'Convert PDF text, headings, and lists into structured Markdown (.md) format for documentation, Notion, Obsidian, and AI prompts.',
    h1Title: 'Convert PDF Content to Markdown (.md)',
    subtitle: 'Extract structured text with Markdown headers, bullet points, and code blocks for documentation and AI context.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to Markdown Converter converts PDF document layouts into clean Markdown text formatting.',
      whatItDoes: 'Preserves headers, lists, code blocks, and bold/italic styles in standard Markdown syntax.',
      howItWorks: 'Parses PDF text streams and applies Markdown syntax rules.',
      supportedFormats: 'Input: PDF (.pdf) → Output: Markdown (.md).',
      howToUseSteps: ['Upload PDF', 'Select "Markdown (.md)"', 'Click "Convert PDF Now"', 'Download .md file or copy Markdown text'],
      isFreeAndPrivate: '100% free and local.',
      whatHappensToFiles: 'Processed locally in memory.',
      outputGenerated: 'Structured Markdown (.md) document.'
    },
    faqs: [
      {
        question: 'Can I import the Markdown file into Notion, Obsidian, or GitHub?',
        answer: 'Yes. The generated Markdown file follows GitHub-Flavored Markdown syntax compatible with all note apps.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'ocr', 'ai-summarize'],
    keywords: ['pdf to markdown', 'pdf to md', 'convert pdf for notion', 'extract markdown from pdf']
  },

  '/pdf-to-json': {
    path: '/pdf-to-json',
    toolId: 'convert',
    targetFormat: 'json',
    title: 'Convert PDF to JSON Online - Structured Document Data',
    metaDescription: 'Convert PDF document trees, text blocks, bounding boxes, and metadata into structured JSON arrays for developers and APIs.',
    h1Title: 'Convert PDF Document Tree to Structured JSON',
    subtitle: 'Export PDF text coordinates, pages, and metadata as structured JSON data for developer workflows.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to JSON Converter extracts structured data trees from PDF files into JSON format.',
      whatItDoes: 'Parses text lines, page dimensions, fonts, and bounding boxes into JSON key-value objects.',
      howItWorks: 'Processes PDF page trees client-side and outputs structured JSON objects.',
      supportedFormats: 'Input: PDF (.pdf) → Output: JSON (.json).',
      howToUseSteps: ['Upload PDF file', 'Select "JSON Data (.json)"', 'Click "Convert PDF Now"', 'Download JSON file'],
      isFreeAndPrivate: '100% free and developer-friendly.',
      whatHappensToFiles: 'Processed 100% locally.',
      outputGenerated: 'Structured JSON data file.'
    },
    faqs: [
      {
        question: 'Is the JSON output structured with page-by-page text blocks?',
        answer: 'Yes. The JSON object includes page numbers, text line arrays, and metadata attributes.'
      }
    ],
    relatedToolIds: ['convert', 'ai-extract', 'extract', 'metadata'],
    keywords: ['pdf to json', 'convert pdf to json data', 'parse pdf to json', 'pdf text json']
  },

  '/pdf-to-xml': {
    path: '/pdf-to-xml',
    toolId: 'convert',
    targetFormat: 'xml',
    title: 'Convert PDF to XML Online - Structure & Tag Extractor',
    metaDescription: 'Extract structured text node trees and tags from PDF files into clean XML documents.',
    h1Title: 'Convert PDF Structure to Tagged XML Document',
    subtitle: 'Transform PDF content into structured XML node trees for data interchange and archiving.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to XML Converter parses PDF document trees into tagged XML structures.',
      whatItDoes: 'Encapsulates page nodes, paragraphs, and metadata inside standard XML tags.',
      howItWorks: 'Extracts PDF DOM objects and builds XML document trees.',
      supportedFormats: 'Input: PDF (.pdf) → Output: XML (.xml).',
      howToUseSteps: ['Upload PDF', 'Select "XML Document (.xml)"', 'Click "Convert PDF Now"', 'Download XML file'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed in local memory.',
      outputGenerated: 'Tagged XML document.'
    },
    faqs: [
      {
        question: 'Can I parse the output XML in automated scripts?',
        answer: 'Yes. Standard XML parsers in Python, Node.js, Java, and C# can immediately parse the file.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'metadata'],
    keywords: ['pdf to xml', 'convert pdf to xml', 'export pdf xml tags']
  },

  '/pdf-to-webp': {
    path: '/pdf-to-webp',
    toolId: 'convert',
    targetFormat: 'webp',
    title: 'Convert PDF to WEBP Images - Ultra Compressed Web Graphics',
    metaDescription: 'Render PDF pages into lightweight, high-performance WEBP web images directly in your browser with zero loss of clarity.',
    h1Title: 'Convert PDF Pages to Compressed WEBP Images',
    subtitle: 'Export PDF documents to modern WEBP image graphics optimized for fast website loading.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to WEBP Converter renders PDF document pages into modern WEBP image files.',
      whatItDoes: 'Generates compressed WEBP images for every page at high fidelity.',
      howItWorks: 'Rasterizes page viewports onto HTML5 canvas and encodes WEBP image data.',
      supportedFormats: 'Input: PDF (.pdf) → Output: WEBP (.webp).',
      howToUseSteps: ['Upload PDF', 'Select "WEBP Image"', 'Click "Convert PDF Now"', 'Download WEBP images or ZIP archive'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Kept in local browser RAM.',
      outputGenerated: 'WEBP image files or ZIP archive.'
    },
    faqs: [
      {
        question: 'Are WEBP images smaller in file size than JPG and PNG?',
        answer: 'Yes! WEBP provides 25-35% better compression than JPEG/PNG while maintaining high visual quality.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'crop'],
    keywords: ['pdf to webp', 'convert pdf to webp', 'save pdf as webp']
  },

  '/pdf-to-tiff': {
    path: '/pdf-to-tiff',
    toolId: 'convert',
    targetFormat: 'tiff',
    title: 'Convert PDF to TIFF Images - Multi-Page Raster Graphic Format',
    metaDescription: 'Convert PDF pages into high-resolution uncompressed or compressed TIFF image files for professional printing and archiving.',
    h1Title: 'Convert PDF Pages to TIFF Images',
    subtitle: 'Export PDF documents to professional high-resolution TIFF images for print production and document archiving.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to TIFF Converter renders PDF pages into high-resolution Tagged Image File Format graphics.',
      whatItDoes: 'Generates uncompressed or lossless TIFF images suitable for publishing and prepress.',
      howItWorks: 'Renders PDF pages to high-DPI canvas viewports and encodes TIFF image streams.',
      supportedFormats: 'Input: PDF (.pdf) → Output: TIFF (.tiff / .tif).',
      howToUseSteps: ['Upload PDF', 'Select "TIFF Image"', 'Click "Convert PDF Now"', 'Download TIFF image files'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed locally in memory.',
      outputGenerated: 'TIFF image files or ZIP archive.'
    },
    faqs: [
      {
        question: 'Is TIFF suitable for high-resolution printing?',
        answer: 'Yes. TIFF is the industry standard format for prepress, printing, and lossless document archiving.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'ocr'],
    keywords: ['pdf to tiff', 'pdf to tif', 'convert pdf to tiff image']
  },

  '/pdf-to-bmp': {
    path: '/pdf-to-bmp',
    toolId: 'convert',
    targetFormat: 'bmp',
    title: 'Convert PDF to BMP Images - Uncompressed Bitmap Graphics',
    metaDescription: 'Render vector PDF pages into crisp bitmap (.bmp) image files without compression artifacts directly in your browser.',
    h1Title: 'Convert PDF Pages to Uncompressed BMP Bitmaps',
    subtitle: 'Export PDF documents to raw uncompressed bitmap graphics.',
    categoryName: 'PDF Conversion',
    geoAnswer: {
      whatIsIt: 'PDF to BMP Converter renders PDF page viewports into uncompressed Windows Bitmap graphics.',
      whatItDoes: 'Generates pixel-perfect BMP images without lossy compression artifacts.',
      howItWorks: 'Encodes canvas pixel buffers directly into BMP binary headers.',
      supportedFormats: 'Input: PDF (.pdf) → Output: Bitmap (.bmp).',
      howToUseSteps: ['Upload PDF', 'Select "BMP Bitmap"', 'Click "Convert PDF Now"', 'Download BMP file'],
      isFreeAndPrivate: '100% free and local.',
      whatHappensToFiles: 'Stays on your computer.',
      outputGenerated: 'Uncompressed BMP bitmap images.'
    },
    faqs: [
      {
        question: 'Are BMP images uncompressed?',
        answer: 'Yes. BMP files preserve raw pixel RGB values with zero compression loss.'
      }
    ],
    relatedToolIds: ['convert', 'extract', 'crop'],
    keywords: ['pdf to bmp', 'convert pdf to bitmap', 'save pdf as bmp']
  },

  '/unlock-pdf': {
    path: '/unlock-pdf',
    toolId: 'security',
    title: 'Unlock PDF Online - Remove Known Passwords & Restrictions',
    metaDescription: 'Remove owner passwords, printing restrictions, editing locks, and copying limitations from PDF files securely in your browser.',
    h1Title: 'Unlock Password-Protected PDF Documents',
    subtitle: 'Remove passwords and permissions restrictions from protected PDF files effortlessly.',
    categoryName: 'Security & Redact',
    geoAnswer: {
      whatIsIt: 'Unlock PDF tool removes security restrictions and passwords from PDF files.',
      whatItDoes: 'Decrypts protected PDF documents when the user provides the authorized password.',
      howItWorks: 'Uses client-side PDF decryption engines to remove security handlers in memory.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload protected PDF', 'Enter authorized password', 'Click "Unlock PDF"', 'Download unlocked unrestricted PDF'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Files are processed locally and never uploaded anywhere.',
      outputGenerated: 'Unlocked, unrestricted PDF document.'
    },
    faqs: [
      {
        question: 'Does this tool remove printing and copying restrictions?',
        answer: 'Yes! Once unlocked, all permissions (printing, editing, copying, page extracting) are fully restored.'
      }
    ],
    relatedToolIds: ['security', 'redact', 'metadata'],
    keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'pdf password remover']
  },

  '/crop-resize-pdf': {
    path: '/crop-resize-pdf',
    toolId: 'crop',
    title: 'Crop & Resize PDF Pages - Trim Margins & Custom Dimensions',
    metaDescription: 'Crop PDF page margins, adjust bounding boxes, and resize documents to A4, Letter, or Legal dimensions.',
    h1Title: 'Crop & Resize PDF Page Dimensions',
    subtitle: 'Trim excess whitespace margins and fit PDF pages to standard paper sizes.',
    categoryName: 'Organize & Edit',
    geoAnswer: {
      whatIsIt: 'PDF Crop & Resize tool modifies page bounding boxes and dimensions.',
      whatItDoes: 'Trims margins and resizes page viewports.',
      howItWorks: 'Adjusts PDF CropBox and MediaBox vectors client-side.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Set crop margins or select standard page size (A4, Letter)', 'Apply to all or selected pages', 'Download cropped PDF'],
      isFreeAndPrivate: '100% free and local.',
      whatHappensToFiles: 'Processed locally in memory.',
      outputGenerated: 'Cropped / resized PDF document.'
    },
    faqs: [
      {
        question: 'Can I crop all pages at once?',
        answer: 'Yes! You can apply custom crop margins to all pages simultaneously.'
      }
    ],
    relatedToolIds: ['organize', 'split', 'edit'],
    keywords: ['crop pdf', 'resize pdf', 'trim pdf margins', 'change pdf page size']
  },

  '/organize-pdf-pages': {
    path: '/organize-pdf-pages',
    toolId: 'organize',
    title: 'Organize PDF Pages - Reorder, Rotate & Delete PDF Pages',
    metaDescription: 'Reorder, rotate, duplicate, and remove pages in any PDF document with an interactive visual thumbnail grid.',
    h1Title: 'Organize, Rotate & Rearrange PDF Pages',
    subtitle: 'Manage page sequence, rotate misoriented pages, and delete unwanted pages with live visual preview grid.',
    categoryName: 'Organize & Edit',
    geoAnswer: {
      whatIsIt: 'Page Organizer manages page order, rotation, and page removal in PDF documents.',
      whatItDoes: 'Allows drag-and-drop reordering, page deletion, page duplication, and rotation.',
      howItWorks: 'Reconstructs PDF page trees client-side using PDF-Lib vector operations.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Drag pages to reorder, click rotate or delete buttons', 'Click Save & Download'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed locally in browser memory.',
      outputGenerated: 'Organized PDF document.'
    },
    faqs: [
      {
        question: 'Can I rotate individual pages or all pages at once?',
        answer: 'Both! You can rotate individual page thumbnails or apply 90° rotation to every page simultaneously.'
      }
    ],
    relatedToolIds: ['split', 'merge', 'crop', 'edit'],
    keywords: ['organize pdf', 'reorder pdf pages', 'rotate pdf pages', 'delete pdf page']
  },

  '/pdf-metadata-editor': {
    path: '/pdf-metadata-editor',
    toolId: 'metadata',
    title: 'PDF Metadata Editor - View, Update & Wipe EXIF Properties',
    metaDescription: 'View and edit PDF metadata properties including Author, Title, Subject, Producer, or wipe all EXIF data for privacy.',
    h1Title: 'Inspect, Edit & Clean PDF Document Metadata',
    subtitle: 'View embedded EXIF and document properties, update author details, or wipe metadata for privacy.',
    categoryName: 'Security & Redact',
    geoAnswer: {
      whatIsIt: 'PDF Metadata tool reads and updates document info dictionaries.',
      whatItDoes: 'Allows editing Author, Title, Subject, Producer, and Creation Date or wiping them completely.',
      howItWorks: 'Parses and modifies PDF info dictionary objects client-side.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Inspect current metadata fields', 'Edit values or click "Wipe All Metadata"', 'Download clean PDF'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed in browser memory.',
      outputGenerated: 'PDF document with updated or sanitized metadata.'
    },
    faqs: [
      {
        question: 'Why should I clean PDF metadata?',
        answer: 'Metadata can expose sensitive author names, company info, software versions, and file paths.'
      }
    ],
    relatedToolIds: ['redact', 'security', 'watermark'],
    keywords: ['pdf metadata', 'edit pdf author', 'clean pdf metadata', 'pdf info editor']
  },

  '/extract-pdf-content': {
    path: '/extract-pdf-content',
    toolId: 'extract',
    title: 'Extract Content from PDF - Rip Images, Text & Tables',
    metaDescription: 'Extract embedded images, raw text strings, and structured data tables from PDF documents in original resolution.',
    h1Title: 'Extract Images, Raw Text & Tables from PDF',
    subtitle: 'Rip embedded images in original resolution, export raw text, and extract structured tables into CSV.',
    categoryName: 'Extract & OCR',
    geoAnswer: {
      whatIsIt: 'PDF Extractor retrieves embedded assets and text content from PDF files.',
      whatItDoes: 'Extracts embedded JPEGs/PNGs, extracts raw text strings, and parses tables into CSV.',
      howItWorks: 'Parses PDF XObject image dictionary streams and text object streams.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Choose asset type to extract (Images, Text, or Tables)', 'Click Extract & Download'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Extracted locally on your computer.',
      outputGenerated: 'Image files, TXT files, or CSV table exports.'
    },
    faqs: [
      {
        question: 'Are extracted images saved in their original quality?',
        answer: 'Yes! Embedded images are extracted directly without re-compression or loss of quality.'
      }
    ],
    relatedToolIds: ['ocr', 'ai-extract', 'convert'],
    keywords: ['extract pdf', 'extract images from pdf', 'extract text from pdf', 'rip pdf images']
  },

  '/extract-text-from-pdf': {
    path: '/extract-text-from-pdf',
    toolId: 'extract',
    title: 'Extract Text from PDF Online - Fast Plain Text Rigger',
    metaDescription: 'Extract all readable text from PDF documents cleanly without formatting mess or missing paragraphs.',
    h1Title: 'Extract Clean Readable Text from PDF',
    subtitle: 'Rip plain text strings and paragraph flows from any PDF document.',
    categoryName: 'Extract & OCR',
    geoAnswer: {
      whatIsIt: 'Text Extractor strips formatting and retrieves clean text streams from PDF files.',
      whatItDoes: 'Extracts all words and sentences into copyable text or TXT file.',
      howItWorks: 'Parses text object streams in PDF page catalogues.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Click Extract Text', 'Copy text to clipboard or download .txt file'],
      isFreeAndPrivate: '100% free and local.',
      whatHappensToFiles: 'Processed entirely inside your browser.',
      outputGenerated: 'Plain text string or TXT file.'
    },
    faqs: [
      {
        question: 'Does this work on all PDF documents?',
        answer: 'Works on all vector text PDFs. For scanned image PDFs, use our OCR PDF tool.'
      }
    ],
    relatedToolIds: ['ocr', 'convert', 'extract'],
    keywords: ['extract text from pdf', 'rip text pdf', 'copy text from pdf', 'pdf text stripper']
  },

  '/extract-images-from-pdf': {
    path: '/extract-images-from-pdf',
    toolId: 'extract',
    title: 'Extract Images from PDF Online - Rip Embedded JPG & PNG Photos',
    metaDescription: 'Extract all embedded graphics, photos, and vector drawings from any PDF document in high resolution.',
    h1Title: 'Extract & Rip All Embedded Images from PDF',
    subtitle: 'Save embedded PNG, JPG, and illustration images from PDF documents in original resolution.',
    categoryName: 'Extract & OCR',
    geoAnswer: {
      whatIsIt: 'Image Extractor extracts all embedded bitmap photos and graphics from PDF files.',
      whatItDoes: 'Rips embedded image XObjects and exports them as standalone JPG/PNG image files.',
      howItWorks: 'Scans PDF XObject dictionaries and saves image binary streams.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Click Extract Images', 'Download individual photos or ZIP archive'],
      isFreeAndPrivate: '100% free and browser-private.',
      whatHappensToFiles: 'Images extracted locally in browser RAM.',
      outputGenerated: 'JPG/PNG images or ZIP archive.'
    },
    faqs: [
      {
        question: 'Will image quality be degraded during extraction?',
        answer: 'No! Embedded image objects are extracted verbatim in their native resolution.'
      }
    ],
    relatedToolIds: ['extract', 'convert', 'crop'],
    keywords: ['extract images from pdf', 'rip pdf images', 'save images from pdf', 'pdf photo extractor']
  },

  '/extract-tables-from-pdf': {
    path: '/extract-tables-from-pdf',
    toolId: 'extract',
    title: 'Extract Tables from PDF Online - Export Grids to Excel CSV',
    metaDescription: 'Detect and extract tabular grids and data tables from PDF files directly into clean CSV spreadsheets.',
    h1Title: 'Extract Tabular Data & Grids from PDF to CSV',
    subtitle: 'Rip financial tables, invoices, and grid data into editable CSV spreadsheets.',
    categoryName: 'Extract & OCR',
    geoAnswer: {
      whatIsIt: 'Table Extractor parses tabular grid boundaries inside PDF pages into spreadsheets.',
      whatItDoes: 'Converts rows and columns of text into CSV and Excel formats.',
      howItWorks: 'Analyzes spatial alignment of text coordinates in PDF viewports.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Click Extract Tables', 'Download CSV file'],
      isFreeAndPrivate: '100% free and local.',
      whatHappensToFiles: 'Kept in browser memory.',
      outputGenerated: 'CSV spreadsheet file.'
    },
    faqs: [
      {
        question: 'Can I open the extracted table in Excel?',
        answer: 'Yes! CSV files open directly in Excel, Google Sheets, and Numbers.'
      }
    ],
    relatedToolIds: ['extract', 'ai-extract', 'convert'],
    keywords: ['extract tables from pdf', 'pdf table to csv', 'rip tables from pdf']
  },

  '/ai-pii-redactor': {
    path: '/ai-pii-redactor',
    toolId: 'ai-redact',
    title: 'AI PII Redactor - Auto-Detect & Erase SSNs & Sensitive Data',
    metaDescription: 'Auto-scan PDF documents for SSNs, credit cards, emails, and phone numbers for instant 1-click batch redaction.',
    h1Title: 'AI Smart PII Detection & Batch Redaction',
    subtitle: 'Automatically locate sensitive personal information and redact it in a single click.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'AI Smart PII Redactor uses pattern recognition to identify sensitive personal data in PDFs.',
      whatItDoes: 'Scans text for SSNs, credit cards, emails, and phone numbers for instant redaction.',
      howItWorks: 'Combines regex patterns with AI entity detection.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload PDF', 'Click Detect PII', 'Review detected terms and click Apply Redaction'],
      isFreeAndPrivate: 'Free and secure.',
      whatHappensToFiles: 'Data is redacted permanently.',
      outputGenerated: 'Sanitized PDF document.'
    },
    faqs: [
      {
        question: 'What types of sensitive data does it auto-detect?',
        answer: 'It detects Social Security Numbers (SSNs), credit cards, email addresses, phone numbers, and names.'
      }
    ],
    relatedToolIds: ['redact', 'security', 'ai-summarize'],
    keywords: ['ai redact pdf', 'auto redact pii', 'smart ssn detector pdf', 'pii redaction tool']
  },

  '/ai-pdf-translator': {
    path: '/ai-pdf-translator',
    toolId: 'ai-translate',
    title: 'Translate PDF Online with AI - Free Multi-Language Document Translation',
    metaDescription: 'Accurately translate contracts, research papers, and technical manuals into 50+ languages with client-side AI while preserving layout.',
    h1Title: 'Translate PDF Files to 50+ Languages with AI',
    subtitle: 'Translate contracts, reports, and books while keeping original page design intact.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'AI Document Translator translates PDF text into over 50 global languages.',
      whatItDoes: 'Translates text blocks while preserving typography, line breaks, and page layout.',
      howItWorks: 'Uses neural language models to translate extracted text items in context.',
      supportedFormats: 'PDF, DOCX, TXT.',
      howToUseSteps: ['Upload PDF', 'Select target language (Spanish, French, German, Hindi, etc.)', 'Click Translate Document'],
      isFreeAndPrivate: 'Free to use.',
      whatHappensToFiles: 'Processed securely.',
      outputGenerated: 'Translated PDF document.'
    },
    faqs: [
      {
        question: 'Does it preserve original document formatting?',
        answer: 'Yes! It maintains paragraph structures, font styling, and page layout.'
      }
    ],
    relatedToolIds: ['ai-summarize', 'ai-chat', 'ocr'],
    keywords: ['ai pdf translator', 'translate pdf', 'multilingual pdf converter', 'pdf translation online']
  },

  '/ai-table-extractor': {
    path: '/ai-table-extractor',
    toolId: 'ai-extract',
    title: 'Extract Tables from PDF with AI - Automated Table & Data Parsing',
    metaDescription: 'Automatically detect tabular data and financial statements in PDF files. Export clean tabular rows directly to CSV or JSON formats.',
    h1Title: 'Extract Structured Tables from PDF via AI',
    subtitle: 'Turn unstructured PDF invoices, receipts, and financial tables into structured CSV and JSON data.',
    categoryName: 'AI & Smart Tools',
    geoAnswer: {
      whatIsIt: 'AI Table & Invoice Extractor parses financial documents into structured data.',
      whatItDoes: 'Extracts vendor details, line items, totals, dates, and complex tables.',
      howItWorks: 'Uses AI document understanding models to format tabular data into CSV/JSON.',
      supportedFormats: 'PDF, JPG, PNG.',
      howToUseSteps: ['Upload invoice or financial PDF', 'Click Extract Data', 'Download CSV or JSON file'],
      isFreeAndPrivate: 'Free to use.',
      whatHappensToFiles: 'Data processed securely.',
      outputGenerated: 'Structured CSV spreadsheet or JSON data file.'
    },
    faqs: [
      {
        question: 'Can I export invoice line items directly to Excel CSV?',
        answer: 'Yes! Extracted line items and table grids download as clean CSV files ready for Excel.'
      }
    ],
    relatedToolIds: ['extract', 'convert', 'ai-summarize'],
    keywords: ['ai invoice extractor', 'pdf table to csv', 'extract financial data pdf', 'receipt parser']
  },

  '/fill-pdf-forms': {
    path: '/fill-pdf-forms',
    toolId: 'forms',
    title: 'Fill PDF Forms Online - Free Interactive AcroForm Filler',
    metaDescription: 'Complete and save official PDF forms, tax documents, and job applications with interactive form field detection in browser memory.',
    h1Title: 'Fill Out Interactive PDF Forms & Save',
    subtitle: 'Fill out official form fields or add new text inputs, checkboxes, and dropdowns to any PDF.',
    categoryName: 'Sign & Forms',
    geoAnswer: {
      whatIsIt: 'PDF Forms tool manages interactive AcroForm fields in PDF documents.',
      whatItDoes: 'Fills existing form inputs or inserts new interactive form elements.',
      howItWorks: 'Reads and writes PDF AcroForm fields in browser memory.',
      supportedFormats: 'PDF (.pdf).',
      howToUseSteps: ['Upload form PDF', 'Fill in fields or add new form controls', 'Click Save & Download'],
      isFreeAndPrivate: '100% free and private.',
      whatHappensToFiles: 'Processed locally in browser.',
      outputGenerated: 'Filled interactive PDF form.'
    },
    faqs: [
      {
        question: 'Can I flatten the form fields after filling?',
        answer: 'Yes! You can choose to keep fields interactive or flatten them into permanent text.'
      }
    ],
    relatedToolIds: ['sign-fill', 'sign', 'edit'],
    keywords: ['pdf forms', 'fill pdf form', 'create acroform', 'interactive pdf form']
  }
};

export function getSeoConfigByPath(pathname: string): SeoPageConfig {
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  return SEO_PAGES_REGISTRY[cleanPath] || SEO_PAGES_REGISTRY['/'];
}

export const TOOL_PRIMARY_PATH_MAP: Record<AppTool, string> = {
  home: '/',
  convert: '/pdf-to-word',
  split: '/split-pdf',
  merge: '/merge-pdf',
  compress: '/compress-pdf',
  ocr: '/pdf-ocr',
  sign: '/batch-sign-pdf',
  'sign-fill': '/sign-and-fill-pdf',
  scanner: '/camera-pdf-scanner',
  'webpage-pdf': '/webpage-to-pdf',
  security: '/password-protect-pdf',
  redact: '/redact-pdf',
  'ai-summarize': '/ai-pdf-summarizer',
  'ai-chat': '/ask-ai-pdf',
  'compress-jpg': '/compress-jpg',
  organize: '/organize-pdf',
  edit: '/edit-pdf',
  watermark: '/watermark-pdf',
  crop: '/crop-pdf',
  compare: '/compare-pdf',
  forms: '/pdf-forms',
  metadata: '/pdf-metadata',
  extract: '/extract-pdf',
  'ai-redact': '/ai-redact-pdf',
  'ai-translate': '/ai-translate-pdf',
  'ai-extract': '/ai-extract-pdf',
};

export function getPrimaryPathForTool(toolId: AppTool): string {
  return TOOL_PRIMARY_PATH_MAP[toolId] || '/';
}
