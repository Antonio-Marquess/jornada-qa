/* Jornada QA — Aba Prompts, com edição no lugar. */
(function(A){
const {$, esc, uid, ico, actions, toast, copyBtn, saveContent} = A;

/* =====================================================================
   PROMPTS
   ===================================================================== */
let promptCat = "Todos", promptQ = "", editingPrompt = null;
function promptForm(p){
  const cats = [...new Set(A.C.prompts.map(x => x.c))];
  return `<form class="inline-form form" data-pform="${esc(p.id || "novo")}" novalidate>
    <div class="two"><label>Categoria<input class="in" name="c" list="catList" value="${esc(p.c || "")}" required></label>
    <label>Título<input class="in" name="t" value="${esc(p.t || "")}" required></label></div>
    <datalist id="catList">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist>
    <label>Quando usar<input class="in" name="quando" value="${esc(p.quando || "")}"></label>
    <label>Prompt<textarea class="in mono" name="p" rows="8" required>${esc(p.p || "")}</textarea></label>
    <p class="err" hidden>Preencha categoria, título e o texto do prompt.</p>
    <div class="formfoot"><span></span><span class="right"><button type="button" class="btn" data-cancel>Cancelar</button><button class="btn primary" type="submit">${p.id ? "Salvar" : "Criar prompt"}</button></span></div>
  </form>`;
}
function renderPrompts(){
  const page = $("#promptsPage");
  if(!page.dataset.ready){
    page.innerHTML = `<div class="pagehead"><p class="lead">Modelos para copiar e adaptar. Troque o que está entre &lt; &gt; pelo seu contexto e revise sempre a resposta: o prompt organiza o pedido, mas o julgamento continua sendo seu.</p>
      <button class="btn primary" id="newPrompt">${ico("plus")}Novo prompt</button></div>
      <div class="filters" id="pCats" role="group" aria-label="Categorias"></div>
      <div class="filters"><label class="search" style="width:420px"><svg><use href="#i-search"/></svg><input id="pq" type="search" placeholder="Buscar prompt" aria-label="Buscar prompt"></label></div>
      <div class="prompts" id="pList"></div>`;
    page.dataset.ready = 1;
    $("#pq").oninput = e => { promptQ = e.target.value.toLowerCase(); renderPrompts(); };
    $("#newPrompt").onclick = () => { editingPrompt = "novo"; promptCat = "Todos"; renderPrompts(); $("#pList [name=c]")?.focus(); };
    $("#pList").addEventListener("click", e => {
      const ed = e.target.closest("[data-pedit]"), del = e.target.closest("[data-pdel]"), cancel = e.target.closest("[data-cancel]");
      if(ed){ editingPrompt = ed.dataset.pedit; renderPrompts(); $(`[data-pform="${editingPrompt}"] [name=t]`)?.focus(); }
      if(cancel){ editingPrompt = null; renderPrompts(); }
      if(del){ const p = A.C.prompts.find(x => x.id === del.dataset.pdel);
        if(p && confirm(`Excluir o prompt "${p.t}"?`)){ A.C.prompts = A.C.prompts.filter(x => x !== p); saveContent(); renderPrompts(); toast("Prompt excluído."); } }
    });
    $("#pList").addEventListener("submit", e => {
      e.preventDefault(); const f = e.target, id = f.dataset.pform;
      const data = {c:f.c.value.trim(), t:f.t.value.trim(), quando:f.quando.value.trim(), p:f.p.value.replace(/\s+$/, "")};
      if(!data.c || !data.t || !data.p.trim()){ f.querySelector(".err").hidden = false; return; }
      if(id === "novo") A.C.prompts.unshift({id:uid("p"), ...data}); else Object.assign(A.C.prompts.find(x => x.id === id), data);
      editingPrompt = null; saveContent(); renderPrompts(); toast(id === "novo" ? "Prompt criado." : "Prompt salvo.");
    });
  }
  const cats = ["Todos", ...new Set(A.C.prompts.map(p => p.c))];
  if(!cats.includes(promptCat)) promptCat = "Todos";
  $("#pCats").innerHTML = cats.map(c => `<button class="chip" aria-pressed="${c === promptCat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  $("#pCats").onclick = e => { const b = e.target.closest("[data-c]"); if(b){ promptCat = b.dataset.c; renderPrompts(); } };
  const list = A.C.prompts.filter(p => (promptCat === "Todos" || p.c === promptCat) && (!promptQ || (p.t + p.quando + p.p).toLowerCase().includes(promptQ)));
  let html = editingPrompt === "novo" ? promptForm({}) : "";
  html += list.length ? list.map(p => editingPrompt === p.id ? promptForm(p) : `<article class="prompt card hoverable">
      ${actions(`data-pedit="${esc(p.id)}"`, `data-pdel="${esc(p.id)}"`, p.t)}
      <span class="cat">${esc(p.c)}</span><h4>${esc(p.t)}</h4>${p.quando ? `<p class="muted" style="margin:0">${esc(p.quando)}</p>` : ""}
      <div class="code">${copyBtn(p.p)}<pre>${esc(p.p)}</pre></div></article>`).join("")
    : `<p class="empty">Nenhum prompt encontrado. Tente outra palavra ou a categoria Todos.</p>`;
  $("#pList").innerHTML = html;
}

Object.assign(A, {renderPrompts});
})(JQA.app);
