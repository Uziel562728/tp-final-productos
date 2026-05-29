<template>
  <form class="card shadow p-4 mb-4" @submit.prevent="guardarProducto">
    <h4 class="mb-3">
      {{ esEdicion ? 'Editar producto' : 'Crear producto' }}
    </h4>

    <div class="mb-3">
      <label class="form-label">Nombre</label>
      <input
        v-model="form.nombre"
        type="text"
        class="form-control"
        required
      >
    </div>

    <div class="mb-3">
      <label class="form-label">Descripción</label>
      <input
        v-model="form.descripcion"
        type="text"
        class="form-control"
        required
      >
    </div>

    <div class="mb-3">
      <label class="form-label">Precio</label>
      <input
        v-model="form.precio"
        type="number"
        class="form-control"
        required
      >
    </div>

    <div class="mb-3">
      <label class="form-label">Stock</label>
      <input
        v-model="form.stock"
        type="number"
        class="form-control"
        required
      >
    </div>

    <div class="mb-3">
      <label class="form-label">Categoría</label>
      <input
        v-model="form.categoria"
        type="text"
        class="form-control"
        required
      >
    </div>

    <button
      type="submit"
      class="btn"
      :class="esEdicion ? 'btn-warning' : 'btn-success'"
    >
      {{ esEdicion ? 'Actualizar' : 'Crear' }}
    </button>

    <button
      v-if="esEdicion"
      type="button"
      class="btn btn-secondary ms-2"
      @click="cancelar"
    >
      Cancelar
    </button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  productoSeleccionado: Object,
  esEdicion: Boolean
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