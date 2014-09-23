(function() {
  function UserDataDrtv(DefaultSrvc) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/user-data.html',
      link: function($scope, $element, $attrs) {
      },
    };
  }

  angular.module('simuladorApp')
    .directive('userdata', UserDataDrtv);
})();