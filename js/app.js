/* Jornada QA — Navegação entre abas e inicialização. Carregado por último. */
(function(A){
const {$, updateMeter} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const renderMap = (...a) => A.renderMap(...a),
      fit = (...a) => A.fit(...a),
      renderLegend = (...a) => A.renderLegend(...a),
      renderRoute = (...a) => A.renderRoute(...a),
      renderIA = (...a) => A.renderIA(...a),
      renderPrompts = (...a) => A.renderPrompts(...a),
      renderLib = (...a) => A.renderLib(...a),
      renderProj = (...a) => A.renderProj(...a),
      openMini = (...a) => A.openMini(...a);

/* =====================================================================
   NAVEGAÇÃO
   ===================================================================== */
const TABS = {mapa:"Mapa", rota:"Rota de estudo", minimapas:"Minimapas", ia:"IA no dia a dia", prompts:"Prompts", biblioteca:"Biblioteca", projetos:"Projetos"};
A.curTab = null;
A.rendered = {};
function show(hash){
  let [tab, sub] = String(hash || "").split("/");
  if(!TABS[tab]) tab = matchMedia("(max-width:820px)").matches ? "rota" : "mapa";
  A.curTab = tab;
  Object.keys(TABS).forEach(t => { document.getElementById("v-" + t).hidden = t !== tab; });
  document.querySelectorAll(".nav a").forEach(a => a.dataset.tab === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  let title = TABS[tab];
  if(tab === "minimapas") title = openMini(sub); else A.leaveMini();
  $("#pageTitle").textContent = title;
  document.title = `${title} · Jornada QA`;
  const trail = tab === "mapa" || tab === "rota";
  $("#toolbar").hidden = !trail; $("#techToggle").hidden = tab !== "mapa";
  if(tab === "ia" && !A.rendered.ia){ renderIA(); A.rendered.ia = 1; }
  if(tab === "prompts" && !A.rendered.prompts){ renderPrompts(); A.rendered.prompts = 1; }
  if(tab === "biblioteca" && !A.rendered.lib){ renderLib(); A.rendered.lib = 1; }
  if(tab === "projetos" && !A.rendered.proj){ renderProj(); A.rendered.proj = 1; }
  if(tab === "mapa") requestAnimationFrame(fit);
}
window.addEventListener("hashchange", () => show(location.hash.slice(1)));


/* ---------- início ---------- */
updateMeter(); renderLegend(); renderMap(); renderRoute();
show(location.hash.slice(1));
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { renderMap(); fit(); });

Object.assign(A, {show});
})(JQA.app);
