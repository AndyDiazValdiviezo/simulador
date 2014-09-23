function MixinSrvc($q) {
  var my = {};

  var defElmSeleccionado = $q.defer();

  my.obsElmSeleccionado = function() {
    return defElmSeleccionado.promise;
  }

  my.setElmSeleccionado = function(elemento) {
    defElmSeleccionado.notify(elemento);
  }

  return my;
}

angular
  .module('simuladorApp')
  .factory('MixinSrvc', MixinSrvc);