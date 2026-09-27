/* 185ChangarroWeb — buzón de solicitudes de aceptación y acceso al panel de administración.
   El formulario de terminos.html manda cada aceptación a POST /api/solicitudes.
   El panel (public/admin.html) entra con la clave, descarga las solicitudes a su navegador y las borra del buzón.

   Variables de entorno (en Render: Environment; en esta computadora: .env.local):
   - ADMIN_CLAVE_HASH   huella PBKDF2 de la clave del panel: pbkdf2$iteraciones$sal$huella (base64). Nunca la clave en texto.
   - APPS_SCRIPT_URL    dirección /exec del Apps Script de la Hoja de Google que sirve de buzón.
   - APPS_SCRIPT_SECRETO el mismo SECRETO guardado en las propiedades del Apps Script.
   Sin APPS_SCRIPT_URL, en esta computadora se usa el archivo datos/solicitudes.json. En Render, sin él, no se aceptan solicitudes
   (Render borra sus archivos al reiniciarse y se perderían). */
'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MAX_BODY = 16 * 1024;
const SESION_MS = 30 * 60 * 1000;
const ARCHIVO = path.join(__dirname, 'datos', 'solicitudes.json');

const PLANES = ['Esencial', 'Negocio', 'Negocio + Asistente Pro'];
const MEDIOS = ['WhatsApp', 'Llamada o SMS', 'Correo', 'Facebook', 'Instagram', 'Otra red social'];

// ---------- almacén ----------
function almacen() {
  if (process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_SECRETO) return 'google';
  if (process.env.RENDER) return null; // en Render un archivo local se perdería
  return 'local';
}

async function google(accion, extra) {
  const r = await fetch(process.env.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({ secreto: process.env.APPS_SCRIPT_SECRETO, accion }, extra)),
    redirect: 'follow'
  });
  const d = await r.json();
  if (!d.ok) throw new Error('Apps Script: ' + (d.error || r.status));
  return d;
}

function leerArchivo() {
  try { return JSON.parse(fs.readFileSync(ARCHIVO, 'utf8')); } catch (e) { return []; }
}
function escribirArchivo(lista) {
  fs.mkdirSync(path.dirname(ARCHIVO), { recursive: true });
  fs.writeFileSync(ARCHIVO, JSON.stringify(lista, null, 2));
}

async function agregar(s) {
  if (almacen() === 'google') return google('agregar', { solicitud: s });
  const l = leerArchivo(); l.push(s); escribirArchivo(l);
}
async function listar() {
  if (almacen() === 'google') return (await google('listar')).solicitudes || [];
  return leerArchivo();
}
async function quitar(ids) {
  if (almacen() === 'google') return google('borrar', { ids });
  const set = new Set(ids);
  escribirArchivo(leerArchivo().filter(s => !set.has(s.id)));
}

// ---------- utilidades ----------
function json(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const partes = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('grande')); req.destroy(); return; }
      partes.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(partes).toString('utf8') || '{}')); }
      catch (e) { reject(new Error('json')); }
    });
    req.on('error', reject);
  });
}

function ip(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
}

// Límite simple por IP: máximo `max` intentos cada `ventana` ms.
function limitador(max, ventana) {
  const mapa = new Map();
  return {
    excedido(clave) {
      const ahora = Date.now();
      const l = (mapa.get(clave) || []).filter(t => ahora - t < ventana);
      mapa.set(clave, l);
      return l.length >= max;
    },
    sumar(clave) { (mapa.get(clave) || mapa.set(clave, []).get(clave)).push(Date.now()); }
  };
}
const limEnvios = limitador(5, 10 * 60 * 1000);
const limClave = limitador(5, 15 * 60 * 1000);

function texto(v, max) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }

