  /* ---------- Cronómetros (16/11: "Cronómetro era bueno, poné varios como ese") ----------
     Frenar en el momento justo sin ver: un número, una barra o una pelota que se esconde.
     noRamp: estos no se aceleran (si el tiempo corriera más rápido no se podría calcular). */
  function mkClock(o) {
    var C = G("Clock_" + o.id, {
      noRamp: true,
      init: function () { this.tol = o.tol || 0.3; this.res = ""; this.next(); },
      next: function () {
        this.target = Math.round(rnd(o.t0, o.t1) * 10) / 10; this.tt = 0; this.phase = "run"; this.pause = 0; this.res = "";
        if (o.mode === "tunnel") { this.sx = 30; this.ex = rnd(this.W * 0.55, this.W - 50); this.sp = (this.ex - this.sx) / this.target; this.t0x = this.sx + (this.ex - this.sx) * (o.vis || 0.4); }
      },
      shown: function () { return this.phase !== "run" || (o.mode === "num" ? this.tt < (o.vis == null ? 1 : o.vis) : this.tt < this.target * (o.vis || 0.4)); },
      step: function (dt) {
        if (this.phase === "run") { this.tt += dt; if (this.tt > this.target + 2.2) { this.hurt(); if (this.state !== "play") return; this.next(); } }
        else { this.pause -= dt; if (this.pause <= 0) this.next(); }
      },
      act: function () {
        if (this.phase !== "run") return;
        var d = this.tt - this.target, ad = Math.abs(d);
        this.res = o.mode === "num" ? (d >= 0 ? "+" : "−") + ad.toFixed(2) + " s" : ""; this.phase = "stopped"; this.pause = 1.0;
        if (ad <= this.tol) { this.good(ad < 0.06 ? 2 : 1, this.cx, this.cy - 130, ad < 0.06); this.tol = Math.max(0.08, this.tol * 0.93); } else this.hurt();
      },
      draw: function (now) {
        var c = this.ctx, see = this.shown(), cx = this.cx, cy = this.cy;
        if (o.mode === "num") {
          txt(c, "Frená en " + this.target.toFixed(1), cx, cy - 90, 28, "#fff");
          txt(c, see ? this.tt.toFixed(2) : "?.??", cx, cy, 92, see ? "#fff" : "rgba(255,255,255,0.4)");
          if (this.res) txt(c, this.res, cx, cy + 80, 30, "#ffd23f");
        } else if (o.mode === "bar") {
          var bw = 70, bh = Math.min(380, this.H - this.pt - this.pb - 120), bx = cx - bw / 2, by = cy - bh / 2, k = Math.min(1.25, this.tt / this.target) / 1.25, line = by + bh - bh / 1.25;
          fillR(c, bx - 6, by - 6, bw + 12, bh + 12, 14, TH.p2);
          fillR(c, bx, by + bh - bh * k, bw, bh * k, 8, o.col);
          if (!see) fillR(c, bx - 6, by - 6, bw + 12, bh * 0.82, 14, TH.p1 || "#333");
          c.fillStyle = "#fff"; c.fillRect(bx - 22, line - 3, bw + 44, 6);
        } else {
          var y = cy, x = this.phase === "run" ? this.sx + this.sp * this.tt : this.sx + this.sp * this.tt;
          c.fillStyle = "#fff"; c.fillRect(this.ex - 3, y - 46, 6, 92);
          dot(c, x, y, 18, o.col); face(c, x + 2, y, 18, 1);
          if (!see) { fillR(c, this.t0x, y - 34, this.W - this.t0x + 20, 68, 12, TH.p2); c.fillStyle = "#fff"; c.fillRect(this.ex - 3, y - 46, 6, 12); c.fillRect(this.ex - 3, y + 34, 6, 12); }
        }
        if (this.phase === "run") this.ghost(cx, cy + 150, now);
      }
    });
    regD("cl_" + o.id, o.name, o.how, o.col, C, "workshop");
  }
  [
    { id: "fast", name: "Cronómetro veloz", how: "Tiempos cortitos. Frená justo.", mode: "num", t0: 1, t1: 2, vis: 0.5, col: "#ff4d6d" },
    { id: "long", name: "Cronómetro largo", how: "Tiempos largos. Frená justo.", mode: "num", t0: 4, t1: 7, vis: 1.2, col: "#ff9f1c" },
    { id: "blind", name: "Cronómetro a ciegas", how: "No ves el tiempo nunca. Frená justo.", mode: "num", t0: 2, t1: 4, vis: 0, col: "#c77dff" },
    { id: "fine", name: "Al centésimo", how: "Muy poco margen. Frená justo.", mode: "num", t0: 2, t1: 4, vis: 1, tol: 0.18, col: "#ffd23f" },
    { id: "bar", name: "Barra escondida", how: "La barra sube y se tapa. Frená en la raya.", mode: "bar", t0: 1.5, t1: 3, vis: 0.45, col: "#3ddc84" },
    { id: "bar2", name: "Barra a ciegas", how: "Se tapa enseguida. Frená en la raya.", mode: "bar", t0: 1.2, t1: 2.5, vis: 0.25, col: "#ff5fd2" },
    { id: "tun", name: "Túnel", how: "La pelota entra al túnel. Frená en la raya.", mode: "tunnel", t0: 1.5, t1: 3, vis: 0.4, col: "#ffd23f" },
    { id: "tun2", name: "Túnel largo", how: "Túnel más largo. Frená en la raya.", mode: "tunnel", t0: 2.5, t1: 4, vis: 0.3, col: "#ff9f1c" }
  ].forEach(mkClock);
