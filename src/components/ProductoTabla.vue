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
          <button
            class="btn btn-sm me-2 transition-all"
            :class="esFavorito(producto.id) ? (hoveredFavId === producto.id ? 'btn-outline-danger' : 'btn-danger') : 'btn-outline-danger'"
            @mouseenter="hoveredFavId = producto.id"
            @mouseleave="hoveredFavId = null"
            @click="toggleFavorito(producto)"
          >
            {{ obtenerTextoFavorito(producto) }}
          </button>

          <button class="btn btn-primary btn-sm" @click="agregarProductoAlCarrito(producto)">
            Agregar al carrito
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { agregarFavorito, eliminarFavorito } from '../services/favoritosService'
import { mostrarAlerta } from '../services/alertService'

const props = defineProps({
  productos: Array,
  esAdmin: Boolean,
  favoritoIds: Array
})

const emit = defineEmits(['editar', 'eliminar', 'agregar-carrito', 'favorito-toggled'])

const hoveredFavId = ref(null)

const esFavorito = (id) => {
  return props.favoritoIds && props.favoritoIds.includes(id)
}

const obtenerTextoFavorito = (producto) => {
  if (esFavorito(producto.id)) {
    return hoveredFavId.value === producto.id ? 'Quitar de favoritos' : 'En favoritos'
  }
  return 'Favorito'
}

const toggleFavorito = (producto) => {
  if (esFavorito(producto.id)) {
    eliminarFavorito(producto.id)
    mostrarAlerta('Favoritos', 'Producto quitado de favoritos', 'success')
  } else {
    agregarFavorito(producto)
    mostrarAlerta('Favoritos', 'Producto agregado a favoritos', 'success')
  }
  emit('favorito-toggled')
}

const agregarProductoAlCarrito = (producto) => {
  emit('agregar-carrito', producto)
}
</script>