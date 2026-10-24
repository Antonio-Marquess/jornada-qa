# Jornada QA — Além do Teste

Um mapa interativo para começar e crescer em qualidade de software, com IA no dia a dia desde o primeiro passo.

**Versão 0.4** · funciona direto no navegador, sem instalar nada.

## O que tem

| Aba | Conteúdo |
| --- | --- |
| Mapa | Mapa mental da trilha: 5 etapas, 70 tópicos e, dentro de cada tópico, o que estudar, tecnologias e materiais. Ramos abrem e fecham, duplo clique foca |
| Rota de estudo | A mesma trilha em sequência, com checklist e prévia das anotações |
| Trilhas próprias | Seletor de trilha no Mapa e na Rota: a Jornada QA oficial ou trilhas montadas por você (escolhendo tópicos da oficial, copiando a oficial inteira ou do zero, com tópicos seus). O progresso é um só |
| Carreira | Carreira em Y: base comum (estágio a sênior), trilha técnica (especialista, staff), trilha de gestão (coordenação, gerência, head) e líder técnico como ponte. Cada nível diz o que se espera, o que estudar, o que fazer para provar e o que costuma travar, com autoavaliação |
| Minimapas | Um mapa mental por área (Segurança e, em breve, outras) com fundamentos, o que estudar, ferramentas, onde praticar e os tópicos da trilha ligados. Também os seus próprios mapas, criados do zero |
| IA no dia a dia | Onde a IA ajuda, MCP explicado, servidores MCP úteis para QA, agentes de teste do Playwright, regras de ouro e exercícios |
| Prompts | 72 prompts de QA em português e inglês, no formato de skill (objetivo, instruções, exemplo, formato e checklist), com nível, categoria e botões para copiar o prompt ou a skill |
| Biblioteca | Artigos, documentação, sites para praticar, repositórios, cursos, canais, roadmaps e comunidades, com filtros por tipo, etapa e tema |
| Projetos | Projetos guiados para o portfólio, em ordem de dificuldade |

Cada tópico abre com:

- **O que estudar:** os subtemas, em checklist
- **Materiais:** links com a indicação do que ler ou fazer em cada um
- **Pratique:** exercício com aplicação, passos e entrega; quando faz sentido, um **laboratório** pronto para copiar (comandos Docker, scripts SQL, história de exemplo, modelos)
- **Pronto quando:** critérios para saber que terminou
- **Minhas anotações**

O progresso (tópicos dominados, checklists, exercícios e projetos concluídos), as trilhas próprias, a autoavaliação de carreira e as anotações ficam salvos no navegador de cada pessoa. Cada pessoa, no seu navegador, tem os seus; para levar para outro computador, use **Seus dados › Exportar backup**.

## Versões

**v0.4**

- **Trilhas próprias:** cada pessoa monta as suas trilhas ao lado da oficial. Seletor no topo do Mapa e da Rota; criar escolhendo tópicos da oficial, copiando a oficial inteira ou em branco; renomear, duplicar e excluir. Os tópicos da oficial compartilham progresso e anotações; tópicos criados numa trilha própria só aparecem nela
- **Aba Carreira** em Y: base comum (Estágio, Júnior, Pleno, Sênior), trilha técnica (Especialista/SDET, Staff/Principal), trilha de gestão (Coordenação, Gerência, Head) e Líder técnico como ponte entre as duas
- Cada nível tem escopo, nomes que o cargo costuma ter nas empresas, o que se espera, o que estudar (tópicos da trilha e minimapas), o que fazer para provar, comportamentos e o que costuma travar. Sem prazos: evidência, não tempo de casa
- Autoavaliação: **Estou aqui**, **Quero chegar aqui** e itens marcados; o topo mostra o que falta para o objetivo. **Criar minha trilha para este nível** monta uma trilha própria com os tópicos do nível
- Níveis editáveis (nome, caminho, textos, tópicos ligados) e novos níveis em cada caminho
- **Minhas carreiras:** cada pessoa monta a sua ao lado da Carreira em Y oficial (copiando a oficial, só a base comum ou em branco), com os cargos da empresa ou um plano próprio; cada carreira guarda onde você está, o objetivo e o que já marcou
- Na escada em Y, clicar num nível abre os **requisitos ao lado**, em caixinhas: escopo, o que se espera, o que estudar, o que provar, comportamentos e o que trava; cada grupo abre os itens lateralmente, com caixinha para marcar, remover e adicionar
- Carreira também como **mapa mental**: cada nível abre nos seus requisitos (escopo, o que se espera, o que estudar, o que provar, comportamentos, o que trava), com caixinhas para marcar e edição direto no mapa
- Aba Prompts nova: **72 prompts de QA em português e inglês** (seletor PT | EN), em 17 categorias, com nível, descrição, "quando usar" e "antes de usar a resposta"
- Cada prompt no formato de skill: **Objetivo** (papel e para quê), **Antes de começar** (o que a IA pergunta se faltar informação), **Instruções** passo a passo, **Exemplo** de entrada e saída, **Formato da saída** e **Checklist** que a IA confere antes de responder
- Escritos com as boas práticas de engenharia de prompt da Anthropic, da OpenAI e do Google; guia "Como estes prompts foram escritos" no topo da aba
- **Copiar prompt** copia o texto completo, pronto para colar; **Copiar como skill** gera o mesmo conteúdo em SKILL.md
- Filtros por categoria e nível, busca nos dois idiomas, edição por seção nos dois idiomas
- Prompts em `data/prompts/`, um arquivo por grupo de categorias

