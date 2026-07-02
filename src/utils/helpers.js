export function unwrapList(res) {
  const lista = res?.data ?? res ?? []
  return Array.isArray(lista) ? lista : []
}

export function getEntityId(entity) {
  if (!entity) return ''
  if (typeof entity === 'string' || typeof entity === 'number') return String(entity)
  return String(entity._id ?? entity.id ?? '')
}

export function validadeLabel(validade) {
  return validade === 'valido' ? 'Válido' : 'Inválido'
}

export function validadeClass(validade) {
  return validade === 'valido'
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-rose-50 text-rose-700'
}
