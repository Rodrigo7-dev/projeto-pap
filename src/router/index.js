import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Registar from '../views/Registar.vue'
import Dashboard from '../views/Dashboard.vue'
import Processos from '../views/Processos.vue'
import Ruas from '../views/Ruas.vue'
import Freguesias from '../views/Freguesias.vue'
import TipoPublicidade from '../views/TipoPublicidade.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { hideNavbar: true }
    },
    {
      path: '/registar',
      name: 'registar',
      component: Registar,
      meta: { hideNavbar: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/processos',
      name: 'processos',
      component: Processos,
      meta: { requiresAuth: true }
    },
    {
      path: '/ruas',
      name: 'ruas',
      component: Ruas,
      meta: { requiresAuth: true }
    },
    {
      path: '/freguesias',
      name: 'freguesias',
      component: Freguesias,
      meta: { requiresAuth: true }
    },
    {
      path: '/tipopublicidade',
      name: 'tipopublicidade',
      component: TipoPublicidade,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
    return
  }
  
  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (auth.isAuthenticated && (to.name === 'login' || to.name === 'registar')) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
