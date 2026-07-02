<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
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
    ? 'mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8'
    : 'mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8'
)
</script>