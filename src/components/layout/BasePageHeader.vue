<template>
  <div class="flex items-center justify-between mb-8">

    <div>
      <h1 class="text-3xl font-semibold text-gray-900">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="text-sm text-gray-500 mt-1">
        {{ subtitle }}
      </p>
    </div>

    <div v-if="$slots.default">
      <slot />
    </div>

  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>