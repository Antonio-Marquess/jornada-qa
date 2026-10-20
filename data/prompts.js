/* Jornada QA — Além do Teste
 * Biblioteca de prompts. Troque o que está entre <> pelo seu contexto.
 * Campos: c (categoria), t (título), quando (quando usar), p (o prompt)
 */
window.JQA = window.JQA || {};

JQA.PROMPTS = [
 {c:"Estudo", t:"Mentor que faz perguntas", quando:"Para aprender um tema sem receber a resposta pronta.",
  p:`Você é meu mentor de QA. Estou estudando <tema>.
Não me dê a resposta pronta. Primeiro me faça 3 perguntas para ver o que eu já sei.
Depois explique o que faltou, com um exemplo prático, e me proponha um exercício.
Quando eu responder, corrija apontando o raciocínio, não só o resultado.`},
 {c:"Estudo", t:"Explicar como para um iniciante", quando:"Quando um conceito da documentação não entrou.",
  p:`Explique <conceito> para alguém que está começando em QA.
Use uma analogia do dia a dia, depois um exemplo real de software e termine com
um erro comum que iniciantes cometem sobre esse assunto. Máximo de 200 palavras.`},
 {c:"Requisitos", t:"Caçar ambiguidades", quando:"Antes do refinamento de uma história.",
  p:`Atue como QA revisando a história abaixo antes do refinamento.
Liste:
1. Ambiguidades (termos que podem ser entendidos de mais de um jeito)
2. Regras de negócio que não estão explícitas
3. Exemplos que faltam (casos de borda, erros, permissões)
4. Perguntas para o PO, em ordem de impacto
Não invente respostas para as perguntas.

História:
<cole a história e os critérios de aceite>`},
 {c:"Requisitos", t:"Critérios de aceite em Gherkin", quando:"Para transformar uma história em exemplos testáveis.",
  p:`Transforme os critérios de aceite abaixo em cenários Gherkin (Dado / Quando / Então) em português.
Inclua cenários de sucesso, de erro e de borda. Use exemplos concretos de dados.
Marque com [DÚVIDA] tudo o que você precisou supor.

Critérios:
<cole os critérios>`},
 {c:"Cenários", t:"Cenários por técnica de teste", quando:"Para desenhar casos com método, não no improviso.",
  p:`Funcionalidade: <descreva o campo, formulário ou regra>
Regras conhecidas: <ex.: idade entre 18 e 65; CPF obrigatório>

Gere casos de teste aplicando, separadamente:
- Partição de equivalência
- Análise de valor limite
- Tabela de decisão (se houver combinação de regras)
Para cada caso: entrada, resultado esperado e a técnica usada.
No final, aponte quais casos eu poderia cortar se tivesse pouco tempo e por quê.`},
 {c:"Cenários", t:"Charter para sessão exploratória", quando:"Para planejar 45 minutos de exploração com foco.",
  p:`Vou explorar <área ou funcionalidade> por 45 minutos.
Sugira 3 charters no formato "Explorar <alvo> com <recursos> para descobrir <informação>",
cada um focado num risco diferente (dados, fluxo, permissões, integrações...).
Para cada charter, liste 5 heurísticas ou ideias de ataque.`},
 {c:"Dados", t:"Massa de dados sintética", quando:"Para preencher formulários e APIs sem usar dados reais.",
  p:`Gere <N> registros de teste em JSON para o schema abaixo.
Inclua: valores válidos típicos, limites mínimo e máximo, campos vazios,
textos longos, acentos, emojis e caracteres especiais.
Use apenas dados fictícios. Marque em cada registro qual caso ele cobre.

Schema:
<cole o schema ou descreva os campos>`},
 {c:"API", t:"Testes negativos e de autorização", quando:"Para ir além do caminho feliz numa API.",
  p:`Endpoint: <método e rota>
Autenticação: <tipo>
Payload de exemplo: <JSON>

Liste testes negativos e de segurança para esse endpoint:
- validação de campos (tipos, obrigatórios, tamanhos)
- autenticação ausente, inválida e expirada
- acesso a recurso de outro usuário (IDOR/BOLA)
- campos extras no payload (mass assignment)
Para cada teste: requisição, status esperado e o risco que ele cobre.`},
 {c:"Automação", t:"Primeiro rascunho de teste Playwright", quando:"Para começar um teste a partir dos passos manuais.",
  p:`Escreva um teste Playwright em TypeScript para o cenário abaixo.
Regras:
- use locators acessíveis (getByRole, getByLabel, getByText) em vez de CSS frágil
- use asserções web-first (expect(...).toBeVisible(), toHaveText...)
- o teste deve ser independente e criar os próprios dados
- explique em comentários cada decisão de seletor

Cenário:
<cole os passos e o resultado esperado>`},
 {c:"Automação", t:"Revisar um teste automatizado", quando:"Antes de aceitar um teste gerado por IA ou por outra pessoa.",
  p:`Revise o teste abaixo como um QA sênior. Aponte:
1. Seletores frágeis
2. Asserções fracas ou ausentes (o teste passaria mesmo com o bug?)
3. Dependência de ordem ou de dados de outros testes
4. Esperas fixas (sleep/waitForTimeout)
5. O que ele não cobre do cenário
Sugira a correção de cada ponto.

Teste:
<cole o código>`},
 {c:"Depuração", t:"Hipóteses para uma falha", quando:"Quando um teste quebra e você não sabe por quê.",
  p:`Um teste falhou. Me dê hipóteses da mais à menos provável e, para cada uma,
como eu confirmo ou descarto. Não proponha correção antes de confirmarmos a causa.

Erro:
<cole a mensagem de erro e o stack>
Trecho do teste:
<cole>
O que mudou recentemente:
<deploy, dados, ambiente...>`},
 {c:"Depuração", t:"Teste instável (flaky)", quando:"Quando o teste às vezes passa, às vezes falha.",
  p:`Este teste falha de forma intermitente (<X> de cada <Y> execuções).
Analise o código e liste causas prováveis de instabilidade: timing, dados compartilhados,
ordem de execução, dependências externas, animações, ambiente.
Para cada causa, diga como reproduzir de forma confiável.

<cole o teste e, se tiver, o trace ou o log>`},
 {c:"Bugs", t:"Relato de bug no padrão", quando:"Para transformar anotações soltas num relato claro.",
  p:`Transforme minhas anotações num relato de bug com:
Título (o que falha, onde, em que condição)
Ambiente
Passos para reproduzir (numerados)
Resultado esperado / Resultado obtido
Evidências que devo anexar
O que ainda não sei (hipóteses que não verifiquei)
Não invente passos ou dados que não estão nas anotações.

Anotações:
<cole>`},
 {c:"Revisão", t:"Riscos de um pull request", quando:"Para revisar uma mudança antes de testar.",
  p:`Analise o diff abaixo do ponto de vista de qualidade.
Liste:
1. O que pode quebrar com essa mudança (inclusive fora dos arquivos alterados)
2. Casos de borda que o código não trata
3. Testes que faltam (unidade, API, UI)
4. Perguntas para quem escreveu o código
<cole o diff ou o link, se o assistente tiver acesso via GitHub MCP>`},
 {c:"Segurança", t:"Modelagem de ameaças rápida", quando:"Antes de testar uma funcionalidade sensível.",
  p:`Funcionalidade: <ex.: troca de senha, pagamento, upload de arquivo>
Usuários envolvidos: <papéis>
Dados sensíveis: <quais>

Faça uma modelagem de ameaças simples: quem poderia abusar, como, qual o impacto
e que teste eu faria para cada ameaça. Use o OWASP Top 10 como referência.
Considere que só posso testar no ambiente de teste autorizado.`},
 {c:"Performance", t:"Plano de teste de carga", quando:"Para sair do 'vamos rodar 1000 usuários'.",
  p:`Sistema: <descreva>
Uso real conhecido: <ex.: pico de 300 pedidos por minuto às 12h>

Monte um plano de teste de performance com:
- cenários (smoke, carga, estresse, pico, resistência) e o objetivo de cada um
- métricas e thresholds sugeridos (p95, taxa de erro) com justificativa
- o que monitorar no servidor durante o teste
- um script k6 inicial para o cenário de carga`},
 {c:"Acessibilidade", t:"Checklist de acessibilidade", quando:"Para revisar uma tela antes de liberar.",
  p:`Monte um checklist de acessibilidade (WCAG 2.2, nível AA) para a tela abaixo.
Separe em: teclado, foco, leitor de tela, contraste, formulários e mensagens de erro.
Para cada item, diga como verifico manualmente e com qual ferramenta.

Tela: <descreva ou cole o HTML>`},
 {c:"IA", t:"Avaliar um chatbot", quando:"Para testar uma funcionalidade com IA no produto.",
  p:`Vou testar um assistente de IA que <função do assistente>.
Monte um conjunto de 20 perguntas de teste, separadas em:
- perguntas típicas (com a resposta esperada)
- fora de escopo (ele deve recusar ou redirecionar)
- ambíguas (ele deve pedir esclarecimento)
- tentativas de prompt injection
Para cada grupo, defina o critério de aprovação.`},
 {c:"IA", t:"Explorar com Playwright MCP", quando:"Com o Playwright MCP configurado no seu assistente.",
  p:`Usando o navegador, abra <URL do ambiente de teste>.
Explore a funcionalidade <nome> como um testador exploratório:
tente entradas inválidas, volte e avance no fluxo, recarregue no meio do processo.
Para cada comportamento estranho, me diga os passos exatos e o que você observou.
Não faça compras, cadastros reais nem nada fora do ambiente de teste.`},
 {c:"Carreira", t:"Linha de currículo com resultado", quando:"Para tirar o currículo da lista de ferramentas.",
  p:`Reescreva as experiências abaixo no formato "ação + contexto + resultado",
para um currículo de QA. Não invente números: se não houver resultado medido,
descreva o impacto qualitativo. Máximo de 2 linhas por item.

Experiências:
<cole>`},
 {c:"Carreira", t:"Simular entrevista técnica", quando:"Para treinar antes de um processo seletivo.",
  p:`Simule uma entrevista para vaga de QA <júnior/pleno>.
Faça uma pergunta por vez e espere minha resposta.
Misture: fundamentos, "como você testaria...?", API, um bug que investiguei e comportamento.
Depois de cada resposta, dê um feedback curto: o que foi bom e o que faltou.`}
];
