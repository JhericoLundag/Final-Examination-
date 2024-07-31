<?php
$host = 'localhost';
$db = 'weather_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

$sql = "SELECT latitude, longitude, frequency FROM thunderstorms WHERE frequency > 0";
$stmt = $pdo->query($sql);
$thunderstorms = $stmt->fetchAll();

header('Content-Type: application/json');
echo json_encode($thunderstorms);
?>
