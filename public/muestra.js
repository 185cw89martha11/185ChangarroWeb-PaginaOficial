/* Muestra para cliente: interruptores por plan, vista celular o computadora, y mensaje para Claude Code.
   El contenido vive en muestra-datos.js y los planes en planes.js; aquí solo se pinta. */
(function () {
  'use strict';

  var D = window.MUESTRA_DATOS;
  var N = D.NEGOCIO;
  var PLANES = (window.PLANES_185 && window.PLANES_185.PLANS) || [];
  var ORDEN = ['esencial', 'negocio', 'pro'];
  // cada copia de la carpeta guarda aparte, para que la muestra de un negocio no herede lo de otro
  var GUARDADO = 'muestra185.v3:' + location.pathname;
  var ANCHO_PC = 1100, ALTO_PC = 680;
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var pesos = function (n) { return '$' + Number(n).toLocaleString('es-MX'); };
  var fechaLarga = function () { return new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }); };
  var plan = function (id) {
    for (var i = 0; i < PLANES.length; i++) if (PLANES[i].id === id) return PLANES[i];
    return { id: id, name: id };
  };

  var estado = { negocio: '', vista: 'celular', notas: '', activas: {} };
  var agenda = { dia: 0, hora: -1 };
  var chat = { abierto: false, msgs: [] };
  D.FUNCIONES.forEach(function (f) { estado.activas[f.id] = f.activa; });

  // localStorage solo para comodidad: si falla, la muestra sigue igual
  try {
    var previo = JSON.parse(localStorage.getItem(GUARDADO) || 'null');
    if (previo) {
      estado.negocio = typeof previo.negocio === 'string' ? previo.negocio : '';
      estado.notas = typeof previo.notas === 'string' ? previo.notas : '';
      estado.vista = previo.vista === 'escritorio' ? 'escritorio' : 'celular';
      D.FUNCIONES.forEach(function (f) {
        if (previo.activas && typeof previo.activas[f.id] === 'boolean') estado.activas[f.id] = previo.activas[f.id];
      });
    }
  } catch (e) {}
  D.FUNCIONES.forEach(function (f) { if (f.fija) estado.activas[f.id] = true; });

  // obligatoriaCon: si está prendida alguna de esas funciones, esta también (los Términos con pedidos)
  function forzadaPor(f) {
    return (f.obligatoriaCon || []).filter(function (id) { return estado.activas[id]; });
  }

  function guardar() {
    try { localStorage.setItem(GUARDADO, JSON.stringify(estado)); } catch (e) {}
  }

  var on = function (id) { return !!estado.activas[id]; };
  function nombre() { return estado.negocio.trim() || D.negocioEjemplo; }
  function slug() {
    return nombre().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '').slice(0, 30) || 'minegocio';
  }
  function dominio() { return slug() + '.com.mx'; }
  function correoNegocio() { return on('correo') ? 'contacto@' + dominio() : N.correoDatos; }

  // ---------- panel: interruptores agrupados por plan ----------
  var inputs = {}, cuentas = {}, etiquetas = {};
  var grupos = $('grupos');
  ORDEN.forEach(function (pid, i) {
    var p = plan(pid);
    // cada plan se pliega para que en el celular no haya que bajar tanto; Esencial empieza abierto
    var g = document.createElement('details');
    g.className = 'grupo';
    g.open = i === 0;
    var precio = p.inst ? pesos(p.inst) + ' + ' + pesos(p.mes) + '/mes' : '';
    g.innerHTML = '<summary class="grupo-cab"><span><b></b><small class="cuenta"></small></span><small></small></summary><div class="toggles"></div>';
    g.querySelector('b').textContent = (i ? 'Agrega ' : '') + p.name;
    g.querySelector('summary > small').textContent = precio;
    cuentas[pid] = g.querySelector('.cuenta');
    var lista = g.querySelector('.toggles');

    D.FUNCIONES.filter(function (f) { return f.plan === pid; }).forEach(function (f) {
      var fila = document.createElement('label');
      fila.className = 'tog' + (f.fija ? ' fija' : '');
      fila.innerHTML = '<span class="t"></span><span class="d"></span>' +
        '<span class="switch"><input type="checkbox" role="switch"><span></span></span>';
      var t = fila.querySelector('.t');
      t.textContent = f.nombre;
      if (f.servicio || f.fija) {
        var tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = f.fija ? 'Siempre va' : 'No se ve en la página';
        t.appendChild(tag);
      }
      if (f.obligatoriaCon) {
        var obl = document.createElement('span');
        obl.className = 'tag';
        t.appendChild(obl);
        etiquetas[f.id] = obl;
      }
      fila.querySelector('.d').textContent = f.descripcion;
      var input = fila.querySelector('input');
      input.checked = on(f.id);
      input.disabled = !!f.fija;
      input.addEventListener('change', function () {
        estado.activas[f.id] = input.checked;
        cambio();
      });
      inputs[f.id] = input;
      lista.appendChild(fila);
    });
    grupos.appendChild(g);
  });

  // "Llenar como": prende todo lo que incluye ese plan (lo opcional no se toca)
  document.querySelectorAll('[data-preset]').forEach(function (b) {
    b.addEventListener('click', function () {
      var hasta = ORDEN.indexOf(b.getAttribute('data-preset'));
      D.FUNCIONES.forEach(function (f) {
        if (f.fija || f.opcional) return;
        var desde = ORDEN.indexOf(f.presetDesde || f.plan);
        estado.activas[f.id] = hasta >= 0 && desde <= hasta;
        inputs[f.id].checked = estado.activas[f.id];
      });
      cambio();
    });
  });

  // prende y bloquea lo que es obligatorio por otra función; al apagar esa, se puede volver a apagar
  function aplicarObligatorias() {
    D.FUNCIONES.forEach(function (f) {
      if (!f.obligatoriaCon) return;
      var por = forzadaPor(f);
      if (por.length) estado.activas[f.id] = true;
      inputs[f.id].checked = on(f.id);
      inputs[f.id].disabled = por.length > 0;
      etiquetas[f.id].hidden = !por.length;
      etiquetas[f.id].textContent = 'Obligatorio con ' + por.map(function (id) {
        for (var i = 0; i < D.FUNCIONES.length; i++) if (D.FUNCIONES[i].id === id) return D.FUNCIONES[i].nombre.toLowerCase();
        return id;
      }).join(', ');
    });
  }

  function planSugerido() {
    var idx = 0;
    D.FUNCIONES.forEach(function (f) {
      if (on(f.id) && !f.fija) idx = Math.max(idx, ORDEN.indexOf(f.plan));
    });
    return plan(ORDEN[idx]);
  }

  function pintarPlan() {
    var p = planSugerido();
    var html = 'Con lo prendido, el plan que lo cubre es <b>' + esc(p.name) + '</b>';
    if (p.inst) html += ': ' + pesos(p.inst) + ' de instalación + ' + pesos(p.mes) + ' al mes';
    html += '.';
    if (on('correo') && p.id !== 'pro') html += ' El correo profesional va con costo extra.';
    $('plan-sugerido').innerHTML = html;
    ORDEN.forEach(function (pid) {
      var del = D.FUNCIONES.filter(function (f) { return f.plan === pid; });
      var prendidas = del.filter(function (f) { return on(f.id); }).length;
      cuentas[pid].textContent = prendidas + ' de ' + del.length + ' prendidas';
    });
  }

  // ---------- horario y "abierto ahora" ----------
  function horarioDe(dia) {
    for (var i = 0; i < N.horario.length; i++) if (N.horario[i].d.indexOf(dia) >= 0) return N.horario[i];
    return null;
  }
  var abre = function (h) { return h && h.abre && h.cierra; };
  var hora12 = function (hhmm) { return hhmm.replace(/^0/, ''); };

  function estadoAbierto() {
    var ahora = new Date();
    var hoy = horarioDe(ahora.getDay());
    var hhmm = String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');
    if (abre(hoy) && hhmm >= hoy.abre && hhmm < hoy.cierra) {
      return { abierto: true, texto: 'Abierto ahora · cierra a las ' + hora12(hoy.cierra) };
    }
    if (abre(hoy) && hhmm < hoy.abre) return { abierto: false, texto: 'Cerrado ahora · abre hoy a las ' + hora12(hoy.abre) };
    for (var i = 1; i <= 7; i++) {
      var dia = (ahora.getDay() + i) % 7;
      var h = horarioDe(dia);
      if (abre(h)) {
        return { abierto: false, texto: 'Cerrado ahora · abre ' + (i === 1 ? 'mañana' : 'el ' + DIAS[dia]) + ' a las ' + hora12(h.abre) };
      }
    }
    return { abierto: false, texto: 'Cerrado ahora' };
  }

  // próximos 5 días en que abre, para la agenda
  function diasAgenda() {
    var lista = [], d = new Date();
    for (var i = 0; lista.length < 5 && i < 14; i++) {
      var f = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (abre(horarioDe(f.getDay()))) {
        lista.push({ fecha: f, corto: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DIAS_CORTOS[f.getDay()], largo: i === 0 ? 'hoy' : i === 1 ? 'mañana' : 'el ' + DIAS[f.getDay()] + ' ' + f.getDate() });
      }
    }
    return lista;
  }

  // QR decorativo: no se puede escanear a propósito (el dominio de ejemplo podría existir)
  function qrFalso() {
    var n = 21, semilla = 0, s = slug(), html = '';
    for (var k = 0; k < s.length; k++) semilla = (semilla * 31 + s.charCodeAt(k)) >>> 0;
    var azar = function () { semilla = (semilla * 1103515245 + 12345) >>> 0; return (semilla >>> 16) & 1; };
    var ojo = function (x, y) {
      var cx = x < 7 ? x : x - 14, cy = y < 7 ? y : y - 14;
      if (cx < 0 || cx > 6 || cy < 0 || cy > 6) return null;
      return cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4);
    };
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var enOjo = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        var negro = enOjo ? ojo(x, y) : ((x === 7 || y === 7 || x === 13 || y === 13) && (x < 8 || y < 8)) ? false : azar();
        html += '<i' + (negro ? ' class="n"' : '') + '></i>';
      }
    }
    return html;
  }

  // ---------- sitio de prueba ----------
  var sitio = $('sitio');

  function seccion(id, titulo, cuerpo, clase) {
    return '<section class="s-sec' + (clase ? ' ' + clase : '') + '" data-funcion="' + id + '"><h3>' + esc(titulo) + '</h3>' + cuerpo + '</section>';
  }
  function botonAviso(texto, aviso, clase) {
    return '<button type="button" class="s-btn' + (clase ? ' ' + clase : '') + '" data-accion="aviso" data-texto="' + esc(aviso) + '">' + esc(texto) + '</button>';
  }

  function pintarSitio() {
    var n = nombre(), partes = [];

    if (on('productos')) {
      partes.push(seccion('productos', 'Lo que ofrecemos', '<ul class="s-lista">' + N.productos.map(function (p) {
        return '<li><span>' + esc(p.nombre) + '</span><b>' + pesos(p.precio) + '</b></li>';
      }).join('') + '</ul><p class="s-nota">' + esc(N.leyendaPrecios) + ' Vigentes al ' + fechaLarga() + '.</p>'));
    }

    if (on('pedidos')) {
      partes.push(seccion('pedidos', 'Haz tu pedido',
        '<p class="s-dir">Aparta tu pedido con un anticipo de ' + pesos(N.anticipo) + ' y pasa por él cuando esté listo. ' +
        esc(N.terminos.anticipo) + ' Consulta cancelaciones y devoluciones en ' +
        '<button type="button" class="s-enlace" data-accion="doc" data-doc="terminos">Términos y Condiciones</button>.</p>' +
        botonAviso('Pagar anticipo de ' + pesos(N.anticipo), 'Aquí se abriría la liga de pago del negocio para el anticipo.')));
    }

    if (on('agenda')) {
      var dias = diasAgenda();
      if (agenda.dia >= dias.length) agenda.dia = 0;
      var cuerpo = '<div class="s-dias">' + dias.map(function (d, i) {
        return '<button type="button" data-accion="dia" data-i="' + i + '" aria-pressed="' + (i === agenda.dia) + '">' +
          esc(d.corto) + '<b>' + d.fecha.getDate() + '</b></button>';
      }).join('') + '</div><div class="s-horas">' + N.horasAgenda.map(function (h, i) {
        return '<button type="button" data-accion="hora" data-i="' + i + '" aria-pressed="' + (i === agenda.hora) + '">' + esc(h) + '</button>';
      }).join('') + '</div>';
      var elegido = agenda.hora >= 0 && dias[agenda.dia];
      cuerpo += '<button type="button" class="s-btn" data-accion="apartar"' + (elegido ? '' : ' disabled style="opacity:.55"') + '>' +
        (elegido ? 'Apartar ' + esc(dias[agenda.dia].largo) + ' a las ' + esc(N.horasAgenda[agenda.hora]) : 'Elige un horario') + '</button>';
      if (on('recordatorios')) cuerpo += '<p class="s-nota">Te mandamos un recordatorio por correo un día antes de tu cita.</p>';
      partes.push(seccion('agenda', 'Aparta tu cita', cuerpo));
    }

    if (on('eventos')) {
      partes.push(seccion('eventos', 'Promociones y eventos', N.eventos.map(function (e) {
        return '<div class="s-evento"><div class="f">' + esc(e.fecha) + '</div><div><b>' + esc(e.titulo) + '</b><span>' + esc(e.texto) + '</span>' +
          '<small>Vigencia: ' + esc(e.vigencia) + '. ' + esc(e.condiciones) + '</small></div></div>';
      }).join('')));
    }

    if (on('galeria')) {
      var fotos = '';
      for (var i = 0; i < N.galeria; i++) fotos += '<div>Foto de ejemplo</div>';
      partes.push(seccion('galeria', 'Galería', '<div class="s-galeria">' + fotos + '</div>', 'ancha'));
    }

    var botonGoogle = botonAviso('Califícanos en Google', 'Aquí se abriría la ficha de Google Maps del negocio para dejar una reseña.', 'suave');
    if (on('resenas')) {
      partes.push(seccion('resenas', 'Lo que dicen nuestros clientes', N.resenas.map(function (r) {
        return '<div class="s-resena"><small><span class="s-estrellas" aria-label="' + r.estrellas + ' de 5 estrellas">' +
          '★★★★★'.slice(0, r.estrellas) + '☆☆☆☆☆'.slice(0, 5 - r.estrellas) + '</span>' + esc(r.autor) +
          ' <span class="s-etq">Ejemplo</span></small><p>' + esc(r.texto) + '</p></div>';
      }).join('') + (on('google') ? '<p class="s-nota">' + botonGoogle + '</p>' : '')));
    } else if (on('google')) {
      partes.push(seccion('google', '¿Te gustó?', '<p class="s-dir">Tu opinión nos ayuda mucho.</p>' + botonGoogle));
    }

    if (on('faq')) {
      partes.push(seccion('faq', 'Preguntas frecuentes', '<div class="s-faq">' + N.faq.map(function (q) {
        return '<details><summary>' + esc(q.p) + '</summary><p>' + esc(q.r) + '</p></details>';
      }).join('') + '</div>'));
    }

    if (on('horario')) {
      var hoy = new Date().getDay();
      partes.push(seccion('horario', 'Horario', '<ul class="s-lista">' + N.horario.map(function (h) {
        return '<li' + (h.d.indexOf(hoy) >= 0 ? ' class="hoy"' : '') + '><span>' + esc(h.dias) + '</span><b>' +
          (abre(h) ? hora12(h.abre) + ' a ' + hora12(h.cierra) : 'Cerrado') + '</b></li>';
      }).join('') + '</ul>'));
    }

    if (on('ubicacion')) {
      partes.push(seccion('ubicacion', 'Dónde estamos', '<p class="s-dir">' + esc(N.direccion) + '</p>' +
        '<div class="s-mapa" aria-hidden="true"><span>Mapa de ejemplo</span></div>' +
        botonAviso('Cómo llegar', 'Aquí se abriría Google Maps con la ruta al negocio.')));
    }

    if (on('sucursales')) {
      partes.push(seccion('sucursales', 'Sucursales', N.sucursales.map(function (s) {
        return '<div class="s-suc"><div><b>' + esc(s.nombre) + '</b><span>' + esc(s.direccion) + '</span></div>' +
          botonAviso('Ver mapa', 'Aquí se abriría el mapa de la sucursal ' + s.nombre + '.', 'suave') + '</div>';
      }).join('')));
    }

    if (on('redes')) {
      partes.push(seccion('redes', 'Síguenos', '<div class="s-redes">' + N.redes.map(function (r) {
        return botonAviso(r, 'Aquí se abriría el ' + r + ' del negocio.', 'suave');
      }).join('') + '</div>'));
    }

    if (on('qr')) {
      partes.push(seccion('qr', 'Comparte nuestra página', '<div class="s-qr"><div class="s-qr-img" aria-hidden="true">' + qrFalso() +
        '</div><p>Este QR va impreso en el mostrador, volantes y tarjetas. <span class="s-etq">QR de ejemplo</span></p></div>'));
    }

    var ab = on('abierto') ? estadoAbierto() : null;
    var html = '<header class="s-cab"><p class="s-nombre">' + esc(n) + '</p><p class="s-lema">' + esc(N.lema) + '</p>' +
      (ab ? '<span class="s-abierto' + (ab.abierto ? '' : ' cerrado') + '"><i></i>' + esc(ab.texto) + '</span>' : '') + '</header>';
    html += partes.length ? '<div class="s-cuerpo">' + partes.join('') + '</div>'
      : '<div class="s-cuerpo"><div class="s-vacio">Prende una función para verla aquí.</div></div>';

    // pie: quién vende y cómo contactarlo va siempre (Ley Federal de Protección al Consumidor, art. 76 bis)
    var enlaces = [];
    if (on('privacidad')) enlaces.push('<button type="button" data-accion="doc" data-doc="privacidad">Aviso de privacidad</button>');
    if (on('terminos')) enlaces.push('<button type="button" data-accion="doc" data-doc="terminos">Términos y Condiciones</button>');
    html += '<footer class="s-pie"><div class="s-contacto"><b>' + esc(n) + '</b><span>' + esc(N.direccion) + '</span>' +
      '<span>Tel. ' + esc(N.telefono) + ' · ' + esc(correoNegocio()) + '</span></div>' +
      (enlaces.length ? '<nav>' + enlaces.join('') + '</nav>' : '') +
      '<span>© ' + new Date().getFullYear() + ' ' + esc(n) + '</span></footer>';

    var scroll = sitio.scrollTop;
    sitio.innerHTML = html;
    sitio.scrollTop = scroll;

    $('url').textContent = 'https://www.' + dominio();
    $('s-wa').hidden = !on('whatsapp');
    $('s-asis').hidden = !on('asistente');
    if (!on('asistente')) chat.abierto = false;
    pintarChat();
    if (docAbierto && !on(docAbierto)) docAbierto = '';
    pintarDoc();
  }

  // ---------- documentos legales del negocio (se arman con lo prendido y los datos de NEGOCIO) ----------
  var docAbierto = '';

  function docPrivacidad() {
    var n = esc(nombre());
    var datos = [], para = [];
    if (on('agenda')) { datos.push('nombre, teléfono y el día y la hora de tu cita'); para.push('apartar, confirmar y, si hace falta, cambiar tu cita'); }
    if (on('recordatorios')) { datos.push('correo electrónico'); para.push('mandarte un recordatorio un día antes de tu cita'); }
    if (on('pedidos')) { datos.push('nombre, teléfono y lo que pides'); para.push('preparar y entregar tu pedido y darte seguimiento'); }
    if (on('whatsapp')) { datos.push('tu número y lo que nos escribas, si nos contactas por WhatsApp'); para.push('contestar tus mensajes'); }
    var h = '<h2>Aviso de privacidad <span class="s-etq">Ejemplo</span></h2>' +
      '<p class="s-doc-fecha">Última actualización: ' + fechaLarga() + '</p>' +
      '<h3>¿Quién cuida tus datos?</h3><p>' + esc(N.titular) + ', con el nombre comercial <b>' + n + '</b> y domicilio en ' + esc(N.direccion) +
      ', es responsable de tus datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.</p>' +
      '<h3>¿Qué datos pedimos?</h3>';
    h += datos.length
      ? '<ul>' + datos.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul><p>No pedimos datos sensibles, como de salud, religión o datos bancarios.</p>'
      : '<p>Esta página no te pide datos personales. Si nos escribes por teléfono o correo, usamos lo que nos mandes solo para contestarte.</p>';
    h += '<h3>¿Para qué los usamos?</h3><p>' + (para.length ? 'Para ' + esc(para.join('; ')) + '.' : 'Solo para contestarte.') +
      ' No los usamos para publicidad y no los vendemos.</p>' +
      '<h3>¿Con quién los compartimos?</h3><p>Con nadie más, salvo que una autoridad lo pida conforme a la ley. ' +
      '185ChangarroWeb, que administra esta página, los maneja por encargo nuestro y solo para que la página funcione.' +
      (on('pedidos') ? ' El pago del anticipo lo hace un proveedor de pagos externo con su propio aviso de privacidad; nosotros no vemos ni guardamos los datos de tu tarjeta.' : '') + '</p>' +
      '<h3>Tus derechos</h3><p>Puedes pedir ver, corregir o borrar tus datos, oponerte a que los usemos o retirar tu permiso. Escríbenos a ' +
      esc(N.correoDatos) + ' o al ' + esc(N.telefono) + ' y te contestamos en un máximo de 20 días hábiles.</p>' +
      '<h3>Cookies</h3><p>' + (on('reporte')
        ? 'Contamos las visitas y los clics de la página de forma general, para saber qué se usa más. Eso no te identifica. No usamos cookies de publicidad.'
        : 'Esta página no usa cookies de rastreo ni de publicidad.') + '</p>' +
      '<h3>Cambios a este aviso</h3><p>Si cambia, lo publicamos en esta misma página con la fecha nueva.</p>';
    return h;
  }

  function docTerminos() {
    var T = N.terminos;
    var h = '<h2>Términos y Condiciones <span class="s-etq">Ejemplo</span></h2>' +
      '<p class="s-doc-fecha">Última actualización: ' + fechaLarga() + '</p>' +
      '<p>Estos términos aplican a las compras, pedidos y citas que hagas con <b>' + esc(nombre()) + '</b> (' + esc(N.titular) + '), con domicilio en ' + esc(N.direccion) + '.</p>' +
      '<h3>Precios</h3><p>' + esc(N.leyendaPrecios) + ' Los precios publicados son el total que pagas.</p>' +
      '<h3>Formas de pago</h3><p>' + esc(T.pagos) + '</p>';
    if (on('pedidos')) h += '<h3>Anticipo</h3><p>El anticipo es de ' + pesos(N.anticipo) + '. ' + esc(T.anticipo) + '</p>';
    h += '<h3>Cancelaciones</h3><p>' + esc(T.cancelacion) + '</p>' +
      '<h3>Cambios y devoluciones</h3><p>' + esc(T.devoluciones) + '</p>';
    if (on('eventos')) {
      h += '<h3>Promociones</h3><ul>' + N.eventos.map(function (e) {
        return '<li><b>' + esc(e.titulo) + '.</b> Vigencia: ' + esc(e.vigencia) + '. ' + esc(e.condiciones) + '</li>';
      }).join('') + '</ul>';
    }
    h += '<h3>Dudas o quejas</h3><p>Escríbenos al ' + esc(N.telefono) + ' o a ' + esc(correoNegocio()) +
      '. Si no llegamos a un acuerdo, puedes acudir a la Procuraduría Federal del Consumidor (Profeco).</p>';
    return h;
  }

  function pintarDoc() {
    var caja = $('s-doc');
    caja.hidden = !docAbierto;
    if (!docAbierto) return;
    caja.innerHTML = '<div class="s-doc-barra"><button type="button" class="s-btn suave" data-accion="doc-cerrar">← Volver a la página</button></div>' +
      '<article>' + (docAbierto === 'privacidad' ? docPrivacidad() : docTerminos()) + '</article>';
    caja.scrollTop = 0;
  }

  // ---------- asistente (contesta solo con los datos de la plantilla) ----------
  var PREGUNTAS = [
    { p: '¿Qué horario tienen?', r: function () {
      return N.horario.map(function (h) { return h.dias + ': ' + (abre(h) ? hora12(h.abre) + ' a ' + hora12(h.cierra) : 'cerrado'); }).join('. ') + '.';
    } },
    { p: '¿Cuánto cuesta?', r: function () {
      return N.productos.map(function (p) { return p.nombre + ': ' + pesos(p.precio); }).join('. ') + '.';
    } },
    { p: '¿Dónde están?', r: function () { return 'Estamos en ' + N.direccion + '.'; } },
    { p: 'Otra pregunta', r: function () { return 'Eso mejor pregúntalo por WhatsApp y te contestamos en persona.'; } }
  ];

  function pintarChat() {
    var caja = $('s-chat');
    $('s-asis').setAttribute('aria-expanded', String(chat.abierto));
    caja.hidden = !chat.abierto;
    if (!chat.abierto) return;
    var msgs = [{ yo: false, t: 'Hola, soy el asistente de ' + nombre() + '. ¿En qué te ayudo?' }].concat(chat.msgs);
    caja.innerHTML = '<header><span>Asistente</span><button type="button" data-accion="chat-cerrar" aria-label="Cerrar asistente">×</button></header>' +
      '<div class="s-chat-msgs">' + msgs.map(function (m) {
        return '<div class="s-msg ' + (m.yo ? 'yo' : 'bot') + '">' + esc(m.t) + '</div>';
      }).join('') + '</div><div class="s-chat-preg">' + PREGUNTAS.map(function (q, i) {
        return '<button type="button" data-accion="chat-preg" data-i="' + i + '">' + esc(q.p) + '</button>';
      }).join('') + '</div>';
    var lista = caja.querySelector('.s-chat-msgs');
    lista.scrollTop = lista.scrollHeight;
  }

  // ---------- clics dentro del sitio (nada abre enlaces reales) ----------
  var timerAviso;
  function aviso(texto) {
    var el = $('aviso');
    el.textContent = texto;
    el.hidden = false;
    clearTimeout(timerAviso);
    timerAviso = setTimeout(function () { el.hidden = true; }, 2800);
  }

  document.querySelector('.pantalla').addEventListener('click', function (e) {
    var b = e.target.closest('[data-accion]');
    if (!b) return;
    var accion = b.getAttribute('data-accion'), i = Number(b.getAttribute('data-i'));
    if (accion === 'aviso') aviso(b.getAttribute('data-texto'));
    else if (accion === 'doc') { docAbierto = b.getAttribute('data-doc'); pintarDoc(); }
    else if (accion === 'doc-cerrar') { docAbierto = ''; pintarDoc(); }
    else if (accion === 'dia') { agenda.dia = i; agenda.hora = -1; pintarSitio(); }
    else if (accion === 'hora') { agenda.hora = i; pintarSitio(); }
    else if (accion === 'apartar') {
      var d = diasAgenda()[agenda.dia];
      aviso('Aquí se apartaría la cita ' + d.largo + ' a las ' + N.horasAgenda[agenda.hora] + '. La página pediría nombre y teléfono.');
    }
    else if (accion === 'chat-cerrar') { chat.abierto = false; pintarChat(); }
    else if (accion === 'chat-preg') {
      chat.msgs.push({ yo: true, t: PREGUNTAS[i].p }, { yo: false, t: PREGUNTAS[i].r() });
      pintarChat();
    }
  });
  $('s-wa').addEventListener('click', function () {
    aviso('Aquí se abriría WhatsApp con el mensaje: "' + N.mensajeWhatsapp + '"');
  });
  $('s-asis').addEventListener('click', function () {
    chat.abierto = !chat.abierto;
    pintarChat();
  });

  function cambio() {
    aplicarObligatorias();
    guardar();
    pintarPlan();
    pintarSitio();
  }

  var campoNegocio = $('negocio');
  campoNegocio.value = estado.negocio;
  campoNegocio.placeholder = D.negocioEjemplo;
  campoNegocio.addEventListener('input', function () {
    estado.negocio = campoNegocio.value;
    cambio();
  });

  var campoNotas = $('notas');
  campoNotas.value = estado.notas;
  campoNotas.addEventListener('input', function () {
    estado.notas = campoNotas.value;
    guardar();
  });

  // ---------- celular o computadora ----------
  var stage = $('stage'), escala = $('escala'), marco = $('marco');

  function ajustarEscala() {
    if (estado.vista !== 'escritorio') {
      escala.style.width = escala.style.height = marco.style.transform = '';
      return;
    }
    var cs = getComputedStyle(stage);
    var anchoLibre = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var altoLibre = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var s = Math.min(1, anchoLibre / ANCHO_PC);
    // en pantalla grande también cuida el alto; en celular el escenario crece hacia abajo
    if (window.matchMedia('(min-width: 821px)').matches && altoLibre > 200) s = Math.min(s, altoLibre / ALTO_PC);
    escala.style.width = Math.floor(ANCHO_PC * s) + 'px';
    escala.style.height = Math.floor(ALTO_PC * s) + 'px';
    marco.style.transform = 'scale(' + s + ')';
  }

  function ponerVista(v) {
    estado.vista = v;
    marco.classList.toggle('celular', v === 'celular');
    marco.classList.toggle('escritorio', v === 'escritorio');
    $('ver-celular').setAttribute('aria-pressed', String(v === 'celular'));
    $('ver-escritorio').setAttribute('aria-pressed', String(v === 'escritorio'));
    ajustarEscala();
    guardar();
  }
  $('ver-celular').addEventListener('click', function () { ponerVista('celular'); });
  $('ver-escritorio').addEventListener('click', function () { ponerVista('escritorio'); });
  if (window.ResizeObserver) new ResizeObserver(ajustarEscala).observe(stage);
  else window.addEventListener('resize', ajustarEscala);

  // en el celular el panel va arriba: este botón lleva a la muestra y se esconde cuando ya se ve
  var irMuestra = $('ir-muestra');
  irMuestra.addEventListener('click', function () { stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (e) { irMuestra.hidden = e[0].isIntersecting; }, { threshold: 0.25 }).observe(stage);
  }

  // ---------- mensaje para Claude Code ----------
  function fechaHoy() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function armarMensaje() {
    var linea = function (f) {
      return '- ' + f.nombre + ' (' + f.id + ', plan ' + plan(f.plan).name + ')' + (f.nota ? ' — ' + f.nota : '');
    };
    var enPagina = D.FUNCIONES.filter(function (f) { return on(f.id) && !f.servicio; });
    var servicios = D.FUNCIONES.filter(function (f) { return on(f.id) && f.servicio; });
    var no = D.FUNCIONES.filter(function (f) { return !on(f.id); });
    var p = planSugerido();
    var l = [
      'Hola Claude. Este es el resultado de la muestra de 185ChangarroWeb: así decidió el cliente su página.',
      '',
      'Negocio: ' + nombre(),
      'Fecha de la muestra: ' + fechaHoy(),
      'Última vista que revisó: ' + (estado.vista === 'escritorio' ? 'computadora' : 'celular'),
      'Plan que cubre lo que eligió: ' + p.name + (p.inst ? ' (' + pesos(p.inst) + ' de instalación + ' + pesos(p.mes) + ' al mes)' : ''),
      '',
      'Lo que SÍ quiere en la página:',
      enPagina.length ? enPagina.map(linea).join('\n') : '- Nada',
      '',
      'Servicios que SÍ quiere (se hacen por fuera, no se ven en la página):',
      servicios.length ? servicios.map(linea).join('\n') : '- Ninguno',
      '',
      'Lo que NO quiere:',
      no.length ? no.map(linea).join('\n') : '- Nada',
      '',
      'Notas del cliente:',
      estado.notas.trim() || '(sin notas)',
      '',
      'Lo que va por ley en todos los planes (no se quita):',
      '- Pie con nombre, dirección, teléfono y correo del negocio (Ley Federal de Protección al Consumidor, art. 76 bis).',
      '- Aviso de privacidad a nombre del negocio (Ley Federal de Protección de Datos Personales en Posesión de los Particulares), con los datos que pide su página y un correo para ejercer sus derechos.',
      '- Debajo de los precios: "' + N.leyendaPrecios + '" y la fecha desde la que valen.',
      '- Cada promoción con su vigencia y sus condiciones.',
      on('pedidos') ? '- Términos y Condiciones con formas de pago, anticipo, cancelaciones y devoluciones (obligatorios porque la página recibe pedidos).' : null,
      'Datos que hay que pedirle al negocio para eso: nombre del dueño o razón social, dirección, teléfono, correo, formas de pago' +
        (on('pedidos') ? ', reglas de cancelación y devolución' : '') + ', y vigencia y condiciones de cada promoción.',
      '',
      'Las funciones del catálogo (hasta 10 en Negocio y 15 en Negocio + Asistente Pro) todavía no se eligieron en esta muestra.',
      'Arma su página con solo lo que sí quiere. Si falta un dato (teléfono, dirección, precios, horario, fotos), pregúntamelo antes de inventarlo.'
    ];
    return l.filter(function (x) { return x !== null; }).join('\n');
  }

  var modal = $('modal'), campoMensaje = $('mensaje');
  $('btn-exportar').addEventListener('click', function () {
    campoMensaje.value = armarMensaje();
    if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
  });
  $('modal-cerrar').addEventListener('click', function () {
    if (modal.close) modal.close(); else modal.removeAttribute('open');
  });

  $('btn-copiar').addEventListener('click', function () {
    var texto = campoMensaje.value;
    function aMano() {
      campoMensaje.focus();
      campoMensaje.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      aviso(ok ? 'Mensaje copiado.' : 'No se pudo copiar solo. Ya está seleccionado: cópialo a mano.');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(function () { aviso('Mensaje copiado.'); }, aMano);
    } else {
      aMano();
    }
  });

  $('btn-descargar').addEventListener('click', function () {
    var blob = new Blob([campoMensaje.value], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'muestra-' + slug() + '-' + fechaHoy() + '.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  aplicarObligatorias();
  pintarPlan();
  pintarSitio();
  ponerVista(estado.vista);
})();
