import type { ReactNode } from "react";

type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
};

type DataTableProps<T> = {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
};

export function DataTable<T>({ caption, columns, rows, rowKey }: DataTableProps<T>) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header} className={column.align === "right" ? "align-right" : undefined}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.header} className={column.align === "right" ? "align-right" : undefined}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
