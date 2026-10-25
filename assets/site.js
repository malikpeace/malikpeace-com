// site.js: malikpeace.com. The moving comments (grab them, tap one to pin it), the steps, the email forms,
// the real Memento card, the throwable face and Flash bang mode.
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
    if (fbBtn) { fbBtn.setAttribute('aria-pressed', String(t === 'light')); fbBtn.querySelector('.lbl').textContent = t === 'light' ? 'Dark mode' : 'Flash bang mode'; }
    var meta = $('meta[name="theme-color"]'); if (meta) meta.content = t === 'light' ? '#ffffff' : '#000000';
  }
  if (fbBtn) {
    setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    fbBtn.addEventListener('click', function () {
      var toLight = root.getAttribute('data-theme') !== 'light';
      if (REDUCE) { setTheme(toLight ? 'light' : 'dark'); return; }
      var fx = document.createElement('div'); fx.className = toLight ? 'fb-flash' : 'fb-dark'; document.body.appendChild(fx);
      if (toLight) { document.body.classList.add('fb-shake'); }
      // the theme flips under the flash at its brightest, then the flash fades
      setTimeout(function () { setTheme(toLight ? 'light' : 'dark'); }, toLight ? 90 : 160);
      setTimeout(function () { fx.remove(); document.body.classList.remove('fb-shake'); }, toLight ? 1500 : 520);
    });
  }

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
  function card(c, i) {
    return '<div class="yc" data-ci="' + i + '"><span class="av" style="background-position:-' + ((c.s % 32) * 40) + 'px -' + (Math.floor(c.s / 32) * 40) + 'px"></span><div class="bd"><div class="hd"><b>' + esc(c.h) + '</b></div>' +
      '<p class="tx">' + esc(c.t) + '</p><div class="ac">' + THUMB + '<span class="ct">' + c.lt + '</span><span style="display:inline-flex;transform:rotate(180deg)">' + THUMB + '</span>' +
      '<span class="rp">Reply</span></div></div></div>';
  }
  var box = $('#ymarq7');
  function buildMarquee(all) {
    if (!box) return;
    var R = all ? (innerWidth < 620 ? 12 : 14) : 5, n = all ? C.length : Math.min(250, C.length), rows = [], sp = [7, 8.5, 6.5, 7.8, 7.4];
    for (var i = 0; i < R; i++) rows.push([]);
    for (var k = 0; k < n; k++) rows[k % R].push(card(C[k], k));
    box.innerHTML = rows.map(function (r, i) { return '<div class="row' + (i % 2 ? ' rev' : '') + '" style="--dur:' + Math.round(r.length * sp[i % 5]) + 's">' + r.join('') + r.join('') + '</div>'; }).join('');
    box.classList.toggle('is-all', !!all);
  }
  buildMarquee(false);
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
    ov.innerHTML = '<div class="pin7-card">' + card(c, i) + '<button type="button" class="pin7-x" aria-label="Close"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>';
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
  function resume(row, tx) {
    var half = row.scrollWidth / 2, dur = parseFloat(row.style.getPropertyValue('--dur')) || 200;
    tx = ((tx % half) - half) % half;   // into (-half, 0]
    var p = -tx / half, rev = row.classList.contains('rev');
    row.style.transform = ''; row.style.animation = '';
    row.style.animationDelay = (-(rev ? 1 - p : p) * dur).toFixed(2) + 's';
  }
  if (box && !REDUCE) {
    var drag = null;
    box.addEventListener('pointerdown', function (e) {
      var row = e.target.closest('.row'); if (!row || e.button) return;
      var s = rowState(row);
      drag = { row: row, x0: e.clientX, y0: e.clientY, tx0: s.tx, tx: s.tx, moved: false, v: 0, t: performance.now(), lx: e.clientX, ci: e.target.closest('.yc') };
      row.style.animation = 'none'; row.style.transform = 'translateX(' + s.tx + 'px)';
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x0;
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; drag.row.classList.add('grab'); try { drag.row.setPointerCapture(e.pointerId); } catch (er) {} }
      if (!drag.moved) return;
      var now = performance.now(); drag.v = (e.clientX - drag.lx) / Math.max(1, now - drag.t); drag.t = now; drag.lx = e.clientX;
      drag.tx = drag.tx0 + dx; drag.row.style.transform = 'translateX(' + drag.tx + 'px)';
    });
    function end() {
      if (!drag) return;
      var d = drag; drag = null; d.row.classList.remove('grab');
      if (!d.moved) { resume(d.row, d.tx0); if (d.ci) pin(+d.ci.getAttribute('data-ci')); return; }
      var v = d.v * 16, tx = d.tx;
      (function glide() {   // a short glide with friction, then it moves on its own again
        v *= 0.92; tx += v; d.row.style.transform = 'translateX(' + tx + 'px)';
        if (Math.abs(v) > 0.4) requestAnimationFrame(glide); else resume(d.row, tx);
      })();
    }
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  } else if (box) {
    box.addEventListener('click', function (e) { var ci = e.target.closest('.yc'); if (ci) pin(+ci.getAttribute('data-ci')); });
  }

  /* ---------------- the throwable face ---------------- */
  var fig = $('.s7-me .ph'), img = fig && $('img', fig);
  if (img && !REDUCE) {
    img.draggable = false; fig.classList.add('throw');
    var hint = document.createElement('span'); hint.className = 'throw-hint'; hint.textContent = 'Throw me'; fig.appendChild(hint);
    var st = null, pos = { x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0 }, raf = 0, home = 0;
    function apply() { img.style.transform = 'translate(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px) rotate(' + pos.r.toFixed(1) + 'deg)'; }
    function bounds() { var r = fig.getBoundingClientRect(); return { l: -r.left, t: -r.top, r: innerWidth - r.right, b: innerHeight - r.bottom }; }
    function step() {
      var b = bounds(), now = performance.now(), back = now > home;
      if (back) { pos.vx += -pos.x * 0.02; pos.vy += -pos.y * 0.02; pos.vr += -pos.r * 0.02; }
      pos.vy += back ? 0 : 0.6;   // a little gravity while it flies
      pos.vx *= back ? 0.86 : 0.995; pos.vy *= back ? 0.86 : 0.995; pos.vr *= 0.96;
      pos.x += pos.vx; pos.y += pos.vy; pos.r += pos.vr;
      if (pos.x < b.l) { pos.x = b.l; pos.vx = Math.abs(pos.vx) * 0.7; pos.vr *= -0.8; }
      if (pos.x > b.r) { pos.x = b.r; pos.vx = -Math.abs(pos.vx) * 0.7; pos.vr *= -0.8; }
      if (pos.y < b.t) { pos.y = b.t; pos.vy = Math.abs(pos.vy) * 0.7; }
      if (pos.y > b.b) { pos.y = b.b; pos.vy = -Math.abs(pos.vy) * 0.62; pos.vx *= 0.9; }
      apply();
      if (back && Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.r) < 0.6 && Math.abs(pos.vx) + Math.abs(pos.vy) < 0.3) { pos = { x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0 }; img.style.transform = ''; fig.classList.remove('flying'); raf = 0; return; }
      raf = requestAnimationFrame(step);
    }
    img.addEventListener('pointerdown', function (e) {
      if (e.button) return; e.preventDefault();
      cancelAnimationFrame(raf); raf = 0; fig.classList.add('flying', 'grabbed'); hint.classList.add('gone');
      st = { x0: e.clientX - pos.x, y0: e.clientY - pos.y, lx: e.clientX, ly: e.clientY, t: performance.now(), vx: 0, vy: 0 };
      try { img.setPointerCapture(e.pointerId); } catch (er) {}
    });
    img.addEventListener('pointermove', function (e) {
      if (!st) return;
      var now = performance.now(), dt = Math.max(1, now - st.t);
      st.vx = (e.clientX - st.lx) / dt * 16; st.vy = (e.clientY - st.ly) / dt * 16; st.t = now; st.lx = e.clientX; st.ly = e.clientY;
      pos.x = e.clientX - st.x0; pos.y = e.clientY - st.y0; pos.r = Math.max(-25, Math.min(25, st.vx * 1.2)); apply();
    });
    function release() {
      if (!st) return;
      pos.vx = st.vx; pos.vy = st.vy; pos.vr = st.vx * 0.6; st = null; fig.classList.remove('grabbed');
      home = performance.now() + 1600; raf = requestAnimationFrame(step);
    }
    img.addEventListener('pointerup', release); img.addEventListener('pointercancel', release);
  }
})();
