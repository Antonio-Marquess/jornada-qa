/* Jornada QA — Guia pronto "Inglês para QA" (vira um caderno no Caderno de estudos).
 * Cada guia: id, t (nome do caderno), assunto e paginas. Cada página: t, sec (seção) e blocos:
 *   {k:"texto", html}  só <p>, <b>, <i>, <ul>, <ol>, <li>, <h4>, <code>
 *   {k:"nota", tipo:"importante"|"dica"|"duvida"|"entrevista", txt}
 *   {k:"link", t, url}    {k:"code", txt}    {k:"check", items:["texto", ...]}
 * O caderno entra uma vez em cada navegador; quem excluir recria em Novo caderno › Guia pronto. */
window.JQA = window.JQA || {};

(JQA.GUIAS = JQA.GUIAS || []).push({
  id:"ingles", t:"Inglês para QA", assunto:"Inglês",
  paginas:[

  /* ---------- Comece aqui ---------- */
  {t:"Como usar este caderno", sec:"Comece aqui", blocos:[
    {k:"texto", html:`<p>O objetivo é usar inglês no trabalho de QA: ler documentação, escrever bugs e comentários, participar de reuniões e passar numa entrevista. Não é gramática de escola: é o inglês que você vai usar de verdade.</p>
<h4>O método</h4>
<ol><li><b>30 minutos por dia, 5 dias por semana.</b> Constância vale mais que maratona no fim de semana.</li>
<li><b>Divida o tempo:</b> 10 minutos lendo, 10 ouvindo e 10 escrevendo ou falando.</li>
<li><b>Use material de QA.</b> Documentação do Playwright, bugs reais do seu time (sem dados da empresa), vídeos de testes.</li>
<li><b>Anote frases inteiras</b> na página Meu vocabulário, não palavras soltas.</li>
<li><b>Refaça o teste de nível a cada 3 meses</b> e registre o resultado aqui.</li></ol>`},
    {k:"nota", tipo:"dica", txt:"Comece descobrindo seu nível com um dos testes gratuitos abaixo. Anote o resultado e a data nesta página."},
    {k:"link", t:"Cambridge English – Test your English", url:"https://www.cambridgeenglish.org/test-your-english/"},
    {k:"link", t:"EF SET – teste de inglês gratuito", url:"https://www.efset.org/"},
    {k:"texto", html:`<p><b>Meu nível:</b> </p><p><b>Data do teste:</b> </p>`}
  ]},
  {t:"Rotina da semana", sec:"Comece aqui", blocos:[
    {k:"texto", html:`<p>Uma semana de estudo. Desmarque tudo no domingo e comece de novo na segunda.</p>`},
    {k:"check", items:[
      "Segunda: ler uma página de documentação em inglês e anotar 5 frases úteis",
      "Terça: ouvir um vídeo ou episódio curto com legenda em inglês",
      "Quarta: escrever um bug report em inglês, seguindo o modelo deste caderno",
      "Quinta: gravar 2 minutos falando, em inglês, o que você fez na semana",
      "Sexta: revisar os flashcards e reescrever um texto seu com ajuda da IA",
      "Fim de semana (opcional): uma série ou filme com áudio e legenda em inglês"
    ]}
  ]},

  /* ---------- Vocabulário ---------- */
  {t:"Palavras do dia a dia de QA", sec:"Vocabulário", blocos:[
    {k:"texto", html:`<ul>
<li><b>bug / defect</b>: defeito</li>
<li><b>steps to reproduce</b>: passos para reproduzir</li>
<li><b>expected result / actual result</b>: resultado esperado / resultado obtido</li>
<li><b>workaround</b>: solução provisória, um jeito de contornar o problema</li>
<li><b>edge case</b>: caso de borda</li>
<li><b>happy path</b>: fluxo principal, sem erros</li>
<li><b>acceptance criteria</b>: critérios de aceite</li>
<li><b>regression</b>: algo que funcionava e parou de funcionar</li>
<li><b>flaky test</b>: teste instável, que às vezes passa e às vezes falha sem mudança no código</li>
<li><b>smoke test</b>: teste rápido para ver se o básico funciona</li>
<li><b>test suite / test case / test plan</b>: conjunto de testes / caso de teste / plano de teste</li>
<li><b>coverage</b>: cobertura</li>
<li><b>assertion</b>: verificação dentro de um teste automatizado</li>
<li><b>blocker</b>: impedimento, algo que trava o trabalho ou a entrega</li>
<li><b>severity / priority</b>: gravidade do impacto / urgência para corrigir</li>
<li><b>staging / production</b>: ambiente de homologação / ambiente de produção</li>
<li><b>release / deploy / rollback / hotfix</b>: versão / publicação / volta para a versão anterior / correção urgente</li>
<li><b>pull request (PR)</b>: pedido para juntar uma mudança ao código principal</li>
<li><b>to file a bug</b>: registrar um bug</li>
<li><b>to retest</b>: testar de novo depois da correção</li>
</ul>`},
    {k:"nota", tipo:"dica", txt:"Transforme cada palavra num flashcard com uma frase de exemplo do seu trabalho, não só com a tradução."}
  ]},
  {t:"Falsos amigos e erros comuns", sec:"Vocabulário", blocos:[
    {k:"texto", html:`<h4>Parecem português, mas não são</h4>
<ul>
<li><b>actually</b> = na verdade, de fato (atualmente é <b>currently</b>)</li>
<li><b>eventually</b> = no fim, mais cedo ou mais tarde (eventualmente é <b>occasionally</b>)</li>
<li><b>pretend</b> = fingir (pretender é <b>intend</b>)</li>
<li><b>realize</b> = perceber (realizar é <b>carry out</b> ou <b>do</b>)</li>
<li><b>assume</b> = supor (assumir uma tarefa é <b>take on</b>)</li>
<li><b>push / pull</b> = empurrar / puxar</li>
</ul>
<h4>Erros que brasileiros cometem muito</h4>
<ul>
<li>"I have 30 years" → <b>I'm 30 years old</b></li>
<li>"make a question" → <b>ask a question</b></li>
<li>"explain me" → <b>explain to me</b></li>
<li>"depends of" → <b>depends on</b></li>
<li>"discuss about the bug" → <b>discuss the bug</b></li>
<li>"informations", "feedbacks", "evidences" → <b>information, feedback, evidence</b> (não têm plural)</li>
<li>"the people is" → <b>people are</b></li>
</ul>`}
  ]},

  /* ---------- Escrever ---------- */
  {t:"Bug report em inglês", sec:"Escrever", blocos:[
    {k:"texto", html:`<p>Frases curtas, verbos no presente e passos no imperativo (<i>Click</i>, <i>Open</i>, <i>Enter</i>). Um bug report bom em inglês é mais simples que em português.</p>`},
    {k:"code", txt:`Title: [Checkout] Discount code is applied twice after refreshing the page

Environment: staging · Chrome 130 · Windows 11

Steps to reproduce:
1. Add any product to the cart
2. Apply the discount code SAVE10
3. Refresh the page

Expected result: the 10% discount is applied once.
Actual result: the discount is applied twice (20% off).

Severity: High. Customers pay less than the correct price.
Evidence: screen recording and network log attached.`},
    {k:"nota", tipo:"dica", txt:"Título no formato [Área] o que acontece + quando acontece. Quem lê só o título já entende o problema."},
    {k:"texto", html:`<h4>Frases úteis</h4><ul>
<li><b>It happens every time / intermittently.</b> Acontece sempre / de vez em quando.</li>
<li><b>I couldn't reproduce it on …</b> Não consegui reproduzir em …</li>
<li><b>It works as expected on …</b> Funciona como esperado em …</li>
<li><b>Retested on build 1.4.2 and it's fixed.</b> Testei de novo na versão 1.4.2 e está corrigido.</li>
</ul>`}
  ]},
  {t:"Mensagens no chat e no e-mail", sec:"Escrever", blocos:[
    {k:"texto", html:`<ul>
<li><b>Quick question about …</b> Uma dúvida rápida sobre …</li>
<li><b>Could you take a look at …?</b> Você pode dar uma olhada em …?</li>
<li><b>I'm blocked by …</b> Estou travado por causa de …</li>
<li><b>Just a heads-up: …</b> Só um aviso: …</li>
<li><b>I'll get back to you by …</b> Te dou um retorno até …</li>
<li><b>Thanks for the quick fix! I retested it and it's working.</b></li>
<li><b>Sorry for the late reply.</b> Desculpe a demora.</li>
<li><b>Let me know if you need anything else.</b></li>
</ul>`}
  ]},
  {t:"Comentários em pull request", sec:"Escrever", blocos:[
    {k:"texto", html:`<ul>
<li><b>Could we add a test for …?</b> Dá para acrescentar um teste para …?</li>
<li><b>What happens if … is empty?</b> O que acontece se … estiver vazio?</li>
<li><b>Nit: …</b> Detalhe pequeno, não bloqueia: …</li>
<li><b>Suggestion: …</b> Sugestão: …</li>
<li><b>I might be missing something, but …</b> Posso estar deixando passar algo, mas …</li>
<li><b>LGTM</b> (looks good to me): por mim, está bom</li>
</ul>`},
    {k:"nota", tipo:"dica", txt:"Em comentário de revisão, pergunta soa melhor que ordem: \"Could we…?\" em vez de \"You must…\"."}
  ]},

  /* ---------- Falar ---------- */
  {t:"Daily e reuniões", sec:"Falar", blocos:[
    {k:"texto", html:`<h4>Na daily</h4><ul>
<li><b>Yesterday I worked on …</b> Ontem trabalhei em …</li>
<li><b>Today I'm going to …</b> Hoje vou …</li>
<li><b>I'm blocked by … / No blockers.</b> Estou travado por … / Sem impedimentos.</li>
</ul>
<h4>Quando não entendeu</h4><ul>
<li><b>Could you repeat that, please?</b></li>
<li><b>Could you speak a bit slower?</b></li>
<li><b>Just to make sure I understood: …</b> Só para confirmar que entendi: …</li>
</ul>
<h4>Outras</h4><ul>
<li><b>Let me share my screen.</b></li>
<li><b>I have a concern about …</b> Tenho uma preocupação com …</li>
<li><b>Can we take this offline?</b> Podemos conversar sobre isso depois, fora da reunião?</li>
</ul>`},
    {k:"nota", tipo:"importante", txt:"Pedir para repetir é normal, até entre nativos. Pior é concordar sem ter entendido."}
  ]},
  {t:"Perguntas de QA no refinamento", sec:"Falar", blocos:[
    {k:"texto", html:`<ul>
<li><b>What should happen if …?</b> O que deve acontecer se …?</li>
<li><b>Is there a limit for …?</b> Existe um limite para …?</li>
<li><b>Who can access this?</b> Quem pode acessar isso?</li>
<li><b>What does the user see when it fails?</b> O que o usuário vê quando dá erro?</li>
<li><b>Is this in scope for this sprint?</b> Isso está no escopo desta sprint?</li>
<li><b>How do we know it's done?</b> Como sabemos que está pronto?</li>
</ul>`}
  ]},
  {t:"Entrevista em inglês", sec:"Falar", blocos:[
    {k:"texto", html:`<p>Responda no formato <b>STAR</b>: <b>Situation</b> (o contexto), <b>Task</b> (o seu papel), <b>Action</b> (o que você fez) e <b>Result</b> (o resultado, com número se tiver).</p>
<h4>Perguntas comuns para QA</h4><ul>
<li>Tell me about yourself.</li>
<li>Describe a bug you're proud of finding.</li>
<li>How do you decide what to test first?</li>
<li>How do you handle a developer who disagrees with your bug?</li>
<li>What's your experience with test automation?</li>
<li>Tell me about a time something went wrong in production.</li>
</ul>`},
    {k:"check", items:[
      "Escrever a minha resposta para \"Tell me about yourself\" (60 a 90 segundos)",
      "Escrever duas histórias no formato STAR: um bug importante e um conflito resolvido",
      "Gravar as respostas em áudio e ouvir",
      "Treinar uma entrevista simulada com a IA (prompt na página Ferramentas)"
    ]},
    {k:"nota", tipo:"entrevista", txt:"Anote aqui as perguntas que caíram nas suas entrevistas reais e como você respondeu."}
  ]},

  /* ---------- Ler e ouvir ---------- */
  {t:"Ler documentação técnica", sec:"Ler e ouvir", blocos:[
    {k:"texto", html:`<p>Não traduza tudo. Leia o parágrafo inteiro, tente entender a ideia e só depois procure as palavras que travaram. Documentação técnica repete muito vocabulário: depois de algumas páginas fica bem mais fácil.</p>`},
    {k:"link", t:"Playwright – Getting started", url:"https://playwright.dev/docs/intro"},
    {k:"link", t:"MDN Web Docs", url:"https://developer.mozilla.org/en-US/"},
    {k:"link", t:"Ministry of Testing", url:"https://www.ministryoftesting.com/"}
  ]},
  {t:"Ouvir e pronunciar", sec:"Ler e ouvir", blocos:[
    {k:"texto", html:`<p>Use legenda em inglês, nunca em português: o objetivo é ligar o som à palavra escrita.</p>`},
    {k:"link", t:"BBC Learning English", url:"https://www.bbc.co.uk/learningenglish"},
    {k:"link", t:"YouGlish – pronúncia em vídeos reais", url:"https://youglish.com/"},
    {k:"link", t:"TED Talks", url:"https://www.ted.com/talks"},
    {k:"nota", tipo:"dica", txt:"Antes de falar uma palavra técnica pela primeira vez numa reunião, procure a pronúncia no YouGlish. Exemplos que costumam sair errados: cache, suite, queue, deploy."}
  ]},
  {t:"Ferramentas", sec:"Ler e ouvir", blocos:[
    {k:"link", t:"Anki – flashcards com revisão espaçada", url:"https://apps.ankiweb.net/"},
    {k:"texto", html:`<h4>A IA como parceira de conversa</h4><p>Cole o prompt abaixo num assistente de IA e converse por escrito ou por voz. Troque o nível pelo seu.</p>`},
    {k:"code", txt:`You are my English tutor. I work as a QA analyst and my level is B1.
Talk to me about my work: testing, bugs, meetings and interviews.
After each of my answers:
1. Show my sentence corrected.
2. Explain the main mistake in Portuguese, in one line.
3. Continue the conversation with one new question.
Keep your messages short.`},
    {k:"nota", tipo:"importante", txt:"Não cole na IA dados da empresa, de clientes ou trechos de código que não foram liberados."}
  ]},

  /* ---------- Meu caderno ---------- */
  {t:"Meu vocabulário", sec:"Meu caderno", blocos:[
    {k:"texto", html:`<p>Anote aqui as frases novas: a frase inteira, o que significa e onde você viu.</p><ul><li></li></ul>`}
  ]},
  {t:"Meus textos corrigidos", sec:"Meu caderno", blocos:[
    {k:"texto", html:`<p>Cole aqui um texto seu, a versão corrigida e o que você aprendeu com a correção.</p>`}
  ]}
  ]
});
