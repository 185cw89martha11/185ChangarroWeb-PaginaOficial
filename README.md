# 185ChangarroWeb

Demo interactiva para enseñarle a un negocio cómo se vería su página web, más una propuesta de paquetes con mantenimiento.

## Usarla

1. Abre `public/index.html` en el navegador (o corre el servidor, ver abajo).
2. En el panel, escribe el nombre del negocio, elige su giro y su color, y prende o apaga funciones.
3. Pica **Presentar** para enseñársela al cliente sin el panel. Para salir, usa el botón "Salir de presentación" o la tecla Esc.
4. En la pestaña **Propuesta**, pica **Editar precios** para ajustar los montos. Se guardan en ese navegador.

## Correrla con Node

Necesita Node.js 20 o más nuevo. No tiene dependencias.

```
npm start
```

Abre http://localhost:3000. Las páginas son `/` (demo) y `/tarifas`. `npm run dev` reinicia el servidor solo al guardar cambios.

## Subirla a Render.com

1. Sube esta carpeta a un repositorio de GitHub (que `package.json` quede en la raíz del repositorio).
2. En Render: **New > Blueprint** y elige el repositorio. Render lee `render.yaml` y crea el servicio solo.
   - Si prefieres hacerlo a mano: **New > Web Service**, Runtime `Node`, Build `npm install`, Start `npm start`, Health check `/salud`.
3. Cada vez que hagas push a GitHub, Render vuelve a publicar la página.

En el plan gratis, el servicio se duerme después de 15 minutos sin visitas y tarda unos 50 segundos en despertar. Ábrela un rato antes de enseñársela a un cliente.

## Archivos

- `public/index.html`: estructura de la demo.
- `public/tarifas.html`: página de planes y precios.
- `public/styles.css`: estilos.
- `public/data.js`: giros, precios, funciones y textos. Aquí se cambia el contenido.
- `public/app.js`: lo que hace funcionar la demo.
- `server.js`: servidor para Render. Solo entrega lo que está en `public/`.
- `package.json`, `render.yaml`, `.node-version`: configuración de Node y Render.
- `CLAUDE.md`: contexto y reglas del proyecto para Claude Code.
