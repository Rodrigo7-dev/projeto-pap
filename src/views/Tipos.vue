<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/services/api'
import { getEntityId, unwrapList } from '@/utils/helpers'

import BaseLayout from '@/components/layout/BaseLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePageHeader from '@/components/layout/BasePageHeader.vue'

const router = useRouter()

const tipos = ref([])
const search = ref('')
const loading = ref(false)

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
    (tipo.publicidade || tipo.tipo || '').toLowerCase().includes(term)
  )
})

onMounted(loadTipos)
</script>

<template>
  <BaseLayout>
    <BasePageHeader
      title="Tipos de Publicidade"
      subtitle="Gestão dos tipos disponíveis no sistema"
    >
      <BaseButton @click="router.push('/tipos/novo')">
        + Novo Tipo
      </BaseButton>
    </BasePageHeader>

    <BaseCard>
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
        class="overflow-x-auto"
      >
        <table class="responsive-table">
          <thead class="table-head">
            <tr>
              <th class="table-cell text-left">Publicidade</th>
              <th class="table-cell text-right">Ações</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="tipo in filteredTipos"
              :key="getEntityId(tipo)"
              class="hover:bg-slate-50"
            >
              <td class="table-cell font-medium text-slate-900">
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
        v-else
        class="empty-state"
      >
        <p class="font-medium text-slate-700">
          Nenhum tipo encontrado
        </p>
      </div>
    </BaseCard>
  </BaseLayout>
</template>
