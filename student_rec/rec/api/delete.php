<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// ✅ Validate required data
if (empty($data['id']) || empty($data['user_id']) || empty($data['username'])) {
    sendJSON(['status' => 'error', 'message' => 'Missing required fields'], 400);
}

try {
    // ✅ Soft delete student
    $stmt = $conn->prepare("UPDATE students SET deleted_at = NOW() WHERE id = ?");
    $stmt->execute([$data['id']]);

    // ✅ Log audit
    logAudit(
        $conn,
        $data['user_id'],
        $data['username'],
        'delete_student',
        'Deleted student with ID: ' . $data['id']
    );

    sendJSON(['status' => 'success', 'message' => 'Student soft deleted']);
} catch (PDOException $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
