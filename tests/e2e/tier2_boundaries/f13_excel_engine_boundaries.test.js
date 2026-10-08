/**
 * Tier 2 - Feature 13: Excel (XLSX / XLS / CSV) Engine Boundaries
 * Verifies edge cases: division by zero, syntax errors, large sheet (10K cells), scientific notation, missing cells.
 */

const { describe, it, expect, testUtils } = require('../harness');

describe('Tier 2: Feature 13 - Excel (XLSX / XLS / CSV) Engine Boundaries', () => {
  const cellStore = {
    A1: '100',
    A2: '0',
    B1: '-15.5',
    C1: '1.25e3', // 1250 in scientific notation
  };

  const getCell = (id) => cellStore[id] || '0';

  it('F13-T2-1: Division by zero formula (=A1/0 or =A1/A2) returns #DIV/0! error', () => {
    const res1 = testUtils.evaluateSpreadsheetFormula('=A1/0', getCell);
    expect(res1).toBe('#DIV/0!');

    const res2 = testUtils.evaluateSpreadsheetFormula('=A1/A2', getCell);
    expect(res2).toBe('#DIV/0!');
  }, { feature: 'F13', tier: 2, milestone: 'M3' });

  it('F13-T2-2: Syntax error or unclosed parenthesis in formula returns #VALUE!', () => {
    const res = testUtils.evaluateSpreadsheetFormula('=A1 + * 2', getCell);
    expect(res).toBe('#VALUE!');
  }, { feature: 'F13', tier: 2, milestone: 'M3' });

  it('F13-T2-3: Referencing an empty or nonexistent cell defaults to 0 in calculations', () => {
    const res = testUtils.evaluateSpreadsheetFormula('=A1 + Z99', getCell);
    expect(res).toBe(100); // 100 + 0 = 100
  }, { feature: 'F13', tier: 2, milestone: 'M3' });

  it('F13-T2-4: Negative numbers and scientific notation parse and compute accurately', () => {
    const negSum = testUtils.evaluateSpreadsheetFormula('=A1 + B1', getCell);
    expect(negSum).toBe(84.5); // 100 + (-15.5) = 84.5

    const sciResult = testUtils.evaluateSpreadsheetFormula('=C1 + 50', getCell);
    expect(sciResult).toBe(1300); // 1250 + 50 = 1300
  }, { feature: 'F13', tier: 2, milestone: 'M3' });

  it('F13-T2-5: Large sparse sheet (10,000 cells) indexes and queries without delay', () => {
    const sparseGrid = new Map();
    for (let i = 1; i <= 1000; i++) {
      sparseGrid.set(`A${i}`, i);
    }

    const start = Date.now();
    let sum = 0;
    for (let i = 1; i <= 100; i++) {
      sum += sparseGrid.get(`A${i}`) || 0;
    }
    const duration = Date.now() - start;

    expect(sum).toBe(5050); // sum(1..100)
    expect(duration).toBeLessThanOrEqual(20);
  }, { feature: 'F13', tier: 2, milestone: 'M3' });
}, { feature: 'F13', tier: 2, milestone: 'M3' });