function claveCorrecta(clave) {
  const partes = String(process.env.ADMIN_CLAVE_HASH || '').split('$');
  if (partes.length !== 4 || partes[0] !== 'pbkdf2') return Promise.resolve(false);
  const it = Number(partes[1]), sal = Buffer.from(partes[2], 'base64'), esperada = Buffer.from(partes[3], 'base64');
  return new Promise(resolve => {
    crypto.pbkdf2(String(clave), sal, it, esperada.length, 'sha256', (err, h) => {
      resolve(!err && crypto.timingSafeEqual(h, esperada));
    });
  });
}

// Sesiones del panel: solo en memoria. Si el servidor se reinicia, el panel vuelve a entrar con la clave.
const sesiones = new Map();
function sesionValida(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
  const s = m && sesiones.get(m[1]);
  if (!s || Date.now() > s) { if (m) sesiones.delete(m[1]); return false; }
  return true;
}

// ---------- rutas ----------
async function manejar(req, res, pathname) {
  try {
    // Formulario de aceptación (público)
    if (pathname === '/api/solicitudes' && req.method === 'POST') {
      if (!almacen()) return json(res, 503, { ok: false, error: 'El registro no está configurado.' });
      if (limEnvios.excedido(ip(req))) return json(res, 429, { ok: false, error: 'Demasiados envíos. Intente más tarde.' });
      const b = await leerCuerpo(req);
      const s = {
        id: crypto.randomUUID(),
        recibida: new Date().toISOString(),
        version: texto(b.version, 60),
        nombre: texto(b.nombre, 120),
        negocio: texto(b.negocio, 120),
        plan: texto(b.plan, 60),
        medio: texto(b.medio, 40),
        contacto: texto(b.contacto, 160),
        terminos: b.terminos === true,
        privacidad: b.privacidad === true,
        ejemplo: b.ejemplo === true,
        promociones: b.promociones === true,
        mensaje: texto(b.mensaje, 6000)
      };
      if (!s.nombre || !s.negocio || !s.contacto || !PLANES.includes(s.plan) || !MEDIOS.includes(s.medio) || !s.terminos || !s.privacidad) {
        return json(res, 400, { ok: false, error: 'Faltan datos.' });
      }
      limEnvios.sumar(ip(req));
      await agregar(s);
      return json(res, 200, { ok: true });
    }

    // Entrar al panel
    if (pathname === '/api/admin/entrar' && req.method === 'POST') {
      if (limClave.excedido(ip(req))) return json(res, 429, { ok: false, error: 'Demasiados intentos. Espere 15 minutos.' });
      const b = await leerCuerpo(req);
      if (!(await claveCorrecta(b.clave))) {
        limClave.sumar(ip(req));
        return json(res, 401, { ok: false, error: 'Clave incorrecta.' });
      }
      const token = crypto.randomBytes(32).toString('base64url');
      sesiones.set(token, Date.now() + SESION_MS);
      return json(res, 200, { ok: true, token, almacen: almacen() });
    }

    if (pathname === '/api/admin/solicitudes' && req.method === 'GET') {
      if (!sesionValida(req)) return json(res, 401, { ok: false, error: 'Sesión vencida.' });
      if (!almacen()) return json(res, 200, { ok: true, solicitudes: [], almacen: null });
      return json(res, 200, { ok: true, solicitudes: await listar(), almacen: almacen() });
    }

    // Quitar del buzón las que el panel ya guardó en el navegador
    if (pathname === '/api/admin/solicitudes/quitar' && req.method === 'POST') {
      if (!sesionValida(req)) return json(res, 401, { ok: false, error: 'Sesión vencida.' });
      const b = await leerCuerpo(req);
      const ids = Array.isArray(b.ids) ? b.ids.filter(x => typeof x === 'string').slice(0, 500) : [];
      if (ids.length && almacen()) await quitar(ids);
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { ok: false, error: 'No existe.' });
  } catch (e) {
    console.error('API', pathname, e.message);
    const status = e.message === 'grande' ? 413 : e.message === 'json' ? 400 : 500;
    return json(res, status, { ok: false, error: 'No se pudo completar.' });
  }
}

module.exports = { manejar };
