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

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
}

export class PDFEngine {
  /**
   * Reads a file from a device URI and returns its Uint8Array buffer
   */
  private static async loadBytesFromUri(uri: string): Promise<Uint8Array> {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64ToUint8Array(base64);
  }

  /**
   * Saves a Uint8Array buffer to a new file in the app documents directory
   */
  private static async saveBytesToFile(bytes: Uint8Array, fileNamePrefix: string): Promise<string> {
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
      const doc = await PDFDocument.load(bytes);
      const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach(page => mergedDoc.addPage(page));
    }

    const mergedBytes = await mergedDoc.save();
    return this.saveBytesToFile(mergedBytes, 'merged');
  }

  /**
   * Split/Extract specific pages from a PDF
   */
  static async splitPDF(uri: string, pageNumbers: number[]): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const sourceDoc = await PDFDocument.load(bytes);
    const newDoc = await PDFDocument.create();

    const totalPages = sourceDoc.getPageCount();
    // 1-indexed page numbers to 0-indexed indices
    const validIndices = pageNumbers
      .map(p => p - 1)
      .filter(i => i >= 0 && i < totalPages);

    if (validIndices.length === 0) throw new Error('Invalid page numbers selected');

    const copiedPages = await newDoc.copyPages(sourceDoc, validIndices);
    copiedPages.forEach(page => newDoc.addPage(page));

    const resultBytes = await newDoc.save();
    return this.saveBytesToFile(resultBytes, 'split_extracted');
  }

  /**
   * Rotate all or specific pages of a PDF
   */
  static async rotatePages(uri: string, rotationAngle: 90 | 180 | 270): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes);
    const pages = doc.getPages();

    pages.forEach(page => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotationAngle) % 360));
    });

    const resultBytes = await doc.save();
    return this.saveBytesToFile(resultBytes, 'rotated');
  }

  /**
   * Add a custom watermark across all pages of a PDF
   */
  static async addWatermark(uri: string, text: string, opacity: number = 0.3): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const pages = doc.getPages();

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
        color: rgb(0.2, 0.4, 0.9),
        opacity: Math.max(0.1, Math.min(1.0, opacity)),
        rotate: degrees(45),
      });
    });

    const resultBytes = await doc.save();
    return this.saveBytesToFile(resultBytes, 'watermarked');
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
    const doc = await PDFDocument.load(bytes);

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

    const resultBytes = await doc.save();
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

    const resultBytes = await doc.save();
    return this.saveBytesToFile(resultBytes, 'scanned_document');
  }

  /**
   * Get metadata and page count of a PDF
   */
  static async inspectPDF(uri: string): Promise<{ pageCount: number; title: string; author: string }> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes);
    return {
      pageCount: doc.getPageCount(),
      title: doc.getTitle() || 'Untitled Document',
      author: doc.getAuthor() || 'Unknown',
    };
  }

  /**
   * Update metadata tags on a PDF
   */
  static async updateMetadata(uri: string, meta: PDFMetadata): Promise<string> {
    const bytes = await this.loadBytesFromUri(uri);
    const doc = await PDFDocument.load(bytes);

    if (meta.title) doc.setTitle(meta.title);
    if (meta.author) doc.setAuthor(meta.author);
    if (meta.subject) doc.setSubject(meta.subject);
    if (meta.creator) doc.setCreator(meta.creator);

    const resultBytes = await doc.save();
    return this.saveBytesToFile(resultBytes, 'metadata_updated');
  }
}
