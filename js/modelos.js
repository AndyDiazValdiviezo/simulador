joint.shapes.libreria = {};

/**
 * --------------------------------------
 * ---------------CONEXIÓN---------------
 * --------------------------------------
 */
var modelConexion = joint.shapes.libreria.modelConexion = joint.dia.Link.extend({
  defaults: joint.util.deepSupplement({
    type: 'libreria.modelLink',
    manhattan: true,
    nombreModelo: 'conexion',
    attrs: {
      '.connection': {
        'stroke-width': 1.3,
      },
      '.marker-arrowhead': {
        d: 'M 10 0 L 0 5 L 10 10 z',
      },
      '.marker-vertex': {
        r: 8,
      },
    },
  }, joint.dia.Link.prototype.defaults),
});

/**
 * -----------------------------------
 * ---------------LINEA---------------
 * -----------------------------------
 */
var modelLinea = joint.shapes.libreria.modelLinea = joint.dia.Link.extend({
  defaults: joint.util.deepSupplement({
    type: 'libreria.modelLink',
    manhattan: true,
    nombreModelo: 'linea',
    attrs: {
      '.connection': {
        'stroke-width': 1.3,
      },
      '.marker-arrowhead': {
        d: 'M 10 0 L 0 5 L 10 10 z',
      },
      '.marker-vertex': {
        r: 8,
      },
    },
  }, joint.dia.Link.prototype.defaults),
});

joint.shapes.libreria.modelLinkView = joint.dia.LinkView.extend({
  pointerdown: function(evt, x, y) {
    joint.dia.CellView.prototype.pointerdown.apply(this, arguments);

    this._dx = x;
    this._dy = y;

    if (this.options.interactive === false) return;

    var className = evt.target.getAttribute('class');

    switch (className) {
      case 'marker-vertex':
        this._action = 'vertex-move';
        this._vertexIdx = evt.target.getAttribute('idx');
        break;

      case 'marker-vertex-remove':
      case 'marker-vertex-remove-area':
        this.removeVertex(evt.target.getAttribute('idx'));
        break;

      case 'marker-arrowhead':
        this.startArrowheadMove(evt.target.getAttribute('end'));
        break;

      default:

        var targetParentEvent = evt.target.parentNode.getAttribute('event');

        if (targetParentEvent) {
          if (targetParentEvent === 'remove') {
            this.model.remove();
          } else {
            this.paper.trigger(targetParentEvent, evt, this, x, y);
          }
        }
    }
  },
  pointerdblclick: function(evt, x, y) {
    this._vertexIdx = this.addVertex({
      x: x,
      y: y
    });
    this._action = 'vertex-move';
  },
});

/**
 * -----------------------------------
 * ---------------BARRA---------------
 * -----------------------------------
 */
