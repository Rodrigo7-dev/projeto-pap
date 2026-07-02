<template>
  <div class="flex h-screen flex-col bg-slate-50">
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
  [
    'mx-auto flex min-h-0 flex-1 flex-col w-full px-4 py-5 sm:px-6 lg:px-8',
    props.narrow ? 'max-w-4xl' : 'max-w-6xl'
  ]
)
</script>