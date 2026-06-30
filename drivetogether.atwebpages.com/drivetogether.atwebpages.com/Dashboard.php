<?php
session_start();
if (!isset($_SESSION['user_email'])) {
    header("Location: login.php");
    exit();
	
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

$sql = "SELECT * FROM cars ORDER BY id DESC";
$result = $conn->query($sql);	


	
	
	
	
	
	
	
	
	
}
?>
<?php
session_start();

// Database connection
$host = "localhost";
$user = "root";
$password = "";
$database = "users_db";
$port = 3310;

$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// FETCH CARS FROM DATABASE
$sql = "SELECT * FROM cars ORDER BY id DESC";
$result = $conn->query($sql);

?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>

    <style>

        body{
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        .top-bar{
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:30px;
        }

        .logout-btn{
            text-decoration:none;
            background:#2563eb;
            color:white;
            padding:10px 18px;
            border-radius:8px;
        }

        .cars-container{
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
            gap:20px;
        }

        .car-card{
            background:white;
            border-radius:15px;
            overflow:hidden;
            box-shadow:0 2px 10px rgba(0,0,0,0.1);
        }

        .car-card img{
            width:100%;
            height:220px;
            object-fit:cover;
        }

        .car-info{
            padding:20px;
        }

        .car-info h3{
            margin:0 0 10px;
        }

        .price{
            color:#2563eb;
            font-size:20px;
            font-weight:bold;
            margin-top:10px;
        }

        .book-btn{
            display:block;
            width:100%;
            background:#2563eb;
            color:white;
            border:none;
            padding:12px;
            border-radius:10px;
            margin-top:15px;
            cursor:pointer;
            font-size:16px;
        }

    </style>

</head>

<body>

<div class="top-bar">

    <h2>
        Welcome <?php echo $_SESSION['first_name'] ?? 'User'; ?>
    </h2>

    <a href="logout.php" class="logout-btn">
        Logout
    </a>

</div>

<div class="cars-container">

<?php

if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {

?>

    <div class="car-card">

        <img src="uploads/<?php echo $row['front_exterior_photo']; ?>" alt="Car Image">

        <div class="car-info">

            <h3>
                <?php echo $row['make']; ?>
                <?php echo $row['model']; ?>
                <?php echo $row['year']; ?>
            </h3>

            <p>
                <?php echo $row['vehicle_category']; ?>
            </p>

            <p>
                Fuel Type:
                <?php echo $row['fuel_type']; ?>
            </p>

            <p>
                Transmission:
                <?php echo $row['transmission']; ?>
            </p>

            <div class="price">
                R <?php echo $row['daily_rate']; ?>/day
            </div>

            <button class="book-btn">
                Book Now
            </button>

        </div>

    </div>

<?php

    }

} else {

    echo "<h3>No cars available</h3>";

}

?>
</div>
</body>
</html>

