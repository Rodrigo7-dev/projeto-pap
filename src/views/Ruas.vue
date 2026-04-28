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

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-14">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full mb-3"></div>
        <p class="text-gray-600 text-sm">A carregar ruas...</p>
      </div>

      <!-- CARD -->
      <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        <!-- SEARCH -->
        <div class="p-4 border-b border-gray-100">
          <input 
            v-model="search" 
            placeholder="Pesquisar ruas ou freguesias..." 
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">

            <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4 text-left">Rua</th>
                <th class="px-6 py-4 text-left">Coordenada</th>
                <th class="px-6 py-4 text-left">Freguesia</th>
                <th class="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">

              <tr 
                v-for="r in filteredRuas" 
                :key="r.id"
                class="hover:bg-gray-50 transition"
              >

                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ r.rua }}
                </td>

                <td class="px-6 py-4 text-gray-500 font-mono text-xs">
                  {{ r.coordenada || 'N/D' }}
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ r.freguesia?.freguesia || r.freguesia || 'Sem Freguesia' }}
                </td>

                <td class="px-6 py-4 text-right space-x-2">

                  <button 
                    @click="editRua(r.id)" 
                    class="px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:bg-gray-100 transition"
                  >
                    Editar
                  </button>

                  <button 
                    @click="handleDelete(r.id, r.rua)" 
                    class="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            </tbody>
          </table>
        </div>

        <!-- EMPTY STATE -->
        <div 
          v-if="filteredRuas.length === 0" 
          class="text-center py-14 text-gray-500"
        >
          <div class="text-4xl mb-2">📍</div>
          <p class="font-medium text-gray-700">Nenhuma rua encontrada</p>
          <p class="text-sm">Tenta alterar a pesquisa</p>
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

const loading = ref(false)
const ruas = ref([])
const search = ref('')

const loadRuas = async () => {
  loading.value = true
  try {
    const res = await api.getRuas()

    // 🔥 igual aos outros componentes (processos/freguesias)
    const lista = res?.data ?? res ?? []
    ruas.value = Array.isArray(lista) ? lista : []

  } catch (error) {
    console.error('Erro ao carregar ruas:', error)
    ruas.value = []
  } finally {
    loading.value = false
  }
}

const filteredRuas = computed(() => {
  const t = search.value.toLowerCase()

  return ruas.value.filter(r => {
    const rua = (r.rua || '').toLowerCase()

    const freguesia =
      (r.freguesia?.freguesia || r.freguesia || '').toLowerCase()

    return rua.includes(t) || freguesia.includes(t)
  })
})

const editRua = (id) => {
  router.push(`/ruas/${id}/editar`)
}

const handleDelete = async (id, nome) => {
  if (!confirm(`Eliminar "${nome}"?`)) return

  try {
    await api.deleteRua(id)
    await loadRuas()
  } catch (error) {
    console.error(error)
    alert('Erro ao eliminar rua')
  }
}

onMounted(loadRuas)
</script>