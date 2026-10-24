/* Jornada QA — Prompts: Casos de teste, Dados de teste, API e Mobile. (formato descrito em estudo-requisitos.js) */
(JQA.PROMPTS = JQA.PROMPTS || []).push(

/* ================= Casos de teste ================= */
{id:"tecnicas-teste", c:"Casos de teste", n:"Iniciante",
 t:"Casos de teste por técnica", t_en:"Test cases by design technique",
 d:"Partição, valor limite e tabela de decisão, com o que cortar se faltar tempo.", d_en:"Partitioning, boundary values and decision tables, plus what to cut if time is short.",
 quando:"Para desenhar casos com método, não no improviso.", quando_en:"To design cases with method, not improvisation.",
 obj:"Você é um QA sênior. Sua tarefa é desenhar casos de teste para uma regra ou funcionalidade usando técnicas formais (partição de equivalência, valor limite e tabela de decisão), para cobrir o máximo de risco com o mínimo de casos.",
 obj_en:"You are a senior QA engineer. Your task is to design test cases for a rule or feature using formal techniques (equivalence partitioning, boundary values and decision tables), to cover the most risk with the fewest cases.",
 antes:["Qual é a funcionalidade, campo ou formulário?", "Quais são as regras conhecidas (limites, obrigatoriedade, formatos, combinações)?", "Existe algo fora de escopo?"],
 antes_en:["Which feature, field or form is it?", "What are the known rules (limits, required fields, formats, combinations)?", "Is anything out of scope?"],
 passos:["Liste as entradas e, para cada uma, as partições válidas e inválidas.",
   "Para cada partição numérica ou de tamanho, identifique os limites (mínimo, mínimo-1, máximo, máximo+1).",
   "Se houver regras que se combinam, monte uma tabela de decisão.",
   "Gere os casos: um caso pode cobrir várias partições válidas, mas cada partição inválida tem o seu próprio caso.",
   "Use dados concretos e, se houver datas, calcule a partir da data de hoje.",
   "Remova casos que testam a mesma coisa.", "Marque com [SUPOSIÇÃO] toda regra que você deduziu e eu não informei."],
 passos_en:["List the inputs and, for each one, its valid and invalid partitions.",
   "For each numeric or length partition, identify the boundaries (minimum, minimum-1, maximum, maximum+1).",
   "If rules combine, build a decision table.",
   "Generate the cases: one case may cover several valid partitions, but each invalid partition gets its own case.",
   "Use concrete data and, for dates, compute from today's date.",
   "Remove cases that test the same thing.", "Mark with [ASSUMPTION] every rule you inferred that I didn't state."],
 ex:`Entrada: "Campo idade no cadastro. Aceita de 18 a 65 anos. Obrigatório."
| # | Técnica | Entrada | Resultado esperado |
|---|---|---|---|
| 1 | Valor limite | 18 | Aceita |
| 2 | Valor limite | 17 | Recusa: idade mínima é 18 |
| 3 | Valor limite | 65 | Aceita |
| 4 | Valor limite | 66 | Recusa: idade máxima é 65 |
| 5 | Partição inválida | vazio | Recusa: campo obrigatório |
| 6 | Partição inválida | "abc" | Recusa: só números [SUPOSIÇÃO] |`,
 ex_en:`Input: "Age field on sign-up. Accepts 18 to 65. Required."
| # | Technique | Input | Expected result |
|---|---|---|---|
| 1 | Boundary | 18 | Accepted |
| 2 | Boundary | 17 | Rejected: minimum age is 18 |
| 3 | Boundary | 65 | Accepted |
| 4 | Boundary | 66 | Rejected: maximum age is 65 |
| 5 | Invalid partition | empty | Rejected: required field |
| 6 | Invalid partition | "abc" | Rejected: numbers only [ASSUMPTION] |`,
 saida:["Tabela de partições: Entrada | Válidas | Inválidas", "Tabela de decisão, se houver regras combinadas", "Tabela de casos: # | Técnica | Entrada | Resultado esperado", "\"Se faltar tempo\": até 3 casos que podem sair e por quê (uma linha cada)"],
 saida_en:["Partition table: Input | Valid | Invalid", "Decision table, if rules combine", "Case table: # | Technique | Input | Expected result", "\"If short on time\": up to 3 cases that could go and why (one line each)"],
 check:["Todo limite tem o valor de dentro e o de fora?", "Cada partição inválida tem um caso próprio?", "Existe algum caso duplicado?", "As suposições estão marcadas?"],
 check_en:["Does every boundary have the inside and outside value?", "Does each invalid partition have its own case?", "Is any case duplicated?", "Are assumptions marked?"],
 rev:"Confira os limites e as datas calculadas; são os pontos onde a IA mais erra.", rev_en:"Double-check boundaries and computed dates; that's where AI errs most."},

{id:"casos-regressao", c:"Casos de teste", n:"Intermediário",
 t:"Suíte de regressão enxuta", t_en:"Lean regression suite",
 d:"Escolhe o mínimo de casos que protege o que mais importa numa release.", d_en:"Picks the minimum set of cases that protects what matters most in a release.",
 quando:"Quando o tempo de regressão não cabe na sprint.", quando_en:"When regression time doesn't fit the sprint.",
 obj:"Você é um QA sênior especialista em regressão baseada em risco. Objetivo: montar a menor suíte que ainda protege o que importa nesta release, com decisões que o time consiga defender.",
 obj_en:"You are a senior QA engineer specialized in risk-based regression. Goal: build the smallest suite that still protects what matters in this release, with decisions the team can defend.",
 antes:["Cole a lista de casos de teste atuais (título basta).", "O que mudou nesta release?", "Quanto tempo há para a regressão? Quais casos já são automatizados?"],
 antes_en:["Paste the current test case list (titles are enough).", "What changed in this release?", "How much time is there for regression? Which cases are already automated?"],
 passos:["Relacione cada caso às áreas tocadas pelas mudanças.", "Classifique cada caso: Manter (cobre área alterada ou crítica), Juntar (redundante com outro) ou Remover (sem risco nesta release).",
   "Mantenha sempre os fluxos críticos de negócio, mesmo sem mudança.", "Estime o tempo da suíte final e compare com o disponível.",
   "Indique os 5 casos que mais valem ser automatizados, por frequência de execução e risco."],
 passos_en:["Map each case to the areas touched by the changes.", "Classify each case: Keep (covers changed or critical area), Merge (redundant with another) or Drop (no risk in this release).",
   "Always keep critical business flows, even without changes.", "Estimate the final suite's time and compare with what's available.",
   "List the 5 cases most worth automating, by execution frequency and risk."],
 ex:`Mudança: novo cálculo de frete.
| Caso | Decisão | Motivo |
|---|---|---|
| Calcular frete para CEP do Norte | Manter | Área alterada, maior variação de preço |
| Calcular frete para CEP do Sudeste | Juntar com "frete para capital" | Mesma regra, mesma faixa |
| Alterar foto de perfil | Remover | Sem relação com a mudança nem risco crítico |`,
 ex_en:`Change: new shipping calculation.
| Case | Decision | Reason |
|---|---|---|
| Shipping for a remote-region ZIP | Keep | Changed area, highest price variation |
| Shipping for a metro-region ZIP | Merge with "shipping to capital city" | Same rule, same range |
| Change profile photo | Drop | Unrelated to the change and not critical |`,
 saida:["Tabela: Caso | Decisão | Motivo (até 12 palavras)", "Tempo estimado da suíte final", "Lista: 5 casos para automatizar primeiro"],
 saida_en:["Table: Case | Decision | Reason (up to 12 words)", "Estimated time of the final suite", "List: 5 cases to automate first"],
 check:["Os fluxos críticos continuam na suíte?", "Todo 'Remover' tem motivo de risco?"],
 check_en:["Are critical flows still in the suite?", "Does every 'Drop' have a risk reason?"],
 rev:"Não corte casos ligados a incidentes passados sem conversar com o time.", rev_en:"Don't drop cases tied to past incidents without talking to the team."},

/* ================= Dados de teste ================= */
{id:"massa-sintetica", c:"Dados de teste", n:"Iniciante",
 t:"Massa de dados sintética", t_en:"Synthetic test data",
 d:"Registros fictícios cobrindo limites, vazios, acentos e caracteres especiais.", d_en:"Fake records covering boundaries, empty values, accents and special characters.",
 quando:"Para preencher formulários e APIs sem usar dados reais.", quando_en:"To fill forms and APIs without using real data.",
 obj:"Você é um QA especialista em dados de teste. Objetivo: gerar uma massa fictícia que exercite as regras do schema, incluindo os casos que costumam quebrar sistemas, sem nenhum dado real.",
 obj_en:"You are a QA engineer specialized in test data. Goal: generate fake data that exercises the schema rules, including the cases that usually break systems, with no real data.",
 antes:["Cole o schema ou descreva os campos, tipos e regras.", "Quantos registros você precisa e em qual formato (JSON, CSV, SQL)?"],
 antes_en:["Paste the schema or describe the fields, types and rules.", "How many records do you need and in which format (JSON, CSV, SQL)?"],
 passos:["Para cada campo, liste os tipos de valor a cobrir: típico, mínimo, máximo, vazio, texto longo, acentos, emoji, caracteres especiais e injeção simples (aspas, <script>).",
   "Distribua esses casos entre os registros, um caso principal por registro.", "Use só dados fictícios; documentos com dígito verificador válido apenas quando a regra exigir.",
   "Inclua em cada registro um campo _caso dizendo o que ele cobre."],
 passos_en:["For each field, list the kinds of value to cover: typical, minimum, maximum, empty, long text, accents, emoji, special characters and simple injection (quotes, <script>).",
   "Spread these cases across records, one main case per record.", "Use fake data only; IDs with valid check digits only when the rule requires it.",
   "Add a _case field to each record saying what it covers."],
 ex:`[
  {"_caso": "nome no limite mínimo (3)", "nome": "Ana", "email": "ana.teste@exemplo.com"},
  {"_caso": "nome com acento e apóstrofo", "nome": "João D'Ávila", "email": "joao.teste@exemplo.com"},
  {"_caso": "e-mail com subendereço", "nome": "Bia Souza", "email": "bia+teste@exemplo.com"}
]`,
 ex_en:`[
  {"_case": "name at minimum length (3)", "name": "Ann", "email": "ann.test@example.com"},
  {"_case": "name with accent and apostrophe", "name": "Zoë O'Brien", "email": "zoe.test@example.com"},
  {"_case": "e-mail with plus addressing", "name": "Bea Smith", "email": "bea+test@example.com"}
]`,
 saida:["Só os dados no formato pedido", "Domínios de e-mail sempre exemplo.com ou example.com"],
 saida_en:["Only the data in the requested format", "E-mail domains always example.com"],
 check:["Todo registro tem _caso?", "Nenhum dado parece real?", "Os limites do schema foram exercitados?"],
 check_en:["Does every record have _case?", "Does no data look real?", "Were the schema limits exercised?"],
 rev:"Confira se nenhum dado parece real (CPF, e-mail, telefone).", rev_en:"Make sure no data looks real (IDs, e-mails, phone numbers)."},

{id:"faker-builder", c:"Dados de teste", n:"Intermediário",
 t:"Builder de dados com Faker", t_en:"Test data builder with Faker",
 d:"Função que gera objetos válidos com padrões e permite sobrescrever campos.", d_en:"A function that builds valid objects with defaults and allows overriding fields.",
 quando:"Quando os testes repetem a mesma montagem de dados.", quando_en:"When tests keep repeating the same data setup.",
 obj:"Você é um engenheiro de automação de testes. Objetivo: criar um builder de dados de teste em TypeScript com @faker-js/faker que produza objetos sempre válidos, fáceis de variar e reproduzíveis.",
 obj_en:"You are a test automation engineer. Goal: create a TypeScript test data builder with @faker-js/faker that produces always-valid objects that are easy to vary and reproducible.",
 antes:["Descreva a entidade: campos, tipos e regras de negócio.", "Quais variações os testes mais usam (ex.: admin, bloqueado, sem e-mail)?"],
 antes_en:["Describe the entity: fields, types and business rules.", "Which variations do tests use most (e.g., admin, blocked, no e-mail)?"],
 passos:["Defina o tipo TypeScript da entidade.", "Crie build(overrides) que gera valores padrão válidos e aplica as sobrescritas.",
   "Respeite as regras de negócio nos padrões (ex.: data de nascimento que dá 18 anos ou mais).", "Crie funções para as variações pedidas, reaproveitando build.",
   "Permita fixar a seed do Faker para reproduzir falhas.", "Mostre 3 exemplos de uso num teste."],
 passos_en:["Define the entity's TypeScript type.", "Create build(overrides) that generates valid defaults and applies the overrides.",
   "Respect business rules in the defaults (e.g., a birth date giving age 18 or more).", "Create functions for the requested variations, reusing build.",
   "Allow fixing Faker's seed to reproduce failures.", "Show 3 usage examples in a test."],
 ex:`export function buildUser(overrides: Partial<User> = {}): User {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email({ provider: 'example.com' }),
    role: 'customer',
    ...overrides,
  };
}
export const buildAdmin = (o: Partial<User> = {}) => buildUser({ role: 'admin', ...o });`,
 ex_en:`export function buildUser(overrides: Partial<User> = {}): User {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email({ provider: 'example.com' }),
    role: 'customer',
    ...overrides,
  };
}
export const buildAdmin = (o: Partial<User> = {}) => buildUser({ role: 'admin', ...o });`,
 saida:["Arquivo TypeScript completo", "3 exemplos de uso", "Comentários só onde a regra de negócio não é óbvia"],
 saida_en:["Complete TypeScript file", "3 usage examples", "Comments only where the business rule isn't obvious"],
 check:["Os padrões respeitam as regras de negócio?", "Qualquer campo pode ser sobrescrito?", "Os e-mails usam domínio de exemplo?"],
 check_en:["Do defaults respect the business rules?", "Can any field be overridden?", "Do e-mails use an example domain?"],
 rev:"Rode o builder várias vezes: dado aleatório às vezes viola regra de negócio.", rev_en:"Run the builder many times: random data sometimes breaks business rules."},

{id:"seed-banco", c:"Dados de teste", n:"Intermediário",
 t:"Seed de banco de dados", t_en:"Database seed",
 d:"Script que popula o banco respeitando chaves estrangeiras e restrições.", d_en:"A script that populates the database respecting foreign keys and constraints.",
 quando:"Para ter um ambiente de teste com dados coerentes em segundos.", quando_en:"To get a test environment with consistent data in seconds.",
 obj:"Você é um engenheiro de dados de teste. Objetivo: escrever um script de seed que popule um banco de teste com dados coerentes, respeitando todas as restrições, e que possa rodar quantas vezes for preciso.",
 obj_en:"You are a test data engineer. Goal: write a seed script that fills a test database with consistent data, respecting every constraint, and that can run as many times as needed.",
 antes:["Cole o DDL das tabelas (CREATE TABLE).", "Qual banco (PostgreSQL, MySQL...) e qual formato (SQL puro ou linguagem)?", "Quantos registros por tabela?"],
 antes_en:["Paste the table DDL (CREATE TABLE).", "Which database (PostgreSQL, MySQL...) and which format (plain SQL or a language)?", "How many records per table?"],
 passos:["Ordene as tabelas pelas dependências de chave estrangeira.", "Gere dados que respeitem UNIQUE, NOT NULL e CHECK.",
   "Inclua casos de borda úteis: registro sem filhos, status raros, datas no limite, textos com acento.", "Torne o script idempotente (limpar antes ou usar ON CONFLICT).",
   "Use só dados fictícios.", "Liste os casos de borda incluídos."],
 passos_en:["Order tables by foreign key dependencies.", "Generate data that respects UNIQUE, NOT NULL and CHECK.",
   "Include useful edge cases: record without children, rare statuses, boundary dates, accented text.", "Make the script idempotent (clean first or use ON CONFLICT).",
   "Use fake data only.", "List the edge cases included."],
 ex:`TRUNCATE pedidos, clientes RESTART IDENTITY CASCADE;
INSERT INTO clientes (id, nome, email) VALUES
  (1, 'Ana Teste', 'ana@exemplo.com'),
  (2, 'Cliente Sem Pedidos', 'sem.pedidos@exemplo.com'); -- borda: cliente sem filhos
INSERT INTO pedidos (id, cliente_id, total, status) VALUES
  (1, 1, 150.00, 'pago'),
  (2, 1, 0.01, 'estornado'); -- borda: menor valor e status raro`,
 ex_en:`TRUNCATE orders, customers RESTART IDENTITY CASCADE;
INSERT INTO customers (id, name, email) VALUES
  (1, 'Ann Test', 'ann@example.com'),
  (2, 'Customer No Orders', 'no.orders@example.com'); -- edge: customer without children
INSERT INTO orders (id, customer_id, total, status) VALUES
  (1, 1, 150.00, 'paid'),
  (2, 1, 0.01, 'refunded'); -- edge: smallest amount and rare status`,
 saida:["O script completo", "Lista curta dos casos de borda incluídos"],
 saida_en:["The complete script", "Short list of the edge cases included"],
 check:["A ordem respeita as chaves estrangeiras?", "Roda duas vezes sem erro?", "Há casos de borda?"],
 check_en:["Does the order respect foreign keys?", "Does it run twice without error?", "Are there edge cases?"],
 rev:"Rode só em banco de teste e confira as contagens depois.", rev_en:"Run only against a test database and check the counts afterwards."},

{id:"test-doubles", c:"Dados de teste", n:"Intermediário",
 t:"Mock, stub, spy ou fake?", t_en:"Mock, stub, spy or fake?",
 d:"Escolhe o dublê de teste certo para isolar uma dependência e escreve o código.", d_en:"Picks the right test double to isolate a dependency and writes the code.",
 quando:"Quando um teste depende de serviço externo, relógio ou banco.", quando_en:"When a test depends on an external service, the clock or a database.",
 obj:"Você é um engenheiro de testes especialista em isolamento. Objetivo: escolher o dublê de teste certo (mock, stub, spy ou fake) para isolar uma dependência e escrever o teste, deixando claro o risco que o dublê esconde.",
 obj_en:"You are a test engineer specialized in isolation. Goal: pick the right test double (mock, stub, spy or fake) to isolate a dependency and write the test, making clear the risk the double hides.",
 antes:["Cole a função ou classe e a dependência que atrapalha o teste.", "Qual framework de teste (Jest, Vitest, pytest...)?", "O que você quer verificar: o resultado ou a interação com a dependência?"],
 antes_en:["Paste the function or class and the dependency getting in the way.", "Which test framework (Jest, Vitest, pytest...)?", "What do you want to verify: the result or the interaction with the dependency?"],
 passos:["Escolha o dublê: stub para controlar respostas, mock para verificar interações, spy para observar sem substituir, fake para uma implementação leve funcional.",
   "Justifique a escolha em até 3 frases.", "Escreva o teste isolando a dependência, com asserções sobre o que importa.",
   "Aponte o risco que o dublê esconde e qual teste de integração cobre esse risco."],
 passos_en:["Pick the double: stub to control responses, mock to verify interactions, spy to observe without replacing, fake for a lightweight working implementation.",
   "Justify the choice in up to 3 sentences.", "Write the test isolating the dependency, asserting what matters.",
   "Point out the risk the double hides and which integration test covers it."],
 ex:`Situação: calcularFrete() chama a API dos Correios.
Escolha: stub. Queremos controlar a resposta da API e verificar o cálculo, não a chamada.
Risco escondido: se a API mudar o formato da resposta, o teste continua passando.
Cobertura: um teste de contrato ou de integração diário contra o ambiente de homologação da API.`,
 ex_en:`Situation: calculateShipping() calls the carrier's API.
Choice: stub. We want to control the API response and check the calculation, not the call.
Hidden risk: if the API changes its response format, the test keeps passing.
Coverage: a daily contract or integration test against the API's staging environment.`,
 saida:["Escolha e justificativa (até 3 frases)", "Código do teste", "Risco escondido e teste que o cobre (1 frase cada)"],
 saida_en:["Choice and reasoning (up to 3 sentences)", "Test code", "Hidden risk and the test that covers it (1 sentence each)"],
 check:["O teste verifica comportamento, não detalhes de implementação?", "O risco escondido foi explicado?"],
 check_en:["Does the test check behavior, not implementation details?", "Was the hidden risk explained?"],
 rev:"Mock demais testa o mock, não o código. Mantenha ao menos um teste de integração real.", rev_en:"Too many mocks test the mock, not the code. Keep at least one real integration test."},

{id:"pairwise", c:"Dados de teste", n:"Intermediário",
 t:"Combinações com pairwise", t_en:"Combinations with pairwise",
 d:"Reduz centenas de combinações de parâmetros a um conjunto pequeno e eficaz.", d_en:"Reduces hundreds of parameter combinations to a small, effective set.",
 quando:"Quando há muitas opções combinadas (navegador, plano, forma de pagamento...).", quando_en:"When many options combine (browser, plan, payment method...).",
 obj:"Você é um QA especialista em teste combinatório. Objetivo: reduzir as combinações de parâmetros a um conjunto pairwise (todo par de valores aparece ao menos uma vez), respeitando combinações impossíveis.",
 obj_en:"You are a QA engineer specialized in combinatorial testing. Goal: reduce parameter combinations to a pairwise set (every pair of values appears at least once), respecting impossible combinations.",
 antes:["Liste os parâmetros e os valores de cada um.", "Há combinações impossíveis ou proibidas?", "Algum par precisa de cobertura extra por risco?"],
 antes_en:["List the parameters and their values.", "Are there impossible or forbidden combinations?", "Does any pair need extra coverage due to risk?"],
 passos:["Escreva o modelo no formato da ferramenta PICT, com as restrições.", "Gere as combinações pairwise.",
   "Confira que todo par de valores aparece pelo menos uma vez.", "Informe quantas combinações existem no total e quantas ficaram.",
   "Sugira 1 ou 2 combinações extras de alto risco, se houver."],
 passos_en:["Write the model in PICT tool format, with the constraints.", "Generate the pairwise combinations.",
   "Check every pair of values appears at least once.", "Report how many combinations exist in total and how many remain.",
   "Suggest 1 or 2 extra high-risk combinations, if any."],
 ex:`Navegador: Chrome, Firefox, Safari
Sistema: Windows, macOS
Pagamento: Cartão, Pix, Boleto
IF [Navegador] = "Safari" THEN [Sistema] = "macOS";
Total: 18 combinações (3 × 2 × 3). Válidas: 15. Pairwise: 9.`,
 ex_en:`Browser: Chrome, Firefox, Safari
OS: Windows, macOS
Payment: Card, Wallet, Invoice
IF [Browser] = "Safari" THEN [OS] = "macOS";
Total: 18 combinations (3 × 2 × 3). Valid: 15. Pairwise: 9.`,
 saida:["Bloco do modelo PICT", "Tabela com as combinações", "Total possível × total gerado", "Combinações extras de risco, se houver"],
 saida_en:["PICT model block", "Table with the combinations", "Total possible × total generated", "Extra risk combinations, if any"],
 check:["Nenhuma combinação proibida aparece?", "Todo par aparece ao menos uma vez?"],
 check_en:["Does no forbidden combination appear?", "Does every pair appear at least once?"],
 rev:"Rode o modelo no PICT de verdade; a IA pode deixar passar um par.", rev_en:"Run the model in the actual PICT tool; AI may miss a pair."},

{id:"sql-validar", c:"Dados de teste", n:"Intermediário",
 t:"Consultas SQL para validar um fluxo", t_en:"SQL queries to validate a flow",
 d:"Consultas que confirmam se uma funcionalidade gravou os dados certos.", d_en:"Queries that confirm a feature stored the right data.",
 quando:"Depois de executar um fluxo pela interface ou pela API.", quando_en:"After running a flow through the UI or the API.",
 obj:"Você é um QA que valida dados no banco. Objetivo: escrever consultas que provem que um fluxo gravou os dados certos, sem sobras nem duplicidades, usando apenas leitura.",
 obj_en:"You are a QA engineer who validates data in the database. Goal: write queries that prove a flow stored the right data, with no leftovers or duplicates, using read-only access.",
 antes:["Cole o DDL ou descreva as tabelas envolvidas.", "Qual fluxo você executou e com quais dados (ids, e-mails, valores)?", "Qual banco (PostgreSQL, MySQL, SQL Server...)?"],
 antes_en:["Paste the DDL or describe the tables involved.", "Which flow did you run and with which data (ids, e-mails, amounts)?", "Which database (PostgreSQL, MySQL, SQL Server...)?"],
 passos:["Escreva uma consulta que confirme os registros esperados com os valores certos.", "Escreva uma consulta que encontre registros órfãos ou duplicados.",
   "Escreva uma consulta que confira os totais.", "Use só SELECT e filtre pelos dados do teste, nunca a tabela inteira.",
   "Diga em uma linha o que cada consulta prova e qual resultado indica sucesso."],
 passos_en:["Write a query that confirms the expected records with the right values.", "Write a query that finds orphan or duplicate records.",
   "Write a query that checks totals.", "Use SELECT only and filter by the test data, never the whole table.",
   "State in one line what each query proves and which result means success."],
 ex:`-- Prova: o pedido do teste foi gravado com o total certo. Sucesso: 1 linha, total = 150.00
SELECT p.id, p.total, p.status FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
WHERE c.email = 'ana.teste@exemplo.com' AND p.criado_em >= CURRENT_DATE;`,
 ex_en:`-- Proves: the test order was stored with the right total. Success: 1 row, total = 150.00
SELECT o.id, o.total, o.status FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE c.email = 'ann.test@example.com' AND o.created_at >= CURRENT_DATE;`,
 saida:["Para cada consulta: o que prova, resultado de sucesso e o bloco SQL"],
 saida_en:["For each query: what it proves, success result and the SQL block"],
 check:["Só SELECT?", "Todas filtram pelos dados do teste?"],
 check_en:["SELECT only?", "Do all filter by the test data?"],
 rev:"Rode só em ambiente de teste e confira os nomes reais das colunas.", rev_en:"Run only in a test environment and check the actual column names."},

/* ================= API ================= */
{id:"api-colecao", c:"API", n:"Iniciante",
 t:"Coleção de API a partir do Swagger", t_en:"API collection from Swagger",
 d:"Roteiro de uma coleção com fluxo encadeado, variáveis e asserções.", d_en:"Collection outline with a chained flow, variables and assertions.",
 quando:"Ao começar os testes de uma API documentada.", quando_en:"When starting to test a documented API.",
 obj:"Você é um QA de API. Objetivo: transformar a documentação OpenAPI num roteiro de coleção de testes (Postman, Bruno ou Insomnia) com fluxo completo, variáveis e asserções.",
 obj_en:"You are an API QA engineer. Goal: turn the OpenAPI documentation into a test collection outline (Postman, Bruno or Insomnia) with a full flow, variables and assertions.",
 antes:["Cole o trecho do OpenAPI/Swagger (ou o link, se eu puder acessar).", "Qual ferramenta você usa: Postman, Bruno ou Insomnia?", "Como funciona a autenticação?"],
 antes_en:["Paste the OpenAPI/Swagger excerpt (or the link, if I can access it).", "Which tool do you use: Postman, Bruno or Insomnia?", "How does authentication work?"],
 passos:["Monte o fluxo completo de um recurso: criar, consultar, alterar, apagar.", "Defina as variáveis que passam de uma requisição para outra (token, ids).",
   "Para cada requisição, escreva as asserções de status, corpo (campos e tipos) e tempo.", "Para cada recurso, até 3 cenários negativos com o status esperado.",
   "Use só o que está no contrato; marque com [SUPOSIÇÃO] o resto."],
 passos_en:["Build the full flow for a resource: create, read, update, delete.", "Define the variables passed between requests (token, ids).",
   "For each request, write status, body (fields and types) and time assertions.", "For each resource, up to 3 negative scenarios with the expected status.",
   "Use only what is in the contract; mark the rest [ASSUMPTION]."],
 ex:`| Ordem | Requisição | Salva | Asserções |
|---|---|---|---|
| 1 | POST /login | token | 200; corpo tem "authorization" |
| 2 | POST /produtos | produtoId | 201; "_id" é texto; tempo < 800 ms |
| 3 | GET /produtos/{{produtoId}} | — | 200; "nome" igual ao enviado |
Negativo: POST /produtos sem token → 401.`,
 ex_en:`| Order | Request | Saves | Assertions |
|---|---|---|---|
| 1 | POST /login | token | 200; body has "authorization" |
| 2 | POST /products | productId | 201; "_id" is a string; time < 800 ms |
| 3 | GET /products/{{productId}} | — | 200; "name" matches what was sent |
Negative: POST /products without token → 401.`,
 saida:["Tabela do fluxo: Ordem | Requisição | Variáveis salvas | Asserções", "Tabela de negativos: Requisição | Status esperado | Risco coberto"],
 saida_en:["Flow table: Order | Request | Saved variables | Assertions", "Negative table: Request | Expected status | Risk covered"],
 check:["O fluxo roda do início ao fim sem edição manual?", "Todo recurso tem cenários negativos?"],
 check_en:["Does the flow run end to end without manual edits?", "Does every resource have negative scenarios?"],
 rev:"Rode cada requisição de verdade; o contrato pode estar desatualizado.", rev_en:"Actually run each request; the contract may be out of date."},

{id:"api-negativos", c:"API", n:"Intermediário",
 t:"Testes negativos e de autorização", t_en:"Negative and authorization tests",
 d:"Validação, autenticação, IDOR e mass assignment para um endpoint.", d_en:"Validation, authentication, IDOR and mass assignment for one endpoint.",
 quando:"Para ir além do caminho feliz numa API.", quando_en:"To go beyond the happy path on an API.",
 obj:"Você é um QA de API com foco em segurança. Objetivo: listar os testes negativos e de autorização que mais encontram problemas reais num endpoint, cada um ligado ao risco que cobre.",
 obj_en:"You are an API QA engineer focused on security. Goal: list the negative and authorization tests that most often find real problems in an endpoint, each tied to the risk it covers.",
 antes:["Qual o método e a rota?", "Como é a autenticação e quais papéis de usuário existem?", "Cole um payload e uma resposta de exemplo (sem tokens reais)."],
 antes_en:["Which method and route?", "How does authentication work and which user roles exist?", "Paste a sample payload and response (no real tokens)."],
 passos:["Validação: tipos errados, campos obrigatórios ausentes, tamanhos e valores nos limites.",
   "Autenticação: token ausente, inválido, expirado e de outro ambiente.",
   "Autorização: acessar ou alterar recurso de outro usuário (IDOR/BOLA) e ação de papel sem permissão.",
   "Mass assignment: enviar campos que o usuário não deveria controlar (role, preco, ownerId).",
   "Para cada teste, defina o status esperado e um sinal de vazamento (dados no corpo do erro, por exemplo)."],
 passos_en:["Validation: wrong types, missing required fields, sizes and boundary values.",
   "Authentication: missing, invalid, expired and other-environment tokens.",
   "Authorization: reading or changing another user's resource (IDOR/BOLA) and actions without the needed role.",
   "Mass assignment: sending fields the user shouldn't control (role, price, ownerId).",
   "For each test, define the expected status and a leak signal (e.g., data in the error body)."],
 ex:`| Teste | Requisição | Esperado | Risco |
|---|---|---|---|
| IDOR leitura | GET /pedidos/102 com token do usuário A (pedido é do B) | 403 ou 404, sem dados no corpo | Vazamento de pedido alheio |
| Mass assignment | PUT /usuarios/me com {"role":"admin"} | 200 ignorando role, ou 400 | Escalada de privilégio |`,
 ex_en:`| Test | Request | Expected | Risk |
|---|---|---|---|
| IDOR read | GET /orders/102 with user A's token (order belongs to B) | 403 or 404, no data in body | Leaking someone else's order |
| Mass assignment | PUT /users/me with {"role":"admin"} | 200 ignoring role, or 400 | Privilege escalation |`,
 saida:["Tabela com até 15 linhas: Teste | Requisição | Esperado | Risco"],
 saida_en:["Table with up to 15 rows: Test | Request | Expected | Risk"],
 check:["Há testes de autorização entre usuários?", "Há teste de mass assignment?", "Todo esperado diz o que não pode vir no corpo?"],
 check_en:["Are there cross-user authorization tests?", "Is there a mass assignment test?", "Does every expected result say what must not appear in the body?"],
 rev:"O status esperado depende do contrato da API; confira na documentação.", rev_en:"The expected status depends on the API contract; check the documentation."},

{id:"api-playwright", c:"API", n:"Intermediário",
 t:"Teste de API com Playwright", t_en:"API test with Playwright",
 d:"Testes com request context, dados próprios e limpeza.", d_en:"Tests with request context, their own data and cleanup.",
 quando:"Para automatizar um fluxo de API no mesmo projeto da UI.", quando_en:"To automate an API flow in the same project as the UI tests.",
 obj:"Você é um engenheiro de automação. Objetivo: escrever testes de API em TypeScript com o request do @playwright/test que sejam independentes, limpem os próprios dados e falhem com mensagens claras.",
 obj_en:"You are an automation engineer. Goal: write TypeScript API tests with @playwright/test's request that are independent, clean up their own data and fail with clear messages.",
 antes:["Descreva o fluxo e os endpoints (ou cole o OpenAPI).", "Como obter o token? Qual a URL base do ambiente de teste?"],
 antes_en:["Describe the flow and endpoints (or paste the OpenAPI).", "How is the token obtained? What's the test environment base URL?"],
 passos:["Leia URL base e credenciais de variáveis de ambiente.", "Crie os dados de cada teste via API e apague no fim (afterEach ou fixture).",
   "Valide status, campos obrigatórios e tipos da resposta.", "Inclua um teste negativo por endpoint.",
   "Nomeie os testes pelo comportamento esperado."],
 passos_en:["Read base URL and credentials from environment variables.", "Create each test's data via API and delete it at the end (afterEach or a fixture).",
   "Validate status, required fields and response types.", "Include one negative test per endpoint.",
   "Name tests after the expected behavior."],
 ex:`test('cria produto e retorna o id', async ({ request }) => {
  const res = await request.post('/produtos', { data: novoProduto(), headers: { Authorization: token } });
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(typeof body._id).toBe('string');
  criados.push(body._id); // apagado no afterEach
});`,
 ex_en:`test('creates a product and returns its id', async ({ request }) => {
  const res = await request.post('/products', { data: newProduct(), headers: { Authorization: token } });
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(typeof body._id).toBe('string');
  created.push(body._id); // deleted in afterEach
});`,
 saida:["Só o código, pronto para rodar"],
 saida_en:["Code only, ready to run"],
 check:["Nenhum segredo no código?", "Cada teste apaga o que criou?", "Há teste negativo por endpoint?"],
 check_en:["No secrets in the code?", "Does each test delete what it created?", "Is there a negative test per endpoint?"],
 rev:"Rode duas vezes seguidas: se a segunda falhar, a limpeza de dados não está certa.", rev_en:"Run it twice in a row: if the second run fails, cleanup is wrong."},

{id:"contrato-pact", c:"API", n:"Avançado",
 t:"Teste de contrato com Pact", t_en:"Contract test with Pact",
 d:"Contrato guiado pelo consumidor entre um front ou serviço e uma API.", d_en:"Consumer-driven contract between a front end or service and an API.",
 quando:"Quando times diferentes mudam o consumidor e o fornecedor.", quando_en:"When different teams change the consumer and the provider.",
 obj:"Você é um engenheiro de testes especialista em testes de contrato. Objetivo: escrever um contrato guiado pelo consumidor com Pact que proteja exatamente o que o consumidor usa, sem amarrar o fornecedor a detalhes irrelevantes.",
 obj_en:"You are a test engineer specialized in contract testing. Goal: write a consumer-driven Pact contract that protects exactly what the consumer uses, without tying the provider to irrelevant details.",
 antes:["Quem é o consumidor e qual API ele chama?", "Cole uma requisição e uma resposta reais que o consumidor usa.", "Em qual linguagem está o consumidor?"],
 antes_en:["Who is the consumer and which API does it call?", "Paste a real request and response the consumer uses.", "Which language is the consumer written in?"],
 passos:["Liste só os campos da resposta que o consumidor realmente lê.", "Use matchers por tipo (like, eachLike) e valores fixos só onde o valor importa para o negócio.",
   "Cubra a resposta de sucesso e um erro que o consumidor trata.", "Escreva o teste do consumidor que gera o contrato.",
   "Explique em 3 linhas como o fornecedor verifica o contrato no pipeline."],
 passos_en:["List only the response fields the consumer actually reads.", "Use type matchers (like, eachLike) and fixed values only where the value matters to the business.",
   "Cover the success response and one error the consumer handles.", "Write the consumer test that generates the contract.",
   "Explain in 3 lines how the provider verifies the contract in the pipeline."],
 ex:`willRespondWith: {
  status: 200,
  body: {
    id: like(42),
    status: term({ generate: 'pago', matcher: 'pago|pendente|cancelado' }),
    itens: eachLike({ sku: like('ABC-1'), quantidade: like(1) }),
  },
}`,
 ex_en:`willRespondWith: {
  status: 200,
  body: {
    id: like(42),
    status: term({ generate: 'paid', matcher: 'paid|pending|cancelled' }),
    items: eachLike({ sku: like('ABC-1'), quantity: like(1) }),
  },
}`,
 saida:["Código do teste do consumidor", "3 linhas sobre a verificação no fornecedor"],
 saida_en:["Consumer test code", "3 lines about provider verification"],
 check:["O contrato tem só campos que o consumidor usa?", "Valores fixos só onde importam?"],
 check_en:["Does the contract have only fields the consumer uses?", "Fixed values only where they matter?"],
 rev:"O contrato descreve o que o consumidor usa, não a API inteira; mantenha-o enxuto.", rev_en:"The contract describes what the consumer uses, not the whole API; keep it lean."},

/* ================= Mobile ================= */
{id:"matriz-dispositivos", c:"Mobile", n:"Intermediário",
 t:"Matriz de dispositivos por risco", t_en:"Risk-based device matrix",
 d:"Escolhe poucos dispositivos e versões que cobrem a maior parte dos usuários e riscos.", d_en:"Picks a few devices and versions that cover most users and risks.",
 quando:"Antes de uma rodada de testes mobile.", quando_en:"Before a mobile test round.",
 obj:"Você é um QA mobile. Objetivo: montar a menor matriz de dispositivos que cubra a maior parte dos usuários e os riscos técnicos do app, deixando claro o que fica de fora.",
 obj_en:"You are a mobile QA engineer. Goal: build the smallest device matrix that covers most users and the app's technical risks, making clear what is left out.",
 antes:["Você tem dados de uso (sistemas, versões e aparelhos mais usados)? Cole-os.", "Quais funcionalidades são críticas (câmera, pagamento, notificações, biometria)?", "Quantos aparelhos reais você tem e se usa nuvem de dispositivos."],
 antes_en:["Do you have usage data (most used OSs, versions and devices)? Paste it.", "Which features are critical (camera, payments, notifications, biometrics)?", "How many real devices do you have and do you use a device cloud?"],
 passos:["Cubra as versões de sistema que somam a maior parte dos usuários.", "Inclua tamanhos de tela extremos (menor e maior).",
   "Inclua ao menos um aparelho de entrada (pouca memória) e um recente.", "Garanta aparelho real para funções de hardware críticas.",
   "Limite a 8 combinações e explique o que ficou de fora."],
 passos_en:["Cover the OS versions that add up to most users.", "Include extreme screen sizes (smallest and largest).",
   "Include at least one low-end (little memory) and one recent device.", "Ensure a real device for critical hardware features.",
   "Cap at 8 combinations and explain what was left out."],
 ex:`| Dispositivo | Sistema | Por que entra | Tipo |
|---|---|---|---|
| Samsung Galaxy A15 | Android 14 | Aparelho de entrada mais comum entre os usuários | Real |
| iPhone SE (3ª geração) | iOS 17 | Menor tela iOS suportada | Nuvem |`,
 ex_en:`| Device | OS | Why it's in | Type |
|---|---|---|---|
| Samsung Galaxy A15 | Android 14 | Most common low-end device among users | Real |
| iPhone SE (3rd gen) | iOS 17 | Smallest supported iOS screen | Cloud |`,
 saida:["Tabela com até 8 linhas: Dispositivo | Sistema | Por que entra | Real, emulador ou nuvem", "Duas frases sobre o risco do que ficou de fora"],
 saida_en:["Table with up to 8 rows: Device | OS | Why it's in | Real, emulator or cloud", "Two sentences on the risk of what was left out"],
 check:["Há telas extremas e um aparelho de entrada?", "Funções de hardware estão em aparelho real?"],
 check_en:["Are there extreme screens and a low-end device?", "Are hardware features on real devices?"],
 rev:"Atualize a matriz com os dados reais de uso do app a cada trimestre.", rev_en:"Update the matrix with real app usage data every quarter."},

{id:"maestro-fluxo", c:"Mobile", n:"Intermediário",
 t:"Fluxo mobile com Maestro", t_en:"Mobile flow with Maestro",
 d:"Automatiza uma jornada do app em YAML, com esperas e verificações estáveis.", d_en:"Automates an app journey in YAML, with stable waits and checks.",
 quando:"Para automatizar a primeira jornada de um app.", quando_en:"To automate an app's first user journey.",
 obj:"Você é um engenheiro de automação mobile. Objetivo: escrever um fluxo Maestro em YAML para uma jornada do app, estável e fácil de manter.",
 obj_en:"You are a mobile automation engineer. Goal: write a Maestro YAML flow for an app journey that is stable and easy to maintain.",
 antes:["Qual o appId do app?", "Quais são os passos manuais da jornada?", "Qual o resultado esperado no fim?"],
 antes_en:["What is the app's appId?", "What are the journey's manual steps?", "What's the expected result at the end?"],
 passos:["Comece com launchApp e, se preciso, clearState.", "Selecione elementos por texto visível ou id de acessibilidade, nunca por coordenada.",
   "Use as esperas e asserções do Maestro (assertVisible, extendedWaitUntil), sem pausas fixas.",
   "Verifique o resultado esperado no fim.", "Mostre o comando para rodar."],
 passos_en:["Start with launchApp and, if needed, clearState.", "Select elements by visible text or accessibility id, never by coordinates.",
   "Use Maestro's waits and assertions (assertVisible, extendedWaitUntil), no fixed sleeps.",
   "Assert the expected result at the end.", "Show the command to run it."],
 ex:`appId: com.saucelabs.mydemoapp.rn
---
- launchApp:
    clearState: true
- tapOn: "Sauce Labs Backpack"
- tapOn: "Add To Cart"
- tapOn:
    id: "cart badge"
- assertVisible: "Proceed To Checkout"`,
 ex_en:`appId: com.saucelabs.mydemoapp.rn
---
- launchApp:
    clearState: true
- tapOn: "Sauce Labs Backpack"
- tapOn: "Add To Cart"
- tapOn:
    id: "cart badge"
- assertVisible: "Proceed To Checkout"`,
 saida:["O YAML completo", "O comando para rodar"],
 saida_en:["The complete YAML", "The command to run it"],
 check:["Nenhuma coordenada ou pausa fixa?", "O fluxo termina com uma asserção?"],
 check_en:["No coordinates or fixed sleeps?", "Does the flow end with an assertion?"],
 rev:"Confira os comandos na documentação do Maestro; a sintaxe muda entre versões.", rev_en:"Check the commands against the Maestro docs; syntax changes between versions."}
);
