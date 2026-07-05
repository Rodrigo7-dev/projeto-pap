<template>

<nav class="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

<div class="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">

<div class="flex items-center gap-5">

<img
:src="logo"
class="h-12 w-12 object-contain"
>

<div>

<h1 class="text-xl font-bold text-[#0F4C81]">

Sistema de Publicidade

</h1>

<p class="text-sm text-slate-500">

Município de Barcelos

</p>

</div>

</div>

<div class="hidden items-center gap-2 lg:flex">

<router-link
v-for="item in navItems"
:key="item.to"
:to="item.to"
class="nav-link"
>

{{ item.label }}

</router-link>

</div>

<div class="flex items-center gap-4">

<div class="hidden text-right lg:block">

<p class="font-semibold">

{{ auth.user?.name }}

</p>

<p class="text-xs text-slate-500">

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

import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

import BaseButton from '@/components/ui/BaseButton.vue'

import logo from '@/assets/logo_camera.jpg'

const router=useRouter()

const auth=useAuthStore()

const navItems=computed(()=>{

const items=[

{
to:'/painel',
label:'Painel'
},

{
to:'/processos',
label:'Processos'
}

]

if(auth.isAdmin){

items.push(

{
to:'/ruas',
label:'Ruas'
},

{
to:'/freguesias',
label:'Freguesias'
},

{
to:'/tipos',
label:'Publicidade'
}

)

}

return items

})

const logout=async()=>{

try{

await auth.logout()

}
finally{

router.replace('/login')

}

}

</script>

<style scoped>

.nav-link{

@apply rounded-xl
px-4
py-2
text-sm
font-semibold
text-slate-700
transition-all
duration-200;

}

.nav-link:hover{

@apply bg-blue-50
text-[#0F4C81];

}

.router-link-active{

background:#0F4C81;
color:white;
box-shadow:0 6px 18px rgba(15,76,129,.18);

}

</style>