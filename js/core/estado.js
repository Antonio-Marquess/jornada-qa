/* Jornada QA — Estado: conteúdo editável (com atualização de versões antigas), progresso, anotações e checklists. */
(function(A){
const {J, $, clone, uid, store, toast, isOfficialArea} = A;
const OF_AREA = isOfficialArea();

/* ---------- conteúdo editável ---------- */
const COLORS = ["--e1","--e2","--e3","--e4","--e5"];
/* carreira em Y genérica para jornadas novas */
const baseCareer = () => clone(J.CARREIRA_BASE || []).map(n => ({eq:[], resumo:"", espera:[], topicos:[], minis:[], extra:[], provar:[], comport:[], trava:[], ...n}));
function defaults(){
  if(!OF_AREA) return {v:2, stages:[{id:"e1", n:"1", name:"Primeira etapa", goal:"", color:"--e1"}], topics:[], prompts:[], promptsV:4,
    lib:[], minis:[], mapas:[], trilhas:[], carreiras:[], carreira:baseCareer(), comp:[]};
  return {v:2, stages:clone(J.STAGES), topics:clone(J.TOPICS),
    prompts:clone(J.PROMPTS).map(p => ({id:p.id || uid("p"), ...p})), promptsV:4,
    lib:clone(J.LIB).map(i => ({id:uid("l"), ...i})),
    minis:clone(J.MINIMAPAS || []), mapas:[], trilhas:[], carreiras:[], carreira:clone(J.CARREIRA || [])};
}
/* ids estáveis dos minimapas: ramos e itens guardam o próprio id, então editar o texto não perde o progresso */
function idsMini(m){
  const seen = new Set();
  const fix = (it, pref) => {
    if(it.topico) return;
    if(!it.id){ let id = pref + ":" + J.slug(it.t || "item"), k = 2; while(seen.has(id)) id = pref + ":" + J.slug(it.t || "item") + "-" + k++; it.id = id; }
    seen.add(it.id); (it.filhos || []).forEach(f => fix(f, m.id));
  };
  m.ramos.forEach((r, i) => { r.id = r.id || m.id + ":r:" + (r.k || i); r.itens = r.itens || []; r.itens.forEach(it => fix(it, m.id)); });
}
function normalize(c){
  c.stages.forEach((s, i) => { s.color = s.color || COLORS[i % COLORS.length]; });
  c.topics.forEach(t => { t.id = t.id || uid("t"); t.tech = t.tech || []; t.l = t.l || []; t.est = t.est || []; t.cc = t.cc || []; t.lab = t.lab || ""; });
  c.prompts.forEach(p => { p.id = p.id || uid("p"); p.n = p.n || "Iniciante"; });
  /* prompts salvos antes da versão bilíngue: completa com inglês, nível e descrição, e acrescenta os novos */
  if(OF_AREA && (c.promptsV || 1) < 2){
    const base = J.PROMPTS || [], byT = new Map(base.map(p => [p.t, p]));
    c.prompts.forEach(p => { const o = byT.get(p.t); if(!o) return;
      ["n","t_en","d","d_en","quando_en","p_en","rev","rev_en"].forEach(k => { if(p[k] == null) p[k] = o[k]; });
      if(p.p === o.p) p.id = o.id; });
    const tem = new Set(c.prompts.map(p => p.t));
    base.forEach(o => { if(!tem.has(o.t)) c.prompts.push(clone(o)); });
    c.promptsV = 2;
  }
  /* versão 4: prompts reescritos no formato de skill (objetivo, instruções, exemplo, checklist). Os prompts padrão são trocados
   * pela versão nova; os criados pela pessoa continuam como estão. */
  if(OF_AREA && c.promptsV < 4){
    const base = J.PROMPTS || [], ids = new Set(base.map(p => p.id));
    const meus = c.prompts.filter(p => !ids.has(p.id) && !base.some(o => o.t === p.t));
    c.prompts = [...meus, ...clone(base)];
    c.promptsV = 4;
  }
  c.lib.forEach(i => { i.id = i.id || uid("l"); });
  /* minimapas: os que vêm dos arquivos entram sozinhos, menos os que a pessoa excluiu */
  c.minis = c.minis || [];
  const tem = new Set(c.minis.map(m => m.id)), fora = new Set(c.minisExcluidos || []);
  if(OF_AREA) (J.MINIMAPAS || []).forEach(m => { if(!tem.has(m.id) && !fora.has(m.id)) c.minis.push(clone(m)); });
  c.minis.forEach(idsMini);
  c.mapas = c.mapas || [];
  /* trilhas próprias: cada etapa guarda a lista de tópicos (da principal ou criados pela pessoa) */
  c.trilhas = c.trilhas || [];
  c.trilhas.forEach(tr => { tr.id = tr.id || uid("tr"); tr.stages = tr.stages || [];
    tr.stages.forEach((s, i) => { s.id = s.id || uid("u"); s.ids = s.ids || []; s.color = s.color || COLORS[i % COLORS.length]; s.n = s.n || String(i + 1); s.goal = s.goal || ""; }); });
  if(!c.carreira?.length) c.carreira = OF_AREA ? clone(J.CARREIRA || []) : baseCareer();
  /* matriz de competências (aba Autoavaliação): áreas › competências › frases dos níveis 1 a 3 */
  if(!c.comp) c.comp = OF_AREA ? clone(J.COMPETENCIAS || []) : [];
  c.comp.forEach(ar => { ar.id = ar.id || uid("ar"); ar.itens = ar.itens || [];
    ar.itens.forEach(it => { it.id = it.id || uid("cp"); it.topicos = it.topicos || []; ["n1","n2","n3"].forEach(k => { it[k] = it[k] || []; }); }); });
  /* competências exigidas pela carreira principal, vindas do arquivo, quando o nível ainda não tem */
  if(OF_AREA && J.CARREIRA_COMP) (c.carreira || []).forEach(n => { if(!n.comp && J.CARREIRA_COMP[n.id]) n.comp = clone(J.CARREIRA_COMP[n.id]); });
  c.carreiras = c.carreiras || [];
  [c.carreira, ...c.carreiras.map(k => k.niveis = k.niveis || [])].forEach(list => list.forEach(n => {
    ["espera","provar","comport","trava","topicos","minis","extra","eq","comp"].forEach(k => { n[k] = n[k] || []; }); n.escopo = n.escopo || ""; n.resumo = n.resumo || ""; }));
  return c;
}
/* Conteúdo salvo numa versão anterior: completa os tópicos com os campos novos
 * (o que estudar, materiais, laboratório, critérios) e acrescenta os tópicos novos,
 * sem desfazer o que a pessoa editou. */
function upgrade(c){
  if(!c || c.v >= 2 || !OF_AREA) return c;
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
A.C = normalize(upgrade(store.get("jqa-conteudo", null)) || (OF_AREA && J.OVERRIDE ? clone(J.OVERRIDE) : defaults()));
const isLocal = () => !!store.get("jqa-conteudo", null);
function saveContent(){ if(!store.set("jqa-conteudo", A.C)) toast("Não foi possível salvar neste navegador."); }

/* desfazer: guarda uma cópia do conteúdo antes de cada mudança feita no mapa */
const historico = [];
function snapshot(){ historico.push(JSON.stringify(A.C)); if(historico.length > 40) historico.shift(); }
function undo(){
  const s = historico.pop(); if(!s){ toast("Nada para desfazer."); return false; }
  A.C = normalize(JSON.parse(s)); saveContent(); A.refreshAll?.(); toast("Desfeito."); return true;
}

const done = new Set(store.get("jqa-trilha", []));
const doneProj = new Set(store.get("jqa-projetos", []));
const doneEx = new Set(store.get("jqa-exercicios-ia", []));
A.notes = store.get("jqa-notas", {});
A.checks = store.get("jqa-checklists", {});   /* {idDoTópico: ["e0","c2",…]} itens de estudo e critérios marcados */

/* ---------- trilhas: a oficial (etapas e tópicos do conteúdo) e as próprias de cada pessoa ----------
 * Uma trilha própria tem etapas com a lista de ids dos tópicos. Os tópicos são os mesmos da principal
 * (então o progresso vale nas duas) ou tópicos criados pela pessoa, que ficam em A.C.topics com s = id da etapa própria. */
const OFICIAL = "oficial";
A.trilhaId = store.get("jqa-trilha-atual", OFICIAL);
function trail(){
  const t = A.C.trilhas.find(x => x.id === A.trilhaId);
  if(!t) A.trilhaId = OFICIAL;
  return t || {id:OFICIAL, t:A.area().titulo, oficial:true, stages:A.C.stages};
}
function setTrail(id){ A.trilhaId = id; store.set("jqa-trilha-atual", id); }
const findTopic = id => A.C.topics.find(t => t.id === id);
const topicsOf = s => s.ids ? [...new Set(s.ids)].map(findTopic).filter(Boolean) : A.C.topics.filter(t => t.s === s.id);
const trailTopics = (tr = trail()) => [...new Set(tr.stages.flatMap(topicsOf))];
const allStages = () => [...A.C.stages, ...A.C.trilhas.flatMap(t => t.stages)];
const stageOf = id => allStages().find(s => s.id === id);
const isOfficialTopic = t => A.C.stages.some(s => s.id === t.s);
/* etapa em que o tópico aparece na trilha aberta */
const stageIn = t => trail().stages.find(s => topicsOf(s).includes(t)) || stageOf(t.s);
const blankTopic = (s, title) => ({id:uid("t"), s, t:title || "Novo tópico", p:"Conhecer", pr:"Essencial", ia:false, d:"", est:[], tech:[], l:[], x:"", lab:"", cc:[]});
/* coloca um tópico numa etapa (depois de afterId, ou no fim) */
function placeTopic(t, s, afterId){
  if(s.ids){
    trail().stages.forEach(o => { if(o.ids) o.ids = o.ids.filter(x => x !== t.id); });
    const i = afterId ? s.ids.indexOf(afterId) : -1;
    s.ids.splice(i < 0 ? s.ids.length : i + 1, 0, t.id);
    if(!isOfficialTopic(t)) t.s = s.id;
    if(!A.C.topics.includes(t)) A.C.topics.push(t);
    return;
  }
  const all = A.C.topics; if(all.includes(t)) all.splice(all.indexOf(t), 1); t.s = s.id;
  const i = afterId ? all.findIndex(o => o.id === afterId) : all.map(o => o.s).lastIndexOf(s.id);
  all.splice(i < 0 ? all.length : i + 1, 0, t);
}
/* apaga um tópico de vez: some de todas as trilhas, com anotações e marcações */
function purgeTopic(t){
  A.C.topics = A.C.topics.filter(o => o !== t);
  A.C.trilhas.forEach(tr => tr.stages.forEach(s => { s.ids = s.ids.filter(x => x !== t.id); }));
  delete A.notes[t.id]; delete A.checks[t.id]; done.delete(t.id);
  store.set("jqa-notas", A.notes); store.set("jqa-checklists", A.checks); store.set("jqa-trilha", [...done]);
}
/* outra etapa própria (fora s) que também usa o tópico */
const otherHome = (t, s) => A.C.trilhas.flatMap(tr => tr.stages).find(o => o !== s && o.ids.includes(t.id));
const keeps = (t, s) => s?.ids && (isOfficialTopic(t) || !!otherHome(t, s));
/* remover na trilha aberta: na própria, um tópico usado em outro lugar só sai da lista; nas outras situações é apagado */
function removeTopic(t, s){
  if(keeps(t, s)){ s.ids = s.ids.filter(x => x !== t.id); if(t.s === s.id) t.s = otherHome(t, s).id; return "saiu"; }
  purgeTopic(t); return "apagado";
}
const removeLabel = (t, s) => keeps(t, s)
  ? `Tirar "${t.t}" desta trilha? Ele continua na trilha principal, com seu progresso.`
  : `Excluir o tópico "${t.t}"? As anotações dele também serão apagadas.`;
function deleteStage(s){
  const tr = trail();
  if(s.ids) A.C.topics.filter(t => t.s === s.id).forEach(t => { const o = otherHome(t, s); if(o) t.s = o.id; else purgeTopic(t); });
  else A.C.topics = A.C.topics.filter(t => t.s !== s.id);
  tr.stages.splice(tr.stages.indexOf(s), 1);
}
function newStageIn(afterId){
  const st = trail().stages, i = afterId ? st.findIndex(s => s.id === afterId) : st.length - 1;
  const s = {id:uid(trail().oficial ? "e" : "u"), n:String(st.length + 1), name:"Nova etapa", goal:"", color:COLORS[st.length % COLORS.length]};
  if(!trail().oficial) s.ids = [];
  st.splice(i + 1, 0, s); return s;
}
/* monta as etapas de uma trilha própria a partir de tópicos escolhidos, na ordem e nas etapas da principal */
function stagesFrom(ids){
  const want = new Set(ids);
  return A.C.stages.map(s => ({id:uid("u"), n:s.n, name:s.name, goal:s.goal, color:s.color,
    ids:A.C.topics.filter(t => t.s === s.id && want.has(t.id)).map(t => t.id)})).filter(s => s.ids.length)
    .map((s, i) => ({...s, n:String(i + 1)}));
}
const stageLabel = s => s ? `Etapa ${s.n}: ${s.name}` : "Sem etapa";
const DEPTHS = ["Conhecer","Praticar com apoio","Autonomia","Aprofundar"];
const PRIOS = ["Essencial","Diferencial forte","Diferencial","Escolha uma"];


function updateMeter(){
  const all = trailTopics(), n = all.filter(t => done.has(t.id)).length, pct = Math.round(n / (all.length || 1) * 100);
  $("#pct").textContent = pct + "%";
  $("#barFill").style.width = pct + "%";
  $("#count").textContent = `${n} de ${all.length} tópicos dominados`;
  $("#progName").textContent = trail().oficial ? "Seu progresso" : trail().t;
}

Object.assign(A, {COLORS, baseCareer, defaults, normalize, upgrade, isLocal, saveContent, snapshot, undo, done, doneProj, doneEx, stageOf, stageLabel, OFICIAL, trail, setTrail, findTopic, topicsOf, trailTopics, isOfficialTopic, stageIn, blankTopic, placeTopic, purgeTopic, removeTopic, removeLabel, keeps, deleteStage, newStageIn, stagesFrom, DEPTHS, PRIOS, updateMeter});
})(JQA.app);
