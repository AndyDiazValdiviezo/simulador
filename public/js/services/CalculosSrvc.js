function CalculosSrvc() {
  var my = {};

  getBarraPorIndice = function(indice, aElementos) {
    for (var i = 0; i < count(aElementos); i++) {
      var elemento = aElementos[i];

      if (elemento.type == 'Barra' && elemento.indexI == indice) {
        return elemento;
      };
    };
  };

  var getElementoEntreBarras = function(aElementos, indiceBarraA, indiceBarraB) {
    for (var i = 0; i < count(aElementos); i++) {
      var elemento = aElementos[i];
      var aIndexes = [];

      if (elemento.type != 'Barra') {
        for (var prop in elemento) {
          if (prop.search('index') == 0) {
            aIndexes.push(elemento[prop]);
          };
        };

        var cont = 0;
        for (var j = 0; j < count(aIndexes); j++) {
          if (aIndexes[j] == indiceBarraA || aIndexes[j] == indiceBarraB) {
            cont++;
          };
        };

        if (cont == 2) {
          return elemento;
        };
      }
    };
  };

  var getElementoPorIndiceTipo = function(indice, tipo, aElementos) {
    for (var i = 0; i < count(aElementos); i++) {
      var elemento = aElementos[i];

      if (elemento.indexI == indice && elemento.type == tipo) {
        return elemento;
      };
    };
  }

  var getImpedancias = function(cantBarras, aElementos) {
    var complexZero = math.complex(0, 0);
    var aImpedancias = math.multiply(math.ones(cantBarras, cantBarras), complexZero);

    for (var i = 0; i < cantBarras; i++) {
      var barraI = getBarraPorIndice(i + 1, aElementos);

      for (var j = i; j < cantBarras; j++) {
        var elemento = getElementoEntreBarras(aElementos, i + 1, j + 1);

        if (elemento) {
          switch (elemento.type) {
            case 'Linea':
              var R = math.number(elemento.resistencia.value);
              var X = math.number(elemento.reactancia.value);
              var L = math.number(elemento.longitud.value);
              var V = math.number(barraI.voltaje.value);

              var modulo = math.divide(
                math.multiply(
                  math.sqrt(
                    math.add(
                      math.pow(R, 2), math.pow(X, 2)
                    )
                  ), L
                ), math.divide(math.pow(V, 2), 100)
              );
              var angulo = math.atan(math.divide(X, R));

              var impedancia = math.complex({
                r: modulo,
                phi: angulo
              });

              aImpedancias.subset(math.index(i, j), impedancia);
              break;

            case 'Transformador2D':
              var Vcc = math.number(elemento.tensionCortoCircuito.value);
              var N = math.number(elemento.potenciaAparente.value);

              var modulo = math.divide(Vcc, N);
              var angulo = 90;

              var impedancia = math.complex({
                r: modulo,
                phi: angulo
              });

              aImpedancias.subset(math.index(i, j), impedancia);
              break;
            case 'Transformador3D':
              if (elemento.indexI == i && elemento.indexJ == j) {
                var indice = 'i-j';
              };
              if (elemento.indexI == i && elemento.indexK == j) {
                var indice = 'i-k';
              };
              if (elemento.indexJ == i && elemento.indexK == j) {
                var indice = 'j-k';
              };

              var elemento = elementoSeparados[indice].elemento;
              var Vcc = math.number(elemento.tensionCortoCircuito.value);
              var N = math.number(elemento.potenciaAparente.value);

              var modulo = math.divide(Vcc, N);
              var angulo = 90;

              var impedancia = math.complex({
                r: modulo,
                phi: angulo
              });

              aImpedancias.subset(math.index(i, j), impedancia);
              break;
          }

          aImpedancias.subset(math.index(j, i), aImpedancias.subset(math.index(i, j)));
        };
      };
    };

    return aImpedancias;
  }

  var getAdmitancias = function(cantBarras, aElementos) {
    var complexZero = math.complex(0, 0);
    var aAdmitancias = math.multiply(math.ones(cantBarras, cantBarras), complexZero);

    var aImpedancias = getImpedancias(cantBarras, aElementos);

    // Admitancias de linea
    for (var i = 0; i < cantBarras; i++) {
      for (var j = i + 1; j < cantBarras; j++) {
        var admitancia = math.divide(1, aImpedancias.subset(math.index(i, j)));
        aAdmitancias.subset(math.index(i, j), admitancia);
        aAdmitancias.subset(math.index(j, i), admitancia);
      };
    };

    // Admitancias propias
    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var voltaje = math.number(barra.voltaje.value);

      for (var j = 0; j < cantBarras; j++) {
        if (i != j) {
          var elemento = getElementoEntreBarras(aElementos, math.add(i, 1), math.add(j, 1));
          if (elemento) {
            if (elemento.type == 'Linea') {
              var admitUsuario = math.number(elemento.admitanciaCapacitiva.value);
              var admitCapacitiva = Linea.prototype.getAdmCpcCalculada(admitUsuario, voltaje);

              var sumatoria = math.sum(
                aAdmitancias.subset(math.index(i, i)),
                aAdmitancias.subset(math.index(i, j)),
                admitCapacitiva
              );

            } else {
              var sumatoria = math.sum(
                aAdmitancias.subset(math.index(i, i)),
                aAdmitancias.subset(math.index(i, j))
              );
            };

            aAdmitancias.subset(math.index(i, i), sumatoria);
          };
        };
      };
    };

    // Admitancias mutuas
    for (var i = 0; i < cantBarras; i++) {
      for (var j = i + 1; j < cantBarras; j++) {
        var multiplicacion = math.multiply(-1, aAdmitancias.subset(math.index(i, j)));
        aAdmitancias.subset(math.index(i, j), multiplicacion);
        aAdmitancias.subset(math.index(j, i), multiplicacion);
      };
    };

    return aAdmitancias;
  }

  var getAdmitanciasCapacitivas = function(cantBarras, aElementos) {
    var aAdmitCapacitivas = math.zeros(cantBarras, cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      for (var j = i; j < cantBarras; j++) {
        var elemento = getElementoEntreBarras(aElementos, math.sum(i, 1), math.sum(j, 1));

        if (elemento) {
          if (elemento.type == 'Linea') {
            var admitCapacitiva = math.number(elemento.admitanciaCapacitiva.value);
            aAdmitCapacitivas.subset(math.index(i, j), admitCapacitiva);
            aAdmitCapacitivas.subset(math.index(j, i), admitCapacitiva);
          };
        };
      };
    };

    return aAdmitCapacitivas;
  }

  var getGeneracionActiva = function(cantBarras, aElementos) {
    var aGeneracionActiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.tipo.value;

      switch (tipo) {
        case 'SW':
          var generadorSW = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorSW', aElementos);
          var generaActiva = math.number(generadorSW.generaActiva.value);
          aGeneracionActiva.subset(math.index(i), generaActiva);
          break;

        case 'PV':
          var generadorPV = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorPV', aElementos);
          var generaActiva = math.number(generadorPV.generaActiva.value);
          aGeneracionActiva.subset(math.index(i), generaActiva);
          break;
      }
    };

    return aGeneracionActiva;
  }

  var getGeneracionReactiva = function(cantBarras, aElementos) {
    var aGeneracionReactiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.tipo.value;

      switch (tipo) {
        case 'SW':
          var generadorSW = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorSW', aElementos);
          var generaReactiva = math.number(generadorSW.generaReactiva.value);
          aGeneracionReactiva.subset(math.index(i), generaReactiva);
          break;

        case 'PV':
          var generadorPV = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorPV', aElementos);
          var generaReactiva = math.number(generadorPV.generaReactiva.value);
          aGeneracionReactiva.subset(math.index(i), generaReactiva);
          break;
      }
    };

    return aGeneracionReactiva;
  }

  var getCargaActiva = function(cantBarras, aElementos) {
    var aCargaActiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var carga = getElementoPorIndiceTipo(math.sum(i, 1), 'Carga', aElementos);

      if (carga) {
        var cargaActiva = math.divide(math.number(carga.cargaActiva.value), 100);
        aCargaActiva.subset(math.index(i), cargaActiva);
      };
    };

    return aCargaActiva;
  }

  var getCargaReactiva = function(cantBarras, aElementos) {
    var aCargaReactiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var carga = getElementoPorIndiceTipo(math.add(i, 1), 'Carga', aElementos);

      if (carga) {
        var cargaReactiva = math.divide(math.number(carga.cargaReactiva.value), 100);
        aCargaReactiva.subset(math.index(i), cargaReactiva);
      };
    };

    return aCargaReactiva;
  }

  var getPotenciaActiva = function(cantBarras, aElementos) {
    var aPotenciaActiva = math.zeros(cantBarras);
    var aGeneracionActiva = getGeneracionActiva(cantBarras, aElementos);
    var aCargaActiva = getCargaActiva(cantBarras, aElementos);

    for (var i = 0; i < cantBarras; i++) {
      var geneActiva = aGeneracionActiva.subset(math.index(i));
      var cargaActiva = aCargaActiva.subset(math.index(i));

      var value = math.subtract(geneActiva, cargaActiva);
      var index = math.index(i);
      aPotenciaActiva.subset(index, value);
    };

    return aPotenciaActiva;
  }

  var getPotenciaReactiva = function(cantBarras, aElementos) {
    var aPotenciaReactiva = math.zeros(cantBarras);
    var aGeneracionReactiva = getGeneracionReactiva(cantBarras, aElementos);
    var aCargaReactiva = getCargaReactiva(cantBarras, aElementos);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.sum(i, 1), aElementos);
      var tipo = barra.tipo.value;

      if (tipo != 'PV') {
        var geneReactiva = aGeneracionReactiva.subset(math.index(i));
        var cargaReactiva = aCargaReactiva.subset(math.index(i));
        var value = math.subtract(geneReactiva, cargaReactiva);
        var index = math.index(i);
        aPotenciaReactiva.subset(index, value);
      };
    };

    return aPotenciaReactiva;
  }

  var getMinimaReactiva = function(cantBarras, aElementos) {
    var aMinimaReactiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.tipo.value;

      if (tipo == 'PV') {
        var generadorPV = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorPV', aElementos);
        var minimaReactiva = math.number(generadorPV.minimaReactiva.value);
        aMinimaReactiva.subset(math.index(i), minimaReactiva);
      };
    };

    return aMinimaReactiva;
  }

  var getMaximaReactiva = function(cantBarras, aElementos) {
    var aMaximaReactiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.tipo.value;

      if (tipo == 'PV') {
        var generadorPV = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorPV', aElementos);
        var maximaReactiva = math.number(generadorPV.maximaReactiva.value);
        aMaximaReactiva.subset(math.index(i), maximaReactiva);
      };
    };

    return aMaximaReactiva;
  }

  var getVoltajesOperativos = function(cantBarras, aElementos) {
    var complexZero = math.complex(0, 0);
    var aVoltajesOperativos = math.multiply(math.ones(cantBarras), complexZero);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.tipo.value;

      switch (tipo) {
        case 'SW':
          var generador = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorSW', aElementos);
          var voltaje = math.complex(math.number(generador.voltajeModulo.value), 0);
          var voltajeBarra = math.number(barra.voltaje.value);
          aVoltajesOperativos.subset(math.index(i), math.divide(voltaje, voltajeBarra));
          break;

        case 'PV':
          var generador = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorPV', aElementos);
          var voltaje = math.complex(math.number(generador.voltajeModulo.value), 0);
          var voltajeBarra = math.number(barra.voltaje.value);
          aVoltajesOperativos.subset(math.index(i), math.divide(voltaje, voltajeBarra));
          break;

        case 'C':
          var voltaje = math.complex(math.number(barra.voltaje.value), 0);
          var voltajeBarra = math.number(barra.voltaje.value);
          aVoltajesOperativos.subset(math.index(i), math.divide(voltaje, voltajeBarra));
          break;
      }
    };

    return aVoltajesOperativos;
  }

  var getVoltajesFijos = function(cantBarras, aElementos) {
    var aVoltajesFijos = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.tipo.value;

      if (tipo == 'PV') {
        var generador = getElementoPorIndiceTipo(math.add(i, 1), 'GeneradorPV', aElementos);
        var voltaje = math.number(generador.voltajeModulo.value);
        var voltajeBarra = math.number(barra.voltaje.value);
        aVoltajesFijos.subset(math.index(i), math.divide(voltaje, voltajeBarra));
      }
    };

    return aVoltajesFijos;
  }

  var getTiposBarra = function(cantBarras, aElementos) {
    var aTiposBarra = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.sum(i, 1), aElementos);
      aTiposBarra.subset(math.index(i), barra.tipo.value);
    };

    return aTiposBarra;
  }

  my.calculoIterativo = function(cantBarras, aElementos) {
    var complexZero = math.complex(0, 0);

    var Y = getAdmitancias(cantBarras, aElementos);
    var P = getPotenciaActiva(cantBarras, aElementos);
    var Q = getPotenciaReactiva(cantBarras, aElementos);

    var Vfijo = getVoltajesFijos(cantBarras, aElementos);
    var V = getVoltajesOperativos(cantBarras, aElementos);

    var GENERA_P = getGeneracionActiva(cantBarras, aElementos);
    var GENERA_Q = getGeneracionReactiva(cantBarras, aElementos);
    var CARGA_P = getCargaActiva(cantBarras, aElementos);
    var CARGA_Q = getCargaReactiva(cantBarras, aElementos);

    var MAX_Q = getMaximaReactiva(cantBarras, aElementos);
    var MIN_Q = getMinimaReactiva(cantBarras, aElementos);

    var Yc = getAdmitanciasCapacitivas(cantBarras, aElementos);
    var Tipo_Barra = getTiposBarra(cantBarras, aElementos);

    var Error = 0.000001;
    var k = 0;
    var Tolerancia = 2 * Error;

    while (Tolerancia > Error && cantBarras > 0 && k < 100) {
      k++;

      var Vtemporal = 0;

      for (var i = 0; i < cantBarras; i++) {
        var indexI = math.index(i);
        var indexII = math.index(i, i);

        var a = V.subset(indexI).re;
        var b = V.subset(indexI).im;

        switch (Tipo_Barra.subset(indexI)) {
          case 'PV':
            while (math.abs(Vtemporal - Vfijo.subset(indexI)) > 0.00001) {
              Q.subset(indexI, 0);

              for (var j = 0; j < cantBarras; j++) {
                var indexJ = math.index(j);
                var indexIJ = math.index(i, j);

                Q.subset(indexI, math.sum(
                  Q.subset(indexI),
                  math.multiply(
                    math.conj(V.subset(indexI)),
                    math.multiply(
                      Y.subset(indexIJ),
                      V.subset(indexJ)
                    )
                  )
                ));
              };

              Q.subset(indexI, math.multiply(Q.subset(indexI).im, -1));
              GENERA_Q.subset(indexI, math.add(Q.subset(indexI), CARGA_Q.subset(indexI)));

              if (MAX_Q.subset(indexI) != 0) {
                if (GENERA_Q.subset(indexI) > MAX_Q.subset(indexI)) {
                  GENERA_Q.subset(indexI, MAX_Q.subset(indexI));
                  Q.subset(indexI, math.subtract(GENERA_Q.subset(indexI), CARGA_Q.subset(indexI)));
                };
              };

              if (MIN_Q.subset(indexI) != 0) {
                if (GENERA_Q.subset(indexI) < MIN_Q.subset(indexI)) {
                  GENERA_Q.subset(indexI, MIN_Q.subset(indexI));
                  Q.subset(indexI, math.subtract(GENERA_Q.subset(indexI), CARGA_Q.subset(indexI)));
                };
              };

              var f = 0;
              for (var j = 0; j < cantBarras; j++) {
                if (j != i) {
                  var indexJ = math.index(j);
                  var indexIJ = math.index(i, j);

                  f = math.sum(math.multiply(
                    Y.subset(indexIJ),
                    V.subset(indexJ)
                  ), f);
                };
              };

              V.subset(indexI, math.multiply(
                math.divide(1, Y.subset(indexII)),
                math.subtract(
                  math.divide(
                    math.complex(P.subset(indexI), math.multiply(Q.subset(indexI), -1)),
                    math.conj(V.subset(indexI))
                  ),
                  f
                )
              ));

              V.subset(indexI, math.multiply(
                V.subset(indexI),
                math.divide(Vfijo.subset(indexI), math.abs(V.subset(indexI)))
              ));

              Vtemporal = math.abs(V.subset(indexI));
            }

            Tolerancia = math.max(
              math.abs(math.subtract(V.subset(indexI).re, a)),
              math.abs(math.subtract(V.subset(indexI).im, b))
            );
            break;

          case 'C':
            var f = 0;
            for (var j = 0; j < cantBarras; j++) {
              var indexIJ = math.index(i, j);
              var indexJ = math.index(j);

              if (j != i) {
                f = math.add(f, math.multiply(
                  Y.subset(indexIJ),
                  V.subset(indexJ)
                ));
              };
            };


            V.subset(indexI, math.multiply(
              math.divide(1, Y.subset(indexII)),
              math.subtract(
                math.divide(
                  math.complex(P.subset(indexI), math.multiply(Q.subset(indexI), -1)),
                  math.conj(V.subset(indexI))
                ),
                f
              )
            ));

            Tolerancia = math.max(
              math.abs(math.subtract(V.subset(indexI).re, a)),
              math.abs(math.subtract(V.subset(indexI).im, b))
            );
            break;
        }
      };
    }

    var N = math.multiply(math.ones(cantBarras), complexZero);

    for (var i = 0; i < cantBarras; i++) {
      var indexI = math.index(i);
      var indexII = math.index(i, i);

      N.subset(indexI, math.multiply(
        V.subset(indexI),
        math.multiply(
          math.conj(Y.subset(indexII)),
          math.conj(V.subset(indexI))
        )
      ));

      for (var j = 0; j < cantBarras; j++) {
        var indexIJ = math.index(i, j);
        var indexJ = math.index(j);

        if (j != i) {
          N.subset(indexI, math.sum(
            N.subset(indexI),
            math.multiply(
              V.subset(indexI),
              math.multiply(
                math.conj(Y.subset(indexIJ)),
                math.conj(V.subset(indexJ))
              )
            )
          ));
        };

        P.subset(indexI, N.subset(indexI).re);
        Q.subset(indexI, N.subset(indexI).im);
      };

      GENERA_P.subset(indexI, math.sum(
        P.subset(indexI),
        CARGA_P.subset(indexI)
      ));

      if (Tipo_Barra.subset(indexI) != 'PV') {
        GENERA_Q.subset(indexI, math.sum(
          Q.subset(indexI),
          CARGA_Q.subset(indexI)
        ));
      };
    };

    for (var i = 0; i < cantBarras; i++) {
      var indexI = math.index(i);

      for (var j = 0; j < cantBarras; j++) {
        var indexJ = math.index(j);
        var indexIJ = math.index(i, j);

        if (j != i) {
          N.subset(indexIJ, math.sum(
            math.multiply(
              V.subset(indexI),
              math.multiply(
                math.subtract(
                  math.conj(V.subset(indexI)),
                  math.conj(V.subset(indexJ))
                ),
                math.multiply(-1, math.conj(Y.subset(indexIJ)))
              )
            ),
            math.multiply(
              V.subset(indexI),
              math.multiply(
                math.conj(V.subset(indexI)),
                Yc.subset(indexIJ)
              )
            )
          ));

          P.subset(indexIJ, N.subset(indexIJ).re);
          Q.subset(indexIJ, N.subset(indexIJ).im);
        };
      };
    };

    var resultado = {
      'V': V,
      'Y': Y,
      'Yc': Yc,
      'P': P,
      'Q': Q,
      'N': N,
    }

    return resultado;
  }

  return my;
}

angular
  .module('simuladorApp')
  .factory('CalculosSrvc', CalculosSrvc);