// src/utils/cache.js
class SimpleCache {
  constructor() {
    this.cache = new Map()
    this.ttl = new Map()
  }

  set(key, value, ttlMs = 300000) { // 5 minutos default
    this.cache.set(key, value)
    this.ttl.set(key, Date.now() + ttlMs)
  }

  get(key) {
    const expiry = this.ttl.get(key)
    if (!expiry || Date.now() > expiry) {
      this.delete(key)
      return null
    }
    return this.cache.get(key)
  }

  delete(key) {
    this.cache.delete(key)
    this.ttl.delete(key)
  }

  clear() {
    this.cache.clear()
    this.ttl.clear()
  }

  // Limpar expirados
  cleanup() {
    const now = Date.now()
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        this.delete(key)
      }
    }
  }
}

const cache = new SimpleCache()

// Limpar cache a cada 5 minutos
setInterval(() => cache.cleanup(), 300000)

export default cache
