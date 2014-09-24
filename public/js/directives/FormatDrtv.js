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
              var charCode = (evt.which) ? evt.which : event.keyCode;
              if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
              } else {
                if (evt.target.value.search(/\./) > -1 && charCode == 46) {
                  return false;
                }

                return true;
              }
            });
            break;
        }
      },
    }
  }

  angular.module('simuladorApp')
    .directive('format', FormatDrtv);
})();