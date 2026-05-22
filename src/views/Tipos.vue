<template>
  <div class="min-h-screen bg-gray-50 p-6">

    <div class="max-w-6xl mx-auto">

      <!-- HEADER -->
      <div class="flex items-center justify-between mb-8">

        <div>

          <h1 class="text-3xl font-semibold text-gray-900">
            Tipos de Publicidade
          </h1>

          <p class="text-sm text-gray-500 mt-1">
            Gestão dos tipos disponíveis no sistema
          </p>

        </div>

        <router-link
          v-if="auth.isAdmin"
          to="/tipos/novo"
          class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          + Novo Tipo
        </router-link>

      </div>

      <!-- CARD -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        <!-- SEARCH -->
        <div class="p-4 border-b border-gray-100">

          <input
            v-model="search"
            placeholder="Pesquisar tipos..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />

        </div>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="text-center py-14 text-gray-500"
        >
          A carregar...
        </div>

        <!-- TABLE -->
        <div
          v-else-if="filteredTipos.length"
          class="overflow-x-auto"
        >

          <table class="w-full text-sm">

            <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">

              <tr>

                <th class="px-6 py-4 text-left">
                  Nome da Publicidade
                </th>

                <th
                  v-if="auth.isAdmin"
                  class="px-6 py-4 text-right"
                >
                  Ações
                </th>

              </tr>

            </thead>

            <tbody class="divide-y divide-gray-100">

              <tr
                v-for="tipo in filteredTipos"
                :key="tipo._id || tipo.id"
                class="hover:bg-gray-50 transition"
              >

                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ tipo.publicidade || tipo.tipo }}
                </td>

                <td
                  v-if="auth.isAdmin"
                  class="px-6 py-4 text-right space-x-2"
                >

                  <button
                    @click="editTipo(tipo._id || tipo.id)"
                    class="px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:bg-gray-100 transition"
                  >
                    Editar
                  </button>

                  <button
                    @click="handleDelete(tipo)"
                    class="px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <!-- EMPTY -->
        <div
          v-else
          class="text-center py-14 text-gray-500"
        >

          <div class="text-4xl mb-2">
            📂
          </div>

          <p class="font-medium text-gray-700">
            Nenhum tipo encontrado
          </p>

          <p class="text-sm">
            Tenta alterar a pesquisa
          </p>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'

import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const tipos = ref([])
const search = ref('')
const loading = ref(false)

const loadTipos = async () => {

  loading.value = true

  try {

    const res =
      await api.getTipos()

    const lista =
      res?.data ??
      res ??
      []

    tipos.value =
      Array.isArray(lista)
        ? lista
        : []

  }

  catch (error) {

    console.error(
      'Erro ao carregar tipos:',
      error
    )

    tipos.value = []

  }

  finally {

    loading.value = false

  }

}

const filteredTipos = computed(() => {

  const term =
    search.value
      .toLowerCase()
      .trim()

  return tipos.value.filter((tipo) => {

    return (
      (
        tipo.publicidade
        ||
        tipo.tipo
        ||
        ''
      )
        .toLowerCase()
        .includes(term)
    )

  })

})

const editTipo = (id) => {

  router.push(
    `/tipos/${id}/editar`
  )

}

const handleDelete = async (tipo) => {

  const id =
    tipo._id ||
    tipo.id

  const nome =
    tipo.publicidade ||
    tipo.tipo

  if (
    !confirm(
      `Eliminar "${nome}"?`
    )
  ) {
    return
  }

  try {

    await api.deleteTipo(id)

    tipos.value =
      tipos.value.filter(
        item =>
          (
            item._id ||
            item.id
          ) !== id
      )

  }

  catch (error) {

    console.error(error)

    alert(
      'Impossível eliminar. Este tipo está a ser utilizado.'
    )

  }

}

onMounted(loadTipos)
</script>