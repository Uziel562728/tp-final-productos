<template>
  <table class="table table-striped table-bordered">
    <thead class="table-dark">
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Precio</th>
        <th>Stock</th>
        <th>Categoría</th>
        <th>Ver</th>
        <th v-if="esAdmin">Acciones</th>
        <th v-else>Usuario</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="producto in productos" :key="producto.id">
        <td>{{ producto.id }}</td>
        <td>{{ producto.nombre }}</td>
        <td>{{ producto.descripcion }}</td>
        <td>${{ producto.precio }}</td>
        <td>{{ producto.stock }}</td>
        <td>{{ producto.categoria }}</td>

        <td>
          <RouterLink
            :to="`/productos/${producto.id}`"
            class="btn btn-info btn-sm"
          >
            Detalle
          </RouterLink>
        </td>

        <td v-if="esAdmin">
          <button class="btn btn-warning btn-sm me-2" @click="$emit('editar', producto)">
            Editar
          </button>

          <button class="btn btn-danger btn-sm" @click="$emit('eliminar', producto.id)">
            Eliminar
          </button>
        </td>

        <td v-else>
          <button class="btn btn-outline-danger btn-sm me-2" @click="agregarAFavoritos(producto)">
            Favorito
          </button>

          <button class="btn btn-primary btn-sm" @click="agregarProductoAlCarrito(producto)">
            Carrito
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { agregarFavorito } from '../services/favoritosService'
import { agregarAlCarrito } from '../services/carritoService'

defineProps({
  productos: Array,
  esAdmin: Boolean
})

defineEmits(['editar', 'eliminar'])

const agregarAFavoritos = (producto) => {
  agregarFavorito(producto)
  alert('Producto agregado a favoritos')
}

const agregarProductoAlCarrito = (producto) => {
  agregarAlCarrito(producto)
  alert('Producto agregado al carrito')
}
</script>