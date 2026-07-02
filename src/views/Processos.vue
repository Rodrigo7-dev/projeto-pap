<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { getEntityId, unwrapList, validadeClass, validadeLabel } from '@/utils/helpers'

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
  id: getEntityId(p),
  tipo: p.tipoPublicidade?.publicidade || p.tipo_publicidade?.publicidade || '-',
  ruaNome: p.rua?.rua || p.rua?.nome || '-',
  owner: getEntityId(p.user)
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

const canEdit = (p) => {
  if (auth.isAdmin) return true
  return p.owner === getEntityId(auth.user)
}

onMounted(loadProcessos)
</script>

<template>
  <BaseLayout>
    <BasePageHeader
      title="Gestão de Processos"
      subtitle="Consulta e gestão de processos ativos"
    >
      <BaseButton @click="router.push('/processos/novo')">
        + Novo Processo
      </BaseButton>
    </BasePageHeader>

    <BaseCard>
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
        class="overflow-x-auto"
      >
        <table class="responsive-table">
          <thead class="table-head">
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
              v-for="p in filteredProcessos"
              :key="p.id"
              class="transition hover:bg-slate-50"
            >
              <td class="table-cell font-medium text-slate-900">
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
                  v-if="canEdit(p)"
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
  </BaseLayout>
</template>
