/* Jornada QA — Minimapas: um mapa mental por área e mapas próprios, todos editáveis no próprio mapa. */
(function(A){
const {$, esc, ext, ico, uid, store, toast, copyBtn, done, stageOf, pBody, showPanel, closePanel, saveContent, snapshot, undo, COLORS, createMindMap} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const openPanel = (...a) => A.openPanel(...a);

/* tipos de ramo: nome padrão, cor e ícone. Ramos criados pela pessoa ganham uma cor da sequência. */
const RAMOS = {
  fund:  {t:"Fundamentos",   cor:"--e1", icon:"book"},
  est:   {t:"O que estudar", cor:"--e2", icon:"route"},
  ferr:  {t:"Ferramentas",   cor:"--e3", icon:"layers"},
  prat:  {t:"Onde praticar", cor:"--e4", icon:"target"},
  trilha:{t:"Na trilha",     cor:"--e5", icon:"map"}
};
const MINIS = () => A.C.minis;
const doneMini = new Set(store.get("jqa-minimapas", []));
const ramoInfo = (r, i) => ({...(RAMOS[r.k] || {t:"Ramo", cor:COLORS[(i || 0) % COLORS.length]}), ...(r.t ? {t:r.t} : {}), ...(r.cor ? {cor:r.cor} : {})});
const topicById = id => A.C.topics.find(t => t.id === id);
const flat = list => list.flatMap(it => [it, ...flat(it.filhos || [])]);
const miniStudy = m => m.ramos.filter(r => r.k !== "trilha").flatMap(r => flat(r.itens)).filter(it => !it.topico);
const miniCount = m => { const it = miniStudy(m); return {n:it.filter(i => doneMini.has(i.id)).length, tot:it.length}; };
const itemLabel = it => it.topico ? (topicById(it.topico)?.t || "Tópico removido") : it.t;
const itemTag = it => it.topico ? (stageOf(topicById(it.topico)?.s)?.name || "") : (it.tag || "");
let curMini = null, miniMode = store.get("jqa-mini-modo", null);

/* ---------- página inicial: áreas e mapas próprios ---------- */
function card(m){
  const c = miniCount(m), pct = c.tot ? Math.round(c.n / c.tot * 100) : 0;
  return `<a class="minicard" href="#minimapas/${esc(m.id)}">
    <span class="mi">${ico(m.icon || "grid")}</span>
    <b>${esc(m.t)}</b>
    ${m.d ? `<p>${esc(m.d)}</p>` : ""}
    <span class="mstats">${m.ramos.map((r, i) => { const ri = ramoInfo(r, i); return `<span><i style="background:var(${ri.cor})"></i>${r.itens.length} ${esc(ri.t.toLowerCase())}</span>`; }).join("")}</span>
    <span class="mbar"><i style="width:${pct}%"></i></span>
    <small>${c.n} de ${c.tot} itens estudados</small>
  </a>`;
}
function renderMiniHome(){
  const areas = MINIS().filter(m => !m.custom), meus = MINIS().filter(m => m.custom);
  $("#miniHome").innerHTML = `
    <p class="lead">Um mapa mental por área, para ir além da trilha, e os seus próprios mapas. Tudo se edita no mapa, como no XMind ou no MindMeister: clique num nó e use a barra que aparece, ou o teclado (Tab cria filho, Enter cria irmão, F2 edita, Delete exclui, Ctrl+Z desfaz).</p>
    <h3>Áreas</h3>
    <div class="minicards">${areas.map(card).join("")}
      <div class="minicard soon"><span class="mi">${ico("plus")}</span><b>Próximas áreas</b><p>Performance, Automação, API, IA para QA, Mobile, Dados e DevOps.</p></div>
    </div>
    <h3>Meus mapas</h3>
    <div class="minicards">${meus.map(card).join("")}
      <button class="minicard newmap" id="newMap"><span class="mi">${ico("plus")}</span><b>Novo mapa</b><p>Um mapa mental seu, do zero: um curso, um projeto, uma ferramenta que você está estudando.</p></button>
    </div>`;
  $("#newMap").onclick = () => {
    snapshot();
    const m = {id:uid("mapa"), t:"Novo mapa", icon:"grid", custom:true, d:"", ramos:[{id:uid("r"), t:"Ideia principal", itens:[]}]};
    A.C.minis.push(m); saveContent(); location.hash = "minimapas/" + m.id;
    setTimeout(() => { mmm.select(m.id); mmm.startEdit(m.id); }, 80);
  };
}

/* ---------- edição ---------- */
function mutate(fn){ snapshot(); const r = fn(); saveContent(); if(curMini){ miniProgress(curMini); renderMiniList(curMini); const t = (curMini.custom ? "Mapa: " : "Minimapa: ") + curMini.t; $("#pageTitle").textContent = t; document.title = t + " · Jornada QA"; } return r; }
const newItem = t => ({id:uid("i"), t:t || "Novo item"});
/* encontra um item (em qualquer nível) e a lista onde ele está */
function locate(m, id){
  const walk = list => { for(let i = 0; i < list.length; i++){ const it = list[i];
    if(it.id === id || (it.topico && m.id + ":t:" + it.topico === id)) return {arr:list, i, it};
    const f = it.filhos && walk(it.filhos); if(f) return f; } return null; };
  for(const r of m.ramos){ const f = walk(r.itens); if(f) return {...f, r}; }
  return null;
}
function moveItem(m, dragId, targetArr, at){
  const f = locate(m, dragId); if(!f) return;
  f.arr.splice(f.i, 1);
  targetArr.splice(at == null ? targetArr.length : Math.min(at, targetArr.length), 0, f.it);
}
function toggleTopicCheck(t, key){
  const set = new Set(A.checks[t.id] || []); set.has(key) ? set.delete(key) : set.add(key);
  if(set.size) A.checks[t.id] = [...set]; else delete A.checks[t.id];
  store.set("jqa-checklists", A.checks); refreshMini();
}
function toggleDone(it){ doneMini.has(it.id) ? doneMini.delete(it.id) : doneMini.add(it.id); store.set("jqa-minimapas", [...doneMini]); refreshMini(); }

/* ---------- árvore do mapa: área › ramos › itens (e subitens) › materiais ---------- */
function itemNode(m, r, arr, it, cor, i){
  const common = {
    sib:() => mutate(() => { const n = newItem(); arr.splice(i + 1, 0, n); return n.id; }),
    dragType:"item"
  };
  if(it.topico){
    const t = topicById(it.topico), id = m.id + ":t:" + it.topico;
    if(!t) return {...common, id, label:"Tópico removido", color:cor, dashed:true, del:() => mutate(() => { arr.splice(i, 1); })};
    const on = new Set(A.checks[t.id] || []);
    return {...common, id, label:t.t, tag:stageOf(t.s)?.name || "", color:cor, dashed:true, done:done.has(t.id),
      aria:`${t.t}, tópico da trilha`, openLabel:"Detalhes", onOpen:() => openPanel(t),
      del:() => mutate(() => { arr.splice(i, 1); }),
      children:(t.est || []).map((e, j) => ({id:id + "/e" + j, label:e, color:cor, check:on.has("e" + j),
        aria:e, onCheck:() => toggleTopicCheck(t, "e" + j), openLabel:on.has("e" + j) ? "Desmarcar" : "Marcar", onOpen:() => toggleTopicCheck(t, "e" + j)}))};
  }
  const numbered = r.k === "est" && arr === r.itens;
  return {...common, id:it.id, label:(numbered ? (i + 1) + ". " : "") + it.t, editValue:it.t, tag:it.tag || "", color:cor, done:doneMini.has(it.id),
    aria:`${it.t}${it.tag ? ", " + it.tag : ""}${doneMini.has(it.id) ? ", estudado" : ""}`, openLabel:"Detalhes", onOpen:() => openMiniItem(m, r, it),
    edit:v => mutate(() => { it.t = v; }),
    add:() => mutate(() => { const n = newItem(); (it.filhos = it.filhos || []).push(n); return n.id; }),
    del:() => { if((it.filhos || []).length && !confirm(`Excluir "${it.t}" e os ${it.filhos.length} itens dentro dele?`)) return false;
      mutate(() => { arr.splice(i, 1); flat([it]).forEach(x => doneMini.delete(x.id)); store.set("jqa-minimapas", [...doneMini]); }); },
    accepts:["item"], drop:n => mutate(() => moveItem(m, n.id, it.filhos = it.filhos || [])),
    children:[...(it.filhos || []).map((f, j) => itemNode(m, r, it.filhos, f, cor, j)),
      ...(it.l || []).map(([lab, url, nota], j) => ({id:it.id + "/l" + j, label:"↗ " + lab, editValue:lab, color:cor,
        aria:`${lab}${nota ? ": " + nota : ""}`, openLabel:url ? "Abrir link" : "Adicionar endereço",
        onOpen:() => url ? window.open(url, "_blank", "noopener") : editItem(m, r, it),
        edit:v => mutate(() => { it.l[j][0] = v; }),
        del:() => mutate(() => { it.l.splice(j, 1); })}))]};
}
function buildMini(){
  const m = curMini; if(!m) return {id:"vazio", label:""};
  return {id:m.id, label:m.t, editValue:m.t, icon:m.icon || "grid", aria:`${m.t}: sobre o mapa`, openLabel:"Sobre", onOpen:() => openMiniIntro(m),
    edit:v => mutate(() => { m.t = v; }),
    add:() => mutate(() => { const r = {id:uid("r"), t:"Novo ramo", itens:[]}; m.ramos.push(r); return r.id; }),
    del:() => deleteMap(m),
    children:m.ramos.map((r, ri) => { const inf = ramoInfo(r, ri);
      return {id:r.id, label:inf.t, editValue:inf.t, color:inf.cor, icon:inf.icon,
        tag:r.k === "trilha" ? String(r.itens.length) : `${flat(r.itens).filter(x => doneMini.has(x.id)).length}/${flat(r.itens).filter(x => !x.topico).length}`,
        edit:v => mutate(() => { r.t = v; }),
        add:() => mutate(() => { const n = newItem(); r.itens.push(n); return n.id; }),
        sib:() => mutate(() => { const n = {id:uid("r"), t:"Novo ramo", itens:[]}; m.ramos.splice(ri + 1, 0, n); return n.id; }),
        del:() => { if(r.itens.length && !confirm(`Excluir o ramo "${inf.t}" e os ${r.itens.length} itens dele?`)) return false;
          mutate(() => { m.ramos.splice(ri, 1); }); },
        accepts:["item"], drop:n => mutate(() => moveItem(m, n.id, r.itens)),
        children:r.itens.map((it, i) => itemNode(m, r, r.itens, it, inf.cor, i))}; })};
}
function deleteMap(m){
  if(!confirm(`Excluir o mapa "${m.t}" inteiro? Dá para desfazer com Ctrl+Z logo em seguida.`)) return false;
  mutate(() => {
    A.C.minis = A.C.minis.filter(x => x !== m);
    if(!m.custom) A.C.minisExcluidos = [...new Set([...(A.C.minisExcluidos || []), m.id])];
  });
  location.hash = "minimapas"; return false;
}
const mmm = createMindMap({svg:$("#msvg"), key:"minimapas", build:buildMini, focusBar:$("#mFocusBar"), undo,
  defaultOpen:n => n.depth === 1 && !matchMedia("(max-width:820px)").matches,
  controls:{zin:$("#mzin"), zout:$("#mzout"), fit:$("#mzfit"), expand:$("#mzexpand"), collapse:$("#mzcollapse")}});
function renderMiniMap(){
  mmm.render();
  $("#miniLegend").innerHTML = `<span><i class="hlk"></i>Já estudei</span><span><i class="trk"></i>Tópico da trilha</span>`;
}

/* ---------- lista ---------- */
function renderMiniList(m){
  const row = (r, ri, it, path, num) => { const isTrail = !!it.topico, on = isTrail ? done.has(it.topico) : doneMini.has(it.id), inf = ramoInfo(r, ri), sub = (it.filhos || []).length;
    return `<div class="item${on ? " done" : ""}"><span class="stripe" style="background:var(${inf.cor})"></span>
      <button class="open" data-mr="${ri}" data-mp="${path}"><span class="t"><span>${num ? num + ". " : ""}${esc(itemLabel(it))}</span></span>
      <span class="meta">${esc(itemTag(it))}${isTrail ? " · na trilha" : ""}${sub ? ` · ${sub} ${sub === 1 ? "subitem" : "subitens"}` : ""}</span>
      ${it.d || it.q ? `<span class="k">${esc((it.q || it.d).slice(0, 120))}${(it.q || it.d).length > 120 ? "…" : ""}</span>` : ""}</button>
      <span class="check" aria-hidden="true"></span></div>`; };
  $("#miniList").innerHTML = `
    <div class="miniintro"><span class="mi">${ico(m.icon || "grid")}</span><div><h2>${esc(m.t)}</h2>${m.d ? `<p>${esc(m.d)}</p>` : ""}</div></div>
    ${m.comeco || m.carreira ? `<dl class="facts mfacts"><div><dt>Por onde começar</dt><dd>${esc(m.comeco || "")}</dd></div><div><dt>Onde leva</dt><dd>${esc(m.carreira || "")}</dd></div></dl>` : ""}
    ${m.ramos.map((r, ri) => { const inf = ramoInfo(r, ri);
      return `<h3><i class="rdot" style="background:var(${inf.cor})"></i>${esc(inf.t)}</h3>
      <div class="items">${r.itens.map((it, i) => row(r, ri, it, String(i), r.k === "est" ? i + 1 : 0)
        + (it.filhos || []).map((f, j) => row(r, ri, f, i + "." + j, 0)).join("")).join("") || '<p class="muted">Nenhum item ainda. Crie pelo mapa.</p>'}</div>`; }).join("")}`;
}
$("#miniList").addEventListener("click", e => {
  const b = e.target.closest("[data-mr]"); if(!b || !curMini) return;
  const r = curMini.ramos[+b.dataset.mr]; let it = null, list = r.itens;
  b.dataset.mp.split(".").forEach(k => { it = list[+k]; list = it?.filhos || []; });
  if(it) openMiniItem(curMini, r, it);
});
function setMiniMode(mode){
  miniMode = mode; store.set("jqa-mini-modo", mode);
  document.querySelectorAll("#miniView [data-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === mode));
  $("#miniMapBox").hidden = mode !== "mapa"; $("#miniList").hidden = mode !== "lista";
  if(mode === "mapa") requestAnimationFrame(() => mmm.fit());
}
document.querySelectorAll("#miniView [data-mode]").forEach(b => b.onclick = () => setMiniMode(b.dataset.mode));
function miniProgress(m){ const c = miniCount(m); $("#miniProg").innerHTML = `<b>${esc(m.t)}</b><span>${c.n} de ${c.tot} estudados</span>`; }
function refreshMini(){
  if(!curMini) return; curMini = MINIS().find(x => x.id === curMini.id) || null; if(!curMini) return;
  miniProgress(curMini); renderMiniMap(); renderMiniList(curMini);
  const title = (curMini.custom ? "Mapa: " : "Minimapa: ") + curMini.t; $("#pageTitle").textContent = title; document.title = title + " · Jornada QA";
}

function openMini(id){
  const m = MINIS().find(x => x.id === id);
  $("#miniHome").hidden = !!m; $("#miniView").hidden = !m; curMini = m || null;
  if(!m){ renderMiniHome(); return "Minimapas"; }
  const changed = mmm._area !== m.id; mmm._area = m.id;
  if(changed){ mmm.unfocus(); mmm.refit(); }
  miniProgress(m); renderMiniMap(); renderMiniList(m);
  setMiniMode(miniMode || (matchMedia("(max-width:820px)").matches ? "lista" : "mapa"));
  return (m.custom ? "Mapa: " : "Minimapa: ") + m.t;
}

/* ---------- gaveta: sobre o mapa e detalhes do item ---------- */
function openMiniIntro(m){
  showPanel(m.custom ? "Meu mapa" : "Minimapa", null, m.t);
  pBody.innerHTML = `<div class="actions"><button class="btn" id="mEditIntro">${ico("pen")}Editar</button></div>
    ${m.d ? `<p style="margin:0">${esc(m.d)}</p>` : '<p class="muted" style="margin:0">Sem descrição ainda.</p>'}
    ${m.comeco ? `<section><h4>Por onde começar</h4><p class="practice">${esc(m.comeco)}</p></section>` : ""}
    ${m.carreira ? `<section><h4>Onde essa área leva</h4><p style="margin:0">${esc(m.carreira)}</p></section>` : ""}`;
  $("#mEditIntro").onclick = () => {
    pBody.innerHTML = `<form class="form" id="mIntroForm">
      <label>Nome<input class="in" name="t" value="${esc(m.t)}" required></label>
      <label>Descrição<textarea class="in" name="d" rows="3">${esc(m.d || "")}</textarea></label>
      <label>Por onde começar<textarea class="in" name="comeco" rows="3">${esc(m.comeco || "")}</textarea></label>
      <label>Onde leva<textarea class="in" name="carreira" rows="2">${esc(m.carreira || "")}</textarea></label>
      <div class="formfoot"><button type="button" class="btn ghost danger" id="mDelMap">${ico("trash")}Excluir mapa</button>
        <span class="right"><button type="button" class="btn" id="mCancel">Cancelar</button><button class="btn primary" type="submit">Salvar</button></span></div></form>`;
    const f = $("#mIntroForm");
    $("#mCancel").onclick = () => openMiniIntro(m);
    $("#mDelMap").onclick = () => { closePanel(); deleteMap(m); };
    f.onsubmit = e => { e.preventDefault(); mutate(() => Object.assign(m, {t:f.t.value.trim() || m.t, d:f.d.value.trim(), comeco:f.comeco.value.trim(), carreira:f.carreira.value.trim()}));
      refreshMini(); toast("Mapa salvo."); openMiniIntro(m); };
  };
  $("#pClose").focus();
}
function openMiniItem(m, r, it){
  if(it.topico){ const t = topicById(it.topico); if(t) openPanel(t); else toast("Esse tópico não existe mais na trilha."); return; }
  const inf = ramoInfo(r, m.ramos.indexOf(r)), on = doneMini.has(it.id);
  showPanel(`${m.t} · ${inf.t}`, inf.cor, it.t);
  pBody.innerHTML = `
    <div class="actions"><button class="btn${on ? "" : " primary"}" id="mDone" aria-pressed="${on}">${on ? "Estudado" : "Marcar como estudado"}</button>
      <button class="btn" id="mEdit">${ico("pen")}Editar</button></div>
    ${it.tag ? `<p style="margin:0"><span class="chip">${esc(it.tag)}</span></p>` : ""}
    ${it.d ? `<p style="margin:0">${esc(it.d)}</p>` : ""}
    ${it.q ? `<section><h4>Quando usar</h4><p style="margin:0">${esc(it.q)}</p></section>` : ""}
    ${it.l?.length ? `<section><h4>Materiais</h4><ul class="links mats">${it.l.map(([lab, url, nota]) => `<li>${ext(lab, url)}${nota ? `<small>${esc(nota)}</small>` : ""}</li>`).join("")}</ul></section>` : ""}
    ${it.x || it.lab ? `<section><h4>Pratique</h4>${it.x ? `<p class="practice">${esc(it.x)}</p>` : ""}
      ${it.lab ? `<p class="labhead">Comandos</p><div class="code lab">${copyBtn(it.lab)}<pre>${esc(it.lab)}</pre></div>` : ""}</section>` : ""}
    ${!it.d && !it.q && !it.l?.length && !it.x && !it.lab ? '<p class="muted" style="margin:0">Ainda sem detalhes. Use Editar para acrescentar explicação, materiais e prática.</p>' : ""}`;
  $("#mDone").onclick = () => { toggleDone(it); openMiniItem(m, r, it); };
  $("#mEdit").onclick = () => editItem(m, r, it);
  $("#pClose").focus();
}
function editItem(m, r, it){
  const inf = ramoInfo(r, m.ramos.indexOf(r));
  showPanel("Editando", inf.cor, it.t);
  const mats = (it.l || []).map(x => x.filter(Boolean).join(" | ")).join("\n");
  pBody.innerHTML = `<form class="form" id="mItemForm" novalidate>
    <div class="two"><label>Título<input class="in" name="t" value="${esc(it.t)}" required></label>
    <label>Etiqueta <span class="muted">nível, tipo…</span><input class="in" name="tag" value="${esc(it.tag || "")}"></label></div>
    <label>Explicação<textarea class="in" name="d" rows="3">${esc(it.d || "")}</textarea></label>
    <label>Quando usar <span class="muted">para ferramentas</span><textarea class="in" name="q" rows="2">${esc(it.q || "")}</textarea></label>
    <label>Materiais <span class="muted">um por linha: Texto | https://… | o que ler</span><textarea class="in mono" name="l" rows="4">${esc(mats)}</textarea></label>
    <p class="err" id="mErrL" hidden>Cada material precisa de um endereço que comece com http:// ou https://.</p>
    <label>Prática sugerida<textarea class="in" name="x" rows="2">${esc(it.x || "")}</textarea></label>
    <label>Comandos <span class="muted">aparecem com botão Copiar</span><textarea class="in mono" name="lab" rows="3">${esc(it.lab || "")}</textarea></label>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" id="mCancel">Cancelar</button><button class="btn primary" type="submit">Salvar</button></span></div></form>`;
  const f = $("#mItemForm"); f.t.focus();
  $("#mCancel").onclick = () => openMiniItem(m, r, it);
  f.onsubmit = e => {
    e.preventDefault();
    const l = f.l.value.split("\n").map(x => x.split("|").map(y => y.trim())).filter(x => x[0] || x[1]);
    if(l.some(x => !/^https?:\/\//i.test(x[1] || ""))){ $("#mErrL").hidden = false; return; }
    mutate(() => Object.assign(it, {t:f.t.value.trim() || it.t, tag:f.tag.value.trim(), d:f.d.value.trim(), q:f.q.value.trim(),
      l:l.map(x => x[2] ? [x[0] || x[1], x[1], x[2]] : [x[0] || x[1], x[1]]), x:f.x.value.trim(), lab:f.lab.value.replace(/\s+$/, "")}));
    refreshMini(); toast("Item salvo."); openMiniItem(m, r, it);
  };
}
function leaveMini(){ curMini = null; }

Object.assign(A, {openMini, refreshMini, leaveMini});
})(JQA.app);
