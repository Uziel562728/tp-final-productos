import axios from 'axios'

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