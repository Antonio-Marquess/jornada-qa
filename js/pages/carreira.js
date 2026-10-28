/* Jornada QA — Carreira em Y: base comum, trilha técnica, trilha de gestão e o líder técnico como ponte.
 * Cada nível diz o que se espera, o que estudar (tópicos da trilha), o que fazer para provar e o que costuma travar.
 * A autoavaliação (onde estou, objetivo e itens marcados) fica em jqa-carreira. */
(function(A){
const {$, esc, ico, uid, store, toast, done, saveContent, snapshot, undo, showPanel, closePanel, pBody, findTopic, stageOf, createMindMap} = A;

const RAMOS = {
  base:{t:"Base comum", c:"--e1"},
  tecnico:{t:"Trilha técnica", c:"--e3"},
  ponte:{t:"Ponte", c:"--e4"},
  gestao:{t:"Trilha de gestão", c:"--e5"}
};
const KINDS = [["espera","e","O que se espera"],["provar","p","O que fazer para provar"],["comport","c","Comportamentos"]];
const st = store.get("jqa-carreira", {}); st.marc = st.marc || {}; st.pos = st.pos || {};
/* onde estou e objetivo, por carreira (a versão anterior guardava só os da principal) */
if(st.atual || st.alvo){ st.pos.oficial = {atual:st.atual, alvo:st.alvo}; delete st.atual; delete st.alvo; }
const save = () => store.set("jqa-carreira", st);
const OF = "oficial";
const own = () => A.C.carreiras;
const career = () => own().find(c => c.id === st.cur) || {id:OF, t:"Carreira em Y", oficial:true, niveis:A.C.carreira};
const pos = () => st.pos[career().id] || (st.pos[career().id] = {});
const N = () => career().niveis;
const setN = list => { const c = career(); if(c.oficial) A.C.carreira = list; else c.niveis = list; };
const blankLevel = (ramo, nome) => ({id:uid("n"), nome:nome || "Novo nível", ramo, eq:[], escopo:"", resumo:"", espera:[], topicos:[], minis:[], extra:[], provar:[], comport:[], trava:[]});
const byId = id => N().find(n => n.id === id);
const of = r => N().filter(n => n.ramo === r);
const topicsOfLevel = n => n.topicos.map(findTopic).filter(Boolean);

function prog(n){
  const on = new Set(st.marc[n.id] || []); let a = 0, t = 0;
  KINDS.forEach(([k, p]) => n[k].forEach((_, i) => { t++; if(on.has(p + i)) a++; }));
  const tops = topicsOfLevel(n);
  return {a, t, td:tops.filter(x => done.has(x.id)).length, tt:tops.length};
}
const pct = p => Math.round((p.a + p.td) / ((p.t + p.tt) || 1) * 100);

/* próximos passos possíveis a partir de um nível */
function nextOf(n){
  const same = of(n.ramo), i = same.indexOf(n), nx = same[i + 1];
  if(n.ramo === "base") return nx ? [nx] : [of("tecnico")[0], of("ponte")[0]].filter(Boolean);
  if(n.ramo === "ponte") return [nx, of("gestao")[0], of("tecnico")[0]].filter(Boolean);
  return nx ? [nx] : [];
}

/* ---------- página ---------- */
function card(n){
  const p = prog(n), here = pos().atual === n.id, goal = pos().alvo === n.id, r = RAMOS[n.ramo] || RAMOS.base;
  const open = yOpen === n.id;
  return `<div class="ystep${open ? " open" : ""}"><button class="ycard${here ? " here" : ""}${goal ? " goal" : ""}${open ? " open" : ""}" data-n="${esc(n.id)}" aria-expanded="${open}" style="--c:var(${r.c})">
    <span class="yhead"><b>${esc(n.nome)}</b>${here ? '<span class="ybadge">você</span>' : ""}${goal ? '<span class="ybadge g">objetivo</span>' : ""}${n.ramo === "ponte" ? '<span class="ybadge p">ponte</span>' : ""}</span>
    ${n.eq.length ? `<span class="yeq">${esc(n.eq.slice(0, 2).join(" · "))}</span>` : ""}
    <span class="yesc">${esc(n.escopo)}</span>
    <span class="ybar" aria-hidden="true"><i style="width:${pct(p)}%"></i></span>
    <span class="ymeta">${p.a}/${p.t} itens · ${p.td}/${p.tt} tópicos<span class="ymore">${open ? "fechar" : "ver requisitos"}</span></span>
  </button><span class="ycardtools"><button class="yrx" data-lvedit="${esc(n.id)}" aria-label="Editar ${esc(n.nome)}" title="Editar nível">${ico("pen")}</button><button class="yrx" data-lvdel="${esc(n.id)}" aria-label="Excluir ${esc(n.nome)}" title="Excluir nível">${ico("trash")}</button></span>${open && mobile() ? reqPane(n) : ""}</div>`;
}
const addBtn = ramo => `<button class="yadd" data-addlevel="${ramo}" title="Adicionar nível neste caminho"><span>${ico("plus")}Nível</span></button>`;

function summary(){
  const cur = byId(pos().atual), alvo = byId(pos().alvo);
  if(!cur) return `<div class="cnow"><div><b class="cnowt">Por onde começar</b><p>Clique no seu nível, marque <b>Estou aqui</b> e o que já faz de verdade. Depois escolha um objetivo: a diferença entre os dois é o seu plano.</p></div></div>`;
  let txt = `Você está em <b>${esc(cur.nome)}</b>.`, btns = "";
  if(alvo){
    const p = prog(alvo);
    txt += ` Objetivo: <b>${esc(alvo.nome)}</b>. Faltam ${p.t - p.a} de ${p.t} itens e ${p.tt - p.td} de ${p.tt} tópicos.`;
    btns = `<button class="btn sm" data-n="${esc(alvo.id)}">Abrir objetivo</button><button class="btn sm primary" data-mktrail="${esc(alvo.id)}">${ico("route")}Criar trilha para o objetivo</button>`;
  } else {
    const nx = nextOf(cur);
    txt += nx.length ? ` Próximo passo possível: ${nx.map(x => `<b>${esc(x.nome)}</b>`).join(" ou ")}. Abra e marque como objetivo.` : "";
  }
  const pc = prog(cur);
  if(pc.t && pc.a / pc.t >= .8) txt += ` <span class="muted">Você marcou ${pc.a} de ${pc.t} itens do nível atual: provavelmente já atua parte do tempo no próximo.</span>`;
  return `<div class="cnow"><div><p>${txt}</p></div>${btns ? `<div class="cnowbtns">${btns}</div>` : ""}</div>`;
}

function renderCarreira(){
  const cur = byId(pos().atual), alvo = byId(pos().alvo), c = career();
  const gap = alvo ? prog(alvo) : null;
  $("#cProg").innerHTML = cur ? `<span><b>${esc(cur.nome)}</b>${alvo ? ` → <b>${esc(alvo.nome)}</b> · faltam ${gap.t - gap.a} itens e ${gap.tt - gap.td} tópicos` : " · escolha um objetivo"}</span>`
    : `<span>Clique no seu nível e marque <b>Estou aqui</b></span>`;
  renderCareerPicker();
  if(mode === "mapa") cmm.render();
  const root = $("#carreiraPage");
  root.innerHTML = `
    <div class="ylayout${byId(yOpen) && !mobile() ? " hasreq" : ""}">
    <div class="ytree">
      <div class="ycol ybase"><span class="ylabel" style="--c:var(--e1)">Base comum</span>${of("base").map(card).join("")}${addBtn("base")}</div>
      <svg class="yfork" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M100 0V12C100 26 50 22 50 40M100 12C100 26 150 22 150 40"/></svg>
      <div class="ybranches${mobile() && byId(yOpen) && byId(yOpen).ramo !== "base" ? " one" : ""}">
        <div class="ycol"><span class="ylabel" style="--c:var(--e3)">Trilha técnica</span>${of("tecnico").map(card).join("")}${addBtn("tecnico")}</div>
        <div class="ycol"><span class="ylabel" style="--c:var(--e5)">Trilha de gestão</span>${of("ponte").map(card).join("")}${of("gestao").map(card).join("")}${addBtn("gestao")}</div>
      </div>
      <p class="ynote">${ico("info")}Do líder técnico dá para seguir para a gestão ou voltar para a técnica (especialista ou staff). Muita gente passa pela ponte e decide ficar na técnica.</p>
    </div>
    ${byId(yOpen) && !mobile() ? reqPane(byId(yOpen)) : ""}
    </div>
    `;
}
$("#carreiraPage").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  if(b.dataset.lvedit) editLevel(byId(b.dataset.lvedit));
  else if(b.dataset.lvdel) delLevel(byId(b.dataset.lvdel));
  else if(b.dataset.n) toggleReq(b.dataset.n, !b.classList.contains("ycard"));
  else if(b.dataset.yg){ yGroup = b.dataset.yg; renderCarreira(); }
  else if(b.dataset.ymk){ toggleMark(byId(yOpen), b.dataset.ymk); }
  else if(b.dataset.ydel){ const n = byId(yOpen), [k, i] = b.dataset.ydel.split(":"), px = (GRUPOS.find(g => g[0] === k) || [])[1];
    mutate(() => { if(k === "topicos") n.topicos = n.topicos.filter(x => x !== i); else { n[k].splice(+i, 1); if(px && px !== "t") remap(n, px, j => j === +i ? -1 : j > +i ? j - 1 : j); } }); }
  else if(b.dataset.yt) A.openPanel(findTopic(b.dataset.yt));
  else if(b.dataset.yav){ const x = A.compFind(b.dataset.yav); if(x) location.hash = `autoavaliacao/${x.a.id}/${x.it.id}`; }
  else if(b.dataset.yedit) startItemEdit(b);
  else if(b.dataset.yact){ const n = byId(yOpen), a = b.dataset.yact;
    if(a === "close"){ yOpen = null; renderCarreira(); }
    else if(a === "here"){ pos().atual = pos().atual === n.id ? undefined : n.id; save(); renderCarreira(); }
    else if(a === "goal"){ pos().alvo = pos().alvo === n.id ? undefined : n.id; save(); renderCarreira(); }
    else if(a === "det") openLevel(n);
    else if(a === "edit") editLevel(n);
    else if(a === "del") delLevel(n);
    else if(a === "trail") makeTrail(n); }
  else if(b.dataset.mktrail) makeTrail(byId(b.dataset.mktrail));
  else if(b.dataset.addlevel){
    snapshot();
    const n = blankLevel(b.dataset.addlevel);
    /* entra depois do último nível do mesmo ramo */
    const last = of(n.ramo).pop(); N().splice(last ? N().indexOf(last) + 1 : N().length, 0, n);
    saveContent(); renderCarreira(); editLevel(n, true);
  }
});


