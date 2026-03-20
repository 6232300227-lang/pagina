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
