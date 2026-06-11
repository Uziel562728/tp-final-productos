<template>
  <div>
    <!-- Desktop Table View -->
    <div class="d-none d-md-block table-responsive">
      <table class="table table-striped table-bordered align-middle">
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
                class="btn btn-info btn-sm text-white px-3 py-2"
              >
                Detalle
              </RouterLink>
            </td>

            <td v-if="esAdmin">
              <button class="btn btn-warning btn-sm me-2 px-3 py-2" @click="$emit('editar', producto)">
                Editar
              </button>

              <button class="btn btn-danger btn-sm px-3 py-2" @click="$emit('eliminar', producto.id)">
                Eliminar
              </button>
            </td>

            <td v-else>
              <button
                class="btn btn-sm me-2 transition-all px-3 py-2"
                :class="esFavorito(producto.id) ? (hoveredFavId === producto.id ? 'btn-dark' : 'btn-outline-danger') : (hoveredFavId === producto.id ? 'btn-danger text-white' : 'btn-outline-secondary')"
                style="min-width: 120px;"
                @mouseenter="hoveredFavId = producto.id"
                @mouseleave="hoveredFavId = null"
                @click="toggleFavorito(producto)"
              >
                {{ obtenerTextoFavorito(producto) }}
              </button>

              <button class="btn btn-primary btn-sm px-3 py-2" @click="agregarProductoAlCarrito(producto)">
                Agregar al carrito
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="d-block d-md-none">
      <div v-for="producto in productos" :key="producto.id" class="card shadow-sm mb-3 border-1 product-mobile-card">
        <div class="card-body text-start">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0 fw-bold">{{ producto.nombre }}</h5>
            <span class="badge bg-secondary">{{ producto.categoria }}</span>
          </div>
          
          <p class="card-text text-muted mb-2 small">{{ producto.descripcion }}</p>
          
          <div class="row g-2 mb-3">
            <div class="col-6">
              <div class="p-2 bg-light rounded text-center dark-bg-adjust">
                <span class="d-block text-muted small">Precio</span>
                <strong class="text-success">${{ producto.precio }}</strong>
              </div>
            </div>
            <div class="col-6">
              <div class="p-2 bg-light rounded text-center dark-bg-adjust">
                <span class="d-block text-muted small">Stock</span>
                <strong :class="Number(producto.stock) <= 5 ? 'text-danger' : 'text-dark-custom'">
                  {{ producto.stock }}
                </strong>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column gap-2">
            <RouterLink 
              :to="`/productos/${producto.id}`" 
              class="btn btn-info w-100 py-2 text-white d-flex align-items-center justify-content-center"
              style="min-height: 44px;"
            >
              👁️ Ver Detalle
            </RouterLink>
            
            <div v-if="esAdmin" class="d-flex gap-2">
              <button 
                class="btn btn-warning flex-grow-1 py-2 d-flex align-items-center justify-content-center" 
                style="min-height: 44px;" 
                @click="$emit('editar', producto)"
              >
                ✏️ Editar
              </button>
              <button 
                class="btn btn-danger flex-grow-1 py-2 d-flex align-items-center justify-content-center" 
                style="min-height: 44px;" 
                @click="$emit('eliminar', producto.id)"
              >
                🗑️ Eliminar
              </button>
            </div>
            
            <div v-else class="d-flex flex-column gap-2">
              <button
                class="btn w-100 py-2 d-flex align-items-center justify-content-center"
                style="min-height: 44px;"
                :class="esFavorito(producto.id) ? 'btn-danger' : 'btn-outline-danger'"
                @click="toggleFavorito(producto)"
              >
                ❤️ {{ esFavorito(producto.id) ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
              </button>
              
              <button 
                class="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center" 
                style="min-height: 44px;" 
                @click="agregarProductoAlCarrito(producto)"
              >
                🛒 Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
    return hoveredFavId.value === producto.id ? '💔 Quitar' : '❤️ Favorito'
  }
  return '🤍 Favorito'
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