<?php
session_start(); // ✅ Start session before using $_SESSION

require_once '../includes/db.php';
require_once '../includes/functions.php';

// ✅ CORS and headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Get JSON payload
$data = json_decode(file_get_contents("php://input"), true);

// ✅ Validate input
if (empty($data['username']) || empty($data['password'])) {
    sendJSON(['status' => 'error', 'message' => 'Missing credentials'], 400);
}

// ✅ Fetch user by username
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$data['username']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// ✅ Check password
if ($user && password_verify($data['password'], $user['password'])) {
    $_SESSION['user_id'] = $user['id'];

    sendJSON([
        'status' => 'success',
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role']
        ]
    ]);
}

// ❌ Invalid login fallback
sendJSON(['status' => 'error', 'message' => 'Invalid credentials'], 401);
