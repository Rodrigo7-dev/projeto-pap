<template>
<BaseLayout>

<BasePageHeader
title="Gestão de Processos"
subtitle="Consulta e gestão de processos ativos"
>
<BaseButton @click="router.push('/processos/novo')">
+ Novo Processo
</BaseButton>
</BasePageHeader>

<BaseCard>

<div class="p-4 border-b border-gray-100">

<BaseInput
v-model="search"
placeholder="Pesquisar processo, alvará, rua ou publicidade..."
/>

</div>

<div
v-if="loading"
class="text-center py-10 text-gray-500"
>
A carregar processos...
</div>

<div
v-else-if="filteredProcessos.length"
class="overflow-x-auto"
>

<table class="w-full text-sm">

<thead class="bg-gray-50 text-gray-600 text-xs uppercase">

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
Utilizador
</th>

<th class="px-6 py-4 text-left">
Estado
</th>

<th class="px-6 py-4 text-right">
Ações
</th>

</tr>

</thead>

<tbody class="divide-y divide-gray-100">

<tr
v-for="p in filteredProcessos"
:key="p._id || p.id"
class="hover:bg-gray-50"
>

<td class="px-6 py-4 font-medium">
{{ p.processo }}
</td>

<td class="px-6 py-4">
{{ p.alvara || '-' }}
</td>

<td class="px-6 py-4">
{{ p.tipoPublicidade?.publicidade || '-' }}
</td>

<td class="px-6 py-4">
{{ p.rua?.rua || '-' }}
</td>

<td class="px-6 py-4">
{{ p.user?.name || '-' }}
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

<span
v-else
class="text-xs text-gray-400"
>
Sem permissão
</span>

</td>

</tr>

</tbody>

</table>

</div>

<div
v-else
class="text-center py-14"
>

<div class="text-4xl mb-2">
📄
</div>

<p class="font-medium">
Nenhum processo encontrado
</p>

<p class="text-sm text-gray-500">
Tenta alterar a pesquisa
</p>

</div>

</BaseCard>

</BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

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

const res = await api.getProcessos()

processos.value =
Array.isArray(res)
? res
: []

}
catch (e) {

console.error(e)

processos.value=[]

}
finally{

loading.value=false

}
}

const canEdit = (p) => {

if (auth.isAdmin) {
return true
}

return (
String(
p.user?._id ||
p.user?.id
)

===

String(
auth.user?.id ||
auth.user?._id
)
)

}

const filteredProcessos = computed(() => {

const t = search.value.toLowerCase()

return processos.value.filter(p =>

(p.processo || '')
.toLowerCase()
.includes(t)

||

(p.alvara || '')
.toLowerCase()
.includes(t)

||

(p.tipoPublicidade?.publicidade || '')
.toLowerCase()
.includes(t)

||

(p.rua?.rua || '')
.toLowerCase()
.includes(t)

||

(p.user?.name || '')
.toLowerCase()
.includes(t)

)

})

const editProcesso = (id) => {

router.push(
`/processos/${id}/editar`
)

}

const formatEstado = (v) => {

return v === 'valido'
? 'Válido'
: 'Inválido'

}

const statusClass = (v) => {

return v === 'valido'
? 'bg-green-50 text-green-700'
: 'bg-red-50 text-red-700'

}

onMounted(loadProcessos)
</script>