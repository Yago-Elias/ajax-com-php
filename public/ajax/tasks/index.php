<?php

require "../../../config.php";

use app\models\Task;

$user_id = filter_input(INPUT_GET, 'user_id', FILTER_VALIDATE_INT);

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Usuário inválido.']);
    exit;
}

$task = new Task;
$tasks = $task->findByUser($user_id);

echo json_encode(['success' => true, 'data' => $tasks]);