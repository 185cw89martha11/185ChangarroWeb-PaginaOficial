#!/usr/bin/env node
/* 185ChangarroWeb · pruebas rápidas del motor (npm test) */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PRESETS = require('../src/presets.js');
const PY = require('../src/render.js');
PY.PRESETS = PRESETS;
PY.ASSETS = { css: '', js: '' };
PY.AGENCY = { brand: '185ChangarroWeb', url: 'https://ejemplo.onrender.com', wa: '525512345678' };

let passed = 0;
const pending = [];
function fail(name, e) { console.error('✖ ' + name + '\n  ' + e.message); process.exitCode = 1; }
function t(name, fn) {
  try {
    const r = fn();
    if (r && typeof r.then === 'function') pending.push(r.then(() => { passed++; }, (e) => fail(name, e)));
    else passed++;
  } catch (e) { fail(name, e); }
}

t('números de WhatsApp', () => {
  assert.strictEqual(PY.waNumber('55 1234 5678'), '525512345678');
  assert.strictEqual(PY.waNumber('+52 1 55 1234 5678'), '525512345678');
  assert.strictEqual(PY.waNumber('525512345678'), '525512345678');
  assert.strictEqual(PY.waNumber('123'), '');
  assert.strictEqual(PY.prettyWa('525512345678'), '55 1234 5678');
  assert.strictEqual(PY.prettyWa('524421234567'), '442 123 4567');
});

t('precios', () => {
  assert.deepStrictEqual(PY.price(18), { value: 18, label: '$18' });
  assert.deepStrictEqual(PY.price('$1,200'), { value: 1200, label: '$1,200' });
  assert.deepStrictEqual(PY.price('35.50'), { value: 35.5, label: '$35.50' });
  assert.deepStrictEqual(PY.price('120 MXN'), { value: 120, label: '$120' });
  assert.strictEqual(PY.price('Desde $900').value, null);
  assert.strictEqual(PY.price('Cotizar').label, 'Cotizar');
});

t('horarios', () => {
  assert.deepStrictEqual(PY.parseDay('09:00-14:00, 16:00-20:00'), [[540, 840], [960, 1200]]);
  assert.deepStrictEqual(PY.parseDay('13:00-01:00'), [[780, 1500]]);
  assert.deepStrictEqual(PY.parseDay('9 am - 8 pm'), [[540, 1200]]);
  assert.deepStrictEqual(PY.parseDay('9 a 20'), [[540, 1200]]);
  assert.deepStrictEqual(PY.parseDay('Cerrado'), []);
  assert.deepStrictEqual(PY.parseDay(''), []);
  assert.deepStrictEqual(PY.parseDay('24 horas'), [[0, 1440]]);
  const g = PY.groupHours({ lun: [[540, 1200]], mar: [[540, 1200]], mie: [[540, 1200]], jue: [[540, 1200]], vie: [[540, 1200]], sab: [[540, 840]], dom: [] });
  assert.deepStrictEqual(g.map((x) => x.label), ['Lunes a viernes', 'Sábado', 'Domingo']);
  assert.strictEqual(g[0].text, '9:00 am – 8:00 pm');
  assert.strictEqual(g[2].text, 'Cerrado');
});

t('plantillas con corchetes', () => {
  assert.strictEqual(PY.fill('Sabor[ en {zona}].', { zona: 'Coyoacán' }), 'Sabor en Coyoacán.');
  assert.strictEqual(PY.fill('Sabor[ en {zona}].', { zona: '' }), 'Sabor.');
  assert.strictEqual(PY.fill('Sabor en {zona}. Pide.', { zona: 'Monterrey, N.L.' }), 'Sabor en Monterrey, N.L. Pide.');
  assert.strictEqual(PY.fill('Espera...', {}), 'Espera...');
});

t('catálogo ida y vuelta', () => {
  for (const id of Object.keys(PRESETS)) {
    const txt = PY.catalogToText(PRESETS[id].catalogo);
    const back = PY.textToCatalog(txt);
    assert.strictEqual(PY.catalogToText(back), txt, 'tipo ' + id);
    assert.strictEqual(back.reduce((n, c) => n + c.productos.length, 0), PRESETS[id].catalogo.reduce((n, c) => n + c.productos.length, 0));
  }
  const c = PY.textToCatalog('Sin categoría | 10\n# Bebidas\nAgua | $25 | Fresca | de verdad');
  assert.strictEqual(c[0].categoria, '');
  assert.strictEqual(c[1].productos[0].precio, 25);
  assert.strictEqual(c[1].productos[0].descripcion, 'Fresca / de verdad');
});

