<template>
  <button
    :class="[classes, $attrs.class]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

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

const base =
  'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none'

const classes = computed(() => {
  if (props.disabled) {
    return `${base} opacity-50 cursor-not-allowed`
  }

  switch (props.variant) {
    case 'secondary':
      return `${base} border border-slate-300 bg-white text-slate-700 hover:bg-blue-50 hover:border-[#0F4C81]`

    case 'danger':
      return `${base} bg-red-600 text-white hover:bg-red-700`

    default:
      return `${base} bg-[#0F4C81] text-white shadow hover:bg-[#0B3D69] hover:shadow-lg`
  }
})
</script>