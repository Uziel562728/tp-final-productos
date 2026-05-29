<template>
  <div class="container mt-4">
    <h1 class="mb-4">Productos</h1>

    <div v-if="esAdmin" class="alert alert-success">
      Estás como administrador. Podés crear, editar y eliminar productos.
    </div>

    <div v-else class="alert alert-info">
      Estás como usuario. Solo podés consultar productos.
    </div>

    <ProductoForm
      v-if="esAdmin"
      :productoSeleccionado="productoSeleccionado"
      :esEdicion="esEdicion"
      @guardar="guardarProducto"
      @cancelar="cancelarEdicion"
    />

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
            <h3 class="text-primary">{{ productos.length }}</h3>
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
        @editar="seleccionarProducto"
        @eliminar="eliminarProductoSeleccionado"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductoForm from '../components/ProductoForm.vue'
import ProductoTabla from '../components/ProductoTabla.vue'
import { obtenerUsuario } from '../services/authService'
import {
  obtenerProductos,
  crearProducto,
  editarProducto,
  eliminarProducto
} from '../services/productoService'

const productos = ref([])
const cargando = ref(true)
const esEdicion = ref(false)
const productoSeleccionado = ref(null)

const busqueda = ref('')
const categoriaSeleccionada = ref('Todas')
const soloBajoStock = ref(false)

const usuario = obtenerUsuario()

const esAdmin = computed(() => {
  return usuario && usuario.rol === 'admin'
})

const categorias = computed(() => {
  const categoriasProductos = productos.value.map(producto => producto.categoria)
  return [...new Set(categoriasProductos)]
})

const productosBajoStock = computed(() => {
  return productos.value.filter(producto => Number(producto.stock) <= 5)
})

const productosFiltrados = computed(() => {
  return productos.value.filter(producto => {
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
    }
  } catch (error) {
    console.log(error)
  }
}

const seleccionarProducto = (producto) => {
  if (esAdmin.value) {
    productoSeleccionado.value = producto
    esEdicion.value = true
  }
}

const cancelarEdicion = () => {
  esEdicion.value = false
  productoSeleccionado.value = null
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
})
</script>