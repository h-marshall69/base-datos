document.addEventListener("DOMContentLoaded", () => {
  // Función para obtener los campos de una tabla mediante AJAX
  function getFields(miButton, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var fields = JSON.parse(xhr.responseText);
          callback(fields);
        } else {
          console.error("Error al obtener los campos de la tabla");
        }
      }
    };

    // Se realiza una solicitud GET a "campos.php?table_name=miButton" para obtener los campos de la tabla especificada
    xhr.open(
      "GET",
      "campos.php?table_name=" + encodeURIComponent(miButton),
      true
    );
    xhr.send();
  }

  // Función que muestra u oculta los campos asociados a una tabla al hacer clic en el botón correspondiente
  const toggleFields = (button) => {
    const isActive = button.classList.contains("active"); // Verificar si el botón tiene la clase "active"
    const miButton = button.textContent;
    const tablaCampos = document.querySelector(".campos");

    if (isActive) {
      // Si el botón está activo, se eliminan los campos asociados a la tabla y se restaura el color del botón
      const activateDiv = document.querySelector("." + miButton);
      activateDiv.remove();
      button.style.backgroundColor = ""; // Restaurar color normal
      button.classList.remove("active");
    } else {
      // Si el botón no está activo, se obtienen los campos de la tabla mediante una solicitud AJAX a través de la función getFields y se muestran en el DOM
      getFields(miButton, function (fields) {
        const h3Campos = document.createElement("h3");
        const divCampos = document.createElement("div");

        if (fields.length === 0) {
          tablaCampos.textContent = "La tabla no tiene campos.";
        } else {
          h3Campos.textContent = miButton;
          divCampos.appendChild(h3Campos);
          fields.forEach((field) => {
            const divCamposCp = document.createElement("div");
            divCamposCp.classList.add(field);
            divCamposCp.setAttribute("draggable", "true");
            divCamposCp.textContent = field;
            divCampos.appendChild(divCamposCp);
          });
          divCampos.classList.add(miButton);
          tablaCampos.appendChild(divCampos);
        }
      });

      // Se cambia el color del botón a azul y se agrega la clase "active" para indicar que está activo
      button.style.backgroundColor = "blue"; // Cambiar a un color diferente (puedes ajustar el color según tus necesidades)
      button.classList.add("active");
    }
  };

  // Obtener los elementos que necesitamos para la funcionalidad de arrastrar y soltar
  const contenedorOrigen = document.getElementById("contenedor-origen");
  const contenedorDestino = document.getElementById("contenedor-destino");

  // Agregar los listeners para los eventos de arrastrar y soltar
  contenedorOrigen.addEventListener("dragstart", dragStart);
  contenedorDestino.addEventListener("dragover", dragOver);
  contenedorDestino.addEventListener("drop", drop);

  // Función para el evento 'dragstart' (cuando comienza a arrastrar)
  function dragStart(e) {
    // Almacenar el contenido del elemento arrastrado en el objeto 'dataTransfer'
    e.dataTransfer.setData("text/plain", e.target.textContent);
  }

  // Función para el evento 'dragover' (cuando se arrastra sobre el destino)
  function dragOver(e) {
    e.preventDefault();
  }

  // Función para el evento 'drop' (cuando se suelta en el destino)
  function drop(e) {
    const tablaOpciones = document.querySelector(".opciones");
    e.preventDefault();

    // Obtener el contenido del elemento arrastrado desde el objeto 'dataTransfer'
    const elementoArrastrado = e.dataTransfer.getData("text/plain");

    // Crear un nuevo elemento en el contenedor de destino con el contenido del elemento arrastrado
    const nuevoElemento = document.createElement("div");
    nuevoElemento.textContent = elementoArrastrado;

    // Asignar una clase al nuevo elemento arrastrado
    nuevoElemento.classList.add(elementoArrastrado);
    nuevoElemento.classList.add("active2");

    // Crear un contenedor para las opciones relacionadas con el elemento arrastrado
    const divOpcion = document.createElement("div");
    const h3Opcion = document.createElement("h3");
    h3Opcion.textContent = elementoArrastrado;
    divOpcion.appendChild(h3Opcion);
    const newOpcion = document.createElement("select");
    newOpcion.classList.add(elementoArrastrado);
    const newOpcionSelecCOUNT = document.createElement("option");
    const newOpcionSelecSUM = document.createElement("option");
    const newOpcionSelecAVG = document.createElement("option");
    const newOpcionSelecMIN = document.createElement("option");
    const newOpcionSelecMAX = document.createElement("option");
    newOpcionSelecCOUNT.textContent = "COUNT";
    newOpcion.appendChild(newOpcionSelecCOUNT);
    newOpcionSelecSUM.textContent = "SUM";
    newOpcion.appendChild(newOpcionSelecSUM);
    newOpcionSelecAVG.textContent = "AVG";
    newOpcion.appendChild(newOpcionSelecAVG);
    newOpcionSelecMIN.textContent = "MIN";
    newOpcion.appendChild(newOpcionSelecMIN);
    newOpcionSelecMAX.textContent = "MAX";
    newOpcion.appendChild(newOpcionSelecMAX);

    // Agregar evento change para capturar opciones seleccionadas y mostrarlas en la consola
    newOpcion.addEventListener("change", function () {
      const selectedOption = newOpcion.value;
      const nombresTablaOpt = document.querySelectorAll(".active");
      const dataArray = []; // Array donde almacenaremos los datos

      const camposAll = document.querySelectorAll(".active2");
      const dataArrayCampos = []; // Array donde almacenaremos los datos

      nombresTablaOpt.forEach((Elemento) => {
        const contenido = Elemento.textContent;
        dataArray.push(contenido);
      });

      camposAll.forEach((Elemento) => {
        const contenido = Elemento.textContent;
        dataArrayCampos.push(contenido);
      });

      const dataToSend = {
        dataArray: dataArray,
        selectedOption: selectedOption,
        dataArrayCampos: dataArrayCampos, // Asegúrate de que esta línea esté presente
      };

      // Enviar el objeto JSON mediante una solicitud AJAX (por ejemplo, usando fetch)
      fetch("prueba1.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error al enviar los datos:", error);
        });
    });

    divOpcion.appendChild(newOpcion);

    tablaOpciones.appendChild(divOpcion);

    // Agregar un botón de eliminar al nuevo elemento, para eliminarlo tanto del contenedor como de las opciones
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "x";
    botonEliminar.addEventListener("click", function () {
      contenedorDestino.removeChild(nuevoElemento);
      divOpcion.remove();
    });

    nuevoElemento.appendChild(botonEliminar);
    contenedorDestino.appendChild(nuevoElemento);
  }

  // Función para agregar los nombres de las tablas al DOM
  const addTableNamesToDOM = (tableNames) => {
    const tablasList = document.querySelector(".tablas");

    // Se crea un botón para cada nombre de tabla y se agrega al DOM dentro de una lista
    tableNames.forEach((tableName) => {
      const button = document.createElement("button");
      const divTablas = document.createElement("div");
      divTablas.classList.add("nombreTablaOpt");
      button.textContent = tableName;
      divTablas.appendChild(button);
      tablasList.appendChild(divTablas);

      // Agregar eventos de clic a cada botón, llamando a la función toggleFields cuando se hace clic en el botón
      button.addEventListener("click", () => {
        toggleFields(button);
      });
    });
  };

  // Función para obtener los nombres de las tablas mediante AJAX
  const getTableNamesFromServer = () => {
    const xhr = new XMLHttpRequest();

    // Evento que se dispara cuando cambia el estado de la solicitud AJAX
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const tableNames = JSON.parse(xhr.responseText);
          // Llamar a la función para agregar los nombres de las tablas al DOM
          addTableNamesToDOM(tableNames);
        } else {
          console.error("Error al obtener los nombres de las tablas.");
        }
      }
    };

    // Se realiza una solicitud GET a "tablas.php" para obtener los nombres de las tablas
    xhr.open("GET", "tablas.php", true);
    xhr.send();
  };

  // Llamar a la función para obtener los nombres de las tablas cuando el DOM esté cargado
  getTableNamesFromServer();
});
