#!/usr/bin/env node
/*
 * 185ChangarroWeb · genera la portada comercial y la deja dentro de public/.
 *
 * El sitio comercial vive en `sitio/` y se arma con su propio generador, que escribe en `sitio/dist/`.
 * Este comando lo corre y después COPIA el resultado a `public/`, encima de lo que ya hay.
 *
 * Copia, no mueve ni borra: `sitio/scripts/build.js` vacía su carpeta dist antes de generar, y si
 * apuntáramos su salida directo a public/ se llevaría por delante los Términos, el panel y todas
 * las muestras. Por eso se arma aparte y aquí solo se copia encima.
 *
 * Lo que sale de aquí SÍ se sube al repositorio, para que Render no tenga que generar nada: su
 * build sigue siendo solo `npm install`, como pide la regla de "sin paso de build" del proyecto.
 *
 * Uso:  node herramientas/generar-portada.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const SITIO = path.join(RAIZ, 'sitio');
const DIST = path.join(SITIO, 'dist');
const PUBLIC = path.join(RAIZ, 'public');

// Archivos del sitio comercial que NO deben pisar a los del portal.
// El portal manda en todo lo legal y en las muestras.
const NO_COPIAR = new Set([]);

function copiar(desde, hasta, ruta) {
  for (const entrada of fs.readdirSync(desde, { withFileTypes: true })) {
    const rel = ruta ? ruta + '/' + entrada.name : entrada.name;
    if (NO_COPIAR.has(rel)) { console.log('  — se omite ' + rel + ' (manda el portal)'); continue; }
    const a = path.join(desde, entrada.name);
    const b = path.join(hasta, entrada.name);
    if (entrada.isDirectory()) {
      fs.mkdirSync(b, { recursive: true });
      copiar(a, b, rel);
    } else {
      fs.copyFileSync(a, b);
    }
  }
}

function cuenta(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) n += e.isDirectory() ? cuenta(path.join(dir, e.name)) : 1;
  return n;
}

if (!fs.existsSync(path.join(SITIO, 'scripts', 'build.js'))) {
  console.error('\nNo encuentro sitio/scripts/build.js. ¿Está completa la carpeta sitio/?\n');
  process.exit(1);
}

console.log('\n1. Armando el sitio comercial (sitio/)…');
require(path.join(SITIO, 'scripts', 'build.js'))();

console.log('\n2. Copiando a public/…');
copiar(DIST, PUBLIC, '');

console.log('\n✔ Listo: ' + cuenta(DIST) + ' archivos copiados a public/.');
console.log('  Pruébalo con "npm start" y abre http://localhost:3000\n');
