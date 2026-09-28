/* Muestra de Salón de Eventos San Miguel: interruptores de lo que se ve en la página, vista celular o computadora, y la petición que el negocio manda por WhatsApp.
   El contenido vive en muestra-datos.js; aquí solo se pinta. */
(function () {
  'use strict';

  var D = window.MUESTRA_DATOS;
  var N = D.NEGOCIO;
  // cada copia de la carpeta guarda aparte, para que la muestra de un negocio no herede lo de otro
  // v6: las reseñas reales empiezan prendidas; con otra clave no se hereda lo que se apagó antes
  var GUARDADO = 'muestra185.v5:' + location.pathname;
  var ANCHO_PC = 1100, ALTO_PC = 680;
  // ventana angosta o muy vertical (un celular): el teléfono va primero y el panel se abre aparte
  var VERTICAL = window.matchMedia('(max-width: 820px), (max-aspect-ratio: 3/4)');
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  // deslinde de las fotos: va arriba de las imágenes, en el visor y en el pie
  var AVISO_FOTOS = 'Estas imágenes se tomaron del Facebook de ' + D.negocioEjemplo + '. No usaremos estas imágenes ni la información ' +
    'de esta página para nada fuera de esta demostración. El negocio puede decidir no contratar y, en ese caso, se borra esta muestra.';
  // "¿Qué incluye?" se dedujo de las fotos: el salón no lo ha dicho
  var AVISO_ESPECULA = 'Esto no es información verdadera: es solo una especulación a partir de las imágenes presentadas.';
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // orden de las secciones (el negocio las sube o baja desde el panel)
  var ORDEN_SECCIONES = ['ubicacion', 'incluye', 'tipos', 'paquetes', 'contactar', 'fechas', 'agenda', 'resenas', 'faq'];
  var estado = { vista: 'celular', notas: '', activas: {}, orden: ORDEN_SECCIONES.slice() };
  // recorrido: día, hora, tipo de evento e invitados elegidos (-1 = sin elegir)
  var agenda = { dia: -1, hora: -1, tipo: -1, invitados: -1 };
  // calendario de fechas: mes que se ve (0 = este mes) y fecha elegida (null = ninguna)
  var cal = { mes: 0, fecha: null };
  // si al mes le queda menos de una semana, el calendario empieza en el siguiente
  (function () {
    var hoy = new Date();
    if (new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate() - hoy.getDate() < 7) cal.mes = 1;
  })();
  var chat = { abierto: false, msgs: [] };
  var fotoPrincipal = 0;
  D.FUNCIONES.forEach(function (f) { estado.activas[f.id] = f.activa; });

  // localStorage solo para comodidad: si falla, la muestra sigue igual
  try {
    var previo = JSON.parse(localStorage.getItem(GUARDADO) || 'null');
    if (previo) {
      estado.notas = typeof previo.notas === 'string' ? previo.notas : '';
      estado.vista = previo.vista === 'escritorio' ? 'escritorio' : 'celular';
      if (Array.isArray(previo.orden) && previo.orden.length === ORDEN_SECCIONES.length &&
        ORDEN_SECCIONES.every(function (id) { return previo.orden.indexOf(id) >= 0; })) estado.orden = previo.orden;
      D.FUNCIONES.forEach(function (f) {
        if (previo.activas && typeof previo.activas[f.id] === 'boolean') estado.activas[f.id] = previo.activas[f.id];
      });
    }
  } catch (e) {}

  // obligatoriaCon: si está prendida alguna de esas funciones, esta también (los Términos con anticipos)
  function forzadaPor(f) {
    return (f.obligatoriaCon || []).filter(function (id) { return estado.activas[id]; });
  }

  function guardar() {
    try { localStorage.setItem(GUARDADO, JSON.stringify(estado)); } catch (e) {}
  }

  var on = function (id) { return !!estado.activas[id]; };
  function nombreFuncion(id) {
    for (var i = 0; i < D.FUNCIONES.length; i++) if (D.FUNCIONES[i].id === id) return D.FUNCIONES[i].nombre;
    return id;
  }
  // el nombre es el del negocio de esta muestra y no se cambia desde el panel
  function nombre() { return D.negocioEjemplo; }
  function dominio() {
    return (nombre().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 30) || 'minegocio') + '.com.mx';
  }
  function correoNegocio() { return on('correo') ? 'contacto@' + dominio() : N.correoDatos; }
  function porConfirmar() { return N.porConfirmar ? ' (por confirmar)' : ''; }

  // ---------- panel: interruptores de lo que se ve en la página ----------
  var inputs = {}, etiquetas = {}, filas = {};
  var grupos = $('grupos');
  var lista = document.createElement('div');
  lista.className = 'grupo';
  lista.innerHTML = '<div class="grupo-cab"><span><b>En la página</b><small class="cuenta"></small></span></div><div class="toggles"></div>';
  var cuenta = lista.querySelector('.cuenta');
  var toggles = lista.querySelector('.toggles');
  D.FUNCIONES.forEach(function (f) {
    var fila = document.createElement('label');
    fila.className = 'tog';
    fila.innerHTML = '<span class="t"></span><span class="d"></span>' +
      '<span class="switch"><input type="checkbox" role="switch"><span></span></span>';
    var t = fila.querySelector('.t');
    t.textContent = f.nombre;
    if (f.obligatoriaCon) {
      var obl = document.createElement('span');
      obl.className = 'tag';
      t.appendChild(obl);
      etiquetas[f.id] = obl;
    }
    fila.querySelector('.d').textContent = f.descripcion;
    if (ORDEN_SECCIONES.indexOf(f.id) >= 0) {
      var mover = document.createElement('span');
      mover.className = 'mover';
      mover.innerHTML = '<button type="button" data-d="-1" aria-label="Subir ' + esc(f.nombre) + '">▲</button>' +
        '<button type="button" data-d="1" aria-label="Bajar ' + esc(f.nombre) + '">▼</button>';
      mover.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        e.preventDefault(); e.stopPropagation();
        if (!b) return;
        var i = estado.orden.indexOf(f.id), k = i + Number(b.getAttribute('data-d'));
        if (k < 0 || k >= estado.orden.length) return;
        estado.orden.splice(k, 0, estado.orden.splice(i, 1)[0]);
        ordenarFilas();
        guardar();
        pintarSitio();
      });
      fila.appendChild(mover);
    }
    filas[f.id] = fila;
    var input = fila.querySelector('input');
    input.checked = on(f.id);
    input.addEventListener('change', function () {
      estado.activas[f.id] = input.checked;
      cambio();
    });
    inputs[f.id] = input;
    toggles.appendChild(fila);
  });
  grupos.appendChild(lista);
  // las secciones se listan en el orden actual; lo demás (botón fijo, asistente, correo…) queda abajo
  function ordenarFilas() {
    var ids = estado.orden.map(function (id) { return id; });
    D.FUNCIONES.forEach(function (f) { if (ids.indexOf(f.id) < 0 && f.id !== 'google') ids.push(f.id); });
    ids.forEach(function (id) { if (filas[id]) toggles.appendChild(filas[id]); });
    if (filas.google) toggles.appendChild(filas.google);
  }
  ordenarFilas();

  // prende y bloquea lo que es obligatorio por otra función; al apagar esa, se puede volver a apagar
  function aplicarObligatorias() {
    D.FUNCIONES.forEach(function (f) {
      if (!f.obligatoriaCon) return;
      var por = forzadaPor(f);
      if (por.length) estado.activas[f.id] = true;
      inputs[f.id].checked = on(f.id);
      inputs[f.id].disabled = por.length > 0;
      etiquetas[f.id].hidden = !por.length;
      etiquetas[f.id].textContent = 'Obligatorio con ' + por.map(function (id) { return nombreFuncion(id).toLowerCase(); }).join(', ');
    });
  }

  function pintarCuenta() {
    cuenta.textContent = D.FUNCIONES.filter(function (f) { return on(f.id); }).length + ' de ' + D.FUNCIONES.length + ' prendidas';
  }

  // ---------- recorridos ----------
  // '18:00' → '6:00 p.m.'
  var hora12 = function (hhmm) {
    var p = hhmm.split(':'), h = Number(p[0]);
    return ((h % 12) || 12) + ':' + p[1] + (h >= 12 ? ' p.m.' : ' a.m.');
  };
  // ocupados de muestra: salen siempre igual para la misma fecha. En la página real los marca el salón desde un panel.
  // número entre 0 y 1 que sale igual para la misma fecha (se mezcla bien para que no se repita cada semana)
  function azar(fecha, extra) {
    var h = (fecha.getFullYear() * 10000 + (fecha.getMonth() + 1) * 100 + fecha.getDate()) * 16 + extra;
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  // los viernes y sábados se llenan más, luego los domingos; entre semana casi no hay eventos
  function fechaReservada(fecha) {
    var dia = fecha.getDay();
    return azar(fecha, 0) < (dia === 6 ? 0.7 : dia === 5 ? 0.55 : dia === 0 ? 0.4 : 0.1);
  }
  // cada hora de recorrido está ocupada 1 de cada 3 veces; algunos días se llenan completos
  function diaLleno(fecha) { return azar(fecha, 9) < 0.2; }
  function horaOcupada(fecha, i) { return diaLleno(fecha) || azar(fecha, i + 1) < 0.33; }

  // próximos 6 días con recorridos, desde mañana (el mismo día no da tiempo de confirmar)
  function diasRecorrido() {
    var lista = [], d = new Date();
    for (var i = 1; lista.length < 6 && i < 14; i++) {
      var f = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (N.recorridos.d.indexOf(f.getDay()) >= 0) {
        lista.push({ fecha: f, lleno: diaLleno(f), corto: i === 1 ? 'Mañana' : DIAS_CORTOS[f.getDay()], largo: i === 1 ? 'mañana' : 'el ' + DIAS[f.getDay()] + ' ' + f.getDate() });
      }
    }
    // en la muestra siempre hay al menos un día lleno, para que se vea cómo queda
    if (lista.length > 2 && !lista.some(function (d) { return d.lleno; })) lista[2].lleno = true;
    return lista;
  }
  function fechaLarga(f) { return DIAS[f.getDay()] + ' ' + f.getDate() + ' de ' + MESES[f.getMonth()] + ' de ' + f.getFullYear(); }

  // calendario del mes que se ve: libres, reservadas, pasadas y la elegida
  function calendario() {
    var hoy = new Date(), hoy0 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    var primero = new Date(hoy.getFullYear(), hoy.getMonth() + cal.mes, 1);
    var total = new Date(primero.getFullYear(), primero.getMonth() + 1, 0).getDate();
    var celdas = '', libres = 0, sabados = 0, sabadosLibres = 0;
    for (var b = 0; b < primero.getDay(); b++) celdas += '<span></span>';
    for (var d = 1; d <= total; d++) {
      var f = new Date(primero.getFullYear(), primero.getMonth(), d);
      var pasada = f <= hoy0, reservada = !pasada && fechaReservada(f);
      var elegida = cal.fecha && f.getTime() === cal.fecha.getTime();
      if (!pasada && !reservada) libres++;
      if (!pasada && f.getDay() === 6) { sabados++; if (!reservada) sabadosLibres++; }
      celdas += '<button type="button" class="s-cal-dia' + (pasada ? ' pasada' : reservada ? ' reservada' : '') + '" data-accion="fecha" data-i="' + d + '"' +
        (pasada || reservada ? ' disabled' : '') + ' aria-pressed="' + !!elegida + '" aria-label="' + esc(fechaLarga(f) + (reservada ? ', reservada' : pasada ? '' : ', libre')) + '">' + d + '</button>';
    }
    var resumen = libres
      ? libres + (libres === 1 ? ' fecha libre' : ' fechas libres') + ' en ' + MESES[primero.getMonth()] +
        (sabados ? '; ' + (sabadosLibres ? sabadosLibres + ' de ' + sabados + ' sábados' : 'ningún sábado') : '') + '.'
      : 'Ya no quedan fechas libres en ' + MESES[primero.getMonth()] + '.';
    return '<div class="s-cal"><div class="s-cal-cab">' +
      '<button type="button" data-accion="mes" data-i="-1"' + (cal.mes > 0 ? '' : ' disabled') + ' aria-label="Mes anterior">‹</button>' +
      '<b>' + MESES[primero.getMonth()] + ' ' + primero.getFullYear() + '</b>' +
      '<button type="button" data-accion="mes" data-i="1"' + (cal.mes < N.mesesCalendario - 1 ? '' : ' disabled') + ' aria-label="Mes siguiente">›</button></div>' +
      '<div class="s-cal-sem">' + DIAS_CORTOS.map(function (x) { return '<span>' + x.charAt(0) + '</span>'; }).join('') + '</div>' +
      '<div class="s-cal-grid">' + celdas + '</div></div>' +
      '<p class="s-leyenda"><span><i></i>Libre</span><span><i class="reservada"></i>Reservada</span><span><i class="tuya"></i>Tu fecha</span></p>' +
      '<p class="s-cal-resumen">' + esc(resumen) + '</p>';
  }
  function textoRecorrido() {
    var h = N.recorridos.horas[agenda.hora];
    return 'Agendar recorrido ' + diasRecorrido()[agenda.dia].largo + (h.indexOf('13:') === 0 ? ' a la ' : ' a las ') + hora12(h);
  }

  // ---------- sitio de prueba ----------
  var sitio = $('sitio');

  // cada sección trae su × para quitarla desde la misma muestra (igual que apagarla en el panel)
  function quitar(id) {
    return '<button type="button" class="s-quitar" data-accion="quitar" data-f="' + id + '" aria-label="Quitar ' + esc(nombreFuncion(id)) + '">×</button>';
  }
  function seccion(id, titulo, cuerpo, clase) {
    return '<section class="s-sec' + (clase ? ' ' + clase : '') + '" data-funcion="' + id + '">' + quitar(id) +
      '<h3>' + esc(titulo) + '</h3>' + cuerpo + '</section>';
  }
  // etiqueta encima de la foto cuando se difuminaron personas
  function avisoFoto(f) {
    return f.aviso ? '<em class="s-difuminada">' + esc(f.aviso) + '</em>' : '';
  }
  function botonAviso(texto, aviso, clase) {
    return '<button type="button" class="s-btn' + (clase ? ' ' + clase : '') + '" data-accion="aviso" data-texto="' + esc(aviso) + '">' + esc(texto) + '</button>';
  }
  function avisoWhatsapp() {
    return 'Aquí se abriría el WhatsApp de ' + nombre() + ' (' + N.telefono + ') con el mensaje: "' + N.mensajeWhatsapp + '"';
  }
  var ICONOS = {
    wa: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    tel: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    fb: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    pin: '<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></svg>'
  };

  function secciones() {
    var partes = [];

    // nombre del salón, foto principal y miniaturas; al tocar una foto se abre con su descripción
    var hero = '<h2>' + esc(nombre()) + '</h2><p class="s-zona">La Primavera, Zapopan, Jalisco</p>';
    if (on('galeria')) {
      var p = N.fotos[fotoPrincipal];
      hero += '<p class="s-deslinde"><b>Aviso</b>' + esc(AVISO_FOTOS) + '</p>' +
        '<button type="button" class="s-principal" data-accion="foto" data-i="' + fotoPrincipal + '">' +
        '<img src="' + esc(p.img) + '" alt="' + esc(p.titulo) + '">' + avisoFoto(p) + '<span>' + esc(p.titulo) + ' · Toca para saber más</span></button>' +
        '<div class="s-minis">' + N.fotos.map(function (f, i) {
          return '<button type="button" class="s-mini" data-accion="foto" data-i="' + i + '" aria-pressed="' + (i === fotoPrincipal) + '" aria-label="' + esc(f.titulo) + '">' +
            '<img src="' + esc(f.img) + '" alt="" loading="lazy"></button>';
        }).join('') + '</div>';
      partes.push('<section class="s-hero ancha" data-funcion="galeria">' + quitar('galeria') + hero + '</section>');
    } else {
      partes.push('<section class="s-hero ancha">' + hero + '</section>');
    }

    if (on('ubicacion')) {
      partes.push(seccion('ubicacion', '¿Dónde nos encuentras?',
        '<p class="s-dir">' + esc(N.direccion + porConfirmar()) + '</p>' +
        (N.mapaBusqueda
          ? '<figure class="s-mapa-fig"><iframe class="s-mapa-img" title="Mapa de la ubicación de ' + esc(nombre()) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
            'src="https://maps.google.com/maps?q=' + encodeURIComponent(N.mapaBusqueda) + '&z=15&output=embed"></iframe>' +
            '<figcaption>Mapa de Google: se puede mover y acercar. La ubicación exacta se confirma con el salón.</figcaption></figure>'
          : N.mapa
          ? '<figure class="s-mapa-fig"><img class="s-mapa-img" src="' + esc(N.mapa) + '" alt="Mapa de la ubicación de ' + esc(nombre()) + '" loading="lazy">' +
            '<figcaption>Captura de Google Maps, de ejemplo. En la página final va el mapa de Google, que se puede mover.</figcaption></figure>'
          : '<div class="s-mapa" aria-hidden="true"><i class="s-mapa-pin">' + ICONOS.pin + '</i><span>Mapa de ejemplo</span></div>') +
        botonAviso('Cómo llegar', 'Aquí se abriría ' + nombre() + ' en Google Maps con la ruta desde donde estés.')));
    }

    if (on('incluye')) {
      partes.push(seccion('incluye', '¿Qué incluye?', '<p class="s-especula">' + esc(AVISO_ESPECULA) + '</p><div class="s-incluye">' + N.incluye.map(function (c) {
        return '<div class="s-inc"><b>' + esc(c.titulo) + '</b><ul>' + c.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<span class="s-etq">Especulación</span></div>';
      }).join('') + '</div><p class="s-aviso-muestra">Qué entra en la renta, para cuántas personas y qué amenidades tiene se confirma con ' +
        esc(nombre()) + ' antes de publicar la página.</p>', 'ancha'));
    }

    // tipos de evento: al tocar uno se marca en el paso 3 del recorrido
    if (on('tipos')) {
      partes.push(seccion('tipos', '¿Qué celebras?', '<div class="s-tipos">' + N.tiposTexto.map(function (t, i) {
        return '<button type="button" class="s-tipo" data-accion="tipo-evento" data-i="' + i + '" aria-pressed="' + (agenda.tipo === i) + '">' +
          '<b>' + esc(N.tiposEvento[i]) + '</b><span>' + esc(t) + '</span></button>';
      }).join('') + '</div>' + (on('agenda') ? '<p class="s-nota">Toca tu evento y lo marcamos en tu recorrido.</p>' : ''), 'ancha'));
    }

    // paquetes de ejemplo: la cotización lleva lo que ya se eligió en el calendario y en el recorrido
    if (on('paquetes')) {
      partes.push(seccion('paquetes', 'Paquetes', '<p class="s-especula">' + esc(AVISO_ESPECULA) +
        ' Los paquetes y lo que incluye cada uno los define el salón.</p><div class="s-paquetes">' + N.paquetes.map(function (p, i) {
          return '<div class="s-paq' + (p.destacado ? ' destacado' : '') + '">' + (p.destacado ? '<span class="s-paq-top">El más pedido</span>' : '') +
            '<b>' + esc(p.nombre) + '</b><small>' + esc(p.lema) + '</small><ul>' + p.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
            '<p class="s-paq-precio">Precio por cotizar</p>' +
            '<button type="button" class="s-btn ' + (p.destacado ? '' : 'suave ') + 'ancho" data-accion="cotizar" data-i="' + i + '">Pedir cotización</button></div>';
        }).join('') + '</div><p class="s-nota">La cotización lleva la fecha, el evento y los invitados que elijas en el calendario y en el recorrido. <span class="s-etq">Ejemplo</span></p>',
        'ancha'));
    }

    if (on('contactar')) {
      partes.push(seccion('contactar', 'Maneras de comunicarte', '<div class="s-contactar">' +
        '<button type="button" class="s-canal wa" data-accion="aviso" data-texto="' + esc(avisoWhatsapp()) + '">' + ICONOS.wa + '<span><b>WhatsApp</b><small>Te contestamos por mensaje</small></span></button>' +
        '<button type="button" class="s-canal" data-accion="aviso" data-texto="' + esc('Aquí se marcaría al ' + N.telefono + '.') + '">' + ICONOS.tel + '<span><b>Llamar</b><small>' + esc(N.telefono) + '</small></span></button>' +
        '<button type="button" class="s-canal fb" data-accion="aviso" data-texto="' + esc('Aquí se abriría ' + N.facebook) + '">' + ICONOS.fb + '<span><b>Facebook</b><small>Fotos de eventos pasados</small></span></button>' +
        '</div>'));
    }

    // calendario de fechas para el evento: libres y reservadas (las reservadas de la muestra son inventadas)
    if (on('fechas')) {
      partes.push(seccion('fechas', 'Fechas disponibles',
        '<p class="s-dir">Busca la fecha de tu evento. Las marcadas ya están reservadas.</p>' + calendario() +
        (cal.fecha
          ? botonAviso('Preguntar por el ' + fechaLarga(cal.fecha).replace(/ de \d+$/, ''),
              'Aquí se abriría el WhatsApp de ' + nombre() + ' con el mensaje: "Hola, ¿tienen libre el ' + fechaLarga(cal.fecha) + ' para mi evento?"', 'ancho')
          : '<button type="button" class="s-btn ancho" disabled>Elige una fecha libre</button>') +
        '<p class="s-nota">Una fecha libre no queda apartada hasta que el salón te la confirma. <span class="s-etq">Fechas de ejemplo</span></p>',
        'ancha'));
    }

    // recorrido: día, hora, tipo de evento e invitados. Los días llenos y las horas ocupadas no se pueden elegir.
    if (on('agenda')) {
      var dias = diasRecorrido();
      var chips = function (lista, accion, sel, texto, bloqueado) {
        return lista.map(function (x, i) {
          var no = bloqueado && bloqueado(x, i);
          return '<button type="button" data-accion="' + accion + '" data-i="' + i + '" aria-pressed="' + (i === sel) + '"' +
            (no ? ' class="ocupado" disabled' : '') + '>' + texto(x) + '</button>';
        }).join('');
      };
      var diaElegido = agenda.dia >= 0 ? dias[agenda.dia] : null;
      var listo = agenda.dia >= 0 && agenda.hora >= 0 && agenda.tipo >= 0;
      partes.push(seccion('agenda', 'Agendar recorrido',
        '<p class="s-dir">Ven a conocer el salón antes de apartar tu fecha. Atendemos de lunes a sábado, con cita.</p>' +
        '<p class="s-paso">1. Elige el día</p><div class="s-dias">' + chips(dias, 'dia', agenda.dia,
          function (d) { return esc(d.corto) + '<b>' + d.fecha.getDate() + '</b>' + (d.lleno ? '<small>Lleno</small>' : ''); },
          function (d) { return d.lleno; }) + '</div>' +
        '<p class="s-paso">2. Hora de tu visita</p>' + (diaElegido
          ? '<div class="s-horas">' + chips(N.recorridos.horas, 'hora', agenda.hora, function (h) { return esc(hora12(h)); },
              function (h, i) { return horaOcupada(diaElegido.fecha, i); }) + '</div>' +
            '<p class="s-leyenda"><span><i></i>Libre</span><span><i class="reservada"></i>Ocupada</span></p>'
          : '<p class="s-nota s-nota-hora">Elige un día para ver las horas libres.</p>') +
        '<p class="s-paso">3. ¿Qué vas a celebrar?</p><div class="s-horas">' + chips(N.tiposEvento, 'tipo', agenda.tipo, esc) + '</div>' +
        '<p class="s-paso">4. Invitados (aproximado)</p><div class="s-horas">' + chips(N.invitados, 'invitados', agenda.invitados, esc) + '</div>' +
        '<button type="button" class="s-btn ancho" data-accion="recorrido"' + (listo ? '' : ' disabled') + '>' +
        (listo ? esc(textoRecorrido()) : 'Elige día, hora y tu evento') + '</button>' +
        '<p class="s-nota">Horarios y horas ocupadas de ejemplo.' +(on('recordatorios') ? ' Te mandamos un recordatorio por correo un día antes.' : '') + '</p>' +
        (on('pedidos') ? '<p class="s-nota">¿Ya lo conoces? Aparta tu fecha con anticipo. Consulta cancelaciones y devoluciones en los ' +
          '<button type="button" class="s-enlace" data-accion="doc" data-doc="terminos">Términos y Condiciones</button>.</p>' +
          botonAviso('Apartar mi fecha', 'Aquí se abriría la liga de pago del salón para el anticipo.', 'suave ancho') : ''),
        'ancha'));
    }

    var botonGoogle = botonAviso('Califícanos en Google', 'Aquí se abriría la ficha de ' + nombre() + ' en Google Maps para dejar una reseña.', 'suave');
    if (on('resenas')) {
      // reseñas reales de Google: solo nombre e inicial del apellido
      partes.push(seccion('resenas', 'Lo que dicen de nosotros', N.resenas.map(function (r) {
        return '<div class="s-resena"><div class="s-resena-cab"><span class="s-avatar" aria-hidden="true">' + esc(r.autor.charAt(0)) + '</span>' +
          '<span><b>' + esc(r.autor) + '</b><small>Reseña de Google · ' + esc(r.cuando) + '</small></span></div>' +
          '<span class="s-estrellas" aria-label="' + r.estrellas + ' de 5 estrellas">' + '★★★★★'.slice(0, r.estrellas) + '☆☆☆☆☆'.slice(0, 5 - r.estrellas) + '</span>' +
          '<p>' + esc(r.texto) + '</p></div>';
      }).join('') +
        '<p class="s-aviso-muestra">Reseñas reales de la ficha de Google Maps del salón. Por privacidad, solo se muestra el nombre y la inicial del apellido.</p>' +
        (on('google') ? '<p class="s-nota">' + botonGoogle + '</p>' : '')));
    } else if (on('google')) {
      partes.push(seccion('google', '¿Ya hiciste tu evento aquí?', '<p class="s-dir">Tu opinión nos ayuda mucho.</p>' + botonGoogle));
    }

    if (on('faq')) {
      partes.push(seccion('faq', 'Preguntas frecuentes', '<div class="s-faq">' + N.faq.map(function (q) {
        return '<details><summary>' + esc(q.p) + '</summary><p>' + (q.pendiente
          ? '<span class="s-etq">Por confirmar</span> La respuesta la da ' + esc(nombre()) + ' antes de publicar la página.'
          : esc(q.r)) + '</p></details>';
      }).join('') + '</div>', 'ancha'));
    }

    // la portada va primero; el resto, en el orden que el negocio eligió en el panel
    var posicion = function (html) {
      var id = (/data-funcion="(w+)"/.exec(html) || [])[1];
      return estado.orden.indexOf(id === 'google' ? 'resenas' : id);
    };
    return partes.slice(0, 1).concat(partes.slice(1).map(function (h, i) { return { h: h, i: i }; })
      .sort(function (a, b) { return posicion(a.h) - posicion(b.h) || a.i - b.i; })
      .map(function (x) { return x.h; }));
  }

  function pintarSitio() {
    var n = nombre();
    // barra fija arriba: logo del salón y "¿Dónde estamos?", que baja al mapa
    var html = '<header class="s-barra"><img class="s-logo-img" src="' + esc(N.logo) + '" alt="' + esc(n) + '">' +
      (on('ubicacion') ? '<button type="button" class="s-donde" data-accion="ir" data-f="ubicacion">' + ICONOS.pin + '¿Dónde estamos?</button>' : '') +
      '</header>';
    html += '<div class="s-cuerpo">' + secciones().join('') + '</div>';

    // pie: quién vende y cómo contactarlo va siempre (Ley Federal de Protección al Consumidor, art. 76 bis)
    var enlaces = ['<button type="button" data-accion="doc" data-doc="privacidad">Aviso de privacidad</button>'];
    if (on('terminos')) enlaces.push('<button type="button" data-accion="doc" data-doc="terminos">Términos y Condiciones</button>');
    html += '<footer class="s-pie"><div class="s-contacto"><b>' + esc(n) + '</b><span>' + esc(N.direccion + porConfirmar()) + '</span>' +
      '<span>Tel. ' + esc(N.telefono) + ' · ' + esc(correoNegocio()) + '</span></div>' +
      '<nav>' + enlaces.join('') + '</nav>' +
      '<span>© ' + new Date().getFullYear() + ' ' + esc(n) + '</span>' +
      // aviso para el negocio: esto es una muestra, no la página final
      '<p class="s-muestra"><b>Página de muestra</b>Esta es una muestra de cómo podría verse la página de ' + esc(n) +
      '. La versión final no quedará exactamente igual: cada cambio que el negocio decida se acordará por mensaje o correo. ' +
      'El precio también varía según lo que el negocio decida incluir. ' +
      esc(AVISO_FOTOS) + ' 185ChangarroWeb no la usará para ningún otro fin que el de presentársela.</p></footer>';

    var scroll = sitio.scrollTop;
    sitio.innerHTML = html;
    sitio.scrollTop = scroll;

    // en computadora las secciones van en 2 columnas: si quedan en número impar, la última ocupa todo el ancho para no dejar hueco
    var mitades = [].slice.call(sitio.querySelectorAll('.s-cuerpo > .s-sec:not(.ancha)'));
    if (mitades.length % 2) mitades[mitades.length - 1].classList.add('completa');

    $('url').textContent = 'https://www.' + dominio();
    $('url-aviso-dom').textContent = 'www.' + dominio();
    $('f-wa').hidden = !on('whatsapp');
    $('f-asis').hidden = !on('asistente');
    if (!on('asistente')) chat.abierto = false;
    pintarChat();
    if (docAbierto === 'terminos' && !on('terminos')) docAbierto = '';
    pintarDoc();
  }

  // ---------- documentos legales: en la muestra van como aviso de que se redactan a la medida del negocio ----------
  var docAbierto = '';

  function docAviso() {
    return '<h3>¿Quién responde por este documento?</h3><p>El contenido lo define y lo aprueba ' + esc(nombre()) +
      ', como responsable de lo que ofrece en su página y de los datos que recibe de sus clientes. ' +
      '185ChangarroWeb lo redacta y lo publica por encargo del negocio, con la información que el negocio le entregue, ' +
      'y no asume responsabilidad legal por lo que el negocio elija, solicite o publique.</p>' +
      '<h3>Antes de publicarlo</h3><p>Le recomendamos que un abogado revise la versión final antes de que la página salga al público.</p>';
  }

  function pintarDoc() {
    var caja = $('s-doc');
    caja.hidden = !docAbierto;
    if (!docAbierto) return;
    var n = esc(nombre());
    var cuerpo = docAbierto === 'privacidad'
      ? '<h2>Aviso de privacidad <span class="s-etq">Por redactar</span></h2>' +
        '<p>Aquí irá el Aviso de Privacidad de la página de <b>' + n + '</b>. Como la página pide datos para agendar un recorrido ' +
        '(nombre, teléfono, fecha y tipo de evento), el aviso dirá qué datos se piden, para qué se usan, con quién se comparten y cómo pedir que se corrijan o se borren.</p>' +
        '<p>La ley lo pide siempre que una página recabe datos personales, así que no se puede quitar.</p>'
      : '<h2>Términos y Condiciones <span class="s-etq">Por redactar</span></h2>' +
        '<p>Aquí irán los Términos y Condiciones de la página de <b>' + n + '</b>: precios de los paquetes, anticipo para apartar la fecha, ' +
        'formas de pago, cancelaciones, cambios de fecha, devoluciones y la mención de Profeco.</p>' +
        '<p>Son opcionales, salvo que la página reciba anticipos o pagos: en ese caso son obligatorios.</p>';
    caja.innerHTML = '<div class="s-doc-barra"><button type="button" class="s-btn suave" data-accion="doc-cerrar">← Volver a la página</button></div>' +
      '<article>' + cuerpo + docAviso() + '</article>';
    caja.scrollTop = 0;
  }

  // ---------- asistente (contesta solo con los datos de la plantilla) ----------
  var PREGUNTAS = [
    { p: '¿Dónde están?', r: function () { return 'Estamos en ' + N.direccion + porConfirmar() + '.'; } },
    { p: '¿Qué días atienden?', r: function () { return 'De lunes a sábado, con cita. Puedes agendar tu recorrido aquí en la página.'; } },
    { p: '¿Qué incluye?', r: function () {
      return 'En las fotos se ve: ' + N.incluye[1].items.join(', ').toLowerCase() + '. Es solo una especulación de las imágenes; lo que entra en la renta te lo confirmamos por WhatsApp.';
    } },
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
    // los avisos largos (como el mensaje de la cotización) duran más en pantalla
    timerAviso = setTimeout(function () { el.hidden = true; }, Math.max(3200, texto.length * 45));
  }

  // baja hasta una sección, dejando libre la barra de arriba
  function irA(id) {
    var destino = sitio.querySelector('[data-funcion="' + id + '"]');
    if (destino) sitio.scrollTo({ top: destino.offsetTop - sitio.querySelector('.s-barra').offsetHeight - 12, behavior: 'smooth' });
  }

  // ---------- visor de fotos: la foto en grande con su descripción y el aviso de uso ilustrativo ----------
  var visor = $('s-visor');
  function abrirFoto(i) {
    i = (i + N.fotos.length) % N.fotos.length;
    var f = N.fotos[i];
    // la que se abrió queda como foto principal
    if (fotoPrincipal !== i) { fotoPrincipal = i; pintarSitio(); }
    visor.innerHTML = '<div class="s-visor-caja" role="dialog" aria-modal="true" aria-label="' + esc(f.titulo) + '">' +
      '<button type="button" class="s-visor-x" data-accion="foto-cerrar" aria-label="Cerrar">×</button>' +
      '<div class="s-visor-img"><img src="' + esc(f.img) + '" alt="' + esc(f.titulo) + '">' + avisoFoto(f) +
      '<button type="button" class="s-visor-nav ant" data-accion="foto" data-i="' + (i - 1) + '" aria-label="Foto anterior">‹</button>' +
      '<button type="button" class="s-visor-nav sig" data-accion="foto" data-i="' + (i + 1) + '" aria-label="Foto siguiente">›</button></div>' +
      '<div class="s-visor-txt"><small>' + (i + 1) + ' de ' + N.fotos.length + '</small><h2>' + esc(f.titulo) + '</h2><p>' + esc(f.texto) + '</p>' +
      '<p class="s-legal-fotos">' + esc(AVISO_FOTOS) + '</p></div></div>';
    visor.hidden = false;
    visor.querySelector('.s-visor-x').focus();
  }
  function cerrarFoto() { visor.hidden = true; visor.innerHTML = ''; }
  // tocar fuera de la foto también cierra
  visor.addEventListener('click', function (e) { if (e.target === visor) cerrarFoto(); });
  document.addEventListener('keydown', function (e) {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrarFoto();
    else if (e.key === 'ArrowLeft') abrirFoto(fotoPrincipal - 1);
    else if (e.key === 'ArrowRight') abrirFoto(fotoPrincipal + 1);
  });

  document.querySelector('.pantalla').addEventListener('click', function (e) {
    var b = e.target.closest('[data-accion]');
    if (!b) return;
    var accion = b.getAttribute('data-accion'), i = Number(b.getAttribute('data-i'));
    if (accion === 'aviso') aviso(b.getAttribute('data-texto'));
    else if (accion === 'ir') irA(b.getAttribute('data-f'));
    else if (accion === 'tipo-evento') {
      agenda.tipo = i;
      pintarSitio();
      if (on('agenda')) { irA('agenda'); aviso('Marcamos "' + N.tiposEvento[i] + '" en tu recorrido. Elige el día y la hora.'); }
    }
    else if (accion === 'cotizar') {
      // la cotización lleva lo que ya se eligió en el calendario y en el recorrido
      var datos = [], faltan = [];
      if (agenda.tipo >= 0) datos.push('para ' + N.tiposMensaje[agenda.tipo]); else faltan.push('tu evento');
      if (agenda.invitados >= 0) datos.push('con ' + N.invitados[agenda.invitados].toLowerCase() + ' invitados'); else faltan.push('los invitados');
      if (cal.fecha) datos.push('el ' + fechaLarga(cal.fecha)); else faltan.push('tu fecha');
      aviso('Aquí se abriría el WhatsApp de ' + nombre() + ' con el mensaje: "Hola, quiero cotizar el paquete ' + N.paquetes[i].nombre +
        (datos.length ? ' ' + datos.join(', ') : '') + '."' +
        (faltan.length ? ' Si eliges ' + faltan.join(', ').replace(/, ([^,]*)$/, ' y $1') + ', se agrega' + (faltan.length > 1 ? 'n' : '') + ' solo' + (faltan.length > 1 ? 's' : '') + '.' : ''));
    }
    else if (accion === 'doc') { docAbierto = b.getAttribute('data-doc'); pintarDoc(); }
    else if (accion === 'doc-cerrar') { docAbierto = ''; pintarDoc(); }
    else if (accion === 'dia') { agenda.dia = i; agenda.hora = -1; pintarSitio(); }
    else if (accion === 'hora' || accion === 'tipo' || accion === 'invitados') { agenda[accion] = i; pintarSitio(); }
    else if (accion === 'mes') { cal.mes += i; pintarSitio(); }
    else if (accion === 'fecha') {
      var hoy = new Date();
      cal.fecha = new Date(hoy.getFullYear(), hoy.getMonth() + cal.mes, i);
      pintarSitio();
    }
    else if (accion === 'recorrido') {
      aviso('Aquí se enviaría la solicitud (' + textoRecorrido().replace('Agendar recorrido ', 'recorrido ') + ', ' + N.tiposEvento[agenda.tipo] +
        (agenda.invitados >= 0 ? ', ' + N.invitados[agenda.invitados].toLowerCase() + ' invitados' : '') +
        '). La página pediría tu nombre y teléfono, y el salón te confirmaría por WhatsApp.');
    }
    else if (accion === 'foto') abrirFoto(i);
    else if (accion === 'foto-cerrar') cerrarFoto();
    else if (accion === 'quitar') {
      var id = b.getAttribute('data-f');
      estado.activas[id] = false;
      if (inputs[id]) inputs[id].checked = false;
      cambio();
      aviso('Se quitó "' + nombreFuncion(id) + '". Puede volver a prenderla en el panel.');
    }
    else if (accion === 'chat-cerrar') { chat.abierto = false; pintarChat(); }
    else if (accion === 'chat-preg') {
      chat.msgs.push({ yo: true, t: PREGUNTAS[i].p }, { yo: false, t: PREGUNTAS[i].r() });
      pintarChat();
    }
  });
  $('s-wa').addEventListener('click', function () { aviso(avisoWhatsapp()); });
  $('s-asis').addEventListener('click', function () {
    chat.abierto = !chat.abierto;
    pintarChat();
  });

  function cambio() {
    aplicarObligatorias();
    guardar();
    pintarCuenta();
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
  var velo = $('velo'), abrirPanel = $('abrir-panel'), seg = $('seg');
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
    var si = D.FUNCIONES.filter(function (f) { return on(f.id); });
    var no = D.FUNCIONES.filter(function (f) { return !on(f.id); });
    return [
      'Hola, 185ChangarroWeb. Revisé la muestra de la página de *' + nombre() + '* y quiero pedir mi cotización:',
      '',
      '*Fecha:* ' + fechaHoy(),
      '',
      '*Quiero en la página:*',
      si.length ? si.map(linea).join('\n') : '- Nada',
      '',
      '*No quiero:*',
      no.length ? no.map(linea).join('\n') : '- Nada',
      '',
      '*Notas:*',
      estado.notas.trim() || 'Sin notas.',
      '',
      'Entiendo que el precio depende de lo que elegí. Quedo al pendiente para la cotización y los siguientes pasos. Gracias.'
    ].join('\n');
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
  // compartir la muestra: el dueño se la manda a sí mismo o a quien decide con él
  $('btn-compartir').addEventListener('click', function () {
    var texto = 'Mira cómo podría verse la página de ' + nombre() + ': ' + location.href;
    window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank', 'noopener');
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
  pintarCuenta();
  pintarSitio();
  ponerVista(estado.vista);
})();
