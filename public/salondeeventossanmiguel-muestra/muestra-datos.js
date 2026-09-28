/*
  Muestra de Salón de Eventos San Miguel (Zapopan). muestra.js solo pinta lo que hay aquí.
  Esta muestra no lleva planes ni precios: solo las opciones que se ven en la página final.

  FUNCIONES: lo que se ve en la página final. Los servicios que se hacen por fuera y lo que va siempre por ley (aviso de privacidad, datos del pie) no salen en el panel.
  - id: clave sin acentos. Va en el mensaje para Claude Code y muestra.js la usa para pintar su parte.
  - nombre, descripcion: lo que se lee en el panel.
  - activa: si empieza prendida.
  - obligatoriaCon: ids que la prenden y no la dejan apagar (los Términos, si la página recibe anticipos).
  - nota: aclaración que se agrega al mensaje.

  NEGOCIO: contenido de la página.
  - titular: nombre del dueño o razón social. Es el responsable en el aviso de privacidad del negocio.
  - direccion, telefono, correoDatos: van siempre en el pie (Ley Federal de Protección al Consumidor art. 76 bis).
    porConfirmar: la dirección y el teléfono salieron de su página de Facebook y el negocio no los ha confirmado.
  - fotos: la primera es la foto principal. Al tocar una se abre en grande con su descripción.
    aviso: sale encima de la foto cuando se difuminó algo. Las caras de los invitados se difuminan en el archivo
    (no con CSS), para que la foto original con rostros reconocibles nunca llegue al navegador.
  - incluye: las 3 tarjetas de "¿Qué incluye?" (capacidad, qué incluye y amenidades).
  - recorridos: días (0 = domingo … 6 = sábado) y horas en que se puede agendar un recorrido por el salón.
    Las horas y fechas ocupadas de la muestra son inventadas (horaOcupada y fechaReservada en muestra.js).
  - mesesCalendario: cuántos meses hacia adelante se pueden ver en el calendario de fechas.
*/
window.MUESTRA_DATOS = {
  negocioEjemplo: 'Salón de Eventos San Miguel',
  // WhatsApp de 185ChangarroWeb (el mismo de la portada): ahí llega la petición del botón "Generar petición"
  WHATSAPP_185: '523151260581',

  FUNCIONES: [
    { id: 'galeria', nombre: 'Galería de fotos', descripcion: 'Foto principal y miniaturas; al tocarlas se abren en grande con su descripción.', activa: true },
    { id: 'ubicacion', nombre: 'Mapa y dirección', descripcion: 'Dirección, mapa y botón para llegar. El botón "¿Dónde estamos?" de arriba baja hasta aquí.', activa: true },
    { id: 'incluye', nombre: 'Qué incluye', descripcion: 'Capacidad, lo que incluye la renta y las amenidades del salón.', activa: true },
    { id: 'tipos', nombre: 'Tipos de evento', descripcion: 'Bodas, XV años, bautizos, cumpleaños y empresas. Al tocar uno se llena solo en el recorrido. También ayuda a salir en Google ("salón para XV años en Zapopan").', activa: true },
    { id: 'paquetes', nombre: 'Paquetes y cotización', descripcion: 'Paquetes del salón con botón para pedir cotización por WhatsApp, con la fecha, el evento y los invitados que ya eligió.', activa: true },
    { id: 'contactar', nombre: 'Maneras de comunicarte', descripcion: 'WhatsApp con mensaje listo, llamada y Facebook.', activa: true },
    { id: 'whatsapp', nombre: 'Botón fijo de WhatsApp', descripcion: 'Se queda abajo a la derecha al bajar por la página.', activa: true },
    { id: 'fechas', nombre: 'Calendario de fechas', descripcion: 'Calendario por mes con las fechas libres y las ya reservadas; el cliente elige la suya y pregunta por WhatsApp. El salón tendrá que marcar desde un panel de administrador qué fechas se van ocupando.', activa: true,
      nota: 'necesita un panel de administrador; el salón es responsable de mantener al día qué fechas están reservadas' },
    { id: 'agenda', nombre: 'Agendar recorrido', descripcion: 'El cliente elige día, hora libre, tipo de evento e invitados para ir a conocer el salón. Las horas ocupadas se marcan desde el mismo panel.', activa: true,
      nota: 'usa el mismo panel de administrador para marcar las horas de recorrido ocupadas' },
    { id: 'terminos', nombre: 'Términos y Condiciones', descripcion: 'Opcionales, salvo que la página reciba anticipos: ahí son obligatorios.', activa: false, obligatoriaCon: ['pedidos'] },
    { id: 'faq', nombre: 'Preguntas frecuentes', descripcion: 'Respuestas a lo que más preguntan.', activa: true },
    { id: 'resenas', nombre: 'Reseñas', descripcion: 'Reseñas reales de Google de quienes ya hicieron su evento ahí.', activa: true },
    { id: 'google', nombre: 'Botón para calificar en Google', descripcion: 'Botón para que quien ya hizo su evento deje su reseña en Google.', activa: false },
    { id: 'asistente', nombre: 'Asistente en la página', descripcion: 'Contesta con los datos del salón.', activa: false },
    { id: 'correo', nombre: 'Correo con el nombre del negocio', descripcion: 'El correo del pie de la página pasa a ser contacto@su-dominio.', activa: false, nota: 'el correo va a nombre de su dominio' },
    { id: 'pedidos', nombre: 'Apartar fecha con anticipo', descripcion: 'Con liga de pago externa.', activa: false },
    { id: 'recordatorios', nombre: 'Recordatorio del recorrido por correo', descripcion: 'Un día antes de la visita.', activa: false },
  ],

  NEGOCIO: {
    titular: 'Nombre del dueño o razón social',
    direccion: 'Carretera Guadalajara–Nogales km 21, Calle Vista a la Primavera 14, La Primavera, Zapopan, Jal.',
    telefono: '33 3137 0202',
    porConfirmar: true,
    correoDatos: 'correo@ejemplo.com',
    facebook: 'facebook.com/salondeventosanmiguel',
    // dorado de las sillas y los cubremanteles de las fotos; va con el logo negro
    color: '#8A6A2F',
    logo: 'img/logotipo.png',
    // captura de Google Maps de su ubicación; en la página real va el mapa de Google con su ficha
    mapa: 'img/mapa.png',
    // búsqueda del mapa de Google que se puede mover; si se borra, se usa la captura de arriba
    mapaBusqueda: 'Salón de Eventos San Miguel, Calle Vista a la Primavera 14, La Primavera, Zapopan, Jalisco',
    mensajeWhatsapp: 'Hola, vi su página y quiero información para mi evento.',
    // fotos que mandó el salón (capturas de sus redes). Las descripciones las escribió 185ChangarroWeb a partir de lo que se ve.
    fotos: [
      { img: 'img/entrada.jpg?v=2', titulo: 'La entrada', aviso: 'Se difuminaron las personas del fondo.',
        texto: 'Al caer la tarde, el salón recibe a tus invitados con alfombra roja, postes dorados, letras monumentales y una fuente iluminada, bajo un techo alto con telas y focos cálidos. Así la llegada ya se siente parte de la fiesta y las primeras fotos salen listas desde la puerta, sin que tengas que pensar en decorar la entrada.' },
      { img: 'img/montaje-imperial.jpg', titulo: 'Montaje imperial',
        texto: 'Mesas largas de madera con sillas doradas, centros de flores y servilletas dobladas, con un arco de follaje al fondo y una estructura de luces y sonido junto a la pista. Este acomodo resuelve comidas, bodas íntimas o eventos de empresa donde todos quieren convivir en la misma mesa, y el salón lo tiene montado antes de que llegue el primer invitado.' },
      { img: 'img/mesas-redondas.jpg', titulo: 'Mesas redondas',
        texto: 'Mesas redondas con mantel blanco, cubremantel dorado y sillas vestidas con moño, bajo un techo con telas que dejan pasar luz suave de día. Es el acomodo clásico para XV años, bodas y bautizos con muchos invitados: cada familia tiene su mesa, se ve bien en las fotos y queda espacio para moverse entre las mesas y hacia la pista.' },
      { img: 'img/fiesta.jpg?v=2', titulo: 'La fiesta en marcha', aviso: 'Hay rostros reconocibles, por eso sale difuminada.',
        texto: 'En la foto original se ve el salón lleno: invitados en sus mesas, pista de baile iluminada al centro, luces de colores y telas en el techo. Muestra que el espacio recibe un evento grande sin sentirse apretado y que la pista queda a la vista de todas las mesas, para que nadie se pierda el vals ni el baile.' },
      { img: 'img/jardin.jpg?v=2', titulo: 'El jardín', aviso: 'Se difuminó a la persona del fondo.',
        texto: 'Un jardín con pasto, palmeras, un puente de herrería con luces y un arroyito de piedra, alumbrado al anochecer. Es el rincón para las fotos de los novios o de la quinceañera y para que los invitados salgan a tomar aire sin dejar la fiesta, algo que un salón cerrado no te da.' }
    ],
    // lo que se ve en las fotos; lo que no se ve (capacidad, qué entra en la renta) lo confirma el salón
    incluye: [
      { titulo: 'Capacidad', items: ['Por confirmar con el salón'] },
      { titulo: '¿Qué incluye?', items: ['Mesas redondas o montaje imperial', 'Sillas vestidas y mantelería', 'Pista de baile iluminada', 'Estructura para luces y sonido'] },
      { titulo: '¿Qué amenidades tiene?', items: ['Área techada con telas', 'Jardín con puente y fuente', 'Entrada con alfombra para recibir', 'Rincones para las fotos del evento'] }
    ],
    // su Facebook dice que atienden de lunes a sábado con cita; las horas son de ejemplo
    recorridos: { d: [1, 2, 3, 4, 5, 6], horas: ['10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'] },
    mesesCalendario: 12,
    // los mismos tipos van en las tarjetas de "¿Qué celebras?" y en el paso 3 del recorrido (el último, "Otro", solo en el recorrido)
    tiposEvento: ['Boda', 'XV años', 'Bautizo o comunión', 'Cumpleaños', 'Empresa', 'Otro'],
    // cómo se dice cada tipo dentro del mensaje de cotización ("quiero cotizar el paquete Completo para una boda")
    tiposMensaje: ['una boda', 'unos XV años', 'un bautizo o comunión', 'un cumpleaños', 'un evento de empresa', 'mi evento'],
    // texto de cada tarjeta: solo habla de lo que se ve en las fotos
    tiposTexto: [
      'La pista para el vals, mesas vestidas para tus invitados y el jardín con puente para las fotos de los novios.',
      'Entrada con alfombra roja, pista iluminada y rincones para las fotos de la quinceañera.',
      'Un espacio techado y fresco para la comida con la familia después de la ceremonia.',
      'Espacio de sobra para la fiesta, con pista de baile y jardín para salir a tomar aire.',
      'Montaje imperial para comidas, posadas y reuniones de fin de año de tu equipo.'
    ],
    invitados: ['Hasta 50', '50 a 100', '100 a 200', 'Más de 200'],
    // paquetes de ejemplo: los nombres y lo que incluye cada uno los decide el salón; sin precios hasta que los confirme
    paquetes: [
      { nombre: 'Básico', lema: 'Solo el lugar', items: ['Renta del salón por horas', 'Mesas y sillas', 'Uso del jardín para fotos'] },
      { nombre: 'Completo', lema: 'El salón listo para la fiesta', destacado: true, items: ['Todo lo del Básico', 'Mantelería y sillas vestidas', 'Pista de baile iluminada', 'Montaje redondo o imperial'] },
      { nombre: 'Todo incluido', lema: 'Tú solo llegas', items: ['Todo lo del Completo', 'Banquete', 'Música o DJ', 'Decoración del tema'] }
    ],
    // las respuestas solo hablan de lo que ya hace la página o dice su Facebook (no se inventan servicios del salón).
    // pendiente: la pregunta es real pero la respuesta la tiene que dar el salón; la página le pone "Por confirmar".
    faq: [
      { p: '¿Puedo conocer el salón antes de apartar?', r: 'Sí. En "Agendar recorrido" eliges el día y la hora, y te esperamos para enseñarte el salón.' },
      { p: '¿Qué días atienden?', r: 'De lunes a sábado, con cita. Escríbenos por WhatsApp para confirmar tu horario.' },
      { p: '¿Tienen mi fecha disponible?', r: 'Búscala en el calendario de fechas o pregúntanos por WhatsApp. Una fecha libre no queda apartada hasta que el salón te la confirma.' },
      { p: '¿Cómo aparto mi fecha?', r: 'Después del recorrido te damos la cotización y las condiciones para apartar, por escrito.' },
      { p: '¿Hasta qué hora puede durar la fiesta?', pendiente: true },
      { p: '¿Puedo traer mi propio banquete o bebidas?', pendiente: true },
      { p: '¿Cobran descorche?', pendiente: true },
      { p: '¿Puedo traer mi propia decoración?', pendiente: true },
      { p: '¿De cuánto es el anticipo?', pendiente: true }
    ],
    // reseñas reales de su ficha de Google Maps (capturas del 28 de septiembre de 2026).
    // Solo nombre e inicial del apellido; el texto va tal cual, sin los espacios de más antes de las comas.
    resenas: [
      { autor: 'Christian Y.', estrellas: 5, cuando: 'Hace 2 años', texto: 'El casino está enorme, y muy bonito... área de jardín con un puente... Muchísimo espacio, recomendado' },
      { autor: 'Eduardo R.', estrellas: 5, cuando: 'Hace 10 meses', texto: 'Muy bonito y muy amplio para unos 15 años o una boda esta perfecto' },
      { autor: 'Miguel G.', estrellas: 5, cuando: 'Hace 9 meses', texto: 'Está muy bonito el salón muy amplio el jardín está excelente para tomarse la foto del recuerdo' }
    ]
  }
};
