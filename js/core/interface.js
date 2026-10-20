/* Jornada QA — Interface comum: tema, menu lateral, gaveta lateral e botões de copiar. */
(function(A){
const {$, store} = A;

/* ---------- tema e menu lateral ---------- */
const savedTheme = store.get("jqa-tema", null);
if(savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
$("#theme").onclick = () => {
  const r = document.documentElement, cur = r.getAttribute("data-theme");
  const dark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  r.setAttribute("data-theme", dark ? "light" : "dark");
  store.set("jqa-tema", dark ? "light" : "dark");
};
const side = $("#side"), sideScrim = $("#sideScrim");
const openSide = () => { side.classList.add("open"); sideScrim.classList.add("show"); };
const closeSide = () => { side.classList.remove("open"); sideScrim.classList.remove("show"); };
$("#sideOpen").onclick = openSide; $("#sideClose").onclick = closeSide; sideScrim.onclick = closeSide;
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", closeSide));

/* =====================================================================
   GAVETA: detalhes, anotações e edição
   ===================================================================== */
const panel = $("#panel"), scrim = $("#scrim"), pBody = $("#pBody");
let lastFocus = null;
function showPanel(tagText, tagColor, title){
  const tag = $("#pTag"); tag.textContent = tagText; tag.style.background = tagColor ? `var(${tagColor})` : "var(--muted)";
  tag.style.color = tagColor ? "var(--on-stage)" : "var(--surface)";
  $("#pTitle").textContent = title;
  if(!panel.classList.contains("open")) lastFocus = document.activeElement;
  panel.classList.add("open"); panel.setAttribute("aria-hidden", "false"); scrim.classList.add("show");
}
function closePanel(){ panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true"); scrim.classList.remove("show"); lastFocus?.focus?.(); }
$("#pClose").onclick = closePanel; scrim.onclick = closePanel;
document.addEventListener("keydown", e => { if(e.key === "Escape" && panel.classList.contains("open")) closePanel(); });

function linksIn(text){ return [...new Set((text || "").match(/https?:\/\/[^\s<>"')]+/g) || [])]; }
/* ---------- copiar ---------- */
document.addEventListener("click", async e => {
  const b = e.target.closest(".copy"); if(!b) return;
  try{ await navigator.clipboard.writeText(b.dataset.copy); b.textContent = "Copiado"; }
  catch(err){ b.textContent = "Selecione e copie"; }
  setTimeout(() => b.textContent = "Copiar", 1800);
});

Object.assign(A, {savedTheme, side, sideScrim, openSide, closeSide, panel, scrim, pBody, showPanel, closePanel, linksIn});
})(JQA.app);
