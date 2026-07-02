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
  error.value = ''

  try {
    const [tiposRes, ruasRes] = await Promise.all([
      api.getTipos(),
      api.getRuas()
    ])

    tipos.value = unwrapList(tiposRes)
    ruas.value = unwrapList(ruasRes)

    if (isEditing.value) {
      const res = await api.getProcesso(route.params.id)
      const data = res?.data ?? res

      form.value = {
        processo: data.processo ?? '',
        alvara: data.alvara ?? '',
        alojamentoLocal: data.alojamentoLocal ?? data.alojamento_local ?? '',
        validade: data.validade ?? 'valido',
        rua: getEntityId(data.rua),
        tipoPublicidade: getEntityId(data.tipoPublicidade ?? data.tipo_publicidade)
      }
    }
  } catch (err) {
    console.error(err)
    error.value = 'Erro ao carregar dados'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (submitting.value) return

  if (!form.value.processo?.trim() || !form.value.rua || !form.value.tipoPublicidade) {
    error.value = 'Preencha os campos obrigatórios'
    return
  }

  submitting.value = true
  error.value = ''

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
  } catch (err) {
    console.error(err)
    error.value = 'Erro ao guardar'
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
    error.value = 'Erro ao eliminar'
  }
}

onMounted(fetchData)
</script>

<template>
  <BaseFormLayout
    :title="isEditing ? 'Editar Processo' : 'Novo Processo'"
    back-to="/processos"
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
          label-key="label"
          value-key="value"
        />

        <BaseSelect
          v-model="form.rua"
          label="Rua"
          required
          :options="ruas"
          label-key="rua"
        />

        <BaseSelect
          v-model="form.tipoPublicidade"
          label="Tipo de publicidade"
          required
          :options="tipos"
          label-key="publicidade"
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
            :disabled="submitting || loading"
          >
            {{ submitting ? 'A guardar...' : isEditing ? 'Atualizar' : 'Guardar' }}
          </BaseButton>
        </div>
      </div>
    </form>
  </BaseFormLayout>
</template>
