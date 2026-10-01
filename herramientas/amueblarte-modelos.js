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
      pbrMetallicRoughness: { baseColorFactor: aLineal(m.color).concat(m.alpha == null ? 1 : m.alpha), metallicFactor: m.metal, roughnessFactor: m.rugoso },
      ...(m.alpha == null ? {} : { alphaMode: 'BLEND', doubleSided: true })
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
// Todo son cajas, a tamaño real y en metros, con el origen en el piso. Son una idea simple de cada mueble,
// no una copia exacta: sirven para girarlos, ver sus medidas y probar colores.
const mat = (nombre, color, malla, metal, rugoso, alpha) => ({ nombre, color, metal: metal || 0, rugoso: rugoso == null ? 0.7 : rugoso, malla, alpha });

// Recámara: cama con cabecera, dos burós y una cómoda. cab = 'ancha' (panel de pared) o 'angosta' (del ancho de la cama).
function recamara(c) {
  const madera = new Malla(), cabecera = new Malla(), base = new Malla(), colchon = new Malla();
  caja(base, 1.70, 0.30, 2.05, 0, 0, 0);
  caja(colchon, 1.60, 0.22, 1.95, 0, 0.30, 0.03);
  if (c.cab === 'ancha') caja(cabecera, 2.70, 1.15, 0.08, 0, 0.12, -1.065);
  else caja(cabecera, 1.90, 1.10, 0.10, 0, 0.12, -1.075);
  [-1, 1].forEach(s => caja(madera, 0.45, 0.50, 0.42, s * 1.18, 0.10, -0.83));
  caja(madera, 1.40, 0.85, 0.45, 0, 0, 2.10);
  return [
    mat('madera', c.madera, madera, 0.05, 0.55),
    mat('cabecera', c.cabecera, cabecera, 0, c.tapizada ? 0.9 : 0.55),
    mat('base', c.base, base, 0, c.tapizada ? 0.9 : 0.55),
    mat('colchon', '#F2F0EA', colchon, 0, 0.9)
  ];
}

// Sala en L: sillón largo con respaldo y un chaise a la derecha.
function sala() {
  const tapizado = new Malla(), madera = new Malla();
  caja(madera, 3.10, 0.06, 0.90, 0, 0, -0.02);
  caja(madera, 0.80, 0.06, 1.20, 1.15, 0, 1.075);
  caja(tapizado, 3.20, 0.40, 0.95, 0, 0.06, -0.025);
  caja(tapizado, 0.90, 0.40, 1.25, 1.15, 0.06, 1.075);
  caja(tapizado, 3.00, 0.45, 0.22, 0, 0.46, -0.39);
  caja(tapizado, 0.20, 0.28, 0.95, -1.50, 0.46, -0.025);
  caja(tapizado, 0.20, 0.28, 1.25, 1.50, 0.46, 1.075);
  return [mat('tapizado', '#E4DCCB', tapizado, 0, 0.92), mat('madera', '#6B4423', madera, 0.05, 0.55)];
}

// Comedor: mesa de pedestal con 6 sillas (2 por lado largo y 1 por cabecera).
function comedor(c) {
  const cubierta = new Malla(), estructura = new Malla(), asiento = new Malla();
  caja(cubierta, 1.60, 0.04, 0.90, 0, 0.72, 0);
  caja(estructura, 0.50, 0.72, 0.50, 0, 0, 0);
  // silla: (cx, cz) es su centro; eje 'z' o 'x' es el lado de la mesa; s = +1 / -1 decide hacia dónde mira
  const sillaS = (cx, cz, eje, s) => {
    const C = (m, w, h, d, lx, y, lz) => eje === 'z'
      ? caja(m, w, h, d, cx + lx, y, cz + s * lz)
      : caja(m, d, h, w, cx + s * lz, y, cz + lx);
    C(asiento, 0.46, 0.06, 0.46, 0, 0.42, 0);
    C(asiento, 0.46, 0.42, 0.05, 0, 0.48, -0.205);
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([a, b]) => C(estructura, 0.045, 0.42, 0.045, a * 0.20, 0, b * 0.20));
  };
  [-0.40, 0.40].forEach(x => { sillaS(x, 0.74, 'z', -1); sillaS(x, -0.74, 'z', 1); });
  sillaS(1.06, 0, 'x', -1);
  sillaS(-1.06, 0, 'x', 1);
  return [mat('cubierta', c.cubierta, cubierta, 0, 0.45), mat('estructura', c.estructura, estructura, 0.05, 0.55), mat('asiento', c.asiento, asiento, 0, 0.92)];
}

