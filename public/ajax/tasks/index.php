<?php

require "../../../config.php";

use app\models\Task;

requireAuth();

// usuário comum vizualiza apenas as próprias tarefas
if ($_SESSION['user_role'] !== 'admin') {
    $user_id = $_SESSION['user_id'];
} else {
    $user_id = filter_input(INPUT_GET, 'user_id', FILTER_VALIDATE_INT);
}

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Usuário inválido.']);
    exit;
}

$task = new Task;
$tasks = $task->findByUser($user_id);

echo json_encode(['success' => true, 'data' => $tasks]);