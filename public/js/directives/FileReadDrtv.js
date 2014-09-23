(function() {
  function DiagramaDrtv(DefaultSrvc) {
    return function($scope, $element, $attrs) {
      $element.bind('change', function(evt) {
        $scope.$apply(function() {
          var lector = new FileReader();
          var file = evt.target.files[0];

          lector.readAsText(file);
          lector.addEventListener('load', function(e) {
            $scope.cargar(e.target.result);
          }, false);
        });
      });
    };
  }

  angular.module('simuladorApp')
    .directive('fileread', DiagramaDrtv);
})();