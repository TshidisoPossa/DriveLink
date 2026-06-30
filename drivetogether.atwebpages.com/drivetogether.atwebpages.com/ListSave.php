<?php


// Database connection
$host = "fdb1032.awardspace.net";
$user = "4767426_drive";
$password = "Pablo@4567";
$database = "4767426_drive";

$port = 3310;

$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}



if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // TEXT FIELDS
    $make = $_POST['make'];
    $model = $_POST['model'];
    $year = $_POST['year'];
    $colour = $_POST['colour'];
    $registration = $_POST['registration'];
    $vin_number = $_POST['vin_number'];
    $kilometers = $_POST['kilometers'];
    $vehicle_category = $_POST['vehicle_category'];
    $transmission = $_POST['transmission'];
    $gearbox = $_POST['gearbox'];
    $fuel_type = $_POST['fuel_type'];

    $daily_rate = $_POST['daily_rate'];
    $weekly_rate = $_POST['weekly_rate'];
    $minimum_rental_period = $_POST['minimum_rental_period'];
    $booking_type = $_POST['booking_type'];
    $vehicle_features = $_POST['vehicle_features'];
    $daily_kilometer_rate = $_POST['daily_kilometer_rate'];
    $extra_kilometer_rate = $_POST['extra_kilometer_rate'];
    $minimum_driver_age = $_POST['minimum_driver_age'];

    // IMAGE UPLOAD FOLDER
    $uploadDir = "uploads/";

    // CREATE FOLDER IF NOT EXISTS
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // FRONT PHOTO
    $front_exterior_photo = $_FILES['front_exterior_photo']['name'];
    $frontTmp = $_FILES['front_exterior_photo']['tmp_name'];
    move_uploaded_file($frontTmp, $uploadDir . $front_exterior_photo);

    // BACK PHOTO
    $back_exterior_photo = $_FILES['back_exterior_photo']['name'];
    $backTmp = $_FILES['back_exterior_photo']['tmp_name'];
    move_uploaded_file($backTmp, $uploadDir . $back_exterior_photo);

    // OWNERSHIP PHOTO
    $proof_of_ownership_photo = $_FILES['proof_of_ownership_photo']['name'];
    $ownershipTmp = $_FILES['proof_of_ownership_photo']['tmp_name'];
    move_uploaded_file($ownershipTmp, $uploadDir . $proof_of_ownership_photo);

    // LICENCE DISK PHOTO
    $licence_disk_photo = $_FILES['licence_disk_photo']['name'];
    $licenceTmp = $_FILES['licence_disk_photo']['tmp_name'];
    move_uploaded_file($licenceTmp, $uploadDir . $licence_disk_photo);

    // INSERT INTO DATABASE
    $sql = "INSERT INTO vehicles (
        make,
        model,
        year,
        colour,
        registration,
        vin_number,
        kilometers,
        vehicle_category,
        transmission,
        gearbox,
        fuel_type,
        front_exterior_photo,
        back_exterior_photo,
        daily_rate,
        weekly_rate,
        minimum_rental_period,
        booking_type,
        vehicle_features,
        daily_kilometer_rate,
        extra_kilometer_rate,
        minimum_driver_age,
        proof_of_ownership_photo,
        licence_disk_photo
    ) VALUES (
        '$make',
        '$model',
        '$year',
        '$colour',
        '$registration',
        '$vin_number',
        '$kilometers',
        '$vehicle_category',
        '$transmission',
        '$gearbox',
        '$fuel_type',
        '$front_exterior_photo',
        '$back_exterior_photo',
        '$daily_rate',
        '$weekly_rate',
        '$minimum_rental_period',
        '$booking_type',
        '$vehicle_features',
        '$daily_kilometer_rate',
        '$extra_kilometer_rate',
        '$minimum_driver_age',
        '$proof_of_ownership_photo',
        '$licence_disk_photo'
    )";

    if ($conn->query($sql) === TRUE) {

        // REDIRECT TO DASHBOARD
        header("Location: Dashboard.php");
        exit();

    } else {

        echo "Error: " . $conn->error;

    }

}

?>