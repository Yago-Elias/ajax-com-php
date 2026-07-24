<?php

require '../../../config.php';

use app\models\User;

requireRole('admin');

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$name = trim(filter_input(INPUT_POST, 'name', FILTER_DEFAULT) ?? '');
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$password = trim(filter_input(INPUT_POST, 'password', FILTER_DEFAULT) ?? '');

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'E-mail inválido.']);
    exit;
}

if ($password && strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'A senha deve ter pelo menos 8 caracteres.']);
    exit;
}

$user = new User;

$exist = $user->findByEmailExceptId($email, $id);
if ($exist) {
    echo json_encode([
        'success' => false,
        'message' => 'Este email já está sendo usado por outro usuário.'
    ]);
    exit;
}

$updated = $user->update($id, $name, $email, $password ?: null);

echo json_encode([
    'success' => (bool) $updated,
    'message' => $updated ? 'Usuário atualizado com sucesso!' : 'Erro ao atualizar usuário.'
]);