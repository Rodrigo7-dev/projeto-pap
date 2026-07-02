<template>
  <BaseLayout narrow>
    <div class="mb-6 sm:mb-8">
      <router-link
        :to="backTo"
        class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </router-link>

      <h1 class="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
        {{ title }}
      </h1>

      <p
        v-if="subtitle"
        class="mt-1 text-sm text-slate-500"
      >
        {{ subtitle }}
      </p>
    </div>

    <div class="form-card">
      <slot />
    </div>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/layout/BaseLayout.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  backTo: {
    type: String,
    required: true
  }
})
</script>
