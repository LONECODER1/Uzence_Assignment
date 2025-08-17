import * as React from "react";

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  /** Which field in T to show (use when you just want to print a value) */
  key?: keyof T;
  /** Header text */
  header: string;
  /** Enable/disable sorting on this column */
  sortable?: boolean;
  /** Custom cell renderer. If present, it’s used instead of `key`. */
  render?: (row: T) => React.ReactNode;
  /** Optional accessor for sorting (useful with custom render) */
  sortAccessor?: (row: T) => string | number | boolean | Date | null | undefined;
  /** Optional column width/class */
  width?: string | number;
  className?: string;
}

/**
 * Your required props, plus two optional, practical additions:
 * - selectionMode?: "single" | "multiple" (default: "multiple")
 * - getRowId?: (row, index) => stable id for selection
 *
 * If you *must* stick to the exact original interface, just ignore these two.
 */
export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;

  // optional but recommended:
  selectionMode?: "single" | "multiple";
  getRowId?: (row: T, index: number) => string | number;
  /** Optional custom empty state node */
  emptyState?: React.ReactNode;
  className?: string;
}
