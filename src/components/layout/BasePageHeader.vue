<template>

<div
class="mb-6 flex flex-col items-center gap-5 lg:flex-row lg:justify-between"
>

<div>

<h1
class="text-3xl font-bold tracking-tight text-[#0F4C81]"
>

{{ title }}

</h1>

<p
v-if="subtitle"
class="mt-2 text-slate-500"
>

{{ subtitle }}

</p>

</div>

<div
v-if="$slots.default"
class="flex flex-col gap-2 sm:flex-row"
>

<slot/>

</div>

</div>

</template>

<script setup>

defineProps({

title:String,
subtitle:String

})

</script>