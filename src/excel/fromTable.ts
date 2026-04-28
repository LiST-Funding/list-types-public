import { Workbook, Worksheet, Buffer as ExcelBuffer, Column, Cell } from 'exceljs';
import { ListCellParams, ExcelFileHeaderParams, ExcelFileParams, ExcelFileAlign, ListCellValue, ListWorkbookSheet, RichTextHeaderPart } from './types';
import { DEFAULTS } from './constants';
import { ListTable } from './types';
import { applyCellStyles, buildHeaderData, hexToArgb } from './utils';

/** @deprecated Legacy single-sheet helper. Use `docFromTables` instead. */
export function docFromTable(table: ListTable, title: string, opts: { autoFilter?: boolean } = {}) {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet(title);
    table.rows.map(row => {
        for (const cellKey in row) {
            const cell = row[cellKey];
            if (typeof cell === 'string') {
                row[cellKey] = { value: '' + cell, type: 'number' } as ListCellParams;
            }
            if (typeof cell === 'number') {
              row[cellKey] = { value: '' + cell, type: 'number' } as ListCellParams;
            }
            if (cell instanceof Date) {
              row[cellKey] = { value: cell.toISOString(), type: 'date' } as ListCellParams;
            }
        }
        return row;
    });
    const sortedHeaders = addHeaders(sheet, Object.keys(table.headers).map(header => ({ index: table.headers[header].index, key: header, value: table.headers[header].label, width: table.headers[header].width, bgColor: 'blue', color: 'white' })));
    const orderedRows = table.rows.map(row => sortedHeaders.map(header => row[header.key] as ListCellParams));
    addRows(sheet, orderedRows);
    Object.keys(table.headers).forEach((header, index) => {
    if (table.headers[header].width) {
          sheet.getColumn(index + 1).width = pxToExcelWidth(table.headers[header].width ?? 150);
      } else {
          autoFitColumns(sheet.getColumn(index + 1), table.headers[header].label);
      }
    });
    // Opt-in: Excel's native header-row filter dropdowns across all columns.
    if (opts.autoFilter) {
        const headerCount = Object.keys(table.headers).length;
        const lastRow = sheet.lastRow?.number ?? 1;
        if (headerCount > 0 && lastRow >= 1) {
            sheet.autoFilter = {
                from: { row: 1, column: 1 },
                to: { row: lastRow, column: headerCount },
            };
        }
    }
    return workbook.xlsx.writeBuffer();
}

export function docFromTables(sheets: ListWorkbookSheet[]) {
  if (!sheets.length) throw new Error('docFromTables requires at least one sheet');
  const workbook = new Workbook();
  sheets.forEach(({ title, table, richTextHeaders }) => {
    const sheet = workbook.addWorksheet(title);
    populateSheetFromTable(sheet, table);
    if (richTextHeaders?.length) {
      addRichTextHeader(sheet, richTextHeaders, Object.keys(table.headers).length);
    }
  });
  return workbook.xlsx.writeBuffer();
}

function pxToExcelWidth(px: number): number {
  return (px - 5) / 7;
}

function autoFitColumns(column: Column, text: string, minimalWidth = 10) {
  column.width = Math.max(text.length + 2, minimalWidth);
}

function getCellTextLength(value: string | number): number {
  return String(value)
    .split('\n')
    .reduce((maxLength, line) => Math.max(maxLength, line.length), 0);
}

function getAutoFitColumnWidth(maxTextLength: number, minimalWidth = 10, maximalWidth = 60): number {
  return Math.min(Math.max(maxTextLength + 2, minimalWidth), maximalWidth);
}

function addHeaders(sheet: Worksheet, headers: ExcelFileHeaderParams[]): ExcelFileHeaderParams[] {
  const { headersData, headerIndexes, sortedHeaders } = buildHeaderData(headers);
  sheet.columns = headersData;
  const headerRow = sheet.getRow(1);
  let lastParams = headers[0];
  headerRow.eachCell({ includeEmpty: true }, (cell: Cell, index: number) => {
    const colIndex = headerIndexes[index];
    const params = headers[colIndex] ?? lastParams;
    if (!params) {
      return;
    }
    applyCellStyles(cell, params);
    lastParams = params;
  });
  headerRow.height = DEFAULTS.ROW.HEIGHT;
  return sortedHeaders;
}

