<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'

import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

import BaseLayout from '@/components/layout/BaseLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePageHeader from '@/components/layout/BasePageHeader.vue'

const router = useRouter()
const auth = useAuthStore()

const ruas = ref([])
const search = ref('')
const loading = ref(false)

const loadRuas = async () => {
  loading.value = true

  try {
    const res = await api.getRuas()

    const lista =
      res?.data ??
      res ??
      []

    ruas.value =
      Array.isArray(lista)
        ? lista
        : []

  } catch (error) {

    console.error(error)

    ruas.value = []

  } finally {

    loading.value = false

  }
}

const getFreguesia = (rua) => {
  return (
    rua?.freguesia?.freguesia ||
    rua?.freguesia?.nome ||
    rua?.freguesia ||
    '-'
  )
}

const filteredRuas = computed(() => {

  const term =
    search.value
      .toLowerCase()
      .trim()

  return ruas.value.filter((rua) => {

    return (

      (rua.rua || '')
        .toLowerCase()
        .includes(term)

      ||

      getFreguesia(rua)
        .toLowerCase()
        .includes(term)

      ||

      (rua.coordenada || '')
        .toLowerCase()
        .includes(term)

    )

  })

})

const editRua = (id) => {
  router.push(
    `/ruas/${id}/editar`
  )
}

onMounted(loadRuas)
</script>

<template>

<BaseLayout>

<BasePageHeader
title="Gestão de Ruas"
subtitle="Consulta e gestão de ruas registadas"
>

<BaseButton
v-if="auth.isAdmin"
@click="router.push('/ruas/nova')"
>
+ Nova Rua
</BaseButton>

</BasePageHeader>

<BaseCard>

<div class="p-4 border-b">

<BaseInput
v-model="search"
placeholder="Pesquisar ruas..."
/>

</div>

<div
v-if="loading"
class="text-center py-10 text-gray-500"
>
A carregar...
</div>

<div
v-else-if="filteredRuas.length"
class="overflow-x-auto"
>

<table class="w-full">

<thead class="bg-gray-50">

<tr>

<th class="px-6 py-4 text-left">
Rua
</th>

<th class="px-6 py-4 text-left">
Coordenada
</th>

<th class="px-6 py-4 text-left">
Freguesia
</th>

<th
v-if="auth.isAdmin"
class="px-6 py-4 text-right"
>
Ações
</th>

</tr>

</thead>

<tbody>

<tr
v-for="rua in filteredRuas"
:key="rua._id || rua.id"
class="border-t hover:bg-gray-50"
>

<td class="px-6 py-4 font-medium">
{{ rua.rua }}
</td>

<td class="px-6 py-4 text-gray-500 font-mono text-xs">
{{ rua.coordenada || '-' }}
</td>

<td class="px-6 py-4">
{{ getFreguesia(rua) }}
</td>

<td
v-if="auth.isAdmin"
class="px-6 py-4 text-right"
>

<BaseButton
variant="secondary"
@click="
editRua(
rua._id || rua.id
)
"
>

Editar

</BaseButton>

</td>

</tr>

</tbody>

</table>

</div>

<div
v-else
class="text-center py-14"
>

📍

<p class="mt-3">
Nenhuma rua encontrada
</p>

</div>

</BaseCard>

</BaseLayout>

</template>