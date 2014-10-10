// Variable para usar objetos de angular
var portsData = {};

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

    if (!outFigure) {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (portsData.FiguresSrvc.tipoConexion()) {
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
        var cnt = 0;

        for (var i = 0; i < this.getConnections().data.length; i++) {
          var conexion = this.getConnections().data[i];
          var source = conexion.getSource().getParent();
          var target = conexion.getTarget().getParent();

          if (source.id == outFigure.id) {
            procede = false;
          }
        };
      };

      // Verifico si el elemento externo ya está conectado
      if (procede) {
        if (outFigure.NAME != 'Barra') {
          if (draggedFigure.getConnections().data.length > 0) {
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
  onConnect: function(connection) {
    var srcPort = connection.getSource();
    var srcFigure = srcPort.getParent();
    var thisFigure = this.getParent();

    if (connection.NAME != 'Linea') {
      srcFigure.userData['index' + srcPort.getLocator().indice] = thisFigure.userData.indexI;

      switch (srcFigure.NAME) {
        case 'GeneradorSW':
          thisFigure.userData.tipo.value = 'SW';
          break;

        case 'GeneradorPV':
          thisFigure.userData.tipo.value = 'PV';
          break;

        case 'Transformador2D':
          var nameFaseTrafo = srcFigure.grupoConexion.value;
          var gruposConexion = srcFigure.grupoConexion.opciones;
          var valorFaseTrafo = Transformador2D.prototype.getVlrFaseTrafo(gruposConexion, nameFaseTrafo);
          thisFigure.faseTrafo.value = valorFaseTrafo;
          break;
      }

    } else {
      if (thisFigure.id != srcFigure.id) {
        var indexI = Math.min(thisFigure.userData.indexI, srcFigure.userData.indexI);
        var indexJ = Math.max(thisFigure.userData.indexI, srcFigure.userData.indexI);

        connection.userData.indexI = indexI;
        connection.userData.indexJ = indexJ;
      };
    };
  },
  onDisconnect: function(connection) {},
});

PortGeneradorSW = OutputPortFigure.extend({
  NAME: 'PortGeneradorSW',
  onDragEnter: function(draggedFigure) {
    var thisFigure = this.getParent();
    var outFigure = draggedFigure.getParent();

    var procede = true;

    if (!outFigure) {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (portsData.FiguresSrvc.tipoConexion()) {
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

    if (!outFigure) {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (portsData.FiguresSrvc.tipoConexion()) {
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

    if (!outFigure) {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (portsData.FiguresSrvc.tipoConexion()) {
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

    if (!outFigure) {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (portsData.FiguresSrvc.tipoConexion()) {
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

    if (!outFigure) {
      procede = false;

    } else {
      // Verifico el tipo de conexión
      switch (portsData.FiguresSrvc.tipoConexion()) {
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