export const generarRespuestaIA = (productos, consulta) => {
  const consultaMinuscula = consulta.toLowerCase()

  if (consultaMinuscula.includes('stock')) {
    const productosBajoStock = productos.filter(producto => producto.stock <= 5)

    if (productosBajoStock.length === 0) {
      return 'No hay productos con bajo stock. El inventario se encuentra en buen estado.'
    }

    const nombres = productosBajoStock.map(producto => producto.nombre).join(', ')

    return `Los productos con bajo stock son: ${nombres}. Se recomienda reponerlos pronto.`
  }

  if (consultaMinuscula.includes('caro') || consultaMinuscula.includes('precio')) {
    const productosCaros = productos.filter(producto => producto.precio > 500)

    if (productosCaros.length === 0) {
      return 'No se encontraron productos con precio mayor a $500.'
    }

    const nombres = productosCaros.map(producto => producto.nombre).join(', ')

    return `Los productos más caros son: ${nombres}. Se recomienda revisar si su precio es competitivo.`
  }

  if (consultaMinuscula.includes('ventas') || consultaMinuscula.includes('mejorar')) {
    return 'Para mejorar las ventas, se recomienda destacar los productos con mayor stock, crear promociones y revisar los productos de precio más alto.'
  }

  if (consultaMinuscula.includes('resumen')) {
    const totalProductos = productos.length

    const valorTotal = productos.reduce((total, producto) => {
      return total + producto.precio * producto.stock
    }, 0)

    return `El sistema tiene ${totalProductos} productos cargados y un valor total aproximado de stock de $${valorTotal}.`
  }

  return 'No pude interpretar la consulta. Probá preguntando por stock, precios, ventas o resumen.'
}