```vue
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
        <p class="text-gray-600 font-medium">A carregar dados...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-xl border border-gray-200 p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

          <!-- Nome da Rua -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Nome da Rua *</label>
            <input
              v-model="form.rua"
              type="text"
              required
              placeholder="Ex: Avenida da Liberdade"
              :class="{'border-red-500 ring-red-100': !form.rua && showErrors}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <!-- Freguesia -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Freguesia *</label>
            <select
              v-model="form.freguesia"
              required
              :class="{'border-red-500 ring-red-100': !form.freguesia && showErrors}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="" disabled>Selecione a freguesia</option>
              <option
                v-for="freg in freguesias"
                :key="freg.id || freg._id"
                :value="freg.freguesia || freg.nome"
              >
                {{ freg.freguesia || freg.nome }}
              </option>
            </select>
          </div>

          <!-- Coordenada -->
          <div class="space-y-2 md:col-span-2">
            <label class="block text-sm font-bold text-gray-700">Coordenada *</label>
            <input
              v-model="form.coordenada"
              type="text"
              required
              placeholder="Ex: 41.5321, -8.4211"
              :class="{'border-red-500 ring-red-100': !form.coordenada && showErrors}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-sm"
            />
            <p class="text-gray-400 text-xs italic">Formato: latitude, longitude</p>
          </div>
        </div>

        <!-- Botões -->
        <div class="mt-10 pt-6 border-t border-gray-100 flex justify-end space-x-4">
          <router-link to="/ruas" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors">
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
            {{ submitting ? 'A guardar...' : (isEditing ? 'Atualizar Rua' : 'Criar Rua') }}
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
  rua: '',
  freguesia: '',
  coordenada: ''
})

const isEditing = computed(() => !!route.params.id)

// 🔹 Carregar freguesias
const loadFreguesias = async () => {
  try {
    const res = await api.getFreguesias()
    freguesias.value = res.data?.data || res.data || []
  } catch (error) {
    console.error('Erro ao carregar freguesias:', error)
  }
}

// 🔹 Carregar dados da rua (edição)
const loadRuaData = async () => {
  if (!isEditing.value) return

  loading.value = true
  try {
    const res = await api.getRua(route.params.id)
    const data = res.data?.data || res.data || res

    form.value = {
      rua: data.rua || '',
      freguesia: data.freguesia || '',
      coordenada: data.coordenada || ''
    }
  } catch (error) {
    console.error('Erro ao carregar rua:', error)
    router.push('/ruas')
  } finally {
    loading.value = false
  }
}

// 🔹 Submeter formulário
const handleSubmit = async () => {
  showErrors.value = true

  if (!form.value.rua || !form.value.freguesia || !form.value.coordenada) {
    return
  }

  submitting.value = true
  try {
    const payload = {
      rua: form.value.rua.trim(),
      freguesia: form.value.freguesia, // STRING
      coordenada: form.value.coordenada.trim()
    }

    if (isEditing.value) {
      await api.updateRua(route.params.id, payload)
    } else {
      await api.createRua(payload)
    }

    router.push('/ruas')
  } catch (error) {
    const data = error.response?.data
    let msg = "Erro ao salvar."

    if (data?.errors && Array.isArray(data.errors)) {
      msg = data.errors.map(err => err.msg).join('\n')
    } else if (data?.message) {
      msg = data.message
    }

    alert(`Atenção:\n${msg}`)
  } finally {
    submitting.value = false
  }
}

// 🔹 Init
onMounted(async () => {
  await loadFreguesias()
  if (isEditing.value) await loadRuaData()
})
</script>
```
