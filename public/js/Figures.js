// Truco para usar un servicio fuera de angular :3
var MixinSrvc;

setTimeout(function() {
  var elem = angular.element(document.querySelector('[ng-controller]'));
  var injector = elem.injector();

  MixinSrvc = injector.get('MixinSrvc');
}, 100);

////////////////////////////////////
// ----------PLANTILLAS---------- //
////////////////////////////////////
Figure = draw2d.SVGFigure.extend({
  NAME: 'figure',
  init: function() {
    this._super();
    this.setResizeable(false);
    this.width = 65;
    this.height = 65;

    this.on('click', function(emmiter, obj) {
      MixinSrvc.setElmSeleccionado(emmiter);
    });
  },
  getPersistentAttributes: function() {
    var memento = this._super();

    memento.rotationAngle = this.rotationAngle;
    memento.ports = [];

    for (var i = 0; i < this.getPorts().data.length; i++) {
      memento.ports.push({
        name: this.getPorts().data[i].locator.NAME,
        port: this.getPorts().data[i].NAME,
        locator: this.getPorts().data[i].locator.NAME,
      });
    };

    return memento;
  },
  setPersistentAttributes: function(memento) {
    this._super(memento);
    this.setRotationAngle(memento.rotationAngle);

    for (var i = 0; i < this.getPorts().data.length; i++) {
      this.getPorts().data[i].setVisible(false);
    };
  },
});

///////////////////////////////////
// ----------ELEMENTOS---------- //
///////////////////////////////////
Conexion = draw2d.Connection.extend({
  NAME: 'Conexion',
  init: function() {
    this._super();
    this.setStroke(3);
    this.setRadius(0);
    this.setColor('#66AB16');
    this.setRouter(new draw2d.layout.connection.ManhattanConnectionRouter());
  },
  getPersistentAttributes: function() {
    var memento = this._super();

    memento.source.port = this.getSource().locator.NAME;
    memento.target.port = this.getTarget().locator.NAME;

    return memento;
  },
});

Linea = draw2d.Connection.extend({
  NAME: 'Linea',
  init: function() {
    this._super();
    this.setStroke(3);
    this.setRadius(0);
    this.setColor('#D14836');
    this.setRouter(new draw2d.layout.connection.ManhattanConnectionRouter());

    this.userData = {
      type: this.NAME,
      admitanciaCapacitiva: {
        name: 'admitanciaCapacitiva',
        label: 'Admitancia capacitiva',
        value: '',
      },
      longitud: {
        name: 'longitud',
        label: 'Longitud',
        value: '',
      },
      resistencia: {
        name: 'resistencia',
        label: 'Resistencia',
        value: '',
      },
      reactancia: {
        name: 'reactancia',
        label: 'Reactancia',
        value: '',
      },
    };
  },
  getAdmCpcCalculada: function(admitUsuario, voltaje) {
    var modulo = math.multiply(
      admitUsuario,
      math.divide(math.pow(voltaje, 2), 100)
    );
    var angulo = math.multiply(90, math.divide(math.pi, 180));
    var admitCalculada = math.complex({
      r: modulo,
      phi: angulo
    });

    return admitCalculada;
  },
  onClick: function() {
    this._super();
    MixinSrvc.setElmSeleccionado(this);
  },
  getPersistentAttributes: function() {
    var memento = this._super();

    memento.source.port = this.getSource().locator.NAME;
    memento.target.port = this.getTarget().locator.NAME;

    return memento;
  },
});

Barra = Figure.extend({
  NAME: 'Barra',
  init: function(paleta) {
    this._super();
    this.addPort(new PortBarra(), new BarraHybridLocator());

    this.userData = {
      type: this.NAME,
      voltaje: {
        name: 'Voltaje',
        label: 'Voltaje',
        value: '',
      },
      tipo: {
        name: 'tipo',
        value: 'C',
      },
      desfase: {
        name: 'desfase',
        label: 'Desfase',
        value: '',
      },
      faseTrafo: {
        name: 'faseTrafo',
        label: 'Fase trafo',
        value: '',
      },
    }
  },
  getSVG: function() {
    return svgCollection.barra;
  },
});

