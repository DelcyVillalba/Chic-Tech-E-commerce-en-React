# 🛍️ Chic & Tech — E-commerce en React

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Utility--First-38B2AC?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

Aplicación frontend del e-commerce **Chic & Tech**, construida con **React + Vite**, estilizada con **Tailwind CSS** e integrada a un backend propio desplegado en **Railway**.

Incluye catálogo, filtros, detalle, carrito persistente, login simulado y panel Admin.

---

## ✨ Características principales

- Catálogo por categorías (10 secciones) con búsqueda global, filtros, orden y paginación  
- Detalle de producto + acciones **“Agregar al carrito”** y **“Añadir a favoritos”**  
- Carrito con subtotal, IVA (21 %) y total, más flujo de checkout con pago simulado  
- Estado de carrito y sesión de usuario persistidos en **localStorage**  
- Registro y login reales contra la API (roles **Cliente** / **Admin**) + rutas protegidas  
- Panel Admin con CRUD de productos, gestión de usuarios, pedidos y reportes con gráficos  
- UI totalmente responsive con Tailwind y carruseles optimizados para mobile  
  
- Integración con backend real (Node + Express + PostgreSQL):
```
https://chic-tech-api-production.up.railway.app
```
---

## ⚙️ Tecnologías

- React 18  
- React Router DOM 6  
- Tailwind CSS  
- Axios  
- Context API (Auth + Cart)  
- Vite 5  

---

## 📦 Requisitos

- Node.js **18+**  
- npm

---

## 🚀 Instalación y ejecución

```
npm install
npm run dev
npm run build
npm run preview
```

### 👥 Usuarios demo para probar el flujo

La app ya viene preparada con usuarios de prueba conectados al backend:

| Rol    | Email             | Contraseña |
|--------|-------------------|-----------|
| Admin  | `admin@demo.com`  | `123456`  |
| Cliente| `cliente@demo.com`| `123456`  |

En el login, si ingresás como **Admin** tendrás acceso al panel interno; como **Cliente** podrás simular compras completas.

## 🌐 Variables de entorno
Crear ```.env``` en la raíz:

```
VITE_API_URL=https://chic-tech-api-production.up.railway.app
```

### 🛣️ Rutas principales
| Ruta                       | Descripción          | Icono |
| -------------------------- | -------------------- | ----- |
| `/`                        | Home + filtros       | 🏠     |
| `/product/:id`             | Detalle de producto  | 🛍️     |
| `/cart`                    | Carrito              | 🛒     |
| `/login`                   | Inicio de sesión     | 🔐     |
| `/admin/products`          | Panel Admin          | 🧭     |
| `/admin/products/new`      | Crear producto       | ➕     |
| `/admin/products/:id/edit` | Editar producto      | ✏️     |
| `*`                        |404 Página no encontrada | ❌     |



Rutas /admin/* protegidas por ProtectedRoute.

## 🧱 Arquitectura del estado
#### 🔐 AuthContext
- login / logout
- session persistida
- protección de rutas

#### 🛒 CartContext
- agregar / quitar / modificar cantidades
- persistencia en localStorage
- cálculos derivados

### 🔗 Comunicación con la API
```src/api/client.js``` define Axios:

```
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
});
```

#### Endpoints usados:

- /products

- /products/:id

- /orders

- /payments/simulado

- /auth/login

Backend oficial: Chic-Tech-API

---

#### 🎨 Estilos e i18n
* Tailwind

* Estilos globales en src/styles.css

* Traducciones simples en src/i18n/es.js

---

## 🚀 Despliegue (Vercel)
1. Importar repositorio

2. Variables:

```
VITE_API_URL=https://chic-tech-api-production.up.railway.app
```
3. Deploy automático 🔥

### 🧭 Troubleshooting
* 404 en rutas SPA → Vercel maneja fallback automáticamente

* Tailwind sin aplicar → revisar content[]

* Error de red → revisar variable VITE_API_URL

* Pantalla en blanco → plugin React faltante en Vite

* Filtros vacíos → categorías deben mantenerse en inglés

### 👩‍💻 Autora
**Delcy Villalba** 
E-commerce moderno con React, Vite y Tailwind.
Proyecto TalentoTech · 2025 💛✨
