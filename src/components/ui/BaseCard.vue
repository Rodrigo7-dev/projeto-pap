<template>

<div
class="
bg-white
border
border-slate-200
rounded-lg
shadow-sm
overflow-hidden
"
>

<div :class="padding">

<slot />

</div>

</div>

</template>

<script setup>

defineProps({

padding:{
type:String,
default:'p-0'
}

})

</script>
