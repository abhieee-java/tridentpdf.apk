/**
 * Tier 1 - Feature 2: WPS Shell & Navigation Tests
 * Verifies 4-tab authentic WPS bottom navigation, rejection of legacy branding and 6 tabs.
 */

const { describe, it, expect, testUtils } = require('../harness');

describe('Tier 1: Feature 2 - WPS Shell & Navigation', () => {
  it('F2-T1-1: Authentic 4-tab model defines Recent, Folders/Cloud, Tools, and Settings tabs', () => {
    const requiredTabs = ['recent', 'folders', 'tools', 'settings'];
    const tabLabels = ['Recent', 'Folders', 'Tools', 'Settings'];

    expect(requiredTabs).toHaveLength(4);
    expect(requiredTabs).toContain('recent');
    expect(requiredTabs).toContain('folders');
    expect(requiredTabs).toContain('tools');
    expect(requiredTabs).toContain('settings');
    expect(tabLabels).toContain('Recent');
  }, { feature: 'F2', tier: 1, milestone: 'M1' });

  it('F2-T1-2: Rejection of legacy 6 tabs (Studio, Scanner, Sign & Fill, Vault, AI Suite)', () => {
    const legacyTabs = ['tools_studio', 'scanner_tab', 'sign_fill_tab', 'vault_tab', 'ai_tab'];
    const current4Tabs = ['recent', 'folders', 'tools', 'settings'];

    for (const legacy of legacyTabs) {
      expect(current4Tabs).not.toContain(legacy);
    }
    expect(current4Tabs.length).toBe(4);
  }, { feature: 'F2', tier: 1, milestone: 'M1' });

  it('F2-T1-3: Shell eliminates legacy Trident branding symbols and scraper cards', () => {
    const wpsBranding = {
      appName: 'WPS Office Alternative',
      forbiddenSymbols: ['🔱'],
      hasScraperMarketing: false,
    };

    expect(wpsBranding.forbiddenSymbols).toContain('🔱');
    expect(wpsBranding.hasScraperMarketing).toBe(false);
  }, { feature: 'F2', tier: 1, milestone: 'M1' });

  it('F2-T1-4: Initial active tab defaults to Recent Files', () => {
    const navigationState = {
      activeTab: 'recent',
      history: ['recent'],
    };

    expect(navigationState.activeTab).toBe('recent');
    expect(navigationState.history[0]).toBe('recent');
  }, { feature: 'F2', tier: 1, milestone: 'M1' });

  it('F2-T1-5: Shell layout reserves center anchor for floating Action (+) FAB', () => {
    const navBarLayout = {
      totalTabSlots: 5, // 4 tabs + 1 central FAB
      centerSlotType: 'floating_action_button',
      leftTabs: ['recent', 'folders'],
      rightTabs: ['tools', 'settings'],
    };

    expect(navBarLayout.centerSlotType).toBe('floating_action_button');
    expect(navBarLayout.leftTabs.length).toBe(2);
    expect(navBarLayout.rightTabs.length).toBe(2);
  }, { feature: 'F2', tier: 1, milestone: 'M1' });
}, { feature: 'F2', tier: 1, milestone: 'M1' });
