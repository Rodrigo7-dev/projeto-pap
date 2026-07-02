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
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-1'

  const disabledClass = props.disabled
    ? 'cursor-not-allowed opacity-50'
    : ''

  switch (props.variant) {
    case 'secondary':
      return `${base} border border-slate-200 text-slate-700 hover:bg-slate-100 ${disabledClass}`

    case 'danger':
      return `${base} bg-rose-50 text-rose-600 hover:bg-rose-100 ${disabledClass}`

    default:
      return `${base} bg-slate-900 text-white hover:bg-slate-800 ${disabledClass}`
  }
})
</script>
