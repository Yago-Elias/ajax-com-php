<?php

require '../../../config.php';

use app\models\User;

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$user = new User;
$deleted = $user->delete($id);
echo json_encode([
    'success' => (bool) $deleted,
    'message' => $deleted ? 'Usuário excluído com sucesso.' : 'Erro ao excluir usuário.'
]);
