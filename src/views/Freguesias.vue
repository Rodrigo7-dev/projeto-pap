<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

import api from '@/services/api'
import { getEntityId, unwrapList } from '@/utils/helpers'

import BaseLayout from '@/components/layout/BaseLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
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
  <BaseLayout>
  <BasePageHeader
  title="Gestão de Freguesias"
  subtitle="Consulta e gestão de freguesias registadas"
>
  <BaseButton @click="router.push('/freguesias/nova')">
    + Nova Freguesia
  </BaseButton>
</BasePageHeader>

  <div class="flex min-h-0 flex-1 flex-col">
    <BaseCard>
      <div class="border-b border-slate-200 p-4">
        <BaseInput
          v-model="search"
          placeholder="Pesquisar freguesias..."
        />
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
  <table class="responsive-table">
    <thead class="table-head sticky top-0 bg-white z-10">
      <tr>
        <th class="table-cell text-left">Freguesia</th>
        <th class="table-cell text-right">Ações</th>
      </tr>
    </thead>

    <tbody class="divide-y divide-slate-100">
      <tr
        v-for="f in paginatedFreguesias"
        :key="getEntityId(f)"
        class="hover:bg-slate-50"
      >
        <td class="table-cell font-medium text-slate-900">
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
  class="flex items-center justify-center gap-2 border-t border-slate-200 p-4"
>
  <BaseButton
    variant="secondary"
    :disabled="currentPage === 1"
    @click="currentPage--"
  >
    Anterior
  </BaseButton>

  <span>
    Página {{ currentPage }} de {{ totalPages }}
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
        <p class="font-medium text-slate-700">
          Nenhuma freguesia encontrada
        </p>
      </div>
    </BaseCard>
      </div>
  </BaseLayout>
</template>
