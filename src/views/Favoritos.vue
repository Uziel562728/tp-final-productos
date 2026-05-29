<template>
  <div class="container mt-4">
    <h1 class="mb-4">Mis favoritos</h1>

    <div v-if="favoritos.length === 0" class="alert alert-info">
      Todavía no agregaste productos a favoritos.
    </div>

    <div v-else>
      <div class="row">
        <div
          v-for="producto in favoritos"
          :key="producto.id"
          class="col-md-4 mb-4"
        >
          <div class="card shadow border-0 h-100">
            <div class="card-body">
              <h5 class="card-title">{{ producto.nombre }}</h5>

              <p class="card-text">
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

              <RouterLink
                :to="`/productos/${producto.id}`"
                class="btn btn-primary me-2"
              >
                Ver detalle
              </RouterLink>

              <button
                class="btn btn-danger"
                @click="quitarFavorito(producto.id)"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { obtenerFavoritos, eliminarFavorito } from '../services/favoritosService'

const favoritos = ref([])

const cargarFavoritos = () => {
  favoritos.value = obtenerFavoritos()
}

const quitarFavorito = (id) => {
  eliminarFavorito(id)
  cargarFavoritos()
}

onMounted(() => {
  cargarFavoritos()
})
</script>