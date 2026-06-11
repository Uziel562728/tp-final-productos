# 📦 Trabajo Práctico Final - Gestión de Productos
### Programación de Nuevas Tecnologías — 2º Año (ORT)

Este proyecto es una aplicación web interactiva del tipo **Single Page Application (SPA)** desarrollada con **Vue 3** y empaquetada con **Vite**. La aplicación permite la administración y consulta de un catálogo de productos, la gestión de un carrito de compras, un sistema de favoritos, un panel de reportes estadísticos y un asistente inteligente integrado con inteligencia artificial.

---

## 🚀 Características Principales

La aplicación cuenta con control de accesos basado en roles (**Administrador** y **Usuario Estándar**):

### 👤 Rol: Usuario Estándar
- **Catálogo de Productos:** Búsqueda en tiempo real por nombre y filtrado por categorías.
- **Detalle de Producto:** Vista detallada de cada producto con su stock y precio.
- **Sistema de Favoritos:** Posibilidad de guardar y quitar productos de una lista de favoritos persistente (con estados visuales e íconos interactivos).
- **Carrito de Compras:** Gestión interactiva de cantidades y validación de stock disponible en tiempo real antes de efectuar un pedido.
- **Mis Peticiones:** Consulta del historial de solicitudes de compra realizadas y su estado de aprobación (Pendiente / Aprobada / Rechazada).

