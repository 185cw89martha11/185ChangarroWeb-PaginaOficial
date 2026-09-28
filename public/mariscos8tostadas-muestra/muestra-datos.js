/*
  Plantilla de la muestra por cliente (muestra.html). muestra.js solo pinta lo que hay aquí.
  Los nombres y precios de los planes salen de planes.js (window.PLANES_185).

  FUNCIONES: lo que incluyen los planes, sin las funciones del catálogo (esas se eligen aparte).
  - id: clave sin acentos. Va en el mensaje para Claude Code y muestra.js la usa para pintar su parte.
  - plan: 'esencial', 'negocio' o 'pro' (el id del plan en planes.js donde aparece primero).
  - nombre, descripcion: lo que se lee en el panel.
  - activa: si empieza prendida.
  - servicio: true si no se ve en la página (lo hacemos nosotros por fuera). Solo va al mensaje.
  - fija: true si no se puede apagar (lo que va por ley en todos los planes: aviso de privacidad y datos del negocio).
  - obligatoriaCon: ids que la prenden y no la dejan apagar (los Términos, si la página recibe pedidos o pagos).
  - nota: aclaración que se agrega al mensaje.
  - opcional: true si "Llenar como" no la toca (el cliente decide aparte).
  - presetDesde: plan desde el que "Llenar como" la prende, si es distinto de plan (el correo cuesta extra en Negocio).

  NEGOCIO: contenido de ejemplo de la página. Para la muestra de un negocio, copia la carpeta y cambia los datos aquí.
  - titular: nombre del dueño o razón social. Es el responsable en el aviso de privacidad del negocio.
  - direccion, telefono, correoDatos: van siempre en el pie (quien vende debe decir dónde está y cómo contactarlo,
    Ley Federal de Protección al Consumidor art. 76 bis) y en el aviso de privacidad. correoDatos es a donde el
    cliente final escribe para ver, corregir o borrar sus datos.
  - leyendaPrecios: va debajo de los precios; la página le agrega "Vigentes al" con la fecha del día.
  - eventos: cada promoción lleva vigencia (hasta cuándo) y condiciones (restricciones), como pide Profeco.
  - terminos: reglas de venta para los Términos del negocio (pagos, anticipo, cancelación y devoluciones).
  - horario: d son los días que aplica (0 = domingo … 6 = sábado); sin abre/cierra es día cerrado.
  - resenas: siempre de ejemplo; la página les pone la etiqueta "Ejemplo".
  - color: color principal del sitio (barra, títulos y botones).
  - menu: categorías con sus platillos. Los textos van en { es, en } para el botón ES/EN.
    crudo y picante le ponen una etiqueta al platillo (a los turistas les importa saberlo).
  - sucursales: al entrar se elige una y se abre su subpágina. Cada una trae su horario, mapa, dirección y
    teléfono (el de WhatsApp). Esto reemplaza a horario, direccion y telefono de un negocio de una sola sucursal.
*/
window.MUESTRA_DATOS = {
  negocioEjemplo: 'Mariscos 8 Tostadas',
  // WhatsApp de 185ChangarroWeb (el mismo de la portada): ahí llega la petición del botón "Generar petición"
  WHATSAPP_185: '523151260581',

  FUNCIONES: [
    { id: 'productos', plan: 'esencial', nombre: 'Servicios y precios', descripcion: 'Lista de lo que vende, con precio.', activa: true },
    { id: 'whatsapp', plan: 'esencial', nombre: 'Botón de WhatsApp', descripcion: 'Botón fijo que abre el chat con un mensaje ya escrito.', activa: true },
    { id: 'horario', plan: 'esencial', nombre: 'Horarios', descripcion: 'Días y horas en que abre.', activa: true },
    { id: 'abierto', plan: 'esencial', nombre: 'Aviso de "abierto ahora"', descripcion: 'Se calcula solo con el horario.', activa: true },
    { id: 'ubicacion', plan: 'esencial', nombre: 'Mapa y dirección', descripcion: 'Dirección, mapa y botón para llegar.', activa: true },
    { id: 'redes', plan: 'esencial', nombre: 'Enlaces a redes sociales', descripcion: 'Facebook, Instagram, TikTok.', activa: true },
    { id: 'qr', plan: 'esencial', nombre: 'QR para imprimir', descripcion: 'Para el mostrador, volantes o tarjetas.', activa: true },
    { id: 'agenda', plan: 'esencial', nombre: 'Reservación de mesas', descripcion: 'El cliente elige día, hora y mesa. Esto ocupará de un panel de administrador y de que el negocio mantenga al día qué mesas están ocupadas y cuáles libres, en el momento y en lo reservado.', activa: true,
      nota: 'necesita un panel de administrador; el negocio es responsable de mantener al día qué mesas están ocupadas y cuáles libres' },
    { id: 'galeria', plan: 'esencial', nombre: 'Galería de platillos', descripcion: 'Fotos de los platillos; se agrandan al tocarlas.', activa: true },
    { id: 'eventos', plan: 'esencial', nombre: 'Eventos y promociones', descripcion: 'Ofertas y fechas especiales.', activa: true },
    { id: 'dominio', plan: 'esencial', nombre: 'Dominio propio', descripcion: 'La dirección .com.mx a nombre del negocio.', activa: true, servicio: true },
    { id: 'privacidad', plan: 'esencial', nombre: 'Aviso de privacidad', descripcion: 'Siempre va. Es obligatorio si la página pide datos.', activa: true, fija: true },
    { id: 'contacto', plan: 'esencial', nombre: 'Datos del negocio en el pie', descripcion: 'Dirección, teléfono y correo. La ley pide que quien vende diga quién es y cómo contactarlo.', activa: true, fija: true },
    { id: 'terminos', plan: 'esencial', nombre: 'Términos y Condiciones', descripcion: 'Opcional, salvo que la página reciba pedidos o pagos: ahí son obligatorios.', activa: false, opcional: true, obligatoriaCon: ['pedidos'] },

    { id: 'resenas', plan: 'negocio', nombre: 'Reseñas', descripcion: 'Opiniones de clientes.', activa: true },
    { id: 'faq', plan: 'negocio', nombre: 'Preguntas frecuentes', descripcion: 'Respuestas a lo que más preguntan.', activa: false },
    { id: 'google', plan: 'negocio', nombre: 'Ficha de Google Maps', descripcion: 'Alta y arreglo de la ficha, con QR para pedir reseñas.', activa: false },
    { id: 'asistente', plan: 'negocio', nombre: 'Asistente en la página', descripcion: 'Contesta con los datos del negocio.', activa: false },
    { id: 'correo', plan: 'negocio', nombre: 'Correo profesional', descripcion: 'contacto@su-dominio. Con costo extra en Negocio, incluido en Pro.', activa: false, presetDesde: 'pro', nota: 'con costo extra en el plan Negocio; incluido en Negocio + Asistente Pro' },

    { id: 'pedidos', plan: 'pro', nombre: 'Pedidos con anticipo', descripcion: 'Con liga de pago externa.', activa: false },
    { id: 'recordatorios', plan: 'pro', nombre: 'Recordatorios de citas por correo', descripcion: 'Se ve en la agenda.', activa: false },
    { id: 'sucursales', plan: 'pro', nombre: 'Varias sucursales', descripcion: 'Todas en la misma página.', activa: true },
    { id: 'wabusiness', plan: 'pro', nombre: 'WhatsApp Business configurado', descripcion: 'Bienvenida, ausencia, respuestas rápidas y catálogo.', activa: false, servicio: true },
    { id: 'reporte', plan: 'pro', nombre: 'Reporte mensual', descripcion: 'Visitas, clics, citas y pedidos.', activa: false, servicio: true },
    { id: 'disenos', plan: 'pro', nombre: '2 diseños de promoción al mes', descripcion: 'Para WhatsApp y redes.', activa: false, servicio: true },
    { id: 'respuestas', plan: 'pro', nombre: 'Respuestas a reseñas de Google', descripcion: 'Se las redactamos.', activa: false, servicio: true }
  ],

  NEGOCIO: {
    titular: 'Nombre del dueño o razón social',
    correoDatos: 'correo@ejemplo.com',
    color: '#448ACA',
    mensajeWhatsapp: { es: 'Hola, vi su página y quiero información.', en: 'Hi, I saw your website and would like some information.' },
    // platillos y precios de ejemplo: se cambian por el menú real del negocio
    menu: [
      { cat: { es: 'Tostadas', en: 'Tostadas' }, platillos: [
        { es: 'Tostada de ceviche de pescado', en: 'Fish ceviche tostada', precio: 45, crudo: true },
        { es: 'Tostada de camarón', en: 'Shrimp tostada', precio: 60 },
        { es: 'Tostada de pulpo', en: 'Octopus tostada', precio: 75 }
      ] },
      { cat: { es: 'Aguachiles y ceviches', en: 'Aguachiles & ceviches' }, platillos: [
        { es: 'Aguachile verde', en: 'Green aguachile', precio: 190, crudo: true, picante: true },
        { es: 'Ceviche de pescado', en: 'Fish ceviche', precio: 160, crudo: true }
      ] },
      { cat: { es: 'Cocteles', en: 'Seafood cocktails' }, platillos: [
        { es: 'Coctel de camarón', en: 'Shrimp cocktail', precio: 150 },
        { es: 'Campechana', en: 'Mixed seafood cocktail', precio: 180 }
      ] },
      { cat: { es: 'Bebidas', en: 'Drinks' }, platillos: [
        { es: 'Agua fresca', en: 'Fresh fruit water', precio: 35 },
        { es: 'Refresco', en: 'Soda', precio: 30 }
      ] }
    ],
    leyendaPrecios: 'Precios en pesos mexicanos, con IVA incluido.',
    // reservaciones: cuántas mesas hay. Las horas salen del horario de cada sucursal (cada media hora,
    // hasta media hora antes de cerrar). Las mesas ocupadas de la muestra son inventadas (mesaOcupada en muestra.js)
    mesas: 10,
    logo: 'img/logo-negocio.jpg',
    // animalitos recortados que van a la derecha del título de estas secciones (id de la función: imagen)
    animales: { productos: 'img/animales/pez.png?v=2', eventos: 'img/animales/camaron.png?v=2', resenas: 'img/animales/pulpo.png?v=2', horario: 'img/animales/cangrejo.png?v=2' },
    // QR real: lleva directo a esta muestra en nuestro sitio (https://one85changarroweb.onrender.com/mariscos8tostadas-muestra/).
    // Se generó sin servicios intermedios, así que no caduca. ?v= obliga al navegador a bajar la imagen nueva si se cambia.
    qr: 'img/qr.png?v=2',
    // cada sucursal tiene su subpágina; al entrar se elige una. Solo cambian horario, mapa, dirección, teléfono y redes.
    // slug: lo que va en la dirección (…/estadio). zona: el texto chico debajo del nombre.
    // porConfirmar: la dirección no está confirmada por el negocio (la de Estadio salió de Yelp); la página le agrega la nota.
    // redes: las cuentas reales de cada sucursal y sus seguidores, revisados a mano el día de redesFecha.
    //   Instagram se vio en cada perfil; Facebook salió de los resultados de búsqueda. No se encontró TikTok oficial.
    //   Hay que volver a revisar los números antes de enseñar la muestra otro día.
    sucursales: [
      { nombre: 'Mariscos 8 Tostadas', zona: 'Marina Vallarta', slug: 'marina-vallarta', telefono: '+52 322 209 1508',
        direccion: 'Marina Vallarta, Puerto Vallarta, Jal.', porConfirmar: true, mapa: 'img/mapa-marina.jpg',
        horario: [
          { dias: { es: 'Lunes a domingo', en: 'Monday to Sunday' }, d: [0, 1, 2, 3, 4, 5, 6], abre: '11:00', cierra: '18:00' }
        ],
        redes: [
          { red: 'Instagram', usuario: '@8tostadasmarinavallarta', seguidores: 7012, url: 'instagram.com/8tostadasmarinavallarta' },
          { red: 'Facebook', usuario: 'Mariscos 8 Tostadas Marina Vallarta', seguidores: 12729, url: 'facebook.com/8TostadasPv' }
        ] },
      { nombre: 'Mariscos 8 Tostadas Estadio', zona: 'Estadio', slug: 'estadio', telefono: '+52 322 222 7691',
        direccion: 'Río Guayaquil 413, Puerto Vallarta, Jal.', porConfirmar: true, mapa: 'img/mapa-estadio.jpg',
        horario: [
          { dias: { es: 'Jueves a martes', en: 'Thursday to Tuesday' }, d: [4, 5, 6, 0, 1, 2], abre: '12:00', cierra: '19:00' },
          { dias: { es: 'Miércoles', en: 'Wednesday' }, d: [3] }
        ],
        redes: [
          { red: 'Instagram', usuario: '@8tostadasestadio', seguidores: 732, url: 'instagram.com/8tostadasestadio' },
          { red: 'Facebook', usuario: '8 Tostadas Estadio', seguidores: 9292, url: 'facebook.com/OchoTostadas' }
        ] },
      { nombre: 'Mariscos 8 Tostadas Nuevo Vallarta', zona: 'Nuevo Vallarta', slug: 'nuevo-vallarta', telefono: '+52 322 297 7605',
        direccion: 'Nuevo Vallarta, Nay.', porConfirmar: true, mapa: 'img/mapa-nuevo-vallarta.jpg',
        horario: [
          { dias: { es: 'Lunes a domingo', en: 'Monday to Sunday' }, d: [0, 1, 2, 3, 4, 5, 6], abre: '11:00', cierra: '20:00' }
        ],
        redes: [
          { red: 'Instagram', usuario: '@8tostadasnvo', seguidores: 2130, url: 'instagram.com/8tostadasnvo' }
        ] }
    ],
    redesFecha: { es: '27 de septiembre de 2026', en: 'September 27, 2026' },
    // fotos del negocio; al tocarlas se abren en grande con su título y descripción
    galeria: [
      { img: 'img/platillo-1.jpg', titulo: { es: 'Tostada Paté de Camarón', en: 'Shrimp Pâté Tostada' },
        es: 'Tostada con paté de camarón y queso Philadelphia, con rebanadas de aguacate y cebollín picado.',
        en: 'Tostada topped with shrimp and cream cheese pâté, avocado slices and chopped chives.' },
      { img: 'img/platillo-2.jpg', titulo: { es: 'Tártara 3D', en: '3D Tartare' },
        es: 'Tártara de atún y salmón frescos con callo de hacha, acompañada de manzana caramelizada, rábano y perejil.',
        en: 'Fresh tuna and salmon tartare with scallops, served with caramelized apple, radish and parsley.' },
      { img: 'img/platillo-3.jpg', titulo: { es: 'Ensalada Tropical de Atún Sellado', en: 'Tropical Seared Tuna Salad' },
        es: 'Rebanadas de atún sellado y aguacate sobre hojas verdes, con gajos de naranja, zanahoria y piñones.',
        en: 'Seared tuna and avocado slices over mixed greens, with orange segments, carrot and pine nuts.' },
      { img: 'img/platillo-4.jpg', titulo: { es: 'Filete de Pescado al Curry', en: 'Curry Fish Fillet' },
        es: 'Filete de pescado bañado en salsa de curry, con ejotes, champiñones, tomates cherry y láminas crujientes.',
        en: 'Fish fillet in curry sauce, with green beans, mushrooms, cherry tomatoes and crispy chips.' },
      { img: 'img/platillo-5.jpg', titulo: { es: 'Filete de Pescado Popeye', en: 'Popeye Fish Fillet' },
        es: 'Filete de pescado en salsa verde, acompañado de arroz al coco y vegetales salteados.',
        en: 'Fish fillet in green sauce, served with coconut rice and sautéed vegetables.' },
      { img: 'img/platillo-6.jpg', titulo: { es: 'Atún Marinado con Miso', en: 'Miso-Marinated Tuna' },
        es: 'Atún marinado con miso, naranja y un toque de habanero, con cebolla morada, rábano y cilantro.',
        en: 'Tuna marinated in miso and orange with a hint of habanero, topped with red onion, radish and cilantro.' }
    ],
    // reseñas inventadas, solo con nombre e inicial: la página les pone la etiqueta "Ejemplo".
    // En la página real van reseñas reales que publica el negocio (no copiar reseñas de Google con nombres completos en la muestra).
    resenas: [
      { autor: 'Laura M.', estrellas: 5, texto: { es: 'Las tostadas, riquísimas y muy frescas. La atención, excelente.', en: 'The tostadas were delicious and very fresh. Excellent service.' } },
      { autor: 'Jorge R.', estrellas: 5, texto: { es: 'El aguachile, de lo mejor que he probado en Vallarta.', en: 'The aguachile is some of the best I\'ve had in Vallarta.' } },
      { autor: 'Ana P.', estrellas: 4, texto: { es: 'Buen ambiente para ir con la familia. Volveremos pronto.', en: 'Great place to go with the family. We\'ll be back soon.' } }
    ],
    // promociones, eventos y especialidades (una pestaña para cada uno).
    // galeria: número de la foto de galeria (desde 0); sin foto se usa icono. ejemplo: true les pone la etiqueta "Ejemplo".
    // Vigencia y condiciones van siempre (Profeco); las de aquí son de ejemplo: confirmarlas con el negocio.
    promos: {
      promociones: [
        { titulo: { es: 'Promoción', en: 'Promotion' }, galeria: -1, icono: '%', ejemplo: true,
          nombre: { es: '2×1 en tostadas los martes', en: '2-for-1 tostadas on Tuesdays' },
          texto: { es: 'Pide dos tostadas iguales y paga solo una.', en: 'Order two of the same tostada and pay for one.' },
          vigencia: { es: 'Todos los martes de octubre', en: 'Every Tuesday in October' },
          condiciones: { es: 'Solo para comer en la sucursal. No se junta con otras promociones.', en: 'Dine-in only. Cannot be combined with other offers.' } }
      ],
      eventos: [
        { titulo: { es: 'Evento', en: 'Event' }, galeria: -1, icono: '♪', ejemplo: true,
          nombre: { es: 'Música en vivo', en: 'Live music' },
          texto: { es: 'Ven a comer con música en vivo.', en: 'Enjoy your meal with live music.' },
          vigencia: { es: 'Sábados de 2:00 a 5:00 p.m.', en: 'Saturdays from 2:00 to 5:00 PM' },
          condiciones: { es: 'Sujeto a disponibilidad en cada sucursal.', en: 'Subject to availability at each location.' } }
      ],
      especialidades: [
        { titulo: { es: 'Especial de la Semana', en: 'Special of the Week' }, galeria: 4,
          vigencia: { es: 'Esta semana', en: 'This week' },
          condiciones: { es: 'Hasta agotar existencias. Pregunta por él en tu sucursal.', en: 'While supplies last. Ask for it at your location.' } }
      ]
    },
    // las respuestas solo hablan de lo que ya hace la página (no se inventan servicios del negocio)
    faq: [
      { p: { es: '¿Puedo reservar una mesa?', en: 'Can I book a table?' },
        r: { es: 'Sí, en "Aparta tu mesa" eliges el día, la hora y la mesa. También puedes escribirnos por WhatsApp.', en: 'Yes: in "Book a table" you choose the day, time and table. You can also message us on WhatsApp.' } },
      { p: { es: '¿Tienen el menú en inglés?', en: 'Is the menu available in English?' },
        r: { es: 'Sí, toca EN arriba y toda la página cambia a inglés.', en: 'Yes, tap EN at the top and the whole website switches to English.' } },
      { p: { es: '¿Cómo pido para llevar?', en: 'How do I order takeout?' },
        r: { es: 'Escríbele por WhatsApp a tu sucursal y te decimos cuándo pasar.', en: 'Message your location on WhatsApp and we\'ll tell you when to pick it up.' } }
    ],
    anticipo: 100,
    terminos: {
      pagos: 'Efectivo, transferencia y tarjeta. Los pagos en línea se hacen en la página del proveedor de pagos; el negocio no ve ni guarda los datos de tu tarjeta.',
      anticipo: { es: 'El anticipo aparta tu pedido y se descuenta del total.', en: 'The deposit reserves your order and is deducted from the total.' },
      cancelacion: 'Puedes cancelar sin costo hasta 24 horas antes de la entrega y te devolvemos el anticipo completo. Después de ese plazo, el anticipo cubre lo que ya se preparó.',
      devoluciones: 'Si tu pedido llega incompleto o con algún defecto, avísanos el mismo día por WhatsApp y lo cambiamos o te devolvemos tu dinero.'
    }
  }
};
