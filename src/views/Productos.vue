<template>
  <div class="container mt-4">
    <h1 class="mb-4">Productos</h1>

    <div v-if="esAdmin" class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div class="alert alert-success m-0 flex-grow-1 py-2">
        Estás como administrador. Podés crear, editar y eliminar productos.
      </div>
      <button class="btn btn-success" @click="abrirCrearProducto">
        + Crear Producto
      </button>
    </div>

    <div v-else class="alert alert-info mb-4">
      Estás como usuario. Solo podés consultar productos.
    </div>

    <!-- Modal Emergente para Crear/Editar Producto -->
    <Transition name="fade-scale">
      <div v-if="modalProductoVisible" class="custom-modal-overlay" @click.self="cancelarEdicion">
        <div class="custom-modal-card animate-card" style="max-width: 750px; width: 95%;">
          <div class="custom-modal-header bg-dark text-white">
            <h5 class="m-0">{{ esEdicion ? 'Editar Producto' : 'Crear Producto' }}</h5>
            <button class="btn-close-custom text-white" @click="cancelarEdicion">&times;</button>
          </div>
          <div class="custom-modal-body p-0">
            <ProductoForm
              :productoSeleccionado="productoSeleccionado"
              :esEdicion="esEdicion"
              :categorias="categorias"
              @guardar="guardarProducto"
              @cancelar="cancelarEdicion"
            />
          </div>
        </div>
      </div>
    </Transition>

    <div class="card shadow border-0 p-4 mb-4">
      <h4 class="mb-3">Filtros de búsqueda</h4>

      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">Buscar por nombre</label>
          <input
            v-model="busqueda"
            type="text"
            class="form-control"
            placeholder="Ej: Notebook"
          >
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Filtrar por categoría</label>
          <select v-model="categoriaSeleccionada" class="form-select">
            <option value="Todas">Todas</option>
            <option
              v-for="categoria in categorias"
              :key="categoria"
              :value="categoria"
            >
              {{ categoria }}
            </option>
          </select>
        </div>

        <div class="col-md-4 mb-3 d-flex align-items-end">
          <div class="form-check">
            <input
              v-model="soloBajoStock"
              class="form-check-input"
              type="checkbox"
              id="bajoStock"
            >
            <label class="form-check-label" for="bajoStock">
              Mostrar solo productos con bajo stock
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="cargando" class="alert alert-info">
      Cargando productos...
    </div>

    <div v-else>
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Total productos</h6>
            <h3 class="text-primary">{{ totalProductosVisible }}</h3>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Mostrados</h6>
            <h3 class="text-success">{{ productosFiltrados.length }}</h3>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Categorías</h6>
            <h3 class="text-warning">{{ categorias.length }}</h3>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow border-0 p-3">
            <h6>Bajo stock</h6>
            <h3 class="text-danger">{{ productosBajoStock.length }}</h3>
          </div>
        </div>
      </div>

      <div
        v-if="productosFiltrados.length === 0"
        class="alert alert-warning text-center"
      >
        No se encontraron productos con esos filtros.
      </div>

      <ProductoTabla
        v-else
        :productos="productosFiltrados"
        :esAdmin="esAdmin"
        :favoritoIds="favoritoIds"
        @editar="seleccionarProducto"
        @eliminar="eliminarProductoSeleccionado"
        @agregar-carrito="iniciarAgregarAlCarrito"
        @favorito-toggled="cargarFavoritoIds"
      />
    </div>

    <!-- Modal para Seleccionar Cantidad al Agregar al Carrito -->
    <SelectorCantidadModal
      :visible="modalCantidadVisible"
      :producto="productoParaCarrito"
      @confirmar="confirmarAgregarAlCarrito"
      @cerrar="cerrarSelectorCantidad"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductoForm from '../components/ProductoForm.vue'
import ProductoTabla from '../components/ProductoTabla.vue'
import SelectorCantidadModal from '../components/SelectorCantidadModal.vue'
import { obtenerUsuario } from '../services/authService'
import {
  obtenerProductos,
  crearProducto,
  editarProducto,
  eliminarProducto
} from '../services/productoService'
import { agregarAlCarrito } from '../services/carritoService'
import { mostrarAlerta } from '../services/alertService'
import { obtenerFavoritos } from '../services/favoritosService'

const productos = ref([])
const cargando = ref(true)
const esEdicion = ref(false)
const productoSeleccionado = ref(null)
const modalProductoVisible = ref(false)

