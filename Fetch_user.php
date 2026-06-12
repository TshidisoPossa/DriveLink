<?php

$conn = new mysqli("localhost", "root", "", "drivelink");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM users ORDER BY id DESC";

$result = $conn->query($sql);

$users = [];

while($row = $result->fetch_assoc()){
    $users[] = $row;
}

echo json_encode($users);

$conn->close();

?>