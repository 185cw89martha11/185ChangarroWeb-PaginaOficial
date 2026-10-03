#!/usr/bin/env node
/*
 * 185ChangarroWeb · build
 * Genera el sitio completo en dist/: sitio de ventas, ejemplos y las páginas de cada cliente.
 * Sin dependencias: solo Node 18 o superior. Todas las rutas son relativas, así que dist/
 * funciona en Render y también abriendo dist/index.html con doble clic.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const CLIENTES = path.join(ROOT, 'clientes');

// Carpetas que ya usa el sitio: un cliente no puede llamarse así.
const RESERVED = new Set(['assets', 'crear', 'demo', 'ejemplos', 'herramientas', 'privacidad', 'prospectar', 'img', 'admin', 'api', 'clientes']);
const KNOWN_KEYS = new Set(['tipo', 'nombre', 'titular', 'slug', 'eslogan', 'seoTitulo', 'whatsapp', 'telefono', 'correo', 'direccion', 'zona', 'mapa', 'zonaHoraria', 'formato24h',
  'horario', 'nosotros', 'nosotrosTitulo', 'destacados', 'catalogo', 'catalogoTitulo', 'catalogoIntro', 'pedidos', 'entrega', 'preguntas', 'pagos',
  'redes', 'portada', 'logo', 'galeria', 'cedula', 'dominio', 'ocultarCredito', 'color', 'preciosVigentes', 'leyendaPrecios', 'terminos', 'estadisticas']);

function fresh(file) { delete require.cache[require.resolve(file)]; return require(file); }
const read = (...p) => fs.readFileSync(path.join(...p), 'utf8');
function write(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
function copyDir(from, to, skip) {
  if (!fs.existsSync(from)) return;
  for (const ent of fs.readdirSync(from, { withFileTypes: true })) {
    if (skip && skip(ent.name)) continue;
    const a = path.join(from, ent.name), b = path.join(to, ent.name);
    if (ent.isDirectory()) copyDir(a, b, skip);
    else { fs.mkdirSync(to, { recursive: true }); fs.copyFileSync(a, b); }
  }
}
function minCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
}
const escXml = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
function sitemapXml(urls) {
  const day = new Date().toISOString().slice(0, 10);
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => '  <url><loc>' + escXml(u) + '</loc><lastmod>' + day + '</lastmod></url>').join('\n') + '\n</urlset>\n';
}

function validateClient(d, slug, PRESETS, PY, warn, fail) {
  const where = 'clientes/' + slug + '/datos.json';
  if (!d || typeof d !== 'object' || Array.isArray(d)) return fail(where + ': debe ser un objeto JSON { … }.');
  if (!d.nombre) fail(where + ': falta "nombre".');
  if (!PRESETS[d.tipo]) fail(where + ': "tipo" debe ser uno de: ' + Object.keys(PRESETS).join(', ') + '.');
  if (!PY.waNumber(d.whatsapp)) warn(where + ': "whatsapp" vacío o inválido; los botones usarán el WhatsApp de la agencia.');
  if (!Array.isArray(d.catalogo)) warn(where + ': no tiene "catalogo"; se mostrarán productos DE EJEMPLO. Pon los reales o "catalogo": [] para ocultar la sección.');
  if (d.dominio && !/^https:\/\/[^/\s]+\/?$/.test(d.dominio)) warn(where + ': "dominio" debe verse así: "https://www.tunegocio.com".');
  // Base legal de 185ChangarroWeb: datos del negocio visibles y precios con fecha de vigencia.
  const faltan = [['direccion', 'dirección'], ['telefono', 'teléfono'], ['correo', 'correo']].filter((x) => !d[x[0]]).map((x) => x[1]);
  if (faltan.length) warn(where + ': faltan datos del negocio para el pie (Profeco pide nombre, dirección, teléfono y correo visibles): ' + faltan.join(', ') + '.');
  if (Array.isArray(d.catalogo) && d.catalogo.length && !d.preciosVigentes) warn(where + ': agrega "preciosVigentes" (ej. "2026-10-05") para la leyenda de precios.');
  if (d.tipo === 'salud' && !d.cedula) warn(where + ': es consultorio y no tiene "cedula" (la Ley General de Salud la pide en la publicidad).');
  for (const k of Object.keys(d)) if (!KNOWN_KEYS.has(k) && !k.startsWith('_')) warn(where + ': campo desconocido "' + k + '" (¿error de escritura?). Se ignora.');
  const files = [d.portada, d.logo].concat(Array.isArray(d.galeria) ? d.galeria : [])
    .concat((Array.isArray(d.catalogo) ? d.catalogo : []).reduce((a, c) => a.concat((c.productos || []).map((p) => p.foto)), []));
  for (const f of files) {
    if (f && !/^https?:\/\//i.test(f) && !fs.existsSync(path.join(CLIENTES, slug, f))) warn(where + ': no encuentro la imagen "' + f + '" dentro de clientes/' + slug + '/.');
  }
}

function build(options) {
  const quiet = options && options.quiet;
  const t0 = Date.now();
  const warnings = [], errors = [];
  const warn = (m) => warnings.push(m), fail = (m) => errors.push(m);

  let cfg;
  try { cfg = JSON.parse(read(ROOT, 'config.json')); } catch (e) { throw new Error('config.json no es un JSON válido: ' + e.message); }
  const PRESETS = fresh(path.join(SRC, 'presets.js'));
  const PY = fresh(path.join(SRC, 'render.js'));
  const pages = fresh(path.join(SRC, 'agency', 'pages.js'));

  cfg.marca = cfg.marca || '185ChangarroWeb';
  cfg.urlSitio = String(cfg.urlSitio || 'https://one85changarroweb-negocios.onrender.com').replace(/\/+$/, '');
  cfg.wa = PY.waNumber(cfg.whatsapp);
  if (!cfg.wa) warn('config.json: "whatsapp" no está configurado. Escribe tu número (52 + 10 dígitos) para que funcionen los botones.');
  if (!Array.isArray(cfg.planes) || !cfg.planes.length) warn('config.json: no hay "planes". Corre: npm run planes');
  if (fs.existsSync(path.join(SRC, 'static', 'og.png'))) cfg.ogImage = 'og.png';

  PY.PRESETS = PRESETS;
  PY.ASSETS = { css: minCss(read(SRC, 'site.css')), js: read(SRC, 'site.js') };
  PY.AGENCY = { brand: cfg.marca, url: cfg.urlSitio, wa: cfg.wa };

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  const ver = Date.now().toString(36);

  /* recursos */
  write('assets/engine.js', [read(SRC, 'presets.js'), read(SRC, 'render.js'),
    'Changarro.PRESETS = ChangarroPresets;',
    'Changarro.ASSETS = ' + JSON.stringify(PY.ASSETS) + ';',
    'Changarro.AGENCY = ' + JSON.stringify(PY.AGENCY) + ';'].join('\n'));
  write('assets/agency.css', minCss(read(SRC, 'agency', 'agency.css')));
  for (const f of ['builder.js', 'demo.js', 'prospectar.js', 'tool.js']) write('assets/' + f, read(SRC, 'agency', f));
  copyDir(path.join(SRC, 'static'), DIST);

  /* sitio de la agencia */
  const A = pages(cfg, PY, PRESETS, ver);
  write('index.html', A.home);
  write('crear/index.html', A.crear);
  write('vista-previa/index.html', A.demo);
  write('prospectar/index.html', A.prospectar);
  write('herramientas/link-de-whatsapp/index.html', A.tool);
  write('privacidad-del-sitio/index.html', A.privacy);
  write('404.html', A.notFound);

  /* ejemplos (negocios ficticios) */
  for (const id of Object.keys(PRESETS)) {
    const ex = PRESETS[id].example;
    const data = { tipo: id, nombre: ex.nombre, zona: ex.zona };
    const url = cfg.urlSitio + '/ejemplos/' + id + '/';
    write('ejemplos/' + id + '/index.html', PY.renderSite(data, { mode: 'example', home: '../../', canonical: url }));
    write('ejemplos/' + id + '/qr/index.html', PY.renderQr(data, { url }));
  }

  /* clientes */
  const sitemap = ['/', '/crear/', '/herramientas/link-de-whatsapp/', '/privacidad/'].map((p) => cfg.urlSitio + p);
  const clients = [];
  if (fs.existsSync(CLIENTES)) {
    for (const ent of fs.readdirSync(CLIENTES, { withFileTypes: true })) {
      if (!ent.isDirectory() || /^[_.]/.test(ent.name)) continue;
      const slug = ent.name;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) { fail('clientes/' + slug + ': la carpeta solo puede tener minúsculas, números y guiones (ej. tacos-el-guero).'); continue; }
      if (RESERVED.has(slug)) { fail('clientes/' + slug + ': "' + slug + '" es un nombre reservado del sitio. Usa otro.'); continue; }
      const file = path.join(CLIENTES, slug, 'datos.json');
      if (!fs.existsSync(file)) { fail('clientes/' + slug + ': falta el archivo datos.json.'); continue; }
      let data;
      try { data = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')); } catch (e) { fail('clientes/' + slug + '/datos.json no es un JSON válido: ' + e.message); continue; }
      const before = errors.length;
      validateClient(data, slug, PRESETS, PY, warn, fail);
      if (errors.length > before) continue;

      const own = data.dominio && /^https:\/\//.test(data.dominio) ? String(data.dominio).replace(/\/+$/, '') : '';
      const pageUrl = (own || cfg.urlSitio + '/' + slug) + '/';
      data.slug = slug;
      write(slug + '/index.html', PY.renderSite(data, { mode: 'live', canonical: pageUrl }));
      write(slug + '/qr/index.html', PY.renderQr(data, { url: pageUrl }));
      copyDir(path.join(CLIENTES, slug), path.join(DIST, slug), (name) => name === 'datos.json' || name.startsWith('.') || name.startsWith('_'));
      if (own) {
        write(slug + '/robots.txt', 'User-agent: *\nAllow: /\nSitemap: ' + own + '/sitemap.xml\n');
        write(slug + '/sitemap.xml', sitemapXml([pageUrl]));
      } else sitemap.push(pageUrl);
      clients.push({ slug, url: pageUrl });
    }
  }
  write('sitemap.xml', sitemapXml(sitemap));
  // El portal comparte dominio con este sitio, así que sus carpetas privadas también van aquí (cfg.noIndexar).
  const noIndexar = ['/vista-previa/', '/prospectar/'].concat(cfg.noIndexar || []);
  write('robots.txt', 'User-agent: *\nAllow: /\n' + noIndexar.map((p) => 'Disallow: ' + p).join('\n') + '\nSitemap: ' + cfg.urlSitio + '/sitemap.xml\n');

  if (!quiet) {
    const ms = Date.now() - t0;
    console.log('\n✔ ' + cfg.marca + ' generado en dist/ (' + ms + ' ms)');
    console.log('  • Sitio: inicio, /crear/, /demo/, /prospectar/, herramienta de WhatsApp, privacidad');
    console.log('  • Ejemplos: ' + Object.keys(PRESETS).length + ' (' + Object.keys(PRESETS).join(', ') + ')');
    console.log('  • Clientes publicados: ' + clients.length);
    clients.forEach((c) => console.log('      ' + c.url));
    if (warnings.length) { console.log('\n⚠ Avisos:'); warnings.forEach((w) => console.log('  - ' + w)); }
    if (errors.length) { console.log('\n✖ Errores (esas páginas NO se generaron):'); errors.forEach((e) => console.log('  - ' + e)); }
    console.log('');
  }
  return { warnings, errors, clients };
}

module.exports = build;

if (require.main === module) {
  try {
    const r = build();
    if (r.errors.length) process.exitCode = 1;
  } catch (e) {
    console.error('\n✖ ' + e.message + '\n');
    process.exitCode = 1;
  }
}
