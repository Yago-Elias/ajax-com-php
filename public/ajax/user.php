<?php

require '../../config.php';

use app\models\User;

$user = new User;
sleep(3);
$id = $_GET['id'];
echo json_encode($user->all());
