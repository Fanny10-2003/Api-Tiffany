<?php
$servername = "localhost";
$username = "root";
$password= "";
$bd ="api";

$conn = new mysqli($servername, $username, $password, $bd);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
