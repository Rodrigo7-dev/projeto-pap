import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// tuas rotas aqui
const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/registar', component: () => import('../views/Register.vue') },
  { path: '/ruas', component: () => import('../views/Ruas.vue') },
  { path: '/dashboard', component: () => import('../views/Dashboard.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  const publicPages = ['/login', '/registar']
  const isPublic = publicPages.includes(to.path)

  if (!isPublic && !auth.token) {
    return next('/login')
  }

  next()
})

export default router