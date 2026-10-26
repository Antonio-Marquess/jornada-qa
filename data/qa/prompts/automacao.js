/* Jornada QA — Prompts: Automação, Depuração e CI/CD. (formato descrito em estudo-requisitos.js) */
(JQA.PROMPTS = JQA.PROMPTS || []).push(

/* ================= Automação ================= */
{id:"playwright-rascunho", c:"Automação", n:"Iniciante",
 t:"Primeiro teste Playwright a partir dos passos manuais", t_en:"First Playwright test from manual steps",
 d:"Teste com locators acessíveis, asserções web-first e dados próprios.", d_en:"A test with accessible locators, web-first assertions and its own data.",
 quando:"Para começar um teste a partir dos passos manuais.", quando_en:"To start a test from manual steps.",
 obj:"Você é um engenheiro de automação especialista em Playwright. Objetivo: transformar passos manuais num teste em TypeScript estável, legível e que falhe quando o comportamento quebrar.",
 obj_en:"You are an automation engineer specialized in Playwright. Goal: turn manual steps into a stable, readable TypeScript test that fails when the behavior breaks.",
 antes:["Cole os passos manuais e o resultado esperado.", "Qual a URL do ambiente de teste?", "Se puder, cole o HTML dos elementos principais ou descreva os rótulos e textos visíveis."],
 antes_en:["Paste the manual steps and the expected result.", "What's the test environment URL?", "If you can, paste the HTML of the main elements or describe the visible labels and texts."],
 passos:["Use locators acessíveis na ordem: getByRole, getByLabel, getByPlaceholder, getByText; data-testid se existir; CSS só em último caso.",
   "Use asserções web-first (toBeVisible, toHaveText, toHaveURL); nunca waitForTimeout.",
   "Faça o teste independente: crie os dados que ele precisa (de preferência por API).",
   "Verifique o resultado que importa para o usuário, não só que a página carregou.",
   "Comente apenas os seletores que não são óbvios."],
 passos_en:["Use accessible locators in this order: getByRole, getByLabel, getByPlaceholder, getByText; data-testid if present; CSS only as a last resort.",
   "Use web-first assertions (toBeVisible, toHaveText, toHaveURL); never waitForTimeout.",
   "Make the test independent: create the data it needs (preferably via API).",
   "Assert the outcome that matters to the user, not just that the page loaded.",
   "Comment only non-obvious locators."],
 ex:`test('login com usuário bloqueado mostra mensagem de bloqueio', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('[data-test="error"]')).toContainText('locked out');
});`,
 ex_en:`test('locked-out user sees a lockout message', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('[data-test="error"]')).toContainText('locked out');
});`,
 saida:["Só o código do teste, pronto para rodar"],
 saida_en:["Test code only, ready to run"],
 check:["Nenhum waitForTimeout?", "A asserção final verifica o resultado do usuário?", "O teste não depende de outro?"],
 check_en:["No waitForTimeout?", "Does the final assertion check the user outcome?", "Is the test independent?"],
 rev:"Quebre a funcionalidade de propósito e veja se o teste falha.", rev_en:"Break the feature on purpose and check that the test fails."},

{id:"nomenclatura-testes", c:"Automação", n:"Iniciante",
 t:"Nomes de teste que explicam a falha", t_en:"Test names that explain the failure",
 d:"Renomeia testes para que o relatório diga o que quebrou sem abrir o código.", d_en:"Renames tests so the report says what broke without opening the code.",
 quando:"Quando o relatório mostra 'test 1', 'deve funcionar' e afins.", quando_en:"When the report shows 'test 1', 'should work' and the like.",
 obj:"Você é um revisor de código de testes. Objetivo: propor nomes de teste que digam, sozinhos, qual comportamento quebrou quando o teste falhar.",
 obj_en:"You are a test code reviewer. Goal: propose test names that say, on their own, which behavior broke when the test fails.",
 antes:["Cole os nomes dos testes ou o arquivo.", "Em qual idioma o time escreve os testes?"],
 antes_en:["Paste the test names or the file.", "Which language does the team write tests in?"],
 passos:["Use o padrão '<condição ou ação> <resultado esperado>'.", "Limite a 70 caracteres por nome.",
   "Evite palavras vazias: 'deve funcionar', 'teste de', 'ok'.", "Se um teste verifica mais de uma coisa, marque [DIVIDIR] e diga em quais testes."],
 passos_en:["Use the pattern '<condition or action> <expected result>'.", "Keep names to 70 characters.",
   "Avoid empty words: 'should work', 'test of', 'ok'.", "If a test checks more than one thing, mark it [SPLIT] and say into which tests."],
 ex:`| Atual | Proposto |
|---|---|
| teste login 2 | login com senha errada mostra "usuário ou senha inválidos" |
| deve funcionar o carrinho | remover o último item deixa o carrinho vazio [DIVIDIR: adicionar / remover] |`,
 ex_en:`| Current | Proposed |
|---|---|
| login test 2 | login with wrong password shows "invalid username or password" |
| cart should work | removing the last item empties the cart [SPLIT: add / remove] |`,
 saida:["Tabela: Nome atual | Nome proposto"],
 saida_en:["Table: Current name | Proposed name"],
 check:["Todo nome diz condição e resultado?", "Nenhum passa de 70 caracteres?"],
 check_en:["Does every name state condition and result?", "None over 70 characters?"],
 rev:"Combine o padrão com o time e aplique no projeto todo.", rev_en:"Agree on the convention with the team and apply it across the project."},

{id:"revisar-teste", c:"Automação", n:"Intermediário",
 t:"Revisar um teste automatizado", t_en:"Review an automated test",
 d:"Seletores frágeis, asserções fracas, dependências e esperas fixas.", d_en:"Brittle selectors, weak assertions, dependencies and fixed waits.",
 quando:"Antes de aceitar um teste gerado por IA ou por outra pessoa.", quando_en:"Before accepting a test written by AI or someone else.",
 obj:"Você é um QA sênior fazendo code review de testes automatizados. Objetivo: encontrar o que torna o teste frágil, inútil ou enganoso, com correções concretas.",
 obj_en:"You are a senior QA engineer reviewing automated tests. Goal: find what makes the test brittle, useless or misleading, with concrete fixes.",
 antes:["Cole o código do teste.", "Qual cenário ele deveria cobrir?"],
 antes_en:["Paste the test code.", "Which scenario should it cover?"],
 passos:["Seletores: frágeis (CSS por posição, classes geradas, XPath longo)?",
   "Asserções: o teste passaria mesmo com o bug? Falta verificar o resultado principal?",
   "Independência: depende de ordem, de dados de outro teste ou de estado global?",
   "Esperas: há pausas fixas (sleep, waitForTimeout)?",
   "Cobertura: o que do cenário ficou de fora?",
   "Para cada problema, mostre a correção em código curto."],
 passos_en:["Locators: brittle (positional CSS, generated classes, long XPath)?",
   "Assertions: would the test pass even with the bug? Is the main outcome unchecked?",
   "Independence: does it depend on order, another test's data or global state?",
   "Waits: are there fixed pauses (sleep, waitForTimeout)?",
   "Coverage: what part of the scenario is missing?",
   "For each problem, show the fix in short code."],
 ex:`| Linha | Problema | Correção |
|---|---|---|
| 12 | await page.waitForTimeout(3000) | await expect(page.getByText('Pedido criado')).toBeVisible() |
| 15 | Só verifica a URL; passaria com total errado | Verificar também o total: await expect(total).toHaveText('R$ 150,00') |`,
 ex_en:`| Line | Problem | Fix |
|---|---|---|
| 12 | await page.waitForTimeout(3000) | await expect(page.getByText('Order created')).toBeVisible() |
| 15 | Only checks the URL; would pass with a wrong total | Also check the total: await expect(total).toHaveText('$150.00') |`,
 saida:["Veredito em uma linha: aceitar, ajustar ou refazer", "Tabela: Linha | Problema | Correção, ordenada pela gravidade"],
 saida_en:["One-line verdict: accept, adjust or redo", "Table: Line | Problem | Fix, sorted by severity"],
 check:["Verifiquei se o teste passaria com o bug?", "Toda correção é código executável?"],
 check_en:["Did I check whether the test would pass with the bug?", "Is every fix runnable code?"],
 rev:"Aplique as correções uma por vez e rode a suíte entre elas.", rev_en:"Apply fixes one at a time and run the suite in between."},

{id:"page-object", c:"Automação", n:"Intermediário",
 t:"Refatorar para Page Objects", t_en:"Refactor into Page Objects",
 d:"Organiza testes repetitivos em Page Objects ou funções de ação.", d_en:"Organizes repetitive tests into Page Objects or action helpers.",
 quando:"Quando vários testes repetem os mesmos passos.", quando_en:"When several tests repeat the same steps.",
 obj:"Você é um engenheiro de automação. Objetivo: refatorar testes repetitivos para Page Objects (ou funções de ação, se for mais simples) sem mudar o que eles verificam.",
 obj_en:"You are an automation engineer. Goal: refactor repetitive tests into Page Objects (or action helpers, if simpler) without changing what they verify.",
 antes:["Cole os testes que repetem passos.", "Qual ferramenta (Playwright, Cypress, Selenium) e linguagem?"],
 antes_en:["Paste the tests that repeat steps.", "Which tool (Playwright, Cypress, Selenium) and language?"],
 passos:["Identifique as telas e as ações repetidas.", "Crie uma classe por tela com locators e ações de negócio (ex.: fazerLogin, adicionarAoCarrinho).",
   "Mantenha as asserções nos testes, não dentro das páginas.", "Evite herança entre páginas sem necessidade.",
   "Reescreva os testes usando as páginas, sem mudar o comportamento verificado.", "Mostre a estrutura de pastas final."],
 passos_en:["Identify the screens and repeated actions.", "Create one class per screen with locators and business actions (e.g., login, addToCart).",
   "Keep assertions in the tests, not inside the pages.", "Avoid inheritance between pages unless needed.",
   "Rewrite the tests using the pages, without changing the verified behavior.", "Show the final folder structure."],
 ex:`export class LoginPage {
  constructor(private page: Page) {}
  async login(usuario: string, senha: string) {
    await this.page.getByPlaceholder('Username').fill(usuario);
    await this.page.getByPlaceholder('Password').fill(senha);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}`,
 ex_en:`export class LoginPage {
  constructor(private page: Page) {}
  async login(user: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(user);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}`,
 saida:["Estrutura de pastas", "Código de cada arquivo", "Testes reescritos"],
 saida_en:["Folder structure", "Code for each file", "Rewritten tests"],
 check:["As asserções ficaram nos testes?", "Os testes verificam exatamente o mesmo de antes?"],
 check_en:["Did assertions stay in the tests?", "Do the tests verify exactly the same things as before?"],
 rev:"Rode a suíte antes e depois: o resultado precisa ser idêntico.", rev_en:"Run the suite before and after: results must be identical."},

{id:"fixtures-playwright", c:"Automação", n:"Intermediário",
 t:"Fixtures do Playwright", t_en:"Playwright fixtures",
 d:"Login, dados e páginas preparados por fixture, sem repetir setup em cada teste.", d_en:"Login, data and pages prepared by fixtures, with no setup repeated in each test.",
 quando:"Quando todo teste começa fazendo login ou criando os mesmos dados.", quando_en:"When every test starts by logging in or creating the same data.",
 obj:"Você é um engenheiro de automação especialista em Playwright. Objetivo: substituir setup repetido por fixtures (test.extend) que deixem os testes curtos, rápidos e independentes.",
 obj_en:"You are an automation engineer specialized in Playwright. Goal: replace repeated setup with fixtures (test.extend) that keep tests short, fast and independent.",
 antes:["Cole o código de setup que se repete e um teste de exemplo.", "O login pode ser feito por API? Os dados de teste podem ser criados por API?"],
 antes_en:["Paste the repeated setup code and a sample test.", "Can login be done via API? Can test data be created via API?"],
 passos:["Crie uma fixture de autenticação com storageState, fazendo login uma vez por worker quando possível.",
   "Crie fixtures de dados que criam por API e apagam no teardown.", "Crie fixtures de páginas (Page Objects) se o projeto usar.",
   "Tipifique tudo em TypeScript.", "Reescreva o teste de exemplo usando as fixtures."],
 passos_en:["Create an auth fixture with storageState, logging in once per worker when possible.",
   "Create data fixtures that create via API and delete in teardown.", "Create page fixtures (Page Objects) if the project uses them.",
   "Type everything in TypeScript.", "Rewrite the sample test using the fixtures."],
 ex:`export const test = base.extend<{ produto: Produto }>({
  produto: async ({ request }, use) => {
    const res = await request.post('/produtos', { data: novoProduto() });
    const produto = await res.json();
    await use(produto);
    await request.delete(\`/produtos/\${produto._id}\`); // limpeza
  },
});`,
 ex_en:`export const test = base.extend<{ product: Product }>({
  product: async ({ request }, use) => {
    const res = await request.post('/products', { data: newProduct() });
    const product = await res.json();
    await use(product);
    await request.delete(\`/products/\${product._id}\`); // cleanup
  },
});`,
 saida:["Arquivo de fixtures completo", "Teste de exemplo reescrito"],
 saida_en:["Complete fixtures file", "Rewritten sample test"],
 check:["Toda fixture que cria dados também apaga?", "Os testes ainda rodam em paralelo?"],
 check_en:["Does every fixture that creates data also delete it?", "Do tests still run in parallel?"],
 rev:"Confira se os testes ainda passam rodando em paralelo e em ordem aleatória.", rev_en:"Check that tests still pass in parallel and in random order."},

{id:"paralelizar", c:"Automação", n:"Avançado",
 t:"Paralelizar a suíte com segurança", t_en:"Parallelize the suite safely",
 d:"Encontra o que impede rodar em paralelo e propõe workers e shards.", d_en:"Finds what blocks parallel runs and proposes workers and shards.",
 quando:"Quando a suíte demora demais no pipeline.", quando_en:"When the suite takes too long in the pipeline.",
 obj:"Você é um engenheiro de automação especialista em performance de suítes. Objetivo: reduzir o tempo da suíte com paralelismo sem criar testes instáveis.",
 obj_en:"You are an automation engineer specialized in suite performance. Goal: cut suite time with parallelism without creating flaky tests.",
 antes:["Qual ferramenta (Playwright, Cypress, Jest...)?", "Quanto tempo leva hoje e quantos testes são?", "Cole a configuração atual e 2 ou 3 testes de exemplo."],
 antes_en:["Which tool (Playwright, Cypress, Jest...)?", "How long does it take today and how many tests?", "Paste the current config and 2 or 3 sample tests."],
 passos:["Liste o que impede o paralelismo: dados compartilhados, dependência de ordem, estado global, contas de usuário fixas.",
   "Para cada impedimento, proponha a correção (dados por teste, contas por worker, isolamento).",
   "Proponha número de workers e de shards para o pipeline, com estimativa de tempo.",
   "Mostre a configuração final e o trecho do pipeline com o sharding."],
 passos_en:["List what blocks parallelism: shared data, order dependence, global state, fixed user accounts.",
   "For each blocker, propose the fix (per-test data, per-worker accounts, isolation).",
   "Propose the number of workers and shards for the pipeline, with a time estimate.",
   "Show the final config and the pipeline excerpt with sharding."],
 ex:`Impedimento: todos os testes usam o usuário "qa@exemplo.com" e alteram o carrinho dele.
Correção: um usuário por worker, criado na fixture: \`qa+w\${workerIndex}@exemplo.com\`.
Estimativa: 40 min → 4 workers × 2 shards ≈ 6 min.`,
 ex_en:`Blocker: every test uses the user "qa@example.com" and changes their cart.
Fix: one user per worker, created in the fixture: \`qa+w\${workerIndex}@example.com\`.
Estimate: 40 min → 4 workers × 2 shards ≈ 6 min.`,
 saida:["Tabela: Impedimento | Onde | Correção", "Proposta de workers e shards com estimativa", "Configuração final"],
 saida_en:["Table: Blocker | Where | Fix", "Workers and shards proposal with estimate", "Final configuration"],
 check:["Cada impedimento tem correção?", "A estimativa considera o tempo de subida dos shards?"],
 check_en:["Does each blocker have a fix?", "Does the estimate include shard startup time?"],
 rev:"Rode a suíte paralela 10 vezes antes de confiar nela.", rev_en:"Run the parallel suite 10 times before trusting it."},

{id:"property-based", c:"Automação", n:"Avançado",
 t:"Testes baseados em propriedades", t_en:"Property-based tests",
 d:"Encontra propriedades que valem para qualquer entrada e gera centenas de casos.", d_en:"Finds properties that hold for any input and generates hundreds of cases.",
 quando:"Para funções de cálculo, conversão, ordenação ou validação.", quando_en:"For calculation, conversion, sorting or validation functions.",
 obj:"Você é um engenheiro de testes especialista em testes baseados em propriedades. Objetivo: encontrar propriedades que valem para qualquer entrada válida e escrever testes que geram centenas de casos automaticamente.",
 obj_en:"You are a test engineer specialized in property-based testing. Goal: find properties that hold for any valid input and write tests that generate hundreds of cases automatically.",
 antes:["Cole a função e explique as regras.", "Qual biblioteca: fast-check (JS/TS) ou Hypothesis (Python)?"],
 antes_en:["Paste the function and explain its rules.", "Which library: fast-check (JS/TS) or Hypothesis (Python)?"],
 passos:["Liste até 5 propriedades: ida e volta, invariante, idempotência, comparação com uma implementação simples, limites.",
   "Para cada uma, explique em uma frase por que ela deve valer.", "Defina os geradores de entrada e as restrições necessárias.",
   "Escreva os testes.", "Explique como guardar o caso mínimo que falhar como teste fixo."],
 passos_en:["List up to 5 properties: round trip, invariant, idempotence, comparison with a simple implementation, boundaries.",
   "For each one, explain in one sentence why it must hold.", "Define the input generators and needed constraints.",
   "Write the tests.", "Explain how to keep a failing shrunk case as a fixed test."],
 ex:`Função: formatarMoeda(valor) e lerMoeda(texto).
Propriedade (ida e volta): para todo valor com 2 casas entre 0 e 1.000.000, lerMoeda(formatarMoeda(v)) === v.
fc.assert(fc.property(fc.integer({ min: 0, max: 100_000_000 }), c => lerMoeda(formatarMoeda(c / 100)) === c / 100));`,
 ex_en:`Function: formatCurrency(value) and parseCurrency(text).
Property (round trip): for every 2-decimal value between 0 and 1,000,000, parseCurrency(formatCurrency(v)) === v.
fc.assert(fc.property(fc.integer({ min: 0, max: 100_000_000 }), c => parseCurrency(formatCurrency(c / 100)) === c / 100));`,
 saida:["Lista de propriedades com o porquê", "Código dos testes", "Uma linha sobre geradores com restrição"],
 saida_en:["List of properties with the reason", "Test code", "One line on constrained generators"],
 check:["As propriedades são verdadeiras para qualquer entrada válida?", "Os geradores evitam entradas inválidas?"],
 check_en:["Are the properties true for any valid input?", "Do generators avoid invalid inputs?"],
 rev:"Quando um teste falhar, guarde o caso mínimo encontrado como teste fixo.", rev_en:"When a test fails, keep the shrunk failing case as a fixed regression test."},

{id:"agente-planner", c:"Automação", n:"Avançado",
 t:"Plano para os agentes do Playwright", t_en:"Plan for Playwright test agents",
 d:"Prepara o seed e o plano que o Planner e o Generator vão usar.", d_en:"Prepares the seed and plan that Planner and Generator will use.",
 quando:"Antes de gerar uma suíte com Playwright Test Agents.", quando_en:"Before generating a suite with Playwright Test Agents.",
 obj:"Você é um engenheiro de automação que usa os agentes do Playwright (Planner, Generator, Healer). Objetivo: preparar o seed test e um plano priorizado por risco para que os agentes gerem testes úteis, e definir como revisar o que eles produzirem.",
 obj_en:"You are an automation engineer using Playwright's agents (Planner, Generator, Healer). Goal: prepare the seed test and a risk-prioritized plan so the agents generate useful tests, and define how to review what they produce.",
 antes:["Qual aplicação e a URL do ambiente de teste?", "Quais são os riscos principais?", "Como é o login e quais dados mínimos a aplicação precisa?"],
 antes_en:["Which application and test environment URL?", "What are the main risks?", "How does login work and what minimum data does the app need?"],
 passos:["Escreva um seed test que leve a aplicação ao estado inicial (login e dados mínimos).",
   "Escreva um plano em Markdown com até 15 cenários, priorizados por risco, cada um com resultado esperado verificável.",
   "Escreva um checklist de revisão do código gerado: locators, asserções, dados, independência.",
   "Explique quando desconfiar de uma correção do Healer."],
 passos_en:["Write a seed test that brings the app to its initial state (login and minimum data).",
   "Write a Markdown plan with up to 15 scenarios, prioritized by risk, each with a verifiable expected result.",
   "Write a review checklist for the generated code: locators, assertions, data, independence.",
   "Explain when to distrust a Healer fix."],
 ex:`## Cenário 1 — Compra com cupom válido (risco: cálculo do total)
Passos: adicionar 1 produto de R$ 100,00, aplicar cupom DESC10, ir ao checkout.
Esperado: total R$ 90,00 e linha "Desconto: -R$ 10,00".`,
 ex_en:`## Scenario 1 — Purchase with a valid coupon (risk: total calculation)
Steps: add 1 product costing $100.00, apply coupon SAVE10, go to checkout.
Expected: total $90.00 and a "Discount: -$10.00" line.`,
 saida:["Seed test em TypeScript", "Plano em Markdown", "Checklist de revisão (até 6 itens)"],
 saida_en:["Seed test in TypeScript", "Plan in Markdown", "Review checklist (up to 6 items)"],
 check:["Todo cenário tem resultado esperado verificável?", "O plano está ordenado por risco?"],
 check_en:["Does every scenario have a verifiable expected result?", "Is the plan ordered by risk?"],
 rev:"O Healer pode 'consertar' um teste escondendo um bug real; revise cada correção.", rev_en:"The Healer may 'fix' a test by hiding a real bug; review every fix."},

/* ================= Depuração ================= */
{id:"hipoteses-falha", c:"Depuração", n:"Intermediário",
 t:"Hipóteses para uma falha", t_en:"Hypotheses for a failure",
 d:"Causas da mais à menos provável e como confirmar cada uma.", d_en:"Causes from most to least likely and how to confirm each one.",
 quando:"Quando um teste quebra e você não sabe por quê.", quando_en:"When a test breaks and you don't know why.",
 obj:"Você é um QA sênior que investiga falhas de forma sistemática. Objetivo: listar hipóteses da mais à menos provável e o passo concreto para confirmar ou descartar cada uma, antes de qualquer correção.",
 obj_en:"You are a senior QA engineer who investigates failures systematically. Goal: list hypotheses from most to least likely and the concrete step to confirm or rule out each one, before any fix.",
 antes:["Cole a mensagem de erro e o stack.", "Cole o trecho do teste.", "O que mudou recentemente (deploy, dados, ambiente, dependências)?"],
 antes_en:["Paste the error message and stack trace.", "Paste the test excerpt.", "What changed recently (deploy, data, environment, dependencies)?"],
 passos:["Leia o erro e diga exatamente onde e por que falhou, na visão do teste.",
   "Liste até 5 hipóteses, cobrindo: bug real, teste quebrado, dados, ambiente e dependência externa.",
   "Ordene pela evidência disponível, citando a linha do erro que apoia cada hipótese.",
   "Para cada hipótese, um passo concreto para confirmar ou descartar.", "Não proponha correção antes de confirmar a causa."],
 passos_en:["Read the error and state exactly where and why it failed, from the test's view.",
   "List up to 5 hypotheses, covering: real bug, broken test, data, environment and external dependency.",
   "Sort by available evidence, quoting the error line supporting each one.",
   "For each hypothesis, one concrete step to confirm or rule it out.", "Do not propose a fix before confirming the cause."],
 ex:`Erro: "Timeout 5000ms waiting for getByRole('button', { name: 'Pagar' })"
| Hipótese | Evidência | Como confirmar |
|---|---|---|
| O texto do botão mudou | Timeout no locator, não em navegação | Abrir o trace e ver o texto atual do botão |
| O botão só aparece depois de escolher o frete | Mudança recente no checkout | Rodar com --headed e observar a tela |`,
 ex_en:`Error: "Timeout 5000ms waiting for getByRole('button', { name: 'Pay' })"
| Hypothesis | Evidence | How to confirm |
|---|---|---|
| Button text changed | Timeout on the locator, not navigation | Open the trace and check the current button text |
| Button only appears after choosing shipping | Recent checkout change | Run with --headed and watch the screen |`,
 saida:["Uma frase: onde e por que falhou", "Tabela: Hipótese | Evidência | Como confirmar ou descartar"],
 saida_en:["One sentence: where and why it failed", "Table: Hypothesis | Evidence | How to confirm or rule out"],
 check:["Considerei a possibilidade de bug real?", "Todo passo de confirmação é executável?", "Não propus correção antes da hora?"],
 check_en:["Did I consider a real bug?", "Is every confirmation step actionable?", "Did I avoid proposing a fix too early?"],
 rev:"Confirme a causa com evidência (trace, log) antes de mudar código.", rev_en:"Confirm the cause with evidence (trace, log) before changing code."},

{id:"flaky", c:"Depuração", n:"Intermediário",
 t:"Teste instável (flaky)", t_en:"Flaky test",
 d:"Causas prováveis de instabilidade e como reproduzir de forma confiável.", d_en:"Likely causes of flakiness and how to reproduce reliably.",
 quando:"Quando o teste às vezes passa, às vezes falha.", quando_en:"When the test sometimes passes and sometimes fails.",
 obj:"Você é um especialista em testes instáveis. Objetivo: encontrar a causa da instabilidade no código do teste e torná-la reproduzível, para corrigir de verdade em vez de esconder com retry.",
 obj_en:"You are a flaky test specialist. Goal: find the cause of flakiness in the test code and make it reproducible, to truly fix it instead of hiding it with retries.",
 antes:["Cole o teste.", "Com que frequência falha (ex.: 3 de cada 20) e em qual ambiente?", "Cole o erro, o trace ou o log das falhas, se tiver."],
 antes_en:["Paste the test.", "How often does it fail (e.g., 3 out of 20) and in which environment?", "Paste the error, trace or log from failures, if available."],
 passos:["Procure no código causas típicas: espera insuficiente, dados compartilhados, ordem de execução, dependência externa, animação, horário e fuso, aleatoriedade.",
   "Para cada causa encontrada, aponte o trecho exato.", "Diga como reproduzir de forma confiável (repeat-each, rede lenta, rodar em paralelo, mudar o fuso).",
   "Proponha a correção; retry não conta como correção."],
 passos_en:["Look in the code for typical causes: insufficient waiting, shared data, run order, external dependency, animation, time and time zone, randomness.",
   "For each cause found, point to the exact excerpt.", "Say how to reproduce it reliably (repeat-each, slow network, run in parallel, change time zone).",
   "Propose the fix; retry doesn't count as a fix."],
 ex:`| Causa | Trecho | Como reproduzir | Correção |
|---|---|---|---|
| Lê a lista antes de a API responder | expect(await linhas.count()).toBe(3) | --repeat-each=30 com rede lenta | await expect(linhas).toHaveCount(3) |`,
 ex_en:`| Cause | Excerpt | How to reproduce | Fix |
|---|---|---|---|
| Reads the list before the API responds | expect(await rows.count()).toBe(3) | --repeat-each=30 with slow network | await expect(rows).toHaveCount(3) |`,
 saida:["Tabela: Causa | Trecho | Como reproduzir | Correção"],
 saida_en:["Table: Cause | Excerpt | How to reproduce | Fix"],
 check:["Toda causa aponta um trecho real?", "Nenhuma correção é retry?"],
 check_en:["Does every cause point to a real excerpt?", "Is no fix a retry?"],
 rev:"Só feche quando a causa for removida e o teste passar 20 vezes seguidas.", rev_en:"Close it only when the cause is removed and the test passes 20 times in a row."},

/* ================= CI/CD ================= */
{id:"workflow-actions", c:"CI/CD", n:"Intermediário",
 t:"Workflow de testes no GitHub Actions", t_en:"Test workflow on GitHub Actions",
 d:"Roda a suíte a cada pull request e publica o relatório.", d_en:"Runs the suite on every pull request and publishes the report.",
 quando:"Para colocar os testes do portfólio no pipeline.", quando_en:"To put your portfolio tests in a pipeline.",
 obj:"Você é um engenheiro de CI/CD. Objetivo: escrever um workflow do GitHub Actions que rode os testes a cada mudança, seja rápido e deixe o relatório disponível mesmo quando falhar.",
 obj_en:"You are a CI/CD engineer. Goal: write a GitHub Actions workflow that runs the tests on every change, is fast and keeps the report available even when it fails.",
 antes:["Qual linguagem e framework de teste (ex.: Node + Playwright)?", "Qual o comando para instalar e rodar os testes?", "Quanto tempo a suíte leva hoje? Precisa de segredos (tokens, URLs)?"],
 antes_en:["Which language and test framework (e.g., Node + Playwright)?", "What's the command to install and run tests?", "How long does the suite take today? Does it need secrets (tokens, URLs)?"],
 passos:["Disparar em pull_request e push na main.", "Usar as actions oficiais com versão fixa e cache de dependências.",
   "Publicar o relatório como artefato com if: always().", "Se a suíte passar de 10 minutos, dividir em shards com matrix.",
   "Ler segredos de secrets; nunca escrever valores no arquivo.", "Comentar só os blocos que não são óbvios."],
 passos_en:["Trigger on pull_request and push to main.", "Use official actions pinned to a version, with dependency caching.",
   "Upload the report as an artifact with if: always().", "If the suite takes over 10 minutes, split into shards with a matrix.",
   "Read secrets from secrets; never write values in the file.", "Comment only non-obvious blocks."],
 ex:`- name: Publicar relatório
  if: \${{ always() }}
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 14`,
 ex_en:`- name: Upload report
  if: \${{ always() }}
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 14`,
 saida:["O YAML completo do workflow", "Uma linha dizendo quais secrets cadastrar"],
 saida_en:["The complete workflow YAML", "One line saying which secrets to create"],
 check:["O relatório sobe mesmo com falha?", "Nenhum segredo no arquivo?", "As versões das actions estão fixas?"],
 check_en:["Does the report upload even on failure?", "No secrets in the file?", "Are action versions pinned?"],
 rev:"Confira as versões das actions usadas; prefira as oficiais.", rev_en:"Check the action versions used; prefer official ones."},

{id:"pipeline-falhou", c:"CI/CD", n:"Intermediário",
 t:"Por que o pipeline falhou?", t_en:"Why did the pipeline fail?",
 d:"Lê o log do CI e separa falha do teste, do ambiente e do próprio pipeline.", d_en:"Reads the CI log and separates test, environment and pipeline failures.",
 quando:"Quando o job fica vermelho e o log é enorme.", quando_en:"When the job turns red and the log is huge.",
 obj:"Você é um engenheiro de CI/CD que diagnostica falhas de pipeline. Objetivo: dizer, a partir do log, se a falha é do teste, do ambiente ou do pipeline, e qual o próximo passo.",
 obj_en:"You are a CI/CD engineer who diagnoses pipeline failures. Goal: say, from the log, whether the failure comes from the test, the environment or the pipeline, and what the next step is.",
 antes:["Cole o trecho do log a partir do primeiro erro (não só o final).", "Cole o YAML do job, se tiver.", "Esse job passava antes? O que mudou?"],
 antes_en:["Paste the log excerpt starting at the first error (not just the end).", "Paste the job YAML, if available.", "Did this job pass before? What changed?"],
 passos:["Encontre o primeiro erro real (não o último efeito em cascata).",
   "Classifique: teste (bug ou teste quebrado), ambiente (rede, serviço fora, dado) ou pipeline (configuração, versão, permissão, cache).",
   "Cite a linha do log que comprova a classificação.", "Diga a causa provável em até 2 frases e o próximo passo para confirmar.",
   "Se a causa estiver clara, mostre a correção."],
 passos_en:["Find the first real error (not the last cascading effect).",
   "Classify: test (bug or broken test), environment (network, service down, data) or pipeline (config, version, permission, cache).",
   "Quote the log line that proves the classification.", "State the likely cause in up to 2 sentences and the next step to confirm.",
   "If the cause is clear, show the fix."],
 ex:`Tipo: pipeline.
Linha: "Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium-1140"
Causa provável: a versão do @playwright/test mudou, mas os navegadores do cache são da versão antiga.
Correção: rodar "npx playwright install --with-deps" depois do npm ci, ou usar a chave de cache com a versão do Playwright.`,
 ex_en:`Type: pipeline.
Line: "Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium-1140"
Likely cause: @playwright/test version changed but cached browsers are from the old version.
Fix: run "npx playwright install --with-deps" after npm ci, or key the cache on the Playwright version.`,
 saida:["Tipo de falha e linha do log", "Causa provável (até 2 frases)", "Próximo passo", "Correção, se clara"],
 saida_en:["Failure type and log line", "Likely cause (up to 2 sentences)", "Next step", "Fix, if clear"],
 check:["Usei o primeiro erro, não o último?", "A classificação tem evidência no log?"],
 check_en:["Did I use the first error, not the last?", "Does the classification have log evidence?"],
 rev:"Antes de rodar de novo, confirme se a falha não é um bug real.", rev_en:"Before re-running, make sure the failure isn't a real bug."},

{id:"docker-compose-teste", c:"CI/CD", n:"Intermediário",
 t:"Ambiente de teste com Docker Compose", t_en:"Test environment with Docker Compose",
 d:"Sobe aplicação, banco e dependências com um comando.", d_en:"Starts the app, database and dependencies with one command.",
 quando:"Quando montar o ambiente de teste leva mais tempo que testar.", quando_en:"When setting up the test environment takes longer than testing.",
 obj:"Você é um engenheiro de DevOps focado em ambientes de teste. Objetivo: um docker-compose.yml que suba tudo o que os testes precisam com um comando, de forma reproduzível.",
 obj_en:"You are a DevOps engineer focused on test environments. Goal: a docker-compose.yml that starts everything tests need with one command, reproducibly.",
 antes:["Quais serviços (API, banco, cache, fila, e-mail falso)? Há imagens prontas ou Dockerfile?", "Quais portas e variáveis de ambiente cada um precisa?", "Precisa carregar dados iniciais?"],
 antes_en:["Which services (API, database, cache, queue, fake e-mail)? Are there ready images or a Dockerfile?", "Which ports and environment variables does each need?", "Do you need to load seed data?"],
 passos:["Fixe a versão de cada imagem (nada de latest).", "Defina healthchecks e use depends_on com condition: service_healthy.",
   "Carregue dados iniciais automaticamente (pasta de init do banco ou serviço de seed).", "Use valores de teste nas variáveis; nada de senha real.",
   "Mostre os comandos para subir, ver logs e derrubar com limpeza de volumes."],
 passos_en:["Pin each image version (no latest).", "Define healthchecks and use depends_on with condition: service_healthy.",
   "Load seed data automatically (database init folder or a seed service).", "Use test values in variables; no real passwords.",
   "Show the commands to start, view logs and tear down including volumes."],
 ex:`  db:
    image: postgres:16.4
    environment:
      POSTGRES_PASSWORD: teste
    volumes:
      - ./seed:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10`,
 ex_en:`  db:
    image: postgres:16.4
    environment:
      POSTGRES_PASSWORD: test
    volumes:
      - ./seed:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10`,
 saida:["O docker-compose.yml completo", "Comandos: subir, logs, derrubar"],
 saida_en:["The complete docker-compose.yml", "Commands: up, logs, down"],
 check:["Toda imagem tem versão fixa?", "Os serviços dependentes esperam o healthcheck?"],
 check_en:["Does every image have a pinned version?", "Do dependent services wait for the healthcheck?"],
 rev:"Confira se as versões das imagens existem e não use senhas reais.", rev_en:"Check that the image versions exist and don't use real passwords."},

{id:"testcontainers", c:"CI/CD", n:"Avançado",
 t:"Testes de integração com Testcontainers", t_en:"Integration tests with Testcontainers",
 d:"Banco e serviços reais criados pelo próprio teste, isolados e descartáveis.", d_en:"Real databases and services created by the test itself, isolated and disposable.",
 quando:"Quando mocks não dão confiança e o ambiente compartilhado atrapalha.", quando_en:"When mocks don't give confidence and the shared environment gets in the way.",
 obj:"Você é um engenheiro de testes especialista em integração. Objetivo: escrever testes que sobem as dependências reais em containers descartáveis com Testcontainers, isolados e rodando igual no computador e no CI.",
 obj_en:"You are a test engineer specialized in integration. Goal: write tests that start real dependencies in disposable containers with Testcontainers, isolated and running the same locally and in CI.",
 antes:["Cole o código que precisa de teste de integração (repositório, serviço, query).", "Qual linguagem e qual dependência (PostgreSQL, Redis, Kafka...)?", "Como as migrations são aplicadas?"],
 antes_en:["Paste the code that needs integration testing (repository, service, query).", "Which language and dependency (PostgreSQL, Redis, Kafka...)?", "How are migrations applied?"],
 passos:["Suba um container por suíte (beforeAll) com versão de imagem fixa.", "Aplique as migrations antes dos testes.",
   "Limpe os dados entre testes (truncate ou transação).", "Passe a conexão do container para o código testado.",
   "Escreva os testes cobrindo sucesso e um erro de banco relevante (ex.: violação de UNIQUE).", "Diga em 2 linhas o que muda para rodar no CI."],
 passos_en:["Start one container per suite (beforeAll) with a pinned image version.", "Apply migrations before the tests.",
   "Clean data between tests (truncate or transaction).", "Pass the container connection to the code under test.",
   "Write tests covering success and a relevant database error (e.g., UNIQUE violation).", "Say in 2 lines what changes to run in CI."],
 ex:`let container: StartedPostgreSqlContainer;
beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:16.4').start();
  await migrar(container.getConnectionUri());
});
afterAll(() => container.stop());`,
 ex_en:`let container: StartedPostgreSqlContainer;
beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:16.4').start();
  await migrate(container.getConnectionUri());
});
afterAll(() => container.stop());`,
 saida:["Código completo dos testes", "2 linhas sobre o CI"],
 saida_en:["Complete test code", "2 lines about CI"],
 check:["A imagem tem versão fixa?", "Os dados são limpos entre testes?"],
 check_en:["Is the image version pinned?", "Is data cleaned between tests?"],
 rev:"Meça o tempo da suíte; se ficar lento, reutilize containers entre execuções locais.", rev_en:"Measure the suite time; if it gets slow, reuse containers between local runs."},

{id:"testes-banco", c:"CI/CD", n:"Intermediário",
 t:"Isolamento de dados em testes de banco", t_en:"Data isolation in database tests",
 d:"Transação por teste, banco por worker ou limpeza por tabela.", d_en:"Transaction per test, database per worker or per-table cleanup.",
 quando:"Quando testes passam sozinhos e falham juntos.", quando_en:"When tests pass alone and fail together.",
 obj:"Você é um engenheiro de testes. Objetivo: escolher a estratégia de isolamento de dados mais simples que faça os testes de banco passarem sozinhos, juntos e em paralelo.",
 obj_en:"You are a test engineer. Goal: choose the simplest data isolation strategy that makes database tests pass alone, together and in parallel.",
 antes:["Cole 2 ou 3 testes e como o banco é preparado hoje.", "Os testes rodam em paralelo? Qual framework e banco?"],
 antes_en:["Paste 2 or 3 tests and how the database is prepared today.", "Do tests run in parallel? Which framework and database?"],
 passos:["Identifique por que os testes interferem entre si.", "Compare 3 estratégias: transação com rollback por teste, banco ou schema por worker, limpeza por tabela.",
   "Escolha a mais simples que resolve, considerando paralelismo e código que abre transação própria.", "Mostre a configuração e um teste reescrito."],
 passos_en:["Identify why tests interfere with each other.", "Compare 3 strategies: transaction with rollback per test, database or schema per worker, per-table cleanup.",
   "Pick the simplest that works, considering parallelism and code that opens its own transactions.", "Show the configuration and one rewritten test."],
 ex:`Diagnóstico: dois testes inserem o cliente "ana@exemplo.com" e o segundo quebra no UNIQUE.
Escolha: schema por worker. Rollback não serve porque o serviço abre a própria transação.`,
 ex_en:`Diagnosis: two tests insert the customer "ann@example.com" and the second one breaks on UNIQUE.
Choice: schema per worker. Rollback won't work because the service opens its own transaction.`,
 saida:["Diagnóstico (até 2 frases)", "Estratégia escolhida e por quê (até 3 frases)", "Código da configuração", "Um teste reescrito"],
 saida_en:["Diagnosis (up to 2 sentences)", "Chosen strategy and why (up to 3 sentences)", "Configuration code", "One rewritten test"],
 check:["A estratégia funciona com paralelismo?", "Considerei transações abertas pelo próprio código?"],
 check_en:["Does the strategy work in parallel?", "Did I consider transactions opened by the code itself?"],
 rev:"Rode a suíte em paralelo depois da mudança para provar o isolamento.", rev_en:"Run the suite in parallel after the change to prove isolation."},

{id:"notas-release", c:"CI/CD", n:"Iniciante",
 t:"Notas de release para pessoas", t_en:"Release notes for people",
 d:"Transforma commits e tickets em notas que o usuário e o suporte entendem.", d_en:"Turns commits and tickets into notes users and support understand.",
 quando:"Antes de publicar uma versão.", quando_en:"Before publishing a version.",
 obj:"Você escreve notas de release claras. Objetivo: transformar commits e tickets em notas que o público escolhido entenda, destacando o que exige ação.",
 obj_en:"You write clear release notes. Goal: turn commits and tickets into notes the chosen audience understands, highlighting what requires action.",
 antes:["Cole os commits, PRs ou tickets da versão.", "Qual o número da versão e o público (usuários finais ou time de suporte)?"],
 antes_en:["Paste the version's commits, PRs or tickets.", "What's the version number and audience (end users or support team)?"],
 passos:["Agrupe em Novidades, Melhorias, Correções e Atenção (mudanças que exigem ação).", "Escreva cada item em linguagem do público, uma linha, pelo benefício.",
   "Ignore mudanças internas sem efeito para quem usa.", "Não detalhe correções de segurança a ponto de ensinar o ataque."],
 passos_en:["Group into New, Improved, Fixed and Heads-up (changes requiring action).", "Write each item in the audience's language, one line, by its benefit.",
   "Skip internal changes with no user effect.", "Don't detail security fixes to the point of teaching the attack."],
 ex:`Versão 2.4.0
Novidades
- Agora dá para pagar com Pix no checkout.
Correções
- O total do carrinho volta a atualizar quando você troca o CEP.
Atenção
- Quem usa a integração com o ERP precisa gerar uma nova chave de acesso.`,
 ex_en:`Version 2.4.0
New
- You can now pay with instant payments at checkout.
Fixed
- The cart total updates again when you change your ZIP code.
Heads-up
- ERP integration users need to generate a new access key.`,
 saida:["Título com a versão e as 4 seções; seções vazias não aparecem"],
 saida_en:["Title with the version and the 4 sections; empty sections are omitted"],
 check:["Sem jargão técnico?", "Ações necessárias estão em Atenção?"],
 check_en:["No technical jargon?", "Are required actions under Heads-up?"],
 rev:"Confira com o time se nenhuma correção sensível de segurança foi detalhada demais.", rev_en:"Check with the team that no sensitive security fix is described in too much detail."},

{id:"metricas-suite", c:"CI/CD", n:"Avançado",
 t:"Saúde da suíte no pipeline", t_en:"Suite health in the pipeline",
 d:"Métricas de duração, instabilidade e falhas para decidir onde investir.", d_en:"Duration, flakiness and failure metrics to decide where to invest.",
 quando:"Quando ninguém mais confia no vermelho do pipeline.", quando_en:"When nobody trusts a red pipeline anymore.",
 obj:"Você é um engenheiro de qualidade que analisa dados de execução de testes. Objetivo: mostrar onde a suíte está doente e quais 3 ações dão mais retorno, usando só os dados fornecidos.",
 obj_en:"You are a quality engineer who analyzes test run data. Goal: show where the suite is unhealthy and which 3 actions give the best return, using only the data provided.",
 antes:["Cole o histórico de execuções: data, duração, testes que falharam e se passaram no retry (CSV ou tabela).", "Quantas execuções por dia e qual o tempo aceitável?"],
 antes_en:["Paste the run history: date, duration, failed tests and whether they passed on retry (CSV or table).", "How many runs per day and what's an acceptable duration?"],
 passos:["Calcule a taxa de instabilidade (falhou e passou no retry ÷ execuções).", "Liste os 10 testes mais problemáticos por falhas e por instabilidade.",
   "Mostre a tendência da duração total.", "Proponha até 3 ações em ordem de retorno (ex.: corrigir os 3 mais instáveis reduz X% das falhas).",
   "Diga quando a amostra é pequena demais para concluir."],
 passos_en:["Compute the flakiness rate (failed and passed on retry ÷ runs).", "List the 10 most problematic tests by failures and by flakiness.",
   "Show the trend of total duration.", "Propose up to 3 actions in order of return (e.g., fixing the 3 flakiest cuts X% of failures).",
   "Say when the sample is too small to conclude."],
 ex:`| Teste | Falhas | Passou no retry | Duração média |
|---|---|---|---|
| checkout com Pix | 14 de 60 | 12 | 48 s |
Taxa de instabilidade da suíte: 6,5% (39 de 600 execuções de teste).
Ação 1: corrigir "checkout com Pix" elimina 31% das falhas instáveis.`,
 ex_en:`| Test | Failures | Passed on retry | Average duration |
|---|---|---|---|
| checkout with instant payment | 14 of 60 | 12 | 48 s |
Suite flakiness rate: 6.5% (39 of 600 test runs).
Action 1: fixing "checkout with instant payment" removes 31% of flaky failures.`,
 saida:["Tabela dos 10 testes", "Taxa de instabilidade e tendência", "Até 3 ações com o retorno estimado"],
 saida_en:["Table of the 10 tests", "Flakiness rate and trend", "Up to 3 actions with estimated return"],
 check:["As contas usam só os dados fornecidos?", "Avisei se a amostra é pequena?"],
 check_en:["Does the math use only the data provided?", "Did I warn if the sample is small?"],
 rev:"Repita a análise todo mês para ver se as ações funcionaram.", rev_en:"Repeat the analysis monthly to see whether the actions worked."}
);
