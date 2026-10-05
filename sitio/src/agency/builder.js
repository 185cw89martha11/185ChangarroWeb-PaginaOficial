/* 185ChangarroWeb · creador de vistas previas (/crear/) */
(function () {
  'use strict';
  var PY = window.Changarro, PRESETS = PY.PRESETS, AG = PY.AGENCY || {};
  var form = document.getElementById('bld');
  var E = form.elements;
  var iframe = document.getElementById('pv');
  var frameBox = document.getElementById('pvf');
  var fullLink = document.querySelector('[data-full]');
  var publish = document.querySelector('[data-publish]');
  var DRAFT = 'py-builder:v1';
  var PAY = ['Efectivo', 'Transferencia', 'Tarjeta', 'Otro método de pago'];
  var SHORT_KEYS = ['tipo', 'nombre', 'whatsapp', 'zona', 'direccion', 'telefono', 'eslogan', 'color'];
  var touched = {}, colorCustom = false, lastUrl = '', timer = null, seq = 0;

  // Rutas: locales para ver; públicas para compartir cuando el sitio está abierto en la computadora.
  var ROOT = new URL('../', location.href).href;
  var FILE = location.protocol === 'file:';
  var LOCAL = FILE || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var PUBLIC = String(AG.url || '').replace(/\/+$/, '') + '/';
  function local(p) { return ROOT + p + (FILE ? 'index.html' : ''); }
  function shared(p) { return (LOCAL && AG.url ? PUBLIC : ROOT) + p; }
  if (LOCAL && AG.url) {
    var note = document.getElementById('local-note');
    note.textContent = 'Está viendo el sitio desde su computadora. Los enlaces que copie o envíe apuntan a ' + PUBLIC + ' y funcionarán cuando el sitio esté publicado.';
    note.hidden = false;
  }

  function val(n) { return E[n] ? String(E[n].value || '').trim() : ''; }
  function preset() { return PRESETS[E.tipo.value] || PRESETS[Object.keys(PRESETS)[0]]; }
  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  /* ----- horario y pagos ----- */
  function hoursFromForm() { var h = {}; PY.DAYS.forEach(function (d) { h[d] = val('h_' + d); }); return h; }
  function hoursToForm(h) { PY.DAYS.forEach(function (d) { E['h_' + d].value = (h && h[d]) || ''; }); }
  function hoursKey(h) { return PY.DAYS.map(function (d) { return PY.rangesText(PY.parseDay(h && h[d])); }).join('|'); }
  function pagosFromForm() { return Array.prototype.filter.call(form.querySelectorAll('[name=pagos]'), function (c) { return c.checked; }).map(function (c) { return c.value; }); }
  function setPagos(list) { Array.prototype.forEach.call(form.querySelectorAll('[name=pagos]'), function (c) { c.checked = list.indexOf(c.value) > -1; }); }
  function sameSet(a, b) { return a.slice().sort().join('|') === b.slice().sort().join('|'); }

  /* ----- datos del formulario ----- */
  function collect(full) {
    var P = preset();
    var d = { tipo: E.tipo.value, nombre: val('nombre') };
    function opt(k, v) { if (v) d[k] = v; }
    opt('whatsapp', val('whatsapp').replace(/\D/g, ''));
    opt('eslogan', val('eslogan'));
    opt('telefono', val('telefono'));
    opt('direccion', val('direccion'));
    opt('zona', val('zona'));
    opt('correo', val('correo'));
    if (full || norm(E.catalogo.value) !== norm(PY.catalogToText(P.catalogo))) d.catalogo = PY.textToCatalog(E.catalogo.value);
    var h = hoursFromForm();
    if (full || hoursKey(h) !== hoursKey(P.horario)) d.horario = h;
    if (full || E.pedidos.checked !== !!P.orders) d.pedidos = E.pedidos.checked;
    opt('nosotros', val('nosotros'));
    var pagos = pagosFromForm();
    if (full || !sameSet(pagos, P.pagos)) d.pagos = pagos;
    if (full || val('entrega') !== (P.entrega || '')) d.entrega = val('entrega');
    if (E.tipo.value === 'salud') opt('cedula', val('cedula'));
    var redes = {};
    ['facebook', 'instagram', 'tiktok'].forEach(function (k) { if (val(k)) redes[k] = val(k); });
    if (Object.keys(redes).length) d.redes = redes;
    opt('portada', val('portada'));
    if (colorCustom) d.color = E.color.value;
    if (full) {
      // Archivo completo para clientes/<slug>/datos.json
      return {
        tipo: d.tipo, nombre: d.nombre, titular: '', eslogan: d.eslogan || P.tagline, whatsapp: d.whatsapp || '', telefono: d.telefono || '', correo: d.correo || '',
        direccion: d.direccion || '', zona: d.zona || '', mapa: '', horario: d.horario, catalogo: d.catalogo, pedidos: d.pedidos,
        nosotros: d.nosotros || P.about, destacados: P.highlights, preguntas: P.preguntas, pagos: d.pagos, entrega: d.entrega,
        redes: { facebook: redes.facebook || '', instagram: redes.instagram || '', tiktok: redes.tiktok || '' },
        color: d.color || '', portada: d.portada || '', logo: '', galeria: [], cedula: d.cedula || '',
        preciosVigentes: new Date().toISOString().slice(0, 10), dominio: '', ocultarCredito: false
      };
    }
    return d;
  }

  function fillForm(d) {
    d = d || {};
    E.tipo.value = PRESETS[d.tipo] ? d.tipo : Object.keys(PRESETS)[0];
    var P = preset();
    ['nombre', 'eslogan', 'telefono', 'direccion', 'zona', 'correo', 'nosotros', 'cedula', 'portada'].forEach(function (k) { E[k].value = d[k] || ''; });
    var w = String(d.whatsapp || '').replace(/\D/g, '');
    E.whatsapp.value = w.length === 12 && w.indexOf('52') === 0 ? w.slice(2) : w;
    E.catalogo.value = PY.catalogToText(d.catalogo || P.catalogo);
    hoursToForm(d.horario || P.horario);
    E.pedidos.checked = d.pedidos != null ? !!d.pedidos : !!P.orders;
    setPagos(d.pagos || P.pagos);
    E.entrega.value = d.entrega != null ? d.entrega : (P.entrega || '');
    var r = d.redes || {};
    ['facebook', 'instagram', 'tiktok'].forEach(function (k) { E[k].value = r[k] || ''; });
    colorCustom = /^#[0-9a-f]{6}$/i.test(d.color || '');
    E.color.value = colorCustom ? d.color : P.theme.primary;
    touched = { catalogo: !!d.catalogo, horario: !!d.horario, pedidos: d.pedidos != null, pagos: !!d.pagos, entrega: d.entrega != null };
  }

  function refreshHints() {
    var P = preset(), ctx = { nombre: val('nombre') || 'Tu negocio', zona: val('zona') };
    E.eslogan.placeholder = PY.fill(P.tagline, ctx);
    E.nosotros.placeholder = PY.fill(P.about, ctx);
    Array.prototype.forEach.call(form.querySelectorAll('[data-only]'), function (el) { el.hidden = el.getAttribute('data-only') !== E.tipo.value; });
    var w = val('whatsapp').replace(/\D/g, '');
    E.whatsapp.classList.toggle('bad', !!w && w.length !== 10 && w.length !== 12);
  }

  /* ----- enlace de la vista previa ----- */
  function demoUrl(d, base) {
    var simple = Object.keys(d).every(function (k) { return SHORT_KEYS.indexOf(k) > -1; });
    if (simple) return Promise.resolve(base + '?' + PY.toParams(d));
    return PY.encodeData(d).then(function (s) { return base + '#d=' + s; });
  }

  function update() {
    var data = collect(false), my = ++seq;
    refreshHints();
    var y = 0;
    try { y = iframe.contentWindow.scrollY || 0; } catch (e) { /* sin acceso */ }
    iframe.onload = function () { try { iframe.contentWindow.scrollTo(0, y); } catch (e) { /* sin acceso */ } };
    iframe.srcdoc = PY.renderSite(data, { mode: 'preview', home: '../' });
    try { localStorage.setItem(DRAFT, JSON.stringify(data)); } catch (e) { /* modo privado */ }
    Promise.all([demoUrl(data, local('vista-previa/')), demoUrl(data, shared('vista-previa/'))]).then(function (urls) {
      if (my !== seq) return;
      fullLink.href = urls[0];
      lastUrl = urls[1];
      publish.href = PY.waLink(AG.wa, 'Hola, ' + (AG.brand || '') + ' 👋 Hice la vista previa de la página de mi negocio «' + (data.nombre || 'mi negocio') + '» y me interesa tenerla.\n\nVista previa: ' + urls[1]);
    });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(update, 220); }

  /* ----- eventos ----- */
  form.addEventListener('input', function (e) {
    var n = e.target.name || '';
    if (n === 'catalogo') touched.catalogo = true;
    else if (n.indexOf('h_') === 0) touched.horario = true;
    else if (n === 'entrega') touched.entrega = true;
    else if (n === 'color') colorCustom = true;
    schedule();
  });
  form.addEventListener('change', function (e) {
    var n = e.target.name || '';
    if (n === 'pedidos') touched.pedidos = true;
    if (n === 'pagos') touched.pagos = true;
    if (n === 'tipo') {
      var P = preset();
      if (!touched.catalogo) E.catalogo.value = PY.catalogToText(P.catalogo);
      if (!touched.horario) hoursToForm(P.horario);
      if (!touched.pedidos) E.pedidos.checked = !!P.orders;
      if (!touched.pagos) setPagos(P.pagos);
      if (!touched.entrega) E.entrega.value = P.entrega || '';
      if (!colorCustom) E.color.value = P.theme.primary;
    }
    schedule();
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button,a') : null;
    if (!t) return;
    if (t.hasAttribute('data-reset-color')) { colorCustom = false; E.color.value = preset().theme.primary; schedule(); }
    if (t.hasAttribute('data-hours')) {
      var v = t.getAttribute('data-hours').split('|');
      PY.DAYS.forEach(function (d, i) { E['h_' + d].value = v[i] || ''; });
      touched.horario = true; schedule();
    }
    if (t.hasAttribute('data-dev')) {
      document.querySelectorAll('[data-dev]').forEach(function (b) { b.classList.toggle('on', b === t); });
      frameBox.classList.toggle('desktop', t.getAttribute('data-dev') === 'desktop');
    }
    if (t.hasAttribute('data-tab')) {
      document.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.toggle('on', b === t); });
      document.body.classList.toggle('view-preview', t.getAttribute('data-tab') === 'preview');
      window.scrollTo(0, 0);
    }
    if (t.hasAttribute('data-copy')) copy(lastUrl);
    if (t.hasAttribute('data-json')) downloadJson();
    if (t.hasAttribute('data-reset')) {
      if (t.dataset.armed) {
        try { localStorage.removeItem(DRAFT); } catch (err) { /* nada */ }
        history.replaceState(null, '', location.pathname);
        fillForm({ tipo: E.tipo.value }); update();
        t.textContent = 'Empezar de nuevo'; delete t.dataset.armed;
      } else {
        t.dataset.armed = '1'; t.textContent = 'Toca otra vez para borrar todo';
        setTimeout(function () { t.textContent = 'Empezar de nuevo'; delete t.dataset.armed; }, 3500);
      }
    }
    if (t.hasAttribute('data-publish') && !val('nombre')) {
      e.preventDefault();
      E.nombre.focus();
      toast('Escriba el nombre de su negocio');
    }
  });

  function copy(text) {
    if (!text) return;
    var done = function () { toast('¡Enlace copiado! Péguelo en WhatsApp'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { toast('No se pudo copiar'); }
      ta.remove();
    }
  }

  function downloadJson() {
    var d = collect(true), slug = PY.slugify(d.nombre) || 'negocio';
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2) + '\n'], { type: 'application/json' }));
    a.download = 'datos.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    toast('Guárdelo como clientes/' + slug + '/datos.json');
  }

  /* ----- inicio: enlace (#d=…), parámetros (?n=…), borrador o vacío ----- */
  function start() {
    var m = location.hash.match(/[#&]d=([^&]+)/);
    if (m) return PY.decodeData(m[1]).catch(function () { toast('No se pudo abrir el enlace'); return null; });
    var q = new URLSearchParams(location.search);
    if (q.get('n') || q.get('t')) return Promise.resolve(PY.fromParams(q));
    try { return Promise.resolve(JSON.parse(localStorage.getItem(DRAFT) || 'null')); } catch (e) { return Promise.resolve(null); }
  }
  start().then(function (d) { fillForm(d || {}); update(); });
})();
