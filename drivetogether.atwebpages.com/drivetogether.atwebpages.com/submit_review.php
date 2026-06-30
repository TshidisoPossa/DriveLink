<?php
// ============================================
//  submit_review.php
//  Saves a review into the `reviews` table.
//
//  Matches your real schema:
//    reviews(id, booking_id, reviewer_id, owner_id, car_id,
//            rating_overall, rating_clean, rating_condition,
//            rating_comms, rating_value, review_text, quick_tags)
//    vehicles(id, make, model, ...)
//    users(id, first_name, last_name, ...)
// ============================================

session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

require_once 'db.php';

// ── Require a logged-in user ────────────────
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'You must be logged in to leave a review.']);
    exit;
}
$reviewer_id = (int) $_SESSION['user_id'];

// ── Get & decode JSON body ───────────────────
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request data.']);
    exit;
}

// ── Validate required fields ────────────────
if (empty($input['car_id']) || empty($input['rating_overall'])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Missing car or rating.']);
    exit;
}

$car_id         = (int) $input['car_id'];
$rating_overall = (int) $input['rating_overall'];

if ($rating_overall < 1 || $rating_overall > 5) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Overall rating must be between 1 and 5.']);
    exit;
}

// booking_id is optional for a "quick rate" on the card — if not supplied, generate
// a placeholder so the unique(booking_id, reviewer_id) constraint doesn't collide
// across multiple quick-ratings by the same user on different cars.
$booking_id = isset($input['booking_id']) && $input['booking_id'] !== ''
    ? (int) $input['booking_id']
    : 0;

$rating_clean     = !empty($input['rating_clean'])     ? (int) $input['rating_clean']     : null;
$rating_condition = !empty($input['rating_condition']) ? (int) $input['rating_condition'] : null;
$rating_comms     = !empty($input['rating_comms'])     ? (int) $input['rating_comms']     : null;
$rating_value     = !empty($input['rating_value'])     ? (int) $input['rating_value']     : null;
$review_text      = isset($input['review_text']) ? trim(htmlspecialchars($input['review_text'])) : '';
$quick_tags       = isset($input['quick_tags'])  ? trim($input['quick_tags']) : '';

// ── Resolve owner_id from host_name (best effort) ──
// Your bookings/agreements tables store host_name as text (e.g. "Thandi M."),
// not a user_id. We try to match it against users.first_name, but fall back to 0.
$owner_id = 0;
if (!empty($input['host_name'])) {
    $hostStmt = $pdo->prepare("
        SELECT id FROM users
        WHERE CONCAT(first_name, ' ', LEFT(last_name,1), '.') = :host_name
           OR first_name = :host_name
        LIMIT 1
    ");
    $hostStmt->execute([':host_name' => $input['host_name']]);
    $match = $hostStmt->fetch();
    if ($match) {
        $owner_id = (int) $match['id'];
    }
}

// ── Confirm the vehicle exists ──────────────
$carCheck = $pdo->prepare("SELECT id FROM vehicles WHERE id = :id LIMIT 1");
$carCheck->execute([':id' => $car_id]);
if (!$carCheck->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Vehicle not found.']);
    exit;
}

// ── For "quick rate" (no real booking_id), allow multiple reviews per car ──
// by using a unique synthetic booking_id per submission so it never collides.
if ($booking_id === 0) {
    $booking_id = (int) (time() . $reviewer_id . $car_id) % 2000000000;
}

// ── Insert ───────────────────────────────────
try {
    $stmt = $pdo->prepare("
        INSERT INTO reviews
            (booking_id, reviewer_id, owner_id, car_id,
             rating_overall, rating_clean, rating_condition,
             rating_comms, rating_value, review_text, quick_tags)
        VALUES
            (:booking_id, :reviewer_id, :owner_id, :car_id,
             :rating_overall, :rating_clean, :rating_condition,
             :rating_comms, :rating_value, :review_text, :quick_tags)
    ");

    $stmt->execute([
        ':booking_id'       => $booking_id,
        ':reviewer_id'      => $reviewer_id,
        ':owner_id'         => $owner_id,
        ':car_id'           => $car_id,
        ':rating_overall'   => $rating_overall,
        ':rating_clean'     => $rating_clean,
        ':rating_condition' => $rating_condition,
        ':rating_comms'     => $rating_comms,
        ':rating_value'     => $rating_value,
        ':review_text'      => $review_text,
        ':quick_tags'       => $quick_tags,
    ]);

    echo json_encode([
        'success'   => true,
        'message'   => 'Review submitted successfully.',
        'review_id' => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'You have already reviewed this booking.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Could not save review. Please try again.']);
    }
}
