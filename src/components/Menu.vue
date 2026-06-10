<template>
  <nav v-if="usuario" class="navbar navbar-expand-lg navbar-dark bg-dark px-3 py-2">
    <div class="container-fluid p-0 d-flex align-items-center justify-content-between flex-wrap">
      <RouterLink class="navbar-brand fw-bold" to="/home" @click="isMenuOpen = false">
        TP Final
      </RouterLink>

      <button 
        class="navbar-toggler" 
        type="button" 
        @click="isMenuOpen = !isMenuOpen" 
        aria-controls="navbarNav" 
        :aria-expanded="isMenuOpen" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ 'show': isMenuOpen }" id="navbarNav">
        <div class="navbar-nav me-auto py-2 py-lg-0">
          <RouterLink class="nav-link" to="/home" @click="isMenuOpen = false">
            Inicio
          </RouterLink>

          <RouterLink class="nav-link" to="/productos" @click="isMenuOpen = false">
            Productos
          </RouterLink>

          <RouterLink
            v-if="usuario.rol === 'admin'"
            class="nav-link"
            to="/dashboard"
            @click="isMenuOpen = false"
          >
            Dashboard
          </RouterLink>

          <RouterLink
            v-if="usuario.rol === 'admin'"
            class="nav-link"
            to="/ia"
            @click="isMenuOpen = false"
          >
            Asistente IA
          </RouterLink>

          <RouterLink
            v-if="usuario.rol === 'admin'"
            class="nav-link"
            to="/peticiones"
            @click="isMenuOpen = false"
          >
            Peticiones
          </RouterLink>

          <RouterLink
            v-if="usuario.rol !== 'admin'"
            class="nav-link"
            to="/favoritos"
            @click="isMenuOpen = false"
          >
            Favoritos
          </RouterLink>

          <RouterLink
            v-if="usuario.rol !== 'admin'"
            class="nav-link"
            to="/carrito"
            @click="isMenuOpen = false"
          >
            Carrito
          </RouterLink>

          <RouterLink
            v-if="usuario.rol !== 'admin'"
            class="nav-link"
            to="/mis-peticiones"
            @click="isMenuOpen = false"
          >
            Mis Pedidos
          </RouterLink>
        </div>

        <div class="d-flex align-items-center flex-wrap gap-3 mt-2 mt-lg-0 navbar-user-section">
          <span class="text-white user-badge">
            👤 {{ usuario.nombre }} <span class="badge bg-secondary ms-1">{{ usuario.rol }}</span>
          </span>

          <button class="btn btn-outline-light btn-nav-exit" @click="cerrarSesion">
            Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { obtenerUsuarioReactivo, logout } from '../services/authService'

const router = useRouter()
const usuarioReactivo = obtenerUsuarioReactivo()
const isMenuOpen = ref(false)

const usuario = computed(() => {
  return usuarioReactivo.value
})

const cerrarSesion = () => {
  isMenuOpen.value = false
  logout()
  router.push('/')
}
</script>