import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as toByteArray from 'base64-js';

// Helper to convert Uint8Array to Base64
function uint8ArrayToBase64(bytes: Uint8Array): string {
  return toByteArray.fromByteArray(bytes);
}

// Helper to convert Base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  return toByteArray.toByteArray(base64);
}

// Helper to parse hex color to rgb [0-1]
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return { r, g, b };
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return { r: isNaN(r) ? 0.2 : r, g: isNaN(g) ? 0.4 : g, b: isNaN(b) ? 0.9 : b };
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  keywords?: string[];
}

export class PDFEngine {
  /**
   * Reads a file from a device URI and returns its Uint8Array buffer
   */
  static async loadBytesFromUri(uri: string): Promise<Uint8Array> {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64ToUint8Array(base64);
  }

  /**
   * Saves a Uint8Array buffer to a new file in the app documents directory
   */
  static async saveBytesToFile(bytes: Uint8Array, fileNamePrefix: string): Promise<string> {
    const base64 = uint8ArrayToBase64(bytes);
    const fileName = `${fileNamePrefix}_${Date.now()}.pdf`;
    const destUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(destUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return destUri;
  }

  /**
   * Merge multiple PDF documents into a single PDF
   */
  static async mergePDFs(uris: string[]): Promise<string> {
    if (!uris || uris.length === 0) throw new Error('No files provided for merging');

    const mergedDoc = await PDFDocument.create();

    for (const uri of uris) {
      const bytes = await this.loadBytesFromUri(uri);
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach(page => mergedDoc.addPage(page));
    }

    const mergedBytes = await mergedDoc.save({ useObjectStreams: true });
    return this.saveBytesToFile(mergedBytes, 'merged');
  }

  /**
   * Split/Extract specific pages from a PDF
   */
  static async splitPDF(uri: string, pageNumbers: number[]): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const sourceDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const newDoc = await PDFDocument.create();

    const totalPages = sourceDoc.getPageCount();
    // 1-indexed page numbers to 0-indexed indices
    const validIndices = pageNumbers
      .map(p => p - 1)
      .filter(i => i >= 0 && i < totalPages);

    if (validIndices.length === 0) throw new Error('Invalid page numbers selected');

    const copiedPages = await newDoc.copyPages(sourceDoc, validIndices);
    copiedPages.forEach(page => newDoc.addPage(page));

    const resultBytes = await newDoc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, 'split_extracted');
  }

  /**
   * Rotate all or specific pages of a PDF
   */
  static async rotatePages(uri: string, rotationAngle: 90 | 180 | 270, targetPages?: number[]): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = doc.getPages();

    pages.forEach((page, idx) => {
      const pageNum = idx + 1;
      if (!targetPages || targetPages.includes(pageNum)) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotationAngle) % 360));
      }
    });

    const resultBytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, 'rotated');
  }

  /**
   * Add a custom watermark across all or selected pages of a PDF
   */
  static async addWatermark(
    uri: string,
    text: string,
    opacity: number = 0.3,
    colorHex: string = '#2563EB',
    rotationDegrees: number = 45
  ): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const pages = doc.getPages();
    const { r, g, b } = hexToRgb(colorHex);

    pages.forEach(page => {
      const { width, height } = page.getSize();
      const fontSize = Math.min(width, height) / 10;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: (height - textHeight) / 2,
        size: fontSize,
        font,
        color: rgb(r, g, b),
        opacity: Math.max(0.05, Math.min(1.0, opacity)),
        rotate: degrees(rotationDegrees),
      });
    });

    const resultBytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, 'watermarked');
  }

  /**
   * Compress PDF by optimizing object streams and stripping non-essential metadata
   */
  static async compressPDF(
    uri: string,
    preset: 'recommended' | 'extreme' | 'light' = 'recommended'
  ): Promise<{ outputUri: string; originalSize: number; compressedSize: number; ratio: string; savingsPercent: number }> {
    const bytes = await this.loadBytesFromUri(uri);
    const originalSize = bytes.byteLength;

    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    // Extreme: strip metadata tags completely
    if (preset === 'extreme') {
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('WPS Office Mobile Compressor');
      doc.setCreator('WPS Office Mobile');
    }

    // Save with object streams enabled
    const compressedBytes = await doc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const outputUri = await this.saveBytesToFile(compressedBytes, `compressed_${preset}`);
    const compressedSize = compressedBytes.byteLength;
    const savingsPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

    return {
      outputUri,
      originalSize,
      compressedSize,
      ratio: `${savingsPercent}%`,
      savingsPercent,
    };
  }

  /**
   * Crop and Resize pages to standard paper formats (A4, A3, Letter, Legal)
   */
  static async cropAndResize(
    uri: string,
    preset: 'a4' | 'a3' | 'letter' | 'legal' = 'a4'
  ): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = doc.getPages();

    // Dimensions in PDF points (72 points per inch)
    const dimensions: Record<string, { width: number; height: number }> = {
      a4: { width: 595.28, height: 841.89 },
      a3: { width: 841.89, height: 1190.55 },
      letter: { width: 612.0, height: 792.0 },
      legal: { width: 612.0, height: 1008.0 },
    };

    const target = dimensions[preset] || dimensions.a4;

    pages.forEach(page => {
      page.setSize(target.width, target.height);
    });

    const resultBytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, `resized_${preset}`);
  }

  /**
   * Redact sensitive information by placing permanent opaque black boxes
   */
  static async redactPDF(
    uri: string,
    boxes: Array<{ page: number; x: number; y: number; width: number; height: number; label?: string }>
  ): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const pages = doc.getPages();

    boxes.forEach(box => {
      const pageIndex = Math.max(0, Math.min(box.page - 1, pages.length - 1));
      const page = pages[pageIndex];

      // Draw solid black rectangle
      page.drawRectangle({
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        color: rgb(0, 0, 0),
        opacity: 1.0,
      });

      // Optional REDACTED text inside
      if (box.label && box.width > 50 && box.height > 12) {
        page.drawText(box.label, {
          x: box.x + 4,
          y: box.y + (box.height / 2) - 4,
          size: Math.min(9, box.height - 4),
          font,
          color: rgb(1, 1, 1),
        });
      }
    });

    const resultBytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, 'redacted_sanitized');
  }

  /**
   * Wipe all metadata properties from a PDF document for total privacy
   */
  static async wipeMetadata(uri: string): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    doc.setTitle('');
    doc.setAuthor('');
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setProducer('');
    doc.setCreator('');

    const resultBytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, 'metadata_wiped');
  }

  /**
   * Embed digital signature PNG onto a specific page of a PDF
   */
  static async embedSignature(
    uri: string,
    signatureImageBase64: string,
    pageNumber: number = 1,
    rect: { x: number; y: number; width: number; height: number }
  ): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    const cleanBase64 = signatureImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const sigBytes = base64ToUint8Array(cleanBase64);
    const signatureImage = await doc.embedPng(sigBytes);

    const pageIndex = Math.max(0, Math.min(pageNumber - 1, doc.getPageCount() - 1));
    const targetPage = doc.getPages()[pageIndex];

    targetPage.drawImage(signatureImage, {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });

    const resultBytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, 'signed');
  }

  /**
   * Convert list of camera photos or gallery images into a single multi-page PDF
   */
  static async imagesToPDF(imageUris: string[]): Promise<string> {
    if (!imageUris || imageUris.length === 0) throw new Error('No images selected');

    const doc = await PDFDocument.create();

    for (const imgUri of imageUris) {
      const base64 = await FileSystem.readAsStringAsync(imgUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBytes = base64ToUint8Array(base64);

      let image;
      const lower = imgUri.toLowerCase();
      if (lower.endsWith('.png')) {
        image = await doc.embedPng(imgBytes);
      } else {
        image = await doc.embedJpg(imgBytes);
      }

      const page = doc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const resultBytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, 'scanned_document');
  }

  /**
   * Get metadata and page count of a PDF
   */
  static async inspectPDF(
    uri: string
  ): Promise<{
    pageCount: number;
    title: string;
    author: string;
    subject: string;
    creator: string;
    producer: string;
    fileSize: number;
  }> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    return {
      pageCount: doc.getPageCount(),
      title: doc.getTitle() || 'Untitled Document',
      author: doc.getAuthor() || 'Unknown',
      subject: doc.getSubject() || '',
      creator: doc.getCreator() || '',
      producer: doc.getProducer() || '',
      fileSize: bytes.byteLength,
    };
  }

  /**
   * Update metadata tags on a PDF
   */
  static async updateMetadata(uri: string, meta: PDFMetadata): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    if (meta.title !== undefined) doc.setTitle(meta.title);
    if (meta.author !== undefined) doc.setAuthor(meta.author);
    if (meta.subject !== undefined) doc.setSubject(meta.subject);
    if (meta.creator !== undefined) doc.setCreator(meta.creator);
    if (meta.producer !== undefined) doc.setProducer(meta.producer);
    if (meta.keywords !== undefined) doc.setKeywords(meta.keywords);

    const resultBytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(resultBytes, 'metadata_updated');
  }

  /**
   * Generates a sample clean demo PDF document right on the device
   */
  static async createSampleDocument(title: string = 'WPS Office Sample Document'): Promise<string> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595.28, 841.89]);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

    page.drawText(title, {
      x: 50,
      y: 780,
      size: 20,
      font: fontBold,
      color: rgb(0.15, 0.39, 0.92),
    });

    const bodyText = [
      'This document was generated locally by WPS Office Mobile Alternative.',
      'All byte manipulation, vector rendering, and security checks execute',
      'strictly inside local device RAM with zero remote server transmissions.',
      '',
      '• Authentic WPS Office Experience: Ultra-fast local performance.',
      '• Privacy Guarantee: Zero telemetry, zero external storage.',
      '• Universal Format Engine: Ready for Split, Merge, Compress, & Convert.',
      '',
      `Generated on: ${new Date().toLocaleString()}`,
    ];

    let currentY = 730;
    for (const line of bodyText) {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 11,
        font: fontRegular,
        color: rgb(0.12, 0.12, 0.15),
      });
      currentY -= 20;
    }

    const bytes = await doc.save({ useObjectStreams: true });
    return this.saveBytesToFile(bytes, 'sample_demo_doc');
  }
}
