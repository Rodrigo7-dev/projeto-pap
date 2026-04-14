<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <img src="../assets/logo_camera.jpg" alt="Logo" class="h-8 w-auto mr-3">
          <span class="font-semibold text-gray-900 text-lg">Sistema de Publicidade</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <template v-if="auth.isAuthenticated">
            <router-link 
              to="/dashboard" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              active-class="text-gray-900 bg-gray-100"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/processos" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              active-class="text-gray-900 bg-gray-100"
            >
              Processos
            </router-link>
            <router-link 
              to="/ruas" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              active-class="text-gray-900 bg-gray-100"
            >
              Ruas
            </router-link>
            <router-link 
              to="/freguesias" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              active-class="text-gray-900 bg-gray-100"
            >
              Freguesias
            </router-link>
            <router-link 
              to="/tipopublicidade" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              active-class="text-gray-900 bg-gray-100"
            >
              Tipos
            </router-link>
            <button 
              @click="handleLogout" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Sair
            </button>
          </template>
          
          <template v-else>
            <router-link 
              to="/registar" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Registar
            </router-link>
          </template>
        </div>
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
