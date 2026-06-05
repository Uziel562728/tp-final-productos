import { ref } from 'vue'

export const alertaVisible = ref(false)
export const alertaTitulo = ref('')
export const alertaMensaje = ref('')
export const alertaTipo = ref('success') // 'success', 'danger', 'info', 'warning'

export const mostrarAlerta = (titulo, mensaje, tipo = 'success') => {
  alertaTitulo.value = titulo
  alertaMensaje.value = mensaje
  alertaTipo.value = tipo
  alertaVisible.value = true
}

export const cerrarAlerta = () => {
  alertaVisible.value = false
}
