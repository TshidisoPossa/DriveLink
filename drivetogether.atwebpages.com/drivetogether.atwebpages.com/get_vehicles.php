<?php
// Database connection

$host     = 'fdb1032.awardspace.net';
$user     = '4767426_drive';
$password = 'Pablo@4567';
$database = '4767426_drive';
$port     = 3306;


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