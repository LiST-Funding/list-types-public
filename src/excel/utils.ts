import { Cell } from 'exceljs';
import { ExcelFileAlign, ExcelFileHeaderParams, ListCellParams } from './types';
import { DEFAULTS } from './constants';

const colorNamesHexMap: Record<string, string> = {
    white: 'FFFFFFFF',
    black: 'FF000000',
    red:   'FFFF0000',
    green: 'FF4CAF50',
    blue:  'FF3498DB',
    gray:  'FF808080',
    grey:  'FF808080',
    yellow:'FFFFBF00',
    orange:'FFFFA500',
    purple:'FF800080',
    pink:  'FFFFC0CB',
    transparent: '00000000',
};


export function hexToArgb(hex: string): string {
  if (colorNamesHexMap[hex]) {
    return colorNamesHexMap[hex];
  }
  hex = hex.replace(/^#/, "");
  if (hex.length === 6) {
    return "FF" + hex.toUpperCase();
  } else if (hex.length === 8) {
    return hex.toUpperCase();
  } else {
    console.error("Invalid hex color: " + hex);
    return '';
  }
}

export function getColNameFromIndex(n: number) {
  let s = "";
  while (n > 0) {
    n--;
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

export function applyCellStyles(cell: Cell, {
  bgColor,
  textAlign,
  fontSize,
  color,
  borderColor,
}: ListCellParams): void {
  if (bgColor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: hexToArgb(bgColor) },
    };
  }
  cell.alignment = { 
    horizontal: textAlign ?? ExcelFileAlign.Left,
    vertical: 'middle',
    wrapText: true,
  };
  cell.font = { 
    size: fontSize ?? DEFAULTS.FONT.SIZE, 
    color: { argb: hexToArgb(color ?? DEFAULTS.FONT.COLOR) } 
  };
  cell.border = {
    top: { style: 'thin', color: { argb: hexToArgb( borderColor ?? DEFAULTS.BORDER.COLOR ) } },
    left: { style: 'thin', color: { argb: hexToArgb( borderColor ?? DEFAULTS.BORDER.COLOR ) } },
    bottom: { style: 'thin', color: { argb: hexToArgb( borderColor ?? DEFAULTS.BORDER.COLOR ) } },
    right: { style: 'thin', color: { argb: hexToArgb( borderColor ?? DEFAULTS.BORDER.COLOR ) } }
  };
}

export function buildHeaderData(headers: ExcelFileHeaderParams[]) {
  const headersData: { header: string; key: string; width?: number; }[] = [];
  const headerIndexes: Record<number, number> = {};
  let actualIndex = 0;

  headers.forEach(({ key, width, value, colspan }, index) => {
    headerIndexes[actualIndex] = index;
    headersData.push({ header: value, key, width: width ?? DEFAULTS.COL.WIDTH });
    actualIndex++;
    if (colspan && colspan > 1) {
      for (let i = 1; i < colspan; i++) {
        headersData.push({ header: '', key: `${key}-${i}`, width: DEFAULTS.COL.WIDTH });
        actualIndex++;
      }
    }
  });
  return { headersData, headerIndexes };
}