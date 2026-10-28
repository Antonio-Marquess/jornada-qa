window.JQA = window.JQA || {};
/* Matriz de competências da Jornada QA (aba Autoavaliação).
 * Área › competência (tecnologia ou assunto) › níveis 1 a 3, cada um com frases que dá para verificar.
 *   Nível 1 — Conheço: explico com minhas palavras e dou exemplo.
 *   Nível 2 — Pratico: já fiz em exercício ou projeto de estudo, mesmo consultando.
 *   Nível 3 — Domino: faço sozinho em situação real e consigo ensinar.
 * A pessoa escolhe o nível com um clique; as frases explicam o que cada nível significa.
 * Campos da competência: id, t (nome), d (o que é), topicos (ids de tópicos da trilha), n1, n2, n3 (frases). */
JQA.COMPETENCIAS = [
{id:"fund", t:"Fundamentos de teste", d:"Como pensar, projetar e comunicar testes, com ou sem código.", itens:[
  {id:"tecnicas", t:"Técnicas de projeto de teste", topicos:["e1-tecnicas-de-projeto","e1-fundamentos-de-teste"],
   n1:["Explico partição de equivalência, valor limite e tabela de decisão com um exemplo","Diferencio teste caixa-preta de caixa-branca"],
   n2:["Já derivei casos de teste de um requisito real usando pelo menos duas técnicas","Uso transição de estados ou pairwise quando a regra pede"],
   n3:["Escolho a técnica pelo risco sem consultar material","Reviso casos de outras pessoas e aponto lacunas de cobertura"]},
  {id:"exploratorio", t:"Teste exploratório", topicos:["e1-teste-exploratorio"],
   n1:["Explico o que é um charter e uma sessão com tempo definido","Conheço pelo menos duas heurísticas de exploração"],
   n2:["Já fiz sessões com charter e anotações de cobertura","Encontrei bugs que não estavam em nenhum caso escrito"],
   n3:["Planejo exploração por risco para uma entrega inteira","Ensino ou conduzo sessões em dupla com outras pessoas"]},
  {id:"bugs", t:"Relato e investigação de bugs", topicos:["e1-relato-de-bug","e3-analise-de-causa-raiz"],
   n1:["Escrevo bug com passos, esperado, obtido e ambiente","Diferencio severidade de prioridade"],
   n2:["Investigo com DevTools, logs ou banco antes de abrir o bug","Meus bugs são corrigidos sem pedido de mais informação"],
   n3:["Conduzo análise de causa raiz e proponho mudança de processo","Ajudo o time a reduzir bugs reabertos ou duplicados"]},
  {id:"risco", t:"Análise de risco e estratégia de teste", topicos:["e1-analise-de-risco","e5-estrategia-de-qualidade"],
   n1:["Explico risco como impacto vezes probabilidade","Sei por que não dá para testar tudo"],
   n2:["Priorizei testes de uma entrega usando uma matriz de risco","Escrevi um plano de teste com escopo e o que fica de fora"],
   n3:["Defino a estratégia de qualidade de um time ou produto","Negocio escopo de teste com produto e desenvolvimento usando dados"]}
]},
{id:"api", t:"Testes de API", d:"Testar serviços pela interface que os sistemas usam entre si.", itens:[
  {id:"http", t:"HTTP e REST", topicos:["e2-http-e-devtools","e2-fundamentos-de-web"],
   n1:["Explico métodos, códigos de status e cabeçalhos","Leio uma requisição e uma resposta na aba Rede do DevTools"],
   n2:["Diferencio erro do cliente (4xx) de erro do servidor (5xx) ao investigar","Entendo autenticação por token e cookies na prática"],
   n3:["Desenho cenários de teste de API a partir do contrato (OpenAPI)","Ensino HTTP para quem está começando"]},
  {id:"postman", t:"Postman ou Bruno", topicos:["e2-testes-de-api","e2-documentacao-de-api-e-newman"],
   n1:["Faço requisições e uso variáveis de ambiente","Sei importar uma coleção ou um Swagger"],
   n2:["Escrevi testes de status, corpo e tempo em uma coleção","Encadeei requisições (criar, consultar, alterar, apagar)"],
   n3:["Rodo a coleção no pipeline (Newman ou CLI do Bruno)","Organizo coleções que o time inteiro usa"]},
  {id:"api-codigo", t:"Testes de API em código", d:"Playwright request, RestAssured, SuperTest, pytest com requests…", topicos:["e2-testes-de-api","e3-automacao-sustentavel"],
   n1:["Explico a vantagem de testar API em código em vez de ferramenta visual","Rodei um exemplo pronto de teste de API"],
   n2:["Escrevi testes de API com asserções de esquema (JSON Schema)","Gero massa de dados pelo próprio teste"],
   n3:["Mantenho uma suíte de API estável no CI","Projetei a estrutura da suíte (clientes, dados, ambientes)"]},
  {id:"contrato", t:"Testes de contrato (Pact)", topicos:["e3-contratos-de-api"],
   n1:["Explico consumidor, fornecedor e por que o contrato evita quebra entre times"],
   n2:["Escrevi um teste de contrato do lado do consumidor","Verifiquei o contrato do lado do fornecedor"],
   n3:["Contratos rodam no pipeline e bloqueiam versões incompatíveis"]}
]},
{id:"web", t:"Automação web", d:"Escolha o framework que você usa ou estuda.", itens:[
  {id:"playwright", t:"Playwright", topicos:["e2-primeira-automacao","e3-automacao-sustentavel","e4-sdet-automacao"],
   n1:["Explico localizadores por papel e a espera automática","Rodei os testes de exemplo e li o relatório HTML"],
   n2:["Escrevi testes com fixtures e page objects","Uso o trace viewer para investigar falhas"],
   n3:["Mantenho uma suíte no CI com paralelismo e repetição controlada","Revejo testes de outras pessoas e corrijo instabilidade pela causa"]},
  {id:"cypress", t:"Cypress", topicos:["e2-primeira-automacao","e3-automacao-sustentavel","e4-sdet-automacao"],
   n1:["Explico a fila de comandos e por que não se usa async/await","Rodei testes no modo interativo"],
   n2:["Escrevi testes com cy.intercept e comandos customizados","Organizo dados de teste com fixtures"],
   n3:["Mantenho uma suíte no CI com paralelismo e relatórios","Resolvo testes instáveis pela causa, sem waits fixos"]},
  {id:"selenium", t:"Selenium WebDriver", topicos:["e2-primeira-automacao","e3-automacao-sustentavel","e4-sdet-automacao"],
   n1:["Explico WebDriver, driver do navegador e localizadores","Rodei um teste simples numa linguagem"],
   n2:["Uso esperas explícitas em vez de pausas fixas","Estruturei testes com page objects"],
   n3:["Rodo testes em paralelo (Grid ou nuvem) no CI","Projetei o framework que o time usa"]},
  {id:"robot", t:"Robot Framework", topicos:["e2-primeira-automacao","e3-tdd-bdd-e-atdd"],
   n1:["Explico keywords, bibliotecas e a estrutura de um arquivo .robot","Rodei uma suíte de exemplo"],
   n2:["Criei keywords próprias e usei a Browser ou a SeleniumLibrary","Uso variáveis e arquivos de recurso"],
   n3:["Mantenho a suíte no CI com relatórios publicados","Escrevi bibliotecas em Python para o time"]}
]},
{id:"mobile", t:"Mobile", itens:[
  {id:"mobile-manual", t:"Teste mobile manual", topicos:["e2-mobile-manual"],
   n1:["Conheço as diferenças entre Android e iOS que afetam teste","Sei o que testar em interrupções, rede e permissões"],
   n2:["Testei um app em dispositivos reais e emuladores","Capturo logs do dispositivo para relatar bugs"],
   n3:["Defino a matriz de dispositivos de um produto por dados de uso"]},
  {id:"appium", t:"Appium", topicos:["e4-mobile"],
   n1:["Explico servidor Appium, drivers e capabilities","Inspecionei elementos com o Appium Inspector"],
   n2:["Escrevi testes automatizados em um app de exemplo","Rodo em emulador e em dispositivo real"],
   n3:["Mantenho a suíte mobile no CI ou em uma nuvem de dispositivos"]}
]},
{id:"prog", t:"Programação", d:"A linguagem que você usa nos testes.", itens:[
  {id:"js-ts", t:"JavaScript e TypeScript", topicos:["e2-programacao-inicial","e3-programacao-solida"],
   n1:["Uso variáveis, funções, arrays e objetos","Entendo async/await e promises"],
   n2:["Escrevo código de teste legível, com funções reaproveitáveis","Uso tipos do TypeScript nos meus testes"],
   n3:["Reviso código de outras pessoas com critério","Aplico padrões de projeto onde fazem sentido"]},
  {id:"python", t:"Python", topicos:["e2-programacao-inicial","e3-programacao-solida"],
   n1:["Uso variáveis, funções, listas e dicionários","Rodo scripts e instalo pacotes com pip"],
   n2:["Escrevo testes com pytest, fixtures e parametrização","Organizo o código em módulos"],
   n3:["Reviso código de outras pessoas com critério","Escrevo ferramentas de apoio que o time usa"]},
  {id:"java", t:"Java", topicos:["e2-programacao-inicial","e3-programacao-solida","e3-orientacao-a-objetos-e-padroes"],
   n1:["Uso classes, métodos e coleções","Rodo um projeto com Maven ou Gradle"],
   n2:["Escrevo testes com JUnit 5 ou TestNG","Aplico orientação a objetos nos meus testes"],
   n3:["Reviso código de outras pessoas com critério","Projetei a estrutura de um framework de testes"]}
]},
{id:"dados", t:"Dados", itens:[
  {id:"sql", t:"SQL", topicos:["e2-sql","e3-massa-de-dados-de-teste"],
   n1:["Faço SELECT com filtros e ordenação","Entendo chave primária e estrangeira"],
   n2:["Uso JOIN e GROUP BY para validar um fluxo","Preparo e limpo massa de dados para testes"],
   n3:["Encontro problemas de dados que a tela não mostra","Escrevo consultas que o time usa para investigar incidentes"]},
  {id:"nosql", t:"MongoDB e NoSQL", topicos:["e3-bancos-nosql"],
   n1:["Explico documento, coleção e diferença para o modelo relacional"],
   n2:["Consulto e altero documentos para preparar testes"],
   n3:["Valido consistência de dados entre serviços com bancos diferentes"]}
]},
{id:"devops", t:"Versionamento, CI e ambientes", itens:[
  {id:"git", t:"Git e GitHub", topicos:["e2-git-e-github"],
   n1:["Faço clone, commit, push e pull","Entendo o que é branch"],
   n2:["Trabalho com branches e pull requests","Resolvo conflitos de merge"],
   n3:["Reviso PRs dos outros","Defino o fluxo de branches com o time"]},
  {id:"ci", t:"CI/CD (GitHub Actions, GitLab CI…)", topicos:["e3-ci-cd","e3-execucao-em-escala"],
   n1:["Explico o que é pipeline e por que testes rodam nele"],
   n2:["Configurei um pipeline que roda testes a cada push","Publico relatórios e evidências no pipeline"],
   n3:["Otimizo o tempo do pipeline (paralelismo, cache, seleção de testes)","Defino o que bloqueia o deploy"]},
  {id:"docker", t:"Docker", topicos:["e3-docker-e-containers","e2-linux-e-terminal"],
   n1:["Explico imagem e container","Rodo um container a partir de uma imagem pronta"],
   n2:["Subo ambientes de teste com Docker Compose","Leio logs e entro em containers para investigar"],
   n3:["Escrevi os arquivos que sobem o ambiente de teste do time"]}
]},
{id:"perf", t:"Performance", itens:[
  {id:"k6", t:"k6", topicos:["e3-performance-basica","e4-performance-e-confiabilidade"],
   n1:["Explico carga, estresse e pico","Sei ler percentis (p95, p99)"],
   n2:["Escrevi um script com cenários e thresholds","Analiso o resultado e aponto o gargalo provável"],
   n3:["Testes de performance rodam no pipeline com limites que bloqueiam","Correlaciono resultado com métricas de servidor"]},
  {id:"jmeter", t:"JMeter", topicos:["e3-performance-basica","e4-performance-e-confiabilidade"],
   n1:["Explico thread group, sampler e listener","Sei ler percentis (p95, p99)"],
   n2:["Montei um plano com dados parametrizados e asserções","Rodo pela linha de comando e gero o relatório HTML"],
   n3:["Rodo testes distribuídos ou no pipeline","Correlaciono resultado com métricas de servidor"]}
]},
{id:"seg", t:"Segurança", itens:[
  {id:"owasp", t:"OWASP Top 10", topicos:["e1-seguranca-funcional","e4-seguranca","e3-seguranca-no-pipeline"],
   n1:["Explico as categorias do Top 10 e dou um exemplo de cada","Sei a diferença entre autenticação e autorização"],
   n2:["Encontrei e relatei falhas num ambiente de treino, como o Juice Shop","Uso o Top 10 como checklist ao testar uma funcionalidade"],
   n3:["Incluo testes de segurança na rotina do time","Reviso PR procurando falhas do Top 10"]},
  {id:"owasp-api", t:"OWASP API Security Top 10", topicos:["e2-seguranca-em-api"],
   n1:["Explico BOLA, autenticação quebrada e exposição de dados"],
   n2:["Testei controle de acesso em APIs trocando IDs e tokens"],
   n3:["Esses cenários fazem parte da suíte de API do time"]},
  {id:"proxy", t:"Burp Suite ou OWASP ZAP", topicos:["e4-seguranca"],
   n1:["Explico o que é um proxy de interceptação"],
   n2:["Interceptei e alterei requisições para testar regras","Rodei uma varredura passiva e interpretei os alertas"],
   n3:["Uso a ferramenta para investigar falhas e ensinar o time"]}
]},
{id:"ia", t:"IA para QA", itens:[
  {id:"prompts", t:"Prompts para teste", topicos:["e1-ia-como-tutora","e2-ia-no-dia-a-dia"],
   n1:["Escrevo prompts com contexto, tarefa e formato de saída","Sei que a IA erra e confiro o que ela gera"],
   n2:["Uso IA para gerar casos, dados e scripts, e reviso tudo","Tenho prompts reaproveitáveis para tarefas frequentes"],
   n3:["Defino com o time como e quando usar IA nos testes","Meço se a IA economiza tempo sem perder qualidade"]},
  {id:"mcp", t:"MCP e agentes de teste", topicos:["e3-mcp-na-pratica","e3-agentes-de-teste"],
   n1:["Explico o que é MCP e o que um agente faz"],
   n2:["Usei um servidor MCP (Playwright, por exemplo) para explorar ou gerar testes","Revisei e corrigi testes gerados por agentes"],
   n3:["Integro agentes no fluxo do time com limites claros"]},
  {id:"testar-ia", t:"Testar funcionalidades de IA", topicos:["e3-testar-features-de-ia","e4-qualidade-de-ia-e-agentes"],
   n1:["Explico por que resposta de IA não tem um esperado fixo","Conheço alucinação, viés e injeção de prompt"],
   n2:["Montei um conjunto de avaliação com critérios","Testei injeção de prompt em uma funcionalidade"],
   n3:["Mantenho avaliações automatizadas de uma funcionalidade de IA"]}
]},
{id:"proc", t:"Processo e gestão de qualidade", itens:[
  {id:"bdd", t:"BDD e Gherkin", topicos:["e3-tdd-bdd-e-atdd","e1-revisao-de-requisitos"],
   n1:["Escrevo cenários em Dado, Quando, Então"],
   n2:["Conduzi ou participei de uma conversa de três amigos","Automatizei cenários Gherkin"],
   n3:["Os cenários viraram a documentação viva do produto"]},
  {id:"gestao", t:"Gestão de testes", topicos:["e2-gestao-de-testes","e1-planejamento-e-relatorios-de-teste"],
   n1:["Organizo casos e execuções numa ferramenta de gestão"],
   n2:["Gero relatório de execução que alguém de produto entende"],
   n3:["Defino como o time registra, executa e reporta testes"]},
  {id:"metricas", t:"Métricas de qualidade", topicos:["e5-metricas-que-decidem"],
   n1:["Diferencio métrica que decide de métrica de vaidade"],
   n2:["Acompanho escape de defeitos ou tempo de feedback de um time"],
   n3:["Uso métricas para mudar decisões de produto ou de processo"]},
  {id:"a11y", t:"Acessibilidade (WCAG)", topicos:["e1-acessibilidade"],
   n1:["Explico os princípios da WCAG e testo navegação só por teclado"],
   n2:["Uso axe ou Lighthouse e um leitor de tela para testar uma página"],
   n3:["Acessibilidade faz parte da definição de pronto do time"]}
]}
];

