import { obtenerUsuario } from './authService'

const obtenerClave = () => {
  const usuario = obtenerUsuario()
  return usuario ? `carrito_${usuario.email}` : 'carrito'
}

export const obtenerCarrito = () => {
  const carrito = localStorage.getItem(obtenerClave())

  if (carrito) {
    return JSON.parse(carrito)
  }

  return []
}

export const guardarCarrito = (carrito) => {
  localStorage.setItem(obtenerClave(), JSON.stringify(carrito))
}

export const agregarAlCarrito = (producto, cantidad = 1) => {
  const carrito = obtenerCarrito()

  const productoExistente = carrito.find(item => item.id === producto.id)

  if (productoExistente) {
    productoExistente.cantidad += cantidad
  } else {
    carrito.push({
      ...producto,
      cantidad: cantidad
    })
  }

  guardarCarrito(carrito)
}

export const eliminarDelCarrito = (id) => {
  const carrito = obtenerCarrito().filter(producto => producto.id !== id)
  guardarCarrito(carrito)
}

export const vaciarCarrito = () => {
  guardarCarrito([])
}