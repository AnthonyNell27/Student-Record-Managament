<?php
// Allow requests from any origin (for dev)
header('Access-Control-Allow-Origin: *');

// Force download behavior and set CORS headers
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=students.csv');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');

require_once '../includes/db.php';


// Open output stream
$output = fopen('php://output', 'w');

// Add BOM for Excel UTF-8 compatibility
fwrite($output, "\xEF\xBB\xBF");

// Write CSV headers
fputcsv($output, ['ID', 'First Name', 'Last Name', 'Email', 'Mobile', 'DOB', 'Registered At']);

// Fetch and write student data
$stmt = $conn->query("SELECT id, first_name, last_name, email, mobile_number, date_of_birth, created_at FROM students WHERE deleted_at IS NULL");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Optional: Sanitize fields
    $cleanRow = array_map(function ($val) {
        return is_string($val) ? trim($val) : $val;
    }, $row);
    
    fputcsv($output, $cleanRow);
}

fclose($output);
exit;
