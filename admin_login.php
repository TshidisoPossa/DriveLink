<?php
// admin_login.php

// Simple hard-coded credentials
$valid_username = 'DriveLink@';
$valid_password = '4584';

// Get submitted values
$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Check credentials
if ($username === $valid_username && $password === $valid_password) {
    // Successful login – redirect to admin home
    header('Location: AdminHome.HTML');
    exit;
} else {
    // Failed login – show a basic message
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>DriveLink - Login Failed</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .card {
                background: #fff;
                padding: 24px 26px;
                border-radius: 6px;
                box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
                text-align: center;
                width: 320px;
            }
            .brand {
                font-size: 22px;
                margin-bottom: 12px;
            }
            .brand span {
                color: #1e6ed8;
                font-weight: bold;
            }
            .msg {
                color: #c0392b;
                margin-bottom: 18px;
                font-size: 14px;
            }
            a {
                color: #1e6ed8;
                text-decoration: none;
                font-size: 14px;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="brand"><span>DriveLink</span> Admin</div>
            <div class="msg">Invalid username or password.</div>
            <a href="AdminLogin.html">Back to login</a>
        </div>
    </body>
    </html>
    <?php
}
?>