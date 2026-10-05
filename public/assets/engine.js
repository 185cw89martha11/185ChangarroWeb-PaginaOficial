/*
 * 185ChangarroWeb · Tipos de negocio
 * Cada tipo trae textos, colores, tipografías y productos de ejemplo.
 * En los textos puedes usar {nombre}, {zona} y {pagos}.
 * Lo que va entre [corchetes] desaparece si el dato de adentro está vacío.
 * Para agregar un giro nuevo, copia uno completo y cambia su clave.
 */
(function (root, factory) {
  var presets = factory();
  if (typeof module === 'object' && module.exports) module.exports = presets;
  else root.ChangarroPresets = presets;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    restaurante: {
      label: 'Restaurante, taquería o comida',
      short: 'Restaurante',
      emoji: '🌮',
      schemaType: 'Restaurant',
      seoTitle: '{nombre} | Menú y pedidos por WhatsApp[ en {zona}]',
      navLabel: 'Menú',
      catalogEyebrow: 'Menú',
      catalogTitle: 'Lo que se te va a antojar',
      catalogIntro: 'Precios en pesos mexicanos. Agrega lo que quieras y envía tu pedido por WhatsApp.',
      catalogIntroAlt: 'Precios en pesos mexicanos. Pide por WhatsApp y te lo preparamos al momento.',
      aboutTitle: 'Cocina de barrio, hecha con cariño',
      ctaLabel: 'Pedir por WhatsApp',
      ctaShort: 'Pedir',
      greeting: 'Hola 👋 Quiero hacer un pedido.',
      orders: true,
      notesPlaceholder: 'Ej. sin cebolla, salsa aparte',
      ctaBandTitle: '¿Se te antojó?',
      ctaBandText: 'Haz tu pedido por WhatsApp y te lo tenemos listo.',
      qrText: 'Escanea, mira el menú y pide por WhatsApp',
      theme: { mode: 'light', primary: '#c2410c', accent: '#f59e0b', bg: '#fffaf3', surface: '#ffffff', text: '#22140f', muted: '#6b5a52', hero1: '#3b1206', hero2: '#9a3412' },
      fonts: { head: ['Fraunces', '600;700;800', 'Georgia, serif'], body: ['Inter', '400;500;600;700', 'system-ui, sans-serif'] },
      tagline: 'Sabor casero[ en {zona}]. Pide por WhatsApp y recógelo o recíbelo en tu casa.',
      about: 'En {nombre} cocinamos todo al momento, con ingredientes frescos y recetas de casa.[ Somos parte de {zona} y nos encanta ver a nuestros vecinos volver.]\n\nPide para llevar, a domicilio o ven a comer con nosotros: aquí siempre hay lugar.',
      highlights: [
        { icono: '🔥', titulo: 'Hecho al momento', texto: 'Cada orden se prepara cuando la pides. Nada recalentado.' },
        { icono: '🛵', titulo: 'Pedidos sin complicaciones', texto: 'Arma tu pedido aquí y envíalo por WhatsApp en un toque.' },
        { icono: '💛', titulo: 'Precio justo', texto: 'Porciones generosas a precio de barrio.' }
      ],
      catalogo: [
        { categoria: 'Tacos', productos: [
          { nombre: 'Pastor', precio: 18, descripcion: 'Con piña, cebolla y cilantro' },
          { nombre: 'Suadero', precio: 18 },
          { nombre: 'Bistec', precio: 20 },
          { nombre: 'Campechano', precio: 22, descripcion: 'Bistec con longaniza' },
          { nombre: 'Costra de queso', precio: 35, descripcion: 'Con queso dorado a la plancha' }
        ] },
        { categoria: 'Especialidades', productos: [
          { nombre: 'Gringa de pastor', precio: 55, descripcion: 'Tortilla de harina con queso y pastor' },
          { nombre: 'Quesadilla', precio: 35, descripcion: 'Con queso Oaxaca y el guisado que elijas' },
          { nombre: 'Alambre', precio: 120, descripcion: 'Res, tocino, pimiento, cebolla y queso' },
          { nombre: 'Orden de 5 tacos', precio: 85 }
        ] },
        { categoria: 'Bebidas', productos: [
          { nombre: 'Agua fresca de litro', precio: 35, descripcion: 'Horchata, jamaica o la del día' },
          { nombre: 'Refresco', precio: 25 },
          { nombre: 'Café de olla', precio: 25 }
        ] }
      ],
      preguntas: [
        { p: '¿Tienen servicio a domicilio?', r: 'Sí, en colonias cercanas. Envíanos tu dirección por WhatsApp y te confirmamos costo y tiempo de entrega.' },
        { p: '¿Cómo hago un pedido?', r: 'Toca «Agregar» en lo que quieras y luego «Ver pedido». Se abre WhatsApp con tu pedido listo para mandar.' },
        { p: '¿Qué formas de pago aceptan?', r: 'Aceptamos {pagos}.' },
        { p: '¿Hacen pedidos para fiestas o eventos?', r: 'Sí. Escríbenos con la fecha y el número de personas y te mandamos una cotización.' }
      ],
      horario: { lun: '13:00-23:00', mar: '13:00-23:00', mie: '13:00-23:00', jue: '13:00-23:00', vie: '13:00-01:00', sab: '13:00-01:00', dom: '13:00-22:00' },
      pagos: ['Efectivo', 'Transferencia', 'Tarjeta'],
      entrega: 'Servicio a domicilio en colonias cercanas.',
      example: { nombre: 'Taquería Don Perengano', zona: 'Coyoacán, CDMX' }
    },

    barberia: {
      label: 'Barbería, estética o salón de uñas',
      short: 'Barbería y estética',
      emoji: '💈',
      schemaType: 'HairSalon',
      seoTitle: '{nombre} | Precios y citas[ en {zona}]',
      navLabel: 'Servicios',
      catalogEyebrow: 'Servicios',
      catalogTitle: 'Servicios y precios',
      catalogIntro: 'Agenda por WhatsApp y llega directo a tu silla.',
      catalogIntroAlt: 'Agrega los servicios que quieres y mándanos tu solicitud por WhatsApp.',
      aboutTitle: 'Más que un corte',
      ctaLabel: 'Agendar por WhatsApp',
      ctaShort: 'Agendar',
      greeting: 'Hola 👋 Quiero agendar una cita.',
      orders: false,
      itemAction: 'Agendar',
      itemMessage: 'Hola 👋 Quiero agendar: {item}. ¿Qué horarios tienen disponibles?',
      ctaBandTitle: 'Aparta tu lugar',
      ctaBandText: 'Escríbenos y te damos el horario más cercano.',
      qrText: 'Escanea para ver precios y agendar tu cita',
      theme: { mode: 'dark', primary: '#d4a95f', accent: '#8b5e34', bg: '#0e0d0c', surface: '#181614', text: '#f5efe6', muted: '#b3a898', hero1: '#0a0908', hero2: '#3a2817' },
      fonts: { head: ['Oswald', '500;600;700', 'Impact, sans-serif'], body: ['Inter', '400;500;600;700', 'system-ui, sans-serif'] },
      upper: true,
      tagline: 'Cortes y barba con estilo[ en {zona}]. Agenda por WhatsApp y evita la espera.',
      about: 'En {nombre} cuidamos cada detalle: desde el corte clásico hasta el degradado más limpio. Trabajamos con calma, con herramienta desinfectada y buena plática.\n\nAgenda tu cita por WhatsApp o pasa a visitarnos.',
      highlights: [
        { icono: '✂️', titulo: 'Cortes a tu estilo', texto: 'Clásicos, degradados, diseños y arreglo de barba.' },
        { icono: '📅', titulo: 'Citas sin espera', texto: 'Aparta tu horario por WhatsApp y llega directo a tu silla.' },
        { icono: '🧼', titulo: 'Higiene en cada servicio', texto: 'Herramienta limpia y desinfectada para cada cliente.' }
      ],
      catalogo: [
        { categoria: 'Cortes', productos: [
          { nombre: 'Corte clásico', precio: 150 },
          { nombre: 'Degradado / fade', precio: 180, descripcion: 'Bajo, medio o alto, con acabado a navaja' },
          { nombre: 'Corte infantil', precio: 120, descripcion: 'Menores de 12 años' },
          { nombre: 'Corte + barba', precio: 250, descripcion: 'El combo completo' }
        ] },
        { categoria: 'Barba', productos: [
          { nombre: 'Arreglo de barba', precio: 100, descripcion: 'Perfilado con navaja y toalla caliente' },
          { nombre: 'Afeitado clásico', precio: 130 }
        ] },
        { categoria: 'Extras', productos: [
          { nombre: 'Diseño o línea', precio: 50 },
          { nombre: 'Mascarilla facial', precio: 80 },
          { nombre: 'Ceja', precio: 40 }
        ] }
      ],
      preguntas: [
        { p: '¿Necesito cita?', r: 'Te recomendamos agendar por WhatsApp para no esperar, pero también atendemos sin cita según disponibilidad.' },
        { p: '¿Cuánto dura un servicio?', r: 'Un corte toma entre 30 y 45 minutos; corte y barba, alrededor de una hora.' },
        { p: '¿Cómo puedo pagar?', r: 'Aceptamos {pagos}.' }
      ],
      horario: { lun: '10:00-20:00', mar: '10:00-20:00', mie: '10:00-20:00', jue: '10:00-20:00', vie: '10:00-20:00', sab: '09:00-20:00', dom: '10:00-15:00' },
      pagos: ['Efectivo', 'Transferencia', 'Tarjeta'],
      entrega: '',
      example: { nombre: 'Barbería Fulanito', zona: 'Guadalajara, Jal.' }
    },

    salud: {
      label: 'Consultorio médico, dental o terapia',
      short: 'Consultorio',
      emoji: '🩺',
      schemaType: 'MedicalClinic',
      seoTitle: '{nombre} | Consultas y citas[ en {zona}]',
      navLabel: 'Servicios',
      catalogEyebrow: 'Servicios',
      catalogTitle: 'Servicios y costos',
      catalogIntro: 'Costos de referencia. Escríbenos y te orientamos sin compromiso.',
      catalogIntroAlt: 'Costos de referencia. Agrega lo que necesitas y te confirmamos por WhatsApp.',
      aboutTitle: 'Atención que se siente',
      ctaLabel: 'Agendar cita',
      ctaShort: 'Agendar',
      greeting: 'Hola 👋 Me gustaría agendar una cita.',
      orders: false,
      itemAction: 'Agendar',
      itemMessage: 'Hola 👋 Me gustaría agendar: {item}. ¿Qué disponibilidad tienen?',
      ctaBandTitle: 'Agenda tu cita hoy',
      ctaBandText: 'Te respondemos por WhatsApp con los horarios disponibles.',
      qrText: 'Escanea para agendar tu cita por WhatsApp',
      theme: { mode: 'light', primary: '#0e7490', accent: '#2dd4bf', bg: '#f4fafb', surface: '#ffffff', text: '#0f2a33', muted: '#4b6670', hero1: '#062c3a', hero2: '#0e7490' },
      fonts: { head: ['Plus Jakarta Sans', '600;700;800', 'system-ui, sans-serif'], body: ['Plus Jakarta Sans', '400;500;600', 'system-ui, sans-serif'] },
      tagline: 'Atención profesional y cercana[ en {zona}]. Agenda tu cita por WhatsApp en minutos.',
      about: 'En {nombre} te atendemos sin prisas: escuchamos, explicamos cada paso y resolvemos tus dudas. Queremos que salgas de tu consulta con respuestas claras y un plan pensado para ti.',
      highlights: [
        { icono: '🤝', titulo: 'Trato humano', texto: 'Te escuchamos con calma y resolvemos tus dudas.' },
        { icono: '📅', titulo: 'Citas puntuales', texto: 'Agenda por WhatsApp y recibe la confirmación de tu horario.' },
        { icono: '🧾', titulo: 'Costos claros', texto: 'Conoce el costo antes de tu consulta. Sin sorpresas.' }
      ],
      catalogo: [
        { categoria: 'Consultas', productos: [
          { nombre: 'Consulta de primera vez', precio: 500, descripcion: 'Valoración completa y plan de tratamiento' },
          { nombre: 'Consulta de seguimiento', precio: 400 },
          { nombre: 'Consulta en línea', precio: 400, descripcion: 'Por videollamada' }
        ] },
        { categoria: 'Otros servicios', productos: [
          { nombre: 'Certificado médico', precio: 250 },
          { nombre: 'Atención a domicilio', precio: 'Cotizar', descripcion: 'Según la zona' }
        ] }
      ],
      preguntas: [
        { p: '¿Cómo agendo una cita?', r: 'Escríbenos por WhatsApp con el día que prefieres y te compartimos los horarios disponibles.' },
        { p: '¿Qué debo llevar a mi primera consulta?', r: 'Una identificación y, si los tienes, estudios o recetas anteriores.' },
        { p: '¿Qué formas de pago aceptan?', r: 'Aceptamos {pagos}.' }
      ],
      horario: { lun: '09:00-14:00, 16:00-20:00', mar: '09:00-14:00, 16:00-20:00', mie: '09:00-14:00, 16:00-20:00', jue: '09:00-14:00, 16:00-20:00', vie: '09:00-14:00, 16:00-20:00', sab: '09:00-14:00', dom: '' },
      pagos: ['Efectivo', 'Transferencia', 'Tarjeta'],
      entrega: '',
      example: { nombre: 'Consultorio Dra. Menganita', zona: 'Monterrey, N.L.' }
    },

    taller: {
      label: 'Taller mecánico u oficios',
      short: 'Taller y oficios',
      emoji: '🔧',
      schemaType: 'AutoRepair',
      seoTitle: '{nombre} | Servicios y cotizaciones[ en {zona}]',
      navLabel: 'Servicios',
      catalogEyebrow: 'Servicios',
      catalogTitle: 'Servicios y precios',
      catalogIntro: 'Precios de referencia. Te damos tu presupuesto exacto antes de empezar.',
      catalogIntroAlt: 'Precios de referencia. Agrega lo que necesitas y te mandamos tu presupuesto exacto.',
      aboutTitle: 'Mecánicos de confianza',
      ctaLabel: 'Pedir cotización',
      ctaShort: 'Cotizar',
      greeting: 'Hola 👋 Quiero pedir una cotización.',
      orders: false,
      itemAction: 'Cotizar',
      itemMessage: 'Hola 👋 Quiero cotizar: {item}.',
      ctaBandTitle: 'Cotiza sin compromiso',
      ctaBandText: 'Cuéntanos qué necesitas y te respondemos hoy mismo.',
      qrText: 'Escanea para ver servicios y cotizar por WhatsApp',
      theme: { mode: 'light', primary: '#facc15', accent: '#f97316', bg: '#f6f7f9', surface: '#ffffff', text: '#0f172a', muted: '#475569', hero1: '#0b1220', hero2: '#1e293b' },
      fonts: { head: ['Barlow Condensed', '600;700;800', 'Impact, sans-serif'], body: ['Barlow', '400;500;600;700', 'system-ui, sans-serif'] },
      upper: true,
      tagline: 'Servicio honesto[ en {zona}]. Te explicamos qué tiene tu auto antes de cobrarte.',
      about: 'En {nombre} trabajamos con transparencia: revisamos, te mostramos lo que encontramos y te damos tu presupuesto antes de empezar. Si no lo autorizas, no se hace.\n\nAtendemos autos de todas las marcas.',
      highlights: [
        { icono: '🔍', titulo: 'Diagnóstico claro', texto: 'Te explicamos la falla con palabras sencillas.' },
        { icono: '🧾', titulo: 'Presupuesto antes de trabajar', texto: 'Tú autorizas cada reparación. Sin cobros sorpresa.' },
        { icono: '🛡️', titulo: 'Trabajo respaldado', texto: 'Pregunta por la garantía de tu servicio antes de empezar.' }
      ],
      catalogo: [
        { categoria: 'Mantenimiento', productos: [
          { nombre: 'Afinación menor', precio: 'Desde $900', descripcion: 'Bujías, filtros y revisión general' },
          { nombre: 'Cambio de aceite y filtro', precio: 'Desde $650' },
          { nombre: 'Revisión de frenos', precio: 'Desde $350' }
        ] },
        { categoria: 'Reparaciones', productos: [
          { nombre: 'Diagnóstico por computadora', precio: 350 },
          { nombre: 'Suspensión y dirección', precio: 'Cotizar' },
          { nombre: 'Sistema eléctrico', precio: 'Cotizar' },
          { nombre: 'Clutch', precio: 'Cotizar' }
        ] }
      ],
      preguntas: [
        { p: '¿Cuánto tarda una afinación?', r: 'Normalmente se entrega el mismo día. Escríbenos por WhatsApp para apartar tu lugar.' },
        { p: '¿Dan garantía?', r: 'Sí. Te explicamos la garantía de cada servicio antes de empezar.' },
        { p: '¿Puedo llevar mis propias refacciones?', r: 'Sí, aunque en ese caso la garantía cubre solo la mano de obra.' },
        { p: '¿Cómo puedo pagar?', r: 'Aceptamos {pagos}.' }
      ],
      horario: { lun: '09:00-19:00', mar: '09:00-19:00', mie: '09:00-19:00', jue: '09:00-19:00', vie: '09:00-19:00', sab: '09:00-15:00', dom: '' },
      pagos: ['Efectivo', 'Transferencia', 'Tarjeta'],
      entrega: '',
      example: { nombre: 'Taller Mecánico Don Fulano', zona: 'Puebla, Pue.' }
    },

    tienda: {
      label: 'Tienda, regalos o venta por catálogo',
      short: 'Tienda',
      emoji: '🎁',
      schemaType: 'Store',
      seoTitle: '{nombre} | Catálogo y pedidos por WhatsApp[ en {zona}]',
      navLabel: 'Catálogo',
      catalogEyebrow: 'Catálogo',
      catalogTitle: 'Elige tu detalle',
      catalogIntro: 'Agrega lo que te guste y mándanos tu pedido por WhatsApp. Personalizamos colores y mensaje.',
      catalogIntroAlt: 'Escríbenos por WhatsApp y personalizamos colores y mensaje.',
      aboutTitle: 'Detalles hechos a mano',
      ctaLabel: 'Pedir por WhatsApp',
      ctaShort: 'Pedir',
      greeting: 'Hola 👋 Quiero información para hacer un pedido.',
      orders: true,
      notesPlaceholder: 'Ej. colores, nombre o mensaje para la tarjeta',
      ctaBandTitle: 'Sorprende a alguien hoy',
      ctaBandText: 'Escríbenos y armamos el detalle perfecto.',
      qrText: 'Escanea para ver el catálogo y pedir por WhatsApp',
      theme: { mode: 'light', primary: '#db2777', accent: '#a855f7', bg: '#fff7fb', surface: '#ffffff', text: '#2a1020', muted: '#7a5468', hero1: '#4a0d2e', hero2: '#be185d' },
      fonts: { head: ['Bricolage Grotesque', '600;700;800', 'system-ui, sans-serif'], body: ['Inter', '400;500;600;700', 'system-ui, sans-serif'] },
      tagline: 'Detalles que enamoran, con entrega a domicilio[ en {zona}]. Elige, pide por WhatsApp y nosotros lo llevamos.',
      about: 'En {nombre} armamos cada detalle a mano y con mucho cariño. Personalizamos colores, nombres y mensajes para que tu regalo sea único.\n\nCumpleaños, aniversarios, graduaciones o simplemente porque sí: tenemos algo para cada ocasión.',
      highlights: [
        { icono: '🎀', titulo: 'Hecho a mano', texto: 'Cada arreglo se prepara especialmente para ti.' },
        { icono: '🚚', titulo: 'Entrega a domicilio', texto: 'Llevamos tu detalle hasta la puerta, con previo aviso.' },
        { icono: '✍️', titulo: 'Personalizado', texto: 'Nombre, colores y mensaje: tú decides.' }
      ],
      catalogo: [
        { categoria: 'Lo más pedido', productos: [
          { nombre: 'Arreglo de globos', precio: 350, descripcion: 'Con base y mensaje personalizado' },
          { nombre: 'Caja sorpresa', precio: 450, descripcion: 'Chocolates, peluche y tarjeta' },
          { nombre: 'Desayuno sorpresa', precio: 550, descripcion: 'Entrega a domicilio por la mañana' },
          { nombre: 'Ramo de flores', precio: 499, descripcion: 'Flores de temporada' }
        ] },
        { categoria: 'Detalles', productos: [
          { nombre: 'Taza personalizada', precio: 180 },
          { nombre: 'Globo con mensaje', precio: 120 },
          { nombre: 'Tarjeta de regalo', precio: 40 }
        ] }
      ],
      preguntas: [
        { p: '¿Con cuánto tiempo debo pedir?', r: 'Te recomendamos pedir con 24 horas de anticipación. Pedidos el mismo día según disponibilidad.' },
        { p: '¿Hacen entregas a domicilio?', r: 'Sí. El costo depende de la zona; te lo confirmamos por WhatsApp.' },
        { p: '¿Cómo se paga?', r: 'Aceptamos {pagos}. Para apartar tu pedido pedimos un anticipo.' }
      ],
      horario: { lun: '09:00-20:00', mar: '09:00-20:00', mie: '09:00-20:00', jue: '09:00-20:00', vie: '09:00-20:00', sab: '09:00-20:00', dom: '10:00-15:00' },
      pagos: ['Transferencia', 'Efectivo', 'Tarjeta'],
      entrega: 'Entregas a domicilio con costo según la zona.',
      example: { nombre: 'Detalles Perenganita', zona: 'Querétaro, Qro.' }
    },

    gimnasio: {
      label: 'Gimnasio, estudio o clases',
      short: 'Gimnasio y clases',
      emoji: '💪',
      schemaType: 'ExerciseGym',
      seoTitle: '{nombre} | Planes, horarios y clases[ en {zona}]',
      navLabel: 'Planes',
      catalogEyebrow: 'Planes',
      catalogTitle: 'Planes y precios',
      catalogIntro: 'Sin contratos forzosos. Escríbenos y te ayudamos a elegir.',
      catalogIntroAlt: 'Agrega el plan que te interesa y mándanos tu solicitud por WhatsApp.',
      aboutTitle: 'Entrena con nosotros',
      ctaLabel: 'Quiero inscribirme',
      ctaShort: 'Inscribirme',
      greeting: 'Hola 👋 Quiero información para inscribirme.',
      orders: false,
      itemAction: 'Me interesa',
      itemMessage: 'Hola 👋 Me interesa: {item}. ¿Me pueden dar más información?',
      ctaBandTitle: 'Empieza hoy',
      ctaBandText: 'Escríbenos y te decimos cómo empezar esta misma semana.',
      qrText: 'Escanea para ver planes y horarios',
      theme: { mode: 'dark', primary: '#a3e635', accent: '#22d3ee', bg: '#0a0b0a', surface: '#141614', text: '#f2f5ef', muted: '#a3ab9c', hero1: '#050605', hero2: '#1c2a0b' },
      fonts: { head: ['Anton', '400', 'Impact, sans-serif'], body: ['Inter', '400;500;600;700', 'system-ui, sans-serif'] },
      upper: true,
      tagline: 'Entrena[ en {zona}] con equipo completo y gente que te motiva. Inscríbete por WhatsApp.',
      about: 'En {nombre} creemos que entrenar debe ser para todos. Te acompañamos desde el primer día, sin importar tu nivel, para que llegues a tu meta y disfrutes el proceso.',
      highlights: [
        { icono: '🏋️', titulo: 'Equipo completo', texto: 'Pesas libres, máquinas y área funcional.' },
        { icono: '🔥', titulo: 'Clases grupales', texto: 'Funcional, box y baile en varios horarios.' },
        { icono: '🤝', titulo: 'Acompañamiento', texto: 'Te ayudamos a armar tu rutina desde el primer día.' }
      ],
      catalogo: [
        { categoria: 'Planes', productos: [
          { nombre: 'Visita', precio: 50 },
          { nombre: 'Semana', precio: 180 },
          { nombre: 'Mensualidad', precio: 450, descripcion: 'Acceso ilimitado al gimnasio y clases' },
          { nombre: 'Trimestre', precio: 1200, descripcion: 'Ahorra al pagar 3 meses' }
        ] },
        { categoria: 'Clases', productos: [
          { nombre: 'Funcional', precio: 'Incluida', descripcion: 'Lunes, miércoles y viernes' },
          { nombre: 'Box', precio: 'Incluida', descripcion: 'Martes y jueves' },
          { nombre: 'Baile fitness', precio: 'Incluida', descripcion: 'Sábados' }
        ] }
      ],
      preguntas: [
        { p: '¿Necesito experiencia?', r: 'No. Te enseñamos desde cero y adaptamos los ejercicios a tu nivel.' },
        { p: '¿Hay inscripción?', r: 'Pregúntanos por WhatsApp por las promociones de inscripción vigentes.' },
        { p: '¿Cómo puedo pagar?', r: 'Aceptamos {pagos}.' }
      ],
      horario: { lun: '06:00-22:00', mar: '06:00-22:00', mie: '06:00-22:00', jue: '06:00-22:00', vie: '06:00-22:00', sab: '07:00-15:00', dom: '' },
      pagos: ['Efectivo', 'Transferencia', 'Tarjeta'],
      entrega: '',
      example: { nombre: 'Gimnasio Mengano', zona: 'Hermosillo, Son.' }
    }
  };
});

