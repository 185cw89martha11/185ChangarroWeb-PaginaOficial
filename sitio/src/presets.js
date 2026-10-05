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
