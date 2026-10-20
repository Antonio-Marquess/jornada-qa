/* Jornada QA — Aba Projetos. */
(function(A){
const {J, $, esc, ext, store, done, doneProj, stageOf, stageLabel} = A;

/* =====================================================================
   PROJETOS
   ===================================================================== */
function renderProj(){
  $("#projPage").innerHTML = `<p class="lead">Em ordem de dificuldade. Não é preciso fazer todos: escolha os que combinam com sua etapa e com as vagas que você quer. Cada um vira um repositório com README explicando contexto, riscos, o que foi testado, o que ficou de fora e o que você aprendeu.</p>
    <div class="projects" id="pjList">${J.PROJETOS.map((p, i) => { const s = stageOf(p.e), on = doneProj.has(i), col = s ? s.color : "--border";
      return `<article class="project card${on ? " done" : ""}" style="border-top-color:var(${col})">
        <h4><span>${esc(p.t)}</span></h4>
        ${s ? `<span class="tag" style="background:var(${col});justify-self:start">${esc(stageLabel(s))}</span>` : ""}
        <p style="margin:0">${esc(p.entrega)}</p>
        ${p.onde ? `<p style="margin:0" class="muted">Onde: ${ext(p.onde[0], p.onde[1])}</p>` : ""}
        <button class="btn sm" data-p="${i}" aria-pressed="${on}">${on ? "Concluído" : "Marcar como concluído"}</button>
      </article>`; }).join("")}</div>`;
  $("#pjList").onclick = e => { const b = e.target.closest("[data-p]"); if(!b) return; const i = +b.dataset.p;
    doneProj.has(i) ? doneProj.delete(i) : doneProj.add(i); store.set("jqa-projetos", [...doneProj]); renderProj(); };
}

Object.assign(A, {renderProj});
})(JQA.app);
