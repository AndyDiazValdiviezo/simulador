app.directive('paleta', function() {
  return {
    restrict: 'E',
    templateUrl: '../templates/paleta.html',
    scope: {
      elementos: '=',
    },
    link: function($scope, element) {
      $scope.$on('repeatDone', function() {
        element.find('.draggable').draggable({
          helper: 'clone',
        });
      });
    }
  };
});

app.directive("onRepeatDone", function() {
  return {
    restriction: 'A',
    link: function($scope, element, attributes) {
      if ($scope.$last) {
        $scope.$emit('repeatDone');
      }
    }
  }
});

app.directive('diagrama', function($rootScope, service) {
  return {
    restrict: 'E',
    template: '<div class="paper droppable" id="diagrama" links-enable="false"></div>',
    scope: {
      insertarFn: '&insertarFn',
      seleccionarFn: '&seleccionarFn',
    },
    link: function($scope, element) {
      var domContDiagrama = angular.element('.cont-diagrama');

      $.fn.filterByData = function(prop, val) {
        return this.filter(function() {
          return $(this).data(prop) == val;
        });
      }

      var paper = new joint.dia.Paper({
        el: element.find('.paper'),
        width: element.parent().width(),
        height: element.parent().height(),
        model: service.getGraph(),
        gridSize: 1,
        defaultLink: function() {
          switch (service.getTipoLink()) {
            case 'linea':
              var link = libreria.elementos.linea.clone();

              var elemento = {
                modelId: link.id,
                tipo: 'linea',
                datosModelo: link.attributes.datosModelo,
                funcionesModelo: link.attributes.funcionesModelo,
              };
              service.addElemento(elemento);
              break;

            case 'conexion':
              var link = libreria.elementos.conexion.clone();
              break;
          };

          return link;
        },
        validateMagnet: function(cellView, magnet) {
          return magnet.getAttribute('magnet') !== 'passive';
        },
        validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
          var retorno = false;

          if (magnetT) {
            var modelTypeS = service.getElemento(cellViewS.model.id).tipo;
            var modelTypeT = service.getElemento(cellViewT.model.id).tipo;
            var tipo = service.getTipoLink();

            if (cellViewS === cellViewT) {
              retorno = false;
            } else {
              var typeInS = magnetS.getAttribute('type');
              var typeInT = magnetT.getAttribute('type');

              if (typeInS != typeInT) {
                var tipoS = service.getElemento(cellViewS.model.id).tipo;
                var tipoT = service.getElemento(cellViewT.model.id).tipo;

                switch (tipo) {
                  case 'conexion':
                    if ((tipoS === 'barra' && tipoT != 'barra') || (tipoT === 'barra' && tipoS != 'barra')) {
                      retorno = true;
                    };
                    break;

                  case 'linea':

                    if (tipoS === 'barra' && tipoT === 'barra') {
                      retorno = true;
                    };
                    break;
                };
              };
            };
          } else {
            retorno = false;
          };

          return retorno;
        },
      });
      /*
       */
      service.setPaper(paper);
      // paper.scale(2);

      paper.on('cell:pointerdown', function(cellView, evt, posX, posY) {
        if (cellView.model.attributes.type == 'devs.Model') {
          var cellId = cellView.model.id;
          var attr = cellView.model.attributes;

          var domHerraInstan = domContDiagrama.find('.herramientas.instancia');
          domHerraInstan.remove();

          var domHerramientas = domContDiagrama.find('.herramientas').clone();
          domHerramientas.addClass('instancia');

          var padding = 2;

          domHerramientas.css({
            display: 'block',
            left: attr.position.x - padding,
            top: attr.position.y - padding,
            width: attr.size.width + (padding * 2),
            height: attr.size.height + (padding * 2),
          });

          domContDiagrama.append(domHerramientas);
          domHerramientas.data('cellId', cellView.model.id);

        } else {
          var domHerramientas = angular.element('.herramientas.instancia');
          domHerramientas.remove();

          // Verifico si se ha hecho click en el boton "remove"
          toolRemove = $(evt.target).parents('.tool-remove')[0];
          if (toolRemove) {
            service.removeElemento(cellView.model.id);
          };
        };
      });

      var toolRemove;

      paper.on('cell:pointermove', function(cellView, evt, posX, posY) {
        if (cellView.model.attributes.type == 'devs.Model') {
          var cellId = cellView.model.id;
          var attr = cellView.model.attributes;
          var domHerramientas = angular.element('.herramientas').filterByData('cellId', cellId);
          var padding = 2;

          domHerramientas.css({
            left: attr.position.x - padding,
            top: attr.position.y - padding,
          });
        };
      });

      paper.on('cell:pointerup', function(cellView, evt, posX, posY) {
        if (cellView.model.attributes.type == 'libreria.modelLink') {
          setTimeout(function() {
            verificar(cellView);
          }, 10);
        };
      });

      verificar = function(cellView) {
        var cellId = cellView.model.attributes.target.id;

        // Me aseguro que no he hecho click en el botón eliminar del link
        if (!toolRemove) {
          if (!cellId) {
            service.removeElemento(cellView.model.id);
            cellView.remove();

            service.setElementoSeleccionado(null);
            $rootScope.$emit('elementoDeseleccionado');

          } else {
            var sourceId = cellView.model.attributes.source.id;
            var targetId = cellView.model.attributes.target.id;

            var sourceElement = service.getElemento(sourceId);
            var targetElement = service.getElemento(targetId);

            var elementModel = service.getElemento(cellView.model.id);

            if (elementModel) {
              if (elementModel.tipo == 'linea') {
                if (sourceElement.tipo == 'barra' && targetElement.tipo == 'barra') {
                  elementModel.indexI = sourceElement.indexI;
                  elementModel.indexJ = targetElement.indexI;
                  service.updateElemento(elementModel.id, elementModel);
                };
              }

            } else {
              var coincidencia = false;

              if (sourceElement.tipo != 'barra' && targetElement.tipo == 'barra') {
                var elementA = sourceElement;
                var elementB = targetElement;
                var keyLink = 'source';
                coincidencia = true;

              } else if (sourceElement.tipo == 'barra' && targetElement.tipo != 'barra') {
                var elementA = targetElement;
                var elementB = sourceElement;
                var keyLink = 'target';
                coincidencia = true;
              };

              if (coincidencia) {
                // Lógica por cada tipo de elemento
                switch (elementA.tipo) {
                  case 'transformador2D':
                    var elementView = paper.findViewByModel(elementA.modelId);
                    var viewPort = cellView.model.attributes[keyLink].port;
                    var modelPort = elementView.$el.find('[port="' + viewPort + '"]').parent().attr('class').replace('puerto ', '');
                    var typePort = elementView.$el.find('[port="' + viewPort + '"]').parents('[class$="Ports"]').attr('class');
                    var indice = elementView.model.attributes.attrs[typePort + ' ' + modelPort].indice;

                    if (indice == 'i') {
                      elementA.indexI = elementB.indexI;
                    };
                    if (indice == 'j') {
                      elementA.indexJ = elementB.indexI;
                    };

                    // Fase trafo de la barra
                    var nameFaseTrafo = elementA.datosModelo.grupoConexion.valor;
                    var gruposConexion = elementA.datosModelo.grupoConexion.opciones;
                    var valueFaseTrafo = elementA.funcionesModelo.getValorFaseTrafo(gruposConexion, nameFaseTrafo);
                    elementB.datosModelo.faseTrafo.valor = valueFaseTrafo;
                    service.updateElemento(elementB.modelId, elementB);
                    //-----------------------------

                    service.updateElemento(sourceId, elementA, function() {
                      service.calcularDesfases();
                    });
                    break;

                  case 'transformador3D':
                    var transView = paper.findViewByModel(elementA.modelId);
                    var viewPort = cellView.model.attributes[keyLink].port;
                    var modelPort = transView.$el.find('[port="' + viewPort + '"]').parent().attr('class').replace('puerto ', '');
                    var typePort = transView.$el.find('[port="' + viewPort + '"]').parents('[class$="Ports"]').attr('class');
                    var indice = transView.model.attributes.attrs[typePort + ' ' + modelPort].indice;

                    switch (indice) {
                      case 'i':
                        elementA.indexI = elementB.indexI;
                        break;

                      case 'j':
                        elementA.indexJ = elementB.indexI;
                        break;

                      case 'k':
                        elementA.indexK = elementB.indexI;
                        break;
                    }

                    service.updateElemento(sourceId, elementA, function() {
                      service.calcularDesfases();
                    });
                    break;

                  case 'generadorSW':
                    elementA.indexI = elementB.indexI;
                    elementB.datosModelo.tipo.valor = 'SW';
                    service.updateElemento(targetId, elementB);
                    service.updateElemento(sourceId, elementA);
                    break;

                  case 'generadorPV':
                    elementA.indexI = elementB.indexI;
                    elementB.datosModelo.tipo.valor = 'PV';
                    service.updateElemento(targetId, elementB);
                    service.updateElemento(sourceId, elementA);
                    break;

                  case 'carga':
                    elementA.indexI = elementB.indexI;
                    service.updateElemento(sourceId, elementA);
                    break;
                }
              };
            };
          };

        } else {
          // Ésta parte del código se ejecuta cuando he hecho click en el boton eliminar del link
          var sourceId = cellView.model.attributes.source.id;
          var targetId = cellView.model.attributes.target.id;

          var views = [];
          views[0] = paper.findViewByModel(sourceId);
          views[1] = paper.findViewByModel(targetId);

          for (var i = 0; i < count(views); i++) {
            var elementView = views[i];
            var elementModel = service.getElemento(elementView.model.id);

            if (elementModel.tipo != 'barra') {
              if (i == 0) {
                var portName = 'source';
              } else if (i == 1) {
                var portName = 'target';
              };

              var viewPort = cellView.model.attributes[portName].port;
              var modelPort = elementView.$el.find('[port="' + viewPort + '"]').parent().attr('class').replace('puerto ', '');
              var typePort = elementView.$el.find('[port="' + viewPort + '"]').parents('[class$="Ports"]').attr('class');
              var indice = elementView.model.attributes.attrs[typePort + ' ' + modelPort].indice;

              if (indice == 'i') {
                delete elementModel.indexI;
              };
              if (indice == 'j') {
                delete elementModel.indexJ;
              };
              if (indice == 'k') {
                delete elementModel.indexK;
              };

              service.updateElemento(elementModel.id, elementModel, function() {
                service.calcularDesfases();
              });
            };
          };

          toolRemove = undefined;
        };
      }

      paper.on('blank:pointerdown', function(evt, posX, posY) {
        var domHerramientas = angular.element('.herramientas.instancia');
        domHerramientas.remove();

        service.setElementoSeleccionado(null);
        $rootScope.$emit('elementoDeseleccionado');
      });

      // Herramientas - Eventos
      domContDiagrama.on('click', '.herramientas .eliminar', function(e) {
        e.preventDefault();

        var domHerramientas = $(this).parents('.herramientas.instancia');
        var cellId = domHerramientas.data('cellId');
        var cellModel = service.graph.getCell(cellId);

        service.removeElemento(cellId);
        cellModel.remove();
        domHerramientas.remove();

        service.setElementoSeleccionado(null);
        service.recalcularIndices();
        $rootScope.$emit('elementoDeseleccionado');
      });

      // Jquery draggable
      var droppable = element.find('.droppable');

      droppable.droppable({
        drop: function(evt, ui) {
          var key = ui.draggable.data('key');
          var posX = evt.clientX - $(this).offset().left;
          var posY = evt.clientY - $(this).offset().top;

          $scope.insertarFn({
            'key': key,
            'posX': posX,
            'posY': posY,
          });
        },
      });

      element.on('click', '.element.Model, .link', function(e) {
        $scope.seleccionarFn({
          'modelId': $(this).attr('model-id'),
        });
      });
    },
  };
});

