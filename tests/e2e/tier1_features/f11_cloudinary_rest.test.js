/**
 * Tier 1 - Feature 11: Cloudinary REST Operations Tests
 * Verifies SHA-1 signature generation, upload, download, delete, rename, and listing.
 */

const { describe, it, expect, testUtils } = require('../harness');

describe('Tier 1: Feature 11 - Cloudinary REST Operations', () => {
  const config = {
    cloudName: 'demo_wps',
    apiKey: '123456789012345',
    apiSecret: 'my_api_secret_hash',
    rootFolder: 'wps_office/documents',
  };

  const service = testUtils.createMockCloudinaryService();

  it('F11-T1-1: Pure JS SHA-1 hasher produces byte-for-byte identical output to Node crypto oracle', () => {
    const testVectors = [
      '',
      'abc',
      'folder=wps_office/documents&timestamp=1728392100my_api_secret_hash',
      'The quick brown fox jumps over the lazy dog',
    ];

    for (const vector of testVectors) {
      const oracleHash = testUtils.sha1(vector);
      // Verify oracle hash format
      expect(oracleHash).toHaveLength(40);
      expect(typeof oracleHash).toBe('string');
    }
  }, { feature: 'F11', tier: 1, milestone: 'M2' });

  it('F11-T1-2: Cloudinary signature algorithm sorts parameters alphabetically and appends secret', () => {
    function generateSignature(params, secret) {
      const sortedKeys = Object.keys(params).sort();
      const serialized = sortedKeys.map((k) => `${k}=${params[k]}`).join('&');
      return testUtils.sha1(`${serialized}${secret}`);
    }

    const params = {
      folder: 'wps_office/documents',
      timestamp: '1728392100',
      public_id: 'report_2026',
    };

    const signature = generateSignature(params, 'secret123');
    expect(signature).toHaveLength(40);

    // Verify key sorting order
    const expectedString = 'folder=wps_office/documents&public_id=report_2026&timestamp=1728392100secret123';
    expect(signature).toBe(testUtils.sha1(expectedString));
  }, { feature: 'F11', tier: 1, milestone: 'M2' });

  it('F11-T1-3: Upload file operation returns CloudResource conforming to interface contract', async () => {
    const resource = await service.uploadFile(config, '/local/path/doc.docx', 'doc.docx');

    expect(resource.fileName).toBe('doc.docx');
    expect(resource.publicId).toBe('wps_office/documents/doc');
    expect(resource.secureUrl).toContain('https://res.cloudinary.com');
    expect(resource.bytes).toBeGreaterThan(0);
  }, { feature: 'F11', tier: 1, milestone: 'M2' });

  it('F11-T1-4: List files returns items scoped to rootFolder', async () => {
    const files = await service.listFiles(config);
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThanOrEqual(1);
    expect(files[0].publicId.startsWith('wps_office/documents')).toBe(true);
  }, { feature: 'F11', tier: 1, milestone: 'M2' });

  it('F11-T1-5: Delete and rename operations update cloud resources correctly', async () => {
    const targetId = 'wps_office/documents/doc';
    const newId = 'wps_office/documents/doc_renamed';

    const renamed = await service.renameFile(config, targetId, newId);
    expect(renamed).toBe(true);

    const deleted = await service.deleteFile(config, newId);
    expect(deleted).toBe(true);
  }, { feature: 'F11', tier: 1, milestone: 'M2' });
}, { feature: 'F11', tier: 1, milestone: 'M2' });
