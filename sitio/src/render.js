/*
 * 185ChangarroWeb · Motor de páginas para negocios locales
 * El mismo código genera las páginas publicadas (Node, en el build)
 * y las vistas previas en vivo (navegador, en /crear/ y /demo/).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Changarro = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DAYS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
  const DAY_NAMES = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado', dom: 'Domingo' };
  const SCHEMA_DAYS = { lun: 'Monday', mar: 'Tuesday', mie: 'Wednesday', jue: 'Thursday', vie: 'Friday', sab: 'Saturday', dom: 'Sunday' };

  const api = { ASSETS: null, PRESETS: null, AGENCY: null, DAYS, DAY_NAMES };

  /* ---------- utilidades de texto ---------- */
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ESC[c]);
  const line = (v, max = 200) => (v == null ? '' : String(v).replace(/\s+/g, ' ').trim().slice(0, max));
  const block = (v, max = 2000) => (v == null ? '' : String(v).replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max));
  const arr = (v) => (Array.isArray(v) ? v : []);
  const has = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k) && o[k] != null;
  const paras = (v) => block(v).split(/\n\s*\n/).filter(Boolean).map((p) => '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');

  function slugify(s) {
    return line(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }

  // Rellena {campo}. Lo que va entre [corchetes] se omite si algún campo de adentro está vacío.
  function fill(tpl, ctx) {
    if (!tpl) return '';
    return String(tpl)
      .replace(/\[([^\]]*)\]/g, (m, inner) => ((inner.match(/\{(\w+)\}/g) || []).every((k) => ctx[k.slice(1, -1)]) ? inner : ''))
      .replace(/\{(\w+)\}/g, (m, k) => (ctx[k] != null ? ctx[k] : ''))
      .replace(/([^.\s])\.\.(?=\s|$)/g, '$1.'); // "N.L.." → "N.L."
  }

  function listText(items) {
    if (items.length < 2) return items.join('');
    return items.slice(0, -1).join(', ') + ' y ' + items[items.length - 1];
  }

  /* ---------- teléfonos y enlaces ---------- */
  function waNumber(v) {
    let d = String(v || '').replace(/\D/g, '');
    if (d.length === 10) d = '52' + d; // número mexicano de 10 dígitos
    else if (d.length === 13 && d.startsWith('521')) d = '52' + d.slice(3); // formato antiguo con 1
    return d.length >= 11 && d.length <= 15 ? d : '';
  }
  const waLink = (num, msg) => 'https://wa.me/' + (num || '') + (msg ? '?text=' + encodeURIComponent(msg) : '');

  function telHref(v) {
    const d = String(v || '').replace(/[^\d+]/g, '');
    if (d.replace(/\D/g, '').length < 8) return '';
    return 'tel:' + (/^\d{10}$/.test(d) ? '+52' + d : d);
  }

  function prettyWa(num) {
    const d = String(num || '');
    if (!d.startsWith('52') || d.length !== 12) return d ? '+' + d : '';
    const n = d.slice(2);
    return /^(55|56|33|81)/.test(n) ? n.slice(0, 2) + ' ' + n.slice(2, 6) + ' ' + n.slice(6) : n.slice(0, 3) + ' ' + n.slice(3, 6) + ' ' + n.slice(6);
  }

  function safeUrl(v) {
    const s = line(v, 500);
    return /^https?:\/\/[^\s"'<>]+$/i.test(s) ? s : '';
  }

  // Imágenes: URL completa o archivo junto a datos.json (ej. "portada.jpg").
  function safeAsset(v) {
    const s = line(v, 500);
    if (/^https?:\/\/[^\s"'<>()]+$/i.test(s)) return s;
    if (/^[\w-]+(\/[\w-]+)*\.(jpe?g|png|webp|gif|svg|avif)$/i.test(s)) return s;
    return '';
  }

  const SOCIAL = {
    facebook: { label: 'Facebook', base: 'https://www.facebook.com/' },
    instagram: { label: 'Instagram', base: 'https://www.instagram.com/' },
    tiktok: { label: 'TikTok', base: 'https://www.tiktok.com/@' },
    youtube: { label: 'YouTube', base: 'https://www.youtube.com/@' }
  };
  function socialUrl(k, v) {
    const s = line(v, 300);
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return safeUrl(s);
    const handle = s.replace(/^@/, '').replace(/[^\w.\-]/g, '');
    return handle ? SOCIAL[k].base + handle : '';
  }

  /* ---------- colores ---------- */
  function hex(v) {
    const s = line(v).toLowerCase();
    if (/^#[0-9a-f]{6}$/.test(s)) return s;
    if (/^#[0-9a-f]{3}$/.test(s)) return '#' + s.slice(1).split('').map((c) => c + c).join('');
    return '';
  }
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const toHex = (c) => '#' + c.map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return toHex(A.map((x, i) => x + (B[i] - x) * t)); };
  function lum(h) {
    const w = [0.2126, 0.7152, 0.0722];
    return rgb(h).reduce((s, v, i) => { v /= 255; return s + w[i] * (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); }, 0);
  }
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  function readable(c, bg) {
    const target = lum(bg) > 0.4 ? '#000000' : '#ffffff';
    let out = c;
    for (let i = 1; i <= 12 && contrast(out, bg) < 4.5; i++) out = mix(c, target, i * 0.07);
    return out;
  }

  /* ---------- fechas ---------- */
  const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function dateText(v) {
    const s = line(v, 40);
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m && +m[2] >= 1 && +m[2] <= 12) return (+m[3]) + ' de ' + MONTHS[+m[2] - 1] + ' de ' + m[1];
    return s;
  }

  /* ---------- precios ---------- */
  function money(n) {
    return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function price(v) {
    if (typeof v === 'number' && isFinite(v)) return { value: v, label: money(v) };
    const s = line(v, 40);
    const m = s.replace(/\s+/g, '').replace(/(mxn|pesos)$/i, '').match(/^\$?(\d{1,3}(?:,\d{3})+|\d+)(\.\d{1,2})?$/);
    if (m) { const n = parseFloat(m[1].replace(/,/g, '') + (m[2] || '')); return { value: n, label: money(n) }; }
    return { value: null, label: s };
  }

  /* ---------- horarios ---------- */
  const RANGE = /(\d{1,2})(?:[:.](\d{2}))?\s*([ap])?\.?\s*m?\.?\s*(?:-|–|—|a|al|hasta)\s*(\d{1,2})(?:[:.](\d{2}))?\s*([ap])?\.?\s*m?\.?/i;
  function toMin(h, m, ap) {
    h = +h; m = +(m || 0);
    if (ap) { ap = ap.toLowerCase(); if (ap === 'p' && h < 12) h += 12; if (ap === 'a' && h === 12) h = 0; }
    return Math.min(h, 24) * 60 + Math.min(m, 59);
  }
  function parseDay(v) {
    const s = line(v, 80).toLowerCase();
    if (!s || /cerrad|closed|descanso|no abr/.test(s)) return [];
    if (/24\s*h/.test(s)) return [[0, 1440]];
    const out = [];
    s.split(/,|;|\sy\s|\//).forEach((part) => {
      const m = part.match(RANGE);
      if (!m) return;
      const a = toMin(m[1], m[2], m[3]);
      let b = toMin(m[4], m[5], m[6]);
      if (b <= a) b += 1440; // cierra después de medianoche
      out.push([a, b]);
    });
    return out.sort((x, y) => x[0] - y[0]);
  }
  function clock(min, h24) {
    min = ((min % 1440) + 1440) % 1440;
    let h = Math.floor(min / 60);
    const mm = String(min % 60).padStart(2, '0');
    if (h24) return h + ':' + mm;
    const ap = h < 12 ? 'am' : 'pm';
    h = h % 12 || 12;
    return h + ':' + mm + ' ' + ap;
  }
  function rangesText(r, h24) {
    if (!r.length) return 'Cerrado';
    if (r.length === 1 && r[0][0] === 0 && r[0][1] === 1440) return 'Abierto 24 horas';
    return r.map((x) => clock(x[0], h24) + ' – ' + clock(x[1], h24)).join(' y ');
  }
  function groupHours(hours, h24) {
    const groups = [];
    DAYS.forEach((d) => {
      const t = rangesText(hours[d] || [], h24);
      const g = groups[groups.length - 1];
      if (g && g.text === t) g.days.push(d); else groups.push({ days: [d], text: t });
    });
    return groups.map((g) => {
      const a = DAY_NAMES[g.days[0]], b = DAY_NAMES[g.days[g.days.length - 1]].toLowerCase();
      const label = g.days.length === 1 ? a : g.days.length === 2 ? a + ' y ' + b : a + ' a ' + b;
      return { days: g.days, text: g.text, label: g.days.length === 7 ? 'Todos los días' : label };
    });
  }
  const hhmm = (min) => { min = min % 1440; return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0'); };

  /* ---------- catálogo <-> texto (para el creador) ---------- */
  function catalogToText(cat) {
    return arr(cat).map((c) => {
      const rows = arr(c.productos).map((p) => {
        const cells = [p.nombre, p.precio == null || p.precio === '' ? '' : price(p.precio).label, p.descripcion]
          .map((x) => (x == null ? '' : String(x).replace(/\|/g, '/').trim()));
        while (cells.length > 1 && !cells[cells.length - 1]) cells.pop();
        return cells.join(' | ');
      });
      return (c.categoria ? '# ' + c.categoria + '\n' : '') + rows.join('\n');
    }).join('\n\n');
  }
  function textToCatalog(txt) {
    const out = [];
    let cur = null;
    String(txt || '').split(/\r?\n/).forEach((raw) => {
      const l = raw.trim();
      if (!l) return;
      if (l.startsWith('#')) { cur = { categoria: line(l.replace(/^#+/, ''), 60), productos: [] }; out.push(cur); return; }
      const parts = l.split('|').map((x) => x.trim());
      const p = { nombre: line(parts[0], 80) };
      if (parts[1]) { const pr = price(parts[1]); p.precio = pr.value != null ? pr.value : pr.label; }
      if (parts[2]) p.descripcion = line(parts.slice(2).join(' / '), 200);
      if (!p.nombre) return;
      if (!cur) { cur = { categoria: '', productos: [] }; out.push(cur); }
      cur.productos.push(p);
    });
    return out.filter((c) => c.productos.length);
  }

  /* ---------- modelo normalizado ---------- */
  const LOWER_OK = /^(efectivo|transferencia|tarjeta( de (cr[eé]dito|d[eé]bito))?|dep[oó]sito|vales)$/i;

  function model(input, opts) {
    const presets = opts.presets || api.PRESETS || {};
    const d = input && typeof input === 'object' ? input : {};
    const type = presets[d.tipo] ? d.tipo : Object.keys(presets)[0];
    const P = presets[type];
    const name = line(d.nombre, 80) || 'Tu negocio';
    const zona = line(d.zona, 80);
    const pagos = (has(d, 'pagos') ? arr(d.pagos) : P.pagos).map((x) => line(x, 30)).filter(Boolean).slice(0, 8);
    const ctx = { nombre: name, zona, pagos: listText(pagos.map((x) => (LOWER_OK.test(x) ? x.toLowerCase() : x))) || 'varias formas de pago' };

    const m = { type, P, name, zona, ctx, pagos };
    m.slug = slugify(d.slug || name) || 'negocio';
    m.tagline = line(fill(d.eslogan || P.tagline, ctx), 240);
    m.seoTitle = line(fill(d.seoTitulo || P.seoTitle, ctx), 120);
    m.wa = waNumber(d.whatsapp);
    m.phone = line(d.telefono, 30);
    m.address = line(d.direccion, 160);
    m.tz = /^[A-Za-z_]+\/[A-Za-z_]+$/.test(line(d.zonaHoraria)) ? line(d.zonaHoraria) : 'America/Mexico_City';
    m.h24 = d.formato24h === true;

    const rawH = has(d, 'horario') ? d.horario : P.horario;
    m.hours = {};
    m.hasHours = false;
    DAYS.forEach((k) => { m.hours[k] = parseDay(rawH && rawH[k]); if (m.hours[k].length) m.hasHours = true; });

    m.about = block(fill(has(d, 'nosotros') ? d.nosotros : P.about, ctx), 1500);
    m.aboutTitle = line(fill(d.nosotrosTitulo || P.aboutTitle, ctx), 90);
    m.highlights = (has(d, 'destacados') ? arr(d.destacados) : P.highlights)
      .map((h) => ({ icon: line(h.icono, 8), title: line(fill(h.titulo, ctx), 60), text: line(fill(h.texto, ctx), 160) }))
      .filter((h) => h.title).slice(0, 6);

    let n = 0;
    m.sampleCatalog = !has(d, 'catalogo');
    m.catalog = (has(d, 'catalogo') ? arr(d.catalogo) : P.catalogo).map((c, ci) => ({
      title: line(c.categoria, 60),
      id: 'cat-' + ci + (slugify(c.categoria) ? '-' + slugify(c.categoria) : ''),
      items: arr(c.productos).map((p) => ({
        id: 'p' + n++, name: line(p.nombre, 80), price: price(p.precio), desc: line(p.descripcion, 200), photo: safeAsset(p.foto)
      })).filter((p) => p.name).slice(0, 80)
    })).filter((c) => c.items.length).slice(0, 20);
    m.catalogTitle = line(d.catalogoTitulo, 70) || P.catalogTitle;
    m.orders = has(d, 'pedidos') ? !!d.pedidos : !!P.orders;
    m.catalogIntro = line(d.catalogoIntro, 240) || (m.orders === !!P.orders ? P.catalogIntro : P.catalogIntroAlt) || '';

    m.entrega = line(fill(has(d, 'entrega') ? d.entrega : P.entrega, ctx), 200);
    m.faq = (has(d, 'preguntas') ? arr(d.preguntas) : P.preguntas)
      .map((q) => ({ q: line(fill(q.p, ctx), 160), a: block(fill(q.r, ctx), 800) }))
      .filter((q) => q.q && q.a).slice(0, 12);

    const r = d.redes || {};
    m.social = Object.keys(SOCIAL).map((k) => ({ k, label: SOCIAL[k].label, url: socialUrl(k, r[k]) })).filter((s) => s.url);

    // Base legal: datos del negocio, leyenda de precios, aviso de privacidad y términos.
    m.email = /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(line(d.correo)) ? line(d.correo) : '';
    m.titular = line(d.titular, 160) || name;
    m.since = dateText(d.preciosVigentes);
    m.priceNote = line(d.leyendaPrecios, 240) || ('Precios en pesos mexicanos, con IVA incluido.' + (m.since ? ' Vigentes desde el ' + m.since + '.' : ''));
    const tc = d.terminos && typeof d.terminos === 'object' ? d.terminos : {};
    m.terms = {
      anticipo: line(tc.anticipo, 300),
      cancelaciones: block(tc.cancelaciones, 800) || 'Puedes cancelar sin costo antes de que empecemos a preparar tu pedido; avísanos por WhatsApp.',
      devoluciones: block(tc.devoluciones, 800) || 'Si tu pedido llega incompleto o con algún problema, avísanos por WhatsApp el mismo día y lo resolvemos.',
      promociones: block(tc.promociones, 800) || 'Cada promoción indica su vigencia y sus condiciones. Salvo que se diga otra cosa, no son acumulables.',
      extra: block(tc.extra, 2000)
    };
    m.showTerms = m.orders || has(d, 'terminos');
    // Estadísticas sin cookies para el reporte mensual (opcional): GoatCounter (visitas y clics) o Cloudflare (visitas).
    const st = d.estadisticas && typeof d.estadisticas === 'object' ? d.estadisticas : {};
    m.stats = {
      goat: /^[a-z0-9-]{2,40}$/i.test(line(st.goatcounter)) ? line(st.goatcounter).toLowerCase() : '',
      cf: /^[a-f0-9]{32}$/i.test(line(st.cloudflare)) ? line(st.cloudflare) : ''
    };

    m.cover = safeAsset(d.portada);
    m.logo = safeAsset(d.logo);
    m.gallery = arr(d.galeria).map(safeAsset).filter(Boolean).slice(0, 12);
    m.credential = line(d.cedula, 100);
    m.domain = safeUrl(d.dominio).replace(/\/+$/, '');
    m.hideCredit = d.ocultarCredito === true;

    const mapa = line(d.mapa, 400);
    const isMapUrl = /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(mapa);
    m.mapQ = (!isMapUrl && mapa) || (m.address ? [name, m.address, zona].filter(Boolean).join(', ') : zona);
    m.mapLink = isMapUrl ? mapa : (m.mapQ ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(m.mapQ) : '');

    // Tema de colores
    const T = Object.assign({}, P.theme);
    const custom = hex(d.color);
    if (custom && custom !== T.primary) {
      T.primary = custom;
      T.accent = mix(custom, '#ffffff', 0.35);
      T.hero1 = mix(custom, '#000000', T.mode === 'dark' ? 0.9 : 0.74);
      T.hero2 = mix(custom, '#000000', T.mode === 'dark' ? 0.62 : 0.28);
    }
    T.onPrimary = contrast(T.primary, '#ffffff') >= contrast(T.primary, '#111111') ? '#ffffff' : '#111111';
    T.primaryText = readable(T.primary, T.bg);
    T.surface2 = T.mode === 'dark' ? mix(T.bg, '#ffffff', 0.035) : mix(T.bg, T.primary, 0.045);
    m.theme = T;
    m.upper = !!P.upper;
    return m;
  }

  /* ---------- iconos (trazos estilo Feather, licencia MIT) ---------- */
  const ICONS = {
    wa: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path transform="translate(7.3 6.6) scale(.42)" fill="currentColor" stroke="none" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    card: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    tiktok: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>'
  };
  const icon = (n) => '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';

  /* ---------- tipografías ---------- */
  function fontsHref(f) {
    const fam = {};
    [f.head, f.body].forEach((x) => {
      const w = x[1].split(';');
      fam[x[0]] = Array.from(new Set((fam[x[0]] || []).concat(w))).sort((a, b) => a - b);
    });
    return 'https://fonts.googleapis.com/css2?' + Object.keys(fam).map((n) => {
      const w = fam[n];
      return 'family=' + n.replace(/ /g, '+') + (w.length === 1 && w[0] === '400' ? '' : ':wght@' + w.join(';'));
    }).join('&') + '&display=swap';
  }

  function initial(name) {
    const words = name.split(/\s+/).filter((w) => !/^(el|la|los|las|de|del|y|the)$/i.test(w));
    return (words[0] || name).charAt(0).toUpperCase();
  }

  /* Favicon: el color del giro y su emoji. A propósito NO lleva la inicial ni nada parecido al logotipo
     del negocio: estos ejemplos son de negocios ficticios y un favicon con letra se podría confundir con
     la marca de un negocio real. El emoji es un carácter Unicode, no una imagen con derechos de autor. */
  function favicon(m) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="' + m.theme.primary + '"/><text x="32" y="45" text-anchor="middle" font-size="38">' + esc(m.P.emoji) + '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function absUrl(asset, base) {
    if (!asset) return '';
    if (/^https?:\/\//i.test(asset)) return asset;
    return base ? base.replace(/[^/]*$/, '') + asset : '';
  }

  /* ---------- textos legales del negocio (base; que los revise un abogado antes de usarlos) ---------- */
  function privacyRows(m, agencyBrand) {
    const where = [m.address, m.zona].filter(Boolean).join(', ');
    const contact = [m.email ? 'el correo ' + m.email : '', m.wa ? 'WhatsApp ' + prettyWa(m.wa) : '', m.phone ? 'el teléfono ' + m.phone : ''].filter(Boolean);
    return [
      ['Responsable', m.titular + (where ? ', con domicilio en ' + where : '') + ', es responsable del tratamiento de los datos personales que nos compartas por medio de esta página, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.'],
      ['Qué datos tratamos', m.orders
        ? 'Si haces un pedido, la página arma un mensaje de WhatsApp con tu nombre, la forma de entrega, tu dirección (si lo pides a domicilio) y tus notas. La página no guarda esos datos: solo nos llegan cuando tú envías el mensaje. Tu carrito se guarda únicamente en tu navegador.'
        : 'Esta página no te pide datos personales. Si nos escribes por WhatsApp o nos llamas, recibimos los datos que tú decidas compartir.'],
      ['Para qué los usamos', 'Para atender tu ' + (m.orders ? 'pedido' : 'solicitud') + ', contactarte sobre ' + (m.orders ? 'él' : 'ella') + ' y, en su caso, hacer la entrega. No los usamos para publicidad ni los vendemos.'],
      ['Con quién se comparten', 'Los mensajes viajan por WhatsApp (Meta), que los trata según sus propias políticas. ' + agencyBrand + ' administra esta página por encargo nuestro y solo trata datos para mantenerla funcionando.'],
      (m.stats.goat || m.stats.cf) ? ['Estadísticas de visitas', 'Contamos de forma anónima las visitas a esta página' + (m.stats.goat ? ' y los clics al botón de WhatsApp' : '') + ', sin cookies, con el servicio ' + (m.stats.goat ? 'GoatCounter' : 'Cloudflare Web Analytics') + '. Solo vemos totales, como cuántas personas entraron en el mes; no guardamos nada que te identifique.'] : null,
      ['Tus derechos', 'Puedes pedir el acceso, rectificación, cancelación u oposición al uso de tus datos (derechos ARCO), o revocar tu consentimiento, escribiéndonos ' + (contact.length ? 'a ' + listText(contact) : 'por los medios de contacto de esta página') + '.'],
      ['Cambios', 'Cualquier cambio a este aviso se publicará en esta misma página.']
    ];
  }
  function termsRows(m) {
    return [
      ['Precios', m.priceNote + ' Los precios pueden cambiar; se respeta el precio que te confirmemos para tu pedido.'],
      ['Cómo se hace un pedido', 'Armas tu pedido en esta página y lo envías por WhatsApp. El pedido queda confirmado cuando te respondemos con el total y el tiempo de entrega.'],
      ['Formas de pago', (m.pagos.length ? 'Aceptamos ' + m.ctx.pagos + '.' : 'Te confirmamos las formas de pago por WhatsApp.') + (m.terms.anticipo ? ' ' + m.terms.anticipo : '')],
      m.entrega ? ['Entregas', m.entrega + ' El costo y el tiempo de entrega se confirman por WhatsApp antes de preparar tu pedido.'] : null,
      ['Cancelaciones', m.terms.cancelaciones],
      ['Cambios y devoluciones', m.terms.devoluciones],
      ['Promociones', m.terms.promociones],
      m.terms.extra ? ['Otras condiciones', m.terms.extra] : null,
      ['Tus derechos como consumidor', 'Tienes los derechos que te da la Ley Federal de Protección al Consumidor. Si tienes una queja que no resolvamos, puedes acudir a la Procuraduría Federal del Consumidor (Profeco): Teléfono del Consumidor 55 5568 8722 y 800 468 8722, o en profeco.gob.mx.']
    ];
  }

  function jsonLd(m, url) {
    const o = { '@context': 'https://schema.org', '@type': m.P.schemaType, name: m.name, description: m.tagline };
    if (url) o.url = url;
    if (m.phone) o.telephone = m.phone; else if (m.wa) o.telephone = '+' + m.wa;
    if (m.email) o.email = m.email;
    if (m.address || m.zona) o.address = { '@type': 'PostalAddress', streetAddress: m.address || undefined, addressLocality: m.zona || undefined, addressCountry: 'MX' };
    const img = absUrl(m.cover || m.logo, url);
    if (img) o.image = img;
    const spec = [];
    DAYS.forEach((k) => m.hours[k].forEach((x) => spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: SCHEMA_DAYS[k], opens: hhmm(x[0]), closes: x[1] === 1440 ? '23:59' : hhmm(x[1]) })));
    if (spec.length) o.openingHoursSpecification = spec;
    if (m.social.length) o.sameAs = m.social.map((s) => s.url);
    if (m.P.schemaType === 'Restaurant' && url && m.catalog.length) o.hasMenu = url + '#catalogo';
    if (m.pagos.length) o.paymentAccepted = m.pagos.join(', ');
    o.currenciesAccepted = 'MXN';
    return JSON.stringify(o).replace(/</g, '\\u003c');
  }

  /* ---------- página completa ---------- */
  function renderSite(input, opts) {
    opts = opts || {};
    const mode = opts.mode || 'live'; // live | demo | example | preview
    const agency = Object.assign({ brand: '185ChangarroWeb', url: '', wa: '' }, api.AGENCY || {}, opts.agency || {});
    const home = opts.home || '/';
    const assets = opts.assets || api.ASSETS || { css: '', js: '' };
    const m = model(input, opts);
    const P = m.P, T = m.theme;
    const live = mode === 'live';
    const exMsg = 'Hola 👋 Vi el ejemplo «' + m.name + '» y quiero una página así para mi negocio.';
    const contactWa = mode === 'example' ? agency.wa : (m.wa || agency.wa);
    const wa = (msg) => esc(waLink(contactWa, mode === 'example' ? exMsg : msg));
    const tel = mode === 'example' ? '' : telHref(m.phone);
    const canonical = opts.canonical || '';
    const out = (url) => ' href="' + url + '" target="_blank" rel="noopener"';

    const hw = P.fonts.head[1].split(';').map(Number);
    const vars = {
      primary: T.primary, 'on-primary': T.onPrimary, 'primary-text': T.primaryText, accent: T.accent,
      bg: T.bg, surface: T.surface, 'surface-2': T.surface2, text: T.text, muted: T.muted,
      hero1: T.hero1, hero2: T.hero2,
      'font-head': "'" + P.fonts.head[0] + "', " + P.fonts.head[2],
      'font-body': "'" + P.fonts.body[0] + "', " + P.fonts.body[2],
      hw: hw.indexOf(700) > -1 ? 700 : Math.max.apply(null, hw),
      'hw-strong': Math.max.apply(null, hw)
    };
    const rootCss = ':root{color-scheme:' + (T.mode === 'dark' ? 'dark' : 'light') + ';' + Object.keys(vars).map((k) => '--' + k + ':' + vars[k]).join(';') + '}';

    /* --- encabezado --- */
    const nav = [];
    if (m.catalog.length) nav.push(['#catalogo', P.navLabel]);
    if (m.about) nav.push(['#nosotros', 'Nosotros']);
    if (m.hasHours || m.mapQ) nav.push(['#visitanos', 'Horario y ubicación']);
    if (m.faq.length) nav.push(['#preguntas', 'Preguntas']);
    // Sin logo propio, el distintivo es el emoji del giro (ver favicon): nada de iniciales que parezcan una marca.
    const mark = m.logo ? '<img class="brand-logo" src="' + esc(m.logo) + '" alt="">' : '<span class="brand-mark" aria-hidden="true">' + esc(P.emoji) + '</span>';

    let banner = '';
    if (mode === 'example') {
      banner = '<div class="py-bar"><div class="wrap"><p>🧪 <b>Negocio ficticio de ejemplo</b><span class="py-more"> hecho por ' + esc(agency.brand) + '</span></p><div class="py-bar-actions"><a href="' + esc(home) + '#precios">Ver precios</a><a class="py-bar-cta"' + out(esc(waLink(agency.wa, exMsg))) + '>Quiero una así</a></div></div></div>';
    } else if (mode === 'demo') {
      banner = '<div class="py-bar"><div class="wrap"><p>👀 <b>Vista previa</b><span class="py-more"> para ' + esc(m.name) + (m.sampleCatalog ? ' · textos y precios de ejemplo' : ' · aún sin publicar') + '</span></p><div class="py-bar-actions"><a href="' + esc(home) + 'crear/" data-py-edit>Editar</a><a class="py-bar-cta" data-py-publish' + out(esc(waLink(agency.wa, 'Hola 👋 Quiero publicar mi página «' + m.name + '».'))) + '>Publicar mi página</a></div></div></div>';
    }

    const header = '<header class="hdr"><div class="wrap hdr-in"><a class="brand" href="#inicio">' + mark + '<span>' + esc(m.name) + '</span></a>' +
      (nav.length ? '<nav class="nav" aria-label="Secciones">' + nav.map((n) => '<a href="' + n[0] + '">' + esc(n[1]) + '</a>').join('') + '</nav>' : '') +
      '<a class="btn btn-wa btn-sm"' + out(wa(P.greeting)) + '>' + icon('wa') + '<span>' + esc(P.ctaShort) + '</span></a></div></header>';

    /* --- portada --- */
    const cardRows = [];
    if (m.hasHours) cardRows.push('<div class="hc-row">' + icon('clock') + '<div><small>Hoy</small><b data-today>Consulta el horario abajo</b></div></div>');
    if (m.address || m.zona) cardRows.push('<div class="hc-row">' + icon('pin') + '<div><small>Dónde estamos</small><b>' + esc(m.address || m.zona) + '</b>' + (m.address && m.zona ? '<span>' + esc(m.zona) + '</span>' : '') + '</div></div>');
    if (m.entrega) cardRows.push('<div class="hc-row">' + icon('truck') + '<div><small>Entregas</small><b>' + esc(m.entrega) + '</b></div></div>');
    if (m.pagos.length) cardRows.push('<div class="hc-row">' + icon('card') + '<div><small>Formas de pago</small><b>' + esc(m.pagos.join(' · ')) + '</b></div></div>');
    const heroCard = cardRows.length ? '<aside class="hero-card">' + cardRows.join('') + (m.mapLink ? '<a class="hc-link"' + out(esc(m.mapLink)) + '>' + icon('nav') + 'Cómo llegar</a>' : '') + '</aside>' : '';

    const hero = '<section class="hero' + (m.cover ? ' has-cover' : '') + '" id="inicio">' +
      (m.cover ? '<img class="hero-cover" src="' + esc(m.cover) + '" alt="" fetchpriority="high">' : '') +
      '<div class="wrap hero-in"><div class="hero-copy">' +
      (m.hasHours ? '<p class="status" data-status hidden><span class="dot"></span><span data-status-text></span></p>' : '') +
      '<h1>' + esc(m.name) + '</h1><p class="lead">' + esc(m.tagline) + '</p><div class="hero-actions">' +
      '<a class="btn btn-wa btn-lg"' + out(wa(P.greeting)) + '>' + icon('wa') + esc(P.ctaLabel) + '</a>' +
      (m.catalog.length ? '<a class="btn btn-glass btn-lg" href="#catalogo">Ver ' + esc(P.navLabel.toLowerCase()) + '</a>' : '') +
      (tel ? '<a class="btn btn-glass btn-lg" href="' + esc(tel) + '">' + icon('phone') + 'Llamar</a>' : '') +
      '</div></div>' + heroCard + '</div></section>';

    /* --- ventajas --- */
    const perks = m.highlights.length ? '<section class="perks"><div class="wrap perks-grid">' + m.highlights.map((h) =>
      '<div class="perk"><span class="perk-ico" aria-hidden="true">' + esc(h.icon || '✓') + '</span><div><h3>' + esc(h.title) + '</h3>' + (h.text ? '<p>' + esc(h.text) + '</p>' : '') + '</div></div>').join('') + '</div></section>' : '';

    /* --- catálogo --- */
    const itemHtml = (it) => {
      let act = '';
      if (m.orders) act = '<button class="add" type="button" data-add="' + it.id + '" aria-label="Agregar ' + esc(it.name) + '">' + icon('plus') + '<span>Agregar</span><b class="badge" hidden></b></button>';
      else if (P.itemAction) act = '<a class="add"' + out(wa(fill(P.itemMessage, { item: it.name }))) + '>' + esc(P.itemAction) + '</a>';
      return '<article class="item">' + (it.photo ? '<img src="' + esc(it.photo) + '" alt="' + esc(it.name) + '" loading="lazy" width="88" height="88">' : '') +
        '<div class="item-body"><div class="item-top"><h4>' + esc(it.name) + '</h4>' + (it.price.label ? '<span class="price">' + esc(it.price.label) + '</span>' : '') + '</div>' +
        (it.desc ? '<p>' + esc(it.desc) + '</p>' : '') + (act ? '<div class="item-act">' + act + '</div>' : '') + '</div></article>';
    };
    const catalog = m.catalog.length ? '<section class="sec" id="catalogo"><div class="wrap"><div class="sec-head"><p class="eyebrow">' + esc(P.catalogEyebrow) + '</p><h2>' + esc(m.catalogTitle) + '</h2>' +
      (m.catalogIntro ? '<p>' + esc(m.catalogIntro) + '</p>' : '') +
      (!live && m.sampleCatalog ? '<p class="note">✏️ Productos y precios de ejemplo: se cambian por los tuyos.</p>' : '') + '</div>' +
      (m.catalog.length > 1 ? '<nav class="chips" aria-label="Categorías">' + m.catalog.map((c) => '<a class="chip" href="#' + c.id + '">' + esc(c.title || P.navLabel) + '</a>').join('') + '</nav>' : '') +
      m.catalog.map((c) => '<div class="cat" id="' + c.id + '">' + (c.title ? '<h3 class="cat-title">' + esc(c.title) + '</h3>' : '') + '<div class="items">' + c.items.map(itemHtml).join('') + '</div></div>').join('') +
      '<p class="price-note">' + esc(m.priceNote) + (m.showTerms ? ' Consulta los <a href="#terminos" data-legal>términos y condiciones</a>.' : '') + '</p>' +
      '</div></section>' : '';

    /* --- nosotros --- */
    let aside = '';
    if (m.cover) aside = '<img class="about-img" src="' + esc(m.cover) + '" alt="' + esc(m.name) + '" loading="lazy">';
    else {
      const cut = m.tagline.indexOf('. ');
      aside = '<div class="about-art" aria-hidden="true"><span class="emo">' + esc(P.emoji) + '</span><p>' + esc(cut > -1 ? m.tagline.slice(0, cut + 1) : m.tagline) + '</p><small>' + esc(m.name) + '</small></div>';
    }
    const about = m.about ? '<section class="sec sec-alt" id="nosotros"><div class="wrap about"><div class="about-copy"><p class="eyebrow">Nosotros</p><h2>' + esc(m.aboutTitle) + '</h2>' + paras(m.about) +
      (m.credential ? '<p class="cred">' + esc(m.credential) + '</p>' : '') +
      (m.social.length ? '<div class="socials">' + m.social.map((s) => '<a' + out(esc(s.url)) + '>' + icon(s.k) + esc(s.label) + '</a>').join('') + '</div>' : '') +
      '</div>' + aside + '</div></section>' : '';

    const gallery = m.gallery.length ? '<section class="sec" id="galeria"><div class="wrap"><div class="sec-head"><p class="eyebrow">Galería</p><h2>Así se ve ' + esc(m.name) + '</h2></div><div class="gallery">' +
      m.gallery.map((g) => '<img src="' + esc(g) + '" alt="" loading="lazy">').join('') + '</div></div></section>' : '';

    /* --- horario y ubicación --- */
    let visit = '';
    if (m.hasHours || m.mapQ || m.mapLink) {
      const groups = groupHours(m.hours, m.h24);
      const contact = [];
      if (contactWa && mode !== 'example') contact.push('<a' + out(wa(P.greeting)) + '>' + icon('wa') + 'WhatsApp ' + esc(prettyWa(contactWa)) + '</a>');
      if (tel) contact.push('<a href="' + esc(tel) + '">' + icon('phone') + esc(m.phone) + '</a>');
      visit = '<section class="sec" id="visitanos"><div class="wrap"><div class="sec-head"><p class="eyebrow">Visítanos</p><h2>Horario y ubicación</h2></div><div class="visit"><div class="card">' +
        (m.hasHours ? '<h3>' + icon('clock') + 'Horario</h3><table class="hours"><tbody>' + groups.map((g) => '<tr data-days="' + g.days.join(',') + '"><th scope="row">' + esc(g.label) + '</th><td>' + esc(g.text) + '</td></tr>').join('') + '</tbody></table>' : '') +
        (m.address || m.zona ? '<h3>' + icon('pin') + 'Dirección</h3><p class="addr">' + esc(m.address) + (m.address && m.zona ? '<br>' : '') + esc(m.zona) + '</p>' : '') +
        (contact.length ? '<div class="contact">' + contact.join('') + '</div>' : '') +
        '<div class="visit-actions">' + (m.mapLink ? '<a class="btn btn-primary"' + out(esc(m.mapLink)) + '>' + icon('nav') + 'Cómo llegar</a>' : '') +
        '<a class="btn btn-outline"' + out(wa(P.greeting)) + '>' + icon('wa') + esc(P.ctaShort) + ' por WhatsApp</a></div></div>' +
        (m.mapQ ? '<div class="map-wrap"><iframe class="map" src="' + esc('https://www.google.com/maps?q=' + encodeURIComponent(m.mapQ) + '&output=embed') + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa de ' + esc(m.name) + '"></iframe></div>' : '') +
        '</div></div></section>';
    }

    const faq = m.faq.length ? '<section class="sec sec-alt" id="preguntas"><div class="wrap faq-wrap"><div class="sec-head"><p class="eyebrow">Preguntas frecuentes</p><h2>Resolvemos tus dudas</h2><p>¿No encuentras tu respuesta? Escríbenos por WhatsApp.</p></div><div class="faq">' +
      m.faq.map((f) => '<details><summary>' + esc(f.q) + '</summary><div>' + paras(f.a) + '</div></details>').join('') + '</div></div></section>' : '';

    const band = '<section class="cta-band"><div class="wrap"><div class="cta-in"><div><h2>' + esc(P.ctaBandTitle) + '</h2><p>' + esc(P.ctaBandText) + '</p></div><a class="btn btn-wa btn-lg"' + out(wa(P.greeting)) + '>' + icon('wa') + esc(P.ctaLabel) + '</a></div></div></section>';

    const year = new Date().getFullYear();
    const credit = m.hideCredit ? '' : '<span>Página creada con <a href="' + esc((agency.url || home).replace(/\/+$/, '') + '/?ref=' + m.slug) + '" rel="noopener">' + esc(agency.brand) + '</a></span>';
    // Datos del negocio siempre visibles (Ley Federal de Protección al Consumidor, art. 76 bis).
    const bizData = [];
    if (m.titular !== m.name) bizData.push(esc(m.titular));
    if (m.address || m.zona) bizData.push(esc([m.address, m.zona].filter(Boolean).join(', ')));
    if (tel) bizData.push('Tel. <a href="' + esc(tel) + '">' + esc(m.phone) + '</a>');
    if (contactWa && mode !== 'example') bizData.push('WhatsApp <a' + out(wa(P.greeting)) + '>' + esc(prettyWa(contactWa)) + '</a>');
    if (m.email) bizData.push('<a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a>');
    if (m.credential) bizData.push(esc(m.credential));
    const sample = live ? '' : ' <small>(ejemplo)</small>';
    const legalBlock = (id, title, rows) => '<details class="legal" id="' + id + '"><summary>' + title + sample + '</summary><div class="legal-in">' +
      rows.filter(Boolean).map((r) => '<h4>' + esc(r[0]) + '</h4><p>' + esc(r[1]) + '</p>').join('') + '</div></details>';
    const footer = '<footer class="ftr"><div class="wrap ftr-in"><div><p class="ftr-name">' + esc(m.name) + '</p>' +
      (bizData.length ? '<ul class="ftr-data">' + bizData.map((x) => '<li>' + x + '</li>').join('') + '</ul>' : '') + '</div>' +
      '<div class="ftr-links">' + m.social.map((s) => '<a' + out(esc(s.url)) + '>' + icon(s.k) + esc(s.label) + '</a>').join('') + '<a' + out(wa(P.greeting)) + '>' + icon('wa') + 'WhatsApp</a></div></div>' +
      '<div class="wrap ftr-legal">' + legalBlock('aviso-privacidad', 'Aviso de privacidad', privacyRows(m, agency.brand)) +
      (m.showTerms ? legalBlock('terminos', 'Términos y condiciones', termsRows(m)) : '') + '</div>' +
      '<div class="wrap ftr-bottom"><span>© ' + year + ' ' + esc(m.name) + '</span>' + credit + '</div></footer>';

    /* --- pedidos --- */
    const fab = '<a class="fab"' + out(wa(P.greeting)) + ' aria-label="Escríbenos por WhatsApp" data-fab>' + icon('wa') + '</a>';
    let cart = '';
    if (m.orders) {
      cart = '<div class="cartbar" data-cartbar hidden><button type="button" class="cartbar-btn" data-open-cart>' + icon('bag') + '<span><b data-count>0</b> <span data-count-label>productos</span></span><span class="cartbar-total" data-total>$0</span><span class="cartbar-go">Ver pedido</span></button></div>' +
        '<dialog class="sheet" id="py-cart" aria-labelledby="py-cart-t"><div class="sheet-in"><div class="sheet-head"><h2 id="py-cart-t">Tu pedido</h2><button type="button" class="x" data-close aria-label="Cerrar">' + icon('x') + '</button></div>' +
        '<ul class="lines" data-lines></ul><div class="sum"><span>Total</span><b data-total>$0</b></div>' +
        '<form class="order-form" data-order-form><label class="fld"><span>Tu nombre</span><input name="nombre" autocomplete="name" maxlength="60"></label>' +
        (m.entrega ? '<div class="seg"><label><input type="radio" name="modo" value="recoger" checked><span>Paso a recoger</span></label><label><input type="radio" name="modo" value="domicilio"><span>A domicilio</span></label></div><label class="fld" data-addr hidden><span>Dirección de entrega</span><textarea name="direccion" rows="2" maxlength="220" autocomplete="street-address"></textarea></label>' : '') +
        '<label class="fld"><span>Notas <small>(opcional)</small></span><input name="notas" maxlength="200" placeholder="' + esc(P.notesPlaceholder || 'Ej. color, talla o cualquier detalle') + '"></label>' +
        '<button class="btn btn-wa btn-block btn-lg" type="submit">' + icon('wa') + 'Enviar pedido por WhatsApp</button>' +
        '<p class="fine">Se abre WhatsApp con tu pedido listo para enviar. Al enviarlo aceptas los <a href="#terminos" data-legal>términos y condiciones</a> y el <a href="#aviso-privacidad" data-legal>aviso de privacidad</a>.</p><button type="button" class="link-btn" data-clear>Vaciar pedido</button></form></div></dialog>';
    }
    let preview = '';
    if (!live) {
      preview = '<dialog class="sheet" id="py-preview" aria-labelledby="py-prev-t"><div class="sheet-in"><div class="sheet-head"><h2 id="py-prev-t">Así le llega el mensaje al negocio</h2><button type="button" class="x" data-close aria-label="Cerrar">' + icon('x') + '</button></div>' +
        '<div class="wa-chat"><div class="wa-bubble" data-msg></div></div>' +
        (mode === 'example'
          ? '<p class="fine">Es un ejemplo: en una página real, el pedido llega directo al WhatsApp del negocio, sin comisiones.</p><a class="btn btn-primary btn-block"' + out(esc(waLink(agency.wa, exMsg))) + '>Quiero esto para mi negocio</a>'
          : '<p class="fine">Cuando la página esté publicada, este mensaje llegará directo al WhatsApp del negocio.</p><a class="btn btn-wa btn-block" data-msg-open' + out('#') + '>' + icon('wa') + 'Probar en WhatsApp</a>') +
        '</div></dialog>';
    }

    const runtime = {
      mode, slug: m.slug, name: m.name, wa: contactWa, tz: m.tz, h24: m.h24, hours: m.hours,
      orders: m.orders, delivery: !!m.entrega, agencyWa: agency.wa, home, goat: live && !!m.stats.goat,
      items: m.orders ? m.catalog.reduce((a, c) => a.concat(c.items.map((it) => ({ id: it.id, name: it.name, price: it.price.value, label: it.price.label }))), []) : []
    };

    const desc = m.tagline;
    const ogImg = absUrl(m.cover, canonical);
    const head = '<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
      '<title>' + esc(m.seoTitle) + '</title><meta name="description" content="' + esc(desc) + '"><meta name="theme-color" content="' + esc(T.hero1) + '">' +
      (canonical ? '<link rel="canonical" href="' + esc(canonical) + '">' : '') +
      (live ? '' : '<meta name="robots" content="noindex">') +
      '<meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:title" content="' + esc(m.name) + '"><meta property="og:description" content="' + esc(desc) + '">' +
      (canonical ? '<meta property="og:url" content="' + esc(canonical) + '">' : '') + (ogImg ? '<meta property="og:image" content="' + esc(ogImg) + '">' : '') +
      '<link rel="icon" href="' + esc(favicon(m)) + '">' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="' + esc(fontsHref(P.fonts)) + '">' +
      '<style>' + rootCss + assets.css + '</style>' +
      (live ? '<script type="application/ld+json">' + jsonLd(m, canonical) + '</script>' : '') +
      (live && m.stats.goat ? '<script data-goatcounter="https://' + m.stats.goat + '.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>' : '') +
      (live && m.stats.cf ? '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="' + esc('{"token": "' + m.stats.cf + '"}') + '"></script>' : '') +
      '</head>';

    return head + '<body class="mode-' + T.mode + (m.upper ? ' upper' : '') + ' is-' + mode + '">' + banner + header + '<main>' + hero + perks + catalog + about + gallery + visit + faq + band + '</main>' + footer + fab + cart + preview +
      '<script type="application/json" id="py-data">' + JSON.stringify(runtime).replace(/</g, '\\u003c') + '</script><script>' + assets.js + '</script></body></html>';
  }

  /* ---------- cartel con código QR para imprimir ---------- */
  function renderQr(input, opts) {
    opts = opts || {};
    const m = model(input, opts);
    const url = opts.url || '';
    const T = m.theme;
    return '<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">' +
      '<title>Código QR · ' + esc(m.name) + '</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="' + esc(fontsHref(m.P.fonts)) + '">' +
      '<style>*{box-sizing:border-box}body{margin:0;background:#e9e9ee;font-family:\'' + m.P.fonts.body[0] + '\',system-ui,sans-serif;color:#111;display:grid;place-items:center;min-height:100vh;padding:24px}' +
      '.poster{width:min(100%,560px);aspect-ratio:8.5/11;background:#fff;border-radius:18px;box-shadow:0 20px 60px -20px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center;padding:44px 40px;border-top:16px solid ' + T.primary + '}' +
      '.name{font:' + (m.P.fonts.head[1].split(';').pop()) + ' 2.1rem/1.1 \'' + m.P.fonts.head[0] + '\',sans-serif;margin:0;' + (m.upper ? 'text-transform:uppercase;' : '') + '}' +
      'h1{font-size:1.25rem;font-weight:600;margin:14px 0 0;color:#333}#qr{padding:18px;border:3px solid ' + T.primary + ';border-radius:22px;margin:22px 0}#qr img,#qr canvas{width:260px!important;height:260px!important;display:block}' +
      '.url{font-weight:700;font-size:1rem;word-break:break-all;margin:0}.wa{margin:8px 0 0;color:#444}.tip{margin-top:20px;color:#666;font-size:.9rem;font-family:system-ui,sans-serif}' +
      'button{margin-top:16px;padding:12px 22px;border-radius:999px;border:0;background:#111;color:#fff;font:600 1rem system-ui,sans-serif;cursor:pointer}' +
      '@media (max-width:480px){body{padding:12px}.poster{padding:28px 18px;aspect-ratio:auto;gap:8px}.name{font-size:1.6rem}#qr{padding:12px}#qr img,#qr canvas{width:min(240px,62vw)!important;height:auto!important}}' +
      '@media print{body{background:#fff;padding:0;display:block}.poster{box-shadow:none;border-radius:0;width:100%;height:100vh;aspect-ratio:auto}.no-print{display:none}}@page{size:letter;margin:12mm}</style></head>' +
      '<body><div><main class="poster"><div><p class="name">' + esc(m.name) + '</p><h1>' + esc(m.P.qrText) + '</h1></div><div id="qr" role="img" aria-label="Código QR"></div><div><p class="url">' + esc(url.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</p>' +
      (m.wa ? '<p class="wa">WhatsApp: ' + esc(prettyWa(m.wa)) + '</p>' : '') + '</div></main>' +
      '<div class="no-print" style="text-align:center"><button onclick="print()">Imprimir o guardar como PDF</button><p class="tip">Consejo: imprímelo en tamaño carta y ponlo en tu mostrador, mesas o aparador.</p></div></div>' +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script><script>new QRCode(document.getElementById("qr"),{text:' + JSON.stringify(url).replace(/</g, '\\u003c') + ',width:520,height:520,colorDark:"#111111",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});</script></body></html>';
  }

  /* ---------- enlaces de vista previa ---------- */
  function b64u(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64u(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s), out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  async function encodeData(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (typeof CompressionStream === 'function') {
      try {
        const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
        return 'z' + b64u(new Uint8Array(await new Response(stream).arrayBuffer()));
      } catch (e) { /* sin compresión */ }
    }
    return 'j' + b64u(bytes);
  }
  async function decodeData(s) {
    let bytes = unb64u(s.slice(1));
    if (s[0] === 'z') {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  // Enlace corto: /demo/?t=tipo&n=nombre&w=whatsapp&z=zona&dir=direccion&tel=telefono&c=color
  const PARAMS = { t: 'tipo', n: 'nombre', w: 'whatsapp', z: 'zona', dir: 'direccion', tel: 'telefono', e: 'eslogan' };
  function fromParams(q) {
    const d = {};
    Object.keys(PARAMS).forEach((k) => { const v = q.get(k); if (v) d[PARAMS[k]] = v; });
    const c = q.get('c');
    if (c && /^[0-9a-f]{3,6}$/i.test(c)) d.color = '#' + c;
    return d;
  }
  function toParams(d) {
    const q = [];
    Object.keys(PARAMS).forEach((k) => { if (d[PARAMS[k]]) q.push(k + '=' + encodeURIComponent(d[PARAMS[k]])); });
    if (d.color) q.push('c=' + d.color.replace('#', ''));
    return q.join('&');
  }

  return Object.assign(api, {
    renderSite, renderQr, model, icon, catalogToText, textToCatalog, parseDay, groupHours, rangesText,
    waNumber, waLink, prettyWa, price, money, slugify, fill, esc, encodeData, decodeData, fromParams, toParams, PARAMS
  });
});
