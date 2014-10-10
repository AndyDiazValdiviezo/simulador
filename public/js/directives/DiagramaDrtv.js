(function() {
  function DiagramaDrtv($timeout, FiguresSrvc, MixinSrvc) {
    return {
      restrict: 'EA',
      link: function($scope, $element, $attrs) {
        $timeout(function() {
          $element.find('#canvas-diagrama').droppable({
            accept: '*',
            drop: function(event, ui) {
              var name = ui.helper.data('name');

              var width = $(ui.draggable).width();
              var height = $(ui.draggable).height();

              var x = ui.position.left + (width / 2);
              var y = ui.position.top;

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