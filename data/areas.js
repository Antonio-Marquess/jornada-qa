window.JQA = window.JQA || {};
/* Jornadas: cada área de estudo é um módulo com a mesma estrutura (trilha, carreira, minimapas, prompts, biblioteca).
 * A Jornada QA é o módulo oficial: o conteúdo dela fica em data/qa/.
 * Cada pessoa pode criar jornadas próprias (Dados, Front-end, UX…) pela página; elas começam em branco,
 * com uma carreira em Y genérica para ajustar, e ficam salvas no navegador.
 * Campos: id, nome (curto), titulo (nome na barra lateral), sub (subtítulo), frase (chamada da home),
 *         conteudo (true: tem as abas IA no dia a dia e Projetos). */
JQA.AREAS = [
  {id:"qa", nome:"QA", titulo:"Jornada QA", sub:"Além do teste",
   frase:"Aprenda QA do zero ao sênior, com IA no dia a dia desde o primeiro passo.", conteudo:true}
];

/* Carreira em Y genérica, sem requisitos de uma área específica: o ponto de partida de uma jornada nova.
 * Os escopos e comportamentos valem para quase qualquer carreira técnica; o resto a pessoa escreve. */
JQA.CARREIRA_BASE = [
  {id:"estagio", nome:"Estágio", ramo:"base", escopo:"Tarefas definidas por outra pessoa, sempre com revisão.",
   comport:["Pede revisão do próprio trabalho","Registra o que aprendeu","Cumpre o que combinou ou avisa cedo que não vai dar"]},
  {id:"junior", nome:"Júnior", ramo:"base", escopo:"Uma entrega por vez, com apoio de alguém mais experiente.",
   comport:["Avisa riscos sem esperar perguntarem","Aceita revisão sem levar para o pessoal","Ajuda quem chegou depois"]},
  {id:"pleno", nome:"Pleno", ramo:"base", escopo:"Uma área do produto, com autonomia. Decide como fazer e responde pelo resultado.",
   comport:["Discorda com dados, não com opinião","Assume o problema até o fim","Compartilha o que aprendeu com o time"]},
  {id:"senior", nome:"Sênior", ramo:"base", escopo:"Um time ou produto inteiro, incluindo o que acontece em produção.",
   comport:["Faz o time inteiro trabalhar melhor","Diz não com alternativa","Escreve para ser entendido por quem não é técnico"]},
  {id:"especialista", nome:"Especialista", ramo:"tecnico", escopo:"Uma especialidade aplicada em vários times.",
   comport:["Ensina em escala: documentação, workshops, revisões","Escolhe tecnologia pelo problema, não pela moda"]},
  {id:"staff", nome:"Staff / Principal", ramo:"tecnico", escopo:"Decisões técnicas que afetam a organização toda.",
   comport:["Pensa em anos, não em sprints","Convence com escrita e dados","Faz os outros brilharem"]},
  {id:"lider-tecnico", nome:"Líder técnico", ramo:"ponte", escopo:"Direção técnica de um ou mais times, geralmente sem gestão formal de pessoas.",
   comport:["Prefere o resultado do time ao próprio","Conversa difícil cedo, não tarde"]},
  {id:"coordenacao", nome:"Coordenação", ramo:"gestao", escopo:"Pessoas: contratação, desenvolvimento e desempenho de um time.",
   comport:["Consistência: as pessoas sabem o que esperar","Justiça visível nas decisões"]},
  {id:"gerencia", nome:"Gerência", ramo:"gestao", escopo:"Vários times e coordenações. Orçamento, estrutura e metas.",
   comport:["Pensa em sistema, não em casos","Comunica a mesma mensagem para cima e para baixo"]},
  {id:"head", nome:"Head / Direção", ramo:"gestao", escopo:"A área como função da empresa. Responde à liderança executiva.",
   comport:["Decide com informação incompleta","Dá crédito ao time e assume as falhas"]}
];
