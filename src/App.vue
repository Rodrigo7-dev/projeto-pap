<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Navbar só aparece quando deve -->
    <Navbar v-if="shouldShowNavbar" />

    <!-- Router View com transição -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'

import Navbar from '@/components/navigation/Navbar.vue'

const route = useRoute()
const auth = useAuthStore()

const shouldShowNavbar = computed(() => {
  return auth.isAuthenticated && route.meta.hideNavbar !== true
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>