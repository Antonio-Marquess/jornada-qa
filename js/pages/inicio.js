/* Jornada QA — Início: apresentação para quem chega e painel para quem volta, sempre da jornada aberta.
 * Também cuida das jornadas (áreas de estudo): trocar, criar, renomear e excluir. */
(function(A){
const {$, esc, ico, uid, store, raw, toast, done, showPanel, closePanel, pBody, trail, topicsOf, trailTopics, stageLabel, area, isOfficialArea, openArea, dropAreaData, OWN_AREAS, ALL_AREAS} = A;

let forceIntro = false;   /* "ver a apresentação" mesmo com progresso */

/* ---------- dados calculados ---------- */
const hasProgress = () => (A.compCounts?.() || [1, 0, 0, 0]).slice(1).some(Boolean) || done.size > 0 || Object.keys(A.notes).length > 0 || Object.keys(A.checks).length > 0 || !!A.careerSummary().cur;
function nextTopic(){
  const all = trailTopics();
  return all.find(t => !done.has(t.id) && t.pr === "Essencial") || all.find(t => !done.has(t.id)) || null;
}
const STOP = new Set(["testes","teste","para","como","com","dos","das","de","do","da","e","em","no","na","um","uma","o","a"]);
function promptFor(t){
  if(!t) return null;
  const words = [...t.tech, ...t.t.split(/\s+/)].map(w => w.toLowerCase()).filter(w => w.length >= 3 && !STOP.has(w));
  let best = null, score = 0;
  (A.C.prompts || []).forEach(p => {
    const hay = `${p.t} ${p.d || ""} ${p.c || ""} ${p.quando || ""}`.toLowerCase();
    const sc = words.filter(w => hay.includes(w)).length;
    if(sc > score){ score = sc; best = p; }
  });
  return best;
}
const pctOf = (a, b) => b ? Math.round(a / b * 100) : 0;

/* ---------- gráficos: desempenho e atividade ---------- */
const DAY = 864e5;
const keyOf = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dm = d => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
function stats(){
  const tr = trail(), all = trailTopics(tr), d = all.filter(t => done.has(t.id)).length;
  const est = all.reduce((n, t) => n + t.est.length, 0), estOn = all.reduce((n, t) => n + (A.checks[t.id] || []).filter(k => k[0] === "e" && +k.slice(1) < t.est.length).length, 0);
  const log = store.get("jqa-atividade", {}), now = new Date();
  let dias30 = 0; for(let i = 0; i < 30; i++) if(log[keyOf(new Date(now - i * DAY))]) dias30++;
  /* sequência: dias seguidos com atividade, contando de hoje (ou de ontem, se hoje ainda não teve) */
  let seq = 0, i = log[keyOf(now)] ? 0 : 1; while(log[keyOf(new Date(now - i * DAY))]){ seq++; i++; }
  return {tr, all, d, est, estOn, log, dias30, seq};
}
function tiles(S){
  const pct = S.all.length ? Math.round(S.d / S.all.length * 100) : 0;
  const t = [
    [`${pct}%`, "da trilha dominada", `${S.d} de ${S.all.length} tópicos`],
    [`${S.estOn}`, "itens de estudo marcados", `de ${S.est} no total`],
    [`${S.dias30}`, "dias com estudo", "nos últimos 30 dias"],
    [`${S.seq}`, S.seq === 1 ? "dia seguido" : "dias seguidos", S.seq ? "não quebre a sequência" : "comece hoje"]
  ];
  return `<div class="htiles">${t.map(([v, l, s]) => `<div class="htile"><b>${v}</b><span>${l}</span><small>${s}</small></div>`).join("")}</div>`;
}
/* barras horizontais com rótulo e valor; uma linha por categoria */
function hbars(rows, label){
  return `<div class="hbars" role="list" aria-label="${esc(label)}">${rows.map(r => `<div class="hbrow" role="listitem" data-tip="${esc(r.tip)}" tabindex="0">
    <span class="hbl">${esc(r.l)}</span><span class="hbt"><i style="width:${r.p}%;background:var(${r.c || "--brand"})"></i></span><span class="hbv">${esc(r.v)}</span></div>`).join("")}</div>`;
}
function stageChart(S){
  return hbars(S.tr.stages.map(st => { const ts = topicsOf(st), n = ts.filter(x => done.has(x.id)).length, p = ts.length ? Math.round(n / ts.length * 100) : 0;
    return {l:`${st.n} · ${st.name}`, p, v:`${n}/${ts.length}`, c:st.color, tip:`${stageLabel(st)}: ${n} de ${ts.length} tópicos dominados (${p}%)`}; }), "Tópicos dominados por etapa");
}
function prioChart(S){
  const ord = [...A.PRIOS, ...new Set(S.all.map(t => t.pr).filter(x => !A.PRIOS.includes(x)))];
  return hbars(ord.map(pr => { const ts = S.all.filter(t => t.pr === pr), n = ts.filter(t => done.has(t.id)).length;
    return ts.length ? {l:pr, p:Math.round(n / ts.length * 100), v:`${n}/${ts.length}`, tip:`${pr}: ${n} de ${ts.length} dominados`} : null; }).filter(Boolean), "Tópicos dominados por prioridade");
}
function activityChart(S){
  /* 8 semanas, de segunda a domingo; a última é a atual */
  const now = new Date(), wd = (now.getDay() + 6) % 7, mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - wd);
  const weeks = [];
  for(let w = 7; w >= 0; w--){
    const start = new Date(mon - w * 7 * DAY); let acts = 0, days = 0;
    for(let i = 0; i < 7; i++){ const v = S.log[keyOf(new Date(+start + i * DAY))] || 0; acts += v; if(v) days++; }
    weeks.push({start, acts, days});
  }
  const total = weeks.reduce((n, w) => n + w.days, 0);
  return `<div class="hcols" role="list" aria-label="Dias com estudo por semana">${weeks.map((w, i) => `<div class="hcol${i === 7 ? " now" : ""}" role="listitem" tabindex="0"
      data-tip="Semana de ${dm(w.start)}: ${w.days} ${w.days === 1 ? "dia" : "dias"} com estudo, ${w.acts} ${w.acts === 1 ? "marcação ou anotação" : "marcações e anotações"}">
      <span class="hcv">${w.days || ""}</span><span class="hcb"><i style="height:${Math.round(w.days / 7 * 100)}%"></i></span><span class="hcl">${i === 7 ? "agora" : dm(w.start)}</span></div>`).join("")}</div>
    ${total ? "" : `<p class="muted hempty">Começa a contar a partir de agora: cada tópico, item ou requisito marcado e cada anotação contam no dia.</p>`}`;
}
function careerChart(cs){
  const on = new Set(A.carreiraState.marc[cs.alvo.id] || []), g = [["espera","e","O que se espera"],["provar","p","Provas"],["comport","c","Comportamentos"]];
  const rows = g.map(([k, px, l]) => { const n = cs.alvo[k].filter((_, i) => on.has(px + i)).length, t = cs.alvo[k].length;
    return t ? {l, p:Math.round(n / t * 100), v:`${n}/${t}`, c:"--e3", tip:`${l}: ${n} de ${t}`} : null; }).filter(Boolean);
  if(cs.comp?.length){ const ok = cs.comp.filter(r => r.ok).length; rows.push({l:"Competências técnicas", p:Math.round(ok / cs.comp.length * 100), v:`${ok}/${cs.comp.length}`, c:"--e3", tip:`Competências no nível exigido: ${ok} de ${cs.comp.length}`}); }
  if(cs.gap.tt) rows.push({l:"Tópicos", p:Math.round(cs.gap.td / cs.gap.tt * 100), v:`${cs.gap.td}/${cs.gap.tt}`, c:"--e3", tip:`Tópicos do nível: ${cs.gap.td} de ${cs.gap.tt} dominados`});
  return hbars(rows, `Requisitos de ${cs.alvo.nome}`);
}
function compChart(){
  const c = A.compCounts?.() || [0, 0, 0, 0], tot = c.reduce((x, y) => x + y, 0); if(!tot) return "";
  const nomes = ["Ainda não", "N1 · Conheço", "N2 · Pratico", "N3 · Domino"];
  return `<section class="hcard"><span class="hlabel">Suas competências</span><span class="hsubl">${tot} tecnologias e assuntos da autoavaliação</span>
    ${hbars([3, 2, 1, 0].map(n => ({l:nomes[n], p:Math.round(c[n] / tot * 100), v:String(c[n]), c:["--lv0","--lv1","--lv2","--lv3"][n], tip:`${nomes[n]}: ${c[n]} de ${tot}`})), "Competências por nível")}
    <a class="btn sm" href="#autoavaliacao${c[0] === tot ? "" : "/resultado"}">${c[0] === tot ? "Fazer minha autoavaliação" : "Ver meu resultado"}</a></section>`;
}
function charts(S, cs){
  return `<div class="hcharts">${blk("Suas competências", compChart)}
    ${blk("Tópicos dominados por etapa", () => `<section class="hcard"><span class="hlabel">Tópicos dominados por etapa</span>${stageChart(S)}</section>`)}
    ${blk("Sua constância", () => `<section class="hcard"><span class="hlabel">Sua constância</span><span class="hsubl">dias com estudo por semana, nas últimas 8</span>${activityChart(S)}</section>`)}
    ${blk("Essencial primeiro?", () => `<section class="hcard"><span class="hlabel">Essencial primeiro?</span><span class="hsubl">tópicos dominados por prioridade</span>${prioChart(S)}</section>`)}
    ${blk("Carreira", () => cs.alvo ? `<section class="hcard"><span class="hlabel">Rumo a ${esc(cs.alvo.nome)}</span><span class="hsubl">requisitos da carreira que você já marcou</span>${careerChart(cs)}
      <button class="btn sm" data-hlevel="${esc(cs.alvo.id)}">Ver requisitos</button></section>`
    : `<section class="hcard"><span class="hlabel">Carreira</span><p class="muted">Marque onde você está e um objetivo para ver aqui o quanto falta.</p><a class="btn sm" href="#carreira">Marcar meu nível</a></section>`)}
  </div>`;
}

/* ---------- blocos ---------- */
/* monta um bloco; se der erro, mostra um aviso no lugar dele com os detalhes para copiar */
function blk(nome, fn, inline){
  try{ return fn(); }catch(e){
    console.error(`Início · ${nome || "bloco"}:`, e);
    if(inline) return "—";
    const det = String(e && (e.stack || e.message) || e).split("\n").slice(0, 4).join("\n");
    return `<section class="hcard herr"><span class="hlabel">${esc(nome)}</span>
      <p>Esta parte não carregou por causa de um erro. O resto do Início continua funcionando.</p>
      <details><summary>Detalhes do erro</summary><pre>${esc(det)}</pre></details>
      <button class="btn sm" data-hcopy="${esc(`${nome}: ${det}`)}">Copiar detalhes</button></section>`;
  }
}
/* lembrete de backup: os dados ficam só neste navegador; avisa se nunca houve backup ou se faz 30 dias */
function backupNote(){
  const em = store.get("jqa-backup-em", null), adiado = store.get("jqa-backup-adiado", null), hoje = Date.now();
  const dias = d => Math.floor((hoje - new Date(d + "T12:00:00")) / 864e5);
  if(adiado && dias(adiado) < 7) return "";
  if(em && dias(em) < 30) return "";
  const msg = em ? `Seu último backup foi há ${dias(em)} dias.` : "Você ainda não fez nenhum backup.";
  return `<p class="hnote hbackup">${ico("db")}<span>${msg} Seu progresso, anotações e cadernos ficam só neste navegador: se limpar os dados dele ou trocar de computador, perde tudo.</span>
    <span class="hbtns"><button class="btn sm primary" id="hBackup">Baixar backup</button><button class="btn sm ghost" id="hBackupLater">Agora não</button></span></p>`;
}
function intro(){
  const a = area(), tops = A.C.topics.filter(t => A.C.stages.some(s => s.id === t.s)).length, st = A.C.stages.length;
  const prompts = (A.C.prompts || []).length, vazia = !tops;
  const lead = vazia
    ? `Uma jornada nova, em branco: monte a trilha de ${esc(a.nome)} com etapas e tópicos, ajuste a carreira em Y e junte seus materiais. Tudo fica salvo neste navegador.`
    : `Uma trilha de ${tops} tópicos em ${st} etapas, uma carreira em Y com o que estudar em cada nível${prompts ? ` e ${prompts} prompts prontos` : ""}. Grátis, no seu navegador, sem cadastro.`;
  let S = null; try{ S = stats(); }catch(e){ console.error(e); }
  return `
    <section class="hhero">
      <span class="hkicker">${esc(A.J.NOME || "Jornada")}</span>
      <h2>${esc(a.frase || `Sua jornada em ${a.nome}: trilha, carreira e mapas, do seu jeito.`)}</h2>
      <p>${lead}</p>
    </section>
    <section class="hsec"><h3>Onde você está?</h3>
      <div class="hchoices">
        <a class="hchoice" href="#rota" style="--c:var(--e1)"><span class="hci">${ico("search")}</span><b>Estou começando</b><span>${vazia ? "Comece montando a primeira etapa da trilha." : "Comece pela primeira etapa da trilha, no seu ritmo."}</span><em>Começar a trilha →</em></a>
        <a class="hchoice" href="#carreira" style="--c:var(--e3)"><span class="hci">${ico("career")}</span><b>Já trabalho na área</b><span>Marque seu nível na carreira em Y e veja, item por item, o que falta para o próximo.</span><em>Ver minha carreira →</em></a>
        <a class="hchoice" href="#minimapas" style="--c:var(--e4)"><span class="hci">${ico("target")}</span><b>Quero me especializar</b><span>Um mapa mental por assunto, com o que estudar e onde praticar.</span><em>Ver minimapas →</em></a>
      </div></section>
    <section class="hsec"><h3>Seu desempenho</h3>
      <p class="muted hsub">Os números e gráficos crescem conforme você marca tópicos, itens de estudo e requisitos da carreira.</p>
      ${blk("Seus números", () => tiles(S))}${blk("Gráficos", () => charts(S, A.careerSummary()))}</section>`;
}

/* lembrete: reavaliar as competências a cada 30 dias */
function reavaliar(){
  const d = A.lastEval?.(); if(!d) return "";
  const dias = Math.floor((Date.now() - new Date(d + "T12:00:00")) / 864e5);
  return dias >= 30 ? `<p class="hnote hremind">${ico("gauge")}<span>Faz ${dias} dias da sua última autoavaliação. O que você aprendeu desde então já subiu algum nível?</span><a class="btn sm" href="#autoavaliacao">Reavaliar</a></p>` : "";
}
function contBlock(all){
  const t = nextTopic(), on = t ? new Set(A.checks[t.id] || []) : null, s = t ? A.stageIn(t) : null;
  return t ? `
    <section class="hcard hcont" style="--c:var(${s?.color || "--e1"})">
      <span class="hlabel">Continuar de onde parou</span>
      <div><span class="hstage">${esc(stageLabel(s))} · ${esc(t.pr)}</span>
        <h3>${esc(t.t)}</h3>${t.d ? `<p class="muted">${esc(t.d)}</p>` : ""}</div>
      ${t.est.length ? `<ul class="hchecks">${t.est.map((e, i) => `<li><label><input type="checkbox" data-hck="${esc(t.id)}" data-k="e${i}"${on.has("e" + i) ? " checked" : ""}><span>${esc(e)}</span></label></li>`).join("")}</ul>` : ""}
      <div class="hbtns"><button class="btn primary" data-hopen="${esc(t.id)}">Continuar estudando</button><button class="btn" data-hmap="${esc(t.id)}">${ico("map")}Ver no mapa</button>
        ${t.est.length ? `<span class="muted hcount">${t.est.filter((_, i) => on.has("e" + i)).length} de ${t.est.length} itens estudados</span>` : ""}</div>
    </section>` : `
    <section class="hcard hcont"><span class="hlabel">Continuar de onde parou</span>
      <h3>${all.length ? "Você dominou todos os tópicos desta trilha." : "Esta trilha ainda não tem tópicos."}</h3>
      <p class="muted">${all.length ? "Escolha um objetivo maior na Carreira ou monte uma trilha nova." : "Crie etapas e tópicos no Mapa: Tab cria filho, Enter cria irmão."}</p>
      <div class="hbtns"><a class="btn primary" href="#${all.length ? "carreira" : "mapa"}">${all.length ? "Ver a carreira" : "Montar no mapa"}</a></div></section>`;
}
function camBlock(){
  const cs = A.careerSummary();
  return cs.cur ? `
    <section class="hcard hcam"><span class="hlabel">Seu caminho</span>
      <h3>${esc(cs.cur.nome)}${cs.alvo ? ` <span class="muted">→</span> ${esc(cs.alvo.nome)}` : ""}</h3>
      ${cs.alvo ? `<div class="hbig"><b>${cs.pct}%</b><span class="muted">do objetivo</span></div>
        <span class="muted">Faltam ${cs.gap.t - cs.gap.a} de ${cs.gap.t} itens e ${cs.gap.tt - cs.gap.td} de ${cs.gap.tt} tópicos</span>
        ${cs.next ? `<p><b>Próximo item:</b> ${esc(cs.next)}</p>` : ""}`
      : `<p class="muted">Escolha um objetivo para ver o que falta.</p><button class="btn sm" data-hlevel="${esc(cs.cur.id)}">Escolher objetivo</button>`}
    </section>` : `
    <section class="hcard hcam"><span class="hlabel">Seu caminho</span>
      <h3>Onde você está na carreira?</h3><p class="muted">Marque seu nível e um objetivo para ver o que falta.</p>
      <a class="btn sm" href="#carreira">Marcar meu nível</a></section>`;
}
function extrasBlock(all){
  const t = nextTopic(), p = promptFor(t), notas = all.filter(x => A.notes[x.id]).slice(0, 4);
  const hoje = (p || t?.x) ? `
    <section class="hcard hhoje"><span class="hlabel">Para hoje</span>
      ${p ? `<button class="hmini" data-hprompt="${esc(p.id)}"><span class="hmk" style="color:var(--e4)">Prompt · ${esc(p.n || "")}</span><b>${esc(p.t)}</b><span class="muted">Combina com o tópico que você está estudando.</span></button>` : ""}
      ${t?.x ? `<button class="hmini" data-hopen="${esc(t.id)}"><span class="hmk" style="color:var(--e2)">Exercício</span><b>${esc(t.t)}</b><span class="muted">${esc(t.x.length > 140 ? t.x.slice(0, 139) + "…" : t.x)}</span></button>` : ""}
    </section>` : "";
  const notes = notas.length ? `
    <section class="hcard hnotas"><span class="hlabel">Suas anotações</span>
      <div class="hnotegrid">${notas.map(x => `<button class="hmini" data-hopen="${esc(x.id)}"><b>${esc(x.t)}</b><span class="muted">${esc(A.notes[x.id].slice(0, 140))}${A.notes[x.id].length > 140 ? "…" : ""}</span></button>`).join("")}</div></section>` : "";
  return hoje || notes ? `<div class="hgrid2">${hoje}${notes}</div>` : "";
}
/* cada bloco é montado à parte: se um der erro, só ele mostra o aviso e o resto do Início aparece */
function dashboard(){
  let S = null; const getS = () => S || (S = stats());
  const all = () => getS().all;
  return `
    <header class="hhead"><div><h2>Bom te ver de volta</h2>
      <p class="muted">Trilha aberta: <b>${blk("", () => esc(trail().t), true)}</b></p></div>
      <div class="hbtns"><button class="btn" id="hTrail">${ico("route")}Trocar trilha</button><button class="btn ghost" id="hIntro">Ver a apresentação</button></div></header>
    ${blk("Lembrete de backup", backupNote)}
    ${blk("Lembrete da autoavaliação", reavaliar)}
    ${blk("Seus números", () => tiles(getS()))}
    <div class="hgrid">${blk("Continuar de onde parou", () => contBlock(all()))}${blk("Seu caminho", camBlock)}</div>
    ${blk("Gráficos", () => charts(getS(), A.careerSummary()))}
    ${blk("Para hoje e anotações", () => extrasBlock(all()))}`;
}

function renderHome(){
  const root = $("#inicioPage");
  let prog = true; try{ prog = hasProgress(); }catch(e){ console.error(e); }
  const intro_ = forceIntro || !prog;
  root.innerHTML = intro_ ? (prog ? `<p style="margin:0"><button class="btn" id="hBack">${ico("back")}Voltar ao meu painel</button></p>` : "") + blk("Apresentação", intro) : dashboard();
}
$("#inicioPage").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  if(b.dataset.hopen) A.openPanel(A.findTopic(b.dataset.hopen));
  else if(b.dataset.hmap) A.focusTopic(b.dataset.hmap);
  else if(b.dataset.hlevel) A.showLevel(b.dataset.hlevel);
  else if(b.dataset.hprompt){ const p = A.C.prompts.find(x => x.id === b.dataset.hprompt); location.hash = "prompts"; setTimeout(() => A.openPrompt(p), 60); }
  else if(b.dataset.harea) openArea(b.dataset.harea);
  else if(b.id === "hTrail") A.openTrails();
  else if(b.id === "hBackup") A.exportBackup().then(() => renderHome());
  else if(b.id === "hBackupLater"){ store.set("jqa-backup-adiado", A.today()); renderHome(); }
  else if(b.dataset.hcopy){ navigator.clipboard?.writeText(b.dataset.hcopy).then(() => toast("Detalhes copiados. Cole na conversa para eu ver."), () => toast("Não deu para copiar; selecione o texto do erro.")); }
  else if(b.id === "hIntro"){ forceIntro = true; renderHome(); $("#v-inicio").scrollTop = 0; }
  else if(b.id === "hBack"){ forceIntro = false; renderHome(); }
});
$("#inicioPage").addEventListener("change", e => {
  const cb = e.target.closest("[data-hck]"); if(!cb) return;
  const id = cb.dataset.hck, set = new Set(A.checks[id] || []); cb.checked ? set.add(cb.dataset.k) : set.delete(cb.dataset.k);
  if(set.size) A.checks[id] = [...set]; else delete A.checks[id];
  store.set("jqa-checklists", A.checks); renderHome();
});