/* Competências exigidas por nível da carreira. ids: qualquer uma delas serve; n: nível mínimo. */
JQA.CARREIRA_COMP = {
  estagiario:[{ids:["tecnicas"], n:1}, {ids:["bugs"], n:1}, {ids:["http"], n:1}],
  junior:[{ids:["tecnicas"], n:2}, {ids:["bugs"], n:2}, {ids:["http"], n:2}, {ids:["postman","api-codigo"], n:2, t:"Testes de API"},
    {ids:["sql"], n:1}, {ids:["git"], n:1}, {ids:["playwright","cypress","selenium","robot"], n:1, t:"Um framework de automação web"},
    {ids:["js-ts","python","java"], n:1, t:"Uma linguagem de programação"}, {ids:["owasp"], n:1}, {ids:["prompts"], n:1}],
  pleno:[{ids:["playwright","cypress","selenium","robot"], n:2, t:"Um framework de automação web"}, {ids:["js-ts","python","java"], n:2, t:"Uma linguagem de programação"},
    {ids:["api-codigo"], n:2}, {ids:["sql"], n:2}, {ids:["ci"], n:2}, {ids:["docker"], n:1}, {ids:["risco"], n:2}, {ids:["exploratorio"], n:2},
    {ids:["k6","jmeter"], n:1, t:"Uma ferramenta de performance"}, {ids:["owasp-api"], n:1}, {ids:["prompts"], n:2}],
  senior:[{ids:["risco"], n:3}, {ids:["playwright","cypress","selenium","robot"], n:3, t:"Um framework de automação web"}, {ids:["ci"], n:2},
    {ids:["metricas"], n:2}, {ids:["owasp"], n:2}, {ids:["k6","jmeter"], n:2, t:"Uma ferramenta de performance"}, {ids:["testar-ia"], n:1}, {ids:["bugs"], n:3}],
  especialista:[{ids:["playwright","cypress","selenium","k6","jmeter","owasp","proxy","appium","mcp","testar-ia"], n:3, t:"Uma especialidade no nível 3"}, {ids:["ci"], n:3}],
  staff:[{ids:["risco"], n:3}, {ids:["metricas"], n:3}, {ids:["ci"], n:3}],
  "lider-tecnico":[{ids:["risco"], n:3}, {ids:["metricas"], n:2}, {ids:["gestao"], n:2}],
  coordenador:[{ids:["metricas"], n:2}, {ids:["gestao"], n:2}],
  gerente:[{ids:["metricas"], n:3}, {ids:["gestao"], n:3}],
  head:[{ids:["metricas"], n:3}]
};
