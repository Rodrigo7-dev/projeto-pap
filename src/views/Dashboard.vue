<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Painel de Controlo</h1>
      <p>Sistema de Gestão de Publicidade</p>
    </header>

    <section class="stats-section">
      <div class="stat-card">
        <div class="stat-number">{{ stats.total_processos || 0 }}</div>
        <div class="stat-label">Processos</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.processos_validos || 0 }}</div>
        <div class="stat-label">Válidos</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.processos_invalidos || 0 }}</div>
        <div class="stat-label">Inválidos</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.total_ruas || 0 }}</div>
        <div class="stat-label">Ruas</div>
      </div>
    </section>
    
    <nav class="dashboard-nav">
      <router-link to="/processos" class="nav-link">Processos</router-link>
      <router-link to="/ruas" class="nav-link">Ruas</router-link>
      <router-link to="/freguesias" class="nav-link">Freguesias</router-link>
    </nav>
    
    <section class="recent-processes">
      <h2>Processos Recentes</h2>
      <div v-if="loading" class="loading">Carregando...</div>
      <table v-else class="processes-table">
        <thead>
          <tr>
            <th>Número do Processo</th>
            <th>Alvará</th>
            <th>Validade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="processo in processos" :key="processo.id">
            <td>{{ processo.numero_processo || `#${processo.id}` }}</td>
            <td>{{ processo.alvara || '-' }}</td>
            <td>
              <span :class="getStatusClass(processo.validade)">
                {{ getValidadeText(processo.validade) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const stats = ref({})
const processos = ref([])
const loading = ref(false)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    const [statsData, processosData] = await Promise.all([
      api.getStats(),
      api.getProcessos({ limit: 10 })
    ])
    stats.value = statsData
    processos.value = processosData.data || processosData || []
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (validade) => {
  if (validade === 'valido') {
    return 'status-valid'
  } else if (validade === 'invalido') {
    return 'status-invalid'
  }
  return 'status-pending'
}

const getValidadeText = (validade) => {
  if (validade === 'valido') return 'Válido'
  if (validade === 'invalido') return 'Inválido'
  return 'Pendente'
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.dashboard-header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: normal;
}

.dashboard-header p {
  margin: 0 0 30px 0;
  color: #666;
  font-size: 14px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.dashboard-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.nav-link {
  display: block;
  background: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  color: #333;
}

.nav-link:hover {
  background: #f5f5f5;
}

.recent-processes h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: normal;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.processes-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #ddd;
}

.processes-table th,
.processes-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.processes-table th {
  background: #f5f5f5;
  font-weight: normal;
}

.status-valid {
  background: #e8f5e8;
  color: #2d5a2d;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.status-invalid {
  background: #ffe8e8;
  color: #a52a2a;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.status-pending {
  background: #fff8e8;
  color: #8b6914;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
}
</style>
