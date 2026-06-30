<?php
header("Content-Type: application/json");

$host     = 'fdb1032.awardspace.net';
$user     = '4767426_drive';
$password = 'Pablo@4567';
$database = '4767426_drive';
$port     = 3306;

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$sql = "SELECT id, first_name, last_name, email, role, status FROM users ORDER BY id DESC";
$result = $conn->query($sql);

$users = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);
$conn->close();
?>
