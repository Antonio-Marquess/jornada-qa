/* Jornada QA — Além do Teste
 * Dados da trilha: etapas (STAGES) e tópicos (TOPICS).
 *
 * Campos de cada tópico:
 *   s    etapa (e1 a e5)
 *   t    título (gera o identificador usado no progresso salvo)
 *   p    profundidade esperada: Conhecer, Praticar com apoio, Autonomia, Aprofundar
 *   pr   prioridade: Essencial, Diferencial forte, Diferencial, Escolha uma
 *   ia   true quando o tópico é sobre IA
 *   d    descrição curta
 *   est  o que estudar (lista de subtemas)
 *   tech tecnologias e conceitos (aparecem no mapa e na busca)
 *   l    materiais: [["Texto", "https://...", "o que ler ou fazer nele"]]
 *   x    exercício prático (aplicação, passos e entrega)
 *   lab  laboratório pronto para copiar (comandos, dados, história de exemplo), opcional
 *   cc   critérios de conclusão: como saber que terminou
 */
window.JQA = window.JQA || {};
JQA.CONTENT_VERSION = "0.4";

JQA.STAGES = [
  {id:"e1", n:"1", name:"Base", color:"--e1",
   goal:"Pensar como testador: entender o produto, priorizar por risco, investigar com método e comunicar com clareza, ainda sem código."},
  {id:"e2", n:"2", name:"Entrada no mercado", color:"--e2",
   goal:"O mínimo técnico para trabalhar num time: web, API, dados, Git, terminal e código simples que você entende. No fim desta etapa, comece a se candidatar."},
  {id:"e3", n:"3", name:"Consolidação", color:"--e3",
   goal:"Virar alguém em quem o time confia: automação sustentável, ambientes com Docker, CI, investigação autônoma e colaboração."},
  {id:"e4", n:"4", name:"Especialização", color:"--e4",
   goal:"Escolha uma área e aprofunde até resolver problemas reais nela."},
  {id:"e5", n:"5", name:"Evolução sênior", color:"--e5",
   goal:"Julgamento, estratégia e influência. Vários caminhos possíveis, não um único topo."}
];

