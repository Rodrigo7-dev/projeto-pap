<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <img src="../assets/logo_camera.jpg" alt="Logo" class="logo">
        <span>Sistema de Gestão</span>
      </div>
      
      <div class="navbar-menu">
        <router-link to="/dashboard" class="nav-link">Painel</router-link>
        <router-link to="/processos" class="nav-link">Processos</router-link>
        <router-link to="/ruas" class="nav-link">Ruas</router-link>
        <router-link to="/freguesias" class="nav-link">Freguesias</router-link>
      </div>
      
      <div class="navbar-user">
        <div class="user-info">
          <span>{{ user?.name || 'Utilizador' }}</span>
          <button @click="toggleUserMenu" class="user-menu-button">
            <div class="user-avatar">
              {{ getUserInitials() }}
            </div>
          </button>
        </div>
        
        <div v-if="showUserMenu" class="user-dropdown">
          <router-link to="/profile" class="dropdown-item">Perfil</router-link>
          <button @click="logout" class="dropdown-item">Sair</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const showUserMenu = ref(false)

const user = computed(() => auth.user)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const getUserInitials = () => {
  const name = user.value?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const logout = async () => {
  showUserMenu.value = false
  await auth.logout()
  router.push('/login')
}

const closeUserMenu = (event) => {
  if (!event.target.closest('.navbar-user')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 32px;
}

.navbar-brand span {
  font-size: 16px;
  font-weight: normal;
  color: #333;
}

.navbar-menu {
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #333;
  border-bottom-color: #333;
}

.navbar-user {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info span {
  font-size: 14px;
  color: #666;
}

.user-menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #333;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: normal;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 8px;
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item:first-child {
  border-radius: 4px 4px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 4px 4px;
}
</style>