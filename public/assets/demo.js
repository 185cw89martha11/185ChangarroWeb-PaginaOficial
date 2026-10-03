/* 185ChangarroWeb · visor de vistas previas (/demo/) */
(function () {
  'use strict';
  var PY = window.Changarro;
  var box = document.getElementById('ld');
  var crear = '../crear/' + (location.protocol === 'file:' ? 'index.html' : '');

  function fail() {
    box.innerHTML = '<div><p>No pudimos abrir esta vista previa: el enlace está incompleto o su navegador es muy antiguo.</p><p style="margin-top:12px"><a href="' + crear + '">Crear una vista previa nueva →</a></p></div>';
  }
  function show(data) {
    if (!data || typeof data !== 'object') return fail();
    var html = PY.renderSite(data, { mode: 'demo', home: '../' });
    document.open();
    document.write(html);
    document.close();
  }

  // Se espera a que termine de leerse esta página: si document.open() corre mientras el
  // navegador todavía lee el HTML, se ignora y la vista previa se pega debajo del "Cargando…".
  function start() {
    var m = location.hash.match(/[#&]d=([^&]+)/);
    if (m) {
      PY.decodeData(m[1]).then(show, fail);
    } else {
      var q = new URLSearchParams(location.search);
      if (q.get('n') || q.get('t')) show(PY.fromParams(q));
      else location.replace(crear);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
