export const calcularTotalProductos = (productos) => {
  return productos.length
}

export const calcularValorTotalStock = (productos) => {
  return productos.reduce((total, producto) => {
    return total + Number(producto.precio) * Number(producto.stock)
  }, 0)
}

export const calcularProductosSinStock = (productos) => {
  return productos.filter(producto => Number(producto.stock) === 0).length
}

export const calcularPromedioPrecios = (productos) => {
  if (productos.length === 0) {
    return 0
  }

  const total = productos.reduce((suma, producto) => {
    return suma + Number(producto.precio)
  }, 0)

  return total / productos.length
}

export const obtenerProductosCaros = (productos) => {
  return productos.filter(producto => Number(producto.precio) > 500)
}

export const obtenerProductosBajoStock = (productos) => {
  return productos.filter(producto => Number(producto.stock) <= 5)
}

export const obtenerProductoMasCaro = (productos) => {
  if (productos.length === 0) {
    return null
  }

  return productos.reduce((mayor, producto) => {
    if (Number(producto.precio) > Number(mayor.precio)) {
      return producto
    }

    return mayor
  })
}

export const obtenerProductoMenorStock = (productos) => {
  if (productos.length === 0) {
    return null
  }

  return productos.reduce((menor, producto) => {
    if (Number(producto.stock) < Number(menor.stock)) {
      return producto
    }

    return menor
  })
}

export const obtenerCantidadCategorias = (productos) => {
  const categorias = productos.map(producto => producto.categoria)
  const categoriasUnicas = [...new Set(categorias)]
  return categoriasUnicas.length
}