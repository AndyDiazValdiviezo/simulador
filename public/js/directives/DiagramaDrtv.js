(function() {
  function DiagramaDrtv(FiguresSrvc) {
    return {
      restrict: 'EA',
      link: function($scope, $element, $attrs) {
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
      },
    };
  }

  angular.module('simuladorApp')
    .directive('diagrama', DiagramaDrtv);
})();