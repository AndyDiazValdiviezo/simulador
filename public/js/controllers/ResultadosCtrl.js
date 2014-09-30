(function() {
  function ResultadosCtrl($scope, $modalInstance) {
    $scope.cerrar = function() {
      $modalInstance.dismiss('close');
    }
  }

  angular
    .module('simuladorApp')
    .controller('ResultadosCtrl', ResultadosCtrl);
})();