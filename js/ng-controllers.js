app.controller('headerCtrl', function($rootScope, $scope, service) {
  $scope.calcular = function() {
    var elementos = service.getElementos();
    var numDecimales = service.getNumDecimales();
    var consola = service.getConsola();

    var cantBarras = service.getCantidadBarras();
    var aElementos = service.getElementosAsArray();

    var calculo = LIBELECT.funcionesComplejas.calculoIterativo(cantBarras, aElementos);

    consola.echo('-----------ADMITANCIAS-----------');
    calculo.Y.forEach(function(value, index, matrix) {
      if (index[1] >= index[0]) {
        consola.echo('[' + math.add(index[0], 1) + '-' + math.add(index[1], 1) + ']: ' + value.format({
          precision: numDecimales,
        }));
      };
    });

    consola.echo('');
    consola.echo('-----------VOLTAJES FINALES-----------');
    calculo.V.forEach(function(value, index) {
      var r = value.toPolar().r;
      var r = math.format(r, {
        notation: 'fixed',
        precision: 5
      });

      var phi = math.multiply(
        value.toPolar().phi,
        math.divide(180, math.pi)
      );
      phi = math.format(phi, {
        notation: 'fixed',
        precision: 5
      });

      consola.echo('[' + math.add(index, 1) + ']: ' + r + ' |_ ' + phi);
    });

    $rootScope.$emit('abrirConsola');
    // $scope.exportarDiagrama();
  };

  $scope.rotarIzquierda = function() {
    var graph = service.getGraph();
    var elementoSeleccionado = service.getElementoSeleccionado();

    if (elementoSeleccionado) {
      var modelo = graph.getCell(elementoSeleccionado.modelId);

      if (modelo.attributes.type == 'devs.Model') {
        modelo.rotate(-90);
      };
    };
  };

  $scope.rotarDerecha = function() {
    var graph = service.getGraph();
    var elementoSeleccionado = service.getElementoSeleccionado();

    if (elementoSeleccionado) {
      var modelo = graph.getCell(elementoSeleccionado.modelId);

      if (modelo.attributes.type == 'devs.Model') {
        modelo.rotate(90);
      };
    };
  };

  $scope.clickBotonLink = function(tipo) {
    var condicion = false;

    if (service.getTipoLink() == tipo) {
      condicion = !service.getEnableLinks();
    } else {
      condicion = true;
    };

    service.setEnableLinks(condicion);
    service.setTipoLink(tipo);
  };

  $scope.exportarDiagrama = function() {
    var graph = service.getGraph();
    var paper = service.getPaper();

    var elementos = graph.getElements();
    var links = graph.getLinks();

    var expElementos = [];
    var expLinks = [];

    for (var i = 0; i < elementos.length; i++) {
      expElementos.push(elementos[i]);
    };

    for (var i = 0; i < links.length; i++) {
      expLinks.push(links[i]);
    };

    $scope.obj = {
      'expElementos': expElementos,
      'expLinks': expLinks,
    };

    var strJson = JSON.stringify($scope.obj);
    graph.clear();
    $scope.strJson = strJson;

    setTimeout(function() {
      $scope.importarDiagrama();
      // for (var i = 0; i < expElementos.length; i++) {
      //   graph.addCell(expElementos[i]);
      // };

      // for (var i = 0; i < expLinks.length; i++) {
      //   graph.addCell(expLinks[i]);
      // };
    }, 1000);
  }

  $scope.importarDiagrama = function() {
    var graph = service.getGraph();
    var expElementos = $scope.obj.expElementos;
    var expLinks = $scope.obj.expLinks;

    var strJson = JSON.stringify($scope.obj);
    var obj2 = JSON.parse(strJson);

    var expElementos = obj2.expElementos;
    var expLinks = obj2.expLinks;

    for (var i = 0; i < expElementos.length; i++) {
      var elemento = expElementos[i];
      var key = elemento.nombreModelo;

      var clone = libreria.elementos[key].clone();
      clone.attributes.position = elemento.position;
      clone.scale(elemento.escala);

      graph.addCell(clone);
    };

    for (var i = 0; i < expLinks.length; i++) {
      var link = expLinks[i];
      var key = link.nombreModelo;

      if (key == 'linea') {
        var clone = libreria.elementos[key].clone();
        console.log(clone);
      };
      // graph.addCell(clone);
    };
  };
});

app.controller('paletaCtrl', function($scope, $element, $sce) {
  $scope.elementos = libreria.elementos;
  $scope.trusthtml;

  for (var prop in $scope.elementos) {
    var elem = $scope.elementos[prop];
    elem.attributes.fullMarkup = $sce.trustAsHtml(elem.attributes.fullMarkup);
  }
});

app.controller('diagramaCtrl', function($scope, $rootScope, $element, service) {
  $scope.insertarElemento = function(key, posX, posY) {
    var factor = 1.3;
    var clone = libreria.elementos[key].clone();
    clone.scale(factor);

    var objPosition = clone.attributes.position;
    var objSize = clone.attributes.size;

    var posX = posX - objPosition.x - (objSize.width / 2);
    var posY = posY - objPosition.y - (objSize.height / 2);

    clone.translate(posX, posY);
    service.graph.addCell(clone);

    var elemento = {
      modelId: clone.id,
      tipo: key,
      datosModelo: clone.attributes.datosModelo,
      funcionesModelo: clone.attributes.funcionesModelo,
      conexiones: {},
    };

    if (key == 'transformador3D') {
      elemento.datosModeloSeparados = clone.attributes.datosModeloSeparados;
    };

    service.addElemento(elemento);

    // Si estoy agregando una barra, le asigno el index correspondiente
    if (key == 'barra') {
      service.recalcularIndices();
    };
    // -----------------------------------
  }

  $scope.seleccionarElemento = function(modelId) {
    service.setElementoSeleccionado(modelId);
    $rootScope.$emit('elementoSeleccionado');
  }
});

app.controller('propiedadesCtrl', function($scope, $rootScope, service) {
  $scope.elementoSeleccionado;

  $scope.fireSelectChange = function(elemento) {
    var datosModelo = elemento.datosModelo;

    if (elemento.tipo == 'transformador2D') {
      var funcionesModelo = elemento.funcionesModelo;
      var valorGrupo = datosModelo.grupoConexion.valor;
      var faseTrafo = funcionesModelo.getValorFaseTrafo(datosModelo.grupoConexion.opciones, valorGrupo);
      var indexJ = elemento.indexJ;

      if (indexJ != undefined) {
        var barra = service.getBarra(indexJ);
        barra.datosModelo.faseTrafo.valor = faseTrafo;
        service.updateElemento(barra.modelId, barra);
        service.calcularDesfases();
      };
    };
  }

  $rootScope.$on('elementoSeleccionado', function() {
    $scope.elementoSeleccionado = service.getElementoSeleccionado();
    $scope.$apply();
  });

  $rootScope.$on('elementoDeseleccionado', function() {
    $scope.elementoSeleccionado = service.getElementoSeleccionado();
    $scope.$apply();
  });

  $scope.$watch('elementoSeleccionado', function(newValue, oldValue) {
    $scope.elementoSeleccionado;
  }, true);

});

app.controller('consolaCtrl', function(service, $rootScope, $scope, $element) {
  $rootScope.$on('abrirConsola', function(event, args) {
    if (!service.getConsolaAbierta()) {
      $scope.abrir();
      service.setConsolaAbierta(true);
    };
  });
});