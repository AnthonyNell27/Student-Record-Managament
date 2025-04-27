<?php
require_once '../includes/db.php';
require_once '../includes/functions.php';

$stmt = $conn->query("SELECT * FROM audit_logs ORDER BY created_at DESC");
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

sendJSON($logs);
