import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'

import '@/assets/main.css'

import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)

// inicializar autenticação antes do router
const auth = useAuthStore()

auth.loadUser()

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})