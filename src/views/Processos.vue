<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">

      <!-- HEADER -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">
            Gestão de Processos
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Consulta e gestão de processos ativos
          </p>
        </div>

        <router-link
          to="/processos/novo"
          class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          + Novo Processo
        </router-link>
      </div>

      <!-- CARD -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        <!-- SEARCH -->
        <div class="p-4 border-b border-gray-100">
          <input
            v-model="search"
            placeholder="Pesquisar processos..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">

            <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4 text-left">Processo</th>
                <th class="px-6 py-4 text-left">Alvará</th>
                <th class="px-6 py-4 text-left">Publicidade</th>
                <th class="px-6 py-4 text-left">Rua</th>
                <th class="px-6 py-4 text-left">Estado</th>
                <th class="px-6 py-4 text-right">Ações</th>
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
                  {{ p.alvara }}
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ p.tipo_publicidade?.publicidade }}
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ p.rua?.rua }}
                </td>

                <td class="px-6 py-4">
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="p.validade === 'valido'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'"
                  >
                    {{ p.validade === 'valido' ? 'Válido' : 'Inválido' }}
                  </span>
                </td>

                <td class="px-6 py-4 text-right">

                  <!-- EDIT -->
                  <button
                    @click="editProcesso(p.id)"
                    class="px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:bg-gray-100 transition"
                  >
                    Editar
                  </button>

                </td>

              </tr>

            </tbody>
          </table>
        </div>

        <!-- EMPTY STATE -->
        <div
          v-if="filteredProcessos.length === 0"
          class="text-center py-14 text-gray-500"
        >
          <div class="text-4xl mb-2">📄</div>
          <p class="font-medium text-gray-700">Nenhum processo encontrado</p>
          <p class="text-sm">Tenta alterar a pesquisa</p>
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

// LOAD
const loadProcessos = async () => {
  try {
    const res = await api.getProcessos()
    processos.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error(err)
    processos.value = []
  }
}

// FILTER
const filteredProcessos = computed(() => {
  const t = search.value.toLowerCase()

  return processos.value.filter(p =>
    (p.processo ?? '').toLowerCase().includes(t) ||
    (p.alvara ?? '').toLowerCase().includes(t) ||
    (p.rua?.rua ?? '').toLowerCase().includes(t) ||
    (p.tipo_publicidade?.publicidade ?? '').toLowerCase().includes(t)
  )
})

// EDIT
const editProcesso = (id) => {
  router.push(`/processos/${id}/editar`)
}

onMounted(loadProcessos)
</script>