<template>
  <div class="mt-5">
    <h3 class="mb-4 text-primary animate-fade-in">Visualización de datos</h3>
    
    <div class="row">
      <!-- Productos por categoría -->
      <div class="col-md-6 mb-4 animate-slide-up">
        <div class="card shadow border-0 h-100 p-3 bg-white-translucent">
          <h5 class="card-title text-center mb-3 fw-bold white-title">
            Productos por Categoría
          </h5>
          <div class="chart-container" style="position: relative; height: 320px;">
            <canvas ref="categoryCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Estado del stock -->
      <div class="col-md-6 mb-4 animate-slide-up">
        <div class="card shadow border-0 h-100 p-3 bg-white-translucent">
          <h5 class="card-title text-center mb-3 fw-bold white-title">
            Estado del Stock
          </h5>
          <div class="chart-container" style="position: relative; height: 320px;">
            <canvas ref="stockStatusCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Valor de stock por producto -->
    <div class="row">
      <div class="col-12 mb-4 animate-slide-up">
        <div class="card shadow border-0 p-3 bg-white-translucent">
          <h5 class="card-title text-center mb-3 fw-bold white-title">
            Valor de Stock por Producto (Precio × Stock)
          </h5>
          <div class="chart-container" style="position: relative; height: 420px;">
            <canvas ref="stockValueCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  productos: {
    type: Array,
    required: true
  }
})

// Template refs for canvas elements
const categoryCanvas = ref(null)
const stockStatusCanvas = ref(null)
const stockValueCanvas = ref(null)

// Chart instances (stored in simple variables to avoid Vue proxy tracking issues)
let chartCategoria = null
let chartStock = null
let chartValor = null

// --- Data Preparation using computed, filter, map ---

// 1. Products by Category
const uniqueCategories = computed(() => {
  const allCategories = props.productos.map(p => p.categoria || 'Sin Categoría')
  return [...new Set(allCategories)]
})

const conteoCategorias = computed(() => {
  return uniqueCategories.value.map(cat => {
    const matchingProducts = props.productos.filter(p => (p.categoria || 'Sin Categoría') === cat)
    return {
      categoria: cat,
      cantidad: matchingProducts.length
    }
  })
})

// 2. Stock Status (Sin stock, bajo stock, stock suficiente)
const sinStock = computed(() => {
  return props.productos.filter(p => Number(p.stock) === 0)
})

const bajoStock = computed(() => {
  return props.productos.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5)
})

const stockSuficiente = computed(() => {
  return props.productos.filter(p => Number(p.stock) > 5)
})

// 3. Stock Value per Product (Precio * Stock)
const valoresStock = computed(() => {
  return props.productos.map(p => {
    return {
      nombre: p.nombre,
      valor: Number(p.precio) * Number(p.stock)
    }
  })
})

// --- Render Chart.js instances ---
const renderCharts = () => {
  // Destroy existing charts to prevent duplication issues
  destroyCharts()

  // Make sure we have canvas elements and product data before creating charts
  if (!categoryCanvas.value || !stockStatusCanvas.value || !stockValueCanvas.value || props.productos.length === 0) {
    return
  }

  // Get CSS variables or default values for custom styling matching the project
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c3aed'
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#475569'
  const borderCol = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#cbd5e1'

  // Chart 1: Products by Category (Bar Chart)
  const ctxCat = categoryCanvas.value.getContext('2d')
  chartCategoria = new Chart(ctxCat, {
    type: 'bar',
    data: {
      labels: conteoCategorias.value.map(c => c.categoria),
      datasets: [{
        label: 'Cantidad de Productos',
        data: conteoCategorias.value.map(c => c.cantidad),
        backgroundColor: accentColor + 'd0', // add transparency
        borderColor: accentColor,
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            color: borderCol + '30'
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: borderCol + '30'
          },
          ticks: {
            color: textColor,
            stepSize: 1
          }
        }
      }
    }
  })

  // Chart 2: Stock Status (Doughnut Chart)
  const ctxStock = stockStatusCanvas.value.getContext('2d')
  chartStock = new Chart(ctxStock, {
    type: 'doughnut',
    data: {
      labels: ['Sin Stock', 'Bajo Stock (≤ 5)', 'Stock Suficiente (> 5)'],
      datasets: [{
        data: [
          sinStock.value.length,
          bajoStock.value.length,
          stockSuficiente.value.length
        ],
        backgroundColor: [
          '#ef4444', // Soft Red (Sin stock)
          '#f59e0b', // Soft Orange (Bajo stock)
          '#10b981'  // Soft Green (Stock suficiente)
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    }
  })

  // Chart 3: Stock Value per Product (Horizontal Bar Chart)
  const ctxVal = stockValueCanvas.value.getContext('2d')
  chartValor = new Chart(ctxVal, {
    type: 'bar',
    data: {
      labels: valoresStock.value.map(v => v.nombre),
      datasets: [{
        label: 'Valor Total Stock ($)',
        data: valoresStock.value.map(v => v.valor),
        backgroundColor: '#3b82f6d0', // Blue with opacity
        borderColor: '#3b82f6',
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` Valor: $${context.raw.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: borderCol + '30'
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor
          }
        }
      }
    }
  })
}

const destroyCharts = () => {
  if (chartCategoria) {
    chartCategoria.destroy()
    chartCategoria = null
  }
  if (chartStock) {
    chartStock.destroy()
    chartStock = null
  }
  if (chartValor) {
    chartValor.destroy()
    chartValor = null
  }
}

// Watcher to re-render charts when the data changes asynchronously
watch(() => props.productos, (newVal) => {
  if (newVal && newVal.length > 0) {
    renderCharts()
  }
}, { deep: true })

onMounted(() => {
  if (props.productos && props.productos.length > 0) {
    renderCharts()
  }
})

onBeforeUnmount(() => {
  destroyCharts()
})
</script>

<style scoped>
.white-title {
  color: #ffffff !important;
}

.bg-white-translucent {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

@media (prefers-color-scheme: dark) {
  .bg-white-translucent {
    background-color: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* Micro-animations */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
