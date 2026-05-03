<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- Header area (future use: breadcrumbs, alerts) -->
    <slot name="header" />

    <!-- Main content -->
    <main class="flex-1 w-full max-w-6xl mx-auto p-6">
      <slot />
    </main>

  </div>
</template>