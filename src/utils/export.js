// src/utils/export.js

/**
 * Exporta dados para CSV
 */
export function exportToCSV(data, filename = 'dados') {
  // Converte array de objetos para CSV
  const headers = Object.keys(data[0])
  const csvRows = []

  // Header
  csvRows.push(headers.join(','))

  // Dados
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      // Escapa vírgulas e aspas
      const escaped = ('' + value).replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }

  // Cria blob e download
  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

/**
 * Exporta dados para JSON
 */
export function exportToJSON(data, filename = 'dados') {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  downloadBlob(blob, `${filename}.json`)
}

/**
 * Exporta tabela para texto simples
 */
export function exportToTXT(data, filename = 'dados') {
  const headers = Object.keys(data[0])
  let txtContent = headers.join('\t') + '\n'
  
  for (const row of data) {
    const values = headers.map(header => row[header])
    txtContent += values.join('\t') + '\n'
  }

  const blob = new Blob([txtContent], { type: 'text/plain' })
  downloadBlob(blob, `${filename}.txt`)
}

/**
 * Gera PDF simples (sem bibliotecas externas)
 * Nota: Para PDF mais complexos, use jsPDF
 */
export function exportToPDF(data, filename = 'dados') {
  // Converte para HTML e usa print
  const headers = Object.keys(data[0])
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 12px; 
          text-align: left; 
        }
        th { 
          background-color: #4f46e5; 
          color: white; 
          font-weight: bold;
        }
        tr:nth-child(even) { 
          background-color: #f9fafb; 
        }
        h1 {
          color: #1e293b;
          margin-bottom: 10px;
        }
        .meta {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <h1>${filename}</h1>
      <div class="meta">Gerado em: ${new Date().toLocaleDateString('pt-PT', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</div>
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${h.toUpperCase()}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(h => `<td>${row[h]}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `

  // Abre em nova janela e imprime
  const printWindow = window.open('', '', 'height=600,width=800')
  printWindow.document.write(html)
  printWindow.document.close()
  
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

/**
 * Helper para fazer download de blob
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Formata dados de processos para exportação
 */
export function formatProcessosForExport(processos) {
  return processos.map(p => ({
    'ID': p.id,
    'Usuário': p.usuario,
    'Email': p.email,
    'Status': p.status.toUpperCase(),
    'Data': new Date(p.data).toLocaleDateString('pt-PT')
  }))
}