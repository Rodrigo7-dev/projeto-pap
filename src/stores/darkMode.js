import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDark = ref(false)

  // Load preference from localStorage
  const loadPreference = () => {
    const saved = localStorage.getItem('darkMode')
    isDark.value = saved === 'true'
    updateDOM()
  }

  // Update DOM classes
  const updateDOM = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle dark mode
  const toggle = () => {
    isDark.value = !isDark.value
  }

  // Watch for changes and save to localStorage
  watch(isDark, (newValue) => {
    localStorage.setItem('darkMode', newValue.toString())
    updateDOM()
  })

  // Initialize immediately
  loadPreference()

  return {
    isDark,
    toggle,
    loadPreference,
    updateDOM
  }
})
