<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/services/api'
import { getEntityId, unwrapList } from '@/utils/helpers'

import TableLayout from '@/components/layout/TableLayout.vue'
import BasePageHeader from '@/components/layout/BasePageHeader.vue'

import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import BaseEmptyState from '@/components/ui/BaseEmptyState.vue'

const router = useRouter()

const ruas = ref([])
const search = ref('')
const loading = ref(false)

const currentPage = ref(1)
const itemsPerPage = 10

const loadRuas = async () => {
  loading.value = true

  try {
    ruas.value = unwrapList(await api.getRuas()).sort((a, b) =>
      (a.rua || '').localeCompare(b.rua || '', 'pt')
    )
  } catch (error) {
    console.error(error)
    ruas.value = []
  } finally {
    loading.value = false
  }
}

const getFreguesia = (rua) =>
  rua?.freguesia?.freguesia ??
  rua?.freguesia?.nome ??
  rua?.freguesia ??
  '-'

const filteredRuas = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) return ruas.value

  return ruas.value.filter((rua) =>
    [
      rua.rua,
      rua.coordenada,
      getFreguesia(rua)
    ]
      .filter(Boolean)
      .some(value =>
        value.toString().toLowerCase().includes(term)
      )
  )
})

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredRuas.value.length / itemsPerPage)
  )
)

const paginatedRuas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  return filteredRuas.value.slice(
    start,
    start + itemsPerPage
  )
})

watch(search, () => {
  currentPage.value = 1
})

watch(totalPages, pages => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

onMounted(loadRuas)
</script>

<template>
  <TableLayout>
    <BasePageHeader
      title="Gestão de Ruas"
      subtitle="Consulta e gestão de ruas registadas"
    >
      <BaseButton @click="router.push('/ruas/nova')">
        + Nova Rua
      </BaseButton>
    </BasePageHeader>

    <BaseCard class="flex-1">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <BaseInput
          v-model="search"
          placeholder="Pesquisar rua, freguesia ou coordenada..."
        />
      </div>

      <BaseLoader
        v-if="loading"
        text="A carregar ruas..."
      />

      <template v-else-if="filteredRuas.length">
        <BaseTable>
          <template #head>
            <tr>
              <th class="table-cell text-left">
                Rua
              </th>

              <th class="table-cell text-left">
                Coordenada
              </th>

              <th class="table-cell text-left">
                Freguesia
              </th>

              <th class="table-cell text-right">
                Ações
              </th>
            </tr>
          </template>

          <tr
            v-for="rua in paginatedRuas"
            :key="getEntityId(rua)"
          >
            <td class="table-cell font-medium text-slate-800">
              {{ rua.rua }}
            </td>

            <td class="table-cell font-mono text-xs text-slate-500">
              {{ rua.coordenada || '-' }}
            </td>

            <td class="table-cell text-slate-600">
              {{ getFreguesia(rua) }}
            </td>

            <td class="table-cell text-right">
              <BaseButton
                variant="secondary"
                @click="router.push(`/ruas/${getEntityId(rua)}/editar`)"
              >
                Editar
              </BaseButton>
            </td>
          </tr>

          <template #pagination>
            <BasePagination
              v-model:currentPage="currentPage"
              :totalPages="totalPages"
            />
          </template>
        </BaseTable>
      </template>

      <BaseEmptyState
        v-else
        title="Nenhuma rua encontrada"
        description="Experimente alterar a pesquisa ou criar uma nova rua."
      />
    </BaseCard>
  </TableLayout>
</template>