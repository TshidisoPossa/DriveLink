<?php
session_start();
header('Content-Type: application/json');

// TEMP: turn these two on while debugging, then set display_errors back to 0
// once everything works, so real errors aren't exposed to site visitors.
error_reporting(E_ALL);
ini_set('display_errors', 1);

// IMPORTANT: turn off mysqli's "throw exception on error" mode.
// On PHP 8.1+, mysqli throws by default, which turns a simple connection
// problem into an uncaught exception -> blank 500 response -> "Network error"
// on the JS side, instead of the nice JSON error message this script expects.
mysqli_report(MYSQLI_REPORT_OFF);

$host     = 'fdb1032.awardspace.net';
$user     = '4767426_drive';
$password = 'Pablo@4567';
$database = '4767426_drive';
$port     = 3306;

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
    $car_name    = $conn->real_escape_string($_POST['car_name'] ?? '');
    $host_name   = $conn->real_escape_string($_POST['host_name'] ?? '');
    $pickup_date = $conn->real_escape_string($_POST['pickup_date'] ?? '');
    $return_date = $conn->real_escape_string($_POST['return_date'] ?? '');
    $days        = intval($_POST['days'] ?? 1);
    $daily_rate  = floatval($_POST['daily_rate'] ?? 0);
    $service_fee = floatval($_POST['service_fee'] ?? 0);
    $total       = floatval($_POST['total'] ?? 0);

    $car_id_raw = $_POST['car_id'] ?? 0;
    $car_id     = intval(preg_replace('/[^0-9]/', '', $car_id_raw));

    $invoice    = $conn->real_escape_string($_POST['invoice'] ?? '');
    $renter_id  = intval($_SESSION['user_id'] ?? 0);
    $signed_at  = date('Y-m-d H:i:s');
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    if ($booking_ref === '') {
        $booking_ref = 'DL-' . date('Y') . '-' . rand(10000, 99999);
    }
    if ($car_name === '') {
        $car_name = 'Vehicle';
    }
    if ($host_name === '') {
        $host_name = 'Owner';
    }
    if ($pickup_date === '') {
        $pickup_date = date('Y-m-d');
    }
    if ($return_date === '') {
        $return_date = date('Y-m-d', strtotime('+1 day'));
    }

    // Make sure the agreements table actually exists before inserting,
    // so we get a clean JSON error instead of a crash if it's missing.
    $checkAgreementsTable = $conn->query("SHOW TABLES LIKE 'agreements'");
    if (!$checkAgreementsTable || $checkAgreementsTable->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'message' => "Table 'agreements' does not exist in the database."
        ]);
        $conn->close();
        exit;
    }

    $sql = "INSERT INTO agreements
            (booking_ref, renter_id, car_id, car_name, host_name,
             pickup_date, return_date, days, daily_rate, service_fee,
             total_amount, invoice_ref, renter_signed, owner_signed,
             signed_at, ip_address, status, created_at)
            VALUES
            ('$booking_ref', '$renter_id', '$car_id', '$car_name', '$host_name',
             '$pickup_date', '$return_date', '$days', '$daily_rate', '$service_fee',
             '$total', '$invoice', 1, 1,
             '$signed_at', '$ip_address', 'fully_signed', NOW())";

    if ($conn->query($sql) === TRUE) {

        $checkBookingsTable = $conn->query("SHOW TABLES LIKE 'bookings'");
        if ($checkBookingsTable && $checkBookingsTable->num_rows > 0) {
            $updateBooking = "UPDATE bookings
                              SET status = 'agreement_signed'
                              WHERE reference = '$booking_ref'
                              LIMIT 1";
            $conn->query($updateBooking);
        }

        echo json_encode([
            'success'       => true,
            'agreement_ref' => $booking_ref,
            'message'       => 'Agreement signed and saved successfully.',
            'signed_at'     => $signed_at,
            'car_name'      => $car_name,
            'host_name'     => $host_name,
            'pickup_date'   => $pickup_date,
            'return_date'   => $return_date,
            'days'          => $days,
            'daily_rate'    => $daily_rate,
            'service_fee'   => $service_fee,
            'total'         => $total,
            'car_id'        => $car_id,
            'invoice'       => $invoice
        ]);

    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
    }

    $conn->close();

} catch (Throwable $e) {
    // Safety net: if anything above still throws unexpectedly,
    // return clean JSON instead of a blank 500 page.
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
