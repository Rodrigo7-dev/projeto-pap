<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Gestão de Processos</h1>
        <router-link 
          to="/processos/novo" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-bold"
        >
          + Novo Processo
        </router-link>
      </div>
      
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar por processo, alvará ou rua..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Processo</th>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Alvará / AL</th>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Publicidade</th>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Rua</th>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center">Estado</th>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="filteredProcessos.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">Nenhum processo encontrado.</td>
              </tr>
              <tr v-for="p in filteredProcessos" :key="p.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 font-bold text-gray-900">{{ p.processo }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <div class="font-medium">{{ p.alvara || '-' }}</div>
                  <div class="text-xs text-gray-400">{{ p.alojamento_local || '' }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ p.tipo_publicidade?.publicidade || p.tipo_publicidade?.tipo || '---' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ p.rua?.rua || '---' }}</td>
                <td class="px-6 py-4 text-center">
                  <span 
                    :class="p.validade ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    class="px-2 py-1 rounded-full text-xs font-bold"
                  >
                    {{ p.validade ? 'Válido' : 'Expirado' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-3">
                  <button @click="editProcesso(p.id)" class="text-blue-600 hover:text-blue-800 font-bold">Editar</button>
                  <button @click="handleDelete(p.id, p.processo)" class="text-red-600 hover:text-red-800 font-bold">Eliminar</button>
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
const processos = ref([])
const search = ref('')

const loadProcessos = async () => {
  try {
    const res = await api.getProcessos()
    // Aceita data vindo do axios direto ou do interceptor
    processos.value = res.data || res || []
  } catch (error) {
    console.error('Erro ao carregar:', error)
  }
}

const filteredProcessos = computed(() => {
  const t = search.value.toLowerCase().trim()
  return processos.value.filter(p => 
    (p.processo || '').toLowerCase().includes(t) ||
    (p.alvara || '').toLowerCase().includes(t) ||
    (p.rua?.rua || '').toLowerCase().includes(t) ||
    (p.tipo_publicidade?.publicidade || '').toLowerCase().includes(t)
  )
})

const handleDelete = async (id, num) => {
  if (!id) return
  if (confirm(`Eliminar definitivamente o processo ${num}?`)) {
    try {
      await api.deleteProcesso(id)
      
      // CORREÇÃO AQUI: Mudado de 'procesos' para 'processos'
      processos.value = processos.value.filter(p => p.id !== id)
      
      alert('Eliminado com sucesso!')
    } catch (error) {
      console.error("Erro na API:", error)
      // Se o backend der erro (ex: 500 ou 403), ele entra aqui
      alert('Erro ao eliminar na base de dados. Verifique se tem permissões.')
    }
  }
}

onMounted(loadProcessos)
</script>