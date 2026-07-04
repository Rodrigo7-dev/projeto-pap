<script setup>

import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props=defineProps({

currentPage:Number,

totalPages:Number

})

const emit=defineEmits([
'update:currentPage'
])

const go=(page)=>{

if(page<1)return

if(page>props.totalPages)return

emit('update:currentPage',page)

}

const pages=computed(()=>{

const list=[]

const total=props.totalPages

const current=props.currentPage

if(total<=7){

for(let i=1;i<=total;i++){

list.push(i)

}

return list

}

list.push(1)

let start=Math.max(current-1,2)
let end=Math.min(current+1,total-1)

if(start>2){

list.push('...')

}

for(let i=start;i<=end;i++){

list.push(i)

}

if(end<total-1){

list.push('...')

}

list.push(total)

return list

})

</script>

<template>

<div
v-if="totalPages>1"
class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4"
>

<BaseButton
variant="secondary"
:disabled="currentPage===1"
@click="go(currentPage-1)"
>

← Anterior

</BaseButton>

<div class="flex items-center gap-2">

<button
v-for="page in pages"
:key="page"
:disabled="page==='...'"
class="flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition"
:class="[
page===currentPage
?'border-[#0F4C81] bg-[#0F4C81] text-white'
:'border-slate-300 bg-white hover:bg-blue-50',
page==='...'
?'cursor-default border-transparent bg-transparent hover:bg-transparent'
:''
]"
@click="page!=='...' && go(page)"
>

{{ page }}

</button>

</div>

<BaseButton
variant="secondary"
:disabled="currentPage===totalPages"
@click="go(currentPage+1)"
>

Seguinte →

</BaseButton>

</div>

</template>