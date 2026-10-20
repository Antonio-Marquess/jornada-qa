/* Jornada QA — Tópico: detalhes na gaveta, checklists, anotações e editor de tópicos e etapas. */
(function(A){
const {$, esc, safeUrl, ext, clone, uid, ico, actions, store, toast, copyBtn, saveContent, done, stageOf, stageLabel, DEPTHS, PRIOS, updateMeter, pBody, showPanel, closePanel, linksIn} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const renderMap = (...a) => A.renderMap(...a),
      renderLegend = (...a) => A.renderLegend(...a),
      setQuery = (...a) => A.setQuery(...a),
      renderRoute = (...a) => A.renderRoute(...a),
      renderLib = (...a) => A.renderLib(...a),
      refreshMini = (...a) => A.refreshMini(...a);


function openPanel(t){
  if(!t) return;
  const s = stageOf(t.s), on = done.has(t.id);
  showPanel(stageLabel(s) + (t.ia ? " · IA" : ""), s?.color, t.t);
  pBody.innerHTML = `
    <div class="actions">
      <button class="btn${on ? "" : " primary"}" id="pDone" aria-pressed="${on}">${on ? "Dominado" : "Marcar como dominado"}</button>
      <button class="btn" id="pEdit">${ico("pen")}Editar</button>
    </div>
    ${t.d ? `<p style="margin:0">${esc(t.d)}</p>` : ""}
    <dl class="facts"><div><dt>Profundidade</dt><dd>${esc(t.p)}</dd></div><div><dt>Prioridade</dt><dd>${esc(t.pr)}</dd></div></dl>
    ${t.tech.length ? `<section><h4>Tecnologias e conceitos</h4><div class="chips" id="pTech">${t.tech.map(k => `<button data-k="${esc(k)}" title="Ver onde mais aparece na trilha">${esc(k)}</button>`).join("")}</div></section>` : ""}
    ${t.est.length ? `<section><h4>O que estudar <span class="count">${tickCount(t, "e", t.est)}</span></h4>${tickList(t, "e", t.est)}</section>` : ""}
    ${t.l.length ? `<section><h4>Materiais</h4><ul class="links mats">${t.l.map(([lab, url, nota]) => `<li>${ext(lab, url)}${nota ? `<small>${esc(nota)}</small>` : ""}</li>`).join("")}</ul></section>` : ""}
    ${t.x || t.lab ? `<section><h4>Pratique</h4>${t.x ? `<p class="practice">${esc(t.x)}</p>` : ""}
      ${t.lab ? `<p class="labhead">Laboratório</p><div class="code lab">${copyBtn(t.lab)}<pre>${esc(t.lab)}</pre></div>` : ""}</section>` : ""}
    ${t.cc.length ? `<section><h4>Pronto quando <span class="count">${tickCount(t, "c", t.cc)}</span></h4>${tickList(t, "c", t.cc)}</section>` : ""}
    <section>
      <h4><label for="pNote">Minhas anotações</label></h4>
      <textarea id="pNote" class="note" rows="6" placeholder="O que aprendeu, dúvidas, links, prompts que funcionaram…">${esc(A.notes[t.id] || "")}</textarea>
      <p class="saved" id="pSaved" aria-live="polite"></p>
      <ul class="links" id="pNoteLinks"></ul>
    </section>`;
  const renderNoteLinks = () => { $("#pNoteLinks").innerHTML = linksIn(A.notes[t.id]).map(u => `<li>${ext(u, u)}</li>`).join(""); };
  renderNoteLinks();
  let h;
  $("#pNote").addEventListener("input", e => {
    clearTimeout(h); $("#pSaved").textContent = "Salvando…";
    h = setTimeout(() => {
      const v = e.target.value; if(v.trim()) A.notes[t.id] = v; else delete A.notes[t.id];
      store.set("jqa-notas", A.notes); $("#pSaved").textContent = "Salvo neste navegador.";
      renderNoteLinks(); renderMap(); renderRoute();
    }, 500);
  });
  pBody.querySelectorAll("#pTech [data-k]").forEach(b => b.onclick = () => { closePanel(); setQuery(b.dataset.k); if(!["mapa","rota"].includes(A.curTab)) location.hash = "mapa"; });
  $("#pDone").onclick = () => { done.has(t.id) ? done.delete(t.id) : done.add(t.id); store.set("jqa-trilha", [...done]); updateMeter(); renderMap(); renderRoute(); refreshMini(); openPanel(t); };
  $("#pEdit").onclick = () => openEditor(t);
  pBody.querySelectorAll(".ticks input").forEach(cb => cb.onchange = () => {
    const set = new Set(A.checks[t.id] || []); cb.checked ? set.add(cb.dataset.tk) : set.delete(cb.dataset.tk);
    if(set.size) A.checks[t.id] = [...set]; else delete A.checks[t.id];
    store.set("jqa-checklists", A.checks);
    const sec = cb.closest("section"), kind = cb.dataset.tk[0];
    sec.querySelector(".count").textContent = tickCount(t, kind, kind === "e" ? t.est : t.cc);
  });
  $("#pClose").focus();
}
function tickList(t, kind, items){
  const on = new Set(A.checks[t.id] || []);
  return `<ul class="ticks">${items.map((it, i) => `<li><label><input type="checkbox" data-tk="${kind}${i}"${on.has(kind + i) ? " checked" : ""}><span>${esc(it)}</span></label></li>`).join("")}</ul>`;
}
function tickCount(t, kind, items){
  const on = (A.checks[t.id] || []).filter(k => k[0] === kind && +k.slice(1) < items.length).length;
  return `${on}/${items.length}`;
}

/* campos reutilizáveis */
const opt = (list, val) => list.map(v => `<option${v === val ? " selected" : ""}>${esc(v)}</option>`).join("");
function linkRows(list){
  return list.map(([lab, url, nota]) => `<div class="linkrow"><input class="in" placeholder="Texto do link" value="${esc(lab)}" aria-label="Texto do link"><input class="in" placeholder="https://…" value="${esc(url)}" aria-label="Endereço do link"><input class="in nota" placeholder="O que ler ou fazer nele (opcional)" value="${esc(nota || "")}" aria-label="O que ler ou fazer nele"><button type="button" class="act del rm" aria-label="Remover link" title="Remover">${ico("x")}</button></div>`).join("");
}
function wireLinkRows(root){
  root.querySelector("[data-addlink]").onclick = () => root.querySelector(".linkrows").insertAdjacentHTML("beforeend", linkRows([["", ""]]));
  root.querySelector(".linkrows").addEventListener("click", e => { const b = e.target.closest(".rm"); if(b) b.closest(".linkrow").remove(); });
}
function readLinkRows(root){
  const out = [], bad = [];
  root.querySelectorAll(".linkrow").forEach(r => { const [a, b, c] = r.querySelectorAll("input"); const lab = a.value.trim(), url = b.value.trim(), nota = c ? c.value.trim() : "";
    if(!lab && !url) return; if(!safeUrl(url)){ bad.push(b); return; } out.push(nota ? [lab || url, url, nota] : [lab || url, url]); });
  return {out, bad};
}

function openEditor(t, stageId){
  const isNew = !t;
  const d = t ? clone(t) : {s:stageId || A.C.stages[0]?.id, t:"", p:DEPTHS[0], pr:PRIOS[0], ia:false, d:"", est:[], tech:[], l:[], x:"", lab:"", cc:[]};
  const lines = v => v.split("\n").map(x => x.trim()).filter(Boolean);
  const s = stageOf(d.s);
  showPanel(isNew ? "Novo tópico" : "Editando", s?.color, isNew ? "Novo tópico" : d.t);
  pBody.innerHTML = `<form class="form" id="tForm" novalidate>
    <label>Título<input class="in" name="t" required value="${esc(d.t)}" placeholder="Ex.: Testes de contrato"></label>
    <p class="err" id="eTitle" hidden>Dê um título ao tópico.</p>
    <label>Etapa<select class="in" name="s">${A.C.stages.map(st => `<option value="${esc(st.id)}"${st.id === d.s ? " selected" : ""}>${esc(stageLabel(st))}</option>`).join("")}</select></label>
    <div class="two"><label>Profundidade<select class="in" name="p">${opt(DEPTHS, d.p)}</select></label>
    <label>Prioridade<select class="in" name="pr">${opt(PRIOS, d.pr)}</select></label></div>
    <label class="checkline"><input type="checkbox" name="ia"${d.ia ? " checked" : ""}> Tópico de IA</label>
    <label>Descrição<textarea class="in" name="d" rows="3">${esc(d.d)}</textarea></label>
    <label>O que estudar <span class="muted">um item por linha</span><textarea class="in" name="est" rows="5" placeholder="Ex.: Consumidor e fornecedor&#10;Pact: como o contrato é gerado">${esc((d.est || []).join("\n"))}</textarea></label>
    <label>Tecnologias e conceitos <span class="muted">separe por vírgula</span><input class="in" name="tech" value="${esc(d.tech.join(", "))}" placeholder="Ex.: Pact, OpenAPI"></label>
    <fieldset><legend>Materiais</legend><div class="linkrows">${linkRows(d.l)}</div>
      <p class="err" id="eLinks" hidden>Os endereços precisam começar com http:// ou https://.</p>
      <button type="button" class="btn sm" data-addlink>${ico("plus")}Adicionar material</button></fieldset>
    <label>Exercício prático<textarea class="in" name="x" rows="3">${esc(d.x)}</textarea></label>
    <label>Laboratório <span class="muted">comandos, dados ou texto de apoio; aparece com botão Copiar</span><textarea class="in mono" name="lab" rows="5">${esc(d.lab || "")}</textarea></label>
    <label>Pronto quando <span class="muted">critérios de conclusão, um por linha</span><textarea class="in" name="cc" rows="3">${esc((d.cc || []).join("\n"))}</textarea></label>
    <div class="formfoot">
      ${isNew ? "<span></span>" : `<button type="button" class="btn ghost danger" id="tDel">${ico("trash")}Excluir</button>`}
      <span class="right"><button type="button" class="btn" id="tCancel">Cancelar</button><button class="btn primary" type="submit">${isNew ? "Criar tópico" : "Salvar"}</button></span>
    </div>
  </form>`;
  const f = $("#tForm"); wireLinkRows(f); f.t.focus();
  $("#tCancel").onclick = () => isNew ? closePanel() : openPanel(t);
  f.onsubmit = e => {
    e.preventDefault();
    const title = f.t.value.trim(); $("#eTitle").hidden = !!title; if(!title){ f.t.focus(); return; }
    const {out, bad} = readLinkRows(f); $("#eLinks").hidden = !bad.length; if(bad.length){ bad[0].focus(); return; }
    const data = {s:f.s.value, t:title, p:f.p.value, pr:f.pr.value, ia:f.ia.checked, d:f.d.value.trim(),
      est:lines(f.est.value), tech:f.tech.value.split(",").map(x => x.trim()).filter(Boolean), l:out, x:f.x.value.trim(),
      lab:f.lab.value.replace(/\s+$/, ""), cc:lines(f.cc.value)};
    let target;
    if(isNew){ target = {id:uid("t"), ...data}; A.C.topics.push(target); }
    else { target = A.C.topics.find(o => o.id === t.id); Object.assign(target, data); }
    saveContent(); refreshTrail(); toast(isNew ? "Tópico criado." : "Alterações salvas."); openPanel(target);
  };
  if(!isNew) $("#tDel").onclick = () => deleteTopic(t);
}
function deleteTopic(t){
  if(!t || !confirm(`Excluir o tópico "${t.t}"? As anotações dele também serão apagadas.`)) return;
  A.C.topics = A.C.topics.filter(o => o.id !== t.id); delete A.notes[t.id]; delete A.checks[t.id]; done.delete(t.id);
  store.set("jqa-checklists", A.checks); store.set("jqa-notas", A.notes); store.set("jqa-trilha", [...done]);
  saveContent(); refreshTrail(); closePanel(); toast("Tópico excluído.");
}

function openStageEditor(s){
  showPanel("Editando etapa", s.color, s.name);
  pBody.innerHTML = `<form class="form" id="sForm" novalidate>
    <div class="two"><label>Número<input class="in" name="n" value="${esc(s.n)}" maxlength="3"></label>
    <label>Nome<input class="in" name="name" required value="${esc(s.name)}"></label></div>
    <label>Objetivo da etapa<textarea class="in" name="goal" rows="4">${esc(s.goal)}</textarea></label>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" id="sCancel">Cancelar</button><button class="btn primary" type="submit">Salvar etapa</button></span></div></form>`;
  const f = $("#sForm"); f.name.focus();
  $("#sCancel").onclick = closePanel;
  f.onsubmit = e => { e.preventDefault(); if(!f.name.value.trim()) return f.name.focus();
    Object.assign(s, {n:f.n.value.trim() || s.n, name:f.name.value.trim(), goal:f.goal.value.trim()});
    saveContent(); refreshTrail(); closePanel(); toast("Etapa salva."); };
}

function refreshTrail(){ updateMeter(); renderLegend(); renderMap(); renderRoute(); if(A.rendered.lib) renderLib(true); }
$("#newTopic").onclick = () => openEditor(null);

Object.assign(A, {deleteTopic, openEditor, openPanel, openStageEditor, refreshTrail});
})(JQA.app);
