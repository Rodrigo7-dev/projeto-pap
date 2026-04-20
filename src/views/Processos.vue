<template>
  <div class="processos-container">
    <header class="page-header">
      <h1>Gestão de Processos</h1>
      <router-link to="/processos/novo" class="btn-primary">Novo Processo</router-link>
    </header>
    
    <div v-if="loading" class="loading">Carregando...</div>
    
    <div v-else class="content">
      <div class="search-section">
        <input 
          v-model="search" 
          type="text" 
          placeholder="Pesquisar processos..." 
          class="search-input"
        />
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Número do Processo</th>
              <th>Tipo</th>
              <th>Rua</th>
              <th>Validade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="processo in filteredProcessos" :key="processo.id">
              <td>{{ processo.numero_processo || `#${processo.id}` }}</td>
              <td>{{ processo.tipo_publicidade?.nome || '-' }}</td>
              <td>{{ processo.rua?.nome || processo.rua?.rua || '-' }}</td>
              <td>
                <span :class="getStatusClass(processo.validade)">
                  {{ getValidadeText(processo.validade) }}
                </span>
              </td>
              <td>
                <router-link :to="`/processos/${processo.id}/editar`" class="action-link">Editar</router-link>
                <button @click="deleteProcesso(processo)" class="action-delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredProcessos.length === 0" class="empty-state">
          <p>{{ search ? 'Nenhum processo encontrado para esta pesquisa.' : 'Nenhum processo cadastrado.' }}</p>
          <router-link v-if="!search" to="/processos/novo" class="btn-primary">Adicionar Primeiro Processo</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const loading = ref(false)
const processos = ref([])
const search = ref('')

const filteredProcessos = computed(() => {
  if (!search.value) return processos.value
  
  const searchTerm = search.value.toLowerCase()
  return processos.value.filter(processo => 
    (processo.numero_processo || '').toLowerCase().includes(searchTerm) ||
    (processo.tipo_publicidade?.nome || '').toLowerCase().includes(searchTerm) ||
    (processo.rua?.nome || processo.rua?.rua || '').toLowerCase().includes(searchTerm)
  )
})

const loadProcessos = async () => {
  loading.value = true
  try {
    const data = await api.getProcessos()
    processos.value = data.data || data || []
  } catch (error) {
    console.error('Erro ao carregar processos:', error)
  } finally {
    loading.value = false
  }
}

const deleteProcesso = async (processo) => {
  const processoName = processo.numero_processo || `#${processo.id}`
  if (!confirm(`Tem certeza que deseja excluir o processo "${processoName}"?`)) {
    return
  }

  try {
    await api.deleteProcesso(processo.id)
    await loadProcessos()
  } catch (error) {
    console.error('Erro ao excluir processo:', error)
    alert('Erro ao excluir processo. Tente novamente.')
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

onMounted(() => {
  loadProcessos()
})
</script>

<style scoped>
.processos-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: normal;
}

.btn-primary {
  background: #333;
  color: #fff;
  text-decoration: none;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: inline-block;
}

.btn-primary:hover {
  background: #555;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.content {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-section {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #999;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background: #f5f5f5;
  font-weight: normal;
  font-size: 14px;
}

.data-table td {
  font-size: 14px;
}

.action-link {
  color: #666;
  text-decoration: none;
  margin-right: 15px;
  font-size: 14px;
}

.action-link:hover {
  color: #333;
}

.action-delete {
  background: none;
  border: none;
  color: #a52a2a;
  cursor: pointer;
  font-size: 14px;
}

.action-delete:hover {
  color: #d32f2f;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state p {
  margin: 0 0 20px 0;
  font-size: 14px;
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
