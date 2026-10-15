# Instalación — cotizaciones por correo con consecutivo

## Qué cambia
- El número de cotización ahora es un consecutivo de 6 dígitos: 000001, 000002, 000003…
- Cada solicitud llega por correo a **contacto@myo-remodelaciones.com** (HTML + texto, con botón "Responder por WhatsApp" al cliente y Reply-To al correo del cliente).
- Se hace **una sola petición** al servidor (antes eran dos: número y luego correo). Si el cliente reintenta, recibe el mismo número.
- El mensaje de WhatsApp lleva el N.º al inicio y recorta descripciones muy largas para no exceder el límite del enlace.
- Ya no se usa FormSubmit.

## Archivos
| Archivo | Acción |
|---|---|
| `index.html` | Reemplazar |
| `landing.js` | Reemplazar |
| `api/cotizacion.php` | Subir (nuevo) |
| `api/data/.htaccess` | Subir (nuevo, protege los datos) |

`api/cotizacion-numero.php` (el anterior) queda sin uso; puedes borrarlo cuando confirmes que todo funciona.

## Requisitos
- Hosting con **PHP 8.1 o superior** y la función `mail()` habilitada (casi todos los hostings cPanel/Plesk la tienen).
- La carpeta `api/data/` debe tener permiso de escritura para PHP (normalmente 755 o 775). El script la crea solo si no existe.

## Configuración (inicio de `api/cotizacion.php`)
- `MAIL_TO`: destino de las cotizaciones (ya es contacto@myo-remodelaciones.com).
- `MAIL_FROM`: remitente. **Debe ser una cuenta de tu dominio** (por ejemplo `no-reply@myo-remodelaciones.com` o la propia `contacto@`). Si los correos caen en spam, crea ese buzón en tu hosting y verifica que SPF/DKIM del dominio estén activos.
- `LIMITE_POR_IP`: 5 solicitudes cada 10 minutos por IP (anti-spam).

## Probar
1. Abre la web, llena el formulario y envía.
2. Debe mostrar **N.º 000001**, abrir WhatsApp con ese número y llegar el correo a contacto@.
3. Aunque el correo falle, la solicitud queda guardada en `api/data/solicitudes.jsonl` y la web lo avisa al cliente.

## Notas
- Para empezar en otro número, edita `"ultimo"` en `api/data/contador.json` (ej. `"ultimo": 99` → la próxima será 000100).
- Si tu servidor es **nginx** (no Apache), `.htaccess` no se aplica: bloquea el acceso web a `/api/data/` en la configuración del servidor, porque ahí quedan datos de clientes.
- Después de subir, si ves la versión vieja, haz recarga forzada (Ctrl+F5); el script ya usa `?v=20261015-1` para evitar la caché.
