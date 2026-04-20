<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <img src="../assets/logo_camera.jpg" alt="Logo" class="logo">
        <span>Sistema v2.0</span>
      </div>
      
      <div class="navbar-menu">
        <router-link to="/dashboard" class="nav-link">Painel</router-link>
        <router-link to="/processos" class="nav-link">Processos</router-link>
        <router-link to="/ruas" class="nav-link">Ruas</router-link>
        <router-link to="/freguesias" class="nav-link">Freguesias</router-link>
        <router-link to="/tipos" class="nav-link">Tipo de Publicidade</router-link>
      </div>
      
      <button @click="logout" class="logout-btn">Sair</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const logout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-container {
  max-width: 7xl;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  height: 2rem;
}

.navbar-brand span {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #111827;
  border-bottom-color: #111827;
}

.logout-btn {
  background: #111827;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #374151;
}
</style>