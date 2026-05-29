<template>
  <div class="home-page">
    <section class="hero text-center text-white">
      <div class="container">
        <h1 class="display-4 fw-bold">
          Sistema de Gestión de Productos
        </h1>

        <p class="lead mt-3">
          Administrá productos, consultá reportes y utilizá inteligencia artificial
          para analizar la información del sistema.
        </p>

        <div class="mt-4">
          <RouterLink to="/productos" class="btn btn-light btn-lg me-2">
            Ver productos
          </RouterLink>

          <RouterLink
            v-if="esAdmin"
            to="/dashboard"
            class="btn btn-outline-light btn-lg"
          >
            Ir al dashboard
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="container mt-5">
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card shadow h-100 border-0">
            <div class="card-body text-center">
              <h3>📦 Productos</h3>
              <p>
                Consultá los productos cargados en el sistema. El administrador
                puede crear, editar y eliminar productos.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card shadow h-100 border-0">
            <div class="card-body text-center">
              <h3>📊 Dashboard</h3>
              <p>
                El administrador puede visualizar reportes sobre stock,
                precios, cantidad de productos y valor total.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card shadow h-100 border-0">
            <div class="card-body text-center">
              <h3>🤖 Asistente IA</h3>
              <p>
                La IA responde preguntas usando los datos reales de productos
                guardados en MockAPI mediante VectorShift.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container mt-4 mb-5">
      <div class="card shadow border-0 p-4">
        <h2 class="mb-3">Usuario actual</h2>

        <p v-if="usuario">
          Sesión iniciada como:
          <strong>{{ usuario.nombre }}</strong>
          con rol
          <strong>{{ usuario.rol }}</strong>.
        </p>

        <div v-if="esAdmin" class="alert alert-success">
          Como administrador podés gestionar productos, consultar reportes y usar la IA.
        </div>

        <div v-else class="alert alert-info">
          Como usuario común podés consultar los productos disponibles.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { obtenerUsuarioReactivo } from '../services/authService'

const usuarioReactivo = obtenerUsuarioReactivo()

const usuario = computed(() => {
  return usuarioReactivo.value
})

const esAdmin = computed(() => {
  return usuario.value && usuario.value.rol === 'admin'
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.hero {
  padding: 90px 20px;
  background: linear-gradient(135deg, #0d6efd, #6610f2);
}

.card {
  border-radius: 18px;
}

.card h3 {
  font-weight: bold;
}
</style>