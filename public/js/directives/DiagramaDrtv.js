(function() {
  function DiagramaDrtv($rootScope, $timeout, FiguresSrvc, MixinSrvc) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/diagrama.html',
      scope: false,
      link: function($scope, $element, $attrs) {
        $timeout(function() {
          var BbsPolicy = draw2d.policy.canvas.BoundingboxSelectionPolicy.extend({
            NAME: 'BbsPolicy',
            init: function() {
              this._super();
              this.enabled = true;
            },
            onMouseDown: function(canvas, x, y, shiftKey, ctrlKey) {
              if (this.enabled) {
                this._super(canvas, x, y, shiftKey, ctrlKey);
              };
            },
            onMouseDrag: function(canvas, dx, dy, dx2, dy2) {
              if (this.enabled) {
                this._super(canvas, dx, dy, dx2, dy2);
              };
            },
          });
          var bbsPolicy = new BbsPolicy();

          FiguresSrvc.canvasDiagrama = new draw2d.Canvas('canvas-diagrama');
          FiguresSrvc.canvasDiagrama.installEditPolicy(bbsPolicy);

          var $canvas = $element.find('#canvas-diagrama');

          var initOffset = $canvas.offset();
          var offTop = initOffset.top;
          var offLeft = initOffset.left;

          var posTop = $canvas.position().top;
          var posLeft = $canvas.position().left;

          var x1 = offLeft + posLeft;
          var y1 = offTop + posTop;

          var x2 = math.abs(posLeft - offLeft);
          var y2 = math.abs(posTop - offTop);

          $rootScope.$on('pan', function(evt, data) {
            if (data) {
              $canvas.draggable('destroy');
              $canvas.removeClass('drag');
              bbsPolicy.enabled = true;

            } else {
              $canvas.draggable({
                containment: [x1, y1, x2, y2],
              });
              $canvas.addClass('drag');
              bbsPolicy.enabled = false;
            };
          });

          $rootScope.$on('reset', function() {
            $canvas.offset(initOffset);
            $canvas.animate({
              top: posTop,
              left: posLeft,
            }, 500);
          });

          $element.find('#canvas-diagrama').droppable({
            accept: '*',
            drop: function(event, ui) {
              var name = ui.helper.data('name');

              var width = $(ui.draggable).width();
              var height = $(ui.draggable).height();

              var x = ui.position.left + (width / 2);
              var y = ui.position.top + (height / 2);

              FiguresSrvc.agrElmDiagrama(name, width, x, y);
            },
          });

          draw2d.Connection.createConnection = function(sourcePort, targetPort, callback, dropTarget) {
            switch (FiguresSrvc.tipoConexion()) {
              case 'conexion':
                var connection = new Conexion();
                MixinSrvc.setElmSeleccionado(null);
                break;

              case 'linea':
                var connection = new Linea();
                MixinSrvc.setElmSeleccionado(connection);
                break;
            }

            return connection;
          };
        });
      },
    };
  }

  angular.module('simuladorApp')
    .directive('diagrama', DiagramaDrtv);
})();