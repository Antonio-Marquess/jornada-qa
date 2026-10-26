/* Jornada QA — Trilhas próprias: escolher a trilha aberta, criar, editar, duplicar e excluir.
 * A trilha principal continua como referência; as próprias apontam para os mesmos tópicos (progresso compartilhado)
 * e podem ter tópicos criados pela pessoa. */
(function(A){
const {$, esc, ico, uid, clone, toast, done, saveContent, snapshot, showPanel, closePanel, pBody, trail, setTrail, topicsOf, trailTopics, stagesFrom, blankTopic, OFICIAL, COLORS} = A;

const own = () => A.C.trilhas;
const official = () => ({id:OFICIAL, t:A.area().titulo, oficial:true, stages:A.C.stages});
const pctOf = tr => { const all = trailTopics(tr); return {n:all.length, d:all.filter(t => done.has(t.id)).length}; };

function renderTrailPicker(){
  const sel = $("#trailSel");
  sel.innerHTML = `<option value="${OFICIAL}">${esc(A.area().titulo)} (principal)</option>`
    + (own().length ? `<optgroup label="Minhas trilhas">${own().map(t => `<option value="${esc(t.id)}">${esc(t.t)}</option>`).join("")}</optgroup>` : "");
  sel.value = trail().id;
}
function openTrail(id){
  setTrail(id); A.refreshTrail();
  if(!["mapa","rota"].includes(A.curTab)) location.hash = "mapa";
  requestAnimationFrame(() => A.fit());
}
$("#trailSel").onchange = e => { openTrail(e.target.value); toast(`Trilha aberta: ${trail().t}.`); };
$("#trailBtn").onclick = () => openTrails();

/* cria uma trilha própria. ids: tópicos da principal a incluir; extra: etapas a mais [{name, goal, titles[]}] */
function createTrail(name, d, ids, extra = []){
  snapshot();
  const tr = {id:uid("tr"), t:name, d:d || "", stages:stagesFrom(ids || [])};
  extra.forEach(x => {
    const s = {id:uid("u"), n:String(tr.stages.length + 1), name:x.name, goal:x.goal || "", color:COLORS[tr.stages.length % COLORS.length], ids:[]};
    (x.titles || []).forEach(title => { const t = blankTopic(s.id, title); t.d = x.desc || ""; A.C.topics.push(t); s.ids.push(t.id); });
    tr.stages.push(s);
  });
  if(!tr.stages.length) tr.stages.push({id:uid("u"), n:"1", name:"Primeira etapa", goal:"", color:COLORS[0], ids:[]});
  own().push(tr); saveContent();
  return tr;
}
function duplicate(tr){
  if(tr.oficial) return createTrail("Cópia de " + A.area().titulo, "", A.C.topics.map(t => t.id));
  snapshot();
  const c = clone(tr); c.id = uid("tr"); c.t = tr.t + " (cópia)";
  c.stages.forEach(s => { s.id = uid("u"); });
  own().push(c); saveContent(); return c;
}

/* ---------- gaveta de trilhas ---------- */
function row(tr){
  const {n, d} = pctOf(tr), on = tr.id === trail().id;
  return `<div class="trow${on ? " on" : ""}">
    <div class="trinfo"><b>${esc(tr.t)}</b>${tr.oficial ? '<span class="pill-of">principal</span>' : ""}
      <small>${tr.stages.length} etapas · ${n} tópicos · ${d} dominados</small>${tr.d ? `<p>${esc(tr.d)}</p>` : ""}</div>
    <div class="tracts">
      ${on ? '<span class="muted sm">aberta</span>' : `<button class="btn sm" data-open="${esc(tr.id)}">Abrir</button>`}
      ${tr.oficial ? "" : `<button class="act" data-edit="${esc(tr.id)}" aria-label="Editar ${esc(tr.t)}" title="Editar">${ico("pen")}</button>`}
      <button class="act" data-dup="${esc(tr.id)}" aria-label="Duplicar ${esc(tr.t)}" title="Duplicar">${ico("sib")}</button>
      ${tr.oficial ? "" : `<button class="act del" data-del="${esc(tr.id)}" aria-label="Excluir ${esc(tr.t)}" title="Excluir">${ico("trash")}</button>`}
    </div></div>`;
}
function picker(){
  return A.C.stages.map(s => {
    const ts = A.C.topics.filter(t => t.s === s.id);
    return `<details class="tpick"><summary><label class="checkline"><input type="checkbox" data-all="${esc(s.id)}"> <span>${esc(A.stageLabel(s))}</span></label><small class="muted" data-cnt="${esc(s.id)}">0 de ${ts.length}</small></summary>
      <div class="tpicklist">${ts.map(t => `<label class="checkline"><input type="checkbox" name="pick" value="${esc(t.id)}" data-st="${esc(s.id)}"> <span>${esc(t.t)}${done.has(t.id) ? ' <small class="muted">· dominado</small>' : ""}</span></label>`).join("")}</div></details>`;
  }).join("");
}
function openTrails(){
  showPanel("Trilhas", null, "Suas trilhas");
  pBody.innerHTML = `
    <p style="margin:0">A trilha principal é a referência. Monte as suas ao lado dela, com os tópicos que fazem sentido para o seu objetivo e com tópicos seus. O progresso é um só: dominar um tópico vale em todas as trilhas em que ele aparece.</p>
    <div class="trlist">${[official(), ...own()].map(row).join("")}</div>
    <section><h4>Nova trilha</h4>
    <form class="form" id="nForm" novalidate>
      <label>Nome<input class="in" name="t" required placeholder="Ex.: Rumo a SDET, Foco em API, Plano do semestre"></label>
      <p class="err" id="eName" hidden>Dê um nome à trilha.</p>
      <label>Objetivo <span class="muted">opcional</span><textarea class="in" name="d" rows="2" placeholder="Para que serve esta trilha"></textarea></label>
      <fieldset><legend>Como começar</legend>
        <label class="checkline"><input type="radio" name="modo" value="escolher" checked> Escolher tópicos da trilha principal</label>
        <label class="checkline"><input type="radio" name="modo" value="copia"> Copiar a trilha principal inteira</label>
        <label class="checkline"><input type="radio" name="modo" value="branco"> Começar em branco</label>
      </fieldset>
      <div id="nPick"><p class="muted" style="margin:0 0 6px">Escolha os tópicos. As etapas da principal são mantidas; depois você reorganiza no mapa.</p>${picker()}</div>
      <div class="formfoot"><span class="muted" id="nCount"></span><span class="right"><button class="btn primary" type="submit">${ico("plus")}Criar trilha</button></span></div>
    </form></section>`;
  const f = $("#nForm");
  const count = () => {
    const picked = [...f.querySelectorAll("[name=pick]:checked")];
    $("#nCount").textContent = f.modo.value === "escolher" ? `${picked.length} tópicos escolhidos` : "";
    A.C.stages.forEach(s => {
      const all = f.querySelectorAll(`[data-st="${s.id}"]`), on = f.querySelectorAll(`[data-st="${s.id}"]:checked`);
      const box = f.querySelector(`[data-all="${s.id}"]`); box.checked = all.length && on.length === all.length; box.indeterminate = on.length > 0 && on.length < all.length;
      f.querySelector(`[data-cnt="${s.id}"]`).textContent = `${on.length} de ${all.length}`;
    });
  };
  f.addEventListener("change", e => {
    if(e.target.dataset.all) f.querySelectorAll(`[data-st="${e.target.dataset.all}"]`).forEach(c => { c.checked = e.target.checked; });
    if(e.target.name === "modo") $("#nPick").hidden = e.target.value !== "escolher";
    count();
  });
  /* clicar no quadradinho da etapa não abre nem fecha o grupo */
  f.querySelectorAll(".tpick summary .checkline").forEach(l => l.addEventListener("click", e => e.stopPropagation()));
  count();
  f.onsubmit = async e => {
    e.preventDefault();
    const name = f.t.value.trim(); $("#eName").hidden = !!name; if(!name){ f.t.focus(); return; }
    const modo = f.modo.value;
    const ids = modo === "copia" ? A.C.topics.map(t => t.id) : modo === "escolher" ? [...f.querySelectorAll("[name=pick]:checked")].map(c => c.value) : [];
    if(modo === "escolher" && !ids.length && !await A.ask("Nenhum tópico escolhido. Criar a trilha vazia?")) return;
    const tr = createTrail(name, f.d.value.trim(), ids);
    closePanel(); openTrail(tr.id); toast("Trilha criada. Edite no mapa: Tab cria filho, Enter cria irmão.");
  };
  pBody.querySelector(".trlist").addEventListener("click", async e => {
    const b = e.target.closest("button"); if(!b) return;
    const find = id => id === OFICIAL ? official() : own().find(t => t.id === id);
    if(b.dataset.open){ openTrail(b.dataset.open); openTrails(); }
    else if(b.dataset.edit) editTrail(find(b.dataset.edit));
    else if(b.dataset.dup){ const c = duplicate(find(b.dataset.dup)); toast(`Criada: ${c.t}.`); openTrail(c.id); openTrails(); }
    else if(b.dataset.del){
      const tr = find(b.dataset.del);
      if(!await A.ask(`Excluir a trilha "${tr.t}"? Os tópicos da principal e seu progresso continuam; os tópicos criados só nela serão apagados.`)) return;
      snapshot();
      tr.stages.slice().forEach(s => { A.C.topics.filter(t => t.s === s.id).forEach(t => {
        const other = own().filter(o => o !== tr).flatMap(o => o.stages).find(o => o.ids.includes(t.id));
        if(other) t.s = other.id; else A.purgeTopic(t); }); });
      A.C.trilhas = own().filter(o => o !== tr);
      if(trail().id === tr.id || A.trilhaId === tr.id) setTrail(OFICIAL);
      saveContent(); A.refreshTrail(); openTrails(); toast("Trilha excluída.");
    }
  });
}
function editTrail(tr){
  showPanel("Trilhas", null, "Editar trilha");
  pBody.innerHTML = `<form class="form" id="eForm" novalidate>
    <label>Nome<input class="in" name="t" required value="${esc(tr.t)}"></label>
    <label>Objetivo<textarea class="in" name="d" rows="3">${esc(tr.d || "")}</textarea></label>
    <p class="muted" style="margin:0">Etapas e tópicos são editados no mapa ou na rota, com esta trilha aberta.</p>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" id="eCancel">Voltar</button><button class="btn primary" type="submit">Salvar</button></span></div></form>`;
  const f = $("#eForm"); f.t.focus();
  $("#eCancel").onclick = openTrails;
  f.onsubmit = e => { e.preventDefault(); if(!f.t.value.trim()) return f.t.focus();
    snapshot(); tr.t = f.t.value.trim(); tr.d = f.d.value.trim(); saveContent(); A.refreshTrail(); openTrails(); toast("Trilha salva."); };
}

renderTrailPicker();
Object.assign(A, {renderTrailPicker, openTrails, openTrail, createTrail});
})(JQA.app);
