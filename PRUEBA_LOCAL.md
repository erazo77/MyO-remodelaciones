# Prueba local del formulario de cotización

Para probar este formulario necesitas un servidor PHP. **Live Server no procesa PHP** y no sirve para esta prueba.

## 1. Instalar PHP

Instala PHP 8.1 o superior (por ejemplo, usando XAMPP) y confirma que está disponible:

```powershell
php -v
```

## 2. Iniciar el servidor

En la raíz de este proyecto ejecuta:

```powershell
php -S localhost:8000 -t .
```

Después abre `http://localhost:8000/` en el navegador.

## 3. Probar el flujo

1. Completa los campos obligatorios y pulsa **Enviar Solicitud**.
2. Debe aparecer una referencia como `000001`.
3. WhatsApp debe abrirse con la información de la solicitud.
4. Se crearán o actualizarán `api/data/contador.json` y `api/data/solicitudes.jsonl`.

Sin SMTP configurado, la prueba local puede mostrar que no se confirmó el correo. Esto no impide verificar la referencia, el almacenamiento y WhatsApp.

## 4. Probar también el correo

1. Copia `api/config.example.php` como `api/config.local.php`.
2. Completa la contraseña de `contacto@myo-remodelaciones.com` en ese archivo.
3. Reinicia el servidor PHP y realiza una prueba.

`api/config.local.php` contiene una contraseña y está excluido de Git: nunca lo publiques ni lo compartas.

## Nota sobre el error 405

Abrir `http://localhost:8000/api/cotizacion.php` directamente produce `405 Método no permitido`. Es el comportamiento esperado, porque esa ruta solo acepta solicitudes `POST` generadas por el formulario.
