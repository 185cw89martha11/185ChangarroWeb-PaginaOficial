/*
 * 185ChangarroWeb · aviso de cookies y privacidad para quien visita el sitio.
 *
 * Qué hace: la primera vez que alguien abre cualquier página de 185ChangarroWeb, le pide
 * aceptar el Aviso de Privacidad para Visitantes y el uso del almacenamiento del navegador.
 * Hasta que acepta, no puede seguir navegando: el aviso tapa la página y bloquea los enlaces.
 * Si entra directo a una subpágina, ve exactamente el mismo aviso ahí.
 *
 * Dónde NO bloquea: en las páginas legales (Aviso de Privacidad, Términos, privacidad del sitio)
 * y en el 404. Ahí sale una barra abajo que no estorba, porque nadie puede aceptar algo que
 * todavía no lo dejan leer. Esas páginas ponen window.AVISO_185_LIBRE = true antes de este script.
 *
 * Cómo se usa en una página:
 *   <script src="aviso-visitantes.js" data-base="./"></script>     (páginas de la raíz)
 *   <script src="../aviso-visitantes.js" data-base="../"></script> (páginas en una carpeta)
 * data-base es la ruta para regresar a la raíz del sitio; de ahí salen los enlaces del aviso.
 *
 * Sin dependencias y sin paso de build, para que funcione igual abriendo el archivo con doble clic.
 */
