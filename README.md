README - Subida del sitio a HostGator

Resumen
- Sitio estático: subir todos los archivos HTML y las carpetas `css/`, `js/`, `imagenes/` dentro de `public_html` en HostGator.
- No subir: `node_modules/` ni archivos temporales. Ya hay un archivo `.gitignore` en el repo.

Preparación local
1. Verifica que todas las referencias en los HTML sean rutas relativas (p. ej. `css/styles.css`, `js/script.js`, `imagenes/mi-imagen.jpg`).
2. Confirma nombres exactos en la carpeta `imagenes/` (HostGator usa Linux → nombres case-sensitive).
3. Elimina archivos innecesarios del paquete que vas a subir (build artefacts, `node_modules/`).
4. (Opcional) Crear un ZIP del contenido a subir desde la raíz del proyecto:

   PowerShell:
   ```powershell
   Compress-Archive -Path .\* -DestinationPath site.zip -Force
   ```

Subida via cPanel (recomendado)
1. Entra a tu cuenta de HostGator y abre `cPanel` → `File Manager`.
2. Abre la carpeta `public_html` (o la carpeta del dominio/subdominio destino).
3. Usar `Upload` para subir `site.zip` y luego `Extract` dentro de `public_html`, o subir archivos y carpetas directamente arrastrando.
4. Comprueba que `index.html` esté en `public_html` (archivo raíz del sitio).
5. Permisos: archivos `644`, carpetas `755` (normalmente no es necesario tocarlos, pero útil si hay problemas).

Subida via FTP (FileZilla)
1. Configura Host (host, usuario, contraseña, puerto 21) y conéctate en modo PASV.
2. Navega al directorio `public_html` en el servidor y arrastra los archivos/carpetas desde tu local.
3. Espera a que termine la transferencia y verifica que `index.html` exista en `public_html`.

Verificaciones después de subir
- Abre `https://tu-dominio.com/` y revisa:
  - Las imágenes se cargan correctamente (no hay 404). Si hay 404, revisa `imagenes/` y la mayúscula/minúscula del nombre.
  - `css/styles.css` y `js/*.js` se cargan (verificar en consola del navegador).
- Vacía caché del navegador si ves estilos antiguos (Ctrl+F5).
- Revisa la consola del navegador para errores de ruta o CORS.

Problemas comunes
- Rutas con mayúsculas/minúsculas distintas → corregir nombres en `imagenes/` o referencias.
- Archivo `index.html` faltante en `public_html` → sitio muestra listado o 404.
- Subiste `node_modules/` por error → eliminar del servidor para ahorrar espacio.

Notas de seguridad
- No subas archivos `.env` ni credenciales al servidor.
- Si usas API keys, muévelas al backend seguro o usa variables de entorno.

Próximos pasos que puedo hacer por ti
- Generar el ZIP listo para subir y excluir `node_modules`.
- Preparar comandos/guía para subir por FTP con FileZilla.
- Si me das acceso (credenciales), puedo subirlo y verificarlo directamente (no compartas credenciales en el repo; pásalos por un canal seguro si lo autorizas).

Contacto
- Si quieres, dime cómo prefieres subir (cPanel o FTP) y continúo con los pasos siguientes.