<?php

require "../../config.php";

use app\models\User;

$user = new User;

$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_STRING);

$exist = $user->findByEmail($email);
if ($exist) {
    echo json_encode([
        'success' => false,
        'message' => 'Este email já está cadastrado.'
    ]);
    exit;
}

$id = $user->create($name, $email);

if ($id) {
    echo json_encode([
        'success' => true, 
        'message' => 'Usuário cadastrado com sucesso', 
        'data' => ['id' => $id]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao cadastrar usuário.'
    ]);
}