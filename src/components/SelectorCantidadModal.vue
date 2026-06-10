<template>
  <Transition name="fade-scale">
    <div v-if="visible" class="custom-modal-overlay" @click.self="cerrar">
      <div class="custom-modal-card animate-card" style="max-width: 450px; width: 90%;">
        <div class="custom-modal-header bg-dark text-white">
          <h5 class="m-0">Agregar al Carrito</h5>
          <button class="btn-close-custom text-white" @click="cerrar">&times;</button>
        </div>

        <div class="custom-modal-body text-start">
          <h4 class="mb-3">{{ producto?.nombre }}</h4>
          <p class="mb-2"><strong>Precio unitario:</strong> ${{ producto?.precio }}</p>
          
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="badge bg-secondary">
              Stock total DB: {{ producto?.stock }} uds
            </span>
            <span v-if="cargandoStock" class="badge bg-light text-dark">
              Calculando disponible...
            </span>
            <span v-else-if="cantidadPendiente > 0" class="badge bg-info text-dark" title="Unidades comprometidas en pedidos pendientes">
              Reservado pendiente: {{ cantidadPendiente }} uds
            </span>
            <span v-if="cantidadEnCarrito > 0" class="badge bg-warning text-dark">
              Ya en el carrito: {{ cantidadEnCarrito }} uds
            </span>
          </div>

          <div class="mb-3">
            <label class="form-label font-weight-bold">Cantidad adicional que deseas llevar:</label>
            <input
              v-model.number="cantidad"
              type="number"
              class="form-control form-control-lg"
              min="1"
              :max="stockDisponibleReal"
              placeholder="Ej: 2"
              @input="validarCantidad"
              :disabled="stockDisponibleReal <= 0 || cargandoStock"
            >
          </div>

          <div v-if="errorMsg" class="alert alert-danger p-2 mb-0">
            {{ errorMsg }}
          </div>
        </div>

        <div class="custom-modal-footer">
          <button
            class="btn btn-primary btn-sm me-2"
            :disabled="!!errorMsg || cantidad < 1 || !cantidad || stockDisponibleReal <= 0 || cargandoStock"
            @click="confirmar"
          >
            Agregar
          </button>
          <button class="btn btn-secondary btn-sm" @click="cerrar">Cancelar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { obtenerCarrito } from '../services/carritoService'
import { obtenerStockDisponible } from '../services/productoService'

const props = defineProps({
  visible: Boolean,
  producto: Object
})

const emit = defineEmits(['confirmar', 'cerrar'])

const cantidad = ref(1)
const errorMsg = ref('')
const cantidadEnCarrito = ref(0)
const stockDisponibleServer = ref(0)
const cantidadPendiente = ref(0)
const cargandoStock = ref(false)

const stockDisponibleReal = computed(() => {
  if (!props.producto) return 0
  if (cargandoStock.value) return 0
  return Math.max(0, stockDisponibleServer.value - cantidadEnCarrito.value)
})

const actualizarCantidadEnCarrito = async () => {
  if (props.visible && props.producto) {
    cargandoStock.value = true
    errorMsg.value = ''
    try {
      const stockDisp = await obtenerStockDisponible(props.producto.id)
      stockDisponibleServer.value = stockDisp
      cantidadPendiente.value = Math.max(0, Number(props.producto.stock) - stockDisp)
    } catch (e) {
      console.error('Error al obtener stock disponible:', e)
      stockDisponibleServer.value = Number(props.producto.stock)
      cantidadPendiente.value = 0
    } finally {
      cargandoStock.value = false
    }

    const carrito = obtenerCarrito()
    const item = carrito.find(p => p.id === props.producto.id)
    cantidadEnCarrito.value = item ? Number(item.cantidad) : 0
    
    if (stockDisponibleReal.value <= 0) {
      if (cantidadPendiente.value > 0) {
        errorMsg.value = 'El stock restante está comprometido en pedidos pendientes de aprobación.'
      } else {
        errorMsg.value = 'Ya agregaste todo el stock disponible de este producto al carrito.'
      }
      cantidad.value = 0
    } else {
      cantidad.value = 1
      errorMsg.value = ''
    }
  }
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      actualizarCantidadEnCarrito()
    }
  }
)

const validarCantidad = () => {
  if (stockDisponibleReal.value <= 0) {
    if (cantidadPendiente.value > 0) {
      errorMsg.value = 'El stock restante está comprometido en pedidos pendientes de aprobación.'
    } else {
      errorMsg.value = 'Ya agregaste todo el stock disponible de este producto al carrito.'
    }
    return
  }

  if (!cantidad.value || cantidad.value < 1) {
    errorMsg.value = 'Por favor ingresa una cantidad válida.'
    return
  }
  
  if (cantidad.value > stockDisponibleReal.value) {
    errorMsg.value = `Solo puedes agregar hasta ${stockDisponibleReal.value} unidades adicionales (ya tienes ${cantidadEnCarrito.value} en el carrito y hay stock reservado).`
  } else {
    errorMsg.value = ''
  }
}

const cerrar = () => {
  emit('cerrar')
}

const confirmar = () => {
  validarCantidad()
  if (!errorMsg.value && cantidad.value > 0) {
    emit('confirmar', cantidad.value)
  }
}
</script>
