<template>
  <div class="min-h-screen bg-gray-50">

    <Navbar
      v-if="showNavbar"
    />

    <router-view v-slot="{ Component }">
      <transition
        name="fade"
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Navbar from '@/components/navigation/Navbar.vue'

const route = useRoute()
const auth = useAuthStore()

const showNavbar = computed(() => {
  return auth.isAuthenticated && !route.meta.hideNavbar
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active{
transition:.25s ease;
}

.fade-enter-from{
opacity:0;
transform:translateY(6px);
}

.fade-leave-to{
opacity:0;
transform:translateY(-6px);
}
</style>