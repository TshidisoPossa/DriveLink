<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

mysqli_report(MYSQLI_REPORT_OFF);

$host     = 'fdb1032.awardspace.net';
$user     = '4767426_drive';
$password = 'Pablo@4567';
$database = '4767426_drive';
$port     = 3306;

try {

    $conn = new mysqli($host, $user, $password, $database, $port);

    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request.']);
        exit;
    }

    $vehicle_id = intval($_POST['vehicle_id'] ?? 0);
    $newStatus  = $conn->real_escape_string($_POST['status'] ?? 'Flagged');

    $allowed = ['Active', 'Pending', 'Flagged'];
    if (!in_array($newStatus, $allowed)) {
        echo json_encode(['success' => false, 'message' => 'Invalid status value.']);
        exit;
    }

    if ($vehicle_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid vehicle id.']);
        exit;
    }

    $sql = "UPDATE vehicles SET status = '$newStatus' WHERE id = $vehicle_id LIMIT 1";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'success' => true,
            'message' => "Vehicle status updated to $newStatus.",
            'status'  => $newStatus
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    }

    $conn->close();

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
