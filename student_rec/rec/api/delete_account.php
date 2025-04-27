<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// Check required fields: ID, and audit info
if (empty($data['id']) || empty($data['user_id']) || empty($data['username'])) {
    sendJSON(['status' => 'error', 'message' => 'Missing required data'], 400);
}

try {
    // Fetch deleted username (optional, for logging)
    $stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$data['id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $deletedUsername = $user ? $user['username'] : 'Unknown';

    // Delete the account
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$data['id']]);

    // 📝 Audit log
    $details = "Deleted account '{$deletedUsername}' (user ID {$data['id']})";
    logAudit($conn, $data['user_id'], $data['username'], 'delete_account', $details);

    sendJSON(['status' => 'success', 'message' => 'Account deleted']);
} catch (PDOException $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
