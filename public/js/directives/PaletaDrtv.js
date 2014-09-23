(function() {
  function PaletaDrtv($timeout, FiguresSrvc) {
    return {
      restrict: 'EA',
      link: function($scope, $element, $attrs) {
        $timeout(function() {
          var policy = new draw2d.policy.canvas.SelectionPolicy();
          policy.onMouseDrag(function() {});

          for (var i = 0; i < $scope.svgElemOrdenados().length; i++) {
            var canvas = new draw2d.Canvas('canvas-paleta-' + i);
            canvas.installEditPolicy(policy);

            $element.find('#canvas-paleta-' + i).draggable({
              helper: 'clone',
              cursor: 'crosshair',
              stop: function(event, ui) {
                var name = ui.helper.data('name');

                var width = $(this).width();
                var height = $(this).height();

                var x = ui.position.left + (width / 2);
                var y = ui.position.top;

                FiguresSrvc.agrElmDiagrama(name, width, x, y);
              },
            });

            var elemento = $scope.svgElemOrdenados()[i];
            canvas.add(elemento, 0, 0);
          };
        }, 0, false);
      },
    };
  }

  angular.module('simuladorApp')
    .directive('paleta', PaletaDrtv);
})();