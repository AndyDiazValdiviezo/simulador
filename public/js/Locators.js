//////////////////////////////////
// ----------LOCATORS---------- //
//////////////////////////////////

// ----------BARRA----------
BarraHybridLocator = draw2d.layout.locator.InputPortLocator.extend({
  NAME: 'BarraHybridLocator',
  init: function() {
    this._super();
    this.indice = 'I';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.5;
        y = height * 0.5;
        break;

      case 90:
        x = width * 0.485;
        y = height * 0.5;
        break;

      case 180:
        x = width * 0.5;
        y = height * 0.495;
        break;

      case 270:
        x = width * 0.5;
        y = height * 0.5;
        break;
    }

    figure.setPosition(x, y);
  },
});

// ----------GENERADOR SW----------
GeneradorSWOutputLocator = draw2d.layout.locator.OutputPortLocator.extend({
  NAME: 'GeneradorSWOutputLocator',
  init: function() {
    this._super();
    this.indice = 'I';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.499;
        y = height * 0.969;
        break;

      case 90:
        x = width * 0.0155;
        y = height * 0.4972;
        break;

      case 180:
        x = width * 0.485;
        y = height * 0.0475;
        break;

      case 270:
        x = width * 0.968;
        y = height * 0.485;
        break;
    }

    figure.setPosition(x, y);
  },
});

// ----------GENERADOR PV----------
GeneradorPVOutputLocator = draw2d.layout.locator.OutputPortLocator.extend({
  NAME: 'GeneradorPVOutputLocator',
  init: function() {
    this._super();
    this.indice = 'I';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.502;
        y = height * 0.97;
        break;

      case 90:
        x = width * 0.015;
        y = height * 0.495;
        break;

      case 180:
        x = width * 0.482;
        y = height * 0.015;
        break;

      case 270:
        x = width * 0.97;
        y = height * 0.485;
        break;
    }

    figure.setPosition(x, y);
  },
});

// ----------TRANSFORMADOR 2D----------
Transformador2DOutputLocator1 = draw2d.layout.locator.OutputPortLocator.extend({
  NAME: 'Transformador2DOutputLocator1',
  init: function() {
    this._super();
    this.indice = 'I';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.5;
        y = height * 0.015;
        break;

      case 90:
        x = width * 0.97;
        y = height * 0.497;
        break;

      case 180:
        x = width * 0.484;
        y = height * 0.97;
        break;

      case 270:
        x = width * 0.0155;
        y = height * 0.485;
        break;
    }

    figure.setPosition(x, y);
  },
});
Transformador2DOutputLocator2 = draw2d.layout.locator.OutputPortLocator.extend({
  NAME: 'Transformador2DOutputLocator2',
  init: function() {
    this._super();
    this.indice = 'J';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.505;
        y = height * 0.985;
        break;

      case 90:
        x = width * 0.005;
        y = height * 0.5;
        break;

      case 180:
        x = width * 0.48;
        y = height * 0.005;
        break;

      case 270:
        x = width * 0.985;
        y = height * 0.485;
        break;
    }

    figure.setPosition(x, y);
  },
});

// ----------TRANSFORMADOR 3D----------
Transformador3DOutputLocator1 = draw2d.layout.locator.OutputPortLocator.extend({
  NAME: 'Transformador3DOutputLocator1',
  init: function() {
    this._super();
    this.indice = 'I';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.5;
        y = height * 0.06;
        break;

      case 90:
        x = width * 0.92;
        y = height * 0.5;
        break;

      case 180:
        x = width * 0.49;
        y = height * 0.925;
        break;

      case 270:
        x = width * 0.055;
        y = height * 0.49;
        break;
    }

    figure.setPosition(x, y);
  },
});
Transformador3DOutputLocator2 = draw2d.layout.locator.OutputPortLocator.extend({
  NAME: 'Transformador3DOutputLocator2',
  init: function() {
    this._super();
    this.indice = 'J';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.16;
        y = height * 0.922;
        break;

      case 90:
        x = width * 0.065;
        y = height * 0.158;
        break;

      case 180:
        x = width * 0.825;
        y = height * 0.07;
        break;

      case 270:
        x = width * 0.92;
        y = height * 0.83;
        break;
    }

    figure.setPosition(x, y);
  },
});
Transformador3DOutputLocator3 = draw2d.layout.locator.OutputPortLocator.extend({
  NAME: 'Transformador3DOutputLocator3',
  init: function() {
    this._super();
    this.indice = 'K';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.85;
        y = height * 0.925;
        break;

      case 90:
        x = width * 0.06;
        y = height * 0.85;
        break;

      case 180:
        x = width * 0.14;
        y = height * 0.075;
        break;

      case 270:
        x = width * 0.925;
        y = height * 0.14;
        break;
    }

    figure.setPosition(x, y);
  },
});

// ----------CARGA----------
CargaOutputLocator = draw2d.layout.locator.OutputPortLocator.extend({
  NAME: 'CargaOutputLocator',
  init: function() {
    this._super();
    this.indice = 'I';
  },
  relocate: function(index, figure) {
    var width = figure.getParent().getWidth();
    var height = figure.getParent().getHeight();
    var angle = figure.getParent().getRotationAngle();

    var x = 0;
    var y = 0;

    switch (angle) {
      case 0:
        x = width * 0.5;
        y = height * 0.14;
        break;

      case 90:
        x = width * 0.85;
        y = height * 0.5;
        break;

      case 180:
        x = width * 0.487;
        y = height * 0.86;
        break;

      case 270:
        x = width * 0.14;
        y = height * 0.487;
        break;
    }

    figure.setPosition(x, y);
  },
});