<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/services/api'
import { getEntityId, unwrapList } from '@/utils/helpers'

import BaseFormLayout from '@/components/layout/BaseFormLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const freguesias = ref([])

const form = ref({
  rua: '',
  freguesia: '',
  coordenada: ''
})

const isEditing = computed(() => !!route.params.id)

const loadData = async () => {
  loading.value = true
  error.value = ''

  try {
    freguesias.value = unwrapList(await api.getFreguesias())

    if (isEditing.value) {
      const res = await api.getRua(route.params.id)
      const data = res?.data ?? res

      form.value = {
        rua: data.rua ?? '',
        coordenada: data.coordenada ?? '',
        freguesia: getEntityId(data.freguesia)
      }
    }
  } catch {
    error.value = 'Erro ao carregar dados'
    if (isEditing.value) router.push('/ruas')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (submitting.value) return

  if (!form.value.rua.trim() || !form.value.freguesia) {
    error.value = 'Preencha os campos obrigatórios'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const payload = {
    rua: form.value.rua.trim(),
    coordenada: form.value.coordenada?.trim() || null,
    freguesia: form.value.freguesia
  }

    if (isEditing.value) {
      await api.updateRua(route.params.id, payload)
    } else {
      await api.createRua(payload)
    }

    router.push('/ruas')
  } catch (err) {
  console.error(err)
  console.log(err.response?.data)

  error.value =
    err.response?.data?.message ??
    JSON.stringify(err.response?.data) ??
    'Erro ao guardar'
}

const handleDelete = async () => {
  if (!confirm('Eliminar esta rua?')) return

  try {
    await api.deleteRua(route.params.id)
    router.push('/ruas')
  } catch {
    error.value = 'Erro ao eliminar'
  }
}

onMounted(loadData)
</script>

<template>
  <BaseFormLayout
    :title="isEditing ? 'Editar Rua' : 'Nova Rua'"
    back-to="/ruas"
  >
    <form @submit.prevent="handleSubmit">
      <div
        v-if="loading"
        class="py-10 text-center text-slate-500"
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
          label-key="freguesia"
        />

        <BaseInput
          v-model="form.coordenada"
          label="Coordenada"
          placeholder="41.1579,-8.64442"
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
            :disabled="submitting || loading"
          >
            {{ submitting ? 'A guardar...' : isEditing ? 'Atualizar' : 'Guardar' }}
          </BaseButton>
        </div>
      </div>
    </form>
  </BaseFormLayout>
</template>
