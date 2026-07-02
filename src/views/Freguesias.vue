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

const freguesias = ref([])
const search = ref('')
const loading = ref(false)

const loadFreguesias = async () => {
  loading.value = true

  try {
    freguesias.value = unwrapList(await api.getFreguesias())
  } catch (error) {
    console.error(error)
    freguesias.value = []
  } finally {
    loading.value = false
  }
}

const filteredFreguesias = computed(() => {
  const term = search.value.toLowerCase().trim()
  return freguesias.value.filter((f) =>
    (f.freguesia || '').toLowerCase().includes(term)
  )
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
        class="overflow-x-auto"
      >
        <table class="responsive-table">
          <thead class="table-head">
            <tr>
              <th class="table-cell text-left">Freguesia</th>
              <th class="table-cell text-right">Ações</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="f in filteredFreguesias"
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
        v-else
        class="empty-state"
      >
        <p class="font-medium text-slate-700">
          Nenhuma freguesia encontrada
        </p>
      </div>
    </BaseCard>
  </BaseLayout>
</template>
