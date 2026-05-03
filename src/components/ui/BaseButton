<template>
  <button :class="classes" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  }
})

defineEmits(['click'])

const classes = computed(() => {
  const base =
    'px-4 py-2 text-sm rounded-lg font-medium transition'

  switch (props.variant) {
    case 'secondary':
      return base + ' border border-gray-200 hover:bg-gray-100 text-gray-700'

    case 'danger':
      return base + ' bg-red-50 text-red-600 hover:bg-red-100'

    default:
      return base + ' bg-gray-900 text-white hover:bg-gray-800'
  }
})
</script>