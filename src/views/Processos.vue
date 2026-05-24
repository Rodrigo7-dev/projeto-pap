<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

import BaseLayout from '@/components/layout/BaseLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePageHeader from '@/components/layout/BasePageHeader.vue'

const router = useRouter()
const auth = useAuthStore()

const processos = ref([])
const search = ref('')
const loading = ref(false)

const normalizeProcesso = (p) => ({
  ...p,

  id: p._id || p.id,

  tipo:
    p.tipoPublicidade?.publicidade ||
    p.tipo_publicidade?.publicidade ||
    '-',

  ruaNome:
    p.rua?.rua ||
    '-',

  owner:
    String(
      p.user?._id ??
      p.user?.id ??
      p.user ??
      ''
    )
})

const loadProcessos = async () => {
  loading.value = true

  try {
    const res = await api.getProcessos()

    const lista =
      res?.data ??
      res ??
      []

    processos.value =
      Array.isArray(lista)
        ? lista.map(normalizeProcesso)
        : []

  } catch (error) {
    console.error(error)
    processos.value = []

  } finally {
    loading.value = false
  }
}

const filteredProcessos = computed(() => {
  const term =
    search.value
      .toLowerCase()
      .trim()

  return processos.value.filter((p) => {
    return [

      p.processo,

      p.alvara,

      p.ruaNome,

      p.tipo,

      p.user?.name

    ]
      .filter(Boolean)
      .some(value =>
        value
          .toLowerCase()
          .includes(term)
      )
  })
})

const canEdit = (p) => {
  if (auth.isAdmin) return true

  const current =
    String(
      auth.user?.id ??
      auth.user?._id ??
      ''
    )

  return p.owner === current
}

const editProcesso = (id) => {
  router.push(
    `/processos/${id}/editar`
  )
}

const formatEstado = (estado) => {
  return estado === 'valido'
    ? 'Válido'
    : 'Inválido'
}

const statusClass = (estado) => {
  return estado === 'valido'
    ? 'bg-green-50 text-green-700'
    : 'bg-red-50 text-red-700'
}

onMounted(loadProcessos)
</script>

<template>

<BaseLayout>

<BasePageHeader
title="Gestão de Processos"
subtitle="Consulta e gestão de processos ativos"
>

<BaseButton
@click="router.push('/processos/novo')"
>
+ Novo Processo
</BaseButton>

</BasePageHeader>

<BaseCard>

<!-- PESQUISA -->

<div class="p-4 border-b border-gray-200">

<BaseInput
v-model="search"
placeholder="Pesquisar processo, rua ou publicidade..."
/>

</div>

<!-- LOADING -->

<div
v-if="loading"
class="py-10 text-center text-gray-500"
>

A carregar processos...

</div>

<!-- TABELA -->

<div
v-else-if="filteredProcessos.length"
class="overflow-x-auto"
>

<table class="w-full text-sm">

<thead class="table-head">

<tr>

<th class="table-cell text-left">
Processo
</th>

<th class="table-cell text-left">
Alvará
</th>

<th class="table-cell text-left">
Publicidade
</th>

<th class="table-cell text-left">
Rua
</th>

<th class="table-cell text-left">
Estado
</th>

<th class="table-cell text-right">
Ações
</th>

</tr>

</thead>

<tbody class="divide-y divide-gray-100">

<tr
v-for="p in filteredProcessos"
:key="p.id"
class="hover:bg-gray-50 transition"
>

<td class="table-cell">
{{ p.processo }}
</td>

<td class="table-cell">
{{ p.alvara || '-' }}
</td>

<td class="table-cell">
{{ p.tipo }}
</td>

<td class="table-cell">
{{ p.ruaNome }}
</td>

<td class="table-cell">

<span
class="px-3 py-1 rounded-full text-xs"
:class="statusClass(p.validade)"
>

{{ formatEstado(p.validade) }}

</span>

</td>

<td class="table-cell text-right">

<BaseButton
v-if="canEdit(p)"
variant="secondary"
@click="editProcesso(p.id)"
>

Editar

</BaseButton>

</td>

</tr>

</tbody>

</table>

</div>

<!-- EMPTY -->

<div
v-else
class="empty-state"
>

<div class="text-4xl mb-2">
📄
</div>

<p class="font-medium text-gray-700">

Nenhum processo encontrado

</p>

<p class="text-sm">

Tenta alterar a pesquisa

</p>

</div>

</BaseCard>

</BaseLayout>

</template>