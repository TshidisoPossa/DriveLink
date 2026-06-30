<?php
header("Content-Type: application/json");

$host     = "sql204.infinityfree.com";
$user     = "if0_42006414";
$password = "Pablo@4567";
$database = "if0_42006414_tp_db";
$port     = 3310;

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$sql = "SELECT * FROM bookings ORDER BY created_at DESC";
$result = $conn->query($sql);

$bookings = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}

echo json_encode($bookings);
$conn->close();
?>
