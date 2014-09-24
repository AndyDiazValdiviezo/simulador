// Truco para usar un servicio fuera de angular :3
var MixinSrvc;

setTimeout(function() {
  var elem = angular.element(document.querySelector('[ng-controller]'));
  var injector = elem.injector();

  MixinSrvc = injector.get('MixinSrvc');
}, 10);

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
Barra = Figure.extend({
  NAME: 'Barra',
  init: function(paleta) {
    this._super();
    this.addPort(new PortBarra(), new BarraHybridLocator());

    this.userData = {
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