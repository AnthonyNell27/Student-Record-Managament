<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';
require_once '../email/sendAdminNotification.php';
require_once '../email/sendWelcomeEmail.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// ✅ Check for invalid JSON payload
if (!$data) {
    error_log("❌ Invalid JSON received: " . file_get_contents("php://input"));
    sendJSON(['status' => 'error', 'message' => 'Invalid JSON'], 400);
}

// ✅ Field validation
$requiredFields = ['first_name', 'last_name', 'email', 'mobile_number', 'date_of_birth'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        error_log("❌ Missing field: $field");
        sendJSON(['status' => 'error', 'message' => "Missing field: $field"], 400);
    }
}

try {
    $stmt = $conn->prepare("
        INSERT INTO students (first_name, last_name, email, mobile_number, date_of_birth, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $data['first_name'],
        $data['last_name'],
        $data['email'],
        $data['mobile_number'],
        $data['date_of_birth']
    ]);

    // ✅ Emails
    notifyAdmin($data);
    welcomeStudent($data);

    sendJSON(['status' => 'success', 'message' => 'Student added successfully']);
} catch (Exception $e) {
    error_log("❌ Database or email error: " . $e->getMessage());
    sendJSON(['status' => 'error', 'message' => 'Server error, check logs'], 500);
}
