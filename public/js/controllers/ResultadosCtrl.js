(function() {
  function ResultadosCtrl($scope, $rootScope, $modalInstance, $sce, resultados, FiguresSrvc) {
    $scope.cerrar = function() {
      $modalInstance.dismiss('close');
    }

    $scope.cantidadBarras = function() {
      return FiguresSrvc.cantidadBarras();
    };

    $scope.dataAdmitancias = {};

    for (var i = 0; i < $scope.cantidadBarras(); i++) {
      for (var j = 0; j < $scope.cantidadBarras(); j++) {
        var prop = '[' + (i + 1) + ' - ' + (j + 1) + ']';
        var invProp = '[' + (j + 1) + ' - ' + (i + 1) + ']';

        var admitancia = resultados.Y.subset(math.index(i, j));

        if (!$scope.dataAdmitancias.hasOwnProperty(invProp)) {
          if (admitancia) {
            $scope.dataAdmitancias[prop] = math.round(
              admitancia, $rootScope.numDecimales
            ).toString();
          };
        };
      };
    };


    $scope.dataPotencias = {};

    for (var i = 0; i < $scope.cantidadBarras(); i++) {
      for (var j = 0; j < $scope.cantidadBarras(); j++) {
        var prop = '[' + (i + 1) + ' - ' + (j + 1) + ']';

        var activa = resultados.P.subset(math.index(i, j));
        var reactiva = resultados.Q.subset(math.index(i, j));

        if (activa) {
          $scope.dataPotencias[prop] = {
            activa: math.round(
              activa, $rootScope.numDecimales
            ).toString(),
            reactiva: math.round(
              reactiva, $rootScope.numDecimales
            ).toString(),
          }
        };
      };
    };

    $scope.dataVoltajes = {};

    for (var i = 0; i < $scope.cantidadBarras(); i++) {
      var prop = '[' + (i + 1) + ']';

      var voltaje = resultados.V.subset(math.index(i));

      if (voltaje) {
        var polar = voltaje.toPolar();
        var r = math.round(polar.r, $rootScope.numDecimales);

        var phi = math.round(
          math.multiply(
            polar.phi,
            math.divide(180, math.pi)
          ),
          $rootScope.numDecimales
        );

        $scope.dataVoltajes[prop] = $sce.trustAsHtml(r + ' α ' + phi);
      };
    };
  }

  angular
    .module('simuladorApp')
    .controller('ResultadosCtrl', ResultadosCtrl);
})();