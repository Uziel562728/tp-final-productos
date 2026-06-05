<template>
  <form class="p-4" @submit.prevent="guardarProducto">
    <h4 class="mb-4">
      {{ esEdicion ? 'Editar producto' : 'Crear producto' }}
    </h4>

    <div class="row">
      <!-- Fila 1: Nombre y Categoría -->
      <div class="col-md-6 mb-3">
        <label class="form-label">Nombre</label>
        <input
          v-model="form.nombre"
          type="text"
          class="form-control"
          required
        >
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label">Categoría</label>
        <input
          v-model="form.categoria"
          type="text"
          class="form-control"
          list="categoriasExistentes"
          placeholder="Escribe o selecciona..."
          required
        >
        <datalist id="categoriasExistentes">
          <option v-for="cat in categorias" :key="cat" :value="cat" />
        </datalist>
      </div>
    </div>

    <div class="row">
      <!-- Fila 2: Precio y Stock -->
      <div class="col-md-6 mb-3">
        <label class="form-label">Precio</label>
        <input
          v-model="form.precio"
          type="number"
          class="form-control"
          required
        >
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label">Stock</label>
        <input
          v-model="form.stock"
          type="number"
          class="form-control"
          required
        >
      </div>
    </div>

    <!-- Fila 3: Descripción completa -->
    <div class="mb-4">
      <label class="form-label">Descripción</label>
      <textarea
        v-model="form.descripcion"
        class="form-control"
        rows="2"
        required
      ></textarea>
    </div>

    <div class="text-end">
      <button
        type="submit"
        class="btn px-4"
        :class="esEdicion ? 'btn-warning' : 'btn-success'"
      >
        {{ esEdicion ? 'Actualizar' : 'Crear' }}
      </button>

      <button
        v-if="esEdicion"
        type="button"
        class="btn btn-secondary ms-2 px-4"
        @click="cancelar"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  productoSeleccionado: Object,
  esEdicion: Boolean,
  categorias: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['guardar', 'cancelar'])

const form = reactive({
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria: ''
})

watch(
  () => props.productoSeleccionado,
  (nuevoProducto) => {
    if (nuevoProducto) {
      form.nombre = nuevoProducto.nombre
      form.descripcion = nuevoProducto.descripcion
      form.precio = nuevoProducto.precio
      form.stock = nuevoProducto.stock
      form.categoria = nuevoProducto.categoria
    }
  },
  { immediate: true }
)

const limpiarFormulario = () => {
  form.nombre = ''
  form.descripcion = ''
  form.precio = ''
  form.stock = ''
  form.categoria = ''
}

const guardarProducto = () => {
  emit('guardar', {
    nombre: form.nombre,
    descripcion: form.descripcion,
    precio: Number(form.precio),
    stock: Number(form.stock),
    categoria: form.categoria
  })

  limpiarFormulario()
}

const cancelar = () => {
  limpiarFormulario()
  emit('cancelar')
}
</script>