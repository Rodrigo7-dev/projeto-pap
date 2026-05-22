<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

import BaseLayout from '@/components/layout/BaseLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePageHeader from '@/components/layout/BasePageHeader.vue'

const router = useRouter()
const auth = useAuthStore()

const processos = ref([])
const search = ref('')
const loading = ref(false)

const loadProcessos = async () => {
loading.value = true

try {

const res =
await api.getProcessos()

console.log('PROCESSOS', res)

const lista =
res?.data ??
res ??
[]

processos.value =
Array.isArray(lista)
? lista
: []

}
catch (error) {

console.error(error)

processos.value=[]

}
finally{

loading.value=false

}
}

const filteredProcessos = computed(() => {

const t =
search.value
.toLowerCase()
.trim()

return processos.value.filter(p => {

return (

(p.processo||'')
.toLowerCase()
.includes(t)

||

(p.alvara||'')
.toLowerCase()
.includes(t)

||

(p.rua?.rua||'')
.toLowerCase()
.includes(t)

||

(
p.tipoPublicidade?.publicidade
||
p.tipo_publicidade?.publicidade
||
''
)
.toLowerCase()
.includes(t)

||

(p.user?.name||'')
.toLowerCase()
.includes(t)

)

})

})

const canEdit = (p) => {

if (
auth.isAdmin
) {
return true
}

const owner =
String(
p.user?._id ??
p.user?.id ??
p.user
)

const current =
String(
auth.user?.id ??
auth.user?._id
)

return owner===current

}

const editProcesso = (id) => {
router.push(
`/processos/${id}/editar`
)
}

const formatEstado = (estado) => {
return estado === 'valido'
? 'Válido'
: 'Inválido'
}

const statusClass = (estado) => {

return estado === 'valido'
? 'bg-green-50 text-green-700'
: 'bg-red-50 text-red-700'

}

onMounted(loadProcessos)
</script>

<template>

<BaseLayout>

<BasePageHeader
title="Gestão de Processos"
subtitle="Consulta e gestão de processos ativos"
>

<BaseButton
@click="router.push('/processos/novo')"
>
+ Novo Processo
</BaseButton>

</BasePageHeader>

<BaseCard>

<div class="p-4 border-b">

<BaseInput
v-model="search"
placeholder="Pesquisar processos..."
/>

</div>

<div
v-if="loading"
class="text-center py-10"
>
A carregar...
</div>

<div
v-else-if="filteredProcessos.length"
class="overflow-x-auto"
>

<table class="w-full">

<thead class="bg-gray-50">

<tr>

<th class="px-6 py-4 text-left">
Processo
</th>

<th class="px-6 py-4 text-left">
Alvará
</th>

<th class="px-6 py-4 text-left">
Publicidade
</th>

<th class="px-6 py-4 text-left">
Rua
</th>

<th class="px-6 py-4 text-left">
Estado
</th>

<th class="px-6 py-4 text-right">
Ações
</th>

</tr>

</thead>

<tbody>

<tr
v-for="p in filteredProcessos"
:key="p._id || p.id"
class="border-t"
>

<td class="px-6 py-4">
{{ p.processo }}
</td>

<td class="px-6 py-4">
{{ p.alvara || '-' }}
</td>

<td class="px-6 py-4">
{{ p.tipoPublicidade?.publicidade || p.tipo_publicidade?.publicidade || '-' }}
</td>

<td class="px-6 py-4">
{{ p.rua?.rua || '-' }}
</td>

<td class="px-6 py-4">

<span
class="px-3 py-1 rounded-full text-xs"
:class="statusClass(p.validade)"
>

{{ formatEstado(p.validade) }}

</span>

</td>

<td class="px-6 py-4 text-right">

<BaseButton
v-if="canEdit(p)"
variant="secondary"
@click="editProcesso(p._id || p.id)"
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

📄

<p>
Nenhum processo encontrado
</p>

</div>

</BaseCard>

</BaseLayout>

</template>