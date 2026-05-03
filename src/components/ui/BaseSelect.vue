<template>
  <select
    :value="modelValue"
    @change="onChange"
    v-bind="$attrs"
    class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10"
  >
    <option value="" disabled>
      {{ placeholder }}
    </option>

    <option
      v-for="option in safeOptions"
      :key="option[valueKey]"
      :value="option[valueKey]"
    >
      {{ option[labelKey] }}
    </option>
  </select>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  placeholder: {
    type: String,
    default: 'Selecionar'
  }
})

const emit = defineEmits(['update:modelValue'])

const safeOptions = computed(() => props.options ?? [])

const onChange = (event) => {
  const value = event.target.value

  // tenta preservar número se for número
  emit(
    'update:modelValue',
    isNaN(value) ? value : Number(value)
  )
}
</script>