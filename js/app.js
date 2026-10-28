/* Jornada QA — Navegação entre abas e inicialização. Carregado por último. */
(function(A){
const {$, updateMeter} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const renderMap = (...a) => A.renderMap(...a),
      fit = (...a) => A.fit(...a),
      renderLegend = (...a) => A.renderLegend(...a),
      renderRoute = (...a) => A.renderRoute(...a),
      renderPrompts = (...a) => A.renderPrompts(...a),
      renderLib = (...a) => A.renderLib(...a),
      renderProj = (...a) => A.renderProj(...a),
      openMini = (...a) => A.openMini(...a);

/* =====================================================================
   NAVEGAÇÃO
   ===================================================================== */
const TABS = {inicio:"Início", mapa:"Trilha", rota:"Trilha", minimapas:"Trilha", carreira:"Carreira", autoavaliacao:"Autoavaliação", caderno:"Caderno de estudos", prompts:"Prompts", biblioteca:"Biblioteca", projetos:"Projetos"};
A.curTab = null;
const TRILHA = ["mapa", "rota", "minimapas"];
/* uma tela que dá erro não pode derrubar a navegação: registra no console e avisa */
function safe(fn, fallback){
  try{ return fn(); }catch(e){ console.error(e); A.toast?.("Algo nesta tela deu erro. Os detalhes estão no console (F12)."); return fallback; }
}
A.rendered = {};
function show(hash){
  let [tab, sub, ...rest] = String(hash || "").split("/");
  /* a antiga aba "IA no dia a dia" agora é um caderno pronto */
  if(tab === "ia"){ const id = safe(() => A.openGuia(), ""); location.replace("#caderno" + (id ? "/" + id : "")); return; }
  if(!TABS[tab] || (["projetos"].includes(tab) && !A.area().conteudo)) tab = "inicio";
  A.curTab = tab;
  Object.keys(TABS).forEach(t => { document.getElementById("v-" + t).hidden = t !== tab; });
  /* Mapa, Rota e Minimapas são abas da Trilha: o menu marca "Trilha" e lembra a última aba usada */
  const navTab = TRILHA.includes(tab) ? "trilha" : tab;
  document.querySelectorAll(".nav a").forEach(a => a.dataset.tab === navTab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  $("#trailTabs").hidden = navTab !== "trilha";
  document.querySelectorAll("#trailTabs a").forEach(a => a.dataset.sub === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  if(navTab === "trilha"){ A.raw.set("jqa-trilha-aba", tab); $("#navTrilha").href = "#" + tab; }
  let title = TABS[tab];
  if(tab === "minimapas"){ const t = safe(() => openMini(sub), "Minimapas"); if(sub) title = t; } else A.leaveMini();
  if(tab === "caderno") title = safe(() => A.openCaderno([sub, ...rest].filter(Boolean)), title);
  if(tab === "autoavaliacao") title = safe(() => A.openAuto([sub, ...rest].filter(Boolean)), title);
  $("#pageTitle").textContent = title;
  document.title = `${title} · ${A.area().titulo}`;
  if(tab === "inicio") safe(() => A.renderHome());
  $("#backBtn").hidden = tab === "inicio";
  const trail = tab === "mapa" || tab === "rota";
  $("#toolbar").hidden = !trail;
  if(tab === "carreira") safe(() => { A.renderCarreira(); A.fitCareer(); A.rendered.carreira = 1; });
  if(tab === "prompts" && !A.rendered.prompts) safe(() => { renderPrompts(); A.rendered.prompts = 1; });
  if(tab === "biblioteca" && !A.rendered.lib) safe(() => { renderLib(); A.rendered.lib = 1; });
  if(tab === "projetos" && !A.rendered.proj) safe(() => { renderProj(); A.rendered.proj = 1; });
  if(tab === "mapa") safe(() => { A.renderMap(); requestAnimationFrame(fit); });
  if(tab === "rota") safe(() => A.renderRoute());
}
/* voltar: volta para a tela anterior; se a pessoa entrou direto numa aba, volta para o Início */
let navs = 0;
window.addEventListener("hashchange", () => { navs++; show(location.hash.slice(1)); });
$("#backBtn").onclick = () => { if(navs > 0){ navs -= 2; history.back(); } else location.hash = "inicio"; };


/* depois de desfazer: redesenha tudo que mostra conteúdo */
A.refreshAll = () => { A.refreshTrail(); if(A.curTab === "inicio") A.renderHome(); if(A.curTab === "carreira") A.renderCarreira(); A.refreshMini(); if(A.curTab === "minimapas") show(location.hash.slice(1)); };

/* ---------- versão e novidades ---------- */
const VER = window.JQA.VERSAO || "";
$("#verTxt").textContent = VER ? "v" + VER : "";
$("#verDot").hidden = !VER || A.raw.get("jqa-versao-vista", "") === VER;
$("#verBtn").onclick = () => {
  A.closeSide?.();
  A.showPanel(window.JQA.NOME || "Novidades", null, `Novidades da versão ${VER}`);
  A.pBody.innerHTML = (window.JQA.NOVIDADES || []).map((n, i) => `<section class="vernote${i === 0 ? " now" : ""}">
    <h4>v${A.esc(n.v)}${i === 0 ? ' <span class="pill-of">atual</span>' : ""}${n.data ? ` <small class="muted">${A.esc(n.data)}</small>` : ""}</h4>
    <ul>${n.itens.map(t => `<li>${A.esc(t)}</li>`).join("")}</ul></section>`).join("");
  A.raw.set("jqa-versao-vista", VER); $("#verDot").hidden = true;
};
{ const last = A.raw.get("jqa-trilha-aba", "mapa"); if(TRILHA.includes(last)) $("#navTrilha").href = "#" + last; }
/* erro fora das telas (um clique, por exemplo): avisa em vez de falhar calado */
window.addEventListener("error", () => A.toast?.("Algo deu erro. Os detalhes estão no console (F12)."));

/* ---------- início ---------- */
safe(updateMeter); safe(renderLegend); safe(renderMap); safe(renderRoute);
show(location.hash.slice(1));
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { renderMap(); fit(); });

Object.assign(A, {show});
})(JQA.app);
