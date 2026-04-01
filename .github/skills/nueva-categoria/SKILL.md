---
name: nueva-categoria
description: "Crear una nueva página de categoría de ropa en StyleHub. Usa cuando el usuario pida agregar una nueva categoría (ej: 'blusas', 'shorts', 'abrigos'), una nueva sección de producto, o cuando diga 'nueva página de categoría', 'nueva sección de ropa', 'añadir categoría al catálogo'. Crea el HTML, CSS, JS específico de página y actualiza el modelo de backend en un flujo completo de 5 pasos."
argument-hint: "Nombre de la categoría, ej: blusas-mujer, shorts-hombre, abrigos"
---

# Crear Nueva Página de Categoría de Ropa

## Resultado que produce este skill

Una página de categoría funcional y completa, incluyendo:
- `<nombre>.html` — Página con navegación, grid de productos, filtros y paginación
- `assets/css/pages/<nombre>.css` — Estilos con el sistema de diseño de StyleHub
- `assets/js/pages/<nombre>.js` — Lógica de filtros, carrito, favoritos y búsqueda
- `backend/models/Product.js` actualizado — El nuevo `pageTarget` disponible en el enum de MongoDB

---

## Paso 0 — Recopilar información antes de crear nada

Antes de tocar cualquier archivo, pregunta al usuario o deduce del contexto:

| Dato | Ejemplo |
|------|---------|
| Nombre del archivo (sin `.html`) | `blusas-mujer` |
| Título que se muestra en la página | `Blusas para Mujer` |
| Descripción del banner superior | `Elegancia y estilo en cada blusa` |
| Sección de MongoDB (`section`) | `mujer` \| `hombre` \| `ninos` \| `general` |
| Categoría padre en la navegación | Mujer / Hombre / Niños |

> Si el usuario no especifica alguno, usa valores razonables y menciona qué asumiste.

---

## Paso 1 — Crear el archivo HTML

**Archivo destino:** `<nombre>.html` en la raíz del proyecto.

**Cómo hacerlo:** Copia la estructura de `camisetas.html` y adapta estas partes:

### Cambios obligatorios en el HTML

1. **`<title>`** → `<Título Categoría> - StyleHub`
2. **`<link rel="stylesheet" href="assets/css/pages/...">`** → apuntar al nuevo CSS
3. **Texto del banner** (busca la sección `.category-header`):
   ```html
   <h1 class="category-title"><Título Categoría></h1>
   <p class="category-description"><Descripción></p>
   ```
4. **Script de página** al final del body → cambiar a `assets/js/pages/<nombre>.js`
5. **Los 3 scripts compartidos** deben mantenerse en este orden exacto:
   ```html
   <script src="assets/js/auth.js"></script>
   <script src="assets/js/buyNow.js"></script>
   <script src="assets/js/dynamic-page-products.js"></script>
   <script src="assets/js/pages/<nombre>.js"></script>
   ```

### Lo que NO cambia
- La estructura del `<head>` (CDN, Google Fonts, `auth.css`, `responsive-global.css`)
- El `<script src="https://accounts.google.com/gsi/client" ...>`
- El `#g_id_onload` div de Google Identity
- La barra superior (`top-bar`), `header`, `nav` con dropdowns
- El modal de búsqueda y el modal de autenticación
- El id `productsGrid` y la clase `product-grid-category` en el grid

---

## Paso 2 — Crear el CSS de página

**Archivo destino:** `assets/css/pages/<nombre>.css`

**Cómo hacerlo:** Copia `assets/css/pages/camisetas.css` completo.

No es necesario modificar nada: el CSS usa variables y clases genéricas (`.product-card`, `.product-grid-category`, `.product-badge`, etc.) que funcionan igual en todas las categorías.

> Solo modifica si el usuario pide un color de acento o estilo visual diferente para esta categoría.

---

## Paso 3 — Crear el JS de página

**Archivo destino:** `assets/js/pages/<nombre>.js`

