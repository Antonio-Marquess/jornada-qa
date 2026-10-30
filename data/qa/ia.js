/* Jornada QA — Além do Teste
 * Conteúdo da aba "IA no dia a dia".
 */
window.JQA = window.JQA || {};

JQA.IA = {
  intro: "A IA já faz parte do trabalho de quase todo QA, como ferramenta e como algo a ser testado. Esta aba mostra como usar no dia a dia sem terceirizar o seu julgamento: onde ela ajuda, como conectar o assistente às suas ferramentas com MCP, como trabalhar com agentes de teste e o que nunca fazer.",

  /* Onde a IA ajuda: tarefa, como usar, cuidado */
  tarefas: [
    {t:"Entender um requisito", como:"Cole a história e peça perguntas, ambiguidades e exemplos que faltam antes do refinamento.", cuidado:"Ela não conhece o seu negócio. Leve as perguntas para o PO, não as respostas dela."},
    {t:"Gerar cenários de teste", como:"Peça cenários por técnica: valor limite, tabela de decisão, estados. Peça também os negativos.", cuidado:"Compare com os seus. Descarte o que for irrelevante e anote o que ela inventou."},
    {t:"Criar dados de teste", como:"Gere massa sintética e variações de payload: campos vazios, longos, com acento, com emoji.", cuidado:"Nunca use dados reais de clientes, nem para pedir exemplos."},
    {t:"Escrever automação", como:"Peça um primeiro rascunho do teste a partir dos passos e da página. Com MCP, o assistente navega na página real.", cuidado:"Revise seletores, asserções e se o teste falha quando deveria falhar."},
    {t:"Depurar uma falha", como:"Cole o erro, o trecho do teste e o log. Peça hipóteses ordenadas da mais à menos provável.", cuidado:"Confirme cada hipótese antes de mexer no código."},
    {t:"Relatar um bug", como:"Dite o que aconteceu em linguagem livre e peça o relato no seu modelo padrão.", cuidado:"Confira passos e evidências. Severidade é decisão sua, não dela."},
    {t:"Revisar um pull request", como:"Peça riscos, casos de borda não cobertos e testes que faltam para o diff.", cuidado:"Ela não vê o sistema inteiro. Use como segunda opinião."},
    {t:"Estudar", como:"Use a IA como mentora que faz perguntas e propõe exercícios, não como resposta pronta.", cuidado:"Confirme conceitos na documentação oficial."}
  ],

  mcp: {
    oque: "MCP (Model Context Protocol) é um padrão aberto que permite conectar um assistente de IA a ferramentas e dados externos. Os assistentes já vêm com ferramentas próprias (busca na web, leitura de arquivos, terminal, conforme o produto). O MCP é a forma padronizada de acrescentar outras: com ele, o mesmo assistente pode controlar um navegador, ler uma issue no GitHub ou consultar uma história no Jira e trabalhar com contexto real, sempre com as permissões que você der.",
    partes: [
      {t:"Você", d:"Pede a tarefa e revisa o resultado"},
      {t:"Cliente MCP", d:"Claude Code, Claude Desktop, VS Code, Cursor"},
      {t:"Servidores MCP", d:"Um para cada ferramenta: navegador, GitHub, Jira"},
      {t:"Sistemas reais", d:"A aplicação em teste, o repositório, o board"}
    ],
    servidores: [
      {t:"Playwright MCP", url:"https://github.com/microsoft/playwright-mcp",
       faz:"O assistente controla um navegador real: navega, clica, preenche e lê a página pela árvore de acessibilidade.",
       pedido:"Abra o SauceDemo, faça login com o problem_user e me diga o que está diferente do standard_user.",
       cuidado:"Use em ambientes de teste. Não deixe o agente navegar logado em contas reais."},
      {t:"Chrome DevTools MCP", url:"https://github.com/ChromeDevTools/chrome-devtools-mcp",
       faz:"Dá ao assistente acesso ao DevTools: console, requisições de rede e traces de performance.",
       pedido:"Abra a página de checkout, me mostre as requisições que falham e os erros do console.",
       cuidado:"Logs e requisições podem conter tokens. Revise o que é compartilhado."},
      {t:"GitHub MCP", url:"https://github.com/github/github-mcp-server",
       faz:"Lê e cria issues, revisa pull requests e consulta código e execuções do Actions.",
       pedido:"Leia o pull request 42 e liste os riscos e os testes que faltam para essa mudança.",
       cuidado:"Dê permissão só de leitura até confiar no fluxo."},
      {t:"Atlassian MCP (Jira e Confluence)", url:"https://github.com/atlassian/atlassian-mcp-server",
       faz:"Lê histórias, critérios de aceite e páginas de documentação; pode criar e atualizar issues.",
       pedido:"Leia a história PROJ-123 e gere cenários Gherkin para os critérios de aceite.",
       cuidado:"Revise antes de deixar o agente criar ou alterar issues."}
    ],
    config: "{\n  \"mcpServers\": {\n    \"playwright\": {\n      \"command\": \"npx\",\n      \"args\": [\"@playwright/mcp@latest\"]\n    }\n  }\n}",
    configNota: "Formato comum de configuração em clientes como Claude Desktop, Cursor e VS Code. O nome do arquivo e o lugar onde ele fica mudam de cliente para cliente: confira a documentação do seu.",
    links: [
      ["Model Context Protocol – site oficial","https://modelcontextprotocol.io/"],
      ["Playwright MCP","https://github.com/microsoft/playwright-mcp"],
      ["Playwright – vídeos sobre MCP","https://playwright.dev/community/mcp-videos"],
      ["OWASP Agentic Top 10 (riscos de agentes)","https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"]
    ]
  },

  agentes: {
    oque: "O Playwright traz três agentes que trabalham em sequência. Eles funcionam com VS Code, Claude Code, Codex e OpenCode.",
    passos: [
      {t:"Planner", d:"Explora a aplicação e escreve um plano de teste em Markdown na pasta specs/."},
      {t:"Generator", d:"Transforma o plano em arquivos de teste, conferindo seletores e asserções na aplicação real."},
      {t:"Healer", d:"Roda a suíte e tenta consertar testes quebrados. Se concluir que a funcionalidade está quebrada, pula o teste."},
      {t:"Você", d:"Revisa tudo: o plano cobre os riscos? As asserções testam o que importa? O Healer escondeu um bug?"}
    ],
    cmd: "npx playwright init-agents --loop=vscode",
    cmdNota: "O exemplo usa o VS Code. Para outros clientes, troque o valor de --loop conforme a documentação. Rode de novo a cada atualização do Playwright.",
    link: ["Playwright Test Agents – documentação","https://playwright.dev/docs/test-agents"]
  },

  fluxo: [
    {t:"Refinamento", d:"IA lê a história e lista ambiguidades. Você leva as perguntas para o time."},
    {t:"Cenários", d:"IA sugere cenários por técnica. Você prioriza por risco e corta o que não importa."},
    {t:"Dados", d:"IA gera massa sintética. Você confere se cobre os limites."},
    {t:"Exploração", d:"Com Playwright MCP, o agente explora a tela. Você faz a sessão exploratória de verdade."},
    {t:"Automação", d:"Agentes geram o rascunho. Você revisa seletores, asserções e independência."},
    {t:"Falha", d:"IA sugere hipóteses a partir do log. Você confirma a causa."},
    {t:"Relato", d:"IA formata o bug. Você confere passos, evidência e severidade."}
  ],

  /* Conceitos de IA que um QA precisa conhecer: o que é e o que isso muda no teste (g = grupo, vira uma página no caderno) */
  conceitos: [
    {g:"O modelo", t:"Modelo de linguagem (LLM)", d:"Gera texto prevendo a continuação mais provável a partir do que recebeu. Não consulta um banco de fatos: escreve o que parece plausível.", qa:"Resposta fluente não é resposta certa. Todo teste precisa de um critério do que é correto."},
    {g:"O modelo", t:"Tokens e janela de contexto", d:"O modelo lê e escreve em tokens (pedaços de palavra). A janela de contexto é o limite de tokens que ele considera de uma vez: instruções, histórico, documentos e resposta.", qa:"Teste entradas longas e conversas longas: o que acontece quando passa do limite? Tokens também definem custo e tempo."},
    {g:"O modelo", t:"Prompt de sistema", d:"Instruções fixas que o produto envia ao modelo em toda conversa, sem o usuário ver: papel, regras, tom, o que é proibido.", qa:"Confira se o comportamento segue essas regras e se o usuário consegue fazer o sistema revelar ou ignorar as instruções."},
    {g:"O modelo", t:"Alucinação", d:"O modelo afirma algo falso ou inventa uma fonte, com a mesma confiança de uma resposta certa.", qa:"Inclua perguntas cuja resposta não existe e exija a fonte de cada afirmação importante."},
    {g:"O modelo", t:"Não determinismo e temperatura", d:"A mesma entrada pode gerar respostas diferentes. A temperatura controla quanta variação o modelo tem: baixa deixa mais previsível, alta deixa mais criativo.", qa:"Rode cada cenário várias vezes e meça a taxa de acerto, em vez de aprovar com uma execução só."},
    {g:"O modelo", t:"Multimodal", d:"Modelos que também leem imagem, áudio ou PDF, além de texto.", qa:"Teste com prints, fotos ruins, documentos escaneados e arquivos grandes, não só com texto."},
    {g:"Dados e contexto", t:"Embeddings e busca semântica", d:"Um texto vira uma lista de números (vetor) que representa o significado. A busca semântica encontra trechos parecidos em significado, mesmo com palavras diferentes.", qa:"Teste sinônimos, erros de digitação e termos parecidos que não deveriam ser confundidos."},
    {g:"Dados e contexto", t:"RAG (geração com busca)", d:"Antes de responder, o sistema busca trechos relevantes em documentos e os entrega ao modelo junto com a pergunta. Assim a resposta usa informação da empresa sem treinar o modelo de novo.", qa:"Avalie em duas partes: a busca trouxe o trecho certo? A resposta usou esse trecho sem inventar? Teste documento desatualizado, conflitante e pergunta sem resposta nos documentos."},
    {g:"Dados e contexto", t:"Prompt, RAG ou fine-tuning", d:"Três formas de adaptar um modelo: escrever melhor as instruções (prompt), entregar documentos na hora (RAG) ou treinar o modelo com exemplos (fine-tuning).", qa:"Pergunte qual o produto usa: com RAG, atualizar um documento muda a resposta na hora; com fine-tuning, só depois de treinar de novo."},
    {g:"Ferramentas e agentes", t:"Ferramentas (tool use)", d:"O modelo pede para chamar uma função, como consultar um pedido ou abrir um chamado, com os parâmetros que escolheu. Quem executa é o sistema, e o resultado volta para o modelo.", qa:"Teste parâmetros errados, chamadas sem permissão e o efeito real no sistema, não só a resposta em texto."},
    {g:"Ferramentas e agentes", t:"Agentes", d:"O modelo trabalha em ciclo: decide o próximo passo, chama ferramentas, lê o resultado e repete até concluir a tarefa.", qa:"Teste limites de passos, tempo e custo, aprovação humana antes de ações importantes e o rastreamento de cada etapa."},
    {g:"Ferramentas e agentes", t:"MCP", d:"Padrão aberto para conectar assistentes a ferramentas e dados (navegador, GitHub, Jira). Um servidor MCP expõe as ferramentas; o cliente (o assistente) as usa.", qa:"Dê o mínimo de permissão a cada servidor e confira o que o agente fez de verdade em cada sistema."},
    {g:"Ferramentas e agentes", t:"Skills", d:"Pacotes de instruções (um arquivo SKILL.md), com scripts e modelos opcionais, que o assistente carrega quando a tarefa pede. Guardam um jeito de trabalhar para reaproveitar, como relatar bug no padrão do time ou revisar um pull request.", qa:"Transforme seus melhores prompts em skills (a aba Prompts tem Copiar como skill) e teste a skill com casos variados, como faria com qualquer automação."},
    {g:"Qualidade e segurança", t:"Guardrails", d:"Regras e filtros antes e depois do modelo: bloquear dados sensíveis, assuntos proibidos ou respostas fora do formato.", qa:"Teste os dois lados: o que devia ser bloqueado passa? O que é legítimo é bloqueado por engano?"},
    {g:"Qualidade e segurança", t:"Avaliações (evals)", d:"Um conjunto fixo de casos, com critério de aprovação, rodado a cada mudança de modelo, prompt ou dados. É a regressão de um sistema com IA.", qa:"Monte a base com casos fáceis, difíceis, sem resposta e maliciosos, e acompanhe a taxa de acerto entre versões."},
    {g:"Qualidade e segurança", t:"Modelo como juiz", d:"Usar um modelo para dar nota às respostas de outro, segundo critérios escritos.", qa:"Compare a nota do juiz com a revisão humana numa amostra antes de confiar nela."},
    {g:"Qualidade e segurança", t:"Injeção de instruções", d:"Um texto que o sistema lê tenta fazer a IA desobedecer às regras. Pode vir do usuário ou escondido num documento, página ou e-mail que o sistema consultou.", qa:"Veja o minimapa Segurança e confiabilidade de IA."},
    {g:"Qualidade e segurança", t:"Custo e tempo de resposta", d:"Cada chamada custa por token e leva tempo; agentes fazem muitas chamadas.", qa:"Meça tempo e custo por tarefa e defina limites, como faria num teste de performance."}
  ],

  regras: [
    "Nunca cole dados pessoais, senhas, tokens ou código confidencial sem autorização da empresa.",
    "Todo código gerado passa por leitura, lint, execução e revisão humana antes do commit.",
    "Um teste gerado só é confiável depois que você o viu falhar pelo motivo certo.",
    "Healing que muda a asserção para o teste passar esconde bug. Desconfie.",
    "IA não decide severidade, risco nem liberação. Ela sugere; você decide.",
    "Dê aos servidores MCP o mínimo de permissão necessário, começando por leitura.",
    "Registre quando a IA ajudou num trabalho importante: modelo, prompt e o que você mudou."
  ],

  exercicios: [
    "Peça a uma IA 15 cenários para o login do SauceDemo. Classifique cada um como útil, redundante ou inventado.",
    "Configure o Playwright MCP e peça ao assistente para comparar o problem_user com o standard_user. Confira o que ele encontrou.",
    "Gere uma suíte com os Playwright Test Agents e escreva um README com tudo o que você corrigiu.",
    "Quebre um seletor de propósito, rode o Healer e veja se ele corrige o teste ou esconde o problema.",
    "Escreva a política de uso de IA de um time fictício em uma página."
  ]
};
