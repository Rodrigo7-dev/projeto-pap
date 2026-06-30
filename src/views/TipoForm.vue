<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/services/api'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)
const isEditing = computed(() => !!route.params.id)

const form = ref({
  publicidade: ''
})

const loadTipo = async () => {
  if (!isEditing.value) return

  loading.value = true

  try {
    const res = await api.getTipo(route.params.id)
    const data = res?.data ?? res ?? {}

    form.value = {
      publicidade: data.publicidade ?? data.tipo ?? ''
    }
  } catch (error) {
    console.error(error)
    alert('Erro ao carregar tipo')
    router.push('/tipos')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  const publicidade = form.value.publicidade.trim()

  if (!publicidade) {
    alert('Preencha o nome')
    return
  }

  submitting.value = true

  try {
    const payload = { publicidade }

    if (isEditing.value) {
      await api.updateTipo(route.params.id, payload)
    } else {
      await api.createTipo(payload)
    }

    router.push('/tipos')
  } catch (error) {
    console.error(error)
    alert(error?.response?.data?.error || 'Erro ao guardar')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Eliminar este tipo?')) return

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

<template>
  <div class="app-shell">
    <div class="mx-auto w-full max-w-4xl">
      <div class="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
        <router-link
          to="/tipos"
          class="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Voltar
        </router-link>

        <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {{ isEditing ? 'Editar Tipo' : 'Novo Tipo' }}
        </h1>
      </div>

      <form
        class="form-card"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="loading"
          class="py-8 text-center text-slate-500"
        >
          A carregar...
        </div>

        <BaseInput
          v-else
          v-model="form.publicidade"
          label="Nome da publicidade"
          required
          placeholder="Ex: Outdoor"
        />

        <div class="form-actions">
          <BaseButton
            v-if="isEditing && !loading"
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
    </div>
  </div>
</template>
