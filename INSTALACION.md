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
- La carpeta `api/data/` debe tener permiso de escritura para PHP (normalmente **775**) y el archivo `api/data/contador.json` debe permitir escritura (normalmente **664**). Sube ambos, incluida la carpeta `data` y su `.htaccess`.

## Configuración (inicio de `api/cotizacion.php`)
- `MAIL_TO`: destino de las cotizaciones (ya es contacto@myo-remodelaciones.com).
- `MAIL_FROM`: remitente. Debe ser la misma cuenta configurada en SMTP; viene como `contacto@myo-remodelaciones.com`.
- `LIMITE_POR_IP`: 5 solicitudes cada 10 minutos por IP (anti-spam).

## SMTP recomendado en Hostinger

1. En hPanel abre **Emails > Administrar > Connect Apps & Devices** de `contacto@myo-remodelaciones.com`.
2. Copia `api/config.example.php` como `api/config.local.php` y coloca la contraseña de ese buzón. Ese archivo contiene un secreto: **no lo subas a Git**.
3. Para Hostinger Email usa `smtp.hostinger.com`, puerto `465` y `ssl`. Si tu plan indica STARTTLS, usa puerto `587` y `tls`.

El endpoint usa SMTP autenticado cuando existe esa configuración. Sin ella utiliza temporalmente `mail()`, pero Hostinger limita y desaconseja ese método para formularios de producción.

## Probar
1. Abre la web, llena el formulario y envía.
2. Debe mostrar **N.º 000001**, abrir WhatsApp con ese número y llegar el correo a contacto@.
3. Aunque el correo falle, la solicitud queda guardada en `api/data/solicitudes.jsonl` y la web lo avisa al cliente.

## Notas
- Para empezar en otro número, edita `"ultimo"` en `api/data/contador.json` (ej. `"ultimo": 99` → la próxima será 000100).
- Si tu servidor es **nginx** (no Apache), `.htaccess` no se aplica: bloquea el acceso web a `/api/data/` en la configuración del servidor, porque ahí quedan datos de clientes.
- Después de subir, si ves la versión vieja, haz recarga forzada (Ctrl+F5); el script ya usa `?v=20261015-1` para evitar la caché.
