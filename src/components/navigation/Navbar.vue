<template>
  <nav class="sticky top-0 z-50 border-b border-slate-200 bg-white">
    <div class="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
      <div class="flex min-w-0 items-center gap-4 lg:gap-10">
        <div class="flex min-w-0 items-center gap-3">
          <img
            :src="logo"
            alt="Logo"
            class="h-9 w-9 rounded-lg object-cover"
          />

          <div class="min-w-0">
            <p class="truncate font-semibold text-slate-900">
              Sistema
            </p>
            <p class="text-xs text-slate-500">
              Gestão
            </p>
          </div>
        </div>

        <div class="hidden items-center gap-1 lg:flex">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <div class="hidden text-right lg:block">
          <p class="text-sm font-medium text-slate-900">
            {{ auth.user?.name }}
          </p>
          <p class="text-xs text-slate-500">
            {{ auth.isAdmin ? 'Administrador' : 'Utilizador' }}
          </p>
        </div>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menu"
          @click="isOpen = !isOpen"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <BaseButton
          variant="secondary"
          @click="logout"
        >
          Sair
        </BaseButton>
      </div>
    </div>

    <div
      v-if="isOpen"
      class="border-t border-slate-200 px-4 py-3 lg:hidden"
    >
      <div class="flex flex-col gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          @click="isOpen = false"
        >
          {{ item.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import BaseButton from '@/components/ui/BaseButton.vue'
import logo from '@/assets/logo_camera.jpg'

const router = useRouter()
const auth = useAuthStore()
const isOpen = ref(false)

const navItems = computed(() => {
  const items = [
    { to: '/dashboard', label: 'Painel' },
    { to: '/processos', label: 'Processos' }
  ]

  if (auth.isAdmin) {
    items.push(
      { to: '/ruas', label: 'Ruas' },
      { to: '/freguesias', label: 'Freguesias' },
      { to: '/tipos', label: 'Publicidade' }
    )
  }

  return items
})

const logout = async () => {
  try {
    await auth.logout()
  } finally {
    router.replace('/login')
  }
}
</script>

<style scoped>
.nav-link{
  @apply rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition;
}

.nav-link:hover{
  @apply bg-slate-100 text-slate-900;
}

.router-link-active{
  @apply bg-slate-900 text-white;
}
</style>
