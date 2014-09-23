/**
 * -------------------------------
 * AYUDAS PARA JAVASCRIPT
 * -------------------------------
 */
function count(array) {
  var cont = 0;

  for (var prop in array) {
    if (array.hasOwnProperty(prop)) {
      cont++;
    }
  }

  return cont;
}

function safeDiv(a, b) {
  var div = a / b;
  div = (isNaN(div)) ? 0 : div;

  return div;
}