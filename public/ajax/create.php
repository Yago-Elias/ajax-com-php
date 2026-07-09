<?php

require "../../config.php";

use app\models\User;

$user = new User;

$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_STRING);

$cadastrado = $user->create($name, $email);

if ($cadastrado) {
    echo 'cadastrado';
} else {
    echo 'erro';
}