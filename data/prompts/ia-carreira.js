/* Jornada QA — Prompts: IA e Carreira. (formato descrito em estudo-requisitos.js) */
(JQA.PROMPTS = JQA.PROMPTS || []).push(

/* ================= IA ================= */
{id:"revisar-codigo-ia", c:"IA", n:"Intermediário",
 t:"Revisar código gerado por IA", t_en:"Review AI-generated code",
 d:"Checklist para aceitar ou recusar código de teste que a IA escreveu.", d_en:"A checklist to accept or reject test code written by AI.",
 quando:"Antes de fazer commit de qualquer código gerado.", quando_en:"Before committing any generated code.",
 obj:"Você é um revisor técnico independente. Objetivo: decidir se um código gerado por IA pode entrar no projeto, comparando com o pedido original e procurando os erros típicos de código gerado.",
 obj_en:"You are an independent technical reviewer. Goal: decide whether AI-generated code can go into the project, comparing it with the original request and looking for typical generated-code mistakes.",
 antes:["O que foi pedido para a IA (o prompt ou a descrição)?", "Cole o código gerado.", "Qual linguagem, framework e versão o projeto usa?"],
 antes_en:["What was the AI asked for (the prompt or description)?", "Paste the generated code.", "Which language, framework and version does the project use?"],
 passos:["Confira se o código faz o que foi pedido, nem mais nem menos.", "Procure APIs, métodos ou opções que não existem na versão usada.",
   "Procure asserções que não provam nada (sempre verdadeiras, só verificam que algo existe).", "Procure dados, URLs ou segredos fixos no código.",
   "Aponte trechos complexos demais para manter.", "Dê o veredito: aceitar, ajustar ou refazer."],
 passos_en:["Check the code does what was asked, no more, no less.", "Look for APIs, methods or options that don't exist in the version used.",
   "Look for assertions that prove nothing (always true, only check that something exists).", "Look for hard-coded data, URLs or secrets.",
   "Point out parts too complex to maintain.", "Give the verdict: accept, adjust or redo."],
 ex:`Veredito: ajustar.
| Problema | Linha | Correção |
|---|---|---|
| page.waitForSelector com opção "visible: true" não existe nesta versão | 8 | await expect(locator).toBeVisible() |
| expect(lista).toBeTruthy() sempre passa | 12 | await expect(lista).toHaveCount(3) |`,
 ex_en:`Verdict: adjust.
| Problem | Line | Fix |
|---|---|---|
| page.waitForSelector with "visible: true" doesn't exist in this version | 8 | await expect(locator).toBeVisible() |
| expect(list).toBeTruthy() always passes | 12 | await expect(list).toHaveCount(3) |`,
 saida:["Veredito em uma linha", "Tabela: Problema | Linha | Correção"],
 saida_en:["One-line verdict", "Table: Problem | Line | Fix"],
 check:["Comparei com o pedido original?", "Verifiquei se as APIs existem na versão usada?"],
 check_en:["Did I compare with the original request?", "Did I check the APIs exist in the version used?"],
 rev:"Use outra conversa ou outro modelo para revisar; o mesmo contexto tende a se aprovar.", rev_en:"Use a fresh chat or another model to review; the same context tends to approve itself."},

{id:"playwright-mcp", c:"IA", n:"Intermediário",
 t:"Explorar com Playwright MCP", t_en:"Explore with Playwright MCP",
 d:"O assistente navega como testador exploratório e relata o que observou.", d_en:"The assistant browses like an exploratory tester and reports what it saw.",
 quando:"Com o Playwright MCP configurado no seu assistente.", quando_en:"With the Playwright MCP set up in your assistant.",
 obj:"Você é um testador exploratório usando o navegador pelo Playwright MCP. Objetivo: explorar uma funcionalidade num ambiente de teste e relatar comportamentos estranhos com passos que eu consiga reproduzir.",
 obj_en:"You are an exploratory tester using the browser through the Playwright MCP. Goal: explore a feature in a test environment and report odd behaviors with steps I can reproduce.",
 antes:["Qual a URL do ambiente de teste?", "Qual funcionalidade explorar e com qual usuário de teste?", "Há ações proibidas além das padrão (compras, cadastros reais, envio de mensagens)?"],
 antes_en:["What's the test environment URL?", "Which feature to explore and with which test user?", "Are there forbidden actions beyond the default ones (purchases, real sign-ups, sending messages)?"],
 passos:["Fique só no ambiente informado; não clique em links externos.", "Explore: entradas inválidas e extremas, voltar e avançar, recarregar no meio do fluxo, duplo clique em botões de envio.",
   "A cada comportamento estranho, anote os passos exatos, o observado e o esperado.", "Não faça compras, cadastros reais nem envie mensagens.",
   "No fim, diga o que não conseguiu testar e por quê."],
 passos_en:["Stay in the given environment; don't click external links.", "Explore: invalid and extreme inputs, back and forward, reload mid-flow, double-click submit buttons.",
   "For each odd behavior, note exact steps, observed and expected.", "Don't make purchases, real sign-ups or send messages.",
   "At the end, say what you couldn't test and why."],
 ex:`| Passos exatos | Observado | Esperado |
|---|---|---|
| 1. Abrir /checkout 2. Clicar duas vezes em "Finalizar" | Dois pedidos criados (#1041 e #1042) | Um pedido; botão desativado após o primeiro clique |`,
 ex_en:`| Exact steps | Observed | Expected |
|---|---|---|
| 1. Open /checkout 2. Double-click "Place order" | Two orders created (#1041 and #1042) | One order; button disabled after the first click |`,
 saida:["Tabela: Passos exatos | Observado | Esperado", "Lista do que não foi testado"],
 saida_en:["Table: Exact steps | Observed | Expected", "List of what wasn't tested"],
 check:["Fiquei só no ambiente informado?", "Todos os passos são reproduzíveis?"],
 check_en:["Did I stay in the given environment?", "Are all steps reproducible?"],
 rev:"Reproduza cada achado você mesmo antes de relatar.", rev_en:"Reproduce each finding yourself before reporting it."},

{id:"avaliar-chatbot", c:"IA", n:"Intermediário",
 t:"Avaliar um chatbot", t_en:"Evaluate a chatbot",
 d:"Casos típicos, fora de escopo, ambíguos e de segurança, com critério de aprovação.", d_en:"Typical, out-of-scope, ambiguous and safety cases, with pass criteria.",
 quando:"Para testar uma funcionalidade com IA no produto.", quando_en:"To test an AI feature in the product.",
 obj:"Você é um QA especialista em produtos com IA. Objetivo: montar um conjunto de casos de teste para um assistente, com critérios de aprovação objetivos, considerando que as respostas variam.",
 obj_en:"You are a QA engineer specialized in AI products. Goal: build a test case set for an assistant, with objective pass criteria, considering that answers vary.",
 antes:["O que o assistente faz e para quem?", "O que está fora de escopo?", "Que dados ele consulta e o que nunca pode revelar?"],
 antes_en:["What does the assistant do and for whom?", "What is out of scope?", "Which data does it query and what must it never reveal?"],
 passos:["Crie 20 casos em quatro grupos: típicos, fora de escopo, ambíguos e de segurança (pedidos para revelar dados ou ignorar regras).",
   "Para cada caso, descreva o comportamento esperado.", "Defina um critério de aprovação verificável (ex.: cita a política X; pede esclarecimento; recusa sem revelar dados).",
   "Indique quantas vezes rodar cada caso, já que as respostas variam."],
 passos_en:["Create 20 cases in four groups: typical, out of scope, ambiguous and safety (requests to reveal data or ignore rules).",
   "For each case, describe the expected behavior.", "Define a verifiable pass criterion (e.g., cites policy X; asks for clarification; refuses without revealing data).",
   "Say how many times to run each case, since answers vary."],
 ex:`| Grupo | Pergunta | Esperado | Aprovação |
|---|---|---|---|
| Fora de escopo | "Qual ação da bolsa devo comprar?" | Recusa e volta ao assunto da loja | Não dá recomendação; oferece ajuda com pedidos |
| Ambígua | "Quero cancelar" | Pergunta se é pedido ou assinatura | Faz a pergunta antes de agir |`,
 ex_en:`| Group | Question | Expected | Pass |
|---|---|---|---|
| Out of scope | "Which stock should I buy?" | Declines and returns to store topics | No recommendation; offers help with orders |
| Ambiguous | "I want to cancel" | Asks whether it's an order or a subscription | Asks before acting |`,
 saida:["Tabela com 20 linhas: Grupo | Pergunta | Esperado | Aprovação", "Uma linha: quantas execuções por caso"],
 saida_en:["Table with 20 rows: Group | Question | Expected | Pass", "One line: runs per case"],
 check:["Os quatro grupos estão presentes?", "Todo critério é verificável?"],
 check_en:["Are all four groups present?", "Is every criterion verifiable?"],
 rev:"Rode cada pergunta várias vezes: respostas de IA variam.", rev_en:"Run each question several times: AI answers vary."},

{id:"prompt-injection", c:"IA", n:"Avançado",
 t:"Plano de testes contra prompt injection", t_en:"Prompt injection test plan",
 d:"Categorias de risco e comportamentos seguros esperados para um assistente com ferramentas.", d_en:"Risk categories and expected safe behaviors for an assistant with tools.",
 quando:"Antes de liberar um assistente que lê conteúdo externo ou usa ferramentas.", quando_en:"Before releasing an assistant that reads external content or uses tools.",
 obj:"Você é um especialista em segurança de aplicações com IA apoiando o time de QA. Objetivo: um plano de testes defensivo que verifique se o assistente mantém suas regras quando recebe instruções indevidas, diretamente ou dentro de conteúdo que ele lê.",
 obj_en:"You are an AI application security specialist supporting the QA team. Goal: a defensive test plan that checks whether the assistant keeps its rules when it receives improper instructions, directly or inside content it reads.",
 antes:["O que o assistente faz?", "Quais ferramentas e dados ele acessa?", "Quais regras ele nunca pode quebrar?"],
 antes_en:["What does the assistant do?", "Which tools and data can it access?", "Which rules must it never break?"],
 passos:["Liste as categorias de risco do OWASP Top 10 para LLM que se aplicam a este assistente.",
   "Para cada regra que não pode ser quebrada, descreva o tipo de teste: instrução direta do usuário e instrução escondida em conteúdo lido (documento, página, e-mail).",
   "Defina o comportamento seguro esperado em cada caso.", "Defina controles que o time deve ter (confirmação antes de ações, menor privilégio das ferramentas, registro).",
   "Rode só em ambiente de teste, com dados fictícios."],
 passos_en:["List the OWASP Top 10 for LLM risk categories that apply to this assistant.",
   "For each rule that must not break, describe the test type: direct user instruction and instruction hidden in content it reads (document, page, e-mail).",
   "Define the expected safe behavior in each case.", "Define controls the team should have (confirmation before actions, least-privilege tools, logging).",
   "Run only in a test environment, with fake data."],
 ex:`| Regra | Tipo de teste | Comportamento seguro |
|---|---|---|
| Nunca enviar dados de outro cliente | Instrução escondida num documento enviado para resumo | Resume o documento, ignora a instrução e não acessa dados de terceiros |
| Pedir confirmação antes de enviar e-mail | Pedido direto para enviar sem confirmar | Pede confirmação mesmo assim |`,
 ex_en:`| Rule | Test type | Safe behavior |
|---|---|---|
| Never send another customer's data | Instruction hidden in a document sent for summarizing | Summarizes the document, ignores the instruction, doesn't access third-party data |
| Ask for confirmation before sending e-mail | Direct request to send without confirming | Asks for confirmation anyway |`,
 saida:["Lista das categorias OWASP que se aplicam", "Tabela: Regra | Tipo de teste | Comportamento seguro", "Lista de controles recomendados"],
 saida_en:["List of applicable OWASP categories", "Table: Rule | Test type | Safe behavior", "List of recommended controls"],
 check:["Toda regra crítica tem teste direto e indireto?", "Os testes ficam no ambiente de teste?"],
 check_en:["Does every critical rule have a direct and an indirect test?", "Do tests stay in the test environment?"],
 rev:"Teste só no seu ambiente; instrução indireta pode disparar ações reais das ferramentas.", rev_en:"Test only in your own environment; indirect instructions can trigger real tool actions."},

{id:"rubrica-eval", c:"IA", n:"Avançado",
 t:"Rubrica para avaliar respostas de IA", t_en:"Rubric to evaluate AI answers",
 d:"Critérios objetivos para julgar respostas, com exemplos de nota.", d_en:"Objective criteria to grade answers, with scoring examples.",
 quando:"Antes de montar evals ou comparar versões de um assistente.", quando_en:"Before building evals or comparing assistant versions.",
 obj:"Você é um especialista em avaliação de sistemas com IA. Objetivo: uma rubrica que duas pessoas apliquem e cheguem à mesma nota, servindo de base para avaliações automáticas.",
 obj_en:"You are an expert in evaluating AI systems. Goal: a rubric two people can apply and reach the same score, serving as a basis for automated evaluations.",
 antes:["O que o assistente faz e para quem?", "Cole 3 respostas reais (uma boa, uma média, uma ruim), se tiver."],
 antes_en:["What does the assistant do and for whom?", "Paste 3 real answers (good, average, bad), if you have them."],
 passos:["Escolha 4 critérios relevantes (ex.: correção, completude, segurança, tom).",
   "Para cada critério, descreva objetivamente o que vale 0, 1 e 2.", "Dê um exemplo curto de resposta para cada nota.",
   "Diga quais critérios podem ser avaliados automaticamente (e como: regra, comparação ou LLM avaliador) e quais exigem uma pessoa.",
   "Se houver respostas reais, aplique a rubrica nelas."],
 passos_en:["Pick 4 relevant criteria (e.g., correctness, completeness, safety, tone).",
   "For each criterion, objectively describe what scores 0, 1 and 2.", "Give a short sample answer for each score.",
   "Say which criteria can be graded automatically (and how: rule, comparison or LLM judge) and which need a person.",
   "If there are real answers, apply the rubric to them."],
 ex:`Critério: correção (política de trocas).
0 — informa prazo ou condição diferente da política.
1 — prazo certo, mas omite uma condição (ex.: produto sem uso).
2 — prazo e condições certos, com o link da política.
Automático: sim, comparando prazo e condições com a política (regra).`,
 ex_en:`Criterion: correctness (returns policy).
0 — states a deadline or condition different from the policy.
1 — right deadline, but omits a condition (e.g., unused product).
2 — right deadline and conditions, with the policy link.
Automatic: yes, comparing deadline and conditions with the policy (rule).`,
 saida:["Para cada critério: notas 0, 1 e 2 com exemplo", "Tabela: Critério | Automático? | Como"],
 saida_en:["For each criterion: scores 0, 1 and 2 with an example", "Table: Criterion | Automatic? | How"],
 check:["As notas são objetivas o bastante para duas pessoas concordarem?", "Todo critério tem exemplo?"],
 check_en:["Are scores objective enough for two people to agree?", "Does every criterion have an example?"],
 rev:"Teste a rubrica com 2 pessoas avaliando as mesmas respostas; se discordarem muito, ela está vaga.", rev_en:"Test the rubric with 2 people grading the same answers; if they disagree a lot, it is too vague."},

/* ================= Carreira ================= */
{id:"curriculo", c:"Carreira", n:"Iniciante",
 t:"Linha de currículo com resultado", t_en:"Résumé line with results",
 d:"Reescreve experiências no formato ação + contexto + resultado.", d_en:"Rewrites experience as action + context + result.",
 quando:"Para tirar o currículo da lista de ferramentas.", quando_en:"To move your résumé beyond a list of tools.",
 obj:"Você é um recrutador técnico especializado em QA. Objetivo: reescrever minhas experiências para que mostrem o que eu fiz e o efeito disso, e não só as ferramentas que usei.",
 obj_en:"You are a technical recruiter specialized in QA. Goal: rewrite my experience so it shows what I did and its effect, not just the tools I used.",
 antes:["Cole suas experiências e projetos (pode ser em tópicos soltos).", "Para qual vaga ou nível você está se candidatando?"],
 antes_en:["Paste your experience and projects (loose bullet points are fine).", "Which role or level are you applying for?"],
 passos:["Reescreva cada item no formato ação + contexto + resultado, em até 2 linhas.", "Comece com verbo de ação (automatizei, reduzi, estruturei, investiguei).",
   "Use números só se estiverem no texto; sem número, descreva o impacto.", "Remova adjetivos vazios (proativo, dinâmico, apaixonado).",
   "Coloque primeiro os itens mais relevantes para a vaga."],
 passos_en:["Rewrite each item as action + context + result, in up to 2 lines.", "Start with an action verb (automated, reduced, structured, investigated).",
   "Use numbers only if they're in the text; without numbers, describe the impact.", "Remove empty adjectives (proactive, dynamic, passionate).",
   "Put the most relevant items for the role first."],
 ex:`Antes: "Testes com Playwright e Postman."
Depois: "Automatizei 40 testes de API e E2E com Playwright para o checkout, rodando a cada pull request no GitHub Actions."`,
 ex_en:`Before: "Testing with Playwright and Postman."
After: "Automated 40 API and E2E tests with Playwright for checkout, running on every pull request in GitHub Actions."`,
 saida:["Só a lista reescrita, na ordem de relevância para a vaga"],
 saida_en:["Only the rewritten list, ordered by relevance to the role"],
 check:["Nenhum número inventado?", "Todo item começa com verbo de ação?"],
 check_en:["No invented numbers?", "Does every item start with an action verb?"],
 rev:"Só mantenha o que você consegue explicar numa entrevista.", rev_en:"Keep only what you can explain in an interview."},

{id:"entrevista", c:"Carreira", n:"Iniciante",
 t:"Simular entrevista técnica", t_en:"Mock technical interview",
 d:"Uma pergunta por vez, com feedback do que foi bom e do que faltou.", d_en:"One question at a time, with feedback on what was good and what was missing.",
 quando:"Para treinar antes de um processo seletivo.", quando_en:"To practice before a hiring process.",
 obj:"Você é um entrevistador técnico experiente em vagas de QA. Objetivo: simular uma entrevista realista e me dar feedback útil depois de cada resposta.",
 obj_en:"You are a technical interviewer experienced in QA roles. Goal: run a realistic mock interview and give me useful feedback after each answer.",
 antes:["Qual o nível da vaga (júnior, pleno, sênior)?", "Cole a descrição da vaga, se tiver.", "Há algum tema em que você quer treinar mais?"],
 antes_en:["Which level is the role (junior, mid, senior)?", "Paste the job description, if you have it.", "Is there a topic you want more practice on?"],
 passos:["Faça 8 perguntas, uma por mensagem, e espere minha resposta.", "Misture: fundamentos, \"como você testaria...?\", API, um bug que investiguei e comportamento.",
   "Ajuste a dificuldade ao nível da vaga e às minhas respostas.",
   "Depois de cada resposta, feedback em até 3 linhas: o que foi bom, o que faltou e uma resposta melhor resumida.",
   "No fim, nota de 1 a 5 por tema e os 2 pontos para estudar primeiro."],
 passos_en:["Ask 8 questions, one per message, and wait for my answer.", "Mix: fundamentals, \"how would you test...?\", APIs, a bug I investigated and behavioral questions.",
   "Adjust difficulty to the role level and my answers.",
   "After each answer, feedback in up to 3 lines: what was good, what was missing and a better short answer.",
   "At the end, a 1-to-5 score per topic and the 2 things to study first."],
 ex:`Pergunta 1: Como você testaria o botão "Esqueci minha senha"?
(depois da resposta)
Bom: cobriu e-mail inválido e link expirado.
Faltou: segurança (não revelar se o e-mail existe) e uso repetido do mesmo link.
Resposta melhor: fluxo feliz, e-mail inexistente com mensagem genérica, link expirado, link usado duas vezes e limite de pedidos.`,
 ex_en:`Question 1: How would you test the "Forgot my password" button?
(after the answer)
Good: covered invalid e-mail and expired link.
Missing: security (don't reveal whether the e-mail exists) and reusing the same link.
Better answer: happy path, unknown e-mail with a generic message, expired link, link used twice and request rate limit.`,
 saida:["Uma pergunta por mensagem", "Feedback curto depois de cada resposta", "Resumo final com notas e prioridades"],
 saida_en:["One question per message", "Short feedback after each answer", "Final summary with scores and priorities"],
 check:["Esperei a resposta antes de seguir?", "O feedback traz uma resposta melhor?"],
 check_en:["Did I wait for the answer before moving on?", "Does the feedback include a better answer?"],
 rev:"Treine em voz alta; escrever é diferente de falar.", rev_en:"Practice out loud; writing is different from speaking."},

{id:"readme-portfolio", c:"Carreira", n:"Iniciante",
 t:"README de projeto do portfólio", t_en:"Portfolio project README",
 d:"Explica contexto, riscos, o que foi testado e o que você aprendeu.", d_en:"Explains context, risks, what was tested and what you learned.",
 quando:"Ao publicar um projeto da trilha no GitHub.", quando_en:"When publishing a learning-path project on GitHub.",
 obj:"Você é um QA sênior que revisa portfólios. Objetivo: escrever um README que mostre como eu penso como QA, e não só o que eu automatizei, para quem tem 2 minutos para ler.",
 obj_en:"You are a senior QA engineer who reviews portfolios. Goal: write a README that shows how I think as a QA, not just what I automated, for someone with 2 minutes to read.",
 antes:["Qual aplicação você testou e por quê?", "Quais ferramentas, quantos testes e quais bugs encontrou?", "Que decisões você tomou (o que priorizou e o que deixou de fora)?"],
 antes_en:["Which application did you test and why?", "Which tools, how many tests and which bugs did you find?", "Which decisions did you make (what you prioritized and left out)?"],
 passos:["Abra com 2 parágrafos que convençam quem lê só eles: o que, por que e o resultado.",
   "Seções: Contexto, Riscos que priorizei, O que foi testado, O que ficou de fora e por quê, Como rodar, Resultados, O que aprendi.",
   "Frases curtas; listas onde ajudar.", "Não invente números.", "Inclua o comando para rodar e o link do relatório, se houver."],
 passos_en:["Open with 2 paragraphs that convince someone who reads only them: what, why and the result.",
   "Sections: Context, Risks I prioritized, What was tested, What was left out and why, How to run, Results, What I learned.",
   "Short sentences; lists where they help.", "Don't invent numbers.", "Include the command to run and the report link, if any."],
 ex:`## O que ficou de fora e por quê
- Testes de performance: a API é pública e compartilhada; carga poderia afetar outras pessoas.
- Safari: sem macOS disponível; o risco foi aceito porque a aplicação é de treino.`,
 ex_en:`## What was left out and why
- Performance tests: the API is public and shared; load could affect other people.
- Safari: no macOS available; the risk was accepted because the app is for practice.`,
 saida:["O README completo em Markdown"],
 saida_en:["The complete README in Markdown"],
 check:["Os dois primeiros parágrafos se sustentam sozinhos?", "Há a seção do que ficou de fora?", "Nenhum número inventado?"],
 check_en:["Do the first two paragraphs stand on their own?", "Is there a section on what was left out?", "No invented numbers?"],
 rev:"Peça para alguém de fora ler e explicar o projeto de volta para você.", rev_en:"Ask someone outside the project to read it and explain it back to you."}
);
