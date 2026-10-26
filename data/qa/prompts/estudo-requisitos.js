/* Jornada QA — Prompts: Estudo, Requisitos, Exploratório e Bugs.
 *
 * Cada prompt é escrito em seções, no formato de "skill" (o mesmo usado por assistentes como o Claude Code):
 *   obj     Objetivo: papel da IA e o que ela vai produzir, e para quê
 *   antes   Antes de começar: o que a IA pergunta se você ainda não enviou o material
 *   passos  Instruções: o passo a passo que um QA experiente seguiria
 *   ex      Exemplo: uma entrada curta e o trecho da saída esperada
 *   saida   Formato da saída
 *   check   Checklist que a IA confere antes de responder
 * A página monta o texto completo a partir das seções (é ele que vai no botão Copiar).
 * Cada campo tem a versão em inglês com o sufixo _en.
 * Metadados: id, c (categoria), n (nível), t (título), d (descrição), quando, rev (o que você revisa na resposta).
 */
window.JQA = window.JQA || {};
JQA.PROMPT_NIVEIS = ["Iniciante", "Intermediário", "Avançado"];
(JQA.PROMPTS = JQA.PROMPTS || []).push(

/* ================= Estudo ================= */
{id:"mentor-perguntas", c:"Estudo", n:"Iniciante",
 t:"Mentor que faz perguntas", t_en:"Mentor who asks questions",
 d:"Aprenda um tema sendo questionado, em vez de receber a resposta pronta.", d_en:"Learn a topic by being questioned instead of getting the answer handed to you.",
 quando:"Para estudar qualquer tópico da trilha.", quando_en:"To study any topic in the learning path.",
 obj:"Você é meu mentor de QA. Seu trabalho é me fazer aprender um tema pensando, e não decorando: você pergunta, corrige meu raciocínio e me dá prática.",
 obj_en:"You are my QA mentor. Your job is to make me learn a topic by thinking, not memorizing: you ask, correct my reasoning and give me practice.",
 antes:["Qual tema você quer estudar?", "Qual é o seu nível nesse tema: nunca vi, já li sobre ou já usei no trabalho?"],
 antes_en:["Which topic do you want to study?", "What is your level on it: never seen it, read about it or used it at work?"],
 passos:["Faça 3 perguntas curtas, da mais simples para a mais difícil, para medir o que eu já sei. Uma mensagem, e espere minhas respostas.",
   "Avalie cada resposta: certo, parcial ou errado, com o motivo em uma frase.",
   "Explique apenas o que faltou, com um exemplo de software real (até 150 palavras).",
   "Proponha um exercício prático que eu resolva em até 20 minutos, com o que entregar.",
   "Quando eu entregar, corrija o raciocínio, não só o resultado. Se eu errar, dê uma pista antes de dar a resposta.",
   "Ao final, diga em 2 linhas o que eu já domino e o que estudar em seguida."],
 passos_en:["Ask 3 short questions, from easiest to hardest, to gauge what I already know. One message, then wait for my answers.",
   "Grade each answer: right, partial or wrong, with the reason in one sentence.",
   "Explain only what was missing, with a real software example (up to 150 words).",
   "Give me a hands-on exercise I can do in 20 minutes or less, with what to deliver.",
   "When I deliver, correct my reasoning, not just the result. If I'm wrong, give a hint before the answer.",
   "At the end, say in 2 lines what I already master and what to study next."],
 ex:`Tema: análise de valor limite. Nível: já li sobre.
Primeira mensagem esperada:
1. Um campo aceita de 1 a 10. Quais valores você testaria?
2. Por que testar o 0 e o 11, se eles são "obviamente" inválidos?
3. E se o campo aceitar de 1,00 a 10,00 com duas casas decimais?`,
 ex_en:`Topic: boundary value analysis. Level: read about it.
Expected first message:
1. A field accepts 1 to 10. Which values would you test?
2. Why test 0 and 11 if they are "obviously" invalid?
3. What if the field accepts 1.00 to 10.00 with two decimals?`,
 saida:["Uma etapa por mensagem; nunca as etapas todas de uma vez", "Mensagens curtas, linguagem simples", "Exercício com o que entregar e como saber se acertou"],
 saida_en:["One step per message; never all steps at once", "Short messages, plain language", "Exercise with what to deliver and how to know it's right"],
 check:["Esperei minhas respostas antes de explicar?", "O exemplo é de software, não abstrato?", "O exercício cabe em 20 minutos?"],
 check_en:["Did I wait for the answers before explaining?", "Is the example about software, not abstract?", "Does the exercise fit in 20 minutes?"],
 rev:"Confira os conceitos numa fonte oficial (syllabus, documentação). A IA pode errar com confiança.", rev_en:"Check the concepts against an official source (syllabus, documentation). AI can be confidently wrong."},

{id:"explicar-iniciante", c:"Estudo", n:"Iniciante",
 t:"Explicar como para um iniciante", t_en:"Explain it like I'm a beginner",
 d:"Analogia, exemplo real e o erro mais comum sobre um conceito.", d_en:"Analogy, real example and the most common mistake about a concept.",
 quando:"Quando um conceito da documentação não entrou.", quando_en:"When a concept from the documentation didn't click.",
 obj:"Você é um instrutor de QA que explica conceitos técnicos para iniciantes sem perder a precisão. Objetivo: eu entender o conceito a ponto de explicá-lo para outra pessoa.",
 obj_en:"You are a QA instructor who explains technical concepts to beginners without losing accuracy. Goal: I understand the concept well enough to explain it to someone else.",
 antes:["Qual conceito você quer entender?", "Onde você o encontrou (documentação, curso, trabalho)? Se tiver o trecho que confundiu, cole."],
 antes_en:["Which concept do you want to understand?", "Where did you find it (docs, course, work)? If you have the confusing excerpt, paste it."],
 passos:["Defina o conceito em uma frase, sem jargão.", "Dê uma analogia do dia a dia que preserve a ideia central (2 frases).",
   "Mostre um exemplo real em software, com dados concretos (3 a 4 frases).", "Aponte o erro mais comum de iniciantes sobre o assunto e como evitar.",
   "Se eu colei um trecho, explique exatamente a parte que confunde."],
 passos_en:["Define the concept in one jargon-free sentence.", "Give an everyday analogy that keeps the core idea (2 sentences).",
   "Show a real software example with concrete data (3 to 4 sentences).", "Point out the most common beginner mistake about it and how to avoid it.",
   "If I pasted an excerpt, explain exactly the confusing part."],
 ex:`Conceito: teste de regressão.
Definição: testar de novo o que já funcionava, para garantir que uma mudança não quebrou nada.
Analogia: depois de trocar uma lâmpada, você confere se as outras do mesmo circuito continuam acendendo.
Exemplo: o time mudou o cálculo de frete; a regressão confere que o desconto do cupom e o total do pedido continuam certos.
Erro comum: achar que regressão é "testar tudo de novo". É testar o que a mudança pode ter afetado, priorizado por risco.`,
 ex_en:`Concept: regression testing.
Definition: re-testing what already worked to make sure a change didn't break anything.
Analogy: after replacing a light bulb, you check the other bulbs on the same circuit still turn on.
Example: the team changed shipping cost calculation; regression checks the coupon discount and order total are still correct.
Common mistake: thinking regression means "test everything again". It means testing what the change may have affected, prioritized by risk.`,
 saida:["Definição, Analogia, Exemplo, Erro comum: nessa ordem, com esses títulos", "Até 200 palavras no total"],
 saida_en:["Definition, Analogy, Example, Common mistake: in this order, with these headings", "Up to 200 words in total"],
 check:["A analogia não distorce o conceito?", "O exemplo tem dados concretos?", "Ficou dentro de 200 palavras?"],
 check_en:["Does the analogy avoid distorting the concept?", "Does the example have concrete data?", "Is it within 200 words?"],
 rev:"Veja se o exemplo corresponde mesmo ao conceito; analogias simplificam e às vezes distorcem.", rev_en:"Make sure the example really matches the concept; analogies simplify and sometimes distort."},

{id:"plano-estudo", c:"Estudo", n:"Iniciante",
 t:"Plano de estudo semanal", t_en:"Weekly study plan",
 d:"Transforma um tópico da trilha num plano de uma semana com prática.", d_en:"Turns a learning-path topic into a one-week plan with practice.",
 quando:"No começo de cada tópico novo.", quando_en:"At the start of each new topic.",
 obj:"Você é um mentor de carreira em QA. Objetivo: transformar um tópico de estudo num plano semanal realista, focado em prática, que termine com eu dominando os critérios de conclusão.",
 obj_en:"You are a QA career mentor. Goal: turn a study topic into a realistic weekly plan, focused on practice, that ends with me meeting the completion criteria.",
 antes:["Qual tópico? Cole o 'O que estudar' e o 'Pronto quando' da trilha, se tiver.", "Quantas horas você tem nesta semana e em quais dias?", "Que ferramentas já tem instaladas (Node, Docker, Postman...)?"],
 antes_en:["Which topic? Paste the 'What to study' and 'Done when' from the path, if you have them.", "How many hours do you have this week and on which days?", "Which tools do you already have installed (Node, Docker, Postman...)?"],
 passos:["Quebre o tópico em blocos que caibam nas sessões disponíveis.", "Reserve pelo menos 60% do tempo para prática com entrega concreta.",
   "Use só materiais gratuitos e oficiais; cite a seção a ler, não só o site.", "Termine cada dia com uma verificação de 5 minutos: 'consigo fazer X sem consultar?'.",
   "Deixe a última sessão para um mini-projeto que prove os critérios de conclusão.", "Se as horas não bastarem, diga o que cortar e o risco do corte."],
 passos_en:["Break the topic into chunks that fit the available sessions.", "Keep at least 60% of the time for practice with a concrete deliverable.",
   "Use free, official materials only; name the section to read, not just the site.", "End each day with a 5-minute check: 'can I do X without looking it up?'.",
   "Save the last session for a mini-project that proves the completion criteria.", "If hours aren't enough, say what to cut and the risk of cutting it."],
 ex:`Tópico: SQL. 6 horas (seg, qua, sex, 2h cada).
| Dia | Estudo | Prática | Verificação |
|---|---|---|---|
| Seg | SQLBolt, lições 1 a 6 (SELECT, WHERE, ORDER BY) | Lições do próprio SQLBolt | Escrevo um SELECT com filtro e ordenação sem consultar? |
| Qua | Lições 6 a 12 (JOIN, agregações) | Script do laboratório no DB Fiddle | Encontro pedidos de clientes inexistentes com JOIN? |`,
 ex_en:`Topic: SQL. 6 hours (Mon, Wed, Fri, 2h each).
| Day | Study | Practice | Check |
|---|---|---|---|
| Mon | SQLBolt, lessons 1 to 6 (SELECT, WHERE, ORDER BY) | SQLBolt's own exercises | Can I write a filtered, sorted SELECT without looking? |
| Wed | Lessons 6 to 12 (JOIN, aggregates) | Lab script on DB Fiddle | Can I find orders from non-existent customers with a JOIN? |`,
 saida:["Tabela: Dia | Estudo | Prática | Verificação", "Abaixo, o mini-projeto final em 3 linhas", "Se houver corte, uma linha com o que ficou de fora"],
 saida_en:["Table: Day | Study | Practice | Check", "Below it, the final mini-project in 3 lines", "If anything is cut, one line with what was left out"],
 check:["A soma das sessões cabe nas horas informadas?", "Há prática em todos os dias?", "Todos os materiais são gratuitos?"],
 check_en:["Do the sessions fit the hours given?", "Is there practice every day?", "Are all materials free?"],
 rev:"Ajuste ao seu ritmo. Plano bom é o que você cumpre.", rev_en:"Adapt it to your pace. A good plan is one you actually follow."},

/* ================= Requisitos ================= */
{id:"cacar-ambiguidades", c:"Requisitos", n:"Iniciante",
 t:"Caçar ambiguidades", t_en:"Hunt for ambiguities",
 d:"Encontra lacunas, regras implícitas e perguntas para o PO antes do refinamento.", d_en:"Finds gaps, implicit rules and questions for the PO before refinement.",
 quando:"Antes do refinamento de uma história.", quando_en:"Before refining a user story.",
 obj:"Você é um QA sênior revisando uma história de usuário antes do refinamento. Objetivo: encontrar tudo o que pode virar bug por falta de definição e transformar isso em perguntas objetivas para o PO.",
 obj_en:"You are a senior QA engineer reviewing a user story before refinement. Goal: find everything that could become a bug for lack of definition and turn it into objective questions for the PO.",
 antes:["Cole a história e os critérios de aceite.", "Há regras do negócio ou telas relacionadas que eu devo considerar?"],
 antes_en:["Paste the story and the acceptance criteria.", "Are there business rules or related screens I should consider?"],
 passos:["Leia a história procurando termos vagos (rápido, válido, ativo, alguns, etc.) e liste as leituras possíveis de cada um.",
   "Identifique regras de negócio implícitas: o que a história supõe sem dizer.",
   "Procure exemplos que faltam: limites, erros, permissões, estados, concorrência, cancelamento.",
   "Para cada achado, diga o risco de deixá-lo indefinido (que bug pode surgir).",
   "Transforme os achados em até 8 perguntas para o PO, ordenadas por impacto, cada uma respondível em uma frase.",
   "Use apenas o que está na história. Não responda as perguntas por conta própria."],
 passos_en:["Read the story looking for vague terms (fast, valid, active, some, etc.) and list the possible readings of each.",
   "Identify implicit business rules: what the story assumes without saying.",
   "Look for missing examples: boundaries, errors, permissions, states, concurrency, cancellation.",
   "For each finding, state the risk of leaving it undefined (what bug could appear).",
   "Turn the findings into up to 8 questions for the PO, ordered by impact, each answerable in one sentence.",
   "Use only what is in the story. Do not answer the questions yourself."],
 ex:`História: "Como cliente, quero aplicar um cupom no carrinho para pagar menos. Cupons expirados não funcionam."
| Achado | Tipo | Risco |
|---|---|---|
| "Expirado": até 23:59 do dia ou até a hora exata? Em qual fuso? | Ambiguidade | Cupom recusado ou aceito indevidamente na virada do dia |
| Desconto em percentual ou valor fixo? Incide sobre o frete? | Regra implícita | Total calculado errado |
Pergunta ao PO: "Um cupom com validade em 20/10 ainda funciona às 23:30 de 20/10, no horário de Brasília?"`,
 ex_en:`Story: "As a customer, I want to apply a coupon in the cart to pay less. Expired coupons don't work."
| Finding | Type | Risk |
|---|---|---|
| "Expired": until 23:59 of the day or the exact time? Which time zone? | Ambiguity | Coupon wrongly rejected or accepted at midnight |
| Percentage or fixed discount? Does it apply to shipping? | Implicit rule | Wrong total |
Question for the PO: "Does a coupon valid through Oct 20 still work at 11:30 pm on Oct 20, Brasília time?"`,
 saida:["Tabela: Achado | Tipo (Ambiguidade, Regra implícita, Exemplo faltando) | Risco", "Lista numerada: Perguntas para o PO (até 8), da mais para a menos importante", "Sem introdução e sem resumo final"],
 saida_en:["Table: Finding | Type (Ambiguity, Implicit rule, Missing example) | Risk", "Numbered list: Questions for the PO (up to 8), most important first", "No intro and no closing summary"],
 check:["Cada achado aponta um trecho real da história?", "Cada pergunta é objetiva e respondível em uma frase?", "Não respondi nenhuma pergunta por conta própria?"],
 check_en:["Does each finding point to a real excerpt of the story?", "Is each question objective and answerable in one sentence?", "Did I avoid answering any question myself?"],
 rev:"Descarte perguntas que o contexto já responde e leve só as relevantes ao PO.", rev_en:"Drop questions the context already answers and bring only the relevant ones to the PO."},

{id:"gherkin", c:"Requisitos", n:"Iniciante",
 t:"Critérios de aceite em Gherkin", t_en:"Acceptance criteria in Gherkin",
 d:"Transforma critérios em cenários Dado/Quando/Então com dados concretos.", d_en:"Turns criteria into Given/When/Then scenarios with concrete data.",
 quando:"Para transformar uma história em exemplos testáveis.", quando_en:"To turn a story into testable examples.",
 obj:"Você é um QA especialista em BDD. Objetivo: transformar critérios de aceite em cenários Gherkin claros, com dados concretos, que o time inteiro entenda e que possam virar testes automatizados.",
 obj_en:"You are a QA engineer specialized in BDD. Goal: turn acceptance criteria into clear Gherkin scenarios, with concrete data, that the whole team understands and that can become automated tests.",
 antes:["Cole a história e os critérios de aceite.", "Em qual idioma os cenários devem ficar (português ou inglês)?"],
 antes_en:["Paste the story and acceptance criteria.", "Which language should the scenarios use (Portuguese or English)?"],
 passos:["Para cada critério, escreva o cenário de sucesso.", "Acrescente cenários de erro e de borda que o critério implica.",
   "Use dados concretos em todos os passos: valores, nomes, datas, não 'um usuário válido'.",
   "Um comportamento por cenário; Então com resultado observável pelo usuário.",
   "Use Esquema do Cenário com Exemplos quando só os dados mudarem.", "Marque com [SUPOSIÇÃO] tudo que não está nos critérios."],
 passos_en:["For each criterion, write the success scenario.", "Add the error and edge scenarios the criterion implies.",
   "Use concrete data in every step: values, names, dates, not 'a valid user'.",
   "One behavior per scenario; Then with a user-observable result.",
   "Use Scenario Outline with Examples when only the data changes.", "Mark with [ASSUMPTION] anything not in the criteria."],
 ex:`Critério: "Cupons expirados não funcionam."
Cenário: Cupom expirado é recusado
  Dado que o cupom "VERAO10" expirou em 10/01/2026
  E que tenho no carrinho um produto de R$ 100,00
  Quando aplico o cupom "VERAO10"
  Então vejo a mensagem "Cupom expirado"
  E o total continua R$ 100,00`,
 ex_en:`Criterion: "Expired coupons don't work."
Scenario: Expired coupon is rejected
  Given the coupon "SUMMER10" expired on 01/10/2026
  And my cart has one product costing $100.00
  When I apply the coupon "SUMMER10"
  Then I see the message "Coupon expired"
  And the total is still $100.00`,
 saida:["Só o bloco Gherkin (Funcionalidade, Cenários, Esquemas)", "Depois do bloco, a lista de [SUPOSIÇÃO] com uma pergunta para cada"],
 saida_en:["Only the Gherkin block (Feature, Scenarios, Outlines)", "After the block, the list of [ASSUMPTION] items with a question for each"],
 check:["Todo passo tem dado concreto?", "Cada cenário testa um comportamento só?", "Há pelo menos um cenário de erro por critério?"],
 check_en:["Does every step have concrete data?", "Does each scenario test a single behavior?", "Is there at least one error scenario per criterion?"],
 rev:"Cada [SUPOSIÇÃO] é uma pergunta para o time, não uma regra decidida.", rev_en:"Every [ASSUMPTION] is something to ask the team, not a decided rule."},

{id:"riscos-feature", c:"Requisitos", n:"Intermediário",
 t:"Mapa de riscos de uma funcionalidade", t_en:"Risk map for a feature",
 d:"Lista riscos por impacto e probabilidade e sugere a ordem de teste.", d_en:"Lists risks by impact and likelihood and suggests the testing order.",
 quando:"No planejamento do teste de uma entrega.", quando_en:"When planning the testing of a delivery.",
 obj:"Você é um QA sênior especialista em teste baseado em risco. Objetivo: decidir o que testar primeiro quando o tempo é curto, com justificativa que o time e o negócio aceitem.",
 obj_en:"You are a senior QA engineer specialized in risk-based testing. Goal: decide what to test first when time is short, with reasoning the team and the business accept.",
 antes:["Descreva a funcionalidade (o que faz, para quem).", "Quantos usuários e em que volume? Há picos?", "Com quais sistemas ela se integra? Já houve incidentes nessa área?"],
 antes_en:["Describe the feature (what it does, for whom).", "How many users and what volume? Any peaks?", "Which systems does it integrate with? Any past incidents in this area?"],
 passos:["Liste riscos funcionais (regras, cálculos, fluxos) e não funcionais (desempenho, segurança, usabilidade, compatibilidade).",
   "Para cada risco, dê impacto de 1 a 5 (dano se acontecer) e probabilidade de 1 a 5 (chance de acontecer), com o motivo.",
   "Calcule a prioridade (impacto × probabilidade) e ordene.", "Para cada risco, proponha o teste que mais reduz o risco e em qual camada.",
   "Diga o que fica de fora e o risco aceito ao deixar."],
 passos_en:["List functional risks (rules, calculations, flows) and non-functional ones (performance, security, usability, compatibility).",
   "For each risk, give impact 1 to 5 (damage if it happens) and likelihood 1 to 5 (chance it happens), with the reason.",
   "Compute priority (impact × likelihood) and sort.", "For each risk, propose the test that reduces it most and at which layer.",
   "State what is left out and the risk accepted by leaving it."],
 ex:`Funcionalidade: Pix no checkout de uma loja online.
| Risco | Impacto | Prob. | Prioridade | Motivo | Teste |
|---|---|---|---|---|---|
| Pedido confirmado sem o pagamento cair | 5 | 3 | 15 | Webhook do banco pode atrasar ou repetir | API: simular webhook atrasado e duplicado |
| QR Code expira antes do cliente pagar | 3 | 4 | 12 | Tempo de expiração curto no celular | E2E: pagar no último minuto e após expirar |`,
 ex_en:`Feature: instant payment (Pix) at an online store checkout.
| Risk | Impact | Likel. | Priority | Reason | Test |
|---|---|---|---|---|---|
| Order confirmed without the payment arriving | 5 | 3 | 15 | Bank webhook may be late or repeated | API: simulate delayed and duplicated webhook |
| QR code expires before the customer pays | 3 | 4 | 12 | Short expiry on mobile | E2E: pay in the last minute and after expiry |`,
 saida:["Tabela com até 10 riscos: Risco | Impacto | Probabilidade | Prioridade | Motivo | Teste e camada, ordenada por prioridade", "Duas frases sobre o que fica de fora"],
 saida_en:["Table with up to 10 risks: Risk | Impact | Likelihood | Priority | Reason | Test and layer, sorted by priority", "Two sentences on what is left out"],
 check:["Há riscos não funcionais na lista?", "Toda nota tem motivo?", "Todo risco tem um teste concreto?"],
 check_en:["Are there non-functional risks on the list?", "Does every score have a reason?", "Does every risk have a concrete test?"],
 rev:"As notas são estimativas; calibre com quem conhece o negócio.", rev_en:"The scores are estimates; calibrate them with people who know the business."},

{id:"estrategia-teste", c:"Requisitos", n:"Avançado",
 t:"Estratégia de teste em uma página", t_en:"One-page test strategy",
 d:"Camadas, riscos, ambientes e critério de liberação de um produto ou projeto.", d_en:"Layers, risks, environments and release criteria for a product or project.",
 quando:"No início de um projeto ou quando o time não sabe o que é 'pronto'.", quando_en:"At the start of a project or when the team doesn't agree on 'done'.",
 obj:"Você é um QA líder. Objetivo: escrever uma estratégia de teste que caiba em uma página, que pessoas de negócio entendam e que oriente as decisões de teste do time no dia a dia.",
 obj_en:"You are a QA lead. Goal: write a test strategy that fits on one page, that business people understand and that guides the team's daily testing decisions.",
 antes:["O que é o produto e para quem?", "Como é a arquitetura (front, APIs, banco, integrações)?", "Tamanho do time, frequência de deploy e incidentes ou áreas frágeis conhecidas."],
 antes_en:["What is the product and who is it for?", "What is the architecture (front end, APIs, database, integrations)?", "Team size, deploy frequency and known incidents or fragile areas."],
 passos:["Liste os 5 maiores riscos do produto, em linguagem de negócio.", "Distribua o esforço por camada (unidade, API, UI, exploratório) e justifique pelo risco e pela arquitetura.",
   "Escolha os aspectos não funcionais que importam aqui e por quê.", "Defina ambientes e como os dados de teste serão criados e limpos.",
   "Escreva o critério de liberação: o que precisa ser verdade para subir uma versão.", "Escolha até 4 métricas que apoiem decisões, não vaidade.",
   "Corte tudo que não muda uma decisão do time."],
 passos_en:["List the product's top 5 risks, in business language.", "Split effort by layer (unit, API, UI, exploratory) and justify it by risk and architecture.",
   "Pick the non-functional aspects that matter here and why.", "Define environments and how test data is created and cleaned up.",
   "Write the release criteria: what must be true to ship a version.", "Choose up to 4 metrics that support decisions, not vanity.",
   "Cut anything that doesn't change a team decision."],
 ex:`Trecho — Critério de liberação:
- Nenhum bug aberto de severidade crítica ou alta nos fluxos de compra e pagamento
- Suíte de API e smoke E2E verdes no pipeline da versão
- Teste exploratório de 45 minutos nas mudanças da release, com debriefing registrado`,
 ex_en:`Excerpt — Release criteria:
- No open critical or high-severity bugs in the purchase and payment flows
- API suite and E2E smoke green in the release pipeline
- 45-minute exploratory session on the release changes, with a recorded debrief`,
 saida:["Seis seções com no máximo 5 itens cada: Riscos, Camadas, Não funcionais, Ambientes e dados, Critério de liberação, Métricas", "Cabe em uma página impressa"],
 saida_en:["Six sections with at most 5 items each: Risks, Layers, Non-functional, Environments and data, Release criteria, Metrics", "Fits on one printed page"],
 check:["Alguém de negócio entende os riscos?", "O critério de liberação é verificável?", "Cada métrica apoia uma decisão?"],
 check_en:["Would a business person understand the risks?", "Are the release criteria verifiable?", "Does each metric support a decision?"],
 rev:"Apresente para o time e ajuste; estratégia que ninguém leu não vale.", rev_en:"Walk the team through it and adjust; a strategy nobody read is worthless."},

/* ================= Exploratório ================= */
{id:"charter-exploratorio", c:"Exploratório", n:"Iniciante",
 t:"Charter para sessão exploratória", t_en:"Exploratory session charter",
 d:"Três charters focados em riscos diferentes, com ideias de ataque.", d_en:"Three charters focused on different risks, with attack ideas.",
 quando:"Para planejar 45 minutos de exploração com foco.", quando_en:"To plan 45 focused minutes of exploration.",
 obj:"Você é um testador exploratório experiente. Objetivo: planejar sessões curtas e focadas, cada uma atacando um risco diferente, para que eu encontre problemas relevantes em pouco tempo.",
 obj_en:"You are an experienced exploratory tester. Goal: plan short, focused sessions, each attacking a different risk, so I find relevant problems quickly.",
 antes:["Qual área ou funcionalidade você vai explorar?", "O que você já sabe dela (mudanças recentes, reclamações, bugs passados)?"],
 antes_en:["Which area or feature will you explore?", "What do you already know about it (recent changes, complaints, past bugs)?"],
 passos:["Identifique 3 riscos diferentes para a área: dados, fluxo, permissões ou integrações.",
   "Para cada risco, escreva um charter no formato 'Explorar <alvo> com <recursos> para descobrir <informação>'.",
   "Para cada charter, liste 5 ideias de ataque concretas, de uma linha.",
   "Indique qual charter fazer primeiro e por quê."],
 passos_en:["Identify 3 different risks for the area: data, flow, permissions or integrations.",
   "For each risk, write a charter as 'Explore <target> with <resources> to discover <information>'.",
   "For each charter, list 5 concrete one-line attack ideas.",
   "Say which charter to run first and why."],
 ex:`Charter 1: Explorar o carrinho com quantidades extremas e produtos sem estoque para descobrir erros de cálculo e de reserva.
- Quantidade 0, 1, 999 e negativa pelo campo e pela API
- Produto com 1 unidade em dois navegadores ao mesmo tempo
- Remover o último item e voltar com o botão do navegador`,
 ex_en:`Charter 1: Explore the cart with extreme quantities and out-of-stock products to discover calculation and reservation errors.
- Quantity 0, 1, 999 and negative via the field and the API
- A product with 1 unit in two browsers at the same time
- Remove the last item and go back with the browser button`,
 saida:["3 charters, cada um com 5 ideias de ataque", "Uma linha final: qual fazer primeiro e por quê"],
 saida_en:["3 charters, each with 5 attack ideas", "A final line: which to run first and why"],
 check:["Cada charter ataca um risco diferente?", "As ideias são executáveis, não genéricas?"],
 check_en:["Does each charter attack a different risk?", "Are the ideas actionable, not generic?"],
 rev:"Escolha um charter e siga; o valor está na sessão, não na lista.", rev_en:"Pick one charter and do it; the value is in the session, not the list."},

{id:"heuristicas-tela", c:"Exploratório", n:"Iniciante",
 t:"Heurísticas para uma tela", t_en:"Heuristics for a screen",
 d:"Ideias de teste a partir de heurísticas conhecidas, aplicadas a uma tela específica.", d_en:"Test ideas from well-known heuristics, applied to a specific screen.",
 quando:"Quando você olha para a tela e não sabe por onde começar.", quando_en:"When you look at a screen and don't know where to start.",
 obj:"Você é um QA exploratório. Objetivo: transformar heurísticas de teste conhecidas em ideias concretas para uma tela específica, cada uma com o sinal que indicaria um bug.",
 obj_en:"You are an exploratory QA engineer. Goal: turn well-known test heuristics into concrete ideas for a specific screen, each with the signal that would indicate a bug.",
 antes:["Descreva a tela: campos, botões e o que ela faz (ou cole o HTML ou um print descrito).", "Quem usa essa tela e com qual objetivo?"],
 antes_en:["Describe the screen: fields, buttons and what it does (or paste the HTML or a described screenshot).", "Who uses this screen and for what?"],
 passos:["Aplique estas heurísticas: limites; zero, um e muitos; interrupção; ordem das ações; permissões; mensagens de erro; consistência com o resto do sistema.",
   "Para cada heurística, escreva 2 ideias específicas desta tela.", "Para cada ideia, descreva o resultado que indicaria um bug.",
   "Marque com ★ as 5 ideias de maior risco."],
 passos_en:["Apply these heuristics: boundaries; zero, one and many; interruption; order of actions; permissions; error messages; consistency with the rest of the system.",
   "For each heuristic, write 2 ideas specific to this screen.", "For each idea, describe the result that would indicate a bug.",
   "Mark with ★ the 5 highest-risk ideas."],
 ex:`Tela: cadastro de endereço.
| Heurística | Ideia | Sinal de bug |
|---|---|---|
| Zero, um e muitos ★ | Cliente com 0, 1 e 20 endereços salvos | Lista quebra, endereço padrão some ou paginação falha |
| Interrupção | Fechar a aba no meio do preenchimento e voltar | Dados parciais salvos como endereço válido |`,
 ex_en:`Screen: address form.
| Heuristic | Idea | Bug signal |
|---|---|---|
| Zero, one and many ★ | Customer with 0, 1 and 20 saved addresses | List breaks, default address disappears or paging fails |
| Interruption | Close the tab mid-form and come back | Partial data saved as a valid address |`,
 saida:["Tabela: Heurística | Ideia | Sinal de bug, com ★ nas 5 de maior risco"],
 saida_en:["Table: Heuristic | Idea | Bug signal, with ★ on the top 5 risks"],
 check:["Todas as ideias são desta tela?", "Todo sinal de bug é observável?"],
 check_en:["Are all ideas specific to this screen?", "Is every bug signal observable?"],
 rev:"Priorize as ideias pelo risco antes de executar todas.", rev_en:"Prioritize the ideas by risk before running all of them."},

{id:"debrief-sessao", c:"Exploratório", n:"Intermediário",
 t:"Debriefing da sessão", t_en:"Session debrief",
 d:"Organiza as notas da exploração em achados, riscos e próximos passos.", d_en:"Organizes exploration notes into findings, risks and next steps.",
 quando:"Logo depois de uma sessão exploratória.", quando_en:"Right after an exploratory session.",
 obj:"Você é um QA que conduz debriefings de testes exploratórios. Objetivo: transformar notas soltas de uma sessão em informação que o time usa: bugs, dúvidas, riscos e próximos passos.",
 obj_en:"You are a QA engineer who runs exploratory test debriefs. Goal: turn loose session notes into information the team uses: bugs, questions, risks and next steps.",
 antes:["Cole as notas da sessão, do jeito que estiverem.", "Qual era o charter da sessão?"],
 antes_en:["Paste the session notes, as they are.", "What was the session charter?"],
 passos:["Separe o que é bug, dúvida, risco não testado e ideia.", "Para cada bug, sugira a severidade e cite o trecho da nota que o sustenta.",
   "Marque com [HIPÓTESE] o que as notas não comprovam.", "Avalie em uma frase se o charter foi cumprido.", "Sugira o charter da próxima sessão."],
 passos_en:["Separate bugs, questions, untested risks and ideas.", "For each bug, suggest severity and quote the note that supports it.",
   "Mark with [HYPOTHESIS] what the notes don't prove.", "Assess in one sentence whether the charter was met.", "Suggest the next session's charter."],
 ex:`Nota: "carrinho mostrou total errado depois de trocar o CEP, acho que o frete não recalculou"
→ Bug (severidade alta): total não recalcula o frete após troca de CEP. Trecho: "total errado depois de trocar o CEP".
→ [HIPÓTESE] a causa é o frete; confirmar comparando o valor do frete antes e depois.`,
 ex_en:`Note: "cart showed the wrong total after changing the ZIP code, I think shipping didn't recalculate"
→ Bug (high severity): total doesn't recalculate shipping after a ZIP change. Quote: "wrong total after changing the ZIP code".
→ [HYPOTHESIS] the cause is shipping; confirm by comparing shipping before and after.`,
 saida:["Quatro listas: Bugs, Dúvidas para o time, Riscos não testados, Ideias", "Uma linha sobre o charter e o charter sugerido para a próxima sessão"],
 saida_en:["Four lists: Bugs, Questions for the team, Untested risks, Ideas", "One line about the charter and the suggested next charter"],
 check:["Todo bug cita um trecho das notas?", "Hipóteses estão marcadas?"],
 check_en:["Does every bug quote the notes?", "Are hypotheses marked?"],
 rev:"Reproduza cada bug antes de abrir o relato.", rev_en:"Reproduce each bug before filing it."},

/* ================= Bugs ================= */
{id:"relato-bug", c:"Bugs", n:"Iniciante",
 t:"Relato de bug no padrão", t_en:"Structured bug report",
 d:"Transforma anotações soltas num relato claro e reproduzível.", d_en:"Turns loose notes into a clear, reproducible report.",
 quando:"Para transformar anotações soltas num relato claro.", quando_en:"To turn loose notes into a clear report.",
 obj:"Você é um QA que escreve relatos de bug que qualquer pessoa do time reproduz na primeira tentativa. Objetivo: transformar minhas anotações num relato completo, sem inventar nada.",
 obj_en:"You are a QA engineer who writes bug reports anyone on the team can reproduce on the first try. Goal: turn my notes into a complete report without inventing anything.",
 antes:["Cole suas anotações, logs, mensagens de erro e o que viu.", "Em qual ambiente aconteceu (navegador, versão, dispositivo, usuário de teste)?"],
 antes_en:["Paste your notes, logs, error messages and what you saw.", "In which environment did it happen (browser, version, device, test user)?"],
 passos:["Escreva um título com o que falha, onde e em que condição (até 12 palavras).", "Liste os passos mínimos para reproduzir, um por linha, a partir de um estado conhecido.",
   "Separe resultado esperado e resultado obtido.", "Indique as evidências a anexar (print, vídeo, requisição e resposta, log).",
   "Liste o que ainda não se sabe (hipóteses não verificadas).", "Onde faltar dado, escreva [FALTA: ...] em vez de inventar."],
 passos_en:["Write a title with what fails, where and under which condition (up to 12 words).", "List the minimum steps to reproduce, one per line, starting from a known state.",
   "Separate expected and actual result.", "List the evidence to attach (screenshot, video, request and response, log).",
   "List what is still unknown (unverified hypotheses).", "Where data is missing, write [MISSING: ...] instead of inventing."],
 ex:`Título: Total do carrinho não recalcula o frete após troca de CEP
Ambiente: Chrome 129, Windows 11, usuário teste_ana
Passos:
1. Adicionar o produto "Caneca" ao carrinho
2. Informar o CEP 01310-100 e calcular o frete
3. Trocar para o CEP 69900-000
Esperado: frete e total atualizados para o novo CEP
Obtido: frete muda, total continua com o valor do primeiro CEP
O que ainda não sei: se acontece também no app [FALTA: testar no app]`,
 ex_en:`Title: Cart total doesn't recalculate shipping after ZIP code change
Environment: Chrome 129, Windows 11, user test_ana
Steps:
1. Add the product "Mug" to the cart
2. Enter ZIP 10001 and calculate shipping
3. Change to ZIP 99501
Expected: shipping and total updated for the new ZIP
Actual: shipping changes, total keeps the first ZIP's value
Still unknown: whether it also happens in the app [MISSING: test on the app]`,
 saida:["Seções nesta ordem: Título, Ambiente, Passos, Esperado, Obtido, Evidências, O que ainda não sei"],
 saida_en:["Sections in this order: Title, Environment, Steps, Expected, Actual, Evidence, Still unknown"],
 check:["Os passos começam de um estado conhecido?", "Nada foi inventado além das anotações?", "O título diz onde e em que condição?"],
 check_en:["Do the steps start from a known state?", "Was nothing invented beyond the notes?", "Does the title say where and under which condition?"],
 rev:"Siga os passos do relato do zero; se não reproduzir, o relato não está pronto.", rev_en:"Follow the steps from scratch; if it doesn't reproduce, the report isn't ready."},

{id:"severidade", c:"Bugs", n:"Intermediário",
 t:"Severidade e prioridade justificadas", t_en:"Justified severity and priority",
 d:"Sugere severidade e prioridade com argumentos de negócio.", d_en:"Suggests severity and priority with business arguments.",
 quando:"Quando há discussão sobre a gravidade de um bug.", quando_en:"When there is debate about how serious a bug is.",
 obj:"Você é um QA sênior que ajuda o time a classificar bugs com critério. Objetivo: sugerir severidade e prioridade separadamente, com argumentos de negócio que encerrem a discussão.",
 obj_en:"You are a senior QA engineer who helps the team classify bugs with criteria. Goal: suggest severity and priority separately, with business arguments that settle the debate.",
 antes:["Resuma o bug.", "Quem é afetado, com que frequência e em qual fluxo?", "Existe contorno? Qual?"],
 antes_en:["Summarize the bug.", "Who is affected, how often and in which flow?", "Is there a workaround? Which?"],
 passos:["Classifique a severidade pelo impacto técnico: crítica, alta, média ou baixa.", "Classifique a prioridade pela urgência de correção, considerando frequência, contorno e momento do negócio.",
   "Explique o impacto em linguagem de negócio: dinheiro, clientes, reputação ou conformidade.", "Diga o que mudaria cada classificação."],
 passos_en:["Classify severity by technical impact: critical, high, medium or low.", "Classify priority by urgency to fix, considering frequency, workaround and business timing.",
   "Explain the impact in business terms: money, customers, reputation or compliance.", "Say what would change each classification."],
 ex:`Bug: logotipo da empresa distorcido na página inicial, todos os navegadores.
Severidade: baixa (não impede nenhuma ação).
Prioridade: alta (é a primeira coisa que todo visitante vê e a campanha começa amanhã).
Mudaria: se a campanha fosse adiada, a prioridade cairia para média.`,
 ex_en:`Bug: company logo distorted on the home page, all browsers.
Severity: low (doesn't block any action).
Priority: high (it's the first thing every visitor sees and the campaign starts tomorrow).
Would change: if the campaign were postponed, priority would drop to medium.`,
 saida:["Severidade: valor + 1 frase", "Prioridade: valor + 1 frase", "Impacto no negócio: até 3 frases", "O que mudaria a classificação: até 2 itens"],
 saida_en:["Severity: value + 1 sentence", "Priority: value + 1 sentence", "Business impact: up to 3 sentences", "What would change the classification: up to 2 items"],
 check:["Severidade e prioridade foram tratadas separadamente?", "O impacto está em termos de negócio?"],
 check_en:["Were severity and priority treated separately?", "Is the impact in business terms?"],
 rev:"A decisão é do time; use a resposta para argumentar, não para impor.", rev_en:"The call belongs to the team; use the answer to argue, not to impose."},

{id:"causa-raiz", c:"Bugs", n:"Intermediário",
 t:"Análise de causa raiz (5 porquês)", t_en:"Root cause analysis (5 whys)",
 d:"Vai do sintoma à causa que o time pode corrigir no processo.", d_en:"Goes from the symptom to a cause the team can fix in its process.",
 quando:"Depois de um bug que escapou para produção.", quando_en:"After a bug escaped to production.",
 obj:"Você facilita análises de causa raiz sem culpados. Objetivo: ir do sintoma até uma causa no processo ou no sistema que o time consiga corrigir, para que esse tipo de defeito não se repita.",
 obj_en:"You facilitate blameless root cause analyses. Goal: go from the symptom to a cause in the process or system the team can fix, so this kind of defect doesn't happen again.",
 antes:["O que aconteceu, quando e qual foi o impacto?", "Como o problema foi descoberto?", "O que já se sabe da causa imediata?"],
 antes_en:["What happened, when and what was the impact?", "How was the problem found?", "What is already known about the immediate cause?"],
 passos:["Escreva o problema em uma frase factual.", "Pergunte 'por quê?' até 5 vezes, cada resposta apoiada numa evidência ou marcada [VERIFICAR].",
   "Pare quando chegar a uma causa de processo ou sistema que o time controla.", "Proponha até 3 ações: cada uma com dono (papel, não pessoa) e como saberemos que funcionou.",
   "Foque em processo e sistema; não aponte culpados."],
 passos_en:["State the problem in one factual sentence.", "Ask 'why?' up to 5 times, each answer backed by evidence or marked [VERIFY].",
   "Stop when you reach a process or system cause the team controls.", "Propose up to 3 actions: each with an owner (a role, not a person) and how we'll know it worked.",
   "Focus on process and systems; don't blame people."],
 ex:`Problema: clientes cobrados duas vezes em 18/10.
1. Por quê? O pagamento foi processado duas vezes. (log do gateway)
2. Por quê? O botão "Pagar" aceitou dois cliques. (vídeo do suporte)
3. Por quê? A API não usa chave de idempotência. [VERIFICAR com o time de pagamentos]
4. Por quê? O requisito não existia e nenhum teste cobria envio duplicado.
Ação: teste de API que envia o mesmo pagamento duas vezes, obrigatório no pipeline. Dono: QA do time de checkout.`,
 ex_en:`Problem: customers charged twice on Oct 18.
1. Why? The payment was processed twice. (gateway log)
2. Why? The "Pay" button accepted two clicks. (support video)
3. Why? The API doesn't use an idempotency key. [VERIFY with the payments team]
4. Why? The requirement didn't exist and no test covered duplicate submission.
Action: API test that sends the same payment twice, required in the pipeline. Owner: checkout team QA.`,
 saida:["Problema em uma frase", "Os porquês numerados, com evidência ou [VERIFICAR]", "Tabela de ações: Ação | Dono | Como saber que funcionou"],
 saida_en:["Problem in one sentence", "Numbered whys, with evidence or [VERIFY]", "Action table: Action | Owner | How we'll know it worked"],
 check:["Nenhuma resposta culpa uma pessoa?", "A causa final está sob controle do time?", "Toda ação é verificável?"],
 check_en:["Does no answer blame a person?", "Is the final cause under the team's control?", "Is every action verifiable?"],
 rev:"Valide cada [VERIFICAR] com dados antes de levar as ações ao time.", rev_en:"Validate every [VERIFY] with data before taking the actions to the team."}
);
