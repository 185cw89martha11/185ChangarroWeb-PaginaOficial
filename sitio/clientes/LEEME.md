# Clientes

Cada carpeta de aquí se publica como página: en `https://<urlSitio>/<carpeta>/` y, si tiene `dominio`, en su propio dominio (pasos en el README).

- El nombre de la carpeta lleva **minúsculas, números y guiones**: `tacos-el-guero`, `barberia-los-primos`.
- Adentro van `datos.json` y, si hay, las fotos.
- Las carpetas que empiezan con `_`, como `_ejemplo`, **no se publican**. `_ejemplo/datos.json` es un ejemplo completo para copiar.
- La forma más fácil de crear el `datos.json` es el botón **Descargar datos** en `/crear/`, o `npm run nuevo -- <carpeta> <giro>`.

## Campos de `datos.json`

### Datos del negocio (van visibles en el pie, como pide Profeco)
| Campo | Ejemplo | Notas |
|---|---|---|
| `tipo` | `"restaurante"` | `restaurante`, `barberia`, `salud`, `taller`, `tienda` o `gimnasio`. |
| `nombre` | `"Tacos El Güero"` | **Obligatorio.** Nombre comercial. |
| `titular` | `"Juan Pérez López"` | Nombre legal o razón social. Es el responsable en el aviso de privacidad. Si se deja vacío, se usa `nombre`. |
| `whatsapp` | `"3312345678"` | 10 dígitos, o 52 + 10. Ahí llegan pedidos y citas. |
| `telefono` | `"33 1234 5678"` | Agrega el botón "Llamar". |
| `correo` | `"contacto@negocio.com"` | Va en el pie y en el aviso de privacidad (derechos ARCO). |
| `direccion` | `"Hidalgo 12, Centro"` | Calle, número y colonia. |
| `zona` | `"Autlán, Jal."` | Colonia o ciudad. Aparece en el título para Google. |
| `mapa` | `"https://maps.app.goo.gl/abc"` | Opcional: el enlace de "Compartir" de Google Maps, para que "Cómo llegar" sea exacto. |
| `cedula` | `"Céd. Prof. 1234567"` | **Consultorios**: la Ley General de Salud la pide en la publicidad. |

### Contenido
| Campo | Ejemplo | Notas |
|---|---|---|
| `eslogan` | `"Los mejores tacos de {zona}"` | Frase de la portada. Admite `{nombre}` y `{zona}`. |
| `horario` | `{"lun": "09:00-20:00", …, "dom": ""}` | Días `lun mar mie jue vie sab dom`. Vacío = cerrado. Dos turnos: `"09:00-14:00, 16:00-20:00"`. Después de medianoche: `"18:00-02:00"`. Todo el día: `"24 horas"`. |
| `catalogo` | ver abajo | Categorías con productos. `[]` oculta la sección. **Si falta el campo, salen productos de ejemplo.** |
| `pedidos` | `true` | Activa el carrito de pedidos por WhatsApp. Con carrito, los **términos y condiciones son obligatorios** y salen solos. |
| `entrega` | `"Envío gratis en la colonia"` | Con texto, el carrito ofrece "A domicilio". `""` lo quita. |
| `pagos` | `["Efectivo", "Transferencia"]` | Formas de pago. |
| `nosotros` | `"Somos una familia…"` | Sección "Nosotros"; para separar párrafos, deje una línea vacía (`\n\n`). `""` la oculta. |
| `destacados` | `[{"icono": "🔥", "titulo": "…", "texto": "…"}]` | Las 3 tarjetas bajo la portada. `[]` las oculta. |
| `preguntas` | `[{"p": "¿…?", "r": "…"}]` | Preguntas frecuentes. `{pagos}` se reemplaza por las formas de pago. |
| `redes` | `{"facebook": "", "instagram": "@tacos", "tiktok": ""}` | Enlace completo o @usuario. |
| `color` | `"#c2410c"` | Opcional: color propio. El texto se ajusta solo para que se lea. |
| `portada`, `logo` | `"portada.jpg"` | Imagen dentro de esta carpeta, o un enlace https. |
| `galeria` | `["foto1.jpg", "foto2.jpg"]` | Hasta 12 fotos. |

### Precios y textos legales
| Campo | Ejemplo | Notas |
|---|---|---|
| `preciosVigentes` | `"2026-10-05"` | Fecha desde la que valen los precios. Sale como "Precios en pesos mexicanos, con IVA incluido. Vigentes desde el 5 de octubre de 2026." |
| `leyendaPrecios` | `"Precios en MXN, IVA incluido."` | Opcional: reemplaza la leyenda completa. |
| `terminos` | `{"anticipo": "…", "cancelaciones": "…", "devoluciones": "…", "promociones": "…", "extra": "…"}` | Opcional: condiciones propias del negocio. Lo que quede vacío usa un texto base. Si el negocio no recibe pedidos pero quiere términos, basta con poner este campo. |
| `estadisticas` | `{"goatcounter": "tacos-el-guero"}` o `{"cloudflare": "TOKEN"}` | Opcional: contador de visitas sin cookies para el **reporte mensual**. GoatCounter cuenta también los clics a WhatsApp. Al activarlo, el aviso de privacidad lo menciona solo. Revise las condiciones de cada servicio. |

> El **aviso de privacidad** (a nombre del `titular`) y los **términos** se generan solos con los datos del negocio y van al pie de la página. Son textos base: que los revise un abogado antes de usarlos con clientes reales.

### Publicación
| Campo | Ejemplo | Notas |
|---|---|---|
| `dominio` | `"https://www.tacoselguero.site"` | Su dominio propio. Sirve para el SEO, el QR y el sitemap. |
| `ocultarCredito` | `true` | Quita "Página creada con 185ChangarroWeb" del pie. |
| `zonaHoraria` | `"America/Tijuana"` | Solo si no está en el horario del centro: `America/Cancun`, `America/Hermosillo`, `America/Mazatlan`, `America/Tijuana`. |
| `formato24h` | `true` | Horas como 13:00 en vez de 1:00 pm. |
| `catalogoTitulo`, `catalogoIntro`, `nosotrosTitulo`, `seoTitulo` | | Opcionales, para cambiar esos textos. |
| `_notas` | `"Plan Negocio, anticipo 05/10"` | Todo campo que empieza con `_` **no se publica**: úselo para sus apuntes. |

### Catálogo
```json
"catalogo": [
  { "categoria": "Tacos", "productos": [
    { "nombre": "Pastor", "precio": 18, "descripcion": "Con piña y cilantro", "foto": "pastor.jpg" },
    { "nombre": "Orden para 4", "precio": "Desde $250" },
    { "nombre": "Taquiza", "precio": "Cotizar" }
  ]}
]
```
- Un `precio` numérico (`18` o `"18"`) se muestra como `$18` y se suma en el carrito.
- Un texto (`"Desde $250"`, `"Cotizar"`) se muestra tal cual y en el carrito sale "por cotizar".

## Antes de publicar
Abra `VER-SITIO.cmd` y revise `http://localhost:4321/<carpeta>/`. La ventana muestra **avisos** si falta algo: datos del pie, fecha de precios, cédula o fotos que no encuentra. Si un `datos.json` tiene un error grave, ese cliente no se genera y Render conserva la versión anterior.