// Estado para modal selector de cantidad
const modalCantidadVisible = ref(false)
const productoParaCarrito = ref(null)

// Lista reactiva de IDs favoritos
const favoritoIds = ref([])

const busqueda = ref('')
const categoriaSeleccionada = ref('Todas')
const soloBajoStock = ref(false)

const usuario = obtenerUsuario()

const cargarFavoritoIds = () => {
  favoritoIds.value = obtenerFavoritos().map(f => f.id)
}

const iniciarAgregarAlCarrito = (producto) => {
  productoParaCarrito.value = producto
  modalCantidadVisible.value = true
}

const confirmarAgregarAlCarrito = (cantidad) => {
  if (productoParaCarrito.value) {
    agregarAlCarrito(productoParaCarrito.value, cantidad)
    mostrarAlerta('Carrito', `Agregaste al carrito ${cantidad} de ${productoParaCarrito.value.nombre}`, 'success')
  }
  modalCantidadVisible.value = false
  productoParaCarrito.value = null
}

const cerrarSelectorCantidad = () => {
  modalCantidadVisible.value = false
  productoParaCarrito.value = null
}

const abrirCrearProducto = () => {
  productoSeleccionado.value = null
  esEdicion.value = false
  modalProductoVisible.value = true
}

const esAdmin = computed(() => {
  return usuario && usuario.rol === 'admin'
})

const totalProductosVisible = computed(() => {
  if (!esAdmin.value) {
    return productos.value.filter(p => Number(p.stock) > 0).length
  }
  return productos.value.length
})

const categorias = computed(() => {
  const prods = esAdmin.value 
    ? productos.value 
    : productos.value.filter(p => Number(p.stock) > 0)
  const categoriasProductos = prods.map(producto => producto.categoria)
  return [...new Set(categoriasProductos)]
})

const productosBajoStock = computed(() => {
  return productos.value.filter(producto => {
    const stockVal = Number(producto.stock)
    if (!esAdmin.value) {
      return stockVal > 0 && stockVal <= 5
    }
    return stockVal <= 5
  })
})

const productosFiltrados = computed(() => {
  const filtered = productos.value.filter(producto => {
    // Si el usuario no es admin, no puede ver productos sin stock
    if (!esAdmin.value && Number(producto.stock) <= 0) {
      return false
    }

    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.value.toLowerCase())

    const coincideCategoria =
      categoriaSeleccionada.value === 'Todas' ||
      producto.categoria === categoriaSeleccionada.value

    const coincideStock =
      !soloBajoStock.value ||
      Number(producto.stock) <= 5

    return coincideNombre && coincideCategoria && coincideStock
  })

  // Ordenar de tal forma que los productos favoritos queden arriba de la lista
  const favSet = new Set(favoritoIds.value)
  return [...filtered].sort((a, b) => {
    const aIsFav = favSet.has(a.id) ? 1 : 0
    const bIsFav = favSet.has(b.id) ? 1 : 0
    return bIsFav - aIsFav
  })
})

const cargarProductos = async () => {
  try {
    productos.value = await obtenerProductos()
  } catch (error) {
    console.log(error)
  } finally {
    cargando.value = false
  }
}

const guardarProducto = async (producto) => {
  try {
    if (esAdmin.value) {
      if (esEdicion.value) {
        const productoActualizado = await editarProducto(
          productoSeleccionado.value.id,
          producto
        )

        productos.value = productos.value.map(p => {
          if (p.id === productoSeleccionado.value.id) {
            return productoActualizado
          }

          return p
        })

        esEdicion.value = false
        productoSeleccionado.value = null
      } else {
        const productoCreado = await crearProducto(producto)
        productos.value.push(productoCreado)
      }
      modalProductoVisible.value = false
    }
  } catch (error) {
    console.log(error)
  }
}

const seleccionarProducto = (producto) => {
  if (esAdmin.value) {
    productoSeleccionado.value = producto
    esEdicion.value = true
    modalProductoVisible.value = true
  }
}

const cancelarEdicion = () => {
  esEdicion.value = false
  productoSeleccionado.value = null
  modalProductoVisible.value = false
}

const eliminarProductoSeleccionado = async (id) => {
  try {
    if (esAdmin.value) {
      await eliminarProducto(id)
      productos.value = productos.value.filter(producto => producto.id !== id)
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  cargarProductos()
  cargarFavoritoIds()
})
</script>