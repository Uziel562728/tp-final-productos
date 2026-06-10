<template>
  <div class="container mt-4">
    <h1 class="mb-4">Carrito</h1>

    <div v-if="carrito.length === 0" class="alert alert-info">
      El carrito está vacío.
    </div>

    <div v-else>
      <!-- Desktop Table View -->
      <div class="d-none d-md-block table-responsive">
        <table class="table table-striped table-bordered align-middle">
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
              <td>
                <div class="d-flex align-items-center gap-2">
                  <button
                    class="btn btn-outline-secondary btn-sm px-2 py-0 fw-bold"
                    @click="decrementarCantidad(producto)"
                    title="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    class="form-control form-control-sm text-center fw-bold"
                    style="width: 65px; height: 28px; padding: 2px;"
                    :value="producto.cantidad"
                    @change="modificarCantidadInput($event, producto)"
                    min="0"
                    :max="producto.stock"
                    title="Modificar cantidad"
                  />
                  <button
                    class="btn btn-outline-secondary btn-sm px-2 py-0 fw-bold"
                    @click="incrementarCantidad(producto)"
                    :disabled="producto.cantidad >= producto.stock"
                    title="Incrementar cantidad"
                  >
                    +
                  </button>
                </div>
              </td>
              <td>${{ producto.precio * producto.cantidad }}</td>
              <td>
                <button
                  class="btn btn-danger btn-sm px-3 py-2"
                  @click="quitarDelCarrito(producto.id)"
                >
                  Quitar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="d-block d-md-none">
        <div v-for="producto in carrito" :key="producto.id" class="card shadow-sm mb-3 border-1">
          <div class="card-body text-start">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="card-title mb-0 fw-bold">{{ producto.nombre }}</h5>
              <button
                class="btn btn-danger btn-sm px-3 py-2"
                style="min-height: 44px; display: inline-flex; align-items: center;"
                @click="quitarDelCarrito(producto.id)"
              >
                Quitar
              </button>
            </div>
            
            <div class="row g-2 mb-3">
              <div class="col-6">
                <span class="text-muted small d-block">Precio unitario</span>
                <span class="fw-semibold">${{ producto.precio }}</span>
              </div>
              <div class="col-6 text-end">
                <span class="text-muted small d-block">Subtotal</span>
                <span class="fw-bold text-success">${{ producto.precio * producto.cantidad }}</span>
              </div>
            </div>

            <div class="pt-2 border-top">
              <label class="form-label small text-muted mb-2">Cantidad:</label>
              <div class="d-flex align-items-center gap-2">
                <button
                  class="btn btn-outline-secondary btn-lg px-3 py-2 fw-bold d-flex align-items-center justify-content-center"
                  style="min-height: 44px; min-width: 44px;"
                  @click="decrementarCantidad(producto)"
                  title="Disminuir cantidad"
                >
                  -
                </button>
                <input
                  type="number"
                  class="form-control form-control-lg text-center fw-bold"
                  style="width: 80px; height: 44px; padding: 5px;"
                  :value="producto.cantidad"
                  @change="modificarCantidadInput($event, producto)"
                  min="0"
                  :max="producto.stock"
                  title="Modificar cantidad"
                />
                <button
                  class="btn btn-outline-secondary btn-lg px-3 py-2 fw-bold d-flex align-items-center justify-content-center"
                  style="min-height: 44px; min-width: 44px;"
                  @click="incrementarCantidad(producto)"
                  :disabled="producto.cantidad >= producto.stock"
                  title="Incrementar cantidad"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow border-0 p-4 mt-4">
        <h3>Total: ${{ totalCarrito }}</h3>

        <div class="d-flex flex-wrap gap-2 mt-3">
          <button
            class="btn btn-success flex-grow-1 py-2 px-3"
            style="min-height: 44px;"
            :disabled="confirmando"
            @click="confirmarPeticion"
          >
            {{ confirmando ? 'Confirmando...' : 'Confirmar petición' }}
          </button>

          <button
            class="btn btn-warning flex-grow-1 py-2 px-3"
            style="min-height: 44px;"
            :disabled="confirmando"
            @click="vaciar"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  obtenerCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
  guardarCarrito
} from '../services/carritoService'
import { obtenerUsuario } from '../services/authService'
import { crearPeticion } from '../services/peticionesService'
import { obtenerProductoPorId, obtenerStockDisponible } from '../services/productoService'
import { mostrarAlerta } from '../services/alertService'

