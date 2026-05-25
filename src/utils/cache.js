// src/utils/cache.js

class SimpleCache {

constructor() {
this.cache = new Map()
this.ttl = new Map()
}

set(key, value, ttlMs = 300000) {

if (value === undefined) {
return
}

this.cache.set(
key,
value
)

this.ttl.set(
key,
Date.now() + ttlMs
)

}

get(key) {

const expiry =
this.ttl.get(key)

if (
!expiry ||
Date.now() > expiry
) {

this.delete(key)

return null

}

return this.cache.get(key)

}

has(key) {
return this.get(key) !== null
}

delete(key) {

this.cache.delete(key)
this.ttl.delete(key)

}

clear() {

this.cache.clear()
this.ttl.clear()

}

cleanup() {

const now =
Date.now()

for (
const [key, expiry]
of this.ttl.entries()
) {

if (
now > expiry
) {

this.delete(key)

}

}

}

}

const cache =
new SimpleCache()

if (
typeof window !== 'undefined'
) {

setInterval(
() => cache.cleanup(),
300000
)

}

export default cache