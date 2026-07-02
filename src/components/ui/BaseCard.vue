<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div :class="padding">
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