function addRows(sheet: Worksheet, rows: ListCellParams[][]): void {
  rows.forEach(cells => {
    const rowData = cells.map(({ value }) => value);
    const row = sheet.addRow(rowData);
    row.eachCell((cell: Cell, colIndex: number) => {
      if (cells[colIndex - 1]?.numFmt) {
        cell.numFmt = cells[colIndex - 1]?.numFmt || '';
      }
      const params = cells[colIndex - 1];
      if (!params) {
        return;
      }
      applyCellStyles(cell, params);
    });
    row.height = DEFAULTS.ROW.HEIGHT;
  });
}

function normalizeCell(cell: ListCellValue): ListCellParams {
  if (cell === null || cell === undefined) {
    return { value: '' };
  }
  if (typeof cell === 'string' || typeof cell === 'number') {
    return { value: cell };
  }
  if (cell instanceof Date) {
    return { value: cell.toISOString() };
  }
  return cell;
}

function applyZebraStriping(cell: ListCellParams, rowIndex: number): ListCellParams {
  if (rowIndex % 2 === 1 && !cell.bgColor) {
    return { ...cell, bgColor: DEFAULTS.ZEBRA.BG_COLOR };
  }
  return cell;
}

function countRichTextHeaderLines(parts: RichTextHeaderPart[]): number {
  const text = parts.map(part => part.text).join('');
  return Math.max(text.split('\n').length, 1);
}

function addRichTextHeader(sheet: Worksheet, richTextHeaders: RichTextHeaderPart[], columnCount: number): void {
  const safeColumnCount = Math.max(columnCount, 1);
  sheet.spliceRows(1, 0, []);
  sheet.mergeCells(1, 1, 1, safeColumnCount);

  const cell = sheet.getCell(1, 1);
  cell.value = {
    richText: richTextHeaders.map(part => ({
      text: part.text,
      font: part.font
        ? {
            ...part.font,
            color: part.font.color ? { argb: hexToArgb(part.font.color) } : undefined,
          }
        : undefined,
    })),
  };
  cell.alignment = {
    horizontal: 'left',
    vertical: 'middle',
    wrapText: true,
  };
  sheet.getRow(1).height = countRichTextHeaderLines(richTextHeaders) * 22;
}

function populateSheetFromTable(sheet: Worksheet, table: ListTable): void {
  const sortedHeaders = addHeaders(
    sheet,
    Object.keys(table.headers).map(header => ({
      index: table.headers[header].index,
      key: header,
      value: table.headers[header].label,
      width: table.headers[header].width,
      bgColor: 'blue',
      color: 'black',
      bold: true,
    }))
  );

  const autoFitTextLengths = sortedHeaders.map(header => getCellTextLength(header.value));
  const orderedRows = table.rows.map((row, rowIndex) =>
    sortedHeaders.map((header, columnIndex) => {
      const cell = applyZebraStriping(normalizeCell(row[header.key]), rowIndex);
      autoFitTextLengths[columnIndex] = Math.max(
        autoFitTextLengths[columnIndex],
        getCellTextLength(cell.value),
      );
      return cell;
    })
  );

  addRows(sheet, orderedRows);

  sortedHeaders.forEach((header, index) => {
    if (header.width) {
      sheet.getColumn(index + 1).width = pxToExcelWidth(header.width);
    } else {
      sheet.getColumn(index + 1).width = getAutoFitColumnWidth(autoFitTextLengths[index]);
    }
  });
}

export function createDocument({
  title,
  headers,
  rows,
}: ExcelFileParams): Promise<ExcelBuffer> {
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet(title);
  addHeaders(sheet, headers);
  addRows(sheet, rows);
  return workbook.xlsx.writeBuffer();
}
