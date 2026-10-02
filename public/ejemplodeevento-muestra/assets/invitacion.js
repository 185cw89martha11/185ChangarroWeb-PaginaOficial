(function () {
  'use strict';

  // ---------- intro: carta animada ----------
  window.__intro = 1;
  var intro = document.getElementById('intro');
  var raiz = document.documentElement;
  if (intro && raiz.classList.contains('intro-on')) {
    var carta = document.getElementById('carta');
    var terminada = false;
    var abierta = false;
    var termina = function () {
      if (terminada) return;
      terminada = true;
      raiz.classList.remove('intro-on');
      intro.classList.add('sale');
      window.scrollTo(0, 0);
      setTimeout(function () { intro.remove(); }, 2300);
    };
    var abreCarta = function () {
      if (abierta || !intro.classList.contains('listo')) return;
      abierta = true;
      intro.classList.add('abierta');
      setTimeout(termina, 5000);
    };
    intro.querySelector('.intro-saltar').addEventListener('click', termina);
    carta.addEventListener('click', abreCarta);
    carta.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); abreCarta(); }
    });
    // Mientras corre el temporizador, la página va cargando por detrás (imágenes y música).
    Array.prototype.forEach.call(document.querySelectorAll('img[loading="lazy"]'), function (im) { im.loading = 'eager'; });
    var btnPre = document.getElementById('musica');
    if (btnPre) { var pre = new Audio(); pre.preload = 'auto'; pre.src = btnPre.dataset.src; }
    requestAnimationFrame(function () { intro.classList.add('cayo'); });
    setTimeout(function () { intro.classList.add('giro'); }, 1500);
    setTimeout(function () { intro.classList.add('listo'); carta.focus({ preventScroll: true }); }, 2800);
  } else if (intro) {
    intro.remove();
  }

  // ---------- cuenta regresiva (en la sección y en el menú) ----------
  var cuenta = document.querySelector('.cuenta');
  var cuentaMenu = document.querySelector('.menu-cuenta');
  var ref = cuenta || cuentaMenu;
  if (ref) {
    var objetivo = Date.parse(ref.dataset.objetivo);
    var fin = Date.parse(ref.dataset.fin);
    var msg = cuenta && cuenta.parentNode.querySelector('.cuenta-msg');
    var celdas = {};
    if (cuenta) ['d', 'h', 'm', 's'].forEach(function (u) { celdas[u] = cuenta.querySelector('[data-u="' + u + '"]'); });
    var timer;
    var tick = function () {
      var ahora = Date.now();
      if (ahora >= objetivo) {
        var texto = ahora >= fin ? '¡Gracias por acompañarnos!' : '¡Hoy es el gran día!';
        if (cuenta) { cuenta.hidden = true; msg.hidden = false; msg.textContent = texto; }
        if (cuentaMenu) cuentaMenu.textContent = texto;
        if (ahora >= fin) clearInterval(timer);
        return;
      }
      var s = Math.floor((objetivo - ahora) / 1000);
      var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
      if (cuenta) {
        celdas.d.textContent = d; celdas.h.textContent = h; celdas.m.textContent = m; celdas.s.textContent = s % 60;
      }
      if (cuentaMenu) cuentaMenu.textContent = 'Faltan ' + d + ' ' + (d === 1 ? 'día' : 'días') + ', ' + h + ' h, ' + m + ' min';
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  // ---------- menú ----------
  var btnMenu = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (btnMenu && menu) {
    var abre = function (si) {
      menu.hidden = !si;
      btnMenu.setAttribute('aria-expanded', si);
      document.body.classList.toggle('menu-abierto', si);
      if (si) menu.querySelector('a').focus(); else btnMenu.focus();
    };
    btnMenu.addEventListener('click', function () { abre(menu.hidden); });
    menu.querySelector('.menu-cerrar').addEventListener('click', function () { abre(false); });
    menu.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A') {
        menu.hidden = true;
        btnMenu.setAttribute('aria-expanded', false);
        document.body.classList.remove('menu-abierto');
      }
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !menu.hidden) abre(false); });
  }

  // ---------- música (nunca se reproduce sola) ----------
  var btnMusica = document.getElementById('musica');
  if (btnMusica) {
    var audio = new Audio();
    audio.preload = 'none';
    audio.loop = true;
    audio.src = btnMusica.dataset.src;
    var pon = function (sonando) {
      btnMusica.textContent = sonando ? 'Pausar música' : 'Reproducir música';
      btnMusica.setAttribute('aria-pressed', sonando);
    };
    btnMusica.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function () { pon(true); }, function () { pon(false); });
      } else {
        audio.pause();
        pon(false);
      }
    });
  }

  // ---------- confirmación por WhatsApp ----------
  var rsvp = document.getElementById('rsvp');
  if (rsvp) {
    var inNombre = document.getElementById('nombre');
    var selPases = document.getElementById('npases');
    var fijo = rsvp.dataset.nombre;
    var arma = function () {
      var nombre = fijo || (inNombre ? inNombre.value.trim() : '');
      var n = selPases.value;
      var txt = 'Confirmo asistencia de ' + (nombre || '(escribe tu nombre)') + ', ' + n + (n === '1' ? ' pase' : ' pases');
      rsvp.href = 'https://wa.me/' + rsvp.dataset.wa + '?text=' + encodeURIComponent(txt);
    };
    arma();
    if (inNombre) inNombre.addEventListener('input', arma);
    selPases.addEventListener('change', arma);
    rsvp.addEventListener('click', function (ev) {
      if (!fijo && inNombre && !inNombre.value.trim()) {
        ev.preventDefault();
        inNombre.focus();
        inNombre.setCustomValidity('');
        inNombre.placeholder = 'Escribe tu nombre primero';
      }
    });
  }

  // ---------- galería ----------
  var visor = document.querySelector('.visor');
  if (visor && typeof visor.showModal === 'function') {
    var minis = Array.prototype.slice.call(document.querySelectorAll('.miniatura img'));
    var img = visor.querySelector('img');
    var actual = 0;
    var muestra = function (i) {
      actual = (i + minis.length) % minis.length;
      img.src = minis[actual].dataset.full;
      img.alt = minis[actual].alt;
    };
    minis.forEach(function (m, i) {
      m.parentNode.addEventListener('click', function () { muestra(i); visor.showModal(); });
    });
    visor.addEventListener('click', function (ev) {
      var a = ev.target.dataset && ev.target.dataset.visor;
      if (a === 'prev') muestra(actual - 1);
      else if (a === 'next') muestra(actual + 1);
      else if (a === 'cerrar' || ev.target === visor) visor.close();
    });
  }
})();
