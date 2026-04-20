<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('maria@exemplo.com')
const password = ref('123456')
const error = ref(null)
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

// 🔒 Se já estiver logado, não deixa entrar no login
onMounted(() => {
  if (auth.token) {
    router.push('/dashboard')
  }
})

const handleLogin = async () => {
  error.value = null
  loading.value = true
  
  try {
    await auth.login(email.value, password.value)

    // ✅ login sucesso → vai para dashboard
    router.push('/dashboard')

  } catch (err) {
    console.error('Erro login:', err)

    // 🔥 erro real vindo da API
    error.value = err.response?.data?.error || 'Email ou palavra-passe incorretos'
  } finally {
    loading.value = false
  }
}
</script>