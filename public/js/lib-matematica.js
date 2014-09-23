/**
 * ------------------------------------------------------
 * FUNCIONES MATEMÁTICAS
 * ------------------------------------------------------
 * Grupo de funciones matemáticas que agregan
 * funcionalidad no disponible en la libreria Math
 * ------------------------------------------------------
 */
function formatFloat(value) {
  value = parseFloat(value);
  value = (isNaN(value)) ? 0 : value;

  return value;
}

function decRound(value, dec) {
  value = formatFloat(value);
  return Math.round((value * Math.pow(10, dec))) / Math.pow(10, dec);
}

function toRadians(value) {
  return value * (Math.PI / 180);
}

function toGradians(value) {
  return value * (180 / Math.PI);
}

function radSin(value) {
  return Math.sin(toRadians(value));
}

function radCos(value) {
  return Math.cos(toRadians(value));
}

function radArcTan(value) {
  return toGradians(Math.atan(value));
}

function sumarVectores(v1, v2) {
  var vr = [];

  var vmx = v1['modulo'] * radCos(v1['angulo']) + v2['modulo'] * radCos(v2['angulo']);
  var vmy = v1['modulo'] * radSin(v1['angulo']) + v2['modulo'] * radSin(v2['angulo']);

  vr['modulo'] = decRound(Math.sqrt(Math.pow(vmx, 2) + Math.pow(vmy, 2)), LIBELECT.getNumDecimales());

  if (vmx == 0) {
    if (vmy >= 0) {
      vr['angulo'] = 90;
    };
    if (vmy < 0) {
      vr['angulo'] = -90;
    };

  } else {
    var angulo = decRound(radArcTan(Math.abs(vmy / vmx)), LIBELECT.getNumDecimales());
    if (vmx > 0 && vmy >= 0) {
      vr['angulo'] = angulo
    };
    if (vmx > 0 && vmy < 0) {
      vr['angulo'] = -angulo
    };
    if (vmx < 0 && vmy >= 0) {
      vr['angulo'] = 180 - angulo
    };
    if (vmx < 0 && vmy < 0) {
      vr['angulo'] = 180 + angulo
    };
  };

  return vr;
}

function restarVectores(v1, v2) {
  var vr = [];

  var vmx = v1['modulo'] * radCos(v1['angulo']) + v2['modulo'] * radCos(v2['angulo']);
  var vmy = v1['modulo'] * radSin(v1['angulo']) + v2['modulo'] * radSin(v2['angulo']);

  vr['modulo'] = decRound(Math.sqrt(Math.pow(vmx, 2) + Math.pow(vmy, 2)), LIBELECT.getNumDecimales());

  if (vmx == 0) {
    if (vmy >= 0) {
      vr['angulo'] = 90;
    };
    if (vmy < 0) {
      vr['angulo'] = -90;
    };

  } else {
    var angulo = decRound(radArcTan(Math.abs(vmy / vmx)), LIBELECT.getNumDecimales());
    if (vmx > 0 && vmy >= 0) {
      vr['angulo'] = angulo
    };
    if (vmx > 0 && vmy < 0) {
      vr['angulo'] = -angulo
    };
    if (vmx < 0 && vmy >= 0) {
      vr['angulo'] = 180 - angulo
    };
    if (vmx < 0 && vmy < 0) {
      vr['angulo'] = 180 + angulo
    };
  };

  return vr;
}