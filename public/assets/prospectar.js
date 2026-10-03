/* 185ChangarroWeb · herramienta interna para prospectar (/prospectar/) */
(function () {
  'use strict';
  var PY = window.Changarro, CFG = window.PY_PROSPECT || {}, AG = PY.AGENCY || {};
  // Rutas: locales para ver; públicas para los mensajes cuando el sitio está abierto en la computadora.
  var ROOT = new URL('../', location.href).href;
  var FILE = location.protocol === 'file:';
  var LOCAL = FILE || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var PUBLIC = String(AG.url || '').replace(/\/+$/, '') + '/';
  function local(p) { return ROOT + p + (FILE ? 'index.html' : ''); }
  function shared(p) { return (LOCAL && AG.url ? PUBLIC : ROOT) + p; }
  var f = document.getElementById('pf'), E = f.elements;
  var KEY = 'py-prospectos:v1';
  var STATES = ['Nuevo', 'Mensaje enviado', 'Respondió', 'Interesado', 'Vendido', 'No le interesa'];
  var CATALOG_WORD = { restaurante: 'su menú con precios', tienda: 'su catálogo de productos', gimnasio: 'sus planes y precios' };
  var $ = function (id) { return document.getElementById(id); };
  var list = load();

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function store() { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { toast('No se pudo guardar (¿modo privado?)'); } }
  function today(offset) { var d = new Date(); d.setDate(d.getDate() + (offset || 0)); return d.toISOString().slice(0, 10); }
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2400);
  }
  function esc(s) { return PY.esc(s); }

  function current() {
    var d = { tipo: E.tipo.value, nombre: E.negocio.value.trim() };
    var w = E.wa.value.replace(/\D/g, '');
    if (w) d.whatsapp = w;
    if (E.zona.value.trim()) d.zona = E.zona.value.trim();
    return d;
  }
  function demoLink(d) { return shared('vista-previa/') + '?' + PY.toParams(d); }
  function message(d, link) {
    return PY.fill(CFG.template || '{link}', {
      negocio: d.nombre, link: link, tuNombre: E.yo.value.trim(), fuente: E.fuente.value,
      catalogo: CATALOG_WORD[d.tipo] || 'sus servicios con precios', instalacion: CFG.instalacion || '', mensualidad: CFG.mensualidad || ''
    });
  }
  function followUp(p) {
    return 'Hola, buen día 👋 Le escribo de ' + (CFG.brand || AG.brand || '') + '. ¿Pudo ver la vista previa de la página que le preparé para ' + p.negocio + '?\n\n' + p.link + '\n\nSi quiere, le cambio fotos, precios o colores sin compromiso. Quedo a sus órdenes.';
  }
  if (LOCAL && AG.url) {
    var note = document.getElementById('local-note');
    note.textContent = 'Está usando la herramienta desde su computadora: los enlaces de los mensajes apuntan a ' + PUBLIC + ' y funcionarán cuando el sitio esté publicado.';
    note.hidden = false;
  }

  function refresh() {
    var d = current();
    if (!d.nombre) { $('msg').textContent = 'Escriba el nombre del negocio…'; return null; }
    var link = demoLink(d), msg = message(d, link), num = PY.waNumber(d.whatsapp);
    $('msg').textContent = msg;
    $('send').href = num ? PY.waLink(num, msg) : PY.waLink('', msg);
    $('see').href = local('vista-previa/') + '?' + PY.toParams(d);
    $('edit').href = local('crear/') + '?' + PY.toParams(d);
    return { d: d, link: link, msg: msg };
  }

  function add(state) {
    var r = refresh();
    if (!r) { toast('Escriba el nombre del negocio'); return; }
    var wa = PY.waNumber(r.d.whatsapp);
    var found = list.find(function (p) { return p.negocio === r.d.nombre && p.wa === wa; });
    if (found) {
      if (state && STATES.indexOf(state) > STATES.indexOf(found.estado)) found.estado = state;
    } else {
      list.unshift({ fecha: today(), negocio: r.d.nombre, giro: r.d.tipo, zona: r.d.zona || '', wa: wa, link: r.link, estado: state || 'Nuevo', seguimiento: today(3) });
    }
    store(); draw();
    toast(found ? 'Actualizado en tu lista' : 'Guardado en tu lista');
  }

  function draw() {
    var t = today();
    $('rows').innerHTML = list.map(function (p, i) {
      var due = p.seguimiento <= t && (p.estado === 'Mensaje enviado' || p.estado === 'Respondió');
      return '<tr><td>' + esc(p.fecha) + '</td><td><b>' + esc(p.negocio) + '</b><br><small>' + esc((PY.PRESETS[p.giro] || {}).short || p.giro) + '</small></td><td>' + esc(p.zona) + '</td>' +
        '<td><select data-i="' + i + '">' + STATES.map(function (s) { return '<option' + (s === p.estado ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></td>' +
        '<td><a href="' + esc(p.link) + '" target="_blank" rel="noopener">Ver</a></td>' +
        '<td>' + (p.wa && (p.estado === 'Mensaje enviado' || p.estado === 'Respondió')
          ? '<a href="' + esc(PY.waLink(p.wa, followUp(p))) + '" target="_blank" rel="noopener"' + (due ? ' style="color:#b91c1c"' : '') + '>' + (due ? '⏰ Toca hoy' : esc(p.seguimiento)) + '</a>'
          : '—') + ' <button type="button" data-del="' + i + '" class="chipbtn" aria-label="Quitar">✕</button></td></tr>';
    }).join('') || '<tr><td colspan="6" style="color:var(--muted)">Aún no hay prospectos. Prepare su primer mensaje arriba.</td></tr>';
    var c = function (s) { return list.filter(function (p) { return p.estado === s; }).length; };
    var sent = list.length - c('Nuevo');
    $('stats').innerHTML = [['Prospectos', list.length], ['Contactados', sent], ['Interesados', c('Interesado') + c('Respondió')], ['Vendidos', c('Vendido')],
      ['Cierre', sent ? Math.round(c('Vendido') / sent * 100) + '%' : '—']]
      .map(function (x) { return '<div class="stat"><b>' + x[1] + '</b>' + x[0] + '</div>'; }).join('');
  }

  f.addEventListener('input', refresh);
  f.addEventListener('change', refresh);
  f.addEventListener('submit', function (e) { e.preventDefault(); });
  $('save').addEventListener('click', function () { add('Nuevo'); });
  $('send').addEventListener('click', function (e) { if (!refresh()) { e.preventDefault(); return; } add('Mensaje enviado'); });
  $('copy').addEventListener('click', function () {
    var r = refresh();
    if (!r) return;
    navigator.clipboard.writeText(r.msg).then(function () { toast('Mensaje copiado'); }, function () { toast('No se pudo copiar'); });
  });
  $('rows').addEventListener('change', function (e) {
    var i = e.target.getAttribute('data-i');
    if (i == null) return;
    list[i].estado = e.target.value;
    if (e.target.value === 'Mensaje enviado' || e.target.value === 'Respondió') list[i].seguimiento = today(3);
    store(); draw();
  });
  $('rows').addEventListener('click', function (e) {
    var i = e.target.getAttribute('data-del');
    if (i == null) return;
    list.splice(+i, 1); store(); draw();
  });
  $('csv').addEventListener('click', function () {
    var cols = ['fecha', 'negocio', 'giro', 'zona', 'wa', 'estado', 'seguimiento', 'link'];
    var csv = '﻿' + cols.join(',') + '\n' + list.map(function (p) {
      return cols.map(function (k) { return '"' + String(p[k] || '').replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'prospectos-' + today() + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
  });
  var armed = false;
  $('wipe').addEventListener('click', function (e) {
    if (!armed) { armed = true; e.target.textContent = 'Toca otra vez para borrar'; setTimeout(function () { armed = false; e.target.textContent = 'Borrar lista'; }, 3000); return; }
    list = []; store(); draw(); armed = false; e.target.textContent = 'Borrar lista';
  });

  refresh();
  draw();
})();
