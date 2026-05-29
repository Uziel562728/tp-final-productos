<template>
  <div class="container mt-4">
    <h1 class="mb-4">Carrito</h1>

    <div v-if="carrito.length === 0" class="alert alert-info">
      El carrito está vacío.
    </div>

    <div v-else>
      <table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="producto in carrito" :key="producto.id">
            <td>{{ producto.nombre }}</td>
            <td>${{ producto.precio }}</td>
            <td>{{ producto.cantidad }}</td>
            <td>${{ producto.precio * producto.cantidad }}</td>
            <td>
              <button
                class="btn btn-danger btn-sm"
                @click="quitarDelCarrito(producto.id)"
              >
                Quitar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="card shadow border-0 p-4 mt-4">
        <h3>Total: ${{ totalCarrito }}</h3>

        <button class="btn btn-warning mt-2" @click="vaciar">
          Vaciar carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  obtenerCarrito,
  eliminarDelCarrito,
  vaciarCarrito
} from '../services/carritoService'

const carrito = ref([])

const cargarCarrito = () => {
  carrito.value = obtenerCarrito()
}

const totalCarrito = computed(() => {
  return carrito.value.reduce((total, producto) => {
    return total + Number(producto.precio) * Number(producto.cantidad)
  }, 0)
})

const quitarDelCarrito = (id) => {
  eliminarDelCarrito(id)
  cargarCarrito()
}

const vaciar = () => {
  vaciarCarrito()
  cargarCarrito()
}

onMounted(() => {
  cargarCarrito()
})
</script>