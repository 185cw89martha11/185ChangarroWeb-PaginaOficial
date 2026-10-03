# Checklist de entrega (cuando el negocio contrata)

## 1. Contratación
- [ ] El cliente confirmó el plan y **aceptó por escrito** los Términos (portal → `terminos.html#aceptar`, por WhatsApp o correo).
- [ ] Recibió el **50% de la instalación**.
- [ ] Anotó en `/prospectar/` el estado "Vendido", y en `_notas` del `datos.json` el plan, el monto y la fecha.

## 2. Información del negocio
Use el mensaje de cierre de [guiones.md](guiones.md#4-cierre). Necesita:
- [ ] Nombre del negocio y **nombre legal o razón social** (`titular`, va en el aviso de privacidad).
- [ ] WhatsApp, **teléfono**, **correo** y **dirección completa**. Los cuatro van visibles en el pie de la página, como pide Profeco.
- [ ] Ubicación de Google Maps: el enlace `maps.app.goo.gl/…` del botón "Compartir" va en `"mapa"`.
- [ ] Horario de cada día.
- [ ] Menú, servicios o productos con precios, y la **fecha desde la que valen** (`preciosVigentes`).
- [ ] Logo (si no tiene, se hace uno sencillo), fotos, redes sociales y formas de pago.
- [ ] Si recibe pedidos: anticipo, cancelaciones y devoluciones para sus términos (`terminos`). Si no los da, se usan los textos base.
- [ ] Consultorios: **cédula profesional** (la Ley General de Salud la pide en la publicidad).
- [ ] Dominio elegido (.xyz, .online, .site o .shop incluido el primer año; .com o .com.mx cuesta $100 más).

## 3. Armar la página
- [ ] En `/crear/` capture todo y toque **Descargar datos**. Guárdelo como `clientes/<nombre-del-negocio>/datos.json`. O use la terminal: `npm run nuevo -- <carpeta> <giro>`.
- [ ] Complete en el archivo `titular`, `correo`, `preciosVigentes` y, si aplica, `terminos` y `cedula` (guía en [clientes/LEEME.md](../clientes/LEEME.md)).
- [ ] Fotos comprimidas (https://squoosh.app, de preferencia menos de 300 KB cada una) dentro de la carpeta del cliente.
- [ ] Revise con `VER-SITIO.cmd` → `http://localhost:4321/<carpeta>/`. **Lea los avisos** que imprime la ventana: le dicen qué falta.
- [ ] Revise en modo celular: botones de WhatsApp, carrito, "Cómo llegar", aviso de privacidad y términos.

## 4. Dominio y publicación
- [ ] Registre el dominio **a nombre del negocio**.
- [ ] `git add clientes && git commit -m "Cliente: <nombre>" && git push`
- [ ] En Render: **New + → Static Site** con el mismo repositorio. Build `node scripts/build.js`, Publish Directory `dist/<carpeta>`.
- [ ] En ese sitio: **Settings → Custom Domains** → agregue el dominio y configure el DNS que le indique Render.
- [ ] En `datos.json`: `"dominio": "https://www.sudominio.site"`. Haga push otra vez.
- [ ] Abra el dominio en su celular y pruebe todo, incluido el cartel QR en `/qr/`.

## 5. Ficha de Google Maps (desde el plan Negocio)
La ficha **es del negocio**: hágala junto con el dueño, desde su cuenta de Google.
1. https://business.google.com con la cuenta del dueño → buscar el negocio → reclamarlo o crearlo.
2. Categoría correcta, dirección (o zona de servicio), teléfono, **sitio web = su dominio**, horario y fotos.
3. Verificación: Google decide el método (video, llamada, correo o tarjeta postal) y la completa el dueño.
4. Si van a ayudarle después, que agregue a 185ChangarroWeb como **administrador**, nunca como propietario.
5. Genere el QR para pedir reseñas (el plan lo incluye) con el enlace "Pedir reseñas" de la ficha y la herramienta `/herramientas/link-de-whatsapp/` o cualquier generador de QR.

## 6. Entrega
- [ ] Cobre el **otro 50%** de la instalación.
- [ ] Envíe el mensaje de entrega de [guiones.md](guiones.md#5-entrega-y-después) con el dominio y el QR.
- [ ] Recuérdele que la **primera mensualidad** se paga un mes después de publicada la página. Anote la fecha.
- [ ] Pida permiso por escrito si quiere mostrar la página como ejemplo.
- [ ] Agende el seguimiento a 7 días.

## Cada mes (mantenimiento)
- [ ] Cambios de precios u horarios cuando los pida (diario si hace falta) y hasta 3 cambios al mes en fotos, textos o promociones: edite `datos.json`, haga `git push` y en 2 minutos queda.
- [ ] Respaldo mensual: el repositorio de git ya guarda cada versión; descargue además una copia de la carpeta del cliente.
- [ ] Reporte mensual de visitas y clics a WhatsApp. Ver la nota de abajo.
- [ ] Si el pago se atrasa más de 15 días, la página se pausa (no se borra), según las Tarifas.

> **Nota sobre el reporte de visitas:** este generador todavía no mide visitas. Para cumplir el reporte que incluye la mensualidad, pueden agregar un contador sin cookies (por ejemplo GoatCounter o Cloudflare Web Analytics) y mencionarlo en el aviso de privacidad del negocio, que es lo que pide la regla del portal.
