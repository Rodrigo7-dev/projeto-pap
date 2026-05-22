<template>

<nav
class="
bg-white
border-b
border-gray-200
sticky
top-0
z-50
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

<!-- LOGO -->

<div
class="
flex
items-center
gap-3
"
>

<img
:src="logo"
class="
h-9
w-9
rounded-lg
object-cover
"
/>

<div>

<p
class="
font-semibold
text-gray-900
"
>
Sistema
</p>

<p
class="
text-xs
text-gray-500
"
>
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
gap-6
"
>

<router-link
to="/dashboard"
class="nav"
>
Painel
</router-link>

<router-link
to="/processos"
class="nav"
>
Processos
</router-link>

<template
v-if="auth.isAdmin"
>

<router-link
to="/ruas"
class="nav"
>
Ruas
</router-link>

<router-link
to="/freguesias"
class="nav"
>
Freguesias
</router-link>

<router-link
to="/tipos"
class="nav"
>
Publicidade
</router-link>

</template>

</div>

<!-- RIGHT -->

<div
class="
flex
items-center
gap-3
"
>

<div
class="
hidden
md:block
text-right
"
>

<p
class="
text-sm
font-medium
text-gray-900
"
>

{{ auth.user?.name }}

</p>

<p
class="
text-xs
text-gray-500
"
>

{{ auth.isAdmin ? 'Administrador' : 'Utilizador' }}

</p>

</div>

<BaseButton
variant="secondary"
@click="logout"
>
Sair
</BaseButton>

</div>

</div>

</nav>

</template>

<script setup>

import {
useRouter
} from 'vue-router'

import {
useAuthStore
} from '@/stores/auth'

import BaseButton from '@/components/ui/BaseButton.vue'

import logo from '@/assets/logo_camera.jpg'

const router =
useRouter()

const auth =
useAuthStore()

const logout =
async ()=>{

try{

await auth.logout()

}
finally{

router.push(
'/login'
)

}

}

</script>

<style scoped>

.nav{

color:#6b7280;

font-size:14px;

font-weight:500;

transition:.2s;

}

.nav:hover{

color:#111827;

}

.router-link-active{

color:#111827;

border-bottom:
2px solid
#111827;

padding-bottom:
6px;

}

</style>