<template>
  <nav class="bg-white border-b border-slate-200 shadow-sm">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">

        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span class="text-lg font-bold text-slate-800">Sistema de Gestão</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-6">
          <router-link 
            to="/dashboard" 
            class="text-slate-600 hover:text-blue-600 font-medium"
          >
            Painel
          </router-link>

          <router-link 
            to="/ruas" 
            class="text-slate-600 hover:text-blue-600 font-medium"
          >
            Ruas
          </router-link>

          <router-link 
            to="/freguesias" 
            class="text-slate-600 hover:text-blue-600 font-medium"
          >
            Freguesias
          </router-link>

          <router-link 
            to="/tipopublicidade" 
            class="text-slate-600 hover:text-blue-600 font-medium"
          >
            Tipos
          </router-link>

          <router-link 
            to="/perfil" 
            class="text-slate-600 hover:text-blue-600 font-medium"
          >
            Perfil
          </router-link>

          <!-- Logout -->
          <button 
            @click="handleLogout"
            class="text-red-600 hover:text-red-700 font-medium"
          >
            Sair
          </button>
        </div>

      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const auth = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
      await auth.logout()
      router.push('/login')
    }

    return { auth, handleLogout }
  }
}
</script>
