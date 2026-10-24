/* Jornada QA — Aba Prompts: biblioteca em português e inglês, no formato de skill
 * (objetivo, antes de começar, instruções, exemplo, formato e checklist), com níveis, categorias,
 * cópia do texto completo ou como SKILL.md e edição pela própria página. */
(function(A){
const {J, $, esc, uid, ico, actions, store, toast, saveContent, pBody, showPanel, closePanel} = A;

const NIVEIS = J.PROMPT_NIVEIS || ["Iniciante", "Intermediário", "Avançado"];
const LV = {"Iniciante":"lv1", "Intermediário":"lv2", "Avançado":"lv3"};
let cat = "Todas", nivel = "Todos", q = "", lang = store.get("jqa-prompt-lang", "pt");
const L = (p, k) => (lang === "en" && p[k + "_en"]) ? p[k + "_en"] : (p[k] || p[k + "_en"] || "");
/* variáveis: {{assim}}; prompts antigos ou criados pela pessoa podem usar <assim> */
const vars = text => /\{\{/.test(text) ? [...new Set(text.match(/\{\{[^{}\n]{1,80}\}\}/g) || [])] : [...new Set(text.match(/<[^<>\n\/]{1,60}>/g) || [])];
const varName = v => v.replace(/^\{\{|\}\}$|^<|>$/g, "");
const T = {
  pt:{lead:"Prompts completos para o dia a dia de QA, no formato de skill: objetivo, perguntas iniciais, instruções, exemplo, formato e checklist. Copie e cole na IA; se faltar informação, ela pergunta.",
      busca:"Buscar por título, descrição ou conteúdo", todas:"Todas as categorias", todos:"Todos os níveis", n:"prompts", vazio:"Nenhum prompt encontrado. Tente outra palavra ou limpe os filtros."},
  en:{lead:"Complete prompts for everyday QA work, in skill format: goal, opening questions, instructions, example, format and checklist. Copy and paste into the AI; if information is missing, it asks.",
      busca:"Search by title, description or content", todas:"All categories", todos:"All levels", n:"prompts", vazio:"No prompts found. Try another word or clear the filters."}
};
/* rótulos das seções e montagem do texto completo (é o que vai no Copiar) */
const SEC = {
  pt:{obj:"Objetivo", antes:"Antes de começar", antesIntro:"Se eu ainda não enviei as informações abaixo, não comece. Pergunte só o que faltar e espere minha resposta:",
      passos:"Instruções", ex:"Exemplo", saida:"Formato da saída", saidaFim:"Sem introdução e sem resumo final.", check:"Checklist antes de responder",
      quando:"Quando usar", rev:"Antes de usar a resposta", texto:"Ver o texto completo que será copiado", copiar:"Copiar prompt", skill:"Copiar como skill (SKILL.md)"},
  en:{obj:"Goal", antes:"Before you start", antesIntro:"If I haven't sent the information below yet, don't start. Ask only for what's missing and wait for my answer:",
      passos:"Instructions", ex:"Example", saida:"Output format", saidaFim:"No intro and no closing summary.", check:"Checklist before answering",
      quando:"When to use", rev:"Before using the answer", texto:"See the full text that will be copied", copiar:"Copy prompt", skill:"Copy as skill (SKILL.md)"}
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
let guiaAberto = store.get("jqa-prompt-guia", true);
function guide(){
  const g = GUIA[lang];
  return `<details class="pguide"${guiaAberto ? " open" : ""}><summary>${g.titulo}</summary>
    <ol>${g.itens.map(([a, b]) => `<li><b>${a}.</b> ${b}</li>`).join("")}</ol>
    <p>${g.dica}</p>
    <p class="muted">${g.fontes} ${FONTES.map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(l)}</a>`).join(" · ")}</p></details>`;
}
function setLang(l){ lang = l; store.set("jqa-prompt-lang", l); renderPrompts(); }

function renderPrompts(){
  const page = $("#promptsPage"), t = T[lang];
  const all = A.C.prompts;
  const cats = [...new Set(all.map(p => p.c))];
  if(!cats.includes(cat)) cat = "Todas";
  const k = q.toLowerCase();
  const list = all.filter(p => (cat === "Todas" || p.c === cat) && (nivel === "Todos" || p.n === nivel)
    && (!k || [p.t, p.t_en, p.d, p.d_en, p.quando, p.quando_en, p.p, p.p_en, p.obj, p.obj_en, ...(p.passos || []), ...(p.passos_en || [])].join(" ").toLowerCase().includes(k)));
  const keep = document.activeElement?.id === "pq";
  page.innerHTML = `
    <div class="pagehead"><p class="lead">${t.lead}</p>
      <div class="ptools">
        <div class="seg langseg" role="group" aria-label="Idioma dos prompts">
          <button class="btn sm" data-lang="pt" aria-pressed="${lang === "pt"}">PT</button><button class="btn sm" data-lang="en" aria-pressed="${lang === "en"}">EN</button>
        </div>
        <button class="btn primary" id="newPrompt">${ico("plus")}Novo prompt</button>
      </div></div>
    ${guide(t)}
    <label class="search psearch"><svg><use href="#i-search"/></svg><input id="pq" type="search" placeholder="${esc(t.busca)}" aria-label="${esc(t.busca)}" value="${esc(q)}"></label>
    <div class="filters" role="group" aria-label="Categorias">
      <button class="chip" data-c="Todas" aria-pressed="${cat === "Todas"}">${t.todas} <span class="cnt">${all.length}</span></button>
      ${cats.map(c => `<button class="chip" data-c="${esc(c)}" aria-pressed="${c === cat}">${esc(c)} <span class="cnt">${all.filter(p => p.c === c).length}</span></button>`).join("")}
    </div>
    <div class="filters" role="group" aria-label="Nível">
      ${["Todos", ...NIVEIS].map(n => `<button class="chip lvchip ${LV[n] || ""}" data-n="${esc(n)}" aria-pressed="${n === nivel}">${n === "Todos" ? t.todos : esc(n)}</button>`).join("")}
    </div>
    <p class="count">${list.length} ${t.n}</p>
    <div class="pcards">${list.map(p => `
      <article class="pcard hoverable">
        <button class="pcard-open" data-open="${esc(p.id)}">
          <span class="pmeta"><span class="lv ${LV[p.n] || ""}">${esc(p.n || "—")}</span><span>${esc(p.c)}</span></span>
          <b>${esc(L(p, "t"))}</b>
          <span class="pdesc">${esc(L(p, "d") || L(p, "quando"))}</span>
        </button>
        ${actions(`data-pedit="${esc(p.id)}"`, `data-pdel="${esc(p.id)}"`, L(p, "t"))}
      </article>`).join("") || `<p class="empty">${t.vazio}</p>`}</div>`;
  if(keep){ const i = $("#pq"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
}

/* eventos da página (delegados, ligados uma vez) */
const page = $("#promptsPage");
page.addEventListener("toggle", e => { if(e.target.classList?.contains("pguide")){ guiaAberto = e.target.open; store.set("jqa-prompt-guia", guiaAberto); } }, true);
page.addEventListener("input", e => { if(e.target.id === "pq"){ q = e.target.value; renderPrompts(); } });
page.addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  const find = id => A.C.prompts.find(p => p.id === id);
  if(b.dataset.lang) setLang(b.dataset.lang);
  else if(b.dataset.c){ cat = b.dataset.c; renderPrompts(); }
  else if(b.dataset.n){ nivel = b.dataset.n; renderPrompts(); }
  else if(b.dataset.open) openPrompt(find(b.dataset.open));
  else if(b.dataset.pedit) editPrompt(find(b.dataset.pedit));
  else if(b.dataset.pdel) delPrompt(find(b.dataset.pdel));
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
  const head = `
    ${L(p, "d") ? `<p style="margin:0">${esc(L(p, "d"))}</p>` : ""}
    <div class="actions">
      <button class="btn primary" id="pCopy">${ico("prompt")}${S.copiar}</button>
      <div class="seg langseg" role="group" aria-label="Idioma"><button class="btn sm" data-dl="pt" aria-pressed="${!en}">PT</button><button class="btn sm" data-dl="en" aria-pressed="${en}">EN</button></div>
      <button class="btn" id="pEditP">${ico("pen")}Editar</button>
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
  pBody.querySelectorAll("[data-dl]").forEach(b => b.onclick = () => { setLang(b.dataset.dl); openPrompt(p); });
  $("#pEditP").onclick = () => editPrompt(p);
  $("#pClose").focus();
}

/* ---------- edição: os dois idiomas lado a lado ---------- */
const LISTAS = ["antes", "passos", "saida", "check"];
function editPrompt(p){
  const isNew = !p, d = p || {c:cat !== "Todas" ? cat : "", n:NIVEIS[0], obj:"", antes:[], passos:[], saida:[], check:[]};
  const sec = isNew || hasSec(d);
  const cats = [...new Set(A.C.prompts.map(x => x.c))];
  showPanel(isNew ? "Novo prompt" : "Editando prompt", null, isNew ? "Novo prompt" : d.t);
  const val = k => Array.isArray(d[k]) ? d[k].join("\n") : (d[k] || "");
  const pair = (label, k, rows, mono, hint) => `<div class="two"><label>${label} <span class="muted">PT${hint ? " · " + hint : ""}</span>${rows ? `<textarea class="in${mono ? " mono" : ""}" name="${k}" rows="${rows}">${esc(val(k))}</textarea>` : `<input class="in" name="${k}" value="${esc(val(k))}">`}</label>
    <label>${label} <span class="muted">EN</span>${rows ? `<textarea class="in${mono ? " mono" : ""}" name="${k}_en" rows="${rows}">${esc(val(k + "_en"))}</textarea>` : `<input class="in" name="${k}_en" value="${esc(val(k + "_en"))}">`}</label></div>`;
  pBody.innerHTML = `<form class="form" id="pForm" novalidate>
    <div class="two"><label>Categoria<input class="in" name="c" list="pCatList" value="${esc(d.c || "")}" required></label>
    <label>Nível<select class="in" name="n">${NIVEIS.map(n => `<option${n === d.n ? " selected" : ""}>${n}</option>`).join("")}</select></label></div>
    <datalist id="pCatList">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist>
    ${pair("Título", "t")}
    ${pair("Descrição curta", "d", 2)}
    ${pair("Quando usar", "quando", 2)}
    ${sec ? `${pair("Objetivo", "obj", 3, false, "papel, o que produzir e para quê")}
      ${pair("Antes de começar", "antes", 3, false, "uma pergunta por linha")}
      ${pair("Instruções", "passos", 6, false, "um passo por linha")}
      ${pair("Exemplo", "ex", 6, true, "entrada e trecho da saída")}
      ${pair("Formato da saída", "saida", 3, false, "um item por linha")}
      ${pair("Checklist", "check", 3, false, "um item por linha")}`
    : pair("Prompt", "p", 10, true)}
    ${pair("Antes de usar a resposta", "rev", 2)}
    <p class="muted" style="margin:0">O inglês é opcional: sem ele, a versão EN mostra o texto em português.</p>
    <p class="err" id="pErr" hidden>Preencha categoria, título e ${sec ? "o objetivo" : "o prompt"} em português.</p>
    <div class="formfoot">${isNew ? "<span></span>" : `<button type="button" class="btn ghost danger" id="pDelP">${ico("trash")}Excluir</button>`}
      <span class="right"><button type="button" class="btn" id="pCancel">Cancelar</button><button class="btn primary" type="submit">${isNew ? "Criar prompt" : "Salvar"}</button></span></div>
  </form>`;
  const f = $("#pForm"); f.c.focus();
  $("#pCancel").onclick = () => isNew ? closePanel() : openPrompt(p);
  if(!isNew) $("#pDelP").onclick = () => delPrompt(p);
  f.onsubmit = e => {
    e.preventDefault();
    const v = n => f[n].value.replace(/\s+$/, "").replace(/^\s+/, "");
    const lines = n => f[n].value.split("\n").map(x => x.trim()).filter(Boolean);
    const data = {c:v("c"), n:f.n.value};
    const keys = sec ? ["t","d","quando","obj","ex","rev"] : ["t","d","quando","p","rev"];
    keys.forEach(k => { data[k] = v(k); data[k + "_en"] = v(k + "_en"); });
    if(sec) LISTAS.forEach(k => { data[k] = lines(k); data[k + "_en"] = lines(k + "_en"); });
    if(!data.c || !data.t || !(sec ? data.obj : data.p)){ $("#pErr").hidden = false; return; }
    let target;
    if(isNew){ target = {id:uid("p"), ...data}; A.C.prompts.unshift(target); }
    else { target = p; Object.assign(p, data); }
    saveContent(); renderPrompts(); toast(isNew ? "Prompt criado." : "Prompt salvo."); openPrompt(target);
  };
}
function delPrompt(p){
  if(!p || !confirm(`Excluir o prompt "${p.t}"?`)) return;
  A.C.prompts = A.C.prompts.filter(x => x !== p); saveContent(); closePanel(); renderPrompts(); toast("Prompt excluído.");
}

Object.assign(A, {renderPrompts});
})(JQA.app);