/*
 * 185ChangarroWeb · Motor de páginas para negocios locales
 * El mismo código genera las páginas publicadas (Node, en el build)
 * y las vistas previas en vivo (navegador, en /crear/ y /demo/).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Changarro = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DAYS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
  const DAY_NAMES = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado', dom: 'Domingo' };
  const SCHEMA_DAYS = { lun: 'Monday', mar: 'Tuesday', mie: 'Wednesday', jue: 'Thursday', vie: 'Friday', sab: 'Saturday', dom: 'Sunday' };

  const api = { ASSETS: null, PRESETS: null, AGENCY: null, DAYS, DAY_NAMES };

  /* ---------- utilidades de texto ---------- */
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ESC[c]);
  const line = (v, max = 200) => (v == null ? '' : String(v).replace(/\s+/g, ' ').trim().slice(0, max));
  const block = (v, max = 2000) => (v == null ? '' : String(v).replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max));
  const arr = (v) => (Array.isArray(v) ? v : []);
  const has = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k) && o[k] != null;
  const paras = (v) => block(v).split(/\n\s*\n/).filter(Boolean).map((p) => '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');

  function slugify(s) {
    return line(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }

  // Rellena {campo}. Lo que va entre [corchetes] se omite si algún campo de adentro está vacío.
  function fill(tpl, ctx) {
    if (!tpl) return '';
    return String(tpl)
      .replace(/\[([^\]]*)\]/g, (m, inner) => ((inner.match(/\{(\w+)\}/g) || []).every((k) => ctx[k.slice(1, -1)]) ? inner : ''))
      .replace(/\{(\w+)\}/g, (m, k) => (ctx[k] != null ? ctx[k] : ''))
      .replace(/([^.\s])\.\.(?=\s|$)/g, '$1.'); // "N.L.." → "N.L."
  }

  function listText(items) {
    if (items.length < 2) return items.join('');
    return items.slice(0, -1).join(', ') + ' y ' + items[items.length - 1];
  }

  /* ---------- teléfonos y enlaces ---------- */
  function waNumber(v) {
    let d = String(v || '').replace(/\D/g, '');
    if (d.length === 10) d = '52' + d; // número mexicano de 10 dígitos
    else if (d.length === 13 && d.startsWith('521')) d = '52' + d.slice(3); // formato antiguo con 1
    return d.length >= 11 && d.length <= 15 ? d : '';
  }
  const waLink = (num, msg) => 'https://wa.me/' + (num || '') + (msg ? '?text=' + encodeURIComponent(msg) : '');

  function telHref(v) {
    const d = String(v || '').replace(/[^\d+]/g, '');
    if (d.replace(/\D/g, '').length < 8) return '';
    return 'tel:' + (/^\d{10}$/.test(d) ? '+52' + d : d);
  }

  function prettyWa(num) {
    const d = String(num || '');
    if (!d.startsWith('52') || d.length !== 12) return d ? '+' + d : '';
    const n = d.slice(2);
    return /^(55|56|33|81)/.test(n) ? n.slice(0, 2) + ' ' + n.slice(2, 6) + ' ' + n.slice(6) : n.slice(0, 3) + ' ' + n.slice(3, 6) + ' ' + n.slice(6);
  }

  function safeUrl(v) {
    const s = line(v, 500);
    return /^https?:\/\/[^\s"'<>]+$/i.test(s) ? s : '';
  }

  // Imágenes: URL completa o archivo junto a datos.json (ej. "portada.jpg").
  function safeAsset(v) {
    const s = line(v, 500);
    if (/^https?:\/\/[^\s"'<>()]+$/i.test(s)) return s;
    if (/^[\w-]+(\/[\w-]+)*\.(jpe?g|png|webp|gif|svg|avif)$/i.test(s)) return s;
    return '';
  }

  const SOCIAL = {
    facebook: { label: 'Facebook', base: 'https://www.facebook.com/' },
    instagram: { label: 'Instagram', base: 'https://www.instagram.com/' },
    tiktok: { label: 'TikTok', base: 'https://www.tiktok.com/@' },
    youtube: { label: 'YouTube', base: 'https://www.youtube.com/@' }
  };
  function socialUrl(k, v) {
    const s = line(v, 300);
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return safeUrl(s);
    const handle = s.replace(/^@/, '').replace(/[^\w.\-]/g, '');
    return handle ? SOCIAL[k].base + handle : '';
  }

  /* ---------- colores ---------- */
  function hex(v) {
    const s = line(v).toLowerCase();
    if (/^#[0-9a-f]{6}$/.test(s)) return s;
    if (/^#[0-9a-f]{3}$/.test(s)) return '#' + s.slice(1).split('').map((c) => c + c).join('');
    return '';
  }
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const toHex = (c) => '#' + c.map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return toHex(A.map((x, i) => x + (B[i] - x) * t)); };
  function lum(h) {
    const w = [0.2126, 0.7152, 0.0722];
    return rgb(h).reduce((s, v, i) => { v /= 255; return s + w[i] * (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); }, 0);
  }
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  function readable(c, bg) {
    const target = lum(bg) > 0.4 ? '#000000' : '#ffffff';
    let out = c;
    for (let i = 1; i <= 12 && contrast(out, bg) < 4.5; i++) out = mix(c, target, i * 0.07);
    return out;
  }

  /* ---------- fechas ---------- */
  const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function dateText(v) {
    const s = line(v, 40);
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m && +m[2] >= 1 && +m[2] <= 12) return (+m[3]) + ' de ' + MONTHS[+m[2] - 1] + ' de ' + m[1];
    return s;
  }

  /* ---------- precios ---------- */
  function money(n) {
    return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function price(v) {
    if (typeof v === 'number' && isFinite(v)) return { value: v, label: money(v) };
    const s = line(v, 40);
    const m = s.replace(/\s+/g, '').replace(/(mxn|pesos)$/i, '').match(/^\$?(\d{1,3}(?:,\d{3})+|\d+)(\.\d{1,2})?$/);
    if (m) { const n = parseFloat(m[1].replace(/,/g, '') + (m[2] || '')); return { value: n, label: money(n) }; }
    return { value: null, label: s };
  }

  /* ---------- horarios ---------- */
  const RANGE = /(\d{1,2})(?:[:.](\d{2}))?\s*([ap])?\.?\s*m?\.?\s*(?:-|–|—|a|al|hasta)\s*(\d{1,2})(?:[:.](\d{2}))?\s*([ap])?\.?\s*m?\.?/i;
  function toMin(h, m, ap) {
    h = +h; m = +(m || 0);
    if (ap) { ap = ap.toLowerCase(); if (ap === 'p' && h < 12) h += 12; if (ap === 'a' && h === 12) h = 0; }
    return Math.min(h, 24) * 60 + Math.min(m, 59);
  }
  function parseDay(v) {
    const s = line(v, 80).toLowerCase();
    if (!s || /cerrad|closed|descanso|no abr/.test(s)) return [];
    if (/24\s*h/.test(s)) return [[0, 1440]];
    const out = [];
    s.split(/,|;|\sy\s|\//).forEach((part) => {
      const m = part.match(RANGE);
      if (!m) return;
      const a = toMin(m[1], m[2], m[3]);
      let b = toMin(m[4], m[5], m[6]);
      if (b <= a) b += 1440; // cierra después de medianoche
      out.push([a, b]);
    });
    return out.sort((x, y) => x[0] - y[0]);
  }
  function clock(min, h24) {
    min = ((min % 1440) + 1440) % 1440;
    let h = Math.floor(min / 60);
    const mm = String(min % 60).padStart(2, '0');
    if (h24) return h + ':' + mm;
    const ap = h < 12 ? 'am' : 'pm';
    h = h % 12 || 12;
    return h + ':' + mm + ' ' + ap;
  }
  function rangesText(r, h24) {
    if (!r.length) return 'Cerrado';
    if (r.length === 1 && r[0][0] === 0 && r[0][1] === 1440) return 'Abierto 24 horas';
    return r.map((x) => clock(x[0], h24) + ' – ' + clock(x[1], h24)).join(' y ');
  }
  function groupHours(hours, h24) {
    const groups = [];
    DAYS.forEach((d) => {
      const t = rangesText(hours[d] || [], h24);
      const g = groups[groups.length - 1];
      if (g && g.text === t) g.days.push(d); else groups.push({ days: [d], text: t });
    });
    return groups.map((g) => {
      const a = DAY_NAMES[g.days[0]], b = DAY_NAMES[g.days[g.days.length - 1]].toLowerCase();
      const label = g.days.length === 1 ? a : g.days.length === 2 ? a + ' y ' + b : a + ' a ' + b;
      return { days: g.days, text: g.text, label: g.days.length === 7 ? 'Todos los días' : label };
    });
  }
  const hhmm = (min) => { min = min % 1440; return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0'); };

  /* ---------- catálogo <-> texto (para el creador) ---------- */
  function catalogToText(cat) {
    return arr(cat).map((c) => {
      const rows = arr(c.productos).map((p) => {
        const cells = [p.nombre, p.precio == null || p.precio === '' ? '' : price(p.precio).label, p.descripcion]
          .map((x) => (x == null ? '' : String(x).replace(/\|/g, '/').trim()));
        while (cells.length > 1 && !cells[cells.length - 1]) cells.pop();
        return cells.join(' | ');
      });
      return (c.categoria ? '# ' + c.categoria + '\n' : '') + rows.join('\n');
    }).join('\n\n');
  }
  function textToCatalog(txt) {
    const out = [];
    let cur = null;
    String(txt || '').split(/\r?\n/).forEach((raw) => {
      const l = raw.trim();
      if (!l) return;
      if (l.startsWith('#')) { cur = { categoria: line(l.replace(/^#+/, ''), 60), productos: [] }; out.push(cur); return; }
      const parts = l.split('|').map((x) => x.trim());
      const p = { nombre: line(parts[0], 80) };
      if (parts[1]) { const pr = price(parts[1]); p.precio = pr.value != null ? pr.value : pr.label; }
      if (parts[2]) p.descripcion = line(parts.slice(2).join(' / '), 200);
      if (!p.nombre) return;
      if (!cur) { cur = { categoria: '', productos: [] }; out.push(cur); }
      cur.productos.push(p);
    });
    return out.filter((c) => c.productos.length);
  }

  /* ---------- modelo normalizado ---------- */
  const LOWER_OK = /^(efectivo|transferencia|tarjeta( de (cr[eé]dito|d[eé]bito))?|dep[oó]sito|vales)$/i;

  function model(input, opts) {
    const presets = opts.presets || api.PRESETS || {};
    const d = input && typeof input === 'object' ? input : {};
    const type = presets[d.tipo] ? d.tipo : Object.keys(presets)[0];
    const P = presets[type];
    const name = line(d.nombre, 80) || 'Tu negocio';
    const zona = line(d.zona, 80);
    const pagos = (has(d, 'pagos') ? arr(d.pagos) : P.pagos).map((x) => line(x, 30)).filter(Boolean).slice(0, 8);
    const ctx = { nombre: name, zona, pagos: listText(pagos.map((x) => (LOWER_OK.test(x) ? x.toLowerCase() : x))) || 'varias formas de pago' };

    const m = { type, P, name, zona, ctx, pagos };
    m.slug = slugify(d.slug || name) || 'negocio';
    m.tagline = line(fill(d.eslogan || P.tagline, ctx), 240);
    m.seoTitle = line(fill(d.seoTitulo || P.seoTitle, ctx), 120);
    m.wa = waNumber(d.whatsapp);
    m.phone = line(d.telefono, 30);
    m.address = line(d.direccion, 160);
    m.tz = /^[A-Za-z_]+\/[A-Za-z_]+$/.test(line(d.zonaHoraria)) ? line(d.zonaHoraria) : 'America/Mexico_City';
    m.h24 = d.formato24h === true;

    const rawH = has(d, 'horario') ? d.horario : P.horario;
    m.hours = {};
    m.hasHours = false;
    DAYS.forEach((k) => { m.hours[k] = parseDay(rawH && rawH[k]); if (m.hours[k].length) m.hasHours = true; });

    m.about = block(fill(has(d, 'nosotros') ? d.nosotros : P.about, ctx), 1500);
    m.aboutTitle = line(fill(d.nosotrosTitulo || P.aboutTitle, ctx), 90);
    m.highlights = (has(d, 'destacados') ? arr(d.destacados) : P.highlights)
      .map((h) => ({ icon: line(h.icono, 8), title: line(fill(h.titulo, ctx), 60), text: line(fill(h.texto, ctx), 160) }))
      .filter((h) => h.title).slice(0, 6);

    let n = 0;
    m.sampleCatalog = !has(d, 'catalogo');
    m.catalog = (has(d, 'catalogo') ? arr(d.catalogo) : P.catalogo).map((c, ci) => ({
      title: line(c.categoria, 60),
      id: 'cat-' + ci + (slugify(c.categoria) ? '-' + slugify(c.categoria) : ''),
      items: arr(c.productos).map((p) => ({
        id: 'p' + n++, name: line(p.nombre, 80), price: price(p.precio), desc: line(p.descripcion, 200), photo: safeAsset(p.foto)
      })).filter((p) => p.name).slice(0, 80)
    })).filter((c) => c.items.length).slice(0, 20);
    m.catalogTitle = line(d.catalogoTitulo, 70) || P.catalogTitle;
    m.orders = has(d, 'pedidos') ? !!d.pedidos : !!P.orders;
    m.catalogIntro = line(d.catalogoIntro, 240) || (m.orders === !!P.orders ? P.catalogIntro : P.catalogIntroAlt) || '';

    m.entrega = line(fill(has(d, 'entrega') ? d.entrega : P.entrega, ctx), 200);
    m.faq = (has(d, 'preguntas') ? arr(d.preguntas) : P.preguntas)
      .map((q) => ({ q: line(fill(q.p, ctx), 160), a: block(fill(q.r, ctx), 800) }))
      .filter((q) => q.q && q.a).slice(0, 12);

    const r = d.redes || {};
    m.social = Object.keys(SOCIAL).map((k) => ({ k, label: SOCIAL[k].label, url: socialUrl(k, r[k]) })).filter((s) => s.url);

    // Base legal: datos del negocio, leyenda de precios, aviso de privacidad y términos.
    m.email = /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(line(d.correo)) ? line(d.correo) : '';
    m.titular = line(d.titular, 160) || name;
    m.since = dateText(d.preciosVigentes);
    m.priceNote = line(d.leyendaPrecios, 240) || ('Precios en pesos mexicanos, con IVA incluido.' + (m.since ? ' Vigentes desde el ' + m.since + '.' : ''));
    const tc = d.terminos && typeof d.terminos === 'object' ? d.terminos : {};
    m.terms = {
      anticipo: line(tc.anticipo, 300),
      cancelaciones: block(tc.cancelaciones, 800) || 'Puedes cancelar sin costo antes de que empecemos a preparar tu pedido; avísanos por WhatsApp.',
      devoluciones: block(tc.devoluciones, 800) || 'Si tu pedido llega incompleto o con algún problema, avísanos por WhatsApp el mismo día y lo resolvemos.',
      promociones: block(tc.promociones, 800) || 'Cada promoción indica su vigencia y sus condiciones. Salvo que se diga otra cosa, no son acumulables.',
      extra: block(tc.extra, 2000)
    };
    m.showTerms = m.orders || has(d, 'terminos');
    // Estadísticas sin cookies para el reporte mensual (opcional): GoatCounter (visitas y clics) o Cloudflare (visitas).
    const st = d.estadisticas && typeof d.estadisticas === 'object' ? d.estadisticas : {};
    m.stats = {
      goat: /^[a-z0-9-]{2,40}$/i.test(line(st.goatcounter)) ? line(st.goatcounter).toLowerCase() : '',
      cf: /^[a-f0-9]{32}$/i.test(line(st.cloudflare)) ? line(st.cloudflare) : ''
    };

    m.cover = safeAsset(d.portada);
    m.logo = safeAsset(d.logo);
    m.gallery = arr(d.galeria).map(safeAsset).filter(Boolean).slice(0, 12);
    m.credential = line(d.cedula, 100);
    m.domain = safeUrl(d.dominio).replace(/\/+$/, '');
    m.hideCredit = d.ocultarCredito === true;

    const mapa = line(d.mapa, 400);
    const isMapUrl = /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(mapa);
    m.mapQ = (!isMapUrl && mapa) || (m.address ? [name, m.address, zona].filter(Boolean).join(', ') : zona);
    m.mapLink = isMapUrl ? mapa : (m.mapQ ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(m.mapQ) : '');

    // Tema de colores
    const T = Object.assign({}, P.theme);
    const custom = hex(d.color);
    if (custom && custom !== T.primary) {
      T.primary = custom;
      T.accent = mix(custom, '#ffffff', 0.35);
      T.hero1 = mix(custom, '#000000', T.mode === 'dark' ? 0.9 : 0.74);
      T.hero2 = mix(custom, '#000000', T.mode === 'dark' ? 0.62 : 0.28);
    }
    T.onPrimary = contrast(T.primary, '#ffffff') >= contrast(T.primary, '#111111') ? '#ffffff' : '#111111';
    T.primaryText = readable(T.primary, T.bg);
    T.surface2 = T.mode === 'dark' ? mix(T.bg, '#ffffff', 0.035) : mix(T.bg, T.primary, 0.045);
    m.theme = T;
    m.upper = !!P.upper;
    return m;
  }

  /* ---------- iconos (trazos estilo Feather, licencia MIT) ---------- */
  const ICONS = {
    wa: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path transform="translate(7.3 6.6) scale(.42)" fill="currentColor" stroke="none" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    card: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    tiktok: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>'
  };
  const icon = (n) => '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';

  /* ---------- tipografías ---------- */
  function fontsHref(f) {
    const fam = {};
    [f.head, f.body].forEach((x) => {
      const w = x[1].split(';');
      fam[x[0]] = Array.from(new Set((fam[x[0]] || []).concat(w))).sort((a, b) => a - b);
    });
    return 'https://fonts.googleapis.com/css2?' + Object.keys(fam).map((n) => {
      const w = fam[n];
      return 'family=' + n.replace(/ /g, '+') + (w.length === 1 && w[0] === '400' ? '' : ':wght@' + w.join(';'));
    }).join('&') + '&display=swap';
  }

  function initial(name) {
    const words = name.split(/\s+/).filter((w) => !/^(el|la|los|las|de|del|y|the)$/i.test(w));
    return (words[0] || name).charAt(0).toUpperCase();
  }

  /* Favicon: el color del giro y su emoji. A propósito NO lleva la inicial ni nada parecido al logotipo
     del negocio: estos ejemplos son de negocios ficticios y un favicon con letra se podría confundir con
     la marca de un negocio real. El emoji es un carácter Unicode, no una imagen con derechos de autor. */
  function favicon(m) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="' + m.theme.primary + '"/><text x="32" y="45" text-anchor="middle" font-size="38">' + esc(m.P.emoji) + '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function absUrl(asset, base) {
    if (!asset) return '';
    if (/^https?:\/\//i.test(asset)) return asset;
    return base ? base.replace(/[^/]*$/, '') + asset : '';
  }

  /* ---------- textos legales del negocio (base; que los revise un abogado antes de usarlos) ---------- */
  function privacyRows(m, agencyBrand) {
    const where = [m.address, m.zona].filter(Boolean).join(', ');
    const contact = [m.email ? 'el correo ' + m.email : '', m.wa ? 'WhatsApp ' + prettyWa(m.wa) : '', m.phone ? 'el teléfono ' + m.phone : ''].filter(Boolean);
    return [
      ['Responsable', m.titular + (where ? ', con domicilio en ' + where : '') + ', es responsable del tratamiento de los datos personales que nos compartas por medio de esta página, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.'],
      ['Qué datos tratamos', m.orders
        ? 'Si haces un pedido, la página arma un mensaje de WhatsApp con tu nombre, la forma de entrega, tu dirección (si lo pides a domicilio) y tus notas. La página no guarda esos datos: solo nos llegan cuando tú envías el mensaje. Tu carrito se guarda únicamente en tu navegador.'
        : 'Esta página no te pide datos personales. Si nos escribes por WhatsApp o nos llamas, recibimos los datos que tú decidas compartir.'],
      ['Para qué los usamos', 'Para atender tu ' + (m.orders ? 'pedido' : 'solicitud') + ', contactarte sobre ' + (m.orders ? 'él' : 'ella') + ' y, en su caso, hacer la entrega. No los usamos para publicidad ni los vendemos.'],
      ['Con quién se comparten', 'Los mensajes viajan por WhatsApp (Meta), que los trata según sus propias políticas. ' + agencyBrand + ' administra esta página por encargo nuestro y solo trata datos para mantenerla funcionando.'],
      (m.stats.goat || m.stats.cf) ? ['Estadísticas de visitas', 'Contamos de forma anónima las visitas a esta página' + (m.stats.goat ? ' y los clics al botón de WhatsApp' : '') + ', sin cookies, con el servicio ' + (m.stats.goat ? 'GoatCounter' : 'Cloudflare Web Analytics') + '. Solo vemos totales, como cuántas personas entraron en el mes; no guardamos nada que te identifique.'] : null,
      ['Tus derechos', 'Puedes pedir el acceso, rectificación, cancelación u oposición al uso de tus datos (derechos ARCO), o revocar tu consentimiento, escribiéndonos ' + (contact.length ? 'a ' + listText(contact) : 'por los medios de contacto de esta página') + '.'],
      ['Cambios', 'Cualquier cambio a este aviso se publicará en esta misma página.']
    ];
  }
  function termsRows(m) {
    return [
      ['Precios', m.priceNote + ' Los precios pueden cambiar; se respeta el precio que te confirmemos para tu pedido.'],
      ['Cómo se hace un pedido', 'Armas tu pedido en esta página y lo envías por WhatsApp. El pedido queda confirmado cuando te respondemos con el total y el tiempo de entrega.'],
      ['Formas de pago', (m.pagos.length ? 'Aceptamos ' + m.ctx.pagos + '.' : 'Te confirmamos las formas de pago por WhatsApp.') + (m.terms.anticipo ? ' ' + m.terms.anticipo : '')],
      m.entrega ? ['Entregas', m.entrega + ' El costo y el tiempo de entrega se confirman por WhatsApp antes de preparar tu pedido.'] : null,
      ['Cancelaciones', m.terms.cancelaciones],
      ['Cambios y devoluciones', m.terms.devoluciones],
      ['Promociones', m.terms.promociones],
      m.terms.extra ? ['Otras condiciones', m.terms.extra] : null,
      ['Tus derechos como consumidor', 'Tienes los derechos que te da la Ley Federal de Protección al Consumidor. Si tienes una queja que no resolvamos, puedes acudir a la Procuraduría Federal del Consumidor (Profeco): Teléfono del Consumidor 55 5568 8722 y 800 468 8722, o en profeco.gob.mx.']
    ];
  }

  function jsonLd(m, url) {
    const o = { '@context': 'https://schema.org', '@type': m.P.schemaType, name: m.name, description: m.tagline };
    if (url) o.url = url;
    if (m.phone) o.telephone = m.phone; else if (m.wa) o.telephone = '+' + m.wa;
    if (m.email) o.email = m.email;
    if (m.address || m.zona) o.address = { '@type': 'PostalAddress', streetAddress: m.address || undefined, addressLocality: m.zona || undefined, addressCountry: 'MX' };
    const img = absUrl(m.cover || m.logo, url);
    if (img) o.image = img;
    const spec = [];
    DAYS.forEach((k) => m.hours[k].forEach((x) => spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: SCHEMA_DAYS[k], opens: hhmm(x[0]), closes: x[1] === 1440 ? '23:59' : hhmm(x[1]) })));
    if (spec.length) o.openingHoursSpecification = spec;
    if (m.social.length) o.sameAs = m.social.map((s) => s.url);
    if (m.P.schemaType === 'Restaurant' && url && m.catalog.length) o.hasMenu = url + '#catalogo';
    if (m.pagos.length) o.paymentAccepted = m.pagos.join(', ');
    o.currenciesAccepted = 'MXN';
    return JSON.stringify(o).replace(/</g, '\\u003c');
  }

  /* ---------- página completa ---------- */
  function renderSite(input, opts) {
    opts = opts || {};
    const mode = opts.mode || 'live'; // live | demo | example | preview
    const agency = Object.assign({ brand: '185ChangarroWeb', url: '', wa: '' }, api.AGENCY || {}, opts.agency || {});
    const home = opts.home || '/';
    const assets = opts.assets || api.ASSETS || { css: '', js: '' };
    const m = model(input, opts);
    const P = m.P, T = m.theme;
    const live = mode === 'live';
    const exMsg = 'Hola 👋 Vi el ejemplo «' + m.name + '» y quiero una página así para mi negocio.';
    const contactWa = mode === 'example' ? agency.wa : (m.wa || agency.wa);
    const wa = (msg) => esc(waLink(contactWa, mode === 'example' ? exMsg : msg));
    const tel = mode === 'example' ? '' : telHref(m.phone);
    const canonical = opts.canonical || '';
    const out = (url) => ' href="' + url + '" target="_blank" rel="noopener"';

    const hw = P.fonts.head[1].split(';').map(Number);
    const vars = {
      primary: T.primary, 'on-primary': T.onPrimary, 'primary-text': T.primaryText, accent: T.accent,
      bg: T.bg, surface: T.surface, 'surface-2': T.surface2, text: T.text, muted: T.muted,
      hero1: T.hero1, hero2: T.hero2,
      'font-head': "'" + P.fonts.head[0] + "', " + P.fonts.head[2],
      'font-body': "'" + P.fonts.body[0] + "', " + P.fonts.body[2],
      hw: hw.indexOf(700) > -1 ? 700 : Math.max.apply(null, hw),
      'hw-strong': Math.max.apply(null, hw)
    };
    const rootCss = ':root{color-scheme:' + (T.mode === 'dark' ? 'dark' : 'light') + ';' + Object.keys(vars).map((k) => '--' + k + ':' + vars[k]).join(';') + '}';

    /* --- encabezado --- */
    const nav = [];
    if (m.catalog.length) nav.push(['#catalogo', P.navLabel]);
    if (m.about) nav.push(['#nosotros', 'Nosotros']);
    if (m.hasHours || m.mapQ) nav.push(['#visitanos', 'Horario y ubicación']);
    if (m.faq.length) nav.push(['#preguntas', 'Preguntas']);
    // Sin logo propio, el distintivo es el emoji del giro (ver favicon): nada de iniciales que parezcan una marca.
    const mark = m.logo ? '<img class="brand-logo" src="' + esc(m.logo) + '" alt="">' : '<span class="brand-mark" aria-hidden="true">' + esc(P.emoji) + '</span>';

    let banner = '';
    if (mode === 'example') {
      banner = '<div class="py-bar"><div class="wrap"><p>🧪 <b>Negocio ficticio de ejemplo</b><span class="py-more"> hecho por ' + esc(agency.brand) + '</span></p><div class="py-bar-actions"><a href="' + esc(home) + '#precios">Ver precios</a><a class="py-bar-cta"' + out(esc(waLink(agency.wa, exMsg))) + '>Quiero una así</a></div></div></div>';
    } else if (mode === 'demo') {
      banner = '<div class="py-bar"><div class="wrap"><p>👀 <b>Vista previa</b><span class="py-more"> para ' + esc(m.name) + (m.sampleCatalog ? ' · textos y precios de ejemplo' : ' · aún sin publicar') + '</span></p><div class="py-bar-actions"><a href="' + esc(home) + 'crear/" data-py-edit>Editar</a><a class="py-bar-cta" data-py-publish' + out(esc(waLink(agency.wa, 'Hola 👋 Quiero publicar mi página «' + m.name + '».'))) + '>Publicar mi página</a></div></div></div>';
    }

    const header = '<header class="hdr"><div class="wrap hdr-in"><a class="brand" href="#inicio">' + mark + '<span>' + esc(m.name) + '</span></a>' +
      (nav.length ? '<nav class="nav" aria-label="Secciones">' + nav.map((n) => '<a href="' + n[0] + '">' + esc(n[1]) + '</a>').join('') + '</nav>' : '') +
      '<a class="btn btn-wa btn-sm"' + out(wa(P.greeting)) + '>' + icon('wa') + '<span>' + esc(P.ctaShort) + '</span></a></div></header>';

    /* --- portada --- */
    const cardRows = [];
    if (m.hasHours) cardRows.push('<div class="hc-row">' + icon('clock') + '<div><small>Hoy</small><b data-today>Consulta el horario abajo</b></div></div>');
    if (m.address || m.zona) cardRows.push('<div class="hc-row">' + icon('pin') + '<div><small>Dónde estamos</small><b>' + esc(m.address || m.zona) + '</b>' + (m.address && m.zona ? '<span>' + esc(m.zona) + '</span>' : '') + '</div></div>');
    if (m.entrega) cardRows.push('<div class="hc-row">' + icon('truck') + '<div><small>Entregas</small><b>' + esc(m.entrega) + '</b></div></div>');
    if (m.pagos.length) cardRows.push('<div class="hc-row">' + icon('card') + '<div><small>Formas de pago</small><b>' + esc(m.pagos.join(' · ')) + '</b></div></div>');
    const heroCard = cardRows.length ? '<aside class="hero-card">' + cardRows.join('') + (m.mapLink ? '<a class="hc-link"' + out(esc(m.mapLink)) + '>' + icon('nav') + 'Cómo llegar</a>' : '') + '</aside>' : '';

    const hero = '<section class="hero' + (m.cover ? ' has-cover' : '') + '" id="inicio">' +
      (m.cover ? '<img class="hero-cover" src="' + esc(m.cover) + '" alt="" fetchpriority="high">' : '') +
      '<div class="wrap hero-in"><div class="hero-copy">' +
      (m.hasHours ? '<p class="status" data-status hidden><span class="dot"></span><span data-status-text></span></p>' : '') +
      '<h1>' + esc(m.name) + '</h1><p class="lead">' + esc(m.tagline) + '</p><div class="hero-actions">' +
      '<a class="btn btn-wa btn-lg"' + out(wa(P.greeting)) + '>' + icon('wa') + esc(P.ctaLabel) + '</a>' +
      (m.catalog.length ? '<a class="btn btn-glass btn-lg" href="#catalogo">Ver ' + esc(P.navLabel.toLowerCase()) + '</a>' : '') +
      (tel ? '<a class="btn btn-glass btn-lg" href="' + esc(tel) + '">' + icon('phone') + 'Llamar</a>' : '') +
      '</div></div>' + heroCard + '</div></section>';

    /* --- ventajas --- */
    const perks = m.highlights.length ? '<section class="perks"><div class="wrap perks-grid">' + m.highlights.map((h) =>
      '<div class="perk"><span class="perk-ico" aria-hidden="true">' + esc(h.icon || '✓') + '</span><div><h3>' + esc(h.title) + '</h3>' + (h.text ? '<p>' + esc(h.text) + '</p>' : '') + '</div></div>').join('') + '</div></section>' : '';

    /* --- catálogo --- */
    const itemHtml = (it) => {
      let act = '';
      if (m.orders) act = '<button class="add" type="button" data-add="' + it.id + '" aria-label="Agregar ' + esc(it.name) + '">' + icon('plus') + '<span>Agregar</span><b class="badge" hidden></b></button>';
      else if (P.itemAction) act = '<a class="add"' + out(wa(fill(P.itemMessage, { item: it.name }))) + '>' + esc(P.itemAction) + '</a>';
      return '<article class="item">' + (it.photo ? '<img src="' + esc(it.photo) + '" alt="' + esc(it.name) + '" loading="lazy" width="88" height="88">' : '') +
        '<div class="item-body"><div class="item-top"><h4>' + esc(it.name) + '</h4>' + (it.price.label ? '<span class="price">' + esc(it.price.label) + '</span>' : '') + '</div>' +
        (it.desc ? '<p>' + esc(it.desc) + '</p>' : '') + (act ? '<div class="item-act">' + act + '</div>' : '') + '</div></article>';
    };
    const catalog = m.catalog.length ? '<section class="sec" id="catalogo"><div class="wrap"><div class="sec-head"><p class="eyebrow">' + esc(P.catalogEyebrow) + '</p><h2>' + esc(m.catalogTitle) + '</h2>' +
      (m.catalogIntro ? '<p>' + esc(m.catalogIntro) + '</p>' : '') +
      (!live && m.sampleCatalog ? '<p class="note">✏️ Productos y precios de ejemplo: se cambian por los tuyos.</p>' : '') + '</div>' +
      (m.catalog.length > 1 ? '<nav class="chips" aria-label="Categorías">' + m.catalog.map((c) => '<a class="chip" href="#' + c.id + '">' + esc(c.title || P.navLabel) + '</a>').join('') + '</nav>' : '') +
      m.catalog.map((c) => '<div class="cat" id="' + c.id + '">' + (c.title ? '<h3 class="cat-title">' + esc(c.title) + '</h3>' : '') + '<div class="items">' + c.items.map(itemHtml).join('') + '</div></div>').join('') +
      '<p class="price-note">' + esc(m.priceNote) + (m.showTerms ? ' Consulta los <a href="#terminos" data-legal>términos y condiciones</a>.' : '') + '</p>' +
      '</div></section>' : '';

    /* --- nosotros --- */
    let aside = '';
    if (m.cover) aside = '<img class="about-img" src="' + esc(m.cover) + '" alt="' + esc(m.name) + '" loading="lazy">';
    else {
      const cut = m.tagline.indexOf('. ');
      aside = '<div class="about-art" aria-hidden="true"><span class="emo">' + esc(P.emoji) + '</span><p>' + esc(cut > -1 ? m.tagline.slice(0, cut + 1) : m.tagline) + '</p><small>' + esc(m.name) + '</small></div>';
    }
    const about = m.about ? '<section class="sec sec-alt" id="nosotros"><div class="wrap about"><div class="about-copy"><p class="eyebrow">Nosotros</p><h2>' + esc(m.aboutTitle) + '</h2>' + paras(m.about) +
      (m.credential ? '<p class="cred">' + esc(m.credential) + '</p>' : '') +
      (m.social.length ? '<div class="socials">' + m.social.map((s) => '<a' + out(esc(s.url)) + '>' + icon(s.k) + esc(s.label) + '</a>').join('') + '</div>' : '') +
      '</div>' + aside + '</div></section>' : '';

    const gallery = m.gallery.length ? '<section class="sec" id="galeria"><div class="wrap"><div class="sec-head"><p class="eyebrow">Galería</p><h2>Así se ve ' + esc(m.name) + '</h2></div><div class="gallery">' +
      m.gallery.map((g) => '<img src="' + esc(g) + '" alt="" loading="lazy">').join('') + '</div></div></section>' : '';

    /* --- horario y ubicación --- */
    let visit = '';
    if (m.hasHours || m.mapQ || m.mapLink) {
      const groups = groupHours(m.hours, m.h24);
      const contact = [];
      if (contactWa && mode !== 'example') contact.push('<a' + out(wa(P.greeting)) + '>' + icon('wa') + 'WhatsApp ' + esc(prettyWa(contactWa)) + '</a>');
      if (tel) contact.push('<a href="' + esc(tel) + '">' + icon('phone') + esc(m.phone) + '</a>');
      visit = '<section class="sec" id="visitanos"><div class="wrap"><div class="sec-head"><p class="eyebrow">Visítanos</p><h2>Horario y ubicación</h2></div><div class="visit"><div class="card">' +
        (m.hasHours ? '<h3>' + icon('clock') + 'Horario</h3><table class="hours"><tbody>' + groups.map((g) => '<tr data-days="' + g.days.join(',') + '"><th scope="row">' + esc(g.label) + '</th><td>' + esc(g.text) + '</td></tr>').join('') + '</tbody></table>' : '') +
        (m.address || m.zona ? '<h3>' + icon('pin') + 'Dirección</h3><p class="addr">' + esc(m.address) + (m.address && m.zona ? '<br>' : '') + esc(m.zona) + '</p>' : '') +
        (contact.length ? '<div class="contact">' + contact.join('') + '</div>' : '') +
        '<div class="visit-actions">' + (m.mapLink ? '<a class="btn btn-primary"' + out(esc(m.mapLink)) + '>' + icon('nav') + 'Cómo llegar</a>' : '') +
        '<a class="btn btn-outline"' + out(wa(P.greeting)) + '>' + icon('wa') + esc(P.ctaShort) + ' por WhatsApp</a></div></div>' +
        (m.mapQ ? '<div class="map-wrap"><iframe class="map" src="' + esc('https://www.google.com/maps?q=' + encodeURIComponent(m.mapQ) + '&output=embed') + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa de ' + esc(m.name) + '"></iframe></div>' : '') +
        '</div></div></section>';
    }

    const faq = m.faq.length ? '<section class="sec sec-alt" id="preguntas"><div class="wrap faq-wrap"><div class="sec-head"><p class="eyebrow">Preguntas frecuentes</p><h2>Resolvemos tus dudas</h2><p>¿No encuentras tu respuesta? Escríbenos por WhatsApp.</p></div><div class="faq">' +
      m.faq.map((f) => '<details><summary>' + esc(f.q) + '</summary><div>' + paras(f.a) + '</div></details>').join('') + '</div></div></section>' : '';

    const band = '<section class="cta-band"><div class="wrap"><div class="cta-in"><div><h2>' + esc(P.ctaBandTitle) + '</h2><p>' + esc(P.ctaBandText) + '</p></div><a class="btn btn-wa btn-lg"' + out(wa(P.greeting)) + '>' + icon('wa') + esc(P.ctaLabel) + '</a></div></div></section>';

    const year = new Date().getFullYear();
    const credit = m.hideCredit ? '' : '<span>Página creada con <a href="' + esc((agency.url || home).replace(/\/+$/, '') + '/?ref=' + m.slug) + '" rel="noopener">' + esc(agency.brand) + '</a></span>';
    // Datos del negocio siempre visibles (Ley Federal de Protección al Consumidor, art. 76 bis).
    const bizData = [];
    if (m.titular !== m.name) bizData.push(esc(m.titular));
    if (m.address || m.zona) bizData.push(esc([m.address, m.zona].filter(Boolean).join(', ')));
    if (tel) bizData.push('Tel. <a href="' + esc(tel) + '">' + esc(m.phone) + '</a>');
    if (contactWa && mode !== 'example') bizData.push('WhatsApp <a' + out(wa(P.greeting)) + '>' + esc(prettyWa(contactWa)) + '</a>');
    if (m.email) bizData.push('<a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a>');
    if (m.credential) bizData.push(esc(m.credential));
    const sample = live ? '' : ' <small>(ejemplo)</small>';
    const legalBlock = (id, title, rows) => '<details class="legal" id="' + id + '"><summary>' + title + sample + '</summary><div class="legal-in">' +
      rows.filter(Boolean).map((r) => '<h4>' + esc(r[0]) + '</h4><p>' + esc(r[1]) + '</p>').join('') + '</div></details>';
    const footer = '<footer class="ftr"><div class="wrap ftr-in"><div><p class="ftr-name">' + esc(m.name) + '</p>' +
      (bizData.length ? '<ul class="ftr-data">' + bizData.map((x) => '<li>' + x + '</li>').join('') + '</ul>' : '') + '</div>' +
      '<div class="ftr-links">' + m.social.map((s) => '<a' + out(esc(s.url)) + '>' + icon(s.k) + esc(s.label) + '</a>').join('') + '<a' + out(wa(P.greeting)) + '>' + icon('wa') + 'WhatsApp</a></div></div>' +
      '<div class="wrap ftr-legal">' + legalBlock('aviso-privacidad', 'Aviso de privacidad', privacyRows(m, agency.brand)) +
      (m.showTerms ? legalBlock('terminos', 'Términos y condiciones', termsRows(m)) : '') + '</div>' +
      '<div class="wrap ftr-bottom"><span>© ' + year + ' ' + esc(m.name) + '</span>' + credit + '</div></footer>';

    /* --- pedidos --- */
    const fab = '<a class="fab"' + out(wa(P.greeting)) + ' aria-label="Escríbenos por WhatsApp" data-fab>' + icon('wa') + '</a>';
    let cart = '';
    if (m.orders) {
      cart = '<div class="cartbar" data-cartbar hidden><button type="button" class="cartbar-btn" data-open-cart>' + icon('bag') + '<span><b data-count>0</b> <span data-count-label>productos</span></span><span class="cartbar-total" data-total>$0</span><span class="cartbar-go">Ver pedido</span></button></div>' +
        '<dialog class="sheet" id="py-cart" aria-labelledby="py-cart-t"><div class="sheet-in"><div class="sheet-head"><h2 id="py-cart-t">Tu pedido</h2><button type="button" class="x" data-close aria-label="Cerrar">' + icon('x') + '</button></div>' +
        '<ul class="lines" data-lines></ul><div class="sum"><span>Total</span><b data-total>$0</b></div>' +
        '<form class="order-form" data-order-form><label class="fld"><span>Tu nombre</span><input name="nombre" autocomplete="name" maxlength="60"></label>' +
        (m.entrega ? '<div class="seg"><label><input type="radio" name="modo" value="recoger" checked><span>Paso a recoger</span></label><label><input type="radio" name="modo" value="domicilio"><span>A domicilio</span></label></div><label class="fld" data-addr hidden><span>Dirección de entrega</span><textarea name="direccion" rows="2" maxlength="220" autocomplete="street-address"></textarea></label>' : '') +
        '<label class="fld"><span>Notas <small>(opcional)</small></span><input name="notas" maxlength="200" placeholder="' + esc(P.notesPlaceholder || 'Ej. color, talla o cualquier detalle') + '"></label>' +
        '<button class="btn btn-wa btn-block btn-lg" type="submit">' + icon('wa') + 'Enviar pedido por WhatsApp</button>' +
        '<p class="fine">Se abre WhatsApp con tu pedido listo para enviar. Al enviarlo aceptas los <a href="#terminos" data-legal>términos y condiciones</a> y el <a href="#aviso-privacidad" data-legal>aviso de privacidad</a>.</p><button type="button" class="link-btn" data-clear>Vaciar pedido</button></form></div></dialog>';
    }
    let preview = '';
    if (!live) {
      preview = '<dialog class="sheet" id="py-preview" aria-labelledby="py-prev-t"><div class="sheet-in"><div class="sheet-head"><h2 id="py-prev-t">Así le llega el mensaje al negocio</h2><button type="button" class="x" data-close aria-label="Cerrar">' + icon('x') + '</button></div>' +
        '<div class="wa-chat"><div class="wa-bubble" data-msg></div></div>' +
        (mode === 'example'
          ? '<p class="fine">Es un ejemplo: en una página real, el pedido llega directo al WhatsApp del negocio, sin comisiones.</p><a class="btn btn-primary btn-block"' + out(esc(waLink(agency.wa, exMsg))) + '>Quiero esto para mi negocio</a>'
          : '<p class="fine">Cuando la página esté publicada, este mensaje llegará directo al WhatsApp del negocio.</p><a class="btn btn-wa btn-block" data-msg-open' + out('#') + '>' + icon('wa') + 'Probar en WhatsApp</a>') +
        '</div></dialog>';
    }

    const runtime = {
      mode, slug: m.slug, name: m.name, wa: contactWa, tz: m.tz, h24: m.h24, hours: m.hours,
      orders: m.orders, delivery: !!m.entrega, agencyWa: agency.wa, home, goat: live && !!m.stats.goat,
      items: m.orders ? m.catalog.reduce((a, c) => a.concat(c.items.map((it) => ({ id: it.id, name: it.name, price: it.price.value, label: it.price.label }))), []) : []
    };

    const desc = m.tagline;
    const ogImg = absUrl(m.cover, canonical);
    const head = '<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
      '<title>' + esc(m.seoTitle) + '</title><meta name="description" content="' + esc(desc) + '"><meta name="theme-color" content="' + esc(T.hero1) + '">' +
      (canonical ? '<link rel="canonical" href="' + esc(canonical) + '">' : '') +
      (live ? '' : '<meta name="robots" content="noindex">') +
      '<meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:title" content="' + esc(m.name) + '"><meta property="og:description" content="' + esc(desc) + '">' +
      (canonical ? '<meta property="og:url" content="' + esc(canonical) + '">' : '') + (ogImg ? '<meta property="og:image" content="' + esc(ogImg) + '">' : '') +
      '<link rel="icon" href="' + esc(favicon(m)) + '">' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="' + esc(fontsHref(P.fonts)) + '">' +
      '<style>' + rootCss + assets.css + '</style>' +
      (live ? '<script type="application/ld+json">' + jsonLd(m, canonical) + '</script>' : '') +
      (live && m.stats.goat ? '<script data-goatcounter="https://' + m.stats.goat + '.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>' : '') +
      (live && m.stats.cf ? '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="' + esc('{"token": "' + m.stats.cf + '"}') + '"></script>' : '') +
      '</head>';

    return head + '<body class="mode-' + T.mode + (m.upper ? ' upper' : '') + ' is-' + mode + '">' + banner + header + '<main>' + hero + perks + catalog + about + gallery + visit + faq + band + '</main>' + footer + fab + cart + preview +
      '<script type="application/json" id="py-data">' + JSON.stringify(runtime).replace(/</g, '\\u003c') + '</script><script>' + assets.js + '</script></body></html>';
  }

  /* ---------- cartel con código QR para imprimir ---------- */
  function renderQr(input, opts) {
    opts = opts || {};
    const m = model(input, opts);
    const url = opts.url || '';
    const T = m.theme;
    return '<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">' +
      '<title>Código QR · ' + esc(m.name) + '</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="' + esc(fontsHref(m.P.fonts)) + '">' +
      '<style>*{box-sizing:border-box}body{margin:0;background:#e9e9ee;font-family:\'' + m.P.fonts.body[0] + '\',system-ui,sans-serif;color:#111;display:grid;place-items:center;min-height:100vh;padding:24px}' +
      '.poster{width:min(100%,560px);aspect-ratio:8.5/11;background:#fff;border-radius:18px;box-shadow:0 20px 60px -20px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center;padding:44px 40px;border-top:16px solid ' + T.primary + '}' +
      '.name{font:' + (m.P.fonts.head[1].split(';').pop()) + ' 2.1rem/1.1 \'' + m.P.fonts.head[0] + '\',sans-serif;margin:0;' + (m.upper ? 'text-transform:uppercase;' : '') + '}' +
      'h1{font-size:1.25rem;font-weight:600;margin:14px 0 0;color:#333}#qr{padding:18px;border:3px solid ' + T.primary + ';border-radius:22px;margin:22px 0}#qr img,#qr canvas{width:260px!important;height:260px!important;display:block}' +
      '.url{font-weight:700;font-size:1rem;word-break:break-all;margin:0}.wa{margin:8px 0 0;color:#444}.tip{margin-top:20px;color:#666;font-size:.9rem;font-family:system-ui,sans-serif}' +
      'button{margin-top:16px;padding:12px 22px;border-radius:999px;border:0;background:#111;color:#fff;font:600 1rem system-ui,sans-serif;cursor:pointer}' +
      '@media (max-width:480px){body{padding:12px}.poster{padding:28px 18px;aspect-ratio:auto;gap:8px}.name{font-size:1.6rem}#qr{padding:12px}#qr img,#qr canvas{width:min(240px,62vw)!important;height:auto!important}}' +
      '@media print{body{background:#fff;padding:0;display:block}.poster{box-shadow:none;border-radius:0;width:100%;height:100vh;aspect-ratio:auto}.no-print{display:none}}@page{size:letter;margin:12mm}</style></head>' +
      '<body><div><main class="poster"><div><p class="name">' + esc(m.name) + '</p><h1>' + esc(m.P.qrText) + '</h1></div><div id="qr" role="img" aria-label="Código QR"></div><div><p class="url">' + esc(url.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</p>' +
      (m.wa ? '<p class="wa">WhatsApp: ' + esc(prettyWa(m.wa)) + '</p>' : '') + '</div></main>' +
      '<div class="no-print" style="text-align:center"><button onclick="print()">Imprimir o guardar como PDF</button><p class="tip">Consejo: imprímelo en tamaño carta y ponlo en tu mostrador, mesas o aparador.</p></div></div>' +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script><script>new QRCode(document.getElementById("qr"),{text:' + JSON.stringify(url).replace(/</g, '\\u003c') + ',width:520,height:520,colorDark:"#111111",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});</script></body></html>';
  }

  /* ---------- enlaces de vista previa ---------- */
  function b64u(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64u(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s), out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  async function encodeData(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (typeof CompressionStream === 'function') {
      try {
        const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
        return 'z' + b64u(new Uint8Array(await new Response(stream).arrayBuffer()));
      } catch (e) { /* sin compresión */ }
    }
    return 'j' + b64u(bytes);
  }
  async function decodeData(s) {
    let bytes = unb64u(s.slice(1));
    if (s[0] === 'z') {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  // Enlace corto: /demo/?t=tipo&n=nombre&w=whatsapp&z=zona&dir=direccion&tel=telefono&c=color
  const PARAMS = { t: 'tipo', n: 'nombre', w: 'whatsapp', z: 'zona', dir: 'direccion', tel: 'telefono', e: 'eslogan' };
  function fromParams(q) {
    const d = {};
    Object.keys(PARAMS).forEach((k) => { const v = q.get(k); if (v) d[PARAMS[k]] = v; });
    const c = q.get('c');
    if (c && /^[0-9a-f]{3,6}$/i.test(c)) d.color = '#' + c;
    return d;
  }
  function toParams(d) {
    const q = [];
    Object.keys(PARAMS).forEach((k) => { if (d[PARAMS[k]]) q.push(k + '=' + encodeURIComponent(d[PARAMS[k]])); });
    if (d.color) q.push('c=' + d.color.replace('#', ''));
    return q.join('&');
  }

  return Object.assign(api, {
    renderSite, renderQr, model, icon, catalogToText, textToCatalog, parseDay, groupHours, rangesText,
    waNumber, waLink, prettyWa, price, money, slugify, fill, esc, encodeData, decodeData, fromParams, toParams, PARAMS
  });
});

Changarro.PRESETS = ChangarroPresets;
Changarro.ASSETS = {"css":":root{--border:color-mix(in srgb,var(--text) 10%,transparent);--border-strong:color-mix(in srgb,var(--text) 18%,transparent);--tint:color-mix(in srgb,var(--primary) 13%,transparent);--shadow:0 1px 2px rgba(0,0,0,.04),0 14px 34px -18px rgba(0,0,0,.22);--shadow-lg:0 34px 70px -34px rgba(0,0,0,.5)}*,*::before,*::after{box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}body{margin:0;background:var(--bg);color:var(--text);font:400 16px/1.6 var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}img{max-width:100%;height:auto;display:block}a{color:var(--primary-text)}h1,h2,h3,h4{font-family:var(--font-head);font-weight:var(--hw);line-height:1.08;margin:0;letter-spacing:-.015em;text-wrap:balance}.upper h1,.upper h2,.upper h3,.upper .ftr-name{text-transform:uppercase;letter-spacing:.01em}p{margin:0}[hidden]{display:none!important}.wrap{width:min(1140px,calc(100% - 32px));margin-inline:auto}.i{width:1.15em;height:1.15em;flex:none}:focus-visible{outline:3px solid var(--primary);outline-offset:2px}section[id],.cat{scroll-margin-top:calc(84px + var(--bar-h,0px))}.btn{--h:46px;display:inline-flex;align-items:center;justify-content:center;gap:.55em;min-height:var(--h);padding:0 1.25em;border-radius:999px;border:1.5px solid transparent;font:600 1rem/1.1 var(--font-body);text-decoration:none;cursor:pointer;transition:transform .15s ease,box-shadow .2s,background-color .2s,filter .2s;text-align:center}.btn:hover{transform:translateY(-1px)}.btn:active{transform:none}.btn-sm{--h:40px;font-size:.92rem;padding:0 1em}.btn-lg{--h:54px;font-size:1.04rem;padding:0 1.5em}.btn-block{display:flex;width:100%}.btn-wa{background:#25d366;color:#052e16;box-shadow:0 10px 26px -12px rgba(37,211,102,.8)}.btn-wa:hover{filter:brightness(1.05)}.btn-primary{background:var(--primary);color:var(--on-primary);box-shadow:0 10px 26px -14px var(--primary)}.btn-outline{background:transparent;color:var(--text);border-color:var(--border-strong)}.btn-outline:hover{border-color:var(--primary)}.btn-glass{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.32);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.btn-glass:hover{background:rgba(255,255,255,.18)}.is-example,.is-demo{--bar-h:46px}.py-bar{background:#1C1826;color:#ECE8F4;font:500 .88rem/1.4 system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;position:sticky;top:0;z-index:31}.py-bar .wrap{display:flex;align-items:center;justify-content:space-between;gap:10px 16px;height:var(--bar-h)}.py-bar p{margin:0;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.py-bar b{color:#fff}.py-bar-actions{display:flex;gap:8px;flex:none}.py-bar a{color:#ececf1;text-decoration:none;padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.22);white-space:nowrap}@media (max-width:600px){.py-bar{font-size:.8rem}.py-bar a{padding:5px 10px}.py-more{display:none}}.py-bar a.py-bar-cta{background:linear-gradient(90deg,#4A63F2,#8A55D8 50%,#D8459F);border-color:transparent;color:#fff;font-weight:700;text-shadow:0 1px 2px rgba(40,20,70,.35)}.hdr{position:sticky;top:var(--bar-h,0px);z-index:30;background:color-mix(in srgb,var(--bg) 86%,transparent);-webkit-backdrop-filter:saturate(1.5) blur(14px);backdrop-filter:saturate(1.5) blur(14px);border-bottom:1px solid var(--border)}.hdr-in{display:flex;align-items:center;gap:14px;min-height:66px}.brand{display:flex;align-items:center;gap:10px;min-width:0;color:var(--text);text-decoration:none;font:var(--hw) 1.12rem/1.1 var(--font-head)}.upper .brand{text-transform:uppercase;letter-spacing:.02em}.brand>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.brand-mark{flex:none;width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:var(--primary);color:var(--on-primary);font-size:1.25rem;line-height:1}.brand-logo{flex:none;width:40px;height:40px;object-fit:contain;border-radius:10px}.nav{margin-left:auto;display:flex;gap:2px}.nav a{padding:8px 12px;border-radius:999px;color:var(--muted);text-decoration:none;font-weight:500;font-size:.95rem;white-space:nowrap}.nav a:hover{color:var(--text);background:var(--tint)}.hdr-in>.btn{margin-left:auto;flex:none}.nav+.btn{margin-left:6px}@media (max-width:860px){.nav{display:none}.nav+.btn{margin-left:auto}}.hero{position:relative;isolation:isolate;overflow:hidden;color:#fff;background:radial-gradient(60% 80% at 100% 0%,color-mix(in srgb,var(--accent) 42%,transparent),transparent 70%),radial-gradient(55% 75% at 0% 100%,color-mix(in srgb,var(--primary) 50%,transparent),transparent 70%),linear-gradient(140deg,var(--hero1),var(--hero2))}.hero::before{content:\"\";position:absolute;inset:0;z-index:-1;background-image:radial-gradient(rgba(255,255,255,.13) 1px,transparent 1.3px);background-size:22px 22px;-webkit-mask-image:linear-gradient(180deg,#000,transparent 85%);mask-image:linear-gradient(180deg,#000,transparent 85%)}.hero.has-cover{background:#111}.hero-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}.hero.has-cover::before{background:linear-gradient(180deg,rgba(0,0,0,.4),rgba(0,0,0,.75));-webkit-mask-image:none;mask-image:none}.hero-in{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:40px;align-items:center;padding:clamp(52px,9vw,112px) 0 clamp(92px,11vw,140px)}@media (max-width:900px){.hero-in{grid-template-columns:minmax(0,1fr);gap:32px}}.status{display:inline-flex;align-items:center;gap:9px;padding:7px 14px 7px 12px;border-radius:999px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.18);font-size:.9rem;font-weight:600;margin-bottom:22px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.status .dot{width:9px;height:9px;border-radius:50%;background:#d4d4d8}.status.is-open .dot{background:#4ade80;box-shadow:0 0 0 4px rgba(74,222,128,.25);animation:pulse 2.2s infinite}.status.is-closed .dot{background:#fb7185}@keyframes pulse{50%{box-shadow:0 0 0 8px rgba(74,222,128,0)}}.hero h1{font-size:clamp(2.5rem,7.4vw,5.1rem);font-weight:var(--hw-strong);max-width:15ch}.lead{margin-top:18px;font-size:clamp(1.05rem,2.2vw,1.28rem);line-height:1.5;color:rgba(255,255,255,.88);max-width:44ch}.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}@media (max-width:520px){.hero-actions .btn{flex:1 1 100%}}.hero-card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-radius:24px;padding:8px 22px 16px;box-shadow:0 30px 60px -30px rgba(0,0,0,.55)}.hc-row{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.14)}.hc-row .i{margin-top:3px;opacity:.85}.hc-row small{display:block;font-size:.74rem;text-transform:uppercase;letter-spacing:.09em;opacity:.7;font-weight:600}.hc-row b{display:block;font-weight:600;line-height:1.35}.hc-row span{display:block;opacity:.75;font-size:.92rem}.hc-link{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;padding:12px;border-radius:14px;background:#fff;color:#111;font-weight:600;text-decoration:none}.hc-link:hover{background:#f3f3f3}.perks{position:relative;z-index:2;margin-top:-58px}.perks-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:14px}.perk{display:flex;gap:16px;align-items:flex-start;padding:22px;background:var(--surface);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow)}.perk-ico{flex:none;width:50px;height:50px;border-radius:14px;display:grid;place-items:center;font-size:1.5rem;background:var(--tint)}.perk h3{font-size:1.1rem;margin-bottom:4px}.perk p{color:var(--muted);font-size:.95rem;line-height:1.5}.sec{padding:clamp(64px,9vw,104px) 0}.sec-alt{background:var(--surface-2)}.sec-head{max-width:680px;margin-bottom:34px}.eyebrow{display:inline-flex;align-items:center;gap:10px;font:700 .78rem/1 var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:var(--primary-text);margin-bottom:14px}.eyebrow::before{content:\"\";width:22px;height:2px;background:currentColor;border-radius:2px}.sec-head h2,.about h2{font-size:clamp(2rem,4.8vw,3rem)}.sec-head>p:not(.eyebrow):not(.note){margin-top:14px;color:var(--muted);font-size:1.06rem}.note{display:inline-block;margin-top:16px;padding:7px 13px;border-radius:10px;background:var(--tint);font-size:.88rem}.chips{position:sticky;top:calc(66px + var(--bar-h,0px));z-index:10;display:flex;gap:8px;overflow-x:auto;padding:12px 0;margin-bottom:6px;background:var(--bg);scrollbar-width:none}.chips::-webkit-scrollbar{display:none}.chip{flex:none;padding:9px 16px;border-radius:999px;border:1px solid var(--border-strong);background:var(--surface);color:var(--text);text-decoration:none;font-weight:600;font-size:.92rem}.chip:hover{border-color:var(--primary);color:var(--primary-text)}.cat+.cat{margin-top:40px}.cat-title{display:flex;align-items:center;gap:14px;font-size:1.55rem;margin:10px 0 18px}.cat-title::after{content:\"\";flex:1;height:1px;background:var(--border-strong)}.items{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:14px}.item{display:flex;gap:14px;padding:18px;background:var(--surface);border:1px solid var(--border);border-radius:18px;transition:border-color .2s,box-shadow .2s}.item:hover{border-color:color-mix(in srgb,var(--primary) 45%,var(--border));box-shadow:var(--shadow)}.item>img{width:88px;height:88px;border-radius:14px;object-fit:cover;flex:none}.item-body{flex:1;min-width:0;display:flex;flex-direction:column}.item-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.item h4{font:600 1.05rem/1.3 var(--font-body);letter-spacing:0}.price{font-weight:700;color:var(--primary-text);white-space:nowrap;font-variant-numeric:tabular-nums}.item p{color:var(--muted);font-size:.93rem;line-height:1.45;margin-top:4px}.item-act{margin-top:auto;padding-top:12px}.add{position:relative;display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 14px;border-radius:999px;border:1.5px solid var(--primary);background:transparent;color:var(--primary-text);font:600 .9rem/1 var(--font-body);cursor:pointer;text-decoration:none;transition:background-color .15s,color .15s}.add:hover,.add.in{background:var(--primary);color:var(--on-primary)}.add .i{width:1em;height:1em}.add .badge{display:grid;place-items:center;min-width:22px;height:22px;padding:0 6px;margin-right:-8px;border-radius:999px;background:var(--on-primary);color:var(--primary);font-size:.78rem}.add.pop{animation:pop .35s ease}@keyframes pop{40%{transform:scale(1.1)}}.about{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(28px,5vw,64px);align-items:center}@media (max-width:860px){.about{grid-template-columns:minmax(0,1fr)}}.about-copy p:not(.eyebrow){margin-top:16px;color:var(--muted);font-size:1.06rem}.about-copy .cred{color:var(--text);font-weight:600;font-size:.95rem}.socials{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.socials a{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;border:1px solid var(--border-strong);color:var(--text);text-decoration:none;font-weight:600;font-size:.92rem}.socials a:hover{border-color:var(--primary)}.about-art{position:relative;min-height:320px;border-radius:28px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;padding:30px;color:#fff;background:radial-gradient(70% 60% at 85% 15%,color-mix(in srgb,var(--accent) 55%,transparent),transparent 70%),linear-gradient(150deg,var(--hero2),var(--hero1));box-shadow:var(--shadow-lg)}.about-art .emo{position:absolute;top:22px;right:26px;font-size:clamp(4rem,10vw,6.5rem);line-height:1;transform:rotate(-8deg);filter:drop-shadow(0 12px 22px rgba(0,0,0,.3))}.about-art p{font:var(--hw) clamp(1.35rem,2.8vw,1.85rem)/1.2 var(--font-head);max-width:20ch}.upper .about-art p{text-transform:uppercase}.about-art small{opacity:.75;font-size:.9rem}.about-img{width:100%;aspect-ratio:4/3.4;object-fit:cover;border-radius:28px;box-shadow:var(--shadow-lg)}.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:12px}.gallery img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:16px}.visit{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:20px}@media (max-width:860px){.visit{grid-template-columns:minmax(0,1fr)}}.card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:clamp(22px,3.5vw,32px);box-shadow:var(--shadow)}.card h3{display:flex;align-items:center;gap:10px;font:700 1.05rem/1.2 var(--font-body);letter-spacing:0;text-transform:none;margin:0 0 10px}.card h3:not(:first-child){margin-top:26px}.card h3 .i{color:var(--primary-text)}.hours{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}.hours th,.hours td{padding:10px 0;border-bottom:1px dashed var(--border-strong);text-align:left;font-weight:500;vertical-align:top}.hours td{text-align:right;color:var(--muted);padding-left:12px}.hours tr.today th,.hours tr.today td{color:var(--primary-text);font-weight:700}.hours tr.today th::after{content:\"Hoy\";display:inline-block;margin-left:8px;padding:1px 8px;border-radius:999px;background:var(--primary);color:var(--on-primary);font-size:.72rem;vertical-align:2px}.addr{color:var(--muted)}.contact{display:flex;flex-direction:column;gap:6px;margin-top:18px}.contact a{display:inline-flex;align-items:center;gap:8px;color:var(--text);text-decoration:none;font-weight:600}.contact a .i{color:var(--primary-text)}.visit-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.map-wrap{border-radius:24px;overflow:hidden;min-height:360px;border:1px solid var(--border);background:var(--surface-2)}.map{display:block;width:100%;height:100%;min-height:360px;border:0}.mode-dark .map{filter:invert(.9) hue-rotate(180deg) saturate(.6)}.faq-wrap{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(20px,5vw,64px);align-items:start}@media (max-width:860px){.faq-wrap{grid-template-columns:minmax(0,1fr)}}.faq details{background:var(--surface);border:1px solid var(--border);border-radius:18px;margin-bottom:10px}.faq summary{list-style:none;cursor:pointer;padding:18px 58px 18px 22px;font-weight:600;position:relative}.faq summary::-webkit-details-marker{display:none}.faq summary::after{content:\"+\";position:absolute;right:18px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--tint);color:var(--primary-text);font-size:1.2rem;line-height:1}.faq details[open] summary::after{content:\"−\"}.faq details>div{padding:0 22px 18px;color:var(--muted)}.faq details>div p+p{margin-top:8px}.cta-band{padding:clamp(56px,8vw,96px) 0}.cta-in{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;padding:clamp(28px,5vw,52px);border-radius:28px;color:#fff;background:radial-gradient(60% 120% at 100% 0%,color-mix(in srgb,var(--accent) 45%,transparent),transparent 70%),linear-gradient(135deg,var(--hero1),var(--hero2));box-shadow:var(--shadow-lg)}.cta-in h2{font-size:clamp(1.8rem,4vw,2.6rem)}.cta-in p{margin-top:8px;opacity:.85;font-size:1.06rem}.ftr{background:var(--hero1);color:rgba(255,255,255,.85);padding:48px 0 calc(28px + env(safe-area-inset-bottom))}.ftr-in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:24px}.ftr-name{font:var(--hw) 1.35rem/1.2 var(--font-head);color:#fff;margin-bottom:6px}.ftr-in p:not(.ftr-name){opacity:.8}.ftr-links{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start}.ftr-links a{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.2);color:inherit;text-decoration:none;font-size:.92rem}.ftr-links a:hover{background:rgba(255,255,255,.08)}.ftr-data{list-style:none;margin:0;padding:0;display:grid;gap:4px;opacity:.85;font-size:.94rem}.ftr-data a{color:inherit}.ftr-legal{display:grid;gap:8px;margin-top:28px}.legal{border:1px solid rgba(255,255,255,.14);border-radius:14px;background:rgba(255,255,255,.04)}.legal summary{cursor:pointer;padding:12px 16px;font-weight:600;font-size:.92rem}.legal summary small{opacity:.7;font-weight:400}.legal-in{padding:0 16px 14px;font-size:.88rem;line-height:1.55;opacity:.9}.legal-in h4{font:700 .9rem/1.3 var(--font-body);margin:14px 0 4px;color:#fff}.legal-in p{opacity:.85}.price-note{margin-top:22px;font-size:.88rem;color:var(--muted)}.ftr-bottom{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,.12);font-size:.85rem;opacity:.75}.ftr-bottom a{color:inherit}.fab{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:40;width:60px;height:60px;border-radius:50%;display:grid;place-items:center;background:#25d366;color:#fff;box-shadow:0 12px 30px -8px rgba(0,0,0,.45);transition:transform .2s}.fab:hover{transform:scale(1.06)}.fab .i{width:30px;height:30px}body.has-cart{padding-bottom:92px}.cartbar{position:fixed;left:0;right:0;bottom:0;z-index:45;padding:12px 16px calc(12px + env(safe-area-inset-bottom));pointer-events:none}.cartbar-btn{pointer-events:auto;display:flex;align-items:center;gap:12px;width:min(560px,100%);margin:0 auto;padding:12px 12px 12px 18px;border:0;border-radius:18px;background:var(--text);color:var(--bg);font:600 1rem/1.2 var(--font-body);cursor:pointer;box-shadow:0 18px 40px -12px rgba(0,0,0,.55);animation:up .3s ease;text-align:left}.cartbar-total{margin-left:auto;font-variant-numeric:tabular-nums}.cartbar-go{padding:9px 14px;border-radius:12px;background:#25d366;color:#052e16;font-weight:700;white-space:nowrap}@keyframes up{from{transform:translateY(18px);opacity:0}}.sheet{padding:0;border:0;background:transparent;max-width:none;max-height:none;width:100%;height:100%;margin:0;color:var(--text)}.sheet::backdrop{background:rgba(8,8,10,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}.sheet[open]{display:flex;align-items:flex-end;justify-content:center}.sheet-in{width:min(520px,100%);max-height:92vh;max-height:92dvh;overflow:auto;background:var(--surface);border-radius:24px 24px 0 0;padding:20px 20px calc(20px + env(safe-area-inset-bottom));animation:up .25s ease}@media (min-width:640px){.sheet[open]{align-items:center}.sheet-in{border-radius:24px}}.sheet-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}.sheet-head h2{font-size:1.4rem}.x{flex:none;width:40px;height:40px;border-radius:50%;border:0;background:var(--tint);color:var(--text);display:grid;place-items:center;cursor:pointer}.lines{list-style:none;margin:0;padding:0}.line{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}.line-info{flex:1;min-width:0}.line-info b{display:block;font-weight:600}.line-info small{color:var(--muted);font-size:.88rem}.qty{display:flex;align-items:center;gap:4px;background:var(--tint);border-radius:999px;padding:3px}.qty button{width:32px;height:32px;border-radius:50%;border:0;background:var(--surface);color:var(--text);font-size:1.1rem;line-height:1;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.12)}.qty span{min-width:22px;text-align:center;font-weight:700}.sum{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0 18px;font-size:1.05rem}.sum b{font-size:1.3rem;font-variant-numeric:tabular-nums}.order-form{display:grid;gap:12px}.fld{display:grid;gap:6px;font-weight:600;font-size:.92rem}.fld small{font-weight:400;color:var(--muted)}.fld input,.fld textarea{width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid var(--border-strong);background:var(--bg);color:var(--text);font:400 1rem/1.4 var(--font-body)}.fld input:focus,.fld textarea:focus{outline:none;border-color:var(--primary)}.seg{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px;border-radius:14px;background:var(--tint)}.seg label{position:relative}.seg input{position:absolute;opacity:0;pointer-events:none}.seg span{display:block;text-align:center;padding:10px;border-radius:10px;font-weight:600;cursor:pointer;color:var(--muted)}.seg input:checked+span{background:var(--surface);color:var(--text);box-shadow:0 1px 3px rgba(0,0,0,.15)}.seg input:focus-visible+span{outline:2px solid var(--primary)}.fine{font-size:.84rem;color:var(--muted);text-align:center;margin:10px 0}.link-btn{justify-self:center;background:none;border:0;color:var(--muted);text-decoration:underline;cursor:pointer;font:inherit;font-size:.85rem}.wa-chat{background:#efeae2;padding:18px 14px;border-radius:16px;margin:8px 0 4px}.wa-bubble{background:#d9fdd3;color:#111b21;padding:10px 12px;border-radius:12px 12px 2px 12px;white-space:pre-wrap;font:400 .94rem/1.45 system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;margin-left:auto;max-width:92%;width:fit-content;box-shadow:0 1px 1px rgba(0,0,0,.12)}@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}","js":"/* 185ChangarroWeb · interactividad de las páginas de negocio (sin dependencias) */\n(function () {\n  'use strict';\n  var dataEl = document.getElementById('py-data');\n  if (!dataEl) return;\n  var D;\n  try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }\n\n  var $ = function (s, r) { return (r || document).querySelector(s); };\n  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };\n  var JS_DAYS = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];\n  var NAMES = { lun: 'lunes', mar: 'martes', mie: 'miércoles', jue: 'jueves', vie: 'viernes', sab: 'sábado', dom: 'domingo' };\n  var H = D.hours || {};\n\n  function wa(num, msg) { return 'https://wa.me/' + (num || '') + (msg ? '?text=' + encodeURIComponent(msg) : ''); }\n  function money(n) { return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }\n  function pad(n) { return (n < 10 ? '0' : '') + n; }\n  function clock(min) {\n    min = ((min % 1440) + 1440) % 1440;\n    var h = Math.floor(min / 60), m = pad(min % 60);\n    if (D.h24) return h + ':' + m;\n    return (h % 12 || 12) + ':' + m + ' ' + (h < 12 ? 'am' : 'pm');\n  }\n  function at(min) { var t = clock(min); return (/^1:/.test(t) ? 'a la ' : 'a las ') + t; }\n  function rangesText(r) {\n    if (!r || !r.length) return 'Cerrado';\n    if (r.length === 1 && r[0][0] === 0 && r[0][1] === 1440) return 'Abierto 24 horas';\n    return r.map(function (x) { return clock(x[0]) + ' – ' + clock(x[1]); }).join(' y ');\n  }\n  function go(url) {\n    var a = document.createElement('a');\n    a.href = url; a.target = '_blank'; a.rel = 'noopener';\n    document.body.appendChild(a); a.click(); a.remove();\n  }\n\n  /* ----- abierto / cerrado (en la zona horaria del negocio) ----- */\n  function now() {\n    try {\n      var p = {};\n      new Intl.DateTimeFormat('en-US', { timeZone: D.tz || 'America/Mexico_City', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })\n        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });\n      return { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), m: (+p.hour % 24) * 60 + (+p.minute) };\n    } catch (e) {\n      var t = new Date();\n      return { d: t.getDay(), m: t.getHours() * 60 + t.getMinutes() };\n    }\n  }\n  function status(n) {\n    var today = JS_DAYS[n.d], yest = JS_DAYS[(n.d + 6) % 7], i, r;\n    r = H[yest] || [];\n    for (i = 0; i < r.length; i++) if (r[i][1] > 1440 && n.m < r[i][1] - 1440) return { open: true, until: r[i][1] };\n    r = H[today] || [];\n    for (i = 0; i < r.length; i++) if (n.m >= r[i][0] && n.m < r[i][1]) return { open: true, until: r[i][1], all: r[i][0] === 0 && r[i][1] === 1440 };\n    for (i = 0; i < r.length; i++) if (r[i][0] > n.m) return { open: false, next: 'hoy ' + at(r[i][0]) };\n    for (var k = 1; k <= 7; k++) {\n      var dk = JS_DAYS[(n.d + k) % 7], rr = H[dk] || [];\n      if (rr.length) return { open: false, next: (k === 1 ? 'mañana ' : 'el ' + NAMES[dk] + ' ') + at(rr[0][0]) };\n    }\n    return null;\n  }\n  var n0 = now(), tk = JS_DAYS[n0.d], st = status(n0), stEl = $('[data-status]');\n  if (stEl && st) {\n    stEl.classList.add(st.open ? 'is-open' : 'is-closed');\n    $('[data-status-text]', stEl).textContent = st.open\n      ? (st.all ? 'Abierto las 24 horas' : 'Abierto ahora · cierra ' + at(st.until))\n      : 'Cerrado · abre ' + st.next;\n    stEl.hidden = false;\n  }\n  var todayEl = $('[data-today]');\n  if (todayEl) todayEl.textContent = rangesText(H[tk]);\n  $$('[data-days]').forEach(function (tr) {\n    if (tr.getAttribute('data-days').split(',').indexOf(tk) > -1) tr.classList.add('today');\n  });\n\n  /* ----- abierta desde archivos (doble clic): las carpetas no abren su index.html solas ----- */\n  var FILE = location.protocol === 'file:';\n  function page(p) { return FILE && /\\/$/.test(p) ? p + 'index.html' : p; }\n  if (FILE) {\n    $$('a[href]').forEach(function (a) {\n      var v = a.getAttribute('href'), m = v.match(/^([^?#]*)(.*)$/);\n      if (/^[a-z]+:|^#|^\\/\\//i.test(v)) return;\n      if (m[1] === '' || /\\/$/.test(m[1])) a.setAttribute('href', (m[1] || './') + 'index.html' + m[2]);\n    });\n  }\n\n  /* ----- barra de vista previa ----- */\n  if (D.mode === 'demo') {\n    var pub = $('[data-py-publish]');\n    if (pub) pub.href = wa(D.agencyWa, 'Hola 👋 Quiero publicar mi página «' + D.name + '».\\n\\nVista previa: ' + location.href);\n    var ed = $('[data-py-edit]');\n    if (ed) ed.href = page((D.home || '/') + 'crear/') + location.search + location.hash;\n  }\n\n  /* ----- aviso de privacidad y términos (al pie) ----- */\n  function openLegal(id) {\n    var d = document.getElementById(id);\n    if (!d || d.tagName !== 'DETAILS') return false;\n    d.open = true;\n    d.scrollIntoView({ behavior: 'smooth', block: 'start' });\n    return true;\n  }\n  document.addEventListener('click', function (e) {\n    var l = e.target.closest && e.target.closest('[data-legal]');\n    if (!l) return;\n    var id = (l.getAttribute('href') || '').slice(1);\n    $$('dialog').forEach(function (d) { if (d.open && typeof d.close === 'function') d.close(); });\n    if (openLegal(id)) e.preventDefault();\n  });\n  if (/^#(aviso-privacidad|terminos)$/.test(location.hash)) openLegal(location.hash.slice(1));\n  if (D.mode === 'example' && window.self !== window.top) {\n    var bar0 = $('.py-bar');\n    if (bar0) bar0.hidden = true;\n  }\n\n  /* ----- diálogos ----- */\n  function openDlg(d) { if (!d) return; if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', ''); }\n  function closeDlg(d) { if (!d) return; if (typeof d.close === 'function') { if (d.open) d.close(); } else d.removeAttribute('open'); }\n  $$('dialog').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) closeDlg(d); }); });\n  document.addEventListener('click', function (e) {\n    var c = e.target.closest && e.target.closest('[data-close]');\n    if (c) closeDlg(c.closest('dialog'));\n  });\n\n  function showPreview(msg) {\n    var pv = $('#py-preview');\n    if (!pv) return go(wa(D.wa, msg));\n    var safe = msg.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });\n    $('[data-msg]', pv).innerHTML = safe.replace(/\\*([^*\\n]+)\\*/g, '<b>$1</b>');\n    var o = $('[data-msg-open]', pv);\n    if (o) o.href = wa(D.wa, msg);\n    openDlg(pv);\n  }\n  function send(msg) {\n    if (D.mode !== 'live') return showPreview(msg);\n    track('pedido-whatsapp', 'Pedido enviado por WhatsApp');\n    go(wa(D.wa, msg));\n  }\n\n  /* ----- estadísticas sin cookies (si el negocio las activó): clics a WhatsApp ----- */\n  function track(path, title) {\n    if (D.goat && window.goatcounter && typeof window.goatcounter.count === 'function') window.goatcounter.count({ path: path, title: title, event: true });\n  }\n  document.addEventListener('click', function (e) {\n    var a = e.target.closest && e.target.closest('a[href^=\"https://wa.me/\"]');\n    if (a) track('clic-whatsapp', 'Clic a WhatsApp');\n  });\n\n  /* ----- pedido por WhatsApp ----- */\n  if (!D.orders) return;\n  var ITEMS = {};\n  (D.items || []).forEach(function (it) { ITEMS[it.id] = it; });\n  var KEY = 'py-cart:' + (D.slug || location.pathname);\n  var cart = {};\n  try { cart = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { cart = {}; }\n  Object.keys(cart).forEach(function (k) { if (!ITEMS[k] || !(cart[k] > 0)) delete cart[k]; });\n\n  var bar = $('[data-cartbar]'), dlg = $('#py-cart'), form = $('[data-order-form]'), fab = $('[data-fab]');\n\n  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* modo privado */ } }\n  function totals() {\n    var c = 0, t = 0, unpriced = 0;\n    Object.keys(cart).forEach(function (k) {\n      var q = cart[k], it = ITEMS[k];\n      c += q;\n      if (typeof it.price === 'number') t += q * it.price; else unpriced += q;\n    });\n    return { count: c, total: t, unpriced: unpriced };\n  }\n  function totalText(s) { return s.unpriced && !s.total ? 'Por cotizar' : money(s.total) + (s.unpriced ? ' + por cotizar' : ''); }\n\n  function draw() {\n    var s = totals();\n    if (bar) bar.hidden = !s.count;\n    if (fab) fab.hidden = !!s.count;\n    document.body.classList.toggle('has-cart', !!s.count);\n    $$('[data-count]').forEach(function (e) { e.textContent = s.count; });\n    $$('[data-count-label]').forEach(function (e) { e.textContent = s.count === 1 ? 'producto' : 'productos'; });\n    $$('[data-total]').forEach(function (e) { e.textContent = totalText(s); });\n    var ul = $('[data-lines]', dlg);\n    if (ul) {\n      ul.innerHTML = '';\n      Object.keys(cart).forEach(function (k) {\n        var it = ITEMS[k], li = document.createElement('li');\n        li.className = 'line';\n        li.innerHTML = '<div class=\"line-info\"><b></b><small></small></div><div class=\"qty\"><button type=\"button\" aria-label=\"Quitar uno\">−</button><span></span><button type=\"button\" aria-label=\"Agregar uno\">+</button></div>';\n        li.querySelector('b').textContent = it.name;\n        li.querySelector('small').textContent = typeof it.price === 'number' ? cart[k] + ' × ' + money(it.price) + ' = ' + money(it.price * cart[k]) : (it.label || 'Por cotizar');\n        li.querySelector('.qty span').textContent = cart[k];\n        var b = li.querySelectorAll('button');\n        b[0].onclick = function () { set(k, cart[k] - 1); };\n        b[1].onclick = function () { set(k, cart[k] + 1); };\n        ul.appendChild(li);\n      });\n    }\n    if (!s.count) closeDlg(dlg);\n    $$('[data-add]').forEach(function (btn) {\n      var q = cart[btn.getAttribute('data-add')], badge = $('.badge', btn);\n      btn.classList.toggle('in', !!q);\n      if (badge) { badge.hidden = !q; badge.textContent = q || ''; }\n    });\n  }\n  function set(k, q) {\n    if (q <= 0) delete cart[k]; else cart[k] = Math.min(q, 99);\n    save(); draw();\n  }\n\n  document.addEventListener('click', function (e) {\n    if (!e.target.closest) return;\n    var b = e.target.closest('[data-add]');\n    if (b) {\n      var k = b.getAttribute('data-add');\n      if (ITEMS[k]) {\n        set(k, (cart[k] || 0) + 1);\n        b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');\n      }\n      return;\n    }\n    if (e.target.closest('[data-open-cart]')) openDlg(dlg);\n    if (e.target.closest('[data-clear]')) { cart = {}; save(); draw(); }\n  });\n\n  function compose() {\n    var s = totals(), L = ['¡Hola! 👋 Quiero hacer un pedido:', ''];\n    Object.keys(cart).forEach(function (k) {\n      var it = ITEMS[k], q = cart[k];\n      L.push('• ' + q + ' × ' + it.name + (typeof it.price === 'number' ? ' — ' + money(it.price * q) : (it.label ? ' — ' + it.label : '')));\n    });\n    L.push('', '*Total: ' + totalText(s) + '*');\n    var f = form.elements, extra = [];\n    if (f.nombre && f.nombre.value.trim()) extra.push('Nombre: ' + f.nombre.value.trim());\n    if (f.modo) {\n      var dom = f.modo.value === 'domicilio';\n      extra.push('Entrega: ' + (dom ? 'A domicilio' : 'Paso a recoger'));\n      if (dom && f.direccion.value.trim()) extra.push('Dirección: ' + f.direccion.value.trim());\n    }\n    if (f.notas && f.notas.value.trim()) extra.push('Notas: ' + f.notas.value.trim());\n    if (extra.length) L.push('', extra.join('\\n'));\n    return L.join('\\n');\n  }\n\n  if (form) {\n    form.addEventListener('change', function () {\n      var dom = form.elements.modo && form.elements.modo.value === 'domicilio', a = $('[data-addr]', form);\n      if (a) { a.hidden = !dom; a.querySelector('textarea').required = dom; }\n    });\n    form.addEventListener('submit', function (e) {\n      e.preventDefault();\n      if (!totals().count) return;\n      var msg = compose();\n      closeDlg(dlg);\n      send(msg);\n    });\n  }\n  draw();\n})();\n"};
Changarro.AGENCY = {"brand":"185ChangarroWeb","url":"https://one85changarroweb.onrender.com","wa":"523151260581"};