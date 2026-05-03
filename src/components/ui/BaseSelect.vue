<script setup>
defineProps({
  modelValue: [String, Number],
  options: Array,
  placeholder: String,
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <select
    :value="modelValue"
    @change="emit('update:modelValue', $event.target.value)"
    class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
  >
    <option value="">
      {{ placeholder }}
    </option>

    <option
      v-for="opt in options"
      :key="opt[valueKey]"
      :value="opt[valueKey]"
    >
      {{ opt[labelKey] }}
    </option>
  </select>
</template>