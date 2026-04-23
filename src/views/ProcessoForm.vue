<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <button @click="$router.push('/processos')" class="text-blue-600 hover:text-blue-800 mr-4">
          ← Voltar
        </button>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
        </h1>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 mt-2">A carregar dados...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Número do Processo</label>
            <input v-model="form.processo" type="text" required placeholder="Ex: 2024/001"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Publicidade</label>
            <select v-model="form.tipo_publicidade_id" required class="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>Selecione o tipo</option>
              <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.publicidade }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Localização (Rua)</label>
            <select v-model="form.rua_id" required class="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>Selecione a rua</option>
              <option v-for="r in ruas" :key="r.id" :value="r.id">{{ r.rua }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Validade</label>
            <input v-model="form.validade" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <button type="button" @click="$router.push('/processos')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" :disabled="submitting"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {{ submitting ? 'A guardar...' : (isEditing ? 'Atualizar Processo' : 'Criar Processo') }}
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
const utilizadores = ref([]) // Adicionado se precisares de listar utilizadores

const form = ref({
  processo: '',
  tipo_publicidade_id: '',
  rua_id: '',
  validade: '',
  alvara: '',           // Campo da imagem
  alojamento_local: '',  // Campo da imagem
  user_id: ''           // Campo "Utilizador (Requerente)"
})

const isEditing = computed(() => !!route.params.id)

const fetchData = async () => {
  loading.value = true
  try {
    const [resTipos, resRuas] = await Promise.all([
      api.getTipos(),
      api.getRuas()
    ])
    tipos.value = resTipos.data || resTipos
    ruas.value = resRuas.data || resRuas

    if (isEditing.value) {
      const resProc = await api.getProcesso(route.params.id)
      const data = resProc.data || resProc
      
      form.value = {
        processo: data.processo || '',
        tipo_publicidade_id: data.tipo_publicidade_id || data.tipo_publicidade?.id || '',
        rua_id: data.rua_id || data.rua?.id || '',
        validade: data.validade ? data.validade.split('T')[0] : '',
        alvara: data.alvara || '',
        alojamento_local: data.alojamento_local || '',
        user_id: data.user_id || data.user?.id || ''
      }
    }
  } catch (error) {
    console.error("Erro ao carregar:", error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    // IMPORTANTE: Verifica se o backend espera 'rua_id' ou 'rua'
    // Se o erro persistir, o problema pode estar nos nomes destas chaves
    const payload = { ...form.value }

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }
    router.push('/processos')
  } catch (error) {
    // Tenta mostrar o erro real do servidor no console para depurar
    console.error("Erro detalhado do servidor:", error.response?.data)
    alert("Erro ao salvar: " + (error.response?.data?.message || "Verifique os campos."))
  } finally {
    submitting.value = false
  }
}

onMounted(fetchData)
</script>