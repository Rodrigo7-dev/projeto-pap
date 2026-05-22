<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)

const tipos = ref([])
const ruas = ref([])

const isEditing = computed(
  () => !!route.params.id
)

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

    const [
      tiposRes,
      ruasRes
    ] =
    await Promise.all([
      api.getTipos(),
      api.getRuas()
    ])

    tipos.value =
      tiposRes?.data ??
      []

    ruas.value =
      ruasRes?.data ??
      []

    if (
      isEditing.value
    ) {

      const res =
        await api.getProcesso(
          route.params.id
        )

      const data =
        res?.data ??
        res

      form.value = {

        processo:
          data.processo ??
          '',

        alvara:
          data.alvara ??
          '',

        alojamentoLocal:
          data.alojamentoLocal ??
          data.alojamento_local ??
          '',

        validade:
          data.validade ??
          'valido',

        rua:
          data.rua?._id ??
          data.rua?.id ??
          data.rua ??
          '',

        tipoPublicidade:
          data.tipoPublicidade?._id ??
          data.tipoPublicidade?.id ??
          data.tipo_publicidade?._id ??
          data.tipo_publicidade?.id ??
          ''
      }

    }

  }

  catch (error) {

    console.error(error)

    alert(
      'Erro ao carregar dados'
    )

  }

  finally {

    loading.value = false

  }

}

const isValid = () => {

  return (

    form.value.processo
      ?.trim()

    &&

    form.value.rua

    &&

    form.value.tipoPublicidade

  )

}

const handleSubmit = async () => {

  if (
    submitting.value
  ) return

  if (
    !isValid()
  ) {

    alert(
      'Preencha os campos obrigatórios'
    )

    return

  }

  submitting.value = true

  try {

    const payload = {

      processo:
        form.value.processo
          .trim(),

      alvara:
        (
          form.value.alvara
          ||
          ''
        ).trim(),

      alojamentoLocal:
        (
          form.value.alojamentoLocal
          ||
          ''
        ).trim(),

      validade:
        form.value.validade,

      rua:
        form.value.rua,

      tipoPublicidade:
        form.value.tipoPublicidade

    }

    if (
      isEditing.value
    ) {

      await api.updateProcesso(
        route.params.id,
        payload
      )

    }

    else {

      await api.createProcesso(
        payload
      )

    }

    router.push(
      '/processos'
    )

  }

  catch (error) {

    console.error(error)

    alert(
      'Erro ao guardar'
    )

  }

  finally {

    submitting.value = false

  }

}

const handleDelete = async () => {

  if (
    !confirm(
      'Eliminar este processo?'
    )
  ) return

  try {

    await api.deleteProcesso(
      route.params.id
    )

    router.push(
      '/processos'
    )

  }

  catch {

    alert(
      'Erro ao eliminar'
    )

  }

}

onMounted(
  fetchData
)
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
class="text-center py-8"
>

A carregar...

</div>

<template v-else>

<BaseInput
v-model="form.processo"
label="Processo"
/>

<BaseInput
v-model="form.alvara"
label="Alvará"
/>

<BaseInput
v-model="form.alojamentoLocal"
label="Alojamento Local"
/>

<BaseSelect
v-model="form.validade"
label="Validade"
:options="[

{
label:'Válido',
value:'valido'
},

{
label:'Inválido',
value:'invalido'
}

]"
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
label="Tipo de Publicidade"
:options="tipos"
labelKey="publicidade"
valueKey="_id"
/>

</template>

<div class="flex justify-between pt-4">

<button
v-if="isEditing"
type="button"
@click="handleDelete"
class="px-4 py-2 bg-red-50 text-red-600 rounded-lg"
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
:disabled="submitting"
class="px-5 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50"
>

{{
submitting
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