<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/includes/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USER;
    $mail->Password = SMTP_PASS;
    $mail->SMTPSecure = 'tls';
    $mail->Port = SMTP_PORT;

    $mail->setFrom(SMTP_USER, 'Test Mail');
    $mail->addAddress(ADMIN_EMAIL);

    $mail->isHTML(true);
    $mail->Subject = '✅ Test Email';
    $mail->Body = 'This is a test email from your Student Rec App.';

    $mail->send();
    echo '✅ Email sent successfully.';
} catch (Exception $e) {
    echo '❌ Error sending email: ' . $mail->ErrorInfo;
}
