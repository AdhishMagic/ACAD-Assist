import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "./EmptyState";

export function DataTable({ columns, rows, renderRow, emptyTitle, emptyDescription }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return <EmptyState title={emptyTitle || "No records"} description={emptyDescription} />;
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row.id || idx}>{renderRow(row)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
