<?php
/**
 * M&O Remodelaciones y Acabados — Endpoint de solicitudes de cotización.
 *
 * En UNA sola petición:
 *   1. Asigna el siguiente número consecutivo (000001, 000002, ...), de forma atómica.
 *   2. Envía la solicitud por correo a MAIL_TO.
 *   3. Devuelve el número para que la web arme el mensaje de WhatsApp.
 *
 * Es idempotente: si el navegador reintenta con el mismo request_id, recibe el
 * MISMO número (no se "quema" uno nuevo) y solo se reenvía el correo si el
 * anterior falló.
 */

declare(strict_types=1);

// ===================== CONFIGURACIÓN =====================
const MAIL_TO          = 'contacto@myo-remodelaciones.com';
const MAIL_FROM        = 'contacto@myo-remodelaciones.com'; // Debe coincidir con la cuenta SMTP de Hostinger.
const MAIL_FROM_NAME   = 'M&O Remodelaciones y Acabados';
const SITE_HOSTS       = ['myo-remodelaciones.com', 'www.myo-remodelaciones.com'];
const DIGITOS          = 6;      // 000001
const LIMITE_POR_IP    = 5;      // solicitudes nuevas permitidas por IP...
const VENTANA_SEGUNDOS = 600;    // ...cada 10 minutos
const MAX_IDS_GUARDADOS = 1000;  // memoria de reintentos
// =========================================================

date_default_timezone_set('America/Bogota');

const DIR_DATOS    = __DIR__ . '/data';
const ARCHIVO_ESTADO = DIR_DATOS . '/contador.json';
const ARCHIVO_LOG    = DIR_DATOS . '/solicitudes.jsonl';

/**
 * Carga la configuracion SMTP privada. El archivo config.local.php no se
 * versiona ni se expone en el navegador; debe devolver un array con host,
 * puerto, cifrado, usuario, clave y tiempo_espera.
 */
