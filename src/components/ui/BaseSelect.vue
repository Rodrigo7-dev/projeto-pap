<template>

<div class="space-y-2">

<label
v-if="label"
class="block text-sm font-medium text-gray-700"
>
{{ label }}
</label>

<select
:value="modelValue"
@change="onChange"
v-bind="$attrs"
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
>

<option value="">
{{ placeholder }}
</option>

<option
v-for="option in safeOptions"
:key="
option._id ??
option.id ??
option[valueKey]
"
:value="
option._id ??
option.id ??
option[valueKey]
"
>

{{ option[labelKey] }}

</option>

</select>

</div>

</template>

<script setup>

import {
computed
}
from 'vue'

const props =
defineProps({

modelValue:{
type:[
String,
Number
],
default:''
},

options:{
type:Array,
default:()=>[]
},

label:{
type:String,
default:''
},

labelKey:{
type:String,
default:'label'
},

valueKey:{
type:String,
default:'_id'
},

placeholder:{
type:String,
default:'Selecionar'
}

})

const emit =
defineEmits([
'update:modelValue'
])

const safeOptions =
computed(
()=>props.options
??[]
)

const onChange =
(event)=>{

emit(
'update:modelValue',
event.target.value
)

}

</script>