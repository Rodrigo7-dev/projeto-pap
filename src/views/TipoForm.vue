<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/services/api'

import BaseFormLayout from '@/components/layout/BaseFormLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')

const isEditing = computed(() => !!route.params.id)

const form = ref({
  publicidade: ''
})

const loadTipo = async () => {
  if (!isEditing.value) return

  loading.value = true
  error.value = ''

  try {
    const res = await api.getTipo(route.params.id)
    const data = res?.data ?? res ?? {}

    form.value = {
      publicidade: data.publicidade ?? data.tipo ?? ''
    }
  } catch (err) {
    console.error(err)
    error.value = 'Erro ao carregar tipo'
    router.push('/tipos')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (submitting.value) return

  const publicidade = form.value.publicidade.trim()

  if (!publicidade) {
    error.value = 'Preencha o nome'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const payload = { publicidade }

    if (isEditing.value) {
      await api.updateTipo(route.params.id, payload)
    } else {
      await api.createTipo(payload)
    }

    router.push('/tipos')
  } catch (err) {
    console.error(err)
    error.value = err?.response?.data?.error || 'Erro ao guardar'
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Eliminar este tipo?')) return

  try {
    await api.deleteTipo(route.params.id)
    router.push('/tipos')
  } catch (err) {
    console.error(err)
    error.value = 'Erro ao eliminar'
  }
}

onMounted(loadTipo)
</script>

<template>
  <BaseFormLayout
    :title="isEditing ? 'Editar Tipo' : 'Novo Tipo'"
    back-to="/tipos"
  >
    <form @submit.prevent="handleSubmit">
      <div
        v-if="loading"
        class="py-8 text-center text-slate-500"
      >
        A carregar...
      </div>

      <template v-else>
        <div
          v-if="error"
          class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {{ error }}
        </div>

        <BaseInput
          v-model="form.publicidade"
          label="Nome da publicidade"
          required
          placeholder="Ex: Outdoor"
        />
      </template>

      <div class="form-actions">
        <BaseButton
          v-if="isEditing"
          type="button"
          variant="danger"
          @click="handleDelete"
        >
          Eliminar
        </BaseButton>

        <div class="form-actions-right">
          <BaseButton
            type="button"
            variant="secondary"
            @click="router.push('/tipos')"
          >
            Cancelar
          </BaseButton>

          <BaseButton
            type="submit"
            :disabled="submitting || loading"
          >
            {{ submitting ? 'A guardar...' : isEditing ? 'Atualizar' : 'Guardar' }}
          </BaseButton>
        </div>
      </div>
    </form>
  </BaseFormLayout>
</template>
