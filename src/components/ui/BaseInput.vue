<template>
  <div class="space-y-2">

    <label
      v-if="label"
      class="text-sm font-semibold text-slate-700"
    >
      {{ label }}
    </label>

    <input
      :value="modelValue"
      :type="type"
      v-bind="$attrs"
      class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition focus:border-[#0F4C81] focus:ring-4 focus:ring-blue-100"
      @keydown="handleKeyDown"
      @input="handleInput"
    >

  </div>
</template>

<script setup>
defineOptions({ inheritAttrs:false })

const props=defineProps({
modelValue:[String,Number],
type:{
type:String,
default:'text'
},
label:String,
numericOnly:Boolean
})

const emit=defineEmits(['update:modelValue'])

const handleKeyDown=(event)=>{

if(!props.numericOnly) return

const allowed=[
'Backspace',
'Delete',
'ArrowLeft',
'ArrowRight',
'Tab',
'Home',
'End'
]

if(allowed.includes(event.key)||event.ctrlKey||event.metaKey)
return

if(!/^\d$/.test(event.key))
event.preventDefault()

}

const handleInput=(event)=>{

let value=event.target.value

if(props.numericOnly){
value=value.replace(/\D/g,'').slice(0,9)
}

emit('update:modelValue',value)

}
</script>