const carrito = ref([])
const confirmando = ref(false)

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

const modificarCantidad = async (item, nuevaCantidad) => {
  let cantidadDestino = parseInt(nuevaCantidad)
  
  if (isNaN(cantidadDestino)) {
    cargarCarrito()
    return
  }

  if (cantidadDestino <= 0) {
    const confirmacion = confirm(`¿Desea quitar "${item.nombre}" del carrito?`)
    if (confirmacion) {
      quitarDelCarrito(item.id)
    } else {
      cargarCarrito()
    }
    return
  }

  try {
    // Consultar stock disponible real (restando pedidos pendientes)
    const stockDisponible = await obtenerStockDisponible(item.id)

    if (cantidadDestino > stockDisponible) {
      mostrarAlerta(
        'Límite de stock',
        `No puedes tener más de ${stockDisponible} unidades de ${item.nombre} (stock disponible actual restando pendientes: ${stockDisponible}).`,
        'warning'
      )
      item.cantidad = stockDisponible
      item.stock = stockDisponible
    } else {
      item.cantidad = cantidadDestino
      item.stock = stockDisponible
    }
    guardarCarrito(carrito.value)
  } catch (error) {
    console.error('Error al validar stock en vivo:', error)
    // Fallback con el stock guardado localmente
    const stockLocal = Number(item.stock) || 9999
    if (cantidadDestino > stockLocal) {
      mostrarAlerta(
        'Límite de stock',
        `No puedes tener más de ${stockLocal} unidades de ${item.nombre}.`,
        'warning'
      )
      item.cantidad = stockLocal
    } else {
      item.cantidad = cantidadDestino
    }
    guardarCarrito(carrito.value)
  }
}

const incrementarCantidad = (item) => {
  modificarCantidad(item, item.cantidad + 1)
}

const decrementarCantidad = (item) => {
  modificarCantidad(item, item.cantidad - 1)
}

const modificarCantidadInput = (event, item) => {
  modificarCantidad(item, event.target.value)
}

const confirmarPeticion = async () => {
  const usuario = obtenerUsuario()
  if (!usuario) {
    mostrarAlerta('Inicio de sesión', 'Debe iniciar sesión para confirmar la petición.', 'warning')
    return
  }

  if (carrito.value.length === 0) {
    mostrarAlerta('Carrito vacío', 'El carrito está vacío.', 'info')
    return
  }

  confirmando.value = true
  try {
    // 1. Validar el stock de cada producto en el carrito antes de proceder.
    for (const item of carrito.value) {
      const stockDisponible = await obtenerStockDisponible(item.id)
      if (Number(item.cantidad) > stockDisponible) {
        mostrarAlerta(
          'Falta de stock',
          `No es posible realizar el pedido para ${item.nombre}. Stock disponible real (restando pendientes): ${stockDisponible}, solicitado: ${item.cantidad}.`,
          'danger'
        )
        confirmando.value = false
        return
      }
    }

    // 2. Crear una única petición agrupada con todos los productos.
    const productosPeticion = carrito.value.map(producto => ({
      productoId: producto.id,
      productoNombre: producto.nombre,
      productoDescripcion: producto.descripcion || '',
      precio: Number(producto.precio),
      cantidad: Number(producto.cantidad),
      subtotal: Number(producto.precio) * Number(producto.cantidad)
    }))

    const peticionUnica = {
      usuarioEmail: usuario.email,
      usuarioNombre: usuario.nombre,
      estado: 'Pendiente',
      fecha: new Date().toLocaleString(),
      total: totalCarrito.value,
      productos: productosPeticion
    }

    await crearPeticion(peticionUnica)
    vaciar()
    mostrarAlerta('Éxito', 'Petición de compra confirmada con éxito.', 'success')
  } catch (error) {
    console.error(error)
    mostrarAlerta('Error', 'Ocurrió un error al confirmar la petición. Intente nuevamente.', 'danger')
  } finally {
    confirmando.value = false
  }
}

onMounted(() => {
  cargarCarrito()
})
</script>