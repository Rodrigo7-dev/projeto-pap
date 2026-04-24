<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <button @click="$router.push('/processos')" class="text-blue-600 hover:text-blue-800 mr-4 font-medium flex items-center">
          <span class="mr-1">←</span> Voltar
        </button>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
        </h1>
      </div>
      
      <div v-if="loading" class="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p class="text-gray-600 font-medium">A carregar dados do processo...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-xl border border-gray-200 p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Número do Processo *</label>
            <input
              v-model="form.processo"
              type="text"
              required
              placeholder="Ex: 2024/001"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Tipo de Publicidade *</label>
            <select
              v-model="form.tipo_publicidade_id"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="" disabled>Selecione o tipo</option>
              <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.tipo || t.publicidade }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Localização (Rua) *</label>
            <select
              v-model="form.rua_id"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="" disabled>Selecione a rua</option>
              <option v-for="r in ruas" :key="r.id" :value="r.id">{{ r.rua }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Data de Validade *</label>
            <input
              v-model="form.validade"
              type="date"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-gray-100 flex justify-end space-x-4">
          <button type="button" @click="$router.push('/processos')" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
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
import api from '../services/api' //

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const submitting = ref(false)
const showErrors = ref(false)

const tipos = ref([])
const ruas = ref([])

const form = ref({
  processo: '',
  validade: '',
  rua_id: '',
  tipo_publicidade_id: ''
})

const isEditing = computed(() => !!route.params.id)

const fetchData = async () => {
  loading.value = true
  try {
    const [resTipos, resRuas] = await Promise.all([
      api.getTipos(),
      api.getRuas()
    ])
    tipos.value = resTipos.data || resTipos || []
    ruas.value = resRuas.data || resRuas || []

    if (isEditing.value) {
      const res = await api.getProcesso(route.params.id)
      const data = res.data || res
      
      form.value = {
        processo: data.processo || '',
        validade: data.validade ? data.validade.split('T')[0] : '',
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
    // AJUSTE DE PAYLOAD: Seguindo a lógica do RuaForm que descobrimos
    const payload = {
      processo: form.value.processo.trim(),
      validade: form.value.validade,
      // O teu backend parece esperar o nome direto do recurso para IDs
      rua: Number(form.value.rua_id),
      tipo_publicidade: Number(form.value.tipo_publicidade_id)
    }

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }
    router.push('/processos')
  } catch (error) {
    const data = error.response?.data
    console.error("Erro completo do servidor:", data)

    let msg = "Erro ao salvar o processo."
    
    // Tratamento para evitar o [object Object] e mostrar as mensagens do Railway
    if (data?.errors && Array.isArray(data.errors)) {
      msg = data.errors.map(err => err.msg || err).join('\n')
    } else if (data?.message) {
      msg = data.message
    }

    alert(`Atenção:\n${msg}`) //
  } finally {
    submitting.value = false
  }
}

onMounted(fetchData)
</script>