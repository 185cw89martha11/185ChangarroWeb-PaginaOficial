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
*/
window.MUESTRA_DATOS = {
  negocioEjemplo: 'Negocio de prueba',

  FUNCIONES: [
    { id: 'productos', plan: 'esencial', nombre: 'Servicios y precios', descripcion: 'Lista de lo que vende, con precio.', activa: true },
    { id: 'whatsapp', plan: 'esencial', nombre: 'Botón de WhatsApp', descripcion: 'Botón fijo que abre el chat con un mensaje ya escrito.', activa: true },
    { id: 'horario', plan: 'esencial', nombre: 'Horarios', descripcion: 'Días y horas en que abre.', activa: true },
    { id: 'abierto', plan: 'esencial', nombre: 'Aviso de "abierto ahora"', descripcion: 'Se calcula solo con el horario.', activa: true },
    { id: 'ubicacion', plan: 'esencial', nombre: 'Mapa y dirección', descripcion: 'Dirección, mapa y botón para llegar.', activa: true },
    { id: 'redes', plan: 'esencial', nombre: 'Enlaces a redes sociales', descripcion: 'Facebook, Instagram, TikTok.', activa: true },
    { id: 'qr', plan: 'esencial', nombre: 'QR para imprimir', descripcion: 'Para el mostrador, volantes o tarjetas.', activa: true },
    { id: 'agenda', plan: 'esencial', nombre: 'Agenda de citas o reservas', descripcion: 'El cliente elige día y hora.', activa: true },
    { id: 'galeria', plan: 'esencial', nombre: 'Galería de fotos', descripcion: 'Fotos del lugar y del trabajo.', activa: true },
    { id: 'eventos', plan: 'esencial', nombre: 'Eventos y promociones', descripcion: 'Ofertas y fechas especiales.', activa: true },
    { id: 'dominio', plan: 'esencial', nombre: 'Dominio propio', descripcion: 'La dirección .com.mx a nombre del negocio.', activa: true, servicio: true },
    { id: 'privacidad', plan: 'esencial', nombre: 'Aviso de privacidad', descripcion: 'Siempre va. Es obligatorio si la página pide datos.', activa: true, fija: true },
    { id: 'contacto', plan: 'esencial', nombre: 'Datos del negocio en el pie', descripcion: 'Dirección, teléfono y correo. La ley pide que quien vende diga quién es y cómo contactarlo.', activa: true, fija: true },
    { id: 'terminos', plan: 'esencial', nombre: 'Términos y Condiciones', descripcion: 'Opcional, salvo que la página reciba pedidos o pagos: ahí son obligatorios.', activa: false, opcional: true, obligatoriaCon: ['pedidos'] },

    { id: 'faq', plan: 'negocio', nombre: 'Preguntas frecuentes', descripcion: 'Respuestas a lo que más preguntan.', activa: false },
    { id: 'resenas', plan: 'negocio', nombre: 'Reseñas', descripcion: 'Opiniones de clientes.', activa: true },
    { id: 'google', plan: 'negocio', nombre: 'Ficha de Google Maps', descripcion: 'Alta y arreglo de la ficha, con QR para pedir reseñas.', activa: false },
    { id: 'asistente', plan: 'negocio', nombre: 'Asistente en la página', descripcion: 'Contesta con los datos del negocio.', activa: false },
    { id: 'correo', plan: 'negocio', nombre: 'Correo profesional', descripcion: 'contacto@su-dominio. Con costo extra en Negocio, incluido en Pro.', activa: false, presetDesde: 'pro', nota: 'con costo extra en el plan Negocio; incluido en Negocio + Asistente Pro' },

    { id: 'pedidos', plan: 'pro', nombre: 'Pedidos con anticipo', descripcion: 'Con liga de pago externa.', activa: false },
    { id: 'recordatorios', plan: 'pro', nombre: 'Recordatorios de citas por correo', descripcion: 'Se ve en la agenda.', activa: false },
    { id: 'sucursales', plan: 'pro', nombre: 'Varias sucursales', descripcion: 'Todas en la misma página.', activa: false },
    { id: 'wabusiness', plan: 'pro', nombre: 'WhatsApp Business configurado', descripcion: 'Bienvenida, ausencia, respuestas rápidas y catálogo.', activa: false, servicio: true },
    { id: 'reporte', plan: 'pro', nombre: 'Reporte mensual', descripcion: 'Visitas, clics, citas y pedidos.', activa: false, servicio: true },
    { id: 'disenos', plan: 'pro', nombre: '2 diseños de promoción al mes', descripcion: 'Para WhatsApp y redes.', activa: false, servicio: true },
    { id: 'respuestas', plan: 'pro', nombre: 'Respuestas a reseñas de Google', descripcion: 'Se las redactamos.', activa: false, servicio: true }
  ],

  NEGOCIO: {
    titular: 'Nombre del dueño o razón social',
    telefono: '000 000 0000',
    correoDatos: 'correo@ejemplo.com',
    lema: 'Tu lugar de confianza en la colonia.',
    mensajeWhatsapp: 'Hola, vi su página y quiero información.',
    productos: [
      { nombre: 'Producto uno', precio: 50 },
      { nombre: 'Producto dos', precio: 85 },
      { nombre: 'Servicio tres', precio: 120 },
      { nombre: 'Servicio cuatro', precio: 200 }
    ],
    leyendaPrecios: 'Precios en pesos mexicanos, con IVA incluido.',
    horario: [
      { dias: 'Lunes a viernes', d: [1, 2, 3, 4, 5], abre: '09:00', cierra: '19:00' },
      { dias: 'Sábado', d: [6], abre: '09:00', cierra: '14:00' },
      { dias: 'Domingo', d: [0] }
    ],
    horasAgenda: ['10:00', '11:30', '13:00', '16:00', '17:30'],
    direccion: 'Calle Ejemplo 123, Col. Centro',
    sucursales: [
      { nombre: 'Centro', direccion: 'Calle Ejemplo 123, Col. Centro' },
      { nombre: 'Norte', direccion: 'Av. Muestra 456, Col. Las Flores' }
    ],
    redes: ['Facebook', 'Instagram', 'TikTok'],
    galeria: 6,
    resenas: [
      { autor: 'Laura M.', estrellas: 5, texto: 'Muy buena atención y todo a tiempo.' },
      { autor: 'Jorge R.', estrellas: 5, texto: 'Precios justos. Ya vine tres veces.' },
      { autor: 'Ana P.', estrellas: 4, texto: 'Me gustó mucho, volveré pronto.' }
    ],
    eventos: [
      { fecha: 'Todos los martes', titulo: '2×1 en producto uno', texto: 'Llevas dos y pagas uno.', vigencia: 'Del 1 al 31 de octubre', condiciones: 'Solo en sucursal. Hasta agotar existencias.' },
      { fecha: '15 de cada mes', titulo: 'Día del cliente', texto: '10% de descuento en todo.', vigencia: 'Hasta el 31 de diciembre', condiciones: 'No se junta con otras promociones.' }
    ],
    faq: [
      { p: '¿Aceptan tarjeta?', r: 'Sí, aceptamos tarjeta de débito y crédito.' },
      { p: '¿Tienen estacionamiento?', r: 'Sí, frente al local.' },
      { p: '¿Hacen entregas a domicilio?', r: 'Sí, en la colonia y alrededores.' }
    ],
    anticipo: 100,
    terminos: {
      pagos: 'Efectivo, transferencia y tarjeta. Los pagos en línea se hacen en la página del proveedor de pagos; el negocio no ve ni guarda los datos de tu tarjeta.',
      anticipo: 'El anticipo aparta tu pedido y se descuenta del total.',
      cancelacion: 'Puedes cancelar sin costo hasta 24 horas antes de la entrega y te devolvemos el anticipo completo. Después de ese plazo, el anticipo cubre lo que ya se preparó.',
      devoluciones: 'Si tu pedido llega incompleto o con algún defecto, avísanos el mismo día por WhatsApp y lo cambiamos o te devolvemos tu dinero.'
    }
  }
};
