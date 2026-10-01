/*
  Muestra de AmueblArte (copia de la base de Mariscos 8 Tostadas). muestra.js solo pinta lo que hay aquí.
  Los nombres y precios de los planes salen de planes.js (window.PLANES_185).

  FUNCIONES: lo que incluyen los planes, sin las funciones del catálogo (esas se eligen aparte).
  - id: clave sin acentos. Va en el mensaje para Claude Code y muestra.js la usa para pintar su parte.
  - plan: 'esencial', 'negocio' o 'pro', o 'catalogo' si es una función del catálogo de Tarifas.
  - peso: cuántas funciones del catálogo cuenta (2 si en Tarifas lleva ×2). Sin peso cuenta 1.
  - activa: si empieza prendida. servicio: true si no se ve en la página. fija: true si no se puede apagar.
  - obligatoriaCon: ids que la prenden y no la dejan apagar. nota: aclaración que va al mensaje.
  - opcional: true si "Llenar como" no la toca. presetDesde: plan desde el que "Llenar como" la prende.
  Se quitaron las que no aplican a una mueblería o para las que todavía no hay datos: horarios, "abierto ahora",
  reservación de mesas, eventos, redes y varias sucursales. Si el negocio las quiere, se vuelven a agregar
  (la base está en ../mariscos8tostadas-muestra/).

  NEGOCIO: contenido de la página.
  - titular, direccion, telefonos, correos: van siempre en el pie (Ley Federal de Protección al Consumidor,
    art. 76 bis) y en el aviso de privacidad. correoDatos es donde el cliente final pide ver o borrar sus datos.
  - categorias: las 6 en que se reordenó el catálogo viejo. img es la foto de su tarjeta.
  - productos: cada mueble va en una o más categorías (cats), porque varios sirven para bar, restaurante y cafetería.
    Sin precio: se cotiza. modelo (opcional): archivo 3D en modelos/ (lo genera herramientas/amueblarte-modelos.js),
    sus medidas y qué materiales se pueden cambiar de color (opciones: material del .glb y paleta de PALETAS).
  - combina (opcional): ids de muebles que se enseñan como "Combina con" en el visor.
  - portada, nosotros, proceso, trabajos: textos y fotos de la portada y de ¿Quiénes somos?. Todo lo que cambia por negocio vive aquí.
  - PALETAS: colores de ejemplo para el 3D y para la sección de acabados. Los acabados reales los da el negocio.
  - faq: si una pregunta lleva funcion, solo sale con esa función prendida. {direccion} se cambia por la dirección.
  - terminos, leyendaPrecios, anticipo, titular: los usan el aviso de privacidad y los Términos de ejemplo.
*/
window.MUESTRA_DATOS = {
  negocioEjemplo: 'AmueblArte',
  // WhatsApp de 185ChangarroWeb (el mismo de la portada): ahí llega la petición del botón "Generar petición"
  WHATSAPP_185: '523151260581',

  FUNCIONES: [
    { id: 'productos', plan: 'esencial', nombre: 'Catálogo por categorías', descripcion: 'Lo que fabrica, ordenado en Bar, Restaurante, Cafetería, Mesas y bases, Accesorios y Arreglo de muebles. Sin precios publicados: se cotiza.', activa: true },
    { id: 'galeria', plan: 'esencial', nombre: 'Galería de cada categoría', descripcion: 'Fotos de cada mueble; se agrandan al tocarlas.', activa: true },
    { id: 'whatsapp', plan: 'esencial', nombre: 'Botón de WhatsApp', descripcion: 'Botón fijo que abre el chat con un mensaje ya escrito. En el catálogo, cada mueble se agrega a una lista de cotización que se manda en ese mensaje.', activa: true,
      nota: 'necesita el número de WhatsApp del negocio' },
    { id: 'ubicacion', plan: 'esencial', nombre: 'Mapa y dirección', descripcion: 'Dirección, mapa y botón para llegar.', activa: true },
    { id: 'qr', plan: 'esencial', nombre: 'QR para imprimir', descripcion: 'Para el mostrador, volantes o tarjetas.', activa: true },
    { id: 'dominio', plan: 'esencial', nombre: 'Dominio propio', descripcion: 'Ya tienen amueblarte.com: la página se conecta a ese dominio, o se registra un .com.mx.', activa: true, servicio: true },
    { id: 'privacidad', plan: 'esencial', nombre: 'Aviso de privacidad', descripcion: 'Siempre va. Es obligatorio si la página pide datos.', activa: true, fija: true },
    { id: 'contacto', plan: 'esencial', nombre: 'Datos del negocio en el pie', descripcion: 'Dirección, teléfono y correo. La ley pide que quien vende diga quién es y cómo contactarlo.', activa: true, fija: true },
    { id: 'terminos', plan: 'esencial', nombre: 'Términos y Condiciones', descripcion: 'Opcional, salvo que la página reciba pedidos o pagos: ahí son obligatorios.', activa: false, opcional: true, obligatoriaCon: ['pedidos'] },

    { id: 'resenas', plan: 'negocio', nombre: 'Reseñas', descripcion: 'Opiniones de clientes.', activa: true },
    { id: 'faq', plan: 'negocio', nombre: 'Preguntas frecuentes', descripcion: 'Respuestas a lo que más preguntan.', activa: false },
    { id: 'google', plan: 'negocio', nombre: 'Ficha de Google Maps', descripcion: 'Alta y arreglo de la ficha, con QR para pedir reseñas.', activa: false },
    { id: 'asistente', plan: 'negocio', nombre: 'Asistente en la página', descripcion: 'Contesta con los datos del negocio.', activa: false },
    { id: 'correo', plan: 'negocio', nombre: 'Correo profesional', descripcion: 'contacto@su-dominio. Con costo extra en Negocio, incluido en Pro.', activa: false, presetDesde: 'pro', nota: 'con costo extra en el plan Negocio; incluido en Negocio + Asistente Pro' },

    { id: 'pedidos', plan: 'pro', nombre: 'Pedidos con anticipo', descripcion: 'Con liga de pago externa.', activa: false },
    { id: 'wabusiness', plan: 'pro', nombre: 'WhatsApp Business configurado', descripcion: 'Bienvenida, ausencia, respuestas rápidas y catálogo.', activa: false, servicio: true },
    { id: 'reporte', plan: 'pro', nombre: 'Reporte mensual', descripcion: 'Visitas, clics, cotizaciones y pedidos.', activa: false, servicio: true },
    { id: 'disenos', plan: 'pro', nombre: '2 diseños de promoción al mes', descripcion: 'Para WhatsApp y redes.', activa: false, servicio: true },
    { id: 'respuestas', plan: 'pro', nombre: 'Respuestas a reseñas de Google', descripcion: 'Se las redactamos.', activa: false, servicio: true },

    { id: 'buscador', plan: 'catalogo', nombre: 'Catálogo con buscador y filtros', descripcion: 'Caja de búsqueda y categorías para encontrar un mueble al instante, como el buscador de su página actual.', activa: true, peso: 2,
      nota: 'función del catálogo, cuenta como 2' },
    // Extras cotizables: no vienen en ningún plan ni en el catálogo, se pagan una sola vez y no cuentan como funciones del plan.
    // opcional: "Llenar como" no los toca. Los precios y paquetes están en EXTRAS (más abajo).
    { id: 'modelos3d', plan: 'extras', nombre: 'Modelos 3D de sus muebles', descripcion: 'El cliente gira el mueble en 3D, ve sus medidas y le prueba colores antes de cotizar.', activa: true, opcional: true,
      obligatoriaCon: ['ar'], nota: 'extra cotizable, pago único: se cotiza por paquete de modelos' },
    { id: 'ar', plan: 'extras', nombre: 'Realidad aumentada (AR)', descripcion: 'Con la cámara del celular, el cliente coloca el mueble en su local, a tamaño real. Necesita los modelos 3D. Es solo una idea: se aplica en la página oficial si el negocio la contrata.', activa: true, opcional: true,
      nota: 'extra cotizable, pago único; requiere los modelos 3D' }
  ],

  /*
    EXTRAS: lo que se enseña en el grupo "Extras cotizables" (precios en pesos, pago único, IVA incluido, igual que los planes).
    El desglose de cómo se calcularon (costos, esfuerzo y ganancia) NO va aquí: esto lo descarga el navegador del cliente.
    - modelos3d.paquetes: n modelos y su precio. paqueteBase es el que viene marcado al abrir.
    - ar: precio de la configuración, cuántos modelos cubre y cuánto cuesta cada modelo adicional.
  */
  EXTRAS: {
    modelos3d: {
      paqueteBase: 20,
      paquetes: [
        { n: 1, precio: 155 },
        { n: 5, precio: 700 },
        { n: 10, precio: 1350 },
        { n: 20, precio: 2500 },
        { n: 40, precio: 4750 },
        { n: 60, precio: 6150 }
      ],
      incluye: [
        'Cada mueble modelado a partir de sus fotos (hasta 4 por mueble)',
        'Medidas reales para que se vea del tamaño correcto',
        'Colores y acabados que el cliente puede cambiar',
        'Publicado en su página, sin mensualidad extra'
      ]
    },
    ar: {
      precio: 1350,
      incluyeModelos: 20,
      modeloExtra: 40,
      incluye: [
        'Botón "Ver en mi espacio" en cada mueble con 3D',
        'Funciona en Android y en iPhone, sin descargar ninguna app',
        'Tamaño real y colocación sobre el piso',
        'Probado en celulares reales antes de entregarlo'
      ]
    }
  },

  NEGOCIO: {
    titular: 'Nombre del dueño o razón social',
    correoDatos: 'info@amueblarte.com',
    // QR real: lleva directo a esta muestra en nuestro sitio (https://one85changarroweb.onrender.com/amueblarte-muestra/).
    // Se generó sin servicios intermedios, así que no caduca. ?v= obliga a bajar la imagen nueva si se cambia.
    qr: 'img/qr.png?v=1',
    // su Facebook (con el teléfono 392 121 4132, que también viene de ahí)
    facebook: 'https://www.facebook.com/p/AmueblArte-100091426114526/',
    // dominio que ya tiene el negocio (en la barra de la muestra y en el correo profesional)
    dominioPropio: 'amueblarte.com',
    // vino tinto de su página actual
    color: '#6D0305',
    logo: 'img/logo-negocio.png',
    mensajeWhatsapp: 'Hola, vi su página y quiero cotizar unos muebles.',
    lema: 'La base de su negocio',
    desde: 1986,
    leyendaPrecios: 'Precios en pesos mexicanos, con IVA incluido.',
    // porcentaje del anticipo que se enseña con la función "Pedidos con anticipo" (ejemplo: lo fija el negocio)
    anticipo: 50,

    // portada: texto, foto (img/) y el mueble con 3D que abre el botón "Míralo en 3D" (id de un producto con modelo)
    portada: {
      texto: 'Bases fundidas y tubulares, mesas, percheros, booths, sillas y bancos para cafeterías y restaurantes.',
      foto: 'img/home-cambridge.jpg',
      fotoAlt: 'Mesa cuadrada con cuatro sillas gris-plata',
      destacado3d: 'mesa-cruceta'
    },
    // ¿Quiénes somos?: texto (sigue al nombre del negocio), ciudad corta (para el dato grande) y el aviso de que el texto final lo da el dueño
    nosotros: {
      texto: 'fabrica bases fundidas y tubulares, mesas, percheros, booths, sillas y bancos para cafeterías y restaurantes.',
      ciudad: 'Ocotlán',
      aviso: 'Aquí va la historia del negocio, su taller y su equipo, con lo que el dueño nos cuente. Por ahora solo usamos lo que dice su página actual.'
    },
    // "Cómo trabajamos": pasos de ejemplo. Se confirman con el negocio antes de publicar.
    proceso: [
      { t: 'Cotización', d: 'Nos dices qué muebles, cuántos y para qué tipo de negocio.' },
      { t: 'Acabados', d: 'Eliges el color del tapiz, de la cubierta y de la base.' },
      { t: 'Fabricación', d: 'Los fabricamos con las medidas y acabados acordados.' },
      { t: 'Entrega', d: 'Acordamos contigo cómo y cuándo recibirlos.' }
    ],
    // fotos de muebles ya en servicio (portada de Nosotros); id = producto que abre al tocarla
    trabajos: [
      { id: 'bancos-pedestal', img: 'img/home-bar.jpg', t: 'Bar' },
      { id: 'booth-mesa', img: 'img/home-booth.jpg', t: 'Restaurante' },
      { id: 'cambridge', img: 'img/home-cambridge.jpg', t: 'Cafetería' },
      { id: 'mesa-cruceta', img: 'img/home-mesa-madera.jpg', t: 'Comedor' }
    ],

    // razones para elegirlos (portada). {anios} se cambia por los años desde `desde`. Solo lo que ya dice su página actual.
    ventajas: [
      { t: '{anios} años fabricando', d: 'Bases, mesas, booths, sillas y bancos hechos por nosotros desde 1986.' },
      { t: 'Acabados a tu gusto', d: 'Elige el color del tapiz, de la cubierta y de la base.' },
      { t: 'Cotización sin compromiso', d: 'Arma tu lista y te respondemos con los precios.' },
      { t: 'También reparamos', d: 'Arreglamos tus sillas y mesas para que sigan en servicio.' }
    ],
    // cómo cotizar (portada, con WhatsApp prendido)
    pasos: [
      { t: 'Elige', d: 'Busca en el catálogo y toca "+ Cotizar" en cada mueble.' },
      { t: 'Revisa', d: 'Ajusta cantidades en "Mi cotización" y escribe tu nombre.' },
      { t: 'Envía', d: 'Mándanos tu lista por WhatsApp y te respondemos con precios.' }
    ],

    // antes y después de la categoría "Arreglo de muebles". Es una reparación INVENTADA para la muestra (se marca como Ejemplo);
    // en la página final van trabajos reales del negocio, con su permiso. antes/despues: imágenes en img/.
    reparaciones: [
      { titulo: 'Silla de restaurante', antes: 'img/reparacion-antes.svg', despues: 'img/reparacion-despues.svg',
        problema: 'El asiento estaba roto y sin relleno, y una pata se había aflojado.',
        hecho: ['Se quitó el tapiz viejo y se cambió el relleno', 'Se retapizó el asiento en vino', 'Se reafirmó la pata floja', 'Se lijó y barnizó la estructura'] }
    ],

    // 13 categorías del catálogo viejo → 6:
    // Bar ← Bancos para Restaurantes y Bares · Sillones para Bar · Taburetes · Bases y Mesas Altas
    // Restaurante ← Sillas para Restaurante · Booths · Juegos de Mesas
    // Cafetería ← Sillas para Cafetería · Taburetes · Juegos de Mesas
    // Mesas y bases ← Bases y Mesas (fierro fundido, aluminio, tubular) · Bases y Mesas Altas · Cubiertas
    // Accesorios ← Niveladores · Percheros · Productos de Apoyo
    // Arreglo de muebles ← Arreglo de muebles
    categorias: [
      { id: 'bar', nombre: 'Bar', img: 'img/banco-madera.jpg', texto: 'Bancos, sillones y mesas altas para barra y botanero.' },
      { id: 'restaurante', nombre: 'Restaurante', img: 'img/home-booth.jpg', texto: 'Sillas, booths y juegos de mesa para el comedor.' },
      { id: 'cafeteria', nombre: 'Cafetería', img: 'img/home-cambridge.jpg', texto: 'Sillas, taburetes y mesas para cafeterías.' },
      { id: 'mesas', nombre: 'Mesas y bases', img: 'img/mesa-placa.jpg', texto: 'Bases de fierro fundido, aluminio y tubular, y cubiertas.' },
      { id: 'accesorios', nombre: 'Accesorios', img: 'img/perchero.jpg', texto: 'Niveladores, percheros y productos de apoyo.' },
      { id: 'arreglo', nombre: 'Arreglo de muebles', img: 'img/arreglo-silla.jpg', texto: 'Reparación de muebles.',
        aviso: 'Para cotizar una reparación, agrégala a tu lista y, en tus comentarios, cuéntanos qué mueble es, qué le pasa y cuántos son. Si tienes una foto, mándala por WhatsApp.' }
    ],

    PALETAS: {
      cubierta: [{ n: 'Nogal', c: '#6B4423' }, { n: 'Roble claro', c: '#C9A26B' }, { n: 'Negro', c: '#1E1E1E' }, { n: 'Blanco', c: '#F2F0EA' }, { n: 'Gris', c: '#8B8D8F' }],
      base: [{ n: 'Negro', c: '#1C1C1C' }, { n: 'Gris-plata', c: '#B5B8BC' }, { n: 'Bronce', c: '#5A3D28' }],
      madera: [{ n: 'Nogal', c: '#6B4423' }, { n: 'Roble claro', c: '#C9A26B' }, { n: 'Negro', c: '#1E1E1E' }, { n: 'Gris-plata', c: '#B5B8BC' }],
      tapiz: [{ n: 'Vino', c: '#7A1020' }, { n: 'Negro', c: '#202020' }, { n: 'Crema', c: '#D9C9A8' }, { n: 'Gris', c: '#7E7E80' }, { n: 'Azul marino', c: '#1F2E4D' }]
    },

    productos: [
      { id: 'banco-4444', nombre: 'Banco mod. 4444', img: 'img/banco-madera.jpg', cats: ['bar'],
        desc: 'Banco alto de madera con respaldo y asiento tapizado.',
        modelo: { glb: 'modelos/banco-4444.glb', medidas: '42 × 42 cm, 1.10 m de alto, asiento a 76 cm',
          opciones: [{ nombre: 'Asiento', mat: 'asiento', paleta: 'tapiz' }, { nombre: 'Estructura', mat: 'estructura', paleta: 'madera' }] } ,
        combina: ['base-alta', 'bancos-pedestal'] },
      { id: 'sillon-bar', nombre: 'Sillón para bar', img: 'img/sillon-bar.jpg', cats: ['bar'],
        desc: 'Sillón alto de madera con respaldo de tablillas y asiento tapizado. En la foto, junto a una mesa alta con cubierta de cristal.',
        modelo: { glb: 'modelos/sillon-bar.glb', medidas: '52 × 50 cm, 1.12 m de alto, asiento a 76 cm',
          opciones: [{ nombre: 'Asiento', mat: 'asiento', paleta: 'tapiz' }, { nombre: 'Estructura', mat: 'estructura', paleta: 'madera' }] },
        combina: ['banco-4444', 'base-alta'] },
      { id: 'bancos-pedestal', nombre: 'Bancos tapizados', img: 'img/home-bar.jpg', cats: ['bar', 'cafeteria'],
        desc: 'Bancos altos con asiento tapizado en vino y estructura gris-plata, junto a una mesa alta de pedestal.',
        modelo: { glb: 'modelos/bancos-pedestal.glb', medidas: 'dos sillas de 42 × 42 cm, 86 cm de alto, asiento a 46 cm',
          opciones: [{ nombre: 'Asiento', mat: 'asiento', paleta: 'tapiz' }, { nombre: 'Estructura', mat: 'estructura', paleta: 'madera' }] },
        combina: ['base-alta', 'banco-4444'] },
      { id: 'base-alta', nombre: 'Base alta tubular', img: 'img/base-alta.jpg', cats: ['bar', 'mesas'],
        desc: 'Base alta para mesa de bar, en tubular con acabado negro y cruceta de piso.',
        modelo: { glb: 'modelos/base-alta.glb', medidas: 'mesita alta de Ø 60 cm y 1.05 m de alto',
          opciones: [{ nombre: 'Cubierta', mat: 'cubierta', paleta: 'cubierta' }, { nombre: 'Base', mat: 'base', paleta: 'base' }] },
        combina: ['bancos-pedestal', 'cubiertas'] },

      { id: 'booth-mesa', nombre: 'Booth con mesa y sillas', img: 'img/home-booth.jpg', cats: ['restaurante'],
        desc: 'Booth tapizado en franjas, mesa de cubierta oscura con base fundida y sillas de fierro.',
        combina: ['booth-vino', 'silla-madera'] },
      { id: 'booth-vino', nombre: 'Booth tapizado en vino', img: 'img/booth-rojo.jpg', cats: ['restaurante'],
        desc: 'Respaldo de booth acojinado en canales verticales, tapizado en vino y con remate de madera.',
        modelo: { glb: 'modelos/booth-vino.glb', medidas: '1.40 m de ancho, 66 cm de fondo, 1.12 m de alto',
          opciones: [{ nombre: 'Tapiz', mat: 'tapizado', paleta: 'tapiz' }, { nombre: 'Madera', mat: 'base', paleta: 'madera' }] } ,
        combina: ['booth-mesa'] },
      { id: 'silla-madera', nombre: 'Silla de madera', img: 'img/silla-madera.jpg', cats: ['restaurante', 'cafeteria'],
        desc: 'Silla de madera con respaldo de tablillas y asiento tapizado.',
        modelo: { glb: 'modelos/silla-madera.glb', medidas: '44 × 44 cm, 88 cm de alto',
          opciones: [{ nombre: 'Asiento', mat: 'asiento', paleta: 'tapiz' }, { nombre: 'Estructura', mat: 'estructura', paleta: 'madera' }] } ,
        combina: ['mesa-cruceta', 'mesa-patas'] },
      { id: 'juego-fierro', nombre: 'Sillas de fierro con mesa', img: 'img/juego-mesa-negro.jpg', cats: ['restaurante', 'cafeteria'],
        desc: 'Sillas de fierro negro con asiento tapizado y mesa de cubierta oscura con canto de madera clara.',
        modelo: { glb: 'modelos/juego-fierro.glb', medidas: 'Mesa de 80 × 80 cm y 75 cm de alto, con dos sillas',
          opciones: [{ nombre: 'Cubierta', mat: 'cubierta', paleta: 'cubierta' }, { nombre: 'Base', mat: 'base', paleta: 'base' }, { nombre: 'Sillas', mat: 'estructura', paleta: 'base' }, { nombre: 'Asiento', mat: 'asiento', paleta: 'tapiz' }] },
        combina: ['mesa-cruceta', 'nivelador'] },
      { id: 'mesa-cruceta', nombre: 'Mesa con base de cruceta', img: 'img/home-mesa-madera.jpg', cats: ['restaurante', 'mesas'],
        desc: 'Mesa cuadrada con cubierta de veta de madera y base de cruceta, junto a sillas de madera.',
        modelo: { glb: 'modelos/mesa-cruceta.glb', medidas: '80 × 80 cm, 75 cm de alto',
          opciones: [{ nombre: 'Cubierta', mat: 'cubierta', paleta: 'cubierta' }, { nombre: 'Base', mat: 'base', paleta: 'base' }] } ,
        combina: ['silla-madera', 'cubiertas'] },

      { id: 'cambridge', nombre: 'Juego Cambridge gris-plata', img: 'img/home-cambridge.jpg', cats: ['cafeteria', 'restaurante'],
        desc: 'Sillas Cambridge en acabado gris-plata. Mesa de 80 × 80 con Rexcel y canto en PVC, con pedestal 200 en acabado gris-plata.',
        modelo: { glb: 'modelos/cambridge.glb', medidas: 'Mesa de 80 × 80 cm y 75 cm de alto, con dos sillas',
          opciones: [{ nombre: 'Cubierta', mat: 'cubierta', paleta: 'cubierta' }, { nombre: 'Base', mat: 'base', paleta: 'base' }, { nombre: 'Sillas', mat: 'estructura', paleta: 'base' }, { nombre: 'Asiento', mat: 'asiento', paleta: 'tapiz' }] },
        combina: ['mesa-placa', 'nivelador'] },
      { id: 'mesa-placa', nombre: 'Mesa redonda con base de placa', img: 'img/mesa-placa.jpg', cats: ['cafeteria', 'mesas'],
        desc: 'Mesa con base de placa de acero (de su elección) y tubo de 2" para fijar a cristal o a cubierta de madera (según su elección).',
        modelo: { glb: 'modelos/mesa-placa.glb', medidas: 'Ø 80 cm, 75 cm de alto',
          opciones: [{ nombre: 'Cubierta', mat: 'cubierta', paleta: 'cubierta' }, { nombre: 'Base', mat: 'base', paleta: 'base' }] } ,
        combina: ['silla-madera', 'cubiertas'] },
      { id: 'mesa-patas', nombre: 'Mesa con patas tubulares', img: 'img/mesa-patas-cromo.jpg', cats: ['cafeteria', 'mesas'],
        desc: 'Mesa con cubierta de madera clara y patas tubulares cromadas.',
        modelo: { glb: 'modelos/mesa-patas.glb', medidas: '80 × 80 cm, 75 cm de alto',
          opciones: [{ nombre: 'Cubierta', mat: 'cubierta', paleta: 'cubierta' }, { nombre: 'Patas', mat: 'base', paleta: 'base' }] },
        combina: ['silla-madera', 'nivelador'] },

      { id: 'base-2522', nombre: 'Base 2522-001', img: 'img/base-2522.jpg', cats: ['mesas'],
        desc: 'Base en fierro fundido acabado en pintura electrostática color negro o gris-plata, para recibir cristal (no incluye cristal).',
        modelo: { glb: 'modelos/base-2522.glb', medidas: 'mesa de 1.60 × 0.70 m y 75 cm de alto, con dos soportes a la par',
          opciones: [{ nombre: 'Cubierta', mat: 'cubierta', paleta: 'cubierta' }, { nombre: 'Base', mat: 'base', paleta: 'base' }] },
        combina: ['cubiertas', 'nivelador'] },
      { id: 'cubiertas', nombre: 'Cubiertas para mesa', img: 'img/cubierta-color.jpg', cats: ['mesas'],
        desc: 'Cubierta para mesa en rosa, con canto azul turquesa.',
        combina: ['base-2522', 'mesa-placa', 'nivelador'] },

      { id: 'nivelador', nombre: 'Niveladores para mesa', img: 'img/nivelador.jpg', cats: ['accesorios'],
        desc: 'Niveladores para las patas de la mesa, para que no cojee en pisos disparejos.',
        combina: ['mesa-cruceta', 'base-2522'] },
      { id: 'perchero', nombre: 'Perchero de pie', img: 'img/perchero.jpg', cats: ['accesorios'],
        desc: 'Perchero de pie con base redonda y ganchos en la parte alta.',
        modelo: { glb: 'modelos/perchero.glb', medidas: 'Base de Ø 40 cm, 1.73 m de alto',
          opciones: [{ nombre: 'Color', mat: 'base', paleta: 'base' }] } },
      { id: 'apoyo', nombre: 'Productos de apoyo', img: 'img/apoyo-pata.jpg', cats: ['accesorios'],
        desc: 'Piezas de apoyo para los muebles. Pregunta por la que necesitas.',
        combina: ['nivelador'] },

      { id: 'arreglo', nombre: 'Arreglo de muebles', img: 'img/arreglo-silla.jpg', cats: ['arreglo'],
        desc: 'Arreglamos tus muebles. En la foto, una silla con el asiento de cinchas en reparación.' }
    ],

    // reseñas inventadas, solo con nombre e inicial: la página les pone la etiqueta "Ejemplo".
    resenas: [
      { autor: 'Laura M.', estrellas: 5, texto: 'Las sillas llegaron bien terminadas y se ven muy bien en el restaurante.' },
      { autor: 'Jorge R.', estrellas: 5, texto: 'Me cotizaron rápido y me ayudaron a escoger las bases para mis mesas.' },
      { autor: 'Ana P.', estrellas: 4, texto: 'Buen trato y muebles resistentes para el uso diario de la cafetería.' }
    ],
    // las respuestas solo hablan de lo que ya hace la página (no se inventan servicios del negocio)
    faq: [
      { p: '¿Cómo pido una cotización?',
        r: 'Agrega los muebles que te interesen con el botón "Cotizar", revisa tu lista en "Mi cotización" y envíala por WhatsApp.' },
      { funcion: 'modelos3d', p: '¿Puedo ver el mueble en 3D?',
        r: 'Sí. Los muebles marcados con "3D" se giran con el dedo o el mouse, muestran sus medidas y puedes probar colores.' },
      { funcion: 'ar', p: '¿Puedo ver cómo se vería un mueble en mi local?',
        r: 'Es una idea para la página oficial, no está en esta muestra. Con ella, en tu celular, tocarías "Ver en mi espacio" en un mueble con 3D y apunta la cámara al piso: se coloca a tamaño real. No necesitas descargar nada.' },
      { p: '¿Hacen reparaciones?', r: 'Sí, arreglamos sillas y mesas. Agrégalo a tu cotización y cuéntanos qué le pasa al mueble.' },
      { p: '¿En cuánto tiempo me los entregan?', r: 'Depende del modelo, el acabado y la cantidad. Te lo confirmamos junto con tu cotización.' },
      { p: '¿Hacen envíos?', r: 'Cuando pidas tu cotización, dinos a dónde los necesitas y te decimos cómo se entregan.' },
      { p: '¿Puedo pedir otro color o medida?', r: 'Sí puedes elegir el color del tapiz, de la cubierta y de la base. Para otras medidas, cuéntanos en tus comentarios.' },
      // {direccion} se cambia por la dirección de la sucursal
      { p: '¿Dónde están?', r: '{direccion}.' }
    ],
    terminos: {
      pagos: 'Efectivo, transferencia y tarjeta. Los pagos en línea se hacen en la página del proveedor de pagos; el negocio no ve ni guarda los datos de tu tarjeta.',
      anticipo: 'El anticipo aparta tu pedido y se descuenta del total.',
      cancelacion: 'Por definir con el negocio.',
      devoluciones: 'Por definir con el negocio.'
    },

    // la dirección es de ejemplo (Ocotlán, Jalisco); el teléfono y el Facebook salen de su Facebook. Se confirman con el negocio antes de publicar
    sucursales: [
      { nombre: 'AmueblArte', zona: 'Col. Ejemplo',
        direccion: 'Col. Ejemplo, Ocotlán, Jalisco',
        telefonos: ['392 121 4132'], correos: ['info@amueblarte.com', 'ventas@amueblarte.com'],
        mapa: '' }
    ]
  }
};
