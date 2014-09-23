(function() {
  function PaletaCtrl($scope, FiguresSrvc) {
    $scope.svgElemOrdenados = function () {
      return FiguresSrvc.svgElemOrdenados;
    };
  }

  angular
    .module('simuladorApp')
    .controller('PaletaCtrl', PaletaCtrl);
})();