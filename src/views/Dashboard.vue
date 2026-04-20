<script>
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

export default {
  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  data() {
    return {
      stats: {
        totalProcessos: 0,
        processosValidos: 0,
        processosInvalidos: 0,
        totalRuas: 0
      },
      ultimosProcessos: []
    }
  },

  async mounted() {
    try {
      // Buscar processos reais
      const { data } = await api.get('/processos')

      // Totais
      this.stats.totalProcessos = data.length
      this.stats.processosValidos = data.filter(p => p.validade === 'valido').length
      this.stats.processosInvalidos = data.filter(p => p.validade === 'invalido').length

      // Últimos 5 processos
      this.ultimosProcessos = data.slice(0, 5)

      // Se quiseres contar ruas reais no futuro:
      // const ruas = await api.get('/ruas')
      // this.stats.totalRuas = ruas.data.length

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    }
  }
}
</script>
