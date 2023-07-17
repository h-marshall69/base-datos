// Obtener los elementos que necesitamos
const contenedorOrigen = document.getElementById('contenedor-origen');
const contenedorDestino = document.getElementById('contenedor-destino');

// Agregar los listeners para los eventos de arrastrar y soltar
contenedorOrigen.addEventListener('dragstart', dragStart);
contenedorDestino.addEventListener('dragover', dragOver);
contenedorDestino.addEventListener('drop', drop);

// Función para el evento 'dragstart' (cuando comienza a arrastrar)
function dragStart(e) {
  // Almacenar el contenido del elemento arrastrado en el objeto 'dataTransfer'
  e.dataTransfer.setData('text/plain', e.target.textContent);
}

// Función para el evento 'dragover' (cuando se arrastra sobre el destino)
function dragOver(e) {
  e.preventDefault();
}

// Función para el evento 'drop' (cuando se suelta en el destino)
function drop(e) {
  e.preventDefault();

  // Obtener el contenido del elemento arrastrado desde el objeto 'dataTransfer'
  const elementoArrastrado = e.dataTransfer.getData('text/plain');

  // Crear un nuevo elemento en el contenedor de destino con el contenido del elemento arrastrado
  const nuevoElemento = document.createElement('div');
  nuevoElemento.textContent = elementoArrastrado;

  // Agregar un botón de eliminar al nuevo elemento
  const botonEliminar = document.createElement('button');
  botonEliminar.textContent = 'x';
  botonEliminar.addEventListener('click', function () {
    contenedorDestino.removeChild(nuevoElemento);
  });

  nuevoElemento.appendChild(botonEliminar);
  contenedorDestino.appendChild(nuevoElemento);
}
