#!/usr/bin/env node
/*
 * 185ChangarroWeb · copia los planes oficiales a config.json
 * Lee (sin modificar) el planes.js del portal oficial y actualiza "planes" en config.json.
 * Uso:  npm run planes
 *       npm run planes -- "C:\ruta\a\vitrina-local\public\planes.js"
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
// Sitios donde puede estar el planes.js del portal, según dónde viva esta carpeta.
const CANDIDATOS = [
  path.resolve(ROOT, '..', 'vitrina-local', 'public', 'planes.js'),            // hermana de vitrina-local
  path.resolve(ROOT, '..', '..', 'vitrina-local', 'public', 'planes.js'),      // un nivel más arriba
  path.resolve(ROOT, '..', 'public', 'planes.js'),                             // dentro del propio portal
  path.resolve(ROOT, '..', 'TuPropioLocalWeb', 'vitrina-local', 'public', 'planes.js')
];
const file = process.argv[2] ? path.resolve(process.argv[2]) : CANDIDATOS.find((p) => fs.existsSync(p));

if (!file || !fs.existsSync(file)) {
  console.log('\nNo encuentro planes.js. Busqué en:\n  ' + CANDIDATOS.join('\n  ') +
    '\nPásame la ruta: npm run planes -- "C:\\ruta\\planes.js"\n');
  process.exit(1);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox);
const src = sandbox.window.PLANES_185;
if (!src || !Array.isArray(src.PLANS)) {
  console.log('\nEl archivo no tiene window.PLANES_185.PLANS. No cambié nada.\n');
  process.exit(1);
}

const text = (html) => String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const planes = src.PLANS.map((p) => ({
  id: p.id,
  nombre: p.name,
  para: text(p.forx),
  instalacion: p.inst,
  mensualidad: p.mes,
  tiempo: p.time,
  respuesta: p.sla,
  funciones: p.funcs,
  destacado: !!p.featured,
  incluye: p.inc.map(text)
}));

// La Página Básica: el servicio más barato para negocios. Trae también la lista de lo que NO incluye,
// que es lo que la distingue de los planes y evita prometer de más.
const basica = src.BASICA ? {
  id: src.BASICA.id,
  nombre: src.BASICA.name,
  para: text(src.BASICA.forx),
  instalacion: src.BASICA.inst,
  mensualidad: src.BASICA.mes,
  tiempo: src.BASICA.time,
  respuesta: src.BASICA.sla,
  incluye: (src.BASICA.inc || []).map(text),
  noIncluye: (src.BASICA.no || []).map(text)
} : null;

// Invitaciones digitales para eventos: pago único, sin mensualidad.
const eventos = src.EVENTOS ? {
  tiempo: src.EVENTOS.time,
  vigencia: src.EVENTOS.vigencia,
  extra: src.EVENTOS.extra,
  cambio: src.EVENTOS.cambio,
  paquetes: (src.EVENTOS.PAQUETES || []).map((p) => ({
    id: p.id, nombre: p.name, para: text(p.forx), precio: p.precio,
    destacado: !!p.featured, incluye: (p.inc || []).map(text)
  }))
} : null;

const cfgFile = path.join(ROOT, 'config.json');
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
cfg.planes = planes;
if (basica) cfg.basica = basica;
if (eventos) cfg.eventos = eventos;
if (src.REFERIDOS) cfg.referidos = src.REFERIDOS;
// Ya no hace falta: la página más sencilla tiene precio publicado y es la Básica.
if (basica) delete cfg.masSencillo;
cfg.planesFuente = 'Copiado de planes.js el ' + new Date().toISOString().slice(0, 10) + '. No edites aquí: cambia planes.js y corre "npm run planes".';
fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2) + '\n');

console.log('\n✔ config.json actualizado:');
if (basica) console.log('  • Básica: instalación $' + basica.instalacion.toLocaleString('es-MX') + ' + $' + basica.mensualidad + '/mes');
planes.forEach((p) => console.log('  • ' + p.nombre + ': instalación $' + p.instalacion.toLocaleString('es-MX') + ' + $' + p.mensualidad + '/mes'));
if (eventos) eventos.paquetes.forEach((p) => console.log('  • ' + p.nombre + ': $' + p.precio.toLocaleString('es-MX') + ' pago único'));
if (src.REFERIDOS) console.log('  • Premio por recomendar: $' + src.REFERIDOS.basica + ' Básica · $' + src.REFERIDOS.planes + ' Personalizable · Eventos no aplica');
console.log('');
