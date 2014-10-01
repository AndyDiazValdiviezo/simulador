(function() {
  angular
    .module('simuladorApp', ['ui.bootstrap'])
    .run(function($rootScope) {
      $rootScope.numDecimales = 5;
    });
})();