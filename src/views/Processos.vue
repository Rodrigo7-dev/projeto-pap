<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Gestão de Processos</h1>
        <router-link to="/processos/novo" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Novo Processo
        </router-link>
      </div>
      
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <input v-model="search" type="text" placeholder="Pesquisar..." class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase">N.º Processo</th>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Publicidade</th>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Rua</th>
                <th class="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="p in filteredProcessos" :key="p.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">{{ p.processo || p.numero_processo || '---' }}</td>
                
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ p.tipo_publicidade?.publicidade || p.tipo_publicidade?.tipo || p.tipo?.tipo || '---' }}
                </td>
                
                <td class="px-6 py-4 text-sm text-gray-600">{{ p.rua?.rua || p.rua || '---' }}</td>
                
                <td class="px-6 py-4 text-right space-x-3">
                  <button @click="editProcesso(p.id)" class="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                  <button @click="handleDelete(p.id, (p.processo || p.numero_processo))" class="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
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
    // Aceita tanto res.data como res diretamente (devido ao interceptor do api.js)
    processos.value = res.data || res || []
    console.log("Dados recebidos do backend:", processos.value)
  } catch (error) {
    console.error('Erro ao carregar:', error)
  }
}

const filteredProcessos = computed(() => {
  const t = search.value.toLowerCase()
  return processos.value.filter(p => {
    const num = (p.processo || p.numero_processo || '').toLowerCase()
    const pub = (p.tipo_publicidade?.publicidade || p.tipo_publicidade?.tipo || '').toLowerCase()
    const rua = (p.rua?.rua || '').toLowerCase()
    return num.includes(t) || pub.includes(t) || rua.includes(t)
  })
})

const editProcesso = (id) => {
  // Ajusta a rota conforme o teu router
  router.push(`/processos/${id}/editar`)
}

const handleDelete = async (id, num) => {
  if (confirm(`Eliminar o processo ${num || ''}?`)) {
    try {
      await api.deleteProcesso(id)
      // Remove da lista local imediatamente
      processos.value = processos.value.filter(p => p.id !== id)
    } catch (error) {
      alert('Erro ao eliminar. Verifique se o processo tem dependências.')
    }
  }
}

onMounted(loadProcessos)
</script>