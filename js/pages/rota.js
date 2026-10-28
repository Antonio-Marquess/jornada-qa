/* Jornada QA — Rota de estudo: a trilha em sequência, com edição no lugar. */
(function(A){
const {$, esc, ico, actions, done, stageOf, stageLabel, trail, topicsOf, findTopic} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const matches = (...a) => A.matches(...a),
      openPanel = (...a) => A.openPanel(...a),
      openEditor = (...a) => A.openEditor(...a),
      deleteTopic = (...a) => A.deleteTopic(...a),
      openStageEditor = (...a) => A.openStageEditor(...a);

/* =====================================================================
   ROTA DE ESTUDO
   ===================================================================== */
function renderRoute(){
  const root = $("#route"), tr = trail();
  $("#routeLead").textContent = tr.oficial
    ? "A trilha em sequência. Estude o essencial de cada etapa antes de avançar; diferenciais ajudam, mas não devem atrasar o essencial. Passe o mouse num tópico para editar ou excluir."
    : (tr.d ? tr.d + " " : "") + "Sua trilha. Os tópicos que vieram da principal compartilham o progresso e as anotações com ela; excluir um deles aqui só tira da sua trilha.";
  if(!tr.stages.length){ root.innerHTML = `<p class="muted">Esta trilha ainda não tem etapas.</p><button class="btn" id="routeAddStage">${ico("plus")}Adicionar etapa</button>`; return; }
  root.innerHTML = tr.stages.map((s, idx) => {
    const kids = topicsOf(s), d = kids.filter(t => done.has(t.id)).length;
    const cards = kids.filter(matches).map(t => {
      const note = A.notes[t.id], on = done.has(t.id);
      return `<div class="item hoverable${on ? " done" : ""}">
        <span class="stripe" style="background:var(${s.color})"></span>
        <button class="open" data-open="${esc(t.id)}" aria-label="${esc(t.t)}${on ? ", dominado" : ""}. Abrir detalhes">
          <span class="t"><span>${esc(t.t)}</span></span>
          ${t.ia || note ? `<span class="chips-inline">${t.ia ? '<span class="pill-ia">IA</span>' : ''}${note ? '<span class="pill-note">anotação</span>' : ''}</span>` : ""}
          <span class="meta">${esc(t.pr)} · ${esc(t.p)}${(() => { const tl = A.topicLevel?.(t.id); return tl && tl.l.n ? ` · <span class="avb lv${tl.l.n}" title="Seu nível em ${esc(tl.it.t)}">N${tl.l.n}</span>` : ""; })()}</span>
          ${t.tech.length ? `<span class="k">${esc(t.tech.join(", "))}</span>` : ""}
          ${note ? `<span class="notepreview">${esc(note.slice(0, 110))}${note.length > 110 ? "…" : ""}</span>` : ""}
        </button>
        <span class="check" aria-hidden="true"></span>
        ${actions(`data-edit="${esc(t.id)}"`, `data-del="${esc(t.id)}"`, t.t)}
      </div>`;
    }).join("");
    return `<section class="stage" id="st-${esc(s.id)}">
      <div class="rail"><div class="dot" style="background:var(${s.color})">${esc(s.n)}</div>${idx < tr.stages.length - 1 ? '<div class="stem"></div>' : ''}</div>
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
  const find = findTopic;
  if(b.id === "routeAddStage"){ A.snapshot(); A.newStageIn(); A.saveContent(); A.refreshTrail(); return; }
  if(b.dataset.open) openPanel(find(b.dataset.open));
  else if(b.dataset.edit) openEditor(find(b.dataset.edit));
  else if(b.dataset.del) deleteTopic(find(b.dataset.del), stageOf(b.closest(".stage").id.slice(3)));
  else if(b.dataset.add) openEditor(null, b.dataset.add);
  else if(b.dataset.editstage) openStageEditor(stageOf(b.dataset.editstage));
});

Object.assign(A, {renderRoute});
})(JQA.app);
