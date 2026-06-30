<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection — Awardspace
$host     = 'fdb1032.awardspace.net';
$user     = '4767426_drive';
$password = 'Pablo@4567';
$database = '4767426_drive';
$port     = 3306;

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$sql    = "SELECT * FROM users ORDER BY id DESC";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["status" => "error", "message" => "Query failed: " . $conn->error]);
    exit;
}

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);
$conn->close();
?>
