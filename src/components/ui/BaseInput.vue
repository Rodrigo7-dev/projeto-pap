<template>

<div class="space-y-2">

<label
v-if="label"
class="block text-sm font-medium text-gray-700"
>
{{ label }}
</label>

<input
:value="modelValue"
@input="onInput"
v-bind="$attrs"
:type="type"
class="
w-full
px-4
py-2.5
border
border-gray-200
rounded-lg
text-sm
bg-white
focus:outline-none
focus:ring-2
focus:ring-gray-900/10
"
/>

</div>

</template>

<script setup>

defineProps({
modelValue:{
type:[String,Number],
default:''
},

type:{
type:String,
default:'text'
},

label:{
type:String,
default:''
}
})

const emit =
defineEmits([
'update:modelValue'
])

const onInput =
(event)=>{

emit(
'update:modelValue',
event.target.value
)

}

</script>