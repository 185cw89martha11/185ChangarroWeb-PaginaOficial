/*
  Muestra de AmueblArte de OCOTLÁN, Jalisco (mueblería para el hogar). NO es la de AmueblArte de la CDMX (esa vende mobiliario
  para restaurantes y es otro negocio). Copia de la base de Mariscos 8 Tostadas. muestra.js solo pinta lo que hay aquí.
  Las fotos salen de sus redes (Facebook e Instagram); los datos que no se conocen quedan como ejemplo.
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
  - productos: cada mueble va en una o más categorías (cats), porque un mueble puede encajar en más de una (ahora cada uno va en una sola).
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
    { id: 'productos', plan: 'esencial', nombre: 'Catálogo por categorías', descripcion: 'Sus muebles ordenados en Recámaras, Salas, Comedores, Mesas, Camas y Reparación. Sin precios publicados: se cotiza.', activa: true },
    { id: 'galeria', plan: 'esencial', nombre: 'Galería de cada categoría', descripcion: 'Fotos de cada mueble; se agrandan al tocarlas.', activa: true },
    { id: 'whatsapp', plan: 'esencial', nombre: 'Botón de WhatsApp', descripcion: 'Botón fijo que abre el chat con un mensaje ya escrito. En el catálogo, cada mueble se agrega a una lista de cotización que se manda en ese mensaje.', activa: true,
      nota: 'necesita el número de WhatsApp del negocio' },
    { id: 'ubicacion', plan: 'esencial', nombre: 'Mapa y dirección', descripcion: 'Dirección, mapa y botón para llegar.', activa: true },
    { id: 'qr', plan: 'esencial', nombre: 'QR para imprimir', descripcion: 'Para el mostrador, volantes o tarjetas.', activa: true },
    { id: 'dominio', plan: 'esencial', nombre: 'Dominio propio', descripcion: 'Se registra un dominio propio (por ejemplo amueblarte.com.mx, si está disponible) y se conecta a la página.', activa: true, servicio: true },
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

    { id: 'buscador', plan: 'catalogo', nombre: 'Catálogo con buscador y filtros', descripcion: 'Caja de búsqueda y categorías para encontrar un mueble al instante.', activa: true, peso: 2,
      nota: 'función del catálogo, cuenta como 2' },
    // Extras cotizables: no vienen en ningún plan ni en el catálogo, se pagan una sola vez y no cuentan como funciones del plan.
    // opcional: "Llenar como" no los toca. Los precios y paquetes están en EXTRAS (más abajo).
    { id: 'modelos3d', plan: 'extras', nombre: 'Modelos 3D de sus muebles', descripcion: 'El cliente gira el mueble en 3D, ve sus medidas y le prueba colores antes de cotizar.', activa: true, opcional: true,
      obligatoriaCon: ['ar'], nota: 'extra cotizable, pago único: se cotiza por paquete de modelos' },
    { id: 'ar', plan: 'extras', nombre: 'Realidad aumentada (AR)', descripcion: 'Ver el modelo 3D desde la cámara del celular, para verlo en tu casa a tamaño real. Necesita los modelos 3D. Es una opción extra de cotización y no aparece en la muestra: se aplica en la página oficial si el negocio la contrata.', activa: true, opcional: true,
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
    // no se conoce un correo del negocio: el aviso de privacidad manda a sus redes y a su teléfono (ver docPrivacidad)
    correoDatos: '',
    // su Facebook e Instagram (oficiales). El teléfono también viene de ahí.
    facebook: 'https://www.facebook.com/profile.php?id=100091426114526',
    instagram: 'https://www.instagram.com/amueblarte_oficial/',
    // QR real: lleva directo a esta muestra en nuestro sitio (https://one85changarroweb.onrender.com/amueblarte-muestra/).
    // Se generó sin servicios intermedios, así que no caduca. ?v= obliga a bajar la imagen nueva si se cambia.
    qr: 'img/qr.png?v=1',
    // azul marino de su logo
    color: '#1E3A6E',
    logo: 'img/logo-negocio.png',
    mensajeWhatsapp: 'Hola, vi su página y quiero cotizar unos muebles para mi casa.',
    lema: 'Inspiración para tu hogar',
    leyendaPrecios: 'Precios en pesos mexicanos, con IVA incluido.',
    // porcentaje del anticipo que se enseña con la función "Pedidos con anticipo" (ejemplo: lo fija el negocio)
    anticipo: 50,

    // portada: etiqueta chica, texto, foto (img/) y el mueble con 3D que abre el botón "Míralo en 3D" (id de un producto con modelo)
    portada: {
      etiqueta: 'Ocotlán, Jalisco',
      texto: 'Recámaras, salas, comedores, mesas y camas para que tu casa se vea como la imaginas.',
      foto: 'img/recamara-bulgaria.jpg',
      fotoAlt: 'Recámara Bulgaria, con cabecera de madera y luces',
      destacado3d: 'mesa-elegance'
    },
    // ¿Quiénes somos?: texto (sigue al nombre del negocio), dos datos grandes y el aviso de que el texto final lo da el dueño
    nosotros: {
      texto: 'es una mueblería de Ocotlán, Jalisco, con recámaras, salas, comedores, mesas y camas para tu hogar.',
      datos: [{ n: 'Ocotlán', t: 'Jalisco' }, { n: 'Parota', t: 'Chapa, melamina y tapizados' }],
      aviso: 'Aquí va la historia del negocio, su taller y su equipo, con lo que el dueño nos cuente. Por ahora solo usamos lo que se ve en sus redes.'
    },
    // "Cómo trabajamos": pasos de ejemplo. Se confirman con el negocio antes de publicar.
    proceso: [
      { t: 'Cotización', d: 'Nos dices qué muebles quieres y para qué espacio.' },
      { t: 'Acabados', d: 'Eliges el acabado: chapa de parota, melamina o tapiz.' },
      { t: 'Fabricación', d: 'Se hace con las medidas y acabados acordados.' },
      { t: 'Entrega', d: 'Acordamos contigo cómo y cuándo recibirlo.' }
    ],
    // algunos diseños (portada de Nosotros); id = producto que abre al tocarla
    trabajos: [
      { id: 'sala-guinea', img: 'img/sala-guinea.jpg', t: 'Sala' },
      { id: 'comedor-toledo', img: 'img/comedor-toledo.jpg', t: 'Comedor' },
      { id: 'recamara-venecia', img: 'img/recamara-venecia.jpg', t: 'Recámara' },
      { id: 'mesa-elegance', img: 'img/mesa-elegance.jpg', t: 'Mesa de centro' }
    ],
    // antes y después de la categoría "Reparación y retapizado". Es una reparación INVENTADA para la muestra (se marca como Ejemplo);
    // en la página final van trabajos reales del negocio, con su permiso. antes/despues: imágenes en img/.
    reparaciones: [
      { titulo: 'Silla de comedor', antes: 'img/reparacion-antes.svg', despues: 'img/reparacion-despues.svg',
        problema: 'El asiento estaba roto y sin relleno, y una pata se había aflojado.',
        hecho: ['Se quitó el tapiz viejo y se cambió el relleno', 'Se retapizó el asiento en vino', 'Se reafirmó la pata floja', 'Se lijó y barnizó la estructura'] }
    ],

    // razones para elegirlos (portada). Solo lo que se ve en sus redes y lo que hace la página.
    ventajas: [
      { t: 'Muebles para tu hogar', d: 'Recámaras, salas, comedores, mesas de centro y camas.' },
      { t: 'Parota, melamina y tapiz', d: 'Elige el acabado que va con tu casa.' },
      { t: 'Cotización sin compromiso', d: 'Arma tu lista y te respondemos con los precios.' },
      { t: 'Inspiración para tu hogar', d: 'Muebles pensados para que tu casa se vea como la imaginas.' }
    ],
    // cómo cotizar (portada, con WhatsApp prendido)
    pasos: [
      { t: 'Elige', d: 'Busca en el catálogo y toca "+ Cotizar" en cada mueble.' },
      { t: 'Revisa', d: 'Ajusta cantidades en "Mi cotización" y escribe tu nombre.' },
      { t: 'Envía', d: 'Mándanos tu lista por WhatsApp y te respondemos con precios.' }
    ],

    categorias: [
      { id: 'recamaras', nombre: 'Recámaras', img: 'img/recamara-bulgaria.jpg', texto: 'Camas, cabeceras, burós y cómodas.' },
      { id: 'salas', nombre: 'Salas', img: 'img/sala-guinea.jpg', texto: 'Salas y sillones tapizados.' },
      { id: 'comedores', nombre: 'Comedores', img: 'img/comedor-berlin.jpg', texto: 'Mesas con sillas para el comedor.' },
      { id: 'mesas', nombre: 'Mesas', img: 'img/mesa-elegance.jpg', texto: 'Mesas de centro.' },
      { id: 'camas', nombre: 'Camas', img: 'img/cama-paulette.jpg', texto: 'Camas individuales y juveniles.' },
      { id: 'arreglo', nombre: 'Reparación y retapizado', img: 'img/reparacion-despues.svg', texto: 'Dale otra vida a tus muebles.',
        aviso: 'Servicio de ejemplo: el negocio confirma si lo ofrece. Para cotizar, agrégalo a tu lista y cuéntanos en tus comentarios qué mueble es, qué le pasa y cuántos son.' }
    ],

    // colores de ejemplo para el 3D y para la sección de acabados. Los acabados reales los da el negocio.
    PALETAS: {
      madera: [{ n: 'Parota', c: '#8A4B22' }, { n: 'Nogal', c: '#5A3A24' }, { n: 'Roble claro', c: '#C9A26B' }, { n: 'Melamina arena', c: '#BDB09B' }, { n: 'Blanco', c: '#EFEDE8' }],
      tapiz: [{ n: 'Crema', c: '#E4DCCB' }, { n: 'Gris', c: '#9A9A9C' }, { n: 'Rosa', c: '#D9A9AE' }, { n: 'Azul marino', c: '#1F2E4D' }, { n: 'Verde olivo', c: '#6E7A3A' }]
    },

    // ini (opcional) en una opción: posición del color con el que empieza el 3D
    productos: [
      { id: 'recamara-bulgaria', nombre: 'Recámara Bulgaria', img: 'img/recamara-bulgaria.jpg', cats: ['recamaras'],
        desc: 'Cabecera de paneles de madera con luces integradas, base, dos burós y cómoda con espejo.',
        modelo: { glb: 'modelos/recamara-bulgaria.glb', medidas: 'cama de 1.70 × 2.05 m y cabecera de 2.70 m de ancho',
          opciones: [{ nombre: 'Madera', mat: 'madera', paleta: 'madera' }, { nombre: 'Cabecera', mat: 'cabecera', paleta: 'madera' }, { nombre: 'Base', mat: 'base', paleta: 'madera' }] },
        combina: ['recamara-milan', 'recamara-monaco'] },
      { id: 'recamara-venecia', nombre: 'Recámara Venecia', img: 'img/recamara-venecia.jpg', cats: ['recamaras'],
        desc: 'Cabecera y base tapizadas, con dos burós de madera.',
        modelo: { glb: 'modelos/recamara-venecia.glb', medidas: 'cama de 1.70 × 2.05 m y cabecera de 1.90 m de ancho',
          opciones: [{ nombre: 'Burós y cómoda', mat: 'madera', paleta: 'madera', ini: 1 }, { nombre: 'Cabecera', mat: 'cabecera', paleta: 'tapiz' }, { nombre: 'Base', mat: 'base', paleta: 'tapiz' }] },
        combina: ['recamara-monaco', 'cama-paulette'] },
      { id: 'recamara-milan', nombre: 'Recámara Milán', img: 'img/recamara-milan.jpg', cats: ['recamaras'],
        desc: 'En chapa de parota. Cabecera de pared con luces, base, dos burós y cómoda.',
        modelo: { glb: 'modelos/recamara-milan.glb', medidas: 'cama de 1.70 × 2.05 m y cabecera de 2.70 m de ancho',
          opciones: [{ nombre: 'Madera', mat: 'madera', paleta: 'madera' }, { nombre: 'Cabecera', mat: 'cabecera', paleta: 'madera' }, { nombre: 'Base', mat: 'base', paleta: 'madera' }] },
        combina: ['recamara-bulgaria'] },
      { id: 'recamara-monaco', nombre: 'Recámara Mónaco', img: 'img/recamara-monaco.jpg', cats: ['recamaras'],
        desc: 'En melamina. Cabecera con marco, dos burós, cómoda y espejo.',
        modelo: { glb: 'modelos/recamara-monaco.glb', medidas: 'cama de 1.70 × 2.05 m y cabecera de 1.90 m de ancho',
          opciones: [{ nombre: 'Melamina', mat: 'madera', paleta: 'madera', ini: 3 }, { nombre: 'Cabecera', mat: 'cabecera', paleta: 'madera', ini: 3 }, { nombre: 'Base', mat: 'base', paleta: 'madera', ini: 3 }] },
        combina: ['recamara-venecia'] },

      { id: 'sala-guinea', nombre: 'Sala Guinea', img: 'img/sala-guinea.jpg', cats: ['salas'],
        desc: 'Sala seccional tapizada, con respaldos de cojines y un brazo con detalle de madera.',
        modelo: { glb: 'modelos/sala-guinea.glb', medidas: 'sillón de 3.20 m de largo y chaise de 1.25 m',
          opciones: [{ nombre: 'Tapiz', mat: 'tapizado', paleta: 'tapiz' }, { nombre: 'Madera', mat: 'madera', paleta: 'madera', ini: 1 }] },
        combina: ['mesa-elegance'] },

      { id: 'comedor-berlin', nombre: 'Comedor Berlín', img: 'img/comedor-berlin.jpg', cats: ['comedores'],
        desc: 'Comedor de 6 sillas, con mesa en chapa de parota y sillas tapizadas.',
        modelo: { glb: 'modelos/comedor-berlin.glb', medidas: 'mesa de 1.60 × 0.90 m y 75 cm de alto, con 6 sillas',
          opciones: [{ nombre: 'Mesa', mat: 'cubierta', paleta: 'madera' }, { nombre: 'Sillas', mat: 'estructura', paleta: 'madera', ini: 1 }, { nombre: 'Tapiz', mat: 'asiento', paleta: 'tapiz' }] },
        combina: ['comedor-toledo', 'mesa-elegance'] },
      { id: 'comedor-toledo', nombre: 'Comedor Toledo', img: 'img/comedor-toledo.jpg', cats: ['comedores'],
        desc: 'Mesa en chapa de parota con sillas tapizadas en gris y estructura de madera.',
        modelo: { glb: 'modelos/comedor-toledo.glb', medidas: 'mesa de 1.60 × 0.90 m y 75 cm de alto, con 6 sillas',
          opciones: [{ nombre: 'Mesa', mat: 'cubierta', paleta: 'madera' }, { nombre: 'Sillas', mat: 'estructura', paleta: 'madera', ini: 1 }, { nombre: 'Tapiz', mat: 'asiento', paleta: 'tapiz', ini: 1 }] },
        combina: ['comedor-berlin'] },

      { id: 'mesa-elegance', nombre: 'Mesa Elegance', img: 'img/mesa-elegance.jpg', cats: ['mesas'],
        desc: 'Mesa de centro en chapa de parota, con cristal en medio.',
        modelo: { glb: 'modelos/mesa-elegance.glb', medidas: '1.10 × 0.70 m y 42 cm de alto',
          opciones: [{ nombre: 'Madera', mat: 'madera', paleta: 'madera' }] },
        combina: ['sala-guinea', 'comedor-berlin'] },

      { id: 'cama-paulette', nombre: 'Cama Paulette', img: 'img/cama-paulette.jpg', cats: ['camas'],
        desc: 'Cama tapizada en rosa, con cabecera de picos y cama nido.',
        modelo: { glb: 'modelos/cama-paulette.glb', medidas: 'cama de 1.00 × 1.95 m y cama nido que se jala al frente',
          opciones: [{ nombre: 'Tapiz', mat: 'tapizado', paleta: 'tapiz', ini: 2 }] },
        combina: ['recamara-venecia'] },

      { id: 'arreglo', nombre: 'Reparación y retapizado', img: 'img/reparacion-despues.svg', cats: ['arreglo'],
        desc: 'Retapizado y reparación de muebles. En el ejemplo, una silla de comedor con el asiento roto y una pata floja.',
        combina: ['sala-guinea'] }
    ],

    // reseñas inventadas, solo con nombre e inicial: la página les pone la etiqueta "Ejemplo".
    resenas: [
      { autor: 'Laura M.', estrellas: 5, texto: 'Mi recámara quedó justo como la imaginé. Muy buen acabado.' },
      { autor: 'Jorge R.', estrellas: 5, texto: 'Me cotizaron rápido el comedor y me ayudaron a escoger el color del tapiz.' },
      { autor: 'Ana P.', estrellas: 4, texto: 'La cama de mi hija quedó hermosa y se ve muy resistente.' }
    ],
    // las respuestas solo hablan de lo que ya hace la página y de lo que se ve en sus redes (no se inventan servicios)
    faq: [
      { p: '¿Cómo pido una cotización?',
        r: 'Agrega los muebles que te interesen con el botón "Cotizar", revisa tu lista en "Mi cotización" y envíala por WhatsApp.' },
      { funcion: 'modelos3d', p: '¿Puedo ver el mueble en 3D?',
        r: 'Sí. Los muebles marcados con "3D" se giran con el dedo o el mouse, muestran sus medidas y puedes probar colores de ejemplo.' },
      { funcion: 'ar', p: '¿Qué es la realidad aumentada (AR)?',
        r: 'Es una opción extra de cotización y no aparece en esta muestra. Permite ver el modelo 3D desde la cámara de tu celular, para verlo en tu casa, a tamaño real.' },
      { p: '¿De qué materiales son los muebles?', r: 'Hay muebles en chapa de parota, en melamina y tapizados. Pregunta por el acabado que necesitas.' },
      { p: '¿Hacen reparaciones o retapizado?', r: 'Ese servicio es un ejemplo de esta muestra: el negocio confirma si lo ofrece.' },
      { p: '¿En cuánto tiempo me los entregan?', r: 'Depende del modelo, el acabado y la cantidad. Te lo confirmamos junto con tu cotización.' },
      { p: '¿Hacen envíos?', r: 'Cuando pidas tu cotización, dinos a dónde lo necesitas y te decimos cómo se entrega.' },
      { p: '¿Puedo pedir otro color o medida?', r: 'En el 3D puedes probar colores de ejemplo. Los acabados y las medidas reales los confirmamos contigo al cotizar.' },
      // {direccion} se cambia por la dirección de la sucursal
      { p: '¿Dónde están?', r: '{direccion}.' }
    ],
    terminos: {
      pagos: 'Efectivo, transferencia y tarjeta. Los pagos en línea se hacen en la página del proveedor de pagos; el negocio no ve ni guarda los datos de tu tarjeta.',
      anticipo: 'El anticipo aparta tu pedido y se descuenta del total.',
      cancelacion: 'Por definir con el negocio.',
      devoluciones: 'Por definir con el negocio.'
    },

    // la dirección es de ejemplo (Ocotlán, Jalisco); el teléfono sale de su Facebook. Se confirman con el negocio antes de publicar
    sucursales: [
      { nombre: 'AmueblArte', zona: 'Col. Ejemplo',
        direccion: 'Col. Ejemplo, Ocotlán, Jalisco',
        telefonos: ['392 121 4132'], correos: [],
        mapa: '' }
    ]
  }
};
