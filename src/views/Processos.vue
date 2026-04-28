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
            <tr v-for="p in filteredProcessos" :key="p.id">

              <td>{{ p.processo }}</td>
              <td>{{ p.alvara || '-' }}</td>

              <td>
                {{ p.tipo_publicidade?.publicidade || '-' }}
              </td>

              <td>
                {{ p.rua?.rua || '-' }}
              </td>

              <td>
                {{ p.validade === 'valido' ? 'Válido' : 'Inválido' }}
              </td>

              <td>
                <button @click="editProcesso(p.id)">Editar</button>
                <button @click="handleDelete(p.id, p.processo)">Eliminar</button>
              </td>

            </tr>
          </tbody>
        </table>

        <div v-if="filteredProcessos.length === 0" class="p-4 text-gray-500">
          Nenhum processo encontrado.
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

const processos = ref([])
const search = ref('')

const loadProcessos = async () => {
  try {
    const res = await api.getProcessos()

    // 🔥 CORREÇÃO PRINCIPAL
    const lista = res?.data ?? []

    processos.value = Array.isArray(lista) ? lista : []

  } catch (err) {
    console.error('Erro:', err)
    processos.value = []
  }
}

const filteredProcessos = computed(() => {
  const t = search.value.toLowerCase()

  return processos.value.filter(p =>
    p.processo?.toLowerCase().includes(t) ||
    p.alvara?.toLowerCase().includes(t) ||
    p.rua?.rua?.toLowerCase().includes(t) ||
    p.tipo_publicidade?.publicidade?.toLowerCase().includes(t)
  )
})

const handleDelete = async (id, nome) => {
  if (!confirm(`Eliminar ${nome}?`)) return

  try {
    await api.deleteProcesso(id)

    processos.value = processos.value.filter(p => p.id !== id)
  } catch (err) {
    console.error(err)
  }
}

const editProcesso = (id) => {
  router.push(`/processos/${id}`)
}

onMounted(loadProcessos)
</script>