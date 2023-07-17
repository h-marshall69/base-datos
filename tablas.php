<?php

include 'db_connection.php';

function getTableNames() {
    $conn = OpenCon();
    $query = "SHOW TABLES";
    $result = $conn->query($query);
    $tables = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_array()) {
            $tables[] = $row[0];
        }
    }

    CloseCon($conn);
    return $tables;
}

$tables = getTableNames();
echo json_encode($tables);

?>