<?php

function OpenCon() {
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $db = "employees";

    $conn = new mysqli($dbhost, $dbuser, $dbpass, $db);

    if ($conn->connect_error) {
        throw new Exception("Connect failed: " . $conn->connect_error);
    }

    return $conn;
}

function CloseCon($conn) {
    $conn->close();
}


?>