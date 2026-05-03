<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

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
  rua: '',
  tipoPublicidade: ''
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
        rua: d.rua?.id ?? '',
        tipoPublicidade: d.tipo_publicidade?.id ?? ''
      }
    }

  } catch (e) {
    console.error(e)
  }
}

// VALIDATION
const isValid = () => {
  return (
    form.value.processo &&
    form.value.alojamento_local &&
    form.value.rua &&
    form.value.tipoPublicidade
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
    if (isEditing.value) {
      await api.updateProcesso(route.params.id, form.value)
    } else {
      await api.createProcesso(form.value)
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
  if (!confirm('Tem a certeza que deseja eliminar este processo?')) return

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

        <BaseInput v-model="form.processo" placeholder="Processo" required />
        <BaseInput v-model="form.alvara" placeholder="Alvará" />
        <BaseInput v-model="form.alojamento_local" placeholder="Alojamento Local" required />

        <BaseSelect
          v-model="form.validade"
          :options="[
            { label: 'Válido', value: 'valido' },
            { label: 'Inválido', value: 'invalido' }
          ]"
        />

        <BaseSelect
          v-model="form.rua"
          :options="ruas"
          labelKey="rua"
          valueKey="id"
          placeholder="Selecionar Rua"
        />

        <BaseSelect
          v-model="form.tipoPublicidade"
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