<?php
// bookingTwo.php — saves final confirmed booking to database
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ── Database connection ──
$host ='fdb1032.awardspace.net';
$user= '4767426_drive';
$password = 'Pablo@4567';
$database = '4767426_drive';
$port= 3310;

$conn = new mysqli($host, $user, $password, $database, $port);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// ── Only accept POST ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

// ── Collect and sanitise inputs ──
$car_id      = intval($_POST['car_id']      ?? 0);
$car_name    = $conn->real_escape_string($_POST['car_name']    ?? '');
$pickup_date = $conn->real_escape_string($_POST['pickup_date'] ?? '');
$return_date = $conn->real_escape_string($_POST['return_date'] ?? '');
$days        = intval($_POST['days']         ?? 0);
$daily_rate  = floatval($_POST['daily_rate'] ?? 0);
$service_fee = floatval($_POST['service_fee']?? 0);
$total       = floatval($_POST['total']      ?? 0);
$note        = $conn->real_escape_string($_POST['note']        ?? '');
$renter_id   = intval($_SESSION['user_id']   ?? 0);

// ── Validation ──
if (!$car_name || !$pickup_date || !$return_date || !$days || !$total) {
    echo json_encode(['success' => false, 'message' => 'Missing required booking fields.']);
    exit;
}

if ($pickup_date >= $return_date) {
    echo json_encode(['success' => false, 'message' => 'Return date must be after pickup date.']);
    exit;
}

// ── Generate unique booking reference ──
$reference = 'DL-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);

// ── Create bookings table if it does not exist yet ──
$createTable = "CREATE TABLE IF NOT EXISTS bookings (
    id           INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    renter_id    INT          NOT NULL DEFAULT 0,
    car_id       INT          NOT NULL DEFAULT 0,
    car_name     VARCHAR(150) NOT NULL,
    pickup_date  DATE         NOT NULL,
    return_date  DATE         NOT NULL,
    days         INT          NOT NULL DEFAULT 1,
    daily_rate   DECIMAL(10,2) NOT NULL DEFAULT 0,
    service_fee  DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    note         TEXT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'pending',
    reference    VARCHAR(30)  NOT NULL,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

$conn->query($createTable);

// ── Insert booking ──
$sql = "INSERT INTO bookings
          (renter_id, car_id, car_name, pickup_date, return_date,
           days, daily_rate, service_fee, total_amount, note,
           status, reference, created_at)
        VALUES
          ('$renter_id','$car_id','$car_name','$pickup_date','$return_date',
           '$days','$daily_rate','$service_fee','$total','$note',
           'pending','$reference', NOW())";

if ($conn->query($sql) === TRUE) {
    $booking_id = $conn->insert_id;

    echo json_encode([
        'success'    => true,
        'booking_id' => $booking_id,
        'reference'  => $reference,
        'message'    => 'Booking request submitted successfully.'
    ]);

} else {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
}

$conn->close();
?>
