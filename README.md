# 🛍️ Chic & Tech — E-commerce en React

Aplicación e-commerce de ejemplo construida con **React + Vite**, **Tailwind CSS** y **React Router**.  
Integra el catálogo público de **Fake Store API** para listar, filtrar y detallar productos.  
Incluye un **carrito persistente en localStorage** y un área de **administración protegida** con login simulado.

---

## ✨ Características principales

- Catálogo con búsqueda, filtros por categoría, orden y rango de precios  
- Paginación del listado de productos (en cliente)  
- Detalle de producto con acción **“Agregar al carrito”**  
- Carrito con cantidades, subtotal, impuestos opcionales (21 %) y total  
- Autenticación simulada (login) y rutas protegidas para el módulo Admin  
- CRUD de productos (crear, editar, eliminar) contra Fake Store API  
- Persistencia de carrito y sesión en **localStorage**  
- UI responsiva con **Tailwind CSS**  
- Traducciones simples al español para categorías y títulos comunes  

> ⚠️ **Nota:** Fake Store API es un servicio de prueba.  
> Las operaciones de escritura (POST / PUT / DELETE) pueden no persistir realmente.

---

## ⚙️ Stack técnico

- React 18, React DOM  
- Vite 5 (dev / build / preview)  
- React Router DOM 6  
- Axios  
- Tailwind CSS + PostCSS + Autoprefixer  

---

## 📦 Requisitos

- **Node.js 18** o superior (requerido por Vite 5)  
- **npm** (se usa npm ya que el proyecto incluye `package-lock.json`)

---

## 🚀 Instalación y ejecución

```bash
# 1) Instalar dependencias
npm install

# 2) Levantar en desarrollo (abre el navegador automáticamente)
npm run dev

# 3) Compilar para producción
npm run build

# 4) Previsualizar el build localmente
npm run preview
```
---
## 🧩 Scripts de npm

- `dev`: inicia el servidor de desarrollo de Vite
- `build`: compila la app a producción en `dist/`
- `preview`: sirve el build localmente
---
## 🛣️ Rutas principales

- `/` — Home (listado + filtros + paginación)
- `/product/:id` — Detalle de producto
- `/cart` — Carrito
- `/login` — Login (simulado)
- `/admin/products` — Admin (listado protegido)
- `/admin/products/new` — Crear producto (protegido)
- `/admin/products/:id/edit` — Editar producto (protegido)
- `*` — 404

Las rutas bajo `/admin/*` están protegidas con `ProtectedRoute`, que redirige a `/login` si no hay usuario autenticado.

---
## 🧱 Estado y arquitectura

- `AuthContext` (`src/context/AuthContext.jsx`)
  - `login(cred)`: usa `loginApi` para simular autenticación y guarda el `user` en `localStorage`
  - `logout()`: limpia sesión
  - Provee `{ user, login, logout }`
- `CartContext` (`src/context/CartContext.jsx`)
  - Estado del carrito persistido en `localStorage`
  - Acciones: `ADD`, `SET_QTY`, `REMOVE`, `CLEAR`
  - Derivados: `totalItems`, `totalPrice` y persiste en localStorage.
---

## 🔗Datos y API

- Cliente Axios en `src/api/client.js` con `baseURL: https://fakestoreapi.com` y timeout 8s
- Productos (`src/api/products.js`):
  - `listProducts()` GET `/products`
  - `getProduct(id)` GET `/products/:id`
  - `createProduct(body)` POST `/products`
  - `updateProduct(id, body)` PUT `/products/:id`
  - `deleteProduct(id)` DELETE `/products/:id`
  - `listCategories()` GET `/products/categories`
- Autenticación (`src/api/auth.js`): `loginApi` valida presencia de credenciales y retorna un objeto de usuario simulado `{ email, role: "admin", token: "fake.jwt.token" }`
---

## 💎Hooks personalizados

- `useProducts(params)`
  - Descarga el catálogo una sola vez y filtra/ordena/pagina en cliente
  - `params`: `{ q, category, sort, min, max, page, perPage }`
- `useProduct(id)`
  - Descarga un producto por `id`

---
## 🎨 Estilos e i18n

- Tailwind: configurado en `tailwind.config.js` y `postcss.config.js`. Estilos globales en `src/styles.css`.
- Traducciones ligeras (`src/i18n/es.js`):
  - Traducción de categorías `tCategory`
  - Reglas simples para títulos (`rules`) y helper `translate(p)`

---
## 🧵 Despliegue

- Build estático en `dist/`. Puede alojarse en cualquier host estático (Netlify, Vercel, GitHub Pages, etc.)
- Para subpath (por ejemplo: GitHub Pages), ajustar `base` de Vite en `vite.config.js`

---
## 🧭 Solución de problemas

- Node incompatible: usar Node 18+

- Tailwind sin aplicar: verificar content en tailwind.config.js

- Pantalla en blanco: agregar plugin React en vite.config.js

- Error de red: revisar conexión con Fake Store API

- 404 en rutas: configurar fallback SPA

- “Unknown @tailwind” en VS Code: instalar Tailwind IntelliSense o ignorar el warning

- Filtro por categoría vacío: mantener p.category en EN y mostrar categoryEs

- Errores aleatorios: borrar node_modules y reinstalar dependencias

---
## 👩‍💻 Autora

#### Delcy Villalba.
Proyecto TalentoTech - 2025 Curso React
Hecho con **React, Vite**, **Tailwind CSS** y mucho cariño. 💛