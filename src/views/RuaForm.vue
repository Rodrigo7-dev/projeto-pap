<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <router-link to="/ruas" class="text-blue-600 hover:text-blue-800 mr-4 font-medium flex items-center">
          <span class="mr-1">←</span> Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Rua' : 'Nova Rua' }}
        </h1>
      </div>
      
      <div v-if="loading" class="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p class="text-gray-600 font-medium">A carregar dados da rua...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-xl border border-gray-200 p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Nome da Rua *</label>
            <input
              v-model="form.rua"
              type="text"
              required
              placeholder="Ex: Avenida Principal"
              :class="{'border-red-500 ring-red-100': !form.rua && showErrors}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
            <p v-if="!form.rua && showErrors" class="text-red-500 text-xs font-medium">O nome da rua é obrigatório.</p>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Freguesia *</label>
            <select
              v-model="form.freguesia_id"
              required
              :class="{'border-red-500 ring-red-100': !form.freguesia_id && showErrors}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="" disabled>Selecione a freguesia</option>
              <option v-for="freg in freguesias" :key="freg.id" :value="freg.id">
                {{ freg.freguesia }}
              </option>
            </select>
            <p v-if="!form.freguesia_id && showErrors" class="text-red-500 text-xs font-medium">Selecione uma freguesia da lista.</p>
          </div>
          
          <div class="space-y-2 md:col-span-2">
            <label class="block text-sm font-bold text-gray-700">Coordenada (Opcional)</label>
            <input
              v-model="form.coordenada"
              type="text"
              placeholder="Ex: 41.5321, -8.4211"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-sm"
            />
          </div>
        </div>
        
        <div class="mt-10 pt-6 border-t border-gray-100 flex justify-end space-x-4">
          <router-link
            to="/ruas"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="submitting" class="mr-2">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isEditing ? 'Atualizar Dados' : 'Criar Nova Rua' }}
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
const showErrors = ref(false)
const freguesias = ref([])

const form = ref({
  rua: '',           // Variável exata do teu backend
  freguesia_id: '',  // ID numérico da relação
  coordenada: ''
})

const isEditing = computed(() => !!route.params.id)

// 1. Carrega as freguesias para o dropdown
const loadFreguesias = async () => {
  try {
    const res = await api.getFreguesias()
    freguesias.value = res.data || res || []
  } catch (error) {
    console.error('Erro ao carregar freguesias:', error)
  }
}

// 2. Se for edição, carrega os dados da rua atual
const loadRuaData = async () => {
  if (!isEditing.value) return
  loading.value = true
  try {
    const res = await api.getRua(route.params.id)
    const data = res.data || res
    
    form.value = {
      rua: data.rua || '',
      freguesia_id: data.freguesia?.id || data.freguesia_id || '',
      coordenada: data.coordenada || ''
    }
  } catch (error) {
    alert('Não foi possível encontrar esta rua.')
    router.push('/ruas')
  } finally {
    loading.value = false
  }
}

// 3. Submissão com tratamento detalhado de erros
const handleSubmit = async () => {
  submitting.value = true;
  try {
    const payload = {
      rua: form.value.rua,
      freguesia_id: Number(form.value.freguesia_id),
      coordenada: form.value.coordenada || null,
      // TESTE: Adiciona campos que podem ser obrigatórios no teu backend
      // processo_id: null, 
    };

    if (isEditing.value) {
      await api.updateRua(route.params.id, payload);
    } else {
      await api.createRua(payload);
    }
    router.push('/ruas');
  } catch (error) {
    const data = error.response?.data;
    console.log("DADOS EXATOS DO ERRO:", data); // Verifica isto no F12!

    if (Array.isArray(data.errors)) {
      // Se o erro vier como Array(5), vamos listar todos
      alert("Erros do Servidor:\n" + data.errors.join("\n"));
    } else if (data.errors) {
      // Se vier como objeto
      const msg = Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`).join("\n");
      alert(msg);
    } else {
      alert(data.message || "Erro desconhecido");
    }
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  await loadFreguesias()
  await loadRuaData()
})
</script>