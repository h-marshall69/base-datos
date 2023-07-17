<?php
include 'db_connection.php'; // Incluye el archivo de conexión a la base de datos

// Función para obtener los campos de la tabla
function getTableFields($tableName) {
    $conn = OpenCon(); // Abre la conexión a la base de datos
    $tableName = $conn->real_escape_string($tableName); // Evita posibles ataques SQL injection

    $query = "SHOW COLUMNS FROM $tableName"; // Consulta para obtener los campos de la tabla
    $result = $conn->query($query);

    $fields = array();
    while ($row = $result->fetch_assoc()) {
        $fields[] = $row['Field'];
    }

    $result->free();
    CloseCon($conn); // Cierra la conexión a la base de datos

    return $fields;
}

// Verifica si se ha recibido el nombre de la tabla en la solicitud
if (isset($_GET['table_name'])) {
    $tableName = $_GET['table_name'];
    $fields = getTableFields($tableName);

    // Devuelve los campos en formato JSON
    echo json_encode($fields);
}
?>
