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
import api from '../services/api' // Onde estão os teus métodos axios

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const submitting = ref(false)

// Listas para os menus de seleção
const tipos = ref([])
const ruas = ref([])
const utilizadores = ref([])

// O formulário deve usar estas chaves exatas para o backend
const form = ref({
  processo: '',
  alvara: '',
  alojamento_local: '',
  validade: '',
  user_id: '',             // "user" no backend, mas enviamos o ID
  rua_id: '',              // "rua" no backend, mas enviamos o ID
  tipo_publicidade_id: ''  // "tipo_publicidade" no backend, mas enviamos o ID
})

const isEditing = computed(() => !!route.params.id)

const fetchData = async () => {
  loading.value = true
  try {
    // Carregar dependências (Dropdowns)
    const [resTipos, resRuas] = await Promise.all([
      api.getTipos(), // Endpoint: /tipo-publicidades
      api.getRuas()   // Endpoint: /ruas
    ])
    tipos.value = resTipos.data || resTipos
    ruas.value = resRuas.data || resRuas

    // Se estiver a editar, preencher o formulário
    if (isEditing.value) {
      const res = await api.getProcesso(route.params.id)
      const data = res.data || res
      
      form.value = {
        processo: data.processo || '',
        alvara: data.alvara || '',
        alojamento_local: data.alojamento_local || '',
        validade: data.validade ? data.validade.split('T')[0] : '',
        // Extrair IDs dos objetos que o backend devolve
        user_id: data.user?.id || data.user_id || '',
        rua_id: data.rua?.id || data.rua_id || '',
        tipo_publicidade_id: data.tipo_publicidade?.id || data.tipo_publicidade_id || ''
      }
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    // Objeto limpo para enviar ao servidor
    const payload = { ...form.value }

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }
    router.push('/processos')
  } catch (error) {
    console.error("Erro detalhado:", error.response?.data)
    alert("Erro ao salvar. Verifique se escolheu o Utilizador, Rua e Tipo de Publicidade.")
  } finally {
    submitting.value = false
  }
}

onMounted(fetchData)
</script>