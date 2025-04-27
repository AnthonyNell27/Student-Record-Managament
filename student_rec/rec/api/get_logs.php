<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

// ✅ Allow frontend to access this endpoint
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // You can optionally filter by user or action in future
    $query = "SELECT user_id, username, action, details, created_at FROM audit_logs ORDER BY created_at DESC";
    $stmt = $conn->query($query);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendJSON([
        'status' => 'success',
        'data' => $logs
    ]);
} catch (PDOException $e) {
    sendJSON(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], 500);
}
