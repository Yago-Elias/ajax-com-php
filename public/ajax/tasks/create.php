<?php

require "../../../config.php";

use app\models\Task;

$user_id = filter_input(INPUT_POST, 'user_id', FILTER_VALIDATE_INT);
$title = trim(filter_input(INPUT_POST, 'title', FILTER_DEFAULT) ?? '');
$description = trim(filter_input(INPUT_POST, 'description', FILTER_DEFAULT) ?? '');

if (!$user_id || !$title) {
    echo json_encode(['success' => false, 'message' => 'Título é obrigatório.']);
    exit;
}

$task = new Task;
$id = $task->create($user_id, $title, $description);

echo json_encode([
    'success' => (bool) $id,
    'message' => $id ? 'Tarefa criada com sucesso!' : 'Erro ao criar tarefa.',
    'data' => ['id' => $id]
]);