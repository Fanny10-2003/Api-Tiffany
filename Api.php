<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    include(__DIR__."/conexion.php");

    // Headers necesarios
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");

    // Manejar preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit();
}

$metodo = $_SERVER["REQUEST_METHOD"];

switch ($metodo) {
    case 'GET':
        consultaSelect($conn);
        break;

    case 'POST':
        insertarRegistro($conn);
        break;

    case 'PUT':
        actualizarRegistro($conn);
        break;

    case 'DELETE':
        eliminarRegistro($conn);
        break;

    default:
        echo json_encode(["mensaje" => "Método no permitido"]);
        break;
}

// ================== CONSULTA (GET) ==================
function consultaSelect($conexion)
{
    $sql = "SELECT id, Matricula, Nombre, Apaterno, Amaterno, Email, Celular, CP, Sexo FROM alumnos";
    $resultado = $conexion->query($sql);
    
    if ($resultado) {
        $datos = [];
        while ($fila = $resultado->fetch_assoc()) {
            // Asegurarnos de que los nombres de las columnas coincidan exactamente
            $datos[] = [
                "id" => $fila['id'],
                "Matricula" => $fila['Matricula'],
                "Nombre" => $fila['Nombre'],
                "Apaterno" => $fila['Apaterno'],
                "Amaterno" => $fila['Amaterno'],
                "Email" => $fila['Email'],
                "Celular" => $fila['Celular'],
                "CP" => $fila['CP'],
                "Sexo" => $fila['Sexo']
            ];
        }
        echo json_encode($datos);
    } else {
        echo json_encode(["error" => "Error en la consulta: " . $conexion->error]);
    }
}

// ================== INSERTAR (POST) ==================
function insertarRegistro($conexion)
{
    $datos = json_decode(file_get_contents("php://input"), true);

    if (!$datos) {
        echo json_encode(["error" => "No se recibieron datos"]);
        return;
    }

    $matricula = $conexion->real_escape_string($datos['Matricula']);
    $nombre = $conexion->real_escape_string($datos['Nombre']);
    $apaterno = $conexion->real_escape_string($datos['Apaterno']);
    $amaterno = $conexion->real_escape_string($datos['Amaterno']);
    $email = $conexion->real_escape_string($datos['Email']);
    $celular = $conexion->real_escape_string($datos['Celular']);
    $cp = $conexion->real_escape_string($datos['CP']);
    $sexo = $conexion->real_escape_string($datos['Sexo']);

    // Validar longitud de CP (exactamente 5 caracteres)
    if (strlen($cp) != 5) {
        echo json_encode(["error" => "El Código Postal debe tener exactamente 5 caracteres"]);
        return;
    }

    // Validar que CP contenga solo dígitos
    if (!ctype_digit($cp)) {
        echo json_encode(["error" => "El Código Postal debe contener solo dígitos"]);
        return;
    }

    // Verificar si la matrícula ya existe
    $checkSql = "SELECT id FROM alumnos WHERE Matricula='$matricula' LIMIT 1";
    $checkRes = $conexion->query($checkSql);
    if ($checkRes && $checkRes->num_rows > 0) {
        echo json_encode(["error" => "La matrícula ya existe"]);
        return;
    }

    $sql = "INSERT INTO alumnos (Matricula, Nombre, Apaterno, Amaterno, Email, Celular, CP, Sexo)
            VALUES ('$matricula', '$nombre', '$apaterno', '$amaterno', '$email', '$celular', '$cp', '$sexo')";
    
    if ($conexion->query($sql)) {
        echo json_encode(["mensaje" => "Alumno insertado correctamente", "id" => $conexion->insert_id]);
    } else {
        echo json_encode(["error" => "Error al insertar: " . $conexion->error]);
    }
}

// ================== ACTUALIZAR (PUT) ==================
function actualizarRegistro($conexion)
{
    $datos = json_decode(file_get_contents("php://input"), true);

    // Accept either 'id' or 'Id' from client for compatibility
    if (!$datos || (!isset($datos['id']) && !isset($datos['Id']))) {
        echo json_encode(["error" => "Faltan datos para actualizar"]);
        return;
    }

    $id = isset($datos['id']) ? intval($datos['id']) : intval($datos['Id']);
    $matricula = $conexion->real_escape_string($datos['Matricula']);
    $nombre = $conexion->real_escape_string($datos['Nombre']);
    $apaterno = $conexion->real_escape_string($datos['Apaterno']);
    $amaterno = $conexion->real_escape_string($datos['Amaterno']);
    $email = $conexion->real_escape_string($datos['Email']);
    $celular = $conexion->real_escape_string($datos['Celular']);
    $cp = $conexion->real_escape_string($datos['CP']);
    $sexo = $conexion->real_escape_string($datos['Sexo']);

    // Verificar duplicado de matrícula (excluir el propio registro)
    $checkSql = "SELECT id FROM alumnos WHERE Matricula='$matricula' AND id<>$id LIMIT 1";
    $checkRes = $conexion->query($checkSql);
    if ($checkRes && $checkRes->num_rows > 0) {
        echo json_encode(["error" => "La matrícula ya está en uso por otro alumno"]);
        return;
    }

    // Validar longitud de CP (exactamente 5 caracteres)
    if (strlen($cp) != 5) {
        echo json_encode(["error" => "El Código Postal debe tener exactamente 5 caracteres"]);
        return;
    }

    // Validar que CP contenga solo dígitos
    if (!ctype_digit($cp)) {
        echo json_encode(["error" => "El Código Postal debe contener solo dígitos"]);
        return;
    }

    $sql = "UPDATE alumnos SET 
                Matricula='$matricula',
                Nombre='$nombre',
                Apaterno='$apaterno',
                Amaterno='$amaterno',
                Email='$email',
                Celular='$celular',
                CP='$cp',
                Sexo='$sexo'
            WHERE id=$id";

    if ($conexion->query($sql)) {
        echo json_encode(["mensaje" => "Alumno actualizado correctamente"]);
    } else {
        echo json_encode(["error" => "Error al actualizar: " . $conexion->error]);
    }
}

// ================== ELIMINAR (DELETE) ==================
function eliminarRegistro($conexion)
{
    if (!isset($_GET['id'])) {
        echo json_encode(["error" => "Falta el parámetro id"]);
        return;
    }

    $id = intval($_GET['id']);
    $sql = "DELETE FROM alumnos WHERE id=$id";

    if ($conexion->query($sql)) {
        echo json_encode(["mensaje" => "Alumno eliminado correctamente"]);
    } else {
        echo json_encode(["error" => "Error al eliminar: " . $conexion->error]);
    }
}
?>





