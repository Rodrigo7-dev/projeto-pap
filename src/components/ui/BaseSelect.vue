<template>
  <div class="space-y-2">
    <label
      v-if="label"
      class="block text-sm font-medium text-slate-700"
    >
      {{ label }}
    </label>

    <select
      :value="modelValue"
      v-bind="$attrs"
      class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/10"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">
        {{ placeholder }}
      </option>

      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ option[labelKey] }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: '_id'
  },
  placeholder: {
    type: String,
    default: 'Selecionar'
  }
})

defineEmits(['update:modelValue'])

const getOptionValue = (option) =>
  option._id ?? option.id ?? option[props.valueKey] ?? ''
</script>
