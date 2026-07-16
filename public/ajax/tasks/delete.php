<?php

require "../../../config.php";

use app\models\Task;

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID inválido.']);
    exit;
}

$task = new Task;
$deleted = $task->delete($id);

echo json_encode([
    'success' => (bool) $deleted,
    'message' => $deleted ? 'Tarefa excluída!' : 'Erro ao excluir tarefa.'
]);