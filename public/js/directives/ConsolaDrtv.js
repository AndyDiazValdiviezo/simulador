(function() {
  function ConsolaDrtv(FiguresSrvc) {
    return {
      restrict: 'E',
      templateUrl: 'templates/consola.html',
      link: function($scope, $element, $attrs) {
      },
    };
  }

  angular.module('simuladorApp')
    .directive('consola', ConsolaDrtv);
})();