(function () {
  'use strict';

  // Si cambia el texto del aviso, se sube esta fecha y se vuelve a preguntar a todos.
  var VERSION = '2026-10-05';
  var LLAVE = 'cw185-aviso-visitantes';

  var sc = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();
  var base = (sc && sc.getAttribute('data-base')) || './';
  var LIBRE = !!window.AVISO_185_LIBRE;
  var ARCHIVO = location.protocol === 'file:';

  // Abriendo con doble clic, una carpeta no abre su index.html sola.
  function ruta(p) { return ARCHIVO && /\/$/.test(p) ? p + 'index.html' : p; }
  var URL_VISITANTES = ruta(base + 'privacidad-del-sitio/');
  var URL_PRIVACIDAD = base + 'privacidad.html';
  var URL_TERMINOS = base + 'terminos.html';

  /* ---------- memoria del navegador ---------- */
  // Se intenta localStorage; si el navegador lo bloquea (modo privado, cookies apagadas),
  // se usa la sesión; si tampoco, se pregunta una vez por visita. Nunca se rompe la página.
  function leer() {
    try { if (localStorage.getItem(LLAVE) === VERSION) return true; } catch (e) {}
    try { if (sessionStorage.getItem(LLAVE) === VERSION) return true; } catch (e) {}
    return false;
  }
  function guardar() {
    try { localStorage.setItem(LLAVE, VERSION); return; } catch (e) {}
    try { sessionStorage.setItem(LLAVE, VERSION); } catch (e) {}
  }

  if (leer()) return;

  /* ---------- estilos (propios, para no depender de la hoja de cada página) ---------- */
  var CSS = [
    '.cw-av,.cw-av *{box-sizing:border-box}',
    '.cw-av{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;',
    'background:rgba(16,13,22,.72);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);',
    "font:400 15.5px/1.55 'Figtree',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1C1826}",
    '.cw-av[hidden]{display:none}',
    '.cw-av-caja{width:min(560px,100%);max-height:92vh;max-height:92dvh;overflow:auto;background:#fff;border-radius:20px;',
    'padding:24px 22px calc(22px + env(safe-area-inset-bottom));box-shadow:0 24px 70px rgba(16,13,22,.4);animation:cw-av-sube .22s ease}',
    '@keyframes cw-av-sube{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    // El aviso se mete en páginas con estilos muy distintos (los ejemplos de negocios traen sus
    // propias tipografías y algunos ponen los títulos en MAYÚSCULAS), así que manda lo suyo.
    ".cw-av h2,.cw-av p,.cw-av li,.cw-av button,.cw-av a{font-family:'Figtree',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;text-transform:none;letter-spacing:normal}",
    '.cw-av-logo{display:block;width:40px;height:40px;border-radius:9px;margin-bottom:12px}',
    '.cw-av h2{margin:0 0 10px;font-size:21px;line-height:1.25;font-weight:800;letter-spacing:-.01em;color:#1C1826}',
    '.cw-av p{margin:0 0 10px;color:#413C52}',
    '.cw-av ul{margin:0 0 12px;padding-left:20px;color:#413C52;font-size:14.5px}',
    '.cw-av li{margin-bottom:4px}',
    '.cw-av a{color:#6B3FC4;font-weight:600;text-underline-offset:2px}',
    '.cw-av-btns{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}',
    '.cw-av-btn{font:inherit;font-weight:700;font-size:15px;border:1px solid #DEDAE8;background:#fff;color:#1C1826;',
    'padding:12px 18px;border-radius:12px;cursor:pointer;text-decoration:none;display:inline-block;text-align:center}',
    '.cw-av-btn.pri{flex:1 1 220px;border-color:transparent;color:#fff;text-shadow:0 1px 2px rgba(40,20,70,.35);',
    'background:linear-gradient(90deg,#5670FE 0%,#9E6BE4 50%,#F567C8 100%)}',
    '.cw-av-btn:focus-visible{outline:2px solid #6B3FC4;outline-offset:2px}',
    '.cw-av-fina{margin:12px 0 0;font-size:13px;color:#5E5873}',
    // Barra de abajo: para las páginas legales, que sí se pueden leer sin aceptar.
    '.cw-av.cw-libre{position:fixed;inset:auto 0 0 0;display:block;padding:0;background:none;backdrop-filter:none}',
    '.cw-av.cw-libre .cw-av-caja{width:min(760px,calc(100% - 20px));margin:0 auto 10px;max-height:none;border-radius:16px;',
    'padding:16px 18px calc(16px + env(safe-area-inset-bottom));box-shadow:0 10px 40px rgba(16,13,22,.28);border:1px solid #DEDAE8}',
    '.cw-av.cw-libre .cw-av-logo,.cw-av.cw-libre ul{display:none}',
    '.cw-av.cw-libre h2{font-size:17px}',
    // Siempre claro, aunque el aparato esté en modo oscuro: el sitio comercial es claro y una
    // tarjeta oscura encima se ve como si fuera de otra página. En las legales, que sí tienen
    // modo oscuro, una tarjeta blanca se lee bien igual.
    '.cw-av,.cw-av *{color-scheme:light}',
    '@media (max-width:420px){.cw-av-caja{padding:20px 17px calc(18px + env(safe-area-inset-bottom))}.cw-av h2{font-size:19px}.cw-av-btn{flex:1 1 100%}}',
    'html.cw-av-quieto,html.cw-av-quieto body{overflow:hidden!important}'
  ].join('');

  /* ---------- armado ---------- */
  var caja, fondo, abierto = false;

  function texto() {
    var legales = '<a href="' + URL_VISITANTES + '">Aviso de Privacidad para Visitantes</a>';
    var cabeza = LIBRE
      ? '<h2>Para seguir navegando, acepta el aviso</h2>' +
        '<p>Puedes leer este documento sin aceptar nada. Para entrar al resto del sitio, acepta el ' + legales +
        ' y que guardemos esta respuesta en tu navegador.</p>'
      : '<img class="cw-av-logo" src="' + base + 'logo.svg" alt="" width="40" height="40">' +
        '<h2>Antes de seguir, un aviso rápido</h2>' +
        '<p>Para continuar usando este sitio, acepta nuestro ' + legales + ' y el uso del almacenamiento de tu navegador.</p>' +
        '<ul>' +
        '<li>No usamos cookies de publicidad ni te rastreamos entre sitios.</li>' +
        '<li>Guardamos en <b>tu propio navegador</b> esta respuesta y lo que escribas en el creador de vistas previas, para que no lo pierdas. Esa información no nos llega.</li>' +
        '<li>El servidor registra datos técnicos (como tu dirección IP y la hora) para funcionar y protegerse de ataques.</li>' +
        '<li>Los tipos de letra se cargan desde Google Fonts, que recibe tu dirección IP.</li>' +
        '</ul>';
    return cabeza +
      '<div class="cw-av-btns">' +
      '<button type="button" class="cw-av-btn pri" data-cw-si>Acepto y continúo</button>' +
      // Estando ya dentro del aviso, mandarlo al aviso no serviría de nada.
      (LIBRE ? '' : '<a class="cw-av-btn" href="' + URL_VISITANTES + '">Leer el aviso</a>' +
        '<button type="button" class="cw-av-btn" data-cw-no>No acepto</button>') +
      '</div>' +
      '<p class="cw-av-fina">Si contratas con nosotros aplican además el <a href="' + URL_TERMINOS + '">Aviso de Privacidad</a> ' +
      'y los <a href="' + URL_TERMINOS + '">Términos y Condiciones</a> para clientes. Puedes borrar lo guardado desde la configuración de tu navegador.</p>';
  }

  var noAcepto =
    '<h2>Sin tu aceptación no podemos mostrarte el sitio</h2>' +
    '<p>No es un castigo: el aviso explica lo único que guardamos y por qué, y necesitamos tu respuesta antes de seguir. ' +
    'Puedes cerrar esta pestaña cuando quieras, o escribirnos por WhatsApp si prefieres que te atendamos por ahí.</p>' +
    '<div class="cw-av-btns">' +
    '<button type="button" class="cw-av-btn pri" data-cw-volver>Volver al aviso</button>' +
    '<a class="cw-av-btn" href="https://wa.me/523151260581" target="_blank" rel="noopener">Escribir por WhatsApp</a>' +
    '</div>';

  function montar() {
    var est = document.createElement('style');
    est.textContent = CSS;
    document.head.appendChild(est);

    fondo = document.createElement('div');
    fondo.className = 'cw-av' + (LIBRE ? ' cw-libre' : '');
    fondo.setAttribute('role', 'dialog');
    fondo.setAttribute('aria-modal', LIBRE ? 'false' : 'true');
    fondo.setAttribute('aria-label', 'Aviso de cookies y privacidad');
    caja = document.createElement('div');
    caja.className = 'cw-av-caja';
    caja.innerHTML = texto();
    fondo.appendChild(caja);
    document.body.appendChild(fondo);
    abierto = true;
    if (!LIBRE) {
      document.documentElement.classList.add('cw-av-quieto');
      setTimeout(function () { var b = caja.querySelector('[data-cw-si]'); if (b) b.focus(); }, 40);
    }
  }

  function aceptar() {
    guardar();
    abierto = false;
    if (fondo) fondo.remove();
    document.documentElement.classList.remove('cw-av-quieto');
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-cw-si],[data-cw-no],[data-cw-volver]') : null;
    if (t) {
      if (t.hasAttribute('data-cw-si')) aceptar();
      else if (t.hasAttribute('data-cw-no')) caja.innerHTML = noAcepto;
      else caja.innerHTML = texto();
      return;
    }
    // Mientras no acepte, ningún enlace de la página lo saca de aquí. Se dejan pasar
    // los del propio aviso y los de las páginas legales, que se pueden leer sin aceptar.
    if (!abierto || LIBRE) return;
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || (caja && caja.contains(a))) return;
    e.preventDefault();
    e.stopPropagation();
    if (caja) caja.scrollIntoView({ block: 'center' });
  }, true);

  // El teclado tampoco debe poder salirse del aviso (Tab y Enter sobre lo de atrás).
  document.addEventListener('keydown', function (e) {
    if (!abierto || LIBRE || !caja) return;
    if (e.key === 'Escape') { e.preventDefault(); return; }
    if (e.key !== 'Tab') return;
    var foco = caja.querySelectorAll('button,a[href]');
    if (!foco.length) return;
    var pri = foco[0], ult = foco[foco.length - 1];
    if (!caja.contains(document.activeElement)) { e.preventDefault(); pri.focus(); return; }
    if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
    else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
