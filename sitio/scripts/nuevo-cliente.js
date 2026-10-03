#!/usr/bin/env node
/*
 * 185ChangarroWeb · crea la carpeta de un cliente nuevo con todos los campos listos para llenar.
 * Uso:  npm run nuevo -- tacos-el-guero restaurante
 */
'use strict';
const fs = require('fs');
const path = require('path');
const PRESETS = require('../src/presets.js');

const ROOT = path.resolve(__dirname, '..');
const [slug, tipo = 'restaurante'] = process.argv.slice(2);
const tipos = Object.keys(PRESETS).join(', ');

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.log('\nUso: npm run nuevo -- <carpeta> [tipo]\n  Ej.  npm run nuevo -- tacos-el-guero restaurante\n\n  <carpeta>: minúsculas, números y guiones. Será la dirección: tusitio.onrender.com/<carpeta>/\n  [tipo]: ' + tipos + '\n');
  process.exit(1);
}
if (!PRESETS[tipo]) {
  console.log('\nTipo desconocido "' + tipo + '". Usa uno de: ' + tipos + '\n');
  process.exit(1);
}

const dir = path.join(ROOT, 'clientes', slug);
const file = path.join(dir, 'datos.json');
if (fs.existsSync(file)) {
  console.log('\nYa existe clientes/' + slug + '/datos.json. No lo sobrescribo.\n');
  process.exit(1);
}

const P = PRESETS[tipo];
const data = {
  _notas: 'Este campo no se publica. Anota aquí plan, fecha de pago, contacto, etc.',
  tipo,
  nombre: 'NOMBRE DEL NEGOCIO',
  titular: '',
  eslogan: P.tagline,
  whatsapp: '',
  telefono: '',
  correo: '',
  direccion: '',
  zona: '',
  mapa: '',
  horario: P.horario,
  catalogo: P.catalogo,
  pedidos: !!P.orders,
  nosotros: P.about,
  destacados: P.highlights,
  preguntas: P.preguntas,
  pagos: P.pagos,
  entrega: P.entrega,
  redes: { facebook: '', instagram: '', tiktok: '' },
  color: '',
  portada: '',
  logo: '',
  galeria: [],
  cedula: '',
  preciosVigentes: new Date().toISOString().slice(0, 10),
  terminos: { anticipo: '', cancelaciones: '', devoluciones: '', promociones: '', extra: '' },
  dominio: '',
  ocultarCredito: false
};

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('\n✔ Creado clientes/' + slug + '/datos.json (tipo: ' + tipo + ')');
console.log('  1. Abre ese archivo y llena nombre, titular, whatsapp, teléfono, correo, dirección, horario y catálogo.');
console.log('  2. Si tienes fotos, ponlas en clientes/' + slug + '/ y escribe su nombre en "portada", "logo" o "galeria".');
console.log('  3. Revisa con: npm run dev  →  http://localhost:4321/' + slug + '/');
console.log('  4. Publica con git add, git commit y git push.\n');