/* ---------- requisitos abertos ao lado do nível (caixinhas em árvore) ---------- */
let yOpen = null, yGroup = "espera";
const mobile = () => matchMedia("(max-width:820px)").matches;
function toggleReq(id, forceOpen){
  yOpen = (yOpen === id && !forceOpen) ? null : id; renderCarreira();
  if(yOpen) requestAnimationFrame(() => document.querySelector(mobile() ? `.ystep.open` : ".yreq")?.scrollIntoView({behavior:"smooth", block:"nearest"}));
}
const REQ = [["escopo","Escopo e cargos"],["espera","O que se espera"],["comp","Competências técnicas"],["estudar","O que estudar"],["provar","O que fazer para provar"],["comport","Comportamentos"],["trava","O que costuma travar"]];
function reqItems(n, g){
  const on = new Set(st.marc[n.id] || []);
  const del = key => `<button class="yrx" data-ydel="${key}" aria-label="Excluir" title="Excluir">${ico("trash")}</button>`;
  const ed = key => `<button class="yrx" data-yedit="${key}" aria-label="Editar" title="Editar">${ico("pen")}</button>`;
  const tools = (key, canDel = true) => `<span class="yrtools">${ed(key)}${canDel ? del(key) : ""}</span>`;
  const addForm = k => `<form class="yradd" data-yaddk="${k}"><input class="in" name="v" placeholder="Adicionar ${k === "trava" ? "um ponto de atenção" : "um requisito"}…" aria-label="Novo item"><button class="btn sm" type="submit">${ico("plus")}</button></form>`;
  if(g === "escopo") return `<div class="yri plain"><span><b>Escopo:</b> ${esc(n.escopo || "não definido")}</span>${tools("escopo:0", false)}</div>
    <div class="yri plain"><span><b>Nas empresas:</b> ${esc(n.eq.join(", ") || "não definido")}</span>${tools("eq:0", false)}</div>
    <div class="yri plain"><span><b>Resumo:</b> ${esc(n.resumo || "não definido")}</span>${tools("resumo:0", false)}</div>`;
  if(g === "comp") return compItems(n, del);
  if(g === "estudar"){
    const tops = topicsOfLevel(n), minis = n.minis.map(id => (A.C.minis || []).find(m => m.id === id)).filter(Boolean);
    return tops.map(t => `<div class="yri topic${done.has(t.id) ? " on" : ""}"><button class="yrt" data-yt="${esc(t.id)}"><span class="cdot"></span><span>${esc(t.t)}<small>${esc(stageOf(t.s) ? "Etapa " + stageOf(t.s).n : "")}${done.has(t.id) ? " · dominado" : ""}</small></span></button>${del("topicos:" + t.id)}</div>`).join("")
      + n.extra.map((x, i) => `<div class="yri dashed"><span>${esc(x)}<small>além da trilha</small></span>${tools("extra:" + i)}</div>`).join("")
      + minis.map(m => `<a class="yri link" href="#minimapas/${esc(m.id)}">${ico("grid")}<span>Minimapa: ${esc(m.t)}</span></a>`).join("")
      + `<div class="yrbtns"><button class="btn sm" data-yact="edit">${ico("pen")}Escolher tópicos</button>${tops.length || n.extra.length ? `<button class="btn sm primary" data-yact="trail">${ico("route")}Criar trilha</button>` : ""}</div>`;
  }
  const px = {espera:"e", provar:"p", comport:"c", trava:"t"}[g];
  return n[g].map((x, i) => px === "t"
      ? `<div class="yri warn"><span>${esc(x)}</span>${tools(g + ":" + i)}</div>`
      : `<div class="yri${on.has(px + i) ? " on" : ""}"><button class="yrk" data-ymk="${px}${i}" role="checkbox" aria-checked="${on.has(px + i)}"><span class="yrbox" aria-hidden="true"></span><span>${esc(x)}</span></button>${tools(g + ":" + i)}</div>`).join("")
    + (g === "provar" && n[g].length ? `<p class="yrhint">Marque só o que dá para mostrar: link, documento, número ou alguém que confirme.</p>` : "")
    + addForm(g);
}
/* competências técnicas exigidas pelo nível, com o seu nível atual de cada uma (aba Autoavaliação) */
function compItems(n, del){
  const opts = A.C.comp.flatMap(a => a.itens.map(it => `<option value="${esc(it.id)}">${esc(a.t)} · ${esc(it.t)}</option>`)).join("");
  return (n.comp || []).map((r, i) => { const s = A.reqStatus(r), cur = s.best ? s.best.l.n : 0;
      return `<div class="yri comp${s.ok ? " on" : ""}"><button class="yrt" data-yav="${esc(s.best?.it.id || r.ids[0])}"><span class="cdot"></span><span>${esc(s.nome)} <b class="avb lv${r.n}">N${r.n}</b><small>${s.ok ? "atendido" : `você: ${cur ? "N" + cur : "ainda não"}`}${r.ids.length > 1 ? ` · vale ${r.ids.map(id => A.compFind(id)?.it.t).filter(Boolean).join(", ")}` : ""}</small></span></button>${del("comp:" + i)}</div>`; }).join("")
    + (opts ? `<form class="yradd ycomp" data-ycomp><select class="in" name="c" aria-label="Competência">${opts}</select><select class="in" name="n" aria-label="Nível exigido"><option value="1">N1 · Conheço</option><option value="2" selected>N2 · Pratico</option><option value="3">N3 · Domino</option></select><button class="btn sm" type="submit">${ico("plus")}</button></form>` : `<p class="yrhint">Crie competências na aba Autoavaliação para exigir aqui.</p>`)
    + `<p class="yrhint">Os níveis vêm da aba Autoavaliação. <a href="#autoavaliacao">Avaliar minhas competências</a></p>`;
}
function reqCount(n, g){
  const on = new Set(st.marc[n.id] || []);
  if(g === "escopo") return "";
  if(g === "estudar"){ const t = topicsOfLevel(n); return `${t.filter(x => done.has(x.id)).length}/${t.length}`; }
  if(g === "trava") return String(n.trava.length);
  if(g === "comp"){ const rs = (n.comp || []).map(A.reqStatus); return `${rs.filter(r => r.ok).length}/${rs.length}`; }
  const px = {espera:"e", provar:"p", comport:"c"}[g]; return `${n[g].filter((_, i) => on.has(px + i)).length}/${n[g].length}`;
}
function reqPane(n){
  const r = RAMOS[n.ramo] || RAMOS.base, here = pos().atual === n.id, goal = pos().alvo === n.id, m = mobile();
  const groups = REQ.map(([g, label]) => `<button class="yrg${yGroup === g ? " on" : ""}" data-yg="${g}" aria-expanded="${yGroup === g}"><span>${label}</span><small>${reqCount(n, g)}</small></button>`
    + (m && yGroup === g ? `<div class="yritems">${reqItems(n, g)}</div>` : "")).join("");
  return `<div class="yreq" style="--c:var(${r.c})" aria-label="Requisitos de ${esc(n.nome)}">
    <div class="yrh"><div><span class="ylabel">${esc(r.t)}</span><b>${esc(n.nome)}</b></div>
      ${m ? "" : `<button class="iconbtn" data-yact="close" aria-label="Fechar requisitos" title="Fechar">${ico("x")}</button>`}</div>
    <div class="yrbtns">
      <button class="btn sm" data-yact="here" aria-pressed="${here}">${here ? "Você está aqui" : "Estou aqui"}</button>
      <button class="btn sm" data-yact="goal" aria-pressed="${goal}">${goal ? "Seu objetivo" : "Quero chegar aqui"}</button>
      <button class="btn sm ghost" data-yact="edit">${ico("pen")}Editar nível</button>
      <button class="btn sm ghost danger" data-yact="del">${ico("trash")}Excluir nível</button>
      <button class="btn sm ghost" data-yact="det">${ico("info")}Detalhes</button>
    </div>
    <div class="yrtree"><div class="yrgroups">${groups}</div>${m ? "" : `<div class="yritems">${reqItems(n, yGroup)}</div>`}</div>
  </div>`;
}
/* editar um item no lugar: o texto vira um campo; Enter salva, Esc cancela */
function startItemEdit(b){
  const n = byId(yOpen), [k, i] = b.dataset.yedit.split(":"), box = b.closest(".yri");
  const val = k === "escopo" ? n.escopo : k === "resumo" ? n.resumo : k === "eq" ? n.eq.join(", ") : n[k][+i];
  box.classList.add("editing");
  box.innerHTML = `<form class="yredit" data-yeditk="${k}:${i}"><textarea class="in" name="v" rows="${Math.min(5, Math.max(2, Math.ceil(val.length / 38)))}" aria-label="Editar texto">${esc(val)}</textarea>
    <div class="yrbtns"><button class="btn sm primary" type="submit">Salvar</button><button class="btn sm" type="button" data-ycancel>Cancelar</button>${k === "eq" ? '<small class="muted">separe por vírgula</small>' : ""}</div></form>`;
  const ta = box.querySelector("textarea"); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
  ta.addEventListener("keydown", e => {
    if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); ta.form.requestSubmit(); }
    if(e.key === "Escape"){ e.preventDefault(); e.stopPropagation(); renderCarreira(); }
  });
  box.querySelector("[data-ycancel]").onclick = () => renderCarreira();
}
$("#carreiraPage").addEventListener("submit", e => {
  const ef = e.target.closest("[data-yeditk]");
  if(ef){ e.preventDefault();
    const n = byId(yOpen), [k, i] = ef.dataset.yeditk.split(":"), v = ef.v.value.trim();
    if(!v && !["escopo","resumo","eq"].includes(k)){ ef.v.focus(); return; }
    mutate(() => { if(k === "escopo" || k === "resumo") n[k] = v; else if(k === "eq") n.eq = v.split(",").map(x => x.trim()).filter(Boolean); else n[k][+i] = v; });
    toast("Salvo."); return; }
  const fc = e.target.closest("[data-ycomp]");
  if(fc){ e.preventDefault(); const n = byId(yOpen); mutate(() => { n.comp = n.comp || []; n.comp.push({ids:[fc.c.value], n:+fc.n.value}); }); return; }
  const f = e.target.closest("[data-yaddk]"); if(!f) return; e.preventDefault();
  const v = f.v.value.trim(), n = byId(yOpen), k = f.dataset.yaddk; if(!v || !n) return;
  mutate(() => { n[k].push(v); });
  requestAnimationFrame(() => document.querySelector(`[data-yaddk="${k}"] input`)?.focus());
});