GeneradorSW = Figure.extend({
  NAME: 'GeneradorSW',
  init: function(paleta) {
    this._super();
    this.addPort(new PortGeneradorSW(), new GeneradorSWOutputLocator());

    this.userData = {
      type: this.NAME,
      voltajeModulo: {
        name: 'voltajeModulo',
        label: 'Mod. Voltaje',
        value: '',
      },
      voltajeAngulo: {
        name: 'voltajeAngulo',
        label: 'Ang. Voltaje',
        value: '',
      },
      generaActiva: {
        name: 'generaActiva',
        label: 'Genera activa',
        value: '',
      },
      generaReactiva: {
        name: 'generaReactiva',
        label: 'Genera reactiva',
        value: '',
      },
    }
  },
  getSVG: function() {
    return svgCollection.generadorSW;
  },
});

GeneradorPV = Figure.extend({
  NAME: 'GeneradorPV',
  init: function(paleta) {
    this._super();
    this.addPort(new PortGeneradorPV(), new GeneradorPVOutputLocator());

    this.userData = {
      type: this.NAME,
      voltajeModulo: {
        name: 'voltajeModulo',
        label: 'Mod. Voltaje',
        value: '',
      },
      voltajeAngulo: {
        name: 'voltajeAngulo',
        label: 'Ang. Voltaje',
        value: '',
      },
      generaActiva: {
        name: 'generaActiva',
        label: 'Genera activa',
        value: '',
      },
      generaReactiva: {
        name: 'generaReactiva',
        label: 'Genera reactiva',
        value: '',
      },
      minimaReactiva: {
        name: 'minimaReactiva',
        label: 'Mín. reactiva',
        value: '',
      },
      maximaReactiva: {
        name: 'maximaReactiva',
        label: 'Max. reactiva',
        value: '',
      },
    }
  },
  getSVG: function() {
    return svgCollection.generadorPV;
  },
});

Transformador2D = Figure.extend({
  NAME: 'Transformador2D',
  init: function(paleta) {
    this._super();
    this.addPort(new PortTransformador2D(), new Transformador2DOutputLocator1());
    this.addPort(new PortTransformador2D(), new Transformador2DOutputLocator2());

    this.userData = {
      type: this.NAME,
      admitanciaCapacitiva: {
        name: 'admitanciaCapacitiva',
        value: '',
      },
      potenciaAparente: {
        name: 'potenciaAparente',
        label: 'Potencia aparente',
        value: '',
      },
      voltajePrimario: {
        name: 'voltajePrimario',
        label: 'Voltaje prim',
        value: '',
      },
      voltajeSecundario: {
        name: 'voltajeSecundario',
        label: 'Voltaje sec',
        value: '',
      },
      tensionCortoCircuito: {
        name: 'tensionCortoCircuito',
        label: 'Tensión cc',
        value: '',
      },
      faseTrafoJ: {
        name: 'faseTrafoJ',
        value: '',
      },
      grupoConexion: {
        name: 'grupoConexion',
        label: 'Grupo conexión',
        value: 'Yy0',
        opciones: [{
          'value': 'Yy0',
          'text': 'Yy0',
          'valueFaseTrafo': 0,
        }, {
          'value': 'YNy0',
          'text': 'YNy0',
          'valueFaseTrafo': 0,
        }, {
          'value': 'YNyn0',
          'text': 'YNyn0',
          'valueFaseTrafo': 0,
        }, {
          'value': 'Yy6',
          'text': 'Yy6',
          'valueFaseTrafo': -180,
        }, {
          'value': 'YNy6',
          'text': 'YNy6',
          'valueFaseTrafo': -180,
        }, {
          'value': 'YNyn6',
          'text': 'YNyn6',
          'valueFaseTrafo': -180,
        }, {
          'value': 'Yd5',
          'text': 'Yd5',
          'valueFaseTrafo': -150,
        }, {
          'value': 'YNd5',
          'text': 'YNd5',
          'valueFaseTrafo': -150,
        }, {
          'value': 'Yd11',
          'text': 'Yd11',
          'valueFaseTrafo': 30,
        }, {
          'value': 'YNd11',
          'text': 'YNd11',
          'valueFaseTrafo': 30,
        }, {
          'value': 'Dd0',
          'text': 'Dd0',
          'valueFaseTrafo': 0,
        }, {
          'value': 'Dd6',
          'text': 'Dd6',
          'valueFaseTrafo': -180,
        }, {
          'value': 'Dy5',
          'text': 'Dy5',
          'valueFaseTrafo': -150,
        }, {
          'value': 'Dyn5',
          'text': 'Dyn5',
          'valueFaseTrafo': -150,
        }, {
          'value': 'Dy11',
          'text': 'Dy11',
          'valueFaseTrafo': 30,
        }, {
          'value': 'Dyn11',
          'text': 'Dyn11',
          'valueFaseTrafo': 30,
        }, ],
      },
    };
  },
  getVlrFaseTrafo: function(opciones, nombre) {
    for (var i = 0; i < opciones.length; i++) {
      if (opciones[i].value === nombre) {
        return opciones[i].valueFaseTrafo;
      };
    };
  },
  getSVG: function() {
    return svgCollection.transformador2D;
  },
});

