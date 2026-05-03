<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center mb-8">
        <router-link to="/tipos" class="text-sm text-gray-600 hover:text-gray-900 mr-4">
          ← Voltar
        </router-link>
        <h1 class="text-3xl font-semibold text-gray-900">
          {{ isEditing ? 'Editar Tipo' : 'Novo Tipo' }}
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div v-if="loading" class="py-4 text-center text-gray-500">A carregar dados...</div>
        
        <div v-else>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome da Publicidade</label>
          <input
            v-model="form.publicidade"
            type="text"
            required
            placeholder="Ex: Outdoor, Painel..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
        
        <div class="mt-8 flex justify-end space-x-4">
          <router-link to="/tipos" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition">Cancelar</router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {{ submitting ? 'A guardar...' : (isEditing ? 'Atualizar' : 'Criar') }}
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
const isEditing = computed(() => !!route.params.id)

const form = ref({
  publicidade: ''
})

const loadTipo = async () => {
  if (!isEditing.value) return
  loading.value = true
  try {
    const res = await api.getTipo(route.params.id)
    const data = res.data || res
    // No carregar, aceitamos 'tipo' ou 'publicidade' do banco
    form.value.publicidade = data.publicidade || data.tipo || ''
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.publicidade.trim()) return
  submitting.value = true
  
  try {
    // ENVIAR APENAS A VARIÁVEL QUE ELE PEDE
    const payload = {
      publicidade: form.value.publicidade.trim()
    }

    if (isEditing.value) {
      await api.updateTipo(route.params.id, payload)
    } else {
      await api.createTipo(payload)
    }
    
    router.push('/tipos')
  } catch (error) {
    console.error('Erro:', error.response?.data)
    alert(error.response?.data?.error || "Erro ao salvar. Verifique se o nome já existe.")
  } finally {
    submitting.value = false
  }
}

onMounted(loadTipo)
</script>