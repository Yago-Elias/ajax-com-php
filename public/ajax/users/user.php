<?php

require '../../../config.php';

use app\models\User;

$user = new User;
$id = $_GET['id'];

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