// site.js: malikpeace.com. The moving comments (grab them, tap one to pin it), the steps, the email forms,
// the real Memento card and Flash bang mode.
(function () {
  var root = document.documentElement;
  var REDUCE = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- Flash bang mode (light), remembered on this device ---------------- */
  var fbBtn = $('[data-flashbang]');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('mp-theme', t); } catch (e) {}
    if (fbBtn) fbBtn.setAttribute('aria-pressed', String(t === 'light'));   // the label shown follows data-theme (site.css)
    var meta = $('meta[name="theme-color"]'); if (meta) meta.content = t === 'light' ? '#ffffff' : '#000000';
  }
  if (fbBtn) {
    var mode = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', swap = false, owed = false, noop = function () {};
    setTheme(mode);
    // the new mode grows out of the centre of the screen (the circle lives in site.css: html.mp-swap). Every circle plays
    // out in full; colour fades stay off from the first tap until the last circle lands, so nothing is ever caught grey.
    var go = function () {
      mode = mode === 'light' ? 'dark' : 'light';
      if (REDUCE || !document.startViewTransition) { setTheme(mode); return; }
      root.classList.add('mp-swap'); swap = true;
      var vt = document.startViewTransition(function () { setTheme(mode); });
      vt.ready.catch(noop); vt.updateCallbackDone.catch(noop);
      vt.finished.catch(noop).then(function () {
        swap = false;
        if (owed) { owed = false; go(); } else root.classList.remove('mp-swap');
      });
    };
    // taps that land mid-circle only flip what's owed, so a run of taps always ends on the mode its count says
    var tap = function () { if (swap) owed = !owed; else go(); };
    // while a circle runs the browser hands taps to the page itself, not the button, so the button's spot is checked too
    document.addEventListener('click', function (e) {
      var hit = e.target.closest && e.target.closest('[data-flashbang]');
      if (!hit && swap && e.clientX) { var b = fbBtn.getBoundingClientRect(); hit = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom; }
      if (hit) tap();
    }, true);
  }

  /* ---------------- "Hello": tap it and it says hello another way (another language, another typeface) ---------------- */
  var hi = $('.hi');
  if (hi) (function () {
    // a handwritten hello in the spirit of Apple's, drawn here as one stroke so it can write itself on
    var HELLO = 'M8 158 C11.7 155 21.7 148.3 30 140 C38.3 131.7 49.3 120 58 108 C66.7 96 75.7 80.7 82 68 C88.3 55.3 93.7 41.3 96 32 C98.3 22.7 98 15.7 96 12 C94 8.3 87.7 7.7 84 10 C80.3 12.3 77 17.3 74 26 C71 34.7 68.3 48.3 66 62 C63.7 75.7 61.7 94 60 108 C58.3 122 57 135.7 56 146 C55 156.3 53.7 169.3 54 170 C54.3 170.7 55.7 158 58 150 C60.3 142 63.7 129.7 68 122 C72.3 114.3 78.7 107.7 84 104 C89.3 100.3 95.7 98.7 100 100 C104.3 101.3 108 105.7 110 112 C112 118.3 111.7 129.7 112 138 C112.3 146.3 111 156.3 112 162 C113 167.7 114.7 170.7 118 172 C121.3 173.3 126.7 172.3 132 170 C137.3 167.7 144 163 150 158 C156 153 163.3 146 168 140 C172.7 134 176.7 127.7 178 122 C179.3 116.3 178.3 109.3 176 106 C173.7 102.7 168.3 101.3 164 102 C159.7 102.7 153.3 105.3 150 110 C146.7 114.7 144.7 123 144 130 C143.3 137 144 145.7 146 152 C148 158.3 151.3 164.3 156 168 C160.7 171.7 167.3 174.3 174 174 C180.7 173.7 189.3 170.7 196 166 C202.7 161.3 208 155.7 214 146 C220 136.3 226.7 122 232 108 C237.3 94 242.7 75.3 246 62 C249.3 48.7 251.7 36.7 252 28 C252.3 19.3 250.7 13 248 10 C245.3 7 239.3 7 236 10 C232.7 13 230 18 228 28 C226 38 225 55 224 70 C223 85 222 104.3 222 118 C222 131.7 222.3 143.3 224 152 C225.7 160.7 228 166.3 232 170 C236 173.7 242.7 174.7 248 174 C253.3 173.3 258.3 170.7 264 166 C269.7 161.3 276 155.7 282 146 C288 136.3 294.7 122 300 108 C305.3 94 310.7 75.3 314 62 C317.3 48.7 319.7 36.7 320 28 C320.3 19.3 318.7 13 316 10 C313.3 7 307.3 7 304 10 C300.7 13 298 18 296 28 C294 38 293 55 292 70 C291 85 290 104.3 290 118 C290 131.7 290.3 143.3 292 152 C293.7 160.7 296 166.3 300 170 C304 173.7 310.7 174.7 316 174 C321.3 173.3 327.3 170 332 166 C336.7 162 340.3 156.3 344 150 C347.7 143.7 350.7 134.7 354 128 C357.3 121.3 360 114.5 364 110 C368 105.5 373 102.3 378 101 C383 99.7 389.3 99.5 394 102 C398.7 104.5 403.3 109.7 406 116 C408.7 122.3 410.7 132 410 140 C409.3 148 406.3 158.2 402 164 C397.7 169.8 390 174.3 384 175 C378 175.7 370.3 172.8 366 168 C361.7 163.2 358.7 153.7 358 146 C357.3 138.3 359.3 128.7 362 122 C364.7 115.3 368.7 109.8 374 106 C379.3 102.2 386.7 100 394 99 C401.3 98 410.3 100.5 418 100 C425.7 99.5 436.3 96.7 440 96';
    var FONTS = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&text=Helo&display=swap';
    // t: the word, l: its language; most are in the heading's own type. f/s: the one 8-bit hello's typeface and size.
    // ls: scripts whose letters join up (Arabic, Hindi) drop the heading's tight letter spacing so they stay joined.
    var V = [
      { svg: 1 },
      { t: 'Hola', l: 'es' },
      { t: 'Bonjour', l: 'fr' },
      { t: 'こんにちは', l: 'ja' },
      { t: 'Ciao', l: 'it' },
      { t: 'Hello', l: 'en', f: 'Press Start 2P', s: .62 },
      { t: 'Привет', l: 'ru' },
      { t: '안녕하세요', l: 'ko' },
      { t: 'Olá', l: 'pt' },
      { t: 'नमस्ते', l: 'hi', ls: 1 },
      { t: 'Hallo', l: 'de' },
      { t: '你好', l: 'zh' },
      { t: 'Hej', l: 'sv' },
      { t: 'مرحبا', l: 'ar', rtl: 1, ls: 1 },
      { t: 'Jambo', l: 'sw' },
      { def: 1 }
    ];
    var DEF = hi.innerHTML, at = V.length - 1, busy = false, again = false, css = null, timer = 0;
    // the 8-bit typeface comes in once, cut down to just the letters of Hello (a few KB), the first time someone comes near
    function sheet() {
      if (!css) css = new Promise(function (ok) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTS; l.onload = l.onerror = ok; document.head.appendChild(l); setTimeout(ok, 3000); });
      return css;
    }
    function ready(v) {
      if (!v.f || !document.fonts) return Promise.resolve();
      return sheet().then(function () {
        return Promise.race([document.fonts.load('400 40px "' + v.f + '"', v.t), new Promise(function (ok) { setTimeout(ok, 900); })]);
      }).catch(function () {});
    }
    function warm() { V.forEach(function (v) { ready(v); }); }
    ['pointerover', 'touchstart', 'focus'].forEach(function (t) { hi.addEventListener(t, warm, { once: true, passive: true }); });
    addEventListener('load', function () { setTimeout(warm, 2500); });
    function face(v) {
      var e = document.createElement('span'); e.className = 'hi-v';
      if (v.svg) { e.className += ' hi-svg'; e.innerHTML = '<svg viewBox="0 0 450 190" role="img" aria-label="hello"><path d="' + HELLO + '"/></svg>'; }
      else if (v.def) e.innerHTML = DEF;
      else {
        e.textContent = v.t; e.lang = v.l; if (v.rtl) e.dir = 'rtl';
        if (v.f) e.style.cssText = 'font-family:"' + v.f + '",Arial,sans-serif;font-size:' + v.s + 'em;font-weight:400;letter-spacing:0';
        else if (v.ls) e.style.letterSpacing = '0';
      }
      return e;
    }
    function write(e) {   // the handwritten one writes itself on
      var p = e.querySelector('path'); if (!p || REDUCE) return;
      var L = p.getTotalLength();
      p.style.strokeDasharray = L + ' ' + (L + 40); p.style.strokeDashoffset = L + 20;
      void p.getBoundingClientRect();
      p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.45,.05,.3,1)'; p.style.strokeDashoffset = '0';
    }
    // how wide the greeting may be: out to the heading's widest line (or its edge, if wider), minus the words after it on
    // its own line. Measured from the words themselves, never from the greeting showing now, so it can't creep smaller.
    function fit() {
      var h = hi.closest('h1'), me = hi.getBoundingClientRect(), y = (me.top + me.bottom) / 2, end = me.right, far = h.getBoundingClientRect().right;
      var tw = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), rg = document.createRange(), n;
      while ((n = tw.nextNode())) {
        if (hi.contains(n)) continue;
        rg.selectNodeContents(n);
        Array.prototype.forEach.call(rg.getClientRects(), function (r) { if (!r.width) return; if (r.top < y && r.bottom > y) end = Math.max(end, r.right); else far = Math.max(far, r.right); });
      }
      return far - me.left - (end - me.right) - 2;
    }
    function go() {
      if (busy) { again = true; return; }
      busy = true;
      var n = (at + 1) % V.length, v = V[n];
      ready(v).then(function () {
        var cur = hi.firstElementChild, next = face(v);
        if (!cur) { cur = document.createElement('span'); cur.className = 'hi-v'; cur.innerHTML = DEF; hi.innerHTML = ''; hi.appendChild(cur); }
        next.style.position = 'absolute'; next.style.visibility = 'hidden'; hi.appendChild(next);
        var w0 = hi.getBoundingClientRect().width, w1 = next.getBoundingClientRect().width, max = fit();
        // a word too wide for the line comes in a little smaller, so the heading never re-wraps under it
        if (w1 > max) { next.style.fontSize = ((v.s || 1) * max / w1).toFixed(3) + 'em'; w1 = next.getBoundingClientRect().width; }
        hi.removeChild(next); next.style.position = next.style.visibility = '';
        at = n;
        var done = function () { hi.style.width = ''; hi.classList.remove('swap'); busy = false; if (again) { again = false; go(); } };
        if (REDUCE) { hi.replaceChild(next, cur); write(next); done(); return; }
        // the old word fades up and out, the space eases to the new word's width, then the new word settles in
        hi.style.width = w0 + 'px'; void hi.offsetWidth; hi.classList.add('swap'); hi.style.width = w1 + 'px';
        cur.classList.add('out');
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (cur.parentNode === hi) hi.replaceChild(next, cur);
          next.classList.add('in'); write(next);
          timer = setTimeout(function () { next.classList.remove('in'); done(); }, 240);
        }, 150);
      });
    }
    hi.addEventListener('click', function (e) { if (root.classList.contains('mp-editing')) return; e.preventDefault(); go(); });
    // the preview's text editor puts the plain word back before anything is edited
    document.addEventListener('mp:edit', function () { clearTimeout(timer); hi.innerHTML = DEF; hi.style.width = ''; hi.classList.remove('swap'); at = V.length - 1; busy = again = false; });
  })();

  /* ---------------- the steps: tap the step or Read more ---------------- */
  $$('.p7s').forEach(function (st) {
    var b = $('.p7s__h', st), more = $('.p7s__more', st), body = $('.p7s__body', st), t = 0;
    if (!body) return;
    b.addEventListener('click', function () {
      var open = !st.classList.contains('open'); clearTimeout(t); b.setAttribute('aria-expanded', open);
      if (more) more.textContent = open ? 'Show less' : 'Read more';
      if (open) { body.hidden = false; void body.offsetWidth; st.classList.add('open'); }
      else { st.classList.remove('open'); t = setTimeout(function () { if (!st.classList.contains('open')) body.hidden = true; }, 380); }
    });
  });

  /* ---------------- email forms: Beehiiv (the same list as mementoapp.co) ---------------- */
  $$('[data-bh]').forEach(function (b) {
    var sc = document.createElement('script'); sc.async = true; sc.src = 'https://subscribe-forms.beehiiv.com/v3/loader.js';
    sc.setAttribute('data-beehiiv-form', '00d2e169-0ad8-422d-bf41-f7ccbf944ca5'); b.appendChild(sc);
  });

  /* ---------------- the real Memento card (Frost Aurora), mementoapp.co's own engine ---------------- */
  var AURORA_FROST = { c1: [0, 1, 190 / 255, 0.95], c2: [150 / 255, 90 / 255, 1, 0.85], c3: [40 / 255, 200 / 255, 1, 0.9], c4: [1, 90 / 255, 200 / 255, 0.7],
    fa: [5 / 255, 11 / 255, 18 / 255], fb: [2 / 255, 4 / 255, 10 / 255], plat: 0.08, fk: 1 };
  if (window.ML) $$('[data-mcard]').forEach(function (h) {
    var c = new ML.Card(h, { look: 3, spill: h.closest('.mm2.big') ? 1.5 : 1 });
    c.set(AURORA_FROST, 0); c.mark('rgba(238,246,255,0.95)');
  });

  /* ---------------- comments ---------------- */
  var C = window.COMMENTS || [];
  var THUMB = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H3v10h14.43c1.06 0 1.98-.67 2.2-1.61l1.34-6C21.26 12.15 20.2 11 18.77 11zM7 20H4v-8h3v8zm12.98-6.83-1.34 6c-.1.48-.61.83-1.21.83H8v-8.61l5.6-6.06c.19-.21.48-.33.78-.33.26 0 .5.11.63.3.07.1.15.26.09.47l-1.52 4.94-.4 1.29h5.58c.41 0 .8.17 1.03.46.13.15.26.49.18.89z"/></svg>';
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function card(c, i, px) {
    px = px || 40;
    var av = 'background-size:' + (32 * px) + 'px auto;background-position:-' + ((c.s % 32) * px) + 'px -' + (Math.floor(c.s / 32) * px) + 'px;width:' + px + 'px;height:' + px + 'px';
    return '<div class="yc" data-ci="' + i + '"><span class="av" style="' + av + '"></span><div class="bd"><div class="hd"><b>' + esc(c.h) + '</b></div>' +
      '<p class="tx">' + esc(c.t) + '</p><div class="ac">' + THUMB + '<span class="ct">' + c.lt + '</span><span style="display:inline-flex;transform:rotate(180deg)">' + THUMB + '</span>' +
      '<span class="rp">Reply</span></div></div></div>';
  }
  var box = $('#ymarq7');
  function buildMarquee(all) {
    if (!box) return;
    var R = all ? (innerWidth < 620 ? 12 : 14) : 5, n = all ? C.length : Math.min(500, C.length), rows = [], sp = [7, 8.5, 6.5, 7.8, 7.4];
    for (var i = 0; i < R; i++) rows.push([]);
    for (var k = 0; k < n; k++) rows[k % R].push(card(C[k], k));
    box.innerHTML = rows.map(function (r, i) { return '<div class="row' + (i % 2 ? ' rev' : '') + '" style="--dur:' + Math.round(r.length * sp[i % 5]) + 's">' + r.join('') + r.join('') + '</div>'; }).join('');
    box.classList.toggle('is-all', !!all);
    lighten();
  }
  // Only the comment cards on or near the screen get styled and laid out; the rest are skipped (styling all 1,000 made a
  // mode switch stall over the comments). Each row is pinned at its full height first, so skipping a card never moves it.
  var CV = !!box && 'contentVisibility' in box.style, cvW = 0;
  function lighten() {
    if (!CV) return;
    var rows = $$('.row', box), hs;
    box.style.contentVisibility = ''; rows.forEach(function (r) { r.style.height = ''; r.classList.remove('cv'); });
    hs = rows.map(function (r) { return r.offsetHeight; });
    rows.forEach(function (r, i) { r.style.height = hs[i] + 'px'; r.classList.add('cv'); });
    box.style.containIntrinsicHeight = 'auto ' + box.offsetHeight + 'px'; box.style.contentVisibility = 'auto';
    cvW = innerWidth;
  }
  buildMarquee(false);
  if (CV) { var cvT = 0; addEventListener('resize', function () { clearTimeout(cvT); cvT = setTimeout(function () { if (innerWidth !== cvW) lighten(); }, 200); }); }
  var allOn = false, allBtn = $('#ytallbtn'), wallBtn = $('#ywallbtn'), wall = $('#ywall'), note = $('#ynote');
  function closeWall() { wall.hidden = true; wall.innerHTML = ''; wallBtn.textContent = 'See them all on one page'; }
  if (allBtn) allBtn.addEventListener('click', function () {
    allOn = !allOn; buildMarquee(allOn);
    $('.lbl', allBtn).textContent = allOn ? 'Show less' : 'Read all 1,000+';
    allBtn.setAttribute('aria-expanded', String(allOn));
    if (note) note.hidden = !allOn; if (wallBtn) wallBtn.hidden = !allOn;
    if (!allOn) { closeWall(); box.scrollIntoView({ block: 'center' }); }
  });
  if (wallBtn) wallBtn.addEventListener('click', function () {
    if (!wall.hidden) { closeWall(); wallBtn.scrollIntoView({ block: 'center' }); return; }
    wall.innerHTML = '<p class="ywall-top">All ' + C.length.toLocaleString('en-US') + ' of them, on one page.</p><div class="ywall-cols">' + C.map(card).join('') + '</div><button type="button" class="ytbtn" data-hidewall>Hide the full list</button>';
    wall.hidden = false; wallBtn.textContent = 'Hide the full list'; wall.scrollIntoView({ block: 'start' });
  });
  if (wall) wall.addEventListener('click', function (e) { if (e.target.closest('[data-hidewall]')) { closeWall(); wallBtn.scrollIntoView({ block: 'center' }); } });

  // grab a row and fling it sideways; it glides, then carries on moving on its own. Tap a comment to pin it.
  function pin(i) {
    var c = C[i]; if (!c) return;
    var ov = document.createElement('div'); ov.className = 'pin7'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Comment');
    ov.innerHTML = '<div class="pin7-card">' + card(c, i, 48) + '<button type="button" class="pin7-x" aria-label="Close"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>';
    document.body.appendChild(ov); requestAnimationFrame(function () { ov.classList.add('on'); });
    var x = $('.pin7-x', ov); x.focus({ preventScroll: true });
    function close() { ov.classList.remove('on'); setTimeout(function () { ov.remove(); }, 220); document.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', key);
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('.pin7-x')) close(); });
  }
  function rowState(row) {
    var m = new DOMMatrixReadOnly(getComputedStyle(row).transform);
    return { tx: m.m41, half: row.scrollWidth / 2 };
  }
  function wrapX(row, tx) { var h = row.scrollWidth / 2; if (!h) return tx; tx = tx % h; return tx > 0 ? tx - h : tx; }
  function resume(row, tx) {
    var half = row.scrollWidth / 2, dur = parseFloat(row.style.getPropertyValue('--dur')) || 200;
    tx = ((tx % half) - half) % half;   // into (-half, 0]
    var p = -tx / half, rev = row.classList.contains('rev');
    row.style.transform = ''; row.style.animation = '';
    row.style.animationDelay = (-(rev ? 1 - p : p) * dur).toFixed(2) + 's';
  }
  // grab a drifting row and fling it: it glides a long way, folds back into an endless loop, then drifts on its own again
  function flingRows(box, onTap) {
    var drag = null;
    box.addEventListener('pointerdown', function (e) {
      var row = e.target.closest('.row'); if (!row || e.button || root.classList.contains('mp-editing')) return;
      row._g = (row._g || 0) + 1;   // a new grab stops any glide still running on this row
      var s = rowState(row);
      drag = { row: row, x0: e.clientX, y0: e.clientY, sy: window.scrollY, t0: performance.now(), tx0: s.tx, tx: s.tx, moved: false, el: e.target, hist: [[performance.now(), e.clientX]] };
      row.style.animation = 'none'; row.style.transform = 'translateX(' + s.tx + 'px)';
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x0;
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; drag.row.classList.add('grab'); try { drag.row.setPointerCapture(e.pointerId); } catch (er) {} }
      if (!drag.moved) return;
      var now = performance.now(); drag.hist.push([now, e.clientX]); while (drag.hist.length > 2 && now - drag.hist[0][0] > 100) drag.hist.shift();
      drag.tx = wrapX(drag.row, drag.tx0 + dx); drag.row.style.transform = 'translateX(' + drag.tx + 'px)';
    });
    function end(e) {
      if (!drag) return;
      var d = drag; drag = null; d.row.classList.remove('grab');
      if (!d.moved) {
        resume(d.row, d.tx0);
        var still = e && e.type === 'pointerup' && Math.abs(e.clientX - d.x0) < 8 && Math.abs(e.clientY - d.y0) < 8 && Math.abs(window.scrollY - d.sy) < 4 && performance.now() - d.t0 < 450;
        if (still && onTap) onTap(d.el);
        return;
      }
      var h = d.hist, a = h[0], b = h[h.length - 1], now = performance.now();
      var v = (now - b[0] > 80 || b[0] === a[0]) ? 0 : (b[1] - a[1]) / (b[0] - a[0]) * 16;   // px per frame at release
      v = Math.max(-120, Math.min(120, v * 1.8));
      var tx = d.tx, last = now, g = d.row._g;
      (function glide(t) {   // a long glide with very little friction, then it carries on moving on its own
        if (d.row._g !== g) return;
        var dt = Math.min(3, ((t || performance.now()) - last) / 16.67); last = t || performance.now();
        v *= Math.pow(0.991, dt); tx = wrapX(d.row, tx + v * dt); d.row.style.transform = 'translateX(' + tx + 'px)';
        if (Math.abs(v) > 0.35) requestAnimationFrame(glide); else resume(d.row, tx);
      })();
    }
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  }
  var great = $('#greatRow');
  // a person card: tap (or Enter) shows their focused, consistent action; the row holds still while one is open
  function togglePerson(gp) {
    if (!gp || !great) return;
    var open = !gp.classList.contains('open');
    $$('.gp.open', great).forEach(function (x) { x.classList.remove('open'); var m = $('.gp-more', x); if (m) m.textContent = 'See how'; });
    if (open) { gp.classList.add('open'); var m = $('.gp-more', gp); if (m) m.textContent = 'Close'; }
    great.classList.toggle('held', open);
  }
  if (great) {
    great.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('gp')) { e.preventDefault(); togglePerson(e.target); } });
    document.addEventListener('pointerdown', function (e) { if (!e.target.closest('#greatRow')) { $$('.gp.open', great).forEach(function (x) { togglePerson(x); }); } });
    if (REDUCE) great.addEventListener('click', function (e) { togglePerson(e.target.closest('.gp')); });
  }
  if (!REDUCE) {
    if (box) flingRows(box, function (el) { var ci = el.closest('.yc'); if (ci) pin(+ci.getAttribute('data-ci')); });
    if (great) flingRows(great, function (el) { togglePerson(el.closest('.gp')); });
  } else if (box) {
    box.addEventListener('click', function (e) { var ci = e.target.closest('.yc'); if (ci) pin(+ci.getAttribute('data-ci')); });
  }

})();
