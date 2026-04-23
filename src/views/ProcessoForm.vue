<template>
  <div class="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">
      {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
    </h1>

    <form @submit.prevent="saveProcesso" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Utilizador (Requerente)</label>
        <select v-model="form.user_id" required class="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="" disabled>Selecione um utilizador</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }} (NIF: {{ user.NIF }})
          </option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Localização (Rua)</label>
        <select v-model="form.rua_id" required class="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="" disabled>Selecione a rua</option>
          <option v-for="rua in ruas" :key="rua.id" :value="rua.id">
            {{ rua.rua }}
          </option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Tipo de Publicidade</label>
        <select v-model="form.tipo_publicidade_id" required class="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="" disabled>Selecione o tipo</option>
          <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">
            {{ tipo.publicidade }}
          </option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Número do Processo</label>
        <input v-model="form.processo" type="text" required class="mt-1 p-2 border rounded-md" placeholder="Ex: 2024/001">
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Alvará</label>
        <input v-model="form.alvara" type="text" class="mt-1 p-2 border rounded-md">
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Alojamento Local</label>
        <input v-model="form.alojamento_local" type="text" class="mt-1 p-2 border rounded-md">
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Data de Validade</label>
        <input v-model="form.validade" type="date" required class="mt-1 p-2 border rounded-md">
      </div>

      <div class="md:col-span-2 flex justify-end gap-4 mt-4">
        <button type="button" @click="$router.push('/processos')" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
          Cancelar
        </button>
        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-bold">
          {{ isEditing ? 'Atualizar Dados' : 'Criar Processo' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const isEditing = ref(false)

const users = ref([])
const ruas = ref([])
const tipos = ref([])

const form = ref({
  user_id: '',
  rua_id: '',
  tipo_publicidade_id: '',
  processo: '',
  alvara: '',
  alojamento_local: '',
  validade: ''
})

onMounted(async () => {
  try {
    // 1. Carregar todas as dependências primeiro
    // Nota: Verifique se o endpoint /users existe na sua API
    const [resUsers, resRuas, resTipos] = await Promise.all([
      api.get('/users'), 
      api.getRuas(),
      api.getTipos()
    ])
    
    // O interceptor do api.js já retorna .data, mas fazemos um fallback
    users.value = resUsers.data || resUsers || []
    ruas.value = resRuas.data || resRuas || []
    tipos.value = resTipos.data || resTipos || []

    // 2. Se for edição, carregar os dados do processo
    if (route.params.id) {
      isEditing.value = true
      const resProcesso = await api.getProcesso(route.params.id)
      const data = resProcesso.data || resProcesso

      // Mapeamento manual para garantir que os IDs liguem aos selects
      form.value = {
        user_id: data.user_id,
        rua_id: data.rua_id,
        tipo_publicidade_id: data.tipo_publicidade_id,
        processo: data.processo,
        alvara: data.alvara,
        alojamento_local: data.alojamento_local,
        // Formatar data para o input tipo date (YYYY-MM-DD)
        validade: data.validade ? data.validade.split('T')[0] : ''
      }
    }
  } catch (error) {
    console.error("Erro ao carregar dados do formulário:", error)
  }
})

const saveProcesso = async () => {
  try {
    if (isEditing.value) {
      await api.updateProcesso(route.params.id, form.value)
    } else {
      await api.createProcesso(form.value)
    }
    router.push('/processos')
  } catch (error) {
    console.error(error)
    alert("Erro ao guardar o processo. Verifique se todos os campos obrigatórios estão preenchidos.")
  }
}
</script>