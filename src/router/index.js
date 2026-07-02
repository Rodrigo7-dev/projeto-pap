import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { getEntityId } from '@/utils/helpers'

const Login = () => import('@/views/Login.vue')
const Registar = () => import('@/views/Registar.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Processos = () => import('@/views/Processos.vue')
const ProcessoForm = () => import('@/views/ProcessoForm.vue')
const Ruas = () => import('@/views/Ruas.vue')
const RuaForm = () => import('@/views/RuaForm.vue')
const Freguesias = () => import('@/views/Freguesias.vue')
const FreguesiaForm = () => import('@/views/FreguesiaForm.vue')
const Tipos = () => import('@/views/Tipos.vue')
const TipoForm = () => import('@/views/TipoForm.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login, meta: { guest: true, hideNavbar: true } },
  { path: '/registar', component: Registar, meta: { guest: true, hideNavbar: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/processos', component: Processos, meta: { requiresAuth: true } },
  { path: '/processos/novo', component: ProcessoForm, meta: { requiresAuth: true } },
  { path: '/processos/:id/editar', component: ProcessoForm, meta: { requiresAuth: true, ownerOnly: true } },
  { path: '/ruas', component: Ruas, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/ruas/nova', component: RuaForm, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/ruas/:id/editar', component: RuaForm, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/freguesias', component: Freguesias, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/freguesias/nova', component: FreguesiaForm, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/freguesias/:id/editar', component: FreguesiaForm, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/tipos', component: Tipos, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/tipos/novo', component: TipoForm, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/tipos/:id/editar', component: TipoForm, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return next('/dashboard')
  }

  if (to.meta.adminOnly && !auth.isAdmin) {
    return next('/dashboard')
  }

  if (to.meta.ownerOnly && !auth.isAdmin) {
    try {
      const data = await api.getProcesso(to.params.id)
      const processo = data?.data ?? data?.processo ?? data

      const ownerId = getEntityId(
        processo?.user ?? processo?.utilizador ?? processo?.userId ?? processo?.user_id
      )
      const currentUser = getEntityId(auth.user)

      if (!ownerId || !currentUser || ownerId !== currentUser) {
        return next('/processos')
      }
    } catch (e) {
      console.error(e)
      return next('/processos')
    }
  }

  next()
})

export default router
