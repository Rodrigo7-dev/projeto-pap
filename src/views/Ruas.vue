<template>
  <div class="ruas-container">
    <header class="page-header">
      <h1>Gestão de Ruas</h1>
      <router-link to="/ruas/nova" class="btn-primary">Nova Rua</router-link>
    </header>
    
    <div v-if="loading" class="loading">Carregando...</div>
    
    <div v-else class="content">
      <div class="search-section">
        <input 
          v-model="search" 
          type="text" 
          placeholder="Pesquisar ruas..." 
          class="search-input"
        />
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nome da Rua</th>
              <th>Freguesia</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rua in filteredRuas" :key="rua.id">
              <td>{{ rua.nome || rua.rua || '-' }}</td>
              <td>{{ rua.freguesia?.nome || rua.freguesia || '-' }}</td>
              <td>
                <router-link :to="`/ruas/${rua.id}/editar`" class="action-link">Editar</router-link>
                <button @click="deleteRua(rua)" class="action-delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredRuas.length === 0" class="empty-state">
          <p>{{ search ? 'Nenhuma rua encontrada para esta pesquisa.' : 'Nenhuma rua cadastrada.' }}</p>
          <router-link v-if="!search" to="/ruas/nova" class="btn-primary">Adicionar Primeira Rua</router-link>
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
const ruas = ref([])
const search = ref('')

const filteredRuas = computed(() => {
  if (!search.value) return ruas.value
  
  const searchTerm = search.value.toLowerCase()
  return ruas.value.filter(rua => 
    (rua.nome || rua.rua || '').toLowerCase().includes(searchTerm) ||
    (rua.freguesia?.nome || rua.freguesia || '').toLowerCase().includes(searchTerm)
  )
})

const loadRuas = async () => {
  loading.value = true
  try {
    const data = await api.getRuas()
    ruas.value = data.data || data || []
  } catch (error) {
    console.error('Erro ao carregar ruas:', error)
  } finally {
    loading.value = false
  }
}

const deleteRua = async (rua) => {
  const ruaName = rua.nome || rua.rua || `#${rua.id}`
  if (!confirm(`Tem certeza que deseja excluir a rua "${ruaName}"?`)) {
    return
  }

  try {
    await api.deleteRua(rua.id)
    await loadRuas()
  } catch (error) {
    console.error('Erro ao excluir rua:', error)
    alert('Erro ao excluir rua. Tente novamente.')
  }
}

onMounted(() => {
  loadRuas()
})
</script>

<style scoped>
.ruas-container {
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
</style>
