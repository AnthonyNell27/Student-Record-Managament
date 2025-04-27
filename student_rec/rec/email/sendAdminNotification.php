<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../includes/config.php';

function notifyAdmin($data) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = 'tls';
        $mail->Port = SMTP_PORT;

        $mail->setFrom(SMTP_USER, 'Student Registration');
        $mail->addAddress(ADMIN_EMAIL);

        $mail->isHTML(true);
        $mail->Subject = '📥 New Student Registered';
        $mail->Body = "
            A new student has registered:<br><br>
            <strong>Name:</strong> {$data['first_name']} {$data['last_name']}<br>
            <strong>Email:</strong> {$data['email']}<br>
            <strong>Mobile:</strong> {$data['mobile_number']}<br>
            <strong>Date of Birth:</strong> {$data['date_of_birth']}<br>
            <strong>Registered At:</strong> " . date('Y-m-d H:i:s');

        $mail->send();
    } catch (Exception $e) {
        error_log("Admin notification failed: " . $mail->ErrorInfo);
    }
}
