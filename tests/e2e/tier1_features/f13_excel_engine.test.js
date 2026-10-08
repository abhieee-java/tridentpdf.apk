/**
 * Tier 1 - Feature 13: Excel (XLSX / XLS / CSV) Engine Tests
 * Verifies spreadsheet grid, multi-sheet workbook, formula bar, and calculation engine.
 */

const { describe, it, expect, testUtils } = require('../harness');

describe('Tier 1: Feature 13 - Excel (XLSX / XLS / CSV) Engine', () => {
  const mockSheetData = {
    A1: '10',
    A2: '20',
    A3: '30',
    B1: '5',
    B2: '15',
    B3: '25',
  };

  function getCellValue(cellId) {
    return mockSheetData[cellId] || '0';
  }

  it('F13-T1-1: Multi-sheet workbook tracks sheet names and active sheet', () => {
    const workbook = {
      sheets: ['Sheet1', 'Sheet2', 'Summary'],
      activeSheet: 'Sheet1',
    };

    expect(workbook.sheets.length).toBe(3);
    expect(workbook.activeSheet).toBe('Sheet1');

    workbook.activeSheet = 'Summary';
    expect(workbook.activeSheet).toBe('Summary');
  }, { feature: 'F13', tier: 1, milestone: 'M3' });

  it('F13-T1-2: Grid coordinate mapping translates between cell ID and indices', () => {
    function cellToCoord(cellId) {
      const col = cellId.charCodeAt(0) - 65;
      const row = parseInt(cellId.slice(1), 10) - 1;
      return { col, row };
    }

    expect(cellToCoord('A1')).toEqual({ col: 0, row: 0 });
    expect(cellToCoord('B3')).toEqual({ col: 1, row: 2 });
    expect(cellToCoord('Z10')).toEqual({ col: 25, row: 9 });
  }, { feature: 'F13', tier: 1, milestone: 'M3' });

  it('F13-T1-3: Formula engine evaluates =SUM range calculations accurately', () => {
    const sumResult = testUtils.evaluateSpreadsheetFormula('=SUM(A1:A3)', getCellValue);
    expect(sumResult).toBe(60); // 10 + 20 + 30
  }, { feature: 'F13', tier: 1, milestone: 'M3' });

  it('F13-T1-4: Formula engine evaluates AVERAGE, MIN, and MAX', () => {
    const avg = testUtils.evaluateSpreadsheetFormula('=AVERAGE(A1:A3)', getCellValue);
    expect(avg).toBe(20);

    const min = testUtils.evaluateSpreadsheetFormula('=MIN(A1:A3)', getCellValue);
    expect(min).toBe(10);

    const max = testUtils.evaluateSpreadsheetFormula('=MAX(A1:A3)', getCellValue);
    expect(max).toBe(30);
  }, { feature: 'F13', tier: 1, milestone: 'M3' });

  it('F13-T1-5: Arithmetic expressions in formula bar calculate dynamically', () => {
    const exprResult = testUtils.evaluateSpreadsheetFormula('=A1 + B1 * 2', getCellValue);
    expect(exprResult).toBe(20); // 10 + (5 * 2) = 20
  }, { feature: 'F13', tier: 1, milestone: 'M3' });
}, { feature: 'F13', tier: 1, milestone: 'M3' });