async function delLevel(n){
  if(!n || !await A.ask(`Excluir o nível "${n.nome}"? Os requisitos e as marcações dele serão apagados. Dá para desfazer com Ctrl+Z.`)) return;
  snapshot(); setN(N().filter(x => x !== n)); delete st.marc[n.id];
  if(pos().atual === n.id) pos().atual = undefined; if(pos().alvo === n.id) pos().alvo = undefined;
  if(yOpen === n.id) yOpen = null;
  save(); saveContent(); renderCarreira(); closePanel(); toast("Nível excluído.");
}
/* explicação da carreira: abre na gaveta pelo botão "Como funciona" */
function openHelp(){
  const c = career();
  showPanel("Carreira", null, "Como funciona");
  pBody.innerHTML = `${summary()}
        ${c.oficial ? `<p class="hlead">Carreira em Y: uma base comum até o nível sênior e, depois, dois caminhos de mesmo valor. Na trilha técnica você cresce em profundidade e influência; na de gestão, cresce por meio de outras pessoas. O líder técnico é a ponte entre as duas. Quer adaptar para a sua empresa ou para o seu plano? Crie a sua carreira no botão ao lado do seletor, no topo.</p>`
      : `<p class="hlead">${c.d ? esc(c.d) + " " : ""}Esta é uma carreira sua: mude nomes, níveis e requisitos à vontade, aqui ou no mapa mental. A Carreira em Y principal continua igual.</p>`}
    <section><h4>Como ler esta carreira</h4>
      <ul>
        <li><b>Nomes de cargo mudam de empresa para empresa.</b> “Analista II” numa pode ser o “Sênior” de outra. Compare o escopo e o que se espera, não o título.</li>
        <li><b>Subir é aumentar o tamanho do problema que você resolve:</b> tarefa, funcionalidade, área, time, vários times, empresa.</li>
        <li><b>Não há prazo.</b> Tempo de casa não é critério; evidência é. Por isso cada nível tem “o que fazer para provar”.</li>
        <li><b>Gestão não é a promoção natural de quem é bom tecnicamente.</b> É outra profissão. A trilha técnica chega a níveis equivalentes aos de gerência.</li>
        <li><b>Líder técnico é a ponte:</b> o lugar para experimentar liderar sem largar a técnica. Voltar para especialista não é rebaixamento.</li>
        <li><b>Promoção também depende de vaga e do momento da empresa.</b> Use os itens marcados para conversar com seu gestor com fatos, não como garantia.</li>
        <li>Esta escada é uma referência. Ajuste para a sua empresa em <b>Editar</b>, dentro de cada nível.</li>
      </ul></section>
    <section><h4>Escada em Y e mapa mental</h4><ul class="hlist">
      <li><b>Escada em Y:</b> clique num nível para ver os requisitos ao lado. Lápis edita, lixeira exclui, o campo no fim de cada grupo adiciona.</li>
      <li><b>Mapa mental:</b> a mesma carreira em ramos. Clique no + de um nível para abrir os requisitos. Tab cria item, duplo clique edita, Delete exclui.</li>
      <li><b>Minhas carreiras:</b> o ícone ao lado do seletor cria a sua carreira (cópia da principal, só a base ou em branco).</li>
    </ul></section>`;
  pBody.querySelectorAll("[data-n]").forEach(b => b.onclick = () => { closePanel(); toggleReq(b.dataset.n, true); });
  pBody.querySelectorAll("[data-mktrail]").forEach(b => b.onclick = () => makeTrail(byId(b.dataset.mktrail)));
  $("#pClose").focus();
}
$("#cHelp").onclick = openHelp;

