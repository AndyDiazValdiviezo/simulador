var app = angular.module('app', []);

app.run(function(service) {
  LIBELECT.setNumDecimales(service.getNumDecimales());
});