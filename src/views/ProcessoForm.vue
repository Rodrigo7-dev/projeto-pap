<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <router-link to="/processos" class="text-blue-600 hover:text-blue-800 mr-4">
          ← Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
        </h1>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 mt-2">Carregando...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Número do Processo</label>
            <input
              v-model="form.numero_processo"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alvará</label>
            <input
              v-model="form.alvara"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Publicidade</label>
            <select
              v-model="form.tipo_publicidade_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um tipo</option>
              <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">
                {{ tipo.nome }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rua</label>
            <select
              v-model="form.rua_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma rua</option>
              <option v-for="rua in ruas" :key="rua.id" :value="rua.id">
                {{ rua.nome || rua.rua }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
            <input
              v-model="form.data_inicio"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Fim</label>
            <input
              v-model="form.data_fim"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Validade</label>
            <select
              v-model="form.validade"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="valido">Válido</option>
              <option value="invalido">Inválido</option>
            </select>
          </div>
        </div>
        
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea
            v-model="form.observacoes"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>
        
        <div class="mt-8 flex justify-end space-x-4">
          <router-link
            to="/processos"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting">Salvando...</span>
            <span v-else>{{ isEditing ? 'Atualizar' : 'Criar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)
const tipos = ref([])
const ruas = ref([])

const isEditing = computed(() => !!route.params.id)

const form = ref({
  numero_processo: '',
  alvara: '',
  tipo_publicidade_id: '',
  rua_id: '',
  data_inicio: '',
  data_fim: '',
  validade: 'valido',
  observacoes: ''
})

const loadTipos = async () => {
  try {
    const data = await api.getTipos()
    tipos.value = data.data || data || []
  } catch (error) {
    console.error('Erro ao carregar tipos:', error)
  }
}

const loadRuas = async () => {
  try {
    const data = await api.getRuas()
    ruas.value = data.data || data || []
  } catch (error) {
    console.error('Erro ao carregar ruas:', error)
  }
}

const loadProcesso = async () => {
  if (!isEditing.value) return
  
  loading.value = true
  try {
    const data = await api.getProcessos({ id: route.params.id })
    const processo = data.data || data
    if (processo) {
      form.value = { ...form.value, ...processo }
    }
  } catch (error) {
    console.error('Erro ao carregar processo:', error)
    alert('Erro ao carregar processo.')
    router.push('/processos')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await api.updateProcesso(route.params.id, form.value)
    } else {
      await api.createProcesso(form.value)
    }
    
    router.push('/processos')
  } catch (error) {
    console.error('Erro ao salvar processo:', error)
    alert('Erro ao salvar processo. Tente novamente.')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadTipos(),
    loadRuas(),
    loadProcesso()
  ])
})
</script>
