<script setup>
import { computed, onMounted, ref } from 'vue'
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

const ruas = ref([])
const search = ref('')
const loading = ref(false)

const loadRuas = async () => {
  loading.value = true

  try {
    const res = await api.getRuas()
    const lista = res?.data ?? res ?? []
    ruas.value = Array.isArray(lista) ? lista : []
  } catch (error) {
    console.error(error)
    ruas.value = []
  } finally {
    loading.value = false
  }
}

const getFreguesia = (rua) => {
  return rua?.freguesia?.freguesia || rua?.freguesia?.nome || rua?.freguesia || '-'
}

const filteredRuas = computed(() => {
  const term = search.value.toLowerCase().trim()

  return ruas.value.filter((rua) => {
    return (
      (rua.rua || '').toLowerCase().includes(term) ||
      getFreguesia(rua).toLowerCase().includes(term) ||
      (rua.coordenada || '').toLowerCase().includes(term)
    )
  })
})

const editRua = (id) => {
  router.push(`/ruas/${id}/editar`)
}

onMounted(loadRuas)
</script>

<template>
  <BaseLayout>
    <BasePageHeader
      title="Gestão de Ruas"
      subtitle="Consulta e gestão de ruas registadas"
    >
      <BaseButton
        v-if="auth.isAdmin"
        @click="router.push('/ruas/nova')"
      >
        + Nova Rua
      </BaseButton>
    </BasePageHeader>

    <BaseCard>
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
        class="overflow-x-auto"
      >
        <table class="responsive-table">
          <thead class="table-head">
            <tr>
              <th class="table-cell text-left">Rua</th>
              <th class="table-cell text-left">Coordenada</th>
              <th class="table-cell text-left">Freguesia</th>
              <th
                v-if="auth.isAdmin"
                class="table-cell text-right"
              >
                Ações
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="rua in filteredRuas"
              :key="rua._id || rua.id"
              class="hover:bg-slate-50"
            >
              <td class="table-cell font-medium text-slate-900">
                {{ rua.rua }}
              </td>
              <td class="table-cell font-mono text-xs text-slate-500">
                {{ rua.coordenada || '-' }}
              </td>
              <td class="table-cell text-slate-600">
                {{ getFreguesia(rua) }}
              </td>
              <td
                v-if="auth.isAdmin"
                class="table-cell text-right"
              >
                <BaseButton
                  variant="secondary"
                  @click="editRua(rua._id || rua.id)"
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
          Nenhuma rua encontrada
        </p>
      </div>
    </BaseCard>
  </BaseLayout>
</template>
