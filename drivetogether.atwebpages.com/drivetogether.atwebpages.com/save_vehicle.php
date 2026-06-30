<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection
$host     = "fdb1032.awardspace.net";
$user     = "4767426_drive";
$password = "Pablo@4567";
$database = "4767426_drive";
$port     = 3306;

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get POST data
$make                  = $_POST['make']                  ?? '';
$model                 = $_POST['model']                 ?? '';
$year                  = (int)($_POST['year']            ?? 0);
$colour                = $_POST['colour']                ?? '';
$registration          = $_POST['registration']          ?? '';
$vin_number            = $_POST['vin_number']            ?? '';
$kilometers            = (int)($_POST['kilometers']      ?? 0);
$vehicle_category      = $_POST['vehicle_category']      ?? '';
$transmission          = $_POST['transmission']          ?? '';
$gearbox               = $_POST['gearbox']               ?? '';
$fuel_type             = $_POST['fuel_type']             ?? '';
$daily_rate            = (float)($_POST['daily_rate']    ?? 0);
$weekly_rate           = (float)($_POST['weekly_rate']   ?? 0);
$minimum_rental_period = $_POST['minimum_rental_period'] ?? '1 day';
$booking_type          = $_POST['booking_type']          ?? 'Request book';
$vehicle_features      = $_POST['vehicle_features']      ?? '';
$daily_kilometer_rate  = (int)($_POST['daily_kilometer_rate']   ?? 0);
$extra_kilometer_rate  = (float)($_POST['extra_kilometer_rate'] ?? 0);
$minimum_driver_age    = (int)($_POST['minimum_driver_age']     ?? 18);

// Handle photo uploads
$upload_dir = "images/listings/";
if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

function uploadPhoto($file_key, $upload_dir) {
    if (!isset($_FILES[$file_key]) || $_FILES[$file_key]['error'] !== UPLOAD_ERR_OK) return null;
    $ext      = pathinfo($_FILES[$file_key]['name'], PATHINFO_EXTENSION);
    $filename = uniqid($file_key . '_') . '.' . $ext;
    $dest     = $upload_dir . $filename;
    move_uploaded_file($_FILES[$file_key]['tmp_name'], $dest);
    return $dest;
}

$front_exterior_photo     = uploadPhoto('front_exterior_photo', $upload_dir);
$back_exterior_photo      = uploadPhoto('back_exterior_photo', $upload_dir);
$proof_of_ownership_photo = uploadPhoto('proof_of_ownership_photo', $upload_dir);
$licence_disk_photo       = uploadPhoto('licence_disk_photo', $upload_dir);

// 23 columns = 23 type chars = 23 variables — all must match exactly
$sql = "INSERT INTO vehicles 
(make, model, year, colour, registration, vin_number, kilometers, vehicle_category, 
 transmission, gearbox, fuel_type, front_exterior_photo, back_exterior_photo,
 daily_rate, weekly_rate, minimum_rental_period, booking_type, vehicle_features,
 daily_kilometer_rate, extra_kilometer_rate, minimum_driver_age,
 proof_of_ownership_photo, licence_disk_photo)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

// Count: s s i s s s i s s s s s s d d s s s i d i s s = 23 types, 23 variables
$stmt->bind_param(
    "ssisssissssssddsssidiss",
    $make,                   // s
    $model,                  // s
    $year,                   // i
    $colour,                 // s
    $registration,           // s
    $vin_number,             // s
    $kilometers,             // i
    $vehicle_category,       // s
    $transmission,           // s
    $gearbox,                // s
    $fuel_type,              // s
    $front_exterior_photo,   // s
    $back_exterior_photo,    // s
    $daily_rate,             // d
    $weekly_rate,            // d
    $minimum_rental_period,  // s
    $booking_type,           // s
    $vehicle_features,       // s
    $daily_kilometer_rate,   // i
    $extra_kilometer_rate,   // d
    $minimum_driver_age,     // i
    $proof_of_ownership_photo, // s
    $licence_disk_photo        // s
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Vehicle listed successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Execute failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
