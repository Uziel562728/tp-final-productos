<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow p-4">
          <h2 class="text-center mb-4">Iniciar sesión</h2>

          <form @submit.prevent="iniciarSesion">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                placeholder="Ingrese su email"
                required
              >
            </div>

            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <div class="input-group">
                <input
                  v-model="password"
                  :type="mostrarPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Ingrese su contraseña"
                  required
                >
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="toggleMostrarPassword"
                >
                  {{ mostrarPassword ? '🙈 Ocultar' : '👁️ Mostrar' }}
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100">
              Entrar
            </button>
          </form>

          <div v-if="error" class="alert alert-danger mt-3">
            Email o contraseña incorrectos
          </div>

          <div class="alert alert-info mt-4">
            <p class="mb-1"><strong>Admin:</strong> admin@admin.com / 1234</p>
            <p class="mb-0"><strong>Usuario:</strong> usuario@usuario.com / 1234</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/authService'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(false)
const mostrarPassword = ref(false)

const toggleMostrarPassword = () => {
  mostrarPassword.value = !mostrarPassword.value
}

const iniciarSesion = () => {
  const pudoEntrar = login(email.value, password.value)

  if (pudoEntrar) {
    router.push('/home')
  } else {
    error.value = true
  }
}
</script>