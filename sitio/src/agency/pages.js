/*
 * 185ChangarroWeb · páginas del sitio (se generan en el build con los datos de config.json)
 * Todas las rutas son relativas: el sitio funciona en Render y también abriendo dist/index.html con doble clic.
 */
'use strict';

module.exports = function pages(cfg, PY, PRESETS, ver) {
  const esc = PY.esc;
  const icon = PY.icon;
  const money = PY.money;
  const brand = cfg.marca;
  const site = cfg.urlSitio;
  const portal = (cfg.portal || '').replace(/\/+$/, '');
  const wa = (msg) => esc(PY.waLink(cfg.wa, msg));
  const out = (url) => ' href="' + url + '" target="_blank" rel="noopener"';
  const year = new Date().getFullYear();
  const plans = cfg.planes || [];
  const first = plans[0] || { instalacion: 0, mensualidad: 0, tiempo: '' };
  const desde = 'Desde ' + money(first.instalacion) + ' de instalación y ' + money(first.mensualidad) + ' al mes';
  const doc = (file) => (portal ? portal + '/' + file : '');
  const DOCS = { tarifas: doc('tarifas.html'), terminos: doc('terminos.html'), privacidad: doc('privacidad.html'), contratar: doc('terminos.html#aceptar'), basicas: doc('basicas.html'), eventos: doc('eventos.html') };
  const helloMsg = 'Hola, ' + brand + '. Vi su página y quiero información para tener la página de mi negocio.';

  // "185ChangarroWeb" → logotipo compacto: marca "185" + "Changarro" + "Web" con degradado.
  const words = brand.replace(/^\d+/, '').match(/^(.*?)(Web)?$/);
  const logo = (rel) => '<a class="logo" href="' + (rel || './') + '" aria-label="' + esc(brand) + ', inicio"><img src="' + rel + 'logo.svg" alt="" width="38" height="38"><span>' +
    esc(words[1]) + (words[2] ? '<b>' + esc(words[2]) + '</b>' : '') + '</span></a>';

  // Al abrir el sitio desde archivos (doble clic), las carpetas no abren su index.html solas: este script lo agrega.
  const fileFix = '<script>if(location.protocol==="file:")document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll("a[href],iframe[src]").forEach(function(e){var a=e.tagName==="A"?"href":"src",v=e.getAttribute(a),m=v.match(/^([^?#]*)(.*)$/);if(/^[a-z]+:|^#|^\\/\\//i.test(v))return;if(m[1]===""||/\\/$/.test(m[1]))e.setAttribute(a,(m[1]||"./")+"index.html"+m[2]);});});</script>';

  function layout(o) {
    const rel = o.abs ? '/' : '../'.repeat(o.depth || 0);
    const url = site + o.path;
    const nav = o.home ? '' : rel;
    return '<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
      '<title>' + esc(o.title) + '</title><meta name="description" content="' + esc(o.description) + '"><link rel="canonical" href="' + esc(url) + '">' +
      (o.noindex ? '<meta name="robots" content="noindex">' : '') +
      '<meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:site_name" content="' + esc(brand) + '"><meta property="og:title" content="' + esc(o.ogTitle || o.title) + '"><meta property="og:description" content="' + esc(o.description) + '"><meta property="og:url" content="' + esc(url) + '">' +
      (cfg.ogImage ? '<meta property="og:image" content="' + esc(site + '/' + cfg.ogImage) + '"><meta name="twitter:card" content="summary_large_image">' : '') +
      '<meta name="theme-color" content="#1C1826"><link rel="icon" href="' + rel + 'favicon.svg" type="image/svg+xml">' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap">' +
      '<link rel="stylesheet" href="' + rel + 'assets/agency.css?v=' + ver + '">' + fileFix + (o.head || '') + '</head><body' + (o.bodyClass ? ' class="' + o.bodyClass + '"' : '') + '>' +
      '<header class="a-hdr"><div class="wrap">' + logo(rel) +
      '<nav class="a-nav" aria-label="Principal"><a href="' + nav + '#ejemplos">Ejemplos</a><a href="' + nav + '#como-funciona">Cómo funciona</a><a href="' + nav + '#precios">Planes y precios</a>' +
      (cfg.eventos ? '<a href="' + nav + '#eventos">Eventos</a>' : '') + '<a href="' + nav + '#preguntas">Preguntas</a></nav>' +
      (o.hideCta ? '' : '<a class="btn btn-pri btn-sm" href="' + rel + 'crear/">Ver mi página gratis</a>') + '</div></header>' +
      o.body(rel) + (o.noFooter ? '' : footer(rel)) +
      (o.waFloat ? '<a class="wa-float"' + out(wa(helloMsg)) + ' aria-label="Escríbanos por WhatsApp">' + icon('wa') + '</a>' : '') +
      (o.scripts ? o.scripts(rel) : '') + '</body></html>';
  }

  function footer(rel) {
    const social = Object.keys(cfg.redes || {}).filter((k) => cfg.redes[k]).map((k) => '<li><a' + out(esc(cfg.redes[k])) + '>' + esc(k.charAt(0).toUpperCase() + k.slice(1)) + '</a></li>').join('');
    const docs = (DOCS.tarifas ? '<li><a' + out(esc(DOCS.tarifas)) + '>Tarifas completas</a></li><li><a' + out(esc(DOCS.terminos)) + '>Términos y Condiciones</a></li><li><a' + out(esc(DOCS.privacidad)) + '>Aviso de Privacidad</a></li>' : '');
    return '<footer class="a-ftr"><div class="wrap"><div class="cols"><div>' + logo(rel) + '<p style="margin-top:14px;max-width:40ch">' + esc(cfg.eslogan) + '</p></div>' +
      '<div><h4>Servicios</h4><ul><li><a href="' + rel + 'crear/">Ver mi página gratis</a></li><li><a href="' + rel + '#ejemplos">Ejemplos</a></li><li><a href="' + rel + '#precios">Planes y precios</a></li><li><a href="' + rel + 'herramientas/link-de-whatsapp/">Generador de link de WhatsApp</a></li></ul></div>' +
      '<div><h4>Contacto</h4><ul><li><a' + out(wa(helloMsg)) + '>WhatsApp ' + esc(PY.prettyWa(cfg.wa)) + '</a></li>' +
      (cfg.correo ? '<li><a href="mailto:' + esc(cfg.correo) + '">' + esc(cfg.correo) + '</a></li>' : '') + social + docs +
      '<li><a href="' + rel + 'privacidad-del-sitio/">Privacidad de este sitio</a></li></ul></div></div>' +
      '<div class="bottom"><span>© ' + year + ' ' + esc(brand) + '</span><span>' + (cfg.horarioAtencion ? 'Atención ' + esc(cfg.horarioAtencion) + ' · ' : '') + 'Hecho en México</span></div></div></footer>';
  }

  const presetIds = Object.keys(PRESETS);
  const exCard = (rel) => (id) => {
    const P = PRESETS[id], T = P.theme;
    return '<a class="ex" href="' + rel + 'ejemplos/' + id + '/" style="background:radial-gradient(70% 70% at 90% 10%,' + T.accent + '88,transparent 70%),linear-gradient(150deg,' + T.hero2 + ',' + T.hero1 + ')"><span class="em" aria-hidden="true">' + P.emoji + '</span><small>' + esc(P.short) + '</small><b>' + esc(P.example.nombre) + '</b><span>Ver ejemplo →</span></a>';
  };

  /* ================= INICIO ================= */
  const faqs = [
    ['¿Puedo ver mi página antes de contratar?', 'Sí. Con nuestro creador, o pidiéndonosla por WhatsApp, ve una vista previa gratis con el nombre de su negocio, en su celular. Si le convence, elige su plan; si no, no pasa nada.'],
    ['¿Cuánto cuesta?', (cfg.basica ? 'La Página Básica, que es una sola hoja con contenido fijo, cuesta ' + money(cfg.basica.instalacion) + ' de instalación y ' + money(cfg.basica.mensualidad) + ' al mes. Además hay tres planes personalizables' : 'Hay tres planes') + '. Cada uno tiene un pago de instalación y una mensualidad que incluye el mantenimiento: ' + plans.map((p) => p.nombre + ' (' + money(p.instalacion) + ' + ' + money(p.mensualidad) + ' al mes)').join(', ') + '. Las invitaciones para eventos van aparte y son de pago único. Precios en pesos mexicanos, IVA incluido.'],
    ['¿Qué incluye la mensualidad?', 'El mantenimiento de su página: ' + (cfg.mantenimiento || []).map((x) => x.charAt(0).toLowerCase() + x.slice(1)).join('; ') + '.'],
    ['¿Cómo se paga?', (cfg.pagos || []).slice(0, 2).join(' ')],
    ['¿El dominio es mío?', 'Sí. El dominio y las cuentas siempre quedan a nombre de su negocio. ' + ((cfg.pagos || []).find((x) => /^Dominio/.test(x)) || '')],
    ['¿Cuánto tarda?', 'Depende del plan: ' + plans.map((p) => p.nombre + ', ' + p.tiempo).join('; ') + ', después de recibir su información.'],
    ['¿Qué necesitan de mi parte?', 'Su logo (si no tiene, se hace uno sencillo), fotos del local o productos (opcionales, pero ayudan mucho), su lista de servicios o productos con precios, horarios, dirección, número de WhatsApp y sus redes sociales, si las tiene. Todo lo que nos mande tiene que ser suyo o libre de derechos de autor: no podemos publicar fotos, música, tipografías, logotipos o personajes con copyright de otra persona, porque pueden tumbar la página y el negocio se mete en problemas legales.'],
    ['¿Cómo me llegan los pedidos?', 'Su cliente elige productos en la página, escribe su nombre y si es para recoger o a domicilio, y se abre WhatsApp con el pedido completo y el total. Le llega como un mensaje normal, sin comisión por pedido.'],
    ['¿Voy a salir en Google?', 'Su página se hace con la información que Google usa para entender a los negocios locales y, desde el plan Negocio, damos de alta y arreglamos su ficha de Google Maps. Nadie puede garantizar el primer lugar, pero con página y ficha completas tiene muchas más oportunidades de aparecer.'],
    ['¿Hay plazo forzoso?', 'No. Se puede cancelar con 30 días de aviso. Si el pago se atrasa más de 15 días, la página se pausa, pero no se borra.']
  ];

  const ld = [
    { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: brand, url: site + '/', description: cfg.eslogan, areaServed: 'MX', telephone: '+' + cfg.wa, email: cfg.correo || undefined },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) }
  ];

  const planHtml = (p) => '<article class="plan' + (p.destacado ? ' top' : '') + '">' + (p.destacado ? '<span class="tag">Recomendado</span>' : '') +
    '<h3>' + esc(p.nombre) + '</h3><p class="for">' + esc(p.para) + '</p>' +
    '<div class="prices"><div class="price-box"><span>Instalación</span><b>' + money(p.instalacion) + '</b><small>pago único</small></div><div class="price-box"><span>Mensualidad</span><b>' + money(p.mensualidad) + '</b><small>al mes</small></div></div>' +
    '<ul>' + (p.incluye || []).map((x) => '<li' + (/^Todo lo de/.test(x) ? ' class="all"' : '') + '><span>' + esc(x) + '</span></li>').join('') + '</ul>' +
    '<p class="time">Lista en ' + esc(p.tiempo) + '</p>' +
    '<a class="btn ' + (p.destacado ? 'btn-pri' : 'btn-ghost') + ' btn-block"' + out(wa('Hola, ' + brand + ' 👋 Me interesa el plan ' + p.nombre + ' (' + money(p.instalacion) + ' de instalación y ' + money(p.mensualidad) + ' al mes). ¿Qué necesitan de mi parte?')) + '>Quiero este plan</a></article>';

  /* La Página Básica: el servicio más barato. Va aparte de los planes y enseña también lo que NO
     incluye, porque eso es lo que la separa de los personalizables y evita prometer de más. */
  const B = cfg.basica;
  const basicaHtml = !B ? '' : '<div class="grid g2 basica-row">' +
    '<article class="plan"><span class="tag">La más barata</span>' +
    '<h3>' + esc(B.nombre) + '</h3><p class="for">' + esc(B.para) + '</p>' +
    '<div class="prices"><div class="price-box"><span>Instalación</span><b>' + money(B.instalacion) + '</b><small>pago único</small></div><div class="price-box"><span>Mensualidad</span><b>' + money(B.mensualidad) + '</b><small>al mes</small></div></div>' +
    '<ul>' + (B.incluye || []).map((x) => '<li><span>' + esc(x) + '</span></li>').join('') + '</ul>' +
    '<p class="time">Lista en ' + esc(B.tiempo) + '</p>' +
    '<a class="btn btn-ghost btn-block"' + out(wa('Hola, ' + brand + ' 👋 Me interesa la Página Básica (' + money(B.instalacion) + ' de instalación y ' + money(B.mensualidad) + ' al mes). ¿Qué necesitan de mi parte?')) + '>Quiero la Básica</a></article>' +
    '<div class="box"><h3>Qué no incluye la Básica</h3><p>Es a propósito: es lo que la hace costar menos. Todo esto sí viene en los planes de abajo.</p>' +
    '<ul class="dots no">' + (B.noIncluye || []).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
    (DOCS.basicas ? '<p class="fineprint" style="text-align:left;margin-top:18px"><a' + out(esc(DOCS.basicas)) + '>Ver todo lo que incluye la Básica, pagos y reglas →</a></p>' : '') +
    '</div></div>';

  /* Invitaciones digitales para eventos. Otro público y otro bolsillo: pago único, sin mensualidad. */
  const EV = cfg.eventos;
  const eventosHtml = !EV || !EV.paquetes || !EV.paquetes.length ? '' :
    '<section class="a-sec" id="eventos"><div class="wrap"><div class="head"><span class="kicker">Para fiestas</span>' +
    '<h2>Su fiesta merece una invitación bonita</h2>' +
    '<p>Invitaciones digitales para XV años, bodas, bautizos, cumpleaños y graduaciones. Manda un enlace por WhatsApp y cada invitado la abre en su celular. Pago único, sin mensualidad.</p></div>' +
    '<div class="grid g2">' + EV.paquetes.map((p) => '<article class="plan' + (p.destacado ? ' top' : '') + '">' +
      (p.destacado ? '<span class="tag">La más pedida</span>' : '') +
      '<h3>' + esc(p.nombre) + '</h3><p class="for">' + esc(p.para) + '</p>' +
      '<div class="prices"><div class="price-box wide"><span>Precio</span><b>' + money(p.precio) + '</b><small>pago único, sin mensualidad</small></div></div>' +
      '<ul>' + (p.incluye || []).map((x) => '<li' + (/^Todo lo de/.test(x) ? ' class="all"' : '') + '><span>' + esc(x) + '</span></li>').join('') + '</ul>' +
      '<a class="btn ' + (p.destacado ? 'btn-pri' : 'btn-ghost') + ' btn-block"' + out(wa('Hola, ' + brand + ' 👋 Quiero una invitación digital (' + p.nombre + ', ' + money(p.precio) + ') para mi evento.')) + '>Pedir esta invitación</a></article>').join('') + '</div>' +
    '<div class="notice"><p>Lista en <b>' + esc(EV.tiempo) + '</b>. Queda en línea hasta <b>' + esc(EV.vigencia) + '</b>; para dejarla más tiempo son ' + money(EV.extra) + ' por cada 3 meses. La atención termina <b>3 días después del evento</b>. Las confirmaciones llegan a su WhatsApp: la invitación no guarda datos de sus invitados. Las fotos y la música deben ser suyas o libres de derechos de autor.</p>' +
    (portal ? '<a class="btn btn-pri btn-sm"' + out(esc(portal + '/ejemplodeevento-muestra/')) + '>Ver una invitación de ejemplo</a>' : '') +
    (DOCS.eventos ? '<a class="btn btn-ghost btn-sm"' + out(esc(DOCS.eventos)) + '>Todos los detalles</a>' : '') + '</div>' +
    '</div></section>';

  /* Premio por recomendar. En eventos no aplica: el precio no lo aguanta. */
  const R = cfg.referidos;
  const referidosHtml = !R ? '' :
    '<section class="a-sec alt" id="recomendar"><div class="wrap"><div class="head"><span class="kicker">Premio por recomendar</span>' +
    '<h2>Si alguien contrata porque usted nos recomendó, le damos dinero</h2>' +
    '<p>Solo tiene que decir su nombre cuando contrate la persona que recomendó. El premio se paga cuando esa persona ya pagó su instalación y su primera mensualidad.</p></div>' +
    '<div class="grid g3">' +
    [[money(R.basica), 'por cada Página Básica contratada'],
      [money(R.planes), 'por cada Página Personalizable contratada'],
      [R.eventos ? money(R.eventos) : 'Sin premio', 'las invitaciones para eventos no llevan premio']]
      .map((x) => '<div class="box premio"><b>' + esc(x[0]) + '</b><p>' + esc(x[1]) + '</p></div>').join('') + '</div>' +
    '<p class="fineprint">Un premio por cada negocio nuevo. No aplica entre sucursales del mismo dueño ni para quien ya nos había pedido cotización.' +
    (DOCS.terminos ? ' Vigencia y condiciones completas en la sección 19 de los <a' + out(esc(DOCS.terminos + '#recomendar')) + '>Términos y Condiciones</a>.' : '') + '</p>' +
    '</div></section>';

  const home = layout({
    home: true, depth: 0, path: '/', waFloat: true,
    title: brand + ' | Páginas web para negocios locales, con mantenimiento',
    ogTitle: 'Que su changarro también abra en internet',
    description: 'Página web para su negocio con menú o catálogo, pedidos por WhatsApp, mapa y horario, con dominio a su nombre y mantenimiento cada mes. ' + desde + ', IVA incluido. Vea gratis cómo quedaría la suya.',
    head: ld.map((x) => '<script type="application/ld+json">' + JSON.stringify(x).replace(/</g, '\\u003c') + '</script>').join(''),
    body: (rel) => '<main>' +
      '<section class="a-hero"><div class="wrap"><div>' +
      '<span class="pill">📍 Páginas web para negocios locales de México</span>' +
      '<h1>Que su changarro también <em>abra en internet</em></h1>' +
      '<p class="lead">Página web con su menú o catálogo, pedidos por WhatsApp, mapa y horario, con <b>dominio a nombre de su negocio</b> y <b>mantenimiento cada mes</b>. ' + desde + ', IVA incluido.</p>' +
      '<div class="hero-ctas"><a class="btn btn-pri btn-lg" href="' + rel + 'crear/">Ver cómo quedaría la mía →</a><a class="btn btn-glass btn-lg"' + out(wa(helloMsg)) + '>' + icon('wa') + 'Escribir por WhatsApp</a></div>' +
      '<ul class="checks"><li>Vista previa gratis</li><li>Pedidos sin comisiones</li><li>Sin plazo forzoso</li></ul></div>' +
      '<div class="phone-wrap"><div class="phone"><div class="phone-screen"><iframe src="' + rel + 'ejemplos/restaurante/" title="Ejemplo de página para una taquería" loading="lazy" tabindex="-1" aria-hidden="true" scrolling="no"></iframe><a href="' + rel + 'ejemplos/restaurante/" aria-label="Ver el ejemplo completo"></a></div></div>' +
      '<div class="float f1"><span class="em">🛵</span><div>Nuevo pedido<small>3 tacos al pastor + horchata</small></div></div>' +
      '<div class="float f2"><span class="em">🟢</span><div>Abierto ahora<small>cierra a las 11:00 pm</small></div></div></div>' +
      '</div></section>' +

      '<section class="a-sec pain"><div class="wrap"><div class="head"><span class="kicker">¿Le suena?</span><h2>Su negocio es bueno, pero en internet casi no se nota</h2></div><div class="grid g2">' +
      [['Le preguntan lo mismo todo el día', '«¿Cuánto cuesta?», «¿A qué hora abren?», «¿Dónde están?». Su página contesta por usted, las 24 horas.'],
        ['Lo buscan en Google y no aparece', 'Cuando alguien busca lo que usted vende cerca de su casa, necesita encontrarlo con información clara y confiable.'],
        ['Las apps de reparto se quedan con parte de cada venta', 'Con su página, sus clientes le piden directo por WhatsApp. La venta completa es suya.'],
        ['Su información está regada', 'Fotos del menú en Facebook, precios viejos en Instagram… Su página junta todo en un solo enlace fácil de compartir.']]
        .map((x) => '<div class="box"><h3>' + x[0] + '</h3><p>' + x[1] + '</p></div>').join('') + '</div></div></section>' +

      '<section class="a-sec alt" id="incluye"><div class="wrap"><div class="head"><span class="kicker">Lo que tiene su página</span><h2>Hecha para que le escriban y le compren</h2><p>Nada de cosas raras ni tecnicismos: una página clara que convierte visitas en mensajes de WhatsApp.</p></div><div class="grid g4">' +
      [['📱', 'Hecha para celular y para computadora', 'Se ve perfecta en cualquier teléfono y también en computadora, y carga rápido incluso con datos.'],
        ['💬', 'Botón de WhatsApp', 'Sus clientes le escriben con un toque, con el mensaje ya escrito.'],
        ['🛒', 'Pedidos por WhatsApp', 'El cliente arma su pedido y le llega listo, con total y dirección.'],
        ['🕒', 'Horario inteligente', 'Muestra si está «Abierto ahora» o a qué hora abre.'],
        ['📍', 'Mapa y «Cómo llegar»', 'Lo encuentran sin perderse, directo en Google Maps.'],
        ['🔎', 'Lista para Google', 'Con los datos que Google necesita para entender su negocio.'],
        ['🌐', 'Dominio a su nombre', 'Su propia dirección en internet, registrada a nombre de su negocio.'],
        ['🔳', 'Código QR', 'Para su mostrador, sus mesas, volantes o su camioneta.']]
        .map((x) => '<div class="box"><div class="ico" aria-hidden="true">' + x[0] + '</div><h3>' + x[1] + '</h3><p>' + x[2] + '</p></div>').join('') + '</div></div></section>' +

      '<section class="a-sec" id="ejemplos"><div class="wrap"><div class="head"><span class="kicker">Ejemplos</span><h2>Mire cómo quedaría la suya</h2><p>Negocios ficticios para que vea el resultado. Tóquelos: funcionan de verdad.</p></div><div class="grid g3">' +
      presetIds.map(exCard(rel)).join('') + '</div><p class="fineprint"><a href="' + rel + 'crear/">¿Su giro no aparece? Cree su vista previa y la adaptamos →</a></p></div></section>' +

      '<section class="a-sec alt" id="como-funciona"><div class="wrap"><div class="head"><span class="kicker">Cómo funciona</span><h2>Tres pasos para tener su página</h2></div><div class="grid g3 steps">' +
      [['Vea su vista previa gratis', 'Con nuestro creador en línea o pidiéndola por WhatsApp. Le toma 2 minutos y no se compromete a nada.'],
        ['Elija su plan y acepte por escrito', 'Por WhatsApp o correo. Paga el 50% de la instalación al contratar y nos manda su información.'],
        ['Publicamos su página', 'Con su dominio, en ' + (first.tiempo || 'pocos días') + ' o más según el plan. Paga el otro 50% al entregar y la primera mensualidad un mes después.']]
        .map((x) => '<div class="box step"><h3>' + x[0] + '</h3><p>' + x[1] + '</p></div>').join('') + '</div></div></section>' +

      '<section class="a-sec" id="precios"><div class="wrap"><div class="head"><span class="kicker">Planes y precios</span><h2>' + (B ? 'Empiece por lo sencillo o vaya por todo' : 'Tres planes, todos con mantenimiento') + '</h2><p>' + (B ? 'La Básica es una sola hoja con lo necesario. Los planes arman la página a su gusto y la mantienen cada mes. ' : '') + 'El dominio y las cuentas siempre quedan a nombre del negocio. Precios en pesos mexicanos, IVA incluido.</p></div>' +
      basicaHtml +
      (B ? '<p class="fineprint sep">¿Quiere que la página además agende citas, tenga catálogo y conteste sola? Eso son los planes:</p>' : '') +
      '<div class="plans">' + plans.map(planHtml).join('') + '</div>' +
      '<div class="terms"><div class="box"><h3>Mantenimiento incluido en todos los planes</h3><ul class="dots">' + (cfg.mantenimiento || []).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' +
      '<div class="box"><h3>Pagos y contrato</h3><ul class="dots">' + (cfg.pagos || []).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>' +
      (cfg.masSencillo ? '<div class="notice"><p>' + esc(cfg.masSencillo) + '</p><a class="btn btn-ghost btn-sm"' + out(wa('Hola, ' + brand + ' 👋 Necesito una página más sencilla que el plan Esencial. Le cuento lo que necesito:')) + '>Pedir precio</a></div>' : '') +
      (DOCS.tarifas ? '<div class="docs"><a class="btn btn-ghost btn-sm"' + out(esc(DOCS.tarifas)) + '>Tarifas completas y catálogo de funciones</a><a class="btn btn-ghost btn-sm"' + out(esc(DOCS.terminos)) + '>Términos y Condiciones</a><a class="btn btn-pri btn-sm"' + out(esc(DOCS.contratar)) + '>Aceptar y contratar</a></div>' : '') +
      '</div></section>' +

      eventosHtml +
      referidosHtml +
      '<section class="a-sec alt"><div class="wrap"><div class="head"><span class="kicker">Compare</span><h2>¿Por qué no solo Facebook o una app?</h2></div><div class="table-wrap"><table class="cmp"><thead><tr><th scope="col"></th><th scope="col" class="us">Página de ' + esc(brand) + '</th><th scope="col">Solo Facebook</th><th scope="col">App de reparto</th></tr></thead><tbody>' +
      [['Lo encuentran en Google con su información completa', '<span class="yes">✓ Sí</span>', '<span class="meh">~ A veces</span>', '<span class="no">✗ Solo dentro de la app</span>'],
        ['Pedidos sin comisión', '<span class="yes">✓ Sí</span>', '<span class="meh">~ Mensajes sueltos y desordenados</span>', '<span class="no">✗ Comisión por pedido</span>'],
        ['Menú y precios siempre al día', '<span class="yes">✓ Con mantenimiento mensual</span>', '<span class="meh">~ Se pierden entre publicaciones</span>', '<span class="yes">✓ Sí</span>'],
        ['Dominio propio y código QR', '<span class="yes">✓ A nombre de su negocio</span>', '<span class="meh">~ Perfil de Facebook</span>', '<span class="no">✗ No</span>'],
        ['Costo', money(first.instalacion) + ' + ' + money(first.mensualidad) + ' al mes', 'Gratis', 'Comisión en cada venta']]
        .map((r) => '<tr><th scope="row">' + r[0] + '</th><td class="us">' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>').join('') +
      '</tbody></table></div><p class="fineprint">Su página no reemplaza a sus redes: las complementa. Puede poner su enlace en Facebook, Instagram, WhatsApp y Google Maps.</p></div></section>' +

      '<section class="a-sec"><div class="wrap"><div class="guarantee"><div class="seal" aria-hidden="true">👀</div><div><h3>Véala antes de contratar</h3><p>Le preparamos una vista previa gratis con el nombre de su negocio para que la revise en su celular. Si no le convence, no contrata y no le insistimos.</p></div></div></div></section>' +

      '<section class="a-sec alt" id="preguntas"><div class="wrap"><div class="head"><span class="kicker">Preguntas frecuentes</span><h2>Resolvemos sus dudas</h2></div><div class="faq">' +
      faqs.map((f) => '<details><summary>' + esc(f[0]) + '</summary><div><p>' + esc(f[1]) + '</p></div></details>').join('') + '</div></div></section>' +

      '<section class="a-sec"><div class="wrap"><div class="final"><div><h2>¿Listo para que lo encuentren?</h2><p>Mándenos 3 datos y le preparamos su vista previa sin costo. O créela usted mismo en 2 minutos con nuestro <a href="' + rel + 'crear/">creador en línea</a>.</p></div>' +
      '<form class="qform" id="qform"><label>Nombre de su negocio<input name="negocio" required maxlength="80" placeholder="Ej. Tacos El Güero"></label>' +
      '<label>Giro<select name="giro">' + presetIds.map((id) => '<option>' + esc(PRESETS[id].label) + '</option>').join('') + '<option>Otro</option></select></label>' +
      '<label>Ciudad o colonia<input name="zona" maxlength="80" placeholder="Ej. Casimiro Castillo, Jal."></label>' +
      '<button class="btn btn-wa btn-lg btn-block" type="submit">' + icon('wa') + 'Pedir mi vista previa por WhatsApp</button></form></div></div></section>' +
      '</main>',
    scripts: () => '<script>document.getElementById("qform").addEventListener("submit",function(e){e.preventDefault();var f=e.target.elements;var m="Hola, ' + esc(brand) + ' 👋 Quiero mi vista previa gratis.\\n\\nNegocio: "+f.negocio.value.trim()+"\\nGiro: "+f.giro.value+(f.zona.value.trim()?"\\nZona: "+f.zona.value.trim():"");window.open("https://wa.me/' + cfg.wa + '?text="+encodeURIComponent(m),"_blank","noopener");});</script>'
  });

  /* ================= CREADOR ================= */
  const typeOptions = presetIds.map((id) => '<option value="' + id + '">' + PRESETS[id].emoji + ' ' + esc(PRESETS[id].label) + '</option>').join('');
  const crear = layout({
    depth: 1, path: '/crear/', hideCta: true, noFooter: true, bodyClass: 'is-builder',
    title: 'Vea gratis cómo quedaría su página web | ' + brand,
    description: 'Escriba los datos de su negocio y vea al instante cómo quedaría su página web con menú, WhatsApp, horario y mapa. Gratis y sin registrarse.',
    body: () => '<main class="wrap"><div class="bld-top"><h1>Vea su página en 2 minutos</h1><p>Escriba los datos de su negocio y mire cómo queda al instante. Es gratis y no necesita registrarse.</p><p class="local-note" id="local-note" hidden></p></div>' +
      '<div class="tabs-m"><div class="seg-sm" role="tablist"><button type="button" class="on" data-tab="form">✏️ Editar</button><button type="button" data-tab="preview">👀 Ver mi página</button></div></div>' +
      '<div class="bld"><form class="bld-form" id="bld" autocomplete="off" novalidate>' +
      '<details class="grp" open><summary>1. Lo básico</summary><div class="grp-in">' +
      '<label class="fld">¿Qué tipo de negocio es?<select name="tipo">' + typeOptions + '</select></label>' +
      '<label class="fld">Nombre del negocio<input name="nombre" maxlength="80" placeholder="Ej. Tacos El Güero" required></label>' +
      '<label class="fld">WhatsApp del negocio <small>10 dígitos</small><input name="whatsapp" type="tel" inputmode="numeric" maxlength="16" placeholder="33 1234 5678"></label>' +
      '<label class="fld">Frase de bienvenida <small>(opcional; si la deja vacía usamos la sugerida)</small><textarea name="eslogan" rows="2" maxlength="220"></textarea></label>' +
      '<label class="fld">Teléfono para llamadas <small>(opcional)</small><input name="telefono" type="tel" maxlength="20"></label>' +
      '<div class="fld">Color principal<div class="color-row"><input type="color" name="color" value="#c2410c" aria-label="Color principal"><button type="button" class="chipbtn" data-reset-color>Usar el sugerido</button></div></div>' +
      '</div></details>' +
      '<details class="grp" open><summary>2. Menú, servicios o productos</summary><div class="grp-in">' +
      '<p class="hint" style="margin:0 0 10px">Un producto por línea: <b>Nombre | Precio | Descripción</b>. Para una categoría escriba <b># Nombre</b>.</p>' +
      '<label class="fld"><span class="sr">Lista de productos</span><textarea name="catalogo" rows="13" class="mono" spellcheck="false"></textarea></label>' +
      '<label class="switch"><input type="checkbox" name="pedidos"> Activar carrito de pedidos por WhatsApp</label>' +
      '</div></details>' +
      '<details class="grp"><summary>3. Horario y ubicación</summary><div class="grp-in">' +
      '<div class="quick"><button type="button" data-hours="09:00-20:00|09:00-20:00|09:00-20:00|09:00-20:00|09:00-20:00|09:00-20:00|">Lun a sáb 9 a 20</button><button type="button" data-hours="09:00-21:00|09:00-21:00|09:00-21:00|09:00-21:00|09:00-21:00|09:00-21:00|09:00-21:00">Diario 9 a 21</button><button type="button" data-hours="09:00-18:00|09:00-18:00|09:00-18:00|09:00-18:00|09:00-18:00||">Lun a vie 9 a 18</button></div>' +
      '<div class="hours-ui">' + PY.DAYS.map((d) => '<label>' + PY.DAY_NAMES[d] + '<input name="h_' + d + '" placeholder="Cerrado" maxlength="40"></label>').join('') + '</div>' +
      '<p class="hint" style="margin:-4px 0 14px">Formato 24 h. Ej. <b>09:00-14:00, 16:00-20:00</b>. Vacío = cerrado.</p>' +
      '<label class="fld">Dirección <small>(calle, número y colonia)</small><input name="direccion" maxlength="160" placeholder="Calle Hidalgo 12, Centro"></label>' +
      '<label class="fld">Ciudad o zona<input name="zona" maxlength="80" placeholder="Ej. Autlán, Jal."></label>' +
      '</div></details>' +
      '<details class="grp"><summary>4. Detalles extra <small class="hint">opcional</small></summary><div class="grp-in">' +
      '<label class="fld">Sobre su negocio <small>(si la deja vacía usamos la sugerida)</small><textarea name="nosotros" rows="4" maxlength="1500"></textarea></label>' +
      '<div class="fld">Formas de pago<div class="checks-ui">' + ['Efectivo', 'Transferencia', 'Tarjeta', 'Otro método de pago'].map((p) => '<label><input type="checkbox" name="pagos" value="' + p + '"> ' + p + '</label>').join('') + '</div></div>' +
      '<label class="fld">Entregas a domicilio <small>(vacío si no hace entregas)</small><input name="entrega" maxlength="200"></label>' +
      '<label class="fld">Correo del negocio <small>(opcional)</small><input name="correo" type="email" maxlength="120"></label>' +
      '<label class="fld" data-only="salud">Cédula profesional <small>(ej. Céd. Prof. 1234567)</small><input name="cedula" maxlength="100"></label>' +
      '<label class="fld">Facebook <small>(enlace o @usuario)</small><input name="facebook" maxlength="200"></label>' +
      '<label class="fld">Instagram<input name="instagram" maxlength="200" placeholder="@sunegocio"></label>' +
      '<label class="fld">TikTok<input name="tiktok" maxlength="200" placeholder="@sunegocio"></label>' +
      '<label class="fld">Foto de portada <small>(opcional)</small><input name="portada" type="url" maxlength="500" placeholder="https://ejemplo.com/mi-foto.jpg"><small class="hint">Pegue el enlace directo de la imagen y que <b>termine en .jpg</b>. Un enlace que no acabe en una imagen (por ejemplo, el de una publicación de Facebook) no se puede mostrar.</small></label>' +
      '<p class="hint" style="margin:4px 0 0"><b>Importante:</b> la foto, el logo y los textos que use tienen que ser suyos o libres de derechos de autor. No podemos publicar imágenes, música, tipografías, logotipos ni personajes con copyright de otra persona: pueden tumbar la página y meterlo en problemas legales.</p>' +
      '</div></details></form>' +
      '<div class="preview"><div class="pv-bar"><div class="seg-sm"><button type="button" class="on" data-dev="mobile">📱 Celular</button><button type="button" data-dev="desktop">🖥️ Computadora</button></div><a href="../vista-previa/" target="_blank" rel="noopener" data-full>Abrir en pantalla completa ↗</a></div>' +
      '<div class="pv-stage"><div class="pv-frame" id="pvf"><iframe id="pv" title="Vista previa de su página"></iframe></div></div></div></div></main>' +
      '<div class="bld-actions"><div class="wrap"><div class="links"><button type="button" data-copy>Copiar enlace de la vista previa</button><button type="button" data-json>Descargar datos</button><button type="button" data-reset>Empezar de nuevo</button></div>' +
      '<a class="btn btn-wa" href="#" target="_blank" rel="noopener" data-publish>' + icon('wa') + 'La quiero: enviar por WhatsApp</a></div></div>',
    scripts: (rel) => '<script src="' + rel + 'assets/engine.js?v=' + ver + '"></script><script src="' + rel + 'assets/builder.js?v=' + ver + '"></script>'
  });

  /* ================= VISOR DE VISTAS PREVIAS ================= */
  const demo = '<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Vista previa | ' + esc(brand) + '</title><link rel="icon" href="../favicon.svg" type="image/svg+xml">' +
    '<style>body{margin:0;font:600 1rem system-ui,sans-serif;color:#5E5873;background:#F7F5FB}.ld{display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px}.ld a{color:#6B3FC4}</style></head>' +
    '<body><div class="ld" id="ld">Cargando vista previa…</div><script src="../assets/engine.js?v=' + ver + '"></script><script src="../assets/demo.js?v=' + ver + '"></script></body></html>';

  /* ================= PROSPECTAR (uso interno) ================= */
  const prospectar = layout({
    depth: 1, path: '/prospectar/', noindex: true, hideCta: true,
    title: 'Prospectar | ' + brand,
    description: 'Herramienta interna para preparar vistas previas y mensajes.',
    body: () => '<main class="page"><div class="wrap"><h1>Prospectar</h1><p style="color:var(--muted);margin-top:8px;max-width:72ch">Herramienta interna: prepara una vista previa con el nombre de un negocio y el mensaje listo para enviársela. La lista se guarda solo en este navegador; descárguela seguido.</p><p class="local-note" id="local-note" hidden></p>' +
      '<div class="pros" style="margin-top:28px"><form class="box" id="pf" autocomplete="off">' +
      '<label class="fld">Giro<select name="tipo">' + typeOptions + '</select></label>' +
      '<label class="fld">Nombre del negocio<input name="negocio" required maxlength="80"></label>' +
      '<label class="fld">WhatsApp del negocio <small>(el que aparece en Google Maps o Facebook)</small><input name="wa" type="tel" maxlength="16" placeholder="10 dígitos"></label>' +
      '<label class="fld">Colonia o ciudad<input name="zona" maxlength="80"></label>' +
      '<label class="fld">¿Dónde lo encontró?<select name="fuente"><option value="en Google Maps">Google Maps</option><option value="en Facebook">Facebook</option><option value="en Instagram">Instagram</option><option value="al pasar por su local">Pasé por su local</option><option value="por una recomendación">Recomendación</option></select></label>' +
      '<label class="fld">Su nombre <small>(opcional, para el mensaje)</small><input name="yo" maxlength="40" value="' + esc(cfg.tuNombre || '') + '"></label>' +
      '</form><div><div class="box"><h3 style="margin-bottom:12px">Mensaje listo</h3><div class="msg-out"><div id="msg">Escriba el nombre del negocio…</div></div>' +
      '<div class="btns"><a class="btn btn-wa btn-sm" id="send" href="#" target="_blank" rel="noopener">' + icon('wa') + 'Abrir chat con el negocio</a><button class="btn btn-ghost btn-sm" type="button" id="copy">Copiar mensaje</button><a class="btn btn-ghost btn-sm" id="see" href="#" target="_blank" rel="noopener">Ver vista previa</a><a class="btn btn-ghost btn-sm" id="edit" href="#" target="_blank" rel="noopener">Personalizar</a></div>' +
      '<button class="btn btn-ink btn-block" type="button" id="save" style="margin-top:14px">Guardar en mi lista</button></div></div></div>' +
      '<h2 style="margin:48px 0 6px;font-size:1.6rem">Mi lista de prospectos</h2><div class="stats" id="stats"></div>' +
      '<div class="btns" style="margin:0 0 14px"><button class="btn btn-ghost btn-sm" type="button" id="csv">Descargar CSV</button><button class="btn btn-ghost btn-sm" type="button" id="wipe">Borrar lista</button></div>' +
      '<div class="table-wrap"><table class="crm"><thead><tr><th>Fecha</th><th>Negocio</th><th>Zona</th><th>Estado</th><th>Vista previa</th><th>Seguimiento</th></tr></thead><tbody id="rows"></tbody></table></div>' +
      '</div></main>',
    scripts: (rel) => '<script>window.PY_PROSPECT=' + JSON.stringify({ template: cfg.mensajeProspecto, instalacion: money(first.instalacion), mensualidad: money(first.mensualidad), brand }).replace(/</g, '\\u003c') + ';</script><script src="' + rel + 'assets/engine.js?v=' + ver + '"></script><script src="' + rel + 'assets/prospectar.js?v=' + ver + '"></script>'
  });

  /* ================= HERRAMIENTA: LINK DE WHATSAPP ================= */
  const toolFaq = [
    ['¿Qué es un link de WhatsApp?', 'Es un enlace del tipo wa.me/523312345678 que abre un chat con usted sin que la otra persona tenga que guardar su número. Puede llevar un mensaje ya escrito.'],
    ['¿Funciona con WhatsApp Business?', 'Sí. Funciona igual con WhatsApp normal y con WhatsApp Business.'],
    ['¿Cómo pongo el número?', 'Elija su país y escriba su número sin espacios ni guiones. En México son 10 dígitos, por ejemplo 3312345678.'],
    ['¿Dónde puedo usar el código QR?', 'En su mostrador, tarjetas de presentación, volantes, menús, etiquetas de producto o en su vehículo. Al escanearlo, se abre el chat con usted.'],
    ['¿Tiene algún costo?', 'No. La herramienta es gratuita y no guardamos los números que escribe: todo se genera en su navegador.']
  ];
  const tool = layout({
    depth: 2, path: '/herramientas/link-de-whatsapp/',
    title: 'Generador de link de WhatsApp y código QR gratis | ' + brand,
    ogTitle: 'Cree su link de WhatsApp con mensaje y código QR',
    description: 'Cree gratis su link de WhatsApp (wa.me) con mensaje predefinido y descargue su código QR en segundos. Ideal para negocios: póngalo en su Facebook, Instagram, volantes y mostrador.',
    head: '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: toolFaq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) }).replace(/</g, '\\u003c') + '</script>',
    body: (rel) => '<main class="page"><div class="wrap"><span class="kicker">Herramienta gratis</span><h1>Generador de link de WhatsApp y código QR</h1><p style="color:var(--muted);margin-top:10px;max-width:64ch;font-size:1.08rem">Cree un enlace que abre un chat con usted con un mensaje ya escrito, y descargue su código QR para imprimirlo. Gratis y sin registro.</p>' +
      '<div class="tool"><form class="box" id="tf" autocomplete="off"><div class="fld">Su número de WhatsApp<div class="row"><select name="cc" aria-label="País">' +
      [['52', 'México +52'], ['1', 'EE. UU. +1'], ['57', 'Colombia +57'], ['54', 'Argentina +54'], ['51', 'Perú +51'], ['56', 'Chile +56'], ['34', 'España +34'], ['502', 'Guatemala +502'], ['593', 'Ecuador +593'], ['58', 'Venezuela +58']]
        .map((c) => '<option value="' + c[0] + '">' + c[1] + '</option>').join('') + '</select><input name="num" type="tel" inputmode="numeric" maxlength="15" placeholder="3312345678" aria-label="Número"></div></div>' +
      '<label class="fld">Mensaje predefinido <small>(opcional)</small><textarea name="msg" rows="3" maxlength="500" placeholder="Hola, quiero información sobre…"></textarea></label>' +
      '<div class="quick"><button type="button" data-msg="Hola 👋 Quiero hacer un pedido.">Pedido</button><button type="button" data-msg="Hola 👋 Quiero agendar una cita.">Cita</button><button type="button" data-msg="Hola 👋 Quiero información y precios.">Información</button><button type="button" data-msg="Hola 👋 Quiero una cotización.">Cotización</button></div>' +
      '<label class="fld">Su link<div class="out"><input id="link" readonly value="Escriba su número…"><button class="btn btn-ink btn-sm" type="button" id="cp">Copiar</button></div></label>' +
      '<a class="btn btn-wa btn-block" id="try" href="#" target="_blank" rel="noopener">' + icon('wa') + 'Probar mi link</a></form>' +
      '<div class="box qrbox"><h3>Su código QR</h3><div id="qr" aria-label="Código QR"></div><button class="btn btn-pri" type="button" id="dl">Descargar QR (PNG)</button><p class="hint">Imprímalo de al menos 3 × 3 cm para que se escanee fácil.</p></div></div>' +
      '<div class="cta-strip"><div><h3 style="font-size:1.35rem">¿Y si además tuviera su página web?</h3><p>Menú o catálogo, pedidos por WhatsApp, mapa y horario, con mantenimiento cada mes. ' + desde + '.</p></div><a class="btn btn-pri" href="' + rel + 'crear/">Ver cómo quedaría la mía →</a></div>' +
      '<div class="prose" style="margin-top:56px"><h2>¿Para qué sirve un link de WhatsApp?</h2><p>Para que sus clientes le escriban con un solo toque, sin guardar su número. Puede ponerlo en la biografía de Instagram o TikTok, en el botón de su página de Facebook, en sus publicaciones de Marketplace o en su firma de correo.</p>' +
      '<h2>Ideas de mensajes predefinidos</h2><ul><li><b>Restaurantes:</b> «Hola, quiero hacer un pedido para recoger».</li><li><b>Barberías y estéticas:</b> «Hola, quiero agendar una cita para este fin de semana».</li><li><b>Tiendas:</b> «Hola, vi su catálogo y quiero información de…».</li><li><b>Servicios:</b> «Hola, quiero una cotización para…».</li></ul>' +
      '<h2>Preguntas frecuentes</h2></div><div class="faq" style="margin:16px 0 0;max-width:760px">' + toolFaq.map((f) => '<details><summary>' + esc(f[0]) + '</summary><div><p>' + esc(f[1]) + '</p></div></details>').join('') + '</div>' +
      '</div></main>',
    scripts: (rel) => '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script><script src="' + rel + 'assets/tool.js?v=' + ver + '"></script>'
  });

  /* ================= PRIVACIDAD DE ESTE SITIO ================= */
  const privacy = layout({
    depth: 1, path: '/privacidad-del-sitio/',
    title: 'Privacidad de este sitio | ' + brand,
    description: 'Cómo tratan los datos el creador de vistas previas y las herramientas de ' + brand + '.',
    body: () => '<main class="page"><div class="wrap prose"><h1>Privacidad de este sitio</h1>' +
      '<p style="margin-top:12px">' + (DOCS.privacidad ? 'El responsable del tratamiento de sus datos y todos los detalles legales están en el <a' + out(esc(DOCS.privacidad)) + '>Aviso de Privacidad de ' + esc(brand) + '</a>. Esta página solo explica cómo funcionan las herramientas de este sitio.' : 'Esta página explica cómo funcionan las herramientas de este sitio.') + '</p>' +
      '<h2>El creador de vistas previas y la herramienta de WhatsApp</h2><p>Funcionan dentro de su navegador. Lo que escribe no se envía a ningún servidor nuestro: viaja dentro del enlace que usted decide compartir. Su último borrador se guarda solo en su navegador para que no lo pierda.</p>' +
      '<h2>Cuando nos escribe</h2><p>Si nos manda un mensaje por WhatsApp o correo, recibimos los datos que usted comparta (por ejemplo, su nombre, su número y la información de su negocio) y los usamos solo para contestarle y prepararle su vista previa o su cotización.</p>' +
      '<h2>Cookies y publicidad</h2><p>Este sitio no usa cookies de rastreo ni publicidad.</p>' +
      '<h2>Contacto</h2><p>Para cualquier duda sobre sus datos escríbanos a <b>' + esc(cfg.correo || 'nuestro WhatsApp') + '</b>.</p></div></main>'
  });

  /* ================= 404 ================= */
  const notFound = layout({
    abs: true, path: '/404.html', noindex: true,
    title: 'Página no encontrada | ' + brand,
    description: 'La página que busca no existe.',
    body: () => '<main class="page"><div class="wrap" style="text-align:center;max-width:620px"><p style="font-size:4rem">🧭</p><h1>No encontramos esta página</h1><p style="color:var(--muted);margin:14px 0 26px">Puede que el enlace esté incompleto o que la página ya no exista.</p><div class="hero-ctas" style="justify-content:center"><a class="btn btn-pri" href="/">Ir al inicio</a><a class="btn btn-ghost" href="/crear/">Ver mi página gratis</a></div></div></main>'
  });

  return { home, crear, demo, prospectar, tool, privacy, notFound };
};
