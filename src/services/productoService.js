import axios from 'axios'
import { obtenerPeticiones } from './peticionesService'

const API_URL = 'https://69e1690db1cb62b9f316d79c.mockapi.io/productos'

export const obtenerProductoPorId = async (id) => {
  const respuesta = await axios.get(`${API_URL}/${id}`)
  return respuesta.data
}

export const obtenerProductos = async () => {
  const respuesta = await axios.get(API_URL)
  return respuesta.data
}

export const crearProducto = async (producto) => {
  const respuesta = await axios.post(API_URL, producto)
  return respuesta.data
}

export const editarProducto = async (id, producto) => {
  const respuesta = await axios.put(`${API_URL}/${id}`, producto)
  return respuesta.data
}

export const eliminarProducto = async (id) => {
  const respuesta = await axios.delete(`${API_URL}/${id}`)
  return respuesta.data
}

export const obtenerStockDisponible = async (productoId) => {
  // 1. Obtener producto de la base de datos
  const producto = await obtenerProductoPorId(productoId)
  const stockEnDB = Number(producto.stock)

  // 2. Obtener todas las peticiones
  const peticiones = await obtenerPeticiones()

  // 3. Filtrar peticiones en estado "Pendiente" y sumar las cantidades para este producto
  const cantidadPendiente = peticiones
    .filter(p => p.estado === 'Pendiente')
    .flatMap(p => p.productos || [])
    .filter(item => String(item.productoId) === String(productoId))
    .reduce((total, item) => total + Number(item.cantidad), 0)

  // 4. Retornar el stock disponible (mínimo 0)
  return Math.max(0, stockEnDB - cantidadPendiente)
}