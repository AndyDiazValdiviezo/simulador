(function() {
  function DiagramaDrtv(DefaultSrvc) {
    return {
      restrict: 'EA',
      link: function($scope, $element, $attrs) {
        $scope.canvas = function () {
          return DefaultSrvc.canvasDiagrama;
        }
      },
    };
  }

  angular.module('simuladorApp')
    .directive('diagrama', DiagramaDrtv);
})();