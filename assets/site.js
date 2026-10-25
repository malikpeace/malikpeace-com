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
      var row = e.target.closest('.row'); if (!row || e.button) return;
      row._g = (row._g || 0) + 1;   // a new grab stops any glide still running on this row
      var s = rowState(row);
      drag = { row: row, x0: e.clientX, y0: e.clientY, tx0: s.tx, tx: s.tx, moved: false, el: e.target, hist: [[performance.now(), e.clientX]] };
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
    function end() {
      if (!drag) return;
      var d = drag; drag = null; d.row.classList.remove('grab');
      if (!d.moved) { resume(d.row, d.tx0); if (onTap) onTap(d.el); return; }
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
