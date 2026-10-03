# 185ChangarroWeb: sitio de páginas web para negocios locales

Este proyecto es el **sitio de ventas y la fábrica de páginas** de 185ChangarroWeb:

- **Sitio público** con planes, ejemplos y preguntas. Los precios son los oficiales de `planes.js`.
- **Creador de vistas previas** (`/crear/`). El dueño del negocio, o usted, ve su página al instante y la pide por WhatsApp.
- **Prospección** (`/prospectar/`). Prepara en 1 minuto la vista previa de un negocio y el mensaje para enviársela.
- **Generador de páginas de clientes.** Cada cliente que contrata queda publicado, con su dominio, carrito por WhatsApp, horario de "abierto ahora", mapa, SEO local y la base legal (datos del negocio, leyenda de precios, aviso de privacidad y términos).
- **Herramienta gratis** (link de WhatsApp + QR) que atrae visitas desde Google.

> Es un complemento del portal oficial (`TuPropioLocalWeb/vitrina-local`): **usa los mismos planes, precios y Términos**. Los documentos legales oficiales (Tarifas completas, Términos y Condiciones, Aviso de Privacidad) se enlazan desde el portal; aquí no se duplican.

El plan para conseguir clientes está en **[PLAN-DE-INGRESOS.md](PLAN-DE-INGRESOS.md)**.

---

## Ver el sitio en su computadora

Hay tres formas:

1. **Doble clic en `VER-SITIO.cmd`.** Genera el sitio y lo abre en el navegador. Es la forma recomendada.
2. **Doble clic en `dist/index.html`**, después de haber corrido `npm run build` alguna vez. Funciona sin servidor.
3. En una terminal: `npm run dev`, que abre http://localhost:4321 y se actualiza solo al guardar cambios.

> Si alguna vez ve la página "en HTML", con imágenes enormes y el texto desacomodado, es una versión vieja de `dist/`. Corra `npm run build`, o use `VER-SITIO.cmd`, y vuelva a abrirla.

Cuando el sitio está abierto en su computadora, **los enlaces para compartir** (vistas previas y mensajes) **apuntan a la dirección pública** de `config.json` → `"urlSitio"`. Funcionarán en cuanto el sitio esté publicado.

---

## Qué hay en esta carpeta

```
VER-SITIO.cmd          ← doble clic para ver el sitio
config.json            ← datos de 185ChangarroWeb: WhatsApp, correo, URL, portal y planes
clientes/              ← una carpeta por cliente que contrató
src/
  presets.js           ← los 6 giros: textos, colores, letra y productos de ejemplo
  render.js            ← motor que arma las páginas de los negocios (Node y navegador)
  site.css / site.js   ← diseño y funciones de las páginas de los negocios
  agency/              ← sitio de 185ChangarroWeb: inicio, creador, vista previa, prospectar, herramienta
  static/              ← logo.svg y favicon.svg (logo compacto "185")
scripts/
  build.js             ← genera todo en dist/
  dev.js               ← servidor local con recarga
  nuevo-cliente.js     ← crea la carpeta de un cliente
  sincronizar-planes.js← copia los planes oficiales de planes.js a config.json
  test.js              ← pruebas automáticas
ventas/                ← guiones, prospección y entrega
redes/                 ← perfiles, calendario de 30 días y generador de imágenes
render.yaml            ← configuración para Render
```

| Dirección | Para qué sirve |
|---|---|
| `/` | Página de ventas: planes, ejemplos, preguntas y WhatsApp. |
| `/crear/` | Creador de vistas previas. |
| `/demo/…` | Vista previa que se comparte por enlace. Todos los datos viajan dentro del enlace. |
| `/prospectar/` | Herramienta interna para preparar mensajes y llevar la lista de prospectos. No aparece en Google. |
| `/ejemplos/<giro>/` | 6 negocios ficticios de muestra. |
| `/herramientas/link-de-whatsapp/` | Herramienta gratis para atraer visitas. |
| `/<cliente>/` y `/<cliente>/qr/` | Página del cliente y su cartel con QR. Con dominio propio, se publica además en su dominio. |

---

## Antes de publicar: revise `config.json`

Ya trae los datos de 185ChangarroWeb que encontré en el portal: WhatsApp `523151260581`, correo `185changarroweb@gmail.com` y los 3 planes oficiales. Revise:

