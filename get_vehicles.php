<?php

// Database connection
$host = " sql204.infinityfree.com     ";
$user = "  if0_42006414     ";
$password = " Pablo4567       ";
$database = " if0_42006414_tp_db   ";
$port = 3310;

$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}



$sql = "SELECT * FROM vehicles ORDER BY id DESC";
$result = $conn->query($sql);

$vehicles = [];

while ($row = $result->fetch_assoc()) {
    $vehicles[] = $row;
}

header("Content-Type: application/json");
echo json_encode($vehicles);

$conn->close();
?>