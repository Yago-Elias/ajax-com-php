<?php

namespace app\models;

class User extends Model {
    protected $table = 'users';

    public function create($name, $email) {
        $sql = "insert into {$this->table}(name, email) values(:name, :email)";
        $create = $this->connection->prepare($sql);
        $create->bindValue(':name', $name);
        $create->bindValue(':email', $email);
        $create->execute();

        return $this->connection->lastInsertId();
    }

    public function search($name) {
        $sql = "select * from {$this->table} where name like :name";
        $search_user = $this->connection->prepare($sql);
        $search_user->bindValue(':name', "%". $name . "%");
        $search_user->execute();

        return $search_user->fetchAll();
    }

    public function update($id, $name, $email) {
        $sql = "update {$this->table} set name = :name, email = :email where id = :id";
        $update_user = $this->connection->prepare($sql);
        $update_user->bindValue(':id', $id);
        $update_user->bindValue(':name', $name);
        $update_user->bindValue(':email', $email);
        $update_user->execute();

        return $update_user->rowCount() > 0;
    }
}