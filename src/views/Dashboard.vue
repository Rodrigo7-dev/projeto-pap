<script setup>
import { computed, onMounted, ref } from 'vue'

import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { unwrapList, validadeClass, validadeLabel } from '@/utils/helpers'

import TableLayout from '@/components/layout/TableLayout.vue'
import BasePageHeader from '@/components/layout/BasePageHeader.vue'

const auth = useAuthStore()

const stats = ref({
  total_processos: 0,
  processos_validos: 0,
  processos_invalidos: 0,
  total_ruas: 0
})

const processos = ref([])
const loading = ref(false)

const statCards = computed(() => {
  const cards = [
    {
      label: 'Processos',
      value: stats.value.total_processos,
      tone: 'bg-slate-100 text-slate-700'
    },
    {
      label: 'Válidos',
      value: stats.value.processos_validos,
      tone: 'bg-emerald-50 text-emerald-700'
    },
    {
      label: 'Inválidos',
      value: stats.value.processos_invalidos,
      tone: 'bg-rose-50 text-rose-700'
    }
  ]

  if (auth.isAdmin) {
    cards.push({
      label: 'Ruas',
      value: stats.value.total_ruas,
      tone: 'bg-sky-50 text-sky-700'
    })
  }

  return cards
})

const quickLinks = computed(() => {
  const links = [
    { to: '/processos', title: 'Processos', text: 'Gerir processos' }
  ]

  if (auth.isAdmin) {
    links.push(
      { to: '/ruas', title: 'Ruas', text: 'Gerir ruas' },
      { to: '/freguesias', title: 'Freguesias', text: 'Gerir freguesias' },
      { to: '/tipos', title: 'Publicidade', text: 'Gerir tipos' }
    )
  }

  return links
})

const loadData = async () => {
  loading.value = true

  try {
    const [processosRes, ruasRes] = await Promise.all([
      api.getProcessos(),
      auth.isAdmin ? api.getRuas() : Promise.resolve([])
    ])

    const listaProcessos = unwrapList(processosRes)
    const listaRuas = unwrapList(ruasRes)

    stats.value = {
      total_processos: listaProcessos.length,
      processos_validos: listaProcessos.filter((p) => p.validade === 'valido').length,
      processos_invalidos: listaProcessos.filter((p) => p.validade === 'invalido').length,
      total_ruas: listaRuas.length
    }

    processos.value = listaProcessos.slice(0, 10)
  } catch (e) {
    console.error('Erro ao carregar dashboard:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <TableLayout>
    <BasePageHeader
      title="Painel"
      subtitle="Resumo geral do sistema"
    />

    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">
              {{ card.label }}
            </p>

            <p class="mt-2 text-3xl font-semibold text-slate-900">
              {{ card.value }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-lg text-lg font-semibold"
            :class="card.tone"
          >
            {{ card.label.charAt(0) }}
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <router-link
        v-for="link in quickLinks"
        :key="link.to"
        :to="link.to"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
      >
        <p class="font-semibold text-slate-900">
          {{ link.title }}
        </p>

        <p class="mt-1 text-sm text-slate-500">
          {{ link.text }}
        </p>
      </router-link>
    </div>

    <BaseCard class="flex-1">
      <div class="border-b border-slate-200 px-5 py-4">
        <h2 class="text-lg font-semibold text-slate-900">
          Processos recentes
        </h2>
      </div>

      <div
        v-if="loading"
        class="py-12 text-center text-slate-500"
      >
        A carregar...
      </div>

      <div
        v-else-if="processos.length"
        class="flex flex-1 flex-col overflow-hidden"
      >
        <div class="flex-1 overflow-auto">
          <table class="responsive-table">
            <thead class="table-head sticky top-0 z-10 bg-white">
              <tr>
                <th class="table-cell text-left">
                  Processo
                </th>

                <th class="table-cell text-left">
                  Tipo
                </th>

                <th class="table-cell text-left">
                  Rua
                </th>

                <th class="table-cell text-left">
                  Validade
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="processo in processos"
                :key="processo.id || processo._id"
                class="transition hover:bg-slate-50"
              >
                <td class="table-cell text-slate-800">
                  {{ processo.processo }}
                </td>

                <td class="table-cell text-slate-600">
                  {{ processo.tipo_publicidade?.publicidade || processo.tipoPublicidade?.publicidade || '-' }}
                </td>

                <td class="table-cell text-slate-600">
                  {{ processo.rua?.nome || processo.rua?.rua || '-' }}
                </td>

                <td class="table-cell">
                  <span
                    class="status-badge"
                    :class="validadeClass(processo.validade)"
                  >
                    {{ validadeLabel(processo.validade) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        v-else
        class="empty-state"
      >
        <p class="font-medium text-slate-700">
          Nenhum processo encontrado
        </p>

        <p class="mt-1 text-sm text-slate-500">
          Comece por adicionar um novo processo.
        </p>
      </div>
    </BaseCard>
  </TableLayout>
</template>