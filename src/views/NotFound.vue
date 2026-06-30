<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

import BaseLayout from '@/components/layout/BaseLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const auth = useAuthStore()

const destination = computed(() => {
  return auth.isAuthenticated ? '/dashboard' : '/login'
})

const buttonText = computed(() => {
  return auth.isAuthenticated ? 'Voltar ao Painel' : 'Ir para Login'
})
</script>

<template>
  <BaseLayout>
    <div class="flex min-h-[70vh] items-center justify-center">
      <div class="max-w-lg text-center">
        <div class="text-7xl font-semibold text-slate-900 sm:text-8xl">
          404
        </div>

        <h1 class="mt-6 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Página não encontrada
        </h1>

        <p class="mt-3 text-slate-500">
          A página que tentou aceder não existe ou foi removida.
        </p>

        <div class="mt-8">
          <router-link :to="destination">
            <BaseButton>
              {{ buttonText }}
            </BaseButton>
          </router-link>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>
