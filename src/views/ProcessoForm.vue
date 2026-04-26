<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">{{ isEditing ? 'Editar' : 'Novo' }} Processo</h1>

      <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold mb-1">Nome do Processo</label>
          <input v-model="form.processo" type="text" required class="w-full border p-2 rounded" />
        </div>

        <div>
          <label class="block text-sm font-bold mb-1">Alvará</label>
          <input v-model="form.alvara" type="text" class="w-full border p-2 rounded" />
        </div>

        <div>
          <label class="block text-sm font-bold mb-1">Alojamento Local</label>
          <input v-model="form.alojamento_local" type="text" class="w-full border p-2 rounded" />
        </div>

        <div class="flex items-center space-x-2 pt-6">
          <input v-model="form.validade" type="checkbox" id="validade" class="w-5 h-5" />
          <label for="validade" class="text-sm font-bold">Está Válido?</label>
        </div>

        <div>
          <label class="block text-sm font-bold mb-1">Utilizador</label>
          <select v-model="form.user_id" required class="w-full border p-2 rounded">
            <option value="" disabled>Selecione...</option>
            <option v-for="u in utilizadores" :key="u.id" :value="u.id">{{ u.nome || u.username }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-bold mb-1">Rua</label>
          <select v-model="form.rua_id" required class="w-full border p-2 rounded">
            <option value="" disabled>Selecione...</option>
            <option v-for="r in ruas" :key="r.id" :value="r.id">{{ r.rua }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-bold mb-1">Tipo de Publicidade</label>
          <select v-model="form.tipo_publicidade_id" required class="w-full border p-2 rounded">
            <option value="" disabled>Selecione...</option>
            <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.publicidade || t.tipo }}</option>
          </select>
        </div>

        <div class="md:col-span-2 mt-4 flex justify-end space-x-2">
          <button type="button" @click="$router.push('/processos')" class="bg-gray-200 px-4 py-2 rounded">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded font-bold">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()
const isEditing = computed(() => !!route.params.id)

const tipos = ref([])
const ruas = ref([])
const utilizadores = ref([]) // Se tiveres endpoint para users

const form = ref({
  processo: '',
  alvara: '',
  alojamento_local: '',
  validade: false, // Começa como false (boolean)
  user_id: '',
  rua_id: '',
  tipo_publicidade_id: ''
})

const fetchData = async () => {
  try {
    const [resT, resR] = await Promise.all([api.getTipos(), api.getRuas()])
    tipos.value = resT.data || resT
    ruas.value = resR.data || resR
    
    // Se o teu backend tiver /users, carrega aqui. 
    // Se não, podemos ter de ajustar o campo user.
    
    if (isEditing.value) {
      const res = await api.getProcesso(route.params.id)
      const d = res.data || res
      form.value = {
        processo: d.processo,
        alvara: d.alvara,
        alojamento_local: d.alojamento_local,
        validade: Boolean(d.validade),
        user_id: d.user?.id || d.user_id,
        rua_id: d.rua?.id || d.rua_id,
        tipo_publicidade_id: d.tipo_publicidade?.id || d.tipo_publicidade_id
      }
    }
  } catch (e) { console.error(e) }
}

const handleSubmit = async () => {
  try {
    // Montar o payload com os nomes que o teu backend espera (vimos nos erros 422)
    const payload = {
      processo: form.value.processo,
      alvara: form.value.alvara,
      alojamento_local: form.value.alojamento_local,
      validade: form.value.validade, // Envia true/false
      user: Number(form.value.user_id),
      rua: Number(form.value.rua_id),
      tipo_publicidade: Number(form.value.tipo_publicidade_id)
    }

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }
    router.push('/processos')
  } catch (error) {
    console.error(error.response?.data)
    alert("Erro ao guardar. Verifica os campos.")
  }
}

onMounted(fetchData)
</script>