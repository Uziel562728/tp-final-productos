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

      <p class="fs-5">
        <strong>Descripción:</strong>
        {{ producto.descripcion }}
      </p>

      <p class="fs-5">
        <strong>Precio:</strong>
        <span class="text-success fw-bold">${{ producto.precio }}</span>
      </p>

      <p class="fs-5">
        <strong>Stock:</strong>
        <span :class="Number(producto.stock) <= 5 ? 'text-danger fw-bold' : ''">{{ producto.stock }}</span>
      </p>

      <p class="fs-5">
        <strong>Categoría:</strong>
        <span class="badge bg-secondary">{{ producto.categoria }}</span>
      </p>

      <div v-if="!esAdmin" class="mt-4">
        <!-- Ocultar si ya está en favoritos -->
        <button
          v-if="!estaEnFavoritos"
          class="btn btn-outline-danger me-2"
          @click="agregarAFavoritos"
        >
          Agregar a favoritos
        </button>

        <button class="btn btn-primary" @click="agregarProductoAlCarrito">
          Agregar al carrito
        </button>
      </div>
    </div>

    <!-- Modal para Seleccionar Cantidad al Agregar al Carrito -->
    <SelectorCantidadModal
      :visible="modalCantidadVisible"
      :producto="producto"
      @confirmar="confirmarAgregarAlCarrito"
      @cerrar="cerrarSelectorCantidad"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { obtenerProductoPorId } from '../services/productoService'
import { agregarFavorito, obtenerFavoritos } from '../services/favoritosService'
import { agregarAlCarrito } from '../services/carritoService'
import { obtenerUsuarioReactivo } from '../services/authService'
import { mostrarAlerta } from '../services/alertService'
import SelectorCantidadModal from '../components/SelectorCantidadModal.vue'

const route = useRoute()

const producto = ref({})
const cargando = ref(true)
const modalCantidadVisible = ref(false)

// Lista reactiva de IDs favoritos
const favoritoIds = ref([])

const usuarioReactivo = obtenerUsuarioReactivo()

const cargarFavoritoIds = () => {
  favoritoIds.value = obtenerFavoritos().map(f => f.id)
}

const estaEnFavoritos = computed(() => {
  return producto.value && favoritoIds.value.map(String).includes(String(producto.value.id))
})

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
  mostrarAlerta('Favoritos', 'Producto agregado a favoritos', 'success')
  cargarFavoritoIds()
}

const agregarProductoAlCarrito = () => {
  modalCantidadVisible.value = true
}

const confirmarAgregarAlCarrito = (cantidad) => {
  agregarAlCarrito(producto.value, cantidad)
  mostrarAlerta('Carrito', `Agregaste al carrito ${cantidad} de ${producto.value.nombre}`, 'success')
  modalCantidadVisible.value = false
}

const cerrarSelectorCantidad = () => {
  modalCantidadVisible.value = false
}

onMounted(() => {
  cargarProducto()
  cargarFavoritoIds()
})
</script>