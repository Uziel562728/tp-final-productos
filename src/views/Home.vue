<template>
  <div class="home-page">
    <section class="hero text-center text-white">
      <div class="container">
        <h1 class="display-4 fw-bold hero-title">
          <span class="typing-effect">Sistema de Gestión de Productos</span>
        </h1>

        <p class="lead mt-4 welcome-text">
          {{ esAdmin ? 'Bienvenido Administrador' : 'Bienvenido Usuario' }}
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
      <!-- Tarjetas para Administrador -->
      <div v-if="esAdmin" class="row">
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

      <!-- Tarjetas para Usuario Común -->
      <div v-else class="row">
        <div class="col-md-4 mb-4">
          <div class="card shadow h-100 border-0">
            <div class="card-body text-center">
              <h3>📦 Productos</h3>
              <p>
                Consultá los productos disponibles en la tienda y agregalos a tu carrito para realizar compras.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card shadow h-100 border-0">
            <div class="card-body text-center">
              <h3>💖 Favoritos</h3>
              <p>
                Guardá tus productos preferidos en la lista de favoritos para tener un acceso más rápido en cualquier momento.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card shadow h-100 border-0">
            <div class="card-body text-center">
              <h3>📝 Pedidos de Compra</h3>
              <p>
                Realizá pedidos de compra agrupando tus productos del carrito para que el administrador los apruebe y prepare.
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
          Como usuario común podés consultar los productos disponibles, agregar productos a favoritos y hacer pedidos.
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
  background: transparent;
}

.hero {
  padding: 90px 20px;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.3);
}

.card {
  border-radius: 18px;
}

.card h3 {
  font-weight: bold;
}

/* Typing and Underline animation styling */
.hero-title {
  position: relative;
  display: inline-block;
  margin: 32px auto;
}

.hero-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 4px;
  background-color: #ffffff;
  border-radius: 2px;
  animation: underline-expand 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2.6s forwards;
}

.typing-effect {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
  border-right: 0.15em solid transparent; /* Starts transparent, caret will blink then turn off */
  width: 0;
  animation: 
    typing 2.5s steps(31, end) forwards,
    blink-caret 0.75s step-end 4; /* Caret blinks during typing */
  max-width: 100%;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: rgba(255, 255, 255, 0.85) }
}

@keyframes underline-expand {
  from { width: 0; }
  to { width: 100%; }
}

.welcome-text {
  opacity: 0;
  transform: translateY(20px);
  animation: slide-up-fade 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 3.4s forwards;
  font-weight: 500;
  letter-spacing: 0.5px;
}

@keyframes slide-up-fade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>