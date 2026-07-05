import axios from 'axios'

const api = axios.create({
baseURL:
'https://myapp-api-production-09ab.up.railway.app/api',

timeout: 10000,

headers: {
'Content-Type':
'application/json',

'Accept':
'application/json'
}
})

/*
====================
REQUEST
====================
*/

api.interceptors.request.use(

(config) => {

 token =
localStorage.getItem(
'auth_token'
)

if (token) {

config.headers.Authorization =
`Bearer ${token}`

}

return config

},

(error) =>
Promise.reject(error)

)

/*
====================
RESPONSE
====================
*/

api.interceptors.response.use(

(response) => {

return response.data

},

(error) => {

if (
error.response?.status === 401
) {

localStorage.removeItem(
'auth_token'
)

localStorage.removeItem(
'auth_user'
)

if (
window.location.pathname !==
'/login'
) {

window.location.href =
'/login'

}

}

return Promise.reject(
error
)

}

)

/*
====================
API METHODS
====================
*/

Object.assign(api, {

//
// AUTH
//

login(data) {
return api.post(
'/login',
data
)
},

register(data) {
return api.post(
'/register',
data
)
},

logout() {
return api.post(
'/logout'
)
},

//
// RUAS
//

getRuas() {
return api.get(
'/ruas'
)
},

getRua(id) {
return api.get(
`/ruas/${id}`
)
},

createRua(data) {
return api.post(
'/ruas',
data
)
},

updateRua(
id,
data
) {
return api.put(
`/ruas/${id}`,
data
)
},

deleteRua(id) {
return api.delete(
`/ruas/${id}`
)
},

//
// FREGUESIAS
//

getFreguesias() {
return api.get(
'/freguesias'
)
},

getFreguesia(id) {
return api.get(
`/freguesias/${id}`
)
},

createFreguesia(
data
) {
return api.post(
'/freguesias',
data
)
},

updateFreguesia(
id,
data
) {
return api.put(
`/freguesias/${id}`,
data
)
},

deleteFreguesia(
id
) {
return api.delete(
`/freguesias/${id}`
)
},

//
// TIPOS
//

getTipos() {
return api.get(
'/tipo-publicidades'
)
},

getTipo(id) {
return api.get(
`/tipo-publicidades/${id}`
)
},

createTipo(
data
) {
return api.post(
'/tipo-publicidades',
data
)
},

updateTipo(
id,
data
) {
return api.put(
`/tipo-publicidades/${id}`,
data
)
},

deleteTipo(
id
) {
return api.delete(
`/tipo-publicidades/${id}`
)
},

//
// PROCESSOS
//

getProcessos() {
return api.get(
'/processos'
)
},

getProcesso(
id
) {
return api.get(
`/processos/${id}`
)
},

createProcesso(
data
) {
return api.post(
'/processos',
data
)
},

updateProcesso(
id,
data
) {
return api.put(
`/processos/${id}`,
data
)
},

deleteProcesso(
id
) {
return api.delete(
`/processos/${id}`
)
}

})

export default api