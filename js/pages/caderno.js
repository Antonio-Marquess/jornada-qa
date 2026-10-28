/* Jornada QA — Caderno de estudos: vários cadernos, cada um ligado a um assunto (minimapa, etapa, tópico ou livre).
 * Cada página aceita blocos: texto com formatação, checklist, link, imagem (cole com Ctrl+V), arquivo, código e destaque.
 * Também é aqui que mora a regra de conclusão: um tópico só conclui com uma parte mínima dos itens feita e uma anotação.
 * Texto e estrutura ficam em jqa-cadernos (localStorage); imagens e anexos, no IndexedDB (js/core/arquivos.js). */
(function(A){
const {$, esc, ico, uid, store, toast, done, showPanel, closePanel, pBody, files, shrinkImage, fmtSize, safeUrl, stageLabel} = A;

/* =====================================================================
   DADOS
   ===================================================================== */
let NB = store.get("jqa-cadernos", {cadernos:[]});
NB.cadernos = NB.cadernos || [];
const save = () => store.set("jqa-cadernos", NB);
let saveT = null;
const saveSoon = () => { clearTimeout(saveT); saveT = setTimeout(save, 450); };
const cads = () => NB.cadernos;
const findCad = id => cads().find(c => c.id === id);
const allPages = () => cads().flatMap(c => c.paginas.map(p => ({c, p})));
const pagesFor = (k, id) => allPages().filter(({p}) => p.ref && p.ref.k === k && p.ref.id === id);
const touch = (c, p) => { const t = Date.now(); if(p) p.at = t; c.at = t; };
const newBlock = k => ({id:uid("b"), k,
  ...(k === "texto" ? {html:""} : k === "check" ? {items:[{t:"", on:false}]} : k === "link" ? {t:"", url:""} : k === "code" ? {txt:""} : k === "nota" ? {tipo:"importante", txt:""} : {})});
const newPage = (t, sec, ref) => ({id:uid("pg"), t, sec:sec || "", ref:ref || null, tags:[], blocos:[newBlock("texto")], at:Date.now()});

/* texto puro de um bloco, para busca e para saber se a página tem anotação */
const strip = h => { const d = document.createElement("div"); d.innerHTML = h || ""; return d.textContent || ""; };
function blockText(b){
  switch(b.k){
    case "texto": return strip(b.html);
    case "check": return b.items.map(i => i.t).join(" ");
    case "link": return `${b.t || ""} ${b.url || ""}`;
    case "code": case "nota": return b.txt || "";
    case "img": return b.legenda || "imagem";
    case "arq": return b.nome || "arquivo";
  }
  return "";
}
const hasContent = p => p.blocos.some(b => blockText(b).trim());

/* =====================================================================
   REGRA DE CONCLUSÃO
   Um tópico da trilha (e um item de minimapa que tem subitens) só conclui quando
   a parte mínima dos itens dele está feita e, se a regra pedir, há uma anotação.
   ===================================================================== */
const REGRA = () => ({pct:85, nota:true, ...store.get("jqa-regra", {})});
function topicItems(t){
  const on = new Set(A.checks[t.id] || []);
  return [...t.est.map((x, i) => ({t:x, k:"e" + i, on:on.has("e" + i)})), ...t.cc.map((x, i) => ({t:x, k:"c" + i, on:on.has("c" + i)}))];
}
const hasNoteTopic = t => !!String(A.notes[t.id] || "").trim() || pagesFor("topic", t.id).some(({p}) => hasContent(p));
function verdict(items, temNota){
  const r = REGRA(), feitos = items.filter(i => i.on).length, total = items.length;
  const pct = total ? Math.round(feitos / total * 100) : 100, min = Math.ceil(total * r.pct / 100);
  const okPct = feitos >= min, okNota = !r.nota || temNota;
  return {ok:okPct && okNota, pct, feitos, total, min, falta:Math.max(0, min - feitos), semNota:!okNota, regra:r, faltam:items.filter(i => !i.on)};
}
const canCompleteTopic = t => verdict(topicItems(t), hasNoteTopic(t));
function miniItems(it){
  const M = A.mini; return M.flat(it.filhos || []).filter(x => !x.topico).map(x => ({t:x.t, id:x.id, on:M.doneMini.has(x.id)}));
}
function canCompleteMini(it){
  if(!(it.filhos || []).length) return {ok:true, pct:100, feitos:0, total:0, falta:0, semNota:false, faltam:[], regra:REGRA()};
  return {...verdict(miniItems(it), pagesFor("mini", it.id).some(({p}) => hasContent(p))), mini:true};
}
/* frase curta do que falta, para avisos */
function whyNot(v){
  const parts = [];
  if(v.falta) parts.push(`marque mais ${v.falta} ${v.falta === 1 ? "item" : "itens"} (${v.regra.pct}% de ${v.total})`);
  if(v.semNota) parts.push(v.mini ? "escreva uma anotação na página dele no caderno" : "escreva uma anotação no caderno ou nas anotações do tópico");
  return parts.length ? "Para concluir, " + parts.join(" e ") + "." : "";
}

/* =====================================================================
   NAVEGAÇÃO: #caderno, #caderno/<caderno>, #caderno/<caderno>/<página>
   ===================================================================== */
const root = $("#nbRoot");
let curC = null, curP = null, query = "", urls = [];
function openCaderno(parts){
  const [cid, pid] = parts || [];
  urls.forEach(u => URL.revokeObjectURL(u)); urls = [];
  curC = cid ? findCad(cid) : null;
  if(!curC){ curP = null; renderHome(); return "Caderno de estudos"; }
  curP = curC.paginas.find(p => p.id === pid) || curC.paginas[0] || null;
  renderCad();
  return curC.t;
}
const go = (c, p) => { location.hash = "caderno" + (c ? "/" + c.id + (p ? "/" + p.id : "") : ""); };

/* ---------- início do caderno: lista, busca e regra ---------- */
const TIPOS = {guia:["spark", "Guia pronto"], mini:["grid", "Minimapa"], etapa:["route", "Etapa da trilha"], topico:["book", "Tópico"], trilha:["route", "Tópicos da trilha"], livre:["pen", "Livre"]};
function progOf(c){
  const linked = c.paginas.filter(p => p.ref);
  const isDone = p => p.ref.k === "topic" ? done.has(p.ref.id) : A.mini.doneMini.has(p.ref.id);
  return {n:linked.filter(isDone).length, t:linked.length};
}
const fmtDate = t => t ? new Date(t).toLocaleDateString("pt-BR", {day:"2-digit", month:"2-digit"}) : "";
function renderHome(){
  const r = REGRA();
  root.innerHTML = `<div class="page nbhome">
    <p class="lead">Seus cadernos de estudo. Cada caderno segue um assunto e tem uma página por tópico, com texto, checklists, links, imagens, arquivos e código. É aqui que você registra o que entendeu; a trilha só diz o que estudar.</p>
    <div class="nbbar">
      <label class="search nbsearch">${ico("search")}<input id="nbQ" type="search" placeholder="Buscar em todos os cadernos" value="${esc(query)}" aria-label="Buscar em todos os cadernos"></label>
      <button class="btn primary" id="nbNew">${ico("plus")}Novo caderno</button>
    </div>
    <div id="nbRes"></div>
    <div class="nbcards" id="nbCards">${cads().length ? cads().slice().sort((a, b) => (b.at || 0) - (a.at || 0)).map(card).join("")
      : `<div class="nbempty">${ico("notebook")}<b>Nenhum caderno ainda</b><span class="muted">Crie o primeiro em <b>Novo caderno</b>: escolha um minimapa, uma etapa, um tópico ou um assunto livre.</span></div>`}</div>
    <p class="nbrule">${ico("check")}<span><b>Regra para concluir um tópico:</b> pelo menos ${r.pct}% dos itens dele marcados${r.nota ? " e uma anotação escrita" : ""}.</span><button class="btn sm ghost" id="nbRule">Mudar</button></p>
  </div>`;
  if(query) search();
}
function card(c){
  const [ic, lab] = TIPOS[c.tipo] || TIPOS.livre, pr = progOf(c), pct = pr.t ? Math.round(pr.n / pr.t * 100) : 0;
  return `<div class="nbcardw"><a class="nbcard" href="#caderno/${esc(c.id)}">
    <span class="nbci">${ico(ic)}</span><b>${esc(c.t)}</b><span class="muted">${lab}${c.assunto ? " · " + esc(c.assunto) : ""}</span>
    ${pr.t ? `<span class="nbbarx"><i style="width:${pct}%"></i></span><small>${pr.n} de ${pr.t} concluídos · ${c.paginas.length} páginas</small>` : `<small>${c.paginas.length} ${c.paginas.length === 1 ? "página" : "páginas"}</small>`}
    <small class="muted">Atualizado em ${fmtDate(c.at)}</small></a>
    <span class="nbcardtools"><button class="nbx" data-cedit="${esc(c.id)}" aria-label="Renomear ${esc(c.t)}" title="Renomear">${ico("pen")}</button><button class="nbx" data-cdelc="${esc(c.id)}" aria-label="Excluir ${esc(c.t)}" title="Excluir">${ico("trash")}</button></span></div>`;
}
/* excluir um caderno: páginas, imagens e arquivos */
async function deleteCad(c){
  if(!await A.ask(`Excluir o caderno "${c.t}"? Todas as páginas, imagens e arquivos dele serão apagados. Não dá para desfazer.`)) return false;
  c.paginas.forEach(p => p.blocos.forEach(x => x.fid && files.del(x.fid)));
  NB.cadernos = cads().filter(x => x !== c); save(); toast("Caderno excluído."); return true;
}
function search(){
  const q = query.trim().toLowerCase(), box = $("#nbRes"); if(!box) return;
  if(!q){ box.innerHTML = ""; $("#nbCards").hidden = false; return; }
  const hits = allPages().filter(({p}) => `${p.t} ${(p.tags || []).join(" ")} ${p.blocos.map(blockText).join(" ")}`.toLowerCase().includes(q)).slice(0, 40);
  $("#nbCards").hidden = true;
  box.innerHTML = `<p class="muted">${hits.length} ${hits.length === 1 ? "página encontrada" : "páginas encontradas"}</p><div class="nbhits">${hits.map(({c, p}) => {
    const txt = p.blocos.map(blockText).join(" · "), i = txt.toLowerCase().indexOf(q), snip = i >= 0 ? (i > 40 ? "…" : "") + txt.slice(Math.max(0, i - 40), i + 80) + "…" : "";
    return `<a class="nbhit" href="#caderno/${esc(c.id)}/${esc(p.id)}"><b>${esc(p.t)}</b><span class="muted">${esc(c.t)}${p.tags?.length ? " · " + esc(p.tags.join(", ")) : ""}</span>${snip ? `<small>${esc(snip)}</small>` : ""}</a>`; }).join("")}</div>`;
}

/* ---------- criar caderno ---------- */
function openNew(){
  const minis = A.C.minis || [], tr = A.trail();
  showPanel("Caderno de estudos", null, "Novo caderno");
  pBody.innerHTML = `<form class="form" id="nbForm" novalidate>
    <fieldset><legend>O que você vai estudar</legend>
      ${minis.length ? `<label class="checkline"><input type="radio" name="tipo" value="mini" checked> Um minimapa</label>` : ""}
      <label class="checkline"><input type="radio" name="tipo" value="etapa"${minis.length ? "" : " checked"}> Uma etapa da trilha</label>
      <label class="checkline"><input type="radio" name="tipo" value="topico"> Um tópico da trilha</label>
      <label class="checkline"><input type="radio" name="tipo" value="livre"> Assunto livre (curso, livro, ferramenta)</label>
      ${A.area().conteudo && A.J.IA ? `<label class="checkline"><input type="radio" name="tipo" value="guia"> Guia pronto: IA para ${esc(A.area().nome)}</label>` : ""}
    </fieldset>
    <label data-for="mini"${minis.length ? "" : " hidden"}>Minimapa<select class="in" name="mini">${minis.map(m => `<option value="${esc(m.id)}">${esc(m.t)}</option>`).join("")}</select></label>
    <label data-for="etapa" hidden>Etapa<select class="in" name="etapa">${tr.stages.map(s => `<option value="${esc(s.id)}">${esc(stageLabel(s))}</option>`).join("")}</select></label>
    <label data-for="topico" hidden>Tópico<select class="in" name="topico">${tr.stages.map(s => `<optgroup label="${esc(stageLabel(s))}">${A.topicsOf(s).map(t => `<option value="${esc(t.id)}">${esc(t.t)}</option>`).join("")}</optgroup>`).join("")}</select></label>
    <label>Nome do caderno <span class="muted">opcional; sem nome, usa o do assunto</span><input class="in" name="t" placeholder="Ex.: Segurança para QA, Curso de Cypress"></label>
    <p class="muted" style="margin:0">O caderno já vem com uma página para cada tópico ou item do assunto. Dá para acrescentar páginas suas depois.</p>
    <div class="formfoot"><span></span><span class="right"><button class="btn primary" type="submit">${ico("plus")}Criar caderno</button></span></div></form>`;
  const f = $("#nbForm");
  const sync = () => f.querySelectorAll("[data-for]").forEach(l => l.hidden = l.dataset.for !== f.tipo.value);
  f.addEventListener("change", sync); sync();
  f.onsubmit = async e => {
    e.preventDefault();
    const tipo = f.tipo.value; let c;
    if(tipo === "mini"){
      const ja = cads().find(x => x.tipo === "mini" && x.ref === f.mini.value);
      if(ja && !await A.ask(`Você já tem o caderno "${ja.t}" deste minimapa. Criar outro mesmo assim?`, {ok:"Criar outro"})){ closePanel(); go(ja); return; }
      c = fromMini(minis.find(m => m.id === f.mini.value));
    }
    else if(tipo === "etapa"){ const s = tr.stages.find(x => x.id === f.etapa.value); c = {tipo, assunto:stageLabel(s), t:s.name, paginas:A.topicsOf(s).map(t => newPage(t.t, s.name, {k:"topic", id:t.id}))}; }
    else if(tipo === "topico"){ const t = A.findTopic(f.topico.value), s = A.stageIn(t); c = {tipo, assunto:stageLabel(s), t:t.t, paginas:[newPage(t.t, s?.name, {k:"topic", id:t.id})]}; }
    else if(tipo === "guia") c = fromGuia();
    else c = {tipo:"livre", assunto:"", t:"Novo caderno", paginas:[newPage("Primeira página", "")]};
    if(f.t.value.trim()) c.t = f.t.value.trim();
    if(!c.paginas.length) c.paginas.push(newPage("Primeira página", ""));
    c = {id:uid("cd"), at:Date.now(), ...c};
    cads().push(c); save(); closePanel(); go(c, c.paginas[0]); toast("Caderno criado.");
  };
}
function fromMini(m){
  const pages = [];
  m.ramos.forEach((r, i) => { const sec = A.mini.ramoInfo(r, i).t;
    r.itens.forEach(it => {
      if(it.topico){ const t = A.findTopic(it.topico); if(t) pages.push(newPage(t.t, sec, {k:"topic", id:t.id})); }
      else pages.push(newPage(it.t, sec, {k:"mini", id:it.id, m:m.id}));
    }); });
  return {tipo:"mini", ref:m.id, assunto:m.t, t:m.t, paginas:pages};
}

/* ---------- guia pronto: IA para QA ----------
 * O conteúdo de IA da jornada (data/qa/ia.js) vira um caderno já preenchido: dá para editar, anotar,
 * marcar os exercícios e acrescentar páginas. Entra uma vez em cada navegador; quem excluir recria em Novo caderno. */
const B = (k, o) => ({id:uid("b"), k, ...o});
const txt = html => B("texto", {html});
const ul = (xs, tag = "ul") => `<${tag}>${xs.map(x => `<li>${x}</li>`).join("")}</${tag}>`;
function fromGuia(){
  const IA = A.J.IA; if(!IA) return null;
  const m = IA.mcp, a = IA.agentes, ex = A.doneEx || new Set();
  const pg = (t, sec, blocos) => ({...newPage(t, sec), blocos});
  const paginas = [
    pg("Comece aqui", "Guia", [txt(`<p>${esc(IA.intro)}</p>`),
      B("nota", {tipo:"dica", txt:"Os prompts prontos para cada tarefa estão na aba Prompts, em Recursos. Este caderno é seu: edite, acrescente o que aprender e anote o que funcionou no seu dia a dia."})]),
    pg("Onde a IA ajuda e onde ter cuidado", "Guia", IA.tarefas.flatMap(t => [
      txt(`<h4>${esc(t.t)}</h4><p>${esc(t.como)}</p>`), B("nota", {tipo:"importante", txt:t.cuidado})])),
    pg("MCP: dando contexto real ao assistente", "MCP", [txt(`<p>${esc(m.oque)}</p>${ul(m.partes.map(x => `<b>${esc(x.t)}:</b> ${esc(x.d)}`), "ol")}`)]),
    pg("Servidores MCP úteis para QA", "MCP", m.servidores.flatMap(x => [
      B("link", {t:x.t, url:x.url}), txt(`<p>${esc(x.faz)}</p><p><b>Peça assim:</b> <i>${esc(x.pedido)}</i></p>`), B("nota", {tipo:"importante", txt:x.cuidado})])),
    pg("Como configurar um servidor MCP", "MCP", [B("code", {txt:m.config}), txt(`<p>${esc(m.configNota)}</p>`),
      ...m.links.map(([t, url]) => B("link", {t, url}))]),
    pg("Agentes de teste do Playwright", "Agentes", [txt(`<p>${esc(a.oque)}</p>${ul(a.passos.map(x => `<b>${esc(x.t)}:</b> ${esc(x.d)}`), "ol")}`),
      B("code", {txt:a.cmd}), txt(`<p>${esc(a.cmdNota)}</p>`), B("link", {t:a.link[0], url:a.link[1]})]),
    pg("Uma história do começo ao fim, com IA", "Na prática", [txt(ul(IA.fluxo.map(x => `<b>${esc(x.t)}:</b> ${esc(x.d)}`), "ol"))]),
    pg("Regras de ouro", "Na prática", [txt(ul(IA.regras.map(esc)))]),
    pg("Exercícios", "Na prática", [B("check", {items:IA.exercicios.map((t, i) => ({t, on:ex.has(i)}))})])
  ];
  return {tipo:"guia", ref:"ia", assunto:"IA", t:`IA para ${A.area().nome}`, paginas};
}
function seedGuia(){
  if(!A.area().conteudo || !A.J.IA || store.get("jqa-guia-ia", false)) return;
  const c = fromGuia(); if(!c) return;
  cads().push({id:uid("cd"), at:Date.now(), ...c}); save(); store.set("jqa-guia-ia", true);
}
/* o endereço antigo (#ia) abre o guia */
function openGuia(){ seedGuia(); const c = cads().find(x => x.tipo === "guia"); return c ? c.id : ""; }
seedGuia();
/* "Anotar no caderno" a partir de um tópico ou item: abre a página que já existe ou cria uma */
function noteFor(k, id){
  const found = pagesFor(k, id)[0];
  if(found){ closePanel(); go(found.c, found.p); return; }
  let c, p;
  if(k === "topic"){
    const t = A.findTopic(id), s = A.stageIn(t);
    c = cads().find(x => x.tipo === "trilha") || (cads().push({id:uid("cd"), tipo:"trilha", assunto:"", t:"Caderno da trilha", paginas:[], at:Date.now()}), cads()[cads().length - 1]);
    p = newPage(t.t, s?.name, {k:"topic", id}); c.paginas.push(p);
  } else {
    const {m, it} = A.mini.find(id) || {};
    if(!it){ toast("Esse item não existe mais."); return; }
    c = cads().find(x => x.tipo === "mini" && x.ref === m.id);
    if(!c){ c = {id:uid("cd"), at:Date.now(), ...fromMini(m)}; cads().push(c); }
    p = c.paginas.find(x => x.ref?.id === id);
    if(!p){ p = newPage(it.t, "", {k:"mini", id, m:m.id}); c.paginas.push(p); }
  }
  touch(c, p); save(); closePanel(); go(c, p);
}

/* =====================================================================
   DENTRO DO CADERNO
   ===================================================================== */
function pageState(p){
  if(!p.ref) return hasContent(p) ? "nota" : "";
  const d = p.ref.k === "topic" ? done.has(p.ref.id) : A.mini.doneMini.has(p.ref.id);
  return d ? "feito" : hasContent(p) ? "nota" : "";
}
function renderCad(){
  const c = curC, pr = progOf(c), [ic, lab] = TIPOS[c.tipo] || TIPOS.livre;
  const secs = []; c.paginas.forEach(p => { const s = p.sec || ""; let g = secs.find(x => x.s === s); if(!g){ g = {s, ps:[]}; secs.push(g); } g.ps.push(p); });
  root.innerHTML = `<div class="nb">
    <aside class="nbside">
      <a class="btn sm ghost nbbackc" href="#caderno">${ico("back")}Cadernos</a>
      <div class="nbhead"><span class="nbci">${ico(ic)}</span><div><b>${esc(c.t)}</b><small class="muted">${lab}${c.assunto ? " · " + esc(c.assunto) : ""}</small></div>
        <button class="iconbtn" id="nbSet" aria-label="Configurar caderno" title="Configurar caderno">${ico("pen")}</button></div>
      ${pr.t ? `<div class="nbprog"><span class="nbbarx"><i style="width:${Math.round(pr.n / pr.t * 100)}%"></i></span><small>${pr.n} de ${pr.t} concluídos</small></div>` : ""}
      <nav class="nbpages" aria-label="Páginas">${secs.map(g => `${g.s ? `<span class="nbsec">${esc(g.s)}</span>` : ""}${g.ps.map(p => { const st = pageState(p);
        return `<a class="nbp${p === curP ? " on" : ""}" href="#caderno/${esc(c.id)}/${esc(p.id)}"${p === curP ? ' aria-current="page"' : ""}><i class="nbdot ${st}" aria-hidden="true">${st === "feito" ? ico("check") : ""}</i><span>${esc(p.t || "Sem título")}</span></a>`; }).join("")}`).join("")}</nav>
      <button class="btn sm" id="nbAddPage">${ico("plus")}Nova página</button>
    </aside>
    <main class="nbpage" id="nbPage">${curP ? pageHTML(curP) : `<p class="muted">Este caderno não tem páginas.</p>`}</main>
  </div>`;
  if(curP){ afterPage(); lastNote = hasContent(curP); }
}
function pageHTML(p){
  return `
    <header class="nbph">
      <input class="nbtitle" id="nbTitle" value="${esc(p.t)}" aria-label="Título da página" placeholder="Título da página">
      <div class="nbmeta"><span class="muted">${p.sec ? esc(p.sec) + " · " : ""}Atualizada em ${fmtDate(p.at)}</span>
        <input class="in nbtags" id="nbTags" value="${esc((p.tags || []).join(", "))}" placeholder="Etiquetas: dúvida, revisar…" aria-label="Etiquetas, separadas por vírgula">
        <button class="btn sm ghost danger" id="nbDelPage">${ico("trash")}Excluir página</button></div>
    </header>
    ${p.ref ? gateHTML(p) : ""}
    <div class="nbblocks" id="nbBlocks">${p.blocos.map(blockHTML).join("")}</div>
    <div class="nbadd" role="group" aria-label="Adicionar bloco"><span class="muted">Adicionar</span>
      ${[["texto","Texto","pen"],["check","Checklist","check"],["link","Link","link"],["img","Imagem","image"],["arq","Arquivo","file"],["code","Código","code"],["nota","Destaque","flag"]].map(([k, l, i]) => `<button class="btn sm" data-addb="${k}">${ico(i)}${l}</button>`).join("")}</div>
    <p class="muted nbhint">Cole imagens com Ctrl+V ou arraste arquivos para a página.</p>
    <input type="file" id="nbFile" hidden multiple>`;
}

/* ---------- progresso do assunto da página, com a regra ---------- */
function gateHTML(p){
  if(p.ref.k === "topic"){
    const t = A.findTopic(p.ref.id); if(!t) return `<section class="nbgate"><p class="muted">O tópico ligado a esta página não existe mais na trilha.</p></section>`;
    const v = canCompleteTopic(t), isDone = done.has(t.id), items = topicItems(t);
    return gateBox({isDone, v, title:"Progresso do tópico", list:items.map(i => `<li><label><input type="checkbox" data-gk="${i.k}"${i.on ? " checked" : ""}><span>${esc(i.t)}${i.k[0] === "c" ? ' <small class="muted">pronto quando</small>' : ""}</span></label></li>`).join(""),
      links:`<button class="btn sm" data-gopen="${esc(t.id)}">${ico("info")}Abrir tópico</button><button class="btn sm" data-gmap="${esc(t.id)}">${ico("map")}Ver no mapa</button>`});
  }
  const f = A.mini.find(p.ref.id); if(!f) return `<section class="nbgate"><p class="muted">O item ligado a esta página não existe mais no minimapa.</p></section>`;
  const it = f.it, v = canCompleteMini(it), isDone = A.mini.doneMini.has(it.id);
  return gateBox({isDone, v, title:(it.filhos || []).length ? "Progresso do item" : "Item do minimapa",
    list:miniItems(it).map(i => `<li><label><input type="checkbox" data-gm="${esc(i.id)}"${i.on ? " checked" : ""}><span>${esc(i.t)}</span></label></li>`).join(""),
    links:`<a class="btn sm" href="#minimapas/${esc(f.m.id)}">${ico("grid")}Abrir minimapa</a>`});
}
function gateBox({isDone, v, title, list, links}){
  const st = isDone ? "feito" : v.ok ? "pode" : "";
  return `<section class="nbgate ${st}">
    <div class="nbgh"><b>${title}</b>${v.total ? `<span>${v.pct}%</span>` : ""}</div>
    ${v.total ? `<span class="nbbarx big"><i style="width:${v.pct}%"></i><em style="left:${v.regra.pct}%" title="Mínimo para concluir: ${v.regra.pct}%"></em></span>` : ""}
    ${list ? `<ul class="nbgl">${list}</ul>` : ""}
    <p class="nbgs">${isDone ? `${ico("check")}Concluído.` : v.ok ? "Pronto para concluir." : esc(whyNot(v))}</p>
    <div class="nbgb">${isDone ? `<button class="btn sm" data-gdone="0">Desmarcar conclusão</button>` : `<button class="btn sm primary" data-gdone="1"${v.ok ? "" : ' aria-disabled="true"'}>Marcar como concluído</button>`}${links}</div>
  </section>`;
}

/* ---------- blocos ---------- */
const TOOLS = b => `<div class="nbtools"><button data-bup="${b.id}" aria-label="Subir bloco" title="Subir">${ico("back")}</button><button data-bdown="${b.id}" aria-label="Descer bloco" title="Descer">${ico("back")}</button><button data-bdel="${b.id}" aria-label="Excluir bloco" title="Excluir">${ico("trash")}</button></div>`;
const NOTAS = {importante:"Importante", duvida:"Dúvida", entrevista:"Caiu na entrevista", dica:"Dica"};
function blockHTML(b){
  const head = `<div class="nbb nb-${b.k}" data-b="${b.id}">${TOOLS(b)}`;
  switch(b.k){
    case "texto": return `${head}<div class="nbfmt" role="toolbar" aria-label="Formatação">
        <button data-cmd="bold" title="Negrito (Ctrl+B)"><b>B</b></button><button data-cmd="italic" title="Itálico (Ctrl+I)"><i>I</i></button>
        <button data-cmd="h3" title="Título">T</button><button data-cmd="insertUnorderedList" title="Lista">•</button><button data-cmd="insertOrderedList" title="Lista numerada">1.</button>
        <button data-cmd="quote" title="Citação">“</button><button data-cmd="code" title="Código no texto">&lt;/&gt;</button><button data-cmd="link" title="Link">${ico("link")}</button></div>
      <div class="nbrich" contenteditable="true" data-f="html" data-ph="Escreva o que entendeu, com suas palavras…">${clean(b.html)}</div></div>`;
    case "check": return `${head}<ul class="nbcheck">${b.items.map((it, i) => `<li><input type="checkbox" data-ci="${i}"${it.on ? " checked" : ""} aria-label="Feito"><textarea class="nbci2" data-ct="${i}" rows="1" placeholder="Item">${esc(it.t)}</textarea><button class="nbx" data-cdel="${i}" aria-label="Remover item">${ico("x")}</button></li>`).join("")}</ul>
      <button class="btn sm ghost" data-cadd>${ico("plus")}Item</button></div>`;
    case "link": { const u = safeUrl(b.url);
      return `${head}<div class="nblink">${ico("link")}<div><input data-f="t" value="${esc(b.t)}" placeholder="Título do link" aria-label="Título do link"><input data-f="url" value="${esc(b.url)}" placeholder="https://…" aria-label="Endereço"></div>
      ${u ? `<a class="btn sm" href="${esc(u)}" target="_blank" rel="noopener">Abrir ↗</a>` : ""}</div></div>`; }
    case "img": return `${head}<figure class="nbimg"><img data-fid="${esc(b.fid)}" alt="${esc(b.legenda || b.nome || "Imagem")}"><figcaption><input data-f="legenda" value="${esc(b.legenda || "")}" placeholder="Legenda (opcional)" aria-label="Legenda"></figcaption></figure></div>`;
    case "arq": return `${head}<div class="nbfile">${ico("file")}<div><b>${esc(b.nome)}</b><small class="muted">${esc(fmtSize(b.tam || 0))}</small></div><button class="btn sm" data-fopen="${esc(b.fid)}" data-fname="${esc(b.nome)}">Abrir</button></div></div>`;
    case "code": return `${head}<div class="nbcode"><textarea data-f="txt" spellcheck="false" placeholder="Cole ou escreva código, comandos, consultas…" aria-label="Código">${esc(b.txt)}</textarea><button class="copy" data-copy="${esc(b.txt)}">Copiar</button></div></div>`;
    case "nota": return `${head}<div class="nbcall" data-tipo="${esc(b.tipo)}"><select data-f="tipo" aria-label="Tipo de destaque">${Object.entries(NOTAS).map(([k, l]) => `<option value="${k}"${k === b.tipo ? " selected" : ""}>${l}</option>`).join("")}</select>
      <textarea data-f="txt" rows="2" placeholder="O que não pode esquecer…" aria-label="Texto do destaque">${esc(b.txt)}</textarea></div></div>`;
  }
  return "";
}

/* itens de checklist com texto longo quebram linha em vez de cortar */
const growAll = () => root.querySelectorAll("textarea.nbci2").forEach(grow);
new MutationObserver(() => requestAnimationFrame(growAll)).observe(root, {childList:true, subtree:true});
window.addEventListener("resize", () => { if(A.curTab === "caderno") growAll(); });

/* texto formatado: só as marcações simples passam; o resto vira texto */
const OK_TAGS = new Set(["B","STRONG","I","EM","U","S","P","BR","DIV","UL","OL","LI","H3","H4","CODE","PRE","BLOCKQUOTE","A","SPAN"]);
function clean(html){
  const t = document.createElement("template"); t.innerHTML = html || "";
  const walk = n => [...n.childNodes].forEach(c => {
    if(c.nodeType === 3) return;
    if(c.nodeType !== 1){ c.remove(); return; }
    if(!OK_TAGS.has(c.tagName)){
      if(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","SVG","MATH","TEMPLATE","IMG","VIDEO","AUDIO"].includes(c.tagName)) c.remove();
      else { walk(c); c.replaceWith(...c.childNodes); }
      return;
    }
    [...c.attributes].forEach(a => { if(!(c.tagName === "A" && a.name === "href" && safeUrl(a.value))) c.removeAttribute(a.name); });
    if(c.tagName === "A"){ c.setAttribute("target", "_blank"); c.setAttribute("rel", "noopener"); }
    walk(c);
  });
  walk(t.content); return t.innerHTML;
}

/* depois de desenhar a página: imagens do IndexedDB e altura dos campos */
function afterPage(){
  root.querySelectorAll("img[data-fid]").forEach(async img => {
    try{ const r = await files.get(img.dataset.fid); if(!r) throw 0; const u = URL.createObjectURL(r.blob); urls.push(u); img.src = u; }
    catch(e){ img.replaceWith(Object.assign(document.createElement("p"), {className:"muted", textContent:"Imagem não encontrada neste navegador."})); }
  });
  root.querySelectorAll(".nbpage textarea").forEach(grow);
}
const grow = ta => { ta.style.height = "auto"; ta.style.height = (ta.scrollHeight + 2) + "px"; };
const blockOf = el => { const d = el.closest("[data-b]"); return d ? curP.blocos.find(b => b.id === d.dataset.b) : null; };
function changed(){ touch(curC, curP); saveSoon(); }
function rerenderPage(focusId){
  const y = $("#v-caderno").scrollTop;
  renderCad(); $("#v-caderno").scrollTop = y;
  if(focusId) requestAnimationFrame(() => { const el = root.querySelector(`[data-b="${focusId}"] [contenteditable], [data-b="${focusId}"] input, [data-b="${focusId}"] textarea`); el?.focus(); });
}
function addBlock(b, after){
  const list = curP.blocos, i = after ? list.indexOf(after) : -1;
  list.splice(i < 0 ? list.length : i + 1, 0, b); touch(curC, curP); save(); rerenderPage(b.id);
}
async function addFiles(fileList, after){
  for(const f of fileList){
    try{
      const isImg = /^image\//.test(f.type), blob = isImg ? await shrinkImage(f) : f;
      if(blob.size > 25 * 1024 * 1024){ toast(`"${f.name}" passa de 25 MB. Guarde o link em vez do arquivo.`); continue; }
      const fid = await files.put(blob, {name:f.name || "imagem"});
      addBlock(isImg ? {id:uid("b"), k:"img", fid, nome:f.name || "imagem", legenda:""} : {id:uid("b"), k:"arq", fid, nome:f.name, tam:blob.size, tipo:blob.type}, after);
    }catch(e){ toast("Não foi possível guardar o arquivo neste navegador."); }
  }
}

/* ---------- eventos ---------- */
root.addEventListener("input", e => {
  if(!curP) return;
  const el = e.target;
  if(el.id === "nbQ"){ query = el.value; search(); return; }
  if(el.id === "nbTitle"){ curP.t = el.value; changed(); const a = root.querySelector(".nbp.on span"); if(a) a.textContent = el.value || "Sem título"; return; }
  if(el.id === "nbTags"){ curP.tags = el.value.split(",").map(x => x.trim()).filter(Boolean); changed(); return; }
  const b = blockOf(el); if(!b) return;
  if(el.dataset.f === "html") b.html = clean(el.innerHTML);
  else if(el.dataset.f){ b[el.dataset.f] = el.value; if(b.k === "nota" && el.dataset.f === "tipo") el.closest(".nbcall").dataset.tipo = el.value; if(b.k === "code") el.nextElementSibling.dataset.copy = el.value; }
  else if(el.dataset.ct != null){ b.items[+el.dataset.ct].t = el.value.replace(/\n/g, " "); grow(el); }
  if(el.tagName === "TEXTAREA") grow(el);
  changed(); refreshGate();
});
/* escrever a primeira anotação pode liberar a conclusão: atualiza só o quadro de progresso e a bolinha da página */
let lastNote = null;
function refreshGate(){
  const has = hasContent(curP); if(has === lastNote) return; lastNote = has;
  const g = root.querySelector(".nbgate"); if(g && curP.ref) g.outerHTML = gateHTML(curP);
  const dot = root.querySelector(".nbp.on .nbdot"); if(dot){ const st = pageState(curP); dot.className = "nbdot " + st; dot.innerHTML = st === "feito" ? ico("check") : ""; }
}
root.addEventListener("input", e => { if(!curP && e.target.id === "nbQ"){ query = e.target.value; search(); } });
root.addEventListener("change", e => {
  const el = e.target; if(!curP) return;
  if(el.dataset.ci != null){ const b = blockOf(el); b.items[+el.dataset.ci].on = el.checked; changed(); return; }
  if(el.dataset.gk){ const t = A.findTopic(curP.ref.id), set = new Set(A.checks[t.id] || []); el.checked ? set.add(el.dataset.gk) : set.delete(el.dataset.gk);
    if(set.size) A.checks[t.id] = [...set]; else delete A.checks[t.id]; store.set("jqa-checklists", A.checks); A.renderMap?.(); rerenderPage(); return; }
  if(el.dataset.gm){ A.mini.setDone(el.dataset.gm, el.checked); rerenderPage(); return; }
  if(el.id === "nbFile"){ addFiles([...el.files]); el.value = ""; }
});
root.addEventListener("keydown", e => {
  const el = e.target;
  if(el.dataset?.ct != null && e.key === "Enter"){ e.preventDefault(); const b = blockOf(el), i = +el.dataset.ct; b.items.splice(i + 1, 0, {t:"", on:false}); changed(); save(); rerenderPage();
    requestAnimationFrame(() => root.querySelector(`[data-b="${b.id}"] [data-ct="${i + 1}"]`)?.focus()); }
  if(el.dataset?.ct != null && e.key === "Backspace" && !el.value){ const b = blockOf(el), i = +el.dataset.ct; if(b.items.length > 1){ e.preventDefault(); b.items.splice(i, 1); changed(); save(); rerenderPage();
    requestAnimationFrame(() => root.querySelector(`[data-b="${b.id}"] [data-ct="${Math.max(0, i - 1)}"]`)?.focus()); } }
});
/* botões de formatação: não tiram o foco do texto */
root.addEventListener("mousedown", e => { if(e.target.closest(".nbfmt button")) e.preventDefault(); });
root.addEventListener("click", async e => {
  const b = e.target.closest("button"); if(!b) return;
  if(b.id === "nbNew") return openNew();
  if(b.id === "nbRule") return openRule();
  if(b.dataset.cdelc){ if(await deleteCad(findCad(b.dataset.cdelc))) renderHome(); return; }
  if(b.dataset.cedit){ curC = findCad(b.dataset.cedit); return openSettings(true); }
  if(!curC) return;
  if(b.id === "nbSet") return openSettings();
  if(b.id === "nbAddPage"){ const p = newPage("Nova página", "Minhas páginas"); curC.paginas.push(p); touch(curC, p); save(); go(curC, p);
    requestAnimationFrame(() => { const i = $("#nbTitle"); i?.focus(); i?.select(); }); return; }
  if(!curP) return;
  if(b.id === "nbDelPage"){
    if(!await A.ask(`Excluir a página "${curP.t}"? O texto, as imagens e os arquivos dela serão apagados.`)) return;
    curP.blocos.forEach(x => x.fid && files.del(x.fid));
    curC.paginas = curC.paginas.filter(p => p !== curP); touch(curC); save(); go(curC, curC.paginas[0]); toast("Página excluída."); return;
  }
  if(b.dataset.addb){
    const k = b.dataset.addb;
    if(k === "img" || k === "arq"){ const fi = $("#nbFile"); fi.accept = k === "img" ? "image/*" : ""; fi.click(); return; }
    return addBlock(newBlock(k));
  }
  const blk = blockOf(b);
  if(b.dataset.bdel){ const x = blk; if(blockText(x).trim() && !await A.ask("Excluir este bloco?")) return; if(x.fid) files.del(x.fid);
    curP.blocos = curP.blocos.filter(y => y !== x); if(!curP.blocos.length) curP.blocos.push(newBlock("texto")); touch(curC, curP); save(); rerenderPage(); return; }
  if(b.dataset.bup || b.dataset.bdown){ const l = curP.blocos, i = l.indexOf(blk), j = b.dataset.bup ? i - 1 : i + 1; if(j < 0 || j >= l.length) return;
    [l[i], l[j]] = [l[j], l[i]]; touch(curC, curP); save(); rerenderPage(); return; }
  if(b.dataset.cadd != null){ blk.items.push({t:"", on:false}); changed(); save(); rerenderPage();
    requestAnimationFrame(() => root.querySelector(`[data-b="${blk.id}"] [data-ct="${blk.items.length - 1}"]`)?.focus()); return; }
  if(b.dataset.cdel != null){ blk.items.splice(+b.dataset.cdel, 1); if(!blk.items.length) blk.items.push({t:"", on:false}); changed(); save(); rerenderPage(); return; }
  if(b.dataset.cmd){ format(b.dataset.cmd, b.closest(".nbb").querySelector(".nbrich")); return; }
  if(b.dataset.fopen){
    const r = await files.get(b.dataset.fopen).catch(() => null); if(!r){ toast("Arquivo não encontrado neste navegador."); return; }
    const u = URL.createObjectURL(r.blob); urls.push(u);
    if(/^(image\/|application\/pdf|text\/)/.test(r.type)) window.open(u, "_blank", "noopener");
    else { const a = document.createElement("a"); a.href = u; a.download = b.dataset.fname || r.name; a.click(); }
    return;
  }
  if(b.dataset.gopen) return A.openPanel(A.findTopic(b.dataset.gopen));
  if(b.dataset.gmap) return A.focusTopic(b.dataset.gmap);
  if(b.dataset.gdone){
    const want = b.dataset.gdone === "1";
    if(curP.ref.k === "topic"){ const t = A.findTopic(curP.ref.id); if(want && !A.completeTopic(t)) return; if(!want) A.uncompleteTopic(t); }
    else { const f = A.mini.find(curP.ref.id); if(want && !canCompleteMini(f.it).ok){ toast(whyNot(canCompleteMini(f.it))); return; } A.mini.setDone(f.it.id, want); }
    rerenderPage();
  }
});
function format(cmd, el){
  el.focus();
  if(cmd === "h3") document.execCommand("formatBlock", false, document.queryCommandValue("formatBlock").toLowerCase() === "h3" ? "div" : "h3");
  else if(cmd === "quote") document.execCommand("formatBlock", false, "blockquote");
  else if(cmd === "code"){ const s = String(getSelection()); document.execCommand("insertHTML", false, `<code>${esc(s || "código")}</code>&nbsp;`); }
  else if(cmd === "link"){
    const sel = getSelection(), range = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    A.ask("Endereço do link", {input:true, placeholder:"https://…", ok:"Inserir"}).then(u => {
      if(!u) return; if(!safeUrl(u)){ toast("O endereço precisa começar com http:// ou https://."); return; }
      el.focus(); if(range){ sel.removeAllRanges(); sel.addRange(range); }
      if(range && !range.collapsed) document.execCommand("createLink", false, safeUrl(u)); else document.execCommand("insertHTML", false, `<a href="${esc(safeUrl(u))}">${esc(u)}</a>&nbsp;`);
      el.dispatchEvent(new Event("input", {bubbles:true}));
    });
    return;
  }
  else document.execCommand(cmd, false, null);
  el.dispatchEvent(new Event("input", {bubbles:true}));
}
/* colar: imagens viram bloco de imagem; texto com formatação passa limpo */
root.addEventListener("paste", e => {
  if(!curP) return;
  const items = [...(e.clipboardData?.files || [])];
  if(items.length){ e.preventDefault(); addFiles(items, blockOf(e.target)); return; }
  if(e.target.closest?.(".nbrich")){
    const html = e.clipboardData.getData("text/html"), txt = e.clipboardData.getData("text/plain");
    e.preventDefault();
    document.execCommand("insertHTML", false, html ? clean(html) : esc(txt).replace(/\n/g, "<br>"));
  }
});
root.addEventListener("dragover", e => { if(curP && e.dataTransfer?.types?.includes("Files")){ e.preventDefault(); root.querySelector(".nbpage")?.classList.add("drop"); } });
root.addEventListener("dragleave", e => { if(!root.contains(e.relatedTarget)) root.querySelector(".nbpage")?.classList.remove("drop"); });
root.addEventListener("drop", e => { if(!curP || !e.dataTransfer?.files?.length) return; e.preventDefault(); root.querySelector(".nbpage")?.classList.remove("drop"); addFiles([...e.dataTransfer.files], blockOf(e.target)); });
document.addEventListener("visibilitychange", () => { if(document.hidden){ clearTimeout(saveT); save(); } });
window.addEventListener("beforeunload", () => { clearTimeout(saveT); save(); });

/* ---------- configurações ---------- */
function openSettings(fromHome){
  const c = curC;
  showPanel("Caderno de estudos", null, "Configurar caderno");
  pBody.innerHTML = `<form class="form" id="nbSetF" novalidate>
    <label>Nome<input class="in" name="t" required value="${esc(c.t)}"></label>
    ${c.tipo === "mini" ? `<p class="muted" style="margin:0">Itens novos do minimapa ainda não estão no caderno? Atualize: as páginas que faltam são acrescentadas, as suas continuam.</p><button type="button" class="btn sm" id="nbSync">${ico("expand")}Acrescentar itens novos do minimapa</button>` : ""}
    <div class="formfoot"><button type="button" class="btn ghost danger" id="nbDel">${ico("trash")}Excluir caderno</button><span class="right"><button type="button" class="btn" id="nbCancel">Cancelar</button><button class="btn primary" type="submit">Salvar</button></span></div></form>`;
  const f = $("#nbSetF"); f.t.focus();
  $("#nbCancel").onclick = () => { closePanel(); if(fromHome) curC = null; };
  f.onsubmit = e => { e.preventDefault(); if(!f.t.value.trim()) return f.t.focus(); c.t = f.t.value.trim(); touch(c); save(); closePanel();
    if(fromHome){ curC = null; renderHome(); } else { renderCad(); A.show(location.hash.slice(1)); } toast("Caderno salvo."); };
  if($("#nbSync")) $("#nbSync").onclick = () => {
    const m = (A.C.minis || []).find(x => x.id === c.ref); if(!m){ toast("O minimapa deste caderno não existe mais."); return; }
    const have = new Set(c.paginas.filter(p => p.ref).map(p => p.ref.id)), novos = fromMini(m).paginas.filter(p => !have.has(p.ref.id));
    c.paginas.push(...novos); touch(c); save(); closePanel(); renderCad(); toast(novos.length ? `${novos.length} páginas acrescentadas.` : "Nada novo no minimapa.");
  };
  $("#nbDel").onclick = async () => { if(await deleteCad(c)){ closePanel(); if(fromHome){ curC = null; renderHome(); } else go(); } };
}
function openRule(){
  const r = REGRA();
  showPanel("Caderno de estudos", null, "Regra para concluir");
  pBody.innerHTML = `<form class="form" id="nbRuleF">
    <p style="margin:0">Vale para os tópicos da trilha e para os itens de minimapa que têm subitens, em qualquer lugar do site. Itens sem subitens concluem direto. O que já estava concluído continua.</p>
    <label>Mínimo de itens marcados <span class="muted" id="nbPctV">${r.pct}%</span><input type="range" name="pct" min="50" max="100" step="5" value="${r.pct}"></label>
    <label class="checkline"><input type="checkbox" name="nota"${r.nota ? " checked" : ""}> Exigir uma anotação escrita (no caderno ou nas anotações do tópico)</label>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" id="nbRC">Cancelar</button><button class="btn primary" type="submit">Salvar</button></span></div></form>`;
  const f = $("#nbRuleF");
  f.pct.oninput = () => { $("#nbPctV").textContent = f.pct.value + "%"; };
  $("#nbRC").onclick = closePanel;
  f.onsubmit = e => { e.preventDefault(); store.set("jqa-regra", {pct:+f.pct.value, nota:f.nota.checked}); closePanel(); renderHome(); toast("Regra salva."); };
}

/* =====================================================================
   CONCLUIR: usado pelo painel do tópico, pelo minimapa e pelo caderno
   ===================================================================== */
function completeTopic(t){
  const v = canCompleteTopic(t);
  if(!v.ok){ toast(whyNot(v)); return false; }
  done.add(t.id); store.set("jqa-trilha", [...done]); A.refreshTrail?.(); A.refreshMini?.(); return true;
}
function uncompleteTopic(t){ done.delete(t.id); store.set("jqa-trilha", [...done]); A.refreshTrail?.(); A.refreshMini?.(); }
/* importação de backup e troca de conteúdo */
function reloadNB(){ NB = store.get("jqa-cadernos", {cadernos:[]}); NB.cadernos = NB.cadernos || []; }

Object.assign(A, {openGuia, openCaderno, noteFor, canCompleteTopic, canCompleteMini, whyNot, completeTopic, uncompleteTopic, reloadNB, hasNoteTopic});
})(JQA.app);
