<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

import BaseLayout from '@/components/layout/BaseLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const auth = useAuthStore()

const destination = computed(() => {
return auth.isAuthenticated
? '/dashboard'
: '/login'
})

const buttonText = computed(() => {
return auth.isAuthenticated
? 'Voltar ao Painel'
: 'Ir para Login'
})
</script>

<template>

<BaseLayout>

<div class="min-h-[70vh] flex items-center justify-center">

<div class="text-center max-w-lg">

<div
class="text-8xl font-semibold text-gray-900"
>
404
</div>

<h1
class="mt-6 text-3xl font-semibold text-gray-900"
>
Página não encontrada
</h1>

<p
class="mt-3 text-gray-500"
>
A página que tentou aceder não existe ou foi removida.
</p>

<div class="mt-8">

<router-link
:to="destination"
>

<BaseButton>

{{ buttonText }}

</BaseButton>

</router-link>

</div>

</div>

</div>

</BaseLayout>

</template>