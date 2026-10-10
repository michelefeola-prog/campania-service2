/*!
 * Banner cookie per campaniaservice.it
 * - Nessuno script o contenuto di terze parti facoltativo parte prima del consenso.
 * - "Solo necessari" e "Accetta tutti" hanno lo stesso peso visivo.
 * - La scelta dura 6 mesi, poi il banner ricompare.
 * - Qualsiasi elemento con l'attributo data-cookie-settings riapre il banner.
 * - Le mappe Google (elementi .map-consent) si caricano solo dopo il consenso,
 *   oppure con un clic sul pulsante "Carica la mappa" (solo per quella visita).
 */
(function () {
  var NOME = 'cs_consent';
  var MESI = 6;
  var LINK_MAPPA = 'https://www.google.com/maps/search/?api=1&query=Campania%20Service%20Via%20Giuseppe%20Verdi%2069%2081100%20Caserta%20CE';

  function leggi() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + NOME + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function salva(valore) {
    var scade = new Date();
    scade.setMonth(scade.getMonth() + MESI);
    document.cookie = NOME + '=' + encodeURIComponent(valore) +
      '; expires=' + scade.toUTCString() + '; path=/; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
  }

  // Carica le mappe Google segnaposto presenti nella pagina.
  function caricaMappe() {
    var el = document.querySelectorAll('.map-consent');
    for (var i = 0; i < el.length; i++) {
      var f = document.createElement('iframe');
      f.className = el[i].className.replace('map-consent', '').replace(/\s+/g, ' ').trim();
      f.setAttribute('loading', 'lazy');
      f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      f.setAttribute('title', el[i].getAttribute('data-title') || 'Mappa');
      f.src = el[i].getAttribute('data-src');
      el[i].parentNode.replaceChild(f, el[i]);
    }
  }

  // Testo e pulsante al posto della mappa finché non c'è il consenso.
  function segnaposto() {
    var el = document.querySelectorAll('.map-consent:not([data-cs-ok])');
    for (var i = 0; i < el.length; i++) {
      el[i].setAttribute('data-cs-ok', '1');
      el[i].innerHTML =
        '<div class="cs-mappa-box">' +
        '<p>La mappa è fornita da Google e, se caricata, Google riceve il tuo indirizzo IP e può usare propri cookie.</p>' +
        '<button type="button" class="cs-mappa-btn">Carica la mappa</button> ' +
        '<a href="' + LINK_MAPPA + '" target="_blank" rel="noopener">Apri su Google Maps</a>' +
        '</div>';
    }
  }

  // Qui vanno caricati gli strumenti che richiedono consenso (solo se accettati).
  // Esempio con Google Analytics 4: sostituisci G-XXXXXXXXXX e togli i commenti.
  function caricaFacoltativi() {
    caricaMappe();
    /*
    if (window.__csAnalytics) return;
    window.__csAnalytics = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
    */
  }

  var css = '' +
    '#cs-banner{position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;max-width:560px;margin:0 auto;' +
    'background:#fff;color:#1d2623;border:1px solid #d8d6cf;border-radius:14px;padding:18px 20px;' +
    'box-shadow:0 10px 30px rgba(0,0,0,.18);font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '#cs-banner h2{margin:0 0 6px;font-size:1.05rem;color:#0B3D2F}' +
    '#cs-banner p{margin:0 0 14px}' +
    '#cs-banner a{color:#0B3D2F}' +
    '#cs-banner .cs-btns{display:flex;gap:10px;flex-wrap:wrap}' +
    '#cs-banner button{flex:1 1 140px;padding:11px 16px;border-radius:8px;border:2px solid #0B3D2F;' +
    'background:#0B3D2F;color:#fff;font:inherit;font-weight:600;cursor:pointer}' +
    '#cs-banner button.cs-no{background:#fff;color:#0B3D2F}' +
    '#cs-banner button:focus-visible{outline:3px solid #e0a526;outline-offset:2px}' +
    '.map-consent{display:flex;align-items:center;justify-content:center;min-height:260px;padding:20px;' +
    'background:#eef1ee;border:1px solid #d8d6cf;border-radius:14px;text-align:center;box-sizing:border-box}' +
    '.map-consent .cs-mappa-box{max-width:420px;color:#1d2623;font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.map-consent p{margin:0 0 12px}' +
    '.map-consent a{color:#0B3D2F;margin-left:8px}' +
    '.map-consent button{padding:10px 16px;border-radius:8px;border:2px solid #0B3D2F;background:#0B3D2F;' +
    'color:#fff;font:inherit;font-weight:600;cursor:pointer}';

  function stile() {
    if (document.getElementById('cs-style')) return;
    var st = document.createElement('style');
    st.id = 'cs-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function mostra() {
    if (document.getElementById('cs-banner')) return;
    stile();

    var box = document.createElement('div');
    box.id = 'cs-banner';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', 'Preferenze cookie');
    box.innerHTML =
      '<h2>Cookie</h2>' +
      '<p>Usiamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso carichiamo anche ' +
      'contenuti di terze parti, come la mappa di Google, e possiamo usare cookie statistici. ' +
      'Puoi cambiare idea in ogni momento. ' +
      '<a href="cookie.html">Cookie Policy</a> · <a href="privacy.html">Privacy</a></p>' +
      '<div class="cs-btns">' +
      '<button type="button" class="cs-no">Solo necessari</button>' +
      '<button type="button" class="cs-si">Accetta tutti</button>' +
      '</div>';
    document.body.appendChild(box);

    box.querySelector('.cs-no').addEventListener('click', function () { scegli('necessari'); });
    box.querySelector('.cs-si').addEventListener('click', function () { scegli('tutti'); });
    box.querySelector('.cs-no').focus();
  }

  function chiudi() {
    var b = document.getElementById('cs-banner');
    if (b) b.remove();
  }

  function scegli(valore) {
    salva(valore);
    chiudi();
    if (valore === 'tutti') caricaFacoltativi();
  }

  function init() {
    stile();
    var scelta = leggi();
    if (scelta === 'tutti') caricaFacoltativi();
    else segnaposto();
    if (!scelta) mostra();

    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); mostra(); return; }
      var b = e.target.closest && e.target.closest('.cs-mappa-btn');
      if (b) { e.preventDefault(); caricaMappe(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
