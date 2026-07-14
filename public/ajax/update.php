<?php

require "../../config.php";

use app\models\User;

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_STRING);
$user = new User;
$updated = $user->update($id, $name, $email);

echo json_encode([
    'success' => (bool) $updated,
    'message' => $updated ? 'Usuário atualizado com sucesso.' : 'Erro ao atualizar usuário.'
]);