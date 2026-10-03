#!/usr/bin/env node
/* 185ChangarroWeb · servidor local con recarga del build (npm run dev). Con --abrir abre el navegador. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const build = require('./build');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4321;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8'
};

function rebuild() {
  try { build(); } catch (e) { console.error('✖ Error al generar: ' + e.message); }
}
rebuild();

let timer = null;
for (const p of ['src', 'clientes', 'config.json']) {
  const full = path.join(ROOT, p);
  if (!fs.existsSync(full)) continue;
  const isDir = fs.statSync(full).isDirectory();
  fs.watch(full, { recursive: isDir }, () => { clearTimeout(timer); timer = setTimeout(rebuild, 200); });
}

http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch (e) { res.writeHead(400); return res.end(); }
  let file = path.join(DIST, rel);
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  try {
    if (fs.statSync(file).isDirectory()) {
      if (!rel.endsWith('/')) { res.writeHead(301, { Location: rel + '/' }); return res.end(); }
      file = path.join(file, 'index.html');
    }
    const body = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch (e) {
    const nf = path.join(DIST, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'No encontrado');
  }
}).listen(PORT, () => {
  console.log('→ Sitio local: http://localhost:' + PORT);
  if (process.argv.includes('--abrir')) {
    const url = 'http://localhost:' + PORT + '/';
    const cmd = process.platform === 'win32' ? 'start "" "' + url + '"' : (process.platform === 'darwin' ? 'open ' : 'xdg-open ') + url;
    require('child_process').exec(cmd);
  }
  console.log('  Los cambios en src/, clientes/ y config.json se regeneran solos. Ctrl+C para salir.\n');
});
