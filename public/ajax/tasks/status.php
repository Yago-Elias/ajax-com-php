<?php

require "../../../config.php";

use app\models\Task;

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$status = filter_input(INPUT_POST, 'status', FILTER_DEFAULT);

$validStatus = ['pending', 'done'];
if (!$id || !in_array($status, $validStatus, true)) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
    exit;
}

$task = new Task;
$updated = $task->updateStatus($id, $status);

echo json_encode([
    'success' => (bool) $updated,
    'message' => $updated ? 'Status atualizado!' : 'Erro ao atualizar status.'
]);