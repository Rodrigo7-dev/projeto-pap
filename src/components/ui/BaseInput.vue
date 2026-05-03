<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
    :type="type"
    class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
  />
</template>

<script setup>
defineProps({
  modelValue: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text'
  }
})

defineEmits(['update:modelValue'])
</script>