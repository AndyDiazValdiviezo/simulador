app.factory('service', function($rootScope) {
  var service = {
    paper: null,
    graph: new joint.dia.Graph,
    elementos: [],
    elementoSeleccionadoId: '',
    tipoLink: '',
    enableLinks: false,
    numDecimales: 6,
    consola: null,
    consolaAbierta: false,
    getGraph: function() {
      return this.graph;
    },
    setPaper: function(paper) {
      this.paper = paper;
    },
    getPaper: function() {
      return this.paper;
    },
    addElemento: function(elemento) {
      service.elementos[elemento.modelId] = elemento;
      service.setElementoSeleccionado(elemento.modelId);
      $rootScope.$emit('elementoSeleccionado');
    },
    getElemento: function(modelId) {
      return service.elementos[modelId];
    },
    removeElemento: function(modelId) {
      if (service.elementos[modelId] != undefined) {
        delete service.elementos[modelId];
      };
    },
    getElementos: function() {
      return service.elementos;
    },
    getElementosAsArray: function() {
      var aElementos = [];
      var elemento;

      for (var prop in service.elementos) {
        elemento = service.elementos[prop];
        aElementos.push(elemento);
      }

      return aElementos;
    },
    updateElemento: function(modelId, elemento, callback) {
      service.elementos[elemento.modelId] = elemento;

      if (callback != undefined) {
        callback();
      };
    },
    getElementoPorIndice: function(indNombre, indValor) {
      var elementos = service.elementos;

      for (var prop in elementos) {
        if (elementos.hasOwnProperty(prop)) {
          var elemento = elementos[prop];

          if (elemento[indNombre] == indValor) {
            return elemento;
          };
        }
      }
    },
    getElementosPorBarra: function(indiceBarra) {
      var aElementos = service.getElementosAsArray();
      var mElementos = math.matrix();

      for (var i = 0; i < count(aElementos); i++) {
        var elemento = aElementos[i];

        if (elemento.tipo != 'barra') {
          for (var prop in elemento) {
            if (prop.search('index') == 0 && elemento[prop] == indiceBarra) {
              var size = math
                .select(math.size(mElementos))
                .add(1)
                .subset(math.index(0))
                .value;
              mElementos.resize([size], elemento);
              break;
            };
          }
        };
      };

      return mElementos;
    },
    getBarra: function(indice) {
      for (var prop in service.elementos) {
        if (service.elementos.hasOwnProperty(prop)) {
          var elemento = service.elementos[prop];

          if (elemento.tipo == 'barra') {
            if (elemento.indexI == indice) {
              return elemento;
            };
          };
        }
      }
    },
    getBarras: function() {
      var aBarras = [];
      var elementos = service.elementos;

      for (var prop in elementos) {
        if (elementos[prop].tipo == 'barra') {
          aBarras.push(elementos[prop]);
        };
      }

      return aBarras;
    },
    getCantidadBarras: function() {
      return count(service.getBarras());
    },
    setElementoSeleccionado: function(modelId) {
      service.elementoSeleccionadoId = modelId;
    },
    getElementoSeleccionado: function() {
      return service.elementos[service.elementoSeleccionadoId];
    },
    recalcularIndices: function() {
      var cont = 0;
      var elementos = this.elementos;
      var elemento;

      for (var prop in elementos) {
        elemento = elementos[prop];

        if (elemento.tipo == 'barra') {
          cont++;
          elemento.indexI = cont;
        };
      }
    },
    setTipoLink: function(tipo) {
      this.tipoLink = tipo;
    },
    getTipoLink: function() {
      return this.tipoLink;
    },
    setEnableLinks: function(value) {
      this.enableLinks = value;
      this.paper.$el.attr('links-enable', this.enableLinks);
    },
    getEnableLinks: function() {
      return this.enableLinks;
    },
    getNumDecimales: function() {
      return this.numDecimales;
    },
    setConsola: function(value) {
      this.consola = value;
    },
    getConsola: function() {
      return this.consola;
    },
    setConsolaAbierta: function(value) {
      this.consolaAbierta = value;
    },
    getConsolaAbierta: function() {
      return this.consolaAbierta;
    },
    calcularDesfases: function() {
      var barras = service.getBarras();

      for (var i = 1; i <= count(barras); i++) {
        var barraI = barras[i - 1];
        var desfaseI = barraI.datosModelo.desfase.valor;

        for (var j = i + 1; j <= count(barras); j++) {
          var barraJ = barras[j - 1];
          var faseTrafoJ = barraJ.datosModelo.faseTrafo.valor;
          barraJ.datosModelo.desfase.valor = decRound(formatFloat(desfaseI) + formatFloat(faseTrafoJ), service.getNumDecimales());
          service.updateElemento(barraJ.modelId, barraJ);
        };
      };
    }
  };

  return service;
});