<?php

require '../../../config.php';

use app\models\User;

session_start();

$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$password = filter_input(INPUT_POST, 'password', FILTER_DEFAULT);

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios.']);
    exit;
}

$user = new User;
$authenticated = $user->authenticate($email, $password);
if (!$authenticated) {
    echo json_encode(['success' => false, 'message' => 'Email ou senha inválidos.']);
    exit;
}

$_SESSION['user_id'] = $authenticated->id;
$_SESSION['user_name'] = $authenticated->name;
$_SESSION['user_email'] = $authenticated->email;
$_SESSION['user_role'] = $authenticated->role;

echo json_encode([
    'success' => true,
    'message' => 'Login realizado com sucesso.',
    'data' => [
        'id' => $authenticated->id,
        'name' => $authenticated->name,
        'email' => $authenticated->email,
        'role' => $authenticated->role
    ]
]);