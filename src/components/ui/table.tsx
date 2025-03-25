"use client";

interface TableCellProps {
  children: React.ReactNode;
  colSpan?: number; // Make colSpan optional
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // Allow onClick to be passed to TableRow
}

export const Table = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <table className={`min-w-full ${className}`}>{children}</table>
);

export const TableHeader = ({ children }: { children: React.ReactNode; className?: string }) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableRow = ({ children, className, onClick }: TableRowProps) => (
  <tr className={`border-b ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
    {children}
  </tr>
);

export const TableHead = ({ children }: { children: React.ReactNode; className?: string }) => (
  <th className="py-2 px-4 text-left">{children}</th>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

export const TableCell = ({ children, colSpan, className }: TableCellProps) => (
  <td colSpan={colSpan} className={className}>
    {children}
  </td>
);
