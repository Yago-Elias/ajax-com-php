<?php

require '../../../config.php';

use app\models\Task;

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$title = trim(filter_input(INPUT_POST, 'title', FILTER_DEFAULT) ?? '');
$description = trim(filter_input(INPUT_POST, 'description', FILTER_DEFAULT) ?? '');

if (!$id || !$title) {
    echo json_encode(['success' => false, 'message' => 'Título é obrigarório.']);
    exit;
}

$task = new Task;
$updated = $task->update($id, $title, $description);

echo json_encode([
    'success' => (bool) $updated,
    'message' => $updated ? 'Tarefa atualzada!' : 'Erro ao atualizar a tarefa.'
]);