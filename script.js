var showingFields = false; // Variable para rastrear si los campos se están mostrando actualmente

function toggleFields() {
    var tableFieldsDiv = document.getElementById('tableFields');

    if (!showingFields) {
        // Si los campos no se están mostrando, obtén y muestra los campos
        getFields(function(fields) {
            if (fields.length === 0) {
                tableFieldsDiv.innerHTML = 'La tabla no tiene campos.';
            } else {
                tableFieldsDiv.innerHTML = '<h2>Campos de la tabla "estado":</h2><ul>';
                for (var i = 0; i < fields.length; i++) {
                    tableFieldsDiv.innerHTML += '<li>' + fields[i] + '</li>';
                }
                tableFieldsDiv.innerHTML += '</ul>';
            }
            showingFields = true;
        });
    } else {
        // Si los campos se están mostrando, simplemente elimina su contenido
        tableFieldsDiv.innerHTML = '';
        showingFields = false;
    }
}

function getFields(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var fields = JSON.parse(xhr.responseText);
                callback(fields);
            } else {
                alert('Error al obtener los campos de la tabla');
            }
        }
    };

    xhr.open('GET', 'campos.php?table_name=estados', true);
    xhr.send();
}
