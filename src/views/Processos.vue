<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">

      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">Processos</h1>
          <p class="text-sm text-gray-500 mt-1">
            Gestão e controlo de processos
          </p>
        </div>

        <router-link
          to="/processos/novo"
          class="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          + Novo Processo
        </router-link>
      </div>

      <!-- CARD -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <!-- SEARCH -->
        <div class="p-4 border-b border-gray-100">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              v-model="search"
              placeholder="Pesquisar processos..."
              class="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 text-sm"
            />
          </div>
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">

            <thead class="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th class="px-6 py-4 text-left font-medium">Processo</th>
                <th class="px-6 py-4 text-left font-medium">Alvará</th>
                <th class="px-6 py-4 text-left font-medium">Publicidade</th>
                <th class="px-6 py-4 text-left font-medium">Rua</th>
                <th class="px-6 py-4 text-left font-medium">Estado</th>
                <th class="px-6 py-4 text-right font-medium">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">

              <tr
                v-for="p in filteredProcessos"
                :key="p.id"
                class="hover:bg-gray-50 transition"
              >

                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ p.processo }}
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ p.alvara || '-' }}
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ p.tipo_publicidade?.publicidade || '-' }}
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ p.rua?.rua || '-' }}
                </td>

                <td class="px-6 py-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="p.validade === 'valido'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'"
                  >
                    {{ p.validade === 'valido' ? 'Válido' : 'Inválido' }}
                  </span>
                </td>

                <td class="px-6 py-4 text-right space-x-2">

                  <button
                    @click="editProcesso(p.id)"
                    class="text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                  >
                    Editar
                  </button>

                  <button
                    @click="handleDelete(p.id, p.processo)"
                    class="text-sm px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            </tbody>
          </table>

        </div>

        <!-- EMPTY STATE -->
        <div
          v-if="filteredProcessos.length === 0"
          class="text-center py-16 text-gray-500"
        >
          <div class="text-4xl mb-2">📄</div>
          <p class="font-medium text-gray-700">Nenhum processo encontrado</p>
          <p class="text-sm mt-1">Tenta ajustar a pesquisa</p>
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

    const lista = res?.data ?? []
    processos.value = Array.isArray(lista) ? lista : []

  } catch (err) {
    console.error(err)
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

  await api.deleteProcesso(id)

  processos.value = processos.value.filter(p => p.id !== id)
}

const editProcesso = (id) => {
  router.push(`/processos/${id}`)
}

onMounted(loadProcessos)
</script>