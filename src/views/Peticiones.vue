<template>
  <div class="container mt-4">
    <h1 class="mb-4">Peticiones de Compra</h1>

    <div v-if="cargando" class="alert alert-info">
      Cargando peticiones...
    </div>

    <div v-else>
      <!-- Resumen de Peticiones -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Total peticiones</h6>
            <h3 class="text-primary">{{ peticiones.length }}</h3>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Pendientes</h6>
            <h3 class="text-warning">{{ peticionesPendientes.length }}</h3>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Cumplidas</h6>
            <h3 class="text-success">{{ peticionesCumplidas.length }}</h3>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Rechazadas</h6>
            <h3 class="text-danger">{{ peticionesRechazadas.length }}</h3>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card shadow border-0 p-4 mb-4">
        <h4 class="mb-3">Filtros</h4>
        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Filtrar por estado</label>
            <select v-model="filtroEstado" class="form-select">
              <option value="Todas">Todas</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Cumplida">Cumplidas</option>
              <option value="Rechazada">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="peticionesFiltradas.length === 0" class="alert alert-warning text-center">
        No se encontraron peticiones con el estado seleccionado.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-striped table-bordered mt-3">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Cant. Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="peticion in peticionesFiltradas" :key="peticion.id">
              <td>{{ peticion.id }}</td>
              <td>{{ peticion.usuarioNombre }}</td>
              <td>{{ peticion.usuarioEmail }}</td>
              <td>{{ calcularCantidadTotal(peticion) }}</td>
              <td>${{ peticion.total }}</td>
              <td>
                <span :class="obtenerBadgeClase(peticion.estado)">
                  {{ peticion.estado }}
                </span>
              </td>
              <td>{{ peticion.fecha }}</td>
              <td>
                <div class="d-flex gap-2">
                  <button
                    class="btn btn-info btn-sm text-white"
                    @click="verDetalle(peticion)"
                  >
                    Ver Detalle
                  </button>

                  <button
                    v-if="peticion.estado === 'Pendiente'"
                    class="btn btn-success btn-sm"
                    :disabled="procesando[peticion.id]"
                    @click="cumplirPeticion(peticion)"
                  >
                    Cumplir
                  </button>

                  <button
                    v-if="peticion.estado === 'Pendiente'"
                    class="btn btn-danger btn-sm"
                    :disabled="procesando[peticion.id]"
                    @click="rechazarPeticion(peticion)"
                  >
                    Rechazar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalle de Petición -->
    <Transition name="fade-scale">
      <div v-if="modalDetalleVisible" class="custom-modal-overlay" @click.self="cerrarModalDetalle">
        <div class="custom-modal-card animate-card" style="max-width: 700px; width: 95%;">
          <div class="custom-modal-header bg-dark text-white">
            <h5 class="m-0">Detalle de Petición #{{ peticionSeleccionada.id }}</h5>
            <button class="btn-close-custom text-white" @click="cerrarModalDetalle">&times;</button>
          </div>
          <div class="custom-modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <p><strong>Usuario:</strong> {{ peticionSeleccionada.usuarioNombre }}</p>
                <p><strong>Email:</strong> {{ peticionSeleccionada.usuarioEmail }}</p>
              </div>
              <div class="col-md-6 text-md-end">
                <p><strong>Fecha:</strong> {{ peticionSeleccionada.fecha }}</p>
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

            <h4 class="text-end mt-3">Total: ${{ peticionSeleccionada.total }}</h4>
          </div>
          <div class="custom-modal-footer">
            <div v-if="peticionSeleccionada.estado === 'Pendiente'" class="d-flex gap-2 me-auto">
              <button
                class="btn btn-success btn-sm"
                :disabled="procesando[peticionSeleccionada.id]"
                @click="cumplirPeticion(peticionSeleccionada)"
              >
                Cumplir
              </button>
              <button
                class="btn btn-danger btn-sm"
                :disabled="procesando[peticionSeleccionada.id]"
                @click="rechazarPeticion(peticionSeleccionada)"
              >
                Rechazar
              </button>
            </div>
            <button class="btn btn-secondary btn-sm" @click="cerrarModalDetalle">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerPeticiones, actualizarPeticion } from '../services/peticionesService'
