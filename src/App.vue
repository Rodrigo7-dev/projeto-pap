<template>
  <div class="min-h-screen bg-gray-50">

    <Navbar
      v-if="showNavbar"
    />

    <main>
      <router-view v-slot="{ Component }">

        <transition
          name="page"
          mode="out-in"
          appear
        >
          <component
            :is="Component"
          />
        </transition>

      </router-view>
    </main>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import Navbar from '@/components/navigation/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()

const auth = useAuthStore()

const {
  isAuthenticated
} = storeToRefs(auth)

const showNavbar =
  computed(() =>
    isAuthenticated.value &&
    !route.meta.hideNavbar
  )
</script>

<style scoped>
.page-enter-active,
.page-leave-active{
transition:
opacity .18s ease,
transform .18s ease;
}

.page-enter-from{
opacity:0;
transform:translateY(4px);
}

.page-leave-to{
opacity:0;
transform:translateY(-4px);
}
</style>