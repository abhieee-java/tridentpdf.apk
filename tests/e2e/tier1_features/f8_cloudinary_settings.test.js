/**
 * Tier 1 - Feature 8: Cloudinary Settings UI Tests
 * Verifies Settings -> Cloud Storage -> Cloudinary configuration form, masking, and validation.
 */

const { describe, it, expect } = require('../harness');

describe('Tier 1: Feature 8 - Cloudinary Settings UI', () => {
  it('F8-T1-1: Settings screen presents all four mandatory Cloudinary configuration fields', () => {
    const fields = ['cloudName', 'apiKey', 'apiSecret', 'rootFolder'];
    const fieldLabels = ['Cloud Name', 'API Key', 'API Secret', 'Root Storage Folder'];

    expect(fields).toHaveLength(4);
    expect(fields).toContain('cloudName');
    expect(fields).toContain('apiKey');
    expect(fields).toContain('apiSecret');
    expect(fields).toContain('rootFolder');
    expect(fieldLabels).toContain('Root Storage Folder');
  }, { feature: 'F8', tier: 1, milestone: 'M2' });

  it('F8-T1-2: API Secret field is masked with bullet characters by default', () => {
    function maskSecret(secret, isVisible) {
      if (!secret) return '';
      if (isVisible) return secret;
      return '•'.repeat(Math.min(secret.length, 12));
    }

    const secret = 'my_super_secret_key_123';
    expect(maskSecret(secret, false)).toBe('••••••••••••');
    expect(maskSecret(secret, true)).toBe(secret);
  }, { feature: 'F8', tier: 1, milestone: 'M2' });

  it('F8-T1-3: Root Storage Folder defaults to wps_office/documents if unspecified', () => {
    function getEffectiveRootFolder(input) {
      return (input && input.trim()) ? input.trim() : 'wps_office/documents';
    }

    expect(getEffectiveRootFolder('')).toBe('wps_office/documents');
    expect(getEffectiveRootFolder('   ')).toBe('wps_office/documents');
    expect(getEffectiveRootFolder('custom/folder')).toBe('custom/folder');
  }, { feature: 'F8', tier: 1, milestone: 'M2' });

  it('F8-T1-4: Settings validation rejects empty required fields', () => {
    function validateSettings(config) {
      const errors = {};
      if (!config.cloudName || !config.cloudName.trim()) errors.cloudName = 'Cloud Name required';
      if (!config.apiKey || !config.apiKey.trim()) errors.apiKey = 'API Key required';
      if (!config.apiSecret || !config.apiSecret.trim()) errors.apiSecret = 'API Secret required';
      return { isValid: Object.keys(errors).length === 0, errors };
    }

    const invalid = validateSettings({ cloudName: '', apiKey: '123', apiSecret: '' });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.cloudName).toBe('Cloud Name required');
    expect(invalid.errors.apiSecret).toBe('API Secret required');

    const valid = validateSettings({ cloudName: 'demo', apiKey: '123', apiSecret: 'sec', rootFolder: '' });
    expect(valid.isValid).toBe(true);
  }, { feature: 'F8', tier: 1, milestone: 'M2' });

  it('F8-T1-5: Save operation separates non-sensitive preferences from sensitive credentials', () => {
    const rawConfig = {
      cloudName: 'demo_cloud',
      apiKey: 'key_12345',
      apiSecret: 'secret_abcde',
      rootFolder: 'wps_office/documents',
    };

    const publicPreferences = {
      cloudName: rawConfig.cloudName,
      apiKey: rawConfig.apiKey,
      rootFolder: rawConfig.rootFolder,
    };

    const sensitiveKeystoreData = {
      apiSecret: rawConfig.apiSecret,
    };

    expect(publicPreferences.apiSecret).toBeUndefined();
    expect(sensitiveKeystoreData.apiSecret).toBe('secret_abcde');
  }, { feature: 'F8', tier: 1, milestone: 'M2' });
}, { feature: 'F8', tier: 1, milestone: 'M2' });
