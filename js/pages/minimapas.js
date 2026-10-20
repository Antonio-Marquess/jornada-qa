/* Jornada QA — Minimapas: um mapa mental por área. */
(function(A){
const {J, $, esc, ext, ico, actions, store, toast, copyBtn, el, textW, useIcon, FT, FS, FC, done, stageOf, side, pBody, showPanel} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const openPanel = (...a) => A.openPanel(...a);

/* =====================================================================
   MINIMAPAS: um mapa mental por área
   ===================================================================== */
/* tipos de ramo: nome padrão, cor e ícone */
const RAMOS = {
  fund:  {t:"Fundamentos",   cor:"--e1", icon:"book"},
  est:   {t:"O que estudar", cor:"--e2", icon:"route"},
  ferr:  {t:"Ferramentas",   cor:"--e3", icon:"layers"},
  prat:  {t:"Onde praticar", cor:"--e4", icon:"target"},
  trilha:{t:"Na trilha",     cor:"--e5", icon:"map"}
};
const MINIS = J.MINIMAPAS || [];
/* id estável de cada item (área + título): o progresso salvo não se perde quando itens novos entram */
MINIS.forEach(m => m.ramos.forEach(r => r.itens.forEach(it => { if(it.t && !it.id) it.id = m.id + ":" + J.slug(it.t); })));
const doneMini = new Set(store.get("jqa-minimapas", []));
const ramoInfo = r => ({...(RAMOS[r.k] || {t:r.k, cor:"--muted", icon:"book"}), ...(r.t ? {t:r.t} : {})});
const topicById = id => A.C.topics.find(t => t.id === id);
const miniStudy = m => m.ramos.filter(r => r.k !== "trilha").flatMap(r => r.itens);
const miniCount = m => { const it = miniStudy(m); return {n:it.filter(i => doneMini.has(i.id)).length, tot:it.length}; };
const itemLabel = it => it.topico ? (topicById(it.topico)?.t || "Tópico removido") : it.t;
const itemTag = it => it.topico ? (stageOf(topicById(it.topico)?.s)?.name || "") : (it.tag || "");
let curMini = null, miniMode = store.get("jqa-mini-modo", null);

/* pan e zoom do minimapa (independente do mapa principal) */
const msvg = $("#msvg");
const mpz = {vb:{x:0, y:0, w:1600, h:1000}, bounds:null, moved:false, drag:null};
const mApply = () => msvg.setAttribute("viewBox", `${mpz.vb.x} ${mpz.vb.y} ${mpz.vb.w} ${mpz.vb.h}`);
function mFit(){
  if(!mpz.bounds) return; const r = msvg.getBoundingClientRect(); if(!r.width || !r.height) return;
  const ar = r.width / r.height; let {x, y, w, h} = mpz.bounds;
  if(w / h > ar){ const nh = w / ar; y -= (nh - h) / 2; h = nh; } else { const nw = h * ar; x -= (nw - w) / 2; w = nw; }
  mpz.vb = {x, y, w, h}; mApply();
}
function mZoom(f, cx, cy){
  const r = msvg.getBoundingClientRect(), vb = mpz.vb;
  const px = cx == null ? .5 : (cx - r.left) / r.width, py = cy == null ? .5 : (cy - r.top) / r.height;
  const nw = Math.min(Math.max(vb.w * f, 300), 9000), nh = nw * (vb.h / vb.w);
  vb.x += (vb.w - nw) * px; vb.y += (vb.h - nh) * py; vb.w = nw; vb.h = nh; mApply();
}
msvg.addEventListener("wheel", e => { e.preventDefault(); mZoom(e.deltaY > 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, {passive:false});
msvg.addEventListener("pointerdown", e => { mpz.drag = {x:e.clientX, y:e.clientY, vx:mpz.vb.x, vy:mpz.vb.y}; mpz.moved = false; });
window.addEventListener("pointermove", e => {
  const d = mpz.drag; if(!d) return; const r = msvg.getBoundingClientRect();
  if(Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 4){ mpz.moved = true; msvg.classList.add("dragging"); }
  mpz.vb.x = d.vx - (e.clientX - d.x) * mpz.vb.w / r.width; mpz.vb.y = d.vy - (e.clientY - d.y) * mpz.vb.h / r.height; mApply();
});
window.addEventListener("pointerup", () => { mpz.drag = null; msvg.classList.remove("dragging"); setTimeout(() => mpz.moved = false, 0); });
$("#mzin").onclick = () => mZoom(1 / 1.25); $("#mzout").onclick = () => mZoom(1.25); $("#mzfit").onclick = mFit;
window.addEventListener("resize", () => { if(curMini) mFit(); });
function mButton(g, label, fn){
  g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", label);
  g.addEventListener("click", () => { if(!mpz.moved) fn(); });
  g.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); fn(); } });
}

