<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import {
  getEntityId,
  unwrapList,
  validadeClass,
  validadeLabel
} from '@/utils/helpers'

import TableLayout from '@/components/layout/TableLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const router = useRouter()
const auth = useAuthStore()

const processos = ref([])
const search = ref('')
const loading = ref(false)

const currentPage = ref(1)
const itemsPerPage = 10

const normalizeProcesso = (p) => ({
  ...p,
  id: getEntityId(p),
  tipo: p.tipoPublicidade?.publicidade || p.tipo_publicidade?.publicidade || '-',
  ruaNome: p.rua?.rua || p.rua?.nome || '-'
})

const loadProcessos = async () => {
  loading.value = true

  try {
    processos.value = unwrapList(await api.getProcessos()).map(normalizeProcesso)
  } catch (error) {
    console.error(error)
    processos.value = []
  } finally {
    loading.value = false
  }
}

const filteredProcessos = computed(() => {
  const term = search.value.toLowerCase().trim()

  return processos.value.filter((p) =>
    [p.processo, p.alvara, p.ruaNome, p.tipo, p.user?.name]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term))
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredProcessos.value.length / itemsPerPage)
)

const paginatedProcessos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  return filteredProcessos.value.slice(
    start,
    start + itemsPerPage
  )
})

watch(search, () => {
  currentPage.value = 1
})

onMounted(loadProcessos)
</script>

<template>
  <TableLayout>
    <BasePageHeader
      title="Gestão de Processos"
      subtitle="Consulta e gestão de processos ativos"
    >
      <BaseButton @click="router.push('/processos/novo')">
        + Novo Processo
      </BaseButton>
    </BasePageHeader>

    <BaseCard class="flex-1">
      <div class="border-b border-slate-200 p-4">
        <BaseInput
          v-model="search"
          placeholder="Pesquisar processo, rua ou publicidade..."
        />
      </div>

      <div
        v-if="loading"
        class="py-10 text-center text-slate-500"
      >
        A carregar processos...
      </div>

      <div
        v-else-if="filteredProcessos.length"
        class="flex flex-1 flex-col overflow-hidden"
      >
        <div class="flex-1 overflow-y-auto overflow-x-auto">
          <table class="responsive-table">
            <thead class="table-head sticky top-0 z-10 bg-white">
              <tr>
                <th class="table-cell text-left">Processo</th>
                <th class="table-cell text-left">Alvará</th>
                <th class="table-cell text-left">Publicidade</th>
                <th class="table-cell text-left">Rua</th>
                <th class="table-cell text-left">Estado</th>
                <th class="table-cell text-right">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="p in paginatedProcessos"
                :key="p.id"
                class="transition hover:bg-slate-50"
              >
                <td class="table-cell text-slate-900">
                  {{ p.processo }}
                </td>

                <td class="table-cell text-slate-600">
                  {{ p.alvara || '-' }}
                </td>

                <td class="table-cell text-slate-600">
                  {{ p.tipo }}
                </td>

                <td class="table-cell text-slate-600">
                  {{ p.ruaNome }}
                </td>

                <td class="table-cell">
                  <span
                    class="status-badge"
                    :class="validadeClass(p.validade)"
                  >
                    {{ validadeLabel(p.validade) }}
                  </span>
                </td>

                <td class="table-cell text-right">
                  <BaseButton
                    v-if="auth.isAdmin"
                    variant="secondary"
                    @click="router.push(`/processos/${p.id}/editar`)"
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
          Nenhum processo encontrado
        </p>

        <p class="mt-1 text-sm">
          Tenta alterar a pesquisa.
        </p>
      </div>
    </BaseCard>
  </TableLayout>
</template>