<?php
// booking.php — saves booking request to database
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ── Database connection ──
$host     = 'sql204.infinityfree.com';
$user     = ' if0_42006414 ';
$password = 'Pablo4567';
$database = ' if0_42006414_tp_db';
$port     = 3310;

$conn = new mysqli($host, $user, $password, $database, $port);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// ── Only run on POST ──
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Collect form data sent from booking.html via JS fetch
    $car_id      = intval($_POST['car_id']      ?? 0);
    $car_name    = $conn->real_escape_string($_POST['car_name']    ?? '');
    $pickup_date = $conn->real_escape_string($_POST['pickup_date'] ?? '');
    $return_date = $conn->real_escape_string($_POST['return_date'] ?? '');
    $days        = intval($_POST['days']         ?? 0);
    $daily_rate  = floatval($_POST['daily_rate'] ?? 0);
    $service_fee = floatval($_POST['service_fee']?? 0);
    $total       = floatval($_POST['total']      ?? 0);
    $renter_id   = intval($_SESSION['user_id']   ?? 0);

    // Basic validation
    if (!$car_id || !$pickup_date || !$return_date || !$days || !$total) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
        exit;
    }

    if ($pickup_date >= $return_date) {
        echo json_encode(['success' => false, 'message' => 'Return date must be after pickup date.']);
        exit;
    }

    // Generate a unique booking reference  e.g. DL-2026-00482
    $ref = 'DL-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);

    // ── Insert booking into bookings table ──
    $sql = "INSERT INTO bookings
              (renter_id, car_id, car_name, pickup_date, return_date,
               days, daily_rate, service_fee, total_amount, status, reference, created_at)
            VALUES
              ('$renter_id','$car_id','$car_name','$pickup_date','$return_date',
               '$days','$daily_rate','$service_fee','$total','pending','$ref', NOW())";

    if ($conn->query($sql) === TRUE) {
        $booking_id = $conn->insert_id;

        // Return data so JS can pass it to bookingTwo.html
        echo json_encode([
            'success'    => true,
            'booking_id' => $booking_id,
            'reference'  => $ref,
            'car_name'   => $car_name,
            'pickup'     => $pickup_date,
            'return'     => $return_date,
            'days'       => $days,
            'daily_rate' => $daily_rate,
            'service_fee'=> $service_fee,
            'total'      => $total,
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
?>