**v0.3**

- Mapa mental de verdade, no Mapa e nos Minimapas: ramos que abrem e fecham (botão **+N** / **−**), vários níveis (tópico › o que estudar, tecnologias e materiais), foco, abrir tudo e recolher tudo
- Edição direto no mapa, como no XMind e no MindMeister: clique seleciona e mostra uma barra de ações (detalhes, novo filho, novo irmão, editar, focar, excluir); duplo clique ou F2 edita o texto; arrastar um nó para outro o move de lugar
- Teclado: **Tab** cria filho, **Enter** cria irmão, **F2** edita, **Delete** exclui, **Espaço** abre ou fecha, **F** foca, **O** abre detalhes, setas navegam, **Ctrl+Z** desfaz, **Esc** sai
- Minimapas editáveis: criar ramos e itens, subitens em quantos níveis quiser, editar textos e detalhes (explicação, materiais, prática, comandos)
- **Meus mapas:** crie mapas mentais seus, do zero, na aba Minimapas
- Marcar o que estudou direto no mapa; a busca abre os ramos onde há resultado e aproxima o mapa deles
- Motor do mapa mental reaproveitável em `js/core/mindmap.js`

**v0.2**

- Aba Minimapas: um mapa mental por área, começando por Segurança
- Código separado por responsabilidade em `js/core/` e `js/pages/`

**v0.1** (primeira versão publicada)

- Trilha em 5 etapas com 70 tópicos, do zero ao sênior
- Todos os tópicos com o que estudar, materiais, exercício e critérios de conclusão; laboratórios prontos para SQL, MongoDB, RabbitMQ, Juice Shop, k6, Docker e outros
- Abas IA no dia a dia (com MCP e agentes de teste), Prompts, Biblioteca e Projetos
- Tudo editável pela página, com backup e publicação em Seus dados

## Editar pela própria página

Não existe modo de edição: tudo se edita no lugar, como no Notion ou no Trello.

- **Rota de estudo:** passe o mouse num tópico e use os ícones de editar ou excluir. **Adicionar tópico** fica no fim de cada etapa, e o ícone ao lado do nome da etapa muda nome e objetivo.
- **Mapa e Minimapas:** clique num nó para selecionar e use a barra que aparece em cima dele, ou o teclado (Tab, Enter, F2, Delete, Ctrl+Z). Duplo clique edita o texto e arrastar move o nó. Os detalhes completos de um tópico (descrição, laboratório, critérios) ficam em **Detalhes › Editar**.
- **Prompts e Biblioteca:** **Novo prompt** e **Adicionar link** no topo; editar e excluir aparecem ao passar o mouse.
- **Anotações:** cada tópico tem um campo "Minhas anotações". Links escritos ali viram links clicáveis.

Backup e publicação ficam em **Seus dados**, na barra lateral:

| Ação | O que faz |
| --- | --- |
| Exportar backup | Baixa um `.json` com conteúdo, anotações e progresso |
| Importar backup | Carrega esse `.json` em outro navegador ou computador |
| Publicar no GitHub | Gera o arquivo `personalizado.js` com o conteúdo editado (sem anotações nem progresso) |
| Restaurar original | Descarta as edições de conteúdo deste navegador; trilhas e mapas próprios, anotações e progresso continuam |

### Publicar suas edições para todos

