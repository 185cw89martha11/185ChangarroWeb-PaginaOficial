/* 185ChangarroWeb · generador de link de WhatsApp y QR */
(function () {
  'use strict';
  var f = document.getElementById('tf'), E = f.elements;
  var linkEl = document.getElementById('link'), tryEl = document.getElementById('try');
  var qrEl = document.getElementById('qr'), dl = document.getElementById('dl');
  var qr = null, current = '';

  function build() {
    var cc = E.cc.value, num = E.num.value.replace(/\D/g, '');
    var full = num.indexOf(cc) === 0 && num.length > 10 ? num : cc + num;
    var msg = E.msg.value.trim();
    current = num.length >= 7 ? 'https://wa.me/' + full + (msg ? '?text=' + encodeURIComponent(msg) : '') : '';
    linkEl.value = current || 'Escriba su número…';
    tryEl.href = current || '#';
    tryEl.style.opacity = current ? '1' : '.5';
    dl.disabled = !current;
    qrEl.style.opacity = current ? '1' : '.25';
    if (!window.QRCode) return;
    var text = current || 'https://wa.me/';
    try {
      if (!qr) qr = new QRCode(qrEl, { text: text, width: 440, height: 440, colorDark: '#111111', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
      else { qr.clear(); qr.makeCode(text); }
    } catch (e) {
      qrEl.textContent = 'El mensaje es muy largo para un código QR. Acórtelo un poco.';
    }
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  f.addEventListener('input', build);
  f.addEventListener('change', build);
  f.addEventListener('submit', function (e) { e.preventDefault(); });
  document.querySelectorAll('[data-msg]').forEach(function (b) {
    b.addEventListener('click', function () { E.msg.value = b.getAttribute('data-msg'); build(); });
  });
  tryEl.addEventListener('click', function (e) { if (!current) e.preventDefault(); });
  document.getElementById('cp').addEventListener('click', function () {
    if (!current) return toast('Primero escriba su número');
    navigator.clipboard.writeText(current).then(function () { toast('¡Link copiado!'); }, function () { linkEl.select(); });
  });
  dl.addEventListener('click', function () {
    var c = qrEl.querySelector('canvas');
    if (!current || !c) return;
    var a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = 'qr-whatsapp.png';
    document.body.appendChild(a); a.click(); a.remove();
  });
  build();
})();
