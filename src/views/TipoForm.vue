<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">

      <div class="flex items-center mb-8">
        <router-link to="/tipos" class="text-sm text-gray-600 hover:text-gray-900 mr-4">
          ← Voltar
        </router-link>
        <h1 class="text-3xl font-semibold text-gray-900">
          {{ isEditing ? 'Editar Tipo' : 'Novo Tipo' }}
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome da Publicidade</label>
          <input
            v-model="form.publicidade"
            type="text"
            required
            placeholder="Ex: Outdoor, Painel..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <div class="flex justify-between pt-4">

          <button
            v-if="isEditing"
            type="button"
            @click="handleDelete"
            class="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            Eliminar
          </button>

          <div class="flex gap-2 ml-auto">
            <button
              type="button"
              @click="router.push('/tipos')"
              class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              :disabled="submitting"
              class="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {{ submitting ? 'A guardar...' : (isEditing ? 'Atualizar' : 'Guardar') }}
            </button>
          </div>

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

const submitting = ref(false)
const isEditing = computed(() => !!route.params.id)

const form = ref({
  publicidade: ''
})

// LOAD
const loadTipo = async () => {
  if (!isEditing.value) return

  try {
    const res = await api.getTipo(route.params.id)
    const data = res?.data ?? res ?? {}

    form.value.publicidade = data.publicidade || data.tipo || ''
  } catch (error) {
    console.error(error)
    router.push('/tipos')
  }
}

// SUBMIT
const handleSubmit = async () => {
  if (!form.value.publicidade.trim()) return

  submitting.value = true

  try {
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
    console.error(error)
    alert(error.response?.data?.error || 'Erro ao guardar')
  } finally {
    submitting.value = false
  }
}

// DELETE
const handleDelete = async () => {
  if (!confirm('Eliminar tipo?')) return

  try {
    await api.deleteTipo(route.params.id)
    router.push('/tipos')
  } catch (error) {
    console.error(error)
    alert('Erro ao eliminar')
  }
}

onMounted(loadTipo)
</script>