/* ---------- gaveta do nível ---------- */
function ticks(n, k, p){
  const on = new Set(st.marc[n.id] || []);
  return `<ul class="ticks">${n[k].map((it, i) => `<li><label><input type="checkbox" data-ck="${p}${i}"${on.has(p + i) ? " checked" : ""}><span>${esc(it)}</span></label></li>`).join("")}</ul>`;
}
const cnt = (n, k, p) => { const on = new Set(st.marc[n.id] || []); return `${n[k].filter((_, i) => on.has(p + i)).length}/${n[k].length}`; };

function openLevel(n){
  if(!n) return;
  const r = RAMOS[n.ramo] || RAMOS.base, tops = topicsOfLevel(n), td = tops.filter(t => done.has(t.id)).length;
  const minis = n.minis.map(id => (A.C.minis || []).find(m => m.id === id)).filter(Boolean);
  const here = pos().atual === n.id, goal = pos().alvo === n.id, nx = nextOf(n);
  showPanel(r.t, r.c, n.nome);
  pBody.innerHTML = `
    <div class="actions">
      <button class="btn" id="cHere" aria-pressed="${here}">${here ? "Você está aqui" : "Estou aqui"}</button>
      <button class="btn" id="cGoal" aria-pressed="${goal}">${goal ? "Seu objetivo" : "Quero chegar aqui"}</button>
      <button class="btn" id="cEdit">${ico("pen")}Editar</button>
      <button class="btn" id="cMap">${ico("map")}Ver no mapa mental</button>
    </div>
    ${n.resumo ? `<p style="margin:0">${esc(n.resumo)}</p>` : ""}
    <dl class="facts one">
      ${n.escopo ? `<div><dt>Escopo</dt><dd>${esc(n.escopo)}</dd></div>` : ""}
      ${n.eq.length ? `<div><dt>Nas empresas costuma se chamar</dt><dd>${esc(n.eq.join(" · "))}</dd></div>` : ""}
    </dl>
    ${n.espera.length ? `<section><h4>O que se espera <span class="count">${cnt(n, "espera", "e")}</span></h4>${ticks(n, "espera", "e")}</section>` : ""}
    <section><h4>O que estudar ${tops.length ? `<span class="count">${td}/${tops.length} dominados</span>` : ""}</h4>
      ${tops.length ? `<ul class="ctopics">${tops.map(t => `<li><button class="ctop${done.has(t.id) ? " on" : ""}" data-t="${esc(t.id)}"><span class="cdot" aria-hidden="true"></span><span>${esc(t.t)}</span><small>${esc(stageOf(t.s) ? "Etapa " + stageOf(t.s).n : "")}${done.has(t.id) ? " · dominado" : ""}</small></button></li>`).join("")}</ul>` : ""}
      ${minis.length ? `<p class="cminis">${minis.map(m => `<a class="btn sm" href="#minimapas/${esc(m.id)}">${ico("grid")}Minimapa: ${esc(m.t)}</a>`).join("")}</p>` : ""}
      ${n.extra.length ? `<p class="labhead">Além da trilha</p><ul class="cextra">${n.extra.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${tops.length || n.extra.length ? `<button class="btn sm primary" id="cTrail">${ico("route")}Criar minha trilha para este nível</button>` : `<p class="muted" style="margin:0">Nenhum tópico ligado a este nível. Ligue tópicos em Editar.</p>`}
    </section>
    ${n.provar.length ? `<section><h4>O que fazer para provar <span class="count">${cnt(n, "provar", "p")}</span></h4><p class="muted" style="margin:0 0 6px">Marque só o que você consegue mostrar: link, documento, número ou alguém que confirme.</p>${ticks(n, "provar", "p")}</section>` : ""}
    ${(n.comp || []).length ? `<section><h4>Competências técnicas <span class="count">${(n.comp || []).map(A.reqStatus).filter(r => r.ok).length}/${n.comp.length}</span></h4><ul class="ctopics">${n.comp.map(r => { const s = A.reqStatus(r);
      return `<li><a class="ctop${s.ok ? " on" : ""}" href="#autoavaliacao/${esc(s.best?.a.id || "")}/${esc(s.best?.it.id || "")}"><span class="cdot" aria-hidden="true"></span><span>${esc(s.nome)} · N${r.n}</span><small>${s.ok ? "atendido" : "você: " + (s.best && s.best.l.n ? "N" + s.best.l.n : "ainda não")}</small></a></li>`; }).join("")}</ul></section>` : ""}
    ${n.comport.length ? `<section><h4>Comportamentos <span class="count">${cnt(n, "comport", "c")}</span></h4>${ticks(n, "comport", "c")}</section>` : ""}
    ${n.trava.length ? `<section><h4>O que costuma travar</h4><ul class="ctrava">${n.trava.map(x => `<li>${esc(x)}</li>`).join("")}</ul></section>` : ""}
    ${nx.length ? `<section><h4>Próximo passo</h4><div class="cnext">${nx.map(x => `<button class="btn sm" data-next="${esc(x.id)}" style="--c:var(${(RAMOS[x.ramo] || RAMOS.base).c})"><i class="cdotc"></i>${esc(x.nome)}</button>`).join("")}</div></section>` : ""}`;
  $("#cHere").onclick = () => { pos().atual = here ? undefined : n.id; save(); renderCarreira(); openLevel(n); };
  $("#cGoal").onclick = () => { pos().alvo = goal ? undefined : n.id; save(); renderCarreira(); openLevel(n); };
  $("#cEdit").onclick = () => editLevel(n);
  $("#cMap").onclick = () => { closePanel(); focusLevel(n.id); };
  const tb = $("#cTrail"); if(tb) tb.onclick = () => makeTrail(n);
  pBody.querySelectorAll("[data-t]").forEach(b => b.onclick = () => A.openPanel(findTopic(b.dataset.t)));
  pBody.querySelectorAll("[data-next]").forEach(b => b.onclick = () => openLevel(byId(b.dataset.next)));
  pBody.querySelectorAll("a[href^='#minimapas']").forEach(a => a.addEventListener("click", closePanel));
  pBody.querySelectorAll("[data-ck]").forEach(cb => cb.onchange = () => {
    const set = new Set(st.marc[n.id] || []); cb.checked ? set.add(cb.dataset.ck) : set.delete(cb.dataset.ck);
    if(set.size) st.marc[n.id] = [...set]; else delete st.marc[n.id];
    save(); renderCarreira();
    const k = KINDS.find(x => x[1] === cb.dataset.ck[0]);
    cb.closest("section").querySelector(".count").textContent = cnt(n, k[0], k[1]);
  });
  $("#pClose").focus();
}

/* trilha própria com os tópicos do nível; os estudos “além da trilha” viram tópicos seus */
async function makeTrail(n){
  const name = `Rumo a ${n.nome}`, exists = A.C.trilhas.find(t => t.t === name);
  if(exists && !await A.ask(`Você já tem a trilha "${name}". Criar outra mesmo assim?`)){ closePanel(); A.openTrail(exists.id); return; }
  const extra = n.extra.length ? [{name:"Além da trilha", goal:`Estudos indicados para ${n.nome} que não estão na trilha principal.`, titles:n.extra, desc:`Indicado para ${n.nome}.`}] : [];
  const tr = A.createTrail(name, n.resumo, n.topicos, extra);
  closePanel(); A.openTrail(tr.id); location.hash = "rota";
  toast(`Trilha "${name}" criada.`);
}

/* ---------- edição do nível ---------- */
function editLevel(n, isNew){
  const r = RAMOS[n.ramo] || RAMOS.base, lines = v => v.split("\n").map(x => x.trim()).filter(Boolean);
  const chosen = new Set(n.topicos);
  showPanel(isNew ? "Novo nível" : "Editando", r.c, n.nome);
  const area = (name, label, hint, rows = 4) => `<label>${label} <span class="muted">${hint}</span><textarea class="in" name="${name}" rows="${rows}">${esc(n[name].join("\n"))}</textarea></label>`;
  pBody.innerHTML = `<form class="form" id="cForm" novalidate>
    <div class="two"><label>Nome<input class="in" name="nome" required value="${esc(n.nome)}"></label>
    <label>Caminho<select class="in" name="ramo">${Object.entries(RAMOS).map(([k, v]) => `<option value="${k}"${k === n.ramo ? " selected" : ""}>${esc(v.t)}</option>`).join("")}</select></label></div>
    <label>Nomes nas empresas <span class="muted">separe por vírgula</span><input class="in" name="eq" value="${esc(n.eq.join(", "))}" placeholder="Ex.: Analista de testes II, QA Engineer"></label>
    <label>Escopo<input class="in" name="escopo" value="${esc(n.escopo)}" placeholder="O tamanho do problema que a pessoa resolve"></label>
    <label>Resumo<textarea class="in" name="resumo" rows="3">${esc(n.resumo)}</textarea></label>
    ${area("espera", "O que se espera", "um por linha")}
    ${area("provar", "O que fazer para provar", "evidências, uma por linha")}
    ${area("comport", "Comportamentos", "um por linha", 3)}
    ${area("trava", "O que costuma travar", "um por linha", 3)}
    ${area("extra", "Estudos além da trilha", "um por linha", 3)}
    <fieldset><legend>Tópicos da trilha para estudar <span class="muted" id="cCnt"></span></legend>
      ${A.C.stages.map(s => { const ts = A.C.topics.filter(t => t.s === s.id); return `<details class="tpick"${ts.some(t => chosen.has(t.id)) ? " open" : ""}><summary>${esc(A.stageLabel(s))}</summary><div class="tpicklist">${ts.map(t => `<label class="checkline"><input type="checkbox" name="top" value="${esc(t.id)}"${chosen.has(t.id) ? " checked" : ""}> <span>${esc(t.t)}</span></label>`).join("")}</div></details>`; }).join("")}
    </fieldset>
    ${(A.C.minis || []).length ? `<fieldset><legend>Minimapas</legend>${A.C.minis.map(m => `<label class="checkline"><input type="checkbox" name="mini" value="${esc(m.id)}"${n.minis.includes(m.id) ? " checked" : ""}> ${esc(m.t)}</label>`).join("")}</fieldset>` : ""}
    <div class="formfoot">
      <button type="button" class="btn ghost danger" id="cDel">${ico("trash")}Excluir nível</button>
      <span class="right"><button type="button" class="btn" id="cCancel">Cancelar</button><button class="btn primary" type="submit">Salvar</button></span>
    </div></form>`;
  const f = $("#cForm"); f.nome.focus(); f.nome.select();
  const count = () => { $("#cCnt").textContent = `· ${f.querySelectorAll("[name=top]:checked").length} escolhidos`; };
  f.addEventListener("change", count); count();
  $("#cCancel").onclick = () => { if(isNew){ setN(N().filter(x => x !== n)); saveContent(); renderCarreira(); closePanel(); } else openLevel(n); };
  $("#cDel").onclick = async () => {
    if(!await A.ask(`Excluir o nível "${n.nome}"? As marcações dele também serão apagadas.`)) return;
    snapshot(); setN(N().filter(x => x !== n)); delete st.marc[n.id];
    if(pos().atual === n.id) pos().atual = undefined; if(pos().alvo === n.id) pos().alvo = undefined;
    save(); saveContent(); renderCarreira(); closePanel(); toast("Nível excluído.");
  };
  f.onsubmit = e => {
    e.preventDefault();
    if(!f.nome.value.trim()){ f.nome.focus(); return; }
    snapshot();
    const ramo = f.ramo.value;
    if(ramo !== n.ramo){ N().splice(N().indexOf(n), 1); const last = of(ramo).pop(); N().splice(last ? N().indexOf(last) + 1 : N().length, 0, n); }
    Object.assign(n, {nome:f.nome.value.trim(), ramo, eq:f.eq.value.split(",").map(x => x.trim()).filter(Boolean),
      escopo:f.escopo.value.trim(), resumo:f.resumo.value.trim(),
      espera:lines(f.espera.value), provar:lines(f.provar.value), comport:lines(f.comport.value), trava:lines(f.trava.value), extra:lines(f.extra.value),
      topicos:[...f.querySelectorAll("[name=top]:checked")].map(c => c.value), minis:[...f.querySelectorAll("[name=mini]:checked")].map(c => c.value)});
    saveContent(); renderCarreira(); openLevel(n); toast("Nível salvo.");
  };
}


/* =====================================================================
   MAPA MENTAL DA CARREIRA: cada nível abre nos seus requisitos
   ===================================================================== */
let mode = store.get("jqa-carreira-modo", null);
const GRUPOS = [["espera","e","O que se espera","target"],["provar","p","O que fazer para provar","flag"],["comport","c","Comportamentos","spark"],["trava","t","O que costuma travar","shield"]];
function mutate(fn){ snapshot(); const r = fn(); saveContent(); renderCarreira(); return r; }
/* as marcações guardam a posição do item; quando itens entram ou saem, reposiciona */
function remap(n, p, fn){
  const old = st.marc[n.id]; if(!old) return;
  const out = old.map(k => k[0] !== p ? k : (fn(+k.slice(1)) >= 0 ? p + fn(+k.slice(1)) : null)).filter(Boolean);
  if(out.length) st.marc[n.id] = out; else delete st.marc[n.id]; save();
}
function toggleMark(n, key){
  const set = new Set(st.marc[n.id] || []); set.has(key) ? set.delete(key) : set.add(key);
  if(set.size) st.marc[n.id] = [...set]; else delete st.marc[n.id]; save(); renderCarreira();
}
function insertItem(n, k, p, at){ n[k].splice(at, 0, "Novo item"); if(p !== "t") remap(n, p, i => i >= at ? i + 1 : i); return `c:${n.id}/${p}${at}`; }
function newLevel(ramo, afterId){
  const n = blankLevel(ramo);
  const after = afterId ? byId(afterId) : (ramo === "gestao" ? [...of("ponte"), ...of("gestao")] : of(ramo)).pop();
  N().splice(after ? N().indexOf(after) + 1 : N().length, 0, n); return "c:" + n.id;
}
function levelNode(n){
  const r = RAMOS[n.ramo] || RAMOS.base, p = prog(n), on = new Set(st.marc[n.id] || []), col = r.c;
  const marks = [pos().atual === n.id ? "você" : "", pos().alvo === n.id ? "objetivo" : ""].filter(Boolean).join(" · ");
  const groups = GRUPOS.filter(([k]) => n[k].length || k !== "trava").map(([k, px, label, icon]) => ({
    id:`c:${n.id}/${k}`, group:true, label, color:col, icon,
    tag:px === "t" ? String(n[k].length) : `${n[k].filter((_, i) => on.has(px + i)).length}/${n[k].length}`,
    add:() => mutate(() => insertItem(n, k, px, n[k].length)),
    children:n[k].map((txt, i) => ({id:`c:${n.id}/${px}${i}`, label:txt, color:col, aria:txt,
      ...(px === "t" ? {} : {check:on.has(px + i), onCheck:() => toggleMark(n, px + i),
        openLabel:on.has(px + i) ? "Desmarcar" : "Já faço isso", onOpen:() => toggleMark(n, px + i)}),
      edit:v => mutate(() => { n[k][i] = v; }),
      sib:() => mutate(() => insertItem(n, k, px, i + 1)),
      del:() => mutate(() => { n[k].splice(i, 1); if(px !== "t") remap(n, px, j => j === i ? -1 : j > i ? j - 1 : j); })}))}));
  const tops = topicsOfLevel(n);
  groups.splice(1, 0, {id:`c:${n.id}/estudar`, group:true, label:"O que estudar", color:col, icon:"book",
    tag:`${tops.filter(t => done.has(t.id)).length}/${tops.length}`, openLabel:"Escolher tópicos", onOpen:() => editLevel(n),
    add:() => { editLevel(n); return false; },
    children:[...tops.map(t => ({id:`c:${n.id}/t:${t.id}`, label:t.t, color:col, done:done.has(t.id), tag:stageOf(t.s) ? "Etapa " + stageOf(t.s).n : "",
        aria:`${t.t}${done.has(t.id) ? ", dominado" : ""}`, openLabel:"Detalhes do tópico", onOpen:() => A.openPanel(t),
        del:() => mutate(() => { n.topicos = n.topicos.filter(x => x !== t.id); })})),
      ...n.extra.map((x, i) => ({id:`c:${n.id}/x${i}`, label:x, color:col, dashed:true, tag:"além da trilha", aria:x,
        edit:v => mutate(() => { n.extra[i] = v; }),
        del:() => mutate(() => { n.extra.splice(i, 1); })}))]});
  if(n.escopo) groups.unshift({id:`c:${n.id}/escopo`, group:true, label:"Escopo", color:col, icon:"layers",
    children:[{id:`c:${n.id}/esc`, label:n.escopo, color:col, aria:n.escopo, edit:v => mutate(() => { n.escopo = v; })}]});
  return {id:"c:" + n.id, label:n.nome, color:col, tag:(marks ? marks + " · " : "") + pct(p) + "%",
    aria:`${n.nome}${marks ? ", " + marks : ""}`, openLabel:"Detalhes", onOpen:() => openLevel(n),
    edit:v => mutate(() => { n.nome = v; }),
    add:() => mutate(() => insertItem(n, "espera", "e", n.espera.length)),
    sib:() => mutate(() => newLevel(n.ramo, n.id)),
    del:() => { A.ask(`Excluir o nível "${n.nome}"?`).then(ok => ok && mutate(() => { setN(N().filter(x => x !== n)); delete st.marc[n.id]; save(); })); return false; },
    children:groups};
}
function buildCareer(){
  const branch = (id, label, color, icon, list, ramo) => ({id, label, color, icon, tag:String(list.length),
    add:() => mutate(() => newLevel(ramo)), children:list.map(levelNode)});
  const c = career();
  return {id:"c:root", label:c.t, aria:c.t, edit:c.oficial ? null : v => mutate(() => { c.t = v; }),
    children:[
      branch("c:g:base", "Base comum", "--e1", "flag", of("base"), "base"),
      branch("c:g:tecnico", "Trilha técnica", "--e3", "target", of("tecnico"), "tecnico"),
      branch("c:g:gestao", "Trilha de gestão", "--e5", "briefcase", [...of("ponte"), ...of("gestao")], "gestao")]};
}
const cmm = createMindMap({svg:$("#csvg"), key:"carreira", build:buildCareer, focusBar:$("#cFocusBar"), undo,
  /* começa com os caminhos abertos e os níveis fechados: cada nível abre nos seus requisitos */
  defaultOpen:n => n.depth === 1,
  controls:{zin:$("#czin"), zout:$("#czout"), fit:$("#czfit"), expand:$("#czexpand"), collapse:$("#czcollapse")}});
function setMode(m){
  mode = m; store.set("jqa-carreira-modo", m);
  document.querySelectorAll("[data-cmode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.cmode === m));
  $("#cScroll").hidden = m === "mapa"; $("#cMapBox").hidden = m !== "mapa";
  if(m === "mapa"){ cmm.render(); requestAnimationFrame(() => cmm.fit()); }
}
document.querySelectorAll("[data-cmode]").forEach(b => b.onclick = () => setMode(b.dataset.cmode));
function focusLevel(id){ setMode("mapa"); requestAnimationFrame(() => cmm.focus("c:" + id)); }
setMode(mode || "escada");

/* =====================================================================
   MINHAS CARREIRAS: cada pessoa monta a sua, ao lado da Carreira em Y principal
   ===================================================================== */
function renderCareerPicker(){
  const sel = $("#cSel");
  sel.innerHTML = `<option value="${OF}">Carreira em Y (principal)</option>`
    + (own().length ? `<optgroup label="Minhas carreiras">${own().map(c => `<option value="${esc(c.id)}">${esc(c.t)}</option>`).join("")}</optgroup>` : "");
  sel.value = career().id;
}
function openCareer(id){ st.cur = id; save(); yOpen = null; cmm.unfocus(); cmm.refit(); renderCarreira(); if(mode === "mapa") requestAnimationFrame(() => cmm.fit()); }
$("#cSel").onchange = e => { openCareer(e.target.value); toast(`Carreira aberta: ${career().t}.`); };
$("#cManage").onclick = () => openCareers();

/* copia níveis com ids novos; as marcações vão junto, para não perder a autoavaliação */
function copyLevels(list, keepMarks){
  return list.map(n => { const c = JSON.parse(JSON.stringify(n)); c.id = uid("n");
    if(keepMarks && st.marc[n.id]) st.marc[c.id] = [...st.marc[n.id]]; return c; });
}
function createCareer(t, d, modo){
  snapshot();
  const niveis = modo === "copia" ? copyLevels(A.C.carreira, true)
    : modo === "base" ? copyLevels(A.C.carreira.filter(n => n.ramo === "base"), true)
    : [blankLevel("base", "Onde estou hoje"), blankLevel("base", "Próximo nível")];
  const c = {id:uid("car"), t, d, niveis};
  own().push(c); save(); saveContent(); return c;
}
function careerRow(c){
  const on = c.id === career().id, n = c.niveis.length;
  return `<div class="trow${on ? " on" : ""}">
    <div class="trinfo"><b>${esc(c.t)}</b>${c.oficial ? '<span class="pill-of">principal</span>' : ""}<small>${n} níveis</small>${c.d ? `<p>${esc(c.d)}</p>` : ""}</div>
    <div class="tracts">
      ${on ? '<span class="muted sm">aberta</span>' : `<button class="btn sm" data-open="${esc(c.id)}">Abrir</button>`}
      ${c.oficial ? "" : `<button class="act" data-edit="${esc(c.id)}" aria-label="Editar ${esc(c.t)}" title="Editar">${ico("pen")}</button>`}
      <button class="act" data-dup="${esc(c.id)}" aria-label="Duplicar ${esc(c.t)}" title="Duplicar">${ico("sib")}</button>
      ${c.oficial ? "" : `<button class="act del" data-del="${esc(c.id)}" aria-label="Excluir ${esc(c.t)}" title="Excluir">${ico("trash")}</button>`}
    </div></div>`;
}
function openCareers(){
  const oficial = {id:OF, t:"Carreira em Y", oficial:true, niveis:A.C.carreira};
  showPanel("Carreiras", null, "Suas carreiras");
  pBody.innerHTML = `
    <p style="margin:0">A Carreira em Y é a referência. Monte a sua ao lado dela: com os cargos da sua empresa, só os níveis que importam para você agora ou um plano do zero. Cada carreira guarda onde você está, o objetivo e o que já marcou.</p>
    <div class="trlist">${[oficial, ...own()].map(careerRow).join("")}</div>
    <section><h4>Nova carreira</h4>
    <form class="form" id="kForm" novalidate>
      <label>Nome<input class="in" name="t" required placeholder="Ex.: Minha carreira, Carreira na empresa X, Plano de estágio"></label>
      <p class="err" id="kErr" hidden>Dê um nome à carreira.</p>
      <label>Objetivo <span class="muted">opcional</span><textarea class="in" name="d" rows="2" placeholder="Ex.: sair do estágio para júnior até ser efetivado"></textarea></label>
      <fieldset><legend>Como começar</legend>
        <label class="checkline"><input type="radio" name="modo" value="copia" checked> Copiar a Carreira em Y inteira e ajustar</label>
        <label class="checkline"><input type="radio" name="modo" value="base"> Só a base comum (Estágio, Júnior, Pleno, Sênior)</label>
        <label class="checkline"><input type="radio" name="modo" value="branco"> Em branco: eu escrevo os níveis e os requisitos</label>
      </fieldset>
      <div class="formfoot"><span></span><span class="right"><button class="btn primary" type="submit">${ico("plus")}Criar carreira</button></span></div>
    </form></section>`;
  const f = $("#kForm");
  f.onsubmit = e => {
    e.preventDefault();
    const t = f.t.value.trim(); $("#kErr").hidden = !!t; if(!t){ f.t.focus(); return; }
    const c = createCareer(t, f.d.value.trim(), f.modo.value);
    closePanel(); openCareer(c.id); toast("Carreira criada. Edite os níveis na escada ou no mapa mental.");
  };
  pBody.querySelector(".trlist").addEventListener("click", async e => {
    const b = e.target.closest("button"); if(!b) return;
    const find = id => id === OF ? oficial : own().find(c => c.id === id);
    if(b.dataset.open){ openCareer(b.dataset.open); openCareers(); }
    else if(b.dataset.edit) editCareer(find(b.dataset.edit));
    else if(b.dataset.dup){
      const src = find(b.dataset.dup); snapshot();
      const c = {id:uid("car"), t:(src.oficial ? "Minha Carreira em Y" : src.t + " (cópia)"), d:src.d || "", niveis:copyLevels(src.niveis, true)};
      own().push(c); save(); saveContent(); openCareer(c.id); openCareers(); toast(`Criada: ${c.t}.`);
    }
    else if(b.dataset.del){
      const c = find(b.dataset.del);
      if(!await A.ask(`Excluir a carreira "${c.t}"? Os níveis e as marcações dela serão apagados.`)) return;
      snapshot(); c.niveis.forEach(n => delete st.marc[n.id]); delete st.pos[c.id];
      A.C.carreiras = own().filter(x => x !== c); if(st.cur === c.id) st.cur = OF;
      save(); saveContent(); openCareer(career().id); openCareers(); toast("Carreira excluída.");
    }
  });
}
function editCareer(c){
  showPanel("Carreiras", null, "Editar carreira");
  pBody.innerHTML = `<form class="form" id="kEdit" novalidate>
    <label>Nome<input class="in" name="t" required value="${esc(c.t)}"></label>
    <label>Objetivo<textarea class="in" name="d" rows="3">${esc(c.d || "")}</textarea></label>
    <p class="muted" style="margin:0">Os níveis e os requisitos são editados na escada ou no mapa mental, com esta carreira aberta.</p>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" id="kBack">Voltar</button><button class="btn primary" type="submit">Salvar</button></span></div></form>`;
  const f = $("#kEdit"); f.t.focus();
  $("#kBack").onclick = openCareers;
  f.onsubmit = e => { e.preventDefault(); if(!f.t.value.trim()) return f.t.focus();
    snapshot(); c.t = f.t.value.trim(); c.d = f.d.value.trim(); saveContent(); renderCarreira(); openCareers(); toast("Carreira salva."); };
}


/* resumo para a home: onde estou, objetivo, o que falta e o próximo item */
function careerSummary(){
  const p = pos(), cur = byId(p.atual), alvo = byId(p.alvo), gap = alvo ? prog(alvo) : null;
  let next = null;
  if(alvo){ const on = new Set(st.marc[alvo.id] || []);
    for(const [k, px] of KINDS){ const i = alvo[k].findIndex((_, j) => !on.has(px + j)); if(i >= 0){ next = alvo[k][i]; break; } } }
  const comp = alvo ? (alvo.comp || []).map(A.reqStatus) : [];
  return {career:career(), cur, alvo, gap, next, pct:gap ? pct(gap) : 0, niveis:N().length, comp};
}
function showLevel(id){ setMode("escada"); yOpen = id; location.hash = "carreira"; requestAnimationFrame(() => renderCarreira()); }
Object.assign(A, {careerSummary, showLevel, renderCarreira, openLevel, carreiraState:st, focusLevel, fitCareer:() => { if(mode === "mapa") requestAnimationFrame(() => cmm.fit()); }});
})(JQA.app);