var modelBarra = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
  markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<path></path>',
    '<rect id="svg_1"/>',
    '<line id="svg_3"/>',
    '</g>',
    '<text class="label"/>',
    '<g class="inPorts"/>',
    '<g class="outPorts"/>',
    '</g>',
  ].join(''),
  portMarkup: '<g class="puerto port<%= id %>"><circle/><text/></g>',
  scale: function(factor) {
    var width = this.attributes.size.width;
    var height = this.attributes.size.height;

    this.attributes.escala = factor;
    this.resize(width * factor, height * factor);
  },
  resize: function(width, height) {
    var self = this;

    this.attributes.initPorts(function() {
      self.trigger('batch:start');
      self.set('size', {
        width: width,
        height: height
      });
      self.trigger('batch:stop');
    });

    joint.shapes.basic.Generic.prototype.resize.apply(this, arguments);
    return this;
  },
  defaults: joint.util.deepSupplement({
    init: function() {
      var attrs = this.attrs;
      var jqSvg = $('<div/>').html('<svg></svg>').contents();

      var width = this.size.width;
      var height = this.size.height;
      jqSvg.attr('width', width);

      jqSvg.attr('height', height);

      var markup = modelBarra.prototype.markup;
      var jqMarkup = $(markup);

      for (var selector in attrs) {
        try {
          for (var prop in attrs[selector]) {
            jqMarkup.find(selector).attr(prop, attrs[selector][prop]);
          }
        } catch (e) {}
      }

      jqSvg.append(jqMarkup);
      this.fullMarkup = jqSvg.get(0).outerHTML;
      this.initPorts();
    },
    /**
     * Asigno la posicion de los ports deacuerdo al tamaño del elemento
     */
    initPorts: function(callback) {
      var escala = this.escala;
      var radio = this.attrs['.puerto circle']['r'];
      var longitud = this.attrs['#svg_3'].x2 - this.attrs['#svg_3'].x1;

      var inPosX = this.attrs['#svg_3'].x1 + (longitud * 0.3);
      inPosX *= escala;
      inPosX += radio;

      var inPosY = this.attrs['#svg_3'].y1;
      inPosY *= escala;
      inPosY += radio;

      var outPosX = this.attrs['#svg_3'].x2 - (longitud * 0.3);
      outPosX *= escala;
      outPosX += radio;

      var outPosY = this.attrs['#svg_3'].y2;
      outPosY *= escala;
      outPosY += radio;

      this.attrs['.inPorts circle']['ref-x'] = inPosX;
      this.attrs['.inPorts circle']['ref-y'] = inPosY;

      this.attrs['.outPorts circle']['ref-x'] = outPosX;
      this.attrs['.outPorts circle']['ref-y'] = outPosY;

      if (callback) {
        callback();
      };
    },
    escala: 1,
    fullMarkup: '',
    nombreModelo: 'barra',
    type: 'devs.Model',
    position: {
      x: 0,
      y: 0,
    },
    size: {
      height: 55,
      width: 60,
    },
    inPorts: [''],
    outPorts: [''],
    attrs: {
      '.': {
        magnet: false
      },
      '#svg_1': {
        'height': 55,
        'width': 60,
        'y': 0,
        'x': 0,
        'stroke-width': 0,
        'fill': 'transparent',
      },
      '#svg_3': {
        'x1': 10,
        'y1': 27.5,
        'x2': 50,
        'y2': 27.5,
        'stroke-width': 1.3,
        'stroke': '#666',
        'fill': 'transparent',
      },
      '.puerto circle': {
        r: 5,
        magnet: true,
      },
      '.inPorts circle': {
        fill: '#6489D4',
        type: 'input',
        stroke: 0,
      },
      '.outPorts circle': {
        fill: '#E74C3C',
        type: 'output',
        stroke: 0,
      },
      'inPorts port0': {
        indice: 'i',
      },
      'outPorts port0': {
        indice: 'i',
      },
    }
  }, joint.shapes.basic.Generic.prototype.defaults),
  /*
   */
  getPortAttrs: function(portName, index, total, selector, type) {
    var attrs = {};
    var portClass = 'port' + index;
    var portSelector = selector + '>.' + portClass;
    var portTextSelector = portSelector + '>text';
    var portCircleSelector = portSelector + '>circle';
    attrs[portTextSelector] = {
      text: portName
    };
    attrs[portCircleSelector] = {
      port: {
        id: portName || _.uniqueId(type),
        type: type
      }
    };
    attrs[portSelector] = {
      ref: 'path',
      'ref-y': (index + 0.5) * (1 / total)
    };
    if (selector === '.outPorts') {
      attrs[portSelector]['ref-dx'] = 0;
    }
    return attrs;
  }
}));

/**
 * ---------------------------------------
 * ---------------GENERADOR---------------
 * ---------------------------------------
 */
