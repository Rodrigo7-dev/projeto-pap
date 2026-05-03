<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'p-0'
  },
  shadow: {
    type: String,
    default: 'sm'
  },
  rounded: {
    type: String,
    default: 'xl'
  }
})

const classes = computed(() => {
  return [
    'bg-white border border-gray-200 overflow-hidden',
    `shadow-${props.shadow}`,
    `rounded-${props.rounded}`,
    props.padding
  ].join(' ')
})
</script>