function configuracionSmtp(): array
{
    static $configuracion = null;
    if ($configuracion !== null) {
        return $configuracion;
    }

    $configuracion = [];
    $archivo = __DIR__ . '/config.local.php';
    if (is_file($archivo)) {
        $cargada = require $archivo;
        if (is_array($cargada)) {
            $configuracion = $cargada;
        }
    }
    return $configuracion;
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function responder(array $datos, int $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fallo(string $mensaje, int $codigo)
{
    responder(['success' => false, 'error' => $mensaje], $codigo);
}

function limpiar($valor, int $max, bool $multilinea = false): string
{
    $t = is_string($valor) ? $valor : '';
    $t = str_replace("\r\n", "\n", $t);
    if (!$multilinea) {
        $t = str_replace(["\n", "\r"], ' ', $t);
    }
    $t = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $t) ?? '';
    $t = trim($t);
    return function_exists('mb_substr') ? mb_substr($t, 0, $max, 'UTF-8') : substr($t, 0, $max);
}

function asegurarCarpetaDatos(): void
{
    if (!is_dir(DIR_DATOS)) {
        if (!@mkdir(DIR_DATOS, 0775, true) && !is_dir(DIR_DATOS)) {
            throw new RuntimeException('No se pudo crear la carpeta de datos.');
        }
    }
    if (!is_writable(DIR_DATOS)) {
        throw new RuntimeException('La carpeta de datos no tiene permiso de escritura.');
    }
    $ht = DIR_DATOS . '/.htaccess';
    if (!is_file($ht)) {
        @file_put_contents($ht, "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
    }
}

/**
 * Ejecuta $fn con el estado bloqueado (flock). Todo lo que haga $fn sobre
 * $estado se guarda de forma atómica; así dos clientes simultáneos nunca
 * reciben el mismo número.
 */
function conEstado(callable $fn)
{
    asegurarCarpetaDatos();
    $fp = @fopen(ARCHIVO_ESTADO, 'c+');
    if ($fp === false) {
        throw new RuntimeException('No se pudo abrir el contador.');
    }
    try {
        if (!flock($fp, LOCK_EX)) {
            throw new RuntimeException('No se pudo bloquear el contador.');
        }
        $contenido = stream_get_contents($fp);
        $estado = ($contenido !== false && $contenido !== '') ? json_decode($contenido, true) : [];
        if (!is_array($estado)) {
            $estado = [];
        }
        $estado += ['ultimo' => 0, 'ids' => [], 'ips' => [], 'sal' => ''];
        if ($estado['sal'] === '') {
            $estado['sal'] = bin2hex(random_bytes(8));
        }
        $resultado = $fn($estado);
        if (!ftruncate($fp, 0)) {
            throw new RuntimeException('No se pudo actualizar el contador.');
        }
        rewind($fp);
        $serializado = json_encode($estado, JSON_UNESCAPED_UNICODE);
        if ($serializado === false || fwrite($fp, $serializado) === false || !fflush($fp)) {
            throw new RuntimeException('No se pudo guardar el contador.');
        }
        flock($fp, LOCK_UN);
        return $resultado;
    } finally {
        fclose($fp);
    }
}

function registrar(array $linea): void
{
    asegurarCarpetaDatos();
    $linea = ['fecha' => date('c')] + $linea;
    @file_put_contents(ARCHIVO_LOG, json_encode($linea, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
}

function formatearNumero(int $n): string
{
    return str_pad((string) $n, DIGITOS, '0', STR_PAD_LEFT);
}

function enlaceWhatsAppCliente(string $telefono): string
{
    $d = preg_replace('/\D/', '', $telefono) ?? '';
    if (strlen($d) === 10) {
        return 'https://wa.me/57' . $d;
    }
    if (strlen($d) === 12 && substr($d, 0, 2) === '57') {
        return 'https://wa.me/' . $d;
    }
    return '';
}

function h(string $t): string
{
    return htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function construirCorreo(string $numero, array $d): array
{
    $fecha = date('d/m/Y h:i A');
    $filas = [
        'Nombre'            => $d['nombre'],
        'Teléfono'          => $d['telefono'],
        'Correo'            => $d['email'],
        'Ciudad'            => $d['ciudad'],
        'Tipo de proyecto'  => $d['tipo_proyecto'],
        'Modalidad'         => $d['modalidad_contratacion'],
        'Presupuesto'       => $d['presupuesto'],
        'Tiempo deseado'    => $d['tiempo_proyecto'],
        'Contacto preferido' => $d['contacto_preferido'],
    ];
    $wa = enlaceWhatsAppCliente($d['telefono']);

    // ---- Texto plano ----
    $txt = "NUEVA SOLICITUD DE COTIZACIÓN N.º {$numero}\n{$fecha}\n\n";
    foreach ($filas as $k => $v) {
        $txt .= "{$k}: {$v}\n";
    }
    $txt .= "\nDescripción:\n{$d['descripcion']}\n";
    if ($wa !== '') {
        $txt .= "\nResponder por WhatsApp: {$wa}\n";
    }

    // ---- HTML ----
    $trs = '';
    foreach ($filas as $k => $v) {
        $trs .= '<tr><td style="padding:8px 12px;background:#f5f2ed;font-weight:600;width:38%;border-bottom:1px solid #e6dfd2">' . h($k)
              . '</td><td style="padding:8px 12px;border-bottom:1px solid #e6dfd2">' . h($v) . '</td></tr>';
    }
    $botonWa = $wa !== ''
        ? '<p style="margin:20px 0 0"><a href="' . h($wa) . '" style="background:#25d366;color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-weight:600">Responder por WhatsApp</a></p>'
        : '';
    $html = '<!DOCTYPE html><html lang="es"><body style="margin:0;background:#efebe4;font-family:Arial,Helvetica,sans-serif;color:#171717">'
        . '<div style="max-width:620px;margin:0 auto;background:#fff">'
        . '<div style="background:#171717;color:#fff;padding:18px 22px"><div style="font-size:13px;color:#d7c5a6">M&amp;O Remodelaciones y Acabados</div>'
        . '<div style="font-size:22px;font-weight:700;color:#b2956b;margin-top:4px">Cotización N.º ' . h($numero) . '</div>'
        . '<div style="font-size:12px;color:#bbb;margin-top:4px">' . h($fecha) . '</div></div>'
        . '<div style="padding:20px 22px"><table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:14px">' . $trs . '</table>'
        . '<h3 style="margin:22px 0 8px;font-size:15px;color:#b2956b">Descripción del proyecto</h3>'
        . '<div style="white-space:pre-wrap;font-size:14px;line-height:1.5;background:#f5f2ed;padding:12px 14px;border-radius:6px">' . h($d['descripcion']) . '</div>'
        . $botonWa . '</div></div></body></html>';

    return [$txt, $html];
}

function smtpRespuesta($conexion, array $esperados): void
{
    $respuesta = '';
    while (!feof($conexion)) {
        $linea = fgets($conexion, 1024);
        if ($linea === false) {
            break;
        }
        $respuesta .= $linea;
        // Las respuestas SMTP de varias lineas usan un guion tras el codigo.
        if (strlen($linea) < 4 || $linea[3] !== '-') {
            break;
        }
    }
    $codigo = (int) substr($respuesta, 0, 3);
    if (!in_array($codigo, $esperados, true)) {
        throw new RuntimeException('SMTP respondio ' . ($codigo ?: 'sin codigo') . '.');
    }
}

function smtpComando($conexion, string $comando, array $esperados): void
{
    if (fwrite($conexion, $comando . "\r\n") === false) {
        throw new RuntimeException('No se pudo escribir al servidor SMTP.');
    }
    smtpRespuesta($conexion, $esperados);
}

/** Envia por SMTP autenticado sin depender de Composer ni de una libreria externa. */
function enviarCorreoSmtp(string $asuntoMime, string $cabeceras, string $cuerpo): bool
{
    $cfg = configuracionSmtp();
    $host = trim((string) ($cfg['host'] ?? ''));
    $usuario = trim((string) ($cfg['usuario'] ?? ''));
    $clave = (string) ($cfg['clave'] ?? '');
    if ($host === '' || $usuario === '' || $clave === '') {
        return false;
    }

    $puerto = (int) ($cfg['puerto'] ?? 465);
    $cifrado = strtolower((string) ($cfg['cifrado'] ?? 'ssl'));
    $tiempoEspera = max(5, min(20, (int) ($cfg['tiempo_espera'] ?? 15)));
    if ($puerto < 1 || $puerto > 65535 || !in_array($cifrado, ['ssl', 'tls', 'ninguno'], true)) {
        throw new RuntimeException('Configuracion SMTP invalida.');
    }

    $destino = filter_var(MAIL_TO, FILTER_VALIDATE_EMAIL);
    $remitente = filter_var(MAIL_FROM, FILTER_VALIDATE_EMAIL);
    if ($destino === false || $remitente === false) {
        throw new RuntimeException('Direccion de correo SMTP invalida.');
    }

    $servidor = ($cifrado === 'ssl' ? 'ssl://' : '') . $host . ':' . $puerto;
    $conexion = @stream_socket_client($servidor, $errorNumero, $errorTexto, $tiempoEspera, STREAM_CLIENT_CONNECT);
    if ($conexion === false) {
        throw new RuntimeException('No se pudo conectar al servidor SMTP (' . $errorNumero . ').');
    }

    stream_set_timeout($conexion, $tiempoEspera);
    try {
        $saludo = preg_replace('/[^A-Za-z0-9.-]/', '', (string) ($_SERVER['HTTP_HOST'] ?? '')) ?: 'localhost';
        smtpRespuesta($conexion, [220]);
        smtpComando($conexion, 'EHLO ' . $saludo, [250]);
        if ($cifrado === 'tls') {
            smtpComando($conexion, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($conexion, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('No se pudo activar TLS para SMTP.');
            }
            smtpComando($conexion, 'EHLO ' . $saludo, [250]);
        }
        smtpComando($conexion, 'AUTH LOGIN', [334]);
        smtpComando($conexion, base64_encode($usuario), [334]);
        smtpComando($conexion, base64_encode($clave), [235]);
        smtpComando($conexion, 'MAIL FROM:<' . $remitente . '>', [250]);
        smtpComando($conexion, 'RCPT TO:<' . $destino . '>', [250, 251]);
        smtpComando($conexion, 'DATA', [354]);

        $mensaje = 'To: <' . $destino . ">\r\n"
            . 'Subject: ' . $asuntoMime . "\r\n"
            . $cabeceras . "\r\n\r\n"
            . $cuerpo;
        // RFC 5321: las lineas que empiezan por punto se escapan durante DATA.
        $mensaje = str_replace("\r\n.", "\r\n..", $mensaje);
        if (fwrite($conexion, $mensaje . "\r\n.\r\n") === false) {
            throw new RuntimeException('No se pudo enviar el contenido SMTP.');
        }
        smtpRespuesta($conexion, [250]);
        smtpComando($conexion, 'QUIT', [221]);
        return true;
    } finally {
        fclose($conexion);
    }
}

function enviarCorreo(string $numero, array $d): bool
{
    [$txt, $html] = construirCorreo($numero, $d);

    $asunto  = 'Cotización N.º ' . $numero . ' — ' . $d['nombre'];
    $asuntoMime = '=?UTF-8?B?' . base64_encode($asunto) . '?=';
    $remitente = '=?UTF-8?B?' . base64_encode(MAIL_FROM_NAME) . '?= <' . MAIL_FROM . '>';
    $limite = 'myo_' . bin2hex(random_bytes(8));

    $cabeceras = [
        'From: ' . $remitente,
        'Reply-To: ' . $d['nombre_seguro'] . ' <' . $d['email'] . '>',
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $limite . '"',
        'X-Mailer: MYO-Cotizaciones',
    ];

    $cuerpo  = "--{$limite}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n";
    $cuerpo .= chunk_split(base64_encode($txt), 76, "\r\n");
    $cuerpo .= "--{$limite}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n";
    $cuerpo .= chunk_split(base64_encode($html), 76, "\r\n");
    $cuerpo .= "--{$limite}--\r\n";

    $cab = implode("\r\n", $cabeceras);
    // SMTP autenticado es la opcion recomendada por Hostinger. Si config.local.php
    // todavia no existe, se conserva mail() como alternativa temporal.
    if (enviarCorreoSmtp($asuntoMime, $cab, $cuerpo)) {
        return true;
    }
    // -f fija el remitente de sobre (mejora SPF); algunos hosts lo bloquean, por eso hay un segundo intento.
    if (@mail(MAIL_TO, $asuntoMime, $cuerpo, $cab, '-f' . MAIL_FROM)) {
        return true;
    }
    return @mail(MAIL_TO, $asuntoMime, $cuerpo, $cab);
}

// ===================== FLUJO PRINCIPAL =====================

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fallo('Método no permitido.', 405);
}

// Solo peticiones originadas en el propio sitio.
$origen = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origen !== '') {
    $hostOrigen = strtolower((string) parse_url($origen, PHP_URL_HOST));
    $hostActual = strtolower(preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? '')) ?? '');
    if ($hostOrigen !== $hostActual && !in_array($hostOrigen, SITE_HOSTS, true)) {
        fallo('Origen no permitido.', 403);
    }
}

$crudo = file_get_contents('php://input', false, null, 0, 40000);
$in = is_string($crudo) ? json_decode($crudo, true) : null;
if (!is_array($in)) {
    fallo('Solicitud inválida.', 400);
}

// Trampa para bots.
if (limpiar($in['_honey'] ?? '', 50) !== '') {
    fallo('Solicitud inválida.', 400);
}

$requestId = strtolower(limpiar($in['request_id'] ?? '', 64));
if (!preg_match('/^[a-f0-9]{32}$/', $requestId)) {
    fallo('Solicitud inválida.', 400);
}

$d = [
    'nombre'                 => limpiar($in['nombre'] ?? '', 120),
    'telefono'               => limpiar($in['telefono'] ?? '', 40),
    'email'                  => limpiar($in['email'] ?? '', 160),
    'ciudad'                 => limpiar($in['ciudad'] ?? '', 100),
    'tipo_proyecto'          => limpiar($in['tipo_proyecto'] ?? '', 120),
    'modalidad_contratacion' => limpiar($in['modalidad_contratacion'] ?? '', 160),
    'presupuesto'            => limpiar($in['presupuesto'] ?? '', 120) ?: 'No indicado',
    'tiempo_proyecto'        => limpiar($in['tiempo_proyecto'] ?? '', 120) ?: 'No indicado',
    'contacto_preferido'     => limpiar($in['contacto_preferido'] ?? '', 120) ?: 'Por definir',
    'descripcion'            => limpiar($in['descripcion'] ?? '', 3000, true) ?: 'Sin descripción adicional',
];

$faltantes = [];
if (strlen($d['nombre']) < 2) { $faltantes[] = 'nombre'; }
$digitosTel = strlen(preg_replace('/\D/', '', $d['telefono']) ?? '');
if ($digitosTel < 7 || $digitosTel > 15) { $faltantes[] = 'teléfono'; }
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) { $faltantes[] = 'correo'; }
if ($d['ciudad'] === '') { $faltantes[] = 'ciudad'; }
if ($d['tipo_proyecto'] === '' || $d['tipo_proyecto'] === 'No indicado') { $faltantes[] = 'tipo de proyecto'; }
if ($d['modalidad_contratacion'] === '' || $d['modalidad_contratacion'] === 'No indicado') { $faltantes[] = 'modalidad'; }
if ($faltantes) {
    fallo('Revisa estos datos: ' . implode(', ', $faltantes) . '.', 422);
}
// Nombre apto para cabecera (sin comillas ni símbolos que rompan el formato).
$d['nombre_seguro'] = '=?UTF-8?B?' . base64_encode($d['nombre']) . '?=';

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$ahora = time();

// 1) Número consecutivo (atómico e idempotente).
try {
    $asignacion = conEstado(function (array &$e) use ($requestId, $ip, $ahora, $d): array {
        if (isset($e['ids'][$requestId])) {
            $previo = $e['ids'][$requestId];
            return ['n' => (int) $previo['n'], 'enviado' => (bool) $previo['enviado'], 'nuevo' => false];
        }

        $clave = hash('sha256', $ip . $e['sal']);
        $recientes = array_values(array_filter(
            $e['ips'][$clave] ?? [],
            static fn($t) => is_int($t) && $t > $ahora - VENTANA_SEGUNDOS
        ));
        if (count($recientes) >= LIMITE_POR_IP) {
            $e['ips'][$clave] = $recientes;
            return ['limite' => true];
        }
        $recientes[] = $ahora;
        $e['ips'][$clave] = $recientes;
        // Limpia IPs antiguas para que el archivo no crezca.
        foreach ($e['ips'] as $k => $marcas) {
            if (!is_array($marcas) || !$marcas || max($marcas) <= $ahora - VENTANA_SEGUNDOS) {
                unset($e['ips'][$k]);
            }
        }

        $e['ultimo'] = (int) $e['ultimo'] + 1;
        $e['ids'][$requestId] = ['n' => $e['ultimo'], 'enviado' => false, 't' => $ahora];
        if (count($e['ids']) > MAX_IDS_GUARDADOS) {
            $e['ids'] = array_slice($e['ids'], -MAX_IDS_GUARDADOS, null, true);
        }
        return ['n' => $e['ultimo'], 'enviado' => false, 'nuevo' => true];
    });
} catch (Throwable $err) {
    error_log('[cotizacion] contador: ' . $err->getMessage());
    fallo('No pudimos asignar el número de cotización. Inténtalo de nuevo.', 500);
}

if (!empty($asignacion['limite'])) {
    header('Retry-After: ' . VENTANA_SEGUNDOS);
    fallo('Has enviado varias solicitudes seguidas. Espera unos minutos o escríbenos por WhatsApp.', 429);
}

$numero = formatearNumero((int) $asignacion['n']);

// Respaldo: la solicitud queda guardada aunque el correo falle.
if ($asignacion['nuevo']) {
    $copia = $d;
    unset($copia['nombre_seguro']);
    registrar(['evento' => 'solicitud', 'numero' => $numero] + $copia);
}

// 2) Correo (solo si aún no se confirmó el envío de este número).
$correoEnviado = $asignacion['enviado'];
if (!$correoEnviado) {
    try {
        $correoEnviado = enviarCorreo($numero, $d);
    } catch (Throwable $err) {
        error_log('[cotizacion] correo: ' . $err->getMessage());
        $correoEnviado = false;
    }
    registrar(['evento' => $correoEnviado ? 'correo_enviado' : 'correo_fallido', 'numero' => $numero]);
    if ($correoEnviado) {
        try {
            conEstado(function (array &$e) use ($requestId): void {
                if (isset($e['ids'][$requestId])) {
                    $e['ids'][$requestId]['enviado'] = true;
                }
            });
        } catch (Throwable $err) {
            error_log('[cotizacion] marca: ' . $err->getMessage());
        }
    }
}

// 3) Respuesta.
responder(['success' => true, 'numero' => $numero, 'correo_enviado' => $correoEnviado]);
