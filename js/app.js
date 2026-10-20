/* Jornada QA — Além do Teste
 * Aplicação: navegação, mapa mental, rota, gaveta de detalhes e edição, anotações,
 * IA no dia a dia, prompts, biblioteca, projetos e "Seus dados" (backup e publicação).
 *
 * De onde vem o conteúdo (nesta ordem):
 *   1. edições salvas neste navegador
 *   2. data/personalizado.js, quando publicado no repositório
 *   3. conteúdo padrão em data/*.js
 */
(function(){
const J = window.JQA;
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl = u => /^https?:\/\//i.test(String(u || "").trim()) ? String(u).trim() : "";
const ext = (label, url) => { const u = safeUrl(url); return u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label || u)}</a>` : esc(label); };
const clone = o => JSON.parse(JSON.stringify(o));
const uid = p => p + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const ico = n => `<svg><use href="#i-${n}"/></svg>`;
const actions = (editAttr, delAttr, label) => `<span class="hoveractions">
  <button class="act" ${editAttr} aria-label="Editar ${esc(label)}" title="Editar">${ico("pen")}</button>
  <button class="act del" ${delAttr} aria-label="Excluir ${esc(label)}" title="Excluir">${ico("trash")}</button></span>`;

/* ---------- armazenamento local ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};

/* ---------- conteúdo editável ---------- */
const COLORS = ["--e1","--e2","--e3","--e4","--e5"];
function defaults(){
  return {v:2, stages:clone(J.STAGES), topics:clone(J.TOPICS),
    prompts:clone(J.PROMPTS).map(p => ({id:uid("p"), ...p})),
    lib:clone(J.LIB).map(i => ({id:uid("l"), ...i}))};
}
function normalize(c){
  c.stages.forEach((s, i) => { s.color = s.color || COLORS[i % COLORS.length]; });
  c.topics.forEach(t => { t.id = t.id || uid("t"); t.tech = t.tech || []; t.l = t.l || []; t.est = t.est || []; t.cc = t.cc || []; t.lab = t.lab || ""; });
  c.prompts.forEach(p => { p.id = p.id || uid("p"); });
  c.lib.forEach(i => { i.id = i.id || uid("l"); });
  return c;
}
/* Conteúdo salvo numa versão anterior: completa os tópicos com os campos novos
 * (o que estudar, materiais, laboratório, critérios) e acrescenta os tópicos novos,
 * sem desfazer o que a pessoa editou. */
function upgrade(c){
  if(!c || c.v >= 2) return c;
  const base = new Map(J.TOPICS.map(t => [t.id, t])), have = new Set(c.topics.map(t => t.id));
  c.topics.forEach(t => {
    const o = base.get(t.id); if(!o) return;
    if(!t.est?.length) t.est = clone(o.est || []);
    if(!t.cc?.length) t.cc = clone(o.cc || []);
    if(!t.lab && o.lab) t.lab = o.lab;
    t.l = (t.l || []).map(([a, u, n]) => [a, u, n || (o.l.find(x => x[1] === u) || [])[2] || ""]);
  });
  let head = 0;
  J.TOPICS.forEach((o, i) => { if(have.has(o.id)) return;
    const prev = J.TOPICS.slice(0, i).reverse().find(p => have.has(p.id));
    const at = prev ? c.topics.findIndex(t => t.id === prev.id) + 1 : head++;
    c.topics.splice(at, 0, clone(o)); have.add(o.id); });
  c.v = 2; store.set("jqa-conteudo", c);
  return c;
}
let C = normalize(upgrade(store.get("jqa-conteudo", null)) || (J.OVERRIDE ? clone(J.OVERRIDE) : defaults()));
const isLocal = () => !!store.get("jqa-conteudo", null);
function saveContent(){ if(!store.set("jqa-conteudo", C)) toast("Não foi possível salvar neste navegador."); }

const done = new Set(store.get("jqa-trilha", []));
const doneProj = new Set(store.get("jqa-projetos", []));
const doneEx = new Set(store.get("jqa-exercicios-ia", []));
let notes = store.get("jqa-notas", {});
let checks = store.get("jqa-checklists", {});   /* {idDoTópico: ["e0","c2",…]} itens de estudo e critérios marcados */

const stageOf = id => C.stages.find(s => s.id === id);
const stageLabel = s => s ? `Etapa ${s.n}: ${s.name}` : "Sem etapa";
const DEPTHS = ["Conhecer","Praticar com apoio","Autonomia","Aprofundar"];
const PRIOS = ["Essencial","Diferencial forte","Diferencial","Escolha uma"];

function toast(msg){ const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2600); }

function updateMeter(){
  const n = C.topics.filter(t => done.has(t.id)).length, tot = C.topics.length || 1, pct = Math.round(n / tot * 100);
  $("#pct").textContent = pct + "%";
  $("#barFill").style.width = pct + "%";
  $("#count").textContent = `${n} de ${C.topics.length} tópicos dominados`;
}

/* ---------- tema e menu lateral ---------- */
const savedTheme = store.get("jqa-tema", null);
if(savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
$("#theme").onclick = () => {
  const r = document.documentElement, cur = r.getAttribute("data-theme");
  const dark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  r.setAttribute("data-theme", dark ? "light" : "dark");
  store.set("jqa-tema", dark ? "light" : "dark");
};
const side = $("#side"), sideScrim = $("#sideScrim");
const openSide = () => { side.classList.add("open"); sideScrim.classList.add("show"); };
const closeSide = () => { side.classList.remove("open"); sideScrim.classList.remove("show"); };
$("#sideOpen").onclick = openSide; $("#sideClose").onclick = closeSide; sideScrim.onclick = closeSide;
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", closeSide));

/* =====================================================================
   MAPA MENTAL
   ===================================================================== */
const NS = "http://www.w3.org/2000/svg";
const svg = $("#svg");
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for(const k in attrs) e.setAttribute(k, attrs[k]); if(parent) parent.appendChild(e); return e; };
const meas = document.createElement("canvas").getContext("2d");
const textW = (s, font) => { meas.font = font; return meas.measureText(s).width; };
let showTech = true, query = "", vb = {x:0, y:0, w:1600, h:1000}, bounds = null, moved = false;
const STAGE_ICONS = {e1:"search", e2:"briefcase", e3:"layers", e4:"target", e5:"flag"};
const FALLBACK_ICONS = ["search","briefcase","layers","target","flag"];
const stageIcon = s => STAGE_ICONS[s.id] || FALLBACK_ICONS[C.stages.indexOf(s) % FALLBACK_ICONS.length];
const useIcon = (g, name, x, y, size, color, sw) => el("use", {href:"#i-" + name, x, y, width:size, height:size, fill:"none", stroke:color, "stroke-width":sw || 2, "stroke-linecap":"round", "stroke-linejoin":"round"}, g);
const FT = '700 14px "Atkinson Hyperlegible", sans-serif', FS = '700 16px "Bricolage Grotesque", sans-serif', FC = '400 12px "Atkinson Hyperlegible", sans-serif';

const matches = t => { const q = query.trim().toLowerCase(); if(!q) return true;
  return (t.t + " " + t.tech.join(" ") + " " + (t.d || "") + " " + (t.est || []).join(" ") + " " + (notes[t.id] || "")).toLowerCase().includes(q); };

function renderLegend(){
  $("#legend").innerHTML = C.stages.map(s => `<span><i style="background:var(${s.color})"></i>${esc(s.n)} ${esc(s.name)}</span>`).join("")
    + `<span><i class="iak"></i>Tópico de IA</span><span><i class="nk"></i>Tem anotação</span><span><i class="hlk"></i>Já domino</span>`;
}

/* divide as etapas em dois lados, equilibrando o número de tópicos */
function sides(){
  const counts = C.stages.map(s => C.topics.filter(t => t.s === s.id).length);
  const total = counts.reduce((a, b) => a + b, 0);
  let acc = 0, cut = 0;
  for(let i = 0; i < counts.length; i++){ if(acc + counts[i] / 2 > total / 2 && i > 0) break; acc += counts[i]; cut = i + 1; }
  if(C.stages.length > 1) cut = Math.min(Math.max(cut, 1), C.stages.length - 1);
  return C.stages.map((s, i) => i < cut ? -1 : 1);
}

function layout(){
  const rowH = 38, gapG = 22, nodes = [], links = [], sd = sides();
  const root = {type:"center", x:0, y:0, label:"Jornada QA"}; nodes.push(root);
  for(const sideN of [-1, 1]){
    const groups = C.stages.filter((s, i) => sd[i] === sideN);
    const rows = groups.reduce((a, g) => a + Math.max(1, C.topics.filter(t => t.s === g.id).length), 0);
    let y = -(rows * rowH + (groups.length - 1) * gapG * 2) / 2;
    groups.forEach(g => {
      const kids = C.topics.filter(t => t.s === g.id), h = Math.max(1, kids.length) * rowH;
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
    if(notes[t.id]) el("circle", {cx:n.side > 0 ? -n.hw : n.hw, cy:-n.h / 2, r:5, fill:"var(--note)", stroke:"var(--surface)", "stroke-width":2}, g);
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
    makeButton(g, `${t.t}, ${n.stage.name}${t.ia ? ", tópico de IA" : ""}${notes[t.id] ? ", com anotação" : ""}${isDone ? ", dominado" : ""}. Abrir detalhes`, () => openPanel(t));
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

/* =====================================================================
   ROTA DE ESTUDO
   ===================================================================== */
function renderRoute(){
  const root = $("#route");
  root.innerHTML = C.stages.map((s, idx) => {
    const kids = C.topics.filter(t => t.s === s.id), d = kids.filter(t => done.has(t.id)).length;
    const cards = kids.filter(matches).map(t => {
      const note = notes[t.id], on = done.has(t.id);
      return `<div class="item hoverable${on ? " done" : ""}">
        <span class="stripe" style="background:var(${s.color})"></span>
        <button class="open" data-open="${esc(t.id)}" aria-label="${esc(t.t)}${on ? ", dominado" : ""}. Abrir detalhes">
          <span class="t"><span>${esc(t.t)}</span></span>
          ${t.ia || note ? `<span class="chips-inline">${t.ia ? '<span class="pill-ia">IA</span>' : ''}${note ? '<span class="pill-note">anotação</span>' : ''}</span>` : ""}
          <span class="meta">${esc(t.pr)} · ${esc(t.p)}</span>
          ${t.tech.length ? `<span class="k">${esc(t.tech.join(", "))}</span>` : ""}
          ${note ? `<span class="notepreview">${esc(note.slice(0, 110))}${note.length > 110 ? "…" : ""}</span>` : ""}
        </button>
        <span class="check" aria-hidden="true"></span>
        ${actions(`data-edit="${esc(t.id)}"`, `data-del="${esc(t.id)}"`, t.t)}
      </div>`;
    }).join("");
    return `<section class="stage" id="st-${esc(s.id)}">
      <div class="rail"><div class="dot" style="background:var(${s.color})">${esc(s.n)}</div>${idx < C.stages.length - 1 ? '<div class="stem"></div>' : ''}</div>
      <div>
        <div class="stagehead hoverable"><h3>${esc(stageLabel(s))}</h3>
          <span class="hoveractions"><button class="act" data-editstage="${esc(s.id)}" aria-label="Editar ${esc(stageLabel(s))}" title="Editar etapa">${ico("pen")}</button></span></div>
        <p class="goal">${esc(s.goal)} <strong>${d} de ${kids.length}</strong> dominados.</p>
        <div class="items">${cards}<button class="additem" data-add="${esc(s.id)}">${ico("plus")}Adicionar tópico</button></div>
      </div></section>`;
  }).join("");
}
$("#route").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  const find = id => C.topics.find(t => t.id === id);
  if(b.dataset.open) openPanel(find(b.dataset.open));
  else if(b.dataset.edit) openEditor(find(b.dataset.edit));
  else if(b.dataset.del) deleteTopic(find(b.dataset.del));
  else if(b.dataset.add) openEditor(null, b.dataset.add);
  else if(b.dataset.editstage) openStageEditor(stageOf(b.dataset.editstage));
});

/* =====================================================================
   GAVETA: detalhes, anotações e edição
   ===================================================================== */
const panel = $("#panel"), scrim = $("#scrim"), pBody = $("#pBody");
let lastFocus = null;
function showPanel(tagText, tagColor, title){
  const tag = $("#pTag"); tag.textContent = tagText; tag.style.background = tagColor ? `var(${tagColor})` : "var(--muted)";
  tag.style.color = tagColor ? "var(--on-stage)" : "var(--surface)";
  $("#pTitle").textContent = title;
  if(!panel.classList.contains("open")) lastFocus = document.activeElement;
  panel.classList.add("open"); panel.setAttribute("aria-hidden", "false"); scrim.classList.add("show");
}
function closePanel(){ panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true"); scrim.classList.remove("show"); lastFocus?.focus?.(); }
$("#pClose").onclick = closePanel; scrim.onclick = closePanel;
document.addEventListener("keydown", e => { if(e.key === "Escape" && panel.classList.contains("open")) closePanel(); });

function linksIn(text){ return [...new Set((text || "").match(/https?:\/\/[^\s<>"')]+/g) || [])]; }

function openPanel(t){
  if(!t) return;
  const s = stageOf(t.s), on = done.has(t.id);
  showPanel(stageLabel(s) + (t.ia ? " · IA" : ""), s?.color, t.t);
  pBody.innerHTML = `
    <div class="actions">
      <button class="btn${on ? "" : " primary"}" id="pDone" aria-pressed="${on}">${on ? "Dominado" : "Marcar como dominado"}</button>
      <button class="btn" id="pEdit">${ico("pen")}Editar</button>
    </div>
    ${t.d ? `<p style="margin:0">${esc(t.d)}</p>` : ""}
    <dl class="facts"><div><dt>Profundidade</dt><dd>${esc(t.p)}</dd></div><div><dt>Prioridade</dt><dd>${esc(t.pr)}</dd></div></dl>
    ${t.tech.length ? `<section><h4>Tecnologias e conceitos</h4><div class="chips" id="pTech">${t.tech.map(k => `<button data-k="${esc(k)}" title="Ver onde mais aparece na trilha">${esc(k)}</button>`).join("")}</div></section>` : ""}
    ${t.est.length ? `<section><h4>O que estudar <span class="count">${tickCount(t, "e", t.est)}</span></h4>${tickList(t, "e", t.est)}</section>` : ""}
    ${t.l.length ? `<section><h4>Materiais</h4><ul class="links mats">${t.l.map(([lab, url, nota]) => `<li>${ext(lab, url)}${nota ? `<small>${esc(nota)}</small>` : ""}</li>`).join("")}</ul></section>` : ""}
    ${t.x || t.lab ? `<section><h4>Pratique</h4>${t.x ? `<p class="practice">${esc(t.x)}</p>` : ""}
      ${t.lab ? `<p class="labhead">Laboratório</p><div class="code lab">${copyBtn(t.lab)}<pre>${esc(t.lab)}</pre></div>` : ""}</section>` : ""}
    ${t.cc.length ? `<section><h4>Pronto quando <span class="count">${tickCount(t, "c", t.cc)}</span></h4>${tickList(t, "c", t.cc)}</section>` : ""}
    <section>
      <h4><label for="pNote">Minhas anotações</label></h4>
      <textarea id="pNote" class="note" rows="6" placeholder="O que aprendeu, dúvidas, links, prompts que funcionaram…">${esc(notes[t.id] || "")}</textarea>
      <p class="saved" id="pSaved" aria-live="polite"></p>
      <ul class="links" id="pNoteLinks"></ul>
    </section>`;
  const renderNoteLinks = () => { $("#pNoteLinks").innerHTML = linksIn(notes[t.id]).map(u => `<li>${ext(u, u)}</li>`).join(""); };
  renderNoteLinks();
  let h;
  $("#pNote").addEventListener("input", e => {
    clearTimeout(h); $("#pSaved").textContent = "Salvando…";
    h = setTimeout(() => {
      const v = e.target.value; if(v.trim()) notes[t.id] = v; else delete notes[t.id];
      store.set("jqa-notas", notes); $("#pSaved").textContent = "Salvo neste navegador.";
      renderNoteLinks(); renderMap(); renderRoute();
    }, 500);
  });
  pBody.querySelectorAll("#pTech [data-k]").forEach(b => b.onclick = () => { closePanel(); setQuery(b.dataset.k); if(!["mapa","rota"].includes(curTab)) location.hash = "mapa"; });
  $("#pDone").onclick = () => { done.has(t.id) ? done.delete(t.id) : done.add(t.id); store.set("jqa-trilha", [...done]); updateMeter(); renderMap(); renderRoute(); openPanel(t); };
  $("#pEdit").onclick = () => openEditor(t);
  pBody.querySelectorAll(".ticks input").forEach(cb => cb.onchange = () => {
    const set = new Set(checks[t.id] || []); cb.checked ? set.add(cb.dataset.tk) : set.delete(cb.dataset.tk);
    if(set.size) checks[t.id] = [...set]; else delete checks[t.id];
    store.set("jqa-checklists", checks);
    const sec = cb.closest("section"), kind = cb.dataset.tk[0];
    sec.querySelector(".count").textContent = tickCount(t, kind, kind === "e" ? t.est : t.cc);
  });
  $("#pClose").focus();
}
function tickList(t, kind, items){
  const on = new Set(checks[t.id] || []);
  return `<ul class="ticks">${items.map((it, i) => `<li><label><input type="checkbox" data-tk="${kind}${i}"${on.has(kind + i) ? " checked" : ""}><span>${esc(it)}</span></label></li>`).join("")}</ul>`;
}
function tickCount(t, kind, items){
  const on = (checks[t.id] || []).filter(k => k[0] === kind && +k.slice(1) < items.length).length;
  return `${on}/${items.length}`;
}

/* campos reutilizáveis */
const opt = (list, val) => list.map(v => `<option${v === val ? " selected" : ""}>${esc(v)}</option>`).join("");
function linkRows(list){
  return list.map(([lab, url, nota]) => `<div class="linkrow"><input class="in" placeholder="Texto do link" value="${esc(lab)}" aria-label="Texto do link"><input class="in" placeholder="https://…" value="${esc(url)}" aria-label="Endereço do link"><input class="in nota" placeholder="O que ler ou fazer nele (opcional)" value="${esc(nota || "")}" aria-label="O que ler ou fazer nele"><button type="button" class="act del rm" aria-label="Remover link" title="Remover">${ico("x")}</button></div>`).join("");
}
function wireLinkRows(root){
  root.querySelector("[data-addlink]").onclick = () => root.querySelector(".linkrows").insertAdjacentHTML("beforeend", linkRows([["", ""]]));
  root.querySelector(".linkrows").addEventListener("click", e => { const b = e.target.closest(".rm"); if(b) b.closest(".linkrow").remove(); });
}
function readLinkRows(root){
  const out = [], bad = [];
  root.querySelectorAll(".linkrow").forEach(r => { const [a, b, c] = r.querySelectorAll("input"); const lab = a.value.trim(), url = b.value.trim(), nota = c ? c.value.trim() : "";
    if(!lab && !url) return; if(!safeUrl(url)){ bad.push(b); return; } out.push(nota ? [lab || url, url, nota] : [lab || url, url]); });
  return {out, bad};
}

function openEditor(t, stageId){
  const isNew = !t;
  const d = t ? clone(t) : {s:stageId || C.stages[0]?.id, t:"", p:DEPTHS[0], pr:PRIOS[0], ia:false, d:"", est:[], tech:[], l:[], x:"", lab:"", cc:[]};
  const lines = v => v.split("\n").map(x => x.trim()).filter(Boolean);
  const s = stageOf(d.s);
  showPanel(isNew ? "Novo tópico" : "Editando", s?.color, isNew ? "Novo tópico" : d.t);
  pBody.innerHTML = `<form class="form" id="tForm" novalidate>
    <label>Título<input class="in" name="t" required value="${esc(d.t)}" placeholder="Ex.: Testes de contrato"></label>
    <p class="err" id="eTitle" hidden>Dê um título ao tópico.</p>
    <label>Etapa<select class="in" name="s">${C.stages.map(st => `<option value="${esc(st.id)}"${st.id === d.s ? " selected" : ""}>${esc(stageLabel(st))}</option>`).join("")}</select></label>
    <div class="two"><label>Profundidade<select class="in" name="p">${opt(DEPTHS, d.p)}</select></label>
    <label>Prioridade<select class="in" name="pr">${opt(PRIOS, d.pr)}</select></label></div>
    <label class="checkline"><input type="checkbox" name="ia"${d.ia ? " checked" : ""}> Tópico de IA</label>
    <label>Descrição<textarea class="in" name="d" rows="3">${esc(d.d)}</textarea></label>
    <label>O que estudar <span class="muted">um item por linha</span><textarea class="in" name="est" rows="5" placeholder="Ex.: Consumidor e fornecedor&#10;Pact: como o contrato é gerado">${esc((d.est || []).join("\n"))}</textarea></label>
    <label>Tecnologias e conceitos <span class="muted">separe por vírgula</span><input class="in" name="tech" value="${esc(d.tech.join(", "))}" placeholder="Ex.: Pact, OpenAPI"></label>
    <fieldset><legend>Materiais</legend><div class="linkrows">${linkRows(d.l)}</div>
      <p class="err" id="eLinks" hidden>Os endereços precisam começar com http:// ou https://.</p>
      <button type="button" class="btn sm" data-addlink>${ico("plus")}Adicionar material</button></fieldset>
    <label>Exercício prático<textarea class="in" name="x" rows="3">${esc(d.x)}</textarea></label>
    <label>Laboratório <span class="muted">comandos, dados ou texto de apoio; aparece com botão Copiar</span><textarea class="in mono" name="lab" rows="5">${esc(d.lab || "")}</textarea></label>
    <label>Pronto quando <span class="muted">critérios de conclusão, um por linha</span><textarea class="in" name="cc" rows="3">${esc((d.cc || []).join("\n"))}</textarea></label>
    <div class="formfoot">
      ${isNew ? "<span></span>" : `<button type="button" class="btn ghost danger" id="tDel">${ico("trash")}Excluir</button>`}
      <span class="right"><button type="button" class="btn" id="tCancel">Cancelar</button><button class="btn primary" type="submit">${isNew ? "Criar tópico" : "Salvar"}</button></span>
    </div>
  </form>`;
  const f = $("#tForm"); wireLinkRows(f); f.t.focus();
  $("#tCancel").onclick = () => isNew ? closePanel() : openPanel(t);
  f.onsubmit = e => {
    e.preventDefault();
    const title = f.t.value.trim(); $("#eTitle").hidden = !!title; if(!title){ f.t.focus(); return; }
    const {out, bad} = readLinkRows(f); $("#eLinks").hidden = !bad.length; if(bad.length){ bad[0].focus(); return; }
    const data = {s:f.s.value, t:title, p:f.p.value, pr:f.pr.value, ia:f.ia.checked, d:f.d.value.trim(),
      est:lines(f.est.value), tech:f.tech.value.split(",").map(x => x.trim()).filter(Boolean), l:out, x:f.x.value.trim(),
      lab:f.lab.value.replace(/\s+$/, ""), cc:lines(f.cc.value)};
    let target;
    if(isNew){ target = {id:uid("t"), ...data}; C.topics.push(target); }
    else { target = C.topics.find(o => o.id === t.id); Object.assign(target, data); }
    saveContent(); refreshTrail(); toast(isNew ? "Tópico criado." : "Alterações salvas."); openPanel(target);
  };
  if(!isNew) $("#tDel").onclick = () => deleteTopic(t);
}
function deleteTopic(t){
  if(!t || !confirm(`Excluir o tópico "${t.t}"? As anotações dele também serão apagadas.`)) return;
  C.topics = C.topics.filter(o => o.id !== t.id); delete notes[t.id]; delete checks[t.id]; done.delete(t.id);
  store.set("jqa-checklists", checks); store.set("jqa-notas", notes); store.set("jqa-trilha", [...done]);
  saveContent(); refreshTrail(); closePanel(); toast("Tópico excluído.");
}

function openStageEditor(s){
  showPanel("Editando etapa", s.color, s.name);
  pBody.innerHTML = `<form class="form" id="sForm" novalidate>
    <div class="two"><label>Número<input class="in" name="n" value="${esc(s.n)}" maxlength="3"></label>
    <label>Nome<input class="in" name="name" required value="${esc(s.name)}"></label></div>
    <label>Objetivo da etapa<textarea class="in" name="goal" rows="4">${esc(s.goal)}</textarea></label>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" id="sCancel">Cancelar</button><button class="btn primary" type="submit">Salvar etapa</button></span></div></form>`;
  const f = $("#sForm"); f.name.focus();
  $("#sCancel").onclick = closePanel;
  f.onsubmit = e => { e.preventDefault(); if(!f.name.value.trim()) return f.name.focus();
    Object.assign(s, {n:f.n.value.trim() || s.n, name:f.name.value.trim(), goal:f.goal.value.trim()});
    saveContent(); refreshTrail(); closePanel(); toast("Etapa salva."); };
}

