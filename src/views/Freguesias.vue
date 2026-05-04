<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">

      <!-- HEADER -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">
            Freguesias
          </h1>
        </div>

        <router-link
          to="/freguesias/nova"
          class="bg-gray-900 text-white px-4 py-2 rounded"
        >
          + Nova
        </router-link>
      </div>

      <!-- SEARCH -->
      <input
        v-model="search"
        placeholder="Pesquisar..."
        class="w-full mb-4 px-4 py-2 border rounded"
      />

      <!-- LIST -->
      <div v-if="filteredFreguesias.length">

        <div
          v-for="f in filteredFreguesias"
          :key="f.id || f._id"
          class="p-4 border-b flex justify-between"
        >
          <span>{{ f.freguesia }}</span>

          <button @click="editFreguesia(f.id || f._id)">
            Editar
          </button>
        </div>

      </div>

      <div v-else class="text-center text-gray-500 mt-10">
        Sem dados
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const freguesias = ref([])
const search = ref('')

// LOAD
const loadFreguesias = async () => {
  try {
    const res = await api.getFreguesias()

    console.log('Freguesias:', res)

    // 🔥 PROTEÇÃO TOTAL
    if (Array.isArray(res.data)) {
      freguesias.value = res.data
    } else {
      freguesias.value = []
    }

  } catch (e) {
    console.error('Erro ao carregar freguesias:', e)
    freguesias.value = []
  }
}

// FILTER
const filteredFreguesias = computed(() => {
  const t = search.value.toLowerCase()

  return freguesias.value.filter(f =>
    (f.freguesia ?? '').toLowerCase().includes(t)
  )
})

// EDIT
const editFreguesia = (id) => {
  router.push(`/freguesias/${id}/editar`)
}

onMounted(loadFreguesias)
</script>