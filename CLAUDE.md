# 185ChangarroWeb

## Qué es

Herramienta de ventas para el servicio de páginas web de 185ChangarroWeb. Es una demo interactiva que se abre en su celular o laptop frente al dueño de un negocio local para enseñarle cómo se vería su página.

- Escribe el nombre del negocio, elige el giro y el color, y prende o apaga funciones. El sitio del cliente cambia en vivo dentro de un marco de teléfono, con su propia URL arriba.
- El botón **Presentar** oculta el panel para que el cliente vea solo su página.
- La pestaña **Propuesta** muestra 3 paquetes con precios editables, el mantenimiento desde el día uno, lo que se necesita del cliente y lo que se cobra aparte.

Esto es el muestrario, no la página final de un cliente. Generar sitios reales está en las ideas pendientes.

## Cómo correrlo

- Abre `public/index.html` directo en el navegador. Funciona con `file://`, sin servidor.
- Con Node (20 o más nuevo): `npm start` y abre http://localhost:3000. Las páginas son `/` y `/tarifas`. Para probarlo en el celular dentro de la misma red, usa la IP de la computadora con el puerto 3000.
- Se publica en Render.com como Web Service de Node con `render.yaml` (build `npm install`, start `npm start`, health check `/salud`). Los pasos están en `README.md`.

## Estructura

| Archivo | Qué tiene |
|---|---|
| `public/index.html` | Marcado: barra superior, panel de ajustes, marco de teléfono con el sitio del cliente, asistente, pestaña Propuesta. |
| `public/tarifas.html` | Página independiente de planes, precios editables, tiempos de respuesta y catálogo de funciones. Sus datos viven en su propio `<script>`. |
| `public/styles.css` | Tokens de la herramienta (claro y oscuro) y estilos del sitio del cliente. El sitio del cliente es siempre claro; sus colores viven en `.screen`. |
| `public/data.js` | Todo el contenido: giros, colores, fuentes, funciones y paquetes. Expone `window.VITRINA_DATA`. El comentario del inicio explica cada campo. |
| `public/app.js` | Estado, render del sitio, agenda, asistente por reglas, panel, propuesta y modo presentación. |
| `server.js` | Servidor de Node sin dependencias. Entrega solo lo que está en `public/`, con rutas limpias y `/salud`. Escucha en `process.env.PORT` y `0.0.0.0`, como pide Render. |
| `package.json`, `render.yaml`, `.node-version` | Configuración de Node y de Render. |

## Reglas del proyecto

- JavaScript sin framework y sin paso de build. Scripts clásicos, no `type="module"`, para que siga funcionando con `file://`.
- El contenido va en `data.js`. `app.js` solo lo pinta.
- Todo lo que ve el navegador va en `public/`. Lo que quede fuera (servidor, configuración, notas) nunca se entrega al público.
- `public/terminos.html` y `public/privacidad.html` son los documentos legales de 185ChangarroWeb. Si cambia una regla, precio o plan, actualiza también `public/tarifas.html` para que digan lo mismo, y la lista `PLANES` del script de `terminos.html` si cambia lo que incluye un plan en `tarifas.html`.
- Antes de publicar una versión nueva de Tarifas o de los documentos legales, guarda una copia con fecha en `versiones/AAAA-MM-DD/`. Esas copias prueban qué incluía cada plan el día en que un cliente contrató; no se borran ni se editan.
- Todo en español de México. En el sitio del cliente se le habla de "tú" al cliente final. En el panel y la propuesta se le habla de "usted" al dueño del negocio.
- Tiene que verse bien a 390 px de ancho, porque se enseña desde el celular. Nada de scroll horizontal.
- La herramienta usa tokens en `:root` con modo oscuro. El sitio del cliente no cambia con el tema.
- `localStorage` solo para comodidad (último negocio configurado, precios editados), siempre dentro de `try/catch`. La demo tiene que funcionar sin él.
- El asistente contesta solo con datos de `data.js` y, si no sabe algo, manda a WhatsApp. No debe inventar respuestas. No lo conectes a una IA sin que 185ChangarroWeb lo pida, porque eso tiene costo.
- Las reseñas de ejemplo siempre llevan la etiqueta "Ejemplo". En sitios reales de clientes van solo reseñas reales.
- El QR es decorativo a propósito y no se puede escanear: el dominio de ejemplo podría existir y llevar al negocio de otra persona. Cámbialo por un QR real solo cuando exista el dominio del cliente.
- Los botones de WhatsApp, Llamar y mapa muestran un aviso en pantalla en vez de abrir enlaces, porque el número y la dirección son de ejemplo.
- El aviso de privacidad siempre va incluido. Es obligatorio cuando la página pide datos personales.

## Cómo agregar un giro

1. En `public/data.js`, copia un objeto de `GIROS` con una clave nueva, sin acentos (por ejemplo `gimnasio`).
2. Llena todos los campos. El comentario del inicio de `data.js` dice qué es cada uno.
3. Si ocupa otra fuente, agrégala al enlace de Google Fonts en `public/index.html` y a `FONTS`.
4. Revisa que la agenda salte los días cerrados, que "abierto ahora" sea correcto y que el asistente conteste las preguntas de `faq`.

## Contexto para el asistente de WhatsApp

Si en algún momento se pide conectar un agente a WhatsApp:
- Desde el 15 de enero de 2026, Meta no permite chatbots de propósito general en la API de WhatsApp Business. Sí permite los que atienden un negocio (preguntas frecuentes, pedidos, reservas).
- Desde el 1 de octubre de 2026, en México cada número tiene 1,000 mensajes de servicio gratis al mes; arriba de eso se cobra cada mensaje.
- La opción gratis y recomendada para empezar es configurar la app WhatsApp Business del cliente (bienvenida, ausencia, respuestas rápidas, catálogo).

## Ideas pendientes (orden sugerido)

1. **Exportar sitio real:** un botón que genere un `index.html` independiente con el negocio configurado, sin panel ni etiquetas de ejemplo, listo para subir a GitHub Pages o Netlify.
2. **Fotos y logo del cliente:** subirlos desde el panel (input de archivo + FileReader) para que la demo use sus imágenes reales.
3. **Agenda real:** guardar las citas (por ejemplo, un backend pequeño en Render o conexión con un calendario).
4. **Más giros:** gimnasio, consultorio, papelería, ferretería, estética.
5. **QR real** cuando exista el dominio del cliente.

Los precios oficiales están en `public/tarifas.html` y en la sección 3 de `public/terminos.html`. `PLANS` de `data.js` debe usar los mismos nombres y precios.
