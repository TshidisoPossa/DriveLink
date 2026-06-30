<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

mysqli_report(MYSQLI_REPORT_OFF);

// Database connection
$host = "fdb1032.awardspace.net";
$user = "4767426_drive";
$db_password = "Pablo@4567";
$database = "4767426_drive";
$port = 3306;

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

    $make         = $conn->real_escape_string($_POST['make'] ?? '');
    $model        = $conn->real_escape_string($_POST['model'] ?? '');
    $year         = intval($_POST['year'] ?? 0);
    $colour       = $conn->real_escape_string($_POST['colour'] ?? '');
    $registration = $conn->real_escape_string($_POST['plate'] ?? '');
    $vin          = $conn->real_escape_string($_POST['vin'] ?? '');
    $kilometers   = intval($_POST['odometer'] ?? 0);
    $category     = $conn->real_escape_string($_POST['category'] ?? '');
    $transmission = $conn->real_escape_string($_POST['transmission'] ?? 'Automatic');
    $fuel_type    = $conn->real_escape_string($_POST['fuel_type'] ?? 'Petrol');
    $daily_rate   = floatval($_POST['daily_rate'] ?? 0);
    $weekly_rate  = floatval($_POST['weekly_rate'] ?? 0);
    $min_period   = $conn->real_escape_string($_POST['min_period'] ?? '1 day');
    $features     = $conn->real_escape_string($_POST['features'] ?? '');
    $daily_km     = intval($_POST['max_km'] ?? 0);
    $min_age      = intval($_POST['min_age'] ?? 18);

    if ($make === '' || $model === '') {
        echo json_encode(['success' => false, 'message' => 'Make and model are required.']);
        exit;
    }

    $sql = "INSERT INTO vehicles
            (make, model, year, colour, registration, vin_number, kilometers,
             vehicle_category, transmission, gearbox, fuel_type,
             daily_rate, weekly_rate, minimum_rental_period, booking_type,
             vehicle_features, daily_kilometer_rate, extra_kilometer_rate, minimum_driver_age)
            VALUES
            ('$make', '$model', $year, '$colour', '$registration', '$vin', $kilometers,
             '$category', '$transmission', '$transmission', '$fuel_type',
             $daily_rate, $weekly_rate, '$min_period', 'Request book',
             '$features', $daily_km, 0, $min_age)";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'success'    => true,
            'vehicle_id' => $conn->insert_id,
            'message'    => 'Listing saved successfully.'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    }

    $conn->close();

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
