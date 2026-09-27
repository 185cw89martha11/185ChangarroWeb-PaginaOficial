/* 185ChangarroWeb — servidor para Render.com. Solo usa módulos de Node, sin dependencias. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const PUBLIC = path.join(__dirname, 'public');

// Rutas limpias: /tarifas en vez de /tarifas.html
const ROUTES = {
  '/': 'index.html',
  '/tarifas': 'tarifas.html',
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
  '.woff2': 'font/woff2'
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Método no permitido');

  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch (e) { return send(res, 400, 'Dirección no válida'); }

  // Render usa esta ruta para saber que el servidor está vivo.
  if (pathname === '/salud') return send(res, 200, 'ok');

  const rel = ROUTES[pathname] || pathname.replace(/^\/+/, '');
  const file = path.join(PUBLIC, rel);
  // No dejar salir de la carpeta public (por ejemplo, con /../server.js).
  if (!file.startsWith(PUBLIC + path.sep)) return send(res, 403, 'Prohibido');

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
});

server.listen(PORT, HOST, () => {
  console.log('185ChangarroWeb lista en http://localhost:' + PORT);
});
