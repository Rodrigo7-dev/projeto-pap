<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">

      <!-- HEADER -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">
            Gestão de Ruas
          </h1>

          <p class="text-sm text-gray-500 mt-1">
            Consulta e gestão de ruas registadas
          </p>
        </div>

        <router-link
          to="/ruas/nova"
          class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          + Nova Rua
        </router-link>
      </div>

      <!-- CARD -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        <!-- SEARCH -->
        <div class="p-4 border-b border-gray-100">
          <input
            v-model="search"
            placeholder="Pesquisar ruas ou freguesias..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="text-center py-14 text-gray-500"
        >
          A carregar...
        </div>

        <!-- TABLE -->
        <div
          v-else-if="filteredRuas.length"
          class="overflow-x-auto"
        >
          <table class="w-full text-sm">

            <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4 text-left">
                  Rua
                </th>

                <th class="px-6 py-4 text-left">
                  Coordenada
                </th>

                <th class="px-6 py-4 text-left">
                  Freguesia
                </th>

                <th class="px-6 py-4 text-right">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">

              <tr
                v-for="rua in filteredRuas"
                :key="rua.id"
                class="hover:bg-gray-50 transition"
              >

                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ rua.rua }}
                </td>

                <td class="px-6 py-4 text-gray-500 text-xs font-mono">
                  {{ rua.coordenada || 'N/D' }}
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ getFreguesia(rua) }}
                </td>

                <td class="px-6 py-4 text-right">

                  <button
                    @click="editRua(rua.id)"
                    class="px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:bg-gray-100 transition"
                  >
                    Editar
                  </button>

                </td>

              </tr>

            </tbody>

          </table>
        </div>

        <!-- EMPTY -->
        <div
          v-else
          class="text-center py-14 text-gray-500"
        >
          <div class="text-4xl mb-2">
            📍
          </div>

          <p class="font-medium text-gray-700">
            Nenhuma rua encontrada
          </p>

          <p class="text-sm">
            Tenta alterar a pesquisa
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const ruas = ref([])
const search = ref('')
const loading = ref(false)

const loadRuas = async () => {
  loading.value = true

  try {
    const res = await api.getRuas()

    ruas.value =
      Array.isArray(res?.data)
        ? res.data
        : []

  } catch (e) {
    console.error(e)
    ruas.value = []
  }

  loading.value = false
}

const getFreguesia = (rua) => {
  return (
    rua?.freguesia?.freguesia ||
    rua?.freguesia ||
    'Sem Freguesia'
  )
}

const filteredRuas = computed(() => {
  const term = search.value.toLowerCase()

  return ruas.value.filter((rua) => {
    return (
      (rua.rua ?? '')
        .toLowerCase()
        .includes(term)

      ||

      getFreguesia(rua)
        .toLowerCase()
        .includes(term)
    )
  })
})

const editRua = (id) => {
  router.push(`/ruas/${id}/editar`)
}

onMounted(loadRuas)
</script>