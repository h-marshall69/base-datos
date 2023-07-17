function getFields() {
    var tableNameInput = document.getElementById('tableName');
    var tableName = tableNameInput.value.trim();

    // Validar que se haya introducido un nombre de tabla
    if (!tableName) {
        alert('Por favor, introduce un nombre de tabla válido.');
        return;
    }

    // Hacer la solicitud AJAX al archivo PHP con el nombre de la tabla como parámetro
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Procesar la respuesta JSON y mostrar los campos
                const fields = JSON.parse(xhr.responseText);
                showFields(tableName, fields);
            } else {
                console.error('Error al obtener los campos de la tabla');
            }
        }
    };

    xhr.open('GET', 'campos.php?table_name=' + encodeURIComponent(tableName), true);
    xhr.send();
}

function showFields(tableName, fields) {
    var tableFieldsDiv = document.getElementById('tableFields');
    tableFieldsDiv.innerHTML = ''; // Limpia el contenido anterior

    if (fields.length === 0) {
        tableFieldsDiv.innerHTML = 'La tabla "' + tableName + '" no tiene campos.';
    } else {
        tableFieldsDiv.innerHTML = '<h2>Campos de la tabla "' + tableName + '":</h2><ul>';
        for (var i = 0; i < fields.length; i++) {
            tableFieldsDiv.innerHTML += '<li>' + fields[i] + '</li>';
        }
        tableFieldsDiv.innerHTML += '</ul>';
    }
}