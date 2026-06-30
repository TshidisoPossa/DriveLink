<?php
session_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

mysqli_report(MYSQLI_REPORT_OFF);

$host     = 'sql204.infinityfree.com';
$user     = 'if0_42006414';
$password = 'Pablo@4567';
$database = 'if0_42006414_tp_db';
$port     = 3310;

try {

    $conn = new mysqli($host, $user, $password, $database, $port);

    if ($conn->connect_error) {
        echo json_encode([
            'success' => false,
            'message' => 'Connection failed: ' . $conn->connect_error
        ]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid request.'
        ]);
        exit;
    }

    $booking_ref = $conn->real_escape_string($_POST['booking_ref'] ?? '');
    $renter_name = $conn->real_escape_string($_POST['renter_name'] ?? 'Tshidiso');
    $car_id      = $conn->real_escape_string($_POST['car_id'] ?? '');
    $car_name    = $conn->real_escape_string($_POST['car_name'] ?? 'Vehicle');
    $host_name   = $conn->real_escape_string($_POST['host_name'] ?? 'Host');
    $pickup_date = $conn->real_escape_string($_POST['pickup_date'] ?? date('Y-m-d'));
    $return_date = $conn->real_escape_string($_POST['return_date'] ?? date('Y-m-d', strtotime('+1 day')));
    $days        = intval($_POST['days'] ?? 1);
    $daily_rate  = floatval($_POST['daily_rate'] ?? 0);
    $service_fee = floatval($_POST['service_fee'] ?? 0);
    $deposit     = floatval($_POST['security_deposit'] ?? 0);
    $total       = floatval($_POST['total'] ?? 0);
    $renter_id   = intval($_SESSION['user_id'] ?? 0);

    if ($booking_ref === '') {
        $booking_ref = 'DL-' . date('Y') . '-' . rand(10000, 99999);
    }

    // Check the table exists before inserting, so we return a clean error
    // instead of crashing if it hasn't been created yet.
    $checkTable = $conn->query("SHOW TABLES LIKE 'bookings'");
    if (!$checkTable || $checkTable->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'message' => "Table 'bookings' does not exist yet. Run the setup SQL first."
        ]);
        $conn->close();
        exit;
    }

    $sql = "INSERT INTO bookings
            (booking_ref, renter_id, renter_name, car_id, car_name, host_name,
             pickup_date, return_date, days, daily_rate, service_fee,
             security_deposit, total_amount, payment_status, status, created_at)
            VALUES
            ('$booking_ref', $renter_id, '$renter_name', '$car_id', '$car_name', '$host_name',
             '$pickup_date', '$return_date', $days, $daily_rate, $service_fee,
             $deposit, $total, 'paid', 'confirmed', NOW())";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'success'     => true,
            'booking_ref' => $booking_ref,
            'message'     => 'Booking saved successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
    }

    $conn->close();

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
