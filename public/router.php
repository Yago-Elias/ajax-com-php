<?php
/**
 * Router script para o servidor embutido do PHP (php -S).
 *
 * Uso:
 *   cd projeto/public
 *   php -S localhost:8000 router.php
 *
 * O que ele faz:
 * - Se a requisição corresponder a um arquivo real que existe dentro
 *   da pasta pública (ex: assets/js/user.js, imagens, css, etc.),
 *   deixa o servidor embutido servir esse arquivo normalmente.
 * - Caso contrário, encaminha a requisição para o index.php,
 *   permitindo que o roteamento da aplicação (se houver) trate a URL.
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// Caminho absoluto do arquivo solicitado, relativo à pasta atual (document root)
$file = __DIR__ . $uri;

// Se o arquivo existir fisicamente e não for um diretório, serve ele direto
if ($uri !== '/' && file_exists($file) && !is_dir($file)) {
    return false; // deixa o servidor embutido do PHP servir o arquivo estático
}

// Caso contrário, delega para o index.php
require __DIR__ . '/index.php';