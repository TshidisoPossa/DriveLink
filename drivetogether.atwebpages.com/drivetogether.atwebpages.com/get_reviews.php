<?php
// ============================================
//  get_reviews.php
//  Returns all reviews with vehicle + reviewer names
//  for the admin Reviews table.
// ============================================

header('Content-Type: application/json');
require_once 'db.php';

try {
    $stmt = $pdo->query("
        SELECT
            r.id,
            r.booking_id,
            r.reviewer_id,
            r.owner_id,
            r.car_id,
            r.rating_overall,
            r.rating_clean,
            r.rating_condition,
            r.rating_comms,
            r.rating_value,
            r.review_text,
            r.quick_tags,
            r.created_at,
            CONCAT(u.first_name, ' ', u.last_name) AS reviewer_name,
            v.make,
            v.model,
            v.year
        FROM reviews r
        LEFT JOIN users u    ON u.id = r.reviewer_id
        LEFT JOIN vehicles v ON v.id = r.car_id
        ORDER BY r.created_at DESC
    ");

    $reviews = $stmt->fetchAll();
    echo json_encode($reviews);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not load reviews.']);
}
