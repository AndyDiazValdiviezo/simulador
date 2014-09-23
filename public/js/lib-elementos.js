var libreria = {
  elementos: {
    conexion: new modelConexion({
      enPaleta: false,
    }),
    linea: new modelLinea({
      enPaleta: false,
      datosModelo: {
        admitanciaCapacitiva: {
          nombre: 'Admitancia capacitiva',
          valor: 0,
          formType: 'text',
          visible: true,
        },
        longitud: {
          nombre: 'Longitud',
          valor: '',
          formType: 'text',
          visible: true,
        },
        resistencia: {
          nombre: 'Resistencia',
          valor: '',
          formType: 'text',
          visible: true,
        },
        reactancia: {
          nombre: 'Reactancia',
          valor: '',
          formType: 'text',
          visible: true,
        },
      },
      funcionesModelo: {
        getAdmitCapacCalculada: function (admitUsuario, voltaje) {
          var modulo = math.multiply(admitUsuario, math.divide(math.pow(voltaje, 2), 100));
          var angulo = math.multiply(90, math.divide(math.pi, 180));
          var admitCalculada = math.complex({r: modulo, phi: angulo});

          return admitCalculada;
        }
      },
    }),
    barra: new modelBarra({
      enPaleta: true,
      datosModelo: {
        voltaje: {
          nombre: 'Voltaje',
          valor: '',
          formType: 'text',
          visible: true,
        },
        tipo: {
          valor: 'C',
          visible: false,
        },
        desfase: {
          valor: 0,
          visible: false,
        },
        faseTrafo: {
          valor: 0,
          visible: false,
        },
      },
      funcionesModelo: {},
    }, modelBarra.prototype.defaults.init()),
    generadorSW: new modelGenerador({
      enPaleta: true,
      nombre: 'Generador SW',
      nombreModelo: 'generadorSW',
      datosModelo: {
        voltajeModulo: {
          nombre: 'Mod. Voltaje',
          valor: '',
          formType: 'text',
          visible: true,
        },
        voltajeAngulo: {
          nombre: 'Ang. Voltaje',
          valor: 0,
          formType: 'text',
          visible: false,
        },
        generaActiva: {
          nombre: 'Genera activa',
          valor: 0,
          formType: 'text',
          visible: true,
        },
        generaReactiva: {
          nombre: 'Genera reactiva',
          valor: 0,
          formType: 'text',
          visible: true,
        },
      },
      funcionesModelo: {
        getGeneraActiva: function (valor) {
          return math.divide(valor, 100);
        },
        getGeneraReactiva: function (valor) {
          return math.divide(valor, 100);
        },
      },
    }, modelGenerador.prototype.defaults.init()),
    generadorPV: new modelGenerador({
      enPaleta: true,
      nombre: 'Generador PV',
      nombreModelo: 'generadorPV',
      datosModelo: {
        voltajeModulo: {
          nombre: 'Mod. Voltaje',
          valor: '',
          formType: 'text',
          visible: true,
        },
        voltajeAngulo: {
          nombre: 'Ang. Voltaje',
          valor: 0,
          formType: 'text',
          visible: false,
        },
        generaActiva: {
          nombre: 'Genera activa',
          valor: 0,
          formType: 'text',
          visible: true,
        },
        generaReactiva: {
          nombre: 'Genera reactiva',
          valor: 0,
          formType: 'text',
          visible: false,
        },
        minimaReactiva: {
          nombre: 'Mín. reactiva',
          valor: 0,
          formType: 'text',
          visible: true,
        },
        maximaReactiva: {
          nombre: 'Max. reactiva',
          valor: 0,
          formType: 'text',
          visible: true,
        },
      },
      funcionesModelo: {},
    }, modelGenerador.prototype.defaults.init()),
    transformador2D: new modelTransformador2D({
      enPaleta: true,
      nombre: 'Transformador 2D',
      datosModelo: {
        admitanciaCapacitiva: {
          valor: 0,
          visible: false,
        },
        potenciaAparente: {
          nombre: 'Potencia aparente',
          valor: '',
          formType: 'text',
          visible: true,
        },
        voltajePrimario: {
          nombre: 'Voltaje prim',
          valor: '',
          formType: 'text',
          visible: true,
        },
        voltajeSecundario: {
          nombre: 'Voltaje sec',
          valor: '',
          formType: 'text',
          visible: true,
        },
        tensionCortoCircuito: {
          nombre: 'Tensión cc',
          valor: '',
          formType: 'text',
          visible: true,
        },
        faseTrafoJ: {
          valor: 0,
          visible: false,
        },
        grupoConexion: {
          nombre: 'Grupo conexión',
          formType: 'select',
          visible: true,
          valor: 'Yy0',
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
      },
      funcionesModelo: {
        getValorFaseTrafo: function(opciones, nombre) {
          for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].value === nombre) {
              return opciones[i].valueFaseTrafo;
            };
          };
        },
      },
    }, modelTransformador2D.prototype.defaults.init()),
    transformador3D: new modelTransformador3D({
      enPaleta: true,
      nombre: 'Transformador 3D',
      datosModeloSeparados: {
        'i-j': {
          nombre: 'Datos I-J',
          datosModelo: {
            potenciaAparente: {
              nombre: 'Potencia aparente',
              valor: '',
              formType: 'text',
              visible: true,
            },
            tensionCortoCircuito: {
              nombre: 'Tensión cc',
              valor: '',
              formType: 'text',
              visible: true,
            },
          },
        },
        'i-k': {
          nombre: 'Datos I-K',
          datosModelo: {
            potenciaAparente: {
              nombre: 'Potencia aparente',
              valor: '',
              formType: 'text',
              visible: true,
            },
            tensionCortoCircuito: {
              nombre: 'Tensión cc',
              valor: '',
              formType: 'text',
              visible: true,
            },
          },
        },
        'j-k': {
          nombre: 'Datos J-K',
          datosModelo: {
            potenciaAparente: {
              nombre: 'Potencia aparente',
              valor: '',
              formType: 'text',
              visible: true,
            },
            tensionCortoCircuito: {
              nombre: 'Tensión cc',
              valor: '',
              formType: 'text',
              visible: true,
            },
          },
        },
      },
      datosModelo: {
        admitanciaCapacitiva: {
          valor: 0,
          visible: false,
        },
        grupoConexion: {
          nombre: 'Grupo conexión',
          formType: 'select',
          visible: true,
          valor: 'YNynd5',
          opciones: [{
            value: 'YNynd5',
            text: 'YNynd5',
          }, {
            value: 'YNynd11',
            text: 'YNynd11',
          }, ],
        },
        voltajePrimario: {
          nombre: 'Voltaje prim',
          valor: '',
          formType: 'text',
          visible: true,
        },
        voltajeSecundario: {
          nombre: 'Voltaje sec',
          valor: '',
          formType: 'text',
          visible: true,
        },
      },
      funcionesModelo: {},
    }, modelTransformador3D.prototype.defaults.init()),
    carga: new modelCarga({
      enPaleta: true,
      nombre: 'Carga',
      datosModelo: {
        cargaActiva: {
          nombre: 'Carga activa',
          valor: '',
          formType: 'text',
          visible: true,
        },
        cargaReactiva: {
          nombre: 'Carga reactiva',
          valor: '',
          formType: 'text',
          visible: true,
        },
      },
    }, modelCarga.prototype.defaults.init()),
  },
};