import { obtenerUsuario } from './authService'

const obtenerClave = () => {
  const usuario = obtenerUsuario()
  return usuario ? `favoritos_${usuario.email}` : 'favoritos'
}

export const obtenerFavoritos = () => {
  const favoritos = localStorage.getItem(obtenerClave())

  if (favoritos) {
    return JSON.parse(favoritos)
  }

  return []
}

export const guardarFavoritos = (favoritos) => {
  localStorage.setItem(obtenerClave(), JSON.stringify(favoritos))
}

export const agregarFavorito = (producto) => {
  const favoritos = obtenerFavoritos()

  const existe = favoritos.some(favorito => favorito.id === producto.id)

  if (!existe) {
    favoritos.push(producto)
    guardarFavoritos(favoritos)
  }
}

export const eliminarFavorito = (id) => {
  const favoritos = obtenerFavoritos().filter(producto => producto.id !== id)
  guardarFavoritos(favoritos)
}