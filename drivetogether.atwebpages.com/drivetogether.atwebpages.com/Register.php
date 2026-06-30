<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = "fdb1032.awardspace.net";
$user = "4767426_drive";
$db_password = "Pablo@4567";
$database = "4767426_drive";
$port = 3306;

$conn = new mysqli($host, $user, $db_password, $database, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $first_name = $_POST['first_name'] ?? '';
    $last_name = $_POST['last_name'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    $user_password = md5($_POST['password'] ?? '');

    $checkEmail = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($checkEmail);

    if ($result->num_rows > 0) {
        echo "Email Address already exists!";
    } else {

        $insertQuery = "INSERT INTO users 
        (first_name, last_name, gender, email, phone, address, password)
        VALUES 
        ('$first_name', '$last_name', '$gender', '$email', '$phone', '$address', '$user_password')";

        if ($conn->query($insertQuery) === TRUE) {
            header("Location: Login.html");
            exit();
        } else {
            echo "Error: " . $conn->error;
        }
    }
}

$conn->close();
?>