<template>
  <div class="container mt-4">
    <RouterLink to="/productos" class="btn btn-secondary mb-4">
      Volver a productos
    </RouterLink>

    <div v-if="cargando" class="alert alert-info">
      Cargando producto...
    </div>

    <div v-else class="card shadow border-0 p-4">
      <h1 class="mb-3">{{ producto.nombre }}</h1>

      <p>
        <strong>Descripción:</strong>
        {{ producto.descripcion }}
      </p>

      <p>
        <strong>Precio:</strong>
        ${{ producto.precio }}
      </p>

      <p>
        <strong>Stock:</strong>
        {{ producto.stock }}
      </p>

      <p>
        <strong>Categoría:</strong>
        {{ producto.categoria }}
      </p>

      <div v-if="!esAdmin" class="mt-3">
        <button class="btn btn-outline-danger me-2" @click="agregarAFavoritos">
          Agregar a favoritos
        </button>

        <button class="btn btn-primary" @click="agregarProductoAlCarrito">
          Agregar al carrito
        </button>
      </div>

      <div v-if="mensaje" class="alert alert-success mt-3">
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { obtenerProductoPorId } from '../services/productoService'
import { agregarFavorito } from '../services/favoritosService'
import { agregarAlCarrito } from '../services/carritoService'
import { obtenerUsuarioReactivo } from '../services/authService'

const route = useRoute()

const producto = ref({})
const cargando = ref(true)
const mensaje = ref('')

const usuarioReactivo = obtenerUsuarioReactivo()

const esAdmin = computed(() => {
  return usuarioReactivo.value && usuarioReactivo.value.rol === 'admin'
})

const cargarProducto = async () => {
  try {
    producto.value = await obtenerProductoPorId(route.params.id)
  } catch (error) {
    console.log(error)
  } finally {
    cargando.value = false
  }
}

const agregarAFavoritos = () => {
  agregarFavorito(producto.value)
  mensaje.value = 'Producto agregado a favoritos'
}

const agregarProductoAlCarrito = () => {
  agregarAlCarrito(producto.value)
  mensaje.value = 'Producto agregado al carrito'
}

onMounted(() => {
  cargarProducto()
})
</script>