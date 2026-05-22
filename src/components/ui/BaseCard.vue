<template>

<div
class="
bg-white
border
border-gray-200
rounded-xl
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