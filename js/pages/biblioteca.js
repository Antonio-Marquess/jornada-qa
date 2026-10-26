/* Jornada QA — Aba Biblioteca, com filtros e edição no lugar. */
(function(A){
const {J, $, esc, safeUrl, ext, uid, ico, actions, toast, saveContent, stageOf, stageLabel} = A;

/* =====================================================================
   BIBLIOTECA
   ===================================================================== */
let libTipo = "todos", libEtapa = "todas", libTema = "todos", libQ = "", libFree = false, editingLib = null;
const tipoNome = id => J.TIPOS.find(t => t.id === id)?.nome || id;
function libForm(i){
  const temas = [...new Set(A.C.lib.map(x => x.tema))];
  return `<form class="inline-form form" data-lform="${esc(i.id || "novo")}" novalidate>
    <div class="two"><label>Título<input class="in" name="t" value="${esc(i.t || "")}" required></label>
    <label>Endereço<input class="in" name="u" value="${esc(i.u || "")}" placeholder="https://…" required></label></div>
    <div class="three"><label>Tipo<select class="in" name="tipo">${J.TIPOS.map(t => `<option value="${t.id}"${t.id === i.tipo ? " selected" : ""}>${esc(t.nome)}</option>`).join("")}</select></label>
    <label>Etapa<select class="in" name="e"><option value="todas">Todas</option>${A.C.stages.map(s => `<option value="${esc(s.id)}"${s.id === i.e ? " selected" : ""}>${esc(stageLabel(s))}</option>`).join("")}</select></label>
    <label>Tema<input class="in" name="tema" list="temaList" value="${esc(i.tema || "")}"></label></div>
    <datalist id="temaList">${temas.map(t => `<option value="${esc(t)}">`).join("")}</datalist>
    <label>Por que vale<input class="in" name="d" value="${esc(i.d || "")}"></label>
    <label class="checkline"><input type="checkbox" name="pago"${i.pago ? " checked" : ""}> Conteúdo pago</label>
    <p class="err" hidden>Preencha o título e um endereço que comece com http:// ou https://.</p>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" data-cancel>Cancelar</button><button class="btn primary" type="submit">${i.id ? "Salvar" : "Adicionar"}</button></span></div>
  </form>`;
}
function renderLib(rebuild){
  const page = $("#libPage");
  if(!page.dataset.ready || rebuild){
    page.innerHTML = `<div class="pagehead"><p class="lead">Artigos, documentação, sites para praticar, repositórios, cursos, canais e comunidades num lugar só. Filtre pela etapa em que você está para ver só o que serve agora.</p>
        <button class="btn primary" id="newLib">${ico("plus")}Adicionar link</button></div>
      <div class="filters" id="lTipos" role="group" aria-label="Tipo"></div>
      <div class="filters">
        <select class="select" id="lEtapa" aria-label="Etapa"><option value="todas">Todas as etapas</option>${A.C.stages.map(s => `<option value="${esc(s.id)}">${esc(stageLabel(s))}</option>`).join("")}</select>
        <select class="select" id="lTema" aria-label="Tema"></select>
        <label class="switch"><input type="checkbox" id="lFree"${libFree ? " checked" : ""}><span aria-hidden="true"></span>Só gratuitos</label>
        <label class="search"><svg><use href="#i-search"/></svg><input id="lq" type="search" placeholder="Buscar na biblioteca" aria-label="Buscar na biblioteca" value="${esc(libQ)}"></label>
      </div>
      <p class="count" id="lCount" aria-live="polite"></p>
      <div class="lib" id="lList"></div>`;
    page.dataset.ready = 1;
    $("#lEtapa").value = A.C.stages.some(s => s.id === libEtapa) ? libEtapa : (libEtapa = "todas");
    $("#lEtapa").onchange = e => { libEtapa = e.target.value; renderLib(); };
    $("#lTema").onchange = e => { libTema = e.target.value; renderLib(); };
    $("#lFree").onchange = e => { libFree = e.target.checked; renderLib(); };
    $("#lq").oninput = e => { libQ = e.target.value.toLowerCase(); renderLib(); };
    $("#newLib").onclick = () => { editingLib = "novo"; renderLib(); $("#lList [name=t]")?.focus(); };
    $("#lList").addEventListener("click", e => {
      const ed = e.target.closest("[data-ledit]"), del = e.target.closest("[data-ldel]"), cancel = e.target.closest("[data-cancel]");
      if(ed){ editingLib = ed.dataset.ledit; renderLib(); $(`[data-lform="${editingLib}"] [name=t]`)?.focus(); }
      if(cancel){ editingLib = null; renderLib(); }
      if(del){ const it = A.C.lib.find(x => x.id === del.dataset.ldel);
        if(it) A.ask(`Excluir "${it.t}" da biblioteca?`).then(ok => { if(ok){ A.C.lib = A.C.lib.filter(x => x !== it); saveContent(); renderLib(); toast("Item excluído."); } }); }
    });
    $("#lList").addEventListener("submit", e => {
      e.preventDefault(); const f = e.target, id = f.dataset.lform;
      const data = {t:f.t.value.trim(), u:f.u.value.trim(), tipo:f.tipo.value, e:f.e.value, tema:f.tema.value.trim() || "Geral", d:f.d.value.trim(), pago:f.pago.checked};
      if(!data.t || !safeUrl(data.u)){ f.querySelector(".err").hidden = false; return; }
      if(id === "novo") A.C.lib.unshift({id:uid("l"), ...data}); else Object.assign(A.C.lib.find(x => x.id === id), data);
      editingLib = null; saveContent(); renderLib(); toast(id === "novo" ? "Link adicionado." : "Link salvo.");
    });
  }
  const temas = [...new Set(A.C.lib.map(i => i.tema))].sort((a, b) => a.localeCompare(b, "pt"));
  if(libTema !== "todos" && !temas.includes(libTema)) libTema = "todos";
  $("#lTema").innerHTML = `<option value="todos">Todos os temas</option>${temas.map(t => `<option${t === libTema ? " selected" : ""}>${esc(t)}</option>`).join("")}`;
  $("#lTipos").innerHTML = [{id:"todos", nome:"Tudo"}, ...J.TIPOS].map(t => `<button class="chip" aria-pressed="${t.id === libTipo}" data-t="${t.id}">${esc(t.nome)}</button>`).join("");
  $("#lTipos").onclick = e => { const b = e.target.closest("[data-t]"); if(b){ libTipo = b.dataset.t; renderLib(); } };
  const list = A.C.lib.filter(i => (libTipo === "todos" || i.tipo === libTipo)
    && (libEtapa === "todas" || i.e === libEtapa || i.e === "todas")
    && (libTema === "todos" || i.tema === libTema) && (!libFree || !i.pago)
    && (!libQ || (i.t + " " + i.d + " " + i.tema).toLowerCase().includes(libQ)));
  $("#lCount").textContent = `${list.length} ${list.length === 1 ? "item" : "itens"}`;
  let html = editingLib === "novo" ? libForm({tipo:libTipo !== "todos" ? libTipo : "artigo", e:libEtapa}) : "";
  html += list.length ? list.map(i => {
    if(editingLib === i.id) return libForm(i);
    const s = stageOf(i.e);
    return `<div class="row hoverable"><div>${ext(i.t, i.u)}${i.pago ? '<span class="paid">pago</span>' : ''}<div class="d">${esc(i.d)}</div></div>
      <div class="meta"><b>${esc(tipoNome(i.tipo))}</b><br>${esc(i.tema)}</div>
      <div class="meta">${s ? `<span class="tag" style="background:var(${s.color})">Etapa ${esc(s.n)}</span>` : "Todas as etapas"}</div>
      ${actions(`data-ledit="${esc(i.id)}"`, `data-ldel="${esc(i.id)}"`, i.t)}</div>`;
  }).join("") : (editingLib === "novo" ? "" : `<p class="empty">Nada encontrado com esses filtros. Limpe a busca ou escolha Tudo.</p>`);
  $("#lList").innerHTML = html;
}

Object.assign(A, {renderLib});
})(JQA.app);
