<?php
/**
 * Copia este archivo como config.local.php en la carpeta api y completa la
 * clave de la cuenta de correo. Nunca subas config.local.php a Git.
 *
 * En Hostinger: Emails > Administrar > Connect Apps & Devices. Usa los datos
 * de configuracion manual de la cuenta contacto@myo-remodelaciones.com.
 */
return [
    'host' => 'smtp.hostinger.com',
    'puerto' => 465,
    'cifrado' => 'ssl', // Tambien admite 'tls' con el puerto 587.
    'usuario' => 'contacto@myo-remodelaciones.com',
    'clave' => 'REEMPLAZA_CON_LA_CLAVE_DEL_CORREO',
    'tiempo_espera' => 15,
];
