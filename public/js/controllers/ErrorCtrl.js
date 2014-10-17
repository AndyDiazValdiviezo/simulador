(function() {
  function ErrorCtrl($scope, $modalInstance, mensaje) {
    $scope.mensaje = mensaje;

    $scope.cerrar = function() {
      $modalInstance.dismiss('close');
    }
  }

  angular
    .module('simuladorApp')
    .controller('ErrorCtrl', ErrorCtrl);
})();