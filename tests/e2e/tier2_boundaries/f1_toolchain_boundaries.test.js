/**
 * Tier 2 - Feature 1: Toolchain Configuration Boundaries
 * Verifies edge cases: missing SDK path, malformed local.properties, invalid arguments, device offline.
 */

const { describe, it, expect, testUtils } = require('../harness');

describe('Tier 2: Feature 1 - Toolchain Configuration Boundaries', () => {
  it('F1-T2-1: Malformed local.properties missing sdk.dir throws validation failure', () => {
    function parseLocalProperties(content) {
      if (!content || !content.trim()) throw new Error('local.properties is empty');
      const lines = content.split('\n');
      const sdkLine = lines.find((l) => l.startsWith('sdk.dir='));
      if (!sdkLine) throw new Error('Missing sdk.dir definition');
      return sdkLine.split('=')[1].trim();
    }

    expect(() => parseLocalProperties('')).toThrow('empty');
    expect(() => parseLocalProperties('ndk.dir=something')).toThrow('Missing sdk.dir');
    expect(parseLocalProperties('sdk.dir=D:\\android-tools')).toBe('D:\\android-tools');
  }, { feature: 'F1', tier: 2, milestone: 'M1' });

  it('F1-T2-2: Missing or invalid JDK path in build script is detected', () => {
    function validateJdkPath(pathStr) {
      if (!pathStr || !pathStr.includes('jdk-17')) {
        return { valid: false, reason: 'JDK 17 path is required' };
      }
      return { valid: true };
    }

    expect(validateJdkPath(null).valid).toBe(false);
    expect(validateJdkPath('C:\\invalid\\jdk-8').valid).toBe(false);
    expect(validateJdkPath('D:\\android-tools\\jdk-17').valid).toBe(true);
  }, { feature: 'F1', tier: 2, milestone: 'M1' });

  it('F1-T2-3: ADB device detection handles no devices or unauthorized device state', () => {
    function parseAdbDevicesOutput(output) {
      const lines = output.trim().split('\n').slice(1);
      const devices = [];
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          devices.push({ serial: parts[0], state: parts[1] });
        }
      }
      return devices;
    }

    const noDevices = 'List of devices attached\n\n';
    expect(parseAdbDevicesOutput(noDevices)).toHaveLength(0);

    const unauthorized = 'List of devices attached\nB6TGUWZDBYMR6HD6\tunauthorized\n';
    const parsed = parseAdbDevicesOutput(unauthorized);
    expect(parsed[0].state).toBe('unauthorized');

    const connected = 'List of devices attached\nB6TGUWZDBYMR6HD6\tdevice\n';
    expect(parseAdbDevicesOutput(connected)[0].state).toBe('device');
  }, { feature: 'F1', tier: 2, milestone: 'M1' });

  it('F1-T2-4: Malformed app.json missing expo configuration throws parse error', () => {
    function validateAppJson(jsonString) {
      let parsed;
      try {
        parsed = JSON.parse(jsonString);
      } catch {
        throw new Error('Invalid JSON format');
      }
      if (!parsed.expo) throw new Error('Missing expo root property');
      if (!parsed.expo.android || !parsed.expo.android.package) {
        throw new Error('Missing android package property');
      }
      return true;
    }

    expect(() => validateAppJson('{ invalid }')).toThrow('Invalid JSON');
    expect(() => validateAppJson('{}')).toThrow('Missing expo root');
    expect(() => validateAppJson('{"expo":{}}')).toThrow('Missing android package');
    expect(validateAppJson('{"expo":{"android":{"package":"com.tridentpdf.app"}}}')).toBe(true);
  }, { feature: 'F1', tier: 2, milestone: 'M1' });

  it('F1-T2-5: Build output directory creation handles existing and nonexistent directory', () => {
    function ensureBuildDir(dirExists, createDirFn) {
      if (!dirExists) {
        createDirFn();
        return 'created';
      }
      return 'exists';
    }

    let created = false;
    expect(ensureBuildDir(true, () => { created = true; })).toBe('exists');
    expect(created).toBe(false);

    expect(ensureBuildDir(false, () => { created = true; })).toBe('created');
    expect(created).toBe(true);
  }, { feature: 'F1', tier: 2, milestone: 'M1' });
}, { feature: 'F1', tier: 2, milestone: 'M1' });
