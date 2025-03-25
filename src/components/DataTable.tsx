"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]; // Column definitions
  data: TData[]; // Table data
  title?: string; // Optional title for the table
  onRowClick?: (row: TData) => void; // Optional row click handler
  onSearch?: (query: string) => void; // Search handler
  downloadCSV?: boolean; // Optional flag to show CSV download button
}

export function DataTable<TData>({
  columns,
  data,
  title,
  onRowClick,
  onSearch,
  downloadCSV = true, // Default to showing download button
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Helper function to get the correct accessor for CSV generation
  const getAccessorForColumn = (column: ColumnDef<TData>) => {
    //@ts-ignore
    if (column.accessorKey) {
      //@ts-ignore
      return column.accessorKey; // Use accessorKey directly if it's defined
    }

    // Default fallback for columns without accessorKey
    return (column.header as string).toLowerCase().replace(/\s+/g, '');
  };

  // Function to generate CSV content dynamically
  const generateCSV = () => {
    const headers = columns.map((col) => col.header ?? "");
    const rows = data.map((row) =>
      columns.map((col) => {
        const accessor = getAccessorForColumn(col);
        const cell = row[accessor as keyof TData]; // Access the row data using the accessor
        return cell ? cell : "";
      })
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ]
      .map((e) => e.replace(/\n/g, "").replace(/\r/g, "")) // Remove line breaks
      .join("\n");

    return csvContent;
  };

  const downloadCSVFile = () => {
    const csvData = generateCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title ?? "table"}.csv`;
    link.click();
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4">
        {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
        <div className="flex items-center space-x-2">
          {onSearch && (
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
              onChange={(e) => onSearch(e.target.value)}
            />
          )}
          {/* Conditionally render the download CSV button */}
          {downloadCSV && (
            <button
              onClick={downloadCSVFile}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Download CSV
            </button>
          )}
        </div>
      </div>

      <Table className="w-full table-auto shadow-sm bg-slate-100">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-4 text-left text-sm font-medium text-gray-600 bg-gray-500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-4 text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-gray-500"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
