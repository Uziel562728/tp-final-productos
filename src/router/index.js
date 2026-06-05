import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Productos from '../views/Productos.vue'
import Dashboard from '../views/Dashboard.vue'
import AsistenteIA from '../views/AsistenteIA.vue'
import { obtenerUsuario } from '../services/authService'
import DetalleProducto from '../views/DetalleProducto.vue'
import Favoritos from '../views/Favoritos.vue'
import Carrito from '../views/Carrito.vue'
import Peticiones from '../views/Peticiones.vue'
import MisPeticiones from '../views/MisPeticiones.vue'

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    meta: {
      requiereLogin: true
    }
  },
  {
    path: '/productos',
    component: Productos,
    meta: {
      requiereLogin: true
    }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiereLogin: true,
      requiereAdmin: true
    }
  },
  {
  path: '/productos/:id',
  component: DetalleProducto,
  meta: {
    requiereLogin: true
  }
},
{
  path: '/favoritos',
  component: Favoritos,
  meta: {
    requiereLogin: true
  }
},
{
  path: '/carrito',
  component: Carrito,
  meta: {
    requiereLogin: true
  }
},
  {
    path: '/ia',
    component: AsistenteIA,
    meta: {
      requiereLogin: true,
      requiereAdmin: true
    }
  },
  {
    path: '/peticiones',
    component: Peticiones,
    meta: {
      requiereLogin: true,
      requiereAdmin: true
    }
  },
  {
    path: '/mis-peticiones',
    component: MisPeticiones,
    meta: {
      requiereLogin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const usuario = obtenerUsuario()

  if (to.meta.requiereLogin && !usuario) {
    next('/')
  } else if (to.meta.requiereAdmin && usuario.rol !== 'admin') {
    next('/home')
  } else {
    next()
  }
})

export default router