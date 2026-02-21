// ============================================
// FleetFlow — Export Utilities (PDF & CSV)
// ============================================

export interface ExportColumn {
  key: string;
  header: string;
}

// Export data to CSV
export function exportToCSV<T extends object>(
  data: T[],
  columns: ExportColumn[],
  filename: string
): void {
  const headers = columns.map((col) => col.header).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = (row as Record<string, unknown>)[col.key];
        // Handle values with commas or quotes
        const strValue = String(value ?? "");
        if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      })
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");
  downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

// Export data to PDF (simple table format)
export function exportToPDF<T extends object>(
  data: T[],
  columns: ExportColumn[],
  title: string,
  filename: string
): void {
  // Generate HTML table for PDF
  const tableHeaders = columns.map((col) => `<th style="border: 1px solid #ddd; padding: 8px; background: #0066ff; color: white; text-align: left;">${col.header}</th>`).join("");
  
  const tableRows = data
    .map((row) => {
      const cells = columns
        .map((col) => `<td style="border: 1px solid #ddd; padding: 8px;">${(row as Record<string, unknown>)[col.key] ?? ""}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #0066ff; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead><tr>${tableHeaders}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="footer">
        <p>FleetFlow — Fleet & Logistics Management System</p>
        <p>Total Records: ${data.length}</p>
      </div>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

// Helper to download file
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export button component helper
export function getExportHandlers<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  title: string,
  filename: string
) {
  return {
    exportCSV: () => exportToCSV(data, columns, filename),
    exportPDF: () => exportToPDF(data, columns, title, filename),
  };
}