Transformador3D = Figure.extend({
  NAME: 'Transformador3D',
  init: function(paleta) {
    this._super();
    this.addPort(new PortTransformador3D(), new Transformador3DOutputLocator1());
    this.addPort(new PortTransformador3D(), new Transformador3DOutputLocator2());
    this.addPort(new PortTransformador3D(), new Transformador3DOutputLocator3());

    this.userData = {
      type: this.NAME,
      'i-j': {
        titulo: 'Datos I-J',
        potenciaAparente: {
          name: 'potenciaAparente',
          label: 'Potencia aparente',
          value: '',
        },
        tensionCortoCircuito: {
          name: 'tensionCortoCircuito',
          label: 'Tensión cc',
          value: '',
        },
      },
      'i-k': {
        titulo: 'Datos I-K',
        potenciaAparente: {
          name: 'potenciaAparente',
          label: 'Potencia aparente',
          value: '',
        },
        tensionCortoCircuito: {
          name: 'tensionCortoCircuito',
          label: 'Tensión cc',
          value: '',
        },
      },
      'j-k': {
        titulo: 'Datos J-K',
        potenciaAparente: {
          name: 'potenciaAparente',
          label: 'Potencia aparente',
          value: '',
        },
        tensionCortoCircuito: {
          name: 'tensionCortoCircuito',
          label: 'Tensión cc',
          value: '',
        },
      },
      titulo: 'Datos generales',
      admitanciaCapacitiva: {
        name: 'admitanciaCapacitiva',
        value: '',
      },
      grupoConexion: {
        name: 'grupoConexion',
        label: 'Grupo conexión',
        value: 'YNynd5',
        opciones: [{
          value: 'YNynd5',
          text: 'YNynd5',
        }, {
          value: 'YNynd11',
          text: 'YNynd11',
        }, ],
      },
      voltajePrimario: {
        name: 'voltajePrimario',
        label: 'Voltaje prim',
        value: '',
      },
      voltajeSecundario: {
        name: 'voltajeSecundario',
        label: 'Voltaje sec',
        value: '',
      },
    };
  },
  getSVG: function() {
    return svgCollection.transformador3D;
  },
});

Carga = Figure.extend({
  NAME: 'Carga',
  init: function(paleta) {
    this._super();
    this.addPort(new PortCarga(), new CargaOutputLocator());

    this.userData = {
      type: this.NAME,
      cargaActiva: {
        name: 'cargaActiva',
        label: 'Carga activa',
        value: '',
      },
      cargaReactiva: {
        name: 'cargaReactiva',
        label: 'Carga reactiva',
        value: '',
      },
    };
  },
  getSVG: function() {
    return svgCollection.carga;
  },
});