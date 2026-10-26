/* Jornada QA — Minimapa de Segurança
 * Cada área fica num arquivo próprio em data/minimapas/ e é registrada com JQA.MINIMAPAS.push(...).
 * Para criar uma área nova, copie este arquivo, troque o conteúdo e acrescente o <script> no index.html.
 *
 * Cada minimapa tem:
 *   id, t (nome), icon, d (por que a área importa), comeco (por onde começar), carreira (onde a área leva)
 *   ramos: lista de ramos, cada um com
 *     k      tipo do ramo: fund, est, ferr, prat ou trilha (cores e ícones em js/pages/minimapas.js)
 *     t      nome do ramo (opcional; o padrão vem do tipo)
 *     itens  lista de itens:
 *       t    título
 *       tag  etiqueta curta que aparece no mapa (nível, tipo de ferramenta…)
 *       d    explicação
 *       q    quando usar (ferramentas)
 *       l    materiais: [["Texto", "https://...", "o que ler ou fazer nele"]]
 *       x    prática sugerida
 *       lab  comandos para copiar
 *   No ramo "trilha", cada item é só {topico:"id-do-tópico"}: o mapa mostra o título e abre o tópico.
 */
window.JQA = window.JQA || {};

(JQA.MINIMAPAS = JQA.MINIMAPAS || []).push(
{id:"seguranca", t:"Segurança", icon:"shield",
 d:"Encontrar falhas que permitem acessar, alterar ou derrubar o que não deveria. Para QA, o foco é testar segurança como parte da qualidade: autenticação, autorização, dados expostos e o pipeline.",
 comeco:"Comece por autenticação e controle de acesso: são as falhas mais comuns e você já consegue testá-las com o DevTools. Depois vá para o OWASP Top 10 e para os labs da PortSwigger.",
 carreira:"QA com foco em segurança, AppSec (segurança de aplicações), DevSecOps e, aprofundando bastante, pentest.",
 ramos:[
  {k:"fund", itens:[
    {t:"Tríade CIA", tag:"Conceito",
     d:"Confidencialidade (só quem pode vê), integridade (ninguém altera sem permissão) e disponibilidade (o sistema está no ar). Todo teste de segurança protege uma dessas três."},
    {t:"Ameaça, vulnerabilidade e risco", tag:"Conceito",
     d:"Vulnerabilidade é a fraqueza, ameaça é quem ou o que pode explorá-la, e risco é a chance de isso acontecer multiplicada pelo impacto. O CVSS dá uma nota de 0 a 10 para a gravidade.",
     l:[["CVSS – FIRST","https://www.first.org/cvss/","Veja como a nota é composta; a versão atual é a 4.0"]]},
    {t:"Autenticação × autorização", tag:"Conceito",
     d:"Autenticação confirma quem você é; autorização decide o que você pode fazer. A maioria das falhas graves em sistemas reais é de autorização.",
     l:[["PortSwigger – Authentication","https://portswigger.net/web-security/authentication","A introdução"],["PortSwigger – Access control","https://portswigger.net/web-security/access-control","A introdução"]]},
    {t:"Sessão, cookies e tokens", tag:"Conceito",
     d:"Como o sistema lembra que você está logado: cookies de sessão, tokens JWT, expiração e logout. Um token que não expira ou não é invalidado no logout é um defeito de segurança.",
     l:[["PortSwigger – JWT attacks","https://portswigger.net/web-security/jwt","A seção “What are JWTs?”"]]},
    {t:"Menor privilégio e defesa em camadas", tag:"Princípio",
     d:"Cada usuário, serviço ou token tem só a permissão de que precisa, e a segurança não depende de uma barreira só. Útil para avaliar se uma correção resolve de verdade."},
    {t:"Dados pessoais e LGPD", tag:"Privacidade",
     d:"Dado pessoal exige base legal, minimização e cuidado em logs, exportações e ambientes de teste. Em teste, use dados fictícios ou mascarados.",
     l:[["ANPD","https://www.gov.br/anpd/pt-br","Guias orientativos"]]}
  ]},
  {k:"est", itens:[
    {t:"OWASP Top 10", tag:"Iniciante",
     d:"As dez categorias de falha mais comuns em aplicações web. É o vocabulário comum entre QA, devs e segurança.",
     l:[["OWASP Top 10","https://owasp.org/www-project-top-ten/","Leia a descrição e os exemplos de cada item"]],
     x:"Para cada item do Top 10, escreva um caso de teste que você faria no Practice Software Testing."},
    {t:"Autenticação e sessão", tag:"Iniciante",
     d:"Força bruta, mensagens que revelam se o usuário existe, recuperação de senha, sessão que não expira.",
     l:[["PortSwigger – Authentication","https://portswigger.net/web-security/authentication","Faça os labs Apprentice"]]},
    {t:"Controle de acesso e IDOR", tag:"Iniciante",
     d:"Trocar um ID na URL ou na requisição e ver dados de outra pessoa. É simples de testar e aparece muito em sistemas reais.",
     l:[["PortSwigger – Access control","https://portswigger.net/web-security/access-control","Faça os labs Apprentice"]]},
    {t:"OWASP API Security Top 10", tag:"Iniciante",
     d:"As falhas típicas de APIs: acesso a objeto de outro usuário (BOLA), autenticação quebrada, exposição excessiva de dados, mass assignment.",
     l:[["OWASP API Security Top 10","https://owasp.org/www-project-api-security/","Leia API1 a API5"]]},
    {t:"Injeção SQL e XSS", tag:"Intermediário",
     d:"Quando a entrada do usuário vira código: no banco (SQL) ou no navegador de outra pessoa (XSS).",
     l:[["PortSwigger – SQL injection","https://portswigger.net/web-security/sql-injection","Leia e faça os labs Apprentice"],["PortSwigger – XSS","https://portswigger.net/web-security/cross-site-scripting","Leia e faça os labs Apprentice"]]},
    {t:"Proxy de interceptação", tag:"Intermediário",
     d:"Ver e alterar as requisições entre o navegador e o servidor: parâmetros escondidos, campos desabilitados, regras que só existem no front-end.",
     l:[["Burp Suite Community","https://portswigger.net/burp/communitydownload","Instale e siga o tutorial da Academy para configurar o navegador"]]},
    {t:"Segurança no pipeline", tag:"Intermediário",
     d:"Verificações automáticas a cada mudança: dependências vulneráveis (SCA), código inseguro (SAST), segredos no repositório e scan da aplicação rodando (DAST).",
     l:[["GitHub – code security","https://docs.github.com/en/code-security","Dependabot, secret scanning e code scanning"]]},
    {t:"Modelagem de ameaças", tag:"Intermediário",
     d:"Antes de testar, perguntar: o que estamos construindo, o que pode dar errado, o que vamos fazer a respeito. STRIDE é um roteiro comum para essas perguntas.",
     l:[["OWASP – Threat Modeling","https://owasp.org/www-community/Threat_Modeling","O texto inteiro"]],
     x:"Desenhe o fluxo de login e recuperação de senha de um app e liste as ameaças em cada passo."},
    {t:"WSTG e ASVS", tag:"Avançado",
     d:"O WSTG é um roteiro completo de testes de segurança web; o ASVS é uma lista de requisitos verificáveis, em níveis. Servem para planejar a cobertura.",
     l:[["OWASP WSTG","https://owasp.org/www-project-web-security-testing-guide/stable/","Use como checklist de testes"],["OWASP ASVS","https://owasp.org/www-project-application-security-verification-standard/","Requisitos do nível 1"]]},
    {t:"Supply chain e SBOM", tag:"Avançado",
     d:"Riscos que vêm das dependências e das imagens que você usa. Um SBOM é a lista de tudo o que compõe o software.",
     l:[["CycloneDX","https://cyclonedx.org/","O que é um SBOM e como gerar"]]},
    {t:"Segurança de LLM e agentes", tag:"Avançado",
     d:"Prompt injection, vazamento de dados pelo modelo, agentes com permissão demais.",
     l:[["OWASP LLM Top 10","https://genai.owasp.org/llm-top-10/","Os 10 riscos"],["PortSwigger – Web LLM attacks","https://portswigger.net/web-security/llm-attacks","Leia e faça os labs"]]}
  ]},
  {k:"ferr", itens:[
    {t:"DevTools do navegador", tag:"Inspeção",
     q:"Primeiro passo de qualquer teste: ver requisições, cookies, armazenamento local e repetir chamadas alterando parâmetros.",
     l:[["Chrome DevTools – Network","https://developer.chrome.com/docs/devtools/network","Inspecionar e copiar requisições"]]},
    {t:"Burp Suite Community", tag:"Proxy",
     q:"Interceptar, alterar e repetir requisições à mão. É a ferramenta padrão dos labs da PortSwigger.",
     l:[["Download","https://portswigger.net/burp/communitydownload","Versão gratuita"]]},
    {t:"OWASP ZAP", tag:"DAST",
     q:"Scan automatizado de uma aplicação rodando e uso no pipeline. Gratuito e de código aberto.",
     l:[["ZAP – getting started","https://www.zaproxy.org/getting-started/","Baseline scan"]],
     lab:`docker run --rm --network host -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://localhost:3000`},
    {t:"Dependabot e npm audit", tag:"SCA",
     q:"Encontrar dependências com vulnerabilidade conhecida e abrir a atualização automaticamente.",
     l:[["GitHub – Dependabot","https://docs.github.com/en/code-security/dependabot","Ativar no repositório"]],
     lab:`npm audit
npm audit --omit=dev`},
    {t:"Semgrep", tag:"SAST",
     q:"Encontrar padrões inseguros no código-fonte, como uso de eval ou SQL montado com concatenação.",
     l:[["Semgrep","https://semgrep.dev/","Documentação e regras prontas"]]},
    {t:"Gitleaks", tag:"Segredos",
     q:"Encontrar senhas, chaves e tokens que foram parar no repositório, inclusive no histórico.",
     l:[["Gitleaks","https://github.com/gitleaks/gitleaks","README: uso com Docker"]],
     lab:`docker run -v "$(pwd)":/path zricethezav/gitleaks:latest dir -v /path`},
    {t:"Trivy", tag:"Containers",
     q:"Verificar vulnerabilidades em imagens Docker e em dependências antes de publicar.",
     l:[["Trivy","https://github.com/aquasecurity/trivy","README: instalação e uso"]],
     lab:`trivy image bkimminich/juice-shop`}
  ]},
  {k:"prat", itens:[
    {t:"OWASP Juice Shop", tag:"Web",
     d:"Loja propositalmente vulnerável, com mais de 100 desafios em níveis e um placar que mostra o que você já resolveu.",
     l:[["OWASP Juice Shop","https://owasp.org/www-project-juice-shop/","Rode localmente e abra o Score Board"]],
     lab:`docker run --rm -p 3000:3000 bkimminich/juice-shop
# Abra http://localhost:3000`},
    {t:"PortSwigger Web Security Academy", tag:"Labs",
     d:"Labs gratuitos, um por vulnerabilidade, do nível Apprentice ao Expert. A melhor forma de praticar de forma guiada.",
     l:[["Todos os labs","https://portswigger.net/web-security/all-labs","Comece pelos Apprentice de autenticação e controle de acesso"]]},
    {t:"OWASP crAPI", tag:"API",
     d:"API vulnerável de propósito, feita para praticar o OWASP API Security Top 10.",
     l:[["crAPI","https://github.com/OWASP/crAPI","README: instalação com Docker"]],
     lab:`# Na pasta deploy/docker do repositório clonado:
docker compose pull
docker compose -f docker-compose.yml --compatibility up -d
# Abra http://localhost:8888`},
    {t:"DVWA", tag:"Web",
     d:"Aplicação clássica com vulnerabilidades em níveis de dificuldade ajustáveis. Boa para entender injeção e XSS passo a passo.",
     l:[["DVWA","https://github.com/digininja/DVWA","README: instalação com Docker"]],
     lab:`git clone https://github.com/digininja/DVWA.git
cd DVWA
docker compose up -d
# Abra http://localhost:4280`},
    {t:"TryHackMe", tag:"Trilhas",
     d:"Salas guiadas no navegador, muitas gratuitas. Útil para fundamentos de redes e web antes dos labs mais técnicos.",
     l:[["TryHackMe","https://tryhackme.com/","Procure as salas introdutórias de web"]]}
  ]},
  {k:"trilha", itens:[
    {topico:"e1-seguranca-funcional"},
    {topico:"e2-seguranca-em-api"},
    {topico:"e3-seguranca-no-pipeline"},
    {topico:"e3-testar-features-de-ia"},
    {topico:"e4-seguranca"}
  ]}
 ]}
);
