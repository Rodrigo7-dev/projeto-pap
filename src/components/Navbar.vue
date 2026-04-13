<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center">
        <img src="../assets/logo_camera.jpg" alt="Logo" class="h-8 w-auto mr-3">
        <span class="font-bold text-gray-900">Sistema de Publicidade</span>
      </div>
      
      <div class="flex items-center gap-3">
        <template v-if="auth.isAuthenticated">
          <router-link to="/dashboard" class="text-gray-700 hover:text-gray-900 text-sm">Dashboard</router-link>
          <router-link to="/processos" class="text-gray-700 hover:text-gray-900 text-sm">Processos</router-link>
          <router-link to="/ruas" class="text-gray-700 hover:text-gray-900 text-sm">Ruas</router-link>
          <router-link to="/freguesias" class="text-gray-700 hover:text-gray-900 text-sm">Freguesias</router-link>
          <router-link to="/tipopublicidade" class="text-gray-700 hover:text-gray-900 text-sm">Tipos</router-link>
          <button @click="handleLogout" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
            Sair
          </button>
        </template>
        
        <template v-else>
          <router-link to="/registar" class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
            Registar
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
