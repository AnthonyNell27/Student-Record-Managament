<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../includes/config.php';

function welcomeStudent($data) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = 'tls';
        $mail->Port = SMTP_PORT;

        $mail->setFrom(SMTP_USER, 'Student Management System');
        $mail->addAddress($data['email'], $data['first_name']);

        $mail->isHTML(true);
        $mail->Subject = '🎉 Welcome to Student Management System';
        $mail->Body = "
            Hi <strong>{$data['first_name']}</strong>,<br><br>
            Welcome aboard! Your registration was successful.<br>
            We're excited to have you with us.<br><br>
            Regards,<br>
            Student Management Team
        ";

        $mail->send();
    } catch (Exception $e) {
        error_log("Welcome email failed: " . $mail->ErrorInfo);
    }
}
