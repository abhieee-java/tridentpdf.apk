/**
 * E2E Test Harness for WPS Office Mobile Alternative
 * Standard opaque-box test execution framework with rich assertion API,
 * metadata tracking (tier, feature, milestone), and testing utilities.
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// Test suite state
const suites = [];
let currentSuite = null;

function describe(title, fn, options = {}) {
  const suite = {
    title,
    options,
    tests: [],
    beforeEachHooks: [],
    afterEachHooks: [],
    beforeAllHooks: [],
    afterAllHooks: [],
  };
  suites.push(suite);

  const prevSuite = currentSuite;
  currentSuite = suite;
  try {
    fn();
  } finally {
    currentSuite = prevSuite;
  }
}

function it(title, fn, metadata = {}) {
  if (!currentSuite) {
    throw new Error(`Test "${title}" must be defined inside a describe block`);
  }
  currentSuite.tests.push({
    title,
    fn,
    metadata: {
      feature: metadata.feature || currentSuite.options.feature || 'GENERAL',
      tier: metadata.tier || currentSuite.options.tier || 1,
      milestone: metadata.milestone || currentSuite.options.milestone || 'M1',
      ...metadata,
    },
  });
}

function beforeEach(fn) {
  if (currentSuite) currentSuite.beforeEachHooks.push(fn);
}

function afterEach(fn) {
  if (currentSuite) currentSuite.afterEachHooks.push(fn);
}

function beforeAll(fn) {
  if (currentSuite) currentSuite.beforeAllHooks.push(fn);
}

function afterAll(fn) {
  if (currentSuite) currentSuite.afterAllHooks.push(fn);
}

// Fluent Expect Assertion Implementation
class Expectation {
  constructor(actual, isNot = false) {
    this.actual = actual;
    this.isNot = isNot;
  }

  get not() {
    return new Expectation(this.actual, !this.isNot);
  }

  _evaluate(condition, message, expected) {
    const passed = this.isNot ? !condition : condition;
    if (!passed) {
      const formattedMsg = this.isNot
        ? `Expected value NOT to match: ${message} (Actual: ${JSON.stringify(this.actual)})`
        : `Expected ${message}. Actual: ${JSON.stringify(this.actual)}, Expected: ${JSON.stringify(expected)}`;
      throw new assert.AssertionError({
        message: formattedMsg,
        actual: this.actual,
        expected,
        operator: this.isNot ? 'not' : 'expect',
      });
    }
  }

  toBe(expected) {
    this._evaluate(this.actual === expected, `to be strictly equal to`, expected);
  }

  toEqual(expected) {
    let matches = false;
    try {
      assert.deepStrictEqual(this.actual, expected);
      matches = true;
    } catch {
      matches = false;
    }
    this._evaluate(matches, `to deeply equal`, expected);
  }

  toBeTruthy() {
    this._evaluate(Boolean(this.actual), `to be truthy`, true);
  }

  toBeFalsy() {
    this._evaluate(!this.actual, `to be falsy`, false);
  }

  toBeNull() {
    this._evaluate(this.actual === null, `to be null`, null);
  }

  toBeDefined() {
    this._evaluate(this.actual !== undefined, `to be defined`, undefined);
  }

  toBeUndefined() {
    this._evaluate(this.actual === undefined, `to be undefined`, undefined);
  }

  toContain(itemOrSubstring) {
    let contains = false;
    if (typeof this.actual === 'string') {
      contains = this.actual.includes(itemOrSubstring);
    } else if (Array.isArray(this.actual)) {
      contains = this.actual.includes(itemOrSubstring);
    } else if (this.actual && typeof this.actual === 'object') {
      contains = itemOrSubstring in this.actual;
    }
    this._evaluate(contains, `to contain ${JSON.stringify(itemOrSubstring)}`, itemOrSubstring);
  }

  toMatch(regex) {
    const r = typeof regex === 'string' ? new RegExp(regex) : regex;
    this._evaluate(r.test(String(this.actual)), `to match regex ${r}`, regex);
  }

  toBeGreaterThan(num) {
    this._evaluate(typeof this.actual === 'number' && this.actual > num, `to be greater than ${num}`, num);
  }

  toBeGreaterThanOrEqual(num) {
    this._evaluate(typeof this.actual === 'number' && this.actual >= num, `to be greater than or equal to ${num}`, num);
  }

  toBeLessThan(num) {
    this._evaluate(typeof this.actual === 'number' && this.actual < num, `to be less than ${num}`, num);
  }

  toBeLessThanOrEqual(num) {
    this._evaluate(typeof this.actual === 'number' && this.actual <= num, `to be less than or equal to ${num}`, num);
  }

  toHaveLength(length) {
    const len = this.actual && (this.actual.length ?? this.actual.size ?? Object.keys(this.actual).length);
    this._evaluate(len === length, `to have length ${length} (got ${len})`, length);
  }

  toThrow(expectedError) {
    if (typeof this.actual !== 'function') {
      throw new Error(`expect(fn).toThrow() requires a function, received ${typeof this.actual}`);
    }
    let threw = false;
    let thrownError = null;
    try {
      this.actual();
    } catch (err) {
      threw = true;
      thrownError = err;
    }

    if (!threw) {
      this._evaluate(false, `to throw an error`, expectedError);
      return;
    }

    if (expectedError) {
      if (typeof expectedError === 'string') {
        this._evaluate(
          thrownError.message.includes(expectedError),
          `to throw error containing "${expectedError}" (threw: "${thrownError.message}")`,
          expectedError
        );
      } else if (expectedError instanceof RegExp) {
        this._evaluate(
          expectedError.test(thrownError.message),
          `to throw error matching regex ${expectedError} (threw: "${thrownError.message}")`,
          expectedError
        );
      }
    } else {
      this._evaluate(true, `to throw`, null);
    }
  }

  get rejects() {
    return {
      toThrow: async (expectedError) => {
        if (!this.actual || typeof this.actual.then !== 'function') {
          throw new Error(`expect(promise).rejects.toThrow() requires a Promise`);
        }
        let threw = false;
        let thrownError = null;
        try {
          await this.actual;
        } catch (err) {
          threw = true;
          thrownError = err;
        }

        if (!threw) {
          throw new assert.AssertionError({
            message: `Expected promise to reject, but it resolved`,
            operator: 'rejects',
          });
        }

        if (expectedError) {
          if (typeof expectedError === 'string') {
            assert.ok(
              thrownError.message.includes(expectedError),
              `Expected error message to contain "${expectedError}", got "${thrownError.message}"`
            );
          } else if (expectedError instanceof RegExp) {
            assert.ok(
              expectedError.test(thrownError.message),
              `Expected error message to match ${expectedError}, got "${thrownError.message}"`
            );
          }
        }
      },
    };
  }
}

function expect(actual) {
  return new Expectation(actual);
}

// Testing Utility Helpers
const testUtils = {
  PROJECT_ROOT,

  readProjectFile(relativePath) {
    const fullPath = path.resolve(PROJECT_ROOT, relativePath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    return fs.readFileSync(fullPath, 'utf8');
  },

  projectFileExists(relativePath) {
    const fullPath = path.resolve(PROJECT_ROOT, relativePath);
    return fs.existsSync(fullPath);
  },

  sha1(input) {
    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf8');
    return crypto.createHash('sha1').update(buffer).digest('hex');
  },

  createMockKeystore() {
    let storedSecret = null;
    return {
      async getApiSecret() {
        return storedSecret;
      },
      async setApiSecret(secret) {
        if (typeof secret !== 'string') {
          throw new TypeError('API secret must be a string');
        }
        storedSecret = secret;
      },
      async clearApiSecret() {
        storedSecret = null;
      },
      _inspectInternalStore() {
        return storedSecret;
      },
    };
  },

  createMockCloudinaryService(keystore, initialResources = []) {
    const resources = [...initialResources];
    let isConnected = true;

    return {
      setConnectedState(connected) {
        isConnected = connected;
      },
      async testConnection(config) {
        if (!config || !config.cloudName || !config.apiKey || !config.apiSecret) {
          return { success: false, message: 'Missing credentials' };
        }
        if (!isConnected || config.apiSecret === 'INVALID_SECRET' || config.cloudName === 'invalid_cloud') {
          return { success: false, message: 'Connection Failed: Unauthorized' };
        }
        return {
          success: true,
          message: 'Connected',
          cloudName: config.cloudName,
          plan: 'Free / Tier 1',
        };
      },
      async listFiles(config, folder) {
        if (!config || !config.apiKey) throw new Error('Unauthorized');
        const targetFolder = folder || config.rootFolder || '';
        return resources.filter((r) => r.publicId.startsWith(targetFolder));
      },
      async uploadFile(config, localUri, targetFileName) {
        if (!config || !config.apiSecret) throw new Error('Unauthorized');
        const folder = config.rootFolder ? `${config.rootFolder}/` : '';
        const publicId = `${folder}${targetFileName.replace(/\.[^/.]+$/, '')}`;
        const newResource = {
          publicId,
          fileName: targetFileName,
          fileType: targetFileName.split('.').pop() || 'dat',
          bytes: 1024,
          format: targetFileName.split('.').pop() || 'dat',
          createdAt: new Date().toISOString(),
          secureUrl: `https://res.cloudinary.com/${config.cloudName}/raw/upload/v1/${publicId}`,
        };
        resources.push(newResource);
        return newResource;
      },
      async downloadFile(remoteUrl, targetFileName) {
        if (!remoteUrl) throw new Error('Remote URL required');
        return `/local/downloads/${targetFileName}`;
      },
      async deleteFile(config, publicId) {
        if (!config || !config.apiSecret) throw new Error('Unauthorized');
        const idx = resources.findIndex((r) => r.publicId === publicId);
        if (idx >= 0) {
          resources.splice(idx, 1);
          return true;
        }
        return false;
      },
      async renameFile(config, oldPublicId, newPublicId) {
        if (!config || !config.apiSecret) throw new Error('Unauthorized');
        const item = resources.find((r) => r.publicId === oldPublicId);
        if (!item) return false;
        item.publicId = newPublicId;
        return true;
      },
      _getResources() {
        return resources;
      },
    };
  },

  sanitizeLog(message, secret) {
    if (!message || typeof message !== 'string') return message;
    if (!secret || typeof secret !== 'string') return message;
    const escaped = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    return message.replace(regex, '••••••••');
  },

  evaluateSpreadsheetFormula(formula, cellLookup) {
    if (!formula.startsWith('=')) return formula;
    const expr = formula.slice(1).trim().toUpperCase();

    // Built-in functions: SUM, AVERAGE, COUNT, MIN, MAX
    const funcMatch = expr.match(/^([A-Z]+)\(([^)]+)\)$/);
    if (funcMatch) {
      const [, funcName, rangeArg] = funcMatch;
      const values = [];

      if (rangeArg.includes(':')) {
        const [startCell, endCell] = rangeArg.split(':');
        const startCol = startCell.charCodeAt(0) - 65;
        const startRow = parseInt(startCell.slice(1), 10);
        const endCol = endCell.charCodeAt(0) - 65;
        const endRow = parseInt(endCell.slice(1), 10);

        for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
          for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
            const cellId = `${String.fromCharCode(65 + c)}${r}`;
            const val = parseFloat(cellLookup(cellId));
            if (!isNaN(val)) values.push(val);
          }
        }
      } else {
        const parts = rangeArg.split(',').map((s) => s.trim());
        for (const part of parts) {
          const val = parseFloat(cellLookup(part));
          if (!isNaN(val)) values.push(val);
        }
      }

      switch (funcName) {
        case 'SUM':
          return values.reduce((a, b) => a + b, 0);
        case 'AVERAGE':
          return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        case 'COUNT':
          return values.length;
        case 'MIN':
          return values.length ? Math.min(...values) : 0;
        case 'MAX':
          return values.length ? Math.max(...values) : 0;
        default:
          throw new Error(`Unsupported formula function: ${funcName}`);
      }
    }

    // Arithmetic expressions e.g. A1 + B1
    const evaluatedExpr = expr.replace(/([A-Z][0-9]+)/g, (match) => {
      const v = parseFloat(cellLookup(match));
      return isNaN(v) ? '0' : String(v);
    });

    if (/\/0(?![0-9])/.test(evaluatedExpr)) {
      return '#DIV/0!';
    }

    try {
      // Safe math eval with only numbers, spaces and + - * / ( )
      if (/^[0-9+\-*/().\s]+$/.test(evaluatedExpr)) {
        // eslint-disable-next-line no-new-func
        return Function(`"use strict"; return (${evaluatedExpr})`)();
      }
      return '#VALUE!';
    } catch {
      return '#VALUE!';
    }
  },
};

function getRegisteredSuites() {
  return suites;
}

function clearSuites() {
  suites.length = 0;
}

module.exports = {
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  expect,
  testUtils,
  getRegisteredSuites,
  clearSuites,
};
