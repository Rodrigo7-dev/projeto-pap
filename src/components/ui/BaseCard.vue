<template>
  <div
    class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
  >
    <div
      :class="['flex min-h-0 flex-1 flex-col', padding]"
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