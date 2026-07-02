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
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
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
  }
})

defineEmits(['update:modelValue'])
</script>
