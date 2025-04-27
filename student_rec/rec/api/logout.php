<?php
session_start();
session_destroy();
require_once '../includes/functions.php';

sendJSON(['status' => 'success', 'message' => 'Logged out']);
