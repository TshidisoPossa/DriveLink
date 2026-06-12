<?php



// Database connection
$host = " sql204.infinityfree.com         ";
$user = "  if0_42006414         ";
$password = " Pablo4567              ";
$database = "  if0_42006414_tp_db            ";
$port = 3310;

$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$make = $_POST['make'] ?? '';
$model = $_POST['model'] ?? '';
$year = $_POST['year'] ?? 0;
$colour = $_POST['colour'] ?? '';
$registration = $_POST['registration'] ?? '';
$vin_number = $_POST['vin_number'] ?? '';
$kilometers = $_POST['kilometers'] ?? 0;
$vehicle_category = $_POST['vehicle_category'] ?? '';
$transmission = $_POST['transmission'] ?? '';
$gearbox = $_POST['gearbox'] ?? '';
$fuel_type = $_POST['fuel_type'] ?? '';
$daily_rate = $_POST['daily_rate'] ?? 0;
$weekly_rate = $_POST['weekly_rate'] ?? 0;
$minimum_rental_period = $_POST['minimum_rental_period'] ?? '1 day';
$booking_type = $_POST['booking_type'] ?? 'Request book';
$vehicle_features = $_POST['vehicle_features'] ?? '';
$daily_kilometer_rate = $_POST['daily_kilometer_rate'] ?? 0;
$extra_kilometer_rate = $_POST['extra_kilometer_rate'] ?? 0;
$minimum_driver_age = $_POST['minimum_driver_age'] ?? 18;



$sql = "INSERT INTO vehicles 
(make, model, year, colour, registration, vin_number, kilometers, vehicle_category, transmission, gearbox, fuel_type, daily_rate, weekly_rate, minimum_rental_period, booking_type, daily_kilometer_rate, extra_kilometer_rate, minimum_driver_age)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

$stmt->bind_param(
    "ssisssissssddssidi",
    $make,
    $model,
    $year,
    $colour,
    $registration,
    $vin_number,
    $kilometers,
    $vehicle_category,
    $transmission,
    $gearbox,
    $fuel_type,
    $daily_rate,
    $weekly_rate,
    $minimum_rental_period,
    $booking_type,
    $daily_kilometer_rate,
    $extra_kilometer_rate,
    $minimum_driver_age
);



if ($stmt->execute()) {
    echo "success";
} else {
    echo "Execute failed: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>