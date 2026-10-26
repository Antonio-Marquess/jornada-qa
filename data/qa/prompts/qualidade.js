/* Jornada QA — Prompts: Code review, Performance, Segurança e Acessibilidade. (formato descrito em estudo-requisitos.js) */
(JQA.PROMPTS = JQA.PROMPTS || []).push(

/* ================= Code review ================= */
{id:"riscos-pr", c:"Code review", n:"Intermediário",
 t:"Riscos de um pull request", t_en:"Risks in a pull request",
 d:"O que pode quebrar, casos de borda e testes que faltam num diff.", d_en:"What may break, edge cases and missing tests in a diff.",
 quando:"Para revisar uma mudança antes de testar.", quando_en:"To review a change before testing it.",
 obj:"Você é um QA revisando um pull request antes de testar. Objetivo: decidir o que testar e o que perguntar, olhando também para o que a mudança pode afetar fora dos arquivos alterados.",
 obj_en:"You are a QA engineer reviewing a pull request before testing. Goal: decide what to test and what to ask, also looking at what the change may affect outside the changed files.",
 antes:["Cole o diff (ou o link, se eu tiver acesso ao repositório).", "Qual o objetivo da mudança (ticket ou descrição do PR)?"],
 antes_en:["Paste the diff (or the link, if I have access to the repository).", "What's the goal of the change (ticket or PR description)?"],
 passos:["Resuma em uma frase o que a mudança faz.", "Liste o que pode quebrar, inclusive quem chama o código alterado.",
   "Procure casos de borda não tratados: nulos, vazios, limites, erros de rede, concorrência.", "Liste os testes que faltam, com a camada (unidade, API, UI).",
   "Escreva até 5 perguntas para quem escreveu, em tom de dúvida.", "Cite arquivo e linha em cada item."],
 passos_en:["Summarize in one sentence what the change does.", "List what may break, including callers of the changed code.",
   "Look for unhandled edge cases: nulls, empties, boundaries, network errors, concurrency.", "List missing tests, with the layer (unit, API, UI).",
   "Write up to 5 questions for the author, phrased as questions.", "Cite file and line in each item."],
 ex:`Pode quebrar: services/frete.ts:42 — calcularFrete agora retorna centavos; checkout.ts:88 ainda divide por 100.
Borda: frete.ts:51 — CEP sem hífen não é tratado.
Teste faltando (unidade): frete grátis acima de R$ 200,00 no limite exato.
Pergunta: "O app mobile também consome calcularFrete? Ele já espera centavos?"`,
 ex_en:`May break: services/shipping.ts:42 — calculateShipping now returns cents; checkout.ts:88 still divides by 100.
Edge: shipping.ts:51 — ZIP without a dash isn't handled.
Missing test (unit): free shipping above $200.00 at the exact boundary.
Question: "Does the mobile app also call calculateShipping? Does it expect cents already?"`,
 saida:["Resumo em uma frase", "Quatro listas: Pode quebrar, Bordas, Testes que faltam, Perguntas"],
 saida_en:["One-sentence summary", "Four lists: May break, Edges, Missing tests, Questions"],
 check:["Olhei além dos arquivos alterados?", "Todo item tem arquivo e linha?"],
 check_en:["Did I look beyond the changed files?", "Does every item have file and line?"],
 rev:"Transforme os riscos em perguntas respeitosas no PR; quem escreveu conhece o contexto.", rev_en:"Turn risks into respectful questions on the PR; the author knows the context."},

{id:"revisao-diff", c:"Code review", n:"Intermediário",
 t:"Revisão só do que mudou", t_en:"Review only what changed",
 d:"Code review rápido e focado nas linhas alteradas.", d_en:"A quick review focused on the changed lines.",
 quando:"Em PRs pequenos que precisam de retorno rápido.", quando_en:"On small PRs that need fast feedback.",
 obj:"Você é um revisor de código objetivo. Objetivo: revisar só as linhas adicionadas ou alteradas e devolver poucos comentários, classificados, que o autor consiga resolver rápido.",
 obj_en:"You are an objective code reviewer. Goal: review only the added or changed lines and return a few classified comments the author can resolve quickly.",
 antes:["Cole o diff.", "Há padrões do time que devo seguir (lint, convenções)?"],
 antes_en:["Paste the diff.", "Are there team standards I should follow (lint, conventions)?"],
 passos:["Leia só as linhas com + e -.", "Classifique cada comentário: Bloqueia (bug, segurança, perda de dados), Sugestão (melhoria) ou Dúvida.",
   "Um 'Bloqueia' precisa de motivo concreto; questão de gosto é Sugestão.", "No máximo 10 comentários, os mais importantes primeiro.",
   "Se estiver tudo certo, responda só 'Sem bloqueios'."],
 passos_en:["Read only the + and - lines.", "Classify each comment: Blocker (bug, security, data loss), Suggestion (improvement) or Question.",
   "A 'Blocker' needs a concrete reason; taste is a Suggestion.", "At most 10 comments, most important first.",
   "If everything is fine, reply only 'No blockers'."],
 ex:`[Bloqueia] api/pedidos.ts:27 — o catch engole o erro e retorna 200; o cliente acha que o pedido foi criado.
[Sugestão] api/pedidos.ts:31 — extrair o cálculo do total para uma função testável.
[Dúvida] api/pedidos.ts:40 — o limite de 50 itens vem de alguma regra de negócio?`,
 ex_en:`[Blocker] api/orders.ts:27 — the catch swallows the error and returns 200; the client thinks the order was created.
[Suggestion] api/orders.ts:31 — extract the total calculation into a testable function.
[Question] api/orders.ts:40 — does the 50-item limit come from a business rule?`,
 saida:["Lista: [Tipo] arquivo:linha — comentário (até 25 palavras)"],
 saida_en:["List: [Type] file:line — comment (up to 25 words)"],
 check:["Comentei só linhas alteradas?", "Todo Bloqueia tem motivo concreto?"],
 check_en:["Did I comment only on changed lines?", "Does every Blocker have a concrete reason?"],
 rev:"Um 'Bloqueia' precisa de motivo concreto; questão de gosto vira Sugestão.", rev_en:"A 'Blocker' needs a concrete reason; matters of taste are Suggestions."},

{id:"cobertura-lacunas", c:"Code review", n:"Avançado",
 t:"Lacunas de cobertura que importam", t_en:"Coverage gaps that matter",
 d:"Lê um relatório de cobertura e aponta o que vale testar pelo risco.", d_en:"Reads a coverage report and points to what is worth testing by risk.",
 quando:"Quando alguém pede 'aumentar a cobertura'.", quando_en:"When someone asks to 'increase coverage'.",
 obj:"Você é um engenheiro de qualidade. Objetivo: usar o relatório de cobertura para encontrar as lacunas que mais importam pelo risco, e não para perseguir uma porcentagem.",
 obj_en:"You are a quality engineer. Goal: use the coverage report to find the gaps that matter most by risk, not to chase a percentage.",
 antes:["Cole o resumo do relatório por arquivo (ou os trechos não cobertos).", "Quais partes do sistema são críticas para o negócio?"],
 antes_en:["Paste the per-file report summary (or the uncovered excerpts).", "Which parts of the system are business-critical?"],
 passos:["Cruze arquivos pouco cobertos com as partes críticas.", "Dentro deles, priorize ramos de erro, cálculos e regras de decisão.",
   "Para cada lacuna, diga o risco se quebrar, o que testar e em que camada.", "Liste o que não vale cobertura (código gerado, getters triviais) e por quê.",
   "Lembre que cobertura alta com asserção fraca não protege."],
 passos_en:["Cross poorly covered files with critical areas.", "Within them, prioritize error branches, calculations and decision rules.",
   "For each gap, state the risk if it breaks, what to test and at which layer.", "List what isn't worth covering (generated code, trivial getters) and why.",
   "Remember high coverage with weak assertions doesn't protect."],
 ex:`| Onde | Risco se quebrar | O que testar | Camada |
|---|---|---|---|
| pagamento.ts: ramo de estorno (0%) | Cliente não recebe o dinheiro de volta | Estorno parcial e total, estorno duplicado | Unidade + API |`,
 ex_en:`| Where | Risk if it breaks | What to test | Layer |
|---|---|---|---|
| payment.ts: refund branch (0%) | Customer doesn't get money back | Partial and full refund, duplicate refund | Unit + API |`,
 saida:["Tabela com até 10 lacunas: Onde | Risco | O que testar | Camada", "Até 3 itens que não valem cobertura"],
 saida_en:["Table with up to 10 gaps: Where | Risk | What to test | Layer", "Up to 3 items not worth covering"],
 check:["Priorizei por risco, não por porcentagem?", "Todo item diz a camada?"],
 check_en:["Did I prioritize by risk, not percentage?", "Does every item state the layer?"],
 rev:"Cobertura alta com asserção fraca não protege nada; olhe os testes, não só o número.", rev_en:"High coverage with weak assertions protects nothing; look at the tests, not just the number."},

{id:"mutacao", c:"Code review", n:"Avançado",
 t:"Testes de mutação: o que sobreviveu", t_en:"Mutation testing: what survived",
 d:"Interpreta mutantes sobreviventes e escreve os testes que os matam.", d_en:"Interprets surviving mutants and writes the tests that kill them.",
 quando:"Depois de rodar Stryker, PIT ou mutmut.", quando_en:"After running Stryker, PIT or mutmut.",
 obj:"Você é um engenheiro de testes especialista em testes de mutação. Objetivo: explicar por que cada mutante sobreviveu e escrever o teste que o mata, separando buracos reais de mutantes equivalentes.",
 obj_en:"You are a test engineer specialized in mutation testing. Goal: explain why each mutant survived and write the test that kills it, separating real gaps from equivalent mutants.",
 antes:["Cole os mutantes sobreviventes do relatório.", "Cole o código e os testes envolvidos.", "Qual ferramenta (Stryker, PIT, mutmut)?"],
 antes_en:["Paste the surviving mutants from the report.", "Paste the code and related tests.", "Which tool (Stryker, PIT, mutmut)?"],
 passos:["Para cada mutante, diga o que a mutação mudou.", "Explique por que os testes não perceberam (asserção faltando, valor de limite não testado...).",
   "Classifique: equivalente (não muda comportamento) ou buraco real.", "Para buracos reais, escreva o teste que mata o mutante.",
   "Ignore mutantes equivalentes depois de marcá-los."],
 passos_en:["For each mutant, state what the mutation changed.", "Explain why tests didn't notice (missing assertion, untested boundary...).",
   "Classify: equivalent (no behavior change) or real gap.", "For real gaps, write the test that kills the mutant.",
   "Skip equivalent mutants after marking them."],
 ex:`Mutante: "total >= 200" virou "total > 200" em frete.ts:12 — sobreviveu.
Por quê: nenhum teste usa exatamente R$ 200,00.
Tipo: buraco real.
Teste: it('frete grátis com total exatamente 200', () => expect(frete(200)).toBe(0));`,
 ex_en:`Mutant: "total >= 200" became "total > 200" in shipping.ts:12 — survived.
Why: no test uses exactly $200.00.
Type: real gap.
Test: it('free shipping with total exactly 200', () => expect(shipping(200)).toBe(0));`,
 saida:["Uma seção curta por mutante: mudança, por que sobreviveu, tipo, teste"],
 saida_en:["One short section per mutant: change, why it survived, type, test"],
 check:["Todo buraco real ganhou um teste?", "Equivalentes foram justificados?"],
 check_en:["Did every real gap get a test?", "Were equivalent mutants justified?"],
 rev:"Rode a mutação de novo depois dos testes novos para confirmar.", rev_en:"Run mutation testing again after adding tests to confirm."},

{id:"snapshot", c:"Code review", n:"Intermediário",
 t:"Snapshots que valem a pena", t_en:"Snapshots worth keeping",
 d:"Decide onde snapshot ajuda e substitui os frágeis por asserções específicas.", d_en:"Decides where snapshots help and replaces brittle ones with specific assertions.",
 quando:"Quando todo mundo atualiza snapshot sem olhar.", quando_en:"When everyone updates snapshots without looking.",
 obj:"Você é um engenheiro de testes. Objetivo: decidir, teste a teste, se o snapshot ajuda ou só gera ruído, e reescrever os que devem virar asserções específicas.",
 obj_en:"You are a test engineer. Goal: decide, test by test, whether the snapshot helps or only creates noise, and rewrite those that should become specific assertions.",
 antes:["Cole os testes de snapshot e um exemplo do snapshot gerado.", "Com que frequência esses snapshots são atualizados?"],
 antes_en:["Paste the snapshot tests and a sample of the generated snapshot.", "How often are these snapshots updated?"],
 passos:["Para cada teste, pergunte: a estrutura inteira é o requisito?", "Decida: manter, reduzir (snapshot só da parte estável) ou trocar por asserções específicas.",
   "Justifique em uma frase.", "Reescreva os testes que mudam."],
 passos_en:["For each test, ask: is the whole structure the requirement?", "Decide: keep, shrink (snapshot only the stable part) or replace with specific assertions.",
   "Justify in one sentence.", "Rewrite the tests that change."],
 ex:`Teste: snapshot do componente Carrinho inteiro (300 linhas de HTML).
Decisão: trocar. O requisito é o total e a quantidade de itens; o resto muda a cada ajuste de layout.
Novo: expect(screen.getByTestId('total')).toHaveTextContent('R$ 90,00');`,
 ex_en:`Test: snapshot of the whole Cart component (300 lines of HTML).
Decision: replace. The requirement is the total and item count; the rest changes with every layout tweak.
New: expect(screen.getByTestId('total')).toHaveTextContent('$90.00');`,
 saida:["Tabela: Teste | Decisão | Motivo", "Testes reescritos"],
 saida_en:["Table: Test | Decision | Reason", "Rewritten tests"],
 check:["Os snapshots mantidos são pequenos e estáveis?", "As asserções novas verificam o requisito?"],
 check_en:["Are kept snapshots small and stable?", "Do new assertions check the requirement?"],
 rev:"Snapshot grande que muda toda semana é ruído; prefira poucos e pequenos.", rev_en:"A big snapshot that changes every week is noise; prefer few, small ones."},

{id:"async-perigoso", c:"Code review", n:"Avançado",
 t:"Código assíncrono perigoso", t_en:"Dangerous async code",
 d:"Promises soltas, await esquecido e forEach com async em código e testes.", d_en:"Floating promises, missing await and forEach with async in code and tests.",
 quando:"Quando testes passam mas o comportamento real falha às vezes.", quando_en:"When tests pass but real behavior sometimes fails.",
 obj:"Você é um revisor especialista em JavaScript assíncrono. Objetivo: encontrar padrões assíncronos que causam perda silenciosa de dados, condições de corrida ou testes que passam sem verificar nada.",
 obj_en:"You are a reviewer specialized in async JavaScript. Goal: find async patterns that cause silent data loss, race conditions or tests that pass without checking anything.",
 antes:["Cole o código JavaScript ou TypeScript e os testes.", "Qual ambiente: Node, navegador ou ambos?"],
 antes_en:["Paste the JavaScript or TypeScript code and tests.", "Which runtime: Node, browser or both?"],
 passos:["Procure promises sem await e sem tratamento de erro.", "Procure forEach com função async (não espera as iterações).",
   "Procure condições de corrida (duas operações alterando o mesmo dado).", "Nos testes, procure asserções que rodam depois de o teste terminar.",
   "Para cada problema: efeito real e correção curta.", "Indique a regra de lint que pegaria cada tipo."],
 passos_en:["Look for promises without await or error handling.", "Look for forEach with an async callback (doesn't wait for iterations).",
   "Look for race conditions (two operations changing the same data).", "In tests, look for assertions that run after the test ends.",
   "For each problem: real effect and short fix.", "Name the lint rule that would catch each type."],
 ex:`| Linha | Problema | Efeito real | Correção |
|---|---|---|---|
| 14 | itens.forEach(async i => await salvar(i)) | A função retorna antes de salvar; erros somem | for (const i of itens) await salvar(i) |
Regra: @typescript-eslint/no-floating-promises e no-misused-promises.`,
 ex_en:`| Line | Problem | Real effect | Fix |
|---|---|---|---|
| 14 | items.forEach(async i => await save(i)) | Function returns before saving; errors vanish | for (const i of items) await save(i) |
Rule: @typescript-eslint/no-floating-promises and no-misused-promises.`,
 saida:["Tabela: Linha | Problema | Efeito real | Correção", "Lista de regras de lint"],
 saida_en:["Table: Line | Problem | Real effect | Fix", "List of lint rules"],
 check:["Toda correção preserva a ordem necessária?", "Os testes agora esperam as promises?"],
 check_en:["Does every fix keep the needed order?", "Do tests now await promises?"],
 rev:"Ative as regras de lint sugeridas no projeto para o problema não voltar.", rev_en:"Enable the suggested lint rules in the project so the problem doesn't come back."},

{id:"upgrade-dependencias", c:"Code review", n:"Intermediário",
 t:"Plano de atualização de dependências", t_en:"Dependency upgrade plan",
 d:"Ordem, riscos e testes para atualizar bibliotecas sem susto.", d_en:"Order, risks and tests to upgrade libraries without surprises.",
 quando:"Antes de atualizar framework de teste, Node ou bibliotecas grandes.", quando_en:"Before upgrading the test framework, Node or large libraries.",
 obj:"Você é um engenheiro que planeja atualizações de dependências com baixo risco. Objetivo: um plano em etapas pequenas, cada uma testável e reversível.",
 obj_en:"You are an engineer who plans low-risk dependency upgrades. Goal: a plan in small steps, each testable and reversible.",
 antes:["Cole o package.json (ou equivalente) e as versões alvo.", "O que preocupa mais: framework de teste, runtime ou bibliotecas da aplicação?"],
 antes_en:["Paste package.json (or equivalent) and target versions.", "What worries you most: test framework, runtime or app libraries?"],
 passos:["Ordene as atualizações das menos para as mais arriscadas, uma versão major por vez.", "Para cada etapa, liste as mudanças incompatíveis conhecidas.",
   "Marque com [VERIFICAR] o que você não tem certeza; não invente notas de versão.", "Diga como testar cada etapa e como voltar atrás."],
 passos_en:["Order upgrades from least to most risky, one major version at a time.", "For each step, list known breaking changes.",
   "Mark [VERIFY] where you're unsure; don't invent release notes.", "Say how to test each step and how to roll back."],
 ex:`| Etapa | Atualizar | Mudanças incompatíveis | Como testar |
|---|---|---|---|
| 1 | Node 18 → 20 | fetch nativo estável; checar libs que faziam polyfill [VERIFICAR] | Suíte completa + smoke em homologação |`,
 ex_en:`| Step | Upgrade | Breaking changes | How to test |
|---|---|---|---|
| 1 | Node 18 → 20 | native fetch stable; check libs that polyfilled it [VERIFY] | Full suite + staging smoke |`,
 saida:["Tabela: Etapa | O que atualizar | Mudanças incompatíveis | Como testar | Como voltar"],
 saida_en:["Table: Step | What to upgrade | Breaking changes | How to test | How to roll back"],
 check:["Uma major por etapa?", "Dúvidas marcadas com [VERIFICAR]?"],
 check_en:["One major per step?", "Doubts marked [VERIFY]?"],
 rev:"Leia o changelog oficial de cada [VERIFICAR] antes de atualizar.", rev_en:"Read the official changelog for each [VERIFY] before upgrading."},

/* ================= Performance ================= */
{id:"plano-carga", c:"Performance", n:"Intermediário",
 t:"Plano de teste de carga", t_en:"Load test plan",
 d:"Cenários, métricas, thresholds e um script k6 inicial.", d_en:"Scenarios, metrics, thresholds and a starter k6 script.",
 quando:"Para sair do 'vamos rodar 1000 usuários'.", quando_en:"To move beyond 'let's run 1000 users'.",
 obj:"Você é um engenheiro de performance. Objetivo: um plano de teste que responda se o sistema aguenta o uso real, com cenários, metas e o script do primeiro teste.",
 obj_en:"You are a performance engineer. Goal: a test plan that answers whether the system handles real usage, with scenarios, targets and the first test's script.",
 antes:["Descreva o sistema e os endpoints ou jornadas críticas.", "Qual o uso real (ex.: pico de 300 pedidos por minuto às 12h)?", "Existe meta de tempo de resposta (SLO)? Em qual ambiente o teste vai rodar?"],
 antes_en:["Describe the system and the critical endpoints or journeys.", "What's real usage (e.g., peak of 300 orders per minute at noon)?", "Is there a response time target (SLO)? Which environment will the test run in?"],
 passos:["Converta o uso real em carga: requisições por segundo e usuários simultâneos.", "Defina os cenários smoke, carga, estresse, pico e resistência, com objetivo, carga e duração.",
   "Sugira thresholds (p95 e taxa de erro) justificados pelo SLO ou pelo uso.", "Liste o que monitorar no servidor durante o teste.",
   "Escreva o script k6 do cenário de carga com thresholds e checks.", "Lembre: rodar só em ambiente autorizado."],
 passos_en:["Convert real usage into load: requests per second and concurrent users.", "Define smoke, load, stress, spike and soak scenarios, with goal, load and duration.",
   "Suggest thresholds (p95 and error rate) justified by the SLO or usage.", "List what to monitor on the server during the test.",
   "Write the k6 script for the load scenario with thresholds and checks.", "Remember: run only in an authorized environment."],
 ex:`export const options = {
  scenarios: { carga: { executor: 'constant-arrival-rate', rate: 5, timeUnit: '1s', duration: '10m', preAllocatedVUs: 50 } },
  thresholds: { http_req_duration: ['p(95)<800'], http_req_failed: ['rate<0.01'] },
};`,
 ex_en:`export const options = {
  scenarios: { load: { executor: 'constant-arrival-rate', rate: 5, timeUnit: '1s', duration: '10m', preAllocatedVUs: 50 } },
  thresholds: { http_req_duration: ['p(95)<800'], http_req_failed: ['rate<0.01'] },
};`,
 saida:["Tabela de cenários: Cenário | Objetivo | Carga | Duração", "Thresholds com justificativa", "O que monitorar (até 6 itens)", "Script k6"],
 saida_en:["Scenario table: Scenario | Goal | Load | Duration", "Thresholds with reasoning", "What to monitor (up to 6 items)", "k6 script"],
 check:["A carga vem do uso real informado?", "Os thresholds estão no script?"],
 check_en:["Does the load come from the stated real usage?", "Are thresholds in the script?"],
 rev:"Nunca rode carga em ambiente que não é seu ou sem autorização.", rev_en:"Never run load against an environment you don't own or without permission."},

{id:"baseline", c:"Performance", n:"Intermediário",
 t:"Baseline de performance", t_en:"Performance baseline",
 d:"Define a medida de referência para pegar regressões de performance no pipeline.", d_en:"Defines the reference measurement to catch performance regressions in the pipeline.",
 quando:"Antes de colocar teste de performance no CI.", quando_en:"Before adding performance tests to CI.",
 obj:"Você é um engenheiro de performance. Objetivo: transformar algumas execuções iguais numa baseline confiável e numa regra de regressão que não dispare por variação natural.",
 obj_en:"You are a performance engineer. Goal: turn a few identical runs into a reliable baseline and a regression rule that doesn't trigger on natural variation.",
 antes:["Cole os resultados de 3 a 5 execuções iguais (p50, p95, taxa de erro, vazão).", "As execuções foram no mesmo ambiente, com os mesmos dados?"],
 antes_en:["Paste the results of 3 to 5 identical runs (p50, p95, error rate, throughput).", "Were runs in the same environment, with the same data?"],
 passos:["Calcule a média e a variação de cada métrica entre as execuções.", "Se a variação do p95 passar de 15%, diga o que estabilizar antes (dados, aquecimento, ambiente).",
   "Proponha a regra de regressão com margem maior que a variação natural.", "Escreva os thresholds em k6 que aplicam a regra.", "Mostre as contas."],
 passos_en:["Compute the mean and variation of each metric across runs.", "If p95 variation exceeds 15%, say what to stabilize first (data, warm-up, environment).",
   "Propose the regression rule with a margin larger than natural variation.", "Write k6 thresholds that apply the rule.", "Show the math."],
 ex:`p95 das 5 execuções: 410, 430, 395, 420, 445 ms → média 420 ms, variação ±6%.
Regra: regressão se p95 > 420 × 1,20 = 504 ms.
thresholds: { http_req_duration: ['p(95)<504'] }`,
 ex_en:`p95 across 5 runs: 410, 430, 395, 420, 445 ms → mean 420 ms, variation ±6%.
Rule: regression if p95 > 420 × 1.20 = 504 ms.
thresholds: { http_req_duration: ['p(95)<504'] }`,
 saida:["Tabela: Métrica | Média | Variação", "Regra de regressão com a conta", "Thresholds em k6"],
 saida_en:["Table: Metric | Mean | Variation", "Regression rule with the math", "k6 thresholds"],
 check:["A margem é maior que a variação natural?", "As contas estão certas?"],
 check_en:["Is the margin larger than natural variation?", "Is the math correct?"],
 rev:"Baseline só vale no mesmo ambiente e com os mesmos dados.", rev_en:"A baseline only holds in the same environment with the same data."},

{id:"percentis-apdex", c:"Performance", n:"Intermediário",
 t:"Percentis e Apdex explicados com os seus dados", t_en:"Percentiles and Apdex explained with your data",
 d:"Calcula p50, p95, p99 e Apdex e diz o que significam para o usuário.", d_en:"Computes p50, p95, p99 and Apdex and says what they mean for users.",
 quando:"Para levar números de performance a quem não é técnico.", quando_en:"To bring performance numbers to non-technical people.",
 obj:"Você é um engenheiro de performance que explica números para o negócio. Objetivo: calcular percentis e Apdex a partir dos dados e traduzir cada número para a experiência do usuário.",
 obj_en:"You are a performance engineer who explains numbers to the business. Goal: compute percentiles and Apdex from the data and translate each number into user experience.",
 antes:["Cole os tempos de resposta em ms ou o resumo da ferramenta.", "Qual o tempo alvo (T) para o Apdex? Se não souber, sugiro um pelo tipo de página."],
 antes_en:["Paste the response times in ms or the tool summary.", "What's the target time (T) for Apdex? If unsure, I'll suggest one by page type."],
 passos:["Calcule p50, p95 e p99, mostrando como.", "Calcule o Apdex: (satisfeitos + tolerantes ÷ 2) ÷ total, com satisfeito ≤ T e tolerante ≤ 4T.",
   "Explique cada número numa frase para alguém de negócio.", "Diga se a média engana neste caso e por quê."],
 passos_en:["Compute p50, p95 and p99, showing how.", "Compute Apdex: (satisfied + tolerating ÷ 2) ÷ total, with satisfied ≤ T and tolerating ≤ 4T.",
   "Explain each number in one sentence for a business person.", "Say whether the average is misleading here and why."],
 ex:`T = 500 ms. 1.000 requisições: 850 ≤ 500 ms, 120 entre 500 e 2.000 ms, 30 acima.
Apdex = (850 + 120 ÷ 2) ÷ 1.000 = 0,91.
Para o negócio: "9 em cada 10 visitas foram rápidas; 3 em cada 100 esperaram mais de 2 segundos."`,
 ex_en:`T = 500 ms. 1,000 requests: 850 ≤ 500 ms, 120 between 500 and 2,000 ms, 30 above.
Apdex = (850 + 120 ÷ 2) ÷ 1,000 = 0.91.
For the business: "9 in 10 visits were fast; 3 in 100 waited more than 2 seconds."`,
 saida:["Tabela: Métrica | Valor | O que significa para o usuário", "Conta do Apdex", "Uma frase sobre a média"],
 saida_en:["Table: Metric | Value | What it means for users", "Apdex math", "One sentence about the average"],
 check:["As contas estão mostradas?", "Cada número tem tradução para o usuário?"],
 check_en:["Is the math shown?", "Does each number have a user translation?"],
 rev:"Para muitos dados, calcule com a ferramenta ou planilha; use a IA para explicar.", rev_en:"For large datasets, compute with the tool or a spreadsheet; use AI to explain."},

{id:"soak-spike", c:"Performance", n:"Avançado",
 t:"Testes de resistência e de pico", t_en:"Soak and spike tests",
 d:"Planeja testes que pegam vazamento de memória e quedas em picos súbitos.", d_en:"Plans tests that catch memory leaks and failures under sudden spikes.",
 quando:"Antes de campanhas, datas de pico ou quando o sistema degrada com as horas.", quando_en:"Before campaigns, peak dates or when the system degrades over hours.",
 obj:"Você é um engenheiro de performance. Objetivo: planejar um teste de resistência (soak) e um de pico (spike) que revelem degradação ao longo do tempo e falha de recuperação depois de picos.",
 obj_en:"You are a performance engineer. Goal: plan a soak test and a spike test that reveal degradation over time and failure to recover after spikes.",
 antes:["Descreva o sistema e as jornadas críticas.", "Qual a carga normal e qual o pico esperado?", "Há autoescala? Quais métricas do servidor você consegue ver?"],
 antes_en:["Describe the system and critical journeys.", "What's normal load and expected peak?", "Is there autoscaling? Which server metrics can you see?"],
 passos:["Soak: carga próxima da normal por várias horas; defina os sinais de vazamento (memória que só sobe, conexões abertas, p95 crescendo).",
   "Spike: subida rápida até o pico, manutenção curta e descida; defina o sinal de falha de recuperação.",
   "Escreva os stages do k6 para cada teste.", "Liste as métricas de servidor a observar e o critério de parada."],
 passos_en:["Soak: near-normal load for several hours; define leak signals (memory only rising, open connections, growing p95).",
   "Spike: fast ramp to peak, short hold and ramp down; define the failure-to-recover signal.",
   "Write the k6 stages for each test.", "List server metrics to watch and the stop criterion."],
 ex:`Spike:
stages: [
  { duration: '2m', target: 50 },
  { duration: '30s', target: 500 },
  { duration: '3m', target: 500 },
  { duration: '30s', target: 50 },
  { duration: '5m', target: 50 }, // recuperação: p95 deve voltar ao normal
]`,
 ex_en:`Spike:
stages: [
  { duration: '2m', target: 50 },
  { duration: '30s', target: 500 },
  { duration: '3m', target: 500 },
  { duration: '30s', target: 50 },
  { duration: '5m', target: 50 }, // recovery: p95 should return to normal
]`,
 saida:["Para cada teste: objetivo, carga, duração, sinais de falha, stages do k6", "Métricas do servidor e critério de parada"],
 saida_en:["For each test: goal, load, duration, failure signals, k6 stages", "Server metrics and stop criterion"],
 check:["O spike tem fase de recuperação?", "Há critério de parada?"],
 check_en:["Does the spike have a recovery phase?", "Is there a stop criterion?"],
 rev:"Combine o horário com o time de infraestrutura e acompanhe ao vivo.", rev_en:"Schedule it with the infrastructure team and watch it live."},

{id:"ler-resultado-k6", c:"Performance", n:"Avançado",
 t:"Interpretar o resultado de um teste de carga", t_en:"Interpret a load test result",
 d:"Lê p95, taxa de erro e vazão e sugere onde está o gargalo.", d_en:"Reads p95, error rate and throughput and suggests where the bottleneck is.",
 quando:"Depois de rodar k6, JMeter ou Gatling.", quando_en:"After running k6, JMeter or Gatling.",
 obj:"Você é um engenheiro de performance. Objetivo: interpretar o resultado de um teste de carga, dizer se passou e levantar hipóteses de gargalo apoiadas nos dados.",
 obj_en:"You are a performance engineer. Goal: interpret a load test result, say whether it passed and raise bottleneck hypotheses backed by data.",
 antes:["Cole o resumo do teste.", "Cole as métricas do servidor no mesmo período (CPU, memória, banco), se tiver.", "Qual era a meta?"],
 antes_en:["Paste the test summary.", "Paste server metrics for the same period (CPU, memory, database), if available.", "What was the goal?"],
 passos:["Compare os números com a meta e diga se passou.", "Encontre onde a degradação começa (carga e métrica).",
   "Cruze com as métricas do servidor para levantar até 3 hipóteses de gargalo.", "Para cada hipótese, o próximo teste para confirmar.",
   "Use só os dados fornecidos."],
 passos_en:["Compare the numbers with the goal and say whether it passed.", "Find where degradation starts (load and metric).",
   "Cross with server metrics to raise up to 3 bottleneck hypotheses.", "For each hypothesis, the next test to confirm it.",
   "Use only the data provided."],
 ex:`Resultado: reprovado. p95 = 1.240 ms (meta < 800 ms); erros 0,4% (meta < 1%).
Degradação: começa em 120 VUs, quando o p95 sobe de 600 para 1.100 ms.
Hipótese 1: pool de conexões do banco esgotado — conexões ativas fixas em 20 a partir de 120 VUs.
Próximo teste: repetir com pool de 40 e comparar o p95.`,
 ex_en:`Result: failed. p95 = 1,240 ms (goal < 800 ms); errors 0.4% (goal < 1%).
Degradation: starts at 120 VUs, when p95 jumps from 600 to 1,100 ms.
Hypothesis 1: database connection pool exhausted — active connections flat at 20 from 120 VUs.
Next test: repeat with a pool of 40 and compare p95.`,
 saida:["Passou ou não, com os números que decidem", "Onde a degradação começa", "Até 3 hipóteses com o próximo teste"],
 saida_en:["Pass or fail, with the deciding numbers", "Where degradation starts", "Up to 3 hypotheses with the next test"],
 check:["Toda hipótese tem dado que a apoie?", "Não inventei métricas?"],
 check_en:["Is every hypothesis backed by data?", "Did I avoid inventing metrics?"],
 rev:"Hipótese de gargalo precisa de métrica do servidor para virar conclusão.", rev_en:"A bottleneck hypothesis needs server metrics to become a conclusion."},

{id:"caos", c:"Performance", n:"Avançado",
 t:"Experimento de caos controlado", t_en:"Controlled chaos experiment",
 d:"Hipótese, falha injetada, raio de impacto e critério de parada.", d_en:"Hypothesis, injected failure, blast radius and stop criteria.",
 quando:"Para provar que o sistema se recupera de uma falha específica.", quando_en:"To prove the system recovers from a specific failure.",
 obj:"Você é um engenheiro de confiabilidade. Objetivo: desenhar um experimento de caos pequeno e seguro que prove (ou desminta) que o sistema se recupera de uma falha específica.",
 obj_en:"You are a reliability engineer. Goal: design a small, safe chaos experiment that proves (or disproves) the system recovers from a specific failure.",
 antes:["Descreva a arquitetura e a dependência que pode falhar (banco lento, serviço de pagamento fora...).", "Qual o comportamento esperado quando ela falhar (fila, retry, mensagem ao usuário)?", "Em qual ambiente o experimento vai rodar?"],
 antes_en:["Describe the architecture and the dependency that may fail (slow database, payment service down...).", "What's the expected behavior when it fails (queue, retry, user message)?", "Which environment will the experiment run in?"],
 passos:["Escreva a hipótese de estado estável: métrica e valor esperados durante a falha.", "Escolha a falha e a ferramenta (ex.: Toxiproxy para latência ou queda).",
   "Defina o raio de impacto e como limitar.", "Defina o critério de parada imediata.", "Liste o que observar e como registrar o resultado."],
 passos_en:["Write the steady-state hypothesis: metric and value expected during the failure.", "Pick the failure and tool (e.g., Toxiproxy for latency or outage).",
   "Define the blast radius and how to limit it.", "Define the immediate stop criterion.", "List what to observe and how to record the result."],
 ex:`Hipótese: com 2 s de latência no serviço de frete, o checkout continua concluindo pedidos com frete estimado e p95 < 3 s.
Falha: Toxiproxy, toxic latency 2000 ms no frete, por 10 minutos.
Parada: taxa de erro do checkout > 2% por 1 minuto.`,
 ex_en:`Hypothesis: with 2 s latency on the shipping service, checkout keeps completing orders with estimated shipping and p95 < 3 s.
Failure: Toxiproxy, 2000 ms latency toxic on shipping, for 10 minutes.
Stop: checkout error rate > 2% for 1 minute.`,
 saida:["Hipótese, Falha e ferramenta, Raio de impacto, Critério de parada, Observação e registro"],
 saida_en:["Hypothesis, Failure and tool, Blast radius, Stop criterion, Observation and recording"],
 check:["A hipótese é mensurável?", "Há critério de parada?"],
 check_en:["Is the hypothesis measurable?", "Is there a stop criterion?"],
 rev:"Comece em ambiente de teste e com raio pequeno; nunca sem acordo do time.", rev_en:"Start in a test environment with a small blast radius; never without team agreement."},

/* ================= Segurança ================= */
{id:"checklist-auth", c:"Segurança", n:"Iniciante",
 t:"Checklist de login e sessão", t_en:"Login and session checklist",
 d:"Verificações de autenticação, sessão e mensagens de erro para QA.", d_en:"Authentication, session and error message checks for QA.",
 quando:"Ao testar login, cadastro ou recuperação de senha.", quando_en:"When testing login, sign-up or password recovery.",
 obj:"Você é um QA com foco em segurança funcional. Objetivo: um checklist de verificações de autenticação e sessão que eu consiga executar com o navegador e o DevTools, sem ferramentas de ataque.",
 obj_en:"You are a QA engineer focused on functional security. Goal: a checklist of authentication and session checks I can run with the browser and DevTools, without attack tools.",
 antes:["Qual fluxo: login, cadastro ou recuperação de senha?", "Como funciona a sessão (cookie, token JWT, lembrar-me)?"],
 antes_en:["Which flow: login, sign-up or password recovery?", "How does the session work (cookie, JWT, remember me)?"],
 passos:["Cubra: mensagem que revela se o usuário existe, bloqueio após tentativas, expiração de sessão, logout real, token na URL, troca de senha invalidando sessões e acesso direto a páginas protegidas.",
   "Para cada item, diga como testar com o navegador ou o DevTools.", "Descreva o resultado seguro esperado.", "Limite a 12 itens, os de maior risco primeiro."],
 passos_en:["Cover: messages revealing whether the user exists, lockout after attempts, session expiry, real logout, token in the URL, password change invalidating sessions and direct access to protected pages.",
   "For each item, say how to test with the browser or DevTools.", "Describe the expected safe result.", "Limit to 12 items, highest risk first."],
 ex:`| Verificação | Como testar | Resultado seguro |
|---|---|---|
| Logout real | Copiar o cookie de sessão, fazer logout, colar o cookie de volta e recarregar | Continua deslogado |
| Mensagem genérica | Errar a senha de um e-mail cadastrado e de um não cadastrado | Mesma mensagem nos dois casos |`,
 ex_en:`| Check | How to test | Safe result |
|---|---|---|
| Real logout | Copy the session cookie, log out, paste the cookie back and reload | Still logged out |
| Generic message | Wrong password for a registered and an unregistered e-mail | Same message in both cases |`,
 saida:["Tabela com até 12 linhas: Verificação | Como testar | Resultado seguro"],
 saida_en:["Table with up to 12 rows: Check | How to test | Safe result"],
 check:["Todo item é executável só com navegador e DevTools?", "Os de maior risco vêm primeiro?"],
 check_en:["Is every item doable with just the browser and DevTools?", "Do the highest risks come first?"],
 rev:"Confirme o comportamento esperado com o time antes de relatar como falha.", rev_en:"Confirm the expected behavior with the team before reporting it as a failure."},

{id:"segredos", c:"Segurança", n:"Iniciante",
 t:"Segredos no repositório", t_en:"Secrets in the repository",
 d:"Interpreta o resultado do Gitleaks e diz o que fazer com cada achado.", d_en:"Interprets Gitleaks output and says what to do with each finding.",
 quando:"Depois de rodar Gitleaks ou o secret scanning do GitHub.", quando_en:"After running Gitleaks or GitHub secret scanning.",
 obj:"Você é um especialista em segurança de repositórios. Objetivo: triar os achados de segredos, separando falsos positivos, e dizer o que fazer com cada segredo real, na ordem certa.",
 obj_en:"You are a repository security specialist. Goal: triage secret findings, separating false positives, and say what to do with each real secret, in the right order.",
 antes:["Cole o resultado do scanner com os valores MASCARADOS.", "O repositório é público ou privado?"],
 antes_en:["Paste the scanner output with values MASKED.", "Is the repository public or private?"],
 passos:["Para cada achado, diga se parece real ou falso positivo (exemplo, teste, placeholder) e por quê.",
   "Defina a urgência: repositório público e segredo de produção é imediata.",
   "Passos na ordem: revogar ou trocar o segredo, depois limpar o histórico, depois prevenir (pre-commit, secret scanning).",
   "Nunca repita o valor do segredo."],
 passos_en:["For each finding, say whether it looks real or a false positive (example, test, placeholder) and why.",
   "Set urgency: public repo plus production secret is immediate.",
   "Steps in order: revoke or rotate the secret, then clean history, then prevent (pre-commit, secret scanning).",
   "Never repeat the secret value."],
 ex:`| Arquivo | Tipo | Real? | Urgência | O que fazer |
|---|---|---|---|---|
| .env.example:3 | Chave AWS | Não: valor de exemplo "AKIAEXEMPLO" | Baixa | Nada; adicionar à lista de permitidos |
| scripts/deploy.sh:12 | Token do GitHub | Sim | Imediata | Revogar o token agora, criar outro em secrets, limpar o histórico |`,
 ex_en:`| File | Type | Real? | Urgency | What to do |
|---|---|---|---|---|
| .env.example:3 | AWS key | No: example value "AKIAEXAMPLE" | Low | Nothing; add to allow-list |
| scripts/deploy.sh:12 | GitHub token | Yes | Immediate | Revoke now, create a new one in secrets, clean history |`,
 saida:["Tabela: Arquivo | Tipo | Real? | Urgência | O que fazer"],
 saida_en:["Table: File | Type | Real? | Urgency | What to do"],
 check:["Nenhum valor de segredo aparece na resposta?", "Revogar vem antes de limpar o histórico?"],
 check_en:["Does no secret value appear in the answer?", "Does revoking come before cleaning history?"],
 rev:"Mascare os valores antes de colar. Segredo vazado se revoga primeiro, depois se discute.", rev_en:"Mask the values before pasting. A leaked secret gets revoked first, discussed later."},

{id:"ameacas", c:"Segurança", n:"Intermediário",
 t:"Modelagem de ameaças rápida (STRIDE)", t_en:"Quick threat modeling (STRIDE)",
 d:"Quem pode abusar, como, o impacto e o teste para cada ameaça.", d_en:"Who could abuse it, how, the impact and a test for each threat.",
 quando:"Antes de testar uma funcionalidade sensível.", quando_en:"Before testing a sensitive feature.",
 obj:"Você é um especialista em segurança de aplicações. Objetivo: uma modelagem de ameaças com STRIDE para uma funcionalidade, que termine em testes concretos que um QA consegue executar.",
 obj_en:"You are an application security specialist. Goal: a STRIDE threat model for a feature that ends in concrete tests a QA engineer can run.",
 antes:["O que a funcionalidade faz?", "Quais papéis de usuário existem?", "Quais dados sensíveis ela toca?"],
 antes_en:["What does the feature do?", "Which user roles exist?", "Which sensitive data does it touch?"],
 passos:["Percorra STRIDE: falsificação de identidade, adulteração, repúdio, vazamento de informação, negação de serviço, elevação de privilégio.",
   "Para cada categoria que se aplica, descreva a ameaça concreta, quem abusaria e como.", "Avalie o impacto em uma palavra (alto, médio, baixo).",
   "Proponha o teste que o QA faria, em ambiente autorizado.", "Limite a 10 ameaças."],
 passos_en:["Walk through STRIDE: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.",
   "For each applicable category, describe the concrete threat, who would abuse it and how.", "Rate impact in one word (high, medium, low).",
   "Propose the test the QA would run, in an authorized environment.", "Limit to 10 threats."],
 ex:`Funcionalidade: upload de foto de perfil.
| STRIDE | Ameaça | Quem | Impacto | Teste |
|---|---|---|---|---|
| Adulteração | Enviar .html renomeado para .jpg e executar script | Usuário mal-intencionado | Alto | Upload de foto.jpg com conteúdo HTML e abrir a URL da imagem |`,
 ex_en:`Feature: profile picture upload.
| STRIDE | Threat | Who | Impact | Test |
|---|---|---|---|---|
| Tampering | Upload .html renamed to .jpg to run a script | Malicious user | High | Upload photo.jpg with HTML content and open the image URL |`,
 saida:["Tabela com até 10 linhas: STRIDE | Ameaça | Quem | Impacto | Teste"],
 saida_en:["Table with up to 10 rows: STRIDE | Threat | Who | Impact | Test"],
 check:["Toda ameaça tem um teste executável?", "Os testes ficam no ambiente autorizado?"],
 check_en:["Does every threat have a runnable test?", "Do tests stay in the authorized environment?"],
 rev:"Teste segurança só com autorização e em ambiente de teste.", rev_en:"Test security only with authorization and in a test environment."},

{id:"idor", c:"Segurança", n:"Intermediário",
 t:"Plano de teste de IDOR", t_en:"IDOR test plan",
 d:"Mapeia identificadores expostos e testa acesso a dados de outro usuário.", d_en:"Maps exposed identifiers and tests access to another user's data.",
 quando:"Em qualquer API ou tela que mostra dados por id.", quando_en:"On any API or screen that shows data by id.",
 obj:"Você é um QA de segurança. Objetivo: um plano para encontrar IDOR (acesso a objeto de outro usuário), mapeando os identificadores expostos e cruzando usuários e papéis.",
 obj_en:"You are a security QA engineer. Goal: a plan to find IDOR (access to another user's object) by mapping exposed identifiers and crossing users and roles.",
 antes:["Cole requisições de exemplo com ids na URL, query ou corpo (sem tokens reais).", "Quais papéis e contas de teste você tem (ex.: cliente A, cliente B, admin)?"],
 antes_en:["Paste sample requests with ids in the URL, query or body (no real tokens).", "Which roles and test accounts do you have (e.g., customer A, customer B, admin)?"],
 passos:["Liste cada identificador exposto e de onde ele vem.", "Para cada um, monte testes de leitura, alteração e exclusão cruzando o usuário que chama e o dono do recurso.",
   "Inclua ids previsíveis (sequenciais) e ids em lugares menos óbvios (corpo, cabeçalho, arquivo).",
   "Defina o resultado seguro e os sinais de vazamento parcial (403 com dados no corpo, contagens diferentes, tempo de resposta)."],
 passos_en:["List each exposed identifier and where it comes from.", "For each, build read, update and delete tests crossing the calling user and the resource owner.",
   "Include predictable (sequential) ids and ids in less obvious places (body, header, file).",
   "Define the safe result and partial leak signals (403 with data in the body, different counts, response time)."],
 ex:`| Requisição | Quem chama | Dono | Resultado seguro |
|---|---|---|---|
| GET /api/faturas/1043/pdf | Cliente A | Cliente B | 403 ou 404, sem o PDF |
| PATCH /api/enderecos/77 {"cep":"..."} | Cliente A | Cliente B | 403, endereço do B inalterado |`,
 ex_en:`| Request | Caller | Owner | Safe result |
|---|---|---|---|
| GET /api/invoices/1043/pdf | Customer A | Customer B | 403 or 404, no PDF |
| PATCH /api/addresses/77 {"zip":"..."} | Customer A | Customer B | 403, B's address unchanged |`,
 saida:["Lista dos identificadores e origem", "Tabela de testes: Requisição | Quem chama | Dono | Resultado seguro", "Sinais de vazamento parcial"],
 saida_en:["List of identifiers and origin", "Test table: Request | Caller | Owner | Safe result", "Partial leak signals"],
 check:["Cobri leitura, alteração e exclusão?", "Há ids fora da URL?"],
 check_en:["Did I cover read, update and delete?", "Are there ids outside the URL?"],
 rev:"Use duas contas de teste suas; nunca teste com dados de clientes reais.", rev_en:"Use two test accounts of your own; never test with real customer data."},

{id:"dependencias-vulneraveis", c:"Segurança", n:"Intermediário",
 t:"Triagem de dependências vulneráveis", t_en:"Vulnerable dependency triage",
 d:"Prioriza alertas de npm audit, Dependabot ou Trivy pelo risco real.", d_en:"Prioritizes npm audit, Dependabot or Trivy alerts by real risk.",
 quando:"Quando o scanner mostra dezenas de alertas.", quando_en:"When the scanner shows dozens of alerts.",
 obj:"Você é um especialista em segurança de dependências. Objetivo: transformar uma lista longa de alertas numa lista curta de ações, priorizada pelo risco real no uso da aplicação.",
 obj_en:"You are a dependency security specialist. Goal: turn a long list of alerts into a short action list, prioritized by real risk in how the app uses them.",
 antes:["Cole o resultado do scanner.", "Como a aplicação usa as bibliotecas principais (ex.: X só em testes; Y processa upload)?", "A aplicação é exposta na internet?"],
 antes_en:["Paste the scanner output.", "How does the app use the main libraries (e.g., X only in tests; Y handles uploads)?", "Is the app exposed to the internet?"],
 passos:["Para cada alerta, avalie se a parte vulnerável é alcançável no nosso uso.", "Combine severidade do scanner com alcance para definir a prioridade.",
   "Agrupe alertas resolvidos pela mesma atualização.", "Marque [VERIFICAR] quando não der para saber o alcance.", "Proponha a ação: atualizar, substituir, mitigar ou aceitar com justificativa."],
 passos_en:["For each alert, assess whether the vulnerable part is reachable in our usage.", "Combine scanner severity with reachability to set priority.",
   "Group alerts fixed by the same upgrade.", "Mark [VERIFY] when reachability is unclear.", "Propose the action: upgrade, replace, mitigate or accept with a reason."],
 ex:`| Pacote | Severidade | Alcançável? | Prioridade | Ação |
|---|---|---|---|---|
| imagemagick (via sharp) | Alta | Sim: processa upload de usuário | 1 | Atualizar sharp para a versão corrigida |
| minimist | Crítica | Não: só no script de build [VERIFICAR] | 3 | Atualizar junto com o próximo upgrade de build |`,
 ex_en:`| Package | Severity | Reachable? | Priority | Action |
|---|---|---|---|---|
| imagemagick (via sharp) | High | Yes: processes user uploads | 1 | Upgrade sharp to the fixed version |
| minimist | Critical | No: build script only [VERIFY] | 3 | Upgrade with the next build tooling update |`,
 saida:["Tabela: Pacote | Severidade | Alcançável? | Prioridade | Ação, com alertas agrupados"],
 saida_en:["Table: Package | Severity | Reachable? | Priority | Action, with grouped alerts"],
 check:["A prioridade considera o alcance, não só a severidade?", "Dúvidas marcadas?"],
 check_en:["Does priority consider reachability, not just severity?", "Are doubts marked?"],
 rev:"Dependência só de desenvolvimento ainda importa no pipeline; não ignore de vez.", rev_en:"Dev-only dependencies still matter in the pipeline; don't dismiss them entirely."},


{id:"seguranca-revisao-pr", c:"Segurança", n:"Avançado",
 t:"Revisão de segurança de um pull request", t_en:"Security review of a pull request",
 d:"Aponta riscos de segurança numa mudança e os testes que o QA deve acrescentar.", d_en:"Points out security risks in a change and the tests QA should add.",
 quando:"Em mudanças que tocam login, permissões, dados pessoais ou pagamentos.", quando_en:"On changes touching login, permissions, personal data or payments.",
 obj:"Você é um especialista em segurança de aplicações apoiando o QA. Objetivo: revisar uma mudança do ponto de vista defensivo e dizer quais controles faltam e quais testes o time deve acrescentar.",
 obj_en:"You are an application security specialist supporting QA. Goal: review a change from a defensive standpoint and say which controls are missing and which tests the team should add.",
 antes:["Cole o diff ou descreva a mudança.", "Quais dados e papéis de usuário a mudança envolve?"],
 antes_en:["Paste the diff or describe the change.", "Which data and user roles does the change involve?"],
 passos:["Verifique se a mudança mantém autenticação e autorização em todos os pontos novos.",
   "Verifique validação de entrada e tratamento de erros que não exponham detalhes internos.",
   "Verifique se dados pessoais aparecem em logs, respostas ou URLs.",
   "Para cada problema, diga o controle que falta, com referência ao OWASP ASVS quando couber.",
   "Proponha os testes que o QA deve acrescentar para cada controle."],
 passos_en:["Check the change keeps authentication and authorization at every new entry point.",
   "Check input validation and error handling that doesn't expose internal details.",
   "Check whether personal data shows up in logs, responses or URLs.",
   "For each problem, state the missing control, referencing OWASP ASVS where it fits.",
   "Propose the tests QA should add for each control."],
 ex:`| Arquivo:linha | Risco | Controle que falta | Teste a acrescentar |
|---|---|---|---|
| api/relatorios.ts:18 | Rota nova sem checagem de papel | Autorização por papel | Usuário comum chamando a rota recebe 403 |
| api/relatorios.ts:44 | E-mail do cliente gravado no log | Mascaramento de dados pessoais | Conferir o log após gerar o relatório |`,
 ex_en:`| File:line | Risk | Missing control | Test to add |
|---|---|---|---|
| api/reports.ts:18 | New route without role check | Role-based authorization | Regular user calling the route gets 403 |
| api/reports.ts:44 | Customer e-mail written to the log | Personal data masking | Check the log after generating the report |`,
 saida:["Tabela: Arquivo:linha | Risco | Controle que falta | Teste a acrescentar"],
 saida_en:["Table: File:line | Risk | Missing control | Test to add"],
 check:["Todo risco tem um teste proposto?", "Olhei logs e mensagens de erro?"],
 check_en:["Does every risk have a proposed test?", "Did I look at logs and error messages?"],
 rev:"Leve os pontos ao time de segurança quando houver; a revisão do QA não substitui a deles.", rev_en:"Bring the points to the security team if there is one; QA review doesn't replace theirs."},

/* ================= Acessibilidade ================= */
{id:"checklist-a11y", c:"Acessibilidade", n:"Iniciante",
 t:"Checklist de acessibilidade", t_en:"Accessibility checklist",
 d:"WCAG 2.2 AA dividido por teclado, foco, leitor de tela e contraste.", d_en:"WCAG 2.2 AA split by keyboard, focus, screen reader and contrast.",
 quando:"Para revisar uma tela antes de liberar.", quando_en:"To review a screen before release.",
 obj:"Você é um especialista em acessibilidade digital. Objetivo: um checklist WCAG 2.2 nível AA específico para uma tela, que um QA consiga executar com teclado, leitor de tela e ferramentas gratuitas.",
 obj_en:"You are a digital accessibility specialist. Goal: a WCAG 2.2 level AA checklist specific to one screen that a QA engineer can run with a keyboard, a screen reader and free tools.",
 antes:["Descreva a tela ou cole o HTML.", "Quem usa a tela e para quê?"],
 antes_en:["Describe the screen or paste the HTML.", "Who uses the screen and for what?"],
 passos:["Organize em seis grupos: teclado, foco, leitor de tela, contraste, formulários e mensagens de erro.",
   "Inclua só itens que se aplicam a esta tela.", "Para cada item, cite o critério WCAG e como verificar (manual ou ferramenta: axe DevTools, Lighthouse, NVDA).",
   "Destaque os itens que bloqueiam o uso por completo."],
 passos_en:["Organize into six groups: keyboard, focus, screen reader, contrast, forms and error messages.",
   "Include only items that apply to this screen.", "For each item, cite the WCAG criterion and how to check it (manual or tool: axe DevTools, Lighthouse, NVDA).",
   "Highlight items that block use entirely."],
 ex:`| Grupo | Item | WCAG | Como verificar |
|---|---|---|---|
| Teclado | Finalizar a compra só com Tab, Enter e Espaço [BLOQUEIA] | 2.1.1 | Manual, sem mouse |
| Formulários | Erro de CEP anunciado pelo leitor de tela | 3.3.1 | NVDA: enviar com CEP inválido |`,
 ex_en:`| Group | Item | WCAG | How to check |
|---|---|---|---|
| Keyboard | Complete checkout with only Tab, Enter and Space [BLOCKER] | 2.1.1 | Manual, no mouse |
| Forms | ZIP error announced by the screen reader | 3.3.1 | NVDA: submit with an invalid ZIP |`,
 saida:["Tabela: Grupo | Item | WCAG | Como verificar, com [BLOQUEIA] nos críticos"],
 saida_en:["Table: Group | Item | WCAG | How to check, with [BLOCKER] on critical ones"],
 check:["Todo item se aplica a esta tela?", "Todo item tem critério WCAG?"],
 check_en:["Does every item apply to this screen?", "Does every item have a WCAG criterion?"],
 rev:"Ferramenta automática pega só parte dos problemas; teste com teclado e leitor de tela.", rev_en:"Automated tools catch only part of the issues; test with keyboard and a screen reader."}
);
