/*
  185ChangarroWeb — datos de la demo.
  Todo el contenido que se ve en la demo vive aquí. app.js solo lo pinta.

  COLORS    clave -> [nombre visible, color hex]. El color debe dar buen contraste con texto blanco.
  FONTS     clave -> pila de fuentes para el nombre del negocio y los títulos (cargadas en index.html desde Google Fonts).
  GIROS     un objeto por tipo de negocio. Campos:
              label        texto del selector de giro
              name         nombre de ejemplo (se usa si el vendedor no escribe uno)
              tag          frase corta debajo del nombre
              color, font  claves de COLORS y FONTS por defecto
              heroPhoto    texto del recuadro de foto principal
              cta          botón principal cuando la agenda está prendida
              agendaTitle, agendaSub, thing ('mesa' | 'cita' | 'consulta')
              slots        horas que ofrece la agenda (HH:MM)
              menuTitle, menuSub, items [[nombre, precio], ...]
              events       [[días a partir de hoy, título, detalle], ...]
              hours        [[etiqueta, [días 0=dom..6=sáb], abre 'HH:MM' | null, cierra 'HH:MM' | null], ...]
                           null = cerrado. Si cierra <= abre, se entiende que cierra después de medianoche.
              gallery      etiquetas de las 6 fotos de ejemplo
              reviews      [[autor, texto], ...]  (se muestran con la etiqueta "Ejemplo")
              faq          [[pregunta, respuesta], ...]  (el asistente también las usa)
              pay          respuesta del asistente sobre formas de pago
              defaults     funciones prendidas o apagadas al elegir este giro
  FEATURES  interruptores del panel. locked:true = no se puede apagar.
  EXTRAS    funciones que se ofrecen "para después" (solo se muestran como etiquetas).
  PLANS     paquetes de la pestaña Propuesta (precios sugeridos; se pueden editar en pantalla).
  MANT, NEED, APARTE  listas de la pestaña Propuesta.
*/
window.VITRINA_DATA = (function(){
  var COLORS = {
    chile:['Chile','#B8392A'], agave:['Agave','#1E6B57'], anil:['Añil','#2F4A8A'],
    mostaza:['Mostaza','#94620A'], buganvilia:['Buganvilia','#9E3A6E'], carbon:['Carbón','#2A2C2B']
  };
  var FONTS = {
    slab:"'Alfa Slab One', Rockwell, Georgia, serif",
    serif:"'Young Serif', Georgia, 'Times New Roman', serif",
    fine:"'Italiana', Didot, Georgia, serif"
  };
  var GIROS = {
    restaurante:{label:'Restaurante / taquería', name:'Taquería Don Chuy', tag:'Tacos al pastor y de guisado, hechos al momento desde 1998.', color:'chile', font:'slab',
      heroPhoto:'Foto del trompo o del platillo estrella', cta:'Reservar mesa', agendaTitle:'Reserva tu mesa', agendaSub:'Para grupos de 6 o más, te guardamos la mesa 15 minutos.', thing:'mesa',
      slots:['13:30','14:30','15:30','19:00','20:00','21:00'], menuTitle:'Menú', menuSub:'Precios por pieza.',
      items:[['Taco al pastor','$22'],['Taco de guisado','$20'],['Gringa de pastor','$65'],['Orden de 5 tacos','$95'],['Agua fresca 1 L','$35']],
      events:[[3,'Martes de 2×1 en pastor','Todo el día, consumiendo en el local.'],[10,'Noche de mariachi','Desde las 20:00. Aparta tu mesa con tiempo.']],
      hours:[['Lun – Jue',[1,2,3,4],'13:00','23:00'],['Vie – Sáb',[5,6],'13:00','00:00'],['Domingo',[0],'13:00','22:00']],
      gallery:['Trompo al pastor','Salsas de la casa','Fachada','Orden para compartir','Comedor','Aguas frescas'],
      reviews:[['Mariana R.','Pedí por WhatsApp y llegó calientito. Los mejores de la zona.'],['Luis G.','Reservé para 8 desde la página y ya nos tenían la mesa lista.'],['Daniela P.','La salsa verde es otra cosa. Buen precio.']],
      faq:[['¿Tienen servicio a domicilio?','Sí, en un radio de 3 km. Pide por WhatsApp.'],['¿Aceptan tarjeta?','Sí: efectivo, tarjeta y transferencia.'],['¿Hacen taquizas para eventos?','Sí, desde 30 personas, con 3 días de anticipación.']],
      pay:'Aceptamos efectivo, tarjeta y transferencia.', defaults:{agenda:true, eventos:true}},
    barberia:{label:'Barbería / estética', name:'Barbería El Güero', tag:'Cortes clásicos y degradados. Con cita no esperas.', color:'carbon', font:'slab',
      heroPhoto:'Foto de un corte terminado', cta:'Agendar corte', agendaTitle:'Agenda tu corte', agendaSub:'Elige día y hora. Te guardamos el lugar 10 minutos.', thing:'cita',
      slots:['10:00','11:00','12:00','16:00','17:00','18:00'], menuTitle:'Servicios', menuSub:'Precio por servicio.',
      items:[['Corte clásico','$120'],['Degradado','$150'],['Arreglo de barba','$90'],['Corte + barba','$220'],['Corte de niño','$100']],
      events:[[2,'Miércoles de corte + barba','$190 todo el día.'],[12,'Regreso a clases','Corte de niño a $80 toda la semana.']],
      hours:[['Lunes',[1],null,null],['Mar – Sáb',[2,3,4,5,6],'10:00','20:00'],['Domingo',[0],'10:00','15:00']],
      gallery:['Degradado','Barba perfilada','Corte clásico','El local','Corte de niño','Productos'],
      reviews:[['Jorge M.','Agendé desde la página y no esperé nada. Buen corte.'],['Kevin S.','El degradado quedó igual que la foto que le enseñé.'],['Ana L.','Llevo a mi hijo cada mes, siempre puntuales.']],
      faq:[['¿Atienden sin cita?','Sí, pero con cita no esperas.'],['¿Venden productos para el cabello?','Sí: cera, aceite para barba y shampoo.'],['¿Cuánto tarda un corte?','Entre 30 y 45 minutos.']],
      pay:'Aceptamos efectivo y transferencia.', defaults:{agenda:true, eventos:true}},
    despacho:{label:'Despacho de abogados', name:'Martínez & Asociados', tag:'Abogados en derecho familiar, laboral y civil. Primera consulta con cita.', color:'anil', font:'serif',
      heroPhoto:'Foto de la oficina o del equipo', cta:'Agendar consulta', agendaTitle:'Agenda tu consulta', agendaSub:'Presencial o por videollamada. Dura 30 minutos.', thing:'consulta',
      slots:['09:00','10:00','11:00','12:00','16:00','17:00'], menuTitle:'Servicios', menuSub:'Honorarios de referencia. El costo final depende de cada caso.',
      items:[['Consulta inicial (30 min)','$400'],['Contrato de arrendamiento','$1,200'],['Testamento','Desde $2,500'],['Divorcio voluntario','Desde $6,000'],['Demanda laboral','Cotización']],
      events:[[6,'Asesoría gratuita','De 10:00 a 13:00, con cita.'],[15,'Plática: cómo hacer tu testamento','Entrada libre. Cupo limitado.']],
      hours:[['Lun – Vie',[1,2,3,4,5],'09:00','18:00'],['Sábado',[6],'10:00','13:00'],['Domingo',[0],null,null]],
      gallery:['Recepción','Sala de juntas','El equipo','Fachada','Biblioteca','Área de espera'],
      reviews:[['Patricia V.','Me explicaron todo claro y sin rodeos desde la primera consulta.'],['Roberto C.','Llevaron mi caso laboral y me tuvieron al tanto por WhatsApp.'],['Silvia N.','Hice mi testamento en una semana.']],
      faq:[['¿La primera consulta tiene costo?','Sí, $400 por 30 minutos. Si contratas, se descuenta de los honorarios.'],['¿Atienden en línea?','Sí, por videollamada, con la misma duración.'],['¿Qué documentos llevo?','Tu identificación y todos los papeles relacionados con tu caso.']],
      pay:'Aceptamos transferencia, tarjeta y efectivo. Emitimos factura.', defaults:{agenda:true, eventos:false}},
    taller:{label:'Taller mecánico', name:'Taller Hermanos Ríos', tag:'Afinaciones, frenos y suspensión. Garantía por escrito.', color:'mostaza', font:'slab',
      heroPhoto:'Foto del taller o de un trabajo terminado', cta:'Agendar servicio', agendaTitle:'Agenda tu servicio', agendaSub:'Déjalo en la mañana y te avisamos por WhatsApp cuando esté listo.', thing:'cita',
      slots:['08:30','09:30','10:30','11:30','15:00','16:00'], menuTitle:'Servicios', menuSub:'Precios para auto compacto. Camioneta, con cotización.',
      items:[['Cambio de aceite','$650'],['Diagnóstico por computadora','$350'],['Alineación y balanceo','$450'],['Balatas delanteras','$900'],['Afinación mayor','Desde $1,200']],
      events:[[4,'Revisión de frenos sin costo','Antes de salir a carretera.'],[11,'Aceite + lavado de motor','$699 toda la semana.']],
      hours:[['Lun – Vie',[1,2,3,4,5],'08:30','18:30'],['Sábado',[6],'08:30','14:00'],['Domingo',[0],null,null]],
      gallery:['Área de trabajo','Cambio de frenos','Escáner','Fachada','Suspensión','Entrega'],
      reviews:[['Héctor A.','Me mandaron foto de la pieza dañada antes de cambiarla.'],['Claudia F.','Agendé en la página y lo tuvieron listo en la tarde.'],['Miguel T.','Precio justo y garantía por escrito.']],
      faq:[['¿Dan garantía?','Sí, 3 meses o 5,000 km en mano de obra.'],['¿Puedo dejar el carro en la mañana?','Sí, y te avisamos por WhatsApp cuando esté listo.'],['¿Revisan camionetas?','Sí, con cotización previa.']],
      pay:'Aceptamos efectivo, tarjeta y transferencia.', defaults:{agenda:true, eventos:true}},
    boutique:{label:'Boutique / tienda', name:'Boutique Valentina', tag:'Ropa y accesorios para dama, tallas CH a 3XL.', color:'buganvilia', font:'fine',
      heroPhoto:'Foto de la colección de temporada', cta:'Agendar prueba', agendaTitle:'Cita para probador', agendaSub:'Te apartamos las prendas que elijas.', thing:'cita',
      slots:['11:00','12:00','13:00','17:00','18:00','19:00'], menuTitle:'Lo más pedido', menuSub:'Precio por pieza. Pregunta por tallas y colores.',
      items:[['Blusa de lino','$349'],['Jeans tiro alto','$499'],['Vestido midi','$599'],['Bolsa tejida','$399'],['Sandalias','$299']],
      events:[[1,'Llegó la temporada de otoño','Suéteres y chamarras en tienda.'],[8,'Venta de bodega','Hasta 50% en piezas seleccionadas.']],
      hours:[['Lun – Sáb',[1,2,3,4,5,6],'10:00','20:30'],['Domingo',[0],'11:00','15:00']],
      gallery:['Nueva colección','Vestidos','Accesorios','Aparador','Probadores','Bolsas'],
      reviews:[['Fernanda G.','Pedí por WhatsApp y me lo apartaron el mismo día.'],['Rocío M.','Tienen tallas grandes y se ven bien.'],['Lucía H.','El vestido llegó a mi casa al día siguiente.']],
      faq:[['¿Hacen envíos?','Sí, a todo México por paquetería. En la ciudad, entrega el mismo día.'],['¿Puedo apartar?','Sí, con el 30% y tienes 15 días para liquidar.'],['¿Tienen cambios?','Sí, dentro de 7 días con ticket y etiqueta.']],
      pay:'Aceptamos efectivo, tarjeta y transferencia.', defaults:{agenda:false, eventos:true}}
  };
  var FEATURES = [
    {id:'whats', t:'Botón de WhatsApp', d:'Le escriben con un toque, con el mensaje ya escrito.'},
    {id:'agenda', t:'Agenda de citas', d:'Apartan día y hora sin llamar. A usted le llega el aviso.'},
    {id:'eventos', t:'Eventos y promociones', d:'Promos y fechas especiales que se quitan solas al pasar.'},
    {id:'chat', t:'Asistente que contesta', d:'Responde horarios, precios y ubicación con sus datos. Lo que no sabe, lo pasa a una persona.'},
    {id:'galeria', t:'Galería de fotos', d:'Su local, sus productos y sus trabajos.'},
    {id:'resenas', t:'Reseñas de clientes', d:'Opiniones de clientes que dan confianza.'},
    {id:'mapa', t:'Mapa y horarios', d:'Cómo llegar y si está abierto en este momento.'},
    {id:'redes', t:'Enlace para redes y QR', d:'Un solo enlace para Instagram, TikTok y Facebook, y un QR para el mostrador.'},
    {id:'faq', t:'Preguntas frecuentes', d:'Contesta lo que siempre le preguntan.'},
    {id:'privacidad', t:'Aviso de privacidad', d:'Obligatorio si la página pide datos. Siempre incluido.', locked:true}
  ];
  var EXTRAS = ['Pedidos para llevar','Catálogo con carrito','Liga de pago','Cupones','Bolsa de trabajo','Menú en inglés','Noticias o blog','Sesión de fotos del local'];
  var PLANS = [
    {id:'esencial', name:'Esencial', forx:'Para que lo encuentren, le escriban y aparten.', inst:1800, mes:199, time:'Lista en 3 a 5 días hábiles',
      inc:['Página con servicios y precios','Botón de WhatsApp con mensaje listo','Mapa, horarios y aviso de "abierto ahora"','Enlace para redes y QR para imprimir','Dominio propio a nombre del negocio','Agenda de citas o reservas','Galería de fotos y reseñas','Eventos y promociones','Aviso de privacidad (cuando la página pide datos)']},
    {id:'negocio', name:'Negocio', forx:'Para que la página trabaje y conteste por usted.', inst:2800, mes:299, time:'Lista en 5 a 7 días hábiles', featured:true,
      inc:['Todo lo de Esencial','Preguntas frecuentes','Alta y arreglo de su ficha en Google Maps, con QR para pedir reseñas','Asistente en la página que contesta con sus datos','Hasta 10 funciones del catálogo']},
    {id:'pro', name:'Negocio + Asistente Pro', forx:'Para tener a alguien que le ayuda a vender cada mes.', inst:3900, mes:449, time:'Lista en 7 a 10 días hábiles',
      inc:['Todo lo de Negocio','Hasta 15 funciones del catálogo','WhatsApp Business configurado: bienvenida, ausencia, respuestas rápidas y catálogo','Pedidos con anticipo y liga de pago externa','Reporte mensual detallado','2 diseños de promoción al mes','Hasta 3 cambios pequeños al día']}
  ];
  var MANT = ['Hosting y candado de seguridad (https) siempre activos','Precios y horarios se pueden actualizar diariamente','Hasta 3 cambios al mes en lo que ya existe: fotos, textos o promociones','Cambios listos en máximo 48 horas hábiles','Respaldo mensual de la página','Reporte mensual de visitas y clics a WhatsApp'];
  var NEED = ['Logo (si no tiene, se hace uno sencillo)','Fotos del local, productos o trabajos (opcionales, pero ayudan mucho)','Lista de servicios o productos con precios','Horarios, dirección y número de WhatsApp','Sus redes sociales, si las tiene'];
  var APARTE = ['Rediseño completo o secciones nuevas','Sesión de fotos del local y productos','Publicidad pagada en Google o Facebook','Tienda en línea con pagos'];

  return {COLORS:COLORS, FONTS:FONTS, GIROS:GIROS, FEATURES:FEATURES, EXTRAS:EXTRAS, PLANS:PLANS, MANT:MANT, NEED:NEED, APARTE:APARTE};
})();
