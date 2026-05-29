<template>
  <div class="container mt-4">
    <h1 class="mb-4">Asistente IA</h1>

    <div class="card shadow p-4 mb-4">
      <h4>Consultá sobre tus productos</h4>

      <textarea
        v-model="pregunta"
        class="form-control mb-3"
        rows="3"
        placeholder="Ejemplo: ¿Qué productos tienen poco stock?"
      ></textarea>

      <button
        class="btn btn-primary"
        @click="consultarIA"
        :disabled="cargando"
      >
        {{ cargando ? 'Consultando...' : 'Consultar IA' }}
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-if="respuesta" class="alert alert-info">
      <strong>Respuesta IA:</strong>
      <p class="mb-0 mt-2">{{ respuesta }}</p>
    </div>

    <div class="card shadow p-4 mt-4">
      <h4>Preguntas rápidas</h4>

      <div class="d-flex flex-wrap gap-2 mt-2">
        <button class="btn btn-outline-primary" @click="preguntaRapida('Dame un resumen de los productos')">
          Resumen
        </button>

        <button class="btn btn-outline-danger" @click="preguntaRapida('¿Qué productos tienen poco stock?')">
          Bajo stock
        </button>

        <button class="btn btn-outline-warning" @click="preguntaRapida('¿Qué productos son los más caros?')">
          Productos caros
        </button>

        <button class="btn btn-outline-success" @click="preguntaRapida('¿Qué recomendaciones me das para mejorar las ventas?')">
          Mejorar ventas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { consultarVectorShift } from '../services/vectorShiftService'

const pregunta = ref('')
const respuesta = ref('')
const error = ref('')
const cargando = ref(false)

const consultarIA = async () => {
  try {
    error.value = ''
    respuesta.value = ''
    cargando.value = true

    const datos = await consultarVectorShift(pregunta.value)

    console.log(datos)

    respuesta.value =
      datos.output_0 ||
      datos.outputs?.output_0 ||
      datos.response ||
      'No se recibió una respuesta válida.'
  } catch (e) {
    console.log(e)
    error.value = 'Ocurrió un error al consultar VectorShift.'
  } finally {
    cargando.value = false
  }
}

const preguntaRapida = (texto) => {
  pregunta.value = texto
  consultarIA()
}
</script>