var modelGenerador = joint.shapes.libreria.modelGenerador = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
  markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect id="svg_1"/>',
    '<ellipse id="svg_2"/>',
    '<line id="svg_3"/>',
    '<path id="svg_5"/>',
    '<path id="svg_6"/>',
    '</g>',
    '<text class="label"/>',
    '<g class="inPorts"/>',
    '<g class="outPorts"/>',
    '</g>',
    '<g class="link-tools"/>',
  ].join(''),
  scale: function(factor) {
    var width = this.attributes.size.width;
    var height = this.attributes.size.height;

    this.attributes.escala = factor;
    this.resize(width * factor, height * factor);
  },
  resize: function(width, height) {
    var self = this;

    this.attributes.initPorts(function() {
      self.trigger('batch:start');
      self.set('size', {
        width: width,
        height: height
      });
      self.trigger('batch:stop');
    });

    joint.shapes.basic.Generic.prototype.resize.apply(this, arguments);
    return this;
  },
  portMarkup: '<g class="puerto port<%= id %>"><circle/><text/></g>',
  defaults: joint.util.deepSupplement({
    init: function() {
      var attrs = this.attrs;
      var jqSvg = $('<div/>').html('<svg></svg>').contents();

      var width = this.size.width;
      var height = this.size.height;
      jqSvg.attr('width', width);

      jqSvg.attr('height', height);

      var markup = modelGenerador.prototype.markup;
      var jqMarkup = $(markup);

      for (var selector in attrs) {
        try {
          for (var prop in attrs[selector]) {
            jqMarkup.find(selector).attr(prop, attrs[selector][prop]);
          }
        } catch (e) {}
      }

      jqSvg.append(jqMarkup);
      this.fullMarkup = jqSvg.get(0).outerHTML;
      this.initPorts();
    },
    /**
     * Asigno la posicion de los ports deacuerdo al tamaño del elemento
     */
    initPorts: function(callback) {
      var escala = this.escala;
      var radio = this.attrs['.puerto circle']['r'];

      var outPosX = this.attrs['#svg_3'].x2;
      outPosX *= escala;
      outPosX += radio;

      var outPosY = this.attrs['#svg_3'].y2;
      outPosY *= escala;
      outPosY += radio;

      this.attrs['.outPorts circle']['ref-x'] = outPosX;
      this.attrs['.outPorts circle']['ref-y'] = outPosY;

      if (callback) {
        callback();
      };
    },
    fullMarkup: '',
    nombreModelo: 'generador',
    type: 'devs.Model',
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 60,
      height: 55,
    },
    outPorts: [''],
    attrs: {
      '.': {
        magnet: false
      },
      '#svg_1': {
        'width': 60,
        'height': 55,
        'y': 0,
        'x': 0,
        'stroke-width': 0,
        'fill': 'transparent',
      },
      '#svg_2': {
        'ry': 14,
        'rx': 15,
        'cy': 22,
        'cx': 30,
        'stroke': '#666',
        'stroke-width': 1.3,
        'fill': 'transparent',
      },
      '#svg_3': {
        'y2': 46,
        'x2': 30,
        'y1': 36,
        'x1': 30,
        'fill-opacity': null,
        'stroke-opacity': null,
        'stroke-width': 1.3,
        'stroke': '#666',
        'fill': 'transparent',
      },
      '#svg5': {
        'd': 'm23.75,25',
        'fill-opacity': null,
        'stroke-opacity': null,
        'stroke-width': 1.3,
        'stroke': '#666',
        'fill': 'transparent',
      },
      '#svg_6': {
        'stroke': '#666',
        'd': 'm20,22.84755c5.5,-4.94 5,-3.42 9.5,-0.38c4.5,3.04 5,3.42 10.5,0',
        'stroke-width': 1.3,
        'fill': 'transparent',
      },
      '.puerto circle': {
        r: 5,
        magnet: true,
      },
      text: {
        fill: '#666',
        'pointer-events': 'none'
      },
      '.outPorts circle': {
        fill: '#E74C3C',
        type: 'output',
        stroke: 0,
      },
      'outPorts port0': {
        indice: 'i',
      },
    }
  }, joint.shapes.basic.Generic.prototype.defaults),
  /*
   */
  getPortAttrs: function(portName, index, total, selector, type) {
    var attrs = {};
    var portClass = 'port' + index;
    var portSelector = selector + '>.' + portClass;
    var portTextSelector = portSelector + '>text';
    var portCircleSelector = portSelector + '>circle';
    attrs[portTextSelector] = {
      text: portName
    };
    attrs[portCircleSelector] = {
      port: {
        id: portName || _.uniqueId(type),
        type: type
      }
    };
    attrs[portSelector] = {
      ref: 'path',
      'ref-y': (index + 0.5) * (1 / total)
    };
    if (selector === '.outPorts') {
      attrs[portSelector]['ref-dx'] = 0;
    }
    return attrs;
  }
}));

/**
 * -------------------------------------------
 * ---------------TRANSFORMADOR---------------
 * -------------------------------------------
 */
