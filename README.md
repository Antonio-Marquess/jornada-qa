# Jornada QA — Além do Teste

Um mapa interativo para começar e crescer em qualidade de software, com IA no dia a dia desde o primeiro passo.

**Versão 0.3** · funciona direto no navegador, sem instalar nada.

## O que tem

| Aba | Conteúdo |
| --- | --- |
| Mapa | Mapa mental da trilha: 5 etapas, 70 tópicos e, dentro de cada tópico, o que estudar, tecnologias e materiais. Ramos abrem e fecham, duplo clique foca |
| Rota de estudo | A mesma trilha em sequência, com checklist e prévia das anotações |
| Minimapas | Um mapa mental por área (Segurança e, em breve, outras) com fundamentos, o que estudar, ferramentas, onde praticar e os tópicos da trilha ligados. Também os seus próprios mapas, criados do zero |
| IA no dia a dia | Onde a IA ajuda, MCP explicado, servidores MCP úteis para QA, agentes de teste do Playwright, regras de ouro e exercícios |
| Prompts | Biblioteca de prompts para QA, com filtro por categoria e botão de copiar |
| Biblioteca | Artigos, documentação, sites para praticar, repositórios, cursos, canais, roadmaps e comunidades, com filtros por tipo, etapa e tema |
| Projetos | Projetos guiados para o portfólio, em ordem de dificuldade |

Cada tópico abre com:

- **O que estudar:** os subtemas, em checklist
- **Materiais:** links com a indicação do que ler ou fazer em cada um
- **Pratique:** exercício com aplicação, passos e entrega; quando faz sentido, um **laboratório** pronto para copiar (comandos Docker, scripts SQL, história de exemplo, modelos)
- **Pronto quando:** critérios para saber que terminou
- **Minhas anotações**

O progresso (tópicos dominados, checklists, exercícios e projetos concluídos) e as anotações ficam salvos no navegador de cada pessoa.

## Versões

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
| Restaurar original | Descarta as edições de conteúdo deste navegador; anotações e progresso continuam |

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

Dá para abrir uma aba direto pelo endereço: `#mapa`, `#rota`, `#minimapas`, `#minimapas/seguranca`, `#ia`, `#prompts`, `#biblioteca` ou `#projetos`.

## Estrutura

```
jornada-qa/
├── index.html              estrutura da página e ordem dos scripts
├── css/styles.css          visual (claro e escuro)
├── data/                   CONTEÚDO: tudo o que se estuda, separado do código
│   ├── trilha.js           etapas e tópicos do mapa e da rota
│   ├── ia.js               aba IA no dia a dia
│   ├── prompts.js          biblioteca de prompts
│   ├── biblioteca.js       links da biblioteca e projetos
│   ├── minimapas/          um arquivo por área (seguranca.js, …)
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

**Um prompt** (`data/prompts.js`):

```js
{c:"Categoria", t:"Título", quando:"Quando usar.", p:`Texto do prompt`}
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
