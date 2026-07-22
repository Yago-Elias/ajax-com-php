<?php

require __DIR__ . '/../config.php';

use app\models\Connection;

$pdo = Connection::connect();

$pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
");

// --- Adiciona colunas de autenticação, se ainda não existirem ---
$colunas = $pdo->query("PRAGMA table_info(users)")->fetchAll(PDO::FETCH_ASSOC);
$nomesColunas = array_column($colunas, 'name');

if (!in_array('password', $nomesColunas, true)) {
    $pdo->exec("ALTER TABLE users ADD COLUMN password TEXT");
    echo "Coluna 'password' adicionada." . PHP_EOL;
}

if (!in_array('role', $nomesColunas, true)) {
    $pdo->exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'");
    echo "Coluna 'role' adicionada." . PHP_EOL;
}

// --- Cria um admin padrão, só se ainda não existir nenhum ---
$existeAdmin = $pdo->query("SELECT COUNT(*) as total FROM users WHERE role = 'admin'")->fetch(PDO::FETCH_ASSOC);

if ((int) $existeAdmin['total'] === 0) {
    $senhaHash = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, 'admin')");
    $stmt->execute([
        ':name' => 'Administrador',
        ':email' => 'admin@yeas.com',
        ':password' => $senhaHash,
    ]);
    echo "Usuário admin padrão criado (email: admin@yeas.com, senha: admin123)." . PHP_EOL;
}

echo "Migração concluída com sucesso." . PHP_EOL;