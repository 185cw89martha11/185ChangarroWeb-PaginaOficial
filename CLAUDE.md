# 185ChangarroWeb

## La portada se genera, no se escribe a mano

`public/index.html` **es un archivo generado**. No lo edites: se sobrescribe.

La cara pública de 185ChangarroWeb vive en `sitio/` (proyecto aparte, con su propio generador y 15 pruebas). Para cambiarla se edita `sitio/src/agency/pages.js` (contenido), `sitio/src/agency/agency.css` (estilos) o `sitio/config.json` (datos), y luego:

```
node herramientas/generar-portada.js
```

Eso arma `sitio/dist/` y lo **copia** encima de `public/`. Se copia, no se mueve: el generador vacía su propia carpeta `dist/` antes de trabajar, y si apuntara directo a `public/` se llevaría por delante los Términos, el panel y las muestras. La salida se sube al repositorio para que Render no tenga que generar nada: su build sigue siendo solo `npm install`.

Los precios **no se escriben en `sitio/config.json`**: salen de `public/planes.js` con `cd sitio && npm run planes`, que copia planes, Básica, Eventos y el premio por recomendar. `planes.js` manda.

Qué aporta cada parte a la misma URL:

| Viene de | Rutas |
|---|---|
| `sitio/` (generado) | `/` (portada), `/crear/`, `/ejemplos/<giro>/`, `/vista-previa/`, `/prospectar/`, `/herramientas/link-de-whatsapp/`, `/privacidad-del-sitio/`, `404.html`, `robots.txt`, `sitemap.xml`, `logo.svg`, `favicon.svg` |
| El portal (a mano) | `/tarifas`, `/basicas`, `/eventos`, `/terminos`, `/privacidad`, `/admin`, `/demo`, `/muestra`, `/api/`, y las muestras de cada negocio |

Dos nombres se cambiaron para que no chocaran con el portal: la vista previa del sitio comercial es `/vista-previa/` (porque `/demo` ya es la demo de ventas) y su aviso de cookies es `/privacidad-del-sitio/` (porque `/privacidad` es el Aviso de Privacidad legal).

## Los tres servicios

185ChangarroWeb vende tres cosas distintas, y la portada es una puerta a cada una:

1. **Páginas Web Básicas** (`basicas.html`) — una sola hoja, contenido fijo. $700 de instalación y $99 al mes. Es el gancho: barata, pero recortada a propósito.
2. **Páginas Web Personalizables** (`tarifas.html`) — los tres planes de siempre, desde $1,800 + $199 al mes. Aquí sí se arma a gusto del cliente, dentro de lo que incluye el plan.
3. **Páginas Web para Eventos** (`eventos.html`) — invitaciones digitales, $350 o $500 de pago único, sin mensualidad.

El **premio por recomendar** es $150 en Básicas y $200 en Personalizables. En Eventos no hay premio: el ticket no lo aguanta. Las reglas completas están en la sección 19 de los Términos.

Regla que no se rompe: las muestras de negocios (Mariscos, Clínica Dental, AmueblArte) se hicieron para enseñar el trabajo y traen cosas de los planes personalizables. Una Básica incluye exactamente la lista `BASICA.inc` de `planes.js`, ni más ni menos, y `basicas.html` lo dice con todas sus letras para no prometer de más.

## Qué es

Herramienta de ventas para el servicio de páginas web de 185ChangarroWeb. Es una demo interactiva que se abre en su celular o laptop frente al dueño de un negocio local para enseñarle cómo se vería su página.

- Escribe el nombre del negocio, elige el giro y el color, y prende o apaga funciones. El sitio del cliente cambia en vivo dentro de un marco de teléfono, con su propia URL arriba.
- El botón **Presentar** oculta el panel para que el cliente vea solo su página.
- La pestaña **Propuesta** muestra 3 paquetes con sus precios, el mantenimiento desde el día uno, lo que se necesita del cliente y lo que se cobra aparte.

Esto es el muestrario, no la página final de un cliente. Generar sitios reales está en las ideas pendientes.

## Cómo correrlo

- Abre `public/index.html` (portada) o `public/demo.html` (demo) directo en el navegador. Funciona con `file://`, sin servidor.
- Con Node (20 o más nuevo): `npm start` y abre http://localhost:3000. Las páginas son `/` (portada), `/demo`, `/muestra`, `/tarifas`, `/terminos`, `/privacidad` y `/admin`. Para probarlo en el celular dentro de la misma red, usa la IP de la computadora con el puerto 3000.
- Se publica en Render.com como Web Service de Node con `render.yaml` (build `npm install`, start `npm start`, health check `/salud`). Los pasos están en `README.md`.

