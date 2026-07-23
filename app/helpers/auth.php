<?php

// verifica se o usuário está autenticado
function requireAuth() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
        exit;
    }
}

// verifica se o usuário tem acesso ao recurso
function requireRole($role) {
    requireAuth();

    if ($_SESSION['user_role'] !== $role) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Acesso negado.']);
        exit;
    }
}