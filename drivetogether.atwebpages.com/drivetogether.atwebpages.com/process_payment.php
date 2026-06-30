<?php
header('Content-Type: application/json');

$agreement_ref = $_POST['agreement_ref'] ?? '';
$car_name = $_POST['car_name'] ?? '';
$amount = $_POST['amount'] ?? 0;
$payment_method = $_POST['payment_method'] ?? 'card';

if ($agreement_ref == '') {
    echo json_encode([
        "success" => false,
        "message" => "Missing agreement reference."
    ]);
    exit;
}

if ($amount <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid payment amount."
    ]);
    exit;
}

$payment_reference = 'PAY-' . date('Ymd') . '-' . rand(10000, 99999);

echo json_encode([
    "success" => true,
    "message" => "Payment processed successfully.",
    "payment_reference" => $payment_reference,
    "agreement_ref" => $agreement_ref,
    "car_name" => $car_name,
    "amount" => $amount,
    "payment_method" => $payment_method
]);
?>