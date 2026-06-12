<?php

$host = " sql204.infinityfree.com            ";
$database = " if0_42006414_tp_db           ";
$user = "   if0_42006414        ";   // default in XAMPP
$password = " Pablo4567   ";       // default in XAMPP

$conn = new mysqli($host, $database, $user, $password);



if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

echo "Database connected successfully";
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    $stmt = $conn->prepare("SELECT password FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_email'] = $email;
            header("Location: dashboard.php");
            exit();
        } else {
            $message = "Wrong password!";
        }
    } else {
        $message = "Email not found!";
    }
    $conn->close();
}
?>

<!DOCTYPE html>
<html>
<head><title>Login</title></head>
<body>
    <h2>Login</h2>
    <?php if ($message) echo "<p>$message</p>"; ?>
    <form method="post">
        Email: <input type="email" name="email" required><br>
        Password: <input type="password" name="password" required><br>
        <button type="submit">Login</button>
    </form>
    <a href="Register.php">Register</a>
</body>
</html>