var modelTransformador2D = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
  markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<path></path>',
    '<rect id="svg_1"/>',
    '<ellipse id="svg_3"/>',
    '<ellipse id="svg_4"/>',
    '<line id="svg_6"/>',
    '<line id="svg_7"/>',
    '</g>',
    '<text class="label"/>',
    '<g class="inPorts"/>',
    '<g class="outPorts"/>',
    '</g>',
    '<g class="link-tools"/>',
  ].join(''),
  portMarkup: '<g class="puerto port<%= id %>"><circle/><text/></g>',
  scale: function(factor) {
    var width = this.attributes.size.width;
    var height = this.attributes.size.height;

    this.attributes.escala = factor;
    this.resize(width * factor, height * factor);
  },
  resize: function(width, height) {
    var self = this;

    this.attributes.initPorts(function() {
      self.trigger('batch:start');
      self.set('size', {
        width: width,
        height: height
      });
      self.trigger('batch:stop');
    });

    joint.shapes.basic.Generic.prototype.resize.apply(this, arguments);
    return this;
  },
  defaults: joint.util.deepSupplement({
    init: function() {
      var attrs = this.attrs;
      var jqSvg = $('<div/>').html('<svg></svg>').contents();

      var width = this.size.width;
      var height = this.size.height;
      jqSvg.attr('width', width);

      jqSvg.attr('height', height);

      var markup = modelTransformador2D.prototype.markup;
      var jqMarkup = $(markup);

      for (var selector in attrs) {
        try {
          for (var prop in attrs[selector]) {
            jqMarkup.find(selector).attr(prop, attrs[selector][prop]);
          }
        } catch (e) {}
      }

      jqSvg.append(jqMarkup);
      this.fullMarkup = jqSvg.get(0).outerHTML;
      this.initPorts();
    },
    /**
     * Asigno la posicion de los ports deacuerdo al tamaño del elemento
     */
    initPorts: function(callback) {
      var escala = this.escala;
      var radio = this.attrs['.puerto circle']['r'];

      var inPosX = this.attrs['#svg_6'].x1;
      inPosX *= escala;
      inPosX += radio;

      var inPosY = this.attrs['#svg_6'].y1;
      inPosY *= escala;
      inPosY += radio;

      var outPosX = this.attrs['#svg_7'].x2;
      outPosX *= escala;
      outPosX += radio;

      var outPosY = this.attrs['#svg_7'].y2;
      outPosY *= escala;
      outPosY += radio;

      this.attrs['.inPorts circle']['ref-x'] = inPosX;
      this.attrs['.inPorts circle']['ref-y'] = inPosY;

      this.attrs['.outPorts circle']['ref-x'] = outPosX;
      this.attrs['.outPorts circle']['ref-y'] = outPosY;

      if (callback) {
        callback();
      };
    },
    escala: 1,
    fullMarkup: '',
    nombreModelo: 'transformador2D',
    type: 'devs.Model',
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 60,
      height: 55,
    },
    inPorts: [''],
    outPorts: [''],
    attrs: {
      '.': {
        magnet: false
      },
      '#svg_1': {
        'width': 60,
        'height': 55,
        'y': 0,
        'x': 0,
        'stroke-width': 0,
        'fill': 'transparent',
      },
      '#svg_3': {
        'stroke-width': 1.3,
        'ry': 10,
        'rx': 10,
        'cy': 27.5,
        'cx': 23.878935,
        'stroke': '#666666',
        'fill': 'transparent',
      },
      '#svg_4': {
        'stroke-width': 1.3,
        'ry': 10,
        'rx': 10,
        'cy': 27.5,
        'cx': 35.878935,
        'stroke': '#666666',
        'fill': 'transparent',
      },
      '#svg_6': {
        'stroke': '#666666',
        'stroke-linecap': 'null',
        'stroke-linejoin': 'null',
        'y2': 28.165859,
        'x2': 13.287344,
        'y1': 28.165859,
        'x1': 8.087168,
        'stroke-width': 1.3,
        'fill': 'transparent',
      },
      '#svg_7': {
        'stroke': '#666666',
        'stroke-linecap': 'null',
        'stroke-linejoin': 'null',
        'y2': 28.165859,
        'x2': 51.567097,
        'y1': 28.165859,
        'x1': 46.36692,
        'stroke-width': 1.3,
        'fill': 'transparent',
      },
      '.puerto circle': {
        r: 5,
        magnet: true,
      },
      text: {
        fill: '#666',
        'pointer-events': 'none'
      },
      '.inPorts circle': {
        fill: '#6489D4',
        type: 'input',
        stroke: 0,
      },
      '.outPorts circle': {
        fill: '#E74C3C',
        type: 'output',
        stroke: 0,
      },
      'inPorts port0': {
        indice: 'i',
      },
      'outPorts port0': {
        indice: 'j',
      },
    }
  }, joint.shapes.basic.Generic.prototype.defaults),
  getPortAttrs: function(portName, index, total, selector, type) {
    var attrs = {};
    var portClass = 'port' + index;
    var portSelector = selector + '>.' + portClass;
    var portTextSelector = portSelector + '>text';
    var portCircleSelector = portSelector + '>circle';
    attrs[portTextSelector] = {
      text: portName
    };
    attrs[portCircleSelector] = {
      port: {
        id: portName || _.uniqueId(type),
        type: type
      }
    };
    attrs[portSelector] = {
      ref: 'path',
      'ref-y': (index + 0.5) * (1 / total)
    };
    if (selector === '.outPorts') {
      attrs[portSelector]['ref-dx'] = 0;
    }
    return attrs;
  }
}));