/* dica ao passar o mouse ou focar uma barra dos gráficos */
const tip = document.createElement("div"); tip.className = "htip"; tip.hidden = true; tip.setAttribute("role", "tooltip"); document.body.appendChild(tip);
function showTip(el){ const r = el.getBoundingClientRect(); tip.textContent = el.dataset.tip; tip.hidden = false;
  const w = tip.offsetWidth; tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px"; tip.style.top = (r.top - tip.offsetHeight - 8) + "px"; }
["mouseover", "focusin"].forEach(ev => document.querySelector(".stage-area").addEventListener(ev, e => { const el = e.target.closest("[data-tip]"); if(el) showTip(el); }));
["mouseout", "focusout"].forEach(ev => document.querySelector(".stage-area").addEventListener(ev, e => { if(e.target.closest("[data-tip]")) tip.hidden = true; }));
$("#v-inicio").addEventListener("scroll", () => { tip.hidden = true; });

/* ---------- jornadas: trocar, criar, renomear, excluir ---------- */
function setBrand(){
  const a = area();
  $("#brandT").textContent = a.titulo; $("#brandS").textContent = a.sub || "";
}
function openAreas(focusNew){
  const cur = area();
  showPanel("Jornadas", null, "Suas jornadas");
  pBody.innerHTML = `
    <p style="margin:0">Cada jornada é uma área de estudo separada, com trilha, carreira, minimapas, prompts, biblioteca e progresso próprios. Trocar de jornada não apaga nada.</p>
    <div class="trlist">${ALL_AREAS().map(a => `<div class="trow${a.id === cur.id ? " on" : ""}">
      <div class="trinfo"><b>${esc(a.titulo)}</b>${a.oficial ? '<span class="pill-of">pronta</span>' : ""}<small>${a.oficial ? "Conteúdo completo, editável" : "Criada por você"}</small>${a.frase && !a.oficial ? `<p>${esc(a.frase)}</p>` : ""}</div>
      <div class="tracts">${a.id === cur.id ? '<span class="muted sm">aberta</span>' : `<button class="btn sm" data-aopen="${esc(a.id)}">Abrir</button>`}
        ${a.oficial ? "" : `<button class="act" data-aedit="${esc(a.id)}" aria-label="Editar ${esc(a.titulo)}" title="Editar">${ico("pen")}</button><button class="act del" data-adel="${esc(a.id)}" aria-label="Excluir ${esc(a.titulo)}" title="Excluir">${ico("trash")}</button>`}</div></div>`).join("")}</div>
    <section><h4>Nova jornada</h4>
    <form class="form" id="aForm" novalidate>
      <label>Área<input class="in" name="nome" required placeholder="Ex.: Dados, Front-end, UX, DevOps"></label>
      <p class="err" id="aErr" hidden>Dê um nome à área.</p>
      <label>Frase de abertura <span class="muted">opcional</span><input class="in" name="frase" placeholder="Ex.: De analista de dados júnior a sênior, com projetos reais"></label>
      <p class="muted" style="margin:0">Começa em branco: uma etapa vazia na trilha e uma carreira em Y genérica (estágio a head) para você ajustar.</p>
      <div class="formfoot"><span></span><span class="right"><button class="btn primary" type="submit">${ico("plus")}Criar e abrir</button></span></div>
    </form></section>`;
  const f = $("#aForm"); if(focusNew) f.nome.focus();
  f.onsubmit = e => {
    e.preventDefault();
    const nome = f.nome.value.trim(); $("#aErr").hidden = !!nome; if(!nome){ f.nome.focus(); return; }
    let id = (A.J.slug ? A.J.slug(nome) : nome.toLowerCase().replace(/[^a-z0-9]+/g, "-")).slice(0, 30) || "area";
    if(ALL_AREAS().some(a => a.id === id)) id = id + "-" + Date.now().toString(36).slice(-4);
    const list = OWN_AREAS(); list.push({id, nome, titulo:"Jornada " + nome, sub:"", frase:f.frase.value.trim()});
    raw.set("jqa-areas", list); openArea(id);
  };
  pBody.querySelector(".trlist").addEventListener("click", async e => {
    const b = e.target.closest("button"); if(!b) return;
    if(b.dataset.aopen) openArea(b.dataset.aopen);
    else if(b.dataset.aedit) editArea(b.dataset.aedit);
    else if(b.dataset.adel){
      const a = ALL_AREAS().find(x => x.id === b.dataset.adel);
      if(!await A.ask(`Excluir a jornada "${a.titulo}"? A trilha, a carreira, as anotações e o progresso dela serão apagados deste navegador. Os cadernos dela também. Não dá para desfazer; exporte um backup antes se quiser guardar.`)) return;
      raw.set("jqa-areas", OWN_AREAS().filter(x => x.id !== a.id)); dropAreaData(a.id); A.files.clearArea(a.id).catch(() => {});
      if(a.id === cur.id) openArea((A.J.AREAS || [{id:"qa"}])[0].id); else { openAreas(); toast("Jornada excluída."); }
    }
  });
}
function editArea(id){
  const a = OWN_AREAS().find(x => x.id === id);
  showPanel("Jornadas", null, "Editar jornada");
  pBody.innerHTML = `<form class="form" id="aEdit" novalidate>
    <label>Nome na barra lateral<input class="in" name="titulo" required value="${esc(a.titulo)}"></label>
    <label>Subtítulo <span class="muted">opcional</span><input class="in" name="sub" value="${esc(a.sub || "")}"></label>
    <label>Frase de abertura<input class="in" name="frase" value="${esc(a.frase || "")}"></label>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" id="aBack">Voltar</button><button class="btn primary" type="submit">Salvar</button></span></div></form>`;
  const f = $("#aEdit"); f.titulo.focus();
  $("#aBack").onclick = () => openAreas();
  f.onsubmit = e => { e.preventDefault(); if(!f.titulo.value.trim()) return f.titulo.focus();
    raw.set("jqa-areas", OWN_AREAS().map(x => x.id === id ? {...x, titulo:f.titulo.value.trim(), sub:f.sub.value.trim(), frase:f.frase.value.trim()} : x));
    setBrand(); renderHome(); A.renderTrailPicker?.(); openAreas(); toast("Jornada salva."); };
}
$("#areaBtn").onclick = () => openAreas();

/* abas que só existem na jornada com conteúdo pronto */
if(!area().conteudo) document.querySelectorAll('.nav a[data-tab="ia"], .nav a[data-tab="projetos"]').forEach(a => a.hidden = true);
setBrand();

Object.assign(A, {renderHome, openAreas});
})(JQA.app);
