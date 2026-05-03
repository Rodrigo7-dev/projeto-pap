<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">

      <!-- HEADER -->
      <div class="flex items-center mb-8">
        <router-link
          to="/freguesias"
          class="text-sm text-gray-600 hover:text-gray-900 mr-4"
        >
          ← Voltar
        </router-link>

        <h1 class="text-3xl font-semibold text-gray-900">
          {{ isEditing ? 'Editar Freguesia' : 'Nova Freguesia' }}
        </h1>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-14">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full mb-3"></div>
        <p class="text-gray-600 text-sm">A carregar dados...</p>
      </div>

      <!-- FORM -->
      <form
        v-else
        @submit.prevent="handleSubmit"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4"
      >

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nome da Freguesia
          </label>

          <input
            v-model="form.freguesia"
            type="text"
            required
            placeholder="Introduzir nome da freguesia"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <!-- ACTIONS -->
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

            <router-link
              to="/freguesias"
              class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </router-link>

            <button
              type="submit"
              :disabled="submitting"
              class="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
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

const loading = ref(false)
const submitting = ref(false)

const isEditing = computed(() => !!route.params.id)

const form = ref({
  freguesia: ''
})

const loadFreguesia = async () => {
  if (!isEditing.value) return

  loading.value = true
  try {
    const res = await api.getFreguesia(route.params.id)
    const data = res?.data ?? res

    form.value.freguesia = data?.freguesia ?? ''
  } catch (error) {
    console.error(error)
    router.push('/freguesias')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await api.updateFreguesia(route.params.id, form.value)
    } else {
      await api.createFreguesia(form.value)
    }

    router.push('/freguesias')
  } catch (error) {
    alert('Erro ao guardar freguesia')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Eliminar esta freguesia?')) return

  try {
    await api.deleteFreguesia(route.params.id)
    router.push('/freguesias')
  } catch (error) {
    alert('Erro ao eliminar freguesia')
  }
}

onMounted(loadFreguesia)
</script>