## Estructura

| Archivo | Qué tiene |
|---|---|
| `public/index.html` | **Generado.** Portada comercial: hero con mockup de celular, los problemas del negocio, qué incluye, los 6 ejemplos, cómo funciona, precios (Básica + los tres planes), Eventos, premio por recomendar, comparativa y preguntas. Sale de `sitio/`; no se edita a mano. |
| `sitio/` | El generador de la portada y de los ejemplos. `src/agency/pages.js` arma la portada; `src/render.js` y `src/presets.js` arman los sitios de ejemplo de cada giro; `scripts/build.js` escribe todo en `sitio/dist/`; `scripts/sincronizar-planes.js` trae los precios de `public/planes.js`; `scripts/test.js` son sus pruebas. Trae también el creador de vistas previas (`/crear/`) y material de ventas en `ventas/` y `redes/`. |
| `public/logo.svg`, `public/favicon.svg` | El logo de 185ChangarroWeb: el "185" en azul, morado y rosa sobre fondo oscuro. Lo usan todas las páginas. Sustituyó al `logo.png` de fondo blanco. |
| `public/basicas.html` | Página del servicio más barato para negocios: la Básica, una sola hoja con contenido fijo. Qué incluye y **qué no incluye** (ambas listas salen de `BASICA` en `planes.js`), ejemplos, pagos y premio por recomendar. |
| `public/eventos.html` | Página de las invitaciones digitales (`EVENTOS` de `planes.js`): dos paquetes de pago único, enlace a la invitación de ejemplo, cuánto tiempo está en línea y qué se necesita. Es el único servicio donde se habla de "tú": no es para negocios y no lleva premio por recomendar. |
| `public/demo.html` | Demo de ventas. Marcado: barra superior, panel de ajustes, marco de teléfono con el sitio del cliente, asistente, pestaña Propuesta. |
| `public/muestra.html`, `muestra.css`, `muestra.js`, `muestra-datos.js` | Muestra por cliente (es la base que se copia por negocio, ver "Cómo hacer la muestra de un negocio"): interruptores con todo lo que incluyen los planes (sin las funciones del catálogo), agrupados por plan y con el plan que cubre lo prendido; vista previa en celular o computadora (botón arriba a la derecha); botón que exporta un mensaje para Claude Code con lo que decidió el cliente. `muestra-datos.js` es la plantilla: `FUNCIONES` (qué se prende) y `NEGOCIO` (el contenido de ejemplo). Nombres y precios de planes salen de `planes.js`. Si cambia lo que incluye un plan en `planes.js`, actualiza también `FUNCIONES`. |
| `public/tarifas.html` | Página de las Páginas Personalizables: los tres planes, precios, tiempos de respuesta y catálogo de funciones. Manda a Básicas y a Eventos. |
| `public/planes.js` | **El único lugar donde viven los precios** (`window.PLANES_185`): `BASICA`, `PLANS`, `EVENTOS`, `REFERIDOS` y `CATALOG`. Los usan `index.html`, `basicas.html`, `eventos.html` y `tarifas.html`. |
| `public/styles.css` | Tokens de la herramienta (claro y oscuro) y estilos del sitio del cliente. El sitio del cliente es siempre claro; sus colores viven en `.screen`. |
| `public/data.js` | Todo el contenido: giros, colores, fuentes, funciones y paquetes. Expone `window.VITRINA_DATA`. El comentario del inicio explica cada campo. |
| `public/app.js` | Estado, render del sitio, agenda, asistente por reglas, panel, propuesta y modo presentación. |
| `public/admin.html`, `public/admin.js` | Panel de administración: pide la clave cada vez, descarga las solicitudes de aceptación a IndexedDB cifradas (AES-GCM con llave PBKDF2 de la clave), las guarda o borra, y las exporta a PDF con huella SHA-256. |
| `solicitudes.js` | API `/api/...`: recibe las aceptaciones de `terminos.html`, las deja en el buzón (Hoja de Google vía Apps Script, o `datos/solicitudes.json` en esta computadora) y da acceso al panel con la clave. |
| `integraciones/` | Código del Apps Script de la Hoja de Google y pasos para configurarlo. |
| `server.js` | Servidor de Node sin dependencias. Entrega solo lo que está en `public/`, con rutas limpias, `/salud` y `/api/`. Escucha en `process.env.PORT` y `0.0.0.0`, como pide Render. |
| `public/amueblarte-muestra/` | Muestra de AmueblArte de **Ocotlán, Jalisco** (mueblería para el hogar: recámaras, salas, comedores, mesas y camas; NO es la AmueblArte de la CDMX, que vende mobiliario para restaurantes). Copia de la base de Mariscos con código propio: menú de 4 páginas, catálogo de 5 categorías con galería, lista de cotización por WhatsApp (se recuerda en el navegador), "Cómo trabajamos", acabados, "Combina con", aviso de privacidad y Términos de ejemplo, resumen imprimible de la petición y visor 3D (model-viewer, se baja de jsDelivr solo al abrir un 3D y se apaga al dejar de verse; los .glb no cargan con `file://`, hace falta servidor). El AR no aparece en la muestra: es un extra de cotización y el visor 3D lo explica. Datos en `muestra-datos.js`; las fotos salen de sus redes y se les recortó el logo de Facebook y el zoom. |
| `public/ejemplodeevento-muestra/` | Invitación digital de ejemplo de XV años (paquete Completa, datos inventados, con etiqueta DEMO), en `/ejemplodeevento-muestra/`; `/15anos-demo/` y `/15años-demo/` redirigen ahí. No se escribe a mano: es la salida de `build.js` del sistema de invitaciones (proyecto aparte, fuera de este repositorio). No lleva solicitudes ni datos personales: la confirmación abre WhatsApp. Lleva `noindex`; `public/robots.txt` y el encabezado `X-Robots-Tag` del servidor la excluyen de buscadores. |
| `herramientas/amueblarte-modelos.js` | Genera los 9 .glb de demostración de `modelos/` (`node herramientas/amueblarte-modelos.js`). |
| `package.json`, `render.yaml`, `.node-version` | Configuración de Node y de Render. |

