/* Jornada QA — Aba IA no dia a dia. */
(function(A){
const {J, $, esc, ext, store, copyBtn, done, doneEx} = A;

/* =====================================================================
   IA NO DIA A DIA
   ===================================================================== */
function renderIA(){
  const IA = J.IA, m = IA.mcp, a = IA.agentes;
  $("#iaPage").innerHTML = `
  <p class="lead">${esc(IA.intro)}</p>
  <h3>Onde a IA ajuda e onde ter cuidado</h3>
  <div class="tasks">
    <div class="row head"><span>Tarefa</span><span>Como usar</span><span>Cuidado</span></div>
    ${IA.tarefas.map(t => `<div class="row"><b>${esc(t.t)}</b><span>${esc(t.como)}</span><span class="caution">${esc(t.cuidado)}</span></div>`).join("")}
  </div>
  <p class="muted">Prompts prontos para cada uma dessas tarefas estão em <a href="#prompts">Prompts</a>.</p>
  <h3>MCP: dando contexto real ao assistente</h3>
  <p class="lead">${esc(m.oque)}</p>
  <div class="flow" role="list">${m.partes.map((p, i) => `<div role="listitem" class="${i === 1 ? "acc" : ""}"><b>${esc(p.t)}</b><span>${esc(p.d)}</span></div>`).join("")}</div>
  <h3>Servidores MCP úteis para QA</h3>
  <div class="servers">${m.servidores.map(s => `<article class="server card"><h4>${ext(s.t, s.url)}</h4><p style="margin:0">${esc(s.faz)}</p>
      <div class="ask"><small>Peça assim</small>${esc(s.pedido)}</div><p class="caution" style="margin:0">${esc(s.cuidado)}</p></article>`).join("")}</div>
  <h3>Como configurar um servidor MCP</h3>
  <div class="code">${copyBtn(m.config)}${esc(m.config)}</div>
  <p class="muted">${esc(m.configNota)}</p>
  <ul class="links">${m.links.map(([l, u]) => `<li>${ext(l, u)}</li>`).join("")}</ul>
  <h3>Agentes de teste do Playwright</h3>
  <p class="lead">${esc(a.oque)}</p>
  <ol class="steps">${a.passos.map(p => `<li><div><b>${esc(p.t)}</b><br><span class="muted">${esc(p.d)}</span></div></li>`).join("")}</ol>
  <div class="code" style="margin-top:14px">${copyBtn(a.cmd)}${esc(a.cmd)}</div>
  <p class="muted">${esc(a.cmdNota)} ${ext(a.link[0], a.link[1])}.</p>
  <h3>Uma história do começo ao fim, com IA</h3>
  <ol class="steps">${IA.fluxo.map(p => `<li><div><b>${esc(p.t)}</b><br><span class="muted">${esc(p.d)}</span></div></li>`).join("")}</ol>
  <h3>Regras de ouro</h3>
  <ul class="rules">${IA.regras.map(r => `<li>${esc(r)}</li>`).join("")}</ul>
  <h3>Exercícios</h3>
  <ul class="checklist" id="iaEx">${IA.exercicios.map((x, i) => `<li><button data-ex="${i}" class="${doneEx.has(i) ? "done" : ""}" aria-pressed="${doneEx.has(i)}"><span>${esc(x)}</span><i class="check" aria-hidden="true"></i></button></li>`).join("")}</ul>`;
  $("#iaEx").onclick = e => {
    const b = e.target.closest("button[data-ex]"); if(!b) return; const i = +b.dataset.ex;
    doneEx.has(i) ? doneEx.delete(i) : doneEx.add(i); store.set("jqa-exercicios-ia", [...doneEx]);
    b.classList.toggle("done", doneEx.has(i)); b.setAttribute("aria-pressed", doneEx.has(i));
  };
}

Object.assign(A, {renderIA});
})(JQA.app);
