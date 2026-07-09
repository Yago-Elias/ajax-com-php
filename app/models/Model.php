<?php

namespace app\models;

abstract class Model {
    private $connection;

    public function __construct() {
        $this->connection = Connection::connect();
    }

    public function all() {
        $sql = "select * from {$this->table}";

        $all = $this->connection->prepare($sql);

        $all->execute();

        return $all->fetchAll();
    }

    public function find($field, $value) {
        $sql = "select * from {$this->table} where {$field} = ?";
        $find = $this->connection->prepare($sql);
        $find->bindValue(1, $value);
        $find->execute();

        return $find->fetch();
    }
}