### 🔑 Rol: Administrador
- **Gestión de Inventario (CRUD):** Creación, edición y eliminación de productos del catálogo.
- **Dashboard & Reportes:** Visualización de métricas generales (total de productos, categorías, niveles de stock bajo, etc.) mediante gráficos interactivos con **Chart.js**.
- **Gestión de Peticiones:** Visualización y procesamiento de las solicitudes de compra hechas por los usuarios, permitiendo aprobarlas o rechazarlas (lo cual impacta directamente en el stock del inventario).
- **Asistente de IA:** Chat interactivo configurado con un pipeline de IA en **VectorShift** para consultas inteligentes de negocio y soporte.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Vue 3](https://vuejs.org/) (usando la sintaxis moderna de `<script setup>` y Composition API).
- **Empaquetador y Servidor Dev:** [Vite](https://vite.dev/).
- **Enrutamiento:** [Vue Router 4](https://router.vuejs.org/) (con guards de navegación para proteger rutas según autenticación y roles).
- **Estilos y Maquetación:** [Bootstrap 5](https://getbootstrap.com/) para diseño fluido, responsive y adaptable a móviles.
- **Peticiones HTTP:** [Axios](https://axios-http.com/) para consumir servicios web.
- **Gráficos:** [Chart.js](https://www.chartjs.org/) para el dashboard de administración.
- **Inteligencia Artificial:** Integración externa con [VectorShift API](https://www.vectorshift.ai/).

---

## 📂 Estructura del Proyecto

A continuación se detalla la arquitectura de directorios de la aplicación:

```text
tp-final-productos/
├── .vscode/                 # Configuraciones locales de Visual Studio Code
├── dist/                    # Carpeta generada al compilar la app para producción
├── node_modules/            # Dependencias del proyecto instaladas por npm
├── public/                  # Recursos públicos estáticos accesibles directamente
├── src/                     # Código fuente de la aplicación
│   ├── assets/              # Recursos estáticos locales (imágenes, logos, etc.)
│   ├── components/          # Componentes de Vue reutilizables
│   │   ├── Menu.vue                 # Barra de navegación principal y de perfil
│   │   ├── ProductoForm.vue         # Formulario modal para crear y editar productos
│   │   ├── ProductoTabla.vue        # Tabla y grilla mobile de productos con acciones y favoritos
│   │   ├── SelectorCantidadModal.vue# Modal interactivo para agregar cantidades al carrito
│   │   └── VisualizacionDatos.vue   # Gráficos estadísticos del Dashboard (Chart.js)
│   ├── router/              # Configuración de rutas de navegación
│   │   └── index.js                 # Definición de rutas y route guards de autenticación/roles
│   ├── services/            # Servicios de lógica de negocio y consumo de APIs
│   │   ├── alertService.js          # Alertas y modales globales de la aplicación
│   │   ├── authService.js           # Manejo de usuarios, sesiones y roles reactivos
│   │   ├── carritoService.js        # Gestión del estado del carrito de compras y persistencia
│   │   ├── favoritosService.js      # Control de favoritos por usuario en LocalStorage
│   │   ├── peticionesService.js     # Altas y actualizaciones de solicitudes de compra
│   │   ├── productoService.js       # CRUD de productos y simulación de base de datos
│   │   ├── reporteService.js        # Lógica para la extracción de métricas del Dashboard
│   │   └── vectorShiftService.js    # Conexión con la API del Asistente de IA (VectorShift)
│   ├── shared/              # Utilidades compartidas del sistema
│   │   └── iaService.js             # Módulo de soporte de IA adicional
│   ├── views/               # Vistas (Páginas principales de la aplicación)
│   │   ├── AsistenteIA.vue          # Página de chat del asistente inteligente (Admin)
│   │   ├── Carrito.vue              # Vista del carrito de compras del usuario
│   │   ├── Dashboard.vue            # Panel de estadísticas e indicadores (Admin)
│   │   ├── DetalleProducto.vue      # Ficha técnica y detalle individual de producto
│   │   ├── Favoritos.vue            # Galería de productos agregados a favoritos
│   │   ├── Home.vue                 # Página de bienvenida e inicio post-login
│   │   ├── Login.vue                # Pantalla de acceso y autenticación
│   │   ├── MisPeticiones.vue        # Historial de compras solicitadas por el usuario
│   │   ├── Peticiones.vue           # Panel de aprobación de solicitudes de compra (Admin)
│   │   └── Productos.vue            # Catálogo general de productos
│   ├── App.vue              # Componente raíz de la aplicación
│   ├── main.js              # Punto de entrada de JavaScript (montaje de Vue)
│   └── style.css            # Estilos CSS globales y personalizados de la app
├── .env                     # Archivo de configuración de variables de entorno (no comiteado)
├── .gitignore               # Configuración de exclusión para Git
├── index.html               # Archivo HTML de entrada principal
├── package.json             # Manifiesto del proyecto (scripts y dependencias)
├── package-lock.json        # Registro preciso del árbol de dependencias instalado
├── README.md                # Documentación del proyecto (este archivo)
└── vite.config.js           # Configuración de empaquetado de Vite
```

---

## ⚙️ Configuración del Entorno (`.env`)

Para que la aplicación se conecte correctamente con el Asistente de IA, debes crear un archivo llamado `.env` en la raíz del proyecto (al mismo nivel del `package.json`) y configurar las siguientes credenciales:

```env
# Clave API de VectorShift
VITE_VECTORSHIFT_API_KEY=tu_api_key_aqui

# URL del Pipeline de VectorShift
VITE_VECTORSHIFT_URL=https://api.vectorshift.ai/v1/pipeline/6a18d98e001ef2c6ba628330/run
```

> ⚠️ **Nota:** El archivo `.env` está en el archivo `.gitignore` para evitar subir claves privadas al repositorio público.

---

## 🏃 Instrucciones de Ejecución

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

### 1. Clonar el repositorio e ingresar a la carpeta
```bash
git clone <URL_DEL_REPOSITORIO>
cd tp-final-productos
```

### 2. Instalar las dependencias de Node
```bash
npm install
```

### 3. Crear y configurar el archivo `.env`
Crea el archivo `.env` y añade las variables especificadas en la sección de configuración de entorno.

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Una vez ejecutado, abre la URL que se indica en la terminal (usualmente `http://localhost:5173/`).

### 5. Compilar el proyecto para producción
Para generar el compilado optimizado en la carpeta `dist/`:
```bash
npm run build
```
