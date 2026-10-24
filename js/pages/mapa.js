/* Jornada QA — Mapa mental da trilha: etapas › tópicos › o que estudar, tecnologias e materiais. */
(function(A){
const {$, esc, store, toast, done, saveContent, snapshot, undo, updateMeter, trail, topicsOf, findTopic, blankTopic, placeTopic, removeTopic, removeLabel, deleteStage, newStageIn, stageOf, createMindMap} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const renderRoute = (...a) => A.renderRoute(...a),
      openPanel = (...a) => A.openPanel(...a);

const STAGE_ICONS = {e1:"search", e2:"briefcase", e3:"layers", e4:"target", e5:"flag"};
const FALLBACK_ICONS = ["search","briefcase","layers","target","flag"];
const stageIcon = s => STAGE_ICONS[s.id] || FALLBACK_ICONS[trail().stages.indexOf(s) % FALLBACK_ICONS.length];
let query = "";
const q = () => query.trim().toLowerCase();
const has = (s, k) => String(s || "").toLowerCase().includes(k);

/* um tópico combina com a busca pelo título, descrição, tecnologias, o que estudar ou anotação */
const matches = t => { const k = q(); if(!k) return true;
  return has(t.t + " " + t.tech.join(" ") + " " + (t.d || "") + " " + (t.est || []).join(" ") + " " + (A.notes[t.id] || ""), k); };

function renderLegend(){
  $("#legend").innerHTML = trail().stages.map(s => `<span><i style="background:var(${s.color})"></i>${esc(s.n)} ${esc(s.name)}</span>`).join("")
    + `<span><i class="iak"></i>Tópico de IA</span><span><i class="nk"></i>Tem anotação</span><span><i class="hlk"></i>Já domino</span>`;
}

function toggleCheck(t, key){
  const set = new Set(A.checks[t.id] || []); set.has(key) ? set.delete(key) : set.add(key);
  if(set.size) A.checks[t.id] = [...set]; else delete A.checks[t.id];
  store.set("jqa-checklists", A.checks); renderMap();
}

/* ---------- edição pelo mapa ---------- */
const findT = findTopic;
/* depois de mudar o conteúdo: salva e atualiza as outras telas (o mapa se redesenha sozinho) */
function changed(){ saveContent(); updateMeter(); renderRoute(); renderLegend(); A.refreshMini?.(); A.renderTrailPicker?.(); }
function mutate(fn){ snapshot(); const r = fn(); changed(); return r; }
/* reindexa as marcações de "o que estudar" quando itens entram, saem ou mudam de lugar */
function remapChecks(t, map){
  const old = A.checks[t.id]; if(!old) return;
  const out = old.map(k => k[0] === "e" ? (map(+k.slice(1)) >= 0 ? "e" + map(+k.slice(1)) : null) : k).filter(Boolean);
  if(out.length) A.checks[t.id] = out; else delete A.checks[t.id];
  store.set("jqa-checklists", A.checks);
}
function newTopic(stageId, afterId){
  const st = stageOf(stageId), t = blankTopic(stageId);
  placeTopic(t, st, afterId); return t.id;
}
function newStage(afterId){ return "st:" + newStageIn(afterId).id; }
function insertEst(t, at, text){
  t.est.splice(at, 0, text || "Novo item");
  remapChecks(t, i => i >= at ? i + 1 : i);
  return t.id + "/e" + at;
}
function moveTopic(t, stageId, afterId){ if(t.id !== afterId) placeTopic(t, stageOf(stageId), afterId); }
function moveEst(from, fi, to, ti){
  const [txt] = from.est.splice(fi, 1);
  const wasOn = (A.checks[from.id] || []).includes("e" + fi);
  remapChecks(from, i => i === fi ? -1 : i > fi ? i - 1 : i);
  if(ti == null || ti > to.est.length) ti = to.est.length;
  to.est.splice(ti, 0, txt); remapChecks(to, i => i >= ti ? i + 1 : i);
  if(wasOn){ A.checks[to.id] = [...(A.checks[to.id] || []), "e" + ti]; store.set("jqa-checklists", A.checks); }
}

/* árvore do mapa */
function build(){
  const k = q();
  const tr = trail();
  return {id:"root", label:tr.t, aria:tr.t,
    edit:tr.oficial ? null : v => mutate(() => { tr.t = v; }),
    add:() => mutate(() => newStage()),
    children:tr.stages.map(s => ({
      id:"st:" + s.id, label:`Etapa ${s.n} · ${s.name}`, editValue:s.name, color:s.color, icon:stageIcon(s),
      tag:`${topicsOf(s).filter(t => done.has(t.id)).length}/${topicsOf(s).length}`,
      openLabel:"Ver na rota", onOpen:() => { location.hash = "rota"; setTimeout(() => document.getElementById("st-" + s.id)?.scrollIntoView({behavior:"smooth", block:"start"}), 60); },
      edit:v => mutate(() => { s.name = v.replace(/^Etapa\s*\S+\s*·\s*/i, ""); }),
      add:() => mutate(() => newTopic(s.id)),
      sib:() => mutate(() => newStage(s.id)),
      del:() => { const n = topicsOf(s).length;
        const msg = s.ids ? `Excluir a etapa "${s.name}" desta trilha? Os tópicos da oficial continuam lá; os que você criou nela serão apagados.`
          : n ? `Excluir a etapa "${s.name}" e os ${n} tópicos dela?` : `Excluir a etapa "${s.name}"?`;
        if(!confirm(msg)) return false;
        mutate(() => deleteStage(s)); },
      accepts:["topic"], drop:n => mutate(() => moveTopic(findT(n.id), s.id)),
      children:topicsOf(s).map(t => topicNode(t, s, k))
    }))};
}
function topicNode(t, s, k){
  const on = new Set(A.checks[t.id] || []), isDone = done.has(t.id), m = !k || matches(t);
  const est = t.est || [], kids = [];
  kids.push({id:t.id + "/est", group:true, label:"O que estudar", tag:`${est.filter((e, i) => on.has("e" + i)).length}/${est.length}`, color:s.color, dim:!m,
    add:() => mutate(() => insertEst(t, est.length)),
    accepts:["est"], drop:n => mutate(() => moveEst(findT(n.tid), n.ei, t, est.length)),
    children:est.map((e, i) => ({id:t.id + "/e" + i, tid:t.id, ei:i, label:e, color:s.color, check:on.has("e" + i), match:!!k && has(e, k), dim:!m,
      aria:`${e}${on.has("e" + i) ? ", estudado" : ""}`, onCheck:() => toggleCheck(t, "e" + i),
      openLabel:on.has("e" + i) ? "Desmarcar" : "Marcar", onOpen:() => toggleCheck(t, "e" + i),
      edit:v => mutate(() => { t.est[i] = v; }),
      sib:() => mutate(() => insertEst(t, i + 1)),
      del:() => mutate(() => { t.est.splice(i, 1); remapChecks(t, j => j === i ? -1 : j > i ? j - 1 : j); }),
      dragType:"est", accepts:["est"], drop:n => mutate(() => moveEst(findT(n.tid), n.ei, t, (n.tid === t.id && n.ei < i) ? i : i + 1))}))});
  kids.push({id:t.id + "/tech", group:true, label:"Tecnologias", tag:String(t.tech.length), color:s.color, dim:!m,
    add:() => mutate(() => { t.tech.push("Nova tecnologia"); return t.id + "/k" + (t.tech.length - 1); }),
    children:t.tech.map((x, i) => ({id:t.id + "/k" + i, label:x, color:s.color, match:!!k && has(x, k), dim:!m,
      aria:x, openLabel:"Buscar na trilha", onOpen:() => setQuery(x),
      edit:v => mutate(() => { t.tech[i] = v; }),
      sib:() => mutate(() => { t.tech.splice(i + 1, 0, "Nova tecnologia"); return t.id + "/k" + (i + 1); }),
      del:() => mutate(() => { t.tech.splice(i, 1); })}))});
  kids.push({id:t.id + "/mat", group:true, label:"Materiais", tag:String(t.l.length), color:s.color, dim:!m,
    add:() => mutate(() => { t.l.push(["Novo material", ""]); return t.id + "/l" + (t.l.length - 1); }),
    children:t.l.map(([lab, url, nota], i) => ({id:t.id + "/l" + i, label:"↗ " + lab, editValue:lab, color:s.color, dim:!m,
      aria:`${lab}${nota ? ": " + nota : ""}`, openLabel:url ? "Abrir link" : "Adicionar endereço",
      onOpen:() => url ? window.open(url, "_blank", "noopener") : (toast("Adicione o endereço em Editar, nos detalhes do tópico."), A.openEditor(t)),
      edit:v => mutate(() => { t.l[i][0] = v; }),
      sib:() => mutate(() => { t.l.splice(i + 1, 0, ["Novo material", ""]); return t.id + "/l" + (i + 1); }),
      del:() => mutate(() => { t.l.splice(i, 1); })}))});
  return {id:t.id, label:t.t, color:s.color, done:isDone, ia:!!t.ia, note:!!A.notes[t.id], match:!!k && m, dim:!m,
    aria:`${t.t}, ${s.name}${t.ia ? ", tópico de IA" : ""}${A.notes[t.id] ? ", com anotação" : ""}${isDone ? ", dominado" : ""}`,
    openLabel:"Detalhes", onOpen:() => openPanel(t),
    edit:v => mutate(() => { t.t = v; }),
    add:() => mutate(() => insertEst(t, est.length)),
    sib:() => mutate(() => newTopic(s.id, t.id)),
    del:() => { if(!confirm(removeLabel(t, s))) return false; mutate(() => removeTopic(t, s)); },
    dragType:"topic", accepts:["topic", "est"],
    drop:n => mutate(() => n.dragType === "topic" ? moveTopic(findT(n.id), s.id, t.id) : moveEst(findT(n.tid), n.ei, t, est.length)),
    children:kids};
}

const mm = createMindMap({svg:$("#svg"), key:"mapa", build, focusBar:$("#focusBar"), undo,
  /* no celular o mapa começa só com as etapas, para caber na tela */
  defaultOpen:n => n.depth === 1 && !matchMedia("(max-width:820px)").matches,
  controls:{zin:$("#zin"), zout:$("#zout"), fit:$("#zfit"), expand:$("#zexpand"), collapse:$("#zcollapse")}});

/* na busca, abre os ramos onde há resultado */
function revealFor(){
  const k = q(); if(!k) return [];
  const ids = [];
  trail().stages.forEach(s => topicsOf(s).forEach(t => {
    if(!matches(t)) return;
    ids.push("st:" + s.id);
    if((t.est || []).some(e => has(e, k))) ids.push(t.id, t.id + "/est");
    if(t.tech.some(x => has(x, k))) ids.push(t.id, t.id + "/tech");
  }));
  return ids;
}
function renderMap(){ mm.setReveal(revealFor()); }
let lastQ = "";
function searchMap(){
  renderMap();
  const k = q();
  if(k && k !== lastQ) mm.fitTo(n => n.match); else if(!k && lastQ) mm.fit();
  lastQ = k;
}
const fit = () => mm.fit();
function focusTopic(id){
  /* tópico fora da trilha aberta: abre a oficial, onde todo tópico da oficial aparece */
  const t = findTopic(id);
  if(t && !A.trailTopics().includes(t) && A.isOfficialTopic(t)){ A.setTrail(A.OFICIAL); A.refreshTrail(); }
  location.hash = "mapa"; requestAnimationFrame(() => mm.focus(id));
}

const qi = $("#q");
function setQuery(v){ query = v; qi.value = v; searchMap(); renderRoute(); }
let qt = null;
qi.addEventListener("input", () => { query = qi.value; renderRoute(); clearTimeout(qt); qt = setTimeout(searchMap, 180); });

Object.assign(A, {fit, mmTrail:mm, matches, renderLegend, renderMap, setQuery, focusTopic});
})(JQA.app);
