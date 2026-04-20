<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-gray-900">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mt-4">Página Não Encontrada</h2>
        <p class="text-gray-600 mt-2">A página que você está procurando não existe.</p>
      </div>
      
      <div class="space-y-4">
        <router-link 
          to="/dashboard" 
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Voltar ao Dashboard
        </router-link>
        
        <div class="text-sm text-gray-500">
          Ou 
          <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
            faça login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Página 404 simples
</script>
