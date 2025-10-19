import { ColumnDef, ColumnsFor, ListCellParams, ListCellValue } from "./types";

// ---------------- core types ----------------

export type CellGenerator<TRow> = (row: TRow) => ListCellValue;
type CellsFor<TRow, K extends readonly string[]> = { [P in K[number]]: CellGenerator<TRow> };

// ---------------- Table class ----------------
export class Table<TRow, K extends readonly string[]> {
  readonly keys: K;
  readonly columns: ColumnsFor<K>;
  readonly cells: CellsFor<TRow, K>;

  private constructor(keys: K, columns: ColumnsFor<K>, cells: CellsFor<TRow, K>) {
    this.keys = keys;
    this.columns = columns;
    this.cells = cells;
  }

  // 1) Build from a string array of headers (TS 4.8-friendly)
  static fromKeys<TRow, Keys extends readonly string[]>(
    keys: Keys,
    columns: { [P in Keys[number]]: ColumnDef },
    cells: { [P in Keys[number]]: CellGenerator<TRow> }
  ): Table<TRow, Keys> {
    return new Table(keys, columns as ColumnsFor<Keys>, cells as CellsFor<TRow, Keys>);
  }

  // 2) Build from a typed columns object (keys inferred)
  static fromColumns<TRow, TCols extends Record<string, ColumnDef>>(
    columns: TCols,
    cells: { [P in Extract<keyof TCols, string>]: CellGenerator<TRow> }
  ): Table<TRow, ReadonlyArray<Extract<keyof TCols, string>>> {
    const keys = Object.keys(columns) as unknown as ReadonlyArray<Extract<keyof TCols, string>>;
    return new Table(
      keys,
      columns as unknown as { [P in Extract<keyof TCols, string>]: ColumnDef },
      cells   as unknown as { [P in Extract<keyof TCols, string>]: CellGenerator<TRow> }
    );
  }
  

  // 2b) Same as fromKeys, but restrict headers to keyof TRow
  static fromRowKeys<TRow, Keys extends readonly (keyof TRow & string)[]>(
    keys: Keys,
    columns: { [P in Keys[number]]: ColumnDef },
    cells: { [P in Keys[number]]: CellGenerator<TRow> }
  ): Table<TRow, Keys> {
    return new Table(keys, columns as ColumnsFor<Keys>, cells as CellsFor<TRow, Keys>);
  }

  // Build a row of values for export/rendering
  buildRow(row: TRow): Record<K[number], ListCellValue> {
    const out = {} as Record<K[number], ListCellValue>;
    for (const k of this.keys) {
      out[k as K[number]] = this.cells[k as K[number]](row);
    }
    return out;
  }

  // Optional: plain header list (choose whether to include labels)
  headerList(includeLabels = true): string[] {
    return (this.keys as readonly string[]).map((k) => {
      const c = this.columns[k as K[number]];
      return includeLabels && c?.label ? `${k} ${c.label}` : String(k);
    });
  }

  buildTable(rows: TRow[]) {
    return {
      headers: this.columns,
      rows: rows.map((r) => this.buildRow(r)), // bind to keep `this`
    };
  }
}
