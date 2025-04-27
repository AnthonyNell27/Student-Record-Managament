<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// ✅ Safer validation that doesn't falsely reject valid values like 0
$required = ['id', 'first_name', 'last_name', 'email', 'mobile_number', 'date_of_birth', 'user_id', 'username'];
foreach ($required as $key) {
    if (!isset($data[$key])) {
        sendJSON(['status' => 'error', 'message' => "Missing field: $key"], 400);
    }
    if (is_string($data[$key]) && trim($data[$key]) === '') {
        sendJSON(['status' => 'error', 'message' => "Empty value for: $key"], 400);
    }
}

try {
    // ✅ Update the student record
    $stmt = $conn->prepare("
        UPDATE students 
        SET first_name = ?, last_name = ?, email = ?, mobile_number = ?, date_of_birth = ?, date_modified = NOW()
        WHERE id = ?
    ");
    $stmt->execute([
        $data['first_name'],
        $data['last_name'],
        $data['email'],
        $data['mobile_number'],
        $data['date_of_birth'],
        $data['id']
    ]);

    // ✅ Detailed log for audit tracking
    $details = "Updated student #{$data['id']} - Name: {$data['first_name']} {$data['last_name']}, Email: {$data['email']}, Mobile: {$data['mobile_number']}, DOB: {$data['date_of_birth']}";
    logAudit($conn, $data['user_id'], $data['username'], 'update_student', $details);

    sendJSON(['status' => 'success', 'message' => 'Student updated']);
} catch (PDOException $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
