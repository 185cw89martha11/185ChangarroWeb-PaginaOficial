/* 185ChangarroWeb — genera los modelos 3D de demostración de la muestra de AmueblArte (archivos .glb).
   Uso:  node herramientas/amueblarte-modelos.js
   Salen en public/amueblarte-muestra/modelos/. Sin dependencias: arma el glTF binario a mano.

   Son piezas sencillas (cajas y cilindros) a tamaño real, en metros, con el origen en el piso.
   Sirven para enseñar cómo funcionan el 3D y la realidad aumentada; los muebles reales del negocio se
   modelan aparte, a partir de sus fotos y medidas.

   Cada material lleva un nombre fijo (cubierta, base, estructura, asiento, tapizado, nivelador). La muestra
   cambia los colores buscando esos nombres, así que no los renombres sin cambiar muestra-datos.js. */
'use strict';
const fs = require('fs');
const path = require('path');

const SALIDA = path.join(__dirname, '..', 'public', 'amueblarte-muestra', 'modelos');

// ---------- geometría ----------
class Malla {
  constructor() { this.pos = []; this.nor = []; this.idx = []; }
  cuad(a, b, c, d, n) {
    const i = this.pos.length / 3;
    [a, b, c, d].forEach(p => { this.pos.push(p[0], p[1], p[2]); this.nor.push(n[0], n[1], n[2]); });
    this.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
}

// caja: ancho (x), alto (y), fondo (z); (x, z) es el centro y yBase el piso de la caja
function caja(m, w, h, d, x, yBase, z) {
  const e = [w / 2, h / 2, d / 2], c = [x, yBase + h / 2, z];
  // [eje de la normal, signo, eje u, eje v]: u × v = normal, así las caras miran hacia afuera
  [[0, 1, 1, 2], [0, -1, 2, 1], [1, 1, 2, 0], [1, -1, 0, 2], [2, 1, 0, 1], [2, -1, 1, 0]].forEach(([n, s, u, v]) => {
    const p = (su, sv) => {
      const r = c.slice();
      r[n] += s * e[n]; r[u] += su * e[u]; r[v] += sv * e[v];
      return r;
    };
    const nor = [0, 0, 0]; nor[n] = s;
    m.cuad(p(-1, -1), p(1, -1), p(1, 1), p(-1, 1), nor);
  });
}

// cilindro vertical
function cilindro(m, r, h, x, yBase, z, lados) {
  lados = lados || 28;
  const y1 = yBase + h;
  const anillo = [];
  for (let i = 0; i < lados; i++) {
    const a = (i / lados) * Math.PI * 2;
    anillo.push([Math.cos(a), Math.sin(a)]);
  }
  for (let i = 0; i < lados; i++) {
    const p = anillo[i], q = anillo[(i + 1) % lados];
    const base = m.pos.length / 3;
    m.pos.push(x + r * p[0], yBase, z + r * p[1], x + r * q[0], yBase, z + r * q[1], x + r * q[0], y1, z + r * q[1], x + r * p[0], y1, z + r * p[1]);
    m.nor.push(p[0], 0, p[1], q[0], 0, q[1], q[0], 0, q[1], p[0], 0, p[1]);
    m.idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
  }
  [[y1, 1], [yBase, -1]].forEach(([y, s]) => {
    const centro = m.pos.length / 3;
    m.pos.push(x, y, z); m.nor.push(0, s, 0);
    for (let i = 0; i < lados; i++) {
      const p = anillo[i], q = anillo[(i + 1) % lados], k = m.pos.length / 3;
      m.pos.push(x + r * p[0], y, z + r * p[1], x + r * q[0], y, z + r * q[1]);
      m.nor.push(0, s, 0, 0, s, 0);
      if (s > 0) m.idx.push(centro, k + 1, k); else m.idx.push(centro, k, k + 1);
    }
  });
}

// ---------- glb ----------
// mats: [{ nombre, color: '#rrggbb', metal, rugoso, malla }]
function aLineal(hex) {
  return [1, 3, 5].map(i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
}

function armarGlb(nombre, mats) {
  const partes = [], vistas = [], accesos = [], prims = [];
  let largo = 0;
  const agrega = (tipedArray, destino) => {
    const buf = Buffer.from(tipedArray.buffer, tipedArray.byteOffset, tipedArray.byteLength);
    const pad = (4 - (buf.length % 4)) % 4;
    vistas.push({ buffer: 0, byteOffset: largo, byteLength: buf.length, target: destino });
    partes.push(buf, Buffer.alloc(pad));
    largo += buf.length + pad;
    return vistas.length - 1;
  };
  mats.forEach((mat, i) => {
    const pos = new Float32Array(mat.malla.pos), nor = new Float32Array(mat.malla.nor), idx = new Uint16Array(mat.malla.idx);
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let k = 0; k < pos.length; k += 3) for (let j = 0; j < 3; j++) { min[j] = Math.min(min[j], pos[k + j]); max[j] = Math.max(max[j], pos[k + j]); }
    const a = accesos.length;
    accesos.push({ bufferView: agrega(pos, 34962), componentType: 5126, count: pos.length / 3, type: 'VEC3', min, max });
    accesos.push({ bufferView: agrega(nor, 34962), componentType: 5126, count: nor.length / 3, type: 'VEC3' });
    accesos.push({ bufferView: agrega(idx, 34963), componentType: 5123, count: idx.length, type: 'SCALAR' });
    prims.push({ attributes: { POSITION: a, NORMAL: a + 1 }, indices: a + 2, material: i, mode: 4 });
  });
  const json = {
    asset: { version: '2.0', generator: '185ChangarroWeb · herramientas/amueblarte-modelos.js' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: nombre, mesh: 0 }],
    meshes: [{ name: nombre, primitives: prims }],
    materials: mats.map(m => ({
      name: m.nombre,
      pbrMetallicRoughness: { baseColorFactor: aLineal(m.color).concat(1), metallicFactor: m.metal, roughnessFactor: m.rugoso }
    })),
    buffers: [{ byteLength: largo }],
    bufferViews: vistas,
    accessors: accesos
  };
  let js = Buffer.from(JSON.stringify(json), 'utf8');
  js = Buffer.concat([js, Buffer.alloc((4 - (js.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(partes);
  const total = 12 + 8 + js.length + 8 + bin.length;
  const cab = Buffer.alloc(12 + 8);
  cab.write('glTF', 0, 'ascii'); cab.writeUInt32LE(2, 4); cab.writeUInt32LE(total, 8);
  cab.writeUInt32LE(js.length, 12); cab.write('JSON', 16, 'ascii');
  const cabBin = Buffer.alloc(8);
  cabBin.writeUInt32LE(bin.length, 0); cabBin.write('BIN\0', 4, 'binary');
  return Buffer.concat([cab, js, cabBin, bin]);
}

// ---------- muebles ----------
// patas y travesaños de una silla o un banco. a = ancho, f = fondo, hAsiento = altura del asiento terminado.
// Se puede poner en otro lugar (ox, oz) y mirando al otro lado (sz = -1), para armar juegos de mesa con sillas.
function sillaEn(estructura, asiento, o, ox, oz, sz) {
  ox = ox || 0; oz = oz || 0; sz = sz || 1;
  const C = (m, w, h, d, x, y, z) => caja(m, w, h, d, ox + x, y, oz + sz * z);
  const g = o.grueso || 0.028, dx = o.a / 2 - g / 2, dz = o.f / 2 - g / 2;
  const marco = o.hAsiento - 0.05;
  // patas de adelante (hasta el asiento) y de atrás (siguen hasta arriba, son el respaldo)
  [-1, 1].forEach(s => {
    C(estructura, g, marco, g, s * dx, 0, dz);
    C(estructura, g, o.hTotal, g, s * dx, 0, -dz);
  });
  // marco del asiento y cojín
  C(estructura, o.a, 0.03, o.f, 0, marco - 0.03, 0);
  C(asiento, o.a - 0.02, 0.05, o.f - 0.02, 0, marco, 0);
  // travesaños: a los lados y adelante, a la altura que pida cada mueble
  o.travesanos.forEach(y => {
    [-1, 1].forEach(s => C(estructura, 0.018, 0.03, o.f - g, s * dx, y, 0));
    C(estructura, o.a - g, 0.03, 0.018, 0, y, dz);
    if (o.travesanosAtras) C(estructura, o.a - g, 0.03, 0.018, 0, y, -dz);
  });
  // tablillas del respaldo
  o.tablillas.forEach(y => C(estructura, o.a - g * 2, 0.07, 0.018, 0, y, -dz));
  // brazos (sillones)
  if (o.brazos) [-1, 1].forEach(s => C(estructura, 0.05, 0.03, o.f - 0.04, s * (o.a / 2 + 0.005), o.hAsiento + 0.17, 0));
}
function silla(o) {
  const estructura = new Malla(), asiento = new Malla();
  sillaEn(estructura, asiento, o);
  return [
    { nombre: 'estructura', color: '#6B4423', metal: 0.1, rugoso: 0.55, malla: estructura },
    { nombre: 'asiento', color: '#7A1020', metal: 0, rugoso: 0.85, malla: asiento }
  ];
}

function mesaCuadrada() {
  const cubierta = new Malla(), base = new Malla(), nivelador = new Malla();
  caja(cubierta, 0.80, 0.03, 0.80, 0, 0.72, 0);
  caja(base, 0.22, 0.012, 0.22, 0, 0.708, 0);
  cilindro(base, 0.04, 0.666, 0, 0.042, 0);
  caja(base, 0.56, 0.03, 0.06, 0, 0.012, 0);
  caja(base, 0.06, 0.03, 0.56, 0, 0.012, 0);
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([sx, sz]) => cilindro(nivelador, 0.022, 0.012, sx * 0.25, 0, sz * 0.25));
  return [
    { nombre: 'cubierta', color: '#6B4423', metal: 0, rugoso: 0.5, malla: cubierta },
    { nombre: 'base', color: '#1C1C1C', metal: 0.6, rugoso: 0.45, malla: base },
    { nombre: 'nivelador', color: '#111111', metal: 0, rugoso: 0.9, malla: nivelador }
  ];
}

function mesaRedonda() {
  const cubierta = new Malla(), base = new Malla();
  cilindro(cubierta, 0.40, 0.03, 0, 0.72, 0, 48);
  caja(base, 0.14, 0.012, 0.14, 0, 0.708, 0);
  cilindro(base, 0.04, 0.668, 0, 0.04, 0);
  cilindro(base, 0.22, 0.04, 0, 0, 0, 40);
  return [
    { nombre: 'cubierta', color: '#6B4423', metal: 0, rugoso: 0.5, malla: cubierta },
    { nombre: 'base', color: '#1C1C1C', metal: 0.6, rugoso: 0.45, malla: base }
  ];
}

function booth() {
  const tapizado = new Malla(), base = new Malla();
  caja(base, 1.40, 0.42, 0.60, 0, 0, 0.03);            // caja del asiento
  caja(tapizado, 1.38, 0.10, 0.40, 0, 0.42, 0.13);      // cojín
  caja(base, 1.40, 0.72, 0.03, 0, 0.42, -0.315);        // fondo del respaldo
  for (let i = 0; i < 5; i++) caja(tapizado, 0.262, 0.50, 0.09, -0.56 + i * 0.28, 0.56, -0.255); // canales acojinados
  caja(base, 1.40, 0.05, 0.12, 0, 1.07, -0.27);         // remate de madera
  [-1, 1].forEach(s => caja(base, 0.04, 0.72, 0.66, s * 0.72, 0, 0));  // costados
  return [
    { nombre: 'tapizado', color: '#7A1020', metal: 0, rugoso: 0.8, malla: tapizado },
    { nombre: 'base', color: '#6B4423', metal: 0.05, rugoso: 0.55, malla: base }
  ];
}

// mesita alta (de bar): cubierta redonda, columna tubular y cruceta de piso con niveladores
function mesitaAlta() {
  const cubierta = new Malla(), base = new Malla(), nivelador = new Malla();
  cilindro(cubierta, 0.30, 0.03, 0, 1.02, 0, 40);
  caja(base, 0.60, 0.03, 0.06, 0, 0.012, 0);
  caja(base, 0.06, 0.03, 0.60, 0, 0.012, 0);
  cilindro(base, 0.035, 0.96, 0, 0.042, 0);
  cilindro(base, 0.09, 0.012, 0, 1.008, 0, 24);
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([sx, sz]) => cilindro(nivelador, 0.022, 0.012, sx * 0.27, 0, sz * 0.27));
  return [
    { nombre: 'cubierta', color: '#6B4423', metal: 0, rugoso: 0.5, malla: cubierta },
    { nombre: 'base', color: '#1C1C1C', metal: 0.6, rugoso: 0.45, malla: base },
    { nombre: 'nivelador', color: '#111111', metal: 0, rugoso: 0.9, malla: nivelador }
  ];
}

// mesa larga con dos soportes de fierro fundido a la par (uno bajo cada extremo)
function mesaDosSoportes() {
  const cubierta = new Malla(), base = new Malla();
  caja(cubierta, 1.60, 0.03, 0.70, 0, 0.72, 0);
  [-0.5, 0.5].forEach(x => {
    cilindro(base, 0.23, 0.03, x, 0, 0, 40);
    cilindro(base, 0.06, 0.04, x, 0.03, 0, 32);
    cilindro(base, 0.04, 0.58, x, 0.07, 0);
    cilindro(base, 0.07, 0.03, x, 0.65, 0, 32);
    caja(base, 0.30, 0.02, 0.30, x, 0.68, 0);
  });
  return [
    { nombre: 'cubierta', color: '#6B4423', metal: 0, rugoso: 0.5, malla: cubierta },
    { nombre: 'base', color: '#1C1C1C', metal: 0.7, rugoso: 0.4, malla: base }
  ];
}
// mesa con cuatro patas tubulares
function mesaPatas() {
  const cubierta = new Malla(), base = new Malla();
  caja(cubierta, 0.80, 0.03, 0.80, 0, 0.72, 0);
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => cilindro(base, 0.019, 0.72, sx * 0.35, 0, sz * 0.35, 20));
  caja(base, 0.70, 0.02, 0.02, 0, 0.62, -0.35);
  caja(base, 0.70, 0.02, 0.02, 0, 0.62, 0.35);
  caja(base, 0.02, 0.02, 0.70, -0.35, 0.62, 0);
  caja(base, 0.02, 0.02, 0.70, 0.35, 0.62, 0);
  return [
    { nombre: 'cubierta', color: '#C9A26B', metal: 0, rugoso: 0.5, malla: cubierta },
    { nombre: 'base', color: '#B5B8BC', metal: 0.85, rugoso: 0.25, malla: base }
  ];
}

// dos sillas tapizadas, una junto a la otra
function dosSillas() {
  const estructura = new Malla(), asiento = new Malla();
  const def = { a: 0.42, f: 0.42, hAsiento: 0.46, hTotal: 0.86, grueso: 0.024, travesanos: [0.18], tablillas: [0.60, 0.72] };
  [-0.30, 0.30].forEach(x => sillaEn(estructura, asiento, def, x, 0, 1));
  return [
    { nombre: 'estructura', color: '#B5B8BC', metal: 0.8, rugoso: 0.3, malla: estructura },
    { nombre: 'asiento', color: '#7A1020', metal: 0, rugoso: 0.85, malla: asiento }
  ];
}
// perchero de pie: base redonda, poste y ganchos arriba
function perchero() {
  const base = new Malla();
  cilindro(base, 0.20, 0.03, 0, 0, 0, 40);
  cilindro(base, 0.02, 1.70, 0, 0.03, 0, 16);
  [0, 1, 2, 3].forEach(i => {
    const a = i * Math.PI / 2, x = Math.cos(a) * 0.07, z = Math.sin(a) * 0.07;
    cilindro(base, 0.012, 0.10, x, 1.62, z, 10);
    cilindro(base, 0.018, 0.02, x * 1.8, 1.70, z * 1.8, 10);
  });
  return [{ nombre: 'base', color: '#1C1C1C', metal: 0.6, rugoso: 0.45, malla: base }];
}

// mesa cuadrada de pedestal con dos sillas, una de cada lado
function juego(c) {
  const cubierta = new Malla(), base = new Malla(), estructura = new Malla(), asiento = new Malla();
  caja(cubierta, 0.80, 0.03, 0.80, 0, 0.72, 0);
  caja(base, 0.22, 0.012, 0.22, 0, 0.708, 0);
  cilindro(base, 0.04, 0.666, 0, 0.042, 0);
  caja(base, 0.56, 0.03, 0.06, 0, 0.012, 0);
  caja(base, 0.06, 0.03, 0.56, 0, 0.012, 0);
  const def = { a: 0.42, f: 0.42, hAsiento: 0.46, hTotal: 0.86, grueso: 0.024, travesanos: [0.18], tablillas: [0.60, 0.72] };
  sillaEn(estructura, asiento, def, 0, 0.65, -1);
  sillaEn(estructura, asiento, def, 0, -0.65, 1);
  return [
    { nombre: 'cubierta', color: c.cubierta, metal: 0, rugoso: 0.5, malla: cubierta },
    { nombre: 'base', color: c.base, metal: 0.6, rugoso: 0.45, malla: base },
    { nombre: 'estructura', color: c.estructura, metal: 0.6, rugoso: 0.45, malla: estructura },
    { nombre: 'asiento', color: c.asiento, metal: 0, rugoso: 0.85, malla: asiento }
  ];
}

const MUEBLES = {
  'mesa-cruceta': mesaCuadrada,
  'mesa-placa': mesaRedonda,
  'silla-madera': () => silla({ a: 0.44, f: 0.44, hAsiento: 0.48, hTotal: 0.88, travesanos: [0.2], tablillas: [0.55, 0.66, 0.77] }),
  'banco-4444': () => silla({ a: 0.42, f: 0.42, hAsiento: 0.76, hTotal: 1.10, travesanos: [0.30], travesanosAtras: true, tablillas: [0.86, 0.95, 1.03] }),
  'booth-vino': booth,
  'sillon-bar': () => silla({ a: 0.52, f: 0.50, hAsiento: 0.76, hTotal: 1.12, travesanos: [0.30], travesanosAtras: true, tablillas: [0.88, 0.97, 1.05], brazos: true }),
  'bancos-pedestal': dosSillas,
  'base-alta': mesitaAlta,
  'juego-fierro': () => juego({ cubierta: '#1E1E1E', base: '#1C1C1C', estructura: '#1C1C1C', asiento: '#202020' }),
  'cambridge': () => juego({ cubierta: '#F2F0EA', base: '#B5B8BC', estructura: '#B5B8BC', asiento: '#B5B8BC' }),
  'mesa-patas': mesaPatas,
  'base-2522': mesaDosSoportes,
  'perchero': perchero
};

fs.mkdirSync(SALIDA, { recursive: true });
Object.keys(MUEBLES).forEach(id => {
  const datos = armarGlb(id, MUEBLES[id]());
  fs.writeFileSync(path.join(SALIDA, id + '.glb'), datos);
  console.log(id + '.glb', datos.length + ' bytes');
});