- `"urlSitio"`: la dirección que le dé Render a **este** sitio. Es `https://one85changarroweb-negocios.onrender.com`: Render no acepta direcciones que empiecen con número y cambia el "1" inicial por "one". Para que diga "185" de verdad hace falta un dominio propio (vea abajo).
- `"portal"`: la dirección del portal oficial, donde están Tarifas, Términos y Aviso. Es `https://one85changarroweb.onrender.com`. Si cambia, actualícela aquí; si se deja vacía, esos enlaces no aparecen.
- `"redes"`: sus enlaces de Facebook, Instagram y TikTok cuando los tenga.
- `"tuNombre"`: opcional; aparece en los mensajes de prospección ("…le escribo de 185ChangarroWeb, soy …").

**Precios:** no los edite a mano. Si cambian en `planes.js` del portal, corra:
```bash
npm run planes
```
Ese comando solo **lee** el `planes.js` de `TuPropioLocalWeb` (no lo modifica) y actualiza `config.json`. Los textos de "Mantenimiento incluido" y "Pagos y contrato" de `config.json` están copiados de Tarifas (versión del 28 de septiembre de 2026); si Tarifas cambia, actualícelos también.

## Publicar en Render (gratis)

1. Suba esta carpeta a un repositorio de GitHub. Ya es un repositorio git con todo guardado:
   ```bash
   git remote add origin https://github.com/SU_USUARIO/185changarroweb-negocios.git
   git push -u origin main
   ```
2. En Render: **New + → Blueprint** y elija el repositorio (`render.yaml` ya trae todo). O a mano: **New + → Static Site**, Build Command `node scripts/build.js`, Publish Directory `dist`.
3. Si la dirección que le da Render no es la de `"urlSitio"`, cámbiela en `config.json` y vuelva a subir.

> Los sitios estáticos de Render son gratis y **no se duermen**, a diferencia del portal, que es Web Service. Si un cliente tiene un error en su `datos.json`, el build falla y **sigue en línea la versión anterior**.

---

## Publicar la página de un cliente que contrató

1. Arme su página en `/crear/`, o ábrala desde su vista previa con **Editar**, y toque **Descargar datos**. Guarde el archivo como `clientes/<nombre-del-negocio>/datos.json`.
   - O desde la terminal: `npm run nuevo -- tacos-el-guero restaurante`.
2. Llene los datos legales: `titular` (nombre legal o razón social), `telefono`, `correo`, `direccion` y `preciosVigentes`. Si es consultorio, también `cedula`. El build le avisa si falta algo.
3. Fotos: póngalas en esa misma carpeta (comprimidas en https://squoosh.app) y escriba su nombre en `portada`, `logo`, `galeria` o `foto`.
4. Revise con `VER-SITIO.cmd` → `http://localhost:4321/<carpeta>/` y suba los cambios con `git add`, `git commit` y `git push`.

**Dominio propio** (todos los planes lo incluyen):
1. Registre el dominio **a nombre del negocio**.
2. En Render cree **otro Static Site** con el mismo repositorio: Build `node scripts/build.js`, Publish Directory `dist/<carpeta-del-cliente>`.
3. En ese sitio, **Settings → Custom Domains** → agregue el dominio y ponga los registros DNS que le indique Render. El https es gratis.
4. En `datos.json` escriba `"dominio": "https://www.sudominio.site"`.

La guía de cada campo está en [clientes/LEEME.md](clientes/LEEME.md) y el checklist completo de entrega en [ventas/entrega.md](ventas/entrega.md).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Sitio local en http://localhost:4321 (lo abre solo y se actualiza al guardar) |
| `npm run build` | Genera `dist/`. Render lo hace solo en cada push |
| `npm run nuevo -- <carpeta> <giro>` | Cliente nuevo. Giros: restaurante, barberia, salud, taller, tienda, gimnasio |
| `npm run planes` | Copia los planes oficiales de `planes.js` a `config.json` |
| `npm test` | Pruebas del motor: seguridad, horarios, precios, enlaces y base legal |

## Reglas que respeta el sitio
- Los mismos planes, precios y condiciones que el portal oficial. **IVA incluido**.
- Las vistas previas dicen "Vista previa", no aparecen en Google y solo se publican cuando el negocio contrata.
- Los ejemplos son negocios ficticios y sus textos legales llevan la etiqueta "(ejemplo)".
- Cada página de cliente lleva los datos del negocio visibles, la leyenda de precios con fecha, el aviso de privacidad a nombre del negocio y los términos cuando recibe pedidos. **Son textos base: que los revise un abogado antes de usarlos con clientes reales.**
- Sin reseñas ni cifras inventadas, ni promesas de "primer lugar en Google".
