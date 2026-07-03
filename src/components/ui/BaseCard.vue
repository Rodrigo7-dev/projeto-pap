<template>
  <div
    class="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
  >
    <div
      :class="padding"
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