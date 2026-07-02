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
  freguesia: ''
})

const load = async () => {
  if (!isEditing.value) return

  loading.value = true
  error.value = ''

  try {
    const res = await api.getFreguesia(route.params.id)
    const data = res?.data ?? res ?? {}

    form.value = {
      freguesia: data.freguesia ?? ''
    }
  } catch (err) {
    console.error('Erro ao carregar freguesia:', err)
    router.push('/freguesias')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (submitting.value) return

  if (!form.value.freguesia?.trim()) {
    error.value = 'Preencha o nome da freguesia'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const payload = {
      freguesia: form.value.freguesia.trim()
    }

    if (isEditing.value) {
      await api.updateFreguesia(route.params.id, payload)
    } else {
      await api.createFreguesia(payload)
    }

    router.push('/freguesias')
  } catch (err) {
    console.error('Erro ao guardar:', err)
    error.value = 'Erro ao guardar freguesia'
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Tem a certeza que deseja eliminar esta freguesia?')) return

  try {
    await api.deleteFreguesia(route.params.id)
    router.push('/freguesias')
  } catch (err) {
    console.error('Erro ao eliminar:', err)
    error.value = 'Erro ao eliminar freguesia'
  }
}

onMounted(load)
</script>

<template>
  <BaseFormLayout
    :title="isEditing ? 'Editar Freguesia' : 'Nova Freguesia'"
    back-to="/freguesias"
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
          v-model="form.freguesia"
          label="Freguesia"
          required
          placeholder="Nome da freguesia"
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
            @click="router.push('/freguesias')"
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
