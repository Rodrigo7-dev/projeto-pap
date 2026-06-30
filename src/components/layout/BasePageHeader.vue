<template>

<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">

<div>

<h1 class="text-3xl font-semibold text-gray-900">
{{ title }}
</h1>

<p
v-if="subtitle"
class="mt-1 text-sm text-gray-500"
>
{{ subtitle }}
</p>

</div>

<div
v-if="$slots.default"
class="shrink-0"
>
<slot />
</div>

</div>

</template>

<script setup>

defineProps({

title:{
type:String,
required:true
},

subtitle:{
type:String,
default:''
}

})

</script>