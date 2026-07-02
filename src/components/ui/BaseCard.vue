<template>
  <div
    class="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
  >
    <div
      :class="['flex flex-1 flex-col overflow-hidden', padding]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  padding: {
    type: String,
    default: 'p-0'
  }
})
</script>