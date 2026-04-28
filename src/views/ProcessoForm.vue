<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()
const isEditing = computed(() => !!route.params.id)

const tipos = ref([])
const ruas = ref([])
const utilizadores = ref([])

const form = ref({
  processo: '',
  alvara: '',
  alojamentoLocal: '',
  validade: 'valido', // STRING (backend exige isto)
  user: '',
  rua: '',
  tipoPublicidade: ''
})

// LOAD DATA
const fetchData = async () => {
  try {
    const [t, r] = await Promise.all([
      api.getTipos(),
      api.getRuas()
    ])

    tipos.value = t.data || t
    ruas.value = r.data || r

    if (isEditing.value) {
      const res = await api.getProcesso(route.params.id)
      const d = res.data || res

      form.value = {
        processo: d.processo,
        alvara: d.alvara,
        alojamentoLocal: d.alojamentoLocal,
        validade: d.validade,
        user: d.user?.id || d.user,
        rua: d.rua?.id || d.rua,
        tipoPublicidade: d.tipoPublicidade?.id || d.tipoPublicidade
      }
    }

  } catch (e) {
    console.error(e)
  }
}

// SUBMIT
const handleSubmit = async () => {
  try {
    const payload = {
      processo: form.value.processo,
      alvara: form.value.alvara,
      alojamentoLocal: form.value.alojamentoLocal,
      validade: form.value.validade,

      user: form.value.user,
      rua: form.value.rua,
      tipoPublicidade: form.value.tipoPublicidade
    }

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }

    router.push('/processos')

  } catch (error) {
    console.error(error.response?.data)
    alert('Erro ao guardar processo')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">

    <div class="max-w-4xl mx-auto">

      <h1 class="text-2xl font-bold mb-6">
        {{ isEditing ? 'Editar' : 'Novo' }} Processo
      </h1>

      <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg grid gap-4">

        <input v-model="form.processo" placeholder="Processo" class="border p-2" />
        <input v-model="form.alvara" placeholder="Alvará" class="border p-2" />
        <input v-model="form.alojamentoLocal" placeholder="Alojamento Local" class="border p-2" />

        <select v-model="form.validade" class="border p-2">
          <option value="valido">Válido</option>
          <option value="invalido">Inválido</option>
        </select>

        <select v-model="form.rua" class="border p-2">
          <option value="">Rua</option>
          <option v-for="r in ruas" :key="r.id" :value="r.id">
            {{ r.rua }}
          </option>
        </select>

        <select v-model="form.tipoPublicidade" class="border p-2">
          <option value="">Tipo Publicidade</option>
          <option v-for="t in tipos" :key="t.id" :value="t.id">
            {{ t.publicidade || t.tipo }}
          </option>
        </select>

        <button class="bg-blue-600 text-white p-2 rounded">
          Guardar
        </button>

      </form>

    </div>
  </div>
</template>