**Cómo hacerlo:** Copia `assets/js/pages/camisetas.js` y aplica estos cambios:

### Cambios obligatorios en el JS

1. **Reemplaza el array `productsData`** con entre 4 y 8 productos de ejemplo acordes a la categoría:
   ```js
   const productsData = [
     {
       id: <id_único>,          // Usa un número que no colisione con otras páginas
       name: "<nombre producto>",
       price: <número>,
       originalPrice: <número>,
       discount: <número>,
       image: "<url o ruta>",
       rating: 4.5,
       reviews: 100,
       badge: "<Etiqueta>"
     },
     // ...
   ]
   ```
   > Los IDs de productos locales no deben repetirse entre páginas. Consulta los IDs usados en otros archivos JS si hay dudas.

2. **Mantén sin cambios** todas las funciones (`loadProducts`, `setupFilters`, `setupSorting`, `setupAddToCart`, `setupMobileMenu`, `setupSearch`, `createProductCard`, etc.). Son genéricas y reutilizables.

---

## Paso 4 — Actualizar el modelo de backend

**Archivo:** `backend/models/Product.js`

Añade el nuevo archivo HTML al array `enum` del campo `pageTarget`:

```js
// Antes (ejemplo):
pageTarget: {
  type: String,
  enum: [
    'camisetas.html',
    'vestidos.html',
    // ... resto de páginas
    'index.html'
  ],
  default: 'index.html'
}

// Después — añadir la nueva página:
pageTarget: {
  type: String,
  enum: [
    'camisetas.html',
    'vestidos.html',
    // ... resto de páginas
    '<nombre>.html',   // ← AÑADIR AQUÍ
    'index.html'
  ],
  default: 'index.html'
}
```

> Esto permite que desde el panel de administración (`admin-dashboard.html`) se asignen productos a la nueva página.

---

## Paso 5 — Verificación final

Revisa estos puntos antes de declarar la tarea completa:

- [ ] `<nombre>.html` existe en la raíz del proyecto
- [ ] `assets/css/pages/<nombre>.css` existe
- [ ] `assets/js/pages/<nombre>.js` existe
- [ ] El `<title>` de la página es correcto
- [ ] Los 4 scripts al final del body están en el orden correcto
- [ ] El CSS correcto está enlazado en el `<head>`
- [ ] El JS de la página está enlazado al final del `<body>`
- [ ] `backend/models/Product.js` tiene `<nombre>.html` en el enum de `pageTarget`
- [ ] Los IDs de `productsData` no colisionan con otras páginas

---

## Contexto del proyecto StyleHub

### Flujo de datos (cómo llegan los productos a la página)
```
1. Página carga → camisetas.js renderiza productos locales (productsData)
2. dynamic-page-products.js detecta el nombre del archivo actual
3. Hace fetch GET /api/products?page=<nombre>.html
4. El backend filtra Product donde pageTarget = '<nombre>.html' e isActive = true
5. Los productos dinámicos se insertan en #productsGrid sin duplicar los locales
```

### Campos del modelo Product en MongoDB
| Campo | Tipo | Notas |
|-------|------|-------|
| `name` | String | Requerido |
| `price` | Number | Precio base |
| `discountPercent` | Number | 0-90; `finalPrice` se calcula en la API |
| `image` | String | URL de imagen |
| `description` | String | Texto corto |
| `section` | Enum | `mujer`, `hombre`, `ninos`, `ofertas`, `novedades`, `general` |
| `pageTarget` | Enum | Nombre del archivo HTML de destino |
| `isActive` | Boolean | Solo los activos aparecen en frontend |

### Archivos de referencia clave
- HTML base: `camisetas.html`
- CSS base: `assets/css/pages/camisetas.css`
- JS base: `assets/js/pages/camisetas.js`
- Módulo dinámico: `assets/js/dynamic-page-products.js`
- Modelo backend: `backend/models/Product.js`
- Ruta API: `backend/server.js` (GET `/api/products?page=`)
