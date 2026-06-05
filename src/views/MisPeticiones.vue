<template>
  <div class="container mt-4">
    <h1 class="mb-4">Mis Pedidos</h1>

    <div v-if="cargando" class="alert alert-info">
      Cargando tus pedidos...
    </div>

    <div v-else>
      <!-- Resumen de Pedidos -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Total pedidos</h6>
            <h3 class="text-primary">{{ misPeticiones.length }}</h3>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Pendientes de aprobación</h6>
            <h3 class="text-warning">{{ peticionesPendientes.length }}</h3>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Finalizados (Cumplidos/Rechazados)</h6>
            <h3 class="text-success">{{ peticionesFinalizadas.length }}</h3>
          </div>
        </div>
      </div>

      <div v-if="misPeticiones.length === 0" class="alert alert-info text-center py-4">
        <h4>No has realizado ningún pedido aún</h4>
        <p class="text-muted">¡Agrega productos al carrito y confirma una petición de compra para verla aquí!</p>
        <RouterLink to="/productos" class="btn btn-primary mt-2">
          Ver Productos
        </RouterLink>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-striped table-bordered mt-3">
          <thead class="table-dark">
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Cant. Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="peticion in misPeticiones" :key="peticion.id">
              <td>#{{ peticion.id }}</td>
              <td>{{ peticion.fecha }}</td>
              <td>{{ calcularCantidadTotal(peticion) }}</td>
              <td>${{ peticion.total }}</td>
              <td>
                <span :class="obtenerBadgeClase(peticion.estado)">
                  {{ peticion.estado }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-info btn-sm text-white"
                  @click="verDetalle(peticion)"
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalle de Pedido -->
    <Transition name="fade-scale">
      <div v-if="modalDetalleVisible" class="custom-modal-overlay" @click.self="cerrarModalDetalle">
        <div class="custom-modal-card animate-card" style="max-width: 650px; width: 95%;">
          <div class="custom-modal-header bg-dark text-white">
            <h5 class="m-0">Detalle de Pedido #{{ peticionSeleccionada.id }}</h5>
            <button class="btn-close-custom text-white" @click="cerrarModalDetalle">&times;</button>
          </div>
          <div class="custom-modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <p><strong>Fecha del pedido:</strong> {{ peticionSeleccionada.fecha }}</p>
              </div>
              <div class="col-md-6 text-md-end">
                <p>
                  <strong>Estado:</strong> 
                  <span :class="obtenerBadgeClase(peticionSeleccionada.estado)">
                    {{ peticionSeleccionada.estado }}
                  </span>
                </p>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-striped table-bordered">
                <thead class="table-dark">
                  <tr>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prod in peticionSeleccionada.productos" :key="prod.productoId">
                    <td>{{ prod.productoNombre }}</td>
                    <td>{{ prod.productoDescripcion }}</td>
                    <td>${{ prod.precio }}</td>
                    <td>{{ prod.cantidad }}</td>
                    <td>${{ prod.subtotal }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 class="text-end mt-3">Total del Pedido: ${{ peticionSeleccionada.total }}</h4>
          </div>
          <div class="custom-modal-footer">
            <button class="btn btn-secondary btn-sm" @click="cerrarModalDetalle">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { obtenerPeticiones } from '../services/peticionesService'
import { obtenerUsuario } from '../services/authService'

const peticiones = ref([])
const cargando = ref(true)
const usuario = obtenerUsuario()

// Modal de Detalle
const modalDetalleVisible = ref(false)
const peticionSeleccionada = ref(null)

const cargarPeticiones = async () => {
  try {
    const todasLasPeticiones = await obtenerPeticiones()
    // Filtrar únicamente las peticiones que pertenezcan al usuario logueado
    peticiones.value = todasLasPeticiones.filter(p => p.usuarioEmail === usuario?.email)
  } catch (error) {
    console.error('Error al cargar mis pedidos:', error)
  } finally {
    cargando.value = false
  }
}

const misPeticiones = computed(() => {
  return peticiones.value
})

const peticionesPendientes = computed(() => {
  return peticiones.value.filter(p => p.estado === 'Pendiente')
})

const peticionesFinalizadas = computed(() => {
  return peticiones.value.filter(p => p.estado === 'Cumplida' || p.estado === 'Rechazada')
})

const calcularCantidadTotal = (peticion) => {
  if (!peticion.productos || !Array.isArray(peticion.productos)) return 0
  return peticion.productos.reduce((suma, p) => suma + Number(p.cantidad), 0)
}

const obtenerBadgeClase = (estado) => {
  switch (estado) {
    case 'Pendiente':
      return 'badge bg-warning text-dark'
    case 'Cumplida':
      return 'badge bg-success'
    case 'Rechazada':
      return 'badge bg-danger'
    default:
      return 'badge bg-secondary'
  }
}

const verDetalle = (peticion) => {
  peticionSeleccionada.value = peticion
  modalDetalleVisible.value = true
}

const cerrarModalDetalle = () => {
  modalDetalleVisible.value = false
  peticionSeleccionada.value = null
}



onMounted(() => {
  if (usuario) {
    cargarPeticiones()
  }
})
</script>
