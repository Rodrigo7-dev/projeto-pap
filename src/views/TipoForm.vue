<template>
  <div class="min-h-screen bg-gray-50 p-6">

    <div class="max-w-4xl mx-auto">

      <!-- HEADER -->
      <div class="flex items-center mb-8">

        <router-link
          to="/tipos"
          class="text-sm text-gray-600 hover:text-gray-900 mr-4"
        >
          ← Voltar
        </router-link>

        <h1 class="text-3xl font-semibold text-gray-900">
          {{ isEditing ? 'Editar Tipo' : 'Novo Tipo' }}
        </h1>

      </div>

      <!-- FORM -->
      <form
        @submit.prevent="handleSubmit"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5"
      >

        <!-- LOADING -->
        <div
          v-if="loading"
          class="text-center py-8 text-gray-500"
        >
          A carregar...
        </div>

        <template v-else>

          <!-- INPUT -->
          <div>

            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome da Publicidade
            </label>

            <input
              v-model="form.publicidade"
              type="text"
              required
              placeholder="Ex: Outdoor"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />

          </div>

        </template>

        <!-- ACTIONS -->
        <div class="flex justify-between pt-4">

          <button
            v-if="isEditing && !loading"
            type="button"
            @click="handleDelete"
            class="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            Eliminar
          </button>

          <div class="flex gap-2 ml-auto">

            <button
              type="button"
              @click="router.push('/tipos')"
              class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              :disabled="submitting || loading"
              class="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {{
                submitting
                  ? 'A guardar...'
                  : isEditing
                    ? 'Atualizar'
                    : 'Guardar'
              }}
            </button>

          </div>

        </div>

      </form>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)

const isEditing = computed(
  () => !!route.params.id
)

const form = ref({
  publicidade: ''
})

const loadTipo = async () => {

  if (!isEditing.value)
    return

  loading.value = true

  try {

    const res =
      await api.getTipo(
        route.params.id
      )

    const data =
      res?.data ??
      res ??
      {}

    form.value = {
      publicidade:
        data.publicidade ??
        data.tipo ??
        ''
    }

  }

  catch (error) {

    console.error(error)

    alert(
      'Erro ao carregar tipo'
    )

    router.push(
      '/tipos'
    )

  }

  finally {

    loading.value = false

  }

}

const handleSubmit = async () => {

  const publicidade =
    form.value.publicidade
      .trim()

  if (!publicidade) {

    alert(
      'Preencha o nome'
    )

    return

  }

  submitting.value = true

  try {

    const payload = {
      publicidade
    }

    if (
      isEditing.value
    ) {

      await api.updateTipo(
        route.params.id,
        payload
      )

    }

    else {

      await api.createTipo(
        payload
      )

    }

    router.push(
      '/tipos'
    )

  }

  catch (error) {

    console.error(error)

    alert(
      error?.response
        ?.data
        ?.error
      ||
      'Erro ao guardar'
    )

  }

  finally {

    submitting.value = false

  }

}

const handleDelete = async () => {

  if (
    !confirm(
      'Eliminar este tipo?'
    )
  ) return

  try {

    await api.deleteTipo(
      route.params.id
    )

    router.push(
      '/tipos'
    )

  }

  catch (error) {

    console.error(error)

    alert(
      'Erro ao eliminar'
    )

  }

}

onMounted(
  loadTipo
)
</script>