/* página inicial: um card por área */
function renderMiniHome(){
  $("#miniHome").innerHTML = `
    <p class="lead">Um mapa mental por área, para ir além da trilha: fundamentos, o que estudar em ordem, ferramentas com quando usar cada uma, onde praticar e os tópicos da trilha ligados à área. Marque o que já estudou; o progresso fica salvo neste navegador.</p>
    <div class="minicards">${MINIS.map(m => { const c = miniCount(m), pct = c.tot ? Math.round(c.n / c.tot * 100) : 0;
      return `<a class="minicard" href="#minimapas/${esc(m.id)}">
        <span class="mi">${ico(m.icon || "grid")}</span>
        <b>${esc(m.t)}</b>
        <p>${esc(m.d)}</p>
        <span class="mstats">${m.ramos.map(r => { const ri = ramoInfo(r); return `<span><i style="background:var(${ri.cor})"></i>${r.itens.length} ${esc(ri.t.toLowerCase())}</span>`; }).join("")}</span>
        <span class="mbar"><i style="width:${pct}%"></i></span>
        <small>${c.n} de ${c.tot} itens estudados</small>
      </a>`; }).join("")}
      <div class="minicard soon"><span class="mi">${ico("plus")}</span><b>Próximas áreas</b><p>Performance, Automação, API, IA para QA, Mobile, Dados e DevOps.</p></div>
    </div>`;
}

