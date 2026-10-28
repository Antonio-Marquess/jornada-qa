/* Jornada QA — Mapa mental reutilizável (usado pelo Mapa e pelos Minimapas).
 *
 * Recebe uma árvore de nós e desenha em SVG, com:
 *   - ramos que abrem e fecham (botão +N / − na borda do nó), lembrados por navegador
 *   - quantos níveis a árvore tiver
 *   - foco: mostra só o caminho até um nó e o que está dentro dele
 *   - pan, zoom, centralizar, abrir tudo e recolher tudo
 *
 * Cada nó: {id, label, color, icon, tag, done, check, dashed, ia, note, match, dim, aria, onOpen, children}
 *   onOpen  ação ao clicar no nome (sem onOpen, o clique abre ou fecha o ramo)
 *   check   true/false mostra uma caixinha de marcar; undefined não mostra
 *
 * Edição (cada função é opcional; sem ela, a ação não aparece):
 *   edit(texto)  muda o texto       add()  cria um filho e devolve o id      sib()  cria um irmão e devolve o id
 *   del()        exclui (devolve false se a pessoa cancelar)                  onCheck()  marca ou desmarca a caixinha
 *   dragType     tipo do nó ao ser arrastado; accepts: tipos que este nó recebe; drop(arrastado)  move para cá
 * Teclado, como no XMind e no MindMeister: Tab filho, Enter irmão, F2 edita, Delete exclui, Espaço abre ou fecha,
 *   F foca, O abre detalhes, setas navegam, Ctrl+Z desfaz, Esc sai.
 */
