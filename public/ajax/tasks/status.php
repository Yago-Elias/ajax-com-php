<?php

require "../../../config.php";

use app\models\Task;

requireAuth();

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$status = filter_input(INPUT_POST, 'status', FILTER_DEFAULT);

$validStatus = ['pending', 'done'];
if (!$id || !in_array($status, $validStatus, true)) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
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
    echo json_encode(['success' => false, 'message' => 'Você não tem permissão para alterar esta tarefa.']);
    exit;
}

$updated = $task->updateStatus($id, $status);

echo json_encode([
    'success' => (bool) $updated,
    'message' => $updated ? 'Status atualizado!' : 'Erro ao atualizar status.'
]);