<?php
// ============================================
//  get_car_ratings.php
//  Returns { car_id: { avg: 4.6, count: 12 }, ... } for all cars
// ============================================

header('Content-Type: application/json');
require_once 'db.php';

$stmt = $pdo->query("
    SELECT car_id,
           ROUND(AVG(rating_overall), 1) AS avg_rating,
           COUNT(*) AS review_count
    FROM reviews
    GROUP BY car_id
");

$result = [];
foreach ($stmt->fetchAll() as $row) {
    $result[$row['car_id']] = [
        'avg'   => (float) $row['avg_rating'],
        'count' => (int) $row['review_count'],
    ];
}

echo json_encode($result);