/**
 * ----------------------------------------------
 * ---------------TRANSFORMADOR 3D---------------
 * ----------------------------------------------
 */
var modelTransformador3D = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
  markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<path></path>',
    '<rect id="svg_1"/>',
    '<ellipse id="svg_4"/>',
    '<ellipse id="svg_5"/>',
    '<ellipse id="svg_6"/>',
    '<line id="svg_7"/>',
    '<line id="svg_8"/>',
    '<line id="svg_10"/>',
    '</g>',
    '<text class="label"/>',
    '<g class="inPorts"/>',
    '<g class="outPorts"/>',
    '</g>',
    '<g class="link-tools"/>',
  ].join(''),
  portMarkup: '<g class="puerto port<%= id %>"><circle/><text/></g>',
  scale: function(factor) {
    var width = this.attributes.size.width;
    var height = this.attributes.size.height;

    this.attributes.escala = factor;
    this.resize(width * factor, height * factor);
  },
  resize: function(width, height) {
    var self = this;

    this.attributes.initPorts(function() {
      self.trigger('batch:start');
      self.set('size', {
        width: width,
        height: height
      });
      self.trigger('batch:stop');
    });

    joint.shapes.basic.Generic.prototype.resize.apply(this, arguments);
    return this;
  },
  defaults: joint.util.deepSupplement({
    init: function() {
      var attrs = this.attrs;
      var jqSvg = $('<div/>').html('<svg></svg>').contents();

      var width = this.size.width;
      var height = this.size.height;
      jqSvg.attr('width', width);

      jqSvg.attr('height', height);

      var markup = modelTransformador3D.prototype.markup;
      var jqMarkup = $(markup);

      for (var selector in attrs) {
        try {
          for (var prop in attrs[selector]) {
            jqMarkup.find(selector).attr(prop, attrs[selector][prop]);
          }
        } catch (e) {}
      }

      jqSvg.append(jqMarkup);
      this.fullMarkup = jqSvg.get(0).outerHTML;
      this.initPorts();
    },
    /**
     * Asigno la posicion de los ports deacuerdo al tamaño del elemento
     */
    initPorts: function(callback) {
      var escala = this.escala;
      var radio = this.attrs['.puerto circle']['r'];

      var inPosX = this.attrs['#svg_7'].x1;
      inPosX *= escala;
      inPosX += radio;

      var inPosY = this.attrs['#svg_7'].y1;
      inPosY *= escala;
      inPosY += radio;

      var outPosAX = this.attrs['#svg_8'].x2;
      outPosAX *= escala;
      outPosAX += radio;

      var outPosAY = this.attrs['#svg_8'].y2;
      outPosAY *= escala;
      outPosAY += radio;

      var outPosBX = this.attrs['#svg_10'].x2;
      outPosBX *= escala;
      outPosBX += radio;

      var outPosBY = this.attrs['#svg_10'].y2;
      outPosBY *= escala;
      outPosBY += radio;

      this.attrs['.inPorts circle']['ref-x'] = inPosX;
      this.attrs['.inPorts circle']['ref-y'] = inPosY;

      this.attrs['.outPorts .port0 circle']['ref-x'] = outPosAX;
      this.attrs['.outPorts .port0 circle']['ref-y'] = outPosAY;

      this.attrs['.outPorts .port1 circle']['ref-x'] = outPosBX;
      this.attrs['.outPorts .port1 circle']['ref-y'] = outPosBY;

      if (callback) {
        callback();
      };
    },
    escala: 1,
    fullMarkup: '',
    nombreModelo: 'Transformador3D',
    type: 'devs.Model',
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 60,
      height: 55,
    },
    inPorts: [''],
    outPorts: ['', ''],
    attrs: {
      '.': {
        magnet: false
      },
      '#svg_1': {
        'width': 60,
        'height': 55,
        'y': 0,
        'x': 0,
        'stroke-width': 0,
        'fill': 'transparent',
      },
      '#svg_4': {
        'stroke-width': 1.3,
        'ry': 10,
        'rx': 10,
        'cy': 20,
        'cx': 24.25,
        'stroke': '#666666',
        'fill': 'transparent',
      },
      '#svg_5': {
        'stroke-width': 1.3,
        'ry': 10,
        'rx': 10,
        'cy': 35,
        'cx': 24.25,
        'stroke': '#666666',
        'fill': 'transparent',
      },
      '#svg_6': {
        'stroke-width': 1.3,
        'ry': 10,
        'rx': 10,
        'cy': 27.5,
        'cx': 34.25,
        'stroke': '#666666',
        'fill': 'transparent',
      },
      '#svg_7': {
        'stroke': '#666666',
        'stroke-linecap': 'null',
        'stroke-linejoin': 'null',
        'y2': 10,
        'x2': 24.25,
        'y1': 5,
        'x1': 24.2,
        'stroke-width': 1.3,
        'fill': 'transparent',
      },
      '#svg_8': {
        'stroke': '#666666',
        'stroke-linecap': 'null',
        'stroke-linejoin': 'null',
        'y2': 50,
        'x2': 24.25,
        'y1': 45,
        'x1': 24.25,
        'stroke-width': 1.3,
        'fill': 'transparent',
      },
      '#svg_10': {
        'stroke': '#666666',
        'stroke-linecap': 'null',
        'stroke-linejoin': 'null',
        'y2': 27,
        'x2': 49.25,
        'y1': 27,
        'x1': 44.625,
        'stroke-width': 1.3,
        'fill': 'transparent',
      },
      '.puerto circle': {
        r: 5,
        magnet: true,
      },
      text: {
        fill: '#666',
        'pointer-events': 'none'
      },
      '.inPorts circle': {
        fill: '#6489D4',
        type: 'input',
        stroke: 0,
      },
      '.outPorts circle': {
        fill: '#E74C3C',
        type: 'output',
        stroke: 0,
      },
      '.outPorts .port0 circle': {},
      '.outPorts .port1 circle': {
        fill: '#FFEF00',
      },
      'inPorts port0': {
        indice: 'i',
      },
      'outPorts port0': {
        indice: 'j',
      },
      'outPorts port1': {
        indice: 'k',
      },
    }
  }, joint.shapes.basic.Generic.prototype.defaults),
  /*
   */
  getPortAttrs: function(portName, index, total, selector, type) {
    var attrs = {};
    var portClass = 'port' + index;
    var portSelector = selector + '>.' + portClass;
    var portTextSelector = portSelector + '>text';
    var portCircleSelector = portSelector + '>circle';
    attrs[portTextSelector] = {
      text: portName
    };
    attrs[portCircleSelector] = {
      port: {
        id: portName || _.uniqueId(type),
        type: type
      }
    };
    attrs[portSelector] = {
      ref: 'path',
      'ref-y': (index + 0.5) * (1 / total)
    };
    if (selector === '.outPorts') {
      attrs[portSelector]['ref-dx'] = 0;
    }
    return attrs;
  }
}));

