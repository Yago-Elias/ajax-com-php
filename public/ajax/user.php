<?php

require '../../config.php';

use app\models\User;

$user = new User;
$id = $_GET['id'];

if ($id) {
    echo json_encode($user->find('id', $id));
} else {
    echo json_encode($user->all());
}