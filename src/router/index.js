import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lazy loading de componentes
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Processos = () => import('../views/Processos.vue')
const ProcessoForm = () => import('../views/ProcessoForm.vue')
const Ruas = () => import('../views/Ruas.vue')
const RuaForm = () => import('../views/RuaForm.vue')
const Freguesias = () => import('../views/Freguesias.vue')
const FreguesiaForm = () => import('../views/FreguesiaForm.vue')
const Tipos = () => import('../views/Tipos.vue')
const TipoForm = () => import('../views/TipoForm.vue')
const Profile = () => import('../views/Profile.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideNavbar: true, guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { hideNavbar: true, guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/processos',
    name: 'Processos',
    component: Processos,
    meta: { requiresAuth: true }
  },
  {
    path: '/processos/novo',
    name: 'NovoProcesso',
    component: ProcessoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/processos/:id/editar',
    name: 'EditarProcesso',
    component: ProcessoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/ruas',
    name: 'Ruas',
    component: Ruas,
    meta: { requiresAuth: true }
  },
  {
    path: '/ruas/nova',
    name: 'NovaRua',
    component: RuaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/ruas/:id/editar',
    name: 'EditarRua',
    component: RuaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/freguesias',
    name: 'Freguesias',
    component: Freguesias,
    meta: { requiresAuth: true }
  },
  {
    path: '/freguesias/nova',
    name: 'NovaFreguesia',
    component: FreguesiaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/freguesias/:id/editar',
    name: 'EditarFreguesia',
    component: FreguesiaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/tipos',
    name: 'Tipos',
    component: Tipos,
    meta: { requiresAuth: true }
  },
  {
    path: '/tipos/novo',
    name: 'NovoTipo',
    component: TipoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/tipos/:id/editar',
    name: 'EditarTipo',
    component: TipoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { hideNavbar: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  // Verifica se a rota requer autenticação
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
    return
  }
  
  // Verifica se o usuário já está autenticado e tenta acessar página de guest
  if (to.meta.guest && auth.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router