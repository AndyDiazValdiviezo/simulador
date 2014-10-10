(function() {
  angular.element(document).ready(function() {
    var $injector = angular.bootstrap(document, ['simuladorApp']);

    var MixinSrvc = $injector.get('MixinSrvc');
    figuresData.MixinSrvc = MixinSrvc;

    var FiguresSrvc = $injector.get('FiguresSrvc');
    portsData.FiguresSrvc = FiguresSrvc;
  });

  angular
    .module('simuladorApp', ['ui.bootstrap'])
    .run(function($rootScope) {
      $rootScope.numDecimales = 5;
    });
})();