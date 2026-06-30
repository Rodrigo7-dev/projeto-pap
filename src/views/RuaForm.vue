<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/services/api'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)
const freguesias = ref([])

const form = ref({
  rua: '',
  freguesia: '',
  coordenada: ''
})

const isEditing = computed(() => !!route.params.id)

const loadFreguesias = async () => {
  try {
    const res = await api.getFreguesias()
    freguesias.value = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : []
  } catch {
    freguesias.value = []
  }
}

const loadRua = async () => {
  if (!isEditing.value) return

  loading.value = true

  try {
    const res = await api.getRua(route.params.id)
    const data = res?.data ?? res

    form.value = {
      rua: data.rua ?? '',
      coordenada: data.coordenada ?? '',
      freguesia: data.freguesia?._id ?? data.freguesia?.id ?? data.freguesia ?? ''
    }
  } catch {
    router.push('/ruas')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (submitting.value) return

  if (!form.value.rua.trim() || !form.value.coordenada.trim() || !form.value.freguesia) {
    alert('Preencha todos os campos')
    return
  }

  submitting.value = true

  try {
    const payload = {
      rua: form.value.rua.trim(),
      coordenada: form.value.coordenada.trim(),
      freguesia: form.value.freguesia
    }

    if (isEditing.value) {
      await api.updateRua(route.params.id, payload)
    } else {
      await api.createRua(payload)
    }

    router.push('/ruas')
  } catch (error) {
    console.error(error)
    alert('Erro ao guardar')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Eliminar esta rua?')) return

  try {
    await api.deleteRua(route.params.id)
    router.push('/ruas')
  } catch {
    alert('Erro ao eliminar')
  }
}

onMounted(async () => {
  await loadFreguesias()
  await loadRua()
})
</script>

<template>
  <div class="app-shell">
    <div class="mx-auto w-full max-w-4xl">
      <div class="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
        <router-link
          to="/ruas"
          class="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Voltar
        </router-link>

        <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {{ isEditing ? 'Editar Rua' : 'Nova Rua' }}
        </h1>
      </div>

      <form
        class="form-card"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="loading"
          class="py-10 text-center text-slate-500"
        >
          A carregar...
        </div>

        <template v-else>
          <BaseInput
            v-model="form.rua"
            label="Nome da rua"
            required
            placeholder="Rua das Flores"
          />

          <BaseSelect
            v-model="form.freguesia"
            label="Freguesia"
            required
            placeholder="Selecionar freguesia"
            :options="freguesias"
            labelKey="freguesia"
            valueKey="_id"
          />

          <BaseInput
            v-model="form.coordenada"
            label="Coordenada"
            required
            placeholder="41.1579,-8.64442"
            class="font-mono"
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
              @click="router.push('/ruas')"
            >
              Cancelar
            </BaseButton>

            <BaseButton
              type="submit"
              :disabled="submitting"
            >
              {{ submitting ? 'A guardar...' : isEditing ? 'Atualizar' : 'Guardar' }}
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
