# Backend (MongoDB local y Atlas)

Instrucciones rápidas para ejecutar el backend localmente y conectarlo a MongoDB en la máquina:

1. Crear `.env` en `backend/` (puedes copiar `.env.example`):

```
MONGODB_URI="mongodb://localhost:27017/pagina_prod"
PORT=3000
JWT_SECRET="pon_una_clave_segura_aqui"
```

2. Instalar dependencias e iniciar el servidor:

```bash
cd backend
npm install
npm run dev    # requiere nodemon, o usa `node server.js`
```

3. Endpoints principales:
- `GET /api/health` — estado
- `POST /api/auth/register` — { name, email, password }
- `POST /api/auth/login` — { email, password }
- `GET /api/users` — listar usuarios (sin password)
- `GET /api/cart` — listar items
- `POST /api/cart` — crear item de carrito

4. Notas:
- El backend usa `MONGODB_URI` del `.env`. Si Mongo corre local en `27017` la configuración por defecto en `.env.example` funciona.
- Guarda `JWT_SECRET` seguro en producción.

## Conectar con MongoDB Atlas

1. Crea un cluster en MongoDB Atlas.
2. Crea un usuario de base de datos con lectura y escritura.
3. Autoriza tu IP actual en `Network Access`.
4. Copia la cadena de conexión desde `Connect` > `Drivers`.
5. Sustituye `MONGODB_URI` en `.env` por la URL de Atlas.

Ejemplo:

```env
MONGODB_URI="mongodb+srv://TU_USUARIO:TU_PASSWORD@TU_CLUSTER.xxxxx.mongodb.net/pagina_prod?retryWrites=true&w=majority&appName=Cluster0"
PORT=3000
JWT_SECRET="pon_una_clave_segura_aqui"
```

6. Reinicia el backend:

```bash
cd backend
npm run dev
```

## Integracion con Mercado Pago en Render

Tu proyecto ya tiene implementado el flujo base de Mercado Pago en el backend:
- `POST /api/payments/create_preference`
- `POST /api/payments/webhook`
- `GET /api/payments/status/:paymentId`

Para que funcione bien en produccion necesitas configurar correctamente estas variables en Render:

```env
MP_ACCESS_TOKEN=APP_USR-o-TEST-segun-tu-cuenta
FRONTEND_URL=https://tu-dominio-del-frontend.com
BACKEND_PUBLIC_URL=https://tu-backend.onrender.com
MP_NOTIFICATION_URL=https://tu-backend.onrender.com/api/payments/webhook
MONGODB_URI=mongodb+srv://...
JWT_SECRET=una_clave_segura
```

### Que hace cada variable

- `MP_ACCESS_TOKEN`: credencial privada de Mercado Pago. Nunca debe quedar hardcodeada en el repositorio.
- `FRONTEND_URL`: dominio al que Mercado Pago devuelve al cliente despues del pago.
- `BACKEND_PUBLIC_URL`: URL publica del backend desplegado en Render.
- `MP_NOTIFICATION_URL`: webhook que Mercado Pago usa para avisar el resultado real del pago.

### Configuracion recomendada

1. En Mercado Pago crea una aplicacion y copia tus credenciales del entorno correcto (`TEST` para pruebas, `APP_USR` para produccion).
2. En Render configura todas las variables de entorno del backend.
3. Asegurate de que el frontend use el mismo dominio que declaras en `FRONTEND_URL`.
4. Verifica que esta URL responda `200 OK`:

```text
https://tu-backend.onrender.com/api/payments/webhook
```

5. Haz una compra de prueba con usuarios de prueba de Mercado Pago, no con cuentas reales mezcladas con credenciales `TEST`.
6. Confirma que el pago vuelva a `carrito.html` y que luego el backend actualice el pedido mediante el webhook.

### Flujo correcto de compra

1. El frontend envia carrito y comprador a `create_preference`.
2. El backend crea una preferencia en Mercado Pago y guarda un pedido `pending_payment` en MongoDB.
3. El cliente paga en Mercado Pago.
4. Mercado Pago redirige al frontend y tambien llama al webhook del backend.
5. El backend consulta el pago real y actualiza el pedido a `approved`, `pending`, `rejected` o `cancelled`.

### Errores comunes que frenan la conversion

- Usar un `MP_ACCESS_TOKEN` de prueba con URLs o cuentas de produccion.
- No configurar `MP_NOTIFICATION_URL` publica y accesible desde internet.
- Tener frontend y backend en dominios distintos pero sin reflejarlo en `FRONTEND_URL`.
- Probar pagos reales con credenciales `TEST` o viceversa.
- Guardar el token de Mercado Pago dentro del codigo fuente.

## Modelo de datos actual

Colección `users`
- `name`: String
- `email`: String, requerido, único
- `password`: String, requerido
- `createdAt`: Date

Colección `cartitems`
- `productId`: String
- `name`: String
- `qty`: Number
- `price`: Number
- `userEmail`: String
- `createdAt`: Date

## Script para crear colecciones e índices en Atlas

En [backend/db/atlas-init.js](/home/admin/Downloads/pagina/backend/db/atlas-init.js) tienes un script para `mongosh` que crea:
- base de datos `pagina_prod`
- colección `users` con validación básica
- colección `cartitems` con validación básica
- índice único en `users.email`
- índice en `cartitems.userEmail`
