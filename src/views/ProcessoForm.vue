<template>
  <div class="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">
      {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
    </h1>

    <form @submit.prevent="saveProcesso" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Utilizador (Requerente)</label>
        <select v-model="form.user_id" required class="mt-1 p-2 border rounded-md">
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }} ({{ user.NIF }})
          </option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Localização (Rua)</label>
        <select v-model="form.rua_id" required class="mt-1 p-2 border rounded-md">
          <option v-for="rua in ruas" :key="rua.id" :value="rua.id">
            {{ rua.rua }} - {{ rua.freguesia }}
          </option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Tipo de Publicidade</label>
        <select v-model="form.tipo_publicidade_id" required class="mt-1 p-2 border rounded-md">
          <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">
            {{ tipo.publicidade }}
          </option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold text-gray-700">Número do Processo</label>
        <input v-model="form.processo" type="text" required class="mt-1 p-2 border rounded-md" placeholder="Ex: 2024/PROC/01">
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
        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          {{ isEditing ? 'Atualizar' : 'Guardar Processo' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api' // Importa a tua instância configurada

const route = useRoute()
const router = useRouter()
const isEditing = ref(false)

// Estado das Listas (para os selects)
const users = ref([])
const ruas = ref([])
const tipos = ref([])

// Estado do Formulário
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
  // Carregar dados necessários para os Dropdowns
  try {
    // Nota: Se não tiveres endpoint getTodosUsers, ajusta aqui
    const [resRuas, resTipos] = await Promise.all([
      api.getRuas(),
      api.getTipos()
    ])
    
    ruas.value = resRuas
    tipos.value = resTipos

    // Se houver ID na rota, estamos em modo edição
    if (route.params.id) {
      isEditing.value = true
      const data = await api.getProcesso(route.params.id)
      form.value = { ...data }
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
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
    alert("Erro ao guardar o processo. Verifica os campos.")
  }
}
</script>