/* STARS, for the Focus Room: a faint field drifting left, each star breathing a little, and one soft blue light high on
   the left. Full resolution. (Moved out of focus.html unchanged when the backgrounds became modules, 2026-10-24.) */
(function () {
  window.FRBG = window.FRBG || {};
  FRBG.stars = function (canvas) {
    var x = canvas.getContext('2d'), STARS = [], R = 1337;
    function rnd() { R = (R * 16807) % 2147483647; return R / 2147483647; }
    for (var n = 0; n < 190; n++) { var a1 = rnd(), a2 = rnd(), a3 = rnd(); STARS.push({ x: a1, y: a2, d: 0.3 + 0.7 * a3, r: 0.35 + a3 * 0.95, a: 0.1 + 0.45 * ((a1 * 7.13 + a2 * 3.7) % 1), p: a2 * 6.28 }); }
    function resize() {
      var d = Math.min(1.5, window.devicePixelRatio || 1), w = Math.round(canvas.clientWidth * d) || 2, h = Math.round(canvas.clientHeight * d) || 2;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }
    function draw(t) {
      var w = canvas.width, h = canvas.height, dpr = w / Math.max(1, canvas.clientWidth);
      x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
      var g = x.createRadialGradient(w * 0.3, -h * 0.1, 0, w * 0.3, -h * 0.1, h * 0.8); g.addColorStop(0, 'rgba(70,90,160,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      STARS.forEach(function (st) {
        var sx = ((st.x * w - t * 1.4 * st.d * dpr) % w + w) % w, sy = st.y * h, al = st.a * (0.8 + 0.2 * Math.sin(t * 0.35 * st.d + st.p));
        x.fillStyle = 'rgba(235,240,255,' + al.toFixed(3) + ')'; x.beginPath(); x.arc(sx, sy, st.r * dpr, 0, 6.2832); x.fill();
      });
    }
    return { draw: draw, resize: resize };
  };
})();