app.directive('propiedades', function(service) {
  return {
    restrict: 'E',
    templateUrl: '../templates/propiedades.html',
    link: function($scope, $element) {
      $element.on('change', '[data-tipo^="transformador"]', function(e) {
        var elemento = service.getElementoSeleccionado();
        $scope.fireSelectChange(elemento);
      });
    },
  };
});

app.directive('consola', function(service) {
  return {
    restrict: 'E',
    templateUrl: '../templates/consola.html',
    link: function($scope, element) {
      var domConsola = element.find('#consola');
      var consoInitHeight = parseInt(domConsola.css('height').replace('px', ''), 10);

      domConsola.resizable({
        handles: 'n',
        minHeight: 60,
        maxHeight: 400,
      });
      domConsola.resizable('disable');
      domConsola.data('opened', false);

      $scope.abrir = function() {
        if (service.getConsolaAbierta()) {
          domConsola.animate({
            top: '0px',
            height: consoInitHeight,
          }, 250, function() {
            service.setConsolaAbierta(false);
            domConsola.resizable('disable');
          });
        } else {
          domConsola.animate({
            top: '-200px',
            height: (consoInitHeight + 200) + 'px',
          }, 250, function() {
            service.setConsolaAbierta(true);
            domConsola.resizable('enable');
          });

        };
      }

      // css
      var widthConsola = domConsola.width() - angular.element('.cont-propiedades').width();
      var consola = element.find('.display');

      consola.terminal(function(command, term) {
        if (command !== '') {
          try {
            var result = window.eval(command);
            if (result !== undefined) {
              term.echo(new String(result));
            }
          } catch (e) {
            term.error(new String(e));
          }
        } else {
          term.echo('');
        }
      }, {
        greetings: 'Linea de comandos\n',
        name: 'js_demo',
        width: widthConsola,
        height: 400,
        prompt: 'cmd> ',
      });

      service.setConsola(consola);
    }
  };
});