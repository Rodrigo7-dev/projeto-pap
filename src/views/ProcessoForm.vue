<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'

const router = useRouter()
const route = useRoute()

const isEditing = computed(() => Boolean(route.params.id))
const loading = ref(false)

const tipos = ref([])
const ruas = ref([])

const form = ref({
  processo: '',
  alvara: '',
  alojamento_local: '',
  validade: 'valido',
  rua: null,
  tipo_publicidade: null
})

// LOAD
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
        rua: d.rua?.id ?? null,
        tipo_publicidade: d.tipo_publicidade?.id ?? null
      }
    }

  } catch (e) {
    console.error('Erro ao carregar dados:', e)
  }
}

// PAYLOAD (🔥 CRÍTICO)
const buildPayload = () => ({
  processo: form.value.processo.trim(),
  alvara: form.value.alvara.trim(),
  alojamentoLocal: form.value.alojamento_local.trim(),
  validade: form.value.validade,
  rua: String(form.value.rua), // garantir string
  tipoPublicidade: String(form.value.tipo_publicidade) // garantir string
})

// VALIDATION
const isValid = () => {
  return (
    form.value.processo &&
    form.value.alojamento_local &&
    form.value.rua &&
    form.value.tipo_publicidade
  )
}

// SUBMIT
const handleSubmit = async () => {
  if (loading.value) return

  if (!isValid()) {
    alert('Preencha todos os campos obrigatórios')
    return
  }

  loading.value = true

  try {
    const payload = buildPayload()

    console.log('PAYLOAD ENVIADO:', payload) // 🔍 debug

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }

    router.push('/processos')

  } catch (e) {
    console.error('Erro backend:', e.response?.data || e)
    alert('Erro ao guardar processo')
  } finally {
    loading.value = false
  }
}

// DELETE
const handleDelete = async () => {
  if (!confirm('Tem a certeza que deseja eliminar este processo?')) return

  try {
    await api.deleteProcesso(route.params.id)
    router.push('/processos')
  } catch (e) {
    console.error('Erro ao eliminar:', e)
    alert('Erro ao eliminar')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">

      <div class="mb-8">
        <h1 class="text-3xl font-semibold">
          {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-xl space-y-4">

        <BaseInput v-model="form.processo" placeholder="Processo" required />
        <BaseInput v-model="form.alvara" placeholder="Alvará" />
        <BaseInput v-model="form.alojamento_local" placeholder="Alojamento Local" required />

        <BaseSelect
          v-model="form.validade"
          :options="[
            { label: 'Válido', value: 'valido' },
            { label: 'Inválido', value: 'invalido' }
          ]"
          placeholder="Validade"
        />

        <BaseSelect
          v-model="form.rua"
          :options="ruas"
          labelKey="rua"
          valueKey="id"
          placeholder="Selecionar Rua"
        />

        <BaseSelect
          v-model="form.tipo_publicidade"
          :options="tipos"
          labelKey="publicidade"
          valueKey="id"
          placeholder="Tipo de Publicidade"
        />

        <div class="flex justify-between pt-4">

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