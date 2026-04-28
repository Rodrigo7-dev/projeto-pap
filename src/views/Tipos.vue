<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">

      <!-- HEADER -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">
            Tipos de Publicidade
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Gestão dos tipos disponíveis no sistema
          </p>
        </div>

        <router-link 
          to="/tipos/novo" 
          class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          + Novo Tipo
        </router-link>
      </div>

      <!-- CARD -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        <!-- SEARCH -->
        <div class="p-4 border-b border-gray-100">
          <input 
            v-model="search" 
            placeholder="Pesquisar tipos..." 
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">

            <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4 text-left">Nome da Publicidade</th>
                <th class="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">

              <tr 
                v-for="t in filteredTipos" 
                :key="t.id"
                class="hover:bg-gray-50 transition"
              >

                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ t.publicidade || t.tipo }}
                </td>

                <td class="px-6 py-4 text-right space-x-2">

                  <button 
                    @click="editTipo(t.id)" 
                    class="px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:bg-gray-100 transition"
                  >
                    Editar
                  </button>

                  <button 
                    @click="handleDelete(t)" 
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
          v-if="filteredTipos.length === 0" 
          class="text-center py-14 text-gray-500"
        >
          <div class="text-4xl mb-2">📂</div>
          <p class="font-medium text-gray-700">Nenhum tipo encontrado</p>
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
const tipos = ref([])
const search = ref('')

const loadTipos = async () => {
  try {
    const res = await api.getTipos()

    // 🔥 padrão consistente com os outros
    const lista = res?.data ?? res ?? []
    tipos.value = Array.isArray(lista) ? lista : []

  } catch (error) {
    console.error(error)
    tipos.value = []
  }
}

const filteredTipos = computed(() => {
  const s = search.value.toLowerCase()

  return tipos.value.filter(t =>
    (t.publicidade || t.tipo || '').toLowerCase().includes(s)
  )
})

const editTipo = (id) => {
  router.push(`/tipos/${id}/editar`)
}

const handleDelete = async (t) => {
  if (!confirm(`Eliminar "${t.publicidade || t.tipo}"?`)) return

  try {
    await api.deleteTipo(t.id)

    tipos.value = tipos.value.filter(item => item.id !== t.id)

  } catch (error) {
    alert('Impossível eliminar. Este tipo está a ser usado.')
  }
}

onMounted(loadTipos)
</script>