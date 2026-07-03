<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/services/api'
import { getEntityId, unwrapList } from '@/utils/helpers'

import TableLayout from '@/components/layout/TableLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePageHeader from '@/components/layout/BasePageHeader.vue'

const router = useRouter()

const ruas = ref([])
const search = ref('')
const loading = ref(false)

const currentPage = ref(1)
const itemsPerPage = 10

const loadRuas = async () => {
  loading.value = true

  try {
    ruas.value = unwrapList(await api.getRuas())
  } catch (error) {
    console.error(error)
    ruas.value = []
  } finally {
    loading.value = false
  }
}

const getFreguesia = (rua) =>
  rua?.freguesia?.freguesia ||
  rua?.freguesia?.nome ||
  rua?.freguesia ||
  '-'

const filteredRuas = computed(() => {
  const term = search.value.toLowerCase().trim()

  return ruas.value.filter((rua) =>
    (rua.rua || '').toLowerCase().includes(term) ||
    getFreguesia(rua).toLowerCase().includes(term) ||
    (rua.coordenada || '').toLowerCase().includes(term)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredRuas.value.length / itemsPerPage)
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
      <div class="border-b border-slate-200 p-4">
        <BaseInput
          v-model="search"
          placeholder="Pesquisar ruas..."
        />
      </div>

      <div
        v-if="loading"
        class="py-10 text-center text-slate-500"
      >
        A carregar...
      </div>

      <div
        v-else-if="filteredRuas.length"
        class="flex flex-1 flex-col overflow-hidden"
      >
        <div class="flex-1 overflow-y-auto overflow-x-auto">
          <table class="responsive-table">
            <thead class="table-head sticky top-0 z-10 bg-white">
              <tr>
                <th class="table-cell text-left">Rua</th>
                <th class="table-cell text-left">Coordenada</th>
                <th class="table-cell text-left">Freguesia</th>
                <th class="table-cell text-right">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="rua in paginatedRuas"
                :key="getEntityId(rua)"
                class="transition hover:bg-slate-50"
              >
                <td class="table-cell text-slate-900">
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
            </tbody>
          </table>
        </div>

        <div
          v-if="totalPages > 1"
          class="flex items-center justify-center gap-3 border-t border-slate-200 bg-white px-6 py-4"
        >
          <BaseButton
            variant="secondary"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            ← Anterior
          </BaseButton>

          <span class="text-sm text-slate-600">
            Página
            <span class="font-semibold text-slate-900">
              {{ currentPage }}
            </span>
            de
            <span class="font-semibold text-slate-900">
              {{ totalPages }}
            </span>
          </span>

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
        <p class="font-medium text-slate-700">
          Nenhuma rua encontrada
        </p>
      </div>
    </BaseCard>
  </TableLayout>
</template>