## Reglas del proyecto

- JavaScript sin framework y sin paso de build. Scripts clásicos, no `type="module"`, para que siga funcionando con `file://`.
- El contenido va en `data.js`. `app.js` solo lo pinta.
- Todo lo que ve el navegador va en `public/`. Lo que quede fuera (servidor, configuración, notas) nunca se entrega al público.
- `public/terminos.html` y `public/privacidad.html` son los documentos legales de 185ChangarroWeb. Si cambia una regla, precio o plan, actualiza también `public/planes.js`, `public/tarifas.html`, `public/basicas.html` y `public/eventos.html` para que digan lo mismo, y la lista `PLANES` del script de `terminos.html` si cambia lo que incluye un plan.
- Los precios se escriben **una sola vez, en `planes.js`**, y las páginas los pintan desde ahí. La excepción obligada son los Términos (secciones 3, 19 y 20), donde el precio va escrito porque es un documento legal: si cambia un precio en `planes.js`, hay que cambiarlo ahí a mano.
- Las páginas de los tres servicios llevan la misma barra `nav` arriba (Básicas · Personalizables · Eventos), con `aria-current="page"` en la que se está viendo.
- Antes de publicar una versión nueva de Tarifas o de los documentos legales, guarda una copia con fecha en `versiones/AAAA-MM-DD/`. Esas copias prueban qué incluía cada plan el día en que un cliente contrató; no se borran ni se editan. Si ya existe la carpeta de ese día, usa `AAAA-MM-DD-2`, `-3`, etc. Incluye los archivos que la página necesita para verse igual (por ejemplo, `planes.js` y el logo).
- Todo en español de México. En el sitio del cliente se le habla de "tú" al cliente final. En el panel y la propuesta se le habla de "usted" al dueño del negocio.
- Tiene que verse bien a 390 px de ancho, porque se enseña desde el celular. Nada de scroll horizontal.
- La herramienta usa tokens en `:root` con modo oscuro. El sitio del cliente no cambia con el tema.
- `localStorage` solo para comodidad (último negocio configurado), siempre dentro de `try/catch`. La demo tiene que funcionar sin él.
- Los precios y textos no se editan desde la página (sin botones de "Editar precios" ni campos editables): solo se cambian en el código. La excepción es la muestra de Mariscos 8 Tostadas, que se deja como está.
- En todas las páginas, el logo de 185ChangarroWeb es un enlace a la portada (`index.html`, o `../index.html` en las muestras que viven en su propia carpeta). El logo es `logo.svg`, que ya trae su propio fondo oscuro: no se le pone recuadro blanco.
- El asistente contesta solo con datos de `data.js` y, si no sabe algo, manda a WhatsApp. No debe inventar respuestas. No lo conectes a una IA sin que 185ChangarroWeb lo pida, porque eso tiene costo.
- Las reseñas de ejemplo siempre llevan la etiqueta "Ejemplo". En sitios reales de clientes van solo reseñas reales.
- El QR es decorativo a propósito y no se puede escanear: el dominio de ejemplo podría existir y llevar al negocio de otra persona. Cámbialo por un QR real solo cuando exista el dominio del cliente.
- Los botones de WhatsApp, Llamar y mapa muestran un aviso en pantalla en vez de abrir enlaces, porque el número y la dirección son de ejemplo.
- El aviso de privacidad siempre va incluido. Es obligatorio cuando la página pide datos personales. Lo demás que va por ley está en "Base legal de la página del cliente".
- La clave del panel nunca va escrita en el código ni en el repositorio. El servidor solo tiene su huella PBKDF2 en `ADMIN_CLAVE_HASH` (Render > Environment, o `.env.local` en esta computadora, que no se sube). El panel no la guarda: la pide cada vez que se abre y se bloquea tras 15 minutos sin uso.
- Las solicitudes solo pasan por el buzón (Hoja de Google) hasta que el panel las descarga; después se borran de ahí y viven cifradas en IndexedDB del navegador del panel. Si cambian los datos que pide el formulario de aceptación, actualiza `solicitudes.js`, `admin.js` (`CAMPOS`) y las secciones 2 y 4 del Aviso de Privacidad.
- La huella SHA-256 no impide editar un PDF exportado; sirve para notar si se editó, comparándolo con la solicitud original del panel.

