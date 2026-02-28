export const exportToCSV = (data: Record<string, any>[], filename: string, columns?: { key: string; label: string }[]) => {
  if (data.length === 0) return;
  const cols = columns || Object.keys(data[0]).filter(k => k !== 'id' && !k.endsWith('_id') && k !== 'created_at' && k !== 'updated_at').map(k => ({ key: k, label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }));
  const header = cols.map(c => c.label).join(',');
  const rows = data.map(row => cols.map(c => {
    let val = row[c.key];
    if (val === null || val === undefined) val = '';
    if (typeof val === 'object') val = JSON.stringify(val);
    val = String(val).replace(/"/g, '""');
    return `"${val}"`;
  }).join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const flattenRow = (row: any, nested: Record<string, string> = {}) => {
  const flat: any = { ...row };
  for (const [key, field] of Object.entries(nested)) {
    flat[key] = row[key]?.[field] ?? row[key] ?? '';
    if (typeof flat[key] === 'object') {
      flat[key] = Object.values(flat[key]).filter(Boolean).join(' ');
    }
  }
  return flat;
};
