/* 185ChangarroWeb — panel de administración de solicitudes.
   - Pide la clave cada vez que se abre y se vuelve a bloquear tras 15 minutos sin uso.
   - Descarga las solicitudes del servidor, las guarda en IndexedDB de este navegador cifradas con la clave (AES-GCM)
     y después las quita del buzón del servidor.
   - Cada solicitud lleva una huella SHA-256 de sus datos. Sirve para notar si un PDF exportado se modificó. */
(function(){
  'use strict';
  var DB = '185cw-admin', ITER = 600000, INACTIVO_MS = 15 * 60 * 1000;
  var CAMPOS = ['id','recibida','version','nombre','negocio','plan','medio','contacto','terminos','privacidad','ejemplo','promociones','mensaje'];
  var S = { clave:null, key:null, token:null, almacen:undefined, lista:[], tab:'nuevas', confirmar:null, marcada:null };
  var enc = new TextEncoder(), dec = new TextDecoder();
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function fecha(iso){ try{ return new Date(iso).toLocaleString('es-MX', {dateStyle:'long', timeStyle:'short'}); }catch(e){ return iso || ''; } }
  function siNo(v){ return v ? 'Sí' : 'No'; }

  // ---------- IndexedDB ----------
  function abrir(){
    return new Promise(function(res, rej){
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function(){ var db = r.result; db.createObjectStore('meta'); db.createObjectStore('solicitudes', {keyPath:'id'}); };
      r.onsuccess = function(){ res(r.result); };
      r.onerror = function(){ rej(r.error); };
    });
  }
  function op(store, modo, fn){
    return abrir().then(function(db){
      return new Promise(function(res, rej){
        var t = db.transaction(store, modo), req = fn(t.objectStore(store));
        t.oncomplete = function(){ db.close(); res(req ? req.result : undefined); };
        t.onerror = t.onabort = function(){ db.close(); rej(t.error); };
      });
    });
  }
  function leer(store, k){ return op(store, 'readonly', function(s){ return s.get(k); }); }
  function todas(){ return op('solicitudes', 'readonly', function(s){ return s.getAll(); }); }
  function poner(store, v, k){ return op(store, 'readwrite', function(s){ return k === undefined ? s.put(v) : s.put(v, k); }); }
  function quitar(id){ return op('solicitudes', 'readwrite', function(s){ return s.delete(id); }); }

  // ---------- cifrado y huella ----------
  function b64(buf){ var b = new Uint8Array(buf), s = ''; for(var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s); }
  function unb64(s){ var b = atob(s), u = new Uint8Array(b.length); for(var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function derivar(clave, sal){
    return crypto.subtle.importKey('raw', enc.encode(clave), 'PBKDF2', false, ['deriveKey']).then(function(k){
      return crypto.subtle.deriveKey({name:'PBKDF2', salt:sal, iterations:ITER, hash:'SHA-256'}, k, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']);
    });
  }
  function cifrar(obj){
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.encrypt({name:'AES-GCM', iv:iv}, S.key, enc.encode(JSON.stringify(obj))).then(function(ct){ return {iv:b64(iv), data:b64(ct)}; });
  }
  function descifrar(c){
    return crypto.subtle.decrypt({name:'AES-GCM', iv:unb64(c.iv)}, S.key, unb64(c.data)).then(function(p){ return JSON.parse(dec.decode(p)); });
  }
  function huella(s){
    var canon = JSON.stringify(CAMPOS.map(function(k){ return [k, s[k] === undefined ? null : s[k]]; }));
    return crypto.subtle.digest('SHA-256', enc.encode(canon)).then(function(h){
      return Array.prototype.map.call(new Uint8Array(h), function(b){ return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  // ---------- servidor ----------
  var enLinea = /^https?:$/.test(location.protocol);
  function pedir(metodo, ruta, cuerpo){
    return fetch(ruta, {
      method: metodo,
      headers: Object.assign({'Content-Type':'application/json'}, S.token ? {Authorization:'Bearer ' + S.token} : {}),
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    }).then(function(r){ return r.json().then(function(d){ d.status = r.status; return d; }); });
  }
  function entrarServidor(){
    return pedir('POST', '/api/admin/entrar', {clave:S.clave}).then(function(d){
      if(d.ok){ S.token = d.token; S.almacen = d.almacen; }
      return d;
    });
  }
  // Si la sesión del servidor venció (por ejemplo, porque Render se durmió), vuelve a entrar una vez.
  function api(metodo, ruta, cuerpo){
    return pedir(metodo, ruta, cuerpo).then(function(d){
      if(d.status !== 401) return d;
      return entrarServidor().then(function(e){ if(!e.ok) throw new Error(e.error || 'Sin acceso'); return pedir(metodo, ruta, cuerpo); });
    });
  }

  // ---------- entrar ----------
  $('lock-form').addEventListener('submit', function(e){
    e.preventDefault();
    var clave = $('clave').value.trim(), err = $('lock-err'), btn = $('lock-btn');
    if(!clave) return;
    if(!window.crypto || !crypto.subtle || !window.indexedDB){
      err.textContent = 'Este navegador no permite el panel. Ábralo desde la dirección https de la página.'; err.hidden = false; return;
    }
    err.hidden = true; btn.disabled = true; btn.textContent = 'Revisando…';
    S.clave = clave;
    var servidorOk = false, sinConexion = false;
    (enLinea ? entrarServidor().then(function(d){
      if(d.status === 401 || d.status === 429) throw new Error(d.error);
      servidorOk = !!d.ok;
    }, function(){ sinConexion = true; }) : Promise.resolve(sinConexion = true))
    .then(function(){ return leer('meta', 'check'); })
    .then(function(meta){
      if(!meta && !servidorOk) throw new Error('La primera vez se necesita conexión con el servidor.');
      var sal = meta ? unb64(meta.sal) : crypto.getRandomValues(new Uint8Array(16));
      return derivar(clave, sal).then(function(k){
        S.key = k;
        if(meta) return descifrar(meta.check).then(function(v){ if(v !== '185cw-ok') throw 0; }, function(){ throw new Error('La clave no abre los datos guardados en este navegador.'); });
        return cifrar('185cw-ok').then(function(c){ return poner('meta', {sal:b64(sal), check:c}, 'check'); });
      });
    })
    .then(function(){
      $('clave').value = '';
      $('lock').hidden = true; $('app').hidden = false;
      try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); }catch(e){}
      vigilarInactividad();
      if(sinConexion) estado('Sin conexión con el servidor. Solo se muestran las solicitudes que ya están en este navegador.');
      return servidorOk ? buscar() : cargar();
    })
    .catch(function(e){
      S.clave = S.key = S.token = null;
      err.textContent = (e && e.message) || 'Clave incorrecta.'; err.hidden = false;
    })
    .then(function(){ btn.disabled = false; btn.textContent = 'Entrar'; });
  });

  function cerrar(){ S.clave = S.key = S.token = null; location.reload(); }
  $('btn-salir').addEventListener('click', cerrar);
  function vigilarInactividad(){
    var t;
    function reiniciar(){ clearTimeout(t); t = setTimeout(cerrar, INACTIVO_MS); }
    ['pointerdown','keydown','scroll'].forEach(function(ev){ document.addEventListener(ev, reiniciar, {passive:true}); });
    reiniciar();
  }

  function estado(txt){ $('status').textContent = txt; }
  function textoAlmacen(){
    if(S.almacen === 'google') return 'Buzón: Hoja de Google.';
    if(S.almacen === 'local') return 'Buzón: archivo de prueba en esta computadora.';
    if(S.almacen === null) return 'El buzón del servidor no está configurado; no llegan solicitudes nuevas.';
    return '';
  }

  // ---------- traer del servidor ----------
  function buscar(){
    if(!S.token){ return cargar(); }
    $('btn-buscar').disabled = true; estado('Buscando solicitudes nuevas…');
    var traidas = 0;
    return api('GET', '/api/admin/solicitudes').then(function(d){
      if(!d.ok) throw new Error(d.error);
      var lista = (d.solicitudes || []).filter(function(s){ return s && typeof s.id === 'string'; }), ids = [];
      return lista.reduce(function(p, s){
        return p.then(function(){ return leer('solicitudes', s.id); }).then(function(ya){
          ids.push(s.id);
          if(ya) return;
          traidas++;
          return Promise.all([huella(s), cifrar(s)]).then(function(r){
            return poner('solicitudes', {id:s.id, estado:'nueva', huella:r[0], recibida:s.recibida, iv:r[1].iv, data:r[1].data});
          });
        });
      }, Promise.resolve()).then(function(){
        // Ya están en este navegador: se quitan del buzón del servidor.
        if(ids.length) return api('POST', '/api/admin/solicitudes/quitar', {ids:ids});
      });
    }).then(function(){
      estado((traidas ? traidas + (traidas === 1 ? ' solicitud nueva descargada. ' : ' solicitudes nuevas descargadas. ') : 'No hay solicitudes nuevas. ') + textoAlmacen() + ' Revisado: ' + new Date().toLocaleTimeString('es-MX', {timeStyle:'short'}) + '.');
    }, function(e){
      estado('No se pudo revisar el servidor (' + ((e && e.message) || 'sin conexión') + '). Se muestran las que ya están en este navegador.');
    }).then(function(){ $('btn-buscar').disabled = false; return cargar(); });
  }
  $('btn-buscar').addEventListener('click', buscar);

  // ---------- mostrar ----------
  function cargar(){
    return todas().then(function(filas){
      return Promise.all(filas.map(function(f){
        return descifrar(f).then(function(s){ return {id:f.id, estado:f.estado, huella:f.huella, guardada:f.guardada, s:s}; }, function(){ return null; });
      }));
    }).then(function(l){
      S.lista = l.filter(Boolean).sort(function(a, b){ return String(b.s.recibida).localeCompare(String(a.s.recibida)); });
      pintar();
    });
  }

  function fila(k, v){ return '<div class="fact"><span>' + k + '</span><b>' + v + '</b></div>'; }
  function consentimiento(v){ return '<span' + (v ? ' class="yes"' : '') + '>' + siNo(v) + '</span>'; }

  function pintar(){
    var nuevas = S.lista.filter(function(x){ return x.estado === 'nueva'; });
    var guardadas = S.lista.filter(function(x){ return x.estado === 'guardada'; });
    $('n-nuevas').textContent = '(' + nuevas.length + ')';
    $('n-guardadas').textContent = '(' + guardadas.length + ')';
    $('tab-nuevas').setAttribute('aria-selected', S.tab === 'nuevas');
    $('tab-guardadas').setAttribute('aria-selected', S.tab === 'guardadas');
    $('tools-guardadas').hidden = S.tab !== 'guardadas' || !guardadas.length;
    $('verify').hidden = S.tab !== 'guardadas';

    var ver = S.tab === 'nuevas' ? nuevas : guardadas;
    if(!ver.length){
      $('list').innerHTML = '<div class="empty">' + (S.tab === 'nuevas' ? 'No hay solicitudes nuevas. Use <b>Buscar nuevas</b> para revisar el servidor.' : 'Todavía no hay solicitudes guardadas.') + '</div>';
      return;
    }
    $('list').innerHTML = ver.map(function(x){
      var s = x.s, conf = S.confirmar === x.id;
      return '<article class="card' + (S.marcada === x.id ? ' hit' : '') + '" data-id="' + esc(x.id) + '">'
        + '<div class="card-top"><div><h2>' + esc(s.negocio) + '</h2><p class="who">' + esc(s.nombre) + '</p></div>'
        + '<div class="date">Recibida: ' + esc(fecha(s.recibida)) + (x.guardada ? '<br>Guardada: ' + esc(fecha(x.guardada)) : '') + '</div></div>'
        + '<div class="facts">'
        + fila('Plan', esc(s.plan))
        + fila('Avisos por', esc(s.medio) + ': ' + esc(s.contacto))
        + fila('Términos y Condiciones', consentimiento(s.terminos))
        + fila('Aviso de Privacidad', consentimiento(s.privacidad))
        + fila('Mostrar como ejemplo', consentimiento(s.ejemplo))
        + fila('Avisos y promociones', consentimiento(s.promociones))
        + fila('Versión de los documentos', esc(s.version))
        + '</div>'
        + '<details><summary>Mensaje de aceptación completo</summary><pre>' + esc(s.mensaje) + '</pre></details>'
        + '<p class="hash">Huella SHA-256: ' + esc(x.huella) + '</p>'
        + '<div class="actions">'
        + (conf
          ? '<div class="confirm">¿Borrar esta solicitud para siempre? No se puede deshacer. <button class="btn danger solid" data-act="borrar-si">Sí, borrar</button><button class="btn" data-act="cancelar">Cancelar</button></div>'
          : (x.estado === 'nueva' ? '<button class="btn pri" data-act="guardar">Guardar</button>' : '<button class="btn pri" data-act="exportar">Exportar (PDF)</button>')
            + '<button class="btn danger" data-act="borrar">Borrar definitivamente</button>')
        + '</div></article>';
    }).join('');
  }

  $('tab-nuevas').addEventListener('click', function(){ S.tab = 'nuevas'; S.confirmar = null; pintar(); });
  $('tab-guardadas').addEventListener('click', function(){ S.tab = 'guardadas'; S.confirmar = null; pintar(); });

  $('list').addEventListener('click', function(e){
    var b = e.target.closest('button[data-act]'); if(!b) return;
    var id = b.closest('.card').dataset.id, act = b.dataset.act;
    var x = S.lista.filter(function(y){ return y.id === id; })[0]; if(!x) return;
    if(act === 'borrar'){ S.confirmar = id; return pintar(); }
    if(act === 'cancelar'){ S.confirmar = null; return pintar(); }
    if(act === 'borrar-si'){
      S.confirmar = null;
      return quitar(id).then(function(){ estado('Solicitud de ' + x.s.negocio + ' borrada definitivamente.'); return cargar(); });
    }
    if(act === 'guardar'){
      return leer('solicitudes', id).then(function(f){
        f.estado = 'guardada'; f.guardada = new Date().toISOString();
        return poner('solicitudes', f);
      }).then(function(){ estado('Solicitud de ' + x.s.negocio + ' guardada. Está en la pestaña Guardadas.'); return cargar(); });
    }
    if(act === 'exportar') exportar([x]);
  });

  // ---------- exportar ----------
  function exportar(lista){
    var hoy = new Date();
    var html = '<div class="d-head"><img src="logo.png" alt=""><div><h1>Constancias de aceptación</h1>'
      + '<div>185ChangarroWeb · Generado el ' + esc(hoy.toLocaleString('es-MX', {dateStyle:'long', timeStyle:'short'})) + '</div></div></div>'
      + '<p class="d-note">Cada constancia lleva una huella SHA-256 calculada sobre sus datos al recibirla. La huella original también queda guardada en el panel de 185ChangarroWeb. '
      + 'Si cualquier dato de este documento se cambia, ya no corresponde con la solicitud original que tiene esa huella.</p>';
    html += lista.map(function(x){
      var s = x.s;
      return '<section class="d-rec"><h2>' + esc(s.negocio) + '</h2><table>'
        + '<tr><td>Nombre</td><td>' + esc(s.nombre) + '</td></tr>'
        + '<tr><td>Negocio</td><td>' + esc(s.negocio) + '</td></tr>'
        + '<tr><td>Plan</td><td>' + esc(s.plan) + '</td></tr>'
        + '<tr><td>Avisos por</td><td>' + esc(s.medio) + ': ' + esc(s.contacto) + '</td></tr>'
        + '<tr><td>Acepta Términos y Condiciones</td><td>' + siNo(s.terminos) + '</td></tr>'
        + '<tr><td>Acepta Aviso de Privacidad</td><td>' + siNo(s.privacidad) + '</td></tr>'
        + '<tr><td>Autoriza mostrar su página como ejemplo</td><td>' + siNo(s.ejemplo) + '</td></tr>'
        + '<tr><td>Quiere avisos y promociones</td><td>' + siNo(s.promociones) + '</td></tr>'
        + '<tr><td>Versión de los documentos</td><td>' + esc(s.version) + '</td></tr>'
        + '<tr><td>Recibida</td><td>' + esc(fecha(s.recibida)) + '</td></tr>'
        + (x.guardada ? '<tr><td>Guardada</td><td>' + esc(fecha(x.guardada)) + '</td></tr>' : '')
        + '<tr><td>Identificador</td><td class="d-hash">' + esc(s.id) + '</td></tr>'
        + '<tr><td>Huella SHA-256</td><td class="d-hash">' + esc(x.huella) + '</td></tr>'
        + '</table><pre>' + esc(s.mensaje) + '</pre></section>';
    }).join('');
    $('doc').innerHTML = html;
    var titulo = document.title;
    document.title = 'Constancias 185ChangarroWeb ' + hoy.toISOString().slice(0, 10);
    var img = $('doc').querySelector('img');
    function imprimir(){ window.print(); document.title = titulo; }
    if(img && !img.complete){ img.onload = img.onerror = imprimir; } else imprimir();
  }
  $('btn-exportar-todas').addEventListener('click', function(){
    exportar(S.lista.filter(function(x){ return x.estado === 'guardada'; }));
  });

  // ---------- comprobar ----------
  $('verify-form').addEventListener('submit', function(e){
    e.preventDefault();
    var h = $('verify-in').value.trim().toLowerCase().replace(/\s+/g, ''), res = $('verify-res');
    var x = S.lista.filter(function(y){ return y.huella === h; })[0];
    S.marcada = x ? x.id : null;
    res.hidden = false;
    if(x){
      res.innerHTML = '<b class="yes">Coincide</b> con la solicitud de <b>' + esc(x.s.negocio) + '</b> (' + esc(x.s.nombre) + '). Compare los datos del PDF con la tarjeta marcada: deben ser idénticos.';
      S.tab = x.estado === 'nueva' ? 'nuevas' : 'guardadas';
      pintar();
      var card = document.querySelector('.card.hit'); if(card) card.scrollIntoView({block:'center'});
    } else {
      res.innerHTML = '<b style="color:var(--danger)">No coincide</b> con ninguna solicitud de este navegador. El documento pudo haberse modificado, o la solicitud se borró.';
      pintar();
    }
  });
})();
