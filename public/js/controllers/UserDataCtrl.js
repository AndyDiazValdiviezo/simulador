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

    $scope.getCampoGrupo = function(nombreGrupo, nombreCampo) {
      for (var prop in $scope.elementoSeleccionado.getUserData()) {
        if (nombreGrupo == prop) {
          for (var prop2 in $scope.elementoSeleccionado.getUserData()[prop]) {
            if (nombreCampo == prop2) {
              return $scope.elementoSeleccionado.getUserData()[prop][prop2];
            };
          }
        };
      }
    }

    $scope.setCampoCalculado = function(campo) {
      console.log(campo);
      console.log(this);
    }
  }

  angular
    .module('simuladorApp')
    .controller('UserDataCtrl', UserDataCtrl);
})();