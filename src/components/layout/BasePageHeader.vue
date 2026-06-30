<template>

<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">

<div>

<h1 class="text-2xl sm:text-3xl font-semibold text-slate-900">
{{ title }}
</h1>

<p
v-if="subtitle"
class="mt-1 text-sm text-slate-500"
>
{{ subtitle }}
</p>

</div>

<div
v-if="$slots.default"
class="flex shrink-0 flex-col gap-2 sm:flex-row"
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
