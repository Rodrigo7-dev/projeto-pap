<template>
  <nav class="bg-blue-600 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-xl font-bold">
        <router-link to="/" class="hover:text-blue-200">
          Sistema de Gestão
        </router-link>
      </div>
      
      <div class="flex space-x-4 items-center">
        <router-link to="/dashboard" class="hover:text-blue-200">
          Dashboard
        </router-link>
        <router-link to="/processos" class="hover:text-blue-200">
          Processos
        </router-link>
        
        <div class="relative">
          <button 
            @click="toggleDropdown" 
            class="flex items-center space-x-2 hover:text-blue-200"
          >
            <span>{{ user?.name || 'Usuário' }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
            <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-100">
              Perfil
            </router-link>
            <button 
              @click="logout" 
              class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const dropdownOpen = ref(false)

const user = computed(() => auth.user)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const logout = async () => {
  await auth.logout()
  router.push('/login')
  dropdownOpen.value = false
}

// Fechar dropdown quando clicar fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    dropdownOpen.value = false
  }
})
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.right-0 {
  right: 0;
}

.mt-2 {
  margin-top: 0.5rem;
}

.w-48 {
  width: 12rem;
}

.bg-white {
  background-color: white;
}

.text-gray-800 {
  color: #1f2937;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.z-50 {
  z-index: 50;
}

.block {
  display: block;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.text-red-600 {
  color: #dc2626;
}

.w-full {
  width: 100%;
}

.text-left {
  text-align: left;
}
</style>