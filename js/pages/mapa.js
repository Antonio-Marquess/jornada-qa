/* Jornada QA — Mapa mental da trilha, com pan, zoom e busca. */
(function(A){
const {$, esc, el, textW, useIcon, FT, FS, FC, done, side} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const renderRoute = (...a) => A.renderRoute(...a),
      openPanel = (...a) => A.openPanel(...a);

/* =====================================================================
   MAPA MENTAL
   ===================================================================== */
const svg = $("#svg");
let showTech = true, query = "", vb = {x:0, y:0, w:1600, h:1000}, bounds = null, moved = false;
const STAGE_ICONS = {e1:"search", e2:"briefcase", e3:"layers", e4:"target", e5:"flag"};
const FALLBACK_ICONS = ["search","briefcase","layers","target","flag"];
const stageIcon = s => STAGE_ICONS[s.id] || FALLBACK_ICONS[A.C.stages.indexOf(s) % FALLBACK_ICONS.length];

const matches = t => { const q = query.trim().toLowerCase(); if(!q) return true;
  return (t.t + " " + t.tech.join(" ") + " " + (t.d || "") + " " + (t.est || []).join(" ") + " " + (A.notes[t.id] || "")).toLowerCase().includes(q); };

function renderLegend(){
  $("#legend").innerHTML = A.C.stages.map(s => `<span><i style="background:var(${s.color})"></i>${esc(s.n)} ${esc(s.name)}</span>`).join("")
    + `<span><i class="iak"></i>Tópico de IA</span><span><i class="nk"></i>Tem anotação</span><span><i class="hlk"></i>Já domino</span>`;
}

/* divide as etapas em dois lados, equilibrando o número de tópicos */
function sides(){
  const counts = A.C.stages.map(s => A.C.topics.filter(t => t.s === s.id).length);
  const total = counts.reduce((a, b) => a + b, 0);
  let acc = 0, cut = 0;
  for(let i = 0; i < counts.length; i++){ if(acc + counts[i] / 2 > total / 2 && i > 0) break; acc += counts[i]; cut = i + 1; }
  if(A.C.stages.length > 1) cut = Math.min(Math.max(cut, 1), A.C.stages.length - 1);
  return A.C.stages.map((s, i) => i < cut ? -1 : 1);
}

function layout(){
  const rowH = 38, gapG = 22, nodes = [], links = [], sd = sides();
  const root = {type:"center", x:0, y:0, label:"Jornada QA"}; nodes.push(root);
  for(const sideN of [-1, 1]){
    const groups = A.C.stages.filter((s, i) => sd[i] === sideN);
    const rows = groups.reduce((a, g) => a + Math.max(1, A.C.topics.filter(t => t.s === g.id).length), 0);
    let y = -(rows * rowH + (groups.length - 1) * gapG * 2) / 2;
    groups.forEach(g => {
      const kids = A.C.topics.filter(t => t.s === g.id), h = Math.max(1, kids.length) * rowH;
      const gn = {type:"stage", stage:g, x:sideN * 250, y:y + h / 2 - rowH / 2, label:"Etapa " + g.n + " · " + g.name};
      nodes.push(gn); links.push({a:root, b:gn, color:g.color, w:4});
      kids.forEach((t, i) => { const tn = {type:"topic", topic:t, stage:g, y:y + i * rowH, side:sideN}; nodes.push(tn); links.push({a:gn, b:tn, color:g.color, w:2}); });
      y += h + gapG * 2;
    });
  }
  return {nodes, links};
}

function renderMap(){
  svg.innerHTML = "";
  const {nodes, links} = layout();
  nodes.forEach(n => {
    if(n.type === "center"){ n.w = 220; n.h = 64; }
    else if(n.type === "stage"){ n.w = textW(n.label, FS) + 36 + 26; n.h = 40; }
    else { n.w = textW(n.topic.t, FT) + 30 + (done.has(n.topic.id) ? 20 : 0) + (n.topic.ia ? 20 : 0); n.h = 28; n.x = n.side * 440 + n.side * n.w / 2; }
    n.hw = n.w / 2;
  });
  const gL = el("g", {fill:"none", "stroke-linecap":"round"}, svg), gN = el("g", {}, svg);
  let minX = -200, maxX = 200, minY = -100, maxY = 100;
  links.forEach(L => {
    const a = L.a, b = L.b, s = Math.sign(b.x - a.x) || 1, ax = a.x + s * a.hw, bx = b.x - s * b.hw, mx = (ax + bx) / 2;
    const p = el("path", {d:`M${ax},${a.y} C${mx},${a.y} ${mx},${b.y} ${bx},${b.y}`, stroke:`var(${L.color})`, "stroke-width":L.w, opacity:L.w > 2 ? .9 : .55}, gL);
    if(b.type === "topic" && !matches(b.topic)) p.classList.add("dim");
  });
  nodes.forEach(n => {
    const g = el("g", {class:"node n-" + n.type, transform:`translate(${n.x},${n.y})`}, gN);
    if(n.type === "center"){
      g.classList.remove("node");
      el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:18, fill:"var(--brand)"}, g);
      el("rect", {x:-n.hw + 14, y:-15, width:30, height:30, rx:8, fill:"var(--hl)"}, g);
      useIcon(g, "check", -n.hw + 18, -11, 22, "var(--hl-ink)", 3);
      el("text", {"text-anchor":"middle", x:18, y:8, fill:"var(--brand-ink)", "font-size":24}, g).textContent = n.label;
      return;
    }
    if(n.type === "stage"){
      const st = n.stage;
      el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:12, fill:`var(${st.color})`}, g);
      useIcon(g, stageIcon(st), -n.hw + 14, -9, 18, "var(--on-stage)", 2.2);
      el("text", {"text-anchor":"middle", x:13, y:6, fill:"var(--on-stage)", "font-size":16}, g).textContent = n.label;
      minX = Math.min(minX, n.x - n.hw); maxX = Math.max(maxX, n.x + n.hw);
      makeButton(g, n.label + ": ver na rota de estudo", () => {
        location.hash = "rota"; setTimeout(() => document.getElementById("st-" + st.id)?.scrollIntoView({behavior:"smooth", block:"start"}), 60);
      });
      return;
    }
    const t = n.topic, isDone = done.has(t.id);
    el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:8, fill:isDone ? "var(--hl)" : "var(--surface)", stroke:`var(${n.stage.color})`, "stroke-width":2}, g);
    if(t.ia) el("rect", {x:-n.hw - 4, y:-n.h / 2 - 4, width:n.w + 8, height:n.h + 8, rx:11, fill:"none", stroke:"var(--ia)", "stroke-width":1.6, "stroke-dasharray":"4 3"}, g);
    if(A.notes[t.id]) el("circle", {cx:n.side > 0 ? -n.hw : n.hw, cy:-n.h / 2, r:5, fill:"var(--note)", stroke:"var(--surface)", "stroke-width":2}, g);
    if(isDone) el("path", {d:`M${-n.hw + 10},0 l4,4 l8,-9`, stroke:"var(--hl-ink)", "stroke-width":2.5, fill:"none", "stroke-linecap":"round", "stroke-linejoin":"round"}, g);
    if(t.ia) useIcon(g, "spark", n.hw - 24, -8, 16, "var(--ia)", 2);
    el("text", {"text-anchor":"middle", x:(isDone ? 10 : 0) - (t.ia ? 10 : 0), y:5, "font-size":14, "font-weight":700, fill:isDone ? "var(--hl-ink)" : "var(--text)"}, g).textContent = t.t;
    let edge = n.side > 0 ? n.x + n.hw : n.x - n.hw;
    if(showTech){
      let cx = n.side > 0 ? n.hw + 12 : -n.hw - 12;
      t.tech.slice(0, 5).forEach(k => {
        const w = textW(k, FC) + 16, x0 = n.side > 0 ? cx : cx - w;
        el("rect", {class:"techbox", x:x0, y:-10, width:w, height:20, rx:10}, g);
        el("text", {class:"tech", "text-anchor":"middle", x:x0 + w / 2, y:4}, g).textContent = k;
        cx += n.side > 0 ? w + 6 : -(w + 6);
      });
      edge = n.x + cx;
    }
    minX = Math.min(minX, edge, n.x - n.hw); maxX = Math.max(maxX, edge, n.x + n.hw);
    minY = Math.min(minY, n.y - 20); maxY = Math.max(maxY, n.y + 20);
    if(query.trim()) g.classList.add(matches(t) ? "match" : "dim");
    makeButton(g, `${t.t}, ${n.stage.name}${t.ia ? ", tópico de IA" : ""}${A.notes[t.id] ? ", com anotação" : ""}${isDone ? ", dominado" : ""}. Abrir detalhes`, () => openPanel(t));
  });
  bounds = {x:minX - 40, y:minY - 80, w:(maxX - minX) + 80, h:(maxY - minY) + 140};
  applyVB();
}
function makeButton(g, label, fn){
  g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", label);
  g.addEventListener("click", () => { if(!moved) fn(); });
  g.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); fn(); } });
}
function applyVB(){ svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); }
function fit(){
  if(!bounds) return; const r = svg.getBoundingClientRect(); if(!r.width || !r.height) return;
  const ar = r.width / r.height; let {x, y, w, h} = bounds;
  if(w / h > ar){ const nh = w / ar; y -= (nh - h) / 2; h = nh; } else { const nw = h * ar; x -= (nw - w) / 2; w = nw; }
  vb = {x, y, w, h}; applyVB();
}
function zoom(f, cx, cy){
  const r = svg.getBoundingClientRect();
  const px = cx == null ? .5 : (cx - r.left) / r.width, py = cy == null ? .5 : (cy - r.top) / r.height;
  const nw = Math.min(Math.max(vb.w * f, 300), 9000), nh = nw * (vb.h / vb.w);
  vb.x += (vb.w - nw) * px; vb.y += (vb.h - nh) * py; vb.w = nw; vb.h = nh; applyVB();
}
svg.addEventListener("wheel", e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, {passive:false});
let drag = null;
svg.addEventListener("pointerdown", e => { drag = {x:e.clientX, y:e.clientY, vx:vb.x, vy:vb.y}; moved = false; });
window.addEventListener("pointermove", e => {
  if(!drag) return; const r = svg.getBoundingClientRect();
  if(Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4){ moved = true; svg.classList.add("dragging"); }
  vb.x = drag.vx - (e.clientX - drag.x) * vb.w / r.width; vb.y = drag.vy - (e.clientY - drag.y) * vb.h / r.height; applyVB();
});
window.addEventListener("pointerup", () => { drag = null; svg.classList.remove("dragging"); setTimeout(() => moved = false, 0); });
$("#zin").onclick = () => zoom(1 / 1.25);
$("#zout").onclick = () => zoom(1.25);
$("#zfit").onclick = fit;
window.addEventListener("resize", fit);

const qi = $("#q");
function setQuery(v){ query = v; qi.value = v; renderMap(); renderRoute(); }
qi.addEventListener("input", () => { query = qi.value; renderMap(); renderRoute(); });
$("#showTech").addEventListener("change", e => { showTech = e.target.checked; renderMap(); fit(); });

Object.assign(A, {fit, matches, renderLegend, renderMap, setQuery});
})(JQA.app);
