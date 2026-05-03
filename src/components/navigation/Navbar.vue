<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">

    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

      <!-- BRAND -->
      <div class="flex items-center gap-3">
        <img src="@/assets/logo_camera.jpg" class="h-8 w-8 object-contain" />

        <span class="font-semibold text-gray-900">
          Sistema
        </span>
      </div>

      <!-- MENU -->
      <div class="hidden md:flex gap-8">

        <router-link
          to="/dashboard"
          class="nav"
          active-class="nav-active"
        >
          Painel
        </router-link>

        <router-link
          to="/processos"
          class="nav"
          active-class="nav-active"
        >
          Processos
        </router-link>

        <router-link
          to="/ruas"
          class="nav"
          active-class="nav-active"
        >
          Ruas
        </router-link>

        <router-link
          to="/freguesias"
          class="nav"
          active-class="nav-active"
        >
          Freguesias
        </router-link>

        <router-link
          to="/tipos"
          class="nav"
          active-class="nav-active"
        >
          Publicidade
        </router-link>

      </div>

      <!-- LOGOUT -->
      <button
        @click="logout"
        class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
      >
        Sair
      </button>

    </div>

  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const logout = async () => {
  await auth.logout()
  router.push('/login')
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
</style>