/* Muestra para cliente: interruptores por plan, vista celular o computadora, y la petición que el negocio manda por WhatsApp.
   El contenido vive en muestra-datos.js y los planes en planes.js; aquí solo se pinta. */
(function () {
  'use strict';

  var D = window.MUESTRA_DATOS;
  var N = D.NEGOCIO;
  var PLANES = (window.PLANES_185 && window.PLANES_185.PLANS) || [];
  var ORDEN = ['esencial', 'negocio', 'pro'];
  // las funciones del catálogo van en su propio grupo, después de los planes
  var GRUPOS = ORDEN.concat('catalogo', 'extras');
  // las 4 páginas de la barra; ruta es lo que se ve en la dirección de la barra del navegador
  var PAGINAS = [
    { id: 'inicio', t: 'Inicio', ruta: '' },
    { id: 'nosotros', t: '¿Quiénes Somos?', ruta: '/quienes-somos' },
    { id: 'catalogo', t: 'Nuestro Catálogo', ruta: '/catalogo' },
    { id: 'contacto', t: 'Contacto', ruta: '/contacto' }
  ];
  // cada copia de la carpeta guarda aparte, para que la muestra de un negocio no herede lo de otro
  var GUARDADO = 'muestra185.v3:' + location.pathname;
  var ANCHO_PC = 1100, ALTO_PC = 680;
  // ventana angosta o muy vertical (un celular): el teléfono va primero y el panel se abre aparte
  var VERTICAL = window.matchMedia('(max-width: 820px), (max-aspect-ratio: 3/4)');

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var pesos = function (n) { return '$' + Number(n).toLocaleString('es-MX'); };
  var plan = function (id) {
    for (var i = 0; i < PLANES.length; i++) if (PLANES[i].id === id) return PLANES[i];
    return { id: id, name: id };
  };

  // pagina: una de PAGINAS; cat: la categoría abierta en el catálogo ('' = todas)
  var estado = { negocio: '', vista: 'celular', notas: '', pagina: 'inicio', cat: '', paq3d: D.EXTRAS.modelos3d.paqueteBase, activas: {} };
  var chat = { abierto: false, msgs: [] };
  D.FUNCIONES.forEach(function (f) { estado.activas[f.id] = f.activa; });

  // localStorage solo para comodidad: si falla, la muestra sigue igual
  try {
    var previo = JSON.parse(localStorage.getItem(GUARDADO) || 'null');
    if (previo) {
      estado.negocio = typeof previo.negocio === 'string' ? previo.negocio : '';
      estado.notas = typeof previo.notas === 'string' ? previo.notas : '';
      estado.vista = previo.vista === 'escritorio' ? 'escritorio' : 'celular';
      if (PAGINAS.some(function (p) { return p.id === previo.pagina; })) estado.pagina = previo.pagina;
      if (N.categorias.some(function (c) { return c.id === previo.cat; })) estado.cat = previo.cat;
      if (D.EXTRAS.modelos3d.paquetes.some(function (q) { return q.n === previo.paq3d; })) estado.paq3d = previo.paq3d;
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
  // AmueblArte ya tiene su dominio (amueblarte.com): es el que se ve en la barra de la muestra
  function dominio() { return N.dominioPropio || slug() + '.com.mx'; }

  // ---------- panel: interruptores agrupados por plan ----------
  var inputs = {}, cuentas = {}, etiquetas = {};
  var grupos = $('grupos'), extrasDet = null;
  GRUPOS.forEach(function (pid, i) {
    var cat = pid === 'catalogo', ext = pid === 'extras';
    var p = cat ? { name: 'Ejemplo de funciones del catálogo' } : ext ? { name: 'Extras cotizables' } : plan(pid);
    // cada plan se pliega para que en el celular no haya que bajar tanto; Esencial empieza abierto
    var g = document.createElement('details');
    g.className = 'grupo';
    g.open = i === 0;
    var precio = ext ? 'Pago único' : cat ? 'Negocio ' + limite('negocio') + ' · Pro ' + limite('pro')
      : p.inst ? pesos(p.inst) + ' + ' + pesos(p.mes) + '/mes' : '';
    g.innerHTML = '<summary class="grupo-cab"><span><b></b><small class="cuenta"></small></span><small></small></summary><div class="toggles"></div>';
    g.querySelector('b').textContent = (i && !cat && !ext ? 'Agrega ' : '') + p.name;
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
      if (f.plan === 'extras') {
        var pre = document.createElement('span');
        pre.className = 'tag tag-precio';
        pre.textContent = f.id === 'ar' ? pesos(D.EXTRAS.ar.precio) : 'Desde ' + pesos(D.EXTRAS.modelos3d.paquetes[0].precio);
        t.appendChild(pre);
      }
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
    if (ext) {
      extrasDet = document.createElement('div');
      extrasDet.className = 'ext';
      g.appendChild(extrasDet);
    }
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

  // ---------- extras cotizables: paquete de modelos 3D y AR (precios en muestra-datos.js, pago único) ----------
  function paqueteElegido() {
    var ps = D.EXTRAS.modelos3d.paquetes;
    for (var i = 0; i < ps.length; i++) if (ps[i].n === estado.paq3d) return ps[i];
    return ps[0];
  }
  // el AR cubre cierto número de modelos; cada modelo de más se suma
  function precioAR() {
    var a = D.EXTRAS.ar;
    return a.precio + Math.max(0, paqueteElegido().n - a.incluyeModelos) * a.modeloExtra;
  }
  function totalExtras() {
    return (on('modelos3d') ? paqueteElegido().precio : 0) + (on('ar') ? precioAR() : 0);
  }
  function lista(items) {
    return '<ul class="ext-inc">' + items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  }

  function pintarExtras() {
    if (!extrasDet) return;
    var m = D.EXTRAS.modelos3d, a = D.EXTRAS.ar, el = paqueteElegido();
    var porModelo = Math.round(el.precio / el.n);
    var extra = Math.max(0, el.n - a.incluyeModelos);
    extrasDet.innerHTML =
      '<div class="ext-bloque' + (on('modelos3d') ? '' : ' apagado') + '">' +
        '<p class="ext-t">Modelos 3D <span>paquete de ' + el.n + (el.n === 1 ? ' modelo' : ' modelos') + '</span></p>' +
        '<div class="ext-paq" role="group" aria-label="Paquete de modelos 3D">' + m.paquetes.map(function (q) {
          return '<button type="button" data-paq="' + q.n + '" aria-pressed="' + (q.n === el.n) + '"><b>' + q.n + '</b><small>' + pesos(q.precio) + '</small></button>';
        }).join('') + '</div>' +
        '<p class="ext-precio"><b>' + pesos(el.precio) + '</b> pago único · unos ' + pesos(porModelo) + ' por modelo' +
        (el.n > 1 ? '. Entre más modelos, más barato sale cada uno.' : '. Es el precio de agregar un modelo suelto.') + '</p>' +
        lista(m.incluye) +
      '</div>' +
      '<div class="ext-bloque' + (on('ar') ? '' : ' apagado') + '">' +
        '<p class="ext-t">Realidad aumentada (AR) <span>se suma a los modelos 3D</span></p>' +
        '<p class="ext-precio"><b>' + pesos(precioAR()) + '</b> pago único · cubre hasta ' + a.incluyeModelos + ' modelos' +
        (extra ? ' (los ' + extra + ' de más suman ' + pesos(extra * a.modeloExtra) + ': ' + pesos(a.modeloExtra) + ' cada uno)' : '; cada modelo extra suma ' + pesos(a.modeloExtra)) + '.</p>' +
        lista(a.incluye) +
      '</div>' +
      (totalExtras() ? '<p class="ext-total">Extras prendidos: <b>' + pesos(totalExtras()) + '</b> pago único. No cuentan como funciones de su plan ni suman a la mensualidad.</p>'
        : '<p class="ext-nota">Prenda un extra para ver cuánto sumaría.</p>');
  }
  if (extrasDet) extrasDet.addEventListener('click', function (e) {
    var b = e.target.closest('[data-paq]');
    if (!b) return;
    estado.paq3d = Number(b.getAttribute('data-paq'));
    cambio();
  });

  function pintarPlan() {
    var p = planSugerido();
    var html = 'Con lo prendido, el plan que lo cubre es <b>' + esc(p.name) + '</b>';
    if (p.inst) html += ': ' + pesos(p.inst) + ' de instalación + ' + pesos(p.mes) + ' al mes';
    html += '.';
    if (on('correo') && p.id !== 'pro') html += ' El correo profesional va con costo extra.';
    var usadas = usadasCatalogo();
    if (usadas) html += ' Las funciones del catálogo prendidas cuentan como ' + usadas + ' de las ' + limite(p.id) + ' que incluye.';
    if (totalExtras()) html += ' Los extras cotizables prendidos suman ' + pesos(totalExtras()) + ' de pago único.';
    $('plan-sugerido').innerHTML = html;
    pintarExtras();
    GRUPOS.forEach(function (pid) {
      var del = D.FUNCIONES.filter(function (f) { return f.plan === pid; });
      var prendidas = del.filter(function (f) { return on(f.id); }).length;
      cuentas[pid].textContent = prendidas + ' de ' + del.length + ' prendidas' + (pid === 'catalogo' && usadas ? ' · cuentan como ' + usadas : '');
    });
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

  // ---------- una sola ubicación, catálogo y lista de cotización ----------
  var sitio = $('sitio');
  var suc = function () { return N.sucursales[0]; };
  // lista de cotización: { id, n, acab }. Vive solo mientras la muestra está abierta.
  var cotiza = [];
  var busqueda = '';

  function plano(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function productoPor(id) {
    for (var i = 0; i < N.productos.length; i++) if (N.productos[i].id === id) return N.productos[i];
    return null;
  }
  function categoriaPor(id) {
    for (var i = 0; i < N.categorias.length; i++) if (N.categorias[i].id === id) return N.categorias[i];
    return null;
  }
  function deCategoria(cid) { return N.productos.filter(function (p) { return p.cats.indexOf(cid) >= 0; }); }
  function enLista(id) {
    for (var i = 0; i < cotiza.length; i++) if (cotiza[i].id === id) return cotiza[i];
    return null;
  }
  function totalLista() { return cotiza.reduce(function (n, c) { return n + c.n; }, 0); }
  function agregar(id, acab) {
    var c = enLista(id);
    if (c) { c.n++; if (acab) c.acab = acab; } else cotiza.push({ id: id, n: 1, acab: acab || '' });
  }
  // datos opcionales del cliente final: solo van en el mensaje de WhatsApp, no se guardan
  var cotDatos = { quien: '', coment: '' };
  // la lista se recuerda en este navegador para no perderla si se cierra la muestra; solo comodidad, si falla no pasa nada
  var GUARDADO_COT = GUARDADO + ':cotizacion';
  try {
    var guardada = JSON.parse(localStorage.getItem(GUARDADO_COT) || 'null');
    if (guardada && Array.isArray(guardada.lista)) {
      cotiza = guardada.lista.filter(function (c) { return c && productoPor(c.id) && c.n > 0; })
        .map(function (c) { return { id: c.id, n: Math.min(999, Math.floor(c.n)), acab: String(c.acab || '').slice(0, 200) }; });
      if (guardada.datos) {
        cotDatos.quien = String(guardada.datos.quien || '').slice(0, 80);
        cotDatos.coment = String(guardada.datos.coment || '').slice(0, 300);
      }
    }
  } catch (e) {}
  function guardarCot() {
    try { localStorage.setItem(GUARDADO_COT, JSON.stringify({ lista: cotiza, datos: cotDatos })); } catch (e) {}
  }
  function textoCotizacion() {
    return 'Hola, ' + nombre() + '. Quiero cotizar:\n' + cotiza.map(function (c) {
      return '- ' + c.n + ' × ' + productoPor(c.id).nombre + (c.acab ? ' (' + c.acab + ')' : '');
    }).join('\n') + (cotDatos.coment.trim() ? '\nComentarios: ' + cotDatos.coment.trim() : '') +
      '\nQuedo al pendiente. Gracias.' + (cotDatos.quien.trim() ? '\n' + cotDatos.quien.trim() : '');
  }
  function telefonos() { return suc().telefonos.join(' y '); }
  function mensajeWhatsapp() { return cotiza.length ? textoCotizacion() : N.mensajeWhatsapp; }
  function avisoWhatsapp() {
    return 'Aquí se abriría el WhatsApp del negocio con el mensaje: "' + mensajeWhatsapp().replace(/\n/g, ' ') + '"';
  }

  function irPagina(id, cat) {
    estado.pagina = id;
    estado.cat = cat || '';
    busqueda = '';
    guardar();
    pintarSitio();
    sitio.scrollTop = 0;
  }

  // ---------- sitio de prueba ----------
  // cada sección trae su × para quitarla desde la misma muestra (igual que apagarla en el panel)
  function quitar(id) {
    return '<button type="button" class="s-quitar" data-accion="quitar" data-f="' + id + '" aria-label="Quitar ' + esc(nombreFuncion(id)) + '">×</button>';
  }
  function seccion(id, titulo, cuerpo, clase) {
    return '<section class="s-sec' + (clase ? ' ' + clase : '') + '" data-funcion="' + id + '">' + quitar(id) +
      '<h3>' + esc(titulo) + '</h3>' + cuerpo + '</section>';
  }
  function botonAviso(texto, aviso, clase) {
    return '<button type="button" class="s-btn' + (clase ? ' ' + clase : '') + '" data-accion="aviso" data-texto="' + esc(aviso) + '">' + esc(texto) + '</button>';
  }

  // barra fija: logo (lleva al inicio), lista de cotización y el menú de las 4 páginas
  function cabecera() {
    var n = totalLista();
    return '<header class="s-barra"><div class="s-barra-fila">' +
      '<button type="button" class="s-logo-btn" data-accion="pagina" data-p="inicio" aria-label="' + esc(nombre()) + ': ir al inicio">' +
      (N.logo ? '<img class="s-logo-img" src="' + esc(N.logo) + '" alt="' + esc(nombre()) + '">' : '<span class="s-logo">' + esc(nombre()) + '</span>') + '</button>' +
      (on('whatsapp') ? '<button type="button" class="s-cot-btn" data-accion="doc" data-doc="cotizacion" aria-label="Mi cotización' + (n ? ', ' + n + ' en la lista' : '') + '">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8l3 3v13H5V4h3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 11h6M9 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
        '<span class="s-cot-txt">Mi cotización</span>' + (n ? '<b>' + n + '</b>' : '') + '</button>' : '') +
      '</div><nav class="s-nav" aria-label="Menú principal">' + PAGINAS.map(function (p) {
        return '<button type="button" data-accion="pagina" data-p="' + p.id + '"' + (p.id === estado.pagina ? ' aria-current="page"' : '') + '>' + esc(p.t) + '</button>';
      }).join('') + '</nav></header>';
  }

  // ---------- catálogo: tarjetas de categoría y de mueble ----------
  function tile(c) {
    var n = deCategoria(c.id).length, foto = on('galeria');
    return '<button type="button" class="s-catt' + (foto ? '' : ' sin-foto') + '" data-accion="cat" data-id="' + c.id + '">' +
      (foto ? '<img src="' + esc(c.img) + '" alt="" loading="lazy">' : '') +
      '<span><b>' + esc(c.nombre) + '</b><small>' + n + (n === 1 ? ' mueble' : ' muebles') + '</small></span></button>';
  }

  // la etiqueta dice AR solo si el extra de realidad aumentada está prendido
  function etiqueta3d() { return on('ar') ? '3D · AR' : '3D'; }

  function tarjeta(p) {
    var foto = on('galeria'), en3d = on('modelos3d') && p.modelo, dentro = !!enLista(p.id);
    return '<article class="s-prod' + (foto ? '' : ' sin-foto') + '">' +
      (foto ? '<button type="button" class="s-prod-foto' + (p.contener ? ' contener' : '') + '" data-accion="producto" data-id="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '">' +
        '<img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy">' + (en3d ? '<span class="s-3d">' + etiqueta3d() + '</span>' : on('modelos3d') ? '<span class="s-3d pedido">3D bajo pedido</span>' : '') + '</button>' : '') +
      '<div class="s-prod-txt"><b>' + esc(p.nombre) + '</b><span>' + esc(p.desc) + '</span><div class="s-prod-acc">' +
      '<button type="button" class="s-btn suave" data-accion="producto" data-id="' + p.id + '"' + (en3d ? ' data-modo="3d"' : '') + '>' + (en3d ? 'Ver en 3D' : 'Ver') + '</button>' +
      (on('whatsapp') ? '<button type="button" class="s-btn' + (dentro ? ' dentro' : '') + '" data-accion="cotizar" data-id="' + p.id + '" aria-pressed="' + dentro + '">' + (dentro ? '✓ En mi lista' : '+ Cotizar') + '</button>' : '') +
      '</div></div></article>';
  }

  // lo que va debajo de la búsqueda: resultados, una categoría con su galería, o todas las categorías
  function contenidoCatalogo() {
    var q = plano(busqueda).trim();
    if (q) {
      var palabras = q.split(/\s+/);
      var hallados = N.productos.filter(function (p) {
        var texto = plano(p.nombre + ' ' + p.desc + ' ' + p.cats.map(function (c) { return categoriaPor(c).nombre; }).join(' '));
        return palabras.every(function (w) { return texto.indexOf(w) >= 0; });
      });
      return '<p class="s-nota s-res-n">' + (hallados.length
        ? hallados.length + (hallados.length === 1 ? ' mueble encontrado' : ' muebles encontrados')
        : 'No encontramos muebles con esa búsqueda. Prueba con otra palabra o escríbenos.') + '</p>' +
        (hallados.length ? '<div class="s-grid">' + hallados.map(tarjeta).join('') + '</div>' : '');
    }
    var c = categoriaPor(estado.cat);
    if (c) {
      return '<div class="s-cat-cab">' + (on('buscador') ? '' : '<button type="button" class="s-volver" data-accion="cat" data-id="">← Categorías</button>') +
        '<h4>' + esc(c.nombre) + '</h4><p>' + esc(c.texto) + '</p>' + (c.aviso ? '<p class="s-aviso-muestra">' + esc(c.aviso) + '</p>' : '') + '</div><div class="s-grid">' + deCategoria(c.id).map(tarjeta).join('') + '</div>';
    }
    return '<div class="s-catgrid">' + N.categorias.map(tile).join('') + '</div>';
  }

  function paginaCatalogo() {
    var cuerpo = '';
    if (on('buscador')) {
      cuerpo += '<label class="s-busca"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
        '<input type="search" data-accion="buscar" placeholder="Buscar un mueble: mesa, silla, base…" value="' + esc(busqueda) + '" aria-label="Buscar un mueble" autocomplete="off"></label>' +
        '<div class="s-chips" role="group" aria-label="Categorías"><button type="button" class="s-chip" data-accion="cat" data-id="" aria-pressed="' + (!estado.cat) + '">Todas</button>' +
        N.categorias.map(function (c) {
          return '<button type="button" class="s-chip" data-accion="cat" data-id="' + c.id + '" aria-pressed="' + (estado.cat === c.id) + '">' + esc(c.nombre) + '</button>';
        }).join('') + '</div>';
    }
    cuerpo += '<div class="s-res" id="s-res">' + contenidoCatalogo() + '</div>' +
      (on('whatsapp') ? '<p class="s-aviso-muestra">Los precios se cotizan según el modelo, el acabado y la cantidad: agrega lo que te interese con <b>+ Cotizar</b> y pide tu cotización por WhatsApp. ' + esc(N.leyendaPrecios) + '</p>' : '');
    return [seccion('productos', 'Nuestro Catálogo', cuerpo, 'ancha s-catalogo')];
  }

  // ---------- páginas ----------
  function faqHtml() {
    return '<div class="s-faq">' + N.faq.filter(function (q) { return !q.funcion || on(q.funcion); }).map(function (q) {
      return '<details><summary>' + esc(q.p) + '</summary><p>' + esc(q.r.replace('{direccion}', suc().direccion)) + '</p></details>';
    }).join('') + '</div>' +
      '<p class="s-aviso-muestra"><span class="s-etq">Ejemplo</span> Estas respuestas son de ejemplo: el negocio las confirma o las cambia antes de publicar.</p>';
  }

  function seccionResenas() {
    return seccion('resenas', 'Lo que dicen nuestros clientes', N.resenas.map(function (r) {
      return '<div class="s-resena"><small><span class="s-estrellas" aria-label="' + r.estrellas + ' de 5 estrellas">' +
        '★★★★★'.slice(0, r.estrellas) + '☆☆☆☆☆'.slice(0, 5 - r.estrellas) + '</span>' + esc(r.autor) +
        ' <span class="s-etq">Ejemplo</span></small><p>' + esc(r.texto) + '</p></div>';
    }).join('') +
      '<p class="s-aviso-muestra">Estas reseñas son de ejemplo. En la página final van reseñas reales de sus clientes, publicadas por el negocio.</p>');
  }

  function paginaInicio() {
    var partes = [];
    partes.push('<section class="s-hero"><div class="s-hero-txt"><span class="s-hero-desde">Fabricantes desde ' + N.desde + '</span>' +
      '<h2>' + esc(N.lema) + '</h2>' +
      '<p>' + esc(N.portada.texto) + '</p>' +
      '<div class="s-hero-botones">' +
      (on('productos') ? '<button type="button" class="s-btn claro" data-accion="pagina" data-p="catalogo">Ver catálogo</button>' : '') +
      (on('modelos3d') ? '<button type="button" class="s-btn fantasma" data-accion="producto" data-id="' + N.portada.destacado3d + '" data-modo="3d">Míralo en 3D</button>' : '') +
      (on('whatsapp') ? '<button type="button" class="s-btn s-btn-wa" data-accion="aviso" data-texto="' + esc(avisoWhatsapp()) + '">Cotizar por WhatsApp</button>' : '') +
      '</div></div>' +
      (on('galeria') ? '<img class="s-hero-foto" src="' + esc(N.portada.foto) + '" alt="' + esc(N.portada.fotoAlt) + '">' : '') + '</section>');

    var anios = new Date().getFullYear() - N.desde;
    partes.push('<section class="s-sec ancha s-ventajas"><div class="s-vent-grid">' + N.ventajas.map(function (v) {
      return '<div><b>' + esc(v.t.replace('{anios}', anios)) + '</b><span>' + esc(v.d) + '</span></div>';
    }).join('') + '</div></section>');

    if (on('modelos3d')) {
      partes.push(seccion('modelos3d', on('ar') ? 'Míralo en tu local antes de comprar' : 'Míralo en 3D antes de comprar',
        '<p class="s-dir">Gira el mueble en 3D, mira sus medidas y cámbiale el color' + (on('ar') ? ' y, desde tu celular, colócalo en tu espacio con la cámara, a tamaño real.' : '.') + '</p>' +
        '<div class="s-mini">' + N.productos.filter(function (p) { return p.modelo; }).map(function (p) {
          return '<button type="button" class="s-mini-btn" data-accion="producto" data-id="' + p.id + '" data-modo="3d">' +
            (on('galeria') ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : '') + '<span>' + esc(p.nombre) + '</span><em>' + etiqueta3d() + '</em></button>';
        }).join('') + '</div>' +
        '<p class="s-nota">Modelos de demostración. Los del negocio se hacen con sus muebles y medidas reales.' + (on('ar') ? ' La realidad aumentada es solo una idea: se aplica en la página oficial si el negocio la contrata.' : '') + '</p>', 'ancha'));
    }

    if (on('productos')) {
      partes.push(seccion('productos', 'Nuestro catálogo', '<div class="s-catgrid">' + N.categorias.map(tile).join('') + '</div>', 'ancha'));
    }
    if (on('whatsapp') && on('productos')) {
      partes.push(seccion('whatsapp', 'Cotiza en 3 pasos', '<ol class="s-pasos">' + N.pasos.map(function (p, i) {
        return '<li><i>' + (i + 1) + '</i><div><b>' + esc(p.t) + '</b><span>' + esc(p.d) + '</span></div></li>';
      }).join('') + '</ol><div class="s-acciones"><button type="button" class="s-btn" data-accion="pagina" data-p="catalogo">Empezar mi cotización</button></div>', 'ancha'));
    }
    if (on('resenas')) partes.push(seccionResenas());
    if (on('faq')) partes.push(seccion('faq', 'Preguntas frecuentes', faqHtml()));
    return partes;
  }

  function paginaNosotros() {
    var s = suc();
    var partes = [];
    partes.push('<section class="s-sec ancha s-nosotros"><h3>¿Quiénes somos?</h3>' +
      '<p class="s-lema">Fabricantes desde ' + N.desde + '</p>' +
      '<p>' + esc(nombre()) + ' ' + esc(N.nosotros.texto) + ' <i>«' + esc(N.lema) + '.»</i></p>' +
      '<div class="s-datos"><div><b>' + N.desde + '</b><span>Fabricando muebles</span></div><div><b>' + esc(N.nosotros.ciudad) + '</b><span>' + esc(s.zona) + '</span></div></div>' +
      '<p class="s-aviso-muestra"><span class="s-etq">Ejemplo</span> ' + esc(N.nosotros.aviso) + '</p></section>');
    partes.push('<section class="s-sec ancha"><h3>Cómo trabajamos</h3><ol class="s-pasos">' + N.proceso.map(function (p, i) {
      return '<li><i>' + (i + 1) + '</i><div><b>' + esc(p.t) + '</b><span>' + esc(p.d) + '</span></div></li>';
    }).join('') + '</ol><p class="s-aviso-muestra"><span class="s-etq">Ejemplo</span> Los pasos se confirman con el negocio antes de publicar.</p></section>');
    if (on('galeria') && N.trabajos.length) {
      partes.push('<section class="s-sec ancha"><h3>Nuestros muebles en servicio</h3><div class="s-mini">' + N.trabajos.map(function (t) {
        return '<button type="button" class="s-mini-btn" data-accion="producto" data-id="' + t.id + '"><img src="' + esc(t.img) + '" alt="" loading="lazy"><span>' + esc(t.t) + '</span></button>';
      }).join('') + '</div></section>');
    }
    partes.push('<section class="s-sec ancha"><h3>Acabados a tu gusto</h3><p class="s-dir">Elige el color del tapiz, de la cubierta y de la base.</p>' +
      [['tapiz', 'Tapiz'], ['cubierta', 'Cubierta'], ['base', 'Base']].map(function (g) {
        return '<div class="s-acab"><span>' + g[1] + '</span><div>' + N.PALETAS[g[0]].map(function (c) {
          return '<i style="background:' + c.c + '" title="' + esc(c.n) + '" aria-label="' + esc(g[1] + ' ' + c.n) + '"></i>';
        }).join('') + '</div></div>';
      }).join('') + '<p class="s-aviso-muestra"><span class="s-etq">Ejemplo</span> Son colores de ejemplo. Los acabados reales los da el negocio.</p></section>');
    if (on('productos')) {
      partes.push(seccion('productos', 'Lo que fabricamos', '<ul class="s-lista s-fab">' + N.categorias.map(function (c) {
        return '<li><button type="button" class="s-enlace" data-accion="cat" data-id="' + c.id + '">' + esc(c.nombre) + '</button><span>' + esc(c.texto) + '</span></li>';
      }).join('') + '</ul>'));
    }
    if (on('resenas')) partes.push(seccionResenas());
    return partes;
  }

  function paginaContacto() {
    var s = suc(), partes = [];
    // datos del negocio (siempre van)
    partes.push('<section class="s-sec"><h3>Contáctanos</h3><ul class="s-lista s-contactos">' +
      s.telefonos.map(function (t) {
        return '<li><span>Teléfono</span><button type="button" class="s-enlace" data-accion="aviso" data-texto="' + esc('Aquí se marcaría el ' + t + '.') + '">' + esc(t) + '</button></li>';
      }).join('') +
      correosHtml().map(function (c) {
        return '<li><span>Correo</span><button type="button" class="s-enlace" data-accion="aviso" data-texto="' + esc('Aquí se abriría tu correo para escribir a ' + c + '.') + '">' + esc(c) + '</button></li>';
      }).join('') +
      (N.facebook ? '<li><span>Facebook</span><a class="s-enlace" href="' + esc(N.facebook) + '" target="_blank" rel="noopener">AmueblArte en Facebook</a></li>' : '') +
      '<li><span>Dirección</span><b>' + esc(s.direccion) + '</b></li></ul></section>');

    if (on('whatsapp')) {
      var n = totalLista();
      partes.push(seccion('whatsapp', '¿Quieres cotizar?',
        '<p class="s-dir">' + (n ? 'Tienes ' + n + (n === 1 ? ' mueble' : ' muebles') + ' en tu lista. Envíala y te respondemos con la cotización.' : 'Elige tus muebles en el catálogo y envíanos tu lista, o escríbenos directo por WhatsApp.') + '</p>' +
        '<div class="s-acciones">' + (n ? '<button type="button" class="s-btn" data-accion="doc" data-doc="cotizacion">Ver mi cotización (' + n + ')</button>' : '<button type="button" class="s-btn" data-accion="pagina" data-p="catalogo">Ir al catálogo</button>') +
        '<button type="button" class="s-btn s-btn-wa" data-accion="aviso" data-texto="' + esc(avisoWhatsapp()) + '">WhatsApp</button></div>'));
    }
    if (on('ubicacion')) {
      partes.push(seccion('ubicacion', 'Dónde estamos', '<p class="s-dir">' + esc(s.direccion) + '</p>' +
        (s.mapa ? '<img class="s-mapa-img" src="' + esc(s.mapa) + '" alt="Mapa de ' + esc(nombre()) + '" loading="lazy">'
          : '<div class="s-mapa" aria-hidden="true"><span>Mapa de ejemplo</span></div>') +
        botonAviso('Ver en Google Maps', 'Aquí se abriría la ficha de ' + nombre() + ' en Google Maps.')));
    }
    if (on('google')) {
      partes.push(seccion('google', '¿Te gustó?', '<p class="s-dir">Tu opinión nos ayuda mucho.</p>' +
        botonAviso('Califícanos en Google', 'Aquí se abriría la ficha de ' + nombre() + ' en Google Maps para dejar una reseña.', 'suave')));
    }
    if (on('faq')) partes.push(seccion('faq', 'Preguntas frecuentes', faqHtml()));
    if (on('qr')) {
      partes.push(seccion('qr', 'Comparte nuestra página', N.qr
        ? '<div class="s-qr"><img class="s-qr-real" src="' + esc(N.qr) + '" alt="Código QR de esta muestra" loading="lazy"><p>Escanéalo para abrir esta muestra en tu celular.</p></div>'
        : '<div class="s-qr"><div class="s-qr-img" aria-hidden="true">' + qrFalso() + '</div><p>Este QR va impreso en el mostrador, volantes y tarjetas. <span class="s-etq">QR de ejemplo</span></p></div>'));
    }
    return partes;
  }

  function correosHtml() { return on('correo') ? ['contacto@' + dominio()] : suc().correos; }

  function pintarSitio() {
    var n = nombre(), s = suc();
    var partes = estado.pagina === 'nosotros' ? paginaNosotros() : estado.pagina === 'catalogo' ? paginaCatalogo()
      : estado.pagina === 'contacto' ? paginaContacto() : paginaInicio();

    var html = cabecera();
    html += partes.length ? '<div class="s-cuerpo">' + partes.join('') + '</div>'
      : '<div class="s-cuerpo"><div class="s-vacio">Prende una función para verla aquí.</div></div>';

    // pie: quién vende y cómo contactarlo va siempre (Ley Federal de Protección al Consumidor, art. 76 bis)
    var enlaces = [];
    if (on('privacidad')) enlaces.push('<button type="button" data-accion="doc" data-doc="privacidad">Aviso de privacidad</button>');
    if (N.facebook) enlaces.push('<a href="' + esc(N.facebook) + '" target="_blank" rel="noopener">Facebook</a>');
    if (on('terminos')) enlaces.push('<button type="button" data-accion="doc" data-doc="terminos">Términos y Condiciones</button>');
    html += '<footer class="s-pie"><div class="s-contacto"><b>' + esc(n) + '</b><span>' + esc(s.direccion) + '</span>' +
      '<span>Tel. ' + esc(telefonos()) + '</span><span>' + esc(correosHtml().join(' · ')) + '</span></div>' +
      (enlaces.length ? '<nav>' + enlaces.join('') + '</nav>' : '') +
      '<span>© ' + new Date().getFullYear() + ' ' + esc(n) + '</span>' +
      // aviso para el negocio: esto es una muestra, no la página final
      '<p class="s-muestra"><b>Página de muestra</b>Esta es una muestra de cómo podría verse la página de ' + esc(n) +
      '. La versión final no quedará exactamente igual: cada cambio que el negocio decida se acordará por mensaje o correo. ' +
      'Las fotos vienen de su página actual' + (on('modelos3d') ? ' y los modelos 3D son de demostración' : '') + '. ' + (on('ar') ? 'La realidad aumentada es solo una idea: se aplica en la página oficial si el negocio la contrata. ' : '') +
      'Si el negocio decide no contratar el servicio, 185ChangarroWeb eliminará esta muestra y no la usará para ningún otro fin ' +
      'que el de presentársela.</p></footer>';

    guardarCot();
    var scroll = sitio.scrollTop;
    sitio.innerHTML = html;
    sitio.scrollTop = scroll;

    // en computadora las secciones van en 2 columnas: si quedan en número impar, la última ocupa todo el ancho para no dejar hueco
    var mitades = [].slice.call(sitio.querySelectorAll('.s-cuerpo > .s-sec:not(.ancha)'));
    if (mitades.length % 2) mitades[mitades.length - 1].classList.add('completa');

    var pag = PAGINAS.filter(function (p) { return p.id === estado.pagina; })[0];
    $('url').textContent = 'https://www.' + dominio() + pag.ruta + (estado.pagina === 'catalogo' && estado.cat ? '/' + estado.cat : '');
    $('url-aviso-dom').textContent = 'www.' + dominio();
    sitio.setAttribute('lang', 'es-MX');
    $('f-wa').hidden = !on('whatsapp');
    $('s-wa-txt').textContent = 'Escríbenos';
    $('f-asis').hidden = !on('asistente');
    if (!on('asistente')) chat.abierto = false;
    pintarChat();
    if (docAbierto && docAbierto !== 'cotizacion' && !on(docAbierto)) docAbierto = '';
    if (docAbierto === 'cotizacion' && !on('whatsapp')) docAbierto = '';
    pintarDoc(true);
  }

  // ---------- documentos legales y lista de cotización: cubren la pantalla como si fueran otra página ----------
  var docAbierto = '';

  // lo que el negocio necesita saber antes de que se redacte cualquiera de los dos documentos
  function docAviso() {
    var n = esc(nombre());
    return '<h3>¿Quién responde por este documento?</h3><p>El contenido lo define y lo aprueba ' + n +
      ', como responsable de lo que ofrece en su página y de los datos que recibe de sus clientes. ' +
      '185ChangarroWeb lo redacta y lo publica por encargo del negocio, con la información que el negocio le entregue, ' +
      'y no asume responsabilidad legal por lo que el negocio elija, solicite o publique.</p>' +
      '<h3>Antes de publicarlo</h3><p>Le recomendamos que un abogado revise la versión final antes de que la página salga al público.</p>';
  }

  // ejemplos armados con lo que está prendido: no son asesoría legal, un abogado debe revisarlos
  function docPrivacidad() {
    var n = esc(nombre());
    var datos = [], usos = [], terceros = ['WhatsApp (Meta), solo cuando tú decides enviar el mensaje.'];
    if (on('whatsapp')) {
      datos.push('Tu nombre o el de tu negocio y tus comentarios, si los escribes en tu lista de cotización (son opcionales).');
      datos.push('Los muebles que elijas y sus cantidades.');
      usos.push('Responderte con la cotización que pediste.');
    }
    if (on('asistente')) datos.push('Las preguntas que le haces al asistente de la página. No se guardan.');
    if (on('pedidos')) {
      datos.push('Los datos de tu pedido. El pago se hace en la página del proveedor de pagos: ' + n + ' no ve ni guarda los datos de tu tarjeta.');
      usos.push('Apartar y entregar tu pedido.');
      terceros.push('El proveedor de pagos externo, para cobrar tu anticipo.');
    }
    if (on('reporte')) {
      datos.push('Datos de uso de la página, como visitas y clics, sin tu nombre.');
      usos.push('Saber qué partes de la página se usan más.');
    }
    if (!datos.length) { datos.push('Esta página no te pide datos personales.'); usos.push('No aplica.'); }
    var li = function (a) { return '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
    return '<h2>Aviso de privacidad <span class="s-etq">Ejemplo</span></h2>' +
      '<p class="s-doc-fecha">Texto de ejemplo armado con las funciones prendidas en la muestra. No es asesoría legal.</p>' +
      '<h3>¿Quién es el responsable?</h3><p><b>' + esc(N.titular) + '</b>, con nombre comercial <b>' + n + '</b>, domicilio en ' + esc(suc().direccion) + '.</p>' +
      '<h3>¿Qué datos se piden?</h3>' + li(datos) +
      '<h3>¿Para qué se usan?</h3>' + li(usos) +
      '<h3>¿Con quién se comparten?</h3>' + li(terceros) +
      '<h3>¿Cómo ver, corregir o borrar tus datos?</h3><p>Escribe a <b>' + esc(N.correoDatos) + '</b> y dinos qué quieres hacer. Puedes pedir en cualquier momento que se corrijan o se borren, o dejar de recibir mensajes.</p>' +
      '<h3>Cambios a este aviso</h3><p>Si cambia, se publicará en esta misma página.</p>' + docAviso();
  }

  function docTerminos() {
    var n = esc(nombre()), T = N.terminos;
    return '<h2>Términos y Condiciones <span class="s-etq">Ejemplo</span></h2>' +
      '<p class="s-doc-fecha">Texto de ejemplo con los datos de la muestra. Falta lo que el negocio decida. No es asesoría legal.</p>' +
      '<h3>Precios</h3><p>Los precios de ' + n + ' se cotizan según el modelo, el acabado y la cantidad. ' + esc(N.leyendaPrecios) + '</p>' +
      '<h3>Formas de pago</h3><p>' + esc(T.pagos) + '</p>' +
      (on('pedidos') ? '<h3>Anticipo</h3><p>Se pide un anticipo de ' + N.anticipo + '% del total. ' + esc(T.anticipo) + '</p>' : '') +
      '<h3>Cancelaciones</h3><p>' + esc(T.cancelacion) + '</p>' +
      '<h3>Devoluciones</h3><p>' + esc(T.devoluciones) + '</p>' +
      '<h3>Quejas</h3><p>Si tienes una queja, escríbenos a ' + esc(N.correoDatos) + '. También puedes acudir a la Procuraduría Federal del Consumidor (Profeco).</p>' +
      '<p>Son opcionales, salvo que la página reciba pedidos o pagos: en ese caso son obligatorios.</p>' + docAviso();
  }

  function docCotizacion() {
    if (!cotiza.length) {
      return '<h2>Mi cotización</h2><p>Tu lista está vacía. Agrega muebles con el botón <b>+ Cotizar</b> en el catálogo.</p>' +
        '<p><button type="button" class="s-btn" data-accion="pagina" data-p="catalogo">Ir al catálogo</button></p>';
    }
    return '<h2>Mi cotización</h2><p class="s-doc-fecha">Revisa tu lista y envíala por WhatsApp. Te respondemos con los precios.</p>' +
      '<ul class="s-cot-lista">' + cotiza.map(function (c) {
        var p = productoPor(c.id);
        return '<li>' + (on('galeria') ? '<img src="' + esc(p.img) + '" alt="">' : '') +
          '<div><b>' + esc(p.nombre) + '</b>' + (c.acab ? '<small>' + esc(c.acab) + '</small>' : '') + '</div>' +
          '<div class="s-cant"><button type="button" data-accion="cant" data-id="' + c.id + '" data-d="-1" aria-label="Quitar uno">−</button><b>' + c.n +
          '</b><button type="button" data-accion="cant" data-id="' + c.id + '" data-d="1" aria-label="Agregar uno">+</button></div></li>';
      }).join('') + '</ul>' +
      '<div class="s-cot-campos"><label>Tu nombre o negocio (opcional)<input type="text" data-accion="cot-campo" data-k="quien" maxlength="80" autocomplete="off" value="' + esc(cotDatos.quien) + '"></label>' +
      '<label>Comentarios (opcional)<textarea rows="2" data-accion="cot-campo" data-k="coment" maxlength="300" placeholder="Medidas, colores, fecha que lo necesitas…">' + esc(cotDatos.coment) + '</textarea></label></div>' +
      '<h3>Mensaje que se enviará</h3><pre class="s-cot-msg">' + esc(textoCotizacion()) + '</pre>' +
      (on('pedidos') ? '<p class="s-aviso-muestra"><b>Apartar con anticipo.</b> Cuando aceptes la cotización, apartas tu pedido con un anticipo de ' + N.anticipo + '% por una liga de pago externa. ' + esc(N.terminos.pagos) + '</p>' : '') +
      '<div class="s-acciones"><button type="button" class="s-btn s-btn-wa" data-accion="cot-enviar">Enviar por WhatsApp</button>' +
      (on('pedidos') ? '<button type="button" class="s-btn" data-accion="aviso" data-texto="Aquí se abriría la liga de pago del anticipo, en la página del proveedor de pagos.">Pagar anticipo</button>' : '') +
      '<button type="button" class="s-btn suave" data-accion="cot-vaciar">Vaciar lista</button></div>';
  }

  // conservar: si ya estaba abierto el mismo documento, no regresa arriba (por ejemplo, al cambiar una cantidad)
  function pintarDoc(conservar) {
    var caja = $('s-doc');
    caja.hidden = !docAbierto;
    if (!docAbierto) return;
    var arriba = caja.scrollTop;
    caja.innerHTML = '<div class="s-doc-barra"><button type="button" class="s-btn suave" data-accion="doc-cerrar">← Volver a la página</button></div>' +
      '<article>' + (docAbierto === 'privacidad' ? docPrivacidad() : docAbierto === 'terminos' ? docTerminos() : docCotizacion()) + '</article>';
    caja.scrollTop = conservar ? arriba : 0;
  }

  // ---------- asistente (contesta solo con los datos de la plantilla) ----------
  var PREGUNTAS = [
    { p: '¿Qué venden?', r: function () {
      return 'Tenemos ' + N.categorias.map(function (c) { return c.nombre; }).join(', ') + '. Míralos en Nuestro Catálogo.';
    } },
    { p: '¿Cómo pido una cotización?', r: function () {
      return 'Agrega los muebles con el botón "+ Cotizar", revisa tu lista en "Mi cotización" y envíala por WhatsApp.';
    } },
    { funcion: 'modelos3d', p: '¿Puedo verlos en 3D?', r: function () {
      return on('ar')
        ? 'Sí: los muebles con la etiqueta "3D · AR" se giran en 3D y, desde tu celular, se colocan en tu espacio con la cámara.'
        : 'Sí: los muebles con la etiqueta "3D" se giran con el dedo, muestran sus medidas y puedes probar colores.';
    } },
    { p: '¿Dónde están?', r: function () { return 'Estamos en ' + suc().direccion + '.'; } },
    { p: 'Otra pregunta', r: function () { return 'Eso mejor pregúntalo por WhatsApp y te contestamos en persona.'; } }
  ];
  function preguntas() { return PREGUNTAS.filter(function (q) { return !q.funcion || on(q.funcion); }); }

  function pintarChat() {
    var caja = $('s-chat');
    $('s-asis').setAttribute('aria-expanded', String(chat.abierto));
    caja.hidden = !chat.abierto;
    if (!chat.abierto) return;
    var msgs = [{ yo: false, t: 'Hola, soy el asistente de ' + nombre() + '. ¿En qué te ayudo?' }].concat(chat.msgs);
    caja.innerHTML = '<header><span>Asistente</span><button type="button" data-accion="chat-cerrar" aria-label="Cerrar asistente">×</button></header>' +
      '<div class="s-chat-msgs">' + msgs.map(function (m) {
        return '<div class="s-msg ' + (m.yo ? 'yo' : 'bot') + '">' + esc(m.t) + '</div>';
      }).join('') + '</div><div class="s-chat-preg">' + preguntas().map(function (q, i) {
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

  // ---------- visor de un mueble: foto o 3D, con colores y medidas ----------
  var visor = $('s-visor');
  // sel[id][material] = posición del color elegido en su paleta
  var vis = { id: '', modo: 'foto', sel: {} };
  var MV_URL = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.3.1/dist/model-viewer.min.js';
  var mvPedido = false;

  // sRGB '#rrggbb' → color lineal [r, g, b, 1], que es lo que pide glTF
  function lineal(hex) {
    return [1, 3, 5].map(function (i) {
      var c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }).concat(1);
  }
  function colorElegido(p, o) { return N.PALETAS[o.paleta][vis.sel[p.id][o.mat]]; }
  function acabadoTexto(p) {
    return p.modelo.opciones.map(function (o) { return o.nombre + ' ' + colorElegido(p, o).n.toLowerCase(); }).join(', ');
  }

  function estadoMV(texto) {
    var el = visor.querySelector('.s-mv-estado');
    if (!el) return;
    el.textContent = texto || '';
    el.hidden = !texto;
  }
  // el visor 3D (model-viewer) se baja solo cuando alguien abre un 3D, para que el resto de la página no dependa de él
  function cargarMV() {
    if (mvPedido || (window.customElements && customElements.get('model-viewer'))) return;
    mvPedido = true;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = MV_URL;
    s.onerror = function () { mvPedido = false; estadoMV('No se pudo cargar el visor 3D. Revisa tu conexión a internet.'); };
    document.head.appendChild(s);
  }
  function aplicarColores(mv, p) {
    if (!mv.model) return;
    p.modelo.opciones.forEach(function (o) {
      mv.model.materials.forEach(function (mat) {
        if (mat.name === o.mat) mat.pbrMetallicRoughness.setBaseColorFactor(lineal(colorElegido(p, o).c));
      });
    });
  }
  function prepararMV(p) {
    var mv = visor.querySelector('model-viewer');
    if (!mv) return;
    mv.addEventListener('load', function () { estadoMV(''); aplicarColores(mv, p); });
    mv.addEventListener('error', function () {
      estadoMV(location.protocol === 'file:'
        ? 'Para ver el 3D abre la muestra desde su dirección de internet, no desde el archivo de la computadora.'
        : 'No se pudo cargar el modelo 3D.');
    });
    cargarMV();
  }

  function opcionesHtml(p) {
    return '<div class="s-opciones"><p class="s-paso">Colores de ejemplo</p>' + p.modelo.opciones.map(function (o) {
      var elegido = colorElegido(p, o);
      return '<div class="s-opc"><span>' + esc(o.nombre) + ': <b>' + esc(elegido.n) + '</b></span><div>' + N.PALETAS[o.paleta].map(function (c, i) {
        return '<button type="button" class="s-color" data-accion="color" data-mat="' + o.mat + '" data-i="' + i + '" aria-pressed="' + (vis.sel[p.id][o.mat] === i) +
          '" aria-label="' + esc(o.nombre + ' ' + c.n) + '" title="' + esc(c.n) + '" style="background:' + c.c + '"></button>';
      }).join('') + '</div></div>';
    }).join('') + '</div>';
  }

  // "Combina con": otros muebles que suelen ir juntos (ids en `combina` del producto)
  function combinaHtml(p) {
    var otros = (p.combina || []).map(productoPor).filter(Boolean);
    if (!otros.length) return '';
    return '<div class="s-combina"><p class="s-paso">Combina con</p><div>' + otros.map(function (o) {
      return '<button type="button" data-accion="producto" data-id="' + o.id + '">' + (on('galeria') ? '<img src="' + esc(o.img) + '" alt="">' : '') + '<span>' + esc(o.nombre) + '</span></button>';
    }).join('') + '</div></div>';
  }

  // el 3D solo está activo mientras se ve: al cambiar a Foto, cerrar, salir de la pestaña o dejar de verse, el visor se quita
  var observador = null;
  function soltarObservador() { if (observador) { observador.disconnect(); observador = null; } }
  function apagar3d(motivo) {
    if (visor.hidden || vis.modo !== '3d') return;
    vis.modo = 'foto';
    pintarVisor();
    aviso(motivo + ' Toca "3D" para volver a activarlo.');
  }
  function vigilar3d() {
    var caja = visor.querySelector('.s-mv-caja');
    if (!caja || !window.IntersectionObserver) return;
    observador = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) apagar3d('El 3D se desactivó porque dejó de verse.');
    });
    observador.observe(caja);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) apagar3d('El 3D se desactivó al salir de la pestaña.'); });

  function pintarVisor() {
    soltarObservador();
    var p = productoPor(vis.id);
    var m = p.modelo && on('modelos3d') ? p.modelo : null;
    var es3d = vis.modo === '3d' && m;
    var conAR = on('ar');
    var media = es3d
      ? '<div class="s-visor-media s-mv-caja"><model-viewer class="s-mv" src="' + esc(m.glb) + '" alt="Modelo 3D: ' + esc(p.nombre) + '" camera-controls touch-action="pan-y" auto-rotate rotation-per-second="18deg" interaction-prompt="none" ' +
        (conAR ? 'ar ar-modes="webxr scene-viewer quick-look" ar-scale="fixed" ar-placement="floor" ' : '') +
        'shadow-intensity="1" shadow-softness="0.9" exposure="1.05" environment-image="neutral" camera-orbit="35deg 72deg auto">' +
        (conAR ? '<button type="button" slot="ar-button" class="s-ar-btn">Ver en mi espacio</button>' : '') +
        '</model-viewer><p class="s-mv-estado">Cargando 3D…</p></div>'
      : '<div class="s-visor-media"><img class="' + (p.contener ? 'contener' : '') + '" src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '"></div>';
    var tabs = m ? '<div class="s-tabs" role="tablist">' + [['foto', 'Foto'], ['3d', conAR ? '3D y AR' : '3D']].map(function (t) {
      return '<button type="button" role="tab" data-accion="modo" data-m="' + t[0] + '" aria-selected="' + (t[0] === vis.modo) + '">' + t[1] + '</button>';
    }).join('') + '</div>' : '';
    visor.innerHTML = '<div class="s-visor-caja" role="dialog" aria-modal="true" aria-label="' + esc(p.nombre) + '">' +
      '<button type="button" class="s-visor-x" data-accion="foto-cerrar" aria-label="Cerrar">×</button>' + media +
      '<div class="s-visor-txt">' + tabs + '<h2>' + esc(p.nombre) + '</h2><p>' + esc(p.desc) + '</p>' +
      (es3d ? '<p class="s-medidas"><b>Medidas del modelo de ejemplo:</b> ' + esc(m.medidas) + '.</p>' + opcionesHtml(p) +
        (conAR ? '<p class="s-ar-ayuda"><b>Idea para la página oficial:</b> con realidad aumentada, en tu celular tocarías <b>Ver en mi espacio</b> y apuntarías la cámara al piso. Solo se aplica si el negocio contrata su página.</p>' : '') : '') +
      (on('whatsapp') ? '<button type="button" class="s-btn s-visor-cot" data-accion="cotizar-visor">' + (es3d ? '+ Agregar con estos colores' : '+ Agregar a mi cotización') + '</button>' : '') + combinaHtml(p) +
      '</div></div>';
    visor.hidden = false;
    if (es3d) { prepararMV(p); vigilar3d(); }
  }

  function abrirProducto(id, modo) {
    var p = productoPor(id);
    if (!p) return;
    vis.id = id;
    vis.modo = modo === '3d' && p.modelo && on('modelos3d') ? '3d' : 'foto';
    if (!vis.sel[id] && p.modelo) {
      vis.sel[id] = {};
      p.modelo.opciones.forEach(function (o) { vis.sel[id][o.mat] = 0; });
    }
    pintarVisor();
    visor.querySelector('.s-visor-x').focus();
  }
  function cerrarVisor() { soltarObservador(); visor.hidden = true; visor.innerHTML = ''; }
  // tocar fuera de la caja también cierra
  visor.addEventListener('click', function (e) { if (e.target === visor) cerrarVisor(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !visor.hidden) cerrarVisor(); });

  var pantalla = document.querySelector('.pantalla');
  pantalla.addEventListener('click', function (e) {
    var b = e.target.closest('[data-accion]');
    if (!b) return;
    var accion = b.getAttribute('data-accion'), id = b.getAttribute('data-id'), i = Number(b.getAttribute('data-i'));
    if (accion === 'aviso') aviso(b.getAttribute('data-texto'));
    else if (accion === 'doc') { docAbierto = b.getAttribute('data-doc'); pintarDoc(); }
    else if (accion === 'doc-cerrar') { docAbierto = ''; pintarDoc(); }
    else if (accion === 'pagina') { docAbierto = ''; irPagina(b.getAttribute('data-p')); }
    else if (accion === 'cat') { docAbierto = ''; irPagina('catalogo', id); }
    else if (accion === 'producto') abrirProducto(id, b.getAttribute('data-modo'));
    else if (accion === 'cotizar') {
      var c = enLista(id);
      if (c) cotiza.splice(cotiza.indexOf(c), 1); else agregar(id);
      pintarSitio();
    }
    else if (accion === 'cotizar-visor') {
      var pv = productoPor(vis.id);
      agregar(vis.id, vis.modo === '3d' && pv.modelo ? acabadoTexto(pv) : '');
      pintarSitio();
      aviso('"' + pv.nombre + '" está en tu lista de cotización (' + enLista(vis.id).n + ').');
    }
    else if (accion === 'modo') { vis.modo = b.getAttribute('data-m'); pintarVisor(); }
    else if (accion === 'color') {
      var pc = productoPor(vis.id), mat = b.getAttribute('data-mat');
      vis.sel[vis.id][mat] = i;
      var grupo = b.parentNode;
      [].forEach.call(grupo.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var o = pc.modelo.opciones.filter(function (x) { return x.mat === mat; })[0];
      grupo.parentNode.querySelector('span b').textContent = colorElegido(pc, o).n;
      var mv = visor.querySelector('model-viewer');
      if (mv) aplicarColores(mv, pc);
    }
    else if (accion === 'cant') {
      var it = enLista(id);
      it.n += Number(b.getAttribute('data-d'));
      if (it.n < 1) cotiza.splice(cotiza.indexOf(it), 1);
      pintarSitio();
    }
    else if (accion === 'cot-vaciar') { cotiza = []; pintarSitio(); }
    else if (accion === 'cot-enviar') aviso(avisoWhatsapp());
    else if (accion === 'foto-cerrar') cerrarVisor();
    else if (accion === 'quitar') {
      var f = b.getAttribute('data-f');
      estado.activas[f] = false;
      if (inputs[f]) inputs[f].checked = false;
      // sin los modelos 3D no hay AR
      if (f === 'modelos3d') { estado.activas.ar = false; inputs.ar.checked = false; }
      cambio();
      aviso('Se quitó "' + nombreFuncion(f) + '". Puede volver a prenderla en el panel.');
    }
    else if (accion === 'chat-cerrar') { chat.abierto = false; pintarChat(); }
    else if (accion === 'chat-preg') {
      var q = preguntas()[i];
      chat.msgs.push({ yo: true, t: q.p }, { yo: false, t: q.r() });
      pintarChat();
    }
  });
  // la búsqueda solo cambia los resultados, para no perder el cursor al escribir
  pantalla.addEventListener('input', function (e) {
    if (e.target.matches('[data-accion="cot-campo"]')) {
      cotDatos[e.target.getAttribute('data-k')] = e.target.value;
      var msg = document.querySelector('.s-cot-msg');
      if (msg) msg.textContent = textoCotizacion();
      guardarCot();
      return;
    }
    if (!e.target.matches('[data-accion="buscar"]')) return;
    busqueda = e.target.value;
    var res = $('s-res');
    if (res) res.innerHTML = contenidoCatalogo();
  });
  $('s-wa').addEventListener('click', function () { aviso(avisoWhatsapp()); });
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
    // los extras cotizables llevan su propia sección, con precio
    var propias = D.FUNCIONES.filter(function (f) { return f.plan !== 'extras'; });
    var enPagina = propias.filter(function (f) { return on(f.id) && !f.servicio; });
    var servicios = propias.filter(function (f) { return on(f.id) && f.servicio; });
    var no = propias.filter(function (f) { return !on(f.id); });
    var el = paqueteElegido(), extras = [];
    if (on('modelos3d')) extras.push('- Modelos 3D de mis muebles: paquete de ' + el.n + (el.n === 1 ? ' modelo' : ' modelos') + ' (' + pesos(el.precio) + ')');
    if (on('ar')) extras.push('- Realidad aumentada (AR) para esos modelos (' + pesos(precioAR()) + ')');
    var p = planSugerido();
    var l = [
      'Hola, 185ChangarroWeb. Revisé la muestra de la página de *' + nombre() + '* y esta es mi petición:',
      '',
      '*Plan:* ' + p.name + (p.inst ? ' (' + pesos(p.inst) + ' de instalación + ' + pesos(p.mes) + ' al mes)' : ''),
      '*Fecha:* ' + fechaHoy(),
      '',
      '*Quiero en la página:*',
      enPagina.length ? enPagina.map(linea).join('\n') : '- Nada',
      '',
      '*Quiero que ustedes me ayuden con:*',
      servicios.length ? servicios.map(linea).join('\n') : '- Nada',
      '',
      '*Extras cotizables (pago único, aparte del plan):*',
      extras.length ? extras.join('\n') + '\n- Total de extras: ' + pesos(totalExtras()) : '- Nada',
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
    ponerResumen();
    ponerEnlaceWhatsapp();
    if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
  });
  // resumen para el dueño, arriba del mensaje: plan, funciones y extras de un vistazo
  function ponerResumen() {
    var p = planSugerido();
    var propias = D.FUNCIONES.filter(function (f) { return f.plan !== 'extras' && f.plan !== 'catalogo'; });
    var prendidas = propias.filter(function (f) { return on(f.id); }).length;
    var filas = [
      ['Plan que lo cubre', p.name],
      ['Instalación', p.inst ? pesos(p.inst) : '—'],
      ['Mensualidad', p.mes ? pesos(p.mes) + '/mes' : '—'],
      ['Funciones prendidas', prendidas + ' de ' + propias.length]
    ];
    if (on('modelos3d')) filas.push(['Modelos 3D', paqueteElegido().n + ' modelos · ' + pesos(paqueteElegido().precio)]);
    if (on('ar')) filas.push(['Realidad aumentada', pesos(precioAR())]);
    if (totalExtras()) filas.push(['Extras (pago único)', pesos(totalExtras())]);
    $('resumen').innerHTML = filas.map(function (f) { return '<div><span>' + esc(f[0]) + '</span><b>' + esc(f[1]) + '</b></div>'; }).join('');
  }
  // imprimir o guardar en PDF: la hoja solo lleva el resumen y el mensaje
  $('btn-imprimir').addEventListener('click', function () {
    var hoja = $('hoja-impresion');
    hoja.innerHTML = '<h1>Petición para ' + esc(nombre()) + '</h1><div class="resumen">' + $('resumen').innerHTML + '</div><pre>' + esc(campoMensaje.value) + '</pre>';
    document.body.classList.add('imprimiendo');
    window.print();
    document.body.classList.remove('imprimiendo');
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
