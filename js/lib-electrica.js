var LIBELECT = LIBELECT || {};

LIBELECT = (function() {
  var my = {};

  var _numDecimales = 0;

  function setNumDecimales(value) {
    _numDecimales = value;
  }

  function getNumDecimales() {
    return _numDecimales;
  }

  my.setNumDecimales = setNumDecimales;
  my.getNumDecimales = getNumDecimales;

  return my;
})();

LIBELECT.funcionesComplejas = (function() {
  var my = {};

  function getBarraPorIndice(indice, aElementos) {
    for (var i = 0; i < count(aElementos); i++) {
      var elemento = aElementos[i];

      if (elemento.tipo == 'barra' && elemento.indexI == indice) {
        return elemento;
      };
    };
  };

  function getElementoEntreBarras(aElementos, indiceBarraA, indiceBarraB) {
    for (var i = 0; i < count(aElementos); i++) {
      var elemento = aElementos[i];
      var aIndexes = [];

      if (elemento.tipo != 'barra') {
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

  function getElementoPorIndiceTipo(indice, tipo, aElementos) {
    for (var i = 0; i < count(aElementos); i++) {
      var elemento = aElementos[i];

      if (elemento.indexI == indice && elemento.tipo == tipo) {
        return elemento;
      };
    };
  }

  function getImpedancias(cantBarras, aElementos) {
    var complexZero = math.complex(0, 0);
    var aImpedancias = math.multiply(math.ones(cantBarras, cantBarras), complexZero);

    for (var i = 0; i < cantBarras; i++) {
      var barraI = getBarraPorIndice(i + 1, aElementos);

      for (var j = i; j < cantBarras; j++) {
        var elemento = getElementoEntreBarras(aElementos, i + 1, j + 1);

        if (elemento) {
          switch (elemento.tipo) {
            case 'linea':
              var datosModelo = elemento.datosModelo;
              var R = math.number(datosModelo.resistencia.valor);
              var X = math.number(datosModelo.reactancia.valor);
              var L = math.number(datosModelo.longitud.valor);
              var V = math.number(barraI.datosModelo.voltaje.valor);

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

            case 'transformador2D':
              var datosModelo = elemento.datosModelo;
              var Vcc = math.number(datosModelo.tensionCortoCircuito.valor);
              var N = math.number(datosModelo.potenciaAparente.valor);

              var modulo = math.divide(Vcc, N);
              var angulo = 90;

              var impedancia = math.complex({
                r: modulo,
                phi: angulo
              });

              aImpedancias.subset(math.index(i, j), impedancia);
              break;
            case 'transformador3D':
              if (elemento.indexI == i && elemento.indexJ == j) {
                var indice = 'i-j';
              };
              if (elemento.indexI == i && elemento.indexK == j) {
                var indice = 'i-k';
              };
              if (elemento.indexJ == i && elemento.indexK == j) {
                var indice = 'j-k';
              };

              var datosModelo = elemento.datosModeloSeparados[indice].datosModelo;
              var Vcc = math.number(datosModelo.tensionCortoCircuito.valor);
              var N = math.number(datosModelo.potenciaAparente.valor);

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

  function getAdmitancias(cantBarras, aElementos) {
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
      var voltaje = math.number(barra.datosModelo.voltaje.valor);

      for (var j = 0; j < cantBarras; j++) {
        if (i != j) {
          var elemento = getElementoEntreBarras(aElementos, math.add(i, 1), math.add(j, 1));
          if (elemento) {
            var datosModelo = elemento.datosModelo;
            var funcionesModelo = elemento.funcionesModelo;

            var admitUsuario = math.number(datosModelo.admitanciaCapacitiva.valor);
            var admitCapacitiva = funcionesModelo.getAdmitCapacCalculada(admitUsuario, voltaje);

            var sumatoria = math.sum(
              aAdmitancias.subset(math.index(i, i)),
              aAdmitancias.subset(math.index(i, j)),
              admitCapacitiva
            );

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

  function getAdmitanciasCapacitivas(cantBarras, aElementos) {
    var aAdmitCapacitivas = math.zeros(cantBarras, cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      for (var j = i; j < cantBarras; j++) {
        var elemento = getElementoEntreBarras(aElementos, math.sum(i, 1), math.sum(j, 1));

        if (elemento) {
          if (elemento.tipo == 'linea') {
            var admitCapacitiva = math.number(elemento.datosModelo.admitanciaCapacitiva.valor);
            aAdmitCapacitivas.subset(math.index(i, j), admitCapacitiva);
            aAdmitCapacitivas.subset(math.index(j, i), admitCapacitiva);
          };
        };
      };
    };

    return aAdmitCapacitivas;
  }

  function getGeneracionActiva(cantBarras, aElementos) {
    var aGeneracionActiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.datosModelo.tipo.valor;

      switch (tipo) {
        case 'SW':
          var generadorSW = getElementoPorIndiceTipo(math.add(i, 1), 'generadorSW', aElementos);
          var generaActiva = math.number(generadorSW.datosModelo.generaActiva.valor);
          aGeneracionActiva.subset(math.index(i), generaActiva);
          break;

        case 'PV':
          var generadorPV = getElementoPorIndiceTipo(math.add(i, 1), 'generadorPV', aElementos);
          var generaActiva = math.number(generadorPV.datosModelo.generaActiva.valor);
          aGeneracionActiva.subset(math.index(i), generaActiva);
          break;
      }
    };

    return aGeneracionActiva;
  }

  function getGeneracionReactiva(cantBarras, aElementos) {
    var aGeneracionReactiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.datosModelo.tipo.valor;

      switch (tipo) {
        case 'SW':
          var generadorSW = getElementoPorIndiceTipo(math.add(i, 1), 'generadorSW', aElementos);
          var generaReactiva = math.number(generadorSW.datosModelo.generaReactiva.valor);
          aGeneracionReactiva.subset(math.index(i), generaReactiva);
          break;

        case 'PV':
          var generadorPV = getElementoPorIndiceTipo(math.add(i, 1), 'generadorPV', aElementos);
          var generaReactiva = math.number(generadorPV.datosModelo.generaReactiva.valor);
          aGeneracionReactiva.subset(math.index(i), generaReactiva);
          break;
      }
    };

    return aGeneracionReactiva;
  }

  function getCargaActiva(cantBarras, aElementos) {
    var aCargaActiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var carga = getElementoPorIndiceTipo(math.sum(i, 1), 'carga', aElementos);

      if (carga) {
        var cargaActiva = math.divide(math.number(carga.datosModelo.cargaActiva.valor), 100);
        aCargaActiva.subset(math.index(i), cargaActiva);
      };
    };

    return aCargaActiva;
  }

  function getCargaReactiva(cantBarras, aElementos) {
    var aCargaReactiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var carga = getElementoPorIndiceTipo(math.add(i, 1), 'carga', aElementos);

      if (carga) {
        var cargaReactiva = math.divide(math.number(carga.datosModelo.cargaReactiva.valor), 100);
        aCargaReactiva.subset(math.index(i), cargaReactiva);
      };
    };

    return aCargaReactiva;
  }

  function getPotenciaActiva(cantBarras, aElementos) {
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

  function getPotenciaReactiva(cantBarras, aElementos) {
    var aPotenciaReactiva = math.zeros(cantBarras);
    var aGeneracionReactiva = getGeneracionReactiva(cantBarras, aElementos);
    var aCargaReactiva = getCargaReactiva(cantBarras, aElementos);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.sum(i, 1), aElementos);
      var tipo = barra.datosModelo.tipo.valor;

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

  function getMinimaReactiva(cantBarras, aElementos) {
    var aMinimaReactiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.datosModelo.tipo.valor;

      if (tipo == 'PV') {
        var generadorPV = getElementoPorIndiceTipo(math.add(i, 1), 'generadorPV', aElementos);
        var minimaReactiva = math.number(generadorPV.datosModelo.minimaReactiva.valor);
        aMinimaReactiva.subset(math.index(i), minimaReactiva);
      };
    };

    return aMinimaReactiva;
  }

  function getMaximaReactiva(cantBarras, aElementos) {
    var aMaximaReactiva = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.datosModelo.tipo.valor;

      if (tipo == 'PV') {
        var generadorPV = getElementoPorIndiceTipo(math.add(i, 1), 'generadorPV', aElementos);
        var maximaReactiva = math.number(generadorPV.datosModelo.maximaReactiva.valor);
        aMaximaReactiva.subset(math.index(i), maximaReactiva);
      };
    };

    return aMaximaReactiva;
  }

  function getVoltajesOperativos(cantBarras, aElementos) {
    var complexZero = math.complex(0, 0);
    var aVoltajesOperativos = math.multiply(math.ones(cantBarras), complexZero);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.datosModelo.tipo.valor;

      switch (tipo) {
        case 'SW':
          var generador = getElementoPorIndiceTipo(math.add(i, 1), 'generadorSW', aElementos);
          var voltaje = math.complex(math.number(generador.datosModelo.voltajeModulo.valor), 0);
          var voltajeBarra = math.number(barra.datosModelo.voltaje.valor);
          aVoltajesOperativos.subset(math.index(i), math.divide(voltaje, voltajeBarra));
          break;

        case 'PV':
          var generador = getElementoPorIndiceTipo(math.add(i, 1), 'generadorPV', aElementos);
          var voltaje = math.complex(math.number(generador.datosModelo.voltajeModulo.valor), 0);
          var voltajeBarra = math.number(barra.datosModelo.voltaje.valor);
          aVoltajesOperativos.subset(math.index(i), math.divide(voltaje, voltajeBarra));
          break;

        case 'C':
          var voltaje = math.complex(math.number(barra.datosModelo.voltaje.valor), 0);
          var voltajeBarra = math.number(barra.datosModelo.voltaje.valor);
          aVoltajesOperativos.subset(math.index(i), math.divide(voltaje, voltajeBarra));
          break;
      }
    };

    return aVoltajesOperativos;
  }

  function getVoltajesFijos(cantBarras, aElementos) {
    var aVoltajesFijos = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.add(i, 1), aElementos);
      var tipo = barra.datosModelo.tipo.valor;

      if (tipo == 'PV') {
        var generador = getElementoPorIndiceTipo(math.add(i, 1), 'generadorPV', aElementos);
        var voltaje = math.number(generador.datosModelo.voltajeModulo.valor);
        var voltajeBarra = math.number(barra.datosModelo.voltaje.valor);
        aVoltajesFijos.subset(math.index(i), math.divide(voltaje, voltajeBarra));
      }
    };

    return aVoltajesFijos;
  }

  function getTiposBarra(cantBarras, aElementos) {
    var aTiposBarra = math.zeros(cantBarras);

    for (var i = 0; i < cantBarras; i++) {
      var barra = getBarraPorIndice(math.sum(i, 1), aElementos);
      aTiposBarra.subset(math.index(i), barra.datosModelo.tipo.valor);
    };

    return aTiposBarra;
  }

  function calculoIterativo(cantBarras, aElementos) {
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

  my.getImpedancias = getImpedancias;
  my.getAdmitancias = getAdmitancias;
  my.getPotenciaActiva = getPotenciaActiva;
  my.getPotenciaReactiva = getPotenciaReactiva;
  my.calculoIterativo = calculoIterativo;

  return my;
})();

LIBELECT.funBasicas = (function() {
  var my = {};
})();