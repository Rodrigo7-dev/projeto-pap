<template>
  <div class="min-h-screen bg-white">
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
    ? 'mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8'
    : 'mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8'
)
</script>