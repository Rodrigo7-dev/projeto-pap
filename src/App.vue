<template>
  <div>
    <Navbar v-if="shouldShowNavbar" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()

const shouldShowNavbar = computed(() => {
  return !route.meta?.hideNavbar
})
</script>

<style>
/* Estilos básicos */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* Animação de loading */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
