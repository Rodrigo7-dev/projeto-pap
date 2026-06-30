<template>

<nav
class="
sticky
top-0
z-50
bg-white
border-b
border-gray-200
"
>

<div
class="
max-w-7xl
mx-auto
px-6
h-16
flex
items-center
justify-between
"
>

<!-- ESQUERDA -->

<div class="flex items-center gap-10">

<div class="flex items-center gap-3">

<img
:src="logo"
alt="Logo"
class="
h-9
w-9
rounded-lg
object-cover
"
/>

<div>

<p class="font-semibold text-gray-900">
Sistema
</p>

<p class="text-xs text-gray-500">
Gestão
</p>

</div>

</div>

<!-- MENU -->

<div
class="
hidden
md:flex
items-center
gap-1
"
>

<router-link
to="/dashboard"
class="nav-link"
>
Painel
</router-link>

<router-link
to="/processos"
class="nav-link"
>
Processos
</router-link>

<template v-if="auth.isAdmin">

<router-link
to="/ruas"
class="nav-link"
>
Ruas
</router-link>

<router-link
to="/freguesias"
class="nav-link"
>
Freguesias
</router-link>

<router-link
to="/tipos"
class="nav-link"
>
Publicidade
</router-link>

</template>

</div>

</div>

<!-- DIREITA -->

<div class="flex items-center gap-4">

<div
class="
hidden
lg:block
text-right
"
>

<p class="text-sm font-medium text-gray-900">

{{ auth.user?.name }}

</p>

<p class="text-xs text-gray-500">

{{ auth.isAdmin
? 'Administrador'
: 'Utilizador'
}}

</p>

</div>

<BaseButton
variant="secondary"
size="sm"
@click="logout"
>

Sair

</BaseButton>

</div>

</div>

</nav>

</template>

<script setup>

import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import BaseButton from '@/components/ui/BaseButton.vue'

import logo from '@/assets/logo_camera.jpg'

const router = useRouter()
const auth = useAuthStore()

const logout = async () => {

try {

await auth.logout()

}

finally {

router.replace('/login')

}

}

</script>

<style scoped>

.nav-link{

@apply
px-3
py-2
rounded-lg
text-sm
font-medium
text-gray-500
transition;

}

.nav-link:hover{

@apply
bg-gray-100
text-gray-900;

}

.router-link-active{

@apply
bg-gray-900
text-white;

}

</style>