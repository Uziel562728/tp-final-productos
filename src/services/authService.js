import { ref } from 'vue'

const usuarios = [
  {
    email: 'admin@admin.com',
    password: '1234',
    nombre: 'Administrador',
    rol: 'admin'
  },
  {
    email: 'usuario@usuario.com',
    password: '1234',
    nombre: 'Usuario',
    rol: 'usuario'
  }
]

const usuarioActual = ref(JSON.parse(localStorage.getItem('usuario')) || null)

export const login = (email, password) => {
  const usuarioEncontrado = usuarios.find(usuario => {
    return usuario.email === email && usuario.password === password
  })

  if (usuarioEncontrado) {
    localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado))
    usuarioActual.value = usuarioEncontrado
    return true
  }

  return false
}

export const obtenerUsuario = () => {
  return usuarioActual.value
}

export const obtenerUsuarioReactivo = () => {
  return usuarioActual
}

export const logout = () => {
  localStorage.removeItem('usuario')
  usuarioActual.value = null
}