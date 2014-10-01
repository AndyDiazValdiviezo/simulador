(function() {
  function FormatDrtv() {
    return {
      restrict: 'A',
      scope: {
        tipo: '@tipo',
      },
      link: function($scope, $element, $attrs) {
        switch ($scope.tipo) {
          case 'decimal':
            $element.on('keypress', function(evt) {
              return decimalFormat(evt, $element);
            });
            break;
        }
      },
    }
  }

  angular.module('simuladorApp')
    .directive('format', FormatDrtv);
})();