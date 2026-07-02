<template>
  <div class="space-y-2">
    <label
      v-if="label"
      class="block text-sm font-medium text-slate-700"
    >
      {{ label }}
    </label>

    <input
      :value="modelValue"
      :type="type"
      v-bind="$attrs"
      class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/10"
      @keydown="handleKeyDown"
      @input="handleInput"
    />
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  numericOnly: {
    type: Boolean,
    default: false
  }
})

const handleKeyDown = (event) => {
  if (!props.numericOnly) return

  // Permitir teclas de edição
  const allowed = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'Home',
    'End'
  ]

  if (allowed.includes(event.key) || event.ctrlKey || event.metaKey) {
    return
  }

  // Bloquear tudo o que não seja número
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  let value = event.target.value

  console.log(props.numericOnly)

  if (props.numericOnly) {
  value = value.replace(/\D/g, '').slice(0, 9)
}

  emit('update:modelValue', value)
}
</script>