// Mesa de centro: dos bloques de madera abajo, dos tablones arriba y un cristal en medio.
function mesaElegance() {
  const madera = new Malla(), cristal = new Malla();
  [-1, 1].forEach(s => caja(madera, 0.30, 0.30, 0.70, s * 0.40, 0, 0));
  [-1, 1].forEach(s => caja(madera, 1.10, 0.12, 0.20, 0, 0.30, s * 0.25));
  caja(cristal, 1.04, 0.012, 0.30, 0, 0.36, 0);
  return [mat('madera', '#8A4B22', madera, 0.05, 0.5), mat('cristal', '#9FC5BE', cristal, 0.1, 0.1, 0.35)];
}

// Cama infantil con cabecera de picos y una cama nido que se jala hacia el frente.
function camaPaulette() {
  const tapizado = new Malla(), colchon = new Malla();
  caja(tapizado, 1.00, 0.30, 1.95, 0, 0.05, 0);
  caja(colchon, 0.90, 0.18, 1.85, 0, 0.35, 0.02);
  [0.75, 1.0, 0.85, 1.25, 0.85, 1.0, 0.75].forEach((h, i) => caja(tapizado, 0.15, h, 0.08, (i - 3) * 0.15, 0.05, -1.03));
  caja(tapizado, 0.90, 0.22, 1.90, 0, 0.03, 1.45);
  caja(colchon, 0.82, 0.14, 1.80, 0, 0.25, 1.45);
  return [mat('tapizado', '#D9A9AE', tapizado, 0, 0.92), mat('colchon', '#F2F0EA', colchon, 0, 0.9)];
}

const MUEBLES = {
  'recamara-bulgaria': () => recamara({ cab: 'ancha', madera: '#8A4B22', cabecera: '#8A4B22', base: '#8A4B22' }),
  'recamara-venecia': () => recamara({ cab: 'angosta', tapizada: true, madera: '#5A3A24', cabecera: '#E4DCCB', base: '#E4DCCB' }),
  'recamara-milan': () => recamara({ cab: 'ancha', madera: '#8A4B22', cabecera: '#8A4B22', base: '#8A4B22' }),
  'recamara-monaco': () => recamara({ cab: 'angosta', madera: '#BDB09B', cabecera: '#BDB09B', base: '#BDB09B' }),
  'sala-guinea': sala,
  'comedor-berlin': () => comedor({ cubierta: '#8A4B22', estructura: '#5A3A24', asiento: '#E4DCCB' }),
  'comedor-toledo': () => comedor({ cubierta: '#8A4B22', estructura: '#5A3A24', asiento: '#9A9A9C' }),
  'mesa-elegance': mesaElegance,
  'cama-paulette': camaPaulette
};

fs.mkdirSync(SALIDA, { recursive: true });
// los modelos anteriores (de otro negocio) ya no se usan: se borran para que no se queden en la carpeta
fs.readdirSync(SALIDA).filter(f => f.endsWith('.glb') && !MUEBLES[f.slice(0, -4)]).forEach(f => fs.unlinkSync(path.join(SALIDA, f)));
Object.keys(MUEBLES).forEach(id => {
  const datos = armarGlb(id, MUEBLES[id]());
  fs.writeFileSync(path.join(SALIDA, id + '.glb'), datos);
  console.log(id + '.glb', datos.length + ' bytes');
});
