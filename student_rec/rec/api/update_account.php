<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id']) || empty($data['username']) || empty($data['role'])) {
    sendJSON(['status' => 'error', 'message' => 'Missing required fields'], 400);
}

try {
    // Optional: update password if provided
    if (!empty($data['password'])) {
        $stmt = $conn->prepare("UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?");
        $stmt->execute([
            $data['username'],
            password_hash($data['password'], PASSWORD_BCRYPT),
            $data['role'],
            $data['id']
        ]);
    } else {
        $stmt = $conn->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
        $stmt->execute([
            $data['username'],
            $data['role'],
            $data['id']
        ]);
    }

    sendJSON(['status' => 'success', 'message' => 'Account updated']);
} catch (PDOException $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
