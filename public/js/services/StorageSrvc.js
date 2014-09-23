function StorageSrvc() {
  var my = {};

  acceso = function() {
    window.webkitRequestFileSystem(PERSISTENT, 5 * 1024 * 1024, crearSis, my.errores);
  }

  crearSis = function(sistema) {
    my.espacio = sistema.root;
  }

  my.errores = function() {
    console.log('errores');
  }

  navigator.webkitPersistentStorage.requestQuota(5 * 1024 * 1024, acceso);

  return my;
}

angular
  .module('simuladorApp')
  .factory('StorageSrvc', StorageSrvc);