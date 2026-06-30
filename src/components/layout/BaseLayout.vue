<template>
  <div class="min-h-screen bg-slate-50">

    <slot name="header" />

    <main class="max-w-6xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
      <slot />
    </main>

  </div>
</template>
