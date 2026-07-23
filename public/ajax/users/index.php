<?php

require '../../../config.php';

use app\models\User;

requireRole('admin');

$user = new User;
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if ($id) {
    $data = $user->find('id', $id);
} else {
    $data = $user->all();
}

echo json_encode([
    'success' => (bool) $data, 
    'message' => 'Usuário encontrado.',
    'data' => $data
]);