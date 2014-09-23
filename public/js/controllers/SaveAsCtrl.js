(function() {
  function SaveAsCtrl($scope, $modal, $modalInstance, FiguresSrvc, StorageSrvc) {
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
    $scope.ok = function() {
      var jsonTxt;
      var writer = new draw2d.io.json.Writer();

      writer.marshal($scope.canvasDiagrama(), function(json) {
        jsonTxt = JSON.stringify(json, null, 2);
      });

      var blob = new Blob([jsonTxt], {
        type: "application/json;charset=utf-8",
      });
      saveAs(blob, $scope.fileName + '.json');

      $modalInstance.dismiss('cancel');
    }

    $scope.cancelar=function () {
      $modalInstance.dismiss('close');
    }
  }

  angular
    .module('simuladorApp')
    .controller('SaveAsCtrl', SaveAsCtrl);
})();