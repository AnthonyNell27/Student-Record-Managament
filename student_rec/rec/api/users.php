<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

try {
    $stmt = $conn->query("SELECT id, username, role FROM users ORDER BY id DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    sendJSON(['status' => 'success', 'data' => $users]);
} catch (PDOException $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
