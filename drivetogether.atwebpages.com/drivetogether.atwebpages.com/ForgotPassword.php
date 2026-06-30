<?php
// ForgotPassword.php
// Handles two actions:
//   1. check_email  — verifies email exists in users table
//   2. update_password — updates password for that email

error_reporting(E_ALL);
ini_set('display_errors', 0); // Keep off so JSON is clean

header('Content-Type: application/json');

// ── Database connection ──
$host     = 'fdb1032.awardspace.net';
$user     = '4767426_drive';
$password = 'Pablo@4567';
$database = '4767426_drive';
$port     = 3306;

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed.'
    ]);
    exit;
}

// ── Only accept POST ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$action = trim($_POST['action'] ?? '');

// ══════════════════════════════════════
// ACTION 1 — Check if email exists
// ══════════════════════════════════════
if ($action === 'check_email') {

    $email = trim($_POST['email'] ?? '');

    if (empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Email is required.']);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    $email = $conn->real_escape_string($email);

    // Check if email exists in users table
    $sql    = "SELECT id, first_name FROM users WHERE email = '$email' LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            'success'    => true,
            'message'    => 'Email found.',
            'first_name' => $row['first_name']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No account found with that email address.'
        ]);
    }

    $conn->close();
    exit;
}

// ══════════════════════════════════════
// ACTION 2 — Update password
// ══════════════════════════════════════
if ($action === 'update_password') {

    $email    = trim($_POST['email']    ?? '');
    $password = trim($_POST['password'] ?? '');

    // Validation
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
        exit;
    }

    if (strlen($password) < 8) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    $email = $conn->real_escape_string($email);

    // Hash the new password securely
    // Using md5 to match your existing registration PHP
    // Change to password_hash() if you update your login.php to use password_verify()
    $hashedPassword = md5($password);

    // Update password in users table
    $sql = "UPDATE users SET password = '$hashedPassword' WHERE email = '$email' LIMIT 1";

    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Password updated successfully.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No account found with that email address.'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
    }

    $conn->close();
    exit;
}

// ── Unknown action ──
echo json_encode(['success' => false, 'message' => 'Unknown action.']);
$conn->close();
?>
