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

const tipos = ref([])
const ruas = ref([])

const isEditing = computed(() => !!route.params.id)

const form = ref({
  processo: '',
  alvara: '',
  alojamentoLocal: '',
  validade: 'valido',
  rua: '',
  tipoPublicidade: ''
})

const fetchData = async () => {
  loading.value = true

  try {
    const [tiposRes, ruasRes] = await Promise.all([
      api.getTipos(),
      api.getRuas()
    ])

    tipos.value = tiposRes?.data ?? tiposRes ?? []
    ruas.value = ruasRes?.data ?? ruasRes ?? []

    if (isEditing.value) {
      const res = await api.getProcesso(route.params.id)
      const data = res?.data ?? res

      form.value = {
        processo: data.processo ?? '',
        alvara: data.alvara ?? '',
        alojamentoLocal: data.alojamentoLocal ?? data.alojamento_local ?? '',
        validade: data.validade ?? 'valido',
        rua: data.rua?._id ?? data.rua?.id ?? data.rua ?? '',
        tipoPublicidade:
          data.tipoPublicidade?._id ??
          data.tipoPublicidade?.id ??
          data.tipo_publicidade?._id ??
          data.tipo_publicidade?.id ??
          ''
      }
    }
  } catch (error) {
    console.error(error)
    alert('Erro ao carregar dados')
  } finally {
    loading.value = false
  }
}

const isValid = () => {
  return form.value.processo?.trim() && form.value.rua && form.value.tipoPublicidade
}

const handleSubmit = async () => {
  if (submitting.value) return

  if (!isValid()) {
    alert('Preencha os campos obrigatórios')
    return
  }

  submitting.value = true

  try {
    const payload = {
      processo: form.value.processo.trim(),
      alvara: (form.value.alvara || '').trim(),
      alojamentoLocal: (form.value.alojamentoLocal || '').trim(),
      validade: form.value.validade,
      rua: form.value.rua,
      tipoPublicidade: form.value.tipoPublicidade
    }

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }

    router.push('/processos')
  } catch (error) {
    console.error(error)
    alert('Erro ao guardar')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Eliminar este processo?')) return

  try {
    await api.deleteProcesso(route.params.id)
    router.push('/processos')
  } catch {
    alert('Erro ao eliminar')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="app-shell">
    <div class="mx-auto w-full max-w-4xl">
      <div class="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
        <router-link
          to="/processos"
          class="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Voltar
        </router-link>

        <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
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

        <template v-else>
          <BaseInput
            v-model="form.processo"
            label="Processo"
            required
          />

          <BaseInput
            v-model="form.alvara"
            label="Alvará"
          />

          <BaseInput
            v-model="form.alojamentoLocal"
            label="Alojamento local"
          />

          <BaseSelect
            v-model="form.validade"
            label="Validade"
            :options="[
              { label: 'Válido', value: 'valido' },
              { label: 'Inválido', value: 'invalido' }
            ]"
            valueKey="value"
          />

          <BaseSelect
            v-model="form.rua"
            label="Rua"
            :options="ruas"
            labelKey="rua"
            valueKey="_id"
          />

          <BaseSelect
            v-model="form.tipoPublicidade"
            label="Tipo de publicidade"
            :options="tipos"
            labelKey="publicidade"
            valueKey="_id"
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
              @click="router.push('/processos')"
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
