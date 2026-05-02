<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const isEditing = computed(() => !!route.params.id)
const loading = ref(false)

const tipos = ref([])
const ruas = ref([])

const form = ref({
  processo: '',
  alvara: '',
  alojamento_local: '',
  validade: 'valido',
  rua: '',
  tipo_publicidade: ''
})

// LOAD DATA
const fetchData = async () => {
  try {
    const [t, r] = await Promise.all([
      api.getTipos(),
      api.getRuas()
    ])

    tipos.value = t ?? []
    ruas.value = r ?? []

    if (isEditing.value) {
      const d = await api.getProcesso(route.params.id)

      form.value = {
        processo: d.processo ?? '',
        alvara: d.alvara ?? '',
        alojamento_local: d.alojamento_local ?? '',
        validade: d.validade ?? 'valido',
        rua: d.rua?.id ?? d.rua ?? '',
        tipo_publicidade: d.tipo_publicidade?.id ?? d.tipo_publicidade ?? ''
      }
    }

  } catch (e) {
    console.error('Erro ao carregar dados:', e)
  }
}

// PAYLOAD
const buildPayload = () => ({
  processo: form.value.processo,
  alvara: form.value.alvara,
  alojamentoLocal: form.value.alojamento_local,
  validade: form.value.validade,
  rua: form.value.rua,
  tipoPublicidade: form.value.tipo_publicidade
})

// SUBMIT
const handleSubmit = async () => {
  if (loading.value) return

  if (!form.value.rua || !form.value.tipo_publicidade) {
    alert('Seleciona Rua e Tipo de Publicidade')
    return
  }

  loading.value = true

  try {
    const payload = buildPayload()

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }

    router.push('/processos')

  } catch (e) {
    console.error('Erro ao guardar:', e)
    alert('Erro ao guardar processo')
  } finally {
    loading.value = false
  }
}

// DELETE
const handleDelete = async () => {
  if (!confirm('Eliminar este processo?')) return

  try {
    await api.deleteProcesso(route.params.id)
    router.push('/processos')
  } catch (e) {
    console.error('Erro ao eliminar:', e)
    alert('Erro ao eliminar processo')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">

      <!-- HEADER -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-gray-900">
          {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Preencha os dados do processo
        </p>
      </div>

      <!-- FORM -->
      <form
        @submit.prevent="handleSubmit"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4"
      >

        <!-- PROCESSO -->
        <input
          v-model="form.processo"
          placeholder="Processo"
          required
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        />

        <!-- ALVARÁ -->
        <input
          v-model="form.alvara"
          placeholder="Alvará"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        />

        <!-- ALOJAMENTO LOCAL -->
        <input
          v-model="form.alojamento_local"
          placeholder="Alojamento Local"
          required
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        />

        <!-- VALIDADE -->
        <select
          v-model="form.validade"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
        >
          <option value="valido">Válido</option>
          <option value="invalido">Inválido</option>
        </select>

        <!-- RUA -->
        <select
          v-model="form.rua"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Selecionar Rua</option>
          <option v-for="r in ruas" :key="r.id" :value="r.id">
            {{ r.rua }}
          </option>
        </select>

        <!-- TIPO PUBLICIDADE -->
        <select
          v-model="form.tipo_publicidade"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Tipo de Publicidade</option>
          <option v-for="t in tipos" :key="t.id" :value="t.id">
            {{ t.publicidade }}
          </option>
        </select>

        <!-- ACTIONS -->
        <div class="flex justify-between pt-4">

          <!-- DELETE -->
          <button
            v-if="isEditing"
            type="button"
            @click="handleDelete"
            class="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
          >
            Eliminar
          </button>

          <div class="flex gap-2 ml-auto">

            <button
              type="button"
              @click="router.push('/processos')"
              class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              :disabled="loading"
              class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {{ loading ? 'A guardar...' : (isEditing ? 'Atualizar' : 'Guardar') }}
            </button>

          </div>
        </div>

      </form>
    </div>
  </div>
</template>