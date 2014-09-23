(function() {
  function UserDataCtrl($scope, MixinSrvc) {
    $scope.elementoSeleccionado;

    MixinSrvc.obsElmSeleccionado().then(null, null, function(value) {
      $scope.elementoSeleccionado = value;
    });

    $scope.getCampo = function(nombreCampo) {
      for (var prop in $scope.elementoSeleccionado.getUserData()) {
        if (nombreCampo == prop) {
          return $scope.elementoSeleccionado.getUserData()[prop];
        };
      }
    }
  }

  angular
    .module('simuladorApp')
    .controller('UserDataCtrl', UserDataCtrl);
})();