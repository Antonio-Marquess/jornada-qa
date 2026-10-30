/* Jornada QA — Minimapa de IA para QA
 * Montado a partir do conteúdo de data/qa/ia.js (o mesmo do caderno pronto "IA para QA"),
 * para estudar o assunto também em forma de mapa. Formato igual ao de data/qa/minimapas/seguranca.js. */
window.JQA = window.JQA || {};

(function(J){
const IA = J.IA; if(!IA) return;
const m = IA.mcp, a = IA.agentes;
/* nomes curtos das regras de ouro, na ordem de IA.regras */
const REGRAS = ["Nada sensível na IA", "Todo código gerado é revisado", "Veja o teste falhar", "Healing não pode esconder bug",
  "Severidade e liberação são decisão sua", "MCP com o mínimo de permissão", "Registre quando a IA ajudou"];
/* nomes curtos dos exercícios, na ordem de IA.exercicios */
const EXERCICIOS = ["Cenários de login com IA", "Comparar usuários com Playwright MCP", "Suíte com os Test Agents", "Healer: corrige ou esconde?", "Política de IA do time"];
(J.MINIMAPAS = J.MINIMAPAS || []).push(
{id:"ia-qa", t:"IA para QA", icon:"spark",
 d:IA.intro,
 comeco:"Comece pelos conceitos (modelo, contexto, RAG, ferramentas, agentes e skills): eles explicam por que a IA erra e o que testar. Depois use a IA como tutora e para entender requisitos e gerar cenários. Em seguida, conecte o assistente às ferramentas com MCP e, por último, trabalhe com os agentes de teste do Playwright.",
 carreira:"QA que usa IA no dia a dia com critério e, aprofundando, QA de sistemas com IA: veja o minimapa Segurança e confiabilidade de IA.",
 ramos:[
  {k:"fund", t:"Conceitos de IA", itens:(IA.conceitos || []).map(c => ({t:c.t, tag:c.g, d:`${c.d} Para QA: ${c.qa}`}))},
  {k:"fund", t:"MCP e agentes de teste", cor:"--e5", itens:[
    ...m.partes.map(p => ({t:p.t, tag:"Peça do MCP", d:p.d})),
    {t:"Agentes de teste do Playwright", tag:"Conceito", d:a.oque + " " + a.passos.map(p => `${p.t}: ${p.d}`).join(" "),
     l:[[a.link[0], a.link[1], "Leia a página inteira antes de rodar"]], lab:a.cmd}
  ]},
  {k:"est", t:"Onde a IA ajuda", cor:"--e2", itens:IA.tarefas.map(t => ({t:t.t, tag:"Tarefa",
    d:`Como usar: ${t.como} Cuidado: ${t.cuidado}`}))},
  {k:"est", t:"Uma história do começo ao fim", cor:"--e3", itens:IA.fluxo.map(f => ({t:f.t, tag:"Etapa", d:f.d}))},
  {k:"fund", t:"Regras de ouro", cor:"--danger", itens:IA.regras.map((r, i) => ({t:REGRAS[i] || "Regra " + (i + 1), tag:"Regra " + (i + 1), d:r}))},
  {k:"ferr", itens:[
    ...m.servidores.map(s => ({t:s.t, tag:"Servidor MCP", d:s.faz, q:`Peça assim: ${s.pedido} Cuidado: ${s.cuidado}`, l:[[s.t, s.url, "README: instalação e exemplos"]]})),
    {t:"Configurar um servidor MCP", tag:"Configuração", d:m.configNota, lab:m.config, l:m.links.map(([t, u]) => [t, u, ""])}
  ]},
  {k:"prat", itens:IA.exercicios.map((x, i) => ({t:EXERCICIOS[i] || "Exercício " + (i + 1), tag:"Exercício " + (i + 1), d:x, x}))},
  {k:"trilha", itens:["e1-ia-como-tutora","e2-ia-no-dia-a-dia","e3-mcp-na-pratica","e3-agentes-de-teste","e3-testar-features-de-ia","e4-qualidade-de-ia-e-agentes","e5-politica-de-ia-no-time"].map(topico => ({topico}))}
 ]}
);
})(window.JQA);
