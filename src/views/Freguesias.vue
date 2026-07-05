<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/services/api'
import { getEntityId, unwrapList } from '@/utils/helpers'

import TableLayout from '@/components/layout/TableLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const router = useRouter()

const freguesias = ref([])
const search = ref('')
const loading = ref(false)

const currentPage = ref(1)
const itemsPerPage = 10

const loadFreguesias = async () => {
  loading.value = true

  try {
    freguesias.value = unwrapList(await api.getFreguesias()).sort((a, b) =>
      a.freguesia.localeCompare(b.freguesia, 'pt')
    )
  } catch (error) {
    console.error(error)
    freguesias.value = []
  } finally {
    loading.value = false
  }
}

const filteredFreguesias = computed(() => {
  const term = search.value.toLowerCase().trim()

  return freguesias.value.filter(f =>
    (f.freguesia || '').toLowerCase().includes(term)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredFreguesias.value.length / itemsPerPage)
)

const paginatedFreguesias = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  return filteredFreguesias.value.slice(start, start + itemsPerPage)
})

watch(search, () => {
  currentPage.value = 1
})

onMounted(loadFreguesias)
</script>

<template>
<TableLayout>

<BasePageHeader
title="Gestão de Freguesias"
subtitle="Consulta e gestão de freguesias registadas"
>

<BaseButton
@click="router.push('/freguesias/nova')"
>
+ Nova Freguesia
</BaseButton>

</BasePageHeader>

<BaseCard>

<div class="border-b bg-[#EEF5FB] px-6 py-5">

<div class="max-w-lg">

<BaseInput
v-model="search"
placeholder="Pesquisar freguesias..."
/>

</div>

</div>

<div
v-if="loading"
class="flex items-center justify-center py-16 text-slate-500"
>

A carregar...

</div>

<div
v-else-if="filteredFreguesias.length"
>

<div class="overflow-x-auto">

<table class="responsive-table">

<thead class="table-head">

<tr>

<th class="table-cell text-left">
Freguesia
</th>

<th class="table-cell text-right">
Ações
</th>

</tr>

</thead>

<tbody>

<tr
v-for="f in paginatedFreguesias"
:key="getEntityId(f)"
class="table-row"
>

<td class="table-cell text-slate-700">

{{ f.freguesia }}

</td>

<td class="table-cell text-right">

<BaseButton
variant="secondary"
@click="router.push(`/freguesias/${getEntityId(f)}/editar`)"
>

Editar

</BaseButton>

</td>

</tr>

</tbody>

</table>

</div>

<div
v-if="totalPages > 1"
class="flex flex-col items-center justify-between gap-4 border-t bg-slate-50 px-6 py-5 sm:flex-row"
>

<BaseButton
variant="secondary"
:disabled="currentPage === 1"
@click="currentPage--"
>

← Anterior

</BaseButton>

<div class="text-sm text-slate-600">

Página

<span class="font-bold text-[#0F4C81]">
{{ currentPage }}
</span>

de

<span class="font-bold">
{{ totalPages }}
</span>

</div>

<BaseButton
variant="secondary"
:disabled="currentPage === totalPages"
@click="currentPage++"
>

Seguinte →

</BaseButton>

</div>

</div>

<div
v-else
class="empty-state"
>

<h2 class="text-lg font-semibold">

Nenhuma freguesia encontrada

</h2>

<p class="mt-2">

Experimente alterar a pesquisa ou criar uma nova freguesia.

</p>

</div>

</BaseCard>

</TableLayout>
</template>