<template>
<div class="min-h-screen bg-gray-50 p-6">

<div class="max-w-4xl mx-auto">

<!-- BLOQUEIO -->
<div
v-if="!auth.isAdmin"
class="bg-white border rounded-xl p-10 text-center"
>

<h2 class="text-2xl font-semibold mb-3">
Acesso negado
</h2>

<p class="text-gray-500 mb-6">
Apenas administradores podem gerir ruas.
</p>

<router-link
to="/ruas"
class="px-5 py-2 bg-gray-900 text-white rounded-lg"
>
Voltar
</router-link>

</div>

<template v-else>

<!-- HEADER -->
<div class="flex items-center mb-8">

<router-link
to="/ruas"
class="text-sm text-gray-600 hover:text-gray-900 mr-4"
>
← Voltar
</router-link>

<h1 class="text-3xl font-semibold">

{{ isEditing
? 'Editar Rua'
: 'Nova Rua'
}}

</h1>

</div>

<!-- FORM -->
<form
@submit.prevent="handleSubmit"
class="bg-white border rounded-xl shadow-sm p-6 space-y-5"
>

<div
v-if="loading"
class="text-center py-10 text-gray-500"
>
A carregar...
</div>

<template v-else>

<!-- RUA -->
<div>

<label class="block mb-2 text-sm font-medium">
Nome da Rua
</label>

<input
v-model="form.rua"
required
placeholder="Rua das Flores"
class="w-full px-4 py-2.5 border rounded-lg"
/>

</div>

<!-- FREGUESIA -->
<div>

<label class="block mb-2 text-sm font-medium">
Freguesia
</label>

<select
v-model="form.freguesia"
required
class="w-full px-4 py-2.5 border rounded-lg"
>

<option value="">
Selecionar freguesia
</option>

<option
v-for="f in freguesias"
:key="f._id || f.id"
:value="f._id || f.id"
>

{{ f.freguesia }}

</option>

</select>

</div>

<!-- COORDENADA -->
<div>

<label class="block mb-2 text-sm font-medium">
Coordenada
</label>

<input
v-model="form.coordenada"
required
placeholder="41.1579,-8.64442"
class="w-full px-4 py-2.5 border rounded-lg font-mono"
/>

</div>

</template>

<!-- ACTIONS -->
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

<router-link
to="/ruas"
class="px-4 py-2 border rounded-lg"
>
Cancelar
</router-link>

<button
type="submit"
:disabled="submitting"
class="px-5 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50"
>

{{ submitting
? 'A guardar...'
: isEditing
? 'Atualizar'
: 'Guardar'
}}

</button>

</div>

</div>

</form>

</template>

</div>

</div>
</template>

<script setup>
import {
ref,
computed,
onMounted
} from 'vue'

import {
useRouter,
useRoute
} from 'vue-router'

import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const loading = ref(false)
const submitting = ref(false)

const freguesias = ref([])

const form = ref({
rua:'',
freguesia:'',
coordenada:''
})

const isEditing =
computed(
() =>
!!route.params.id
)

const loadFreguesias =
async () => {

try {

const res =
await api.getFreguesias()

freguesias.value =
Array.isArray(
res?.data
)
? res.data
: Array.isArray(res)
? res
: []

}

catch {

freguesias.value=[]

}

}

const loadRua =
async () => {

if (
!isEditing.value
) return

loading.value=true

try {

const res =
await api.getRua(
route.params.id
)

const data =
res?.data ??
res

form.value = {

rua:
data.rua
?? '',

coordenada:
data.coordenada
?? '',

freguesia:
data.freguesia?._id
??
data.freguesia?.id
??
data.freguesia
??
''

}

}

catch {

router.push(
'/ruas'
)

}

finally {

loading.value=false

}

}

const handleSubmit =
async () => {

if (
submitting.value
) return

if (
!form.value.rua.trim()
||
!form.value.coordenada.trim()
||
!form.value.freguesia
) {

alert(
'Preencha todos os campos'
)

return

}

submitting.value=true

try {

const payload = {

rua:
form.value.rua.trim(),

coordenada:
form.value.coordenada.trim(),

freguesia:
form.value.freguesia

}

if (
isEditing.value
) {

await api.updateRua(
route.params.id,
payload
)

}

else {

await api.createRua(
payload
)

}

router.push(
'/ruas'
)

}

catch (error) {

console.error(
error
)

alert(
'Erro ao guardar'
)

}

finally {

submitting.value=false

}

}

const handleDelete =
async () => {

if (
!confirm(
'Eliminar esta rua?'
)
) return

try {

await api.deleteRua(
route.params.id
)

router.push(
'/ruas'
)

}

catch {

alert(
'Erro ao eliminar'
)

}

}

onMounted(
async () => {

await loadFreguesias()

await loadRua()

}
)
</script>