/*
  Plantilla de la muestra por cliente (muestra.html). muestra.js solo pinta lo que hay aquí.
  Los nombres y precios de los planes salen de planes.js (window.PLANES_185).

  FUNCIONES: lo que incluyen los planes, sin las funciones del catálogo (esas se eligen aparte).
  - id: clave sin acentos. Va en el mensaje para Claude Code y muestra.js la usa para pintar su parte.
  - plan: 'esencial', 'negocio' o 'pro' (el id del plan en planes.js donde aparece primero), o 'catalogo' si es
    una de las funciones del catálogo de Tarifas (las 10 de Negocio o 15 de Pro). Esas van en su propio grupo.
  - peso: cuántas funciones del catálogo cuenta (2 si en Tarifas lleva ×2). Sin peso cuenta 1.
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
  negocioEjemplo: 'Clínica Dental San Pablo',
  // WhatsApp de 185ChangarroWeb (el mismo de la portada): ahí llega la petición del botón "Generar petición"
  WHATSAPP_185: '523151260581',

  FUNCIONES: [
    { id: 'productos', plan: 'esencial', nombre: 'Servicios y precios', descripcion: 'Lista de lo que vende, con precio.', activa: true },
    { id: 'whatsapp', plan: 'esencial', nombre: 'Botón de WhatsApp', descripcion: 'Botón fijo que abre el chat con un mensaje ya escrito.', activa: true },
    { id: 'horario', plan: 'esencial', nombre: 'Horarios', descripcion: 'Días y horas en que atiende, con la pausa de medio día.', activa: true },
    { id: 'abierto', plan: 'esencial', nombre: 'Aviso de "abierto ahora"', descripcion: 'Franja fija arriba, verde si está abierto y roja si está cerrado. Se calcula sola con el horario.', activa: true, fija: true },
    { id: 'ubicacion', plan: 'esencial', nombre: 'Mapa y dirección', descripcion: 'Dirección, mapa y botón para llegar.', activa: true },
    { id: 'redes', plan: 'esencial', nombre: 'Enlaces a redes sociales', descripcion: 'Facebook, Instagram, TikTok.', activa: true },
    { id: 'qr', plan: 'esencial', nombre: 'QR para imprimir', descripcion: 'Para el mostrador, volantes o tarjetas.', activa: true },
    { id: 'agenda', plan: 'esencial', nombre: 'Agenda de citas', descripcion: 'El paciente elige día y hora (una cada 30 minutos). Esto ocupará de un panel de administrador y de que la clínica mantenga al día sus horas ocupadas y libres.', activa: true,
      nota: 'necesita un panel de administrador; la clínica es responsable de mantener al día su agenda' },
    { id: 'galeria', plan: 'esencial', nombre: 'Galería de fotos', descripcion: 'Fotos de la clínica y sus tratamientos; se agrandan al tocarlas.', activa: true },
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
    { id: 'wabusiness', plan: 'pro', nombre: 'WhatsApp Business configurado', descripcion: 'Bienvenida, ausencia, respuestas rápidas y catálogo.', activa: false, servicio: true },
    { id: 'reporte', plan: 'pro', nombre: 'Reporte mensual', descripcion: 'Visitas, clics, citas y pedidos.', activa: false, servicio: true },
    { id: 'disenos', plan: 'pro', nombre: '2 diseños de promoción al mes', descripcion: 'Para WhatsApp y redes.', activa: false, servicio: true },
    { id: 'respuestas', plan: 'pro', nombre: 'Respuestas a reseñas de Google', descripcion: 'Se las redactamos.', activa: false, servicio: true },

    { id: 'ingles', plan: 'catalogo', nombre: 'Versión en inglés', descripcion: 'Botón ES/EN arriba: toda la página cambia a inglés.', activa: false, peso: 2,
      nota: 'función del catálogo, cuenta como 2' },
  ],

  NEGOCIO: {
    // titular y correo: todavía no los conocemos; la clínica los da antes de la página final
    titular: 'Nombre del dueño o razón social',
    correoDatos: 'correo@ejemplo.com',
    // cédula profesional (la Ley General de Salud la pide en la publicidad de un consultorio). La da la clínica; no se inventa.
    cedula: { es: 'Cédula profesional y responsable sanitario: los da la clínica.', en: 'Professional license and health officer: provided by the clinic.' },
    // colores del cubo del logo: azul de la cara azul (principal); celeste, rosa y verde de las otras caras (subcolores, en muestra.css)
    color: '#006786',
    mensajeWhatsapp: { es: 'Hola, vi su página y quiero información para una cita.', en: 'Hi, I saw your website and would like information to book an appointment.' },
    // lista de trabajos con su precio. Precios INVENTADOS para la muestra (llevan la etiqueta "Ejemplo"):
    // la clínica da los suyos antes de la página final. Solo Ortodoncia sale de su propio anuncio.
    menu: [
      { cat: { es: 'Limpieza y blanqueamiento', en: 'Cleaning & whitening' }, platillos: [
        { es: 'Limpieza dental', en: 'Dental cleaning', precio: 500 },
        { es: 'Blanqueamiento dental', en: 'Teeth whitening', precio: 2500 }
      ] },
      { cat: { es: 'Restauración', en: 'Restorative' }, platillos: [
        { es: 'Resina (curación)', en: 'Filling', precio: 600 },
        { es: 'Extracción simple', en: 'Simple extraction', precio: 700 },
        { es: 'Implante dental', en: 'Dental implant', precio: 18000 }
      ] },
      { cat: { es: 'Ortodoncia', en: 'Orthodontics' }, platillos: [
        { es: 'Colocación de brackets', en: 'Braces placement', precio: 6000 },
        { es: 'Control mensual de brackets', en: 'Monthly braces check-up', precio: 700 }
      ] },
      { cat: { es: 'Consulta', en: 'Appointments' }, platillos: [
        { es: 'Valoración inicial', en: 'Initial assessment', precio: 300 }
      ] }
    ],
    // planes del dentista: paquetes de tratamiento con su precio y lo que incluyen. También de ejemplo.
    planesClinica: [
      { nombre: { es: 'Plan de limpieza', en: 'Cleaning plan' }, precio: 800, periodo: { es: 'por 2 limpiezas al año', en: 'for 2 cleanings a year' },
        incluye: { es: ['2 limpiezas dentales', 'Valoración en cada visita'], en: ['2 dental cleanings', 'Assessment at each visit'] } },
      { nombre: { es: 'Plan de ortodoncia', en: 'Orthodontics plan' }, precio: 1200, periodo: { es: 'al mes, por 18 meses', en: 'per month, for 18 months' },
        incluye: { es: ['Brackets', 'Controles mensuales', 'Retenedores al terminar'], en: ['Braces', 'Monthly check-ups', 'Retainers at the end'] } },
      { nombre: { es: 'Plan familiar', en: 'Family plan' }, precio: 1500, periodo: { es: 'al año, hasta 4 personas', en: 'per year, up to 4 people' },
        incluye: { es: ['Valoración para cada integrante', '1 limpieza por persona', '10% en otros tratamientos'], en: ['Assessment for each member', '1 cleaning per person', '10% off other treatments'] } }
    ],
    leyendaPrecios: 'Precios en pesos mexicanos, con IVA incluido.',
    logo: 'capturas/logo-cubo.png',
    animales: {},
    qr: null,
    // una sola sede: no hay sucursales. telefono es el WhatsApp; telefonoFijo, el teléfono de la clínica.
    // horario con turnos: [abre, cierra] por turno. Domingo sin turnos = cerrado.
    sucursales: [
      { nombre: 'Clínica Dental San Pablo', zona: 'Españita, Tepatitlán de Morelos', slug: '', telefono: '378 790 8145', telefonoFijo: '378 132 0598',
        direccion: 'Salamanca 448-B, Españita, 47630 Tepatitlán de Morelos, Jal.', mapa: 'capturas/mapa.png',
        horario: [
          { dias: { es: 'Lunes a sábado', en: 'Monday to Saturday' }, d: [1, 2, 3, 4, 5, 6], turnos: [['09:00', '14:00'], ['16:00', '20:00']] },
          { dias: { es: 'Domingo', en: 'Sunday' }, d: [0] }
        ],
        // Facebook: la liga que dio 185ChangarroWeb; su nombre de página ("consultorio odontológico integral") no coincide
        // con el de la clínica, hay que confirmar que sea la página oficial.
        redes: [
          { red: 'Facebook', usuario: 'consultorioodontologico.integral.94', url: 'facebook.com/consultorioodontologico.integral.94' }
        ] }
    ],
    // galería: los cuadros recortados de la foto de casos, con nombres de relleno hasta que la clínica dé los reales
    galeria: [
      { img: 'capturas/caso-1.png', ejemplo: true, titulo: { es: 'Caso 1: Fulanito', en: 'Case 1: Fulanito' },
        es: 'Aquí irá la descripción del caso: cómo estaba la sonrisa del paciente al llegar, qué tratamiento se le hizo, cuántas citas llevó y cómo quedó al final. Es un texto de ejemplo; la clínica escribe el real.',
        en: 'The case description will go here: how the smile looked on arrival, which treatment was done, how many visits it took and the final result. This is sample text; the clinic writes the real one.' },
      { img: 'capturas/caso-2.png', ejemplo: true, titulo: { es: 'Caso 2: Perenganito', en: 'Case 2: Perenganito' },
        es: 'Aquí irá la descripción del caso: cómo estaba la sonrisa del paciente al llegar, qué tratamiento se le hizo, cuántas citas llevó y cómo quedó al final. Es un texto de ejemplo; la clínica escribe el real.',
        en: 'The case description will go here: how the smile looked on arrival, which treatment was done, how many visits it took and the final result. This is sample text; the clinic writes the real one.' },
      { img: 'capturas/caso-3.png', ejemplo: true, titulo: { es: 'Caso 3: Menganito', en: 'Case 3: Menganito' },
        es: 'Aquí irá la descripción del caso: cómo estaba la sonrisa del paciente al llegar, qué tratamiento se le hizo, cuántas citas llevó y cómo quedó al final. Es un texto de ejemplo; la clínica escribe el real.',
        en: 'The case description will go here: how the smile looked on arrival, which treatment was done, how many visits it took and the final result. This is sample text; the clinic writes the real one.' }
    ],
    // las otras imágenes de la clínica: se ven una por una debajo de la galería
    carrusel: [
      { img: 'capturas/ortodoncia.png', titulo: { es: 'Ortodoncia', en: 'Orthodontics' } },
      { img: 'capturas/banner-contacto.png', titulo: { es: 'Clínica Dental San Pablo', en: 'Clínica Dental San Pablo' } }
    ],
    // reseñas reales de Google (real: true), copiadas de la ficha de la clínica y con nombre e inicial del apellido.
    // Se corrigió la ortografía de "Exelente" y "buen atención".
    resenas: [
      { autor: 'Jen O.', estrellas: 5, real: true, texto: { es: 'Muy buena atención, el lugar impecable y el personal super amable, lo recomiendo por las 3 B (bueno bonito y excelentes precios).', en: 'Very good service, the place is spotless and the staff is super friendly. I recommend it for the 3 Bs (good, pretty and excellent prices).' } },
      { autor: 'Ana E.', estrellas: 5, real: true, texto: { es: 'Excelente atención por parte de todo el personal… Precios muy razonables. Además de excelente trabajo.', en: 'Excellent service from the whole staff… Very reasonable prices. Plus excellent work.' } },
      { autor: 'Martin H.', estrellas: 5, real: true, texto: { es: 'Excelente calidad y buena atención.', en: 'Excellent quality and good service.' } }
    ],
    // vigencia y condiciones van siempre (Profeco); esta promoción es de ejemplo: la clínica confirma la suya.
    promos: {
      promociones: [
        { titulo: { es: 'Promoción', en: 'Promotion' }, galeria: -1, icono: '%', ejemplo: true,
          nombre: { es: 'Valoración inicial sin costo', en: 'Free initial assessment' },
          texto: { es: 'Conoce tu caso y el plan de tratamiento antes de decidir.', en: 'Learn about your case and treatment plan before deciding.' },
          vigencia: { es: 'Todo octubre', en: 'All October' },
          condiciones: { es: 'Con cita previa. No incluye estudios ni tratamientos.', en: 'By appointment. Does not include studies or treatments.' } }
      ],
      eventos: [],
      especialidades: [
        { titulo: { es: 'Especialidad: Ortodoncia', en: 'Specialty: Orthodontics' }, galeria: -1, icono: '★', ejemplo: true,
          nombre: { es: 'Ortodoncia con brackets', en: 'Orthodontics with braces' },
          texto: { es: 'Valoración, colocación de brackets y controles mensuales.', en: 'Assessment, braces placement and monthly check-ups.' },
          vigencia: { es: 'Todo el año', en: 'All year' },
          condiciones: { es: 'Con valoración previa. Pregunta por tu plan de pagos.', en: 'After an initial assessment. Ask about payment plans.' } }
      ]
    },
    faq: [
      { p: { es: '¿Cómo agendo una cita?', en: 'How do I book an appointment?' },
        r: { es: 'Escríbenos por WhatsApp al 378 790 8145 o llámanos al 378 132 0598.', en: 'Message us on WhatsApp at 378 790 8145 or call 378 132 0598.' } },
      { p: { es: '¿Qué horario tienen?', en: 'What are your hours?' },
        r: { es: 'Lunes a sábado de 9:00 a 14:00 y de 16:00 a 20:00 horas. Domingos cerrado.', en: 'Monday to Saturday, 9:00 a.m. to 2:00 p.m. and 4:00 to 8:00 p.m. Closed on Sundays.' } },
      { funcion: 'ingles', p: { es: '¿Tienen la página en inglés?', en: 'Is the website available in English?' },
        r: { es: 'Sí, toca EN arriba y toda la página cambia a inglés.', en: 'Yes, tap EN at the top and the whole website switches to English.' } }
    ],
    anticipo: 100,
    terminos: {
      pagos: 'Efectivo, transferencia y tarjeta. Los pagos en línea se hacen en la página del proveedor de pagos; la clínica no ve ni guarda los datos de tu tarjeta.',
      anticipo: { es: 'El anticipo aparta tu cita y se descuenta del total del tratamiento.', en: 'The deposit reserves your appointment and is deducted from the treatment total.' },
      cancelacion: 'Puedes cancelar o reprogramar sin costo hasta 24 horas antes de tu cita y te devolvemos el anticipo completo. Después de ese plazo, el anticipo cubre el tiempo reservado.',
      devoluciones: 'Si tienes algún problema con un servicio, avísanos por WhatsApp y lo revisamos contigo.'
    }
  }
};
