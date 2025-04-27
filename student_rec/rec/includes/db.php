<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host     = 'localhost';
$db       = 'student_db';
$user     = 'root';
$pass     = 'antotsojt123';
$charset  = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

try {
    $conn = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed',
        'details' => $e->getMessage(),
    ]);
    exit();
}
