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
const TABS = {inicio:"Início", mapa:"Mapa", rota:"Rota de estudo", minimapas:"Minimapas", carreira:"Carreira", caderno:"Caderno de estudos", ia:"IA no dia a dia", prompts:"Prompts", biblioteca:"Biblioteca", projetos:"Projetos"};
A.curTab = null;
A.rendered = {};
function show(hash){
  let [tab, sub, ...rest] = String(hash || "").split("/");
  if(!TABS[tab] || (["ia","projetos"].includes(tab) && !A.area().conteudo)) tab = "inicio";
  A.curTab = tab;
  Object.keys(TABS).forEach(t => { document.getElementById("v-" + t).hidden = t !== tab; });
  document.querySelectorAll(".nav a").forEach(a => a.dataset.tab === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  let title = TABS[tab];
  if(tab === "minimapas") title = openMini(sub); else A.leaveMini();
  if(tab === "caderno") title = A.openCaderno([sub, ...rest].filter(Boolean));
  $("#pageTitle").textContent = title;
  document.title = `${title} · ${A.area().titulo}`;
  if(tab === "inicio") A.renderHome();
  $("#backBtn").hidden = tab === "inicio";
  const trail = tab === "mapa" || tab === "rota";
  $("#toolbar").hidden = !trail;
  if(tab === "carreira"){ A.renderCarreira(); A.fitCareer(); A.rendered.carreira = 1; }
  if(tab === "ia" && !A.rendered.ia){ renderIA(); A.rendered.ia = 1; }
  if(tab === "prompts" && !A.rendered.prompts){ renderPrompts(); A.rendered.prompts = 1; }
  if(tab === "biblioteca" && !A.rendered.lib){ renderLib(); A.rendered.lib = 1; }
  if(tab === "projetos" && !A.rendered.proj){ renderProj(); A.rendered.proj = 1; }
  if(tab === "mapa") requestAnimationFrame(fit);
}
/* voltar: volta para a tela anterior; se a pessoa entrou direto numa aba, volta para o Início */
let navs = 0;
window.addEventListener("hashchange", () => { navs++; show(location.hash.slice(1)); });
$("#backBtn").onclick = () => { if(navs > 0){ navs -= 2; history.back(); } else location.hash = "inicio"; };


/* depois de desfazer: redesenha tudo que mostra conteúdo */
A.refreshAll = () => { A.refreshTrail(); if(A.curTab === "inicio") A.renderHome(); if(A.curTab === "carreira") A.renderCarreira(); A.refreshMini(); if(A.curTab === "minimapas") show(location.hash.slice(1)); };

/* ---------- início ---------- */
updateMeter(); renderLegend(); renderMap(); renderRoute();
show(location.hash.slice(1));
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { renderMap(); fit(); });

Object.assign(A, {show});
})(JQA.app);
