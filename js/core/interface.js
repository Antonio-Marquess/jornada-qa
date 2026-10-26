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

/* ---------- confirmação dentro da página ----------
 * Substitui o confirm() do navegador, que alguns ambientes bloqueiam (a pré-visualização, por exemplo).
 * ask(mensagem) → Promise<true|false>; ask(mensagem, {input:true}) → Promise<texto|null>. */
function ask(msg, opt = {}){
  return new Promise(done => {
    const back = document.activeElement, wrap = document.createElement("div");
    const danger = opt.danger ?? /^(Excluir|Restaurar|Tirar)/.test(msg);
    const okLabel = opt.ok || (/^Excluir/.test(msg) ? "Excluir" : /^Tirar/.test(msg) ? "Tirar" : /^Restaurar/.test(msg) ? "Restaurar" : opt.input ? "Ok" : "Confirmar");
    wrap.className = "qwrap";
    wrap.innerHTML = `<div class="qbox" role="alertdialog" aria-modal="true" aria-labelledby="askMsg">
      <p id="askMsg">${A.esc(msg)}</p>${opt.input ? `<input class="in" id="askIn" value="${A.esc(opt.value || "")}" placeholder="${A.esc(opt.placeholder || "")}" aria-labelledby="askMsg">` : ""}
      <div class="qbtns"><button class="btn" data-a="0">Cancelar</button><button class="btn primary${danger ? " danger" : ""}" data-a="1">${A.esc(okLabel)}</button></div></div>`;
    document.body.appendChild(wrap);
    const input = wrap.querySelector("#askIn");
    const end = yes => { wrap.remove(); document.removeEventListener("keydown", key, true); back?.focus?.({preventScroll:true}); done(opt.input ? (yes ? input.value.trim() : null) : yes); };
    const key = e => {
      if(e.key === "Escape"){ e.preventDefault(); e.stopPropagation(); end(false); }
      else if(e.key === "Enter" && (e.target === input || e.target.closest?.(".qbox"))){ if(e.target.dataset?.a === "0") return; e.preventDefault(); e.stopPropagation(); end(true); }
      else if(e.key === "Tab"){ const f = [...wrap.querySelectorAll("input,button")], i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
      else e.stopPropagation();
    };
    document.addEventListener("keydown", key, true);
    wrap.addEventListener("click", e => { const b = e.target.closest("[data-a]"); if(b) end(b.dataset.a === "1"); else if(e.target === wrap) end(false); });
    (input || wrap.querySelector('[data-a="1"]')).focus();
  });
}

Object.assign(A, {ask, savedTheme, side, sideScrim, openSide, closeSide, panel, scrim, pBody, showPanel, closePanel, linksIn});
})(JQA.app);
