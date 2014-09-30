(function() {
  function HeaderCtrl($scope, $modal, FiguresSrvc, CalculosSrvc, StorageSrvc) {
    ///////////////////////////////
    // ----------DATOS---------- //
    ///////////////////////////////
    $scope.espacio = function() {
      return StorageSrvc.espacio;
    }

    $scope.canvasDiagrama = function() {
      return FiguresSrvc.canvasDiagrama;
    }

    /////////////////////////////////
    // ----------MÉTODOS---------- //
    /////////////////////////////////
    $scope.zoomIn = function() {
      $scope.canvasDiagrama().setZoom($scope.canvasDiagrama().getZoom() * (4 / 5), true);
    }

    $scope.zoomOut = function() {
      $scope.canvasDiagrama().setZoom($scope.canvasDiagrama().getZoom() * (5 / 4), true);
    }

    $scope.cargar = function(file) {
      $scope.canvasDiagrama().clear();

      var reader = new draw2d.io.json.Reader();
      reader.unmarshal($scope.canvasDiagrama(), file);
    }

    $scope.exportar = function() {
      var modalInstance = $modal.open({
        templateUrl: 'public/templates/saveAs.html',
        controller: 'SaveAsCtrl',
        size: 'md',
        resolve: {},
      });

      modalInstance.result.then(function() {}, function() {});
    }

    $scope.guardar = function() {
      mostrar = function() {}

      var nombreArchivo = 'PruebaJSON.json';
      $scope.espacio().getFile(nombreArchivo, {
        create: true,
        exclusive: false,
      }, mostrar, function() {
        console.log("ERROR");
      });
    }

    $scope.tipoConexion = function(tipo) {
      if (typeof tipo === 'undefined') {
        return FiguresSrvc.tipoConexion();
      } else {
        FiguresSrvc.tipoConexion(tipo);
      };
    }

    $scope.visibilidadPuertos = function(value) {
      if (typeof value === 'undefined') {
        return FiguresSrvc.visibilidadPuertos();
      } else {
        FiguresSrvc.visibilidadPuertos(value);
      };
    }

    $scope.conexion = function() {
      if ($scope.tipoConexion() == 'conexion') {
        if ($scope.visibilidadPuertos()) {
          $scope.visibilidadPuertos(false);
        } else {
          $scope.visibilidadPuertos(true);
        };

      } else {
        $scope.tipoConexion('conexion');

        if ($scope.visibilidadPuertos()) {} else {
          $scope.visibilidadPuertos(true);
        };
      };
    }

    $scope.linea = function() {
      if ($scope.tipoConexion() == 'linea') {
        if ($scope.visibilidadPuertos()) {
          $scope.visibilidadPuertos(false);
        } else {
          $scope.visibilidadPuertos(true);
        };

      } else {
        $scope.tipoConexion('linea');

        if ($scope.visibilidadPuertos()) {} else {
          $scope.visibilidadPuertos(true);
        };
      };
    }

    $scope.calcular = function() {
      var aElementos = [];

      for (var i = 0; i < $scope.canvasDiagrama().figures.data.length; i++) {
        aElementos.push($scope.canvasDiagrama().figures.data[i].userData);
      };
      for (var i = 0; i < $scope.canvasDiagrama().lines.data.length; i++) {
        var line = $scope.canvasDiagrama().lines.data[i];

        if (line.NAME == 'Linea') {
          aElementos.push($scope.canvasDiagrama().lines.data[i].userData);
        };
      };

      var resultaados = CalculosSrvc.calculoIterativo(FiguresSrvc.cantidadBarras(), aElementos);
      $scope.mostrarResultados(resultaados);
    }

    $scope.mostrarResultados = function(resultaados) {
      var modalInstance = $modal.open({
        templateUrl: 'templates/consola.html',
        controller: 'ResultadosCtrl',
        size: 'md',
        resolve: {},
      });

      modalInstance.result.then(function() {
        console.log('entrada');
      }, function() {
        console.log('salida');
      });
    };
  }

  angular
    .module('simuladorApp')
    .controller('HeaderCtrl', HeaderCtrl);
})();