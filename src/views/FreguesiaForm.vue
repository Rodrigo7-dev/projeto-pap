<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/services/api'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)

const form = ref({
  freguesia: ''
})

const load = async () => {
  if (!isEditing.value) return

  loading.value = true

  try {
    const res = await api.getFreguesia(route.params.id)
    const data = res?.data ?? res ?? {}

    form.value = {
      freguesia: data.freguesia ?? ''
    }
  } catch (error) {
    console.error('Erro ao carregar freguesia:', error)
    router.push('/freguesias')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (loading.value) return

  if (!form.value.freguesia?.trim()) {
    alert('Preencha o nome da freguesia')
    return
  }

  loading.value = true

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
  } catch (error) {
    console.error('Erro ao guardar:', error)
    alert('Erro ao guardar freguesia')
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Tem a certeza que deseja eliminar esta freguesia?')) return

  try {
    await api.deleteFreguesia(route.params.id)
    router.push('/freguesias')
  } catch (error) {
    console.error('Erro ao eliminar:', error)
    alert('Erro ao eliminar freguesia')
  }
}

onMounted(load)
</script>

<template>
  <div class="app-shell">
    <div class="mx-auto w-full max-w-4xl">
      <div class="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
        <router-link
          to="/freguesias"
          class="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Voltar
        </router-link>

        <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {{ isEditing ? 'Editar Freguesia' : 'Nova Freguesia' }}
        </h1>
      </div>

      <form
        class="form-card"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="loading && isEditing"
          class="py-8 text-center text-slate-500"
        >
          A carregar...
        </div>

        <BaseInput
          v-else
          v-model="form.freguesia"
          label="Freguesia"
          required
          placeholder="Nome da freguesia"
        />

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
              :disabled="loading"
            >
              {{ loading ? 'A guardar...' : isEditing ? 'Atualizar' : 'Guardar' }}
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
