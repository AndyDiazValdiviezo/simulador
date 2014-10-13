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

            canvas.html.css({
              'cursor': 'move',
            });

            $element.find('#canvas-paleta-' + i).draggable({
              helper: 'clone',
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