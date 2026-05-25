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

const tipos = ref([])
const search = ref('')
const loading = ref(false)

const loadTipos = async () => {

loading.value = true

try {

const res =
await api.getTipos()

const lista =
res?.data ??
res ??
[]

tipos.value =
Array.isArray(lista)
? lista
: []

}

catch (error) {

console.error(
'Erro ao carregar tipos:',
error
)

tipos.value=[]

}

finally {

loading.value=false

}

}

const filteredTipos = computed(() => {

const term =
search.value
.toLowerCase()
.trim()

return tipos.value.filter(tipo => {

return (

(
tipo.publicidade
||
tipo.tipo
||
''
)

.toLowerCase()
.includes(term)

)

})

})

const editTipo = (id) => {

router.push(
`/tipos/${id}/editar`
)

}

onMounted(loadTipos)
</script>

<template>

<BaseLayout>

<BasePageHeader
title="Tipos de Publicidade"
subtitle="Gestão dos tipos disponíveis no sistema"
>

<BaseButton
v-if="auth.isAdmin"
@click="router.push('/tipos/novo')"
>

+ Novo Tipo

</BaseButton>

</BasePageHeader>

<BaseCard>

<div class="p-4 border-b">

<BaseInput
v-model="search"
placeholder="Pesquisar tipos..."
/>

</div>

<div
v-if="loading"
class="text-center py-10"
>

A carregar...

</div>

<div
v-else-if="filteredTipos.length"
class="overflow-x-auto"
>

<table class="w-full">

<thead class="bg-gray-50">

<tr>

<th class="px-6 py-4 text-left">
Publicidade
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
v-for="tipo in filteredTipos"
:key="tipo._id || tipo.id"
class="border-t"
>

<td class="px-6 py-4">

{{ tipo.publicidade || tipo.tipo }}

</td>

<td
v-if="auth.isAdmin"
class="px-6 py-4 text-right"
>

<BaseButton
variant="secondary"
@click="
editTipo(
tipo._id || tipo.id
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

📂

<p>

Nenhum tipo encontrado

</p>

</div>

</BaseCard>

</BaseLayout>

</template>