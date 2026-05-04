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