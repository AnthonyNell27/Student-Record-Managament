<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (empty($data['username']) || empty($data['password']) || empty($data['role'])) {
    sendJSON(['status' => 'error', 'message' => 'Missing required fields'], 400);
}

try {
    // Check if username exists
    $check = $conn->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $check->execute([$data['username']]);
    if ($check->fetchColumn() > 0) {
        sendJSON(['status' => 'error', 'message' => 'Username already exists'], 409);
    }

    // Insert new user with hashed password
    $stmt = $conn->prepare("
        INSERT INTO users (username, password, role)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([
        $data['username'],
        password_hash($data['password'], PASSWORD_BCRYPT),
        $data['role']
    ]);

    sendJSON(['status' => 'success', 'message' => 'Account created']);
} catch (PDOException $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
