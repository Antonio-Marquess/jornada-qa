/* Jornada QA — Estado: conteúdo editável (com atualização de versões antigas), progresso, anotações e checklists. */
(function(A){
const {J, $, clone, uid, store, toast} = A;

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
A.C = normalize(upgrade(store.get("jqa-conteudo", null)) || (J.OVERRIDE ? clone(J.OVERRIDE) : defaults()));
const isLocal = () => !!store.get("jqa-conteudo", null);
function saveContent(){ if(!store.set("jqa-conteudo", A.C)) toast("Não foi possível salvar neste navegador."); }

const done = new Set(store.get("jqa-trilha", []));
const doneProj = new Set(store.get("jqa-projetos", []));
const doneEx = new Set(store.get("jqa-exercicios-ia", []));
A.notes = store.get("jqa-notas", {});
A.checks = store.get("jqa-checklists", {});   /* {idDoTópico: ["e0","c2",…]} itens de estudo e critérios marcados */

const stageOf = id => A.C.stages.find(s => s.id === id);
const stageLabel = s => s ? `Etapa ${s.n}: ${s.name}` : "Sem etapa";
const DEPTHS = ["Conhecer","Praticar com apoio","Autonomia","Aprofundar"];
const PRIOS = ["Essencial","Diferencial forte","Diferencial","Escolha uma"];


function updateMeter(){
  const n = A.C.topics.filter(t => done.has(t.id)).length, tot = A.C.topics.length || 1, pct = Math.round(n / tot * 100);
  $("#pct").textContent = pct + "%";
  $("#barFill").style.width = pct + "%";
  $("#count").textContent = `${n} de ${A.C.topics.length} tópicos dominados`;
}

Object.assign(A, {COLORS, defaults, normalize, upgrade, isLocal, saveContent, done, doneProj, doneEx, stageOf, stageLabel, DEPTHS, PRIOS, updateMeter});
})(JQA.app);
