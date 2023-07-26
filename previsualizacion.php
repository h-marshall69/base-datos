<?php
include 'db_connection.php';

function executeQuery($sql_query) {
    $conn = OpenCon();
    $stmt = $conn->prepare($sql_query);
    if (!$stmt) {
        die(json_encode(['error' => 'Error en la consulta: ' . $conn->error]));
    }

    $result = $conn->query($sql_query);
    $data = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $stmt->close();
    CloseCon($conn);

    return $data;
}

if (isset($_POST['elementoArrastrado']) && isset($_POST['selectedOption']) && isset($_POST['nombresTablaOpt'])) {
    // Recibir los datos desde JavaScript
    $elementoArrastrado = $_POST['elementoArrastrado'];
    $selectedOption = $_POST['selectedOption'];
    $nombresTablaOpt = $_POST['nombresTablaOpt'];

    // Generar la consulta SQL
    $sqlQuery =
        "SELECT " .
        $elementoArrastrado .
        " " .
        $selectedOption .
        "(*) AS total_empleados FROM " .
        $nombresTablaOpt .
        " GROUP BY " .
        $elementoArrastrado .
        ";";

    // Ejecutar la consulta y obtener los datos
    $data = executeQuery($sqlQuery);

    // Devolver los datos como respuesta en formato JSON
    echo json_encode($data);
}
?>
