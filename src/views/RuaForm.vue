<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">

      <!-- HEADER -->
      <div class="flex items-center mb-8">
        <router-link
          to="/ruas"
          class="text-sm text-gray-600 hover:text-gray-900 mr-4"
        >
          ← Voltar
        </router-link>

        <h1 class="text-3xl font-semibold text-gray-900">
          {{ isEditing ? 'Editar Rua' : 'Nova Rua' }}
        </h1>
      </div>

      <!-- FORM -->
      <form
        @submit.prevent="handleSubmit"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4"
      >

        <!-- RUA -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nome da Rua
          </label>

          <input
            v-model="form.rua"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <!-- FREGUESIA -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Freguesia
          </label>

          <select
            v-model="form.freguesia"
            required
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="" disabled>Selecionar freguesia</option>

            <option
              v-for="f in freguesias"
              :key="f.id"
              :value="f.id"
            >
              {{ f.freguesia }}
            </option>
          </select>
        </div>

        <!-- COORDENADA -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Coordenada
          </label>

          <input
            v-model="form.coordenada"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900/10"
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
              to="/ruas"
              class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </router-link>

            <button
              type="submit"
              class="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition"
            >
              {{ isEditing ? 'Atualizar' : 'Guardar' }}
            </button>

          </div>

        </div>

      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

// STATE
const loading = ref(false)
const submitting = ref(false)
const freguesias = ref([])

// FORM
const form = ref({
  rua: '',
  freguesia: '',
  coordenada: ''
})

// EDIT MODE
const isEditing = computed(() => !!route.params.id)

// LOAD FREGUESIAS
const loadFreguesias = async () => {
  try {
    const res = await api.getFreguesias()
    const lista = res?.data ?? res ?? []
    freguesias.value = Array.isArray(lista) ? lista : []
  } catch {
    freguesias.value = []
  }
}

// LOAD RUA (EDIT)
const loadRua = async () => {
  if (!isEditing.value) return

  loading.value = true
  try {
    const res = await api.getRua(route.params.id)
    const data = res?.data ?? res

    form.value = {
      rua: data.rua ?? '',
      freguesia: data.freguesia?.id ?? data.freguesia ?? '',
      coordenada: data.coordenada ?? ''
    }
  } catch {
    router.push('/ruas')
  } finally {
    loading.value = false
  }
}

// SUBMIT
const handleSubmit = async () => {
  submitting.value = true

  try {
    const payload = {
      rua: form.value.rua,
      freguesia: form.value.freguesia,
      coordenada: form.value.coordenada
    }

    if (isEditing.value) {
      await api.updateRua(route.params.id, payload)
    } else {
      await api.createRua(payload)
    }

    router.push('/ruas')
  } catch (e) {
    alert('Erro ao guardar rua')
  } finally {
    submitting.value = false
  }
}

// DELETE
const handleDelete = async () => {
  if (!confirm('Eliminar esta rua?')) return

  try {
    await api.deleteRua(route.params.id)
    router.push('/ruas')
  } catch {
    alert('Erro ao eliminar rua')
  }
}

onMounted(async () => {
  await loadFreguesias()
  await loadRua()
})
</script>