t('escapa HTML y bloquea URLs peligrosas', () => {
  const evil = '<script>alert(1)</script>"\'><img src=x onerror=alert(1)>';
  const html = PY.renderSite({
    tipo: 'restaurante', nombre: evil, eslogan: evil, zona: evil, direccion: evil, nosotros: evil, entrega: evil,
    catalogo: [{ categoria: evil, productos: [{ nombre: evil, precio: evil, descripcion: evil, foto: 'javascript:alert(1)' }] }],
    redes: { facebook: 'javascript:alert(1)', instagram: '@ok_handle' }, portada: 'x.jpg" onerror="alert(1)', color: 'red;}body{display:none',
    preguntas: [{ p: evil, r: evil }], destacados: [{ icono: evil, titulo: evil, texto: evil }], whatsapp: '5512345678'
  }, { mode: 'live', canonical: 'https://x.test/a/' });
  assert(!/<script>alert/i.test(html), 'script sin escapar');
  assert(!/<img src=x/i.test(html), 'img sin escapar');
  assert(!/javascript:/i.test(html), 'url javascript:');
  assert(!/onerror="alert/i.test(html), 'atributo inyectado');
  assert(!/display:none/.test(html), 'color inyectado');
  assert(html.includes('https://www.instagram.com/ok_handle'));
  const json = html.match(/<script type="application\/json" id="py-data">([\s\S]*?)<\/script>/)[1];
  assert(!json.includes('</'), 'JSON embebido sin escapar');
  JSON.parse(json);
});

t('todos los tipos se generan en todos los modos', () => {
  for (const id of Object.keys(PRESETS)) {
    for (const mode of ['live', 'demo', 'example', 'preview']) {
      const html = PY.renderSite({ tipo: id, nombre: 'Prueba ' + id, zona: 'Centro', whatsapp: '5512345678', direccion: 'Calle 1' }, { mode, canonical: 'https://x.test/p/' });
      assert(html.startsWith('<!doctype html>'));
      assert(html.includes('id="catalogo"'));
      assert.strictEqual(html.includes('application/ld+json'), mode === 'live');
      assert.strictEqual(html.includes('noindex'), mode !== 'live');
      assert.strictEqual(html.includes('id="py-cart"'), !!PRESETS[id].orders);
    }
    assert(PY.renderQr({ tipo: id, nombre: 'Q' }, { url: 'https://x.test/q/' }).includes('QRCode'));
  }
});

t('el texto del catálogo coincide con si hay carrito', () => {
  for (const id of Object.keys(PRESETS)) {
    for (const pedidos of [true, false]) {
      const m = PY.model({ tipo: id, nombre: 'X', pedidos }, {});
      assert.strictEqual(/Agrega/.test(m.catalogIntro), pedidos, id + ' pedidos=' + pedidos + ': ' + m.catalogIntro);
    }
  }
});

t('base legal: datos del negocio, leyenda de precios, aviso y términos', () => {
  const con = PY.renderSite({ tipo: 'restaurante', nombre: 'Tacos', titular: 'Juan Pérez López', direccion: 'Calle 1', zona: 'Centro', telefono: '3312345678', correo: 'tacos@ejemplo.com', whatsapp: '3312345678', preciosVigentes: '2026-10-05' }, { mode: 'live' });
  assert(con.includes('id="aviso-privacidad"') && con.includes('id="terminos"'));
  assert(con.includes('Precios en pesos mexicanos, con IVA incluido. Vigentes desde el 5 de octubre de 2026.'));
  assert(con.includes('Juan Pérez López, con domicilio en Calle 1, Centro'));
  assert(con.includes('mailto:tacos@ejemplo.com') && con.includes('Profeco'));
  assert(!con.includes('(ejemplo)'));
  const sin = PY.renderSite({ tipo: 'barberia', nombre: 'Barbería' }, { mode: 'live' });
  assert(sin.includes('id="aviso-privacidad"') && !sin.includes('id="terminos"'), 'sin carrito no hay términos obligatorios');
  assert(PY.renderSite({ tipo: 'barberia', nombre: 'B' }, { mode: 'example' }).includes('(ejemplo)'));
});

t('secciones vacías se ocultan', () => {
  const html = PY.renderSite({ tipo: 'taller', nombre: 'Solo nombre', catalogo: [], preguntas: [], destacados: [], nosotros: '', horario: {} }, { mode: 'live' });
  assert(!html.includes('id="catalogo"'));
  assert(!html.includes('id="preguntas"'));
  assert(!html.includes('id="nosotros"'));
  assert(!html.includes('class="perks"'));
  assert(!html.includes('data-status'));
});

t('color propio legible', () => {
  const html = PY.renderSite({ tipo: 'restaurante', nombre: 'X', color: '#ffff00' }, { mode: 'live' });
  assert(/--on-primary:#111111/.test(html), 'texto oscuro sobre amarillo');
});

t('enlaces de vista previa comprimidos', () => {
  const d = { tipo: 'tienda', nombre: 'Ñandú & Cía', catalogo: PY.textToCatalog('# Uno\nÁrbol | 10 | 🎁 regalo') };
  return PY.encodeData(d).then((s) => PY.decodeData(s)).then((back) => assert.deepStrictEqual(back, d));
});

t('parámetros cortos', () => {
  const q = new URLSearchParams(PY.toParams({ tipo: 'barberia', nombre: 'El Güero', whatsapp: '5512345678', zona: 'Centro', color: '#112233' }));
  assert.deepStrictEqual(PY.fromParams(q), { tipo: 'barberia', nombre: 'El Güero', whatsapp: '5512345678', zona: 'Centro', color: '#112233' });
});

t('scripts del navegador sin errores de sintaxis', () => {
  for (const f of ['src/site.js', 'src/agency/builder.js', 'src/agency/demo.js', 'src/agency/prospectar.js', 'src/agency/tool.js']) {
    execFileSync(process.execPath, ['--check', path.join(ROOT, f)]);
  }
});

t('engine.js funciona como en el navegador', () => {
  const engine = path.join(ROOT, 'dist', 'assets', 'engine.js');
  if (!fs.existsSync(engine)) throw new Error('Ejecuta primero: npm run build');
  const sandbox = { TextEncoder, TextDecoder, URLSearchParams };
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(engine, 'utf8'), sandbox);
  const html = sandbox.Changarro.renderSite({ tipo: 'gimnasio', nombre: 'Gym' }, { mode: 'preview' });
  assert(html.includes('Gym') && html.includes('<style>'));
});

t('la vista previa no deja salir a WhatsApp', () => {
  // Una vista previa lleva el teléfono real de un negocio que no ha contratado: si los botones
  // funcionaran, le llegarían pedidos que nunca pidió. Ver 'En una vista previa no funciona ningún botón'.
  for (const mode of ['demo', 'preview']) {
    const html = PY.renderSite({ tipo: 'restaurante', nombre: 'Tacos X', whatsapp: '3312345678' }, { mode });
    assert(html.includes('id=\"py-aviso\"'), mode + ': falta el aviso de vista previa');
    assert(html.includes('todavía no es una página web'), mode + ': el aviso no lo dice con todas sus letras');
    assert(!html.includes('data-msg-open'), mode + ': sigue el botón que abría WhatsApp de verdad');
  }
  for (const mode of ['live', 'example']) {
    assert(!PY.renderSite({ tipo: 'restaurante', nombre: 'Tacos X' }, { mode }).includes('id=\"py-aviso\"'), mode + ': no debe llevar el aviso de vista previa');
  }
});

t('el aviso de cookies va donde debe', () => {
  const ejemplo = PY.renderSite({ tipo: 'tienda', nombre: 'Tienda X' }, { mode: 'example', home: '../../' });
  assert(ejemplo.includes('../../aviso-visitantes.js'), 'los ejemplos son páginas nuestras y sí lo llevan');
  for (const mode of ['live', 'demo', 'preview']) {
    assert(!PY.renderSite({ tipo: 'tienda', nombre: 'Tienda X' }, { mode }).includes('aviso-visitantes.js'), mode + ': no le toca el aviso de cookies');
  }
});

t('el aviso de cookies no tapa lo que hay que leer para aceptarlo', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
  cfg.wa = PY.waNumber(cfg.whatsapp);
  const A = require(path.join(ROOT, 'src', 'agency', 'pages.js'))(cfg, PY, PRESETS, 'x');
  for (const [nombre, html] of [['privacidad del sitio', A.privacy], ['404', A.notFound]]) {
    assert(html.includes('AVISO_185_LIBRE'), nombre + ': debe poder leerse sin aceptar');
  }
  for (const [nombre, html] of [['portada', A.home], ['crear', A.crear]]) {
    assert(html.includes('aviso-visitantes.js'), nombre + ': le falta el aviso');
    assert(!html.includes('AVISO_185_LIBRE'), nombre + ': esta sí se tapa');
  }
});

Promise.all(pending).then(() => console.log(process.exitCode ? '\nHay pruebas fallidas.\n' : '\n✔ ' + passed + ' pruebas pasaron.\n'));