function refreshTrail(){ updateMeter(); renderLegend(); renderMap(); renderRoute(); if(rendered.lib) renderLib(true); }
$("#newTopic").onclick = () => openEditor(null);

/* =====================================================================
   SEUS DADOS: backup, importação, publicação e restauração
   ===================================================================== */
function download(name, text, type){
  const blob = new Blob([text], {type}), a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function openData(){
  closeSide();
  showPanel("Backup e publicação", null, "Seus dados");
  const nNotes = Object.keys(notes).length;
  pBody.innerHTML = `
    <div class="status"><i></i><span>${isLocal() ? "Você está usando uma versão editada salva neste navegador." : "Você está usando o conteúdo original."} ${nNotes} ${nNotes === 1 ? "anotação" : "anotações"}, ${done.size} ${done.size === 1 ? "tópico dominado" : "tópicos dominados"}.</span></div>
    <p class="muted" style="margin:0">Edições, anotações e progresso ficam salvos só neste navegador. Exporte um backup de vez em quando para não perder nada.</p>
    <div class="datalist">
      <div class="dataitem"><b>Exportar backup</b><p>Baixa um arquivo .json com conteúdo, anotações e progresso.</p><button class="btn" id="exportBtn">Exportar</button></div>
      <div class="dataitem"><b>Importar backup</b><p>Carrega um backup em outro navegador ou computador.</p><button class="btn" id="importBtn">Importar</button></div>
      <div class="dataitem"><b>Publicar no GitHub</b><p>Gera o personalizado.js. Substitua o arquivo data/personalizado.js do repositório para todos verem suas edições.</p><button class="btn primary" id="publishBtn">Gerar arquivo</button></div>
      <div class="dataitem"><b>Restaurar original</b><p>Descarta as edições de conteúdo deste navegador. Anotações e progresso continuam.</p><button class="btn danger" id="resetBtn">Restaurar</button></div>
    </div>`;
  $("#exportBtn").onclick = () => {
    const data = {app:"jornada-qa", v:1, exportado:new Date().toISOString(), conteudo:C, notas:notes,
      progresso:{trilha:[...done], projetos:[...doneProj], exercicios:[...doneEx], checklists:checks}};
    download("jornada-qa-backup.json", JSON.stringify(data, null, 2), "application/json"); toast("Backup exportado.");
  };
  $("#importBtn").onclick = () => $("#importFile").click();
  $("#publishBtn").onclick = () => {
    const js = `window.JQA = window.JQA || {};\n/* Conteúdo personalizado da Jornada QA, gerado em ${new Date().toLocaleString("pt-BR")}.\n * Substitua o arquivo data/personalizado.js do repositório por este para publicar as alterações. */\nJQA.OVERRIDE = ${JSON.stringify(C, null, 1)};\n`;
    download("personalizado.js", js, "text/javascript"); toast("Arquivo gerado. Substitua data/personalizado.js no repositório.");
  };
  $("#resetBtn").onclick = () => {
    if(!confirm("Restaurar o conteúdo original? Suas edições de tópicos, prompts e biblioteca neste navegador serão descartadas. Anotações e progresso continuam.")) return;
    store.del("jqa-conteudo"); C = normalize(J.OVERRIDE ? clone(J.OVERRIDE) : defaults());
    rerenderAll(); toast("Conteúdo original restaurado.");
  };
}
$("#dataBtn").onclick = openData;
$("#importFile").onchange = async e => {
  const file = e.target.files[0]; e.target.value = ""; if(!file) return;
  try{
    const data = JSON.parse(await file.text());
    if(data.app !== "jornada-qa" || !data.conteudo?.topics) throw new Error("formato");
    if(!confirm("Importar este backup? O conteúdo, as anotações e o progresso atuais deste navegador serão substituídos.")) return;
    C = normalize(upgrade(data.conteudo)); saveContent();
    notes = data.notas || {}; store.set("jqa-notas", notes);
    const pr = data.progresso || {};
    checks = pr.checklists || {}; store.set("jqa-checklists", checks);
    done.clear(); (pr.trilha || []).forEach(x => done.add(x)); store.set("jqa-trilha", [...done]);
    doneProj.clear(); (pr.projetos || []).forEach(x => doneProj.add(x)); store.set("jqa-projetos", [...doneProj]);
    doneEx.clear(); (pr.exercicios || []).forEach(x => doneEx.add(x)); store.set("jqa-exercicios-ia", [...doneEx]);
    rerenderAll(); toast("Backup importado.");
  }catch(err){ toast("Esse arquivo não é um backup da Jornada QA."); }
};
function rerenderAll(){ closePanel(); refreshTrail(); rendered.ia = rendered.prompts = rendered.lib = rendered.proj = 0; $("#promptsPage").dataset.ready = ""; $("#libPage").dataset.ready = ""; show(curTab); }

/* =====================================================================
   IA NO DIA A DIA
   ===================================================================== */
function copyBtn(text){ return `<button class="copy" data-copy="${esc(text)}">Copiar</button>`; }
function renderIA(){
  const IA = J.IA, m = IA.mcp, a = IA.agentes;
  $("#iaPage").innerHTML = `
  <p class="lead">${esc(IA.intro)}</p>
  <h3>Onde a IA ajuda e onde ter cuidado</h3>
  <div class="tasks">
    <div class="row head"><span>Tarefa</span><span>Como usar</span><span>Cuidado</span></div>
    ${IA.tarefas.map(t => `<div class="row"><b>${esc(t.t)}</b><span>${esc(t.como)}</span><span class="caution">${esc(t.cuidado)}</span></div>`).join("")}
  </div>
  <p class="muted">Prompts prontos para cada uma dessas tarefas estão em <a href="#prompts">Prompts</a>.</p>
  <h3>MCP: dando contexto real ao assistente</h3>
  <p class="lead">${esc(m.oque)}</p>
  <div class="flow" role="list">${m.partes.map((p, i) => `<div role="listitem" class="${i === 1 ? "acc" : ""}"><b>${esc(p.t)}</b><span>${esc(p.d)}</span></div>`).join("")}</div>
  <h3>Servidores MCP úteis para QA</h3>
  <div class="servers">${m.servidores.map(s => `<article class="server card"><h4>${ext(s.t, s.url)}</h4><p style="margin:0">${esc(s.faz)}</p>
      <div class="ask"><small>Peça assim</small>${esc(s.pedido)}</div><p class="caution" style="margin:0">${esc(s.cuidado)}</p></article>`).join("")}</div>
  <h3>Como configurar um servidor MCP</h3>
  <div class="code">${copyBtn(m.config)}${esc(m.config)}</div>
  <p class="muted">${esc(m.configNota)}</p>
  <ul class="links">${m.links.map(([l, u]) => `<li>${ext(l, u)}</li>`).join("")}</ul>
  <h3>Agentes de teste do Playwright</h3>
  <p class="lead">${esc(a.oque)}</p>
  <ol class="steps">${a.passos.map(p => `<li><div><b>${esc(p.t)}</b><br><span class="muted">${esc(p.d)}</span></div></li>`).join("")}</ol>
  <div class="code" style="margin-top:14px">${copyBtn(a.cmd)}${esc(a.cmd)}</div>
  <p class="muted">${esc(a.cmdNota)} ${ext(a.link[0], a.link[1])}.</p>
  <h3>Uma história do começo ao fim, com IA</h3>
  <ol class="steps">${IA.fluxo.map(p => `<li><div><b>${esc(p.t)}</b><br><span class="muted">${esc(p.d)}</span></div></li>`).join("")}</ol>
  <h3>Regras de ouro</h3>
  <ul class="rules">${IA.regras.map(r => `<li>${esc(r)}</li>`).join("")}</ul>
  <h3>Exercícios</h3>
  <ul class="checklist" id="iaEx">${IA.exercicios.map((x, i) => `<li><button data-ex="${i}" class="${doneEx.has(i) ? "done" : ""}" aria-pressed="${doneEx.has(i)}"><span>${esc(x)}</span><i class="check" aria-hidden="true"></i></button></li>`).join("")}</ul>`;
  $("#iaEx").onclick = e => {
    const b = e.target.closest("button[data-ex]"); if(!b) return; const i = +b.dataset.ex;
    doneEx.has(i) ? doneEx.delete(i) : doneEx.add(i); store.set("jqa-exercicios-ia", [...doneEx]);
    b.classList.toggle("done", doneEx.has(i)); b.setAttribute("aria-pressed", doneEx.has(i));
  };
}

/* =====================================================================
   PROMPTS
   ===================================================================== */
let promptCat = "Todos", promptQ = "", editingPrompt = null;
function promptForm(p){
  const cats = [...new Set(C.prompts.map(x => x.c))];
  return `<form class="inline-form form" data-pform="${esc(p.id || "novo")}" novalidate>
    <div class="two"><label>Categoria<input class="in" name="c" list="catList" value="${esc(p.c || "")}" required></label>
    <label>Título<input class="in" name="t" value="${esc(p.t || "")}" required></label></div>
    <datalist id="catList">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist>
    <label>Quando usar<input class="in" name="quando" value="${esc(p.quando || "")}"></label>
    <label>Prompt<textarea class="in mono" name="p" rows="8" required>${esc(p.p || "")}</textarea></label>
    <p class="err" hidden>Preencha categoria, título e o texto do prompt.</p>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" data-cancel>Cancelar</button><button class="btn primary" type="submit">${p.id ? "Salvar" : "Criar prompt"}</button></span></div>
  </form>`;
}
function renderPrompts(){
  const page = $("#promptsPage");
  if(!page.dataset.ready){
    page.innerHTML = `<div class="pagehead"><p class="lead">Modelos para copiar e adaptar. Troque o que está entre &lt; &gt; pelo seu contexto e revise sempre a resposta: o prompt organiza o pedido, mas o julgamento continua sendo seu.</p>
      <button class="btn primary" id="newPrompt">${ico("plus")}Novo prompt</button></div>
      <div class="filters" id="pCats" role="group" aria-label="Categorias"></div>
      <div class="filters"><label class="search" style="width:420px"><svg><use href="#i-search"/></svg><input id="pq" type="search" placeholder="Buscar prompt" aria-label="Buscar prompt"></label></div>
      <div class="prompts" id="pList"></div>`;
    page.dataset.ready = 1;
    $("#pq").oninput = e => { promptQ = e.target.value.toLowerCase(); renderPrompts(); };
    $("#newPrompt").onclick = () => { editingPrompt = "novo"; promptCat = "Todos"; renderPrompts(); $("#pList [name=c]")?.focus(); };
    $("#pList").addEventListener("click", e => {
      const ed = e.target.closest("[data-pedit]"), del = e.target.closest("[data-pdel]"), cancel = e.target.closest("[data-cancel]");
      if(ed){ editingPrompt = ed.dataset.pedit; renderPrompts(); $(`[data-pform="${editingPrompt}"] [name=t]`)?.focus(); }
      if(cancel){ editingPrompt = null; renderPrompts(); }
      if(del){ const p = C.prompts.find(x => x.id === del.dataset.pdel);
        if(p && confirm(`Excluir o prompt "${p.t}"?`)){ C.prompts = C.prompts.filter(x => x !== p); saveContent(); renderPrompts(); toast("Prompt excluído."); } }
    });
    $("#pList").addEventListener("submit", e => {
      e.preventDefault(); const f = e.target, id = f.dataset.pform;
      const data = {c:f.c.value.trim(), t:f.t.value.trim(), quando:f.quando.value.trim(), p:f.p.value.replace(/\s+$/, "")};
      if(!data.c || !data.t || !data.p.trim()){ f.querySelector(".err").hidden = false; return; }
      if(id === "novo") C.prompts.unshift({id:uid("p"), ...data}); else Object.assign(C.prompts.find(x => x.id === id), data);
      editingPrompt = null; saveContent(); renderPrompts(); toast(id === "novo" ? "Prompt criado." : "Prompt salvo.");
    });
  }
  const cats = ["Todos", ...new Set(C.prompts.map(p => p.c))];
  if(!cats.includes(promptCat)) promptCat = "Todos";
  $("#pCats").innerHTML = cats.map(c => `<button class="chip" aria-pressed="${c === promptCat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  $("#pCats").onclick = e => { const b = e.target.closest("[data-c]"); if(b){ promptCat = b.dataset.c; renderPrompts(); } };
  const list = C.prompts.filter(p => (promptCat === "Todos" || p.c === promptCat) && (!promptQ || (p.t + p.quando + p.p).toLowerCase().includes(promptQ)));
  let html = editingPrompt === "novo" ? promptForm({}) : "";
  html += list.length ? list.map(p => editingPrompt === p.id ? promptForm(p) : `<article class="prompt card hoverable">
      ${actions(`data-pedit="${esc(p.id)}"`, `data-pdel="${esc(p.id)}"`, p.t)}
      <span class="cat">${esc(p.c)}</span><h4>${esc(p.t)}</h4>${p.quando ? `<p class="muted" style="margin:0">${esc(p.quando)}</p>` : ""}
      <div class="code">${copyBtn(p.p)}<pre>${esc(p.p)}</pre></div></article>`).join("")
    : `<p class="empty">Nenhum prompt encontrado. Tente outra palavra ou a categoria Todos.</p>`;
  $("#pList").innerHTML = html;
}

/* =====================================================================
   BIBLIOTECA
   ===================================================================== */
let libTipo = "todos", libEtapa = "todas", libTema = "todos", libQ = "", libFree = false, editingLib = null;
const tipoNome = id => J.TIPOS.find(t => t.id === id)?.nome || id;
function libForm(i){
  const temas = [...new Set(C.lib.map(x => x.tema))];
  return `<form class="inline-form form" data-lform="${esc(i.id || "novo")}" novalidate>
    <div class="two"><label>Título<input class="in" name="t" value="${esc(i.t || "")}" required></label>
    <label>Endereço<input class="in" name="u" value="${esc(i.u || "")}" placeholder="https://…" required></label></div>
    <div class="three"><label>Tipo<select class="in" name="tipo">${J.TIPOS.map(t => `<option value="${t.id}"${t.id === i.tipo ? " selected" : ""}>${esc(t.nome)}</option>`).join("")}</select></label>
    <label>Etapa<select class="in" name="e"><option value="todas">Todas</option>${C.stages.map(s => `<option value="${esc(s.id)}"${s.id === i.e ? " selected" : ""}>${esc(stageLabel(s))}</option>`).join("")}</select></label>
    <label>Tema<input class="in" name="tema" list="temaList" value="${esc(i.tema || "")}"></label></div>
    <datalist id="temaList">${temas.map(t => `<option value="${esc(t)}">`).join("")}</datalist>
    <label>Por que vale<input class="in" name="d" value="${esc(i.d || "")}"></label>
    <label class="checkline"><input type="checkbox" name="pago"${i.pago ? " checked" : ""}> Conteúdo pago</label>
    <p class="err" hidden>Preencha o título e um endereço que comece com http:// ou https://.</p>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" data-cancel>Cancelar</button><button class="btn primary" type="submit">${i.id ? "Salvar" : "Adicionar"}</button></span></div>
  </form>`;
}
function renderLib(rebuild){
  const page = $("#libPage");
  if(!page.dataset.ready || rebuild){
    page.innerHTML = `<div class="pagehead"><p class="lead">Artigos, documentação, sites para praticar, repositórios, cursos, canais e comunidades num lugar só. Filtre pela etapa em que você está para ver só o que serve agora.</p>
        <button class="btn primary" id="newLib">${ico("plus")}Adicionar link</button></div>
      <div class="filters" id="lTipos" role="group" aria-label="Tipo"></div>
      <div class="filters">
        <select class="select" id="lEtapa" aria-label="Etapa"><option value="todas">Todas as etapas</option>${C.stages.map(s => `<option value="${esc(s.id)}">${esc(stageLabel(s))}</option>`).join("")}</select>
        <select class="select" id="lTema" aria-label="Tema"></select>
        <label class="switch"><input type="checkbox" id="lFree"${libFree ? " checked" : ""}><span aria-hidden="true"></span>Só gratuitos</label>
        <label class="search"><svg><use href="#i-search"/></svg><input id="lq" type="search" placeholder="Buscar na biblioteca" aria-label="Buscar na biblioteca" value="${esc(libQ)}"></label>
      </div>
      <p class="count" id="lCount" aria-live="polite"></p>
      <div class="lib" id="lList"></div>`;
    page.dataset.ready = 1;
    $("#lEtapa").value = C.stages.some(s => s.id === libEtapa) ? libEtapa : (libEtapa = "todas");
    $("#lEtapa").onchange = e => { libEtapa = e.target.value; renderLib(); };
    $("#lTema").onchange = e => { libTema = e.target.value; renderLib(); };
    $("#lFree").onchange = e => { libFree = e.target.checked; renderLib(); };
    $("#lq").oninput = e => { libQ = e.target.value.toLowerCase(); renderLib(); };
    $("#newLib").onclick = () => { editingLib = "novo"; renderLib(); $("#lList [name=t]")?.focus(); };
    $("#lList").addEventListener("click", e => {
      const ed = e.target.closest("[data-ledit]"), del = e.target.closest("[data-ldel]"), cancel = e.target.closest("[data-cancel]");
      if(ed){ editingLib = ed.dataset.ledit; renderLib(); $(`[data-lform="${editingLib}"] [name=t]`)?.focus(); }
      if(cancel){ editingLib = null; renderLib(); }
      if(del){ const it = C.lib.find(x => x.id === del.dataset.ldel);
        if(it && confirm(`Excluir "${it.t}" da biblioteca?`)){ C.lib = C.lib.filter(x => x !== it); saveContent(); renderLib(); toast("Item excluído."); } }
    });
    $("#lList").addEventListener("submit", e => {
      e.preventDefault(); const f = e.target, id = f.dataset.lform;
      const data = {t:f.t.value.trim(), u:f.u.value.trim(), tipo:f.tipo.value, e:f.e.value, tema:f.tema.value.trim() || "Geral", d:f.d.value.trim(), pago:f.pago.checked};
      if(!data.t || !safeUrl(data.u)){ f.querySelector(".err").hidden = false; return; }
      if(id === "novo") C.lib.unshift({id:uid("l"), ...data}); else Object.assign(C.lib.find(x => x.id === id), data);
      editingLib = null; saveContent(); renderLib(); toast(id === "novo" ? "Link adicionado." : "Link salvo.");
    });
  }
  const temas = [...new Set(C.lib.map(i => i.tema))].sort((a, b) => a.localeCompare(b, "pt"));
  if(libTema !== "todos" && !temas.includes(libTema)) libTema = "todos";
  $("#lTema").innerHTML = `<option value="todos">Todos os temas</option>${temas.map(t => `<option${t === libTema ? " selected" : ""}>${esc(t)}</option>`).join("")}`;
  $("#lTipos").innerHTML = [{id:"todos", nome:"Tudo"}, ...J.TIPOS].map(t => `<button class="chip" aria-pressed="${t.id === libTipo}" data-t="${t.id}">${esc(t.nome)}</button>`).join("");
  $("#lTipos").onclick = e => { const b = e.target.closest("[data-t]"); if(b){ libTipo = b.dataset.t; renderLib(); } };
  const list = C.lib.filter(i => (libTipo === "todos" || i.tipo === libTipo)
    && (libEtapa === "todas" || i.e === libEtapa || i.e === "todas")
    && (libTema === "todos" || i.tema === libTema) && (!libFree || !i.pago)
    && (!libQ || (i.t + " " + i.d + " " + i.tema).toLowerCase().includes(libQ)));
  $("#lCount").textContent = `${list.length} ${list.length === 1 ? "item" : "itens"}`;
  let html = editingLib === "novo" ? libForm({tipo:libTipo !== "todos" ? libTipo : "artigo", e:libEtapa}) : "";
  html += list.length ? list.map(i => {
    if(editingLib === i.id) return libForm(i);
    const s = stageOf(i.e);
    return `<div class="row hoverable"><div>${ext(i.t, i.u)}${i.pago ? '<span class="paid">pago</span>' : ''}<div class="d">${esc(i.d)}</div></div>
      <div class="meta"><b>${esc(tipoNome(i.tipo))}</b><br>${esc(i.tema)}</div>
      <div class="meta">${s ? `<span class="tag" style="background:var(${s.color})">Etapa ${esc(s.n)}</span>` : "Todas as etapas"}</div>
      ${actions(`data-ledit="${esc(i.id)}"`, `data-ldel="${esc(i.id)}"`, i.t)}</div>`;
  }).join("") : (editingLib === "novo" ? "" : `<p class="empty">Nada encontrado com esses filtros. Limpe a busca ou escolha Tudo.</p>`);
  $("#lList").innerHTML = html;
}

/* =====================================================================
   PROJETOS
   ===================================================================== */
function renderProj(){
  $("#projPage").innerHTML = `<p class="lead">Em ordem de dificuldade. Não é preciso fazer todos: escolha os que combinam com sua etapa e com as vagas que você quer. Cada um vira um repositório com README explicando contexto, riscos, o que foi testado, o que ficou de fora e o que você aprendeu.</p>
    <div class="projects" id="pjList">${J.PROJETOS.map((p, i) => { const s = stageOf(p.e), on = doneProj.has(i), col = s ? s.color : "--border";
      return `<article class="project card${on ? " done" : ""}" style="border-top-color:var(${col})">
        <h4><span>${esc(p.t)}</span></h4>
        ${s ? `<span class="tag" style="background:var(${col});justify-self:start">${esc(stageLabel(s))}</span>` : ""}
        <p style="margin:0">${esc(p.entrega)}</p>
        ${p.onde ? `<p style="margin:0" class="muted">Onde: ${ext(p.onde[0], p.onde[1])}</p>` : ""}
        <button class="btn sm" data-p="${i}" aria-pressed="${on}">${on ? "Concluído" : "Marcar como concluído"}</button>
      </article>`; }).join("")}</div>`;
  $("#pjList").onclick = e => { const b = e.target.closest("[data-p]"); if(!b) return; const i = +b.dataset.p;
    doneProj.has(i) ? doneProj.delete(i) : doneProj.add(i); store.set("jqa-projetos", [...doneProj]); renderProj(); };
}

/* ---------- copiar ---------- */
document.addEventListener("click", async e => {
  const b = e.target.closest(".copy"); if(!b) return;
  try{ await navigator.clipboard.writeText(b.dataset.copy); b.textContent = "Copiado"; }
  catch(err){ b.textContent = "Selecione e copie"; }
  setTimeout(() => b.textContent = "Copiar", 1800);
});

/* =====================================================================
   NAVEGAÇÃO
   ===================================================================== */
const TABS = {mapa:"Mapa", rota:"Rota de estudo", ia:"IA no dia a dia", prompts:"Prompts", biblioteca:"Biblioteca", projetos:"Projetos"};
let curTab = null;
const rendered = {};
function show(tab){
  if(!TABS[tab]) tab = matchMedia("(max-width:820px)").matches ? "rota" : "mapa";
  curTab = tab;
  Object.keys(TABS).forEach(t => { document.getElementById("v-" + t).hidden = t !== tab; });
  document.querySelectorAll(".nav a").forEach(a => a.dataset.tab === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  $("#pageTitle").textContent = TABS[tab];
  document.title = `${TABS[tab]} · Jornada QA`;
  const trail = tab === "mapa" || tab === "rota";
  $("#toolbar").hidden = !trail; $("#techToggle").hidden = tab !== "mapa";
  if(tab === "ia" && !rendered.ia){ renderIA(); rendered.ia = 1; }
  if(tab === "prompts" && !rendered.prompts){ renderPrompts(); rendered.prompts = 1; }
  if(tab === "biblioteca" && !rendered.lib){ renderLib(); rendered.lib = 1; }
  if(tab === "projetos" && !rendered.proj){ renderProj(); rendered.proj = 1; }
  if(tab === "mapa") requestAnimationFrame(fit);
}
window.addEventListener("hashchange", () => show(location.hash.slice(1)));

const qi = $("#q");
function setQuery(v){ query = v; qi.value = v; renderMap(); renderRoute(); }
qi.addEventListener("input", () => { query = qi.value; renderMap(); renderRoute(); });
$("#showTech").addEventListener("change", e => { showTech = e.target.checked; renderMap(); fit(); });

/* ---------- início ---------- */
updateMeter(); renderLegend(); renderMap(); renderRoute();
show(location.hash.slice(1));
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { renderMap(); fit(); });
})();
