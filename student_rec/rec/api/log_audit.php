<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

// Set headers (optional but good for consistency)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get and decode input
$data = json_decode(file_get_contents("php://input"), true);

// Validate
$required = ['user_id', 'username', 'action'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        sendJSON(['status' => 'error', 'message' => "Missing field: $field"], 400);
    }
}

try {
    $stmt = $conn->prepare("
        INSERT INTO audit_logs (user_id, username, action, details)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['user_id'],
        $data['username'],
        $data['action'],
        $data['details'] ?? null
    ]);

    sendJSON(['status' => 'success', 'message' => 'Audit log recorded.']);
} catch (PDOException $e) {
    sendJSON(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], 500);
}
