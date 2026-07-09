<?php

require "../../config.php";

use app\models\User;

$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);

$user = new User;
$resultados = $user->buscar($name);
if (!$resultados || empty($resultados)) {
    echo 'nouser';
} else {
    echo json_encode($resultados);
}
