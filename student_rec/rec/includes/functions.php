<?php

function sendJSON($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

function logAudit($conn, $userId, $username, $action, $details = '') {
    $stmt = $conn->prepare("
        INSERT INTO audit_logs (user_id, username, action, details)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$userId, $username, $action, $details]);
}
