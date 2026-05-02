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
    console.error(e)
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
    console.error(e)
    alert('Erro ao guardar')
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
    console.error(e)
    alert('Erro ao eliminar')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">

      <h1 class="text-3xl font-semibold mb-6">
        {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-xl space-y-4">

        <input v-model="form.processo" placeholder="Processo" required class="input" />
        <input v-model="form.alvara" placeholder="Alvará" class="input" />
        <input v-model="form.alojamento_local" placeholder="Alojamento Local" required class="input" />

        <select v-model="form.validade" class="input">
          <option value="valido">Válido</option>
          <option value="invalido">Inválido</option>
        </select>

        <select v-model="form.rua" class="input">
          <option value="">Selecionar Rua</option>
          <option v-for="r in ruas" :key="r.id" :value="r.id">
            {{ r.rua }}
          </option>
        </select>

        <select v-model="form.tipo_publicidade" class="input">
          <option value="">Tipo de Publicidade</option>
          <option v-for="t in tipos" :key="t.id" :value="t.id">
            {{ t.publicidade }}
          </option>
        </select>

        <div class="flex justify-between pt-4">

          <!-- DELETE -->
          <button
            v-if="isEditing"
            type="button"
            @click="handleDelete"
            class="px-4 py-2 bg-red-100 text-red-600 rounded-lg"
          >
            Eliminar
          </button>

          <div class="flex gap-2 ml-auto">
            <button type="button" @click="router.push('/processos')" class="px-4 py-2 border rounded-lg">
              Cancelar
            </button>

            <button type="submit" :disabled="loading" class="px-5 py-2 bg-gray-900 text-white rounded-lg">
              {{ loading ? 'A guardar...' : (isEditing ? 'Atualizar' : 'Guardar') }}
            </button>
          </div>

        </div>

      </form>
    </div>
  </div>
</template>