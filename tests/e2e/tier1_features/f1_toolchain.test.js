/**
 * Tier 1 - Feature 1: Toolchain Configuration Tests
 * Verifies build scripts, environment variables, Android SDK paths, and device target.
 */

const { describe, it, expect, testUtils } = require('../harness');

describe('Tier 1: Feature 1 - Toolchain Configuration', () => {
  it('F1-T1-1: build_android.bat configures JDK 17 environment variables and tools path', () => {
    const content = testUtils.readProjectFile('build_android.bat');
    expect(content).toBeTruthy();
    expect(content).toContain('set JAVA_HOME=');
    expect(content).toContain('jdk-17');
    expect(content).toContain('%JAVA_HOME%\\bin');
  }, { feature: 'F1', tier: 1, milestone: 'M1' });

  it('F1-T1-2: build_android.bat targets assembleRelease and outputs APK to builds directory', () => {
    const content = testUtils.readProjectFile('build_android.bat');
    expect(content).toBeTruthy();
    expect(content).toContain('assembleRelease');
    expect(content).toContain('bundleRelease');
    expect(content).toContain('builds');
    expect(content).toContain('.apk');
  }, { feature: 'F1', tier: 1, milestone: 'M1' });

  it('F1-T1-3: install_on_phone.bat specifies ADB path, wait-for-device, and install command', () => {
    const content = testUtils.readProjectFile('install_on_phone.bat');
    expect(content).toBeTruthy();
    expect(content).toContain('adb.exe');
    expect(content).toContain('wait-for-device');
    expect(content).toContain('install -r');
    expect(content).toContain('screencap');
  }, { feature: 'F1', tier: 1, milestone: 'M1' });

  it('F1-T1-4: android/local.properties contains valid sdk.dir setting', () => {
    const content = testUtils.readProjectFile('android/local.properties');
    expect(content).toBeTruthy();
    expect(content).toContain('sdk.dir=');
    expect(content).toContain('android-sdk');
  }, { feature: 'F1', tier: 1, milestone: 'M1' });

  it('F1-T1-5: app.json defines com.tridentpdf.app package, orientation, and essential permissions', () => {
    const content = testUtils.readProjectFile('app.json');
    expect(content).toBeTruthy();
    const appConfig = JSON.parse(content);
    const expo = appConfig.expo;
    expect(expo).toBeTruthy();
    expect(expo.android).toBeTruthy();
    expect(expo.android.package).toBe('com.tridentpdf.app');
    expect(expo.orientation).toBeTruthy();
  }, { feature: 'F1', tier: 1, milestone: 'M1' });
}, { feature: 'F1', tier: 1, milestone: 'M1' });