## Base legal de la página del cliente (va en todos los planes)

La muestra ya trae esto. No se quita en ninguna copia ni en la página final:

- **Datos del negocio en el pie:** nombre, dirección, teléfono y correo, siempre visibles (Ley Federal de Protección al Consumidor, art. 76 bis). Función `contacto`, fija.
- **Aviso de privacidad a nombre del negocio:** el responsable es el negocio (`titular`); 185ChangarroWeb solo maneja los datos por encargo (sección 12 de nuestros Términos). Se arma solo con lo prendido: qué datos pide la página, para qué, el pago externo si hay pedidos y el conteo de visitas si va el reporte mensual. Función `privacidad`, fija.
- **Leyenda de precios:** "Precios en pesos mexicanos, con IVA incluido" y la fecha desde la que valen. Profeco pide el precio total.
- **Promociones con vigencia y condiciones.**
- **Términos y Condiciones del negocio:** opcionales, pero obligatorios si la página recibe pedidos o pagos (`obligatoriaCon: ['pedidos']`). Llevan precios, formas de pago, anticipo, cancelaciones, devoluciones, promociones y la mención de Profeco.

Los textos llevan la etiqueta "Ejemplo" en la muestra. Son una base, no asesoría legal: antes de usarlos con clientes de verdad, que los revise un abogado.

Pendiente por giro (cuando se agreguen): un consultorio pone su cédula profesional en la publicidad (Ley General de Salud); un negocio que vende alcohol lleva las leyendas obligatorias y no le anuncia a menores.

## Cómo hacer la muestra de un negocio

La muestra es la base. Para cada negocio que todavía no contrata:

1. Copia a una carpeta nueva `muestra.html`, `muestra.css`, `muestra.js`, `muestra-datos.js`, `planes.js`, `logo.png` e `icono.png`. Con eso funciona sola, también con `file://`. En la copia, cambia el enlace del logo de `index.html` a `../index.html` para que regrese a la portada.
2. Cambia solo `muestra-datos.js`: `negocioEjemplo` y los datos de `NEGOCIO` (titular, dirección, teléfono, correo, productos, horario, promociones con vigencia y condiciones, términos). No hace falta tocar el código.
3. Lo que se guarda en el navegador va aparte por carpeta, así que una copia no hereda lo de otra.
4. Si la base cambia (una función nueva, algo legal), las copias viejas no se actualizan solas.

## Cómo agregar un giro

1. En `public/data.js`, copia un objeto de `GIROS` con una clave nueva, sin acentos (por ejemplo `gimnasio`).
2. Llena todos los campos. El comentario del inicio de `data.js` dice qué es cada uno.
3. Si ocupa otra fuente, agrégala al enlace de Google Fonts en `public/demo.html` y a `FONTS`.
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

Los precios oficiales están en `public/planes.js` (los muestran Tarifas, la portada y la Propuesta de la demo, que los toma de ahí) y en la sección 3 de `public/terminos.html`. Las funciones del catálogo no deben repetir algo que ya incluye un plan, y `EXTRAS` de `data.js` solo lista funciones que existen en el catálogo.
