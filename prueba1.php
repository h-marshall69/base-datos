<?php
// Incluir el archivo de conexión a la base de datos
include 'db_connection.php';

// Recibir el objeto JSON enviado desde JavaScript
$dataReceived = json_decode(file_get_contents('php://input'), true);

// Obtener las variables recibidas
$dataArray = $dataReceived['dataArray'];
$selectedOption = $dataReceived['selectedOption'];
$dataArrayCampos = $dataReceived['dataArrayCampos'];

// Conexión a la base de datos
$conn = OpenCon();

// Escapar los valores para evitar inyección de SQL
$selectedOption = $conn->real_escape_string($selectedOption);

// Verificar si se recibió solo un nombre de tabla en el array dataArray
if (count($dataArray) !== 1) {
    die('Se debe proporcionar solo un nombre de tabla en el array dataArray.');
}

// Obtener el único nombre de tabla del array dataArray
$tabla = reset($dataArray);

// Verificar si se proporcionó al menos un campo en el array dataArrayCampos
if (empty($dataArrayCampos)) {
    die('Se debe proporcionar al menos un campo en el array dataArrayCampos.');
}

// Escapar los nombres de campo para evitar inyección de SQL
$dataArrayCamposEscaped = array_map(function ($campo) use ($conn) {
    return $conn->real_escape_string($campo);
}, $dataArrayCampos);

// Construir la parte del SELECT de la consulta SQL con los campos específicos proporcionados en $dataArrayCampos
$camposConcatenados = implode(', ', $dataArrayCamposEscaped);

$tabla1 = reset($dataArrayCamposEscaped);

// Construir la consulta SQL
// Dependiendo de la opción seleccionada (COUNT, SUM, AVG, MAX, MIN), se ejecutará una consulta diferente
switch ($selectedOption) {
    case 'COUNT':
        $aggregation = 'COUNT(*)';
        break;
    case 'SUM':
        $aggregation = 'SUM(' . $tabla1 . ')';
        break;
    case 'AVG':
        $aggregation = 'AVG(' . $tabla1 . ')';
        break;
    case 'MAX':
        $aggregation = 'MAX(' . $tabla1 . ')';
        break;
    case 'MIN':
        $aggregation = 'MIN(' . $tabla1 . ')';
        break;
    default:
        // Si se proporciona una opción inválida, devolver un mensaje de error
        die('Opción inválida.');
}

$sql_query = "SELECT " . $tabla1 . ", " . $aggregation . " AS resultado
              FROM " . $tabla . "
              GROUP BY " . $camposConcatenados . ";";

// Ejecutar la consulta SQL
$result = $conn->query($sql_query);

// Verificar si la consulta se ejecutó correctamente
if ($result === false) {
    die('Error en la consulta: ' . $conn->error);
}

// Imprimir los resultados
while ($row = $result->fetch_assoc()) {
    // Aquí se imprimen los resultados obtenidos en cada fila
    // Puedes mostrarlos como desees, por ejemplo, concatenándolos en una cadena o en un formato específico
    foreach ($row as $campo => $valor) {
        echo $campo . ": " . $valor . "\n";
    }
}

// Liberar recursos y cerrar la conexión a la base de datos
$result->free();
CloseCon($conn);
?>
