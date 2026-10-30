/* Jornada QA — Minimapa de Segurança e confiabilidade de IA
 * Formato igual ao de data/qa/minimapas/seguranca.js (veja o comentário de lá). */
window.JQA = window.JQA || {};

(JQA.MINIMAPAS = JQA.MINIMAPAS || []).push(
{id:"ia-seguranca", t:"Segurança e confiabilidade de IA", icon:"spark",
 d:"Mostrar se um sistema com IA pode ser usado com segurança: se as respostas são corretas e têm base, se os dados de um usuário não chegam a outro e se as ações dos agentes ficam dentro do permitido. Parte do que você já faz em QA e em testes de API.",
 comeco:"Comece por controle de acesso em APIs, nos labs da PortSwigger: você já testa autorização e é a base do resto. Depois aprenda a avaliar respostas de IA e, por último, segurança e confiabilidade de agentes.",
 carreira:"QA de IA, avaliação de sistemas com LLM, segurança de aplicações com IA e red teaming de IA.",
 ramos:[
  {k:"fund", itens:[
    {t:"Como funciona um sistema com IA", tag:"Conceito",
     d:"Um modelo de linguagem recebe instruções do sistema, a pergunta do usuário e um contexto (documentos, histórico). Com RAG, o sistema busca trechos de documentos antes de responder. Um agente também chama ferramentas: abre chamados, consulta bases, envia mensagens. Cada parte é um ponto a testar."},
    {t:"Resposta convincente não é resposta certa", tag:"Conceito",
     d:"Um texto bem escrito pode estar errado, sem base ou inventado. Antes de testar, defina o que é uma resposta aprovada: o que precisa conter, de onde precisa vir e o que é proibido."},
    {t:"Testes com resultado variável", tag:"Conceito",
     d:"A mesma pergunta pode gerar respostas diferentes. Rode cada cenário várias vezes, registre a taxa de acerto e decida antes qual taxa é aceitável para liberar."},
    {t:"Prove pelo sistema, não pela resposta", tag:"Princípio",
     d:"Uma resposta dizendo \"não executei\" não prova que nada aconteceu. Confira o que ficou registrado: chamadas de ferramenta, banco de dados, logs e o rastreamento das etapas."}
  ]},
  {k:"est", t:"Segurança de aplicações e APIs", cor:"--e1", itens:[
    {t:"Autenticação, sessão e recuperação de senha", tag:"Base",
     d:"Login, expiração e invalidação de sessão, troca e recuperação de senha. Falhas aqui deixam alguém entrar como outra pessoa.",
     l:[["PortSwigger – Authentication","https://portswigger.net/web-security/authentication","Leia a introdução e faça os labs Apprentice"]]},
    {t:"Controle de acesso", tag:"Base",
     d:"Um usuário consegue ver ou alterar dados ou funções de outro? É a falha mais comum em APIs e a mais importante em sistemas com IA, que acessam dados de vários usuários.",
     l:[["PortSwigger – Access control","https://portswigger.net/web-security/access-control","Teoria e labs"],["OWASP API Security Top 10","https://owasp.org/API-Security/","Leia os riscos de autorização"]]},
    {t:"Segurança de APIs, tokens e OAuth", tag:"Base",
     d:"Como a API identifica quem chama, o que cada token permite e por quanto tempo vale. Token com permissão demais ou que não expira é defeito.",
     l:[["OWASP API Security Top 10","https://owasp.org/API-Security/","Riscos de autenticação e de tokens"],["PortSwigger – OAuth","https://portswigger.net/web-security/oauth","A introdução"]]},
    {t:"Injeção, exposição de informações e regras de negócio", tag:"Base",
     d:"Entradas que o sistema executa como comando, mensagens de erro que revelam demais e regras de negócio que podem ser contornadas (pular uma etapa, repetir um desconto).",
     l:[["PortSwigger – Business logic","https://portswigger.net/web-security/logic-flaws","Teoria e labs"]]},
    {t:"Requisitos de segurança e critérios de aceite", tag:"Base",
     d:"Transformar controles de segurança em critérios verificáveis, que entram na história antes do desenvolvimento.",
     l:[["OWASP ASVS","https://owasp.org/www-project-application-security-verification-standard/","Use os requisitos como checklist e como critério de aceite"]],
     x:"Para cada falha que encontrar nos labs, escreva um relato com reprodução, evidência, impacto, recomendação e reteste."}
  ]},
  {k:"est", t:"Avaliar respostas de IA", cor:"--e2", itens:[
    {t:"Respostas fundamentadas", tag:"Avaliação",
     d:"A resposta tem apoio nos documentos disponíveis? Cada afirmação importante precisa aparecer na fonte."},
    {t:"RAG: encontrou o trecho certo?", tag:"Avaliação",
     d:"Antes de avaliar a resposta, avalie a busca: o sistema trouxe o trecho certo? Resposta errada com busca errada é um problema diferente de resposta errada com busca certa."},
    {t:"Informação insuficiente", tag:"Avaliação",
     d:"Quando a resposta não está nos documentos, o sistema diz que não sabe ou inventa? Inclua perguntas sem resposta e documentos com informações conflitantes."},
    {t:"Consistência", tag:"Avaliação",
     d:"O comportamento se mantém em várias execuções da mesma pergunta e em perguntas parecidas escritas de outro jeito?"},
    {t:"Avaliação automática × revisão humana", tag:"Avaliação",
     d:"Ferramentas e outros modelos podem dar nota às respostas, mas a nota precisa concordar com a revisão humana numa amostra. Sem essa conferência, a métrica pode estar medindo a coisa errada."},
    {t:"Base de perguntas de avaliação", tag:"Prática",
     d:"Um conjunto fixo de perguntas, com documentos de referência, critério de aprovação e exemplos de falha. É a sua suíte de regressão para respostas.",
     x:"Monte 50 perguntas, incluindo perguntas sem resposta nos documentos e documentos com informações conflitantes."}
  ]},
  {k:"est", t:"Segurança de sistemas com IA", cor:"--e3", itens:[
    {t:"Injeção de instruções", tag:"OWASP LLM",
     d:"Um texto que o sistema lê (pergunta, documento, página, e-mail) tenta fazer a IA desobedecer às regras. O caso mais perigoso é o indireto: a instrução vem escondida num documento que o sistema consultou.",
     l:[["OWASP Top 10 para aplicações com LLM","https://owasp.org/www-project-top-10-for-large-language-model-applications/","Leia a descrição e os exemplos de cada risco"]]},
    {t:"Vazamento de dados", tag:"OWASP LLM",
     d:"A resposta revela dados de outro usuário, documentos que a pessoa não poderia ver ou as instruções internas do sistema."},
    {t:"Permissões excessivas", tag:"OWASP LLM",
     d:"O agente consegue fazer mais do que precisa: ferramentas demais, permissão de escrita onde bastava leitura ou ações sem confirmação."},
    {t:"Uso inseguro de ferramentas", tag:"OWASP LLM",
     d:"O sistema executa uma ação inadequada ou usa a saída do modelo sem validar, como se fosse um dado confiável."},
    {t:"Consumo sem controle", tag:"OWASP LLM",
     d:"Repetições, respostas longas demais ou chamadas em excesso elevam tempo e custo. Teste limites de tamanho, de tentativas e de gasto."},
    {t:"Matriz de ameaças", tag:"Prática",
     d:"Uma tabela com cenário, impacto, controle esperado e a evidência de que o controle funcionou.",
     x:"Monte a matriz para um assistente com dois perfis de usuário e uma ferramenta, e confira cada cenário no sistema, não só na resposta."}
  ]},
  {k:"est", t:"Confiabilidade de agentes", cor:"--e4", itens:[
    {t:"Ferramenta indisponível", tag:"Agente",
     d:"Esperado: informar a falha sem inventar que deu certo."},
    {t:"Pedido repetido", tag:"Agente",
     d:"Esperado: não duplicar a ação, como abrir dois chamados ou fazer dois pagamentos."},
    {t:"Falta de autorização", tag:"Agente",
     d:"Esperado: bloquear a operação e explicar o motivo."},
    {t:"Aprovação humana", tag:"Agente",
     d:"Quando a tarefa exige aprovação, esperado: aguardar a aprovação antes de agir."},
    {t:"Repetição sem fim", tag:"Agente",
     d:"Quando o agente entra em repetição, esperado: parar dentro do limite definido de passos, tempo ou custo."},
    {t:"Rastreamento das etapas", tag:"Agente",
     d:"Registrar cada passo do agente (o que pensou, qual ferramenta chamou, o que recebeu) é o que permite provar o que aconteceu e achar a causa de uma falha.",
     l:[["DeepLearning.AI – Evaluating AI Agents","https://www.deeplearning.ai/short-courses/evaluating-ai-agents/","Curso curto e gratuito sobre avaliação, rastreamento e monitoramento de agentes"]]}
  ]},
  {k:"ferr", itens:[
    {t:"Python e pytest", tag:"Testes",
     d:"Para testar APIs e chamar o sistema de IA várias vezes, guardando as respostas e as notas.",
     q:"Quando o teste é de API ou de avaliação de respostas.",
     l:[["pytest","https://docs.pytest.org/","Getting started"]]},
    {t:"Playwright", tag:"Testes",
     d:"Para testar o assistente pela interface, do jeito que o usuário usa.",
     q:"Quando o comportamento depende da tela.",
     l:[["Playwright","https://playwright.dev/","Docs"]]},
    {t:"promptfoo", tag:"Avaliação",
     d:"Ferramenta de código aberto para rodar uma base de perguntas contra um sistema com IA, comparar versões e testar riscos de segurança.",
     q:"Quando a base de perguntas crescer e você precisar comparar versões.",
     l:[["promptfoo","https://www.promptfoo.dev/docs/intro/","Introdução"]]},
    {t:"Ragas", tag:"Avaliação",
     d:"Biblioteca em Python com métricas para avaliar sistemas com RAG: se a resposta tem base no contexto e se a busca trouxe o trecho certo.",
     q:"Quando o sistema usa RAG e você precisa medir busca e resposta separadamente.",
     l:[["Ragas","https://docs.ragas.io/","Get started"]]},
    {t:"Langfuse", tag:"Rastreamento",
     d:"Ferramenta de código aberto para registrar e consultar cada etapa das chamadas a modelos e agentes.",
     q:"Quando precisar provar o que o agente fez ou investigar uma falha.",
     l:[["Langfuse","https://langfuse.com/docs","Docs"]]}
  ]},
  {k:"prat", itens:[
    {t:"PortSwigger Web Security Academy", tag:"Labs",
     d:"Labs gratuitos de controle de acesso, APIs e também de ataques a aplicações web com LLM.",
     l:[["Web LLM attacks","https://portswigger.net/web-security/llm-attacks","Teoria e labs de LLM"],["Todos os labs","https://portswigger.net/web-security/all-labs","Comece pelos de controle de acesso"]]},
    {t:"Gandalf", tag:"Jogo",
     d:"Jogo em que você tenta fazer uma IA revelar uma senha, nível a nível. Mostra na prática por que injeção de instruções é difícil de bloquear.",
     l:[["Gandalf – Lakera","https://gandalf.lakera.ai/","Jogue até onde conseguir e anote o que funcionou em cada nível"]]},
    {t:"OWASP crAPI", tag:"API",
     d:"API vulnerável de propósito, para praticar os riscos de autorização do OWASP API Security Top 10.",
     l:[["crAPI","https://github.com/OWASP/crAPI","README: instalação com Docker"]]}
  ]},
  {k:"trilha", itens:[
    {topico:"e2-testes-de-api"},
    {topico:"e2-seguranca-em-api"},
    {topico:"e3-mcp-na-pratica"},
    {topico:"e3-agentes-de-teste"},
    {topico:"e4-qualidade-de-ia-e-agentes"},
    {topico:"e5-politica-de-ia-no-time"}
  ]}
 ]}
);
