<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->query("SELECT * FROM students WHERE deleted_at IS NULL");
    $students = $stmt->fetchAll();
    sendJSON(['status' => 'success', 'data' => $students]);
} else {
    sendJSON(['status' => 'error', 'message' => 'Invalid request method'], 405);
}
