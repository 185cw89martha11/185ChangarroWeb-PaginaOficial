/* 185ChangarroWeb — buzón de solicitudes en una Hoja de Google.
   Se pega en Extensiones > Apps Script de una Hoja de la cuenta 185changarroweb@gmail.com.
   Pasos completos en integraciones/README.md.

   Solo el servidor de Render le habla, con el SECRETO guardado en Configuración del proyecto > Propiedades de la secuencia de comandos.
   Las solicitudes se quedan aquí solo hasta que el panel de administración las descarga; después se borran. */

var HOJA = 'Solicitudes';

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return respuesta({ ok: false, error: 'json' }); }

  var secreto = PropertiesService.getScriptProperties().getProperty('SECRETO');
  if (!secreto || body.secreto !== secreto) return respuesta({ ok: false, error: 'secreto' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var hoja = obtenerHoja();

    if (body.accion === 'agregar') {
      var s = body.solicitud || {};
      hoja.appendRow([s.id, s.recibida, s.negocio, JSON.stringify(s)]);
      return respuesta({ ok: true });
    }

    if (body.accion === 'listar') {
      var filas = hoja.getLastRow() > 1 ? hoja.getRange(2, 1, hoja.getLastRow() - 1, 4).getValues() : [];
      var lista = [];
      filas.forEach(function (f) { if (f[0]) { try { lista.push(JSON.parse(f[3])); } catch (err) {} } });
      return respuesta({ ok: true, solicitudes: lista });
    }

    if (body.accion === 'borrar') {
      var ids = {};
      (body.ids || []).forEach(function (id) { ids[id] = true; });
      // De abajo hacia arriba para que no se recorran las filas al borrar.
      for (var r = hoja.getLastRow(); r >= 2; r--) {
        if (ids[hoja.getRange(r, 1).getValue()]) hoja.deleteRow(r);
      }
      return respuesta({ ok: true });
    }

    return respuesta({ ok: false, error: 'accion' });
  } finally {
    lock.releaseLock();
  }
}

function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(['id', 'recibida', 'negocio', 'datos']);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
