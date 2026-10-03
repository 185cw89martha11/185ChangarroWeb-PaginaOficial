/* 185ChangarroWeb — precios de los tres servicios. Los usan index.html, tarifas.html, basicas.html,
   eventos.html y la demo (data.js). Es el único lugar donde se cambian los precios.
   Si cambias algo aquí, revisa también la sección 3 y la lista PLANES de terminos.html, y PLANS de data.js.

   BASICA: la página de una sola hoja, con contenido fijo (servicio más barato para negocios).
   PLANS: los tres planes personalizables. id, name, forx (para quién es), inst (instalación),
          mes (mensualidad), funcs, sla, time, featured, inc (lo que incluye, admite HTML).
   EVENTOS: invitaciones digitales. Pago único, sin mensualidad y sin premio por recomendar.
   REFERIDOS: premio por recomendar, por tipo de servicio (0 = no aplica).
   CATALOG: [categoría, [[función, cuenta como 2 (1/0), pide datos (1/0)], ...]] */
window.PLANES_185 = {
  BASICA: {
    id:'basica', name:'Básica', forx:'Para que lo encuentren en internet y le escriban, sin gastar mucho.',
    inst:700, mes:99, sla:'72 h', time:'2 a 3 días hábiles',
    inc:['Una sola página con su nombre, logo, fotos y precios',
      'Botón de WhatsApp con el mensaje ya escrito',
      'Mapa, horarios y aviso de "abierto ahora"',
      'Enlace para sus redes y QR para imprimir',
      'Datos del negocio en el pie y aviso de privacidad',
      'Dirección web incluida <span class="opt">(dominio propio se cotiza aparte)</span>',
      'Hosting, candado de seguridad (https) y respaldo mensual',
      'Un cambio al mes: precios, horarios o una foto'],
    no:['Agenda de citas o reservas','Catálogo con buscador y filtros','Asistente que contesta en la página',
      'Reseñas de clientes en la página','Alta y arreglo de su ficha en Google Maps',
      'Funciones del catálogo','Reporte mensual de visitas']
  },
  PLANS: [
    {id:'esencial', name:'Esencial', forx:'Para que lo encuentren, le escriban y aparten.', inst:1800, mes:199, funcs:'—', sla:'48 h', time:'3 a 5 días hábiles',
      inc:['Página con servicios y precios','Botón de WhatsApp con mensaje listo','Mapa, horarios y aviso de "abierto ahora"','Enlace para redes y QR para imprimir','Dominio propio a nombre del negocio','Agenda de citas o reservas','Galería de fotos','Eventos y promociones','Aviso de privacidad (cuando la página pide datos)','Términos y Condiciones <span class="opt">(opcionales; obligatorios si la página recibe pedidos o pagos)</span>']},
    {id:'negocio', name:'Negocio', forx:'Para que la página trabaje y conteste por usted.', inst:2800, mes:299, funcs:'10', sla:'36 h', time:'5 a 7 días hábiles', featured:true,
      inc:['<b>Todo lo de Esencial</b>','Preguntas frecuentes','Alta y arreglo de su ficha en Google Maps, con QR para pedir reseñas','Asistente en la página que contesta con sus datos','Reseñas de clientes en la página','Hasta 10 funciones del catálogo','Renovación radical de diseño o funciones, no en meses seguidos','Configuración de correo profesional <span class="opt">(con costo extra)</span>']},
    {id:'pro', name:'Negocio + Asistente Pro', forx:'Para tener a alguien que le ayuda a vender cada mes.', inst:3900, mes:449, funcs:'15', sla:'4 h', time:'7 a 10 días hábiles',
      inc:['<b>Todo lo de Negocio</b>','Hasta 15 funciones del catálogo','WhatsApp Business configurado: bienvenida, ausencia, respuestas rápidas y catálogo','Pedidos con anticipo y liga de pago externa','Reporte mensual detallado: visitas, clics, citas y pedidos','2 diseños de promoción al mes para WhatsApp y redes','Respuestas redactadas a sus reseñas de Google','Recordatorios de citas por correo','Varias sucursales en una misma página','Configuración de correo profesional incluida','Hasta 3 cambios pequeños al día']}
  ],
  EVENTOS: {
    vigencia:'3 meses después del evento', extra:100, cambio:50, time:'24 a 48 horas',
    PAQUETES: [
      {id:'basica', name:'Invitación Básica', forx:'Para avisar bonito y que confirmen por WhatsApp.', precio:350,
        inc:['Portada con foto y los nombres','Fecha, hora y lugar con mapa','Confirmación de asistencia por WhatsApp',
          'Enlace y QR para mandarla por WhatsApp o redes','Se ve bien en cualquier celular']},
      {id:'completa', name:'Invitación Completa', forx:'Para una fiesta grande, con todos los detalles.', precio:500, featured:true,
        inc:['<b>Todo lo de la Básica</b>','Cuenta regresiva hasta el día del evento','Galería de fotos',
          'Fotos del lugar, para que sepan a dónde llegar','Itinerario de la fiesta','Código de vestimenta',
          'Mesa de regalos','Música de fondo']}
    ]
  },
  REFERIDOS: { basica:150, planes:200, eventos:0, vigencia:'31 de marzo de 2027' },
  CATALOG: [
    ['Fidelización y promociones', [['Tarjeta de fidelidad virtual con sellos',1,1],['Cupones con código de descuento',0,0],['Programa "trae a un amigo"',0,1],['Club de cumpleañeros',0,1],['Promo del día u "hora feliz" con cuenta regresiva',0,0],['Combos o paquetes armables',0,0],['Tarjetas de regalo con liga de pago',1,0]]],
    ['Catálogo y pedidos', [['Catálogo con buscador y filtros',1,0],['Cotizador aproximado',0,0],['Apartado de productos',0,1],['Menú o especial del día automático',0,0],['Etiquetas de "agotado" o "nuevo"',0,0],['Seguimiento de pedido o servicio',1,1]]],
    ['Citas y atención', [['Elegir empleado al agendar',0,1],['Lista de espera',0,1],['Formulario de cotización con fotos',0,1],['Encuesta de satisfacción',0,1]]],
    ['Contenido y confianza', [['Deslizador de "antes y después"',0,0],['Sección "Conoce al equipo"',0,0],['Noticias o blog',0,0],['Calendario de clases o eventos con cupo',1,1],['Bolsa de trabajo con formulario',0,1],['Versión en inglés',1,0],['Horarios especiales automáticos',0,0]]]
  ]
};
