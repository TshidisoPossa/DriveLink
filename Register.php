<?php
// Show errors (helps debugging)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = "  sql204.infinityfree.com          ";
$user = " if0_42006414  ";
$password = " ";
$database = " if0_42006414_tp_db       ";
$port = 3306;

$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Run only when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $gender = $_POST['gender'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    $subIdPassport = $_POST['subIdPassport'];

    // IMPORTANT: must match HTML name="password"
    $Password = md5($_POST['password']);

    // Check if email exists
    $checkEmail = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($checkEmail);

    if ($result->num_rows > 0) {

        echo "Email Address already exists!";

    } else {

        // Insert user
        $insertQuery = "INSERT INTO users 
        (first_name, last_name, gender, email, phone, address, sub_id_passport, password)
        VALUES 
        ('$first_name', '$last_name', '$gender', '$email', '$phone', '$address', '$sub_id_passport', '$password')";

        if ($conn->query($insertQuery) === TRUE) {

            // ✅ PURE PHP REDIRECT (OPTION 1)
            header("Location: Login.html");
            exit();

        } else {
            echo "Error: " . $conn->error;
        }
    }
}

$conn->close();
?>