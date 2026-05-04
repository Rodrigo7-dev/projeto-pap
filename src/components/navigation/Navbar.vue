<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">

    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

      <!-- BRAND -->
      <div class="flex items-center gap-3">

        <img
          :src="logo"
          class="h-8 w-8 object-contain"
          alt="logo"
        />

        <span class="font-semibold text-gray-900">
          Sistema
        </span>

      </div>

      <!-- MENU DESKTOP -->
      <div class="hidden md:flex gap-8">

        <router-link to="/dashboard" class="nav" active-class="nav-active">
          Painel
        </router-link>

        <router-link to="/processos" class="nav" active-class="nav-active">
          Processos
        </router-link>

        <router-link to="/ruas" class="nav" active-class="nav-active">
          Ruas
        </router-link>

        <router-link to="/freguesias" class="nav" active-class="nav-active">
          Freguesias
        </router-link>

        <router-link to="/tipos" class="nav" active-class="nav-active">
          Publicidade
        </router-link>

      </div>

      <!-- ACTIONS -->
      <div class="flex items-center gap-3">

        <!-- LOGOUT (desktop) -->
        <button
          @click="logout"
          class="hidden md:block bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
        >
          Sair
        </button>

        <!-- HAMBURGER (mobile) -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>

    </div>

    <!-- MENU MOBILE -->
    <div v-if="mobileOpen" class="md:hidden border-t border-gray-200 bg-white">
      <div class="px-4 py-3 space-y-2">

        <router-link to="/dashboard" class="nav-mobile" active-class="nav-mobile-active" @click="mobileOpen = false">
          Painel
        </router-link>

        <router-link to="/processos" class="nav-mobile" active-class="nav-mobile-active" @click="mobileOpen = false">
          Processos
        </router-link>

        <router-link to="/ruas" class="nav-mobile" active-class="nav-mobile-active" @click="mobileOpen = false">
          Ruas
        </router-link>

        <router-link to="/freguesias" class="nav-mobile" active-class="nav-mobile-active" @click="mobileOpen = false">
          Freguesias
        </router-link>

        <router-link to="/tipos" class="nav-mobile" active-class="nav-mobile-active" @click="mobileOpen = false">
          Publicidade
        </router-link>

        <button
          @click="logout"
          class="w-full mt-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
        >
          Sair
        </button>

      </div>
    </div>

  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logo from '@/assets/logo_camera.jpg'

const router = useRouter()
const auth = useAuthStore()
const mobileOpen = ref(false)

const logout = async () => {
  try {
    await auth.logout()
  } finally {
    mobileOpen.value = false
    router.push('/login')
  }
}
</script>

<style scoped>
.nav {
  @apply text-gray-500 text-sm font-medium transition;
}

.nav:hover {
  @apply text-gray-900;
}

.nav-active {
  @apply text-gray-900 border-b-2 border-gray-900 pb-1;
}

.nav-mobile {
  @apply block px-3 py-2 text-sm text-gray-600 rounded-lg transition;
}

.nav-mobile:hover {
  @apply bg-gray-50 text-gray-900;
}

.nav-mobile-active {
  @apply bg-gray-100 text-gray-900 font-medium;
}
</style>
