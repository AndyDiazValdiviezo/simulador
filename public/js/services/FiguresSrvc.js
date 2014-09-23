function FiguresSrvc(MixinSrvc) {
  var my = {};

  my.canvasDiagrama = new draw2d.Canvas('canvas-diagrama');

  // Elementos para el diagrama
  function crearElemento(key) {
    switch (key) {
      case 'Barra':
        return new Barra();
        break;

      case 'GeneradorSW':
        return new GeneradorSW();
        break;

      case 'GeneradorPV':
        return new GeneradorPV();
        break;

      case 'Transformador2D':
        return new Transformador2D();
        break;

      case 'Transformador3D':
        return new Transformador3D();
        break;

      case 'Carga':
        return new Carga();
        break;
    }
  }

  // Elementos para la paleta de Elementos
  (function() {
    var formatearElemento = function(elemento) {
      elemento.setDimension(50, 50);
      elemento.setDraggable(false);
      elemento.off('click');
      elemento.on('dblclick', function(emitterFunction) {
        emitterFunction.rotationAngle = -90;
      });

      return elemento;
    }

    var barra = formatearElemento(new Barra());
    var generadorSW = formatearElemento(new GeneradorSW());
    var generadorPV = formatearElemento(new GeneradorPV());
    var transformador2D = formatearElemento(new Transformador2D());
    var transformador3D = formatearElemento(new Transformador3D());
    var carga = formatearElemento(new Carga());

    my.svgElemOrdenados = [
      barra,
      generadorSW,
      generadorPV,
      transformador2D,
      transformador3D,
      carga,
    ];
  })();

  my.elementoPorNombre = function(name) {
    return my.svgElementos[name];
  }

  my.agrElmDiagrama = function(name, width, x, y) {
    var elemento = crearElemento(name);

    var elmWidth = elemento.getWidth();
    var elmHight = elemento.getHeight();

    x = x - my.canvasDiagrama.getAbsoluteX() - (elmWidth / 2);
    y = y - (elmWidth - width) / 2;

    my.canvasDiagrama.add(elemento, x, y);
    my.canvasDiagrama.setCurrentSelection(elemento);
    MixinSrvc.setElmSeleccionado(elemento);
  }

  my.visibilidadPuertos = function(value) {
    var ports = my.canvasDiagrama.getAllPorts().data;

    for (var i = 0; i < ports.length; i++) {
      var port = ports[i];
      port.setVisible(value);
    };
  }

  return my;
}

angular
  .module('simuladorApp')
  .factory('FiguresSrvc', FiguresSrvc);