<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)

const tipos = ref([])
const ruas = ref([])

const isEditing = computed(() => !!route.params.id)

const form = ref({
  processo: '',
  alvara: '',
  alojamento_local: '',
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

    tipos.value =
      Array.isArray(tiposRes?.data)
        ? tiposRes.data
        : []

    ruas.value =
      Array.isArray(ruasRes?.data)
        ? ruasRes.data
        : []

    if (isEditing.value) {
      const res = await api.getProcesso(route.params.id)

      const data = res?.data ?? res

      form.value = {
        processo: data.processo ?? '',
        alvara: data.alvara ?? '',
        alojamento_local: data.alojamento_local ?? '',
        validade: data.validade ?? 'valido',

        rua:
          data.rua?.id ??
          data.rua?._id ??
          '',

        tipoPublicidade:
          data.tipo_publicidade?.id ??
          data.tipo_publicidade?._id ??
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
  return (
    form.value.processo.trim() &&
    form.value.alojamento_local.trim() &&
    form.value.rua &&
    form.value.tipoPublicidade
  )
}

const handleSubmit = async () => {
  if (loading.value) return

  if (!isValid()) {
    alert('Preencha todos os campos obrigatórios')
    return
  }

  loading.value = true

  try {

    const payload = {
      processo: form.value.processo.trim(),
      alvara: form.value.alvara.trim(),
      alojamento_local: form.value.alojamento_local.trim(),
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
    alert('Erro ao guardar processo')

  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Eliminar este processo?')) return

  try {
    await api.deleteProcesso(route.params.id)

    router.push('/processos')

  } catch (error) {
    console.error(error)
    alert('Erro ao eliminar')
  }
}

onMounted(fetchData)
</script>

<template>
<div class="min-h-screen bg-gray-50 p-6">

<div class="max-w-4xl mx-auto">

<div class="flex items-center mb-8">

<router-link
to="/processos"
class="text-sm text-gray-600 hover:text-gray-900 mr-4"
>
← Voltar
</router-link>

<h1 class="text-3xl font-semibold">
{{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
</h1>

</div>

<form
@submit.prevent="handleSubmit"
class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5"
>

<div
v-if="loading"
class="text-center py-8 text-gray-500"
>
A carregar...
</div>

<template v-else>

<BaseInput
v-model="form.processo"
label="Processo"
placeholder="PROC123"
/>

<BaseInput
v-model="form.alvara"
label="Alvará"
placeholder="ALV123"
/>

<BaseInput
v-model="form.alojamento_local"
label="Alojamento Local"
placeholder="SIM"
/>

<BaseSelect
v-model="form.validade"
label="Validade"
:options="[
{ label:'Válido', value:'valido' },
{ label:'Inválido', value:'invalido' }
]"
/>

<BaseSelect
v-model="form.rua"
label="Rua"
:options="ruas"
labelKey="rua"
valueKey="id"
placeholder="Selecionar rua"
/>

<BaseSelect
v-model="form.tipoPublicidade"
label="Tipo de Publicidade"
:options="tipos"
labelKey="publicidade"
valueKey="id"
placeholder="Selecionar tipo"
/>

</template>

<div class="flex justify-between pt-4">

<button
v-if="isEditing"
type="button"
@click="handleDelete"
class="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
>
Eliminar
</button>

<div class="flex gap-2 ml-auto">

<button
type="button"
@click="router.push('/processos')"
class="px-4 py-2 border rounded-lg"
>
Cancelar
</button>

<button
type="submit"
:disabled="loading"
class="px-5 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50"
>
{{ loading
? 'A guardar...'
: isEditing
? 'Atualizar'
: 'Guardar'
}}
</button>

</div>

</div>

</form>

</div>

</div>
</template>