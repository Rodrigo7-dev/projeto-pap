<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const isEditing = computed(() => !!route.params.id)
const loading = ref(false)

const tipos = ref([])
const ruas = ref([])

const form = ref({
  processo: '',
  alvara: '',
  alojamento_local: '',
  validade: 'valido',
  rua: null,
  tipo_publicidade: null
})

// =====================
// LOAD DATA
// =====================
const fetchData = async () => {
  try {
    const [t, r] = await Promise.all([
      api.getTipos(),
      api.getRuas()
    ])

    tipos.value = t?.data ?? t ?? []
    ruas.value = r?.data ?? r ?? []

    if (isEditing.value) {
      const res = await api.getProcesso(route.params.id)
      const d = res?.data ?? res

      form.value = {
        processo: d.processo ?? '',
        alvara: d.alvara ?? '',
        alojamento_local: d.alojamento_local ?? '',
        validade: d.validade ?? 'valido',
        rua: d.rua?.id ?? d.rua ?? null,
        tipo_publicidade: d.tipo_publicidade?.id ?? d.tipo_publicidade ?? null
      }
    }

  } catch (e) {
    console.error('Erro ao carregar dados:', e)
  }
}

// =====================
// NORMALIZA PAYLOAD
// =====================
const buildPayload = () => {
  return {
    processo: form.value.processo,
    alvara: form.value.alvara,
    alojamento_local: form.value.alojamento_local,
    validade: form.value.validade,

    // 🔥 normalização correta para backend (IDs explícitos)
    rua_id: form.value.rua || null,
    tipo_publicidade_id: form.value.tipo_publicidade || null
  }
}

// =====================
// SUBMIT
// =====================
const handleSubmit = async () => {
  if (loading.value) return

  loading.value = true

  try {
    const payload = buildPayload()

    if (isEditing.value) {
      await api.updateProcesso(route.params.id, payload)
    } else {
      await api.createProcesso(payload)
    }

    router.push('/processos')

  } catch (error) {
    console.error('Erro ao guardar processo:', error?.response?.data || error)
    alert('Erro ao guardar processo')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">

      <!-- HEADER -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-gray-900">
          {{ isEditing ? 'Editar Processo' : 'Novo Processo' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Preencha os dados do processo
        </p>
      </div>

      <!-- FORM -->
      <form
        @submit.prevent="handleSubmit"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4"
      >

        <!-- PROCESSO -->
        <input
          v-model="form.processo"
          placeholder="Processo"
          required
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 outline-none"
        />

        <!-- ALVARÁ -->
        <input
          v-model="form.alvara"
          placeholder="Alvará"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 outline-none"
        />

        <!-- ALOJAMENTO -->
        <input
          v-model="form.alojamento_local"
          placeholder="Alojamento Local"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 outline-none"
        />

        <!-- VALIDADE -->
        <select
          v-model="form.validade"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
        >
          <option value="valido">Válido</option>
          <option value="invalido">Inválido</option>
        </select>

        <!-- RUA -->
        <select
          v-model="form.rua"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
        >
          <option :value="null">Selecionar Rua</option>
          <option
            v-for="r in ruas"
            :key="r.id"
            :value="r.id"
          >
            {{ r.rua }}
          </option>
        </select>

        <!-- TIPO PUBLICIDADE -->
        <select
          v-model="form.tipo_publicidade"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
        >
          <option :value="null">Tipo de Publicidade</option>
          <option
            v-for="t in tipos"
            :key="t.id"
            :value="t.id"
          >
            {{ t.publicidade || t.tipo }}
          </option>
        </select>

        <!-- ACTIONS -->
        <div class="flex justify-end gap-3 pt-4">

          <button
            type="button"
            @click="router.back()"
            class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
          >
            {{ loading ? 'A guardar...' : 'Guardar' }}
          </button>

        </div>

      </form>
    </div>
  </div>
</template>