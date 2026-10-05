/* Muestra para cliente: interruptores por plan, vista celular o computadora, y la petición que el negocio manda por WhatsApp.
   El contenido vive en muestra-datos.js y los planes en planes.js; aquí solo se pinta. */
(function () {
  'use strict';

  var D = window.MUESTRA_DATOS;
  var N = D.NEGOCIO;
  var PLANES = (window.PLANES_185 && window.PLANES_185.PLANS) || [];
  var ORDEN = ['esencial', 'negocio', 'pro'];
  // las funciones del catálogo van en su propio grupo, después de los planes
  var GRUPOS = ORDEN.concat('catalogo');
  // cada copia de la carpeta guarda aparte, para que la muestra de un negocio no herede lo de otro
  var GUARDADO = 'muestra185.v4:' + location.pathname;
  var ANCHO_PC = 1100, ALTO_PC = 680;
  // ventana angosta o muy vertical (un celular): el teléfono va primero y el panel se abre aparte
  var VERTICAL = window.matchMedia('(max-width: 820px), (max-aspect-ratio: 3/4)');
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var pesos = function (n) { return '$' + Number(n).toLocaleString('es-MX'); };
  var fechaLarga = function (idioma) { return new Date().toLocaleDateString(idioma === 'en' ? 'en-US' : 'es-MX', { day: 'numeric', month: 'long', year: 'numeric' }); };
  var plan = function (id) {
    for (var i = 0; i < PLANES.length; i++) if (PLANES[i].id === id) return PLANES[i];
    return { id: id, name: id };
  };

  // sucursal: -1 es la portada donde se elige; 0, 1, 2… es la subpágina de esa sucursal
  var estado = { negocio: '', vista: 'celular', notas: '', idioma: 'es', sucursal: -1, activas: {} };
  var agenda = { dia: 0, hora: -1 };
  // foto que se ve en el carrusel de la galería (una por una)
  var carrusel = 0;
  var chat = { abierto: false, msgs: [] };
  D.FUNCIONES.forEach(function (f) { estado.activas[f.id] = f.activa; });

  // localStorage solo para comodidad: si falla, la muestra sigue igual
  try {
    var previo = JSON.parse(localStorage.getItem(GUARDADO) || 'null');
    if (previo) {
      estado.negocio = typeof previo.negocio === 'string' ? previo.negocio : '';
      estado.notas = typeof previo.notas === 'string' ? previo.notas : '';
      estado.vista = previo.vista === 'escritorio' ? 'escritorio' : 'celular';
      estado.idioma = previo.idioma === 'en' ? 'en' : 'es';
      if (N.sucursales[previo.sucursal]) estado.sucursal = previo.sucursal;
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
  // textos del sitio en español o inglés (botón ES/EN); acepta 'texto' o { es, en }
  var en = function () { return estado.idioma === 'en' && on('ingles'); };
  var tx = function (o) { return typeof o === 'string' ? o : (en() && o.en) || o.es; };
  function nombreFuncion(id) {
    for (var i = 0; i < D.FUNCIONES.length; i++) if (D.FUNCIONES[i].id === id) return D.FUNCIONES[i].nombre;
    return id;
  }
  // el nombre es el del negocio de esta muestra y no se cambia desde el panel
  function nombre() { return D.negocioEjemplo; }
  function slug() {
    return nombre().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '').slice(0, 30) || 'minegocio';
  }
  function dominio() { return slug() + '.com.mx'; }
  function correoNegocio() { return on('correo') ? 'contacto@' + dominio() : N.correoDatos; }

  // ---------- panel: interruptores agrupados por plan ----------
  var inputs = {}, cuentas = {}, etiquetas = {};
  var grupos = $('grupos');
  GRUPOS.forEach(function (pid, i) {
    var cat = pid === 'catalogo';
    var p = cat ? { name: 'Ejemplo de funciones del catálogo' } : plan(pid);
    // cada plan se pliega para que en el celular no haya que bajar tanto; Esencial empieza abierto
    var g = document.createElement('details');
    g.className = 'grupo';
    g.open = i === 0;
    var precio = cat ? 'Negocio ' + limite('negocio') + ' · Pro ' + limite('pro')
      : p.inst ? pesos(p.inst) + ' + ' + pesos(p.mes) + '/mes' : '';
    g.innerHTML = '<summary class="grupo-cab"><span><b></b><small class="cuenta"></small></span><small></small></summary><div class="toggles"></div>';
    g.querySelector('b').textContent = (i && !cat ? 'Agrega ' : '') + p.name;
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
      if (f.servicio || f.fija || f.peso > 1) {
        var tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = f.fija ? 'Siempre va' : f.servicio ? 'No se ve en la página' : 'Cuenta como ' + f.peso;
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
        // Esencial no trae funciones del catálogo; en Negocio y Pro se dejan como estén
        if (f.plan === 'catalogo') {
          if (hasta < 1) { estado.activas[f.id] = false; inputs[f.id].checked = false; }
          return;
        }
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

  // cuántas funciones del catálogo tiene cada plan (funcs en planes.js; Esencial no trae)
  function limite(pid) { return Number(plan(pid).funcs) || 0; }
  function usadasCatalogo() {
    return D.FUNCIONES.reduce(function (n, f) { return n + (f.plan === 'catalogo' && on(f.id) ? f.peso || 1 : 0); }, 0);
  }

  function planSugerido() {
    var idx = 0;
    D.FUNCIONES.forEach(function (f) {
      if (on(f.id) && !f.fija) idx = Math.max(idx, ORDEN.indexOf(f.plan));
    });
    var usadas = usadasCatalogo();
    if (usadas) idx = Math.max(idx, usadas > limite('negocio') ? 2 : 1);
    return plan(ORDEN[idx]);
  }

  function pintarPlan() {
    var p = planSugerido();
    var html = 'Con lo prendido, el plan que lo cubre es <b>' + esc(p.name) + '</b>';
    if (p.inst) html += ': ' + pesos(p.inst) + ' de instalación + ' + pesos(p.mes) + ' al mes';
    html += '.';
    if (on('correo') && p.id !== 'pro') html += ' El correo profesional va con costo extra.';
    var usadas = usadasCatalogo();
    if (usadas) html += ' Las funciones del catálogo prendidas cuentan como ' + usadas + ' de las ' + limite(p.id) + ' que incluye.';
    $('plan-sugerido').innerHTML = html;
    GRUPOS.forEach(function (pid) {
      var del = D.FUNCIONES.filter(function (f) { return f.plan === pid; });
      var prendidas = del.filter(function (f) { return on(f.id); }).length;
      cuentas[pid].textContent = prendidas + ' de ' + del.length + ' prendidas' + (pid === 'catalogo' && usadas ? ' · cuentan como ' + usadas : '');
    });
  }

  // ---------- sucursales ----------
  // sin la función "Varias sucursales" no hay portada: se ve directo la primera
  function enPortada() { return on('sucursales') && estado.sucursal < 0; }
  function suc() { return N.sucursales[on('sucursales') ? Math.max(estado.sucursal, 0) : 0]; }
  function irSucursal(i) {
    estado.sucursal = i;
    agenda.dia = 0; agenda.hora = -1;
    guardar();
    pintarSitio();
    sitio.scrollTop = 0;
  }

  // ---------- horario y "abierto ahora" (de la sucursal que se ve, o de la que se pase) ----------
  function horarioDe(dia, s) {
    var h = (s || suc()).horario;
    for (var i = 0; i < h.length; i++) if (h[i].d.indexOf(dia) >= 0) return h[i];
    return null;
  }
  // un día puede tener varios turnos (turnos: [['09:00','14:00'],['16:00','20:00']]); abre/cierra es un solo turno
  var turnosDe = function (h) { return !h ? [] : h.turnos || (h.abre && h.cierra ? [[h.abre, h.cierra]] : []); };
  var abre = function (h) { return turnosDe(h).length > 0; };
  // '19:00' → '7:00 p.m.' (o '7:00 PM' en inglés)
  var hora12 = function (hhmm) {
    var p = hhmm.split(':'), h = Number(p[0]);
    return ((h % 12) || 12) + ':' + p[1] + (h >= 12 ? (en() ? ' PM' : ' p.m.') : (en() ? ' AM' : ' a.m.'));
  };

  // '9:00 a.m. a 2:00 p.m. y 4:00 p.m. a 8:00 p.m.'
  var textoTurnos = function (h) {
    return turnosDe(h).map(function (t) { return hora12(t[0]) + tx({ es: ' a ', en: ' to ' }) + hora12(t[1]); }).join(tx({ es: ' y ', en: ' and ' }));
  };

  function estadoAbierto(s) {
    var ahora = new Date();
    var hoy = turnosDe(horarioDe(ahora.getDay(), s));
    var hhmm = String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');
    for (var k = 0; k < hoy.length; k++) {
      if (hhmm >= hoy[k][0] && hhmm < hoy[k][1]) {
        return { abierto: true, texto: tx({ es: 'ABIERTO · cierra a las ', en: 'OPEN · closes at ' }) + hora12(hoy[k][1]) };
      }
      // todavía no llega el turno (antes de abrir o en la pausa de medio día)
      if (hhmm < hoy[k][0]) return { abierto: false, texto: tx({ es: 'CERRADO · abre hoy a las ', en: 'CLOSED · opens today at ' }) + hora12(hoy[k][0]) };
    }
    for (var i = 1; i <= 7; i++) {
      var dia = (ahora.getDay() + i) % 7;
      var h = turnosDe(horarioDe(dia, s));
      if (h.length) {
        return { abierto: false, texto: en()
          ? 'CLOSED · opens ' + (i === 1 ? 'tomorrow' : 'on ' + DAYS[dia]) + ' at ' + hora12(h[0][0])
          : 'CERRADO · abre ' + (i === 1 ? 'mañana' : 'el ' + DIAS[dia]) + ' a las ' + hora12(h[0][0]) };
      }
    }
    return { abierto: false, texto: tx({ es: 'CERRADO', en: 'CLOSED' }) };
  }

  // próximos 5 días en que abre, para la agenda. lleno: día de muestra con todas las horas ocupadas
  function diasAgenda() {
    var lista = [], d = new Date();
    for (var i = 0; lista.length < 5 && i < 14; i++) {
      var f = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (abre(horarioDe(f.getDay()))) {
        lista.push(en()
          ? { fecha: f, lleno: diaLleno(f), corto: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : DAYS[f.getDay()].slice(0, 3), largo: i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[f.getDay()] + ' ' + f.getDate() }
          : { fecha: f, lleno: diaLleno(f), corto: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DIAS_CORTOS[f.getDay()], largo: i === 0 ? 'hoy' : i === 1 ? 'mañana' : 'el ' + DIAS[f.getDay()] + ' ' + f.getDate() });
      }
    }
    return lista;
  }

  // citas ocupadas de muestra: salen siempre igual para el mismo día y hora.
  // En la página real las marca la clínica desde un panel de administrador.
  function diaLleno(fecha) { return (fecha.getDate() * 7 + fecha.getMonth() * 3) % 5 === 2; }
  function horaOcupada(fecha, hhmm) {
    if (diaLleno(fecha)) return true;
    var p = hhmm.split(':'), m = Number(p[0]) * 60 + Number(p[1]);
    var x = ((fecha.getDate() * 97 + fecha.getMonth() * 13 + m * 31) * 2654435761) >>> 0;
    return (x >>> 8) % 100 < 35;
  }
  // hora que ya pasó hoy: no se puede apartar
  function horaPasada(fecha, hhmm) {
    var ahora = new Date();
    if (fecha.toDateString() !== ahora.toDateString()) return false;
    return hhmm <= String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');
  }

  // horas de llegada de ese día: cada media hora en cada turno, hasta media hora antes de que cierre
  function horasDe(fecha) {
    var lista = [];
    var min = function (t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); };
    turnosDe(horarioDe(fecha.getDay())).forEach(function (t) {
      for (var m = min(t[0]); m <= min(t[1]) - 30; m += 30) {
        lista.push(String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'));
      }
    });
    return lista;
  }

  function textoReserva(dia) {
    var h = horasDe(dia.fecha)[agenda.hora];
    if (en()) return 'Book appointment · ' + dia.largo + ' at ' + hora12(h);
    return 'Apartar cita · ' + dia.largo + (h.indexOf('13:') === 0 ? ' a la ' : ' a las ') + hora12(h);
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

  // cada sección trae su × para quitarla desde la misma muestra (igual que apagarla en el panel)
  function quitar(id) {
    return '<button type="button" class="s-quitar" data-accion="quitar" data-f="' + id + '" aria-label="Quitar ' + esc(nombreFuncion(id)) + '">×</button>';
  }
  // N.animales[id]: animalito decorativo a la derecha del título de esa sección
  function seccion(id, titulo, cuerpo, clase) {
    var animal = N.animales && N.animales[id];
    return '<section class="s-sec' + (clase ? ' ' + clase : '') + (animal ? ' con-animal' : '') + '" data-funcion="' + id + '">' + quitar(id) +
      (animal ? '<img class="s-animal" src="' + esc(animal) + '" alt="" aria-hidden="true">' : '') +
      '<h3>' + esc(titulo) + '</h3>' + cuerpo + '</section>';
  }
  function direccionDe(s) {
    return s.direccion + (s.porConfirmar ? tx({ es: ' (dirección por confirmar)', en: ' (address to be confirmed)' }) : '');
  }
  function avisoWhatsapp(s) {
    return en()
      ? 'This would open ' + s.nombre + '\'s WhatsApp (' + s.telefono + ') with the message: "' + tx(N.mensajeWhatsapp) + '"'
      : 'Aquí se abriría el WhatsApp de ' + s.nombre + ' (' + s.telefono + ') con el mensaje: "' + tx(N.mensajeWhatsapp) + '"';
  }
  // pestaña abierta en "Promociones, eventos y especialidades"
  var promoTab = 'promociones';

  function botonAviso(texto, aviso, clase) {
    return '<button type="button" class="s-btn' + (clase ? ' ' + clase : '') + '" data-accion="aviso" data-texto="' + esc(aviso) + '">' + esc(texto) + '</button>';
  }

  // portada: al entrar se elige la sucursal; cada botón lleva a su subpágina
  function portada() {
    return '<section class="s-portada"><h2>' + tx({ es: 'Elige tu sucursal', en: 'Choose your location' }) + '</h2>' +
      '<p>' + tx({ es: 'Cada sucursal tiene su menú, horario, mapa y WhatsApp.', en: 'Each location has its own menu, hours, map and WhatsApp.' }) + '</p>' +
      N.sucursales.map(function (s, i) {
        var ab = estadoAbierto(s);
        return '<button type="button" class="s-suc-btn" data-accion="sucursal" data-i="' + i + '">' +
          '<span class="s-suc-num">' + (i + 1) + '</span><span class="s-suc-txt"><b>' + esc(s.nombre) + '</b><small>' + esc(s.zona) + '</small>' +
          (on('abierto') ? '<em class="' + (ab.abierto ? 'si' : 'no') + '">' + esc(ab.texto) + '</em>' : '') +
          '</span><span class="s-suc-flecha" aria-hidden="true">›</span></button>';
      }).join('') + '</section>';
  }

  // subpágina de una sucursal: lo mismo en todas, salvo horario, mapa, dirección y teléfono
  function seccionesSucursal(n, s) {
    var partes = [];

    partes.push('<div class="s-suc-cab">' + (on('sucursales')
      ? '<button type="button" class="s-volver" data-accion="sucursal" data-i="-1">← ' + tx({ es: 'Sucursales', en: 'Locations' }) + '</button>' : '') +
      '<h2>' + esc(s.nombre) + '</h2><span>' + esc(s.zona) + '</span></div>');

    // servicios por categoría: cada una se abre para ver sus tratamientos
    // (el precio es opcional: sin precio dice "Consultar", porque no inventamos precios de una clínica)
    if (on('productos')) {
      var etqCrudo = '', etqPicante = '';
      partes.push(seccion('productos', tx({ es: 'Servicios', en: 'Services' }), '<div class="s-cats">' + N.menu.map(function (c) {
        return '<details class="s-cat"><summary><span>' + esc(tx(c.cat)) + '</span><small>' + c.platillos.length + '</small></summary>' +
          '<ul class="s-lista">' + c.platillos.map(function (p) {
            return '<li><span>' + esc(tx(p)) +
              (on('etiquetas') && p.crudo ? ' <em class="s-marca">' + etqCrudo + '</em>' : '') +
              (on('etiquetas') && p.picante ? ' <em class="s-marca picante">' + etqPicante + '</em>' : '') +
              '</span><b>' + (p.precio ? pesos(p.precio) : tx({ es: 'Consultar', en: 'Ask us' })) + '</b></li>';
          }).join('') + '</ul></details>';
      }).join('') + '</div><p class="s-nota">' + (en()
        ? 'Prices in Mexican pesos (MXN), tax included. Valid as of ' + fechaLarga('en') + '.'
        : esc(N.leyendaPrecios) + ' Vigentes al ' + fechaLarga() + '.') +
        ' <span class="s-etq">' + tx({ es: 'Precios de ejemplo', en: 'Sample prices' }) + '</span></p>' +
        '<p class="s-aviso-muestra">' + tx({
          es: 'Todavía no conocemos los servicios ni los precios reales de la clínica: los de esta lista son inventados, solo para la muestra. Los precios reales los da la clínica.',
          en: 'We don\'t know the clinic\'s actual services and prices yet: this list is for this sample only. The clinic confirms treatment prices.' }) + '</p>',
        'ancha s-menu'));
      // planes del dentista: paquetes con precio y lo que incluyen (de ejemplo)
      if (N.planesClinica && N.planesClinica.length) {
        partes.push('<section class="s-sec ancha" data-funcion="productos"><h3>' + tx({ es: 'Planes', en: 'Plans' }) + '</h3><div class="s-cats">' +
          N.planesClinica.map(function (pl) {
            return '<details class="s-cat"><summary><span>' + esc(tx(pl.nombre)) + '</span><small>' + pesos(pl.precio) + '</small></summary>' +
              '<p class="s-nota">' + esc(tx(pl.periodo)) + '</p><ul class="s-lista">' + (en() ? pl.incluye.en : pl.incluye.es).map(function (x) {
                return '<li><span>' + esc(x) + '</span></li>';
              }).join('') + '</ul></details>';
          }).join('') + '</div><p class="s-nota">' + (en()
            ? 'Prices in Mexican pesos (MXN), tax included. Valid as of ' + fechaLarga('en') + '.'
            : esc(N.leyendaPrecios) + ' Vigentes al ' + fechaLarga() + '.') +
          ' <span class="s-etq">' + tx({ es: 'Precios de ejemplo', en: 'Sample prices' }) + '</span></p>' +
          '<p class="s-aviso-muestra">' + tx({
            es: 'Los planes y sus precios son inventados, solo para la muestra. Los planes y precios reales los da la clínica.',
            en: 'The plans and their prices are made up, for this sample only. The clinic provides the real plans and prices.' }) + '</p></section>');
      }
    }

    // citas: WhatsApp y teléfono fijo de la clínica (los botones solo muestran un aviso)
    if (on('whatsapp')) {
      partes.push(seccion('whatsapp', tx({ es: '¿Quieres una cita?', en: 'Want an appointment?' }),
        '<p class="s-dir">' + tx({ es: 'Escríbenos por WhatsApp o llámanos.', en: 'Message us on WhatsApp or give us a call.' }) + '</p>' +
        '<div class="s-suc"><div><b>WhatsApp</b><span>' + esc(s.telefono) + '</span></div>' +
        '<button type="button" class="s-btn s-btn-wa" data-accion="aviso" data-texto="' + esc(avisoWhatsapp(s)) + '">WhatsApp</button></div>' +
        (s.telefonoFijo ? '<div class="s-suc"><div><b>' + tx({ es: 'Teléfono', en: 'Phone' }) + '</b><span>' + esc(s.telefonoFijo) + '</span></div>' +
        botonAviso(tx({ es: 'Llamar', en: 'Call' }), tx({ es: 'Aquí se abriría la llamada al ', en: 'This would call ' }) + s.telefonoFijo + '.', 'suave') + '</div>' : '')));
    }

    // redes de esta sucursal, con sus seguidores reales (se revisaron a mano; ver fecha en muestra-datos.js)
    if (on('redes')) {
      partes.push(seccion('redes', tx({ es: '¡Síguenos en nuestras redes sociales!', en: 'Follow us on social media!' }), '<div class="s-redes">' + s.redes.map(function (r) {
        return '<button type="button" class="s-red" data-accion="aviso" data-texto="' +
          esc(tx({ es: 'Aquí se abriría ', en: 'This would open ' }) + r.url) + '"><span class="s-red-ico ' + r.red.toLowerCase() + '" aria-hidden="true">' + r.red.charAt(0) + '</span>' +
          '<span class="s-red-txt"><b>' + esc(r.red) + '</b><small>' + esc(r.usuario) + '</small></span>' +
          (r.seguidores ? '<span class="s-red-num"><b>' + Number(r.seguidores).toLocaleString(en() ? 'en-US' : 'es-MX') + '</b><small>' + tx({ es: 'seguidores', en: 'followers' }) + '</small></span>' : '') + '</button>';
      }).join('') + '</div>' + (N.redesFecha ? '<p class="s-nota">' + tx({ es: 'Seguidores al ', en: 'Followers as of ' }) + esc(tx(N.redesFecha)) + '.</p>' : '')));
    }

    if (on('pedidos')) {
      partes.push(seccion('pedidos', tx({ es: 'Haz tu pedido', en: 'Place your order' }),
        '<p class="s-dir">' + (en()
          ? 'Reserve your order with a ' + pesos(N.anticipo) + ' deposit and pick it up when it\'s ready. ' + esc(N.terminos.anticipo.en) + ' See cancellations and refunds in the '
          : 'Aparta tu pedido con un anticipo de ' + pesos(N.anticipo) + ' y pasa por él cuando esté listo. ' + esc(N.terminos.anticipo.es) + ' Consulta cancelaciones y devoluciones en ') +
        '<button type="button" class="s-enlace" data-accion="doc" data-doc="terminos">' + tx({ es: 'Términos y Condiciones', en: 'Terms and Conditions' }) + '</button>.</p>' +
        botonAviso(tx({ es: 'Pagar anticipo de ', en: 'Pay deposit of ' }) + pesos(N.anticipo),
          tx({ es: 'Aquí se abriría la liga de pago del negocio para el anticipo.', en: 'This would open the clinic\'s payment link for the deposit.' }))));
    }

    // cita en 2 pasos: día y hora (una cada 30 minutos). Las ocupadas son de muestra
    if (on('agenda')) {
      var dias = diasAgenda();
      if (agenda.dia >= dias.length) agenda.dia = 0;
      // al entrar se ve el primer día con horas libres, no uno lleno (hasta que el visitante elija otro)
      if (!agenda.eligio && dias[agenda.dia].lleno) for (var k = 0; k < dias.length; k++) if (!dias[k].lleno) { agenda.dia = k; break; }
      var dia = dias[agenda.dia];
      var horas = horasDe(dia.fecha);
      var cuerpo = '<p class="s-paso">' + tx({ es: '1. Elige el día', en: '1. Pick a day' }) + '</p><div class="s-dias">' + dias.map(function (d, i) {
        return '<button type="button" class="' + (d.lleno ? 'lleno' : '') + '" data-accion="dia" data-i="' + i + '" aria-pressed="' + (i === agenda.dia) + '">' +
          esc(d.corto) + '<b>' + d.fecha.getDate() + '</b>' + (d.lleno ? '<small>' + tx({ es: 'Lleno', en: 'Full' }) + '</small>' : '') + '</button>';
      }).join('') + '</div><p class="s-paso">' + tx({ es: '2. Elige la hora (cada 30 minutos)', en: '2. Pick a time (every 30 minutes)' }) + '</p><div class="s-horas">' + horas.map(function (h, i) {
        var no = horaOcupada(dia.fecha, h) || horaPasada(dia.fecha, h);
        return '<button type="button" class="' + (no ? 'ocupada' : '') + '" data-accion="hora" data-i="' + i + '"' + (no ? ' disabled' : '') +
          ' aria-pressed="' + (i === agenda.hora) + '">' + esc(hora12(h)) + '</button>';
      }).join('') + '</div>' +
        '<p class="s-leyenda"><span><i></i>' + tx({ es: 'Libre', en: 'Free' }) + '</span><span><i class="ocupada"></i>' + tx({ es: 'Ocupada', en: 'Taken' }) +
        '</span><span><i class="tuya"></i>' + tx({ es: 'Tu cita', en: 'Your appointment' }) + '</span></p>';
      var listo = agenda.hora >= 0;
      cuerpo += '<button type="button" class="s-btn" data-accion="apartar"' + (listo ? '' : ' disabled style="opacity:.55"') + '>' +
        (listo ? textoReserva(dia) : tx({ es: 'Elige una hora', en: 'Pick a time' })) + '</button>' +
        '<p class="s-nota">' + tx({ es: 'Las horas ocupadas de esta muestra son de ejemplo.', en: 'The taken times in this sample are examples.' }) + '</p>';
      if (on('recordatorios')) cuerpo += '<p class="s-nota">' + tx({ es: 'Te mandamos un recordatorio por correo un día antes.', en: 'We will email you a reminder the day before.' }) + '</p>';
      partes.push(seccion('agenda', tx({ es: 'Aparta tu cita', en: 'Book an appointment' }), cuerpo));
    }

    // promociones, eventos y especialidades: una pestaña para cada uno
    if (on('eventos')) {
      var pestanas = [
        { id: 'promociones', t: { es: 'Promociones', en: 'Promotions' } },
        { id: 'eventos', t: { es: 'Eventos', en: 'Events' } },
        { id: 'especialidades', t: { es: 'Especialidades', en: 'Specialties' } }
      ];
      var lista = N.promos[promoTab] || [];
      partes.push(seccion('eventos', tx({ es: 'Promociones, eventos y especialidades', en: 'Promotions, events & specialties' }),
        '<div class="s-tabs" role="tablist">' + pestanas.map(function (p) {
          return '<button type="button" role="tab" data-accion="promo-tab" data-t="' + p.id + '" aria-selected="' + (p.id === promoTab) + '">' + tx(p.t) + '</button>';
        }).join('') + '</div>' +
        '<div class="s-promos">' + (lista.length ? lista.map(function (e) {
          var g = e.galeria >= 0 ? N.galeria[e.galeria] : null;
          return '<div class="s-especial' + (g ? '' : ' sin-foto') + '">' + (g
            ? '<button type="button" class="s-foto" data-accion="foto" data-i="' + e.galeria + '"><img src="' + esc(g.img) + '" alt="' + esc(tx(g.titulo)) + '" loading="lazy"></button>'
            : '<div class="s-promo-ico" aria-hidden="true">' + esc(e.icono || '★') + '</div>') +
            '<div><span class="s-especial-t">' + esc(tx(e.titulo)) + '</span><b>' + esc(g ? tx(g.titulo) : tx(e.nombre)) + '</b>' +
            '<span>' + esc(g ? tx(g) : tx(e.texto)) + '</span>' +
            '<small>' + tx({ es: 'Vigencia: ', en: 'Valid: ' }) + esc(tx(e.vigencia)) + '. ' + esc(tx(e.condiciones)) + '</small>' +
            (e.ejemplo ? '<span class="s-etq">' + tx({ es: 'Ejemplo', en: 'Sample' }) + '</span>' : '') + '</div></div>';
        }).join('') : '<p class="s-dir">' + tx({ es: 'Pronto habrá novedades aquí.', en: 'Coming soon.' }) + '</p>') + '</div>'));
    }

    if (on('galeria')) {
      var cuadros = '<div class="s-galeria">' + N.galeria.map(function (g, i) {
        return '<button type="button" class="s-foto" data-accion="foto" data-i="' + i + '">' +
          '<img src="' + esc(g.img) + '" alt="' + esc(tx(g.titulo)) + '" loading="lazy"><span>' + esc(tx(g.titulo)) + '</span></button>';
      }).join('') + '</div>' +
        '<p class="s-aviso-muestra">' + tx({
          es: 'Las fotos son de la publicidad de la clínica. Los nombres y las descripciones son de ejemplo: la clínica pone los reales, con permiso de sus pacientes.',
          en: 'The photos come from the clinic\'s own advertising. The names and descriptions are samples: the clinic provides the real ones, with its patients\' permission.' }) + '</p>';
      // carrusel: las otras imágenes se ven una por una, con flechas y puntos
      var carr = '';
      if (N.carrusel && N.carrusel.length) {
        var c = N.carrusel[carrusel];
        carr = '<div class="s-carrusel" aria-roledescription="carrusel"><div class="s-carrusel-caja">' +
          '<button type="button" class="s-carrusel-flecha" data-accion="carrusel" data-i="-1" aria-label="' + tx({ es: 'Anterior', en: 'Previous' }) + '">‹</button>' +
          '<img src="' + esc(c.img) + '" alt="' + esc(tx(c.titulo)) + '">' +
          '<button type="button" class="s-carrusel-flecha" data-accion="carrusel" data-i="1" aria-label="' + tx({ es: 'Siguiente', en: 'Next' }) + '">›</button></div>' +
          '<p class="s-carrusel-pie"><b>' + esc(tx(c.titulo)) + '</b> · ' + (carrusel + 1) + ' / ' + N.carrusel.length + '</p></div>';
      }
      partes.push(seccion('galeria', tx({ es: 'Galería', en: 'Gallery' }), cuadros + carr, 'ancha'));
    }

    var botonGoogle = botonAviso(tx({ es: 'Califícanos en Google', en: 'Rate us on Google' }),
      tx({ es: 'Aquí se abriría la ficha de ' + s.nombre + ' en Google Maps para dejar una reseña.', en: 'This would open ' + s.nombre + ' on Google Maps to leave a review.' }), 'suave');
    if (on('resenas')) {
      partes.push(seccion('resenas', tx({ es: 'Lo que dicen nuestros clientes', en: 'What our customers say' }), N.resenas.map(function (r) {
        return '<div class="s-resena"><small><span class="s-estrellas" aria-label="' + r.estrellas + tx({ es: ' de 5 estrellas', en: ' out of 5 stars' }) + '">' +
          '★★★★★'.slice(0, r.estrellas) + '☆☆☆☆☆'.slice(0, 5 - r.estrellas) + '</span>' + esc(r.autor) +
          ' <span class="s-etq">' + (r.real ? 'Google' : tx({ es: 'Ejemplo', en: 'Sample' })) + '</span></small><p>' + esc(tx(r.texto)) + '</p></div>';
      }).join('') +
        // las inventadas llevan la etiqueta "Ejemplo"; las reales (real: true) son de Google y se muestran con nombre e inicial
        (N.resenas.some(function (r) { return !r.real; })
          ? '<p class="s-aviso-muestra">' + tx({
            es: 'Estas reseñas son de ejemplo. En la página final sí se pueden mostrar reseñas reales de sus clientes (por ejemplo, las de Google Maps), publicadas por el negocio y actualizadas cada semana.',
            en: 'These reviews are samples. The final website can show real customer reviews (for example, its Google Maps reviews), published by the clinic and updated every week.' }) + '</p>'
          : '<p class="s-nota">' + tx({
            es: 'Reseñas de clientes publicadas en Google Maps. Se muestran con el nombre y la inicial del apellido.',
            en: 'Customer reviews published on Google Maps, shown with first name and last initial.' }) + '</p>') +
        (on('google') ? '<p class="s-nota">' + botonGoogle + '</p>' : '')));
    } else if (on('google')) {
      partes.push(seccion('google', tx({ es: '¿Te gustó?', en: 'Did you enjoy it?' }),
        '<p class="s-dir">' + tx({ es: 'Tu opinión nos ayuda mucho.', en: 'Your feedback means a lot to us.' }) + '</p>' + botonGoogle));
    }

    if (on('faq')) {
      partes.push(seccion('faq', tx({ es: 'Preguntas frecuentes', en: 'FAQ' }), '<div class="s-faq">' + N.faq.filter(function (q) { return !q.funcion || on(q.funcion); }).map(function (q) {
        return '<details><summary>' + esc(tx(q.p)) + '</summary><p>' + esc(tx(q.r)) + '</p></details>';
      }).join('') + '</div>'));
    }

    if (on('horario')) {
      var hoy = new Date().getDay();
      partes.push(seccion('horario', tx({ es: 'Horario', en: 'Hours' }), '<ul class="s-lista">' + s.horario.map(function (h) {
        return '<li' + (h.d.indexOf(hoy) >= 0 ? ' class="hoy"' : '') + '><span>' + esc(tx(h.dias)) + '</span><b>' +
          (abre(h) ? textoTurnos(h) : tx({ es: 'Cerrado', en: 'Closed' })) + '</b></li>';
      }).join('') + '</ul>'));
    }

    if (on('ubicacion')) {
      partes.push(seccion('ubicacion', tx({ es: 'Dónde estamos', en: 'Find us' }), '<p class="s-dir">' + esc(direccionDe(s)) + '</p>' +
        (s.mapa ? '<img class="s-mapa-img" src="' + esc(s.mapa) + '" alt="' + esc(tx({ es: 'Mapa de ', en: 'Map of ' }) + s.nombre) + '" loading="lazy">'
          : '<div class="s-mapa" aria-hidden="true"><span>' + tx({ es: 'Mapa de ejemplo', en: 'Sample map' }) + '</span></div>') +
        botonAviso(tx({ es: 'Ver en Google Maps', en: 'View on Google Maps' }),
          tx({ es: 'Aquí se abriría la ficha de ' + s.nombre + ' en Google Maps.', en: 'This would open ' + s.nombre + ' on Google Maps.' }))));
    }

    // las otras sucursales, para saltar a su subpágina
    if (on('sucursales')) {
      partes.push(seccion('sucursales', tx({ es: 'Otras sucursales', en: 'Other locations' }), N.sucursales.map(function (o, i) {
        if (o === s) return '';
        return '<div class="s-suc"><div><b>' + esc(o.zona) + '</b><span>' + esc(o.telefono) + '</span></div>' +
          '<button type="button" class="s-btn suave" data-accion="sucursal" data-i="' + i + '">' + tx({ es: 'Ver sucursal', en: 'View' }) + '</button></div>';
      }).join('')));
    }

    if (on('qr')) {
      // N.qr: QR real que lleva a esta muestra en nuestro sitio. Sin él, se usa el decorativo que no se puede escanear.
      partes.push(seccion('qr', tx({ es: 'Comparte nuestra página', en: 'Share our website' }), N.qr
        ? '<div class="s-qr"><img class="s-qr-real" src="' + esc(N.qr) + '" alt="' + tx({ es: 'Código QR de esta muestra', en: 'QR code for this sample' }) + '" loading="lazy">' +
          '<p>' + tx({ es: 'Escanéalo para abrir esta muestra en tu celular. En la página final, el QR llevará a la dirección del negocio y se imprime para el mostrador, volantes y tarjetas.',
                      en: 'Scan it to open this sample on your phone. On the final website, the QR code will lead to the clinic\'s own address and can be printed for the counter, flyers and business cards.' }) + '</p></div>'
        : '<div class="s-qr"><div class="s-qr-img" aria-hidden="true">' + qrFalso() +
          '</div><p>' + tx({ es: 'Este QR va impreso en el mostrador, volantes y tarjetas.', en: 'This QR code goes on the counter, flyers and business cards.' }) +
          ' <span class="s-etq">' + tx({ es: 'QR de ejemplo', en: 'Sample QR' }) + '</span></p></div>'));
    }

    return partes;
  }

  function pintarSitio() {
    var n = nombre(), s = suc(), portadaVisible = enPortada();
    var partes = portadaVisible ? [portada()] : seccionesSucursal(n, s);

    // barra fija arriba: logo del negocio (o su nombre si no hay logo) y ES/EN
    // franja fija con color: verde si está abierto, rojo si está cerrado (siempre visible, no se puede quitar)
    var ab = estadoAbierto(s);
    var html = '<header class="s-barra">' + (N.logo
      ? '<img class="s-logo-img" src="' + esc(N.logo) + '" alt="' + esc(n) + '">'
      : '<p class="s-logo">' + esc(n) + '</p>') +
      (on('ingles') ? '<div class="s-idioma" role="group" aria-label="Idioma / Language">' + ['es', 'en'].map(function (l) {
        return '<button type="button" data-accion="idioma" data-l="' + l + '" aria-pressed="' + (estado.idioma === l) + '">' + l.toUpperCase() + '</button>';
      }).join('') + '</div>' : '') +
      '<div class="s-abierto ' + (ab.abierto ? 'abierto' : 'cerrado') + '" data-funcion="abierto" role="status"><i></i><span>' + esc(ab.texto) + '</span></div></header>';
    html += partes.length ? '<div class="s-cuerpo">' + partes.join('') + '</div>'
      : '<div class="s-cuerpo"><div class="s-vacio">' + tx({ es: 'Prende una función para verla aquí.', en: 'Turn on a feature to see it here.' }) + '</div></div>';

    // pie: quién vende y cómo contactarlo va siempre (Ley Federal de Protección al Consumidor, art. 76 bis)
    var enlaces = [];
    if (on('privacidad')) enlaces.push('<button type="button" data-accion="doc" data-doc="privacidad">' + tx({ es: 'Aviso de privacidad', en: 'Privacy Notice' }) + '</button>');
    if (on('terminos')) enlaces.push('<button type="button" data-accion="doc" data-doc="terminos">' + tx({ es: 'Términos y Condiciones', en: 'Terms and Conditions' }) + '</button>');
    // en la portada van los datos de todas las sucursales; en cada subpágina, los de esa
    var tel = tx({ es: 'Tel. ', en: 'Phone ' });
    var contacto = portadaVisible
      ? '<b>' + esc(n) + '</b>' + N.sucursales.map(function (o) {
          return '<span>' + esc(o.zona) + ': ' + tel + esc(o.telefono) + '</span>';
        }).join('') + '<span>' + esc(correoNegocio()) + '</span>'
      : '<b>' + esc(s.nombre) + '</b><span>' + esc(direccionDe(s)) + '</span>' +
        '<span>WhatsApp ' + esc(s.telefono) + (s.telefonoFijo ? ' · ' + tel + esc(s.telefonoFijo) : '') + ' · ' + esc(correoNegocio()) + '</span>' +
        (N.cedula ? '<span>' + esc(tx(N.cedula)) + ' <span class="s-etq">' + tx({ es: 'Por confirmar', en: 'To be confirmed' }) + '</span></span>' : '');
    html += '<footer class="s-pie"><div class="s-contacto">' + contacto + '</div>' +
      (enlaces.length ? '<nav>' + enlaces.join('') + '</nav>' : '') +
      '<span>© ' + new Date().getFullYear() + ' ' + esc(n) + '</span>' +
      // aviso para el negocio: esto es una muestra, no la página final
      '<p class="s-muestra">' + (en()
        ? '<b>Sample website</b>This is a sample of how the ' + esc(n) + ' website could look. The final version will not be exactly the same: ' +
          'any change the clinic decides on will be agreed by message or email. If the clinic decides not to hire the service, ' +
          '185ChangarroWeb will delete this sample and will not use it for any purpose other than presenting it.'
        : '<b>Página de muestra</b>Esta es una muestra de cómo podría verse la página de ' + esc(n) +
          '. La versión final no quedará exactamente igual: cada cambio que el negocio decida se acordará por mensaje o correo. ' +
          'Si el negocio decide no contratar el servicio, 185ChangarroWeb eliminará esta muestra y no la usará para ningún otro fin ' +
          'que el de presentársela.') + '</p></footer>';

    var scroll = sitio.scrollTop;
    sitio.innerHTML = html;
    sitio.scrollTop = scroll;

    // en computadora las secciones van en 2 columnas: si quedan en número impar, la última ocupa todo el ancho para no dejar hueco
    var mitades = [].slice.call(sitio.querySelectorAll('.s-cuerpo > .s-sec:not(.ancha)'));
    if (mitades.length % 2) mitades[mitades.length - 1].classList.add('completa');

    $('url').textContent = 'https://www.' + dominio() + (portadaVisible || !on('sucursales') ? '' : '/' + s.slug);
    $('url-aviso-dom').textContent = 'www.' + dominio();
    sitio.setAttribute('lang', en() ? 'en' : 'es-MX');
    $('f-wa').hidden = !on('whatsapp');
    $('s-wa-txt').textContent = tx({ es: 'Escríbenos', en: 'Message us' });
    $('f-asis').hidden = !on('asistente');
    if (!on('asistente')) chat.abierto = false;
    pintarChat();
    if (docAbierto && !on(docAbierto)) docAbierto = '';
    pintarDoc();
  }

  // ---------- documentos legales: en la muestra van como aviso de que se redactan a la medida del negocio ----------
  var docAbierto = '';

  // lo que el negocio necesita saber antes de que se redacte cualquiera de los dos documentos
  function docAviso() {
    var n = esc(nombre());
    if (en()) {
      return '<h3>Who is responsible for this document?</h3><p>Its content is defined and approved by ' + n +
        ', as the party responsible for what it offers on its website and for the data it receives from its customers. ' +
        '185ChangarroWeb writes and publishes it on the clinic\'s behalf, using the information the clinic provides, ' +
        'and assumes no legal responsibility for what the clinic chooses, requests or publishes.</p>' +
        '<h3>Before publishing</h3><p>We recommend having a lawyer review the final version before the website goes live.</p>';
    }
    return '<h3>¿Quién responde por este documento?</h3><p>El contenido lo define y lo aprueba ' + n +
      ', como responsable de lo que ofrece en su página y de los datos que recibe de sus clientes. ' +
      '185ChangarroWeb lo redacta y lo publica por encargo del negocio, con la información que el negocio le entregue, ' +
      'y no asume responsabilidad legal por lo que el negocio elija, solicite o publique.</p>' +
      '<h3>Antes de publicarlo</h3><p>Le recomendamos que un abogado revise la versión final antes de que la página salga al público.</p>';
  }

  function docPrivacidad() {
    var n = esc(nombre());
    if (en()) {
      return '<h2>Privacy Notice <span class="s-etq">To be drafted</span></h2>' +
        '<p>The Privacy Notice for the <b>' + n + '</b> website will go here. It will be drafted according to what the clinic decides to include: ' +
        'if a feature asks for personal data (for example, a name or phone number to book a table), the notice will state what data is requested, ' +
        'what it is used for, who it is shared with and how to ask for it to be corrected or deleted.</p>' +
        '<p>Mexican law requires it whenever a website collects personal data, so it cannot be removed if the website does.</p>' +
        '<p>The official version is in Spanish; this translation is provided for convenience.</p>' + docAviso();
    }
    return '<h2>Aviso de privacidad <span class="s-etq">Por redactar</span></h2>' +
      '<p>Aquí irá el Aviso de Privacidad de la página de <b>' + n + '</b>. Se redactará según lo que el negocio decida incluir: ' +
      'si alguna función pide datos personales (por ejemplo, nombre o número de teléfono para agendar una cita), el aviso dirá qué datos se piden, ' +
      'para qué se usan, con quién se comparten y cómo pedir que se corrijan o se borren.</p>' +
      '<p>La ley lo pide siempre que una página recabe datos personales, así que no se puede quitar si la página los pide.</p>' + docAviso();
  }

  function docTerminos() {
    var n = esc(nombre());
    if (en()) {
      return '<h2>Terms and Conditions <span class="s-etq">To be drafted</span></h2>' +
        '<p>The Terms and Conditions for the <b>' + n + '</b> website will go here. They will be drafted according to what the clinic requests: ' +
        'prices, promotions and their conditions, reservations, payment methods, cancellations and any other commitment the website offers its customers.</p>' +
        '<p>They are optional, unless the website takes orders or payments: in that case they are required.</p>' + docAviso();
    }
    return '<h2>Términos y Condiciones <span class="s-etq">Por redactar</span></h2>' +
      '<p>Aquí irán los Términos y Condiciones de la página de <b>' + n + '</b>. Se redactarán según lo que el negocio solicite: ' +
      'precios, promociones y sus condiciones, reservaciones, formas de pago, cancelaciones y cualquier otro compromiso que la página les ofrezca a sus clientes.</p>' +
      '<p>Son opcionales, salvo que la página reciba pedidos o pagos: en ese caso son obligatorios.</p>' + docAviso();
  }

  function pintarDoc() {
    var caja = $('s-doc');
    caja.hidden = !docAbierto;
    if (!docAbierto) return;
    caja.innerHTML = '<div class="s-doc-barra"><button type="button" class="s-btn suave" data-accion="doc-cerrar">' + tx({ es: '← Volver a la página', en: '← Back to the website' }) + '</button></div>' +
      '<article>' + (docAbierto === 'privacidad' ? docPrivacidad() : docTerminos()) + '</article>';
    caja.scrollTop = 0;
  }

  // ---------- asistente (contesta solo con los datos de la plantilla) ----------
  // p: la pregunta en { es, en }; r: arma la respuesta en el idioma que esté elegido
  var PREGUNTAS = [
    { p: { es: '¿Qué horario tienen?', en: 'What are your hours?' }, r: function () {
      // en la portada contesta por todas las sucursales; en una subpágina, solo por esa
      return (enPortada() ? N.sucursales : [suc()]).map(function (s) {
        return s.zona + ': ' + s.horario.map(function (h) {
          return tx(h.dias).toLowerCase() + ' ' + (abre(h) ? textoTurnos(h) : tx({ es: 'cerrado', en: 'closed' }));
        }).join(', ');
      }).join('. ') + '.';
    } },
    { p: { es: '¿Cuánto cuesta?', en: 'How much is it?' }, r: function () {
      return N.menu.map(function (c) {
        var precios = c.platillos.map(function (p) { return p.precio; }).filter(Boolean);
        return tx(c.cat) + (precios.length ? tx({ es: ': desde ', en: ': from ' }) + pesos(Math.min.apply(null, precios)) : '');
      }).join('. ') + '. ' + tx({ es: '(Precios de muestra.)', en: '(Sample prices.)' });
    } },
    { p: { es: '¿Dónde están?', en: 'Where are you?' }, r: function () {
      if (!enPortada()) return tx({ es: 'Estamos en ', en: 'We\'re at ' }) + direccionDe(suc()) + '.';
      var zonas = N.sucursales.map(function (s) { return s.zona; }).join(', ');
      return en()
        ? 'We have ' + N.sucursales.length + ' locations: ' + zonas + '. Choose one above to see its map.'
        : 'Tenemos ' + N.sucursales.length + ' sucursales: ' + zonas + '. Elige una arriba para ver su mapa.';
    } },
    { p: { es: 'Otra pregunta', en: 'Something else' }, r: function () {
      return tx({ es: 'Eso mejor pregúntalo por WhatsApp y te contestamos en persona.', en: 'Please ask us on WhatsApp and a person will get back to you.' });
    } }
  ];

  function pintarChat() {
    var caja = $('s-chat');
    $('s-asis').setAttribute('aria-expanded', String(chat.abierto));
    $('s-asis').setAttribute('aria-label', tx({ es: 'Abrir asistente', en: 'Open assistant' }));
    caja.hidden = !chat.abierto;
    if (!chat.abierto) return;
    var saludo = en() ? 'Hi, I\'m the ' + nombre() + ' assistant. How can I help?' : 'Hola, soy el asistente de ' + nombre() + '. ¿En qué te ayudo?';
    var msgs = [{ yo: false, t: saludo }].concat(chat.msgs);
    caja.innerHTML = '<header><span>' + tx({ es: 'Asistente', en: 'Assistant' }) + '</span><button type="button" data-accion="chat-cerrar" aria-label="' +
      tx({ es: 'Cerrar asistente', en: 'Close assistant' }) + '">×</button></header>' +
      '<div class="s-chat-msgs">' + msgs.map(function (m) {
        return '<div class="s-msg ' + (m.yo ? 'yo' : 'bot') + '">' + esc(m.t) + '</div>';
      }).join('') + '</div><div class="s-chat-preg">' + PREGUNTAS.map(function (q, i) {
        return '<button type="button" data-accion="chat-preg" data-i="' + i + '">' + esc(tx(q.p)) + '</button>';
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

  // ---------- visor de fotos: la foto en grande con su título y descripción ----------
  var visor = $('s-visor');
  function abrirFoto(i) {
    var g = N.galeria[i];
    if (!g) return;
    var t = tx(g.titulo);
    visor.innerHTML = '<div class="s-visor-caja" role="dialog" aria-modal="true" aria-label="' + esc(t) + '">' +
      '<button type="button" class="s-visor-x" data-accion="foto-cerrar" aria-label="' + tx({ es: 'Cerrar', en: 'Close' }) + '">×</button>' +
      '<img src="' + esc(g.img) + '" alt="' + esc(t) + '">' +
      '<div class="s-visor-txt"><h2>' + esc(t) + (g.ejemplo ? ' <span class="s-etq">' + tx({ es: 'Ejemplo', en: 'Sample' }) + '</span>' : '') + '</h2><p>' + esc(tx(g)) + '</p></div></div>';
    visor.hidden = false;
    visor.querySelector('.s-visor-x').focus();
  }
  function cerrarFoto() { visor.hidden = true; visor.innerHTML = ''; }
  // tocar fuera de la foto también cierra
  visor.addEventListener('click', function (e) { if (e.target === visor) cerrarFoto(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !visor.hidden) cerrarFoto(); });

  document.querySelector('.pantalla').addEventListener('click', function (e) {
    var b = e.target.closest('[data-accion]');
    if (!b) return;
    var accion = b.getAttribute('data-accion'), i = Number(b.getAttribute('data-i'));
    if (accion === 'aviso') aviso(b.getAttribute('data-texto'));
    else if (accion === 'doc') { docAbierto = b.getAttribute('data-doc'); pintarDoc(); }
    else if (accion === 'doc-cerrar') { docAbierto = ''; pintarDoc(); }
    else if (accion === 'dia') { agenda.dia = i; agenda.eligio = true; agenda.hora = -1; pintarSitio(); }
    else if (accion === 'hora') { agenda.hora = i; pintarSitio(); }
    else if (accion === 'carrusel') { var tot = N.carrusel.length; carrusel = (carrusel + i + tot) % tot; pintarSitio(); }
    else if (accion === 'sucursal') irSucursal(i);
    else if (accion === 'apartar') {
      aviso(en()
        ? 'This would send the appointment request (' + textoReserva(diasAgenda()[agenda.dia]) + '). The website would ask for your name, phone number and reason for the visit.'
        : 'Aquí se enviaría la solicitud de cita (' + textoReserva(diasAgenda()[agenda.dia]) + '). La página pediría nombre, teléfono y motivo de la consulta.');
    }
    else if (accion === 'promo-tab') { promoTab = b.getAttribute('data-t'); pintarSitio(); }
    else if (accion === 'foto') abrirFoto(i);
    else if (accion === 'foto-cerrar') cerrarFoto();
    else if (accion === 'quitar') {
      var id = b.getAttribute('data-f');
      estado.activas[id] = false;
      if (inputs[id]) inputs[id].checked = false;
      cambio();
      aviso('Se quitó "' + nombreFuncion(id) + '". Puede volver a prenderla en el panel.');
    }
    else if (accion === 'idioma') {
      estado.idioma = b.getAttribute('data-l');
      chat.msgs = []; // la plática empieza de nuevo en el otro idioma
      guardar(); pintarSitio();
      if (!visor.hidden) cerrarFoto();
    }
    else if (accion === 'chat-cerrar') { chat.abierto = false; pintarChat(); }
    else if (accion === 'chat-preg') {
      chat.msgs.push({ yo: true, t: tx(PREGUNTAS[i].p) }, { yo: false, t: PREGUNTAS[i].r() });
      pintarChat();
    }
  });
  $('s-wa').addEventListener('click', function () {
    // en la portada todavía no se sabe la sucursal; en una subpágina va directo a su WhatsApp
    aviso(enPortada()
      ? tx({ es: 'Aquí se preguntaría a qué sucursal escribir y se abriría su WhatsApp con el mensaje: "',
             en: 'This would ask which location to message and open its WhatsApp with the message: "' }) + tx(N.mensajeWhatsapp) + '"'
      : avisoWhatsapp(suc()));
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

  $('negocio-fijo').textContent = nombre();

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
    var altoLibre = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - $('url-aviso').offsetHeight - 12;
    var s = Math.min(1, anchoLibre / ANCHO_PC);
    // en pantalla grande también cuida el alto; en celular el escenario crece hacia abajo
    if (!VERTICAL.matches && altoLibre > 200) s = Math.min(s, altoLibre / ALTO_PC);
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
  // en la vista de celular no hay barra de desplazamiento: se arrastra con el dedo o, en la laptop, con el mouse
  function arrastrable(el) {
    var y0 = 0, arriba0 = 0, apretado = false, movio = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || estado.vista !== 'celular') return;
      apretado = true; movio = false; y0 = e.clientY; arriba0 = el.scrollTop;
    });
    el.addEventListener('pointermove', function (e) {
      if (!apretado) return;
      var dy = e.clientY - y0;
      if (!movio && Math.abs(dy) < 5) return;
      if (!movio) { movio = true; el.setPointerCapture(e.pointerId); el.classList.add('arrastrando'); }
      el.scrollTop = arriba0 - dy;
    });
    var soltar = function () { apretado = false; el.classList.remove('arrastrando'); };
    el.addEventListener('pointerup', soltar);
    el.addEventListener('pointercancel', soltar);
    // si fue arrastre, no cuenta como clic en un botón
    el.addEventListener('click', function (e) {
      if (movio) { e.preventDefault(); e.stopPropagation(); movio = false; }
    }, true);
  }
  arrastrable(sitio);
  arrastrable($('s-doc'));
  if (N.color) document.querySelector('.pantalla').style.setProperty('--brand', N.color);

  $('ver-celular').addEventListener('click', function () { ponerVista('celular'); });
  $('ver-escritorio').addEventListener('click', function () { ponerVista('escritorio'); });
  if (window.ResizeObserver) new ResizeObserver(ajustarEscala).observe(stage);
  else window.addEventListener('resize', ajustarEscala);

  // ---------- pantalla vertical (celulares que abren la muestra) ----------
  // Primero se ve el teléfono; el panel sale desde la izquierda con el botón "Ábreme…" y el selector
  // Celular/Computadora baja arriba del aviso de la dirección. En pantallas anchas todo queda como siempre.
  var panel = $('panel'), velo = $('velo'), abrirPanel = $('abrir-panel'), seg = $('seg');
  function ponerPanel(abierto) {
    document.body.classList.toggle('panel-abierto', abierto);
    velo.hidden = !abierto;
    abrirPanel.setAttribute('aria-expanded', String(abierto));
    if (abierto) $('panel-cerrar').focus(); else if (VERTICAL.matches) abrirPanel.focus();
  }
  function modoVertical() {
    var vertical = VERTICAL.matches;
    document.body.classList.toggle('vertical', vertical);
    if (vertical) $('seg-lugar').appendChild(seg); else document.querySelector('.top').appendChild(seg);
    if (!vertical && document.body.classList.contains('panel-abierto')) ponerPanel(false);
    ajustarEscala();
  }
  abrirPanel.addEventListener('click', function () { ponerPanel(true); });
  $('panel-cerrar').addEventListener('click', function () { ponerPanel(false); });
  velo.addEventListener('click', function () { ponerPanel(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('panel-abierto')) ponerPanel(false);
  });
  if (VERTICAL.addEventListener) VERTICAL.addEventListener('change', modoVertical); else VERTICAL.addListener(modoVertical);
  modoVertical();

  // ---------- petición: el negocio la manda por WhatsApp a 185ChangarroWeb ----------
  function fechaHoy() {
    var d = new Date();
    return d.getDate() + ' de ' + d.toLocaleDateString('es-MX', { month: 'long' }) + ' de ' + d.getFullYear();
  }

  // en primera persona, como si lo escribiera el dueño; los *asteriscos* salen en negritas en WhatsApp
  function armarMensaje() {
    var linea = function (f) { return '- ' + f.nombre + (f.nota ? ' (' + f.nota + ')' : ''); };
    var enPagina = D.FUNCIONES.filter(function (f) { return on(f.id) && !f.servicio; });
    var servicios = D.FUNCIONES.filter(function (f) { return on(f.id) && f.servicio; });
    var no = D.FUNCIONES.filter(function (f) { return !on(f.id); });
    var p = planSugerido();
    var l = [
      'Hola, 185ChangarroWeb. Revisé la muestra de la página de *' + nombre() + '* y esta es mi petición:',
      '',
      '*Plan:* ' + p.name + (p.inst ? ' (' + pesos(p.inst) + ' de instalación + ' + pesos(p.mes) + ' al mes)' : ''),
      '*Fecha:* ' + fechaHoy(),
      on('sucursales') ? '*Sucursales:* ' + N.sucursales.map(function (s) { return s.zona; }).join(', ') : null,
      '',
      '*Quiero en la página:*',
      enPagina.length ? enPagina.map(linea).join('\n') : '- Nada',
      '',
      '*Quiero que ustedes me ayuden con:*',
      servicios.length ? servicios.map(linea).join('\n') : '- Nada',
      '',
      '*No quiero:*',
      no.length ? no.map(linea).join('\n') : '- Nada',
      '',
      '*Notas:*',
      estado.notas.trim() || 'Sin notas.',
      '',
      'Quedo al pendiente para los siguientes pasos. Gracias.'
    ];
    return l.filter(function (x) { return x !== null; }).join('\n');
  }

  var modal = $('modal'), campoMensaje = $('mensaje'), botonWhatsapp = $('btn-whatsapp');
  // el enlace se arma con lo que diga el cuadro, por si el dueño lo cambió antes de enviarlo
  function ponerEnlaceWhatsapp() {
    botonWhatsapp.href = 'https://wa.me/' + D.WHATSAPP_185 + '?text=' + encodeURIComponent(campoMensaje.value);
  }
  campoMensaje.addEventListener('input', ponerEnlaceWhatsapp);
  $('btn-exportar').addEventListener('click', function () {
    campoMensaje.value = armarMensaje();
    ponerEnlaceWhatsapp();
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
      aviso(ok ? 'Mensaje copiado.' : 'No se pudo copiar solo. Ya está seleccionado: cópielo a mano.');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(function () { aviso('Mensaje copiado.'); }, aMano);
    } else {
      aMano();
    }
  });

  aplicarObligatorias();
  pintarPlan();
  pintarSitio();
  ponerVista(estado.vista);
})();