(function(A){
const {$, esc, el, textW, useIcon, store} = A;

const ROOT_FONT = '800 24px "Bricolage Grotesque", sans-serif';
const FONT = d => d === 1 ? '700 16px "Bricolage Grotesque", sans-serif' : d === 2 ? '700 14px "Atkinson Hyperlegible", sans-serif' : '400 13px "Atkinson Hyperlegible", sans-serif';
const FONT_GROUP = '700 13px "Atkinson Hyperlegible", sans-serif';
const TAG_FONT = '400 11.5px "Atkinson Hyperlegible", sans-serif';
const H = d => d === 0 ? 64 : d === 1 ? 40 : d === 2 ? 28 : 24;          /* altura do nó */
const ROW = d => d === 1 ? 44 : d === 2 ? 34 : 29;                        /* altura mínima da linha */
const GAP = d => d === 1 ? 84 : d === 2 ? 62 : 46;                        /* distância horizontal até o pai */
const MAXLABEL = 52;
const cut = (s, n) => s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;

function createMindMap(opt){
  const svg = opt.svg, key = "jqa-mm-" + opt.key;
  let vb = {x:0, y:0, w:1600, h:1000}, bounds = null, moved = false, drag = null, fitted = false;
  let saved = store.get(key, {}), focusId = null, reveal = new Set(), index = new Map(), root = null, last = [];
  let sel = null, editing = null, ndrag = null;
  const box = svg.parentElement;
  const bar = document.createElement("div"); bar.className = "mmbar"; bar.hidden = true; bar.setAttribute("role", "toolbar"); box.appendChild(bar);

  /* ---------- árvore ---------- */
  function annotate(n, depth, parent){
    n.depth = depth; n.parent = parent; n.children = (n.children || []).filter(Boolean);
    index.set(n.id, n); n.children.forEach(c => annotate(c, depth + 1, n));
  }
  const ancestors = n => { const a = []; for(let p = n.parent; p; p = p.parent) a.unshift(p); return a; };
  const userOpen = n => n.id in saved ? saved[n.id] : (n.depth === 0 || !!opt.defaultOpen?.(n));
  let focusPath = new Set();
  const isOpen = n => n.depth === 0 || focusPath.has(n.id) || reveal.has(n.id) || userOpen(n);
  function visibleKids(n){
    if(!n.children.length) return [];
    const f = focusId && index.get(focusId);
    if(f && focusPath.has(n.id) && n !== f){ const next = ancestors(f).concat(f).find(x => x.parent === n); return next ? [next] : []; }
    return isOpen(n) ? n.children : [];
  }

  /* ---------- medidas e posições ---------- */
  function measure(n){
    const d = n.depth;
    n.text = d >= 3 ? cut(n.label, MAXLABEL) : n.label;
    n.font = d === 0 ? ROOT_FONT : n.group ? FONT_GROUP : FONT(d);
    n.tagW = n.tag ? textW(n.tag, TAG_FONT) + 10 : 0;
    const lead = (n.check !== undefined ? 20 : 0) + (n.done && n.check === undefined ? 20 : 0) + (n.icon && d <= 1 ? 26 : 0) + (n.ia ? 20 : 0);
    n.w = textW(n.text, n.font) + (d === 0 ? 76 : d === 1 ? 34 : 24) + lead + n.tagW;
    n.h = H(d); n.hw = n.w / 2;
  }
  function subH(n){
    const kids = n.vis;
    const own = ROW(Math.max(1, n.depth));
    if(!kids.length) return (n.sh = own);
    const sum = kids.reduce((a, k) => a + subH(k), 0);
    return (n.sh = Math.max(own, sum));
  }
  function place(n, top){
    const kids = n.vis;
    if(!kids.length){ n.y = top + n.sh / 2; return; }
    const sum = kids.reduce((a, k) => a + k.sh, 0);
    let y = top + (n.sh - sum) / 2;
    kids.forEach(k => { k.side = n.side; k.x = n.x + n.side * (n.hw + bub(n) + GAP(k.depth) + k.hw); place(k, y); y += k.sh; });
    n.y = (kids[0].y + kids[kids.length - 1].y) / 2;
  }
  const bub = n => n.children.length && n.depth > 0 ? 22 : 0;
  const showsBubble = n => n.children.length && n.depth > 0 && !(focusId && focusPath.has(n.id) && n.id !== focusId);
  /* lados fixos para os ramos principais: não trocam de lado quando você abre ou fecha algo */
  function sides(r){
    const w = r.children.map(c => 1 + c.children.length);
    const total = w.reduce((a, b) => a + b, 0); let acc = 0, k = 0;
    for(let i = 0; i < w.length; i++){ if(acc + w[i] / 2 > total / 2 && i > 0) break; acc += w[i]; k = i + 1; }
    if(r.children.length > 1) k = Math.min(Math.max(k, 1), r.children.length - 1);
    r.children.forEach((c, i) => c.side = i < k ? -1 : 1);
  }
  function layout(){
    const list = [];
    const walk = n => { measure(n); n.vis = visibleKids(n); list.push(n); n.vis.forEach(walk); };
    walk(root);
    root.x = 0; root.y = 0; root.side = 0;
    for(const s of [-1, 1]){
      const kids = root.vis.filter(c => c.side === s); if(!kids.length) continue;
      const gap = 18, total = kids.reduce((a, k) => a + subH(k), 0) + gap * (kids.length - 1);
      let y = -total / 2;
      kids.forEach(k => { k.x = s * (root.hw + GAP(1) + k.hw); place(k, y); y += k.sh + gap; });
    }
    return list;
  }

  /* ---------- desenho ---------- */
  function render(){
    index = new Map(); root = opt.build(); annotate(root, 0, null); sides(root);
    if(focusId && !index.has(focusId)) focusId = null;
    focusPath = new Set(focusId ? ancestors(index.get(focusId)).concat(index.get(focusId)).map(n => n.id) : []);
    const list = layout(); last = list;
    svg.innerHTML = "";
    const gL = el("g", {fill:"none", "stroke-linecap":"round"}, svg), gN = el("g", {}, svg);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    list.forEach(n => {
      if(!n.parent) return;
      const p = n.parent, s = n.side, ax = p.x + s * (p.hw + (showsBubble(p) ? bub(p) : 0)), bx = n.x - s * n.hw, mx = (ax + bx) / 2;
      const w = n.depth === 1 ? 4 : n.depth === 2 ? 2.2 : 1.5;
      const path = el("path", {d:`M${ax},${p.y} C${mx},${p.y} ${mx},${n.y} ${bx},${n.y}`, stroke:`var(${n.color || "--border-strong"})`, "stroke-width":w, opacity:n.depth === 1 ? .9 : n.depth === 2 ? .6 : .45}, gL);
      if(n.dim) path.classList.add("dim");
    });
    list.forEach(n => {
      drawNode(gN, n);
      const ex = n.x + (n.side || 1) * (n.hw + bub(n) * 1.6);
      minX = Math.min(minX, n.x - n.hw, ex); maxX = Math.max(maxX, n.x + n.hw, ex);
      minY = Math.min(minY, n.y - n.h / 2); maxY = Math.max(maxY, n.y + n.h / 2);
    });
    bounds = {x:minX - 40, y:minY - 70, w:(maxX - minX) + 80, h:(maxY - minY) + 120};
    if(sel && !index.has(sel)) sel = null;
    applyVB(); renderFocusBar();
    if(!fitted) fitted = fit();
    renderBar();
    return list;
  }
  function drawNode(gN, n){
    const d = n.depth, g = el("g", {class:"node n-d" + Math.min(d, 3) + (n.group ? " n-group" : ""), transform:`translate(${n.x},${n.y})`, "data-id":n.id}, gN);
    if(n.dim) g.classList.add("dim"); if(n.match) g.classList.add("match");
    const col = `var(${n.color || "--border-strong"})`;
    let x = -n.hw + (d === 0 ? 14 : 12);
    if(d === 0){
      el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:18, fill:"var(--brand)"}, g);
      el("rect", {x:-n.hw + 14, y:-15, width:30, height:30, rx:8, fill:"var(--hl)"}, g);
      useIcon(g, n.icon || "check", -n.hw + 18, -11, 22, "var(--hl-ink)", n.icon ? 2.4 : 3);
      el("text", {x:-n.hw + 58, y:8, fill:"var(--brand-ink)", style:`font:${ROOT_FONT}`}, g).textContent = n.text;
    } else if(d === 1){
      el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:12, fill:col}, g);
      if(n.icon){ useIcon(g, n.icon, x, -9, 18, "var(--on-stage)", 2.2); x += 26; }
      el("text", {x, y:6, fill:"var(--on-stage)", style:`font:${n.font}`}, g).textContent = n.text;
      if(n.tag) el("text", {x:n.hw - n.tagW, y:5, fill:"var(--on-stage)", opacity:.85, style:`font:${TAG_FONT}`}, g).textContent = n.tag;
    } else {
      const on = n.done || n.check === true;
      el("rect", {class:"box", x:-n.hw, y:-n.h / 2, width:n.w, height:n.h, rx:d === 2 ? 8 : 12,
        fill:on ? "var(--hl)" : n.group ? "var(--surface-2)" : "var(--surface)", stroke:col, "stroke-width":d === 2 ? 2 : 1.4,
        ...(n.dashed ? {"stroke-dasharray":"5 3"} : {})}, g);
      if(n.ia) el("rect", {x:-n.hw - 4, y:-n.h / 2 - 4, width:n.w + 8, height:n.h + 8, rx:d === 2 ? 11 : 15, fill:"none", stroke:"var(--ia)", "stroke-width":1.5, "stroke-dasharray":"4 3"}, g);
      if(n.note) el("circle", {cx:n.side > 0 ? -n.hw : n.hw, cy:-n.h / 2, r:5, fill:"var(--note)", stroke:"var(--surface)", "stroke-width":2}, g);
      if(n.check !== undefined){
        el("rect", {class:"chk", x:x - 3, y:-9, width:18, height:18, fill:"transparent"}, g);
        el("rect", {x, y:-6, width:12, height:12, rx:3, "pointer-events":"none", fill:n.check ? "var(--hl-ink)" : "var(--surface)", stroke:n.check ? "var(--hl-ink)" : "var(--border-strong)", "stroke-width":1.5}, g);
        if(n.check) el("path", {d:`M${x + 2.5},0 l2.6,2.8 l4.6,-5.2`, stroke:"var(--hl)", "stroke-width":2, fill:"none", "stroke-linecap":"round", "stroke-linejoin":"round"}, g);
        x += 20;
      } else if(n.done){
        el("path", {d:`M${x - 2},0 l4,4 l8,-9`, stroke:"var(--hl-ink)", "stroke-width":2.5, fill:"none", "stroke-linecap":"round", "stroke-linejoin":"round"}, g); x += 20;
      }
      el("text", {x, y:d === 2 ? 5 : 4.5, fill:on ? "var(--hl-ink)" : "var(--text)", style:`font:${n.font}`}, g).textContent = n.text;
      if(n.ia) useIcon(g, "spark", n.hw - n.tagW - 22, -8, 16, "var(--ia)", 2);
      /* tagFill: a etiqueta vira uma pílula colorida (níveis N1, N2, N3) */
      if(n.tag && n.tagFill){ el("rect", {x:n.hw - n.tagW - 4, y:-9, width:n.tagW, height:18, rx:5, fill:n.tagFill}, g);
        el("text", {x:n.hw - n.tagW + 1, y:4, fill:n.tagInk || "var(--lv-ink)", style:`font:700 11px "Atkinson Hyperlegible", sans-serif`}, g).textContent = n.tag; }
      else if(n.tag) el("text", {x:n.hw - n.tagW, y:d === 2 ? 4.5 : 4, fill:on ? "var(--hl-ink)" : "var(--muted)", style:`font:${TAG_FONT}`}, g).textContent = n.tag;
    }
    /* interação: clique seleciona, duplo clique edita (ou abre, se não for editável) */
    if(n.id === sel) g.classList.add("sel");
    if(n.dragType) g.classList.add("draggable");
    g.setAttribute("tabindex", n.id === sel || (!sel && d === 0) ? "0" : "-1"); g.setAttribute("role", "treeitem");
    g.setAttribute("aria-label", (n.aria || n.label) + (n.children.length ? `. ${isOpen(n) ? "aberto" : "fechado"}, ${n.children.length} itens` : ""));
    if(n.children.length) g.setAttribute("aria-expanded", isOpen(n));
    g.addEventListener("click", e => { if(moved) return; e.stopPropagation(); select(n.id); });
    g.addEventListener("dblclick", e => { e.preventDefault(); e.stopPropagation(); if(n.edit) startEdit(n.id); else if(n.onOpen) n.onOpen(n); else if(n.children.length) toggle(n); });
    g.addEventListener("pointerdown", e => { if(n.dragType && e.button === 0){ ndrag = {id:n.id, x:e.clientX, y:e.clientY, on:false}; } });
    /* caixinha de marcar */
    const chk = g.querySelector(".chk");
    if(chk && n.onCheck) chk.addEventListener("click", e => { e.stopPropagation(); if(!moved){ sel = n.id; n.onCheck(n); } });
    /* botão de abrir e fechar o ramo */
    if(showsBubble(n)){
      const open = isOpen(n), txt = open ? "−" : "+" + n.children.length;
      const bw = Math.max(18, textW(txt, '700 11px "Atkinson Hyperlegible", sans-serif') + 10), bx = n.side * (n.hw + 6) + (n.side > 0 ? 0 : -bw);
      const b = el("g", {class:"bubble" + (open ? " open" : ""), tabindex:"-1"}, g);
      el("rect", {x:bx, y:-9, width:bw, height:18, rx:9, fill:open ? "var(--surface)" : col, stroke:col, "stroke-width":1.5}, b);
      el("text", {x:bx + bw / 2, y:4, "text-anchor":"middle", fill:open ? col : "var(--on-stage)", style:'font:700 11px "Atkinson Hyperlegible", sans-serif'}, b).textContent = txt;
      b.addEventListener("click", e => { e.stopPropagation(); if(!moved) toggle(n); });
      b.addEventListener("dblclick", e => e.stopPropagation());
    }
  }

  /* ---------- ações ---------- */
  function persist(){ store.set(key, saved); }
  function keepInPlace(id, fn){
    const before = index.get(id), bx = before?.x, by = before?.y;
    fn();
    const after = index.get(id);
    if(after && bx != null){ vb.x += after.x - bx; vb.y += after.y - by; applyVB(); }
  }
  function toggle(n, keepFocus){
    const open = isOpen(n);
    keepInPlace(n.id, () => { saved[n.id] = !open; reveal.delete(n.id); persist(); render(); });
    if(keepFocus) select(n.id);
  }
  function setAll(open){
    index.forEach(n => { if(n.depth > 0 && n.children.length) saved[n.id] = open; });
    if(!open) index.forEach(n => { if(n.depth === 1) saved[n.id] = true; });
    reveal.clear(); persist(); render(); fit();
  }
  function focus(id){ if(!index.has(id)) render(); if(!index.has(id)) return; focusId = id; saved[id] = true; persist(); render(); fit(); }
  function unfocus(){ if(!focusId) return; const id = focusId; focusId = null; render(); fit(); return id; }
  function setReveal(ids){ reveal = new Set(); ids.forEach(id => reveal.add(id)); render(); }

  function renderFocusBar(){
    const bar = opt.focusBar; if(!bar) return;
    const f = focusId && index.get(focusId);
    bar.hidden = !f; if(!f) return;
    const chain = ancestors(f).concat(f);
    bar.innerHTML = `<span class="fb-label">Foco</span>${chain.map((n, i) => `${i ? '<span class="fb-sep">›</span>' : ""}<button class="fb-crumb" data-fid="${esc(n.id)}"${n === f ? ' aria-current="true"' : ""}>${esc(cut(n.label, 34))}</button>`).join("")}<button class="btn sm" data-funfocus>Mostrar tudo</button>`;
    bar.onclick = e => {
      const c = e.target.closest("[data-fid]"), u = e.target.closest("[data-funfocus]");
      if(u) unfocus(); else if(c){ const n = index.get(c.dataset.fid); n && n.depth === 0 ? unfocus() : focus(c.dataset.fid); }
    };
  }

  /* ---------- seleção, barra de ações, edição e arrastar ---------- */
  const gOf = id => svg.querySelector(`[data-id="${CSS.escape(id)}"]`);
  function select(id, keepFocus){
    sel = id;
    svg.querySelectorAll(".node.sel").forEach(g => { g.classList.remove("sel"); g.setAttribute("tabindex", "-1"); });
    const g = id && gOf(id);
    if(g){ g.classList.add("sel"); g.setAttribute("tabindex", "0"); if(keepFocus !== false) g.focus({preventScroll:true}); }
    renderBar();
  }
  const ACTS = [
    ["open", "Abrir", n => n.onOpen, "info"],
    ["add", "Novo filho (Tab)", n => n.add, "plus"],
    ["sib", "Novo irmão (Enter)", n => n.sib, "sib"],
    ["edit", "Editar texto (F2 ou duplo clique)", n => n.edit, "pen"],
    ["focus", "Focar neste ramo (F)", n => n.depth > 0, "target"],
    ["del", "Excluir (Delete)", n => n.del, "trash"]
  ];
  function renderBar(){
    const n = sel && index.get(sel);
    if(!n || editing){ bar.hidden = true; return; }
    bar.innerHTML = ACTS.filter(a => a[2](n)).map(([k, t, , ic]) =>
      `<button data-act="${k}" title="${esc(t)}" aria-label="${esc(t)}"${k === "del" ? ' class="danger"' : ""}><svg><use href="#i-${ic}"/></svg>${k === "open" ? `<span>${esc(n.openLabel || "Abrir")}</span>` : ""}</button>`).join("");
    bar.hidden = false; placeBar();
  }
  function placeBar(){
    if(bar.hidden || !sel) return; const g = gOf(sel); if(!g){ bar.hidden = true; return; }
    const r = (g.querySelector(".box") || g).getBoundingClientRect(), br = box.getBoundingClientRect();
    const top = r.top - br.top, below = top < 64;
    bar.style.left = (r.left - br.left + r.width / 2) + "px";
    bar.style.top = (below ? r.bottom - br.top + 8 : top - 8) + "px";
    bar.classList.toggle("below", below);
    /* não deixa a barra sair pelas laterais */
    const bw = bar.offsetWidth, cx = r.left - br.left + r.width / 2;
    bar.style.left = Math.min(Math.max(cx, bw / 2 + 8), br.width - bw / 2 - 8) + "px";
  }
  bar.addEventListener("pointerdown", e => e.stopPropagation());
  bar.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"), n = sel && index.get(sel); if(!b || !n) return;
    act(b.dataset.act, n);
  });
  function act(k, n){
    if(k === "open") n.onOpen?.(n);
    else if(k === "add" && n.add) created(n.add(n));
    else if(k === "sib" && n.sib) created(n.sib(n));
    else if(k === "edit") startEdit(n.id);
    else if(k === "focus" && n.depth > 0) focus(n.id);
    else if(k === "del" && n.del){ const p = n.parent?.id; if(n.del(n) !== false){ render(); select(p && index.has(p) ? p : null); } }
  }
  /* depois de criar um nó: abre o caminho até ele, seleciona e já entra em edição */
  function created(id){
    if(!id) return;
    render(); const n = index.get(id); if(!n) return;
    ancestors(n).forEach(a => saved[a.id] = true); persist(); render();
    ensureVisible(id); select(id); startEdit(id, true);
  }
  /* se o nó ficou fora da tela, desloca a visão até ele */
  function ensureVisible(id){
    const n = index.get(id); if(!n || n.x == null) return;
    const m = 60 * vb.w / 1000; let dx = 0, dy = 0;
    if(n.x - n.hw - m < vb.x) dx = n.x - n.hw - m - vb.x; else if(n.x + n.hw + m > vb.x + vb.w) dx = n.x + n.hw + m - vb.x - vb.w;
    if(n.y - n.h - m < vb.y) dy = n.y - n.h - m - vb.y; else if(n.y + n.h + m > vb.y + vb.h) dy = n.y + n.h + m - vb.y - vb.h;
    if(dx || dy){ vb.x += dx; vb.y += dy; applyVB(); }
  }
  function startEdit(id, isNew){
    const n = index.get(id); if(!n?.edit) return;
    const g = gOf(id); if(!g) return;
    editing = id; renderBar();
    const r = g.querySelector(".box").getBoundingClientRect(), br = box.getBoundingClientRect();
    const inp = document.createElement("input");
    inp.className = "mmedit"; inp.value = n.editValue ?? n.label; inp.setAttribute("aria-label", "Texto do nó");
    Object.assign(inp.style, {left:(r.left - br.left - 4) + "px", top:(r.top - br.top + r.height / 2) + "px", width:Math.max(r.width + 40, 220) + "px"});
    box.appendChild(inp); inp.focus(); inp.select();
    let done = false;
    const finish = (save, then) => {
      if(done) return; done = true;
      const v = inp.value.trim(); inp.remove(); editing = null;
      if(save && v && v !== (n.editValue ?? n.label)) n.edit(v, n);
      render(); select(id);
      if(then) then(index.get(id));
    };
    inp.addEventListener("keydown", e => {
      e.stopPropagation();
      if(e.key === "Enter"){ e.preventDefault(); finish(true, isNew ? m => m?.sib && created(m.sib(m)) : null); }
      else if(e.key === "Tab"){ e.preventDefault(); finish(true, m => m?.add && created(m.add(m))); }
      else if(e.key === "Escape"){ e.preventDefault(); finish(true); }
    });
    inp.addEventListener("blur", () => finish(true));
  }
  function dragMove(e){
    const d = ndrag;
    if(!d.on){ if(Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) < 7) return; d.on = true; moved = true; d.g = gOf(d.id); d.g?.classList.add("ghost"); select(d.id, false); bar.hidden = true; }
    const n = index.get(d.id); if(!d.g || !n) return;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    d.g.setAttribute("transform", `translate(${p.x},${p.y})`);
    svg.querySelectorAll(".drop").forEach(x => x.classList.remove("drop"));
    const t = targetAt(e.clientX, e.clientY, n); if(t) gOf(t.id)?.classList.add("drop");
  }
  function targetAt(x, y, n){
    const hit = document.elementFromPoint(x, y)?.closest?.("[data-id]"); if(!hit || !svg.contains(hit)) return null;
    const t = index.get(hit.dataset.id); if(!t || t === n) return null;
    for(let p = t; p; p = p.parent) if(p === n) return null;
    return t.accepts?.includes(n.dragType) ? t : null;
  }
  function dragEnd(e){
    const d = ndrag; ndrag = null; if(!d.on) return;
    const n = index.get(d.id), t = n && targetAt(e.clientX, e.clientY, n);
    if(t && t.drop){ t.drop(n, t); render(); saved[t.id] = true; persist(); render(); select(d.id); } else { render(); select(d.id); }
  }
  /* teclado, como nos apps de mapa mental */
  svg.addEventListener("keydown", e => {
    if(editing) return;
    const n = sel && index.get(sel); if(!n) return;
    const k = e.key, mod = e.ctrlKey || e.metaKey;
    if(mod && (k === "z" || k === "Z")){ e.preventDefault(); if(opt.undo?.()) render(); return; }
    if(k === "Tab"){ if(n.add){ e.preventDefault(); created(n.add(n)); } return; }
    if(k === "Enter"){ e.preventDefault(); if(n.sib) created(n.sib(n)); else if(n.add) created(n.add(n)); else n.onOpen?.(n); return; }
    if(k === "F2"){ e.preventDefault(); startEdit(n.id); return; }
    if(k === "Delete" || k === "Backspace"){ if(n.del){ e.preventDefault(); act("del", n); } return; }
    if(k === " "){ e.preventDefault(); if(n.children.length) toggle(n, true); return; }
    if(k === "f" || k === "F"){ if(n.depth > 0){ e.preventDefault(); focus(n.id); } return; }
    if(k === "o" || k === "O"){ e.preventDefault(); n.onOpen?.(n); return; }
    if(k === "Escape"){ e.preventDefault(); if(focusId) unfocus(); else select(null); return; }
    if(k.startsWith("Arrow")){
      e.preventDefault();
      const out = n.side >= 0 ? "ArrowRight" : "ArrowLeft", back = n.side >= 0 ? "ArrowLeft" : "ArrowRight";
      let t = null;
      if(n.depth === 0){ t = root.vis.find(c => c.side === (k === "ArrowLeft" ? -1 : 1)); }
      else if(k === out){ if(!isOpen(n) && n.children.length){ toggle(n, true); return; } t = n.vis[0]; }
      else if(k === back) t = n.parent;
      else { const sib = n.parent.vis, i = sib.indexOf(n); t = sib[i + (k === "ArrowDown" ? 1 : -1)]; }
      if(t){ ensureVisible(t.id); select(t.id); }
    }
  });

  /* ---------- pan e zoom ---------- */
  /* enquadra só alguns nós (por exemplo, os resultados da busca) */
  function fitTo(pred){
    const ns = last.filter(pred); if(!ns.length) return fit();
    const r = svg.getBoundingClientRect(); if(!r.width || !r.height) return false;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    ns.forEach(n => { x0 = Math.min(x0, n.x - n.hw); x1 = Math.max(x1, n.x + n.hw); y0 = Math.min(y0, n.y - n.h); y1 = Math.max(y1, n.y + n.h); });
    let w = Math.max(x1 - x0 + 160, 700), h = Math.max(y1 - y0 + 160, 420), x = (x0 + x1) / 2 - w / 2, y = (y0 + y1) / 2 - h / 2;
    const ar = r.width / r.height;
    if(w / h > ar){ const nh = w / ar; y -= (nh - h) / 2; h = nh; } else { const nw = h * ar; x -= (nw - w) / 2; w = nw; }
    vb = {x, y, w, h}; applyVB(); return true;
  }
  function applyVB(){ svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); placeBar(); }
  function fit(){
    if(!bounds) return false; const r = svg.getBoundingClientRect(); if(!r.width || !r.height) return false;
    const ar = r.width / r.height; let {x, y, w, h} = bounds;
    const minW = r.width < 600 ? 360 : 1100; if(w < minW){ x -= (minW - w) / 2; w = minW; }
    if(w / h > ar){ const nh = w / ar; y -= (nh - h) / 2; h = nh; } else { const nw = h * ar; x -= (nw - w) / 2; w = nw; }
    vb = {x, y, w, h}; applyVB(); return true;
  }
  function zoom(f, cx, cy){
    const r = svg.getBoundingClientRect();
    const px = cx == null ? .5 : (cx - r.left) / r.width, py = cy == null ? .5 : (cy - r.top) / r.height;
    const nw = Math.min(Math.max(vb.w * f, 300), 14000), nh = nw * (vb.h / vb.w);
    vb.x += (vb.w - nw) * px; vb.y += (vb.h - nh) * py; vb.w = nw; vb.h = nh; applyVB();
  }
  svg.addEventListener("wheel", e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, {passive:false});
  svg.addEventListener("pointerdown", e => { moved = false; if(!ndrag) drag = {x:e.clientX, y:e.clientY, vx:vb.x, vy:vb.y}; });
  svg.addEventListener("click", () => { if(!moved) select(null); });
  window.addEventListener("pointermove", e => {
    if(ndrag){ dragMove(e); return; }
    if(!drag) return; const r = svg.getBoundingClientRect();
    if(Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4){ moved = true; svg.classList.add("dragging"); }
    vb.x = drag.vx - (e.clientX - drag.x) * vb.w / r.width; vb.y = drag.vy - (e.clientY - drag.y) * vb.h / r.height; applyVB();
  });
  window.addEventListener("pointerup", e => { if(ndrag) dragEnd(e); drag = null; svg.classList.remove("dragging"); setTimeout(() => moved = false, 0); });
  window.addEventListener("resize", () => { if(svg.getBoundingClientRect().width) fit(); });
  const c = opt.controls || {};
  if(c.zin) c.zin.onclick = () => zoom(1 / 1.25);
  if(c.zout) c.zout.onclick = () => zoom(1.25);
  if(c.fit) c.fit.onclick = fit;
  if(c.expand) c.expand.onclick = () => setAll(true);
  if(c.collapse) c.collapse.onclick = () => setAll(false);

  return {render, fit, fitTo, zoom, focus, unfocus, setReveal, select, startEdit, created, expandAll:() => setAll(true), collapseAll:() => setAll(false),
    get focused(){ return focusId; }, has:id => index.has(id), refit(){ fitted = false; }};
}

Object.assign(A, {createMindMap});
})(JQA.app);
