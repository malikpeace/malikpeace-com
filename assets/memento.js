// memento.js: draws the real Memento card (Frost Aurora) with mementoapp.co's own engine, the same as #7.
// Usage: <script src="shared/memento-card.js"></script><script src="shared/memento.js"></script>
// then put <div data-mcard></div> where the card goes (give its parent a width; the card keeps the 320:452 shape)
// and call MEMENTO7.mount() after the markup exists (it is safe to call again for new cards).
window.MEMENTO7 = (function () {
  var AURORA_FROST = { c1: [0, 1, 190 / 255, 0.95], c2: [150 / 255, 90 / 255, 1, 0.85], c3: [40 / 255, 200 / 255, 1, 0.9], c4: [1, 90 / 255, 200 / 255, 0.7],
    fa: [5 / 255, 11 / 255, 18 / 255], fb: [2 / 255, 4 / 255, 10 / 255], plat: 0.08, fk: 1 };
  var cards = [];
  function mount(root) {
    if (!window.ML) return cards;
    (root || document).querySelectorAll('[data-mcard]:not([data-mcard-on])').forEach(function (h) {
      h.setAttribute('data-mcard-on', '');
      var c = new ML.Card(h, { look: 3, spill: +(h.getAttribute('data-spill') || 1) });
      c.set(AURORA_FROST, 0); c.mark('rgba(238,246,255,0.95)'); cards.push(c);
    });
    return cards;
  }
  return { mount: mount, AURORA_FROST: AURORA_FROST, cards: function () { return cards; } };
})();