1. Em **Seus dados**, clique em **Gerar arquivo** (Publicar no GitHub).
2. Substitua o arquivo `data/personalizado.js` do repositório pelo que foi baixado e faça o commit.
3. Quem abrir o site passa a ver o seu conteúdo. Quem tiver edições próprias salvas no navegador continua vendo a versão dele até clicar em **Restaurar original**.

## Rodar localmente

Abra o arquivo `index.html` no navegador. Pronto.

## Publicar no GitHub Pages

1. Crie um repositório, por exemplo `jornada-qa`, e envie todos os arquivos desta pasta para a branch `main`.
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em alguns minutos o site estará em `https://SEU-USUARIO.github.io/jornada-qa/`.

Dá para abrir uma aba direto pelo endereço: `#mapa`, `#rota`, `#minimapas`, `#minimapas/seguranca`, `#carreira`, `#ia`, `#prompts`, `#biblioteca` ou `#projetos`.

## Estrutura

```
jornada-qa/
├── index.html              estrutura da página e ordem dos scripts
├── css/styles.css          visual (claro e escuro)
├── data/                   CONTEÚDO: tudo o que se estuda, separado do código
│   ├── trilha.js           etapas e tópicos do mapa e da rota
│   ├── ia.js               aba IA no dia a dia
│   ├── prompts/            biblioteca de prompts, um arquivo por grupo de categorias
│   ├── biblioteca.js       links da biblioteca e projetos
│   ├── minimapas/          um arquivo por área (seguranca.js, …)
│   ├── carreira.js         níveis da carreira em Y
│   └── personalizado.js    conteúdo editado pela página (substitui o padrão quando preenchido)
└── js/                     CÓDIGO: como o conteúdo aparece e se comporta
    ├── core/               base usada por todas as páginas
    │   ├── util.js         utilitários, armazenamento local, avisos, desenho em SVG
    │   ├── estado.js       conteúdo carregado, progresso, anotações, checklists
    │   ├── interface.js    tema, menu lateral, gaveta, botão copiar
    │   └── mindmap.js      mapa mental: abrir e fechar ramos, níveis, foco, pan e zoom
    ├── pages/              um arquivo por aba ou recurso
    │   ├── mapa.js         mapa mental, busca, pan e zoom
    │   ├── rota.js         rota de estudo
    │   ├── topico.js       detalhes do tópico e editor
│   ├── trilhas.js      trilhas próprias: seletor, criar, duplicar, excluir
│   ├── carreira.js     carreira em Y, autoavaliação e editor de níveis
    │   ├── minimapas.js    minimapas por área
    │   ├── ia.js, prompts.js, biblioteca.js, projetos.js
    │   └── dados.js        backup, importação e publicação
    └── app.js              navegação entre abas e início (carregado por último)
```

**Regra da casa:** `data/` só tem conteúdo e `js/` só tem código. Para mudar o que se estuda, edite `data/`; para mudar como aparece, edite `js/` ou `css/`.

Os arquivos de `js/` compartilham funções pelo objeto `JQA.app`, e a ordem dos `<script>` no `index.html` importa: `core/` primeiro, `pages/` depois e `app.js` no fim. Não usamos módulos ES (`import`/`export`) nem `.json` porque o navegador bloqueia os dois quando o site é aberto direto do computador, sem servidor.

## Editar direto nos arquivos

**Um tópico do mapa** (`data/trilha.js`):

```js
{s:"e2", t:"Testes de API", p:"Autonomia", pr:"Essencial",
 d:"Descrição curta.",
 est:["REST: recursos e verbos", "Asserções de status e corpo"],
 tech:["Bruno","Postman","REST"],
 l:[["ServeRest","https://serverest.dev/","Leia os endpoints de usuários e login"]],
 x:"Exercício prático.",
 lab:`comandos ou dados para copiar`,
 cc:["Minha coleção roda inteira sem eu editar nada"]}
```

| Campo | Significado |
| --- | --- |
| `s` | Etapa: `e1`, `e2`, `e3`, `e4`, `e5` |
| `t` | Título (também gera o identificador usado no progresso salvo) |
| `p` | Profundidade: Conhecer, Praticar com apoio, Autonomia, Aprofundar |
| `pr` | Prioridade: Essencial, Diferencial, Diferencial forte, Escolha uma |
| `ia` | `true` para destacar como tópico de IA |
| `d` | Descrição |
| `est` | O que estudar (lista) |
| `tech` | Tecnologias e conceitos (aparecem no mapa e na busca) |
| `l` | Materiais: `[texto, endereço, o que ler nele]`; o terceiro item é opcional |
| `x` | Exercício prático |
| `lab` | Laboratório para copiar (opcional) |
| `cc` | Critérios de conclusão (lista) |

