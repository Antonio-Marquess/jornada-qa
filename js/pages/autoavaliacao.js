/* Jornada QA — Autoavaliação: matriz de competências.
 * Área › competência (tecnologia ou assunto) › um clique no nível que descreve você hoje (0 a 3).
 * As frases de cada nível explicam o que ele significa, para a escolha ser honesta.
 * O resultado aparece no mapa de calor, na carreira (competências exigidas), nos tópicos da trilha e no Início.
 * Guardado em jqa-autoav: {nivel:{id:0-3}, hist:{"AAAA-MM-DD":{id:nível}}}. */
(function(A){
const {$, esc, ico, uid, store, toast, showPanel, closePanel, pBody} = A;

const NIVEIS = [["Ainda não", "não estudei ou só ouvi falar"], ["Conheço", "explico com minhas palavras e dou exemplo"], ["Pratico", "já fiz em exercício ou projeto de estudo"], ["Domino", "faço sozinho em situação real e consigo ensinar"]];
const MODELO = {n1:["Explico para que serve e quando usar", "Segui o tutorial ou a documentação inicial"],
  n2:["Usei num exercício ou projeto de estudo", "Resolvo problemas comuns consultando a documentação"],
  n3:["Uso no trabalho ou em projeto real sem roteiro", "Consigo ensinar ou revisar o trabalho de outra pessoa"]};
const st = store.get("jqa-autoav", {}); st.nivel = st.nivel || {}; st.hist = st.hist || {};
const save = () => { st.hist[A.today()] = Object.fromEntries(all().map(({it}) => [it.id, levelOf(it).n])); store.set("jqa-autoav", st); };
const areas = () => A.C.comp || [];
const all = () => areas().flatMap(a => a.itens.map(it => ({a, it})));
const find = id => all().find(x => x.it.id === id);

const levelOf = it => ({n:st.nivel[it.id] || 0, conf:true});
/* versão anterior marcava frase por frase: vira o nível equivalente */
if(st.marc){
  Object.entries(st.marc).forEach(([id, ks]) => { const x = find(id); if(!x) return; const on = new Set(ks); let n = 0;
    for(let L = 1; L <= 3; L++){ const list = x.it["n" + L]; if(!list.length || !list.every((_, i) => on.has(L + "-" + i))) break; n = L; }
    if(n) st.nivel[id] = n; });
  delete st.marc; delete st.prova; store.set("jqa-autoav", st);
}
/* requisito da carreira: {ids:[…], n} — vale a melhor competência da lista */
function reqStatus(r){
  const opts = r.ids.map(find).filter(Boolean), best = opts.map(x => ({...x, l:levelOf(x.it)})).sort((p, q) => q.l.n - p.l.n)[0];
  const ok = !!best && best.l.n >= r.n;
  return {ok, best, nome:r.t || opts[0]?.it.t || r.ids[0], n:r.n};
}
/* nível ligado a um tópico da trilha: a melhor competência que cita o tópico */
function topicLevel(tid){
  const ls = all().filter(({it}) => it.topicos.includes(tid)).map(x => ({...x, l:levelOf(x.it)}));
  return ls.length ? ls.sort((p, q) => q.l.n - p.l.n)[0] : null;
}
const counts = () => { const c = [0, 0, 0, 0]; all().forEach(({it}) => c[levelOf(it).n]++); return c; };
const lastEval = () => Object.keys(st.hist).sort().pop() || null;

/* ---------- página ---------- */
let curA = null, openIt = null;
const page = $("#avPage");
let view = "avaliar";
function openAuto(parts){
  if(parts?.[0] === "resultado"){ view = "resultado"; render(); return "Autoavaliação"; }
  view = "avaliar";
  const [aid, iid] = parts || [];
  curA = areas().find(a => a.id === aid) || curA && areas().find(a => a === curA) || areas()[0] || null;
  openIt = iid || (aid ? null : openIt);
  render();
  if(iid) requestAnimationFrame(() => document.getElementById("av-" + iid)?.scrollIntoView({block:"start", behavior:"smooth"}));
  return "Autoavaliação";
}
const NV = n => n ? "N" + n : "—";
const pill = n => `<span class="lvpill lv${n}">${NV(n)}</span>`;
/* barra empilhada com a distribuição dos níveis */
const dist = (c, cls = "") => { const t = c.reduce((a, b) => a + b, 0) || 1;
  return `<div class="avdist ${cls}" role="img" aria-label="${[3, 2, 1, 0].map(n => `${c[n]} em ${n ? "N" + n : "ainda não"}`).join(", ")}">${[3, 2, 1, 0].map(n => c[n] ? `<i class="lv${n}" style="flex:${c[n]}" title="${n ? "N" + n + " · " + NIVEIS[n][0] : NIVEIS[0][0]}: ${c[n]}"></i>` : "").join("")}</div>`; };
const areaCounts = a => { const c = [0, 0, 0, 0]; a.itens.forEach(it => c[levelOf(it).n]++); return c; };
const avg = c => { const t = c[1] + c[2] + c[3]; return t ? (c[1] + 2 * c[2] + 3 * c[3]) / t : 0; };
function render(){
  const c = counts(), tot = c.reduce((a, b) => a + b, 0), avaliados = tot - c[0];
  const seg = `<div class="avseg" role="tablist" aria-label="Autoavaliação">
    <a role="tab" href="#autoavaliacao${curA ? "/" + esc(curA.id) : ""}" class="${view === "avaliar" ? "on" : ""}" aria-selected="${view === "avaliar"}">${ico("pen")}Avaliar</a>
    <a role="tab" href="#autoavaliacao/resultado" class="${view === "resultado" ? "on" : ""}" aria-selected="${view === "resultado"}">${ico("gauge")}Meu resultado <small>${avaliados}/${tot}</small></a></div>`;
  page.innerHTML = seg + (view === "resultado" ? result(c, tot, avaliados) : `
    <p class="lead">Escolha uma área e, em cada tecnologia, clique no nível que descreve você hoje. Na dúvida, abra <b>O que significa cada nível</b>. Seja honesto: isso orienta o seu estudo, não é prova.</p>
    <div class="avscale">${[0, 1, 2, 3].map(n => `<span class="lv${n}">${pill(n)}<span>${NIVEIS[n][0]}<small>${NIVEIS[n][1]}</small></span></span>`).join("")}</div>
    <div class="avtabs" role="tablist" aria-label="Áreas">${areas().map(a => { const done = a.itens.filter(it => levelOf(it).n).length;
      return `<a role="tab" class="avtab${a === curA ? " on" : ""}" aria-selected="${a === curA}" href="#autoavaliacao/${esc(a.id)}">${esc(a.t)}<small>${done}/${a.itens.length}</small></a>`; }).join("")}
      <button class="avtab add" id="avNewArea">${ico("plus")}Área</button></div>
    ${curA ? areaHTML(curA) : `<p class="muted">Crie a primeira área de competências, por exemplo "Automação" ou "Banco de dados".</p>`}`);
}
/* meu resultado: perfil geral, o que falta para o objetivo, cada área em um cartão e a evolução */
function result(c, tot, avaliados){
  if(!avaliados) return `<div class="avempty">${ico("gauge")}<b>Você ainda não se avaliou</b><span class="muted">Vá em <a href="#autoavaliacao">Avaliar</a>, escolha uma área e clique no seu nível em cada tecnologia. Leva poucos minutos por área.</span></div>`;
  const last = lastEval(), cs = A.careerSummary?.(), gaps = cs?.alvo ? (cs.comp || []).filter(r => !r.ok) : [];
  const av = areas().filter(a => a.itens.length).map(a => ({a, c:areaCounts(a)})), aval = av.filter(x => x.c[1] + x.c[2] + x.c[3]);
  const forte = aval.slice().sort((p, q) => avg(q.c) - avg(p.c))[0], fraca = av.slice().sort((p, q) => (avg(p.c) - avg(q.c)) || (q.a.itens.length - p.a.itens.length))[0];
  const pct = Math.round(avaliados / tot * 100);
  const ring = `conic-gradient(${(() => { let acc = 0; return [3, 2, 1, 0].map(n => { const a0 = acc; acc += c[n] / tot * 360; return `var(--lv${n}) ${a0}deg ${acc}deg`; }).join(","); })()})`;
  return `
    <section class="avhero">
      <div class="avring" style="background:${ring}"><div><b>${avaliados}</b><span>de ${tot} avaliadas</span></div></div>
      <div class="avheroR">
        <span class="hlabel">Seu perfil técnico</span>
        <div class="avlv4">${[3, 2, 1, 0].map(n => `<div class="lv${n}">${pill(n)}<b>${c[n]}</b><span>${n ? NIVEIS[n][0] : "Ainda não"}</span></div>`).join("")}</div>
        <p class="avinsight">${forte ? `Ponto forte: <b>${esc(forte.a.t)}</b> (média ${NV(Math.round(avg(forte.c)))}).` : ""} ${fraca && fraca !== forte ? `Mais espaço para crescer: <b>${esc(fraca.a.t)}</b>.` : ""} <span class="muted">${pct}% avaliado${last ? " · atualizado em " + last.split("-").reverse().slice(0, 2).join("/") : ""}</span></p>
      </div>
    </section>
    ${cs?.alvo ? `<section class="hcard avgap"><div class="avgaph"><span class="hlabel">Para chegar a ${esc(cs.alvo.nome)}</span><span class="muted">${(cs.comp || []).length - gaps.length} de ${(cs.comp || []).length} competências no nível exigido</span></div>
      ${gaps.length ? `<ul class="avgaps">${gaps.map(r => `<li><a href="#autoavaliacao/${esc(r.best?.a.id || "")}/${esc(r.best?.it.id || "")}"><b>${esc(r.nome)}</b><span class="avfromto">${pill(r.best ? r.best.l.n : 0)}<span aria-hidden="true">→</span>${pill(r.n)}</span></a></li>`).join("")}</ul>`
        : `<p style="margin:0">Você já tem todas as competências técnicas que esse nível pede.</p>`}</section>`
      : `<p class="hnote">Marque seu objetivo na <a href="#carreira">Carreira</a> para ver aqui quais competências faltam.</p>`}
    <div class="avcards">${av.map(({a, c: ac}) => `<article class="avcard">
      <header><a href="#autoavaliacao/${esc(a.id)}"><b>${esc(a.t)}</b></a><span class="muted">${ac[1] + ac[2] + ac[3] ? "média " + NV(Math.round(avg(ac))) : "não avaliada"}</span></header>
      ${dist(ac, "sm")}
      <ul>${a.itens.map(it => { const n = levelOf(it).n; return `<li><a href="#autoavaliacao/${esc(a.id)}/${esc(it.id)}">${esc(it.t)}</a>${pill(n)}</li>`; }).join("")}</ul></article>`).join("")}</div>
    ${evolution()}`;
}
function evolution(){
  const ds = Object.keys(st.hist).sort().slice(-8); if(ds.length < 2) return "";
  const sums = ds.map(d => Object.values(st.hist[d]).reduce((a, b) => a + b, 0)), max = Math.max(1, ...sums), first = sums[0], lastv = sums[sums.length - 1];
  return `<section class="hcard avevo"><span class="hlabel">Evolução</span><span class="hsubl">soma dos seus níveis (N1 = 1, N2 = 2, N3 = 3) em cada atualização${lastv > first ? ` · +${lastv - first} desde ${ds[0].split("-").reverse().slice(0, 2).join("/")}` : ""}</span>
    <div class="hcols" role="list">${ds.map((d, i) => `<div class="hcol${i === ds.length - 1 ? " now" : ""}" role="listitem" tabindex="0" data-tip="${d.split("-").reverse().join("/")}: soma ${sums[i]}">
      <span class="hcv">${sums[i]}</span><span class="hcb"><i style="height:${Math.round(sums[i] / max * 100)}%"></i></span><span class="hcl">${d.split("-").reverse().slice(0, 2).join("/")}</span></div>`).join("")}</div></section>`;
}
function areaHTML(a){
  return `<section class="avarea">
    <header class="avah"><div><h3>${esc(a.t)}</h3>${a.d ? `<p class="muted">${esc(a.d)}</p>` : ""}</div>
      <span class="hbtns"><button class="btn sm" data-avadd="${esc(a.id)}">${ico("plus")}Competência</button><button class="iconbtn" data-avedita="${esc(a.id)}" aria-label="Editar área ${esc(a.t)}" title="Editar área">${ico("pen")}</button></span></header>
    <div class="avlist">${a.itens.map(it => itemHTML(a, it)).join("") || `<p class="muted">Nenhuma competência nesta área ainda.</p>`}</div></section>`;
}
function itemHTML(a, it){
  const l = levelOf(it), open = openIt === it.id;
  return `<article class="avit${open ? " open" : ""}" id="av-${esc(it.id)}">
    <div class="avrowi">
      <div class="avitt"><b>${esc(it.t)}</b>${it.d ? `<small class="muted">${esc(it.d)}</small>` : ""}</div>
      <div class="avpick" role="radiogroup" aria-label="Seu nível em ${esc(it.t)}">${[0, 1, 2, 3].map(n => `<button class="lv${n}${l.n === n ? " on" : ""}" role="radio" aria-checked="${l.n === n}" data-avset="${n}"
        title="${esc(n ? NIVEIS[n][0] + ": " + it["n" + n].join("; ") : NIVEIS[0][0] + ": " + NIVEIS[0][1])}"><b>${n ? "N" + n : "—"}</b><span>${NIVEIS[n][0]}</span></button>`).join("")}</div>
      <button class="avmore" data-avopen="${esc(it.id)}" aria-expanded="${open}">${open ? "Fechar" : "O que significa cada nível"}</button>
    </div>
    ${open ? `<div class="avbody">
      <div class="avlevels">${[1, 2, 3].map(L => `<div class="avlv${l.n >= L ? " done" : ""}"><div class="avlvh"><b>${pill(L)} ${NIVEIS[L][0]}</b><small class="muted">${NIVEIS[L][1]}</small></div>
        <ul>${it["n" + L].map(t => `<li>${esc(t)}</li>`).join("") || `<li class="muted">Sem descrição. Use Editar.</li>`}</ul></div>`).join("")}</div>
      <div class="avfoot"><span class="muted">Você está no nível em que todas as frases dele (e dos anteriores) valem para você.</span>
        <span class="right"><button class="iconbtn" data-avedit="${esc(it.id)}" aria-label="Editar ${esc(it.t)}" title="Editar">${ico("pen")}</button><button class="iconbtn" data-avdel="${esc(it.id)}" aria-label="Excluir ${esc(it.t)}" title="Excluir">${ico("trash")}</button></span></div>
    </div>` : ""}</article>`;
}
function rerenderItem(id){
  const x = find(id); if(!x) return render();
  const y = $("#v-autoavaliacao").scrollTop, el = document.getElementById("av-" + id);
  render(); $("#v-autoavaliacao").scrollTop = y;
}

/* ---------- eventos ---------- */
page.addEventListener("click", async e => {
  const b = e.target.closest("button"); if(!b) return;
  if(b.dataset.avopen){ openIt = openIt === b.dataset.avopen ? null : b.dataset.avopen; const y = $("#v-autoavaliacao").scrollTop; render(); $("#v-autoavaliacao").scrollTop = y; return; }
  if(b.dataset.avset != null){
    const id = b.closest(".avit").id.slice(3), x = find(id), n = +b.dataset.avset, before = st.nivel[id] || 0;
    if(n) st.nivel[id] = n; else delete st.nivel[id];
    save(); if(n !== before) toast(`${x.it.t}: ${n ? "N" + n + " · " : ""}${NIVEIS[n][0]}.`); rerenderItem(id); return;
  }
  if(b.dataset.avedit) return editItem(find(b.dataset.avedit).a, find(b.dataset.avedit).it);
  if(b.dataset.avadd) return editItem(areas().find(a => a.id === b.dataset.avadd), null);
  if(b.dataset.avedita) return editArea(areas().find(a => a.id === b.dataset.avedita));
  if(b.id === "avNewArea") return editArea(null);
  if(b.dataset.avdel){ const x = find(b.dataset.avdel);
    if(!await A.ask(`Excluir a competência "${x.it.t}"? Suas marcações nela também serão apagadas.`)) return;
    x.a.itens = x.a.itens.filter(i => i !== x.it); delete st.nivel[x.it.id]; A.saveContent(); save(); render(); toast("Competência excluída."); }
});

/* ---------- edição ---------- */
function editItem(a, it){
  const isNew = !it, d = it || {t:"", d:"", topicos:[], ...MODELO};
  showPanel("Autoavaliação", null, isNew ? "Nova competência" : "Editar competência");
  const chosen = new Set(d.topicos);
  pBody.innerHTML = `<form class="form" id="avForm" novalidate>
    <label>Nome<input class="in" name="t" required value="${esc(d.t)}" placeholder="Ex.: WebdriverIO, Kafka, Postman"></label>
    <label>Descrição <span class="muted">opcional</span><input class="in" name="d" value="${esc(d.d || "")}"></label>
    ${[1, 2, 3].map(L => `<label>O que significa N${L} · ${NIVEIS[L][0]} <span class="muted">uma frase por linha</span><textarea class="in" name="n${L}" rows="3">${esc(d["n" + L].join("\n"))}</textarea></label>`).join("")}
    <fieldset><legend>Tópicos da trilha ligados</legend>
      ${A.C.stages.map(s => { const ts = A.C.topics.filter(t => t.s === s.id); return ts.length ? `<details class="tpick"${ts.some(t => chosen.has(t.id)) ? " open" : ""}><summary>${esc(A.stageLabel(s))}</summary><div class="tpicklist">${ts.map(t => `<label class="checkline"><input type="checkbox" name="top" value="${esc(t.id)}"${chosen.has(t.id) ? " checked" : ""}> <span>${esc(t.t)}</span></label>`).join("")}</div></details>` : ""; }).join("")}
    </fieldset>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" id="avCancel">Cancelar</button><button class="btn primary" type="submit">${isNew ? "Criar" : "Salvar"}</button></span></div></form>`;
  const f = $("#avForm"); f.t.focus();
  $("#avCancel").onclick = closePanel;
  f.onsubmit = e => {
    e.preventDefault(); if(!f.t.value.trim()) return f.t.focus();
    const lines = v => v.split("\n").map(x => x.trim()).filter(Boolean);
    const data = {t:f.t.value.trim(), d:f.d.value.trim(), n1:lines(f.n1.value), n2:lines(f.n2.value), n3:lines(f.n3.value), topicos:[...f.querySelectorAll("[name=top]:checked")].map(c => c.value)};
    if(isNew){ const n = {id:uid("cp"), ...data}; a.itens.push(n); openIt = n.id; } else Object.assign(it, data);
    A.saveContent(); save(); closePanel(); curA = a; render(); toast(isNew ? "Competência criada." : "Competência salva.");
  };
}
function editArea(a){
  showPanel("Autoavaliação", null, a ? "Editar área" : "Nova área");
  pBody.innerHTML = `<form class="form" id="avAForm" novalidate>
    <label>Nome<input class="in" name="t" required value="${esc(a?.t || "")}" placeholder="Ex.: Automação mobile"></label>
    <label>Descrição <span class="muted">opcional</span><input class="in" name="d" value="${esc(a?.d || "")}"></label>
    <div class="formfoot">${a ? `<button type="button" class="btn ghost danger" id="avADel">${ico("trash")}Excluir área</button>` : "<span></span>"}<span class="right"><button type="button" class="btn" id="avACancel">Cancelar</button><button class="btn primary" type="submit">Salvar</button></span></div></form>`;
  const f = $("#avAForm"); f.t.focus();
  $("#avACancel").onclick = closePanel;
  f.onsubmit = e => { e.preventDefault(); if(!f.t.value.trim()) return f.t.focus();
    if(a) Object.assign(a, {t:f.t.value.trim(), d:f.d.value.trim()}); else { a = {id:uid("ar"), t:f.t.value.trim(), d:f.d.value.trim(), itens:[]}; A.C.comp.push(a); }
    A.saveContent(); closePanel(); location.hash = "autoavaliacao/" + a.id; render(); toast("Área salva."); };
  if(a) $("#avADel").onclick = async () => {
    if(!await A.ask(`Excluir a área "${a.t}" e as ${a.itens.length} competências dela?`)) return;
    a.itens.forEach(it => { delete st.nivel[it.id]; });
    A.C.comp = A.C.comp.filter(x => x !== a); A.saveContent(); save(); closePanel(); curA = null; location.hash = "autoavaliacao"; render(); toast("Área excluída.");
  };
}

Object.assign(A, {openAuto, levelOf, reqStatus, topicLevel, compCounts:counts, lastEval, compFind:find, NIVEIS_COMP:NIVEIS});
})(JQA.app);
