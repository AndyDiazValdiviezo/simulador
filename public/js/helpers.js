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

function decimalFormat(evt, field) {
  var charCode = (evt.which) ? evt.which : event.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
    if (charCode == 45) {
      var valor = field.get(0).value;
      if (valor.indexOf('-') != -1) {
        return false;
      };
      if (field.get(0).selectionStart > 0) {
        return false;
      };
    } else {
      return false;
    };
  } else {
    if (evt.target.value.search(/\./) > -1 && charCode == 46) {
      return false;
    }
  }

  return true;
}

function safeDiv(a, b) {
  var div = a / b;
  div = (isNaN(div)) ? 0 : div;

  return div;
}