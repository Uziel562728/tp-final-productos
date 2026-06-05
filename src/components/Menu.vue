<template>
  <nav v-if="usuario" class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
    <RouterLink class="navbar-brand" to="/home">
      TP Final
    </RouterLink>

    <div class="navbar-nav me-auto">
      <RouterLink class="nav-link" to="/home">
        Inicio
      </RouterLink>

      <RouterLink class="nav-link" to="/productos">
        Productos
      </RouterLink>

      <RouterLink
        v-if="usuario.rol === 'admin'"
        class="nav-link"
        to="/dashboard"
      >
        Dashboard
      </RouterLink>

<RouterLink
  v-if="usuario.rol === 'admin'"
  class="nav-link"
  to="/ia"
>
  Asistente IA
</RouterLink>

<RouterLink
  v-if="usuario.rol === 'admin'"
  class="nav-link"
  to="/peticiones"
>
  Peticiones
</RouterLink>

<RouterLink
  v-if="usuario.rol !== 'admin'"
  class="nav-link"
  to="/favoritos"
>
  Favoritos
</RouterLink>

<RouterLink
  v-if="usuario.rol !== 'admin'"
  class="nav-link"
  to="/carrito"
>
  Carrito
</RouterLink>

<RouterLink
  v-if="usuario.rol !== 'admin'"
  class="nav-link"
  to="/mis-peticiones"
>
  Mis Pedidos
</RouterLink>

    </div>

    <span class="text-white me-3">
      {{ usuario.nombre }} - {{ usuario.rol }}
    </span>

    <button class="btn btn-outline-light" @click="cerrarSesion">
      Salir
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { obtenerUsuarioReactivo, logout } from '../services/authService'

const router = useRouter()
const usuarioReactivo = obtenerUsuarioReactivo()

const usuario = computed(() => {
  return usuarioReactivo.value
})

const cerrarSesion = () => {
  logout()
  router.push('/')
}
</script>