/**
 * -----------------------------------
 * ---------------CARGA---------------
 * -----------------------------------
 */
var modelCarga = joint.shapes.libreria.modelCarga = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
  markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<path></path>',
    '<rect id="svg_1"/>',
    '<line id="svg_2"/>',
    '<path id="svg_3"/>',
    '</g>',
    '<text class="label"/>',
    '<g class="inPorts"/>',
    '<g class="outPorts"/>',
    '</g>',
    '<g class="link-tools"/>',
  ].join(''),
  scale: function(factor) {
    var width = this.attributes.size.width;
    var height = this.attributes.size.height;

    this.attributes.escala = factor;
    this.resize(width * factor, height * factor);
  },
  resize: function(width, height) {
    var self = this;

    this.attributes.initPorts(function() {
      self.trigger('batch:start');
      self.set('size', {
        width: width,
        height: height
      });
      self.trigger('batch:stop');
    });

    joint.shapes.basic.Generic.prototype.resize.apply(this, arguments);
    return this;
  },
  portMarkup: '<g class="puerto port<%= id %>"><circle/><text/></g>',
  defaults: joint.util.deepSupplement({
    init: function() {
      var attrs = this.attrs;
      var jqSvg = $('<div/>').html('<svg></svg>').contents();

      var width = this.size.width;
      var height = this.size.height;
      jqSvg.attr('width', width);

      jqSvg.attr('height', height);

      var markup = modelCarga.prototype.markup;
      var jqMarkup = $(markup);

      for (var selector in attrs) {
        try {
          for (var prop in attrs[selector]) {
            jqMarkup.find(selector).attr(prop, attrs[selector][prop]);
          }
        } catch (e) {}
      }

      jqSvg.append(jqMarkup);
      this.fullMarkup = jqSvg.get(0).outerHTML;
      this.initPorts();
    },
    /**
     * Asigno la posicion de los ports deacuerdo al tamaño del elemento
     */
    initPorts: function(callback) {
      var escala = this.escala;
      var radio = this.attrs['.puerto circle']['r'];

      var inPosX = this.attrs['#svg_2'].x1;
      inPosX *= escala;
      inPosX += radio;

      var inPosY = this.attrs['#svg_2'].y1;
      inPosY *= escala;
      inPosY += radio;

      this.attrs['.inPorts circle']['ref-x'] = inPosX;
      this.attrs['.inPorts circle']['ref-y'] = inPosY;

      if (callback) {
        callback();
      };
    },
    fullMarkup: '',
    nombreModelo: 'carga',
    type: 'devs.Model',
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 60,
      height: 55,
    },
    inPorts: [''],
    attrs: {
      '.': {
        magnet: false
      },
      '#svg_1': {
        'width': 60,
        'height': 55,
        'y': 0,
        'x': 0,
        'stroke-width': 0,
        'fill': 'transparent',
      },
      '#svg_2': {
        'stroke': '#666666',
        'stroke-width': 1.3,
        'y2': 35.758163,
        'x2': 30,
        'y1': 8.09255,
        'x1': 30,
        'fill': 'transparent',
      },
      '#svg_3': {
        'd': "m24.687485,45.477894l5.31184,-9.2957l5.31218,9.2957l-10.62402,0z",
        'stroke': '#666666',
        'transform': 'rotate(-180 29.99949455261231,40.83004379272461)',
        'stroke-width': 1.3,
        'fill': 'transparent',
      },
      '.puerto circle': {
        r: 5,
        magnet: true,
      },
      text: {
        fill: '#666',
        'pointer-events': 'none'
      },
      '.inPorts circle': {
        fill: '#6489D4',
        type: 'input',
        stroke: 0,
      },
    }
  }, joint.shapes.basic.Generic.prototype.defaults),
  /*
   */
  getPortAttrs: function(portName, index, total, selector, type) {
    var attrs = {};
    var portClass = 'port' + index;
    var portSelector = selector + '>.' + portClass;
    var portTextSelector = portSelector + '>text';
    var portCircleSelector = portSelector + '>circle';
    attrs[portTextSelector] = {
      text: portName
    };
    attrs[portCircleSelector] = {
      port: {
        id: portName || _.uniqueId(type),
        type: type
      }
    };
    attrs[portSelector] = {
      ref: 'path',
      'ref-y': (index + 0.5) * (1 / total)
    };
    if (selector === '.outPorts') {
      attrs[portSelector]['ref-dx'] = 0;
    }
    return attrs;
  }
}));