**Um minimapa** (`data/minimapas/<area>.js`): copie `seguranca.js`, troque o conteúdo e acrescente o `<script>` no `index.html`, junto dos outros minimapas.

```js
(JQA.MINIMAPAS = JQA.MINIMAPAS || []).push({
  id:"performance", t:"Performance", icon:"target",
  d:"Por que a área importa.", comeco:"Por onde começar.", carreira:"Onde a área leva.",
  ramos:[
    {k:"fund",   itens:[{t:"Percentis", tag:"Conceito", d:"Explicação.", l:[["Texto","https://...","o que ler"]]}]},
    {k:"est",    itens:[{t:"Teste de carga", tag:"Iniciante", d:"...", x:"Prática sugerida."}]},
    {k:"ferr",   itens:[{t:"k6", tag:"Carga", q:"Quando usar.", lab:`k6 run teste.js`}]},
    {k:"prat",   itens:[{t:"QuickPizza", tag:"App", d:"..."}]},
    {k:"trilha", itens:[{topico:"e3-performance-basica"}]}
  ]
});
```

Um item pode ter `filhos:[...]` (outros itens), e seus materiais (`l`) aparecem como ramos dentro dele no mapa.

Tipos de ramo: `fund` (Fundamentos), `est` (O que estudar, em ordem), `ferr` (Ferramentas), `prat` (Onde praticar) e `trilha` (tópicos da trilha, pelo id). O id de um tópico é a etapa mais o título sem acentos, por exemplo `e3-performance-basica`.

**Um item da biblioteca** (`data/biblioteca.js`):

```js
{tipo:"artigo", t:"Título", u:"https://...", e:"e3", tema:"Automação", d:"Por que vale ler."}
```

Tipos: `artigo`, `doc`, `pratica`, `repo`, `curso`, `canal`, `roadmap`, `comunidade`. Use `pago:true` para cursos pagos e `e:"todas"` para itens que servem a qualquer etapa.

**Um prompt** (`data/prompts/<grupo>.js`): cada campo de texto tem a versão em inglês com o sufixo `_en`.

```js
{id:"meu-prompt", c:"Categoria", n:"Iniciante",
 t:"Título", d:"Descrição curta.", quando:"Quando usar.",
 obj:"Você é ... Objetivo: ...",
 antes:["Pergunta que a IA faz se faltar informação"],
 passos:["Primeiro passo", "Segundo passo"],
 ex:`Entrada e trecho da saída esperada`,
 saida:["Formato da resposta"],
 check:["O que a IA confere antes de responder"],
 rev:"O que revisar na resposta."}
```

A página monta o texto completo a partir dessas seções.

**Um item da biblioteca** (`data/biblioteca.js`):

```js
{tipo:"artigo", t:"Título", u:"https://...", e:"e3", tema:"Automação", d:"Por que vale ler."}
```

Tipos: `artigo`, `doc`, `pratica`, `repo`, `curso`, `canal`, `roadmap`, `comunidade`. Use `pago:true` para cursos pagos e `e:"todas"` para itens que servem a qualquer etapa.

**Um prompt** (`data/prompts/<grupo>.js`):

```js
{id:"meu-prompt", c:"Categoria", n:"Iniciante",
 t:"Título", t_en:"Title", d:"Descrição curta.", d_en:"Short description.",
 quando:"Quando usar.", quando_en:"When to use.",
 p:`Texto do prompt com {{variáveis}}`, p_en:`Prompt text with {{variables}}`,
 rev:"O que revisar na resposta.", rev_en:"What to review in the answer."}
```

## Próximas ideias

- **v0.2:** minimapas por área (Segurança, Performance, Automação, API, IA, Mobile, Dados e DevOps), cada um com tópicos, ferramentas e o que estudar

- Aba Ferramentas: catálogo por tipo de teste, com quando usar cada uma
- Aba Dicas: carreira, entrevistas e currículo
- Aba Glossário: termos de QA em linguagem simples
- Edição das abas IA no dia a dia e Projetos
- Busca global (Ctrl+K) em todas as abas

## Licença

Código sob licença MIT. Veja `LICENSE`.
