/* Jornada QA — Aba Prompts: biblioteca em português e inglês, no formato de skill
 * (objetivo, antes de começar, instruções, exemplo, formato e checklist), com níveis, categorias,
 * cópia do texto completo ou como SKILL.md e edição pela própria página. */
(function(A){
const {J, $, esc, uid, ico, actions, store, toast, saveContent, pBody, showPanel, closePanel} = A;

const NIVEIS = J.PROMPT_NIVEIS || ["Iniciante", "Intermediário", "Avançado"];
const LV = {"Iniciante":"lv1", "Intermediário":"lv2", "Avançado":"lv3"};
let grupo = "todos", nivel = "Todos", mostrar = "todos", q = "", lang = store.get("jqa-prompt-lang", "pt");
/* grupos: as categorias dos prompts reunidas em poucos filtros; categoria fora da lista cai em "Outros" */
const GRUPOS = [
  {id:"estudo", pt:"Estudo, carreira e IA", en:"Study, career and AI", cats:["Estudo","Carreira","IA"]},
  {id:"planejar", pt:"Planejar testes", en:"Test planning", cats:["Requisitos","Casos de teste","Dados de teste","Exploratório"]},
  {id:"bugs", pt:"Bugs e depuração", en:"Bugs and debugging", cats:["Bugs","Depuração"]},
  {id:"auto", pt:"Automação", en:"Automation", cats:["Automação","API","Mobile"]},
  {id:"codigo", pt:"Código e pipeline", en:"Code and pipeline", cats:["Code review","CI/CD"]},
  {id:"nf", pt:"Não funcionais", en:"Non-functional", cats:["Performance","Segurança","Acessibilidade"]}
];
const grupoDe = c => (GRUPOS.find(g => g.cats.includes(c)) || {id:"outros"}).id;
/* favoritos e "meus prompts" (os que não vêm dos arquivos) */
const fav = new Set(store.get("jqa-prompt-fav", []));
const saveFav = () => store.set("jqa-prompt-fav", [...fav]);
const BASE = new Set((J.PROMPTS || []).map(p => p.id));
const isMine = p => !BASE.has(p.id);
const L = (p, k) => (lang === "en" && p[k + "_en"]) ? p[k + "_en"] : (p[k] || p[k + "_en"] || "");
/* variáveis: {{assim}}; prompts antigos ou criados pela pessoa podem usar <assim> */
const vars = text => /\{\{/.test(text) ? [...new Set(text.match(/\{\{[^{}\n]{1,80}\}\}/g) || [])] : [...new Set(text.match(/<[^<>\n\/]{1,60}>/g) || [])];
const varName = v => v.replace(/^\{\{|\}\}$|^<|>$/g, "");
const T = {
  pt:{lead:"Prompts completos para o dia a dia de QA, no formato de skill: objetivo, perguntas iniciais, instruções, exemplo, formato e checklist. Copie e cole na IA; se faltar informação, ela pergunta.",
      busca:"Buscar prompt", todas:"Todos", todos:"Todos os níveis", n:"prompts", vazio:"Nenhum prompt encontrado. Tente outra palavra ou limpe os filtros.",
      outros:"Outros", mostrar:{todos:"Todos os prompts", fav:"★ Favoritos", meus:"Meus prompts"}, guia:"Como escrever um bom prompt", novo:"Novo prompt",
      semFav:"Você ainda não favoritou nenhum prompt. Clique na estrela de um card para guardar aqui os que mais usa.", semMeus:"Você ainda não criou nenhum prompt. Clique em Novo prompt para guardar um que funcionou no seu dia a dia."},
  en:{lead:"Complete prompts for everyday QA work, in skill format: goal, opening questions, instructions, example, format and checklist. Copy and paste into the AI; if information is missing, it asks.",
      busca:"Search prompts", todas:"All", todos:"All levels", n:"prompts", vazio:"No prompts found. Try another word or clear the filters.",
      outros:"Other", mostrar:{todos:"All prompts", fav:"★ Favorites", meus:"My prompts"}, guia:"How to write a good prompt", novo:"New prompt",
      semFav:"You haven't starred any prompt yet. Click the star on a card to keep your most used ones here.", semMeus:"You haven't created any prompt yet. Click New prompt to save one that worked for you."}
};
/* rótulos das seções e montagem do texto completo (é o que vai no Copiar) */
const SEC = {
  pt:{obj:"Objetivo", antes:"Antes de começar", antesIntro:"Se eu ainda não enviei as informações abaixo, não comece. Pergunte só o que faltar e espere minha resposta:",
      passos:"Instruções", ex:"Exemplo", saida:"Formato da saída", saidaFim:"Sem introdução e sem resumo final.", check:"Checklist antes de responder",
      quando:"Quando usar", rev:"Antes de usar a resposta", texto:"Ver o texto completo que será copiado", copiar:"Copiar prompt", skill:"Copiar como skill (SKILL.md)",
      fav:"Favoritar", desfav:"Tirar dos favoritos", editar:"Editar", semEn:""},
  en:{obj:"Goal", antes:"Before you start", antesIntro:"If I haven't sent the information below yet, don't start. Ask only for what's missing and wait for my answer:",
      passos:"Instructions", ex:"Example", saida:"Output format", saidaFim:"No intro and no closing summary.", check:"Checklist before answering",
      quando:"When to use", rev:"Before using the answer", texto:"See the full text that will be copied", copiar:"Copy prompt", skill:"Copy as skill (SKILL.md)",
      fav:"Add to favorites", desfav:"Remove from favorites", editar:"Edit", semEn:"This prompt has no English version yet, so it is shown in Portuguese."}
};
const hasSec = p => !!(p.obj || p.obj_en);
const LA = (p, k) => { const v = (lang === "en" && p[k + "_en"] && p[k + "_en"].length) ? p[k + "_en"] : (p[k] && p[k].length ? p[k] : p[k + "_en"]); return v || (Array.isArray(p[k]) ? [] : ""); };
function assemble(p, asSkill){
  if(!hasSec(p)) return L(p, "p");
  const S = SEC[lang], lst = (a, num) => a.map((x, i) => (num ? (i + 1) + ". " : "- ") + x).join("\n");
  const parts = [];
  const q1 = L(p, "quando").replace(/^./, c => c.toLowerCase()).replace(/^(para|to) /i, "");
  if(asSkill) parts.push(`---\nname: ${p.id}\ndescription: ${L(p, "d")} ${lang === "en" ? "Use it to" : "Use para"} ${q1}\n---`);
  parts.push(`# ${L(p, "t")}`, `## ${S.obj}\n${L(p, "obj")}`);
  if(LA(p, "antes").length) parts.push(`## ${S.antes}\n${S.antesIntro}\n${lst(LA(p, "antes"), true)}`);
  if(LA(p, "passos").length) parts.push(`## ${S.passos}\n${lst(LA(p, "passos"), true)}`);
  if(L(p, "ex")) parts.push(`## ${S.ex}\n${L(p, "ex")}`);
  if(LA(p, "saida").length) parts.push(`## ${S.saida}\n${lst(LA(p, "saida"))}\n${S.saidaFim}`);
  if(LA(p, "check").length) parts.push(`## ${S.check}\n${lst(LA(p, "check"))}`);
  return parts.join("\n\n");
}

/* como os prompts foram escritos: o padrão vale para criar os seus */
const GUIA = {
  pt:{titulo:"Como estes prompts foram escritos (e como escrever os seus)", itens:[
    ["Objetivo com papel e motivo", "Diz quem a IA é, o que vai produzir e para quê. O motivo ajuda o modelo a decidir os detalhes."],
    ["Antes de começar", "Lista o que a IA precisa saber. Se faltar, ela pergunta em vez de inventar ou entregar algo genérico."],
    ["Instruções passo a passo", "O caminho que um QA experiente seguiria, com regras ditas no positivo e limites claros."],
    ["Exemplo", "Uma entrada curta e o trecho da saída esperada. É o que mais melhora a resposta: a IA copia o padrão."],
    ["Formato da saída", "Tabela, lista ou código, sem introdução nem resumo. Resposta enxuta gasta menos tokens e é mais fácil de revisar."],
    ["Checklist", "A IA confere a própria resposta antes de entregar."],
    ["Nada sensível", "Não cole dados de clientes, senhas, tokens nem código que a empresa não liberou."]],
    dica:"Dica: \"Copiar como skill\" gera o mesmo conteúdo no formato SKILL.md, para usar como skill no Claude Code e em outros assistentes que aceitam esse formato.",
    fontes:"Baseado nos guias da Anthropic, da OpenAI e do Google:"},
  en:{titulo:"How these prompts were written (and how to write yours)", itens:[
    ["Goal with role and reason", "States who the AI is, what it will produce and why. The reason helps the model decide the details."],
    ["Before you start", "Lists what the AI needs to know. If something is missing, it asks instead of inventing or giving something generic."],
    ["Step-by-step instructions", "The path an experienced QA engineer would follow, with positive rules and clear limits."],
    ["Example", "A short input and an excerpt of the expected output. It improves answers the most: the AI follows the pattern."],
    ["Output format", "Table, list or code, no intro or summary. Lean answers use fewer tokens and are easier to review."],
    ["Checklist", "The AI checks its own answer before delivering it."],
    ["Nothing sensitive", "Don't paste customer data, passwords, tokens or code your company hasn't cleared."]],
    dica:"Tip: \"Copy as skill\" produces the same content in SKILL.md format, to use as a skill in Claude Code and other assistants that accept this format.",
    fontes:"Based on the Anthropic, OpenAI and Google guides:"}
};
const FONTES = [["Anthropic – Prompting best practices", "https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices"],
  ["OpenAI – Best practices for prompt engineering", "https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api"],
  ["Google – Prompt design strategies", "https://ai.google.dev/gemini/docs/prompting-strategies"]];
function openGuide(){
  const g = GUIA[lang];
  showPanel(lang === "en" ? "Prompts" : "Prompts", null, T[lang].guia);
  pBody.innerHTML = `<div class="pguide"><ol>${g.itens.map(([a, b]) => `<li><b>${a}.</b> ${b}</li>`).join("")}</ol>
    <p>${g.dica}</p>
    <p class="muted">${g.fontes} ${FONTES.map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(l)}</a>`).join(" · ")}</p></div>`;
}
function setLang(l){ lang = l; store.set("jqa-prompt-lang", l); renderPrompts(); }

function renderPrompts(){
  const page = $("#promptsPage"), t = T[lang];
  const all = A.C.prompts;
  const temOutros = all.some(p => grupoDe(p.c) === "outros");
  if(grupo === "outros" && !temOutros) grupo = "todos";
  const k = q.toLowerCase();
  const list = all.filter(p => (grupo === "todos" || grupoDe(p.c) === grupo) && (nivel === "Todos" || p.n === nivel)
    && (mostrar === "todos" || (mostrar === "fav" ? fav.has(p.id) : isMine(p)))
    && (!k || [p.t, p.t_en, p.c, p.d, p.d_en, p.quando, p.quando_en, p.p, p.p_en, p.obj, p.obj_en, ...(p.passos || []), ...(p.passos_en || [])].join(" ").toLowerCase().includes(k)));
  const nG = id => all.filter(p => grupoDe(p.c) === id).length;
  const chips = [["todos", t.todas, all.length], ...GRUPOS.map(g => [g.id, g[lang], nG(g.id)]).filter(x => x[2]), ...(temOutros ? [["outros", t.outros, nG("outros")]] : [])];
  const keep = document.activeElement?.id === "pq";
  const vazio = mostrar === "fav" && !fav.size ? t.semFav : mostrar === "meus" && !all.some(isMine) ? t.semMeus : t.vazio;
  page.innerHTML = `
    <div class="ptop">
      <label class="search psearch"><svg><use href="#i-search"/></svg><input id="pq" type="search" placeholder="${esc(t.busca)}" aria-label="${esc(t.busca)}" value="${esc(q)}"></label>
      <select class="select" id="pShow" aria-label="Mostrar">${Object.entries(t.mostrar).map(([v, l]) => `<option value="${v}"${v === mostrar ? " selected" : ""}>${l}</option>`).join("")}</select>
      <select class="select" id="pNivel" aria-label="Nível">${["Todos", ...NIVEIS].map(n => `<option value="${esc(n)}"${n === nivel ? " selected" : ""}>${n === "Todos" ? t.todos : esc(n)}</option>`).join("")}</select>
      <div class="seg langseg" role="group" aria-label="Idioma dos prompts">
        <button class="btn sm" data-lang="pt" aria-pressed="${lang === "pt"}">PT</button><button class="btn sm" data-lang="en" aria-pressed="${lang === "en"}">EN</button>
      </div>
      <button class="btn primary" id="newPrompt">${ico("plus")}${t.novo}</button>
    </div>
    <div class="filters pgroups" role="group" aria-label="Assunto">
      ${chips.map(([id, l, n]) => `<button class="chip" data-g="${id}" aria-pressed="${id === grupo}">${esc(l)} <span class="cnt">${n}</span></button>`).join("")}
    </div>
    <div class="pcount"><span class="count">${list.length} ${t.n}</span><button class="btn sm ghost" id="pGuide">${ico("info")}${t.guia}</button></div>
    <div class="pcards">${list.map(p => `
      <article class="pcard hoverable">
        <button class="pcard-open" data-open="${esc(p.id)}">
          <span class="pmeta"><span class="lv ${LV[p.n] || ""}">${esc(p.n || "—")}</span><span>${esc(p.c)}</span>${isMine(p) ? `<span class="pmine">${lang === "en" ? "mine" : "meu"}</span>` : ""}</span>
          <b>${esc(L(p, "t"))}</b>
          <span class="pdesc">${esc(L(p, "d") || L(p, "quando"))}</span>
        </button>
        <button class="pfav" data-fav="${esc(p.id)}" aria-pressed="${fav.has(p.id)}" aria-label="${esc(fav.has(p.id) ? SEC[lang].desfav : SEC[lang].fav)}" title="${esc(fav.has(p.id) ? SEC[lang].desfav : SEC[lang].fav)}">${fav.has(p.id) ? "★" : "☆"}</button>
      </article>`).join("") || `<p class="empty">${esc(vazio)}</p>`}</div>`;
  if(keep){ const i = $("#pq"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
}
function toggleFav(id){ fav.has(id) ? fav.delete(id) : fav.add(id); saveFav(); renderPrompts(); }

/* eventos da página (delegados, ligados uma vez) */
const page = $("#promptsPage");
page.addEventListener("input", e => { if(e.target.id === "pq"){ q = e.target.value; renderPrompts(); } });
page.addEventListener("change", e => {
  if(e.target.id === "pShow"){ mostrar = e.target.value; renderPrompts(); }
  else if(e.target.id === "pNivel"){ nivel = e.target.value; renderPrompts(); }
});
page.addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  const find = id => A.C.prompts.find(p => p.id === id);
  if(b.dataset.lang) setLang(b.dataset.lang);
  else if(b.dataset.g){ grupo = b.dataset.g; renderPrompts(); }
  else if(b.dataset.fav) toggleFav(b.dataset.fav);
  else if(b.dataset.open) openPrompt(find(b.dataset.open));
  else if(b.id === "pGuide") openGuide();
  else if(b.id === "newPrompt") editPrompt(null);
});

/* ---------- detalhes ---------- */
async function copy(text, en){
  try{ await navigator.clipboard.writeText(text); toast(en ? "Copied." : "Copiado."); }
  catch(err){ toast(en ? "Select the text and copy it." : "Selecione o texto e copie."); }
}
function openPrompt(p){
  if(!p) return;
  const en = lang === "en", S = SEC[lang];
  showPanel(`${p.n || ""} · ${p.c}`, null, L(p, "t"));
  const semEn = en && !(p.t_en || p.obj_en || p.p_en);
  const head = `
    ${semEn ? `<p class="hnote" style="margin:0">${esc(S.semEn)}</p>` : ""}
    ${L(p, "d") ? `<p style="margin:0">${esc(L(p, "d"))}</p>` : ""}
    <div class="actions">
      <button class="btn primary" id="pCopy">${ico("prompt")}${S.copiar}</button>
      <button class="btn" id="pFavP" aria-pressed="${fav.has(p.id)}">${fav.has(p.id) ? "★ " + S.desfav : "☆ " + S.fav}</button>
      <button class="btn" id="pEditP">${ico("pen")}${S.editar}</button>
    </div>
    ${L(p, "quando") ? `<section><h4>${S.quando}</h4><p style="margin:0">${esc(L(p, "quando"))}</p></section>` : ""}`;
  const tail = `${L(p, "rev") ? `<section><h4>${S.rev}</h4><p class="practice">${esc(L(p, "rev"))}</p></section>` : ""}`;
  if(hasSec(p)){
    const ol = a => `<ol class="psteps">${a.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`;
    const ul = a => `<ul class="pchecks">${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    pBody.innerHTML = head + `
      <div class="psec"><h4>${S.obj}</h4><p>${esc(L(p, "obj"))}</p></div>
      ${LA(p, "antes").length ? `<div class="psec"><h4>${S.antes}</h4><p class="muted">${esc(S.antesIntro)}</p>${ol(LA(p, "antes"))}</div>` : ""}
      ${LA(p, "passos").length ? `<div class="psec"><h4>${S.passos}</h4>${ol(LA(p, "passos"))}</div>` : ""}
      ${L(p, "ex") ? `<div class="psec"><h4>${S.ex}</h4><div class="code lab"><pre>${esc(L(p, "ex"))}</pre></div></div>` : ""}
      ${LA(p, "saida").length ? `<div class="psec"><h4>${S.saida}</h4>${ul(LA(p, "saida"))}</div>` : ""}
      ${LA(p, "check").length ? `<div class="psec"><h4>${S.check}</h4>${ul(LA(p, "check"))}</div>` : ""}
      <details class="pfull"><summary>${S.texto}</summary><div class="code lab"><pre>${esc(assemble(p))}</pre></div>
        <button class="btn sm" id="pSkill">${ico("prompt")}${S.skill}</button></details>
      ${tail}`;
    $("#pCopy").onclick = () => copy(assemble(p), en);
    $("#pSkill").onclick = () => copy(assemble(p, true), en);
  } else {
    /* prompt simples (criado pela pessoa): campos para preencher as variáveis */
    const text = L(p, "p"), vs = vars(text);
    pBody.innerHTML = head + `
      ${vs.length ? `<section><h4>${en ? "Fill in" : "Preencha"} <span class="count">${vs.length}</span></h4>
        <div class="pvars">${vs.map((v, i) => `<label>${esc(varName(v))}${/\n|cole|paste/i.test(v) ? `<textarea class="in" rows="3" data-v="${i}"></textarea>` : `<input class="in" data-v="${i}">`}</label>`).join("")}</div></section>` : ""}
      <section><h4>Prompt</h4><div class="code lab"><pre id="pText"></pre></div></section>${tail}`;
    const filled = () => { let s = text; pBody.querySelectorAll("[data-v]").forEach(i => { const v = i.value.trim(); if(v) s = s.split(vs[+i.dataset.v]).join(v); }); return s; };
    const paint = () => { let h = esc(text);
      pBody.querySelectorAll("[data-v]").forEach(i => { const v = i.value.trim(), m = esc(vs[+i.dataset.v]);
        h = h.split(m).join(v ? `<mark class="pfill">${esc(v)}</mark>` : `<mark class="pvar">${m}</mark>`); });
      $("#pText").innerHTML = h; };
    paint(); pBody.querySelectorAll("[data-v]").forEach(i => i.addEventListener("input", paint));
    $("#pCopy").onclick = () => copy(filled(), en);
  }
  $("#pFavP").onclick = () => { toggleFav(p.id); openPrompt(p); };
  $("#pEditP").onclick = () => editPrompt(p);
  $("#pClose").focus();
}

/* ---------- edição ----------
 * Prompt novo: só título e texto; o resto (categoria, nível, descrição, inglês) fica em "Mais opções".
 * Prompt no formato de skill: as seções em português; o inglês fica num bloco opcional, fechado. */
const LISTAS = ["antes", "passos", "saida", "check"];
function editPrompt(p){
  const isNew = !p, d = p || {c:"", n:NIVEIS[0]};
  const sec = !isNew && hasSec(d);
  const cats = [...new Set(A.C.prompts.map(x => x.c))];
  showPanel(isNew ? "Novo prompt" : "Editando prompt", null, isNew ? "Novo prompt" : d.t);
  const val = k => Array.isArray(d[k]) ? d[k].join("\n") : (d[k] || "");
  const fld = (label, k, rows, mono, hint) => `<label>${label}${hint ? ` <span class="muted">${hint}</span>` : ""}${rows ? `<textarea class="in${mono ? " mono" : ""}" name="${k}" rows="${rows}">${esc(val(k))}</textarea>` : `<input class="in" name="${k}" value="${esc(val(k))}">`}</label>`;
  const SKILL = [["Objetivo", "obj", 3, false, "papel, o que produzir e para quê"], ["Antes de começar", "antes", 3, false, "uma pergunta por linha"],
    ["Instruções", "passos", 6, false, "um passo por linha"], ["Exemplo", "ex", 6, true, "entrada e trecho da saída"],
    ["Formato da saída", "saida", 3, false, "um item por linha"], ["Checklist", "check", 3, false, "um item por linha"]];
  const textoPT = sec ? SKILL.map(x => fld(...x)).join("") : fld("Prompt", "p", 10, true, "use {{assim}} no que muda a cada uso");
  const textoEN = sec ? SKILL.map(([l, k, r, m]) => fld(l, k + "_en", r, m)).join("") : fld("Prompt", "p_en", 8, true);
  pBody.innerHTML = `<form class="form" id="pForm" novalidate>
    ${fld("Título", "t")}
    ${textoPT}
    <details class="pmore"${isNew ? "" : " open"}><summary>Mais opções <span class="muted">categoria, nível, descrição, quando usar</span></summary>
      <div class="two"><label>Categoria <span class="muted">sem categoria, fica em "Meus"</span><input class="in" name="c" list="pCatList" value="${esc(d.c || "")}"></label>
      <label>Nível<select class="in" name="n">${NIVEIS.map(n => `<option${n === d.n ? " selected" : ""}>${n}</option>`).join("")}</select></label></div>
      <datalist id="pCatList">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist>
      ${fld("Descrição curta", "d", 2)}
      ${fld("Quando usar", "quando", 2)}
      ${fld("Antes de usar a resposta", "rev", 2, false, "o que conferir no que a IA devolver")}
    </details>
    <details class="pmore"><summary>Versão em inglês <span class="muted">opcional; sem ela, o EN mostra o português</span></summary>
      ${fld("Title", "t_en")}${textoEN}${fld("Short description", "d_en", 2)}${fld("When to use", "quando_en", 2)}${fld("Before using the answer", "rev_en", 2)}
    </details>
    <p class="err" id="pErr" hidden>Preencha o título e ${sec ? "o objetivo" : "o prompt"}.</p>
    <div class="formfoot">${isNew ? "<span></span>" : `<button type="button" class="btn ghost danger" id="pDelP">${ico("trash")}Excluir</button>`}
      <span class="right"><button type="button" class="btn" id="pCancel">Cancelar</button><button class="btn primary" type="submit">${isNew ? "Criar prompt" : "Salvar"}</button></span></div>
  </form>`;
  const f = $("#pForm"); f.t.focus();
  $("#pCancel").onclick = () => isNew ? closePanel() : openPrompt(p);
  if(!isNew) $("#pDelP").onclick = () => delPrompt(p);
  f.onsubmit = e => {
    e.preventDefault();
    const v = n => f[n].value.trim();
    const lines = n => f[n].value.split("\n").map(x => x.trim()).filter(Boolean);
    const data = {c:v("c") || "Meus", n:f.n.value};
    const keys = sec ? ["t","d","quando","obj","ex","rev"] : ["t","d","quando","p","rev"];
    keys.forEach(k => { data[k] = v(k); data[k + "_en"] = v(k + "_en"); });
    if(sec) LISTAS.forEach(k => { data[k] = lines(k); data[k + "_en"] = lines(k + "_en"); });
    if(!data.t || !(sec ? data.obj : data.p)){ $("#pErr").hidden = false; return; }
    let target;
    if(isNew){ target = {id:uid("p"), ...data}; A.C.prompts.unshift(target); mostrar = "todos"; }
    else { target = p; Object.assign(p, data); }
    saveContent(); renderPrompts(); toast(isNew ? "Prompt criado. Ele aparece em Meus prompts." : "Prompt salvo."); openPrompt(target);
  };
}
async function delPrompt(p){
  if(!p || !await A.ask(`Excluir o prompt "${p.t}"?`)) return;
  A.C.prompts = A.C.prompts.filter(x => x !== p); saveContent(); closePanel(); renderPrompts(); toast("Prompt excluído.");
}

Object.assign(A, {renderPrompts, openPrompt});
})(JQA.app);
