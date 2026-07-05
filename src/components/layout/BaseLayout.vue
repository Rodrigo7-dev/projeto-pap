<template>
  <div class="min-h-screen bg-slate-100">
    <main :class="containerClass">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  narrow: {
    type: Boolean,
    default: false
  }
})

const containerClass = computed(() =>
  props.narrow
    ? 'mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8'
    : 'mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'
)
</script>