/* layout bilateral: ramos divididos entre os dois lados, equilibrando o número de itens */
function miniLayout(m){
  const rowH = 36, gap = 26, nodes = [], links = [];
  const counts = m.ramos.map(r => Math.max(1, r.itens.length)), total = counts.reduce((a, b) => a + b, 0);
  let acc = 0, cut = 0;
  for(let i = 0; i < counts.length; i++){ if(acc + counts[i] / 2 > total / 2 && i > 0) break; acc += counts[i]; cut = i + 1; }
  cut = Math.min(Math.max(cut, 1), m.ramos.length - 1);
  const root = {type:"center", x:0, y:0}; nodes.push(root);
  for(const sideN of [-1, 1]){
    const rs = m.ramos.filter((r, i) => (i < cut ? -1 : 1) === sideN);
    const rows = rs.reduce((a, r) => a + Math.max(1, r.itens.length), 0);
    let y = -(rows * rowH + (rs.length - 1) * gap) / 2;
    rs.forEach(r => {
      const ri = ramoInfo(r), h = Math.max(1, r.itens.length) * rowH;
      const bn = {type:"stage", ramo:r, ri, x:sideN * 230, y:y + h / 2 - rowH / 2, label:ri.t};
      nodes.push(bn); links.push({a:root, b:bn, color:ri.cor, w:4});
      r.itens.forEach((it, i) => { const n = {type:"topic", it, ramo:r, ri, y:y + i * rowH, side:sideN}; nodes.push(n); links.push({a:bn, b:n, color:ri.cor, w:2}); });
      y += h + gap;
    });
  }
  return {nodes, links};
}
function renderMiniMap(m){
  msvg.innerHTML = "";
  const {nodes, links} = miniLayout(m);
  nodes.forEach(n => {
    if(n.type === "center"){ n.w = Math.max(200, textW(m.t, '800 24px "Bricolage Grotesque", sans-serif') + 80); n.h = 64; }
    else if(n.type === "stage"){ n.w = textW(n.label, FS) + 62; n.h = 40; }
    else { n.done = !n.it.topico && doneMini.has(n.it.id); n.label = itemLabel(n.it);
      n.w = textW(n.label, FT) + 30 + (n.done ? 20 : 0); n.h = 28; n.x = n.side * 400 + n.side * n.w / 2; }
    n.hw = n.w / 2;
  });
  const gL = el("g", {fill:"none", "stroke-linecap":"round"}, msvg), gN = el("g", {}, msvg);
  let minX = -200, maxX = 200, minY = -100, maxY = 100;
  links.forEach(L => {
    const a = L.a, b = L.b, s = Math.sign(b.x - a.x) || 1, ax = a.x + s * a.hw, bx = b.x - s * b.hw, mx = (ax + bx) / 2;
    el("path", {d:`M${ax},${a.y} C${mx},${a.y} ${mx},${b.y} ${bx},${b.y}`, stroke:`var(${L.color})`, "stroke-width":L.w, opacity:L.w > 2 ? .9 : .55}, gL);
  });
  nodes.forEach(n => {
    const g = el("g", {class:"node n-" + n.type, transform:`translate(${n.x},${n.y})`}, gN);
    if(n.type === "center"){
      el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:18, fill:"var(--brand)"}, g);
      el("rect", {x:-n.hw + 14, y:-15, width:30, height:30, rx:8, fill:"var(--hl)"}, g);
      useIcon(g, m.icon || "grid", -n.hw + 18, -11, 22, "var(--hl-ink)", 2.4);
      el("text", {"text-anchor":"middle", x:18, y:8, fill:"var(--brand-ink)", "font-size":24}, g).textContent = m.t;
      mButton(g, `${m.t}: sobre a área`, () => openMiniIntro(m));
      return;
    }
    if(n.type === "stage"){
      el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:12, fill:`var(${n.ri.cor})`}, g);
      useIcon(g, n.ri.icon, -n.hw + 14, -9, 18, "var(--on-stage)", 2.2);
      el("text", {"text-anchor":"middle", x:13, y:6, fill:"var(--on-stage)", "font-size":16}, g).textContent = n.label;
      g.classList.remove("node");
      minX = Math.min(minX, n.x - n.hw); maxX = Math.max(maxX, n.x + n.hw);
      return;
    }
    const isTrail = !!n.it.topico, tDone = isTrail && done.has(n.it.topico), on = n.done || tDone;
    el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:8, fill:on ? "var(--hl)" : "var(--surface)", stroke:`var(${n.ri.cor})`, "stroke-width":2, ...(isTrail ? {"stroke-dasharray":"5 3"} : {})}, g);
    if(n.done) el("path", {d:`M${-n.hw + 10},0 l4,4 l8,-9`, stroke:"var(--hl-ink)", "stroke-width":2.5, fill:"none", "stroke-linecap":"round", "stroke-linejoin":"round"}, g);
    el("text", {"text-anchor":"middle", x:n.done ? 10 : 0, y:5, "font-size":14, "font-weight":700, fill:on ? "var(--hl-ink)" : "var(--text)"}, g).textContent = n.label;
    let edge = n.side > 0 ? n.x + n.hw : n.x - n.hw;
    const tag = itemTag(n.it);
    if(tag){
      const w = textW(tag, FC) + 16, x0 = n.side > 0 ? n.hw + 12 : -n.hw - 12 - w;
      el("rect", {class:"techbox", x:x0, y:-10, width:w, height:20, rx:10}, g);
      el("text", {class:"tech", "text-anchor":"middle", x:x0 + w / 2, y:4}, g).textContent = tag;
      edge = n.x + (n.side > 0 ? x0 + w : x0);
    }
    minX = Math.min(minX, edge, n.x - n.hw); maxX = Math.max(maxX, edge, n.x + n.hw);
    minY = Math.min(minY, n.y - 20); maxY = Math.max(maxY, n.y + 20);
    mButton(g, `${n.label}, ${n.ri.t}${on ? ", estudado" : ""}. Abrir detalhes`, () => openMiniItem(m, n.ramo, n.it));
  });
  mpz.bounds = {x:minX - 40, y:minY - 70, w:(maxX - minX) + 80, h:(maxY - minY) + 120};
  mApply();
  $("#miniLegend").innerHTML = `<span><i class="hlk"></i>Já estudei</span><span><i class="trk"></i>Tópico da trilha</span>`;
}
function renderMiniList(m){
  $("#miniList").innerHTML = `
    <div class="miniintro"><span class="mi">${ico(m.icon || "grid")}</span><div><h2>${esc(m.t)}</h2><p>${esc(m.d)}</p></div></div>
    <dl class="facts mfacts"><div><dt>Por onde começar</dt><dd>${esc(m.comeco || "")}</dd></div><div><dt>Onde leva</dt><dd>${esc(m.carreira || "")}</dd></div></dl>
    ${m.ramos.map((r, ri) => { const inf = ramoInfo(r);
      return `<h3><i class="rdot" style="background:var(${inf.cor})"></i>${esc(inf.t)}</h3>
      <div class="items">${r.itens.map((it, i) => { const isTrail = !!it.topico, on = isTrail ? done.has(it.topico) : doneMini.has(it.id);
        return `<div class="item${on ? " done" : ""}"><span class="stripe" style="background:var(${inf.cor})"></span>
          <button class="open" data-mr="${ri}" data-mi="${i}"><span class="t"><span>${r.k === "est" ? (i + 1) + ". " : ""}${esc(itemLabel(it))}</span></span>
          <span class="meta">${esc(itemTag(it))}${isTrail ? " · na trilha" : ""}</span>
          ${it.d || it.q ? `<span class="k">${esc((it.q || it.d).slice(0, 120))}${(it.q || it.d).length > 120 ? "…" : ""}</span>` : ""}</button>
          <span class="check" aria-hidden="true"></span></div>`; }).join("")}</div>`; }).join("")}`;
}
$("#miniList").addEventListener("click", e => {
  const b = e.target.closest("[data-mr]"); if(!b || !curMini) return;
  const r = curMini.ramos[+b.dataset.mr]; openMiniItem(curMini, r, r.itens[+b.dataset.mi]);
});
function setMiniMode(mode){
  miniMode = mode; store.set("jqa-mini-modo", mode);
  document.querySelectorAll("#miniView [data-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === mode));
  $("#miniMapBox").hidden = mode !== "mapa"; $("#miniList").hidden = mode !== "lista";
  if(mode === "mapa") requestAnimationFrame(mFit);
}
document.querySelectorAll("#miniView [data-mode]").forEach(b => b.onclick = () => setMiniMode(b.dataset.mode));
function miniProgress(m){ const c = miniCount(m); $("#miniProg").innerHTML = `<b>${esc(m.t)}</b><span>${c.n} de ${c.tot} estudados</span>`; }
function refreshMini(){ if(!curMini) return; miniProgress(curMini); renderMiniMap(curMini); renderMiniList(curMini); }

function openMini(id){
  const m = MINIS.find(x => x.id === id);
  $("#miniHome").hidden = !!m; $("#miniView").hidden = !m; curMini = m || null;
  if(!m){ renderMiniHome(); return "Minimapas"; }
  miniProgress(m); renderMiniMap(m); renderMiniList(m);
  setMiniMode(miniMode || (matchMedia("(max-width:820px)").matches ? "lista" : "mapa"));
  return "Minimapa: " + m.t;
}
function openMiniIntro(m){
  showPanel("Minimapa", null, m.t);
  pBody.innerHTML = `<p style="margin:0">${esc(m.d)}</p>
    <section><h4>Por onde começar</h4><p class="practice">${esc(m.comeco || "")}</p></section>
    <section><h4>Onde essa área leva</h4><p style="margin:0">${esc(m.carreira || "")}</p></section>`;
  $("#pClose").focus();
}
function openMiniItem(m, r, it){
  if(it.topico){ const t = topicById(it.topico); if(t) openPanel(t); else toast("Esse tópico não existe mais na trilha."); return; }
  const inf = ramoInfo(r), on = doneMini.has(it.id);
  showPanel(`${m.t} · ${inf.t}`, inf.cor, it.t);
  pBody.innerHTML = `
    <div class="actions"><button class="btn${on ? "" : " primary"}" id="mDone" aria-pressed="${on}">${on ? "Estudado" : "Marcar como estudado"}</button></div>
    ${it.tag ? `<p style="margin:0"><span class="chip">${esc(it.tag)}</span></p>` : ""}
    ${it.d ? `<p style="margin:0">${esc(it.d)}</p>` : ""}
    ${it.q ? `<section><h4>Quando usar</h4><p style="margin:0">${esc(it.q)}</p></section>` : ""}
    ${it.l?.length ? `<section><h4>Materiais</h4><ul class="links mats">${it.l.map(([lab, url, nota]) => `<li>${ext(lab, url)}${nota ? `<small>${esc(nota)}</small>` : ""}</li>`).join("")}</ul></section>` : ""}
    ${it.x || it.lab ? `<section><h4>Pratique</h4>${it.x ? `<p class="practice">${esc(it.x)}</p>` : ""}
      ${it.lab ? `<p class="labhead">Comandos</p><div class="code lab">${copyBtn(it.lab)}<pre>${esc(it.lab)}</pre></div>` : ""}</section>` : ""}`;
  $("#mDone").onclick = () => { doneMini.has(it.id) ? doneMini.delete(it.id) : doneMini.add(it.id); store.set("jqa-minimapas", [...doneMini]); refreshMini(); openMiniItem(m, r, it); };
  $("#pClose").focus();
}
function leaveMini(){ curMini = null; }

Object.assign(A, {openMini, refreshMini, leaveMini});
})(JQA.app);
