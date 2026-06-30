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
    'inline-flex items-center justify-center px-4 py-2 text-sm rounded-lg font-medium transition whitespace-nowrap'

  const disabledClass = props.disabled
    ? 'opacity-50 cursor-not-allowed'
    : ''

  switch (props.variant) {
    case 'secondary':
      return `${base} border border-slate-200 hover:bg-slate-100 text-slate-700 ${disabledClass}`

    case 'danger':
      return `${base} bg-red-50 text-red-600 hover:bg-red-100 ${disabledClass}`

    default:
      return `${base} bg-slate-900 text-white hover:bg-slate-800 ${disabledClass}`
  }
})
</script>
