<?php
require '../../config.php';
requireAuth();
echo json_encode(['success' => true, 'message' => 'Você está autenticado!']);