import { obtenerProductoPorId, editarProducto } from '../services/productoService'
import { mostrarAlerta } from '../services/alertService'

const peticiones = ref([])
const cargando = ref(true)
const filtroEstado = ref('Todas')
const procesando = ref({})

// Modal Detalle
const modalDetalleVisible = ref(false)
const peticionSeleccionada = ref(null)

const cargarPeticiones = async () => {
  try {
    peticiones.value = await obtenerPeticiones()
  } catch (error) {
    console.error('Error al cargar peticiones:', error)
  } finally {
    cargando.value = false
  }
}

const peticionesPendientes = computed(() => {
  return peticiones.value.filter(p => p.estado === 'Pendiente')
})

const peticionesCumplidas = computed(() => {
  return peticiones.value.filter(p => p.estado === 'Cumplida')
})

const peticionesRechazadas = computed(() => {
  return peticiones.value.filter(p => p.estado === 'Rechazada')
})

const peticionesFiltradas = computed(() => {
  if (filtroEstado.value === 'Todas') {
    return peticiones.value
  }
  return peticiones.value.filter(p => p.estado === filtroEstado.value)
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

const cumplirPeticion = async (peticion) => {
  procesando.value[peticion.id] = true
  try {
    // 1. Obtener y verificar stock de TODOS los productos en la petición
    const productosActualizados = []
    
    for (const item of peticion.productos) {
      const producto = await obtenerProductoPorId(item.productoId)
      if (!producto) {
        mostrarAlerta('Error', `El producto "${item.productoNombre}" ya no existe en el sistema.`, 'danger')
        procesando.value[peticion.id] = false
        return
      }
      
      if (Number(producto.stock) < Number(item.cantidad)) {
        mostrarAlerta('No hay stock suficiente', `No hay stock suficiente para cumplir el pedido de ${item.productoNombre}. Stock disponible: ${producto.stock}, solicitado: ${item.cantidad}.`, 'danger')
        procesando.value[peticion.id] = false
        return
      }
      
      productosActualizados.push({
        id: producto.id,
        datos: {
          ...producto,
          stock: Number(producto.stock) - Number(item.cantidad)
        }
      })
    }

    // 2. Si todos tienen stock suficiente, procedemos a descontar
    for (const prod of productosActualizados) {
      await editarProducto(prod.id, prod.datos)
    }

    // 3. Actualizar la petición con estado "Cumplida"
    const peticionActualizada = {
      ...peticion,
      estado: 'Cumplida'
    }
    await actualizarPeticion(peticion.id, peticionActualizada)

    // 4. Actualizar tabla en pantalla y sincronizar modal
    peticiones.value = peticiones.value.map(p =>
      p.id === peticion.id ? peticionActualizada : p
    )
    
    if (peticionSeleccionada.value && peticionSeleccionada.value.id === peticion.id) {
      peticionSeleccionada.value = peticionActualizada
    }

    mostrarAlerta('Éxito', 'Petición cumplida con éxito. El stock ha sido descontado.', 'success')
  } catch (error) {
    console.error('Error al cumplir petición:', error)
    mostrarAlerta('Error', 'Ocurrió un error al cumplir la petición.', 'danger')
  } finally {
    procesando.value[peticion.id] = false
  }
}

const rechazarPeticion = async (peticion) => {
  procesando.value[peticion.id] = true
  try {
    // 1. Actualizar petición en API con estado Rechazada
    const peticionActualizada = {
      ...peticion,
      estado: 'Rechazada'
    }
    await actualizarPeticion(peticion.id, peticionActualizada)

    // 2. Actualizar tabla en pantalla y sincronizar modal
    peticiones.value = peticiones.value.map(p =>
      p.id === peticion.id ? peticionActualizada : p
    )

    if (peticionSeleccionada.value && peticionSeleccionada.value.id === peticion.id) {
      peticionSeleccionada.value = peticionActualizada
    }

    mostrarAlerta('Éxito', 'Petición rechazada con éxito.', 'success')
  } catch (error) {
    console.error('Error al rechazar petición:', error)
    mostrarAlerta('Error', 'Ocurrió un error al rechazar la petición.', 'danger')
  } finally {
    procesando.value[peticion.id] = false
  }
}

onMounted(() => {
  cargarPeticiones()
})
</script>
