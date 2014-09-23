Global = Class.extend({
  init: function() {
    this.tipoConexion = '';
  },
  setTipoConexion: function(tipo) {
    this.tipoConexion = tipo;
  }
});

var global = new Global();