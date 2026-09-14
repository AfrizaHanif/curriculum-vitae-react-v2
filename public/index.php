<?php
/**
 * Fallback DirectoryIndex Entry Point for Hostinger / LiteSpeed Web Server.
 * If LiteSpeed looks for index.php before index.html, this loads the static Next.js index.html.
 */
if (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
    exit;
}

http_response_code(404);
if (file_exists(__DIR__ . '/404.html')) {
    readfile(__DIR__ . '/404.html');
    exit;
}
echo "404 Not Found";
