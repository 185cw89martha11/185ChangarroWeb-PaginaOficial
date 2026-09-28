# Buzón de solicitudes (Hoja de Google)

Cuando alguien acepta los Términos en `/terminos`, su aceptación se guarda en una Hoja de Google que funciona como buzón. El panel `/admin` la descarga a su navegador (cifrada con la clave) y la borra de la Hoja.

Se configura una sola vez, con la cuenta **185changarroweb@gmail.com**.

## 1. Crear la Hoja y el Apps Script

1. En Google Drive, crea una Hoja de cálculo nueva. Ponle un nombre como `Buzón 185ChangarroWeb`. No la compartas con nadie.
2. En la Hoja: **Extensiones > Apps Script**.
3. Borra lo que trae el editor y pega todo el contenido de `apps-script.gs`. Guarda (ícono de disco).
4. En el menú de la izquierda, **Configuración del proyecto** (engrane) > **Propiedades de la secuencia de comandos** > **Agregar propiedad**:
   - Propiedad: `SECRETO`
   - Valor: una frase larga y al azar, de 30 caracteres o más, que no uses en otro lado. Anótala; la vas a usar en el paso 2.
5. Arriba a la derecha, **Implementar > Nueva implementación**:
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo** (185changarroweb@gmail.com).
   - Quién tiene acceso: **Cualquier usuario** (en inglés, **Anyone**). No elijas "Cualquier usuario con cuenta de Google" (**Anyone with a Google account**): con esa opción Google le pide a Render iniciar sesión y no llega nada a la Hoja. Es necesario para que Render pueda entrar; sin el `SECRETO`, el script no hace nada.
   - Pica **Implementar**, autoriza los permisos y copia la **URL de la aplicación web** (termina en `/exec`).

## 2. Configurar Render

En Render, abre el servicio `185changarroweb` > **Environment** y agrega estas tres variables:

| Variable | Valor |
|---|---|
| `ADMIN_CLAVE_HASH` | La línea que está después de `ADMIN_CLAVE_HASH=` en el archivo `.env.local` de esta computadora. Es la huella de la clave, no la clave. |
| `APPS_SCRIPT_URL` | La URL `/exec` del paso 1.5. |
| `APPS_SCRIPT_SECRETO` | El mismo valor de `SECRETO` del paso 1.4. |

Guarda. Render vuelve a publicar solo.

Mientras falte `APPS_SCRIPT_URL`, la página de Términos sigue funcionando por WhatsApp y correo, pero avisa que no se pudo guardar en el registro.

## 3. Probar

1. Abre la página publicada en `/terminos`, llena el formulario con datos de prueba y pica **Aceptar**. Debe decir "Su aceptación también quedó guardada en el registro".
2. En la Hoja aparece una fila nueva.
3. Abre `/admin`, escribe la clave y verifica que aparezca en **Nuevas**. La fila de la Hoja desaparece.
4. Bórrala con **Borrar definitivamente**.

## Cambiar la clave del panel

1. En esta carpeta, corre:
   ```
   node -e "const c=require('crypto'),s=c.randomBytes(16),h=c.pbkdf2Sync(process.argv[1],s,600000,32,'sha256');console.log('pbkdf2$600000$'+s.toString('base64')+'$'+h.toString('base64'))" "LA_CLAVE_NUEVA"
   ```
2. Pon el resultado en `ADMIN_CLAVE_HASH` de Render y en `.env.local`.
3. Las solicitudes que ya están en el navegador siguen cifradas con la clave anterior. Antes de cambiarla, exporta las guardadas en PDF.

## Si cambias el Apps Script

Después de editar el código: **Implementar > Administrar implementaciones > Editar (lápiz) > Versión: Nueva versión > Implementar**. La URL no cambia.
