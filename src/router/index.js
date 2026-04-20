import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Registar from '../views/Registar.vue'
import Dashboard from '../views/Dashboard.vue'
import Perfil from '../views/Perfil.vue'
import Ruas from '../views/Ruas.vue'
import Freguesias from '../views/Freguesias.vue'
import TipoPublicidade from '../views/TipoPublicidade.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/registar',
    name: 'registar',
    component: Registar,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: Perfil,
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/registar') && auth.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router