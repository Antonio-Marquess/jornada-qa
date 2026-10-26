/* Jornada QA — Além do Teste
 * Biblioteca: um único lugar para todos os links.
 * Campos: tipo, t (título), u (URL), e (etapa: e1..e5 ou "todas"), tema, d (por que vale), pago (true quando for pago)
 */
window.JQA = window.JQA || {};

JQA.TIPOS = [
  {id:"artigo", nome:"Artigos"},
  {id:"doc", nome:"Documentação oficial"},
  {id:"pratica", nome:"Para praticar"},
  {id:"repo", nome:"Repositórios"},
  {id:"curso", nome:"Cursos"},
  {id:"canal", nome:"Canais e newsletters"},
  {id:"roadmap", nome:"Roadmaps"},
  {id:"comunidade", nome:"Comunidades"}
];

JQA.LIB = [
 /* Artigos */
 {tipo:"artigo",t:"Exploratory Testing 3.0 – James Bach",u:"https://www.satisfice.com/blog/archives/1509",e:"e1",tema:"Exploratório",d:"O que é explorar de verdade, além de testar sem roteiro."},
 {tipo:"artigo",t:"Heuristic Test Strategy Model (HTSM) v6.3",u:"https://www.satisfice.com/download/heuristic-test-strategy-model",e:"todas",tema:"Estratégia",d:"Checklist de heurísticas para montar uma estratégia de teste."},
 {tipo:"artigo",t:"Session-Based Test Management – Jon Bach (PDF)",u:"http://www.satisfice.com/articles/sbtm.pdf",e:"e1",tema:"Exploratório",d:"Como organizar e prestar contas do teste exploratório."},
 {tipo:"artigo",t:"Testing vs. Checking – Michael Bolton (InfoQ)",u:"https://www.infoq.com/news/2009/12/testing-or-checking/",e:"e1",tema:"Fundamentos",d:"A diferença entre confirmar o esperado e investigar o inesperado."},
 {tipo:"artigo",t:"The Practical Test Pyramid – Ham Vocke",u:"https://martinfowler.com/articles/practical-test-pyramid.html",e:"e3",tema:"Automação",d:"A pirâmide de testes explicada com código de verdade."},
 {tipo:"artigo",t:"The Testing Trophy – Kent C. Dodds",u:"https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications",e:"e3",tema:"Automação",d:"Contraponto à pirâmide, com mais peso em testes de integração."},
 {tipo:"artigo",t:"Software Testing Guide – Martin Fowler",u:"https://martinfowler.com/testing",e:"e3",tema:"Automação",d:"Índice de artigos sobre teste, de dublês a microsserviços."},
 {tipo:"artigo",t:"Flaky Tests at Google",u:"https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html",e:"e3",tema:"Automação",d:"De onde vêm os testes instáveis e como lidar com eles."},
 {tipo:"artigo",t:"Quality Assistance – Atlassian",u:"https://www.atlassian.com/inside-atlassian/qa",e:"e5",tema:"Estratégia",d:"QA que ensina o time a testar em vez de testar sozinho."},
 {tipo:"artigo",t:"Mutation Testing: A Tale of Two Suites – Etsy",u:"https://codeascraft.com/2020/08/17/mutation-testing-a-tale-of-two-suites/",e:"e4",tema:"Automação",d:"Como medir se os testes realmente pegam erros."},
 {tipo:"artigo",t:"Fault Injection Testing – DoorDash",u:"https://doordash.engineering/2022/04/25/using-fault-injection-testing-to-improve-doordash-reliability/",e:"e4",tema:"Performance",d:"Resiliência testada de propósito."},
 {tipo:"artigo",t:"Your AI Product Needs Evals – Hamel Husain",u:"https://hamel.dev/blog/posts/evals/",e:"e3",tema:"IA",d:"O texto de referência sobre avaliar produtos com IA."},
 {tipo:"artigo",t:"Building Effective Agents – Anthropic",u:"https://www.anthropic.com/engineering/building-effective-agents",e:"e4",tema:"IA",d:"Padrões e armadilhas de sistemas com agentes."},
 {tipo:"artigo",t:"ISO/IEC 25010 – modelo de qualidade (arc42)",u:"https://quality.arc42.org/standards/iso-25010",e:"e1",tema:"Fundamentos",d:"As nove características de qualidade e suas subcaracterísticas."},

 /* Documentação oficial */
 {tipo:"doc",t:"Syllabus ISTQB CTFL v4.0.1 (PDF)",u:"https://www.istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf",e:"e1",tema:"Fundamentos",d:"A base teórica internacional, gratuita."},
 {tipo:"doc",t:"MDN – HTTP (em português)",u:"https://developer.mozilla.org/pt-BR/docs/Web/HTTP",e:"e2",tema:"API",d:"Tudo sobre HTTP, com exemplos."},
 {tipo:"doc",t:"Playwright – documentação",u:"https://playwright.dev/docs/intro",e:"e2",tema:"Automação",d:"Comece pelo intro e depois veja as best practices."},
 {tipo:"doc",t:"Playwright Test Agents",u:"https://playwright.dev/docs/test-agents",e:"e3",tema:"IA",d:"Planner, Generator e Healer."},
 {tipo:"doc",t:"Model Context Protocol",u:"https://modelcontextprotocol.io/",e:"e3",tema:"IA",d:"O padrão para conectar assistentes a ferramentas."},
 {tipo:"doc",t:"Anthropic – prompt engineering",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",e:"e2",tema:"IA",d:"Técnicas para escrever prompts claros."},
 {tipo:"doc",t:"k6 – documentação",u:"https://grafana.com/docs/k6/latest/",e:"e3",tema:"Performance",d:"Testes de carga escritos em JavaScript."},
 {tipo:"doc",t:"OWASP API Security Top 10",u:"https://owasp.org/www-project-api-security/",e:"e2",tema:"Segurança",d:"Os riscos mais comuns em APIs."},
 {tipo:"doc",t:"OWASP Top 10 for LLM Applications",u:"https://genai.owasp.org/llm-top-10/",e:"e3",tema:"IA",d:"Prompt injection, vazamento de dados e outros riscos de LLM."},
 {tipo:"doc",t:"OWASP Top 10 for Agentic Applications 2026",u:"https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/",e:"e4",tema:"IA",d:"Riscos específicos de agentes que executam ações."},
 {tipo:"doc",t:"WCAG – W3C",u:"https://www.w3.org/WAI/standards-guidelines/wcag/",e:"e1",tema:"Acessibilidade",d:"O padrão de acessibilidade na web."},
 {tipo:"doc",t:"GitHub Actions",u:"https://docs.github.com/en/actions",e:"e3",tema:"DevOps",d:"CI/CD direto no repositório."},
 {tipo:"doc",t:"Docker – get started",u:"https://docs.docker.com/get-started/",e:"e3",tema:"DevOps",d:"Containers do zero."},
 {tipo:"doc",t:"OpenTelemetry – observability primer",u:"https://opentelemetry.io/docs/concepts/observability-primer/",e:"e3",tema:"DevOps",d:"Logs, métricas e traces explicados."},
 {tipo:"doc",t:"Google SRE Book",u:"https://sre.google/sre-book/table-of-contents/",e:"e5",tema:"Performance",d:"SLOs, monitoramento e confiabilidade."},
 {tipo:"doc",t:"NIST AI Risk Management Framework",u:"https://www.nist.gov/itl/ai-risk-management-framework",e:"e5",tema:"IA",d:"Base para governança de IA."},

 /* Para praticar */
 {tipo:"pratica",t:"Practice Software Testing",u:"https://practicesoftwaretesting.com/",e:"e1",tema:"Exploratório",d:"Loja criada para treino, com interface e API."},
 {tipo:"pratica",t:"AcademyBugs",u:"https://academybugs.com/",e:"e1",tema:"Exploratório",d:"Loja com 25 bugs plantados para você caçar."},
 {tipo:"pratica",t:"test-design.org – exercícios",u:"https://test-design.org/practical-exercises/",e:"e1",tema:"Fundamentos",d:"Exercícios de técnicas de projeto com solução de referência."},
 {tipo:"pratica",t:"Test Pages – EvilTester",u:"https://testpages.eviltester.com/",e:"e1",tema:"Automação",d:"Páginas de treino para teste e automação web."},
 {tipo:"pratica",t:"SauceDemo",u:"https://www.saucedemo.com/",e:"e2",tema:"Automação",d:"Quatro tipos de usuário, inclusive um com bugs e outro lento."},
 {tipo:"pratica",t:"DemoQA",u:"https://demoqa.com/",e:"e2",tema:"Automação",d:"Formulários, widgets e alertas para automação."},
 {tipo:"pratica",t:"API Challenges",u:"https://apichallenges.com/",e:"e2",tema:"API",d:"Desafios de API com modo simulador para iniciantes."},
 {tipo:"pratica",t:"ServeRest",u:"https://serverest.dev/",e:"e2",tema:"API",d:"API brasileira de e-commerce para treino."},
 {tipo:"pratica",t:"Restful Booker",u:"https://automationintesting.online/",e:"e2",tema:"API",d:"Playground de API que se reinicia a cada 10 minutos."},
 {tipo:"pratica",t:"OWASP Juice Shop",u:"https://owasp.org/www-project-juice-shop/",e:"e2",tema:"Segurança",d:"Loja vulnerável de propósito, com desafios."},
 {tipo:"pratica",t:"PortSwigger Web Security Academy",u:"https://portswigger.net/web-security",e:"e3",tema:"Segurança",d:"Laboratórios gratuitos de segurança web."},
 {tipo:"pratica",t:"Sauce Labs My Demo App",u:"https://github.com/saucelabs/my-demo-app-rn",e:"e2",tema:"Mobile",d:"App de treino para Android e iOS."},
 {tipo:"pratica",t:"Ministry of Testing – desafios",u:"https://www.ministryoftesting.com/events",e:"todas",tema:"Fundamentos",d:"Eventos e desafios da comunidade."},

 /* Repositórios */
 {tipo:"repo",t:"Manual_Testing",u:"https://github.com/mfaisalkhatri/Manual_Testing",e:"e1",tema:"Fundamentos",d:"Modelos de casos e planos de teste."},
 {tipo:"repo",t:"software-testing-resource-pack",u:"https://github.com/LukaszLapaj/software-testing-resource-pack",e:"e2",tema:"Fundamentos",d:"Arquivos variados para testar upload e APIs."},
 {tipo:"repo",t:"javascript-testing-best-practices",u:"https://github.com/goldbergyoni/javascript-testing-best-practices",e:"e3",tema:"Automação",d:"Mais de 50 boas práticas com exemplos."},
 {tipo:"repo",t:"awesome-playwright",u:"https://github.com/mxschmitt/awesome-playwright",e:"e3",tema:"Automação",d:"Lista curada de ferramentas e exemplos."},
 {tipo:"repo",t:"playwright-bdd",u:"https://github.com/vitalets/playwright-bdd",e:"e3",tema:"Automação",d:"BDD com Gherkin no runner do Playwright."},
 {tipo:"repo",t:"eslint-plugin-playwright",u:"https://github.com/playwright-community/eslint-plugin-playwright",e:"e3",tema:"Automação",d:"Regras que apontam erros comuns nos testes."},
 {tipo:"repo",t:"Playwright MCP",u:"https://github.com/microsoft/playwright-mcp",e:"e3",tema:"IA",d:"Servidor MCP que dá ao assistente um navegador real."},
 {tipo:"repo",t:"Chrome DevTools MCP",u:"https://github.com/ChromeDevTools/chrome-devtools-mcp",e:"e3",tema:"IA",d:"Servidor MCP com acesso a console, rede e performance."},
 {tipo:"repo",t:"GitHub MCP Server",u:"https://github.com/github/github-mcp-server",e:"e3",tema:"IA",d:"Servidor MCP oficial do GitHub."},
 {tipo:"repo",t:"OWASP Juice Shop",u:"https://github.com/juice-shop/juice-shop",e:"e3",tema:"Segurança",d:"Rode localmente em Docker para testar segurança."},
 {tipo:"repo",t:"How They Test",u:"https://github.com/abhivaikar/howtheytest",e:"e5",tema:"Estratégia",d:"Como dezenas de empresas testam."},
 {tipo:"repo",t:"quality_mobile_apps",u:"https://github.com/mgasiorowski/quality_mobile_apps",e:"e4",tema:"Mobile",d:"Ferramentas e guias para mobile."},
 {tipo:"repo",t:"performance_testing",u:"https://github.com/mgasiorowski/performance_testing",e:"e4",tema:"Performance",d:"Ferramentas e recursos de performance."},
 {tipo:"repo",t:"awesome-testing-courses",u:"https://github.com/upgundecha/awesome-testing-courses",e:"todas",tema:"Fundamentos",d:"Cursos e tutoriais organizados por tema."},
 {tipo:"repo",t:"WelcomeQAEngineer",u:"https://github.com/reinaldorossetti/WelcomeQAEngineer",e:"e1",tema:"Carreira",d:"Kit brasileiro de boas-vindas a QA."},

 /* Cursos */
 {tipo:"curso",t:"Test Automation University",u:"https://testautomationu.applitools.com/",e:"e2",tema:"Automação",d:"Cursos gratuitos de automação em trilhas."},
 {tipo:"curso",t:"Generative AI for Everyone – DeepLearning.AI",u:"https://www.deeplearning.ai/courses/generative-ai-for-everyone/",e:"e1",tema:"IA",d:"IA generativa sem código."},
 {tipo:"curso",t:"DeepLearning.AI – short courses",u:"https://www.deeplearning.ai/short-courses/",e:"e4",tema:"IA",d:"Cursos curtos sobre LLMs, RAG, agentes e avaliação."},
 {tipo:"curso",t:"Learn Git Branching",u:"https://learngitbranching.js.org/?locale=pt_BR",e:"e2",tema:"DevOps",d:"Git visual e interativo, em português."},
 {tipo:"curso",t:"SQLBolt",u:"https://sqlbolt.com/",e:"e2",tema:"Dados",d:"SQL interativo e gratuito."},
 {tipo:"curso",t:"Linux Journey",u:"https://linuxjourney.com/",e:"e2",tema:"DevOps",d:"Linux do básico ao intermediário."},
 {tipo:"curso",t:"Formação Carreira Tester QA – Alura",u:"https://cursos.alura.com.br/formacao-carreira-tester-qa",e:"e1",tema:"Fundamentos",d:"Formação em português.",pago:true},
 {tipo:"curso",t:"Playwright eXpress – Fernando Papito",u:"https://www.udemy.com/course/playwright-express/",e:"e2",tema:"Automação",d:"Playwright + TypeScript do zero, em português.",pago:true},
 {tipo:"curso",t:"AutomatizAi – Fernando Papito / FEX",u:"https://fexeducacao.edu.br/cursos/automatizai-especializacao-em-automacao-de-testes-com-ia/",e:"e3",tema:"IA",d:"Automação com Playwright e IA para QA.",pago:true},

 /* Canais e newsletters */
 {tipo:"canal",t:"Júlio de Lima – YouTube",u:"https://www.youtube.com/channel/UCtyc7euU2VCFrV1WNFFOyXg",e:"e1",tema:"Fundamentos",d:"Fundamentos e carreira em português."},
 {tipo:"canal",t:"Talking About Testing – Walmyr Filho",u:"https://www.youtube.com/@TalkingAboutTesting",e:"e3",tema:"Automação",d:"Automação e boas práticas em português."},
 {tipo:"canal",t:"QAzando",u:"https://www.youtube.com/@QAzando",e:"e4",tema:"Mobile",d:"Mobile em português."},
 {tipo:"canal",t:"Software Testing Weekly",u:"https://softwaretestingweekly.com/",e:"todas",tema:"Fundamentos",d:"Newsletter semanal com o melhor da área."},
 {tipo:"canal",t:"Google Testing Blog",u:"https://testing.googleblog.com/",e:"todas",tema:"Automação",d:"Inclui a série Testing on the Toilet."},
 {tipo:"canal",t:"TestGuild – Joe Colantonio",u:"https://testguild.com/newsletter/",e:"todas",tema:"Automação",d:"Newsletter e podcast de automação."},

 /* Roadmaps */
 {tipo:"roadmap",t:"roadmap.sh – QA Engineer",u:"https://roadmap.sh/qa",e:"todas",tema:"Carreira",d:"Bom como dicionário da área; não é uma sequência de estudo."},
 {tipo:"roadmap",t:"MoT Software Testing Essentials (índice)",u:"https://ministryoftesting.com/certifications/mot-software-testing-essentials-certificate",e:"e1",tema:"Fundamentos",d:"Os 19 módulos funcionam como checklist de fundamentos."},
 {tipo:"roadmap",t:"Free Learning Resources for Software Testers",u:"https://github.com/PaulWaltersDev/FreeLearningResourcesForSoftwareTesters",e:"todas",tema:"Fundamentos",d:"Currículo em 13 temas só com material gratuito."},
 {tipo:"roadmap",t:"ISTQB – lista de certificações",u:"https://istqb.org/certifications/certification-list",e:"todas",tema:"Carreira",d:"CTFL, CTAL-TAE, CT-AI, CT-GenAI e outras."},

 /* Comunidades */
 {tipo:"comunidade",t:"Ministry of Testing",u:"https://www.ministryoftesting.com/",e:"todas",tema:"Carreira",d:"A maior comunidade de testadores do mundo."},
 {tipo:"comunidade",t:"Grupos brasileiros (lista no WelcomeQAEngineer)",u:"https://github.com/reinaldorossetti/WelcomeQAEngineer",e:"todas",tema:"Carreira",d:"Grupos de Playwright, Cypress e automação no WhatsApp e Telegram."}
];

JQA.PROJETOS = [
 {t:"Raio-X de uma funcionalidade",e:"e1",onde:["Practice Software Testing","https://practicesoftwaretesting.com/"],entrega:"Lista de riscos priorizada, casos com técnicas nomeadas, duas sessões exploratórias e relatos."},
 {t:"Caça aos 25 bugs",e:"e1",onde:["AcademyBugs","https://academybugs.com/"],entrega:"Seus relatos comparados com a lista oficial: o que você achou, o que perdeu e por quê."},
 {t:"Revisão de requisito",e:"e1",onde:null,entrega:"Uma história de usuário com ambiguidades apontadas, perguntas ao PO e critérios reescritos em Gherkin."},
 {t:"API com autorização",e:"e2",onde:["ServeRest","https://serverest.dev/"],entrega:"Coleção Bruno ou Postman com cenários positivos, negativos e de acesso indevido, mais validação de dados."},
 {t:"Primeira suíte Playwright",e:"e2",onde:["SauceDemo","https://www.saucedemo.com/"],entrega:"Testes que expõem os bugs do problem_user e a lentidão do performance_glitch_user."},
 {t:"Exploração com IA e MCP",e:"e2",onde:["Playwright MCP","https://github.com/microsoft/playwright-mcp"],entrega:"Uma sessão em que o assistente explora o SauceDemo pelo Playwright MCP, com o que ele achou, o que inventou e o que você confirmou."},
 {t:"E2E de e-commerce",e:"e3",onde:["roadmap.sh","https://roadmap.sh/projects/e2e-test-ecommerce-app"],entrega:"Jornada de compra completa com dados isolados e testes independentes."},
 {t:"Suíte gerada por agentes, revisada por você",e:"e3",onde:["Playwright Test Agents","https://playwright.dev/docs/test-agents"],entrega:"Plano e testes gerados por Planner e Generator, e um README listando tudo o que você corrigiu."},
 {t:"Pipeline de qualidade",e:"e3",onde:["OWASP Juice Shop","https://github.com/juice-shop/juice-shop"],entrega:"Testes a cada pull request, relatório publicado, axe e scan baseline do ZAP."},
 {t:"Carga com critério",e:"e3",onde:["k6","https://grafana.com/docs/k6/latest/"],entrega:"Cenários de carga, estresse e pico com thresholds justificados e análise do p95."},
 {t:"Mobile",e:"e4",onde:["My Demo App","https://github.com/saucelabs/my-demo-app-rn"],entrega:"Jornada automatizada com Maestro em dois perfis de dispositivo, mais testes de permissão e rede."},
 {t:"Avaliação de um assistente de IA",e:"e4",onde:["Promptfoo","https://www.promptfoo.dev/docs/getting-started/"],entrega:"Dataset de 30 perguntas, rubrica, comparação entre duas versões e testes de prompt injection."}
];
