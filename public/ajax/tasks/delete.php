<?php

require "../../../config.php";

use app\models\Task;

requireAuth();

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID inválido.']);
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
    echo json_encode(['success' => false, 'message' => 'Você não tem permissão para excluir esta tarefa.']);
    exit;
}

$deleted = $task->delete($id);

echo json_encode([
    'success' => (bool) $deleted,
    'message' => $deleted ? 'Tarefa excluída!' : 'Erro ao excluir tarefa.'
]);