(function(){
const A="Autonomia", P="Praticar com apoio", C="Conhecer", AP="Aprofundar",
      ES="Essencial", DF="Diferencial", DFF="Diferencial forte", ESC="Escolha uma";
const CTFL="https://www.istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf";

JQA.TOPICS = [
/* =================== ETAPA 1 — BASE =================== */
{s:"e1",t:"Fundamentos de teste",p:A,pr:ES,
 d:"Por que testamos, o que é um defeito e como o teste se organiza em níveis e tipos.",
 est:["Erro, defeito e falha: a diferença entre os três","Os 7 princípios do teste","Níveis de teste: unidade, integração, sistema e aceitação","Pirâmide de testes: por que ter mais testes nas camadas de baixo","Verificação × validação","Teste estático (revisar) × teste dinâmico (executar)"],
 tech:["ISTQB CTFL 4.0","Pirâmide de testes","Verificação × validação"],
 l:[["Syllabus CTFL v4.0.1 (PDF)",CTFL,"Capítulo 1 inteiro e seção 2.2 (níveis de teste)"],["The Practical Test Pyramid – Martin Fowler","https://martinfowler.com/articles/practical-test-pyramid.html","Só a introdução e a seção “The Test Pyramid”"]],
 x:"No seu caderno de estudos, escreva um exemplo real (de um app que você usa) para cada um dos 7 princípios e para erro, defeito e falha.",
 cc:["Explico erro, defeito e falha com um exemplo meu","Cito os 7 princípios sem consultar","Explico para que serve cada nível de teste"]},

{s:"e1",t:"Ágil e o papel do QA",p:C,pr:ES,
 d:"Como o software é feito e onde o QA atua em cada modelo de trabalho.",
 est:["Modelo em cascata e suas limitações","Modelo V: cada fase de desenvolvimento tem uma fase de teste","Ágil: manifesto e princípios","Scrum: papéis, cerimônias e artefatos","Kanban: fluxo e limite de trabalho em andamento","Definition of Ready e Definition of Done","Onde o QA atua em cada cerimônia"],
 tech:["Scrum","Kanban","Cascata","Modelo V","Definition of Done"],
 l:[["Scrum Guide (português disponível)","https://scrumguides.org/","Leia o guia inteiro: são cerca de 15 páginas"],["Modelo em cascata – Wikipédia","https://pt.wikipedia.org/wiki/Modelo_em_cascata","Visão geral e críticas"],["Modelo V – Wikipédia","https://pt.wikipedia.org/wiki/Modelo_V","Diagrama e relação entre fases"]],
 x:"Desenhe uma sprint de duas semanas de um time fictício e marque, cerimônia por cerimônia, o que o QA faz. Compare com o que o QA faria no modelo em cascata.",
 cc:["Explico a diferença entre cascata, modelo V e ágil","Sei o que o QA faz no planning, na daily, na review e na retro","Sei escrever uma Definition of Done com critérios de qualidade"]},

{s:"e1",t:"Técnicas de projeto",p:A,pr:ES,
 d:"Desenhar poucos casos que encontram muitos problemas.",
 est:["Partição de equivalência","Análise de valor limite (2 e 3 valores)","Tabela de decisão","Transição de estados","Teste pairwise (combinatório)","Teste baseado em experiência e suposição de erro"],
 tech:["Partição de equivalência","Valor limite","Tabela de decisão","Transição de estados","Pairwise"],
 l:[["Syllabus CTFL v4.0.1 (PDF)",CTFL,"Capítulo 4, seções 4.1 a 4.4"],["test-design.org – exercícios","https://test-design.org/practical-exercises/","Faça os exercícios de partição e valor limite"]],
 x:"No cadastro do Practice Software Testing (practicesoftwaretesting.com), aplique partição e valor limite aos campos de data de nascimento e senha, e uma tabela de decisão às regras de login. Entregue a tabela de casos com a técnica de cada um.",
 cc:["Sei qual técnica usar para cada tipo de regra","Minha tabela de casos cobre limites inferior e superior","Resolvi os exercícios do test-design.org e entendi os erros"]},

{s:"e1",t:"Testes funcionais",p:A,pr:ES,
 d:"Verificar se o sistema faz o que deveria, regra por regra, em todos os caminhos.",
 est:["Regras de negócio e cálculos (descontos, juros, frete, impostos)","Validações de campos e mensagens de erro","Fluxo principal e fluxos alternativos","Estados de um objeto (pedido criado, pago, enviado, cancelado)","Permissões: o que cada perfil pode ou não fazer","Persistência: o dado foi salvo e continua lá depois?","Smoke, sanity e regressão"],
 tech:["Funcional","Regras de negócio","Fluxos alternativos","Smoke","Regressão"],
 l:[["Syllabus CTFL v4.0.1 (PDF)",CTFL,"Seção 2.2.2 (tipos de teste)"],["Practice Software Testing","https://practicesoftwaretesting.com/","Aplicação para praticar: loja com carrinho, login e checkout"]],
 x:"No Practice Software Testing, teste o carrinho e o checkout: regras de quantidade, cálculo do total, fluxo alternativo (remover item, voltar), estados do pedido e se o pedido aparece na conta depois de recarregar a página.",
 cc:["Testei fluxo principal e pelo menos 3 alternativos","Conferi cálculo, validação, estado e persistência","Sei explicar a diferença entre smoke, sanity e regressão"]},

{s:"e1",t:"Testes não funcionais",p:C,pr:ES,
 d:"Verificar se o sistema faz bem o que faz: rápido, seguro, usável, acessível e compatível.",
 est:["As características da ISO 25010","Desempenho: tempo de resposta e carga","Segurança: confidencialidade, integridade, autorização","Usabilidade e acessibilidade","Compatibilidade: navegadores, dispositivos, integrações","Confiabilidade e recuperação depois de falhas"],
 tech:["ISO 25010","Performance","Segurança","Usabilidade","Compatibilidade"],
 l:[["ISO/IEC 25010 – arc42","https://quality.arc42.org/standards/iso-25010","Leia as 9 características e os exemplos"],["10 heurísticas de usabilidade – NN/g","https://www.nngroup.com/articles/ten-usability-heuristics/","As 10 heurísticas com exemplos"]],
 x:"Escolha um app que você usa todo dia e escreva um teste não funcional para cada característica da ISO 25010. Rode o Lighthouse (DevTools do Chrome, aba Lighthouse) na página inicial e anote os 3 piores itens.",
 cc:["Cito as características de qualidade e dou exemplo de cada","Rodei o Lighthouse e sei ler o relatório","Sei que tipo de teste usar para cada característica"]},

{s:"e1",t:"Abordagens e oráculos de teste",p:C,pr:ES,
 d:"Como decidir se um resultado está certo e quanto do sistema você enxerga ao testar.",
 est:["Caixa-preta, caixa-branca e caixa-cinza","O que é um oráculo de teste","Oráculos comuns: requisito, sistema anterior, concorrente, regra de negócio, bom senso","Quando não há oráculo claro: o que fazer","Testing × checking"],
 tech:["Caixa-preta","Caixa-branca","Caixa-cinza","Oráculos","Testing × checking"],
 l:[["Test oracle – Wikipédia","https://en.wikipedia.org/wiki/Test_oracle","Definição e tipos de oráculo"],["Testing vs. Checking (InfoQ)","https://www.infoq.com/news/2009/12/testing-or-checking/","O texto inteiro"]],
 x:"Para 5 comportamentos de um app (ex.: calculadora de frete), anote qual oráculo você usaria para dizer se está certo e o que faria se não houvesse nenhum.",
 cc:["Explico caixa-preta, branca e cinza com exemplos","Para um comportamento novo, digo qual oráculo uso","Explico testing × checking"]},

{s:"e1",t:"Análise de risco",p:P,pr:ES,
 d:"Escolher o que testar primeiro pelo impacto e pela probabilidade de falha.",
 est:["Risco de produto × risco de projeto","Impacto × probabilidade","Matriz de risco","Priorização de testes pelo risco","Heurísticas para descobrir riscos (HTSM)"],
 tech:["Impacto × probabilidade","HTSM","Teste baseado em risco"],
 l:[["Syllabus CTFL v4.0.1 (PDF)",CTFL,"Seção 5.2 (gestão de riscos)"],["Heuristic Test Strategy Model","https://www.satisfice.com/download/heuristic-test-strategy-model","Seção Product Factors e Quality Criteria"]],
 x:"Para a loja do Practice Software Testing, liste 10 riscos, dê nota de 1 a 5 para impacto e probabilidade, monte a matriz e decida a ordem de teste.",
 cc:["Tenho uma matriz de risco com justificativa","Sei explicar por que testei A antes de B","Diferencio risco de produto e de projeto"]},

{s:"e1",t:"Revisão de requisitos",p:P,pr:ES,
 d:"Achar ambiguidades, contradições e exemplos que faltam antes do código existir.",
 est:["História de usuário e critérios de aceite","Ambiguidade, contradição e omissão","Perguntas certas para o PO","Exemplos concretos e casos de borda","Gherkin: Dado, Quando, Então","Três amigos (PO, dev e QA)"],
 tech:["Critérios de aceite","Gherkin","Três amigos","BDD"],
 l:[["Cucumber – Gherkin reference","https://cucumber.io/docs/gherkin/reference/","Seções Keywords e Scenario Outline"],["Syllabus CTFL v4.0.1 (PDF)",CTFL,"Seção 3.2 (revisões) e 4.5 (critérios de aceite)"]],
 x:"Revise a história do laboratório. Liste ambiguidades e perguntas ao PO, depois reescreva os critérios em Gherkin com exemplos concretos.",
 lab:`História: Como cliente, quero aplicar um cupom de desconto no carrinho para pagar menos.

Critérios de aceite:
1. O cliente pode aplicar um cupom válido.
2. O desconto é aplicado no total.
3. Cupons expirados não funcionam.
4. Só um cupom por compra.
5. O cupom não vale para produtos em promoção.

(Há pelo menos 8 ambiguidades nesta história. Encontre-as.)`,
 cc:["Encontrei pelo menos 6 ambiguidades","Cada pergunta ao PO está ligada a um risco","Meus cenários Gherkin têm dados concretos"]},

{s:"e1",t:"Planejamento e relatórios de teste",p:P,pr:ES,
 d:"Organizar o que será testado, como, por quem e como comunicar o andamento.",
 est:["Plano de teste: escopo, fora de escopo, abordagem, ambiente, riscos","Estimativa simples de esforço","Critérios de entrada e de saída","Relatório de status: o que foi testado, o que falta, riscos abertos","Relatório final de teste","Métricas básicas: casos executados, bugs por severidade"],
 tech:["Plano de teste","Relatório de status","Critérios de saída"],
 l:[["Syllabus CTFL v4.0.1 (PDF)",CTFL,"Seções 5.1 (planejamento) e 5.3 (monitoramento e relatórios)"],["Modelo de plano de teste – Awesome QA Roadmap","https://github.com/fityanos/awesome-quality-assurance-roadmap","Baixe o Test Plan Sample citado no README"]],
 x:"Escreva um plano de teste de uma página para o checkout do Practice Software Testing e um relatório de status fictício do terceiro dia de testes.",
 cc:["Meu plano tem escopo, fora de escopo, riscos e critérios de saída","Meu relatório diz o que falta e quais riscos continuam","Alguém que não conhece o projeto entende os dois"]},

{s:"e1",t:"Teste exploratório",p:P,pr:ES,
 d:"Aprender e testar ao mesmo tempo, com objetivo e registro.",
 est:["O que é e o que não é exploratório","Charter: explorar, com, para descobrir","Sessões com tempo definido","Heurísticas e tours","Registro e debriefing da sessão"],
 tech:["Charter","Session-based testing","Heurísticas","Tours"],
 l:[["Exploratory Testing 3.0 – James Bach","https://www.satisfice.com/blog/archives/1509","O texto inteiro"],["Session-Based Test Management (PDF)","http://www.satisfice.com/articles/sbtm.pdf","Seções sobre charter e relatório de sessão"]],
 x:"Faça duas sessões de 45 minutos no Practice Software Testing usando o modelo de charter abaixo. Uma sobre busca e filtros, outra sobre a conta do usuário.",
 lab:`Explorar: <área>
Com: <recursos, dados, heurísticas>
Para descobrir: <a informação ou risco que você procura>
Duração: 45 min

Notas da sessão:
Problemas encontrados:
Perguntas abertas:
Ideias para a próxima sessão:`,
 cc:["Fiz duas sessões com charter e registro","Cada sessão terminou com perguntas e próximos passos","Sei explicar o que encontrei sem ler as notas"]},

{s:"e1",t:"Relato de bug",p:A,pr:ES,
 d:"Passos, esperado × obtido, evidência, severidade × prioridade e o que você ainda não sabe.",
 est:["Anatomia de um bom relato","Passos mínimos para reproduzir","Severidade × prioridade","Evidências: print, vídeo, requisição, log","Ciclo de vida do defeito","Como conversar sobre um bug sem gerar atrito"],
 tech:["Jira","Evidências","Severidade × prioridade","Ciclo de vida do defeito"],
 l:[["AcademyBugs","https://academybugs.com/","Faça o tutorial e depois o desafio dos 25 bugs"],["Syllabus CTFL v4.0.1 (PDF)",CTFL,"Seção 5.5 (gestão de defeitos)"]],
 x:"No AcademyBugs, encontre e relate pelo menos 10 bugs no modelo abaixo. Depois compare com a lista oficial e anote o que você perdeu.",
 lab:`Título: <o que falha, onde e em que condição>
Ambiente: <navegador/versão, dispositivo, usuário>
Passos para reproduzir:
1.
2.
Resultado esperado:
Resultado obtido:
Evidência: <print, vídeo, requisição/resposta>
Severidade / prioridade sugeridas:
O que ainda não sei: <hipóteses não verificadas>`,
 cc:["Meus relatos têm passos que outra pessoa reproduz","Diferencio severidade de prioridade","Comparei com a lista oficial e entendi o que perdi"]},

{s:"e1",t:"Evidências e ferramentas do dia a dia",p:P,pr:ES,
 d:"As ferramentas simples que todo QA usa: captura e gravação de tela, planilhas e organização.",
 est:["Captura de tela com anotação","Gravação de tela curta para bugs difíceis de descrever","Planilhas: filtro, tabela dinâmica e PROCV/XLOOKUP para massas de teste","Organização de evidências por caso de teste","Editor de texto e VS Code para logs"],
 tech:["ShareX","OBS Studio","Excel","Google Sheets","VS Code"],
 l:[["ShareX (Windows)","https://getsharex.com/","Captura com anotação e gravação em GIF"],["OBS Studio","https://obsproject.com/","Gravação de tela"]],
 x:"Grave um vídeo de até 30 segundos mostrando um bug do AcademyBugs e monte uma planilha com 20 linhas de massa de teste (nome, e-mail, CPF fictício, resultado esperado), usando filtro para separar válidos e inválidos.",
 cc:["Tenho um vídeo curto e claro de um bug","Sei usar filtro e PROCV numa planilha","Minhas evidências estão organizadas por caso"]},

{s:"e1",t:"Acessibilidade",p:C,pr:DF,
 d:"Teclado, contraste, leitor de tela e foco.",
 est:["Princípios da WCAG: perceptível, operável, compreensível, robusto","Navegação por teclado e foco visível","Contraste de cores","Texto alternativo em imagens","Leitor de tela básico"],
 tech:["WCAG 2.2","axe DevTools","NVDA","Navegação por teclado"],
 l:[["WCAG – visão geral (W3C)","https://www.w3.org/WAI/standards-guidelines/wcag/","A visão geral e os 4 princípios"],["Playwright – accessibility testing","https://playwright.dev/docs/accessibility-testing","Para depois, na automação"]],
 x:"Preencha o cadastro do Practice Software Testing usando só o teclado e rode a extensão axe DevTools na página. Registre as barreiras encontradas.",
 cc:["Completei um fluxo só com teclado","Rodei o axe e sei ler os resultados","Explico os 4 princípios da WCAG"]},

{s:"e1",t:"Segurança funcional",p:C,pr:ES,
 d:"Autenticação, autorização, sessão e acesso ao dado de outro usuário. LGPD em dados de teste.",
 est:["Autenticação × autorização","Sessão: expiração, logout, token","Controle de acesso: o usuário A não pode ver os dados do B","Mensagens de erro que vazam informação","LGPD: por que não usar dados reais em teste"],
 tech:["AuthN × AuthZ","Sessão","IDOR","LGPD"],
 l:[["PortSwigger – Authentication","https://portswigger.net/web-security/authentication","Leia a introdução e faça os labs de nível Apprentice"],["PortSwigger – Access control","https://portswigger.net/web-security/access-control","Leia a introdução e faça 2 labs de nível Apprentice"],["ANPD – proteção de dados","https://www.gov.br/anpd/pt-br","Só para a parte de privacidade e dados de teste"]],
 x:"Crie uma conta gratuita na PortSwigger Web Security Academy e resolva 2 labs de autenticação e 2 de controle de acesso de nível Apprentice.",
 cc:["Resolvi 4 labs Apprentice","Explico a diferença entre autenticação e autorização","Sei por que dados reais não entram em teste"]},

{s:"e1",t:"IA como tutora",p:P,pr:ES,ia:true,
 d:"O que é um LLM, por que ele erra com confiança e como usar para estudar sem terceirizar o raciocínio.",
 est:["O que é um LLM e como ele gera texto","Alucinação: por que acontece","Como escrever um bom pedido: contexto, exemplo, formato","Usar IA como mentora que pergunta","Nunca colar dados pessoais ou da empresa"],
 tech:["Claude","ChatGPT","Gemini","Prompts"],
 l:[["Generative AI for Everyone","https://www.deeplearning.ai/courses/generative-ai-for-everyone/","Semana 1"],["Anthropic – prompt engineering","https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview","Seções “Be clear and direct” e “Use examples”"]],
 x:"Use o prompt “Mentor que faz perguntas” (aba Prompts) para estudar técnicas de projeto. Depois peça 15 cenários para o login do SauceDemo e classifique cada um como útil, redundante ou inventado.",
 cc:["Estudei um tema com a IA fazendo perguntas","Classifiquei a saída da IA com critério","Sei explicar por que a IA erra com confiança"]},

{s:"e1",t:"Inglês técnico",p:P,pr:ES,
 d:"Ler documentação em inglês, prática contínua desde o início.",
 est:["Vocabulário de teste em inglês","Leitura de documentação técnica","Escrever um relato de bug em inglês","Usar tradutor sem perder o sentido técnico"],
 tech:["Leitura de docs","Vocabulário de teste"],
 l:[["Playwright – docs","https://playwright.dev/docs/intro","Leia uma página por dia e resuma em português"],["Glossário ISTQB","https://glossary.istqb.org/","Consulte termos em inglês e português"]],
 x:"Durante duas semanas, leia uma página da documentação do Playwright por dia e escreva um resumo de 3 linhas em português. Escreva um dos seus relatos de bug em inglês.",
 cc:["Li 10 páginas de documentação","Escrevi um relato de bug em inglês","Uso o glossário ISTQB quando tenho dúvida"]},

/* =================== ETAPA 2 — ENTRADA NO MERCADO =================== */
{s:"e2",t:"Fundamentos de web",p:P,pr:ES,
 d:"Como uma página é construída: o que você precisa saber para testar e automatizar.",
 est:["HTML: estrutura, formulários, atributos","CSS: o básico de estilo e layout responsivo","DOM: a árvore que o navegador monta","Seletores CSS e XPath","Cliente × servidor; renderização no cliente e no servidor","Cache do navegador e cookies"],
 tech:["HTML","CSS","DOM","Seletores CSS","XPath","Responsivo"],
 l:[["MDN – aprender desenvolvimento web","https://developer.mozilla.org/pt-BR/docs/Learn","Módulos de HTML e CSS básicos"],["MDN – seletores CSS","https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_selectors","Seletores básicos, de atributo e combinadores"],["Playwright – locators","https://playwright.dev/docs/locators","Por que preferir getByRole a seletores CSS"]],
 x:"No SauceDemo, abra o DevTools (F12) e escreva, para 10 elementos, um seletor CSS e um XPath. Teste cada um no console com document.querySelector e $x.",
 cc:["Escrevo seletores CSS e XPath que funcionam","Entendo a árvore do DOM no DevTools","Sei testar uma página em tamanhos de tela diferentes"]},

{s:"e2",t:"HTTP e DevTools",p:A,pr:ES,
 d:"Métodos, status, headers, cookies e JSON, investigados no navegador.",
 est:["Requisição e resposta","Métodos: GET, POST, PUT, PATCH, DELETE","Status codes: 2xx, 3xx, 4xx, 5xx","Headers, cookies e tokens","JSON","Aba Network do DevTools: filtrar, inspecionar, copiar como cURL"],
 tech:["HTTP","JSON","Chrome DevTools","Aba Network"],
 l:[["MDN – visão geral do HTTP","https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview","A página inteira"],["MDN – status de resposta HTTP","https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status","Os códigos mais comuns de cada faixa"],["Chrome DevTools – Network","https://developer.chrome.com/docs/devtools/network","Inspecionar e filtrar requisições"]],
 x:"No SauceDemo e no Practice Software Testing, abra a aba Network, faça login e uma compra, e explique 5 requisições: método, status, o que foi enviado e o que voltou.",
 cc:["Explico método, status e corpo de uma requisição","Uso a aba Network para investigar um erro","Sei copiar uma requisição como cURL"]},

{s:"e2",t:"Testes de API",p:A,pr:ES,
 d:"Variáveis, autenticação, asserções e cenários negativos.",
 est:["REST: recursos e verbos","Coleções, ambientes e variáveis","Autenticação com token","Asserções de status, corpo e tempo","Cenários negativos: campos faltando, tipos errados, limites","Encadear requisições (criar, consultar, alterar, apagar)"],
 tech:["Bruno","Postman","REST","JSON Schema"],
 l:[["ServeRest","https://serverest.dev/","A própria página é a documentação Swagger da API: leia os endpoints"],["Postman Learning Center","https://learning.postman.com/","Seções Sending requests e Writing tests"],["API Challenges – simulador","https://apichallenges.com/practice-modes/simulation","Para quem nunca fez uma requisição"]],
 x:"Monte uma coleção para o ServeRest seguindo os passos do laboratório. Inclua testes de status e de corpo em cada requisição.",
 lab:`API: https://serverest.dev

1. POST /usuarios  -> crie um usuário administrador ("administrador": "true")
2. POST /login     -> guarde o token da resposta numa variável
3. POST /produtos  -> crie um produto usando o token no header Authorization
4. GET  /produtos/{id} -> confira se os dados batem
5. PUT  /produtos/{id} -> altere o preço
6. DELETE /produtos/{id}

Negativos:
- POST /produtos sem token          -> esperado 401
- POST /produtos com usuário comum   -> esperado 403
- POST /usuarios com e-mail repetido -> esperado 400
- POST /produtos com preço negativo  -> o que acontece? Relate.`,
 cc:["Minha coleção roda inteira sem eu editar nada","Cada requisição tem teste de status e de corpo","Tenho pelo menos 4 cenários negativos"]},

{s:"e2",t:"Documentação de API e Newman",p:P,pr:DFF,
 d:"Ler um contrato OpenAPI/Swagger e rodar uma coleção pela linha de comando.",
 est:["OpenAPI (Swagger): endpoints, parâmetros, schemas, respostas","Testar pela própria documentação Swagger","Exportar coleção e ambiente","Newman: rodar coleções no terminal","Relatório do Newman"],
 tech:["OpenAPI","Swagger","Newman","Postman"],
 l:[["OpenAPI – getting started","https://learn.openapis.org/","A introdução e as páginas que explicam a estrutura do documento"],["Newman – instalar e rodar","https://learning.postman.com/docs/running-collections/using-newman-cli/installing-running-newman/","A página inteira"]],
 x:"Exporte sua coleção do ServeRest e rode-a com o Newman. Compare um endpoint da coleção com o schema da documentação Swagger e anote divergências.",
 lab:`npm install -g newman
newman run serverest.postman_collection.json -e serverest.postman_environment.json`,
 cc:["Leio um endpoint no Swagger e sei o que esperar","Rodei a coleção pelo terminal com Newman","Comparei a resposta real com o schema"]},

{s:"e2",t:"Git e GitHub",p:A,pr:ES,
 d:"Versionar o trabalho e colaborar.",
 est:["Repositório, commit, branch","clone, add, commit, push, pull","Pull request e revisão","Resolver conflito simples","README em Markdown"],
 tech:["Git","GitHub","Branch","Pull request","Markdown"],
 l:[["Learn Git Branching","https://learngitbranching.js.org/?locale=pt_BR","Níveis da aba Main, sequência 1 e 2"],["GitHub Skills – Introduction to GitHub","https://github.com/skills/introduction-to-github","Siga o exercício guiado inteiro"]],
 x:"Crie o repositório estudos-qa, com README, e publique suas notas desta trilha. Faça uma mudança numa branch, abra um pull request e faça o merge.",
 cc:["Tenho um repositório público com README","Fiz um pull request e o merge","Resolvi um conflito simples"]},

{s:"e2",t:"Linux e terminal",p:P,pr:ES,
 d:"Navegar, ler logs, entender permissões e processos. Quase todo servidor e pipeline roda em Linux.",
 est:["Navegar: pwd, ls, cd","Arquivos: cat, less, tail, grep","Permissões e usuários","Processos: ps, kill","Variáveis de ambiente","WSL para quem usa Windows"],
 tech:["Linux","Bash","WSL","Permissões","Logs"],
 l:[["Linux Journey","https://linuxjourney.com/","Trilhas Grasshopper: Getting Started, Command Line e Text-Fu"],["WSL – instalação","https://learn.microsoft.com/pt-br/windows/wsl/install","Só se você usa Windows"]],
 x:"Num terminal Linux (ou WSL), baixe um arquivo de log de exemplo e encontre as últimas 20 linhas de erro com tail e grep.",
 lab:`curl -o app.log https://raw.githubusercontent.com/logpai/loghub/master/Apache/Apache_2k.log
grep -i "error" app.log | tail -n 20
grep -ic "error" app.log`,
 cc:["Navego e leio arquivos pelo terminal","Encontro erros num log com grep","Sei o que é uma variável de ambiente"]},

{s:"e2",t:"Ambiente de desenvolvimento",p:P,pr:ES,
 d:"Instalar dependências, configurar variáveis e entender mensagens de erro.",
 est:["Node.js e npm","package.json e dependências","Arquivo .env","VS Code: terminal, extensões, depuração","Ler uma mensagem de erro de cima para baixo"],
 tech:["Node.js","npm","VS Code",".env"],
 l:[["Node.js – download","https://nodejs.org/","Instale a versão LTS"],["VS Code – primeiros passos","https://code.visualstudio.com/docs/getstarted/getting-started","Tour pela interface e terminal integrado"]],
 x:"Clone um projeto de exemplo do Playwright, instale as dependências e faça rodar.",
 lab:`npm init playwright@latest
npx playwright test
npx playwright show-report`,
 cc:["Instalei Node e rodei um projeto de testes","Sei onde configurar variáveis de ambiente","Leio a mensagem de erro antes de pedir ajuda"]},

{s:"e2",t:"SQL",p:P,pr:DFF,
 d:"Consultar dados para preparar e validar testes.",
 est:["SELECT, WHERE, ORDER BY","Funções de agregação e GROUP BY","JOIN entre tabelas","INSERT, UPDATE e DELETE","Validar um dado gravado por uma funcionalidade"],
 tech:["SELECT","JOIN","GROUP BY","PostgreSQL","MySQL"],
 l:[["SQLBolt","https://sqlbolt.com/","Lições 1 a 12, no navegador"],["DB Fiddle","https://www.db-fiddle.com/","Banco no navegador para o laboratório"]],
 x:"Faça as lições do SQLBolt. Depois, no DB Fiddle (escolha SQLite ou PostgreSQL), cole o script do laboratório e responda às perguntas com consultas.",
 lab:`CREATE TABLE clientes (id INT PRIMARY KEY, nome TEXT, email TEXT, cidade TEXT);
CREATE TABLE pedidos (id INT PRIMARY KEY, cliente_id INT, total NUMERIC, status TEXT, criado_em DATE);
INSERT INTO clientes VALUES (1,'Ana','ana@teste.com','Recife'),(2,'Bruno','bruno@teste.com','São Paulo'),(3,'Carla','carla@teste.com','Recife'),(4,'Davi',NULL,'Curitiba');
INSERT INTO pedidos VALUES (1,1,150.00,'pago','2026-10-01'),(2,1,80.50,'cancelado','2026-10-03'),(3,2,300.00,'pago','2026-10-05'),(4,3,0,'pago','2026-10-06'),(5,9,45.00,'pago','2026-10-07');

-- Perguntas:
-- 1. Quais clientes não têm e-mail?
-- 2. Qual o total pago por cliente (só status 'pago')?
-- 3. Existe pedido de cliente que não existe? (é um bug de integridade)
-- 4. Existe pedido pago com total zero? O que isso indica?`,
 cc:["Terminei as lições do SQLBolt","Respondi às 4 perguntas com consultas","Sei usar JOIN para achar dados inconsistentes"]},

{s:"e2",t:"Programação inicial",p:P,pr:ES,
 d:"Lógica e JavaScript do zero, o suficiente para ler e escrever testes simples. Escolhemos JavaScript porque é a base do Playwright.",
 est:["Variáveis e tipos","Condicionais e laços","Funções","Arrays e objetos","async e await","Depurar com breakpoint no VS Code"],
 tech:["JavaScript","Lógica","Funções","async/await","Debugger"],
 l:[["The Modern JavaScript Tutorial","https://javascript.info/","Parte 1, capítulos 2 (fundamentos) e 4 (objetos); use o tradutor do navegador se precisar"],["MDN – guia de JavaScript","https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide","Para consultar dúvidas"],["VS Code – depuração","https://code.visualstudio.com/docs/editor/debugging","Breakpoints e inspeção de variáveis"]],
 x:"Escreva uma função que recebe uma idade e devolve se a pessoa pode se cadastrar (entre 18 e 120). Escreva 6 chamadas de teste com valores-limite e depure com breakpoint.",
 lab:`function podeCadastrar(idade) {
  // sua implementação aqui
}

console.log(podeCadastrar(17)); // false
console.log(podeCadastrar(18)); // true
console.log(podeCadastrar(120)); // true
console.log(podeCadastrar(121)); // false
console.log(podeCadastrar(-1)); // false
console.log(podeCadastrar("abc")); // false`,
 cc:["Escrevo funções simples sem copiar","Uso arrays e objetos","Depurei um código com breakpoint"]},

{s:"e2",t:"Primeira automação",p:P,pr:DFF,
 d:"Locators, asserções, execução e leitura do relatório.",
 est:["Estrutura de um teste Playwright","Locators: getByRole, getByLabel, getByText","Asserções web-first","Rodar com e sem interface, e em modo debug","Ler o relatório e o trace"],
 tech:["Playwright","Locators","Asserções","HTML report","Trace"],
 l:[["Playwright – escrever testes","https://playwright.dev/docs/writing-tests","A página inteira"],["Playwright – locators","https://playwright.dev/docs/locators","Locators recomendados"],["SauceDemo","https://www.saucedemo.com/","Aplicação para automatizar"]],
 x:"Automatize 6 testes no SauceDemo: login com sucesso, login bloqueado, adicionar ao carrinho, remover, finalizar compra e o bug de imagem do problem_user.",
 cc:["Meus 6 testes passam e falham quando deveriam","Uso getByRole ou data-test em vez de CSS frágil","Sei abrir o trace de um teste que falhou"]},

{s:"e2",t:"Segurança em API",p:P,pr:ES,
 d:"Acessar recurso de outro usuário, token ausente, campos extras.",
 est:["OWASP API Security Top 10","BOLA/IDOR: acessar o objeto de outro usuário","Autenticação quebrada","Mass assignment: campos extras no corpo","Exposição excessiva de dados na resposta"],
 tech:["OWASP API Top 10","IDOR / BOLA","Mass assignment"],
 l:[["OWASP API Security Top 10","https://owasp.org/www-project-api-security/","Leia API1 a API3"],["OWASP Juice Shop","https://owasp.org/www-project-juice-shop/","Aplicação vulnerável para praticar"]],
 x:"Rode o Juice Shop localmente, crie dois usuários e tente ver o carrinho de um com o token do outro, trocando o ID na requisição. Relate o que encontrar.",
 lab:`docker run --rm -p 3000:3000 bkimminich/juice-shop
# Abra http://localhost:3000
# Crie dois usuários, faça login com o primeiro e abra o carrinho.
# Na aba Network, encontre a requisição GET /rest/basket/<id>
# Repita a requisição trocando o <id> pelo do outro usuário.`,
 cc:["Reproduzi um acesso indevido a dado de outro usuário","Explico BOLA e mass assignment","Relatei a falha com evidência e impacto"]},

{s:"e2",t:"IA no dia a dia",p:P,pr:ES,ia:true,
 d:"Assistentes para analisar requisitos, gerar cenários e dados, explicar código e revisar relatos. Sempre revisando.",
 est:["Onde a IA ajuda no trabalho de QA","Como pedir: contexto, exemplos, formato de saída","Revisar e descartar o que a IA inventa","Dados sensíveis: o que nunca colar","Registrar o que você mudou na resposta"],
 tech:["Claude","ChatGPT","Copilot","Engenharia de prompt"],
 l:[["Anthropic – prompt engineering","https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview","A visão geral e as técnicas básicas"]],
 x:"Siga o fluxo “Uma história do começo ao fim” da aba IA no dia a dia, usando a história de cupom do tópico Revisão de requisitos.",
 cc:["Usei IA em 3 tarefas diferentes de QA","Registrei o que descartei e por quê","Não colei nenhum dado sensível"]},

{s:"e2",t:"Gestão de testes",p:C,pr:ES,
 d:"Organizar casos, execuções e bugs numa ferramenta.",
 est:["Casos de teste, suítes e execuções","Rastreabilidade: requisito, caso e bug","Board de bugs e fluxo de status","Ferramentas: Jira com Xray ou Zephyr, Qase, TestRail"],
 tech:["Jira","Xray","Zephyr","Qase"],
 l:[["Qase – plano gratuito","https://qase.io/","Crie um projeto gratuito para praticar"],["Atlassian – Jira","https://www.atlassian.com/software/jira","Plano gratuito para até 10 usuários"]],
 x:"Crie um projeto gratuito no Qase ou no Jira, cadastre os casos do checkout que você desenhou, execute uma rodada e ligue os bugs aos casos.",
 cc:["Tenho casos, uma execução e bugs ligados","Sei mostrar a rastreabilidade de um requisito"]},

{s:"e2",t:"Mobile manual",p:C,pr:DF,
 d:"Emuladores, permissões, rede instável e interrupções.",
 est:["Diferenças entre Android e iOS","Emulador × aparelho real","Permissões","Rede lenta e sem conexão","Interrupções: ligação, notificação, troca de app","Rotação e tamanhos de tela"],
 tech:["Android Studio","Emuladores","Permissões"],
 l:[["Android Studio – emulador","https://developer.android.com/studio/run/emulator","Criar e rodar um dispositivo virtual"],["Sauce Labs My Demo App","https://github.com/saucelabs/my-demo-app-rn","Baixe o APK em Releases"]],
 x:"Instale o My Demo App no emulador e teste compra com rede lenta, rotação de tela e interrupção no meio do checkout.",
 cc:["Rodei um app no emulador","Testei rede, rotação e interrupção","Relatei pelo menos um problema"]},

{s:"e2",t:"Preparar-se para a primeira vaga",p:A,pr:ES,
 d:"Portfólio, currículo, LinkedIn, desafio técnico e entrevistas. Comece a se candidatar aqui, sem esperar o fim da trilha.",
 est:["Portfólio: dois projetos bem explicados","Currículo com ação e resultado","LinkedIn com link do portfólio","Como resolver um desafio técnico","Perguntas comuns: “como você testaria…?”","Aprender com cada entrevista"],
 tech:["Portfólio","Currículo","LinkedIn","Desafio técnico"],
 l:[["roadmap.sh – projeto E2E","https://roadmap.sh/projects/e2e-test-ecommerce-app","Use como desafio técnico de treino"],["How They Test","https://abhivaikar.github.io/howtheytest/","Leia sobre duas empresas para conversar em entrevista"]],
 x:"Publique dois projetos desta trilha com README completo, reescreva o currículo com o prompt de currículo (aba Prompts) e grave-se respondendo “como você testaria um caixa eletrônico?” em 5 minutos.",
 cc:["Tenho dois projetos públicos com README","Meu currículo descreve resultados, não só ferramentas","Me candidatei a pelo menos 3 vagas"]},

{s:"e2",t:"Certificações",p:C,pr:DF,
 d:"Opcional. Estudar o syllabus é ótimo e gratuito; pagar pela prova é outra decisão.",
 est:["CTFL: o que cobra e como é a prova","Quando a certificação ajuda","Certificações de IA, automação e DevOps para depois"],
 tech:["ISTQB CTFL","CT-GenAI","CTAL-TAE"],
 l:[["ISTQB – lista de certificações","https://istqb.org/certifications/certification-list","Veja o que existe e os pré-requisitos"],["Syllabus CTFL v4.0.1 (PDF)",CTFL,"Se for fazer a prova, leia inteiro e faça simulados"]],
 x:"Veja nas vagas que você quer se a CTFL aparece como requisito ou diferencial e decida se vale investir agora.",
 cc:["Sei se as vagas que quero pedem certificação","Decidi conscientemente fazer ou não a prova agora"]},

/* =================== ETAPA 3 — CONSOLIDAÇÃO =================== */
{s:"e3",t:"Programação sólida",p:A,pr:ES,
 d:"Depuração, testes unitários, refatoração e code review.",
 est:["Testes unitários com Vitest ou Jest","Refatorar sem mudar comportamento","Nomes claros e funções pequenas","Ler o código de outra pessoa","Dar e receber code review"],
 tech:["Vitest","Jest","Refatoração","Code review"],
 l:[["Vitest – getting started","https://vitest.dev/guide/","Instalação e primeiro teste"],["javascript-testing-best-practices","https://github.com/goldbergyoni/javascript-testing-best-practices","Seção 1 (a anatomia de um teste)"]],
 x:"Escreva testes unitários para a função podeCadastrar e para as funções auxiliares do seu projeto de automação. Refatore uma função e prove com os testes que nada quebrou.",
 cc:["Tenho testes unitários rodando","Refatorei com segurança","Revisei o código de alguém e recebi revisão"]},

{s:"e3",t:"Orientação a objetos e padrões",p:P,pr:DFF,
 d:"Organizar código de teste para crescer sem virar bagunça.",
 est:["Classes, objetos, herança e composição","Encapsulamento","Padrões úteis em teste: Page Object, Factory, Builder","Quando não usar herança"],
 tech:["Orientação a objetos","Page Object","Factory","Builder"],
 l:[["Refactoring Guru – padrões de projeto","https://refactoring.guru/pt-br/design-patterns","Factory Method e Builder"],["javascript.info – classes","https://javascript.info/classes","Capítulo de classes"]],
 x:"Crie uma classe Builder que monta usuários de teste para o ServeRest (com padrões e possibilidade de sobrescrever campos) e use-a nos seus testes.",
 cc:["Explico classe, objeto e composição","Usei um Builder para dados de teste","Sei quando um Page Object ajuda e quando atrapalha"]},

{s:"e3",t:"Automação sustentável",p:A,pr:ES,
 d:"Testes independentes, seletores estáveis e boa organização.",
 est:["Testes independentes e em qualquer ordem","Fixtures e setup por API","Page Objects ou funções de ação","Seletores estáveis (data-test, roles)","Esperas automáticas, nunca sleep fixo","Lint para testes"],
 tech:["Playwright","Page Objects","Fixtures","ESLint"],
 l:[["Playwright – best practices","https://playwright.dev/docs/best-practices","A página inteira"],["Playwright – fixtures","https://playwright.dev/docs/test-fixtures","Criar fixtures próprias"],["eslint-plugin-playwright","https://github.com/playwright-community/eslint-plugin-playwright","Instale no seu projeto"]],
 x:"Refatore sua suíte do SauceDemo: login via fixture, Page Objects, dados isolados e lint. Rode os testes em ordem aleatória e em paralelo.",
 lab:`npx playwright test --workers=4
npx playwright test --repeat-each=3`,
 cc:["Meus testes passam em paralelo e repetidos","Nenhum teste usa waitForTimeout","O lint roda sem erros"]},

{s:"e3",t:"Massa de dados de teste",p:P,pr:ES,
 d:"Criar, controlar e limpar os dados que os testes usam.",
 est:["Dados fixos × dados dinâmicos","Faker para gerar dados realistas","Testes guiados por dados (CSV, JSON)","Criar dados por API antes do teste","Limpar o que o teste criou","Mascaramento de dados reais"],
 tech:["Faker","Data-driven","CSV","JSON","Test data management"],
 l:[["Faker – guia","https://fakerjs.dev/guide/","Instalação e uso básico"],["Playwright – parametrizar testes","https://playwright.dev/docs/test-parameterize","Rodar o mesmo teste com vários dados"]],
 x:"Gere usuários com Faker e crie-os no ServeRest antes de cada teste. Faça um teste de login guiado por um arquivo JSON com 5 combinações de usuário e senha.",
 lab:`npm install -D @faker-js/faker

import { faker } from '@faker-js/faker';
const usuario = {
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  administrador: 'true'
};`,
 cc:["Meus testes criam os próprios dados","Tenho um teste guiado por arquivo","Sei por que dados reais não entram em teste"]},

{s:"e3",t:"Escolha de camada",p:A,pr:ES,
 d:"Unidade, API ou UI, e por quê.",
 est:["Custo e velocidade de cada camada","Pirâmide × troféu de testes","O que só a UI consegue verificar","Quando mover um teste de UI para API preserva a cobertura"],
 tech:["Pirâmide","Troféu de testes","Integração"],
 l:[["The Practical Test Pyramid","https://martinfowler.com/articles/practical-test-pyramid.html","A partir de “Unit tests” até “UI tests”"],["The Testing Trophy","https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications","O texto inteiro"]],
 x:"Pegue 3 testes de UI da sua suíte. Para cada um, decida se a verificação principal é de regra de negócio (pode ir para a API) ou de interface (fica na UI). Mova os que puder e compare o tempo de execução.",
 cc:["Justifico a camada de cada teste","Movi testes sem perder o que eles verificavam","Medi o ganho de tempo"]},

{s:"e3",t:"TDD, BDD e ATDD",p:C,pr:DF,
 d:"Três formas de usar testes para guiar o desenvolvimento.",
 est:["TDD: vermelho, verde, refatorar","BDD: comportamento descrito em exemplos","ATDD: critérios de aceite como testes","Quando cada uma faz sentido"],
 tech:["TDD","BDD","ATDD","Cucumber"],
 l:[["Test Driven Development – Martin Fowler","https://martinfowler.com/bliki/TestDrivenDevelopment.html","O texto inteiro"],["playwright-bdd","https://github.com/vitalets/playwright-bdd","Exemplo de Gherkin com Playwright"]],
 x:"Implemente a função podeCadastrar de novo com TDD: escreva um teste que falha, faça passar, refatore. Repita para cada regra.",
 cc:["Fiz um ciclo completo de TDD","Explico a diferença entre TDD, BDD e ATDD"]},

{s:"e3",t:"Mocks e virtualização de serviços",p:P,pr:DFF,
 d:"Simular dependências para testar o que importa, sem depender de serviços instáveis.",
 est:["Mock, stub e fake","Interceptar requisições no Playwright","Simular erros e lentidão de um serviço","Quando NÃO usar mock: o risco que ele esconde"],
 tech:["Mocks","Stubs","page.route","WireMock"],
 l:[["Playwright – mock APIs","https://playwright.dev/docs/mock","Interceptar e responder requisições"],["WireMock","https://wiremock.org/docs/","Para virtualizar APIs fora do navegador"]],
 x:"No Practice Software Testing, intercepte a requisição de produtos e devolva uma lista vazia, um erro 500 e uma resposta lenta. Verifique como a interface reage em cada caso.",
 cc:["Simulei erro, vazio e lentidão","Sei explicar quando o mock esconde um risco"]},

{s:"e3",t:"Boas práticas de código e revisão",p:P,pr:ES,
 d:"Código de teste revisado e versionado como código de produção.",
 est:["Clean code aplicado a testes","Fluxo de branches: Gitflow e trunk-based","Pull request pequeno e bem descrito","Quality gate: o que bloqueia um merge","Análise estática com SonarQube"],
 tech:["Clean code","Gitflow","Pull request","Quality gate","SonarQube"],
 l:[["Gitflow – Atlassian","https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow","O tutorial inteiro"],["SonarQube","https://www.sonarsource.com/products/sonarqube/","Visão geral; o SonarCloud é gratuito para repositórios públicos"]],
 x:"Conecte seu repositório público ao SonarCloud, corrija 5 apontamentos e configure uma regra que impede o merge se os testes falharem.",
 cc:["Meus PRs são pequenos e descritos","Tenho análise estática rodando","Um teste falhando bloqueia o merge"]},

{s:"e3",t:"CI/CD",p:A,pr:ES,
 d:"Rodar testes a cada mudança, ler falhas do pipeline e publicar relatórios.",
 est:["Integração, entrega e implantação contínuas","GitHub Actions: workflow, job, step","Rodar testes a cada pull request","Publicar relatórios e artefatos","Jenkins e GitLab CI: o que muda","Paralelismo e cache"],
 tech:["GitHub Actions","Jenkins","GitLab CI","Allure","Paralelismo"],
 l:[["Playwright – CI com GitHub Actions","https://playwright.dev/docs/ci-intro","A página inteira: o workflow pronto"],["GitHub Actions – documentação","https://docs.github.com/en/actions","Seção “Understanding GitHub Actions”"],["Jenkins – documentação","https://www.jenkins.io/doc/","Seção “Pipeline”, para conhecer"]],
 x:"Configure o GitHub Actions para rodar sua suíte a cada pull request e publicar o relatório como artefato. Quebre um teste de propósito e veja o pipeline falhar.",
 cc:["Minha suíte roda a cada pull request","O relatório fica disponível no pipeline","Sei ler a falha de um job"]},

{s:"e3",t:"Docker e containers",p:P,pr:ES,
 d:"Subir aplicações, bancos e navegadores em containers para testar de forma reproduzível.",
 est:["Imagem, container, volume e porta","docker run, ps, logs, exec, stop","Docker Compose: vários serviços juntos","Rodar a aplicação em teste num container","Rodar os testes Playwright dentro de um container","Testcontainers: containers criados pelo próprio teste"],
 tech:["Docker","Docker Compose","Testcontainers","Imagens"],
 l:[["Docker – get started","https://docs.docker.com/get-started/","Partes 1 a 4"],["Playwright – Docker","https://playwright.dev/docs/docker","Rodar testes na imagem oficial"],["Testcontainers para Node.js","https://testcontainers.com/guides/getting-started-with-testcontainers-for-nodejs/","O guia inteiro: PostgreSQL criado pelo próprio teste"]],
 x:"Suba o Juice Shop e um PostgreSQL com Docker Compose, rode seus testes contra o Juice Shop e depois rode os mesmos testes dentro da imagem oficial do Playwright.",
 lab:`# docker-compose.yml
services:
  app:
    image: bkimminich/juice-shop
    ports: ["3000:3000"]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: teste
    ports: ["5432:5432"]

# Depois, no terminal, na pasta do arquivo:
docker compose up -d
docker compose ps
docker compose logs app
docker compose down`,
 cc:["Subo e derrubo um ambiente com um comando","Leio os logs de um container","Rodei testes dentro de um container"]},

{s:"e3",t:"Execução em escala",p:P,pr:DF,
 d:"Testes headless, paralelos e distribuídos em vários navegadores.",
 est:["Modo headless e quando usar","Paralelismo e sharding","Vários navegadores e dispositivos","Selenium Grid","Nuvens de dispositivos (BrowserStack, Sauce Labs)"],
 tech:["Headless","Sharding","Selenium Grid","BrowserStack"],
 l:[["Playwright – paralelismo","https://playwright.dev/docs/test-parallel","Workers e sharding"],["Selenium Grid","https://www.selenium.dev/documentation/grid/","Visão geral e modo standalone"]],
 x:"Rode sua suíte em Chromium, Firefox e WebKit, dividida em 2 shards. Suba um Selenium Grid com Docker e abra o painel.",
 lab:`npx playwright test --shard=1/2
npx playwright test --shard=2/2

docker run -d -p 4444:4444 --shm-size="2g" selenium/standalone-chrome
# Painel: http://localhost:4444`,
 cc:["Rodei em 3 navegadores","Dividi a suíte em shards","Subi um Selenium Grid"]},

{s:"e3",t:"Regressão visual",p:P,pr:DF,
 d:"Comparar capturas de tela para detectar mudanças visuais não intencionais.",
 est:["Captura de referência e comparação","Tolerância e áreas ignoradas","Por que rodar sempre no mesmo ambiente","Atualizar as referências com critério"],
 tech:["Playwright snapshots","Regressão visual","toHaveScreenshot"],
 l:[["Playwright – visual comparisons","https://playwright.dev/docs/test-snapshots","A página inteira"]],
 x:"Crie testes visuais para a página de produtos do SauceDemo e compare o standard_user com o visual_user.",
 cc:["Tenho testes visuais com referência","Detectei a diferença do visual_user","Sei quando atualizar uma referência"]},

{s:"e3",t:"Testes instáveis",p:P,pr:ES,
 d:"Medir, achar a causa e usar quarentena com dono e prazo.",
 est:["Causas comuns: tempo, dados, ordem, ambiente","Medir a taxa de instabilidade","Trace Viewer para investigar","Quarentena com dono e prazo","Retry esconde problema"],
 tech:["Flaky rate","Trace Viewer","Quarentena"],
 l:[["Flaky Tests at Google","https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html","O texto inteiro"],["Playwright – Trace Viewer","https://playwright.dev/docs/trace-viewer","Gravar e abrir traces"]],
 x:"Rode a suíte 20 vezes, liste os testes instáveis, investigue um com o Trace Viewer e corrija a causa.",
 lab:`npx playwright test --repeat-each=20 --reporter=line`,
 cc:["Medi a taxa de instabilidade","Corrigi a causa de um teste instável","Não usei retry para esconder"]},

{s:"e3",t:"Análise de causa raiz",p:P,pr:DF,
 d:"Ir além do sintoma e descobrir por que o defeito aconteceu, para evitar que se repita.",
 est:["5 porquês","Diagrama de Ishikawa (espinha de peixe)","Causa raiz × causa imediata","Ações que evitam a repetição"],
 tech:["RCA","5 porquês","Ishikawa"],
 l:[["What is root cause analysis? – Elastic","https://www.elastic.co/what-is/root-cause-analysis","O texto inteiro"]],
 x:"Pegue um bug que você relatou e faça os 5 porquês até chegar a uma causa que o time poderia corrigir no processo.",
 cc:["Fiz uma análise de causa raiz completa","Propus uma ação que evita a repetição"]},

{s:"e3",t:"Testes de e-mail e notificações",p:C,pr:DF,
 d:"Verificar e-mails de cadastro, recuperação de senha e notificações.",
 est:["Caixas de e-mail de teste","Servidor SMTP falso local","Verificar conteúdo, links e destinatário","Automatizar a leitura do e-mail"],
 tech:["Mailpit","Mailinator","SMTP"],
 l:[["Mailpit","https://mailpit.axllent.org/","Servidor de e-mail falso para testes"],["Mailinator","https://www.mailinator.com/","Caixas públicas temporárias"]],
 x:"Suba o Mailpit, envie um e-mail de teste com o script do laboratório e verifique o assunto, o destinatário e o link no painel.",
 lab:`docker run -d -p 8025:8025 -p 1025:1025 axllent/mailpit
# Painel: http://localhost:8025

npm install nodemailer
node -e "require('nodemailer').createTransport({host:'localhost',port:1025}).sendMail({from:'loja@teste.com',to:'ana@teste.com',subject:'Recupere sua senha',html:'<a href=\\"https://exemplo.com/reset?t=123\\">Redefinir</a>'}).then(()=>console.log('enviado'))"`,
 cc:["Recebi o e-mail no Mailpit","Conferi assunto, destinatário e link"]},

{s:"e3",t:"Bancos NoSQL",p:C,pr:DF,
 d:"Validar dados que não estão em tabelas: documentos, chave-valor, cache.",
 est:["Documento × tabela","Consultas básicas no MongoDB","Redis como cache","Quando o dado em cache diverge do banco"],
 tech:["MongoDB","Redis","Documentos JSON"],
 l:[["MongoDB – CRUD","https://www.mongodb.com/docs/manual/crud/","Insert, find, update e delete"],["Redis – get started","https://redis.io/docs/latest/get-started/","Comandos básicos"]],
 x:"Suba um MongoDB com Docker, insira os documentos do laboratório e encontre os dados inconsistentes com consultas.",
 lab:`docker run -d --name mongo -p 27017:27017 mongo:7
docker exec -it mongo mongosh

use loja
db.clientes.insertMany([
  {nome:"Ana", email:"ana@teste.com", pedidos:[{id:1,total:150}]},
  {nome:"Bruno", email:null, pedidos:[]},
  {nome:"Carla", email:"carla@teste.com", pedidos:[{id:2,total:-10}]}
])
db.clientes.find({email:null})
db.clientes.find({"pedidos.total": {$lt: 0}})`,
 cc:["Subi um MongoDB e consultei documentos","Encontrei os dados inconsistentes"]},

{s:"e3",t:"Mensageria e eventos",p:C,pr:DF,
 d:"Sistemas que conversam por filas: mensagens duplicadas, fora de ordem ou perdidas.",
 est:["Produtor, fila e consumidor","Entrega pelo menos uma vez: por que duplica","Idempotência: processar duas vezes sem efeito duplo","Fila de mensagens mortas (DLQ)","Ordem das mensagens"],
 tech:["RabbitMQ","Kafka","Filas","Idempotência","DLQ"],
 l:[["RabbitMQ – tutoriais","https://www.rabbitmq.com/tutorials","Tutorial 1 (Hello World) e 2 (Work Queues)"],["Apache Kafka – introdução","https://kafka.apache.org/intro","Conceitos básicos"]],
 x:"Suba o RabbitMQ, crie a fila pedidos e publique a mesma mensagem duas vezes pelo painel. A regra esperada é: um pedido com o mesmo id só pode ser processado uma vez. Escreva os casos de teste que verificariam essa regra num sistema real.",
 lab:`docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
# Painel: http://localhost:15672  (usuário guest, senha guest)
# Queues > Add queue: pedidos
# Na fila, use "Publish message" duas vezes com o corpo:
{"pedidoId": 42, "valor": 150}`,
 cc:["Publiquei e consumi mensagens","Explico por que mensagens duplicam","Escrevi casos para idempotência"]},

{s:"e3",t:"Cloud básico",p:C,pr:DF,
 d:"Onde os sistemas rodam: serviços, regiões, logs e custos.",
 est:["Computação, armazenamento e banco gerenciado","Regiões e disponibilidade","Onde ficam os logs","Custos e por que desligar o que não usa"],
 tech:["AWS","Azure","GCP","Logs na nuvem"],
 l:[["AWS – getting started","https://aws.amazon.com/getting-started/","Tutorial de uma aplicação simples"],["Microsoft Learn – conceitos de nuvem","https://learn.microsoft.com/pt-br/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/","Módulos de conceitos de nuvem"]],
 x:"Faça o caminho de conceitos de nuvem da Microsoft Learn e anote onde ficam os logs de uma aplicação em cada provedor.",
 cc:["Explico os serviços básicos de nuvem","Sei onde procurar logs de uma aplicação"]},

{s:"e3",t:"Logs e métricas",p:P,pr:DFF,
 d:"Usar observabilidade para investigar problemas.",
 est:["Logs, métricas e traces","Logs estruturados","Correlation ID","Painéis no Grafana","Erros no Sentry"],
 tech:["Grafana","Kibana","Sentry","Logs estruturados"],
 l:[["OpenTelemetry – observability primer","https://opentelemetry.io/docs/concepts/observability-primer/","A página inteira"],["Grafana – documentação","https://grafana.com/docs/grafana/latest/","Seção de primeiros passos"]],
 x:"Provoque um erro no Juice Shop, encontre a linha correspondente com docker compose logs e descreva o caminho do sintoma até a causa.",
 cc:["Diferencio log, métrica e trace","Investiguei um erro pelos logs"]},

{s:"e3",t:"Performance básica",p:C,pr:DF,
 d:"Um teste de carga simples e a leitura de p95 e taxa de erro.",
 est:["Tempo de resposta, vazão e taxa de erro","Percentis: p50, p95, p99","Tipos: carga, estresse, pico, resistência","Thresholds","Lighthouse para o front-end"],
 tech:["k6","p95 / p99","Thresholds","Lighthouse"],
 l:[["k6 – documentação","https://grafana.com/docs/k6/latest/","Get started e Thresholds"]],
 x:"Escreva um teste k6 para o endpoint GET /produtos do ServeRest com 10 usuários por 30 segundos e thresholds de p95 e taxa de erro. Use poucos usuários: é uma API pública.",
 lab:`import http from 'k6/http';
import { check } from 'k6';
export const options = {
  vus: 10, duration: '30s',
  thresholds: { http_req_duration: ['p(95)<800'], http_req_failed: ['rate<0.01'] }
};
export default function () {
  const r = http.get('https://serverest.dev/produtos');
  check(r, { 'status 200': (res) => res.status === 200 });
}
// k6 run teste.js`,
 cc:["Rodei um teste k6 com thresholds","Sei ler p95 e taxa de erro"]},

{s:"e3",t:"Segurança no pipeline",p:P,pr:ES,
 d:"OWASP Top 10, dependências, segredos no repositório e scan básico.",
 est:["OWASP Top 10","Análise de dependências (SCA)","Segredos no repositório","Scan dinâmico (DAST) com ZAP","Varredura de vulnerabilidades no pipeline"],
 tech:["OWASP ZAP","Dependabot","Secret scanning","OWASP Top 10"],
 l:[["OWASP Top 10","https://owasp.org/www-project-top-ten/","Leia os 10 itens"],["ZAP – getting started","https://www.zaproxy.org/getting-started/","Baseline scan"],["GitHub – code security","https://docs.github.com/en/code-security","Dependabot e secret scanning"]],
 x:"Ative Dependabot e secret scanning no seu repositório e rode o ZAP baseline contra o Juice Shop local.",
 lab:`docker run --rm --network host -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://localhost:3000`,
 cc:["Dependabot e secret scanning ativos","Rodei o ZAP e li o relatório"]},

{s:"e3",t:"Contratos de API",p:C,pr:DF,
 d:"Consumidor e fornecedor concordando sobre a API.",
 est:["O que é um contrato","Validação contra schema OpenAPI","Testes de contrato guiados pelo consumidor (Pact)","Testes gerados a partir do schema (Schemathesis)"],
 tech:["OpenAPI","Pact","Schemathesis"],
 l:[["Pact – documentação","https://docs.pact.io/","5 minute guide"],["Schemathesis","https://schemathesis.readthedocs.io/en/stable/","Quick start"]],
 x:"Valide as respostas do ServeRest contra um JSON Schema que você escrever para /produtos.",
 cc:["Escrevi um schema e validei respostas contra ele","Explico teste de contrato"]},

{s:"e3",t:"MCP na prática",p:P,pr:DFF,ia:true,
 d:"Dar ao assistente acesso controlado a navegador, repositório e board, para ele trabalhar com contexto real.",
 est:["O que é MCP e o que ele acrescenta às ferramentas do assistente","Cliente e servidor MCP","Playwright MCP e Chrome DevTools MCP","GitHub MCP e Atlassian MCP","Permissões mínimas e revisão do que o agente faz"],
 tech:["Playwright MCP","Chrome DevTools MCP","GitHub MCP","Atlassian MCP"],
 l:[["Model Context Protocol","https://modelcontextprotocol.io/","Introdução e arquitetura"],["Playwright MCP","https://github.com/microsoft/playwright-mcp","README: instalação no seu cliente"],["GitHub MCP Server","https://github.com/github/github-mcp-server","README"]],
 x:"Configure o Playwright MCP no seu assistente e peça para ele comparar o problem_user com o standard_user no SauceDemo. Confira cada achado manualmente.",
 lab:`{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}`,
 cc:["Configurei um servidor MCP","Confirmei ou descartei cada achado do agente"]},

{s:"e3",t:"Agentes de teste",p:P,pr:ES,ia:true,
 d:"Agentes que planejam, geram e corrigem testes. Seu papel é revisar seletores, asserções e cobertura.",
 est:["Planner, Generator e Healer do Playwright","Seed test e plano em Markdown","Revisar seletores e asserções gerados","Quando o Healer esconde um bug"],
 tech:["Playwright Test Agents","Planner / Generator / Healer","Claude Code","Copilot"],
 l:[["Playwright Test Agents","https://playwright.dev/docs/test-agents","A página inteira"]],
 x:"Gere uma suíte com Planner e Generator para o SauceDemo e escreva no README tudo o que você corrigiu. Quebre um seletor e veja o que o Healer faz.",
 lab:`npx playwright init-agents --loop=vscode`,
 cc:["Gerei testes com agentes","Documentei as correções","Vi o Healer agir e avaliei se escondeu algo"]},

{s:"e3",t:"Testar features de IA",p:P,pr:DFF,ia:true,
 d:"Respostas inventadas, fora de escopo e inconsistentes.",
 est:["Não determinismo: a mesma pergunta, respostas diferentes","Golden dataset","Rubricas de avaliação","Prompt injection básico"],
 tech:["Promptfoo","Golden dataset","Rubricas"],
 l:[["Promptfoo – getting started","https://www.promptfoo.dev/docs/getting-started/","Primeira avaliação"],["Your AI Product Needs Evals","https://hamel.dev/blog/posts/evals/","O texto inteiro"]],
 x:"Faça 10 perguntas a um chatbot, 5 vezes cada, e classifique as variações com uma rubrica simples (correta, incompleta, inventada).",
 cc:["Tenho um dataset com rubrica","Medi a variação das respostas"]},

/* =================== ETAPA 4 — ESPECIALIZAÇÃO =================== */
{s:"e4",t:"SDET / Automação",p:AP,pr:ESC,
 d:"Arquitetura de testes, contratos, ambientes efêmeros e pipeline por camadas.",
 est:["Arquitetura de frameworks de teste","Bibliotecas compartilhadas entre times","Ambientes efêmeros por pull request","Kubernetes básico","Pipeline por camadas e quality gates"],
 tech:["Playwright","Pact","Testcontainers","Kubernetes","Sharding"],
 l:[["awesome-playwright","https://github.com/mxschmitt/awesome-playwright","Ferramentas do ecossistema"],["Kubernetes – conceitos","https://kubernetes.io/docs/concepts/overview/","Pods, Deployments e Services"]],
 x:"Transforme seus utilitários de teste numa biblioteca que outro projeto consiga instalar e usar.",
 cc:["Outro projeto reutiliza meu código de teste","Explico os conceitos básicos de Kubernetes"]},

{s:"e4",t:"Qualidade de IA e agentes",p:AP,pr:ESC,ia:true,
 d:"Evals, RAG, agentes, servidores MCP, red teaming e estatística de avaliação.",
 est:["Estatística de avaliação: amostra, variância, concordância","Fundamentos de ML: classificação, precisão, recall","Evals e LLM-as-a-judge calibrado","Avaliação de RAG","Agentes: trajetória, ferramentas e efeito final","Testar servidores MCP","Red teaming e OWASP LLM e Agentic Top 10"],
 tech:["Promptfoo","Ragas","DeepEval","Langfuse","MCP Inspector","LLM-as-a-judge"],
 l:[["Your AI Product Needs Evals","https://hamel.dev/blog/posts/evals/","O texto inteiro"],["OWASP LLM Top 10","https://genai.owasp.org/llm-top-10/","Os 10 riscos"],["OWASP Agentic Top 10","https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/","Os riscos de agentes"]],
 x:"Crie uma suíte de evals que compare duas versões de um assistente e decida qual pode ir para produção, com critério escrito.",
 cc:["Tenho evals versionadas com critério de aprovação","Calibrei um avaliador automático com avaliação humana"]},

{s:"e4",t:"Segurança",p:AP,pr:ESC,
 d:"Threat modeling, ASVS/WSTG, API Security, supply chain e segurança de LLM.",
 est:["Modelagem de ameaças","OWASP WSTG e ASVS","Burp Suite","Supply chain e SBOM","Segurança de LLM e agentes"],
 tech:["Burp Suite","OWASP ZAP","ASVS","WSTG","SBOM"],
 l:[["PortSwigger Web Security Academy","https://portswigger.net/web-security","Trilhas completas de cada vulnerabilidade"],["OWASP WSTG","https://owasp.org/www-project-web-security-testing-guide/stable/","Use como roteiro de testes"]],
 x:"Resolva todos os desafios de 1 e 2 estrelas do Juice Shop e documente cada um com causa e correção.",
 cc:["Resolvi os desafios de 1 e 2 estrelas","Fiz uma modelagem de ameaças de um sistema"]},

{s:"e4",t:"Performance e confiabilidade",p:AP,pr:ESC,
 d:"Modelagem de carga, SLO, observabilidade e resiliência.",
 est:["Tipos: carga, estresse, pico, resistência, escalabilidade","Modelar carga a partir do uso real","Testes distribuídos","Monitoramento durante o teste","SLO e capacidade","Injeção de falhas"],
 tech:["k6","Gatling","JMeter","OpenTelemetry","Toxiproxy"],
 l:[["k6 – tipos de teste","https://grafana.com/docs/k6/latest/testing-guides/test-types/","Todos os tipos"],["Google SRE – SLOs","https://sre.google/sre-book/service-level-objectives/","O capítulo inteiro"]],
 x:"Encontre o limite de uma API rodando localmente (ex.: Juice Shop em Docker) e explique o gargalo com métricas.",
 cc:["Rodei os 4 tipos de teste de performance","Expliquei um gargalo com métricas"]},

{s:"e4",t:"Mobile",p:AP,pr:ESC,
 d:"Android e iOS, automação, matriz de dispositivos e segurança mobile.",
 est:["Maestro para fluxos rápidos","Appium para controle profundo","Matriz de dispositivos por risco","Nuvens de dispositivos","OWASP MASVS"],
 tech:["Maestro","Appium","MASVS","BrowserStack"],
 l:[["Maestro – documentação","https://docs.maestro.dev/","Getting started"],["Appium – documentação","https://appium.io/docs/en/latest/","Quickstart"]],
 x:"Automatize uma jornada do My Demo App com Maestro em dois perfis de dispositivo.",
 cc:["Automatizei uma jornada mobile","Montei uma matriz de dispositivos justificada"]},

{s:"e4",t:"Dados",p:AP,pr:ESC,
 d:"ETL, reconciliação, qualidade de dados, eventos e filas.",
 est:["SQL avançado: janelas, CTEs","Reconciliação origem e destino","Testes de qualidade de dados","Pipelines de dados e eventos"],
 tech:["SQL avançado","ETL","Kafka","dbt tests"],
 l:[["dbt – data tests","https://docs.getdbt.com/docs/build/data-tests","Testes genéricos e singulares"]],
 x:"Mostre que uma carga de dados não perdeu nem duplicou registros nas condições testadas.",
 cc:["Fiz uma reconciliação completa","Escrevi testes de qualidade de dados"]},

/* =================== ETAPA 5 — EVOLUÇÃO SÊNIOR =================== */
{s:"e5",t:"Estratégia de qualidade",p:AP,pr:ES,
 d:"Risco, camadas, critérios de liberação e risco residual em linguagem de negócio.",
 est:["Estratégia baseada em risco","Distribuição de testes por camada","Critérios de liberação","Comunicar risco residual"],
 tech:["HTSM","Release readiness","Risco residual"],
 l:[["Heuristic Test Strategy Model","https://www.satisfice.com/download/heuristic-test-strategy-model","O modelo inteiro"]],
 x:"Escreva a estratégia de qualidade de um produto em uma página e apresente para alguém de negócio.",
 cc:["Minha estratégia foi entendida por alguém de negócio"]},

{s:"e5",t:"Métricas que decidem",p:AP,pr:ES,
 d:"Tempo até feedback, defeitos escapados, flaky rate e incidentes, não contagem de casos.",
 est:["Métricas DORA","Defeitos escapados","Taxa de instabilidade","Métricas que enganam"],
 tech:["DORA","Defeitos escapados","Flaky rate"],
 l:[["DORA","https://dora.dev/","As 4 métricas principais"]],
 x:"Escolha 3 métricas para o seu time e explique que decisão cada uma apoia.",
 cc:["Cada métrica que proponho apoia uma decisão"]},

{s:"e5",t:"Observabilidade e produção",p:AP,pr:DF,
 d:"Testar em produção com segurança: SLO, monitoramento, alertas, feature flags e canary.",
 est:["SLI, SLO e error budget","Monitoramento e alertas (Grafana, Datadog)","Feature flags","Canary e rollback","Smoke pós-deploy"],
 tech:["OpenTelemetry","SLO","Grafana","Datadog","Feature flags"],
 l:[["OpenFeature","https://openfeature.dev/docs/reference/intro/","Introdução"],["Google SRE Book","https://sre.google/sre-book/table-of-contents/","Capítulos de monitoramento"]],
 x:"Proponha um smoke pós-deploy e o alerta que dispararia um rollback.",
 cc:["Defini SLO, alerta e critério de rollback"]},

{s:"e5",t:"Qualidade como cultura",p:AP,pr:ES,
 d:"O time inteiro testando, com QA ensinando em vez de testar sozinho.",
 est:["Quality assistance","Modern Testing","Postmortem sem culpa","Teste em par com desenvolvedores"],
 tech:["Quality assistance","Modern Testing","Postmortem sem culpa"],
 l:[["Quality Assistance – Atlassian","https://www.atlassian.com/inside-atlassian/qa","O texto inteiro"],["How They Test","https://abhivaikar.github.io/howtheytest/","Compare duas empresas"]],
 x:"Conduza uma sessão de teste em par com um desenvolvedor.",
 cc:["Um desenvolvedor passou a testar algo que antes só eu testava"]},

{s:"e5",t:"Política de IA no time",p:AP,pr:ES,ia:true,
 d:"O que pode ser gerado, quem revisa, quais servidores MCP são permitidos e que dados nunca entram.",
 est:["Governança de IA","Dados permitidos e proibidos","Revisão obrigatória","Permissões de MCP e agentes"],
 tech:["NIST AI RMF","Governança","LGPD","Permissões de MCP"],
 l:[["NIST AI RMF","https://www.nist.gov/itl/ai-risk-management-framework","Visão geral"]],
 x:"Escreva uma política de uma página para o uso de IA e MCP nos testes.",
 cc:["O time adotou a política"]},

{s:"e5",t:"Liderança e mentoria",p:AP,pr:ES,
 d:"Mentorar, negociar escopo e influenciar sem autoridade formal.",
 est:["Mentoria","Negociar escopo e risco","Comunicação com negócio","Inglês para reuniões técnicas"],
 tech:["Mentoria","Comunicação","Inglês"],
 l:[["Ministry of Testing","https://www.ministryoftesting.com/","Artigos sobre liderança em testes"]],
 x:"Mentore alguém da Etapa 1 por um mês e registre a evolução.",
 cc:["Alguém evoluiu com a minha mentoria"]},

{s:"e5",t:"Carreira em Y e caminhos",p:AP,pr:ESC,
 d:"Gestão ou especialista: QA Sênior, Quality Engineer, SDET, QA Lead, Arquiteto de testes. Os títulos variam entre empresas.",
 est:["Carreira em Y: gestão × especialista","Diferenças entre QA Sênior, QE e SDET","O que muda em QA Lead e Arquiteto","Como escolher o próximo passo"],
 tech:["QA Sênior","Quality Engineer","SDET","QA Lead","Especialista"],
 l:[],
 x:"Compare três descrições de vaga sênior (gestão, QE e SDET) e anote as diferenças de atuação e o que você já demonstra.",
 cc:["Sei qual caminho quero e o que falta para ele"]}
];

/* id estável a partir do título: o progresso salvo não se perde quando novos tópicos são inseridos */
JQA.slug = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
JQA.TOPICS.forEach(o=>{ o.id = o.s + "-" + JQA.slug(o.t); });
})();
