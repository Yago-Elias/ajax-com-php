<?php

require '../../../config.php';

use app\models\Task;

requireAuth();

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$title = trim(filter_input(INPUT_POST, 'title', FILTER_DEFAULT) ?? '');
$description = trim(filter_input(INPUT_POST, 'description', FILTER_DEFAULT) ?? '');

if (!$id || !$title) {
    echo json_encode(['success' => false, 'message' => 'Título é obrigarório.']);
    exit;
}

$task = new Task;
$existingTask = $task->find('id', $id);

if (!$existingTask) {
    echo json_encode(['success' => false, 'message' => 'Tarefa não encontrada.']);
    exit;
}

// apenas o dono da tarefa ou o admin pode editar
if ($_SESSION['user_role'] !== 'admin' && $existingTask->user_id != $_SESSION['user_id']) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Você não tem permissão para editar esta tarefa.']);
    exit;
}

$updated = $task->update($id, $title, $description);

echo json_encode([
    'success' => (bool) $updated,
    'message' => $updated ? 'Tarefa atualzada!' : 'Erro ao atualizar a tarefa.'
]);