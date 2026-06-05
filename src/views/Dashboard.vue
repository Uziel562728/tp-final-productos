<template>
  <div class="container mt-4">
    <h1 class="mb-4">Dashboard Administrativo</h1>

    <div v-if="cargando" class="alert alert-info">
      Cargando reportes...
    </div>

    <div v-else>
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card shadow text-center p-3 border-0">
            <h6>Total productos</h6>
            <h2 class="text-primary">{{ totalProductos }}</h2>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card shadow text-center p-3 border-0">
            <h6>Valor total stock</h6>
            <h2 class="text-success">${{ valorTotalStock }}</h2>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card shadow text-center p-3 border-0">
            <h6>Sin stock</h6>
            <h2 class="text-danger">{{ productosSinStock }}</h2>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card shadow text-center p-3 border-0">
            <h6>Promedio precios</h6>
            <h2 class="text-warning">${{ promedioPrecios.toFixed(2) }}</h2>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card shadow p-3 border-0 h-100">
            <h5>Producto más caro</h5>
            <p v-if="productoMasCaro">
              <strong>{{ productoMasCaro.nombre }}</strong>
            </p>
            <p v-if="productoMasCaro" class="text-success">
              ${{ productoMasCaro.precio }}
            </p>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card shadow p-3 border-0 h-100">
            <h5>Producto con menor stock</h5>
            <p v-if="productoMenorStock">
              <strong>{{ productoMenorStock.nombre }}</strong>
            </p>
            <p v-if="productoMenorStock" class="text-danger">
              Stock: {{ productoMenorStock.stock }}
            </p>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card shadow p-3 border-0 h-100">
            <h5>Cantidad de categorías</h5>
            <h2 class="text-primary">{{ cantidadCategorias }}</h2>
          </div>
        </div>
      </div>

      <!-- Sección de visualización de datos con gráficos -->
      <VisualizacionDatos :productos="productos" />

<div class="d-flex justify-content-between align-items-center mt-4 mb-3">
  <h3>Productos con bajo stock</h3>

  <div class="d-flex align-items-center gap-2">
    <label class="form-label mb-0">
      Ver productos con stock menor o igual a:
    </label>

    <input
      v-model="limiteStock"
      type="number"
      class="form-control w-auto"
      min="0"
    >
  </div>
</div>

      <table class="table table-striped table-bordered mt-3">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="producto in productosBajoStock" :key="producto.id">
            <td>{{ producto.nombre }}</td>
            <td>${{ producto.precio }}</td>
            <td>{{ producto.stock }}</td>
            <td>{{ producto.categoria }}</td>
          </tr>
        </tbody>
      </table>

     <div class="d-flex justify-content-between align-items-center mt-5 mb-3">
  <h3>Productos con precio mayor a ${{ limitePrecio }}</h3>

  <div class="d-flex align-items-center gap-2">
    <label class="form-label mb-0">
      Ver productos con precio mayor a:
    </label>

    <input
      v-model="limitePrecio"
      type="number"
      class="form-control w-auto"
      min="0"
    >
  </div>
</div>

      <table class="table table-striped table-bordered mt-3">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="producto in productosCaros" :key="producto.id">
            <td>{{ producto.nombre }}</td>
            <td>${{ producto.precio }}</td>
            <td>{{ producto.stock }}</td>
            <td>{{ producto.categoria }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerProductos } from '../services/productoService'
import VisualizacionDatos from '../components/VisualizacionDatos.vue'
import {
  calcularTotalProductos,
  calcularValorTotalStock,
  calcularProductosSinStock,
  calcularPromedioPrecios,
  obtenerProductosCaros,
  obtenerProductosBajoStock,
  obtenerProductoMasCaro,
  obtenerProductoMenorStock,
  obtenerCantidadCategorias
} from '../services/reporteService'

const productos = ref([])
const cargando = ref(true)
const limiteStock = ref(5)
const limitePrecio = ref(500)

const cargarProductos = async () => {
  try {
    productos.value = await obtenerProductos()
  } catch (error) {
    console.log(error)
  } finally {
    cargando.value = false
  }
}

const totalProductos = computed(() => {
  return calcularTotalProductos(productos.value)
})

const valorTotalStock = computed(() => {
  return calcularValorTotalStock(productos.value)
})

const productosSinStock = computed(() => {
  return calcularProductosSinStock(productos.value)
})

const promedioPrecios = computed(() => {
  return calcularPromedioPrecios(productos.value)
})

const productosCaros = computed(() => {
  return productos.value.filter(producto => {
    return Number(producto.precio) > Number(limitePrecio.value)
  })
})

const productosBajoStock = computed(() => {
  return productos.value.filter(producto => {
    return Number(producto.stock) <= Number(limiteStock.value)
  })
})

const productoMasCaro = computed(() => {
  return obtenerProductoMasCaro(productos.value)
})

const productoMenorStock = computed(() => {
  return obtenerProductoMenorStock(productos.value)
})

const cantidadCategorias = computed(() => {
  return obtenerCantidadCategorias(productos.value)
})

onMounted(() => {
  cargarProductos()
})
</script>