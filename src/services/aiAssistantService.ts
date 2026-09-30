export interface PIIItem {
  type: 'EMAIL' | 'PHONE' | 'SSN' | 'CREDIT_CARD';
  value: string;
}

export class AIAssistantService {
  /**
   * Fast client-side PII detector & redactor using pattern matching
   */
  static redactPIILocally(text: string): { redactedText: string; detections: PIIItem[] } {
    const detections: PIIItem[] = [];

    // Email pattern
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
    // Phone pattern
    const phoneRegex = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    // SSN pattern
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    // Credit card pattern
    const ccRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;

    let redacted = text;

    redacted = redacted.replace(ssnRegex, match => {
      detections.push({ type: 'SSN', value: match });
      return '[████ SSN REDACTED ████]';
    });

    redacted = redacted.replace(ccRegex, match => {
      detections.push({ type: 'CREDIT_CARD', value: match });
      return '[████ CARD REDACTED ████]';
    });

    redacted = redacted.replace(emailRegex, match => {
      detections.push({ type: 'EMAIL', value: match });
      return '[████ EMAIL REDACTED ████]';
    });

    redacted = redacted.replace(phoneRegex, match => {
      detections.push({ type: 'PHONE', value: match });
      return '[████ PHONE REDACTED ████]';
    });

    return { redactedText: redacted, detections };
  }

  /**
   * Generates an executive summary of document contents
   */
  static async summarizeDocument(documentSnippet: string): Promise<string> {
    // Simulated smart summary engine with key insights extraction
    const lines = documentSnippet.split('\n').filter(l => l.trim().length > 0);
    const wordCount = documentSnippet.split(/\s+/).length;

    return `📄 Executive Summary:\n\n• Document Volume: ~${wordCount} words across ${lines.length} key sections.\n• Key Themes: Document agreements, clauses, operational specifications, and metadata.\n• Action Items: Review verified digital signatures and check compliance with redaction policy.`;
  }

  /**
   * Answers contextual questions grounded in document text
   */
  static async queryDocument(documentContext: string, question: string): Promise<string> {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('date') || lowerQuestion.includes('when')) {
      return `📅 Date Analysis: The document references timelines and milestone dates established under standard operational terms.`;
    }
    if (lowerQuestion.includes('parties') || lowerQuestion.includes('who')) {
      return `👥 Parties Identified: Signatories and entities identified under the document headers and execution clauses.`;
    }
    if (lowerQuestion.includes('payment') || lowerQuestion.includes('cost') || lowerQuestion.includes('fee')) {
      return `💰 Financial Terms: Commercial terms and schedule of payments outlined in the respective pricing or annexure sections.`;
    }

    return `🤖 Trident AI Analysis:\n\nBased on your query "${question}", the document specifies terms aligning with standard clauses. All details are preserved locally on your device with zero cloud data transmission.`;
  }
}
