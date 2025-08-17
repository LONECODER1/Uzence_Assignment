import * as React from "react";
import type { Column, DataTableProps, SortDirection } from "../props/DataTable.props";
import { compareValues } from "../utils/sort";

function useSortedData<T>(
  data: T[],
  columns: Column<T>[],
  sortKey: keyof T | null,
  sortDir: SortDirection
) {
  return React.useMemo(() => {
    if (!sortKey && !columns.some(c => c.sortAccessor)) return data;

    const activeColumn =
      columns.find(c => (c.key as keyof T | undefined) === sortKey) ??
      columns.find(c => c.sortAccessor && c.key === undefined && sortKey === null);

    if (!activeColumn || !sortDir) return data;

    const accessor =
      activeColumn.sortAccessor ??
      ((row: T) => (activeColumn.key ? (row as any)[activeColumn.key] : null));

    const copy = [...data];
    copy.sort((a, b) => {
      const cmp = compareValues(accessor(a), accessor(b));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [data, columns, sortKey, sortDir]);
}

export function DataTable<T>({
  data,
  columns,
  loading,
  selectable = false,
  onRowSelect,
  selectionMode = "multiple",
  getRowId,
  emptyState,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);

  const idOf = React.useCallback(
    (row: T, index: number) => (getRowId ? getRowId(row, index) : index),
    [getRowId]
  );

  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(new Set());

  const sorted = useSortedData<T>(data, columns, sortKey, sortDir);

  // When data changes, purge selections that no longer exist
  React.useEffect(() => {
    if (!selectable || selectedIds.size === 0) return;
    const valid = new Set(sorted.map(idOf).map((id, i) => idOf(sorted[i], i)));
    const next = new Set(Array.from(selectedIds).filter(id => valid.has(id)));
    if (next.size !== selectedIds.size) setSelectedIds(next);
  }, [sorted, selectable, selectedIds, idOf]);

  // Fire callback with selected rows
  React.useEffect(() => {
    if (!onRowSelect) return;
    const selectedRows: T[] = [];
    sorted.forEach((row, i) => {
      if (selectedIds.has(idOf(row, i))) selectedRows.push(row);
    });
    onRowSelect(selectedRows);
  }, [selectedIds, sorted, idOf, onRowSelect]);

  function toggleSort(col: Column<T>) {
    if (!col.sortable) return;
    const key = (col.key ?? null) as keyof T | null;

    // Cycle: null -> asc -> desc -> null
    setSortKey(prevKey => {
      if (prevKey !== key) {
        setSortDir("asc");
        return key;
      }
      setSortDir(prevDir => (prevDir === "asc" ? "desc" : prevDir === "desc" ? null : "asc"));
      return key;
    });
  }

  function isAllSelected() {
    if (!selectable || selectionMode !== "multiple") return false;
    if (sorted.length === 0) return false;
    let count = 0;
    sorted.forEach((row, i) => selectedIds.has(idOf(row, i)) && count++);
    return count === sorted.length;
  }

  function toggleAll() {
    if (!selectable || selectionMode !== "multiple") return;
    if (isAllSelected()) {
      setSelectedIds(new Set());
    } else {
      const next = new Set<string | number>();
      sorted.forEach((row, i) => next.add(idOf(row, i)));
      setSelectedIds(next);
    }
  }

  function toggleRow(row: T, index: number) {
    const id = idOf(row, index);
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (selectionMode === "single") {
        if (next.has(id)) {
          next.clear();
        } else {
          next.clear();
          next.add(id);
        }
        return next;
      }
      // multiple
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const headerSortState = (col: Column<T>): SortDirection => {
    if (!col.sortable) return null;
    return (col.key as keyof T | null) === sortKey ? sortDir : null;
  };

  return (
    <div className={`w-full overflow-x-auto ${className ?? ""}`}>
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-600">
            {selectable && selectionMode === "multiple" && (
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  aria-label={isAllSelected() ? "Deselect all rows" : "Select all rows"}
                  checked={isAllSelected()}
                  onChange={toggleAll}
                  className="h-4 w-4"
                />
              </th>
            )}
            {columns.map((col, idx) => {
              const sortState = headerSortState(col);
              const ariaSort =
                !col.sortable ? "none" :
                sortState === "asc" ? "ascending" :
                sortState === "desc" ? "descending" : "none";

              return (
                <th
                  key={idx}
                  scope="col"
                  style={{ width: col.width }}
                  className={`px-3 py-2 font-medium ${col.className ?? ""}`}
                  aria-sort={ariaSort as any}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col)}
                      className="inline-flex items-center gap-1 select-none"
                    >
                      <span>{col.header}</span>
                      <span aria-hidden="true" className="text-xs">
                        {sortState === "asc" ? "▲" : sortState === "desc" ? "▼" : "↕"}
                      </span>
                    </button>
                  ) : (
                    <span>{col.header}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Loading */}
        {loading ? (
          <tbody>
            {[...Array(3)].map((_, r) => (
              <tr key={`skeleton-${r}`} className="border-b">
                {selectable && selectionMode === "multiple" && (
                  <td className="px-3 py-3">
                    <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                  </td>
                )}
                {columns.map((_, c) => (
                  <td key={`sk-${r}-${c}`} className="px-3 py-3">
                    <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : sorted.length === 0 ? (
          // Empty
          <tbody>
            <tr>
              <td
                colSpan={columns.length + (selectable && selectionMode === "multiple" ? 1 : 0)}
                className="px-3 py-8 text-center text-gray-500"
              >
                {emptyState ?? "No records found"}
              </td>
            </tr>
          </tbody>
        ) : (
          // Data
          <tbody className="bg-white">
            {sorted.map((row, i) => {
              const id = idOf(row, i);
              const isSelected = selectedIds.has(id);
              return (
                <tr
                  key={String(id)}
                  className={`border-b hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}
                >
                  {selectable && selectionMode === "multiple" && (
                    <td className="px-3 py-2 align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        aria-label={`Select row ${i + 1}`}
                        checked={isSelected}
                        onChange={() => toggleRow(row, i)}
                      />
                    </td>
                  )}

                  {/* For single selection, make row clickable */}
                  {columns.map((col, ci) => {
                    const content =
                      col.render
                        ? col.render(row)
                        : col.key
                        ? (row as any)[col.key]
                        : null;

                    return (
                      <td
                        key={ci}
                        className={`px-3 py-2 align-middle ${col.className ?? ""} ${
                          selectable && selectionMode === "single" ? "cursor-pointer" : ""
                        }`}
                        onClick={
                          selectable && selectionMode === "single"
                            ? () => toggleRow(row, i)
                            : undefined
                        }
                      >
                        {content as React.ReactNode}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}

export default DataTable;
