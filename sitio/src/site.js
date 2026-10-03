/* 185ChangarroWeb · interactividad de las páginas de negocio (sin dependencias) */
(function () {
  'use strict';
  var dataEl = document.getElementById('py-data');
  if (!dataEl) return;
  var D;
  try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var JS_DAYS = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  var NAMES = { lun: 'lunes', mar: 'martes', mie: 'miércoles', jue: 'jueves', vie: 'viernes', sab: 'sábado', dom: 'domingo' };
  var H = D.hours || {};

  function wa(num, msg) { return 'https://wa.me/' + (num || '') + (msg ? '?text=' + encodeURIComponent(msg) : ''); }
  function money(n) { return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clock(min) {
    min = ((min % 1440) + 1440) % 1440;
    var h = Math.floor(min / 60), m = pad(min % 60);
    if (D.h24) return h + ':' + m;
    return (h % 12 || 12) + ':' + m + ' ' + (h < 12 ? 'am' : 'pm');
  }
  function at(min) { var t = clock(min); return (/^1:/.test(t) ? 'a la ' : 'a las ') + t; }
  function rangesText(r) {
    if (!r || !r.length) return 'Cerrado';
    if (r.length === 1 && r[0][0] === 0 && r[0][1] === 1440) return 'Abierto 24 horas';
    return r.map(function (x) { return clock(x[0]) + ' – ' + clock(x[1]); }).join(' y ');
  }
  function go(url) {
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ----- abierto / cerrado (en la zona horaria del negocio) ----- */
  function now() {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: D.tz || 'America/Mexico_City', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), m: (+p.hour % 24) * 60 + (+p.minute) };
    } catch (e) {
      var t = new Date();
      return { d: t.getDay(), m: t.getHours() * 60 + t.getMinutes() };
    }
  }
  function status(n) {
    var today = JS_DAYS[n.d], yest = JS_DAYS[(n.d + 6) % 7], i, r;
    r = H[yest] || [];
    for (i = 0; i < r.length; i++) if (r[i][1] > 1440 && n.m < r[i][1] - 1440) return { open: true, until: r[i][1] };
    r = H[today] || [];
    for (i = 0; i < r.length; i++) if (n.m >= r[i][0] && n.m < r[i][1]) return { open: true, until: r[i][1], all: r[i][0] === 0 && r[i][1] === 1440 };
    for (i = 0; i < r.length; i++) if (r[i][0] > n.m) return { open: false, next: 'hoy ' + at(r[i][0]) };
    for (var k = 1; k <= 7; k++) {
      var dk = JS_DAYS[(n.d + k) % 7], rr = H[dk] || [];
      if (rr.length) return { open: false, next: (k === 1 ? 'mañana ' : 'el ' + NAMES[dk] + ' ') + at(rr[0][0]) };
    }
    return null;
  }
  var n0 = now(), tk = JS_DAYS[n0.d], st = status(n0), stEl = $('[data-status]');
  if (stEl && st) {
    stEl.classList.add(st.open ? 'is-open' : 'is-closed');
    $('[data-status-text]', stEl).textContent = st.open
      ? (st.all ? 'Abierto las 24 horas' : 'Abierto ahora · cierra ' + at(st.until))
      : 'Cerrado · abre ' + st.next;
    stEl.hidden = false;
  }
  var todayEl = $('[data-today]');
  if (todayEl) todayEl.textContent = rangesText(H[tk]);
  $$('[data-days]').forEach(function (tr) {
    if (tr.getAttribute('data-days').split(',').indexOf(tk) > -1) tr.classList.add('today');
  });

  /* ----- abierta desde archivos (doble clic): las carpetas no abren su index.html solas ----- */
  var FILE = location.protocol === 'file:';
  function page(p) { return FILE && /\/$/.test(p) ? p + 'index.html' : p; }
  if (FILE) {
    $$('a[href]').forEach(function (a) {
      var v = a.getAttribute('href'), m = v.match(/^([^?#]*)(.*)$/);
      if (/^[a-z]+:|^#|^\/\//i.test(v)) return;
      if (m[1] === '' || /\/$/.test(m[1])) a.setAttribute('href', (m[1] || './') + 'index.html' + m[2]);
    });
  }

  /* ----- barra de vista previa ----- */
  if (D.mode === 'demo') {
    var pub = $('[data-py-publish]');
    if (pub) pub.href = wa(D.agencyWa, 'Hola 👋 Quiero publicar mi página «' + D.name + '».\n\nVista previa: ' + location.href);
    var ed = $('[data-py-edit]');
    if (ed) ed.href = page((D.home || '/') + 'crear/') + location.search + location.hash;
  }

  /* ----- aviso de privacidad y términos (al pie) ----- */
  function openLegal(id) {
    var d = document.getElementById(id);
    if (!d || d.tagName !== 'DETAILS') return false;
    d.open = true;
    d.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  document.addEventListener('click', function (e) {
    var l = e.target.closest && e.target.closest('[data-legal]');
    if (!l) return;
    var id = (l.getAttribute('href') || '').slice(1);
    $$('dialog').forEach(function (d) { if (d.open && typeof d.close === 'function') d.close(); });
    if (openLegal(id)) e.preventDefault();
  });
  if (/^#(aviso-privacidad|terminos)$/.test(location.hash)) openLegal(location.hash.slice(1));
  if (D.mode === 'example' && window.self !== window.top) {
    var bar0 = $('.py-bar');
    if (bar0) bar0.hidden = true;
  }

  /* ----- diálogos ----- */
  function openDlg(d) { if (!d) return; if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', ''); }
  function closeDlg(d) { if (!d) return; if (typeof d.close === 'function') { if (d.open) d.close(); } else d.removeAttribute('open'); }
  $$('dialog').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) closeDlg(d); }); });
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('[data-close]');
    if (c) closeDlg(c.closest('dialog'));
  });

  function showPreview(msg) {
    var pv = $('#py-preview');
    if (!pv) return go(wa(D.wa, msg));
    var safe = msg.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
    $('[data-msg]', pv).innerHTML = safe.replace(/\*([^*\n]+)\*/g, '<b>$1</b>');
    var o = $('[data-msg-open]', pv);
    if (o) o.href = wa(D.wa, msg);
    openDlg(pv);
  }
  function send(msg) {
    if (D.mode !== 'live') return showPreview(msg);
    track('pedido-whatsapp', 'Pedido enviado por WhatsApp');
    go(wa(D.wa, msg));
  }

  /* ----- estadísticas sin cookies (si el negocio las activó): clics a WhatsApp ----- */
  function track(path, title) {
    if (D.goat && window.goatcounter && typeof window.goatcounter.count === 'function') window.goatcounter.count({ path: path, title: title, event: true });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (a) track('clic-whatsapp', 'Clic a WhatsApp');
  });

  /* ----- pedido por WhatsApp ----- */
  if (!D.orders) return;
  var ITEMS = {};
  (D.items || []).forEach(function (it) { ITEMS[it.id] = it; });
  var KEY = 'py-cart:' + (D.slug || location.pathname);
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (k) { if (!ITEMS[k] || !(cart[k] > 0)) delete cart[k]; });

  var bar = $('[data-cartbar]'), dlg = $('#py-cart'), form = $('[data-order-form]'), fab = $('[data-fab]');

  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* modo privado */ } }
  function totals() {
    var c = 0, t = 0, unpriced = 0;
    Object.keys(cart).forEach(function (k) {
      var q = cart[k], it = ITEMS[k];
      c += q;
      if (typeof it.price === 'number') t += q * it.price; else unpriced += q;
    });
    return { count: c, total: t, unpriced: unpriced };
  }
  function totalText(s) { return s.unpriced && !s.total ? 'Por cotizar' : money(s.total) + (s.unpriced ? ' + por cotizar' : ''); }

  function draw() {
    var s = totals();
    if (bar) bar.hidden = !s.count;
    if (fab) fab.hidden = !!s.count;
    document.body.classList.toggle('has-cart', !!s.count);
    $$('[data-count]').forEach(function (e) { e.textContent = s.count; });
    $$('[data-count-label]').forEach(function (e) { e.textContent = s.count === 1 ? 'producto' : 'productos'; });
    $$('[data-total]').forEach(function (e) { e.textContent = totalText(s); });
    var ul = $('[data-lines]', dlg);
    if (ul) {
      ul.innerHTML = '';
      Object.keys(cart).forEach(function (k) {
        var it = ITEMS[k], li = document.createElement('li');
        li.className = 'line';
        li.innerHTML = '<div class="line-info"><b></b><small></small></div><div class="qty"><button type="button" aria-label="Quitar uno">−</button><span></span><button type="button" aria-label="Agregar uno">+</button></div>';
        li.querySelector('b').textContent = it.name;
        li.querySelector('small').textContent = typeof it.price === 'number' ? cart[k] + ' × ' + money(it.price) + ' = ' + money(it.price * cart[k]) : (it.label || 'Por cotizar');
        li.querySelector('.qty span').textContent = cart[k];
        var b = li.querySelectorAll('button');
        b[0].onclick = function () { set(k, cart[k] - 1); };
        b[1].onclick = function () { set(k, cart[k] + 1); };
        ul.appendChild(li);
      });
    }
    if (!s.count) closeDlg(dlg);
    $$('[data-add]').forEach(function (btn) {
      var q = cart[btn.getAttribute('data-add')], badge = $('.badge', btn);
      btn.classList.toggle('in', !!q);
      if (badge) { badge.hidden = !q; badge.textContent = q || ''; }
    });
  }
  function set(k, q) {
    if (q <= 0) delete cart[k]; else cart[k] = Math.min(q, 99);
    save(); draw();
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var b = e.target.closest('[data-add]');
    if (b) {
      var k = b.getAttribute('data-add');
      if (ITEMS[k]) {
        set(k, (cart[k] || 0) + 1);
        b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      }
      return;
    }
    if (e.target.closest('[data-open-cart]')) openDlg(dlg);
    if (e.target.closest('[data-clear]')) { cart = {}; save(); draw(); }
  });

  function compose() {
    var s = totals(), L = ['¡Hola! 👋 Quiero hacer un pedido:', ''];
    Object.keys(cart).forEach(function (k) {
      var it = ITEMS[k], q = cart[k];
      L.push('• ' + q + ' × ' + it.name + (typeof it.price === 'number' ? ' — ' + money(it.price * q) : (it.label ? ' — ' + it.label : '')));
    });
    L.push('', '*Total: ' + totalText(s) + '*');
    var f = form.elements, extra = [];
    if (f.nombre && f.nombre.value.trim()) extra.push('Nombre: ' + f.nombre.value.trim());
    if (f.modo) {
      var dom = f.modo.value === 'domicilio';
      extra.push('Entrega: ' + (dom ? 'A domicilio' : 'Paso a recoger'));
      if (dom && f.direccion.value.trim()) extra.push('Dirección: ' + f.direccion.value.trim());
    }
    if (f.notas && f.notas.value.trim()) extra.push('Notas: ' + f.notas.value.trim());
    if (extra.length) L.push('', extra.join('\n'));
    return L.join('\n');
  }

  if (form) {
    form.addEventListener('change', function () {
      var dom = form.elements.modo && form.elements.modo.value === 'domicilio', a = $('[data-addr]', form);
      if (a) { a.hidden = !dom; a.querySelector('textarea').required = dom; }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!totals().count) return;
      var msg = compose();
      closeDlg(dlg);
      send(msg);
    });
  }
  draw();
})();
