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

const tipos = ref([])
const search = ref('')
const loading = ref(false)

const currentPage = ref(1)
const itemsPerPage = 10

const loadTipos = async () => {
  loading.value = true

  try {
    tipos.value = unwrapList(await api.getTipos())
  } catch (error) {
    console.error('Erro ao carregar tipos:', error)
    tipos.value = []
  } finally {
    loading.value = false
  }
}

const filteredTipos = computed(() => {
  const term = search.value.toLowerCase().trim()

  return tipos.value.filter((tipo) =>
    (tipo.publicidade || tipo.tipo || '')
      .toLowerCase()
      .includes(term)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredTipos.value.length / itemsPerPage)
)

const paginatedTipos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  return filteredTipos.value.slice(
    start,
    start + itemsPerPage
  )
})

watch(search, () => {
  currentPage.value = 1
})

onMounted(loadTipos)
</script>

<template>
  <TableLayout>
    <BasePageHeader
      title="Tipos de Publicidade"
      subtitle="Gestão dos tipos disponíveis no sistema"
    >
      <BaseButton @click="router.push('/tipos/novo')">
        + Novo Tipo
      </BaseButton>
    </BasePageHeader>

    <BaseCard class="flex-1">
      <div class="border-b border-slate-200 p-4">
        <BaseInput
          v-model="search"
          placeholder="Pesquisar tipos..."
        />
      </div>

      <div
        v-if="loading"
        class="py-10 text-center text-slate-500"
      >
        A carregar...
      </div>

      <div
        v-else-if="filteredTipos.length"
        class="flex flex-1 flex-col overflow-hidden"
      >
        <div class="flex-1 overflow-y-auto overflow-x-auto">
          <table class="responsive-table">
            <thead class="table-head sticky top-0 z-10 bg-white">
              <tr>
                <th class="table-cell text-left">Publicidade</th>
                <th class="table-cell text-right">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="tipo in paginatedTipos"
                :key="getEntityId(tipo)"
                class="transition hover:bg-slate-50"
              >
                <td class="table-cell text-slate-900">
                  {{ tipo.publicidade || tipo.tipo }}
                </td>

                <td class="table-cell text-right">
                  <BaseButton
                    variant="secondary"
                    @click="router.push(`/tipos/${getEntityId(tipo)}/editar`)"
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
          Nenhum tipo encontrado
        </p>
      </div>
    </BaseCard>
  </TableLayout>
</template>