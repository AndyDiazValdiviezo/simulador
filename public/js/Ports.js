// Truco para usar un servicio fuera de angular :3
var FiguresSrvc;

setTimeout(function() {
  var elem = angular.element(document.querySelector('[ng-controller]'));
  var injector = elem.injector();

  FiguresSrvc = injector.get('FiguresSrvc');
}, 100);

////////////////////////////////////
// ----------PLANTILLAS---------- //
////////////////////////////////////
HybridPortFigure = draw2d.HybridPort.extend({
  NAME: 'HybridPortFigure',
  init: function() {
    this._super();
    this.setVisible(false);
  },
});

OutputPortFigure = draw2d.OutputPort.extend({
  NAME: 'OutputPortFigure',
  init: function() {
    this._super();
    this.setVisible(false);
  },
});

/////////////////////////////////
// ----------PUERTOS---------- //
/////////////////////////////////
PortBarra = HybridPortFigure.extend({
  NAME: 'PortBarra',
  onDragEnter: function(draggedFigure) {
    var thisFigure = this.getParent();
    var outFigure = draggedFigure.getParent();

    var procede = true;

    if (draggedFigure.NAME == '#ResizeHandle') {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (FiguresSrvc.tipoConexion()) {
        case 'conexion':
          if (outFigure.NAME == 'Barra') {
            procede = false;
          };
          break;

        case 'linea':
          if (outFigure.NAME != 'Barra') {
            procede = false;
          };
          break;
      }

      // Verifico si ya existe alguna conexión coincidente
      if (procede) {
        for (var i = 0; i < this.getConnections().data.length; i++) {
          var conexion = this.getConnections().data[i];
          var source = conexion.getSource().getParent();
          var target = conexion.getTarget().getParent();

          if (source.NAME == 'Barra' && outFigure.NAME == 'Barra') {
            procede = false;
          } else {
            if (source.NAME == outFigure.NAME) {
              procede = false;
            };
          };
        };
      };

      // Verifico si el elemento externo tiene ya está conectado
      if (procede) {
        if (outFigure.NAME != 'Barra' && outFigure.getConnections().data.length > 0) {
          procede = false;
        };
      };
    };

    if (!procede) {
      return null;
    };

    return this;
  },
  onConnect: function(connection) {},
});

PortGeneradorSW = OutputPortFigure.extend({
  NAME: 'PortGeneradorSW',
  onDragEnter: function(draggedFigure) {
    var thisFigure = this.getParent();
    var outFigure = draggedFigure.getParent();

    var procede = true;

    if (draggedFigure.NAME == '#ResizeHandle') {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (FiguresSrvc.tipoConexion()) {
        case 'conexion':
          if (outFigure.NAME != 'Barra') {
            procede = false;
          };
          break;

        case 'linea':
          procede = false;
          break;
      }

      // Verifico si ya existe alguna conexión coincidente
      if (procede) {
        if (this.getConnections().data.length > 0) {
          procede = false;
        };
      };
    };


    if (!procede) {
      return null;
    };

    return this;
  },
});

PortGeneradorPV = OutputPortFigure.extend({
  NAME: 'PortGeneradorPV',
  onDragEnter: function(draggedFigure) {
    var thisFigure = this.getParent();
    var outFigure = draggedFigure.getParent();

    var procede = true;

    if (draggedFigure.NAME == '#ResizeHandle') {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (FiguresSrvc.tipoConexion()) {
        case 'conexion':
          if (outFigure.NAME != 'Barra') {
            procede = false;
          };
          break;

        case 'linea':
          procede = false;
          break;
      }

      // Verifico si ya existe alguna conexión coincidente
      if (procede) {
        if (this.getConnections().data.length > 0) {
          procede = false;
        };
      };
    };


    if (!procede) {
      return null;
    };

    return this;
  },
});

PortTransformador2D = OutputPortFigure.extend({
  NAME: 'PortTransformador2D',
  onDragEnter: function(draggedFigure) {
    var thisFigure = this.getParent();
    var outFigure = draggedFigure.getParent();

    var procede = true;

    if (draggedFigure.NAME == '#ResizeHandle') {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (FiguresSrvc.tipoConexion()) {
        case 'conexion':
          if (outFigure.NAME != 'Barra') {
            procede = false;
          };
          break;

        case 'linea':
          procede = false;
          break;
      }

      // Verifico si ya existe alguna conexión coincidente
      if (procede) {
        if (this.getConnections().data.length > 0) {
          procede = false;
        };

        for (var i = 0; i < thisFigure.getConnections().data.length; i++) {
          var conexion = thisFigure.getConnections().data[i];
          var target = conexion.getTarget().getParent();

          if (target.id == outFigure.id) {
            procede = false;
          };
        };
      };
    };


    if (!procede) {
      return null;
    };

    return this;
  },
});

PortTransformador3D = OutputPortFigure.extend({
  NAME: 'PortTransformador3D',
  onDragEnter: function(draggedFigure) {
    var thisFigure = this.getParent();
    var outFigure = draggedFigure.getParent();

    var procede = true;

    if (draggedFigure.NAME == '#ResizeHandle') {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (FiguresSrvc.tipoConexion()) {
        case 'conexion':
          if (outFigure.NAME != 'Barra') {
            procede = false;
          };
          break;

        case 'linea':
          procede = false;
          break;
      }

      // Verifico si ya existe alguna conexión coincidente
      if (procede) {
        if (this.getConnections().data.length > 0) {
          procede = false;
        };

        for (var i = 0; i < thisFigure.getConnections().data.length; i++) {
          var conexion = thisFigure.getConnections().data[i];
          var target = conexion.getTarget().getParent();

          if (target.id == outFigure.id) {
            procede = false;
          };
        };
      };
    };

    if (!procede) {
      return null;
    };

    return this;
  },
});

PortCarga = OutputPortFigure.extend({
  NAME: 'PortCarga',
  onDragEnter: function(draggedFigure) {
    var thisFigure = this.getParent();
    var outFigure = draggedFigure.getParent();

    var procede = true;

    if (draggedFigure.NAME == '#ResizeHandle') {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (FiguresSrvc.tipoConexion()) {
        case 'conexion':
          if (outFigure.NAME != 'Barra') {
            procede = false;
          };
          break;

        case 'linea':
          procede = false;
          break;
      }

      // Verifico si ya existe alguna conexión coincidente
      if (procede) {
        if (this.getConnections().data.length > 0) {
          procede = false;
        };
      };
    };

    if (!procede) {
      return null;
    };

    return this;
  },
});