<?php

require "../../../config.php";

use app\models\User;

$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);

$user = new User;
$users = $user->search($name);

if (!$users || empty($users)) {
    echo json_encode([
        'success' => false,
        'message' => 'Nenhum usuário encontrado.',
        'data' => []
    ]);
} else {
    echo json_encode([
        'success' => true,
        'data' => $users
    ]);
}
