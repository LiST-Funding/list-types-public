export type ListCellValue = string | number | Date | ListCellParams;

export type ColumnDef = { label: string; width?: number; index?: number };
export type ColumnsFor<K extends readonly string[]> = { [P in K[number]]: ColumnDef };
export type ListTable = {
    headers: ColumnsFor<string[]>;
    rows: Record<string, ListCellValue>[];
}

export interface RichTextHeaderFont {
    bold?: boolean;
    size?: number;
    color?: string;
}

export interface RichTextHeaderPart {
    text: string;
    font?: RichTextHeaderFont;
}

export interface ListWorkbookSheet {
    title: string;
    table: ListTable;
    richTextHeaders?: RichTextHeaderPart[];
}

export interface ExcelFileParams {
    title: string;
    headers: ExcelFileHeaderParams[];
    rows: ListCellParams[][];
  }
  
  export interface ExcelFileHeaderParams extends ListCellParams {
    value: string;
    key: string;
    width?: number;
    colspan?: number;
    index?: number;
  }
  
  export interface ListCellParams {
    value: string | number;
    bgColor?: string;
    color?: string; 
    bold?: boolean;
    textAlign?: ExcelFileAlign;
    fontSize?: number;
    borderColor?: string;
    borderStyle?: 'thin' | 'medium' | 'thick' | 'double' | 'dotted' | 'dashed';
    width?: number;
    numFmt?: string;
  }
  
  export enum ExcelFileAlign {
    Left = 'left',
    Right = 'right',
    Center = 'center',
  }