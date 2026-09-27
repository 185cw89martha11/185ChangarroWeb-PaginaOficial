/* 185ChangarroWeb — lógica de la demo. Los datos están en data.js. */
(function(){
  var D = window.VITRINA_DATA;
  var COLORS = D.COLORS, FONTS = D.FONTS, GIROS = D.GIROS, FEATURES = D.FEATURES, EXTRAS = D.EXTRAS,
      PLANS = D.PLANS, MANT = D.MANT, NEED = D.NEED, APARTE = D.APARTE;

  var STORE = 'vitrina-local-v1';
  var S = {giro:'restaurante', name:'', color:'chile', wa:'33 0000 0000', addr:'Av. Juárez 145, Centro', f:null};
  var A = {day:0, slot:null, done:false, err:''};
  var prices = {}; var offer = true;
  var chatState = {started:false};

  function $(s){ return document.querySelector(s); }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function norm(s){ return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
  function defaultsFor(giro){
    var f = {whats:true, agenda:true, eventos:true, chat:true, galeria:true, resenas:true, mapa:true, redes:true, faq:true, privacidad:true};
    var d = GIROS[giro].defaults || {}; for (var k in d) f[k] = d[k]; return f;
  }
  function load(){
    try{
      var raw = localStorage.getItem(STORE); if(!raw) return;
      var d = JSON.parse(raw);
      if(d.S){ ['giro','name','color','wa','addr'].forEach(function(k){ if(typeof d.S[k]==='string') S[k]=d.S[k]; }); if(d.S.f && typeof d.S.f==='object') S.f=d.S.f; }
      if(d.prices && typeof d.prices==='object') prices = d.prices;
      if(typeof d.offer==='boolean') offer = d.offer;
    }catch(e){}
  }
  function save(){ try{ localStorage.setItem(STORE, JSON.stringify({S:S, prices:prices, offer:offer})); }catch(e){} }

  load();
  if(!GIROS[S.giro]) S.giro='restaurante';
  if(!COLORS[S.color]) S.color = GIROS[S.giro].color;
  if(!S.f) S.f = defaultsFor(S.giro);
  S.f.privacidad = true;

  function G(){ return GIROS[S.giro]; }
  function bizName(){ return (S.name||'').trim() || G().name; }
  function initials(n){
    var skip = {de:1,del:1,la:1,el:1,los:1,las:1,y:1,e:1};
    var w = n.replace(/[&,.]/g,' ').split(/\s+/).filter(function(x){ return x && !skip[x.toLowerCase()]; });
    return ((w[0]||'N').charAt(0) + (w[1]? w[1].charAt(0):'')).toUpperCase();
  }
  function slug(n){ return norm(n).replace(/&/g,'y').replace(/[^a-z0-9]+/g,'').slice(0,28) || 'minegocio'; }
  function toMin(t){ var p=t.split(':'); return (+p[0])*60 + (+p[1]); }
  function openStatus(g){
    var now = new Date(), d = now.getDay();
    var e = g.hours.filter(function(h){ return h[1].indexOf(d) > -1; })[0];
    if(!e || !e[2]) return {on:false, txt:'Cerrado hoy'};
    var m = now.getHours()*60 + now.getMinutes(), o = toMin(e[2]), c = toMin(e[3]);
    if(c <= o) c += 1440;
    if(m >= o && m < c) return {on:true, txt:'Abierto · cierra ' + e[3]};
    if(m < o) return {on:false, txt:'Cerrado · abre ' + e[2]};
    return {on:false, txt:'Cerrado ahora'};
  }
  function openDays(g){
    var out = [], base = new Date(); base.setHours(12,0,0,0);
    for(var i=1; out.length<6 && i<15; i++){
      var x = new Date(base); x.setDate(base.getDate()+i);
      var e = g.hours.filter(function(h){ return h[1].indexOf(x.getDay()) > -1; })[0];
      if(e && e[2]) out.push(x);
    }
    return out;
  }
  function wk(x){ return x.toLocaleDateString('es-MX',{weekday:'short'}).replace('.',''); }
  function longDate(x){ return x.toLocaleDateString('es-MX',{weekday:'long', day:'numeric', month:'long'}); }

  var I = {
    pin:'<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>',
    phone:'<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h2.6l1.5 3.8-1.9 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-1.9 3.8 1.5v2.6a2 2 0 0 1-2.1 2A14.7 14.7 0 0 1 5 5.6a2 2 0 0 1 2-2.1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    cal:'<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  function mapSVG(){
    var street = (S.addr.split(/\d/)[0] || 'Calle principal').replace(/[#,]\s*$/,'').trim() || 'Calle principal';
    return '<svg viewBox="0 0 340 170" role="img" aria-label="Mapa de ubicación del negocio">'
      + '<rect width="340" height="170" fill="#ECE8DF"/>'
      + '<rect x="16" y="14" width="96" height="56" rx="6" fill="#D8E6CF"/>'
      + '<text x="64" y="46" text-anchor="middle" font-size="10" fill="#5E7352" font-family="Figtree, sans-serif">Jardín</text>'
      + '<rect x="232" y="108" width="94" height="48" rx="6" fill="#E2DDD1"/>'
      + '<rect x="16" y="108" width="118" height="48" rx="6" fill="#E2DDD1"/>'
      + '<rect x="176" y="14" width="68" height="56" rx="6" fill="#E2DDD1"/>'
      + '<path d="M0 89 H340" stroke="#FFFFFF" stroke-width="16"/>'
      + '<path d="M150 0 V170" stroke="#FFFFFF" stroke-width="11"/>'
      + '<path d="M266 0 V170" stroke="#FFFFFF" stroke-width="9"/>'
      + '<text x="14" y="92.5" font-size="9.5" fill="#6F6A5E" font-family="Figtree, sans-serif">' + esc(street) + '</text>'
      + '<circle cx="206" cy="86" r="17" style="fill:var(--brand)" opacity=".18"/>'
      + '<path d="M206 58c-8.8 0-15 6.4-15 14.3 0 10 15 22 15 22s15-12 15-22c0-7.9-6.2-14.3-15-14.3z" style="fill:var(--brand)"/>'
      + '<circle cx="206" cy="72.5" r="5" fill="#FFFFFF"/>'
      + '<rect x="226" y="57" width="84" height="22" rx="6" fill="#FFFFFF"/>'
      + '<text x="268" y="72" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1C1E1D" font-family="Figtree, sans-serif">Aquí estamos</text>'
      + '</svg>';
  }

  function agendaBody(g){
    var days = openDays(g);
    if(A.day >= days.length) A.day = 0;
    if(A.done){
      var d = days[A.day];
      return '<div class="s-ok"><strong>Listo, ' + esc(A.done) + '.</strong>'
        + '<p>Te esperamos el ' + esc(longDate(d)) + ' a las ' + esc(A.slot) + '. Te mandamos un recordatorio por WhatsApp un día antes.</p>'
        + '<button class="s-btn sec" type="button" data-act="again">Apartar otra</button></div>'
        + '<div class="s-note"><b>Para el negocio:</b> en la página real a usted le llega el aviso al momento y la cita aparece en su calendario.</div>';
    }
    var h = '<div class="s-days" role="group" aria-label="Día">';
    days.forEach(function(x, i){
      h += '<button class="s-day" type="button" data-act="day" data-i="' + i + '" aria-pressed="' + (i===A.day) + '"><small>' + esc(wk(x)) + '</small><b>' + x.getDate() + '</b></button>';
    });
    h += '</div><div class="s-slots" role="group" aria-label="Hora">';
    g.slots.forEach(function(t, si){
      var busy = ((A.day + si*2 + g.slots.length) % 5) === 1;
      h += '<button class="s-slot" type="button" data-act="slot" data-t="' + t + '"' + (busy ? ' disabled aria-label="' + t + ' ocupado"' : '') + ' aria-pressed="' + (A.slot===t) + '">' + t + '</button>';
    });
    h += '</div><div class="s-form"><input class="s-input" id="s-who" type="text" placeholder="Tu nombre" autocomplete="off" aria-label="Tu nombre">'
      + '<button class="s-btn pri" type="button" data-act="confirm">Confirmar</button></div>';
    if(A.err) h += '<p class="s-err">' + esc(A.err) + '</p>';
    return h;
  }

  function renderSite(){
    var g = G(), name = bizName(), st = openStatus(g), f = S.f;
    var screen = $('#screen');
    screen.style.setProperty('--brand', COLORS[S.color][1]);
    screen.style.setProperty('--display', FONTS[g.font]);
    $('#url').textContent = 'www.' + slug(name) + '.com.mx';
    var h = '';
    h += '<header class="s-head"><div class="s-logo" aria-hidden="true">' + esc(initials(name)) + '</div><div class="s-headname">' + esc(name) + '</div><span class="s-open ' + (st.on?'on':'off') + '">' + esc(st.txt) + '</span></header>';
    h += '<section class="s-hero"><div class="s-photo"><span>' + esc(g.heroPhoto) + '</span></div>'
      + '<h1 class="s-name">' + esc(name) + '</h1><p class="s-tag">' + esc(g.tag) + '</p>'
      + '<p class="s-addr">' + I.pin + esc(S.addr) + '</p><div class="s-ctas">';
    h += f.whats ? '<button class="s-btn wa" type="button" data-act="wa">' + I.phone + 'WhatsApp</button>' : '<button class="s-btn sec" type="button" data-act="call">' + I.phone + 'Llamar</button>';
    h += f.agenda ? '<button class="s-btn pri" type="button" data-act="goto" data-to="s-agenda">' + I.cal + esc(g.cta) + '</button>' : '<button class="s-btn pri" type="button" data-act="goto" data-to="s-menu">Ver ' + esc(g.menuTitle.toLowerCase()) + '</button>';
    h += '</div></section>';

    h += '<section class="s-sec" id="s-menu"><h3>' + esc(g.menuTitle) + '</h3><p class="s-sub">' + esc(g.menuSub) + '</p><ul class="s-menu">';
    g.items.forEach(function(it){ h += '<li><span class="n">' + esc(it[0]) + '</span><span class="dots" aria-hidden="true"></span><span class="p">' + esc(it[1]) + '</span></li>'; });
    h += '</ul></section>';

    if(f.agenda){ h += '<section class="s-sec" id="s-agenda"><h3>' + esc(g.agendaTitle) + '</h3><p class="s-sub">' + esc(g.agendaSub) + '</p><div id="s-agenda-body">' + agendaBody(g) + '</div></section>'; }

    if(f.eventos){
      h += '<section class="s-sec" id="s-eventos"><h3>Eventos y promociones</h3><p class="s-sub">Lo que viene en los próximos días.</p><div class="s-events">';
      g.events.forEach(function(ev){
        var x = new Date(); x.setDate(x.getDate() + ev[0]);
        var mon = x.toLocaleDateString('es-MX',{month:'short'}).replace('.','');
        h += '<div class="s-event"><div class="s-date"><small>' + esc(mon) + '</small><b>' + x.getDate() + '</b></div><div><strong>' + esc(ev[1]) + '</strong><span>' + esc(wk(x)) + ' · ' + esc(ev[2]) + '</span></div></div>';
      });
      h += '</div></section>';
    }

    if(f.galeria){
      h += '<section class="s-sec" id="s-galeria"><h3>Galería</h3><div class="s-gal">';
      g.gallery.forEach(function(lbl, i){
        var a = 38 + (i%3)*12, b = 62 + (i%2)*14, ang = 150 + i*17;
        h += '<div class="s-tile" style="background:linear-gradient(' + ang + 'deg, color-mix(in srgb, var(--brand) ' + a + '%, #FFFFFF), color-mix(in srgb, var(--brand) ' + b + '%, #000000))">' + esc(lbl) + '</div>';
      });
      h += '</div><p class="s-cap">Aquí van fotos reales del negocio.</p></section>';
    }

    if(f.resenas){
      h += '<section class="s-sec" id="s-resenas"><h3>Lo que dicen <span class="s-tagex">Ejemplo</span></h3><div class="s-revs">';
      g.reviews.forEach(function(r){ h += '<div class="s-rev"><div class="s-stars" aria-label="5 de 5 estrellas">★★★★★</div><p>' + esc(r[1]) + '</p><small>' + esc(r[0]) + '</small></div>'; });
      h += '</div></section>';
    }

    if(f.mapa){
      var today = new Date().getDay();
      h += '<section class="s-sec" id="s-mapa"><h3>Cómo llegar</h3><p class="s-sub">' + esc(S.addr) + '</p><div class="s-map">' + mapSVG() + '</div><table class="s-hours"><tbody>';
      g.hours.forEach(function(r){
        var isT = r[1].indexOf(today) > -1;
        h += '<tr class="' + (isT?'today':'') + '"><td>' + esc(r[0]) + (isT ? ' · hoy' : '') + '</td><td>' + (r[2] ? esc(r[2] + ' – ' + r[3]) : 'Cerrado') + '</td></tr>';
      });
      h += '</tbody></table><button class="s-btn sec" type="button" data-act="maps">' + I.pin + 'Abrir en el mapa</button></section>';
    }

    if(f.redes){
      var link = slug(name) + '.com.mx/redes';
      h += '<section class="s-sec" id="s-redes"><h3>Síguenos y comparte</h3><p class="s-sub">Un solo enlace para todas las redes, y un QR para el mostrador y los volantes.</p>'
        + '<div class="s-share"><canvas id="qr" aria-label="Código QR de ejemplo" role="img"></canvas><div><div class="s-link" id="s-link">' + esc(link) + '</div><button class="s-mini" type="button" data-act="copy">Copiar enlace</button></div></div>'
        + '<div class="s-socials">';
      ['Facebook','Instagram','TikTok','Google Maps'].forEach(function(n){ h += '<button class="s-mini" type="button" data-act="social" data-n="' + n + '">' + n + '</button>'; });
      h += '</div></section>';
    }

    if(f.faq){
      h += '<section class="s-sec s-faq" id="s-faq"><h3>Preguntas frecuentes</h3>';
      g.faq.forEach(function(q){ h += '<details><summary>' + esc(q[0]) + '</summary><p>' + esc(q[1]) + '</p></details>'; });
      h += '</section>';
    }

    h += '<footer class="s-foot"><p><strong>' + esc(name) + '</strong> · ' + esc(S.addr) + '</p><p>WhatsApp ' + esc(S.wa) + '</p>'
      + '<p><button class="s-linkbtn" type="button" data-act="privacy">Aviso de privacidad</button></p><p>© ' + new Date().getFullYear() + ' ' + esc(name) + '</p></footer>';

    var site = $('#site'); var top = site.scrollTop;
    site.innerHTML = h; site.scrollTop = top;
    if(f.redes) drawQR($('#qr'), slug(name));
    $('#fab-wa').hidden = !f.whats;
    $('#fab-chat').hidden = !f.chat;
    $('#fab-label').hidden = !f.chat || chatState.started;
    if(!f.chat) $('#chat').hidden = true;
    $('#c-name').textContent = name;
    $('#c-logo').textContent = initials(name);
    renderQuick();
  }

  function drawQR(cv, seed){
    if(!cv || !cv.getContext) return;
    var N=25, q=2, m=4, px=(N+2*q)*m, dpr=Math.min(window.devicePixelRatio||1, 3);
    cv.width = px*dpr; cv.height = px*dpr; cv.style.width = px+'px'; cv.style.height = px+'px';
    var c = cv.getContext('2d'); c.scale(dpr, dpr);
    c.fillStyle = '#FFFFFF'; c.fillRect(0,0,px,px);
    var h = 2166136261; for(var i=0;i<seed.length;i++){ h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); } if(!h) h = 1;
    function rnd(){ h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h>>>0) % 1000) / 1000; }
    function inF(x,y){ return (x<8&&y<8) || (x>=N-8&&y<8) || (x<8&&y>=N-8); }
    c.fillStyle = '#1C1E1D';
    for(var y=0;y<N;y++) for(var x=0;x<N;x++){ if(inF(x,y)) continue; if(rnd() < 0.47) c.fillRect((x+q)*m, (y+q)*m, m, m); }
    function finder(fx,fy){
      c.fillStyle='#1C1E1D'; c.fillRect((fx+q)*m,(fy+q)*m,7*m,7*m);
      c.fillStyle='#FFFFFF'; c.fillRect((fx+q+1)*m,(fy+q+1)*m,5*m,5*m);
      c.fillStyle='#1C1E1D'; c.fillRect((fx+q+2)*m,(fy+q+2)*m,3*m,3*m);
    }
    finder(0,0); finder(N-7,0); finder(0,N-7);
  }

  var toastT;
  function toast(msg){
    var t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function(){ t.hidden = true; }, 3400);
  }
  function scrollToSec(id){ var el = document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }

  $('#site').addEventListener('click', function(e){
    var b = e.target.closest('[data-act]'); if(!b) return;
    var act = b.dataset.act, g = G(), name = bizName();
    if(act==='wa') toast('Abriría WhatsApp al ' + S.wa + ' con el mensaje: "Hola ' + name + ', vi su página y quiero información."');
    else if(act==='call') toast('Marcaría al ' + S.wa + '.');
    else if(act==='goto') scrollToSec(b.dataset.to);
    else if(act==='day'){ A.day = +b.dataset.i; A.slot = null; A.err=''; refreshAgenda(); }
    else if(act==='slot'){ A.slot = b.dataset.t; A.err=''; refreshAgenda(true); }
    else if(act==='confirm'){
      var who = ($('#s-who') && $('#s-who').value || '').trim();
      if(!A.slot){ A.err = 'Elige una hora disponible.'; refreshAgenda(true); return; }
      if(!who){ A.err = 'Escribe tu nombre para apartar.'; refreshAgenda(true); return; }
      A.done = who; A.err=''; refreshAgenda();
    }
    else if(act==='again'){ A.done = false; A.slot = null; refreshAgenda(); }
    else if(act==='maps') toast('Abriría Google Maps con la ubicación exacta de ' + name + '.');
    else if(act==='copy'){
      var link = $('#s-link').textContent;
      var done = function(){ toast('Enlace copiado. Así se pega en la biografía de cada red.'); };
      var fail = function(){ var r = document.createRange(); r.selectNodeContents($('#s-link')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Enlace seleccionado. Cópialo manualmente.'); };
      try{ navigator.clipboard.writeText(link).then(done, fail); }catch(err){ fail(); }
    }
    else if(act==='social') toast(b.dataset.n === 'Google Maps' ? 'La ficha de Google Maps lleva el mismo enlace, horarios y fotos.' : 'Este mismo enlace va en la biografía de ' + b.dataset.n + '.');
    else if(act==='privacy') openPrivacy();
  });
  $('#site').addEventListener('input', function(e){ if(e.target.id === 's-who') A.err = ''; });

  function refreshAgenda(keepName){
    var box = $('#s-agenda-body'); if(!box) return;
    var prev = keepName && $('#s-who') ? $('#s-who').value : '';
    box.innerHTML = agendaBody(G());
    if(prev && $('#s-who')) $('#s-who').value = prev;
  }

  function openPrivacy(){
    var name = bizName();
    $('#p-text').textContent = name + ', con domicilio en ' + S.addr + ', usa tu nombre y teléfono solo para confirmar tu cita o pedido y avisarte sobre él. No los vende ni los comparte. Puedes pedir que se borren escribiendo al WhatsApp ' + S.wa + '.';
    $('#pmodal').hidden = false; $('#p-close').focus();
  }
  $('#p-close').addEventListener('click', function(){ $('#pmodal').hidden = true; });
  $('#pmodal').addEventListener('click', function(e){ if(e.target.id === 'pmodal') $('#pmodal').hidden = true; });
  $('#fab-wa').addEventListener('click', function(){ toast('Abriría WhatsApp al ' + S.wa + ' con el mensaje: "Hola ' + bizName() + ', vi su página y quiero información."'); });

  /* ---------- asistente ---------- */
  function quickList(){
    var q = ['Horarios','Precios','¿Dónde están?'];
    if(S.f.agenda) q.push('Agendar');
    q.push('¿Aceptan tarjeta?','Hablar con una persona');
    return q;
  }
  function renderQuick(){
    var box = $('#c-quick'); box.innerHTML = '';
    quickList().forEach(function(t){ var b = document.createElement('button'); b.type='button'; b.textContent = t; b.addEventListener('click', function(){ ask(t); }); box.appendChild(b); });
  }
  function addMsg(who, text, action){
    var box = $('#c-msgs'), d = document.createElement('div');
    d.className = 'msg ' + who; d.textContent = text;
    if(action){
      var br = document.createElement('br'), b = document.createElement('button');
      b.type='button'; b.className='msg-act'; b.textContent = action.label;
      b.addEventListener('click', function(){ closeChat(); setTimeout(function(){ scrollToSec(action.to); }, 60); });
      d.appendChild(br); d.appendChild(b);
    }
    box.appendChild(d); box.scrollTop = box.scrollHeight;
  }
  function botSay(text, action){
    var box = $('#c-msgs'), t = document.createElement('div');
    t.className = 'msg bot typing'; t.textContent = '•••'; box.appendChild(t); box.scrollTop = box.scrollHeight;
    setTimeout(function(){ t.remove(); addMsg('bot', text, action); }, 520);
  }
  function answer(q){
    var g = G(), t = norm(q), name = bizName(), st = openStatus(g);
    var words = t.split(/[^a-z0-9]+/).filter(Boolean);
    if(words.length <= 3 && /\b(hola|buenas|buenos|que tal|saludos)\b/.test(t)) return {text:'¡Hola! ¿En qué te ayudo? Puedo darte horarios, precios, ubicación' + (S.f.agenda ? ' o apartarte ' + (g.thing==='mesa'?'una mesa':'una cita') : '') + '.'};
    if(/cita|agend|reserv|turno|mesa|probador/.test(t)){
      if(S.f.agenda) return {text:'Claro. Puedes apartar aquí mismo, en "' + g.agendaTitle + '". Eliges día, hora y listo.', action:{label:'Ir a ' + g.agendaTitle.toLowerCase(), to:'s-agenda'}};
      return {text:'Por ahora se aparta por WhatsApp: ' + S.wa + '. Te contestan en horario de atención.'};
    }
    if(/horario|abren|abierto|cierran|a que hora/.test(t)){
      return {text:'Nuestro horario:\n' + g.hours.map(function(h){ return h[0] + ': ' + (h[2] ? h[2] + ' a ' + h[3] : 'cerrado'); }).join('\n') + '\n\nAhorita: ' + st.txt.toLowerCase() + '.'};
    }
    if(/donde|ubicacion|direccion|como llego|mapa|ubicados/.test(t)){
      return {text:'Estamos en ' + S.addr + '.', action: S.f.mapa ? {label:'Ver mapa', to:'s-mapa'} : null};
    }
    if(/persona|humano|asesor|alguien|hablar|llamar|encargad/.test(t)){
      return {text:'Te paso con una persona del equipo. Escríbenos al WhatsApp ' + S.wa + ' y te contestan en horario de atención.'};
    }
    var stop = {tienen:1,hacen:1,puedo:1,pueden:1,ustedes:1,cuanto:1,cuanta:1,donde:1,tarda:1,llevo:1,primera:1,tiene:1,venden:1,revisan:1,atienden:1,dejar:1};
    for(var i=0;i<g.faq.length;i++){
      var keys = norm(g.faq[i][0]).split(/[^a-z0-9]+/).filter(function(w){ return w.length >= 5 && !stop[w]; });
      if(keys.some(function(k){ return t.indexOf(k) > -1; })) return {text:g.faq[i][1]};
    }
    if(/precio|cuanto|cuesta|costo|cobran|menu|servicios|lista/.test(t)){
      return {text:'Algunos precios:\n' + g.items.slice(0,3).map(function(it){ return '• ' + it[0] + ': ' + it[1]; }).join('\n') + '\n\nLa lista completa está en "' + g.menuTitle + '".', action:{label:'Ver ' + g.menuTitle.toLowerCase(), to:'s-menu'}};
    }
    if(/tarjeta|pago|pagar|transfer|efectivo|factura/.test(t)) return {text:g.pay};
    return {text:'No tengo ese dato y prefiero no inventarte nada. Te paso con una persona: WhatsApp ' + S.wa + '.'};
  }
  function ask(q){
    addMsg('me', q);
    var r = answer(q); botSay(r.text, r.action);
  }
  function openChat(){
    $('#chat').hidden = false; $('#fab-label').hidden = true;
    if(!chatState.started){
      chatState.started = true; $('#c-msgs').innerHTML = '';
      botSay('Hola, soy el asistente de ' + bizName() + '. Te ayudo con horarios, precios, ubicación' + (S.f.agenda ? ' y citas' : '') + '. ¿Qué necesitas?');
    }
    setTimeout(function(){ $('#c-input').focus({preventScroll:true}); }, 60);
  }
  function closeChat(){ $('#chat').hidden = true; }
  function resetChat(){ chatState.started = false; $('#c-msgs').innerHTML = ''; }
  $('#fab-chat').addEventListener('click', openChat);
  $('#c-close').addEventListener('click', closeChat);
  $('#c-form').addEventListener('submit', function(e){
    e.preventDefault(); var v = $('#c-input').value.trim(); if(!v) return;
    $('#c-input').value = ''; ask(v);
  });

  /* ---------- panel ---------- */
  function buildPanel(){
    var sel = $('#f-giro'); sel.innerHTML = '';
    Object.keys(GIROS).forEach(function(k){ var o = document.createElement('option'); o.value = k; o.textContent = GIROS[k].label; sel.appendChild(o); });
    sel.value = S.giro;
    var sw = $('#f-colors'); sw.innerHTML = '';
    Object.keys(COLORS).forEach(function(k){
      var b = document.createElement('button'); b.type='button'; b.className='swatch'; b.style.background = COLORS[k][1];
      b.setAttribute('aria-label', COLORS[k][0]); b.title = COLORS[k][0]; b.dataset.c = k;
      b.addEventListener('click', function(){ S.color = k; syncSwatches(); renderSite(); renderProposal(); save(); });
      sw.appendChild(b);
    });
    var tg = $('#f-toggles'); tg.innerHTML = '';
    FEATURES.forEach(function(f){
      var row = document.createElement('div'); row.className = 'tog';
      row.innerHTML = '<label class="t" for="tg-' + f.id + '">' + esc(f.t) + '</label><span class="d">' + esc(f.d) + '</span>'
        + '<span class="switch"><input type="checkbox" id="tg-' + f.id + '"' + (f.locked ? ' disabled' : '') + '><span></span></span>';
      tg.appendChild(row);
      var inp = row.querySelector('input');
      inp.addEventListener('change', function(){ S.f[f.id] = inp.checked; if(f.id==='chat' || f.id==='agenda') resetChat(); renderSite(); save(); });
    });
    var ex = $('#f-extras'); ex.innerHTML = '';
    EXTRAS.forEach(function(t){ var s = document.createElement('span'); s.className='chip'; s.textContent = t; ex.appendChild(s); });
    syncPanel();
  }
  function syncSwatches(){ document.querySelectorAll('.swatch').forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset.c === S.color)); }); }
  function syncPanel(){
    $('#f-name').value = S.name; $('#f-name').placeholder = G().name;
    $('#f-giro').value = S.giro; $('#f-wa').value = S.wa; $('#f-addr').value = S.addr;
    FEATURES.forEach(function(f){ var i = document.getElementById('tg-' + f.id); if(i) i.checked = !!S.f[f.id]; });
    syncSwatches();
  }
  $('#f-name').addEventListener('input', function(e){ S.name = e.target.value; resetChat(); renderSite(); renderProposal(); save(); });
  $('#f-wa').addEventListener('input', function(e){ S.wa = e.target.value.trim() || '33 0000 0000'; renderSite(); save(); });
  $('#f-addr').addEventListener('input', function(e){ S.addr = e.target.value.trim() || 'Calle principal 1, Centro'; renderSite(); save(); });
  $('#f-giro').addEventListener('change', function(e){
    S.giro = e.target.value; S.color = G().color; S.f = defaultsFor(S.giro);
    A = {day:0, slot:null, done:false, err:''}; resetChat();
    syncPanel(); $('#site').scrollTop = 0; renderSite(); renderProposal(); save();
  });

  /* ---------- vistas, hoja móvil y presentación ---------- */
  function setView(v){
    var demo = v === 'demo';
    $('#view-demo').hidden = !demo; $('#view-prop').hidden = demo;
    $('#tab-demo').setAttribute('aria-selected', String(demo)); $('#tab-prop').setAttribute('aria-selected', String(!demo));
    $('#btn-ajustes').classList.toggle('is-off', !demo);
    closeSheet();
  }
  $('#tab-demo').addEventListener('click', function(){ setView('demo'); });
  $('#tab-prop').addEventListener('click', function(){ setView('prop'); });
  function openSheet(){ $('#panel').classList.add('open'); $('#scrim').hidden = false; }
  function closeSheet(){ $('#panel').classList.remove('open'); $('#scrim').hidden = true; }
  $('#btn-ajustes').addEventListener('click', openSheet);
  $('#panel-close').addEventListener('click', closeSheet);
  $('#scrim').addEventListener('click', closeSheet);
  function present(on){
    document.body.classList.toggle('present', on); $('#exit-present').hidden = !on;
    if(on){ setView('demo'); closeSheet(); }
  }
  $('#btn-present').addEventListener('click', function(){ present(true); });
  $('#exit-present').addEventListener('click', function(){ present(false); });
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    if(!$('#pmodal').hidden){ $('#pmodal').hidden = true; return; }
    if(!$('#chat').hidden){ closeChat(); return; }
    if($('#panel').classList.contains('open')){ closeSheet(); return; }
    if(document.body.classList.contains('present')) present(false);
  });

  /* ---------- propuesta ---------- */
  function fmt(n){ return Number(n||0).toLocaleString('es-MX'); }
  function priceOf(p, key){ return (prices[p.id] && prices[p.id][key] != null) ? prices[p.id][key] : p[key]; }
  function renderProposal(){
    var g = G(), pn = $('#p-name');
    pn.textContent = bizName(); pn.style.fontFamily = FONTS[g.font];
    $('#offer-toggle').checked = offer; $('#offer').hidden = !offer;
    var editing = document.body.classList.contains('editing');
    var box = $('#plans'); box.innerHTML = '';
    PLANS.forEach(function(p){
      var art = document.createElement('article'); art.className = 'plan' + (p.featured ? ' featured' : '');
      var inc = p.inc.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('');
      art.innerHTML = '<div class="plan-top"><h3>' + esc(p.name) + '</h3>' + (p.featured ? '<span class="badge">Recomendado</span>' : '') + '</div>'
        + '<p class="plan-for">' + esc(p.forx) + '</p>'
        + '<div class="price-row">'
        + '<div class="price"><label for="pr-' + p.id + '-inst">Instalación</label><div class="pin">$<input id="pr-' + p.id + '-inst" data-p="' + p.id + '" data-k="inst" inputmode="numeric" value="' + fmt(priceOf(p,'inst')) + '"' + (editing ? '' : ' readonly') + '></div><small>pago único</small></div>'
        + '<div class="price"><label for="pr-' + p.id + '-mes">Mensualidad</label><div class="pin">$<input id="pr-' + p.id + '-mes" data-p="' + p.id + '" data-k="mes" inputmode="numeric" value="' + fmt(priceOf(p,'mes')) + '"' + (editing ? '' : ' readonly') + '></div><small>al mes</small></div>'
        + '</div><ul class="checks">' + inc + '</ul><p class="plan-time">' + esc(p.time) + '</p>';
      box.appendChild(art);
    });
    box.querySelectorAll('input').forEach(function(inp){
      inp.addEventListener('input', function(){
        var n = parseInt(inp.value.replace(/[^0-9]/g,''), 10); if(isNaN(n)) n = 0;
        prices[inp.dataset.p] = prices[inp.dataset.p] || {}; prices[inp.dataset.p][inp.dataset.k] = n; save();
      });
      inp.addEventListener('blur', function(){ var v = prices[inp.dataset.p] && prices[inp.dataset.p][inp.dataset.k]; if(v != null) inp.value = fmt(v); });
    });
  }
  function fillList(id, arr){ $(id).innerHTML = arr.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join(''); }
  fillList('#l-mant', MANT); fillList('#l-need', NEED); fillList('#l-extra', APARTE);
  $('#offer-toggle').addEventListener('change', function(e){ offer = e.target.checked; $('#offer').hidden = !offer; save(); });
  $('#btn-edit').addEventListener('click', function(){
    var on = !document.body.classList.contains('editing');
    document.body.classList.toggle('editing', on);
    $('#btn-edit').textContent = on ? 'Guardar precios' : 'Editar precios';
    document.querySelectorAll('.pin input').forEach(function(i){ i.readOnly = !on; });
    if(on){ var first = document.querySelector('.pin input'); if(first) first.focus(); }
  });

  buildPanel();
  renderSite();
  renderProposal();
  setInterval(function(){ var el = document.querySelector('.s-open'); if(!el) return; var st = openStatus(G()); el.textContent = st.txt; el.className = 's-open ' + (st.on?'on':'off'); }, 60000);
})();
