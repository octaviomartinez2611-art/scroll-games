s=open('swipe-arcade.html',encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1,(s.count(old),old[:90]); s=s.replace(old,new)

# ---------- markup ----------
rep('<p class="note">Prototipo: tus amigos y mensajes se guardan solo en este dispositivo. Todavía no hay envío real entre personas.</p>',
    '<p class="note" id="addErr">Agregá a tus compañeros por su nombre de usuario.</p>')
rep('<button class="toggle" id="sndBtn" aria-pressed="true">Sonido <em id="sndState">Sí</em></button>',
'''<button class="toggle" id="sndBtn" aria-pressed="true">Sonido <em id="sndState">Sí</em></button>
      <div class="acct" id="acct"></div>
      <div id="adminBox"></div>''')
rep('<nav class="bar" aria-label="Navegación">','''<section class="login" id="login" hidden aria-label="Entrar">
    <div class="lgbox">
      <h1>Swipe Arcade</h1>
      <p class="note">Entrá con tu usuario para guardar tus juegos y chatear con tus amigos.</p>
      <form id="lgForm" autocomplete="off">
        <input id="lgName" maxlength="16" placeholder="Usuario" autocapitalize="none" spellcheck="false" aria-label="Usuario">
        <input id="lgPin" maxlength="6" placeholder="PIN (4 a 6 números)" inputmode="numeric" type="password" aria-label="PIN">
        <p class="lgerr" id="lgErr"></p>
        <button class="btn" type="submit" id="lgIn">Entrar</button>
        <button class="btn ghost" type="button" id="lgNew">Crear cuenta</button>
      </form>
      <button class="lgskip" id="lgSkip">Jugar sin cuenta</button>
      <p class="note">No uses el mismo PIN que en otras cosas.</p>
    </div>
  </section>
  <nav class="bar" aria-label="Navegación">''')

# ---------- css ----------
rep('/* ---- sheets ---- */','''.login { position: fixed; inset: 0; z-index: 30; background: #000; display: flex; align-items: center; justify-content: center; padding: 24px max(16px, env(safe-area-inset-right, 0px)) 24px max(16px, env(safe-area-inset-left, 0px)); }
.lgbox { width: min(100%, 380px); display: flex; flex-direction: column; gap: 14px; }
.lgbox h1 { font: 700 34px/1.05 var(--display); }
.lgbox form { display: flex; flex-direction: column; gap: 10px; }
.lgbox input { background: var(--panel2); border: 0; border-radius: 14px; padding: 15px 14px; color: #fff; font: 500 17px/1.2 var(--body); user-select: text; -webkit-user-select: text; }
.lgbox input:focus { outline: 2px solid var(--brand); }
.lgerr { min-height: 18px; color: #ff6b81; font: 600 14px/1.3 var(--body); }
.lgskip { color: var(--dim); font: 600 14px/1 var(--body); padding: 10px; }
.acct { display: flex; justify-content: space-between; align-items: center; background: var(--panel); border-radius: 16px; padding: 14px 16px; font: 600 15px/1 var(--body); }
.acct button { color: #ff6b81; font: 700 14px/1 var(--body); }
.adm { display: flex; flex-direction: column; gap: 8px; }
.adm h2 { font: 700 18px/1.1 var(--display); padding-top: 6px; }
.adm .rep { background: var(--panel); border-radius: 14px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; font: 500 14px/1.35 var(--body); overflow-wrap: anywhere; }
.adm .rep small { color: var(--dim); }
.adm .row { display: flex; gap: 8px; }
.adm .row button { flex: 1; padding: 10px; border-radius: 12px; background: var(--panel2); font: 700 13px/1 var(--body); }
.adm .row button.del { background: var(--brand); }
.adm form { display: flex; gap: 8px; }
.adm input { flex: 1; min-width: 0; background: var(--panel2); border: 0; border-radius: 12px; padding: 11px 12px; color: #fff; font: 500 15px/1 var(--body); user-select: text; -webkit-user-select: text; }
.admlink { color: var(--dim); font: 600 13px/1 var(--body); padding: 8px 0; align-self: center; }
.bub.them, .gcard.them { align-self: flex-start; }
.bub.pend, .gcard.pend { opacity: 0.45; }
.pendnote { align-self: flex-end; margin: -2px 2px 0; font-size: 12px; color: var(--muted, #8a8a99); }
.bub.them { background: var(--panel2); border-radius: 18px 18px 18px 4px; }
.repbtn { align-self: flex-start; font: 700 12px/1 var(--body); color: #ff6b81; padding: 4px 6px; }
.tab { position: relative; }
.tab.dot::after { content: ""; position: absolute; top: 10px; left: calc(50% + 10px); width: 9px; height: 9px; border-radius: 50%; background: var(--brand); }
/* ---- sheets ---- */''')
rep('html, body { height: 100%; }','html, body { height: 100%; margin: 0; }\nbody { height: 100dvh; }')
rep('.bar { display: flex; gap: 6px; flex: none; padding: 6px max(16px, env(safe-area-inset-right, 0px)) 8px max(16px, env(safe-area-inset-left, 0px));',
    '.bar { display: flex; gap: 6px; flex: none; padding: 6px max(16px, env(safe-area-inset-right, 0px)) max(8px, env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));')
# Netlify pone su cartel abajo a la derecha: los botones van a la izquierda y le dejan ese lugar
rep('/* ---- sheets ---- */','.bar { padding-right: 200px !important; }\n@media (min-width: 560px) { .bar { padding-right: 16px !important; } }\n/* ---- sheets ---- */')

# ---------- state sync hook ----------
rep('  function save() { try { localStorage.setItem("swipe-arcade-v3", JSON.stringify(P)); } catch (e) {} }',
    '  function save() { try { localStorage.setItem("swipe-arcade-v3", JSON.stringify(P)); } catch (e) {} dirty = true; }\n  var dirty = false;')
rep('    if (v === "friends") renderFriends(); if (v === "profile") renderProfile(); if (v === "chat") renderChat();',
    '    if (v === "friends") { renderFriends(); loadFriends(); } if (v === "profile") renderProfile(); if (v === "chat") { renderChat(); loadMsgs(); }')
rep('$("nameIn").value = P.name; paintAv();','$("nameIn").value = ME ? "@" + ME : P.name; $("nameIn").readOnly = !!ME; paintAv(); renderAcct();')

# ---------- send sheet ----------
i=s.index('  $("rSend").addEventListener("click", function () {'); j=s.index('  $("sendCancel").addEventListener')
s=s[:i]+'''  $("rSend").addEventListener("click", function () {
    var list = $("sendList"), id = slides[activeIdx()].cfg.id; list.innerHTML = "";
    if (!FR.length) {
      var p = document.createElement("p"); p.textContent = TOK ? "Todavía no tenés amigos. Agregá a alguien para enviarle juegos." : "Entrá con tu cuenta para enviar juegos a tus amigos."; list.appendChild(p);
      var b = document.createElement("button"); b.className = "btn"; b.textContent = TOK ? "Agregar amigos" : "Entrar"; b.onclick = function () { if (TOK) setView("friends"); else { closeSheets(); showLogin(); } }; list.appendChild(b);
    } else FR.forEach(function (f) {
      var b = document.createElement("button"); b.className = "pick"; b.innerHTML = '<span class="av" style="--h:' + hueOf(f.name) + ';width:36px;height:36px;font-size:16px">' + esc(f.name[0].toUpperCase()) + '</span>' + esc(f.name);
      b.onclick = function () { sendGame(f.name, id); closeSheets(); }; list.appendChild(b);
    });
    $("sendSheet").hidden = false; paused = true;
  });
'''+s[j:]

# ---------- friends + chat (server) ----------
i=s.index('  /* friends */'); j=s.index('  /* profile */')
s=s[:i]+r'''  /* ---------- servidor: cuenta, amigos y mensajes ---------- */
  var TOK = null, ME = null, ADMIN = false, FR = [], MS = {}, chatWith = null;
  try { TOK = localStorage.getItem("sa-token"); } catch (e) {}
  if (!P.read) P.read = {};
  function api(path, opts) {
    opts = opts || {}; var h = { "content-type": "application/json" }; if (TOK) h["x-token"] = TOK;
    return fetch("/api/" + path, { method: opts.method || "GET", headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined, keepalive: !!opts.keep })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (r.status === 401 && TOK && path !== "login" && path !== "register") signOut(true); if (!r.ok) throw new Error(d.error || "No se pudo conectar."); return d; }); }, function () { throw new Error("Sin conexión. Probá de nuevo."); });
  }
  function stateCopy() { var c = {}; for (var k in P) if (k !== "friends") c[k] = P[k]; return c; }
  function pushState(keep) { if (!TOK || !dirty) return; dirty = false; api("state", { method: "PUT", body: { state: stateCopy() }, keep: keep }).catch(function () { dirty = true; }); }
  setInterval(function () { pushState(false); }, 20000);
  window.addEventListener("pagehide", function () { pushState(true); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) pushState(true); });
  function applyState(st) {
    if (st) { for (var k in st) P[k] = st[k]; if (!P.read) P.read = {}; if (!P.st) P.st = {}; try { localStorage.setItem("swipe-arcade-v3", JSON.stringify(P)); } catch (e) {} }
    else { dirty = true; pushState(false); }
    sndUI(); spdUI(); syncRail();
  }
  function hueOf(s) { var h = 0; for (var k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) % 360; return h; }
  function isNew(f) { return !!f.last && f.last.from !== ME && f.lastKey > (P.read[f.name] || ""); }
  function badge() { var t = document.querySelector('.tab[data-v="friends"]'); if (t) t.classList.toggle("dot", FR.some(isNew)); }
  function loadBests() { if (!TOK) return; api("bests").then(function (d) { FB = d.bests || {}; var g = cache[activeIdx()]; if (g) g.hud(); }).catch(function () {}); }
  function loadTrends() { api("trends").then(function (d) { if (d && d.pop) TR = d; }).catch(function () {}); }
  loadTrends(); setInterval(loadTrends, 600000);
  function loadFriends() { if (!TOK) return; api("friends").then(function (d) { FR = d.friends || []; badge(); if (view === "friends") renderFriends(); }).catch(function () {}); }
  function renderFriends() {
    var l = $("flist"); l.innerHTML = ""; $("addForm").hidden = !TOK;
    if (!TOK) {
      var e = document.createElement("p"); e.className = "empty"; e.textContent = "Entrá con tu cuenta para agregar amigos y chatear."; l.appendChild(e);
      var b = document.createElement("button"); b.className = "btn"; b.textContent = "Entrar"; b.onclick = showLogin; l.appendChild(b); return;
    }
    if (!FR.length) { var e2 = document.createElement("p"); e2.className = "empty"; e2.textContent = "Todavía no agregaste a nadie. Escribí el usuario de un compañero arriba y tocá Agregar."; l.appendChild(e2); return; }
    FR.forEach(function (f) {
      var b = document.createElement("button"), last = f.last, nw = isNew(f); b.className = "frow";
      var prev = last ? (last.from === ME ? "Vos: " : "") + (last.game ? "Juego: " + (byId[last.game] ? byId[last.game].name : "") : last.text) : "Tocá para chatear";
      b.innerHTML = '<span class="av" style="--h:' + hueOf(f.name) + '">' + esc(f.name[0].toUpperCase()) + '</span><div><b>' + esc(f.name) + (nw ? ' <span style="color:var(--brand)">•</span>' : '') + '</b><span' + (nw ? ' style="color:#fff"' : '') + '>' + esc(prev) + '</span></div>';
      b.onclick = function () { chatWith = f.name; setView("chat"); }; l.appendChild(b);
    });
  }
  $("addForm").addEventListener("submit", function (e) {
    e.preventDefault(); var n = $("addIn").value.trim().replace(/^@/, ""), er = $("addErr"); if (!n) return;
    api("friends", { method: "POST", body: { name: n } }).then(function (d) { $("addIn").value = ""; er.textContent = d.name + " ya es tu amigo."; loadFriends(); }).catch(function (x) { er.textContent = x.message; });
  });
  function sendGame(name, gid) { api("msgs", { method: "POST", body: { to: name, game: gid } }).then(function (d) { (MS[name] = MS[name] || []).push(d.msg); if (view === "chat" && chatWith === name) renderChat(); loadFriends(); }).catch(function () {}); }
  function loadMsgs() {
    if (!TOK || !chatWith) return; var who = chatWith, arr = MS[who] || (MS[who] = []), after = arr.length ? arr[arr.length - 1].k : "";
    api("msgs?with=" + encodeURIComponent(who) + "&after=" + encodeURIComponent(after)).then(function (d) {
      var a = MS[who], have = {}; a.forEach(function (x) { have[x.k] = 1; });
      var add = (d.msgs || []).filter(function (x) { return !have[x.k]; }); if (add.length) { MS[who] = a.concat(add); if (view === "chat" && chatWith === who) renderChat(); }
    }).catch(function () {});
  }
  function renderChat() {
    if (!chatWith) { setView("friends"); return; }
    $("chatName").textContent = chatWith; var m = $("msgs"), list = MS[chatWith] || []; m.innerHTML = "";
    if (!list.length) { var e = document.createElement("p"); e.className = "empty"; e.textContent = "Escribí un mensaje o mandale un juego con el botón +."; m.appendChild(e); }
    list.forEach(function (x) {
      var mine = x.from === ME, el;
      if (x.game && byId[x.game]) {
        var g = byId[x.game]; el = document.createElement("div"); el.className = "gcard" + (mine ? "" : " them");
        el.innerHTML = '<b>' + esc(g.name) + '</b><span>' + (mine ? "Le enviaste este juego" : "Te envió este juego") + '</span>'; var b = document.createElement("button"); b.textContent = "Jugar"; b.onclick = function () { goTo(g.id); }; el.appendChild(b);
      } else { el = document.createElement("div"); el.className = "bub" + (mine ? "" : " them"); el.textContent = x.text || ""; }
      m.appendChild(el);
      if (!mine) {
        el.addEventListener("click", function (ev) {
          if (ev.target.tagName === "BUTTON") return; var nx = el.nextSibling; if (nx && nx.className === "repbtn") { nx.remove(); return; }
          var r = document.createElement("button"); r.className = "repbtn"; r.textContent = "Reportar mensaje";
          r.onclick = function () { r.disabled = true; api("report", { method: "POST", body: { with: chatWith, k: x.k } }).then(function () { r.textContent = "Reportado. Gracias."; }).catch(function (er) { r.textContent = er.message; }); };
          el.parentNode.insertBefore(r, el.nextSibling);
        });
      }
    });
    if (list.length && P.read[chatWith] !== list[list.length - 1].k) { P.read[chatWith] = list[list.length - 1].k; save(); badge(); }
    m.scrollTop = m.scrollHeight;
  }
  $("chatBack").addEventListener("click", function () { setView("friends"); });
  $("chatRm").addEventListener("click", function () { var n = chatWith; api("friends", { method: "DELETE", body: { name: n } }).then(function () { FR = FR.filter(function (f) { return f.name !== n; }); setView("friends"); }).catch(function () {}); });
  $("chatForm").addEventListener("submit", function (e) {
    e.preventDefault(); var t = $("chatIn").value.trim(), who = chatWith; if (!who || !t) return; $("chatIn").value = "";
    api("msgs", { method: "POST", body: { to: who, text: t } }).then(function (d) { (MS[who] = MS[who] || []).push(d.msg); if (chatWith === who) renderChat(); }).catch(function (x) { $("chatIn").value = t; });
  });
  $("chatGame").addEventListener("click", function () {
    var l = $("pickList"); l.innerHTML = "";
    CATALOG.forEach(function (g) {
      var b = document.createElement("button"); b.className = "pick"; b.innerHTML = esc(g.name);
      b.onclick = function () { sendGame(chatWith, g.id); closeSheets(); }; l.appendChild(b);
    });
    $("pickSheet").hidden = false;
  });
  $("pickCancel").addEventListener("click", closeSheets);
  var tickN = 0;
  setInterval(function () {
    if (!TOK || document.hidden) return; tickN++;
    if (view === "chat") { if (tickN % 3 === 0) loadMsgs(); } else if (view === "friends") { if (tickN % 10 === 0) loadFriends(); } else if (tickN % 60 === 0) loadFriends();
    if (tickN % 90 === 0) loadBests();
  }, 1000);

  /* cuenta: entrar, crear, salir */
  function showLogin() { $("login").hidden = false; paused = true; $("lgErr").textContent = ""; }
  function hideLogin() { $("login").hidden = true; paused = false; }
  function signedIn(d) {
    TOK = d.token || TOK; ME = d.name; ADMIN = !!d.admin; try { localStorage.setItem("sa-token", TOK); } catch (e) {}
    applyState(d.state); hideLogin(); loadFriends(); loadBests(); if (view === "profile") renderProfile(); if (view === "friends") renderFriends();
  }
  function signOut(expired) {
    if (!expired && TOK) { pushState(true); api("logout", { method: "POST" }).catch(function () {}); }
    TOK = null; ME = null; ADMIN = false; FR = []; MS = {}; FB = {}; try { localStorage.removeItem("sa-token"); } catch (e) {}
    badge(); setView("play"); showLogin(); if (expired) $("lgErr").textContent = "Tu sesión venció. Entrá de nuevo.";
  }
  function doAuth(kind) {
    var n = $("lgName").value.trim(), p = $("lgPin").value.trim(), er = $("lgErr"); er.textContent = "";
    if (!n || !p) { er.textContent = "Completá el usuario y el PIN."; return; }
    $("lgIn").disabled = $("lgNew").disabled = true;
    api(kind, { method: "POST", body: { name: n, pin: p } }).then(signedIn).catch(function (x) { er.textContent = x.message; }).then(function () { $("lgIn").disabled = $("lgNew").disabled = false; });
  }
  $("lgForm").addEventListener("submit", function (e) { e.preventDefault(); doAuth("login"); });
  $("lgNew").addEventListener("click", function () { doAuth("register"); });
  $("lgSkip").addEventListener("click", hideLogin);
  function renderAcct() {
    var a = $("acct"), box = $("adminBox"); a.innerHTML = ""; box.innerHTML = "";
    var sp = document.createElement("span"), b = document.createElement("button");
    if (TOK) { sp.textContent = "Cuenta: @" + ME; b.textContent = "Salir"; b.onclick = function () { signOut(false); }; }
    else { sp.textContent = "Sin cuenta"; b.textContent = "Entrar"; b.style.color = "#fff"; b.onclick = showLogin; }
    a.appendChild(sp); a.appendChild(b);
    if (!TOK) return;
    var w = document.createElement("div"); w.className = "adm"; box.appendChild(w);
    if (!ADMIN) {
      var lk = document.createElement("button"); lk.className = "admlink"; lk.textContent = "Soy el administrador"; w.appendChild(lk);
      lk.onclick = function () {
        lk.remove(); var f = document.createElement("form"), inp = document.createElement("input"), go = document.createElement("button"), msg = document.createElement("p");
        inp.placeholder = "Código de administrador"; go.className = "btn"; go.style.alignSelf = "auto"; go.style.padding = "0 16px"; go.textContent = "Activar"; msg.className = "note";
        f.appendChild(inp); f.appendChild(go); w.appendChild(f); w.appendChild(msg);
        f.onsubmit = function (e) { e.preventDefault(); api("admin", { method: "POST", body: { code: inp.value.trim() } }).then(function () { ADMIN = true; renderAcct(); }).catch(function (x) { msg.textContent = x.message; }); };
      };
      return;
    }
    var h = document.createElement("h2"); h.textContent = "Mensajes reportados"; w.appendChild(h);
    var lst = document.createElement("div"); lst.className = "adm"; lst.textContent = "Cargando…"; w.appendChild(lst);
    api("reports").then(function (d) {
      lst.textContent = ""; if (!d.reports.length) { var p = document.createElement("p"); p.className = "note"; p.textContent = "No hay reportes."; lst.appendChild(p); return; }
      d.reports.slice().reverse().forEach(function (r) {
        var c = document.createElement("div"); c.className = "rep";
        var t = document.createElement("div"); t.textContent = r.msg.text || ("Juego: " + (byId[r.msg.game] ? byId[r.msg.game].name : r.msg.game));
        var sm = document.createElement("small"); sm.textContent = "De @" + r.msg.from + " · reportado por @" + r.by;
        var row = document.createElement("div"); row.className = "row";
        var del = document.createElement("button"); del.className = "del"; del.textContent = "Borrar mensaje";
        var ign = document.createElement("button"); ign.textContent = "Descartar";
        del.onclick = function () { api("resolve", { method: "POST", body: { r: r.r, del: true } }).then(function () { c.remove(); }); };
        ign.onclick = function () { api("resolve", { method: "POST", body: { r: r.r, del: false } }).then(function () { c.remove(); }); };
        row.appendChild(del); row.appendChild(ign); c.appendChild(t); c.appendChild(sm); c.appendChild(row); lst.appendChild(c);
      });
    }).catch(function (x) { lst.textContent = x.message; });
  }

'''+s[j:]

# start: check session before the main loop
rep("  /* ---------- main loop ---------- */","""  api("me").then(signedIn).catch(function () { if (!TOK) showLogin(); });

  /* ---------- main loop ---------- */""")

# ---------- sin internet: se juega igual; cuenta, amigos y mensajes se sincronizan al volver ----------
rep('''  try { TOK = localStorage.getItem("sa-token"); } catch (e) {}''','''  try { TOK = localStorage.getItem("sa-token"); if (TOK) ME = localStorage.getItem("sa-me"); } catch (e) {}
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var OUT = lsGet("sa-out", []), NET = navigator.onLine !== false;
  if (TOK) { FR = lsGet("sa-fr", []); MS = lsGet("sa-ms", {}); }
  (function () { var t = lsGet("sa-tr", null); if (t && t.pop) TR = t; })();''')
# distinguir "sin conexión" de otros errores
rep('''function () { throw new Error("Sin conexión. Probá de nuevo."); });''','''function () { var er = new Error("Sin conexión. Probá de nuevo."); er.net = true; NET = false; throw er; });''')
rep('''.then(function (r) { return r.json()''','''.then(function (r) { NET = true; return r.json()''')
# guardar con hora, para no pisar lo jugado sin internet
rep('''  function save() { try { localStorage.setItem("swipe-arcade-v3", JSON.stringify(P)); } catch (e) {} dirty = true; }''','''  function save() { P.ts = Date.now(); try { localStorage.setItem("swipe-arcade-v3", JSON.stringify(P)); } catch (e) {} dirty = true; }''')
rep('''    if (st) { for (var k in st) P[k] = st[k]; if (!P.read) P.read = {}; if (!P.st) P.st = {}; try { localStorage.setItem("swipe-arcade-v3", JSON.stringify(P)); } catch (e) {} }
    else { dirty = true; pushState(false); }''','''    if (st && !(P.owner === ME && (P.ts || 0) > (st.ts || 0))) { for (var k in st) P[k] = st[k]; if (!P.read) P.read = {}; if (!P.st) P.st = {}; P.owner = ME; try { localStorage.setItem("swipe-arcade-v3", JSON.stringify(P)); } catch (e) {} }
    else { P.owner = ME; dirty = true; pushState(false); }''')
rep('''  function loadTrends() { api("trends").then(function (d) { if (d && d.pop) TR = d; }).catch(function () {}); }''','''  function loadTrends() { api("trends").then(function (d) { if (d && d.pop) { TR = d; lsSet("sa-tr", d); } }).catch(function () {}); }''')
rep('''  function loadFriends() { if (!TOK) return; api("friends").then(function (d) { FR = d.friends || []; badge();''','''  function loadFriends() { if (!TOK) return; api("friends").then(function (d) { FR = d.friends || []; lsSet("sa-fr", FR); badge();''')
rep('''var add = (d.msgs || []).filter(function (x) { return !have[x.k]; }); if (add.length) { MS[who] = a.concat(add); if (view === "chat" && chatWith === who) renderChat(); }''','''var add = (d.msgs || []).filter(function (x) { return !have[x.k]; }); if (add.length) { MS[who] = a.concat(add); keepMS(); if (view === "chat" && chatWith === who) renderChat(); }''')
# mensajes: si no hay internet quedan esperando y se mandan solos cuando vuelve
rep('''  function sendGame(name, gid) { api("msgs", { method: "POST", body: { to: name, game: gid } }).then(function (d) { (MS[name] = MS[name] || []).push(d.msg); if (view === "chat" && chatWith === name) renderChat(); loadFriends(); }).catch(function () {}); }''','''  function keepMS() { var c = {}; for (var n in MS) c[n] = MS[n].slice(-60); lsSet("sa-ms", c); }
  function sendMsg(body, fail) {
    return api("msgs", { method: "POST", body: body }).then(function (d) { (MS[body.to] = MS[body.to] || []).push(d.msg); keepMS(); if (view === "chat" && chatWith === body.to) renderChat(); loadFriends(); })
      .catch(function (x) { if (x.net) { OUT.push({ to: body.to, text: body.text, game: body.game, t: Date.now() }); lsSet("sa-out", OUT); if (view === "chat" && chatWith === body.to) renderChat(); } else if (fail) fail(x); });
  }
  var flushing = false;
  function flushOut() {
    if (flushing || !TOK || !OUT.length) return; flushing = true; var o = OUT[0];
    api("msgs", { method: "POST", body: { to: o.to, text: o.text, game: o.game } }).then(function (d) {
      OUT.shift(); lsSet("sa-out", OUT); (MS[o.to] = MS[o.to] || []).push(d.msg); keepMS(); if (view === "chat" && chatWith === o.to) renderChat(); flushing = false; flushOut();
    }).catch(function (x) { if (!x.net) { OUT.shift(); lsSet("sa-out", OUT); if (view === "chat") renderChat(); } flushing = false; });
  }
  function sendGame(name, gid) { sendMsg({ to: name, game: gid }); }''')
rep('''    api("msgs", { method: "POST", body: { to: who, text: t } }).then(function (d) { (MS[who] = MS[who] || []).push(d.msg); if (chatWith === who) renderChat(); }).catch(function (x) { $("chatIn").value = t; });''','''    sendMsg({ to: who, text: t }, function () { $("chatIn").value = t; });''')
rep('''    if (list.length && P.read[chatWith] !== list[list.length - 1].k) {''','''    OUT.forEach(function (o) { if (o.to !== chatWith) return; var el; if (o.game && byId[o.game]) { el = document.createElement("div"); el.className = "gcard pend"; el.innerHTML = '<b>' + esc(byId[o.game].name) + '</b><span>Se manda cuando haya internet</span>'; } else { el = document.createElement("div"); el.className = "bub pend"; el.textContent = o.text || ""; } m.appendChild(el); });
    if (OUT.some(function (o) { return o.to === chatWith && !o.game; })) { var nt = document.createElement("p"); nt.className = "pendnote"; nt.textContent = "Se manda cuando haya internet"; m.appendChild(nt); }
    if (list.length && P.read[chatWith] !== list[list.length - 1].k) {''')
rep('''if (!list.length) { var e = document.createElement("p"); e.className = "empty";''','''if (!list.length && !OUT.some(function (o) { return o.to === chatWith; })) { var e = document.createElement("p"); e.className = "empty";''')
# cuenta: guardar el nombre para mostrarlo sin internet
rep('''    TOK = d.token || TOK; ME = d.name; ADMIN = !!d.admin; try { localStorage.setItem("sa-token", TOK); } catch (e) {}''','''    TOK = d.token || TOK; ME = d.name; ADMIN = !!d.admin; try { localStorage.setItem("sa-token", TOK); localStorage.setItem("sa-me", ME); } catch (e) {}''')
rep('''    TOK = null; ME = null; ADMIN = false; FR = []; MS = {}; FB = {}; try { localStorage.removeItem("sa-token"); } catch (e) {}''','''    TOK = null; ME = null; ADMIN = false; FR = []; MS = {}; FB = {}; OUT = []; try { ["sa-token", "sa-me", "sa-fr", "sa-ms", "sa-out"].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}''')
rep('''    applyState(d.state); hideLogin(); loadFriends(); loadBests();''','''    applyState(d.state); hideLogin(); loadFriends(); loadBests(); flushOut();''')
rep('''    if (tickN % 90 === 0) loadBests();''','''    if (tickN % 90 === 0) loadBests();
    if (OUT.length && tickN % 15 === 0) flushOut();''')
# al volver internet: reconectar, subir lo jugado y mandar lo pendiente
rep('''  api("me").then(signedIn).catch(function () { if (!TOK) showLogin(); });''','''  var meOK = false;
  function checkMe() { api("me").then(function (d) { meOK = true; signedIn(d); }).catch(function (x) { if (!TOK) { if (!x.net) showLogin(); } }); }
  checkMe();
  window.addEventListener("online", function () { NET = true; if (TOK && !meOK) checkMe(); else { pushState(false); flushOut(); loadFriends(); } loadTrends(); });
  if ("serviceWorker" in navigator) window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js").catch(function () {}); });''')
# sin internet y sin cuenta: no molestar con el cartel de entrar
rep('''  $("lgSkip").addEventListener("click", hideLogin);''','''  $("lgSkip").addEventListener("click", hideLogin);
  if (!navigator.onLine && !TOK) setTimeout(hideLogin, 0);''')

# full document
k=s.index("</style>")+len("</style>")
doc='<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="theme-color" content="#000000">\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="apple-touch-icon" href="/icon-192.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black">\n<meta name="apple-mobile-web-app-title" content="Swipe Arcade">\n'+s[:k]+'\n</head>\n<body>\n'+s[k:]+'\n</body>\n</html>\n'
open('netlify-app/public/index.html','w',encoding='utf-8').write(doc)
open('chk2.js','w').write(doc[doc.index('<script>')+8:doc.rindex('</script>')]); print('ok')
