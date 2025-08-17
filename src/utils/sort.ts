export function compareValues(a: any, b: any): number {
  // Normalize
  const va = a ?? null;
  const vb = b ?? null;

  // Nulls last
  if (va === null && vb === null) return 0;
  if (va === null) return 1;
  if (vb === null) return -1;

  // Dates
  if (va instanceof Date || vb instanceof Date) {
    const na = va instanceof Date ? va.getTime() : new Date(va).getTime();
    const nb = vb instanceof Date ? vb.getTime() : new Date(vb).getTime();
    return na - nb;
  }

  // Numbers/booleans
  if (typeof va === "number" && typeof vb === "number") return va - vb;
  if (typeof va === "boolean" && typeof vb === "boolean") return (va ? 1 : 0) - (vb ? 1 : 0);

  // Fallback to string compare
  return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" });
}
