// src/utils/export.js

function isEmpty(data) {
return !Array.isArray(data) || !data.length
}

function safe(value) {

if (
value === null ||
value === undefined
) {
return ''
}

return String(value)

}

function downloadBlob(blob, filename) {

const url =
URL.createObjectURL(blob)

const link =
document.createElement('a')

link.href = url
link.download = filename

document.body.appendChild(link)

link.click()

link.remove()

URL.revokeObjectURL(url)

}

export function exportToCSV(
data,
filename='dados'
){

if (
isEmpty(data)
) return

const headers =
Object.keys(data[0])

const rows =
[
headers.join(',')
]

for (
const row
of data
){

rows.push(

headers
.map(h => {

return `"${safe(
row[h]
).replaceAll(
'"',
'""'
)}"`

})
.join(',')

)

}

downloadBlob(

new Blob(
[rows.join('\n')],
{
type:
'text/csv;charset=utf-8'
}
),

`${filename}.csv`

)

}

export function exportToJSON(
data,
filename='dados'
){

downloadBlob(

new Blob(
[
JSON.stringify(
data,
null,
2
)
],
{
type:
'application/json'
}
),

`${filename}.json`

)

}

export function exportToTXT(
data,
filename='dados'
){

if (
isEmpty(data)
) return

const headers =
Object.keys(data[0])

const content =
[
headers.join('\t'),

...data.map(row =>

headers
.map(h =>
safe(row[h])
)
.join('\t')

)

].join('\n')

downloadBlob(

new Blob(
[content],
{
type:
'text/plain'
}
),

`${filename}.txt`

)

}

export function exportToPrint(
data,
filename='dados'
){

if (
isEmpty(data)
) return

const html = `

<html>

<head>

<title>${filename}</title>

</head>

<body>

<pre>

${safe(
JSON.stringify(
data,
null,
2
)
)}

</pre>

</body>

</html>

`

const win =
window.open()

if (
!win
) return

win.document.write(html)

win.document.close()

win.print()

}

export function formatProcessosForExport(
processos
){

return processos.map(p => ({

Processo:
p.processo,

Alvara:
p.alvara,

Rua:
p.rua?.rua
|| '',

Publicidade:
p.tipo_publicidade?.publicidade
|| '',

Estado:
p.validade
=== 'valido'
? 'Válido'
: 'Inválido'

}))

}