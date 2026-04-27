<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tipos de Publicidade</h1>
        <router-link to="/tipos/novo" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md">
          + Novo Tipo
        </router-link>
      </div>
      
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <input v-model="search" type="text" placeholder="Pesquisar por nome..." class="w-full px-4 py-2 border rounded-lg outline-none" />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 border-b font-bold text-gray-600 uppercase text-xs">
              <tr>
                <th class="px-6 py-3">Nome da Publicidade</th>
                <th class="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="t in filteredTipos" :key="t.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 font-bold text-gray-900">{{ t.publicidade || t.tipo }}</td>
                <td class="px-6 py-4 text-right space-x-3">
                  <button @click="editTipo(t.id)" class="text-blue-600 font-bold hover:underline">Editar</button>
                  <button @click="handleDelete(t)" class="text-red-600 font-bold hover:underline">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
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
const tipos = ref([]) // Certifica que esta variável está com 2 S
const search = ref('')

const loadTipos = async () => {
  try {
    const res = await api.getTipos()
    tipos.value = res.data || res || []
  } catch (error) { console.error(error) }
}

const filteredTipos = computed(() => {
  const s = search.value.toLowerCase()
  return tipos.value.filter(t => (t.publicidade || t.tipo || '').toLowerCase().includes(s))
})

const editTipo = (id) => router.push(`/tipos/${id}/editar`)

const handleDelete = async (t) => {
  if (confirm(`Eliminar "${t.publicidade || t.tipo}"?`)) {
    try {
      await api.deleteTipo(t.id)
      // CORREÇÃO: Variável 'tipos' (plural) correta para remover do ecrã
      tipos.value = tipos.value.filter(item => item.id !== t.id)
    } catch (error) {
      alert('Impossível eliminar. Este tipo está a ser usado por processos ativos.')
    }
  }
}

onMounted(loadTipos)
</script>