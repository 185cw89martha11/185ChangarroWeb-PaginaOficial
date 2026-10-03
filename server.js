/* 185ChangarroWeb — servidor para Render.com. Solo usa módulos de Node, sin dependencias. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

// Variables solo de esta computadora (.env.local no se sube a GitHub). En Render se ponen en Environment.
try {
  fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8').split(/\r?\n/).forEach(l => {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*)\s*$/.exec(l);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  });
} catch (e) {}
const solicitudes = require('./solicitudes');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const PUBLIC = path.join(__dirname, 'public');

// Rutas limpias: /tarifas en vez de /tarifas.html
const ROUTES = {
  '/': 'index.html',
  '/demo': 'demo.html',
  '/muestra': 'muestra.html',
  '/admin': 'admin.html',
  '/tarifas': 'tarifas.html',
  '/basicas': 'basicas.html',
  '/eventos': 'eventos.html',
  '/terminos': 'terminos.html',
  '/privacidad': 'privacidad.html'
};

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
  '.txt': 'text/plain; charset=utf-8',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  let pathname, search;
  try {
    const url = new URL(req.url, 'http://localhost');
    pathname = decodeURIComponent(url.pathname);
    search = url.search;
  } catch (e) { return send(res, 400, 'Dirección no válida'); }

  // La invitación de ejemplo vive en /ejemplodeevento-muestra/ (sin ñ, para que la carpeta sea segura en cualquier sistema).
  // Los nombres anteriores (/15anos-demo, /15años-demo) redirigen ahí para que los enlaces ya enviados sigan sirviendo.
  const norm = pathname.normalize('NFC');
  for (const viejo of ['/15años-demo', '/15anos-demo']) {
    if (norm === viejo || norm.startsWith(viejo + '/')) {
      res.writeHead(301, { Location: '/ejemplodeevento-muestra' + norm.slice(viejo.length) + search });
      return res.end();
    }
  }
  // Las invitaciones de ejemplo no deben aparecer en buscadores.
  if (pathname.startsWith('/ejemplodeevento-muestra')) res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (pathname.startsWith('/api/')) return solicitudes.manejar(req, res, pathname);

  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Método no permitido');

  // Render usa esta ruta para saber que el servidor está vivo.
  if (pathname === '/salud') return send(res, 200, 'ok');

  const rel = ROUTES[pathname] || pathname.replace(/^\/+/, '');
  const file = path.join(PUBLIC, rel);
  // No dejar salir de la carpeta public (por ejemplo, con /../server.js).
  if (!file.startsWith(PUBLIC + path.sep)) return send(res, 403, 'Prohibido');

  fs.stat(file, (err, st) => {
    // Una carpeta (por ejemplo, la muestra de un negocio en /mariscos8tostadas-muestra) se abre con su
    // index.html o muestra.html. Sin la diagonal final se redirige, para que sus archivos se carguen de la carpeta.
    if (!err && st.isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: encodeURI(pathname) + '/' + search });
        return res.end();
      }
      const index = path.join(file, 'index.html');
      return entregar(req, res, fs.existsSync(index) ? index : path.join(file, 'muestra.html'));
    }
    entregar(req, res, file);
  });
});

function entregar(req, res, file) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'No se encontró la página');
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

server.listen(PORT, HOST, () => {
  console.log('185ChangarroWeb lista en http://localhost:' + PORT);
});
