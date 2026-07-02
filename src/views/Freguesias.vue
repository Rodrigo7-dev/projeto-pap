<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

import api from '@/services/api'
import { getEntityId, unwrapList } from '@/utils/helpers'

import BaseCard from '@/components/ui/BaseCard.vue'
import TableLayout from '@/components/layout/TableLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePageHeader from '@/components/layout/BasePageHeader.vue'

const router = useRouter()

const freguesias = ref([])
const search = ref('')
const loading = ref(false)

const loadFreguesias = async () => {
  loading.value = true

  try {
  freguesias.value = unwrapList(await api.getFreguesias()).sort((a, b) =>
    a.freguesia.localeCompare(b.freguesia, 'pt')
)  } catch (error) {
    console.error(error)
    freguesias.value = []
  } finally {
    loading.value = false
  }
}
const currentPage = ref(1)
const itemsPerPage = 10

const filteredFreguesias = computed(() => {
  const term = search.value.toLowerCase().trim()
  return freguesias.value.filter((f) =>
    (f.freguesia || '').toLowerCase().includes(term)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredFreguesias.value.length / itemsPerPage)
)

const paginatedFreguesias = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  return filteredFreguesias.value.slice(
    start,
    start + itemsPerPage
  )
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
  <BaseButton @click="router.push('/freguesias/nova')">
    + Nova Freguesia
  </BaseButton>
</BasePageHeader>

  <div class="flex min-h-0 flex-1 flex-col">
  <BaseCard class="flex-1">
      <div class="border-b border-slate-200 bg-slate-50/70 p-5">        
        <div class="max-w-md">
  <BaseInput
    v-model="search"
    placeholder="Pesquisar freguesias..."
  />
</div>
</div>
      <div
        v-if="loading"
        class="py-10 text-center text-slate-500"
      >
        A carregar...
      </div>

      <div
  v-else-if="filteredFreguesias.length"
  class="flex flex-1 flex-col overflow-hidden"
>
        <div class="flex-1 overflow-y-auto overflow-x-auto">
<table class="responsive-table border-collapse">
  <thead class="table-head sticky top-0 z-10 bg-slate-100 shadow-sm">      
  <tr>
        <th class="table-cell text-left">Freguesia</th>
        <th class="table-cell text-right">Ações</th>
      </tr>
    </thead>

    <tbody class="divide-y divide-slate-100">
      <tr
        v-for="f in paginatedFreguesias"
        :key="getEntityId(f)"
        class="transition-colors hover:bg-slate-50"      
        >
        <td class="table-cell font-semibold text-slate-800">
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
  class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4"
>
  <BaseButton
  variant="secondary"
  class="min-w-[90px]"
    :disabled="currentPage === 1"
    @click="currentPage--"
  >
    Anterior
  </BaseButton>

 <span class="text-sm font-medium text-slate-600">
  Página <strong>{{ currentPage }}</strong> de <strong>{{ totalPages }}</strong>
</span>

  <BaseButton
    variant="secondary"
    :disabled="currentPage === totalPages"
    @click="currentPage++"
  >
    Seguinte
  </BaseButton>
</div>
      </div>

      <div
        v-else
        class="empty-state"
      >
        <p class="text-lg font-semibold text-slate-700">
  Nenhuma freguesia encontrada
</p>

<p class="mt-2 text-sm text-slate-500">
  Tente alterar a pesquisa ou criar uma nova freguesia.
</p>
      </div>
    </BaseCard>
      </div>
    </TableLayout>
</template>
