<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const processos = ref([])
const search = ref('')

const loadProcessos = async () => {
  try {
    const res = await api.getProcessos()
    processos.value = res.data || res // suporta ambos os casos
  } catch (error) {
    console.error('Erro ao carregar processos:', error)
  }
}

const filteredProcessos = computed(() => {
  const t = search.value.toLowerCase().trim()

  return processos.value.filter(p =>
    (p.processo || '').toLowerCase().includes(t) ||
    (p.alvara || '').toLowerCase().includes(t) ||
    (p.rua?.rua || '').toLowerCase().includes(t) ||
    (p.tipoPublicidade?.publicidade ||
     p.tipoPublicidade?.tipo ||
     '').toLowerCase().includes(t)
  )
})

const editProcesso = (id) => {
  router.push(`/processos/${id}/editar`)
}

const handleDelete = async (id, num) => {
  if (!id) return

  if (confirm(`Eliminar processo ${num}?`)) {
    try {
      await api.deleteProcesso(id)
      processos.value = processos.value.filter(p => p.id !== id)
    } catch (error) {
      console.error(error)
      alert('Erro ao eliminar processo')
    }
  }
}

onMounted(loadProcessos)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">

      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Gestão de Processos</h1>

        <router-link
          to="/processos/novo"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Novo Processo
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow-sm border">

        <div class="p-4 border-b">
          <input
            v-model="search"
            placeholder="Pesquisar..."
            class="w-full border p-2 rounded"
          />
        </div>

        <table class="w-full text-left">
          <thead>
            <tr>
              <th>Processo</th>
              <th>Alvará</th>
              <th>Publicidade</th>
              <th>Rua</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in filteredProcessos" :key="p.id || p._id">

              <td>{{ p.processo }}</td>
              <td>{{ p.alvara || '-' }}</td>

              <td>
                {{ p.tipoPublicidade?.publicidade || p.tipoPublicidade?.tipo || '-' }}
              </td>

              <td>{{ p.rua?.rua || '-' }}</td>

              <td>
                {{ p.validade === 'valido' ? 'Válido' : 'Expirado' }}
              </td>

              <td>
                <button @click="editProcesso(p.id || p._id)">Editar</button>
                <button @click="handleDelete(p.id || p._id, p.processo)">Eliminar</button>
              </td>

            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>