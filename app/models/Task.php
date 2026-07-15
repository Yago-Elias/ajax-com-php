<?php

namespace app\models;

class Task extends Model {
    protected $table = 'tasks';

    public function create($user_id, $title, $description) {
        $sql = "insert into {$this->table}(user_id, title, description) values(:user_id, :title, :description)";
        $create = $this->connection->prepare($sql);
        $create->bindValue(':user_id', $user_id);
        $create->bindValue(':title', $title);
        $create->bindValue(':description', $description);
        $create->execute();

        return $this->connection->lastInsertId();
    }

    public function findByUser($user_id) {
        $sql = "select * from {$this->table} where user_id = :user_id order by created_at desc";
        $find = $this->connection->prepare($sql);
        $find->bindValue(':user_id', $user_id);
        $find->execute();

        return $find->fetchAll();
    }

    public function updateStatus($id, $status) {
        $sql = "update {$this->table} set status = :status where id = :id";
        $update = $this->connection->prepare($sql);
        $update->bindValue(':status', $status);
        $update->bindValue(':id', $id);
        $update->execute();

        return $update->rowCount() > 0;
    }

    public function update($id, $title, $description) {
        $sql = "update {$this->table} set title = :title, description = :description where id = :id";
        $update = $this->connection->prepare($sql);
        $update->bindValue(':title', $title);
        $update->bindValue(':description', $description);
        $update->execute();

        return $update->rowCount() > 0;
    }
}