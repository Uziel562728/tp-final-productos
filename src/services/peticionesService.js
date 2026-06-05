import axios from 'axios'

const API_URL = 'https://69e1690db1cb62b9f316d79c.mockapi.io/peticiones'

export const obtenerPeticiones = async () => {
  const respuesta = await axios.get(API_URL)
  return respuesta.data
}

export const crearPeticion = async (peticion) => {
  const respuesta = await axios.post(API_URL, peticion)
  return respuesta.data
}

export const actualizarPeticion = async (id, peticion) => {
  const respuesta = await axios.put(`${API_URL}/${id}`, peticion)
  return respuesta.data
}

export const eliminarPeticion = async (id) => {
  const respuesta = await axios.delete(`${API_URL}/${id}`)
  return respuesta.data
}
