<template>
  <nav class="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <img src="../assets/logo_camera.jpg" alt="Logo" class="h-10 w-auto mr-3 rounded-lg shadow-sm">
          <span class="font-bold text-white text-lg">Sistema de Publicidade</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <template v-if="auth.isAuthenticated">
            <router-link 
              to="/dashboard" 
              class="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105"
              active-class="bg-blue-800"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/processos" 
              class="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105"
              active-class="bg-blue-800"
            >
              Processos
            </router-link>
            <router-link 
              to="/ruas" 
              class="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105"
              active-class="bg-blue-800"
            >
              Ruas
            </router-link>
            <router-link 
              to="/freguesias" 
              class="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105"
              active-class="bg-blue-800"
            >
              Freguesias
            </router-link>
            <router-link 
              to="/tipopublicidade" 
              class="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105"
              active-class="bg-blue-800"
            >
              Tipos
            </router-link>
            <button 
              @click="handleLogout" 
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
            >
              Sair
            </button>
          </template>
          
          <template v-else>
            <router-link 
              to="/registar" 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
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
