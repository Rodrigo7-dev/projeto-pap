<template>
  <button
    :class="classes"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])

const classes = computed(() => {
  const base =
    'px-4 py-2 text-sm rounded-lg font-medium transition'

  const disabledClass = props.disabled
    ? 'opacity-50 cursor-not-allowed'
    : ''

  switch (props.variant) {
    case 'secondary':
      return `${base} border border-gray-200 hover:bg-gray-100 text-gray-700 ${disabledClass}`

    case 'danger':
      return `${base} bg-red-50 text-red-600 hover:bg-red-100 ${disabledClass}`

    default:
      return `${base} bg-gray-900 text-white hover:bg-gray-800 ${disabledClass}`
  }
})
</script>